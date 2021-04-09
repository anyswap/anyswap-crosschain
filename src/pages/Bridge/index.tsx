import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import Title from '../../components/Title'

// import CrossChain from '../CrossChain'
// import SwapNative from '../SwapNative'

export default function Bridge() {
  const { t } = useTranslation()

  const [bridgeTypeName, setBridgeTypeName] = useState(t('bridgeAssets'))
  return (
    <>
      <AppBody>
        <Title
          title={t('bridgeAssets')}
          tabList={[
            {
              name: t('bridgeAssets'),
              onTabClick: name => {
                setBridgeTypeName(name)
              },
              iconUrl: require('../../assets/images/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
            },
            {
              name: t('swapNative'),
              onTabClick: name => {
                setBridgeTypeName(name)
              },
              iconUrl: require('../../assets/images/icon/swap-purple.svg'),
              iconActiveUrl: require('../../assets/images/icon/swap-white.svg')
            },
            {
              name: t('bridgeTxns'),
              onTabClick: name => {
                setBridgeTypeName(name)
              },
              iconUrl: require('../../assets/images/icon/withdraw.svg'),
              iconActiveUrl: require('../../assets/images/icon/withdraw-purple.svg')
            }
          ]}
        ></Title>
        {/* {
          bridgeTypeName === t('bridgeAssets') ? <CrossChain /> : 
          (
            bridgeTypeName === t('swapNative') ? <SwapNative /> : ''
          )
        } */}
        {bridgeTypeName}
      </AppBody>
    </>
  )
}