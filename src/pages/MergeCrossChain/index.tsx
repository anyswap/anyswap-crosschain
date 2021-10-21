import React, {Suspense} from 'react'
import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'

import CrossChainTitle from '../../components/CrossChainTitle'
import CrossChainPanel from '../../components/CrossChainPanel'
import ModeSetting from '../../components/Settings/ModeSetting'

import CrossChainRouter from './router'
import CrossChainBridge from './bridge'

// import {
//   useExpertModeManager,
// } from '../../state/user/hooks'

import AppBody from '../AppBody'

const FLex = styled.div`
  ${({theme}) => theme.flexEC};
  width: 100%;
  margin-bottom: 10px;
`

const BRIDGETYPE = 'mergeTokenList'

export default function CrossChainBox() {
  // const { t } = useTranslation()
  // const [expertMode] = useExpertModeManager()

  return (
    <>
      <AppBody>
        <CrossChainTitle />
        <FLex>
          <ModeSetting />
        </FLex>
        
        <Suspense fallback={null}>
          <Switch>
            <Route exact strict path="/router" component={CrossChainRouter} />
            <Route exact strict path="/bridge" component={CrossChainBridge} />
            <Route exact strict path="/mergeswap" component={() => <CrossChainPanel bridgeKey={BRIDGETYPE} />} />
            <Redirect to="/pool" />
          </Switch>
        </Suspense>
      </AppBody>
    </>
  )
}