import React, { useState, useContext, useCallback, useEffect } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../../hooks'

import { RowBetween } from '../../../components/Row'
import Column from '../../../components/Column'
import { PaddedColumn, Separator } from '../../../components/SearchModal/styleds'
import { Input as NumericalInput } from '../../../components/NumericalInput'
import TokenLogo from '../../../components/TokenLogo'
import Modal from '../../../components/Modal'
import { MenuItem } from '../../../components/SearchModal/styleds'

import { TYPE, CloseIcon } from '../../../theme'

import config from '../../../config'

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
  // HideSmallBox
} from '../../../components/CurrencyInputPanel/styleds'

import {getAllChainIDs} from '../../../utils/bridge/getBaseInfo'

const CurrencySelect1 = styled(CurrencySelect)`

  border: 0.0625rem solid ${({ theme }) => theme.selectedBorderNo};
  background-color: ${({ theme }) => theme.selectedBgNo};
  :hover {
    border: 0.0625rem solid ${({ theme }) => theme.selectedBorderNo};
    background-color: ${({ theme }) => theme.selectedBgNo};
  }

  :focus {
    border: 0.0625rem solid ${({ theme }) => theme.selectedBorderNo};
    background-color: ${({ theme }) => theme.selectedBgNo};
  }

  :active {
    border: 0.0625rem solid ${({ theme }) => theme.selectedBorderNo};
    background-color: ${({ theme }) => theme.selectedBgNo};
  }
  @media screen and (max-width: 960px) {
    display: none;
  }
`


interface SelectChainIdInputPanel {
  value: string
  onUserInput: (value: string) => void
  label?: string
  onChainSelect?: (selectChainId: any) => void
  currency?: any
  selectChainId?: any
  disableCurrencySelect?: boolean
  hideInput?: boolean
  id: string
}

export default function SelectChainIdInputPanel({
  value,
  onUserInput,
  label = 'Input',
  onChainSelect,
  currency,
  selectChainId,
  disableCurrencySelect = false,
  hideInput = false,
  id
}: SelectChainIdInputPanel) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const [modalOpen, setModalOpen] = useState(false)
  const [chainList, setChainList] = useState<Array<any>>([])

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const theme = useContext(ThemeContext)

  useEffect(() => {
    
    getAllChainIDs().then((res:any) => {
      // console.log(res)
      setChainList(res)
    })
  }, [])

  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
        handleDismissSearch()
      }
    },
    [onChainSelect]
  )

  function chainListView () {
    return (
      <>
        {
          chainList.map((item:string|number, index) => {
            if (Number(chainId) === Number(item)) {
              return ''
            }
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (selectChainId && selectChainId === item ? null : handleCurrencySelect(item))}
                disabled={selectChainId === item}
                selected={selectChainId === item}
                key={index}
              >
                <TokenLogo symbol={config.chainInfo[item].symbol} size={'24px'}></TokenLogo>
                <Column>
                  <Text title={config.chainInfo[item].name} fontWeight={500}>
                    {config.getBaseCoin(config.chainInfo[item].symbol)}
                    {selectChainId === item}
                  </Text>
                </Column>
              </MenuItem>
            )
          })
        }
      </>
    )
  }

  // console.log(selectedCurrencyBalance)
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
                  disabled
                />
              </>
            )}
            <CurrencySelect1
              selected={!!selectChainId}
              className="open-currency-select-button"
            >
              <Aligner>
                <TokenLogoBox>
                  <TokenLogo symbol={currency?.symbol} size={'24px'} />
                </TokenLogoBox>
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : config.getBaseCoin(currency?.symbol)) || t('selectToken')}
                  {selectChainId ? '-' + config.chainInfo[selectChainId].suffix : ''}
                </StyledTokenName>
              </Aligner>
            </CurrencySelect1>

            <CurrencySelect
              selected={!!selectChainId}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
              style={{marginLeft: "10px"}}
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
          </InputRow>
        </Container>
      </InputPanel>
      {!disableCurrencySelect && onChainSelect && (
        <Modal isOpen={modalOpen} onDismiss={handleDismissSearch} maxHeight={80} minHeight={80}>
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
              {chainListView()}
            </div>
          </Column>
        </Modal>
      )}
    </>
  )
}
