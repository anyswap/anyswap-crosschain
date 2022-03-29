import React, { Suspense, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import NavList from '../components/Header/NavList'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import URLWarning from '../components/Header/URLWarning'
import Dashboard from './Dashboard'
import MergeCrossChainV2 from './MergeCrossChainV2'
import Pools from './Pools'
import PoolList from './Pools/poolList'
import CrossChainTxns from './CrossChainTxns'
import Settings from './Settings'
import Loader from '../components/Loader'
import NonApprove from '../components/NonApprove'
import QueryNonApprove from '../components/NonApprove/queryIsNeedNonApprove'
import Footer from '../components/Footer'
import config from '../config'
import { retrieveAppData } from '../state/application/actions'
import { AppState } from '../state'
import useAppData from '../hooks/useAppData'

const LoaderWrapper = styled.div`
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg1};
`

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
  position: sticky;
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
    if (data) dispatch(retrieveAppData(data))
  }, [data, isLoading, dispatch])

  const appManagement = useSelector((state: AppState) => state.application.appManagement)
  const projectName = useSelector((state: AppState) => state.application.projectName)

  return (
    <HelmetProvider>
      <Helmet>
        <title>{projectName || document.title}</title>
      </Helmet>

      <Suspense fallback={null}>
        {isLoading ? (
          <LoaderWrapper>
            <Loader size="2.8rem" />
          </LoaderWrapper>
        ) : (
          <AppWrapper>
            <HeaderWrapper>
              <URLWarning />
              <Header />
            </HeaderWrapper>

            <BodyWrapper>
              <Popups />
              <NonApprove />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/dashboard" component={Dashboard} />
                  <Route path="/v2/mergeswap" component={MergeCrossChainV2} />
                  <Route exact strict path="/pool" component={PoolList} />
                  <Route exact strict path="/pool/add" component={Pools} />
                  <Route exact strict path="/cross-chain-txns" component={CrossChainTxns} />
                  <Route exact strict path="/approvals" component={QueryNonApprove} />
                  <Route
                    path="/settings"
                    component={({ match }: { match: { path: string } }) =>
                      appManagement || match.path === '/settings' ? <Settings /> : null
                    }
                  />
                  <Redirect to={{ pathname: initUrl }} />
                </Switch>
              </Web3ReactManager>
            </BodyWrapper>

            <Footer />
            <NavBottom>
              <NavList />
            </NavBottom>
          </AppWrapper>
        )}
      </Suspense>
    </HelmetProvider>
  )
}
