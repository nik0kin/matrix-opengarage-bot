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
  mqttClient.publish(settings.mqttTopic + SUB_IN_STATE, 'click');
  const message =
    `Issued **${state}** command OpenGarage to ` + settings.mqttTopic;
  reply(message, marked(message));
}
