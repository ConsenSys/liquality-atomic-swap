import config from '../config'
import metamaskIcon from '../icons/wallets/metamask/icon.svg'
import ledgerIcon from '../icons/wallets/ledger/icon.svg'
import liqualityIcon from '../icons/wallets/liquality/icon.svg'
import nodeIcon from '../icons/wallets/node/icon.svg'

const wallets = {
  'liquality': {
    icon: liqualityIcon,
    name: 'Liquality Wallet',
    connection: {
      title: 'On Liquality Wallet',
      description: 'Look for the Liquality extension in your browser.'
    },
    troubleshootConnectionLink: 'https://liquality.io/blog/the-liquality-multi-chain-swap-wallet-cross-chain-atomic-swaps-have-never-been-so-easy/'
  },
  'bitcoin_ledger_legacy': {
    icon: ledgerIcon,
    name: 'Ledger (Legacy)',
    connection: {
      title: 'On Ledger',
      description: 'Navigate to your Bitcoin account on your Ledger device.'
    },
    troubleshootConnectionLink: 'https://support.ledger.com/hc/en-us/articles/115005195945'
  },
  'bitcoin_ledger_native_segwit': {
    icon: ledgerIcon,
    name: 'Ledger (Native Segwit)',
    connection: {
      title: 'On Ledger',
      description: 'Navigate to your Bitcoin account on your Ledger device.'
    },
    troubleshootConnectionLink: 'https://support.ledger.com/hc/en-us/articles/115005195945'
  },
  'bitcoin_node': {
    icon: nodeIcon,
    name: 'Node',
    connection: {
      title: 'On your node',
      description: 'Make sure your Bitcoin node is running and available.'
    },
    troubleshootConnectionLink: 'https://github.com/bitpay/bitcore'
  },
  'metamask': {
    icon: metamaskIcon,
    name: 'MetaMask',
    connection: {
      title: 'On MetaMask',
      description: 'Look for the MetaMask window in your browser (or a prompt to accept the MetaMask pop-up).'
    },
    troubleshootConnectionLink: 'https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-Started-With-MetaMask-Part-1-'
  },
  'ethereum_node': {
    icon: nodeIcon,
    name: 'Node',
    connection: {
      title: 'On your node',
      description: 'Make sure your Ethereum node is running and available.'
    },
    troubleshootConnectionLink: 'https://ethereum.gitbooks.io/frontier-guide/content/getting_a_client.html'
  },
  'ethereum_ledger': {
    icon: ledgerIcon,
    name: 'Ledger',
    connection: {
      title: 'On Ledger',
      description: 'Navigate to your Ethereum account on your Ledger device.'
    },
    troubleshootConnectionLink: 'https://support.ledger.com/hc/en-us/articles/115005195945'
  }
}

function getAvailableEthereumWallets (asset) {
  const wallets = ['liquality', 'metamask', 'ethereum_ledger']
  const assetConfig = config.assets[asset]
  if (!assetConfig) return []
  if (assetConfig.rpc && assetConfig.rpc.wallet) {
    wallets.push('ethereum_node')
  }
  return wallets
}

function getAvailableBitcoinWallets () {
  const wallets = ['liquality', 'bitcoin_ledger_legacy', 'bitcoin_ledger_native_segwit']
  if (config.assets.BTC.rpc && config.assets.BTC.rpc.wallet) {
    wallets.push('bitcoin_node')
  }
  return wallets
}

const walletsByAsset = {
  ETH: getAvailableEthereumWallets('ETH'),
  RBTC: getAvailableEthereumWallets('RBTC'),
  BTC: getAvailableBitcoinWallets()
}

function getAssetWallets (asset) {
  const assetConfig = config.assets[asset]
  if (assetConfig.type === 'erc20') {
    return getAvailableEthereumWallets(asset)
  }

  return walletsByAsset[asset]
}

export { wallets, getAssetWallets }
