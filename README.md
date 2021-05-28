# matrix-opengarage-bot

Talk to your garage.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

```
# clone repo
yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

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

You must have a MQTT broker setup with OpenGarage for this bot to talk to.

See [settings.ts](./src/settings.ts) for config descriptions
