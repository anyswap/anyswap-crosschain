// import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { TokenAmount } from 'anyswap-sdk'
import { useTranslation } from 'react-i18next'
// import { ThemeContext } from 'styled-components'
// import { ArrowDown } from 'react-feather'

import SelectCurrencyInputPanel from './selectCurrency'

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

  // const useAddress = swapType === 'deposit' ? {...selectCurrency, address: selectCurrency.underlying.address, name: selectCurrency.underlying.name, symbol: selectCurrency.underlying.symbol} : selectCurrency
  // console.log(selectCurrency)
  const useAddress = useMemo(() => {
    if (selectCurrency) {
      return swapType !== 'deposit' ? selectCurrency : {...selectCurrency, address: selectCurrency.underlying.address, name: selectCurrency.underlying.name, symbol: selectCurrency.underlying.symbol}
    }
    return
  }, [selectCurrency, swapType])
  const formatCurrency = useLocalToken(useAddress)
  const amountToApprove = formatCurrency ? new TokenAmount(formatCurrency ?? undefined, inputBridgeValue) : undefined
  // const [approval, approveCallback] = useApproveCallback(amountToApprove ?? undefined, swapType === 'deposit' ? selectCurrency?.address : selectCurrency?.underlying?.address)
  const [approval, approveCallback] = useApproveCallback(amountToApprove ?? undefined, useAddress?.address)

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useSwapUnderlyingCallback(
    formatCurrency?formatCurrency:undefined,
    selectCurrency?.address,
    inputBridgeValue,
    swapType
  )

  const isCrossBridge = useMemo(() => {
    if (
      account
      && useAddress
      && inputBridgeValue
      && !wrapInputError
    ) {
      return false
    } else {
      return true
    }
  }, [useAddress, account, wrapInputError, inputBridgeValue])

  const btnTxt = useMemo(() => {
    if (wrapInputError && inputBridgeValue) {
      return wrapInputError
    } else if (wrapInputError && !inputBridgeValue) {
      return t('bridgeAssets')
    } else if (wrapType === WrapType.WRAP) {
      return t('bridgeAssets')
    }
    return t('bridgeAssets')
  }, [t, wrapInputError])

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  useEffect(() => {
    const token = useAddress ? useAddress?.address : config.bridgeInitToken
    // console.log(token)
    if (token) {
      getTokenConfig(token).then((res:any) => {
        // console.log(res)
        if (res && res.decimals && res.symbol) {
          if (!useAddress) {
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
  }, [useAddress, count])

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
            currency={formatCurrency}
            disableCurrencySelect={false}
            showMaxButton={true}
            id="selectCurrency"
            inputType={{swapType, type: 'INPUT'}}
          />

          {/* <SwapIcon
            onClick={() => {
              setSwapType('deposit')
            }}
            iconUrl={require('../../assets/images/icon/revert.svg')}
          ></SwapIcon> */}

          {/* <SelectCurrencyInputPanel
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
            inputType={{swapType, type: 'OUTPUT'}}
          /> */}

        </AutoColumn>
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
                    t('Approve') + ' ' + config.getBaseCoin(useAddress?.symbol)
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

        {/* <BottomGrouping>
          {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
            ) : (
              <ButtonPrimary disabled={isCrossBridge} onClick={onWrap}>
                {btnTxt}
              </ButtonPrimary>
            )
          }
        </BottomGrouping> */}
      </AppBody>
    </>
  )
}