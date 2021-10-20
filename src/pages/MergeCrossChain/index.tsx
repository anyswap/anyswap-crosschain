import React from 'react'

import { useTranslation } from 'react-i18next'

import Title from '../../components/Title'
import CrossChainPanel from '../../components/CrossChainPanel/crossChainEVM'

import AppBody from '../AppBody'
const BRIDGETYPE = 'mergeTokenList'

export default function CrossChain() {
  const { t } = useTranslation()
  return (
    <>
      <AppBody>
        <Title
          title={t('swap')}
          
          isNavLink={true}
          tabList={[
            {
              name: t('swap'),
              path: '/mergeswap',
              regex: /\/mergeswap/,
              iconUrl: require('../../assets/images/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
            },
            {
              name: t('pool'),
              path: '/pool',
              regex: /\/pool/,
              iconUrl: require('../../assets/images/icon/pool.svg'),
              iconActiveUrl: require('../../assets/images/icon/pool-purpl.svg')
            }
          ]}
        ></Title>
        <CrossChainPanel bridgeKey={BRIDGETYPE} />
      </AppBody>
    </>
  )
}