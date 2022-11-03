import React, { Suspense } from 'react'
// import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom'
// import { Switch, Route } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'

import CrossChainPanel from './CrossChainPanelV2'
// import Title from '../../components/Title'
import CrossChainTitle from '../CrossChainTitle'
// import {
//   useExpertModeManager,
// } from '../../state/user/hooks'

import AppBody from './AppBody'

const BRIDGETYPE = 'mergeTokenList'

export default function CrossChainBox() {
  // const { t } = useTranslation()
  // const [expertMode] = useExpertModeManager()

  return (
    <>
      <AppBody>
        <CrossChainTitle />

        <Suspense fallback={null}>
          <Switch>
            {/* <Route exact strict path="/crossChainGas" component={() => <CrossChainPanel bridgeKey={BRIDGETYPE} />} /> */}
            {/* <Redirect to="/router" /> */}
          </Switch>
        </Suspense>
      </AppBody>
    </>
  )
}
