// import React, { useMemo } from 'react'
import React from 'react'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'

import Title from '../Title'

// import {
//   useExpertModeManager,
//   useUserSelectChainId
// } from '../../state/user/hooks'
const TitleBox = styled.div`
  display: block;
  width:100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:none;
  `}
`

export default function CrossChain() {
  // const { t } = useTranslation()
  // const [expertMode] = useExpertModeManager()
  // const [selectNetworkInfo] = useUserSelectChainId()

  // const TitleTabList = useMemo(() => {
  //   const poolObj = {
  //     name: t('pool'),
  //     path: '/pool',
  //     regex: /\/pool/,
  //     iconUrl: require('../../assets/images/icon/pool.svg'),
  //     iconActiveUrl: require('../../assets/images/icon/pool-purpl.svg')
  //   }
  //   let arr = []
  //   if (expertMode) {
  //     arr = [
  //       {
  //         name: t('router'),
  //         path: '/router',
  //         regex: /\/router/,
  //         iconUrl: require('../../assets/images/icon/deposit.svg'),
  //         iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
  //       },
  //       {
  //         name: t('bridge'),
  //         path: '/bridge',
  //         regex: /\/bridge/,
  //         iconUrl: require('../../assets/images/icon/deposit.svg'),
  //         iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
  //       }
  //     ]
  //   } else {
  //     arr =  [
  //       {
  //         name: t('bridge'),
  //         path: '/v2/mergeswap',
  //         // regex: /[\/mergeswap | \/bridge]/,
  //         regex: /\/v2\/mergeswap/,
  //         iconUrl: require('../../assets/images/icon/deposit.svg'),
  //         iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
  //       }
  //     ]
  //   }
  //   // if (!selectNetworkInfo?.chainId) {
  //   //   arr.push(poolObj)
  //   // }
  //   arr.push(poolObj)
  //   // return arr
  //   return []
  // }, [expertMode, selectNetworkInfo])

  return (
    <TitleBox>
      <Title
        title={''}
      >
      </Title>
    </TitleBox>
  )
}