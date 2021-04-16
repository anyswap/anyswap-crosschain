import { Currency } from 'anyswap-sdk'
import React, { useState, useContext, useCallback, useEffect} from 'react'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useCurrencyBalance } from '../../state/wallet/hooks'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import TokenLogo from '../TokenLogo'

import { TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { useToggleNetworkModal } from '../../state/application/hooks'
// import { useToken } from '../../hooks/Tokens'
import config from '../../config'

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
  // CurrencySelect1
  // HideSmallBox
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
  isViewNetwork
}: SelectCurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
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

  const handleMax = useCallback(() => {
    // console.log(selectedCurrencyBalance?.toSignificant(6))
    if (selectedCurrencyBalance) {
      onMax(selectedCurrencyBalance?.toSignificant(6))
    } else {
      onMax('')
    }
  }, [selectedCurrencyBalance, onMax])

  useEffect(() => {
    if (typeof isViewModal != 'undefined') {
      setModalOpen(isViewModal)
    }
  }, [isViewModal])

  
  return (
    <InputPanel id={id}>
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
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? (customBalanceText ?? (t('balanceTxt') + ': ')) + selectedCurrencyBalance?.toSignificant(6)
                    : ' -'}
                </TYPE.body>
                // <HideSmallBox>

                // </HideSmallBox>
              ) : ''}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
                style={{ marginRight: '1.875rem' }}
                disabled={disableInput}
              />
            </>
          )}
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
                  {inputType ? (
                    inputType.type === 'INPUT' ? (
                      inputType.swapType === 'deposit' ? '' : 'any'
                    ) : (
                      inputType.swapType === 'deposit' ? 'any' : ''
                    )
                  ) : ''}
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : config.getBaseCoin(currency?.symbol)) || t('selectToken')}
                  {!inputType && chainId ? '-' + config.suffix : ''}
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
                style={{marginLeft: "10px"}}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={config?.symbol} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container">
                    {config.networkName}
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
                  !hideBalance && !!currency && selectedCurrencyBalance ? (
                    <ErrorSpan onClick={handleMax}>
                      <ExtraText>
                        <h5>{t('balance')}</h5>
                        <p>
                          {!hideBalance && !!currency && selectedCurrencyBalance
                            ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                            : ' -'}{' '}
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
          {/* <ErrorSpanBox>
            {isViewNetwork ? (
              <CurrencySelect1
                selected={true}
                className="open-currency-select-button"
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={config?.symbol} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container">
                    {config.networkName}
                  </StyledTokenName>
                </Aligner>
              </CurrencySelect1>
            ) : (
              !hideBalance && !!currency && selectedCurrencyBalance ? (
                <ErrorSpan onClick={handleMax}>
                  <ExtraText>
                    <h5>{t('balance')}</h5>
                    <p>
                      {!hideBalance && !!currency && selectedCurrencyBalance
                        ? (customBalanceText ?? '') + selectedCurrencyBalance?.toSignificant(6)
                        : ' -'}{' '}
                    </p>
                  </ExtraText>
                </ErrorSpan>
              ) : (
                ''
              )
            )}
          </ErrorSpanBox> */}
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
