import { Settings } from './settings';

import mqtt from 'mqtt';

export function createMqttClient(settings: Settings) {
  return mqtt.connect(settings.mqttBroker, {
    username: settings.mqttUsername,
    password: settings.mqttPassword,
  });
}
