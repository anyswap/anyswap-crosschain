import React, { Suspense, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import Header from '../components/Header'
import NavList from '../components/Header/NavList'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import URLWarning from '../components/Header/URLWarning'
// import Pool from './Pool'
// import Bridge from './Bridge'
import Dashboard from './Dashboard'
import CrossChain from './CrossChain'
// import Bridge from './Bridge'
// import MergeCrossChain from './MergeCrossChain'
import MergeCrossChainV2 from './MergeCrossChainV2'
import Pools from './Pools'
import PoolList from './Pools/poolList'
import CrossChainTxns from './CrossChainTxns'
// import CrossNFT from './CroseNFT'

// import ANYFarming from './Farms/ANYFarming'
// import NoanyFarming from './Farms/NoanyFarming'
// import ETHtestfarming from './Farms/ETH_test_farming'
// import FarmList from './Farms/FarmsList'

import NonApprove from '../components/NonApprove'
import QueryNonApprove from '../components/NonApprove/queryIsNeedNonApprove'
import Footer from '../components/Footer'
import config from '../config'
import { retrieveAppData } from '../state/application/actions'
import useAppData from '../hooks/useAppData'
// import farmlist from '../config/farmlist'

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  width: 100vw;
  height: 100vh;
  position: relative;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.contentShadow};
  background: ${({ theme }) => theme.contentBg};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
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
  position: relative;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  margin: 0 auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  const dispatch = useDispatch()

  let initUrl = '/dashboard'
  if (config.getCurConfigInfo().isOpenRouter) {
    initUrl = '/router'
  } else if (config.getCurConfigInfo().isOpenBridge) {
    initUrl = '/bridge'
  } else if (config.getCurConfigInfo().isOpenMerge) {
    initUrl = '/v2/mergeswap'
  }

  const { data, isLoading } = useAppData()

  useEffect(() => {
    dispatch(retrieveAppData(data ? { ...data } : data))
  }, [data, isLoading, dispatch])

  return (
    <Suspense fallback={null}>
      <AppWrapper>
        <HeaderWrapper>
          <URLWarning />
          <Header />
        </HeaderWrapper>

        <BodyWrapper>
          <Popups />
          <NonApprove />
          {/* <TopLevelModals /> */}

          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/dashboard" component={() => <Dashboard />} />
              <Route path={['/v2/mergeswap']} component={() => <MergeCrossChainV2 />} />
              <Route exact strict path="/pool" component={() => <PoolList />} />
              <Route exact strict path="/pool/add" component={() => <Pools />} />
              <Route exact strict path="/cross-chain-txns" component={() => <CrossChainTxns />} />
              <Route exact strict path="/approvals" component={() => <QueryNonApprove />} />
              <Route
                exact
                strict
                path={config.getCurConfigInfo().isOpenBridge ? '/router' : '/swap'}
                component={() => <CrossChain />}
              />
              {/* <Route exact strict path="/farm" component={() => <FarmList />} /> */}
              {/* <Route exact strict path="/nft" component={() => <CrossNFT />} /> */}
              {/* <Route exact strict path="/bridge" component={() => <Bridge />} /> */}
              {/* <Route
                path={['/cross-chain-router', '/cross-chain-bridge', '/mergeswap']}
                component={() => <MergeCrossChain />}
              /> */}
              {/* {Object.keys(farmlist).map((key, index) => {
                if (farmlist[key].farmtype === 'noany') {
                  return (
                    <Route
                      exact
                      strict
                      path={'/' + farmlist[key].url}
                      component={() => <NoanyFarming farmkey={key} />}
                      key={index}
                    />
                  )
                }
                return (
                  <Route
                    exact
                    strict
                    path={'/' + farmlist[key].url}
                    component={() => <ANYFarming farmkey={key} />}
                    key={index}
                  />
                )
              })} */}

              <Redirect to={{ pathname: initUrl }} />
            </Switch>
          </Web3ReactManager>
          <NavBottom>
            <NavList />
          </NavBottom>
        </BodyWrapper>

        <Footer />
      </AppWrapper>
    </Suspense>
  )
}
