import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react'
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
  intervalCount: any,
  isNativeToken?: boolean
  isViewAllChain?: boolean
  selectChainList?: Array<any>
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
  intervalCount,
  isNativeToken,
  isViewAllChain,
  selectChainList = []
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
    // console.log(selectChainList)
    if (selectChainList.length > 0) {
      setChainList([chainId, ...selectChainList])
    } else {
      setChainList([])
    }
  }, [chainId, selectChainList])
  // console.log(chainList)

  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
        handleDismissSearch()
      }
    },
    [onChainSelect]
  )

  const destChainInfo = useMemo(() => {
    // console.log(bridgeConfig)
    if (bridgeConfig) {
      if (Number(selectChainId) === Number(chainId)) {
        return bridgeConfig
      } else {
        return bridgeConfig?.destChains[selectChainId]
      }
    }
    return false
  }, [bridgeConfig, selectChainId, chainId])
  // console.log(bridgeConfig)
  // console.log(selectChainId)
  // console.log(destChainInfo)
  useEffect(() => {
    if (
      account
      && chainId
      && bridgeConfig
      && selectChainId
      && !isNaN(selectChainId)
    ) {
      let token:any = ''
      if (Number(chainId) === Number(selectChainId)) {
        token = bridgeConfig?.underlying?.address ? bridgeConfig?.underlying?.address : bridgeConfig?.address
      } else {
        token = destChainInfo?.underlying?.address ? destChainInfo?.underlying?.address : destChainInfo?.address
      }
      // console.log(token)
      if (token) {
        getNodeBalance(account, token, selectChainId, destChainInfo?.decimals, isNativeToken).then(res => {
          // console.log(res)
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
  }, [account, chainId, bridgeConfig, selectChainId, intervalCount, isNativeToken])

  useEffect(() => {
    setDestBalance('')
  }, [account, chainId, bridgeConfig, selectChainId])

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
                  {t('balanceTxt') + ': '}{destBalance ? formatDecimal(destBalance, 2) : '-'}
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
                    <TokenLogo symbol={bridgeConfig?.underlying?.symbol ?? bridgeConfig?.symbol} logoUrl={bridgeConfig?.logoUrl} size={'24px'} />
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
                            : config.getBaseCoin(bridgeConfig?.underlying?.symbol, chainId)
                        ) : (
                          bridgeConfig?.symbol ? (
                            bridgeConfig?.symbol.length > 20
                              ? bridgeConfig?.symbol.slice(0, 4) +
                                '...' +
                                bridgeConfig?.symbol.slice(bridgeConfig?.symbol.length - 5, bridgeConfig?.symbol.length)
                              : config.getBaseCoin(bridgeConfig?.symbol, chainId)) : t('selectToken')
                        )
                      }
                      {/* {selectChainId ? '-' + config.chainInfo[selectChainId].suffix : ''} */}
                    </h3>
                    <p>
                      {
                        bridgeConfig ? (
                          destChainInfo?.underlying ? config.getBaseCoin(destChainInfo?.underlying?.symbol, chainId, 1, destChainInfo?.underlying?.name) : config.getBaseCoin(destChainInfo?.symbol, chainId, 1, destChainInfo?.name)
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
                    <TokenLogo symbol={selectChainId ? (config.getCurChainInfo(selectChainId)?.networkLogo ?? config.getCurChainInfo(selectChainId)?.symbol) : ''} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(selectChainId)}>
                    {selectChainId && config.chainInfo[selectChainId]?.networkName ? config.chainInfo[selectChainId].networkName : t('selectNetwork')}
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
                  chainList && chainList.map((item:any, index:any) => {
                    if (
                      (Number(chainId) === Number(item) && !isViewAllChain)
                      || (config.getCurBridgeConfigInfo(chainId)?.hiddenChain?.includes(item))
                    ) {
                      return ''
                    }
                    // console.log(selectChainId)
                    return (
                      <OptionCardClickable
                        key={index}
                        className={selectChainId && selectChainId === item ? 'active' : ''}
                        onClick={() => (selectChainId && selectChainId === item ? null : handleCurrencySelect(item))}
                      >
                        {Option(item, selectChainId)}
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
