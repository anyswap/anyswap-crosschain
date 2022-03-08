import { Currency } from 'anyswap-sdk'
import React, { useState, useContext, useCallback, useEffect, useMemo} from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useCurrencyBalance, useETHBalances } from '../../state/wallet/hooks'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import TokenLogo from '../TokenLogo'

import { TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { useToggleNetworkModal } from '../../state/application/hooks'
import config from '../../config'
import {CROSS_BRIDGE_LIST} from '../../config/constant'
import {thousandBit} from '../../utils/tools/tools'
import {
  InputRow,
  CurrencySelect,
  ErrorSpanBox,
  ErrorSpan,
  ExtraText,
  LabelRow,
  Aligner,
  TokenLogoBox,
  StyledDropDownBox,
  StyledDropDown,
  InputPanel,
  Container,
  StyledTokenName,
  CurrencySelectBox,
  // HideSmallBox
} from './styleds'

import SearchModal from './searchModal'
import { isAddress } from '../../utils'

const HeadterRightBox = styled.div`

`

interface SelectCurrencyInputPanelProps {
  value: string  // token amount
  onUserInput: (value: string) => void // user input amount
  showMaxButton: boolean // is view max function
  onMax?: (value: any) => void // input max token amount
  label?: string 
  onCurrencySelect?: (currency: Currency) => void // user select token
  // currency?: Currency | null
  currency?: any // select token
  disableCurrencySelect?: boolean // disabled select
  disableChainSelect?: boolean // disabled select
  disableInput?: boolean // disabled input
  hideBalance?: boolean // hide balance
  hideInput?: boolean // hide input
  otherCurrency?: Currency | null //
  id: string
  showCommonBases?: boolean
  customBalanceText?: string 
  inputType?: any // input type, object type, params:{swapType: 'withdraw' | 'deposit', ...{custom params}}
  // onlyUnderlying?: boolean
  isViewModal?: boolean // 是否显示选择token弹框
  onOpenModalView?: (value: any) => void // 触发打开弹框方法，同isViewModal一起使用
  isViewNetwork?: boolean // 是否显示选择网络，若true，则在头部显示余额，否则余额显示在币种旁边
  isError?: any // 是否输入错误
  isNativeToken?: boolean // 是否为原生native代币
  isViewMode?: boolean // 是否显示头部更多操作按钮
  modeConent?: any // 更多操作按钮内容，同isViewMode一起使用
  onChangeMode?: (value: any) => void // 更多操作按钮方法，同isViewMode一起使用
  allTokens?: any // 所有token list
  customChainId?: any // 显示自定义chainId
  customBalance?: any // 显示自定义chainId
  bridgeKey?: any // router为：'routerTokenList' ，bridge为：'bridgeTokenList'
  allBalances?: any // all token balance
  showETH?: any // showETH
  isRouter?: any // showETH
}

export default function SelectCurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  disableChainSelect = false,
  disableInput = false,
  hideBalance = false,
  hideInput = false,
  otherCurrency,
  id,
  customBalanceText,
  inputType,
  // onlyUnderlying,
  isViewModal,
  onOpenModalView,
  isViewNetwork,
  isError,
  isNativeToken,
  isViewMode, 
  modeConent,
  onChangeMode,
  allTokens = {},
  customChainId,
  customBalance,
  bridgeKey,
  allBalances,
  showETH,
  isRouter,
}: SelectCurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  // const account = '0x4188663a85C92EEa35b5AD3AA5cA7CeB237C6fe9'
  const useChainId = customChainId ? customChainId : chainId
  const theme = useContext(ThemeContext)
  const toggleNetworkModal = useToggleNetworkModal()

  const [modalOpen, setModalOpen] = useState(false)

  // const useTokenList = Object.keys(allTokens).length > 0 ? allTokens : allTokensList
  const useTokenList = allTokens
  // console.log(useTokenList)
  // console.log(allTokens)
  //   console.log(allTokensList)
  const handleDismissSearch = useCallback(() => {
    // console.log(allTokens)
    // console.log(allTokensList)
    setModalOpen(false)
    if (onOpenModalView) {
      onOpenModalView(false)
    }
  }, [setModalOpen])

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const selectedETHBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const useBalance = useMemo(() => {
    // console.log(hideBalance)
    // console.log(customBalance)
    if (customBalance) {
      return customBalance
    } else if (selectedCurrencyBalance && (!isNativeToken || isRouter === false)) {
      return selectedCurrencyBalance?.toSignificant(6)
    } else if (isNativeToken || !isAddress(currency?.address)) {
      if (inputType && inputType.swapType === 'withdraw' && selectedCurrencyBalance) {
        return selectedCurrencyBalance?.toSignificant(6)
      } else if ((inputType && inputType.swapType === 'deposit') || selectedETHBalance) {
        return selectedETHBalance?.toSignificant(6)
      }
      return undefined
    } else {
      return undefined
    }
  }, [selectedCurrencyBalance, isNativeToken, selectedETHBalance, customBalance, currency, inputType, disableChainSelect, isRouter])

  const handleMax = useCallback(() => {
    if (onMax) {
      if (useBalance) {
        onMax(useBalance)
      } else {
        onMax('')
      }
    }
  }, [useBalance, onMax])

  useEffect(() => {
    if (typeof isViewModal != 'undefined') {
      setModalOpen(isViewModal)
    }
  }, [isViewModal])

  const logoUrl = useMemo(() => {
    // console.log(currency)
    if (useTokenList && currency?.address) {
      for (const t in useTokenList) {
        if (
          t === currency?.address?.toLowerCase()
          || useTokenList[t]?.underlying?.address?.toLowerCase() === currency?.address?.toLowerCase()
          || useTokenList[t]?.tokenInfo?.underlying?.address?.toLowerCase() === currency?.address?.toLowerCase()
        ) {
          // console.log(useTokenList[t])
          return useTokenList[t]?.tokenInfo?.logoUrl ?? useTokenList[t]?.logoUrl
        }
      }
    }
    return ''
  }, [useTokenList, currency])
  // console.log(currency)
  return (
    <InputPanel id={id} className={isError ? 'error' : ''}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              
              <HeadterRightBox>

                {isViewMode && onChangeMode ? (
                  <TYPE.body
                    onClick={() => {
                      if (modeConent.isFlag) {
                        onChangeMode(false)
                      } else {
                        onChangeMode(true)
                      }
                    }}
                    color={theme.tipColor}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer', marginRight: '10px', textDecoration: 'underline' }}
                  >{modeConent.txt}</TYPE.body>
                ) : ''
                // (
                //   <TYPE.body
                //     color={theme.text2}
                //     fontWeight={500}
                //     fontSize={14}
                //     style={{ display: 'inline', cursor: 'pointer' }}
                //   >
                //     {t('balanceTxt') + ': ' + '-'}
                //   </TYPE.body>
                // )
                }
                {account && showMaxButton && isViewNetwork ? (
                  <>
                    <TYPE.body
                      onClick={handleMax}
                      color={theme.text2}
                      fontWeight={500}
                      fontSize={14}
                      style={{ display: 'inline', cursor: 'pointer' }}
                    >
                      {!hideBalance && !!currency && useBalance
                        ? (customBalanceText ?? (t('balanceTxt') + ': ')) + thousandBit(useBalance, 2)
                        : t('balanceTxt') + ': ' + '-'}
                    </TYPE.body>
                  </>
                ) : (
                  <>
                    <TYPE.body
                      color={theme.text2}
                      fontWeight={500}
                      fontSize={14}
                      style={{ display: 'inline', cursor: 'pointer' }}
                    >
                      {!hideBalance && !!currency && useBalance && account
                        ? (customBalanceText ?? (t('balanceTxt') + ': ')) + thousandBit(useBalance, 2)
                        : t('balanceTxt') + ': ' + '-'}
                    </TYPE.body>
                    {/* <HideSmallBox>
                    </HideSmallBox> */}
                  </>
                )}
              </HeadterRightBox>
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className={isError ? 'error' : ''}
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
                disabled={disableInput}
              />
            </>
          )}
          <CurrencySelectBox>

            <CurrencySelect
              selected={!!currency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
                <TokenLogoBox>
                  <TokenLogo symbol={currency?.symbol} logoUrl={logoUrl} size={'24px'} />
                </TokenLogoBox>
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  <h3>
                    {
                      (
                        currency && currency.symbol && currency.symbol.length > 20
                          ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                          : (
                            CROSS_BRIDGE_LIST.includes(bridgeKey) ? 
                            currency?.symbol
                            :
                            isRouter === false ? currency?.symbol : config.getBaseCoin(currency?.symbol, useChainId)
                          )
                      ) || t('selectToken')
                    }
                  </h3>
                  <p>
                  {currency && currency.name && !CROSS_BRIDGE_LIST.includes(bridgeKey) ? (isRouter === false ? currency.name : config.getBaseCoin(currency.symbol, useChainId, 1, currency.name)) : currency?.name}
                  </p>
                </StyledTokenName>
                {!disableCurrencySelect && !!currency && (
                  <StyledDropDownBox>
                    <StyledDropDown selected={!!currency} />
                  </StyledDropDownBox>
                )}
              </Aligner>
            </CurrencySelect>
            {
              isViewNetwork ? (
                <CurrencySelect
                  selected={true}
                  onClick={() => {toggleNetworkModal()}}
                  className="open-currency-select-button"
                >
                  <Aligner>
                    <TokenLogoBox>
                      <TokenLogo symbol={config.getCurChainInfo(useChainId)?.networkLogo ?? config.getCurChainInfo(useChainId)?.symbol} size={'24px'} />
                    </TokenLogoBox>
                    <StyledTokenName className="token-symbol-container">
                      {config.getCurChainInfo(useChainId).networkName}
                    </StyledTokenName>
                    {!disableCurrencySelect && !!currency && (
                      <StyledDropDownBox>
                        <StyledDropDown selected={!!currency} />
                      </StyledDropDownBox>
                    )}
                  </Aligner>
                </CurrencySelect>
              ) : (
                <ErrorSpanBox>
                  {
                    !hideBalance && !!currency ? (
                      <ErrorSpan onClick={handleMax}>
                        <ExtraText>
                          <h5>{t('balance')}</h5>
                          <p>
                            {!hideBalance && !!currency && useBalance
                              ? (customBalanceText ?? '') + thousandBit(useBalance, 2)
                              : '-'}{' '}
                          </p>
                        </ExtraText>
                      </ErrorSpan>
                    ) : (
                      t('balanceTxt') + ': ' + '-'
                    )
                  }
                </ErrorSpanBox>
              )
            }
          </CurrencySelectBox>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && modalOpen && (
        <SearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          // onlyUnderlying={onlyUnderlying}
          allTokens={useTokenList}
          chainId={chainId}
          bridgeKey={bridgeKey}
          allBalances={allBalances}
          showETH={showETH}
        />
      )}
    </InputPanel>
  )
}
