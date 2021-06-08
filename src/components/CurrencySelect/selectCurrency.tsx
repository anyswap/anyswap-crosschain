import { Currency } from 'anyswap-sdk'
import React, { useState, useContext, useCallback, useEffect, useMemo} from 'react'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useCurrencyBalance, useETHBalances } from '../../state/wallet/hooks'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import TokenLogo from '../TokenLogo'

import { TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { useToggleNetworkModal } from '../../state/application/hooks'
// import { useToken } from '../../hooks/Tokens'
import config from '../../config'
import {formatDecimal} from '../../utils/tools/tools'

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
  HideSmallBox
} from './styleds'

import SearchModal from './searchModal'


interface SelectCurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax: (value: any) => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  // currency?: Currency | null
  currency?: any
  disableCurrencySelect?: boolean
  disableInput?: boolean
  hideBalance?: boolean
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  inputType?: any
  onlyUnderlying?: boolean
  isViewModal?: boolean
  onOpenModalView?: (value: any) => void
  isViewNetwork?: boolean
  isError?: boolean
  isNativeToken?: boolean
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
  disableInput = false,
  hideBalance = false,
  hideInput = false,
  otherCurrency,
  id,
  customBalanceText,
  inputType,
  onlyUnderlying,
  isViewModal,
  onOpenModalView,
  isViewNetwork,
  isError,
  isNativeToken
}: SelectCurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()
  // const account = '0x4188663a85C92EEa35b5AD3AA5cA7CeB237C6fe9'
  const theme = useContext(ThemeContext)
  const toggleNetworkModal = useToggleNetworkModal()

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
    if (onOpenModalView) {
      onOpenModalView(false)
    }
  }, [setModalOpen])

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const selectedETHBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const useBalance = useMemo(() => {
    if (selectedCurrencyBalance && !isNativeToken) {
      return selectedCurrencyBalance
    } else if (selectedETHBalance && isNativeToken) {
      return selectedETHBalance
    } else {
      return undefined
    }
  }, [selectedCurrencyBalance, isNativeToken, selectedETHBalance])
  // console.log(isNativeToken)
  // console.log(selectedETHBalance?.toSignificant(6))
  // console.log(selectedCurrencyBalance?.toSignificant(6))
  const handleMax = useCallback(() => {
    if (useBalance) {
      onMax(useBalance?.toSignificant(6))
    } else {
      onMax('')
    }
  }, [useBalance, onMax])

  useEffect(() => {
    if (typeof isViewModal != 'undefined') {
      setModalOpen(isViewModal)
    }
  }, [isViewModal])

  
  return (
    <InputPanel id={id} className={isError ? 'error' : ''}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
              

                {account && showMaxButton && isViewNetwork ? (
                  <TYPE.body
                    onClick={handleMax}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {!hideBalance && !!currency && useBalance
                      ? (customBalanceText ?? (t('balanceTxt') + ': ')) + formatDecimal(useBalance.toSignificant(6), 2)
                      : t('balanceTxt') + ': ' + '-'}
                  </TYPE.body>
                ) : (
                  <HideSmallBox>
                  <TYPE.body
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {!hideBalance && !!currency && useBalance && account
                      ? (customBalanceText ?? (t('balanceTxt') + ': ')) + formatDecimal(useBalance.toSignificant(6), 2)
                      : t('balanceTxt') + ': ' + '-'}
                  </TYPE.body>
                  </HideSmallBox>
                )}
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
                  <TokenLogo symbol={currency?.symbol} size={'24px'} />
                </TokenLogoBox>
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  <h3>
                    {/* {inputType ? (
                      inputType.type === 'INPUT' ? (
                        inputType.swapType === 'deposit' ? '' : 'any'
                      ) : (
                        inputType.swapType === 'deposit' ? 'any' : ''
                      )
                    ) : ''} */}
                    {
                      (
                        currency && currency.symbol && currency.symbol.length > 20
                          ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                          : (
                            inputType && inputType.swapType === 'deposit' ? currency?.symbol : config.getBaseCoin(currency?.symbol, chainId)
                          )
                      ) || t('selectToken')
                    }
                    {/* {!inputType && chainId ? '-' + config.getCurChainInfo(chainId).suffix : ''} */}
                  </h3>
                  <p>
                  {currency && currency.name ? currency.name : ''}
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
                      <TokenLogo symbol={config.getCurChainInfo(chainId)?.networkLogo ?? config.getCurChainInfo(chainId)?.symbol} size={'24px'} />
                    </TokenLogoBox>
                    <StyledTokenName className="token-symbol-container">
                      {config.getCurChainInfo(chainId).networkName}
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
                              ? (customBalanceText ?? '') + formatDecimal(useBalance.toSignificant(6), 2)
                              : '-'}{' '}
                          </p>
                        </ExtraText>
                      </ErrorSpan>
                    ) : (
                      ''
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
          onlyUnderlying={onlyUnderlying}
        />
      )}
    </InputPanel>
  )
}
