import marked from 'marked';
import { getStatusString } from '../message-formatter';
import { ControllerParameters } from '../opengarage';

export async function statusCommand(
  reply: (message: string, formattedMessage?: string) => void,
  statusJSON?: ControllerParameters
) {
  if (!statusJSON) {
    return reply('Missing sensor data');
  }

  const message = getStatusString(statusJSON);
  reply(message, marked(message));
}
