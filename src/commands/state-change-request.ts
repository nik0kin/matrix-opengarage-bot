import marked from 'marked';
import { MqttClient } from 'mqtt';
import { SUB_IN_STATE, STATE_CHANGE } from '../opengarage';
import { Settings } from '../settings';

export async function stateChangeRequestCommand(
  settings: Settings,
  mqttClient: MqttClient,
  state: STATE_CHANGE,
  reply: (message: string, formattedMessage?: string) => void
) {
  mqttClient.publish(
    settings.mqttDeviceTopic + SUB_IN_STATE,
    'click',
    (error) => {
      if (error) {
        console.error(`${state} command failed to publish`, error);
      }
    }
  );
  const message =
    `Issued **${state}** command OpenGarage to ` + settings.mqttDeviceTopic;
  reply(message, marked(message));
}
