import React, { Suspense } from 'react'
// import styled from 'styled-components'
import { Switch, Route, Redirect } from 'react-router-dom'
// import { Switch, Route } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
import { BRIDGE_KEY } from '../../config/constant'
import CrossChainPanel from '../../components/CrossChainPanelV2'
// import Title from '../../components/Title'
// import {
//   useExpertModeManager,
// } from '../../state/user/hooks'

import AppBody from '../AppBody'

export default function CrossChainBox() {
  // const { t } = useTranslation()
  // const [expertMode] = useExpertModeManager()

  return (
    <>
      <AppBody>
        {/* <Title
          title={t('router')}
          isNavLink={true}
          tabList={[
            {
              name: t('router'),
              path: '/v2/mergeswap',
              regex: /\/v2\/mergeswap/,
              iconUrl: require('../../assets/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/icon/deposit-purple.svg')
            },
            {
              name: t('pool'),
              path: '/pool',
              regex: /\/pool/,
              iconUrl: require('../../assets/icon/pool.svg'),
              iconActiveUrl: require('../../assets/icon/pool-purpl.svg')
            }
          ]}
        >
        </Title> */}

        <Suspense fallback={null}>
          <Switch>
            <Route
              exact
              strict
              path="/v2/mergeswap"
              component={() => <CrossChainPanel bridgeKey={BRIDGE_KEY.mergeTokenList} />}
            />
            <Redirect to="/v2/mergeswap" />
          </Switch>
        </Suspense>
      </AppBody>
    </>
  )
}
