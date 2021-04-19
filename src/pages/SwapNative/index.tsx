// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { TokenAmount } from 'anyswap-sdk'
import { useTranslation } from 'react-i18next'
// import { ThemeContext } from 'styled-components'
// import { ArrowDown } from 'react-feather'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'

import { useActiveWeb3React } from '../../hooks'
import {useSwapUnderlyingCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useLocalToken } from '../../hooks/Tokens'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import { AutoColumn } from '../../components/Column'
// import SwapIcon from '../../components/SwapIcon'
import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import Title from '../../components/Title'



import { useWalletModalToggle } from '../../state/application/hooks'

import config from '../../config'

import AppBody from '../AppBody'

import PoolTip from './poolTip'

import {getTokenConfig} from '../../utils/bridge/getBaseInfo'

export default function SwapNative() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  // const selectedTokenList = useSelectedTokenList()
  // const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()

  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [swapType, setSwapType] = useState<any>('deposit')
  const [count, setCount] = useState<number>(0)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const underlyingToken =  useMemo(() => {
    if (selectCurrency && selectCurrency.underlying) {
      return {
        address: selectCurrency.underlying.address,
        name: selectCurrency.underlying.name,
        symbol: selectCurrency.underlying.symbol,
        decimals: selectCurrency.decimals
      }
    }
    return
  }, [selectCurrency])

  const anyCurrency = useLocalToken(selectCurrency ?? undefined)
  const underlyingCurrency = useLocalToken(underlyingToken ?? undefined)
  const amountToApprove = underlyingCurrency ? new TokenAmount(underlyingCurrency ?? undefined, inputBridgeValue) : undefined
  const [approval, approveCallback] = useApproveCallback(amountToApprove ?? undefined, selectCurrency?.address)

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useSwapUnderlyingCallback(
    swapType !== 'deposit' ? (anyCurrency ?? undefined) : (underlyingCurrency ?? undefined),
    selectCurrency?.address,
    inputBridgeValue,
    swapType
  )

  const isCrossBridge = useMemo(() => {
    if (
      account
      && selectCurrency
      && inputBridgeValue
      && !wrapInputError
    ) {
      return false
    } else {
      return true
    }
  }, [selectCurrency, account, wrapInputError, inputBridgeValue])

  const btnTxt = useMemo(() => {
    const bt = swapType !== 'deposit' ? t('RemoveLiquidity') : t('AddLiquidity')
    if (wrapInputError && inputBridgeValue) {
      return wrapInputError
    } else if (wrapInputError && !inputBridgeValue) {
      return bt
    } else if (wrapType === WrapType.WRAP) {
      return bt
    }
    return bt
  }, [t, wrapInputError, swapType])

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  useEffect(() => {
    const token = selectCurrency ? selectCurrency?.address : config.bridgeInitToken
    // console.log(token)
    if (token) {
      getTokenConfig(token).then((res:any) => {
        // console.log(res)
        if (res && res.decimals && res.symbol) {
          if (!selectCurrency) {
            setSelectCurrency({
              "address": token,
              "chainId": chainId,
              "decimals": res.decimals,
              "name": res.name,
              "symbol": res.symbol,
              "underlying": res.underlying
            })
          }
        } else {
          setTimeout(() => {
            setCount(count + 1)
            // setCount(1)
          }, 100)
        }
      })
    }
    // getBaseInfo()
  }, [selectCurrency, count])

  const handleMaxInput = useCallback((value) => {
    if (value) {
      setInputBridgeValue(value)
    } else {
      setInputBridgeValue('')
    }
  }, [setInputBridgeValue])

  return (
    <>
      <AppBody>
        <Title
          title={t('pool')}
          tabList={[
            {
              name: t('deposit'),
              onTabClick: () => {
                setSwapType('deposit')
              },
              iconUrl: require('../../assets/images/icon/deposit.svg'),
              iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
            },
            {
              name: t('widthdrwa'),
              onTabClick: () => {
                setSwapType('widthdrwa')
              },
              iconUrl: require('../../assets/images/icon/withdraw.svg'),
              iconActiveUrl: require('../../assets/images/icon/withdraw-purple.svg')
            }
          ]}
        ></Title>
        <AutoColumn gap={'md'}>

          <SelectCurrencyInputPanel
            label={t('From')}
            value={inputBridgeValue}
            onUserInput={(value) => {
              setInputBridgeValue(value)
            }}
            onCurrencySelect={(inputCurrency) => {
              console.log(inputCurrency)
              setSelectCurrency(inputCurrency)
            }}
            onMax={(value) => {
              handleMaxInput(value)
            }}
            currency={swapType !== 'deposit' ? (anyCurrency ?? undefined) : (underlyingCurrency ?? undefined)}
            disableCurrencySelect={false}
            showMaxButton={true}
            id="selectCurrency"
            inputType={{swapType, type: 'INPUT'}}
            onlyUnderlying={true}
          />

        </AutoColumn>

        <PoolTip 
          anyCurrency={anyCurrency}
          underlyingCurrency={underlyingCurrency}
        />

        <BottomGrouping>

          {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  // confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      {t('Approving')} <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted ? (
                    t('Approved')
                  ) : (
                    t('Approve') + ' ' + config.getBaseCoin(anyCurrency?.symbol)
                  )}
                </ButtonConfirmed>
              ) : (
                <ButtonPrimary disabled={isCrossBridge} onClick={onWrap}>
                  {btnTxt}
                </ButtonPrimary>
              )
            )
          }
        </BottomGrouping>

      </AppBody>
    </>
  )
}