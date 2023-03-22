import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
// import NavList from '../components/Header/NavList'
import NavList from '../components/Header/NavListTop'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import TxnsDtilsModal from '../components/CrossChainPanelV2/txnsDtilsModal'
import TxnsErrorTipModal from '../components/CrossChainPanelV2/txnsErrorTipModal'
// import Pool from './Pool'
// import Bridge from './Bridge'
// import Dashboard from './Dashboard'

// import CrossChain from './CrossChain'
// import Bridge from './Bridge'
import Lazyload from '../components/Lazyload/Lazyload'

import MergeCrossChainV2 from './MergeCrossChainV2'
import Pools from './Pools'
const PoolList = Lazyload(() => import('./Pools/poolList'))
// import PoolList from './Pools/poolList'
// import CrossChainTxns from './CrossChainTxns'
import CrossNFT from './CroseNFT'
const SwapMULTI = Lazyload(() => import('./SwapMULTI'))
// import SwapMULTI from './SwapMULTI'
const Vest = Lazyload(() => import('./Vest'))
// import Vest from './Vest'
import CreateLock from './Vest/create'
import MangerVest from './Vest/manger'
// import Vemulti from './Vemulti'
import TestWarpper from './Test'

import ANYFarming from './Farms/ANYFarming'
import NoanyFarming from './Farms/NoanyFarming'
// import ETHtestfarming from './Farms/ETH_test_farming'
import FarmList from './Farms/FarmsList'

import HistoryList from './History'
// import HistoryDetails from './History/details'
// import NonApprove from '../components/NonApprove'
import QueryNonApprove from '../components/NonApprove/queryIsNeedNonApprove'

// import GasSwap from '../components/GasSwap'

import config from '../config'
import farmlist from '../config/farmlist'

// import '../hooks/xrp'

// console.log(Sdk)
const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  flex-wrap: wrap;
  width: 100%;
  // justify-content: space-between;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
`

// const NavLeft = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   padding-top: 70px;
//   width: 320px;
//   box-shadow: ${({ theme }) => theme.contentShadow};
//   background: ${({ theme }) => theme.contentBg};
//   overflow: auto;
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     display:none;
//   `}
// `
const NavBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  bottom: 0;
  padding-top: 0px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  // overflow: auto;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:block;
    z-index: 9;
  `}
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  height: 100%;
  padding-top: 70px;
  position: relative;
  align-items: center;
  flex: 1;
  z-index: 10;
  margin: auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  let initUrl = '/router'
  if (config.getCurConfigInfo().isOpenRouter) {
    initUrl = '/v1/router'
  } else if (config.getCurConfigInfo().isOpenBridge) {
    initUrl = '/bridge'
  } else if (config.getCurConfigInfo().isOpenMerge) {
    initUrl = '/router'
  }
  return (
    <Suspense fallback={null}>
      {/* <Route component={GoogleAnalyticsReporter} /> */}
      {/* <Route component={DarkModeQueryParamReader} /> */}
      <AppWrapper>
        <HeaderWrapper>
          <URLWarning />
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          {/* <NavLeft>
            <NavList />
          </NavLeft> */}
          <Popups />
          <Polling />
          <TxnsDtilsModal />
          <TxnsErrorTipModal />
          {/* <NonApprove /> */}
          {/* <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              {/* <Route exact strict path="/dashboard" component={() => <Dashboard />} /> */}
              <Route exact strict path="/pool" component={() => <PoolList duration={0} />} />
              <Route exact strict path="/pool/add" component={() => <Pools />} />
              <Route exact strict path="/farm" component={() => <FarmList />} />
              <Route exact strict path="/nft" component={() => <CrossNFT />} />
              <Route exact strict path="/test" component={() => <TestWarpper />} />
              {/* <Route exact strict path="/cross-chain-txns" component={() => <CrossChainTxns />} /> */}
              {/* <Route exact strict path="/bridge" component={() => <Bridge />} /> */}
              <Route exact strict path="/multi" component={() => <SwapMULTI duration={0} />} />
              <Route exact strict path="/history" component={() => <HistoryList />} />
              {/* <Route exact strict path="/history/details" component={() => <HistoryDetails />} /> */}
              <Route exact strict path="/approvals" component={() => <QueryNonApprove />} />
              <Route exact strict path="/vest" component={() => <Vest duration={0} />} />
              <Route exact strict path="/vest/create" component={() => <CreateLock />} />
              <Route exact strict path="/vest/manger" component={() => <MangerVest />} />
              {/* <Route exact strict path="/gasswap" component={() => <GasSwap />} /> */}
              {/* <Route exact strict path="/vest/veshare" component={() => <Vemulti />} /> */}
              {/* <Route exact strict path={config.getCurConfigInfo().isOpenBridge ? "/v1/router" : "/swap"} component={() => <CrossChain />} /> */}

              <Route path={['/router']} component={() => <MergeCrossChainV2 />} />
              {
                Object.keys(farmlist).map((key, index) => {
                  if (farmlist[key].farmtype === 'noany') {
                    return (
                      <Route exact strict path={'/' + farmlist[key].url} component={() => <NoanyFarming farmkey={key} />} key={index} />
                    )
                  }
                  return (
                    <Route exact strict path={'/' + farmlist[key].url} component={() => <ANYFarming farmkey={key} />} key={index} />
                  )
                })
              }
              <Redirect to={{ pathname: initUrl }} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
          <NavBottom>
            <NavList position="bottom" />
          </NavBottom>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
