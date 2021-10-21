import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import Title from '../Title'

import {
  useExpertModeManager,
  useUserSelectChainId
} from '../../state/user/hooks'


export default function CrossChain() {
  const { t } = useTranslation()
  const [expertMode] = useExpertModeManager()
  const [selectNetworkInfo] = useUserSelectChainId()

  const TitleTabList = useMemo(() => {
    const poolObj = {
      name: t('pool'),
      path: '/pool',
      regex: /\/pool/,
      iconUrl: require('../../assets/images/icon/pool.svg'),
      iconActiveUrl: require('../../assets/images/icon/pool-purpl.svg')
    }
    let arr = []
    if (expertMode) {
      arr = [
        {
          name: t('router'),
          path: '/router',
          regex: /\/router/,
          iconUrl: require('../../assets/images/icon/deposit.svg'),
          iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
        },
        {
          name: t('bridge'),
          path: '/bridge',
          regex: /\/bridge/,
          iconUrl: require('../../assets/images/icon/deposit.svg'),
          iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
        }
      ]
    } else {
      arr =  [
        {
          name: t('bridge'),
          path: '/mergeswap',
          // regex: /[\/mergeswap | \/bridge]/,
          regex: /\/mergeswap/,
          iconUrl: require('../../assets/images/icon/deposit.svg'),
          iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
        }
      ]
    }
    if (!selectNetworkInfo?.chainId) {
      arr.push(poolObj)
    }
    return arr
  }, [expertMode, selectNetworkInfo])

  return (
    <>
      <Title
        title={t('bridge')}
        
        isNavLink={true}
        tabList={TitleTabList}
      >
      </Title>
    </>
  )
}