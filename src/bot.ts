/* eslint-disable no-console */
import { MqttClient } from 'mqtt';
import { stateChangeRequestCommand } from './commands/state-change-request';
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import {
  createMatrixClient,
  sendBotReply,
  sendMessageToAllJoinedRooms,
} from './matrix-bot';
import { createMqttClient } from './mqtt';
import {
  ControllerParameters,
  PUB_OUT_NOTIFY,
  PUB_OUT_JSON,
  STATE_CHANGE,
} from './opengarage';
import { Settings } from './settings';
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
  let mqttClient: MqttClient;
  try {
    mqttClient = createMqttClient(settings);
  } catch (e) {
    throw createError('Something went wrong authenticating with MQTT');
  }

  // Setup MQTT pubs/subs
  let lastOutJSON: ControllerParameters | undefined;
  const deviceTopic = settings.mqttDeviceTopic;

  mqttClient.on('connect', function () {
    [PUB_OUT_NOTIFY, PUB_OUT_JSON].forEach((topicPath) => {
      mqttClient.subscribe(deviceTopic + topicPath, function (err) {
        if (err) {
          console.error(deviceTopic + topicPath + ' sub err', err);
        }
      });
    });
  });

  mqttClient.on('message', function (topic, message) {
    if (topic === deviceTopic + PUB_OUT_NOTIFY) {
      sendMessageToAllJoinedRooms(
        botClient,
        'Notify: ' + message.toString()
      ).catch((err) => {
        if (err) {
          console.error(deviceTopic + PUB_OUT_NOTIFY + ' message err', err);
        }
      });
    }

    if (topic === deviceTopic + PUB_OUT_JSON) {
      try {
        lastOutJSON = JSON.parse(message.toString());
      } catch (e) {
        console.error(
          `A problem occured while parsing ${deviceTopic + PUB_OUT_JSON} value`,
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
      case 'click':
      case 'open':
      case 'close':
        stateChangeRequestCommand(
          settings,
          mqttClient,
          command.toLowerCase() as STATE_CHANGE,
          reply
        );
        break;
      case 'status':
        statusCommand(reply, lastOutJSON);
        break;
      default:
        helpCommand(settings, reply, command);
    }
  });
}
