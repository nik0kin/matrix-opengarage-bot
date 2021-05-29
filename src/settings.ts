export interface Settings {
  //// SETUP ////

  /**
   * Matrix Homeserver
   *  Eg. "https://matrix-federation.matrix.org"
   */
  homeserverUrl: string;
  /**
   * Access Token of the bot account
   *   See https://t2bot.io/docs/access_tokens/ for a simple way to generate
   */
  matrixAccessToken: string;
  /**
   * MQTT broker server url
   *  Passed as a parameter to https://github.com/mqttjs/MQTT.js/blob/master/README.md#mqttconnecturl-options
   *  Eg. "mqtt://127.0.0.1" or "mqtt://your-domain.example.com:3130"
   */
  mqttBroker: string;
  /**
   * MQTT broker topic that your OpenGarage device is sub/pub-ing too
   *  Eg. "My OpenGarage"
   */
  mqttDeviceTopic: string;
  /**
   * MQTT broker username
   */
  mqttUsername: string | undefined;
  /**
   * MQTT broker password
   */
  mqttPassword: string | undefined;
  /**
   * File used as temporary storage by the bot
   *   Optional. Eg. `bot-storage.json`
   */
  storageFile?: string;

  //// OPERATIONS ////

  /**
   * Words to prompt the bot to respond.
   *   Defaults to `'!opengarage', '!og'`
   */
  promptWords?: string[];

  /**
   * Should the bot auto accept invites to rooms?
   *    (Probably not if you want your garage door access private)
   *   Defaults to `false`
   */
  autoJoin?: boolean;
}
