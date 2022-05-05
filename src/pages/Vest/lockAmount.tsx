import React, { useContext } from "react"
import { useTranslation } from 'react-i18next'
import { ThemeContext } from "styled-components"

import TokenLogo from '../../components/TokenLogo'

import { TYPE } from '../../theme'

import {thousandBit} from '../../utils/tools/tools'

import {
  SwapInputBox,
  CurrencySelect1,
  TokenLogoBox1,
  SwapInputContent,
  SwapInputLabel,
  VeNumericalInput,
  SwapSymbol
} from './style'

import {BASE_INFO} from './data'

export default function LockAmount ({
  selectCurrency,
  balance,
  isInputError,
  inputValue,
  onInputValue,
  onMax
}: {
  selectCurrency:any,
  balance:any
  isInputError:any
  inputValue:any
  onInputValue: (value: any) => void
  onMax: (value: any) => void
}) {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <>
      <SwapInputBox>
        <CurrencySelect1 selected={true} className="open-currency-select-button">
          <TokenLogoBox1>
            <TokenLogo symbol={selectCurrency?.symbol ?? BASE_INFO.symbol} size={'100%'} />
          </TokenLogoBox1>
        </CurrencySelect1>
        <SwapInputContent>
          <SwapInputLabel>
            <TYPE.body
              color={theme.text2}
              fontWeight={500}
              // fontSize={theme.mediaWidth.upToMedium ? 12 : 14}
              style={{ display: 'inline', cursor: 'pointer' }}
              onClick={() => onMax(balance?.toExact())}
              className="balance"
            >
              {t('balanceTxt') + ': ' + (balance ? thousandBit(balance?.toSignificant(6), 'no') : '-')}
            </TYPE.body>
          </SwapInputLabel>
          <VeNumericalInput
            className={isInputError ? 'error' : ''}
            value={inputValue ?? ''}
            onUserInput={(val:any) => {
              onInputValue(val)
            }}
            disabled={false}
          />
          <SwapSymbol>
            {
              selectCurrency?.symbol ? selectCurrency?.symbol : BASE_INFO.symbol
            }
          </SwapSymbol>
        </SwapInputContent>
      </SwapInputBox>
    </>
  )
}