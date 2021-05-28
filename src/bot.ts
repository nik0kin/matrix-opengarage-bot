/* eslint-disable no-console */
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import { createMatrixClient, sendBotReply } from './matrix-bot';
import { createMqttClient } from './mqtt';
import { ControllerParameters, PUB_OUT_JSON } from './mygarage';
import { Settings } from './settings';
import { MqttClient } from 'mqtt';
import { createError } from './error';

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: Required<Settings> = {
    storageFile: 'bot-storage.json',
    promptWords: ['!opengarage', '!og'],
    autoJoin: false,
    ...userSettings,
  };
  settings.promptWords = settings.promptWords.map((w) => w.toLowerCase());

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  // Connect to MQTT
  let client: MqttClient;
  try {
    client = createMqttClient(settings);
  } catch (e) {
    throw createError('Something went wrong authenticating with MQTT');
  }

  // Setup MQTT pubs/subs
  let lastOutJSON: ControllerParameters | undefined;

  client.on('connect', function () {
    client.subscribe(settings.mqttTopic + PUB_OUT_JSON, function (err) {
      if (err) {
        console.error('err', err);
      }
    });
  });

  client.on('message', function (topic, message) {
    if (topic === settings.mqttTopic + PUB_OUT_JSON) {
      try {
        lastOutJSON = JSON.parse(message.toString());
      } catch (e) {
        console.error(
          `A problem occured while parsing ${
            settings.mqttTopic + PUB_OUT_JSON
          } value`,
          e
        );
      }
    }
  });

  console.log('OpenGarage bot online');

  botClient.on('room.message', async function (roomId, event) {
    if (event.sender === (await botClient.getUserId())) return;
    if (!event.content || !event.content.body) return;

    const reply = (message: string, formattedMessage?: string) =>
      sendBotReply(
        botClient,
        roomId,
        {
          sender: event.sender,
          message: event.content.body,
        },
        message,
        formattedMessage
      );

    const tokens = (event.content.body as string).split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt.toLowerCase())) return;

    // check command
    const [command, arg1, arg2] = (commandToken || '').split(':');

    switch (command.toLowerCase()) {
      case 'help':
        helpCommand(settings, reply);
        break;
      case 'status':
        statusCommand(reply, lastOutJSON);
        break;
      default:
        helpCommand(settings, reply, command);
    }
  });
}
