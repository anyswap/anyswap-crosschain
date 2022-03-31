import React, { useState, useContext, useCallback, useEffect, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import {useFormatCurrency} from '../../hooks/Tokens'

import { RowBetween } from '../../components/Row'
import Column from '../../components/Column'
import { PaddedColumn, Separator } from '../../components/SearchModal/styleds'
import { Input as NumericalInput } from '../../components/NumericalInput'
import TokenLogo from '../../components/TokenLogo'
import Modal from '../../components/Modal'
import { MenuItem } from '../../components/SearchModal/styleds'
import { RowFixed } from '../../components/Row'
import {
  OptionCardClickable,
  Option
} from '../../components/Header/SelectNetwork'

import { TYPE, CloseIcon } from '../../theme'

import {formatDecimal} from '../../utils/tools/tools'

import {useCurrencyBalance} from '../../state/wallet/hooks'

import config from '../../config'
import {BASECURRENCY} from '../../config/constant'

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

interface SelectChainIdInputPanel {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onChainSelect?: (selectChainId: any) => void
  onDestCurrencySelect?: (selectChainId: any) => void
  selectChainId?: any
  selectDestCurrency?: any
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
  bridgeConfig: any,
  // intervalCount: any,
  isNativeToken?: boolean
  isViewAllChain?: boolean
  selectChainList?: Array<any>
}

const ListBox = styled.div`
  overflow:auto;
  max-height: 300px;
`

export default function SelectChainIdInputPanel({
  value,
  onUserInput,
  label = 'Input',
  onChainSelect,
  onDestCurrencySelect,
  selectChainId,
  selectDestCurrency,
  disableCurrencySelect = false,
  hideInput = false,
  id,
  bridgeConfig,
  // intervalCount,
  isNativeToken,
  isViewAllChain,
  selectChainList = []
}: SelectChainIdInputPanel) {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCurrencyOpen, setModalCurrencyOpen] = useState(false)
  const [chainList, setChainList] = useState<Array<any>>([])
  // const [destBalance, setDestBalance] = useState<any>()

  const formatCurrency = useFormatCurrency(selectChainId, selectDestCurrency?.address, selectDestCurrency?.decimals, selectDestCurrency?.name, selectDestCurrency?.symbol)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, formatCurrency ?? undefined, selectChainId)
  // const selectedETHBalance = useETHBalances(account ? [account] : [], selectChainId)?.[account ?? '']
  // console.log(selectedETHBalance)
  // console.log(selectedETHBalance?.toSignificant(6))
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const handleDismissCurrency = useCallback(() => {
    setModalCurrencyOpen(false)
  }, [setModalCurrencyOpen])

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

  const handleDestCurrencySelect = useCallback(
    (item) => {
      if (onDestCurrencySelect) {
        onDestCurrencySelect(item)
        handleDismissCurrency()
      }
    },
    [onChainSelect]
  )

  const destTokenList = useMemo(() => {
    // console.log(selectChainId)
    const arr = config.getCurChainInfo(selectChainId)?.tokenList?.tokens
    if (arr) {
      return arr
    }
    return []
  }, [bridgeConfig, selectChainId])
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
                  {t('balanceTxt') + ': '}{selectedCurrencyBalance ? formatDecimal(selectedCurrencyBalance?.toSignificant(6), 2) : '-'}
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
                  setModalCurrencyOpen(true)
                }}
              >
                <Aligner>
                  <TokenLogoBox>
                    <TokenLogo symbol={selectDestCurrency?.symbol === BASECURRENCY ? (config.getCurChainInfo(selectChainId)?.networkLogo ?? config.getCurChainInfo(selectChainId)?.symbol) : selectDestCurrency?.symbol} size={'24px'} />
                  </TokenLogoBox>
                  <StyledTokenName className="token-symbol-container" active={Boolean(bridgeConfig && bridgeConfig.symbol)}>
                    <h3>
                      {
                        selectDestCurrency?.symbol && selectDestCurrency?.symbol !== BASECURRENCY ? (
                          selectDestCurrency?.symbol.length > 20
                            ? selectDestCurrency?.symbol.slice(0, 4) +
                              '...' +
                              selectDestCurrency?.symbol.slice(selectDestCurrency?.symbol.length - 5, selectDestCurrency?.symbol.length)
                            : config.getBaseCoin(selectDestCurrency?.symbol, chainId)
                        ) : (selectDestCurrency?.symbol === BASECURRENCY ? config.getCurChainInfo(selectChainId)?.symbol : t('selectToken'))
                      }
                      {/* {selectChainId ? '-' + config.chainInfo[selectChainId].suffix : ''} */}
                    </h3>
                    <p>
                      {
                        selectDestCurrency?.symbol && selectDestCurrency?.symbol !== BASECURRENCY ? config.getBaseCoin(selectDestCurrency?.symbol, chainId, 1, selectDestCurrency?.name) : (selectDestCurrency?.symbol === BASECURRENCY ? config.getCurChainInfo(selectChainId)?.name : '')
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
                      (chainId?.toString() === item?.toString() && !isViewAllChain)
                      || (config.getCurConfigInfo()?.hiddenChain?.includes(item))
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
                        {/* {Option(item, selectChainId)} */}
                        <Option curChainId={item} selectChainId={chainId}></Option>
                      </OptionCardClickable>
                    )
                  })
                }
            </div>
          </Column>
        </Modal>
      )}
      
      <Modal isOpen={modalCurrencyOpen} onDismiss={handleDismissCurrency} maxHeight={300}>
        <Column style={{ width: '100%', flex: '1 1' }}>
          <PaddedColumn gap="14px">
            <RowBetween>
              <Text fontWeight={500} fontSize={16}>
                {t('selectToken')}
                {/* <QuestionHelper text={t('tip6')} /> */}
              </Text>
              <CloseIcon onClick={handleDismissCurrency} />
            </RowBetween>
          </PaddedColumn>
          <Separator />
          <div style={{ flex: '1' }}>
            {/* {chainListView()} */}
            <ListBox>
              {
                destTokenList.map((item:any, index:any) => {
                  
                  return (
                    <MenuItem
                      className={`token-item-${index}`}
                      onClick={() => {
                        if (item?.address !== selectDestCurrency?.address) {
                          // setSelectCurrency(item)
                          // handleDismissCurrency()
                          handleDestCurrencySelect(item)
                        }
                      }}
                      disabled={item?.address === selectDestCurrency?.address}
                      selected={item?.address === selectDestCurrency?.address}
                      key={index}
                    >
                      <TokenLogo symbol={item.symbol === BASECURRENCY ? config.getCurChainInfo(selectChainId)?.symbol : item.symbol} size={'24px'}></TokenLogo>
                      <Column>
                        <Text title={item.name} fontWeight={500}>
                          {item.symbol === BASECURRENCY ? config.getCurChainInfo(selectChainId)?.symbol : config.getBaseCoin(item.symbol, chainId) }
                        </Text>
                      </Column>
                      {/* <TokenTags currency={item} /> */}
                      {
                        isNativeToken ? (
                          <RowFixed style={{ justifySelf: 'flex-end' }}>
                            {/* {ETHBalance ? <Balance balance={ETHBalance} /> : account ? <Loader /> : null} */}
                          </RowFixed>
                        ) : (
                          <RowFixed style={{ justifySelf: 'flex-end' }}>
                            {/* {balance ? <Balance balance={balance} /> : account ? <Loader /> : null} */}
                          </RowFixed>
                        )
                      }
                    </MenuItem>
                  )
                })
              }
            </ListBox>
          </div>
        </Column>
      </Modal>
    </>
  )
}
