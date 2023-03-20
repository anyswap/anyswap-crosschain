import React from 'react'

import { HashRouter } from 'react-router-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from '../constants'
import getLibrary from '../utils/getLibrary'

import {
  WalletProvider,
  // NetworkInfo
} from '@terra-money/wallet-provider'

// import { ConnectionProvider, WalletProvider as SolWalletProvider } from '@solana/wallet-adapter-react';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// // import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
// // import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
// import {
//     WalletModalProvider,
//     WalletDisconnectButton,
//     WalletMultiButton
// } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
import { WalletSelectorContextProvider } from "../nonevm/near/WalletSelectorContext"

import { Updaters } from '../state/updaters'
import App from './App';

import "@near-wallet-selector/modal-ui/styles.css"
import "@near-wallet-selector/account-export/styles.css"
// require('@solana/wallet-adapter-react-ui/styles.css')

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// if ('ethereum' in window) {
//   ;(window.ethereum as any).autoRefreshOnNetworkChange = false
// }

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

const walletConnectChainIds: Record<number, any> = {
  0: testnet,
  1: mainnet,
}

export default function AppContainer() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // const network = WalletAdapterNetwork.Devnet;
  // const network = WalletAdapterNetwork.Testnet;
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // const wallets:any = useMemo(
  //     () => [
  //         /**
  //          * Select the wallets you wish to support, by instantiating wallet adapters here.
  //          *
  //          * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
  //          * That package supports tree shaking and lazy loading -- only the wallets you import
  //          * will be compiled into your application, and only the dependencies of wallets that
  //          * your users connect to will be loaded.
  //          */
  //         // new UnsafeBurnerWalletAdapter(),
  //         // new PhantomWalletAdapter(),
  //     ],
  //     []
  // );

  return (<WalletProvider
    defaultNetwork={mainnet}
    walletConnectChainIds={walletConnectChainIds}
  >
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <WalletSelectorContextProvider>
          {/* <ConnectionProvider endpoint={endpoint}>
          <SolWalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <WalletMultiButton />
              <WalletDisconnectButton /> */}
              <Updaters />
              <HashRouter>
                <App />
              </HashRouter>
            {/* </WalletModalProvider>
          </SolWalletProvider>
        </ConnectionProvider> */}
        </WalletSelectorContextProvider>
        
        
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </WalletProvider>)
}