// import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'inter-ui'
import React, { StrictMode } from 'react'
// import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import { HashRouter } from 'react-router-dom'
// import { NetworkContextName } from './constants'
import './i18n'
// import App from './pages/App'
import AppContainer from './pages/AppContainer'
import store from './state'
// import ApplicationUpdater from './state/application/updater'
// import ListsUpdater from './state/lists/updater'
// import MulticallUpdater from './state/multicall/updater'
// import TransactionUpdater from './state/transactions/updater'
// import UserUpdater from './state/user/updater'
// import PoolsUpdater from './state/pools/updater'
// import WalletUpdater from './state/wallet/updater'
// import RpcUpdater from './state/rpc/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle, ThemeGlobalClassName } from './theme'
// import getLibrary from './utils/getLibrary'

// import { WalletProvider, NetworkInfo } from '@terra-money/wallet-provider'

// const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// if ('ethereum' in window) {
//   ;(window.ethereum as any).autoRefreshOnNetworkChange = false
// }

// const mainnet = {
//   name: 'mainnet',
//   chainID: 'columbus-4',
//   lcd: 'https://lcd.terra.dev',
// };

// const testnet = {
//   name: 'testnet',
//   chainID: 'tequila-0004',
//   lcd: 'https://tequila-lcd.terra.dev',
// };

// const walletConnectChainIds: Record<number, NetworkInfo> = {
//   0: testnet,
//   1: mainnet,
// }

// function Updaters() {
//   return (
//     <>
//       <ListsUpdater />
//       <UserUpdater />
//       <PoolsUpdater />
//       <ApplicationUpdater />
//       <TransactionUpdater />
//       <MulticallUpdater />
//       <WalletUpdater />
//       <RpcUpdater />
//       <MulticallUpdater type={1}/>
//     </>
//   )
// }

// ReactDOM.render(
//   <StrictMode>
//     <FixedGlobalStyle />
//     <WalletProvider
//       defaultNetwork={mainnet}
//       walletConnectChainIds={walletConnectChainIds}
//     >
//       <Web3ReactProvider getLibrary={getLibrary}>
//         <Web3ProviderNetwork getLibrary={getLibrary}>
//           <Provider store={store}>
//             <ThemeProvider>
//               <ThemedGlobalStyle />
//               <HashRouter>
//                 <App />
//               </HashRouter>
//             </ThemeProvider>
//             <Updaters />
//           </Provider>
//         </Web3ProviderNetwork>
//       </Web3ReactProvider>
//     </WalletProvider>
//   </StrictMode>,
//   document.getElementById('root')
// )

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <FixedGlobalStyle />
      <ThemeProvider>
        <ThemeGlobalClassName />
        <ThemedGlobalStyle />
        <AppContainer />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
