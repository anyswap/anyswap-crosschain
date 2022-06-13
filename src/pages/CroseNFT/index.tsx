import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ArrowRight} from 'react-feather'
import { JSBI } from 'anyswap-sdk'

import {useNFT721Callback, useNFT1155Callback, WrapType} from '../../hooks/useNFTCallback'
import {useApproveCallback, useApprove1155Callback, ApprovalState} from '../../hooks/useNFTApproveCallback'
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
import {spportChainArr} from '../../config/chainConfig'
import {getParams} from '../../config/tools/getUrlParams'
import {selectNetwork} from '../../config/tools/methods'

import {fromWei} from '../../utils/tools/tools'

// import NFT_DATA from './nftdata.js'
import { getUrlData } from '../../utils/tools/axios'


const SUPPORT_CHAIN = spportChainArr
// console.log(SUPPORT_CHAIN)
// const nftData = NFT_DATA as any

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

  const [selectChainId, setSelectChainId] = useState<any>()
  const [inputValue, setInputValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectTokenId, setSelectTokenId] = useState<any>()
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [nftList, setNftList] = useState<any>({})

  const initBridgeToken = getInitToken()

  useEffect(() => {
    setSelectTokenId('')
  }, [chainId, selectCurrency])

  const fetchNFTList = useCallback(() => {
    getUrlData(`${config.bridgeApi}/v3/nft?chainId=${chainId}&version=NFTV1`).then((res:any) => {
      console.log(res)
      if (res && res.msg === 'Success') {
        setNftList(res.data)
      } else {
        setNftList({})
      }
    })
  }, [chainId])

  useEffect(() => {
    fetchNFTList()
  }, [fetchNFTList, chainId])

  const tokenList = useMemo(() => {
    if (nftList) {
      const list:any = nftList
      
      const urlParams = (selectCurrency && selectCurrency?.chainId?.toString() === chainId?.toString() ? selectCurrency?.address : (initBridgeToken ? initBridgeToken : config.getCurChainInfo(chainId).nftInitToken))?.toLowerCase()
      // console.log(urlParams)
      let isUseToken = 0
      let useToken
      for (const t in list) {
        if (
          (!selectCurrency && urlParams)
          || selectCurrency.chainId?.toString() !== chainId?.toString()
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
        useToken
        && (!selectCurrency
            || selectCurrency?.chainId?.toString() !== chainId?.toString())
      ) {
        setSelectCurrency({
          ...list[useToken],
          address: useToken
        })
      }
      return list
    }
    return {}
  }, [nftList, chainId])
  
  const fee = useMemo(() => {
    if (selectCurrency) {
      // console.log(selectCurrency)
      const feePerTransaction = JSBI.BigInt(selectCurrency.fee.feePerTransaction)
      const feePerUnitInBatch = JSBI.BigInt(selectCurrency.fee.feePerUnitInBatch)
      if (selectCurrency.nfttype === ERC_TYPE.erc1155) {
        return JSBI.add(feePerTransaction, feePerUnitInBatch)?.toString()
      } else {
        return feePerTransaction?.toString()
      }
    }
    return 
  }, [selectCurrency])

  const routerToken = useMemo(() => {
    if (selectCurrency) {
      return selectCurrency.routerToken
    }
    return
  }, [selectCurrency])

  const destChainId = useMemo(() => {
    const arr:any = []
    if (selectCurrency) {
      let useChain = ''
      let isUseToken = 0
      for (const c in selectCurrency.destChains) {
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
  }, [selectCurrency, chainId])
  
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
    routerToken,
    selectCurrency?.nfttype === ERC_TYPE.erc721 ? selectCurrency : undefined,
    account,
    selectTokenId?.tokenid,
    selectChainId,
    fee
  )
  const { wrapType: wrapType1155, execute: onWrap1155, inputError: wrapInputError1155 } = useNFT1155Callback(
    routerToken,
    selectCurrency?.nfttype === ERC_TYPE.erc1155 ? selectCurrency : undefined,
    account,
    selectTokenId?.tokenid,
    selectChainId,
    fee,
    inputValue
  )
  const {approvalState: approval721, approve: approveCallback721} = useApproveCallback(selectCurrency?.nfttype === ERC_TYPE.erc721 ? selectCurrency : undefined, routerToken, selectTokenId?.tokenid)
  const {approvalState: approval1155, approve: approveCallback1155} = useApprove1155Callback(selectCurrency?.nfttype === ERC_TYPE.erc1155 ? selectCurrency : undefined, routerToken)
    // console.log(tokenidUri)

  const approval = useMemo(() => {
    if (selectCurrency?.nfttype === ERC_TYPE.erc721) {
      return approval721
    } else {
      return approval1155
    }
  }, [approval721, approval1155, selectCurrency])

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

  const isWrapInputError = useMemo(() => {
    // console.log(wrapInputError)
    if (wrapInputError && selectCurrency?.nfttype === ERC_TYPE.erc721) {
      return wrapInputError
    } else if (wrapInputError1155 && selectCurrency?.nfttype === ERC_TYPE.erc1155) {
      return wrapInputError1155
    }
    return
  }, [wrapInputError, wrapInputError1155, selectCurrency])

  const isCrossBridge = useMemo(() => {
    if (
      account
      && selectCurrency
      && !isWrapInputError
      && selectChainId
      && selectTokenId
      && (
        (
          selectCurrency?.nfttype === ERC_TYPE.erc1155
          && inputValue
          && !isNaN(inputValue)
          && selectTokenId?.balance
          && Number(selectTokenId?.balance) > Number(inputValue)
        ) || selectCurrency?.nfttype !== ERC_TYPE.erc1155
      )
    ) {
      return false
    } else {
      return true
    }
  }, [selectCurrency, account, isWrapInputError, selectTokenId, selectChainId, inputValue])

  const btnTxt = useMemo(() => {
    // console.log(isWrapInputError)
    if (isWrapInputError && selectCurrency?.nfttype === ERC_TYPE.erc721) {
      return isWrapInputError
    } else if (wrapInputError1155 && selectCurrency?.nfttype === ERC_TYPE.erc1155) {
      return wrapInputError1155
    } else if (wrapType === WrapType.WRAP || wrapType1155 === WrapType.WRAP) {
      return t('swap')
    }
    return t('swap')
  }, [t, isWrapInputError, inputValue, wrapType, wrapType1155, wrapInputError1155])

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
            selectCurrency?.nfttype === ERC_TYPE.erc1155 ? (
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
                    if (selectCurrency?.nfttype === ERC_TYPE.erc721) {
                      if (approveCallback721) approveCallback721().then(() => {
                        setApprovalSubmitted(true)
                        onClear()
                      }).catch(() => {
                        onClear()
                      })
                    } else {
                      if (approveCallback1155) approveCallback1155().then(() => {
                        setApprovalSubmitted(true)
                        onClear()
                      }).catch(() => {
                        onClear()
                      })
                    }
                  }}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                >
                  {approval === ApprovalState.PENDING || approvalSubmitted ? (
                    <AutoRow gap="6px" justify="center">
                      {t('Approving')} <Loader stroke="white" />
                    </AutoRow>
                  ) : t('Approve') + ' ' + selectCurrency?.symbol + ' ' + selectTokenId?.tokenid}
                </ButtonConfirmed>
              ) : (
                <ButtonConfirmed disabled={isCrossBridge || delayAction} onClick={() => {
                  onDelay()
                  if (selectCurrency?.nfttype === ERC_TYPE.erc721) {
                    if (onWrap) onWrap().then(() => {
                      onClear()
                      setSelectTokenId('')
                    }).catch(() => {
                      onClear()
                    })
                  } else if (selectCurrency?.nfttype === ERC_TYPE.erc1155) {
                    if (onWrap1155) onWrap1155().then(() => {
                      onClear()
                      setSelectTokenId('')
                    }).catch(() => {
                      onClear()
                    })
                  } 
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