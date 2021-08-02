import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/Header'
import NavList from '../components/Header/NavList'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
// import Pool from './Pool'
// import Bridge from './Bridge'
import Dashboard from './Dashboard'
import CrossChain from './CrossChain'
import Pools from './Pools'
import PoolList from './Pools/poolList'
import Bridge from './Bridge'
import CrossChainTxns from './CrossChainTxns'

import MATICfarming from './Farms/MATICfarming'
import FTMfarming from './Farms/FTMfarming'
import BSCfarming from './Farms/BSCfarming'
import FarmList from './Farms/FarmsList'

import config from '../config'

const AppWrapper = styled.div`
  // display: flex;
  // flex-flow: column;
  // align-items: flex-start;
  // overflow-x: hidden;
  width: 100%;
  height: 100%;
  width: 100vw;
  height: 100vh;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
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

const NavLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  padding-top: 70px;
  width: 320px;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  overflow: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:none;
  `}
`
const NavBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  bottom: 0;
  padding-top: 0px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  overflow: auto;
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
  max-width: 1440px;
  height: 100%;
  height: 100vh;
  padding-top: 70px;
  padding-left: 320px;
  position: relative;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
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
  return (
    <Suspense fallback={null}>
      {/* <Route component={GoogleAnalyticsReporter} /> */}
      {/* <Route component={DarkModeQueryParamReader} /> */}
      <AppWrapper>
        {/* <URLWarning /> */}
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <NavLeft>
            <NavList />
          </NavLeft>
          <Popups />
          <Polling />
          {/* <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              {/* <Route exact strict path="/bridge" component={Bridge} /> */}
              <Route exact strict path="/dashboard" component={Dashboard} />
              <Route exact strict path={config.env === 'dev' ? "/router" : "/swap"} component={CrossChain} />
              {/* <Route exact strict path="/swap" component={() => <CrossChain params={123} />} /> */}
              <Route exact strict path="/pool" component={PoolList} />
              <Route exact strict path="/pool/add" component={Pools} />
              <Route exact strict path="/farm" component={FarmList} />
              <Route exact strict path="/bridge" component={Bridge} />
              <Route exact strict path={config.env === 'dev' ? "/swap" : "/swap1"} component={CrossChainTxns} />

              <Route exact strict path="/farm/matic" component={MATICfarming} />

              <Route exact strict path="/farm/ftm" component={FTMfarming} />

              <Route exact strict path="/farm/bsc" component={BSCfarming} />

              
              <Redirect to={{ pathname: config.getCurConfigInfo().isOpenRouter ? '/swap' : '/bridge' }} /> 
              {/* <Route component={RedirectPathToSwapOnly} /> */}
            </Switch>
          </Web3ReactManager>
          <Marginer />
          <NavBottom>
            <NavList />
          </NavBottom>
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
