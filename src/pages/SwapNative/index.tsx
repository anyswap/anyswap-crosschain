// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
// import { ThemeContext } from 'styled-components'
// import { ArrowDown } from 'react-feather'

import SelectCurrencyInputPanel from './selectCurrency'

import { useActiveWeb3React } from '../../hooks'
import {useSwapUnderlyingCallback} from '../../hooks/useBridgeCallback'
import { WrapType } from '../../hooks/useWrapCallback'
import { useLocalToken } from '../../hooks/Tokens'

import { AutoColumn } from '../../components/Column'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import SwapIcon from '../../components/SwapIcon'
import { BottomGrouping } from '../../components/swap/styleds'
import Title from '../../components/Title'

import { useWalletModalToggle } from '../../state/application/hooks'

import config from '../../config'

import AppBody from '../AppBody'

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

  const [bridgeConfig, setBridgeConfig] = useState<any>()


  const formatCurrency = useLocalToken(
    selectCurrency && selectCurrency.underlying ?
      {...selectCurrency, address: selectCurrency.underlying.address, name: selectCurrency.underlying.name, symbol: selectCurrency.underlying.symbol} : selectCurrency)

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useSwapUnderlyingCallback(
    formatCurrency?formatCurrency:undefined,
    selectCurrency?.address,
    inputBridgeValue,
    swapType
  )

  const isCrossBridge = useMemo(() => {
    if (
      account
      && bridgeConfig
      && selectCurrency
      && inputBridgeValue
      && (
        (!wrapInputError && !(selectCurrency && selectCurrency.underlying))
      )
    ) {
      if (Number(inputBridgeValue) < Number(bridgeConfig.MinimumSwap) || Number(inputBridgeValue) > Number(bridgeConfig.MaximumSwap)) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }, [selectCurrency, account, bridgeConfig, wrapInputError, inputBridgeValue])

  const btnTxt = useMemo(() => {
    if (wrapInputError && inputBridgeValue) {
      return wrapInputError
    } else if (wrapInputError && !inputBridgeValue) {
      return t('bridgeAssets')
    } else if (
      (wrapType === WrapType.WRAP && !(selectCurrency && selectCurrency.underlying))
    ) {
      return t('bridgeAssets')
    }
    return t('bridgeAssets')
  }, [t, wrapInputError, selectCurrency])

  useEffect(() => {
    const token = selectCurrency ? selectCurrency.address : config.bridgeInitToken
    // console.log(token)
    if (token) {
      getTokenConfig(token).then((res:any) => {
        // console.log(res)
        if (res && res.decimals && res.symbol) {
          setBridgeConfig(res)
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
          setBridgeConfig('')
        }
      })
    } else {
      setBridgeConfig('')
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
        <Title title={t('pool')}></Title>
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
            currency={formatCurrency}
            disableCurrencySelect={false}
            showMaxButton={true}
            id="selectCurrency"
          />

          <SwapIcon
            onClick={() => {
              setSwapType('deposit')
            }}
            iconUrl={require('../../assets/images/icon/revert.svg')}
          ></SwapIcon>

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
            currency={formatCurrency}
            disableCurrencySelect={true}
            disableInput={true}
            showMaxButton={true}
            id="selectCurrency1"
          />

        </AutoColumn>

        <BottomGrouping>
          {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              <ButtonPrimary disabled={isCrossBridge} onClick={onWrap}>
                {btnTxt}
              </ButtonPrimary>
            )
          }
        </BottomGrouping>
      </AppBody>
    </>
  )
}