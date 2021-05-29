import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from 'matrix-bot-sdk';
import { Settings } from './settings';

export function createMatrixClient(settings: Required<Settings>) {
  const storage = new SimpleFsStorageProvider(settings.storageFile);
  const client = new MatrixClient(
    settings.homeserverUrl,
    settings.matrixAccessToken,
    storage
  );
  if (settings.autoJoin) {
    AutojoinRoomsMixin.setupOnClient(client);
  }
  return client;
}

export function sendBotMessage(
  botClient: MatrixClient,
  roomId: string,
  message: string,
  htmlFormattedMessage?: string
) {
  botClient.sendMessage(roomId, {
    msgtype: 'm.notice',
    body: message,
    ...(htmlFormattedMessage
      ? {
          format: 'org.matrix.custom.html',
          formatted_body: htmlFormattedMessage,
        }
      : {}),
  });
}

export async function sendMessageToAllJoinedRooms(
  client: MatrixClient,
  message: string,
  htmlFormattedMessage?: string
) {
  const rooms = await client.getJoinedRooms();
  const promises = rooms.map(async (roomId) => {
    const eventId = await client.sendMessage(roomId, {
      msgtype: 'm.text',
      body: message,
      ...(htmlFormattedMessage
        ? {
            format: 'org.matrix.custom.html',
            formatted_body: htmlFormattedMessage,
          }
        : {}),
    });
    return [roomId, eventId];
  });
  return Promise.all(promises);
}

export function sendBotReply(
  botClient: MatrixClient,
  roomId: string,
  responds: {
    sender: string;
    message: string;
  },
  message: string,
  htmlFormattedMessage?: string
) {
  botClient.sendMessage(roomId, {
    msgtype: 'm.notice',
    body: message,
    responds,
    ...(htmlFormattedMessage
      ? {
          format: 'org.matrix.custom.html',
          formatted_body: htmlFormattedMessage,
        }
      : {}),
  });
}
