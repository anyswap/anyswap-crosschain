import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ArrowRight} from 'react-feather'
import { JSBI } from 'anyswap-sdk'

import {useNFT721Callback, WrapType} from '../../hooks/useNFTCallback'
import {useApproveCallback, ApprovalState} from '../../hooks/useNFTApproveCallback'
import { useActiveWeb3React } from '../../hooks'
// import { useNFT721Contract } from '../../hooks/useContract'

import { useWalletModalToggle } from '../../state/application/hooks'
import {ERC_TYPE} from '../../state/nft/hooks'

import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonConfirmed } from '../../components/Button'
import Title from '../../components/Title'
import Input from '../../components/NumericalInput'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'

import AppBody from '../AppBody'
import SelectChainIDPanel from './selectChainId'
import SelectCurrencyPanel from './selectCurrency'

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
  padding: 0.8rem 1rem;
  margin: 5px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.tipColor};
`

// const SelectNFTTokenLabel = 'SelectNFTTokenLabel'

function getInitToken () {
  const urlParams = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  // const localParams = sessionStorage.getItem(SelectNFTTokenLabel) ? sessionStorage.getItem(SelectNFTTokenLabel) : ''
  // let initBridgeToken:any = urlParams ? urlParams : localParams
  let initBridgeToken:any = urlParams ? urlParams : ''
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
  const [delayAction, setDelayAction] = useState<boolean>(false)

  const initBridgeToken = getInitToken()

  useEffect(() => {
    setSelectTokenId('')
  }, [chainId, selectCurrency])

  const tokenList = useMemo(() => {
    if (nftData && chainId && nftData[chainId]) {
      const list = nftData[chainId]
      // console.log(list)
      // console.log(selectCurrency)
      // console.log(list[selectCurrency])
      const urlParams = (selectCurrency && list[selectCurrency] && list[selectCurrency]?.chainId?.toString() === chainId?.toString() ? selectCurrency : (initBridgeToken ? initBridgeToken : 'Loot'))?.toLowerCase()
      // console.log(urlParams)
      let isUseToken = 0
      let useToken
      for (const t in list) {
        if (
          (!selectCurrency && urlParams)
          || !list[selectCurrency]
          || list[selectCurrency].chainId?.toString() !== chainId?.toString()
        ) {
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
      if (
        !selectCurrency
        || !list[selectCurrency]
        || list[selectCurrency].chainId?.toString() !== chainId?.toString()
      ) {
        setSelectCurrency(useToken)
      }
      return nftData[chainId]
    }
    return {}
  }, [nftData, chainId])
  
  const fee = useMemo(() => {
    if (selectCurrency && tokenList && tokenList[selectCurrency]) {
      const feePerTransaction = JSBI.BigInt(tokenList[selectCurrency].fee.feePerTransaction)
      const feePerUnitInBatch = JSBI.BigInt(tokenList[selectCurrency].fee.feePerUnitInBatch)
      if (tokenList[selectCurrency].nfttype === ERC_TYPE.erc1155) {
        return JSBI.add(feePerTransaction, feePerUnitInBatch)?.toString()
      } else {
        return feePerTransaction?.toString()
      }
    }
    return 
  }, [selectCurrency, tokenList])

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
        if (
          (!selectChainId || !useChain)
          && !isUseToken
        ) {
          isUseToken = 1
          useChain = c
        }
      }
      
      if (
        !selectChainId
        || selectChainId?.toString() === chainId?.toString()
        || !arr.includes(selectChainId)
      ) {
        setSelectChainId(useChain)
      }
    }
    return arr
  }, [tokenList, selectCurrency, chainId])
  // const contract721 = useNFT721Contract(selectCurrency)
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
    routerToken,
    {symbol: tokenList[selectCurrency]?.symbol, version: tokenList[selectCurrency]?.version},
    selectCurrency,
    account,
    selectTokenId?.tokenid,
    selectChainId,
    fee
  )
  const [approval, approveCallback] = useApproveCallback(selectCurrency, routerToken, selectTokenId?.tokenid)
    // console.log(tokenidUri)
  function setMetamaskNetwork (item:any) {
    selectNetwork(item).then((res:any) => {
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(item).networkName}))
      }
    })
  }

  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setDelayAction(false)
  }

  // useEffect(() => {
  //   if (approval === ApprovalState.PENDING) {
  //     setApprovalSubmitted(true)
  //   }
  // }, [approval, approvalSubmitted])

  const isWrapInputError = useMemo(() => {
    if (wrapInputError) {
      return wrapInputError
    }
    return
  }, [wrapInputError])

  const isCrossBridge = useMemo(() => {
    
    // console.log(approval)
    // console.log(ApprovalState)
    // console.log(isWrapInputError)
    if (
      account
      && selectCurrency
      && !isWrapInputError
      && selectChainId
      && selectTokenId
    ) {
      return false
    } else {
      return true
    }
  }, [selectCurrency, account, isWrapInputError, selectTokenId, selectChainId])

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError) {
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
            label={'From '}
          />
          <ArrowRight style={{marginTop: '30px'}} />
          <SelectChainIDPanel
            chainList={destChainId}
            selectChainId={selectChainId}
            onChainSelect={(value) => {
              setSelectChainId(value)
            }}
            label={'To '}
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
            selectCurrency && selectTokenId ? (
              <>
                <img src={selectTokenId?.image} />
              </>
            ) : ''
          }
          {
            fee ? (
              <FeeBox>
                {t('fee')}: {fromWei(fee, 18)} {config.getCurChainInfo(chainId).symbol}
              </FeeBox>
            ) : ''
          }
        </FlexWrapBox>
        

        <BottomGrouping>
          {
            !account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && selectTokenId?.tokenid ? (
                <ButtonConfirmed
                  onClick={() => {
                    onDelay()
                    if (approveCallback) approveCallback().then(() => {
                      setApprovalSubmitted(true)
                      onClear()
                    }).catch(() => {
                      onClear()
                    })
                  }}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                >
                  {approval === ApprovalState.PENDING || approvalSubmitted ? (
                    <AutoRow gap="6px" justify="center">
                      {t('Approving')} <Loader stroke="white" />
                    </AutoRow>
                  ) : t('Approve') + ' ' + tokenList[selectCurrency]?.symbol + ' ' + selectTokenId?.tokenid}
                </ButtonConfirmed>
              ) : (
                <ButtonConfirmed disabled={isCrossBridge || delayAction} onClick={() => {
                  onDelay()
                  if (onWrap) onWrap().then(() => {
                    setSelectTokenId('')
                    onClear()
                  }).catch(() => {
                    onClear()
                  })
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