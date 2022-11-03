import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../../Row'
import { Input as NumericalInput } from '../../NumericalInput'
import TokenLogo from '../../TokenLogo'
import { TYPE } from '../../../theme'
import { thousandBit } from '../../../utils/tools/tools'
import config from '../../../config'

import {
  InputRow,
  CurrencySelect,
  LabelRow,
  Aligner,
  TokenLogoBox,
  InputPanel,
  Container,
  StyledTokenName,
  CurrencySelectBox,
  StyledDropDown,
  StyledDropDownBox
} from '../../CurrencySelect/styleds'

interface SelectChainIdInputPanel {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onChainSelect?: (selectChainId: any) => void
  selectChainId?: any
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  onCurrencySelect?: (currency: any) => void // user select token
  onOpenModalView?: (value: any) => void
  bridgeConfig: any
  intervalCount?: any
  isNativeToken?: boolean
  selectChainList?: Array<any>
  selectDestCurrency?: any
  selectDestCurrencyList?: any
  bridgeKey?: any
}

export default function SelectChainIdInputPanel({
  value,
  onUserInput,
  label = 'Input',
  selectChainId,
  disableCurrencySelect = false,
  hideInput = false,
  id
}: SelectChainIdInputPanel) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <>
      <InputPanel id={id}>
        <Container hideInput={hideInput}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
            </RowBetween>
          </LabelRow>
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={val => {
                onUserInput(val)
              }}
              disabled
            />
            <CurrencySelectBox>
              <CurrencySelect selected={!!selectChainId} className="open-currency-select-button">
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={'APT'} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={true}>
                    <h3>APT</h3>
                    <p>APT</p>
                  </StyledTokenName>
                </Aligner>
              </CurrencySelect>
              <CurrencySelect selected={true} className="open-currency-select-button">
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={'APT'} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container">Aptos testnet</StyledTokenName>
                </Aligner>
              </CurrencySelect>
            </CurrencySelectBox>
          </InputRow>
        </Container>
      </InputPanel>
    </>
  )
}
