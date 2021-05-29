# matrix-opengarage-bot

Talk to your garage.

Send commands to your [OpenGarage](https://opengarage.io/) device via [Matrix](https://matrix.org/) using a client like [Element](https://element.io/)

```
Human: !og status
Bot: OpenGarage Status:
  - Closed
  - Vehicle Detected
  - Distance: 140 cm

Human: !og click
Bot: Issued click command OpenGarage to My OpenGarage

Bot: Notify: My OpenGarage just OPENED!
```

## Pre-requisites (other than a matrix server)

- A modern version of Node.js
- A MQTT broker
- A OpenGarage device configured to publish/subscribe to the above MQTT broker on a given topic (defaults to the device's name if not configured)

The bot will talk to the MQTT broker to interact with the OpenGarage device. Therefore no OpenGarage credentials are required.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

Running as a background process via pm2:

```
# clone this repo and cd inside of it

yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

Programatically with javascript/typescript:

```
yarn add matrix-opengarage-bot
```

```
import { startBot } from 'matrix-opengarage-bot';

const config = {
  // see bot-config.sample.json
};

startBot(config);
```

## Config

See [settings.ts](./src/settings.ts) for config descriptions

## References

### OpenGarage

MQTT notifications are turned on/off via the OpenGarage web ui or mobile app.

https://github.com/OpenGarage/OpenGarage-Firmware/tree/master/docs

### MQTT

[List of MQTT brokers](https://en.wikipedia.org/wiki/Comparison_of_MQTT_implementations)

## Notes

This bot is not specific to the OpenGarage device, if another device published/subscribed to the [same topics](./src/settings.ts) on MQTT it'd work too.
