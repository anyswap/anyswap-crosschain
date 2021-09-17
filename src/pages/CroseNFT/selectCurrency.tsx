import React, {useCallback, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ChevronDown} from 'react-feather'
import { Text } from 'rebass'

import ModalContent from '../../components/Modal/ModalContent'
import Column from '../../components/Column'
import { MenuItem } from '../../components/SearchModal/styleds'
import TokenLogo from '../../components/TokenLogo'

// import {useNFT721GetTokenidListCallback, useNFT721GetAllTokenidListCallback} from '../../hooks/useNFTCallback'
// import {useNFT721GetTokenidListCallback} from '../../hooks/useNFTCallback'
// import {useNFT721GetAllTokenidListCallback, useNftState} from '../../state/nft/hooks'
import {useNFT721GetAllTokenidListCallback} from '../../state/nft/hooks'

interface SelectCurrencyProps {
  tokenlist?: any
  selectCurrency?: any
  selectTokenId?: any
  tokenidUri?: any
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
  width:48%;
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
  // const { chainId } = useActiveWeb3React()
  // useNFT721GetAllTokenidListCallback(tokenlist ? tokenlist : {})

  const [modalCurrencyOpen, setModalCurrencyOpen] = useState(false)
  const [modalTokenidOpen, setModalTokenidOpen] = useState(false)

  // const tokenidInfo:any = useNftState()
  const tokenidInfo:any = useNFT721GetAllTokenidListCallback(tokenlist ? tokenlist : {})
  // console.log(tokenidInfo)

  const tokenidList = useMemo(() => {
    const arr:any = []
    if (tokenidInfo[selectCurrency]) {
      const list = Object.keys(tokenidInfo[selectCurrency]).sort()
      for (const tid of list) {
        arr.push({
          ...tokenidInfo[selectCurrency][tid],
          tokenid: tid
        })
      }
    }
    // console.log(arr)
    return arr
  }, [tokenidInfo, selectCurrency])

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

  return (
    <>
      <ModalContent
        isOpen={modalCurrencyOpen}
        title={t('selectToken')}
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
                    <Text fontSize={'10px'}>{tokenlist[item].name ? tokenlist[item].name : item}</Text>
                  </Text>
                </Column>
              </MenuItem>
            )
          })
        }
      </ModalContent>

      <ModalContent
        isOpen={modalTokenidOpen}
        title={t('selectTokenId')}
        onDismiss={() => {
          setModalTokenidOpen(false)
        }}
        padding={'0rem'}
      >
        {
          tokenidList.map((item:any, index:any) => {
            // tokenidList && Object.keys(tokenidList).sort().map((item:any, index:any) => {
            const isSelected = item.tokenid === selectTokenId?.tokenid
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (isSelected ? null : handleSelectTokenid(item))}
                disabled={isSelected}
                key={index}
                // selected={otherSelected}
              >
                <TokenLogo logoUrl={item?.image} size={'24px'}></TokenLogo>
                <Column>
                  <Text title={item.tokenid} fontWeight={500}>
                    {item?.name ? item.name : item.tokenid}
                    {/* <Text fontSize={'10px'}>{item ? tokenidList[item].name : ''}</Text> */}
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
          <TokenLogo symbol={tokenlist[selectCurrency]?.symbol} logoUrl={tokenlist[selectCurrency]?.logoUrl} size={'46px'}></TokenLogo>
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
          <TokenLogo logoUrl={selectTokenId?.image} size={'46px'}></TokenLogo>
          {
            selectTokenId ? (
              selectTokenId?.name ? selectTokenId?.name : selectTokenId?.tokenid
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