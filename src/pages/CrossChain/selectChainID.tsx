import React, { useState, useContext, useCallback, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
// import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'

import { RowBetween } from '../../components/Row'
import Column from '../../components/Column'
import { PaddedColumn, Separator } from '../../components/SearchModal/styleds'
import { Input as NumericalInput } from '../../components/NumericalInput'
import TokenLogo from '../../components/TokenLogo'
import Modal from '../../components/Modal'
// import { MenuItem } from '../../components/SearchModal/styleds'
import {
  OptionCardClickable,
  Option
} from '../../components/Header/SelectNetwork'

import { TYPE, CloseIcon } from '../../theme'

import {formatDecimal} from '../../utils/tools/tools'

import config from '../../config'

import {
  InputRow,
  CurrencySelect,
  // ErrorSpanBox,
  // ErrorSpan,
  // ExtraText,
  LabelRow,
  Aligner,
  TokenLogoBox,
  StyledDropDownBox,
  StyledDropDown,
  InputPanel,
  Container,
  StyledTokenName,
  CurrencySelectBox
  // HideSmallBox
} from '../../components/CurrencySelect/styleds'

import {getAllChainIDs} from '../../utils/bridge/getBaseInfo'
import {getNodeBalance} from '../../utils/bridge/getBalance'


interface SelectChainIdInputPanel {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onChainSelect?: (selectChainId: any) => void
  selectChainId?: any
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  onOpenModalView?: (value: any) => void,
  bridgeConfig: any,
  intervalCount: any
}

export default function SelectChainIdInputPanel({
  value,
  onUserInput,
  label = 'Input',
  onChainSelect,
  selectChainId,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  onOpenModalView,
  bridgeConfig,
  intervalCount
}: SelectChainIdInputPanel) {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const [modalOpen, setModalOpen] = useState(false)
  const [chainList, setChainList] = useState<Array<any>>([])
  const [destBalance, setDestBalance] = useState<any>()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const theme = useContext(ThemeContext)
  // console.log(bridgeConfig)
  useEffect(() => {
    
    getAllChainIDs(chainId).then((res:any) => {
      console.log(res)
      setChainList(res)
    })
  }, [chainId])

  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
        handleDismissSearch()
      }
    },
    [onChainSelect]
  )

  useEffect(() => {
    if (
      account
      && chainId
      && bridgeConfig
      && selectChainId
    ) {
      // console.log(bridgeConfig)
      // const token = bridgeConfig && bridgeConfig.destChain && bridgeConfig.destChain[selectChainId] ? bridgeConfig.destChain[selectChainId].token : ''
      const token = bridgeConfig && bridgeConfig.destChain && bridgeConfig.destChain[selectChainId] ? bridgeConfig.destChain[selectChainId]?.underlying?.address : ''
      if (token) {
        getNodeBalance(account, token, selectChainId, bridgeConfig.destChain[selectChainId]?.decimals).then(res => {
        // getNodeBalance('0x12139f3afa1C93303e1EfE3Df142039CC05C6c58', token, selectChainId, bridgeConfig.destChain[selectChainId].decimals).then(res => {
          console.log(res)
          if (res) {
            setDestBalance(res)
          } else {
            setDestBalance('')
          }
        })
      }
    } else {
      setDestBalance('')
    }
  }, [account, chainId, bridgeConfig, selectChainId, intervalCount])

  return (
    <>
      <InputPanel id={id}>
        <Container hideInput={hideInput}>
          {!hideInput && (
            <LabelRow>
              <RowBetween>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.body>
                <TYPE.body
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {destBalance ? (t('balanceTxt') + ': ' + formatDecimal(destBalance, 2)) : '0'}
                </TYPE.body>
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
                  disabled
                />
              </>
            )}
            <CurrencySelectBox>

              <CurrencySelect
                selected={!!selectChainId}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect && onOpenModalView) {
                    onOpenModalView(true)
                  }
                }}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={bridgeConfig?.symbol} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(bridgeConfig && bridgeConfig.symbol)}>
                    <h3>
                      {/* {(bridgeConfig && bridgeConfig.symbol && bridgeConfig.symbol.length > 20
                        ? bridgeConfig.symbol.slice(0, 4) +
                          '...' +
                          bridgeConfig.symbol.slice(bridgeConfig.symbol.length - 5, bridgeConfig.symbol.length)
                        : config.getBaseCoin(bridgeConfig?.symbol)) || t('selectToken')} */}
                      {
                        bridgeConfig?.underlying?.symbol ? (
                          bridgeConfig?.underlying?.symbol.length > 20
                            ? bridgeConfig?.underlying?.symbol.slice(0, 4) +
                              '...' +
                              bridgeConfig?.underlying?.symbol.slice(bridgeConfig?.underlying?.symbol.length - 5, bridgeConfig?.underlying?.symbol.length)
                            : config.getBaseCoin(bridgeConfig?.underlying?.symbol)
                        ) : (
                          bridgeConfig?.symbol ? (
                            bridgeConfig?.symbol.length > 20
                              ? bridgeConfig.symbol.slice(0, 4) +
                                '...' +
                                bridgeConfig.symbol.slice(bridgeConfig.symbol.length - 5, bridgeConfig.symbol.length)
                              : config.getBaseCoin(bridgeConfig?.symbol)) : t('selectToken')
                        )
                      }
                      {selectChainId ? '-' + config.chainInfo[selectChainId].suffix : ''}
                    </h3>
                    <p>
                      {
                        bridgeConfig ? (
                          bridgeConfig.destChain ? bridgeConfig.destChain[selectChainId]?.underlying?.name : bridgeConfig?.name
                        ) : ''
                      }
                    </p>
                  </StyledTokenName>
                  {!disableCurrencySelect && !!selectChainId && (
                    <StyledDropDownBox>
                      <StyledDropDown selected={!!selectChainId} />
                    </StyledDropDownBox>
                  )}
                </Aligner>
              </CurrencySelect>

              <CurrencySelect
                selected={!!selectChainId}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true)
                  }
                }}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={selectChainId ? config.chainInfo[selectChainId].symbol : ''} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(selectChainId)}>
                    {selectChainId && config.chainInfo[selectChainId].networkName ? config.chainInfo[selectChainId].networkName : t('selectNetwork')}
                  </StyledTokenName>
                  {!disableCurrencySelect && !!selectChainId && (
                    <StyledDropDownBox>
                      <StyledDropDown selected={!!selectChainId} />
                    </StyledDropDownBox>
                  )}
                </Aligner>
              </CurrencySelect>
            </CurrencySelectBox>
          </InputRow>
        </Container>
      </InputPanel>
      {!disableCurrencySelect && onChainSelect && (
        <Modal isOpen={modalOpen} onDismiss={handleDismissSearch} maxHeight={300}>
          <Column style={{ width: '100%', flex: '1 1' }}>
            <PaddedColumn gap="14px">
              <RowBetween>
                <Text fontWeight={500} fontSize={16}>
                  {t('selectNetwork')}
                  {/* <QuestionHelper text={t('tip6')} /> */}
                </Text>
                <CloseIcon onClick={handleDismissSearch} />
              </RowBetween>
            </PaddedColumn>
            <Separator />
            <div style={{ flex: '1' }}>
              {/* {chainListView()} */}
              {
                  chainList.map((item:any, index:any) => {
                    if (Number(chainId) === Number(item)) {
                      return ''
                    }
                    return (
                      <OptionCardClickable
                        key={index}
                        className={selectChainId && selectChainId === item ? 'active' : ''}
                        onClick={() => (selectChainId && selectChainId === item ? null : handleCurrencySelect(item))}
                      >
                        {Option(config.chainInfo[item], config.chainInfo[selectChainId].symbol)}
                      </OptionCardClickable>
                    )
                  })
                }
            </div>
          </Column>
        </Modal>
      )}
    </>
  )
}
