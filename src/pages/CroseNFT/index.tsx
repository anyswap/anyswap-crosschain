import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ArrowRight} from 'react-feather'

import {useNFT721Callback, WrapType} from '../../hooks/useNFTCallback'
import {useApproveCallback, ApprovalState} from '../../hooks/useNFTApproveCallback'
import { useActiveWeb3React } from '../../hooks'
// import { useNFT721Contract } from '../../hooks/useContract'

import { useWalletModalToggle } from '../../state/application/hooks'

import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonConfirmed } from '../../components/Button'
import Title from '../../components/Title'
import Input from '../../components/NumericalInput'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'

import AppBody from '../AppBody'
import SelectChainIDPanel from './selectChainId'
import SelectCurrencyPanel, {TokenidLogo} from './selectCurrency'

import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {fromWei} from '../../utils/tools/tools'

import NFT_DATA from './nftdata.json'

const SUPPORT_CHAIN = ['4', '250']
const nftData = NFT_DATA as any

const FlexWrapBox = styled.div`
  ${({ theme }) => theme.flexBC};
  flex-wrap: wrap;
  width: 100%;
  max-width: 360px;
  margin:auto;
`

const FeeBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 1.25rem;
  margin-top: 0.625rem;
  color: ${({ theme }) => theme.tipColor};
`

const SelectNFTTokenLabel = 'SelectNFTTokenLabel'

function getInitToken () {
  const urlParams = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  const localParams = sessionStorage.getItem(SelectNFTTokenLabel) ? sessionStorage.getItem(SelectNFTTokenLabel) : ''
  let initBridgeToken:any = urlParams ? urlParams : localParams
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''
  if (initBridgeToken) {
    return initBridgeToken
  } else {
    return false
  }
}

export default function CroseNFT () {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  // const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectChainId, setSelectChainId] = useState<any>()
  const [inputValue, setInputValue] = useState<any>()
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectTokenId, setSelectTokenId] = useState<any>()
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // const [tokenidUri, setTokenidUri] = useState<any>()

  const initBridgeToken = getInitToken()

  // const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
  //   '0x5F69b7Ab8F7cAb199a310Fd5A27B43Fef44ddcC0',
  //   {symbol: 'NFT'},
  //   '0x9bd3fac4d9b051ef7ca9786aa0ef5a7e0558d44c',
  //   '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
  //   '7003',
  //   '250'
  // )

  const tokenList = useMemo(() => {
    if (nftData && chainId && nftData[chainId]) {
      const list = nftData[chainId]
      const urlParams = (selectCurrency && selectCurrency.chainId?.toString() === chainId?.toString() ? selectCurrency.address : (initBridgeToken ? initBridgeToken : 'Loot'))?.toLowerCase()
      let isUseToken = 0
      let useToken
      for (const t in list) {
        if (!selectCurrency && urlParams) {
          if (
            t?.toLowerCase() === urlParams
            || list[t]?.symbol?.toLowerCase() === urlParams
            || list[t]?.name?.toLowerCase() === urlParams
          ) {
            useToken = t
            break
          }
        } else if (!selectCurrency && !urlParams && !isUseToken) {
          useToken = t
          isUseToken = 1
          break
        }
      }
      // console.log(useToken)
      if (!selectCurrency) {
        setSelectCurrency(useToken)
      }
      return nftData[chainId]
    }
    return {}
  }, [nftData, chainId])

  const routerToken = useMemo(() => {
    if (tokenList && tokenList[selectCurrency]) {
      return tokenList[selectCurrency].routerToken
    }
    return
  }, [tokenList, selectCurrency])

  const destChainId = useMemo(() => {
    const arr:any = []
    if (tokenList && selectCurrency && tokenList[selectCurrency]) {
      let useChain = ''
      let isUseToken = 0
      for (const c in tokenList[selectCurrency].destChains) {
        arr.push(c)
        if (!selectChainId && !isUseToken) {
          isUseToken = 1
          useChain = c
        }
      }
      if (!selectChainId) {
        setSelectChainId(useChain)
      }
    }
    return arr
  }, [tokenList, selectCurrency])

  // const contract721 = useNFT721Contract(selectCurrency)
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
    routerToken,
    {symbol: 'NFT', version: tokenList[selectCurrency]?.version},
    selectCurrency,
    account,
    selectTokenId,
    selectChainId,
    tokenList[selectCurrency]?.fee
  )
  const [approval, approveCallback] = useApproveCallback(selectCurrency, routerToken, selectTokenId)
    // console.log(tokenidUri)
  function setMetamaskNetwork (item:any) {
    selectNetwork(item).then((res:any) => {
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(item).networkName}))
      }
    })
  }

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const isWrapInputError = useMemo(() => {
    if (wrapInputError) {
      return wrapInputError
    }
    return
  }, [wrapInputError])

  const isCrossBridge = useMemo(() => {
    if (
      account
      && selectCurrency
      && !isWrapInputError
      && selectTokenId
    ) {
      return false
    } else {
      return true
    }
  }, [selectCurrency, account, isWrapInputError, selectTokenId])

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError && inputValue) {
      return isWrapInputError
    }  else if (wrapType === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [t, isWrapInputError, inputValue, wrapType, ])

  return (
    <>
      <AppBody>
        <Title
          title={t('nftrouter')}
        ></Title>
        <FlexWrapBox>
          <SelectChainIDPanel
            chainList={SUPPORT_CHAIN}
            selectChainId={chainId}
            onChainSelect={(value) => {
              // setSelectChainId(value)
              setMetamaskNetwork(value)
            }}
            label={'From Chain'}
          />
          <ArrowRight />
          <SelectChainIDPanel
            chainList={destChainId}
            selectChainId={selectChainId}
            onChainSelect={(value) => {
              setSelectChainId(value)
            }}
            label={'To Chain'}
          />

          <SelectCurrencyPanel
            tokenlist={tokenList}
            selectCurrency={selectCurrency}
            selectTokenId={selectTokenId}
            onSelectCurrency={(value) => {
              setSelectCurrency(value)
            }}
            onSelectTokenId={(value) => {
              setSelectTokenId(value)
            }}
          />
          {
            tokenList[selectCurrency]?.nfttype === 'erc1155' ? (
              <Input
                value={inputValue}
                onUserInput={(value) => {
                  setInputValue(value)
                }}
                style={{marginRight: '0'}}
              />
            ) : ''
          }
          {
            tokenList[selectCurrency]?.fee && false ? (
              <FeeBox>
                {t('fee')}{fromWei(tokenList[selectCurrency]?.fee, 18)}{config.getCurChainInfo(chainId).symbol}
              </FeeBox>
            ) : ''
          }
          {
            selectCurrency && selectTokenId ? (
              <TokenidLogo size="100%" selectCurrency={selectCurrency} selectTokenId={selectTokenId} type="1" />
            ) : ''
          }
        </FlexWrapBox>
        

        <BottomGrouping>
          {
            !account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING ? (
                <ButtonConfirmed onClick={() => {
                  if (approveCallback) approveCallback()
                }}>
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      {t('Approving')} <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted ? (
                    t('Approved')
                  ) : (
                    t('Approve') + ' ' + tokenList[selectCurrency]?.symbol + ' ' + selectTokenId
                  )}
                </ButtonConfirmed>
              ) : (
                <ButtonConfirmed disabled={isCrossBridge} onClick={() => {
                  if (onWrap) onWrap()
                }}>
                  {btnTxt}
                </ButtonConfirmed>
              )
            )
          }
        </BottomGrouping>
      </AppBody>
    </>
  )
}