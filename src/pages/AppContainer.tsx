import React from 'react'

import { HashRouter } from 'react-router-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from '../constants'
import getLibrary from '../utils/getLibrary'

import { WalletProvider, NetworkInfo } from '@terra-money/wallet-provider'
import { Updaters } from '../state/updaters'
import App from './App';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
}

export default function AppContainer() {
  return (<WalletProvider
    defaultNetwork={mainnet}
    walletConnectChainIds={walletConnectChainIds}
  >
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Updaters />
        <HashRouter>
          <App />
        </HashRouter>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </WalletProvider>)
}