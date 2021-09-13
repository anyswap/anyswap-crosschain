import React, {useCallback, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ChevronDown} from 'react-feather'
import { Text } from 'rebass'

import ModalContent from '../../components/Modal/ModalContent'
import Column from '../../components/Column'
import { MenuItem } from '../../components/SearchModal/styleds'
import TokenLogo from '../../components/TokenLogo'

interface SelectCurrencyProps {
  tokenlist?: any
  selectCurrency?: any
  selectTokenId?: any
  onSelectCurrency?: (value: any) => void
  onSelectTokenId?: (value: any) => void
}

const SelectCurrencyBox = styled.div`
  ${({ theme }) => theme.flexBC};
  width: 100%;
  background: rgba(0,0,0,0.1);
  padding: 1rem;
  margin: 20px 0;
  border-radius: 10px;
`
const SelectCurrencyView = styled.div`
  ${({ theme }) => theme.flexBC};
  width:40%;
  cursor:pointer;
  .txt {
    margin:0;
  }
`


export default function SelectCurrencyPanel ({
  tokenlist = {},
  selectCurrency,
  selectTokenId,
  onSelectCurrency,
  onSelectTokenId
}: SelectCurrencyProps) {
  const { t } = useTranslation()

  const [modalCurrencyOpen, setModalCurrencyOpen] = useState(false)
  const [modalTokenidOpen, setModalTokenidOpen] = useState(false)
  // console.log(selectCurrency)
  // console.log(selectTokenId)
  const handleSelectCurrency = useCallback((value) => {
    // console.log(value)
    if (onSelectCurrency) {
      onSelectCurrency(value)
      setModalCurrencyOpen(false)
    }
  }, [onSelectCurrency, setModalCurrencyOpen])

  const handleSelectTokenid = useCallback((value) => {
    // console.log(value)
    if (onSelectTokenId) {
      onSelectTokenId(value)
      setModalTokenidOpen(false)
    }
  }, [onSelectTokenId, setModalTokenidOpen])

  const tokenidList = useMemo(() => {
    if (tokenlist && tokenlist[selectCurrency]) {
      return tokenlist[selectCurrency].tokenidList
    }
    return {}
  }, [tokenlist, selectCurrency])
  return (
    <>
      <ModalContent
        isOpen={modalCurrencyOpen}
        title={t('selectNetwork')}
        onDismiss={() => {
          setModalCurrencyOpen(false)
        }}
        padding={'0rem'}
      >
        {
          Object.keys(tokenlist).map((item:any, index) => {
            const isSelected = item === selectCurrency
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (isSelected ? null : handleSelectCurrency(item))}
                disabled={isSelected}
                key={index}
                // selected={otherSelected}
              >
                <TokenLogo symbol={tokenlist[item].symbol} logoUrl={tokenlist[item]?.logoUrl} size={'24px'}></TokenLogo>
                <Column>
                  <Text title={tokenlist[item].name} fontWeight={500}>
                    {tokenlist[item].symbol}
                    <Text fontSize={'10px'}>{tokenlist[item].name ? tokenlist[item].name : ''}</Text>
                  </Text>
                </Column>
              </MenuItem>
            )
          })
        }
      </ModalContent>

      <ModalContent
        isOpen={modalTokenidOpen}
        title={t('selectNetwork')}
        onDismiss={() => {
          setModalTokenidOpen(false)
        }}
        padding={'0rem'}
      >
        {
          Object.keys(tokenidList).map((item:any, index) => {
            const isSelected = item === selectCurrency
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (isSelected ? null : handleSelectTokenid(item))}
                disabled={isSelected}
                key={index}
                // selected={otherSelected}
              >
                <TokenLogo symbol={tokenidList[item].symbol} logoUrl={tokenidList[item]?.logoUrl} size={'24px'}></TokenLogo>
                <Column>
                  <Text title={tokenidList[item].name} fontWeight={500}>
                    {tokenidList[item].symbol}
                    <Text fontSize={'10px'}>{tokenidList[item].name ? tokenidList[item].name : ''}</Text>
                  </Text>
                </Column>
              </MenuItem>
            )
          })
        }
      </ModalContent>

      <SelectCurrencyBox>
        <SelectCurrencyView onClick={() => {
          setModalCurrencyOpen(true)
        }}>
          {
            selectCurrency ? (
              tokenlist[selectCurrency]?.name
            ) : (
              <p className="txt">{t('selectToken')}</p>
            )
          }
          <ChevronDown />
        </SelectCurrencyView>
        <SelectCurrencyView onClick={() => {
          setModalTokenidOpen(true)
        }}>
          {
            selectTokenId ? (
              tokenidList[selectTokenId]?.name
            ) : (
              <p className="txt">{t('selectTokenId')}</p>
            )
          }
          <ChevronDown />
        </SelectCurrencyView>
      </SelectCurrencyBox>
    </>
  )
}