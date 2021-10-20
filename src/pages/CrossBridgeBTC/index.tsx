import React from 'react'
import { useTranslation } from 'react-i18next'

import CrossChainPanel from '../../components/CrossChainPanel/crossChainBTC'
import Title from '../../components/Title'

import AppBody from '../AppBody'


const BRIDGETYPE = 'mergeTokenList'

export default function CrossBridgeBTC () {

  const { t } = useTranslation()
  return (
    <>
      
      <AppBody>
        <Title
          title={t('bridge')}
        ></Title>
        <CrossChainPanel bridgeKey={BRIDGETYPE} />
      </AppBody>
    </>
  )
}