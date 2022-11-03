import { Currency } from 'anyswap-sdk'
import React, { useState, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { RowBetween } from '../../Row'
import { Input as NumericalInput } from '../../NumericalInput'
import TokenLogo from '../../TokenLogo'

import { TYPE } from '../../../theme'

import { useActiveReact } from '../../../hooks/useActiveReact'
import { useToggleNetworkModal } from '../../../state/application/hooks'
import config from '../../../config'
import { thousandBit } from '../../../utils/tools/tools'
import { useTokensBalance, useBaseBalances } from '../../../hooks/useAllBalances'
import {
  InputRow,
  CurrencySelect,
  LabelRow,
  Aligner,
  TokenLogoBox,
  InputPanel,
  StyledTokenName,
  CurrencySelectBox,
  Container
} from './styleds'

const HeadterRightBox = styled.div``

interface SelectCurrencyInputPanelProps {
  value: string // token amount
  onUserInput: (value: string) => void // user input amount
  showMaxButton: boolean // is view max function
  onMax?: (value: any) => void // input max token amount
  label?: string
  onCurrencySelect?: (currency: any) => void // user select token
  currency?: any // select token
  disableCurrencySelect?: boolean // disabled select
  disableInput?: boolean // disabled input
  hideBalance?: boolean // hide balance
  hideInput?: boolean // hide input
  otherCurrency?: Currency | null //
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  inputType?: any // input type, object type, params:{swapType: 'withdraw' | 'deposit', ...{custom params}}
  isViewModal?: boolean // 是否显示选择token弹框
  onOpenModalView?: (value: any) => void // 触发打开弹框方法，同isViewModal一起使用
  isViewNetwork?: boolean // 是否显示选择网络，若true，则在头部显示余额，否则余额显示在币种旁边
  isError?: any // 是否输入错误
  isNativeToken?: boolean // 是否为原生native代币
  isViewMode?: boolean // 是否显示头部更多操作按钮
  allTokens?: any // 所有token list
  customChainId?: any // 显示自定义chainId
  customBalance?: any // 显示自定义chainId
  bridgeKey?: any // router为：'routerTokenList' ，bridge为：'bridgeTokenList'
  showETH?: any // showETH
  isRouter?: any // showETH
}

export default function SelectCurrencyInputPanel({
  value,
  onUserInput,
  label = 'Input',
  disableCurrencySelect = false,
  disableInput = false,
  hideInput = false,
  id,
  isError,
  customChainId
}: // isRouter,
SelectCurrencyInputPanelProps) {
  const { t } = useTranslation()
  const { account, chainId } = useActiveReact()
  const baseBalance = useBaseBalances(account)

  // const account = '0x4188663a85C92EEa35b5AD3AA5cA7CeB237C6fe9'
  const useChainId = customChainId ? customChainId : chainId
  const theme = useContext(ThemeContext)
  const toggleNetworkModal = useToggleNetworkModal()

  return (
    <InputPanel id={id} className={isError ? 'error' : ''}>
      <Container hideInput={hideInput}>
        <LabelRow>
          <RowBetween>
            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
              {label}
            </TYPE.body>
            <HeadterRightBox>
              <TYPE.body
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {t('balanceTxt') + ': ' + thousandBit(baseBalance?.toExact(), 2)}
              </TYPE.body>
            </HeadterRightBox>
          </RowBetween>
        </LabelRow>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          <NumericalInput
            className={isError ? 'error' : ''}
            value={value}
            onUserInput={val => {
              onUserInput(val)
            }}
            disabled={disableInput}
          />
          <CurrencySelectBox>
            <CurrencySelect selected={true} className="open-currency-select-button">
              <Aligner>
                <TokenLogoBox>
                  <TokenLogo symbol={'FTM'} size={'24px'} />
                </TokenLogoBox>
                <StyledTokenName className="token-symbol-container" active={true}>
                  <h3>FTM</h3>
                  <p>FTM</p>
                </StyledTokenName>
              </Aligner>
            </CurrencySelect>
            <CurrencySelect
              selected={true}
              onClick={() => {
                // toggleNetworkModal()
              }}
              className="open-currency-select-button"
            >
              <Aligner>
                <TokenLogoBox>
                  <TokenLogo
                    symbol={
                      config.getCurChainInfo(useChainId)?.networkLogo ?? config.getCurChainInfo(useChainId)?.symbol
                    }
                    size={'24px'}
                  />
                </TokenLogoBox>
                <StyledTokenName className="token-symbol-container">
                  {config.getCurChainInfo(useChainId).networkName}
                </StyledTokenName>
              </Aligner>
            </CurrencySelect>
          </CurrencySelectBox>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
