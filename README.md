# Liquality Swap <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />


[![Build Status](https://travis-ci.com/liquality/liquality-swap.svg?branch=master)](https://travis-ci.com/liquality/liquality-swap)
[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./LICENSE.md)
[![ChainAbstractionLayer](https://img.shields.io/npm/dt/@liquality/chainabstractionlayer.svg)](https://npmjs.com/package/@liquality/chainabstractionlayer)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality)

Trustless swaps application

## How to run

### Requirements

- Git
- Node.Js

Steps:

```
git clone https://github.com/liquality/liquality-swap.git
cd liquality-swap
npm install
```

Update the configuration file at `config.js` ([config.js](src/config/config.js)) with your preferred network and nodes. An example mainnet configuration is available here [liquality.io.mainnet.config.js](configs/liquality.io.mainnet.config.js). For maximum security, use your own nodes!

Now run the app:

`npm start`


## Development

### Run locally

> U2F (`@ledgerhq/hw-transport-u2f`) requires HTTPS.

```bash
npm install
npm start
```

### Build for production

```bash
npm run build
```


## License

MIT
