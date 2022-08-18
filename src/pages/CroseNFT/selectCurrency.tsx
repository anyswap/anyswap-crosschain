import React, {useCallback, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ChevronDown} from 'react-feather'
import { Text } from 'rebass'

import ModalContent from '../../components/Modal/ModalContent'
import Column from '../../components/Column'
import { MenuItem } from '../../components/SearchModal/styleds'
import TokenLogo from '../../components/TokenLogo'

import { useActiveWeb3React } from '../../hooks'
import {useNFT721GetAllTokenidListCallback, useNFT1155GetAllTokenidListCallback, ERC_TYPE, useNftInfo} from '../../state/nft/hooks'
// import {useNFT721GetAllTokenidListCallback, useNFT1155GetAllTokenidListCallback} from '../../state/nft/hooks'

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

const BalanceTxt = styled.div`
  width: 100%;
  font-size: 14px;
`

export default function SelectCurrencyPanel ({
  tokenlist = {},
  selectCurrency,
  selectTokenId,
  onSelectCurrency,
  onSelectTokenId
}: SelectCurrencyProps) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [modalCurrencyOpen, setModalCurrencyOpen] = useState(false)
  const [modalTokenidOpen, setModalTokenidOpen] = useState(false)

  const tokenidInfo721:any = useNFT721GetAllTokenidListCallback(tokenlist ? tokenlist : {})
  const tokenidInfo1155:any = useNFT1155GetAllTokenidListCallback(tokenlist ? tokenlist : {})
  const nftInfo = useNftInfo()
  const tokenidList = useMemo(() => {
    const arr:any = []
    const token = selectCurrency?.address
    if (tokenidInfo721[token]) {
      const list = Object.keys(tokenidInfo721[token]).sort()
      for (const tid of list) {
        arr.push({
          ...tokenidInfo721[token][tid],
          tokenid: tid
        })
      }
    } else if (tokenidInfo1155 && tokenidInfo1155[token]) {
      const list = Object.keys(tokenidInfo1155[token]).sort()
      for (const tid of list) {
        arr.push({
          ...tokenidInfo1155[token][tid],
          tokenid: tid
        })
      }
    }
    // console.log(selectCurrency)
    // console.log(token)
    // console.log(tokenidInfo721)
    // console.log(tokenidInfo1155)
    // console.log(arr)
    return arr
  }, [tokenidInfo721, tokenidInfo1155, selectCurrency])

  const tokenList = useMemo(() => {
    const arr:any = []
    for (const token in tokenlist) {
      arr.push({
        ...tokenlist[token],
        address: token
      })
    }
    return arr
  }, [tokenlist])


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
          // Object.keys(tokenlist).map((item:any, index) => {
          tokenList.map((item:any, index:any) => {
            const isSelected = item?.address === selectCurrency?.address
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (isSelected ? null : handleSelectCurrency(item))}
                disabled={isSelected}
                key={index}
              >
                <TokenLogo symbol={item.symbol} logoUrl={item?.logoUrl} size={'24px'}></TokenLogo>
                <Column>
                  <Text title={item.name} fontWeight={500}>
                    {item.symbol}
                    <Text fontSize={'10px'}>{item.name ? item.name : ''}</Text>
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
                <TokenLogo logoUrl={nftInfo?.[selectCurrency?.address]?.[item?.tokenid]?.imageUrl} size={'24px'}></TokenLogo>
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
          <TokenLogo symbol={selectCurrency?.symbol} logoUrl={selectCurrency?.logoUrl} size={'46px'}></TokenLogo>
          {
            selectCurrency ? (
              selectCurrency?.name
            ) : (
              <p className="txt">{t('selectToken')}</p>
            )
          }
          <ChevronDown />
        </SelectCurrencyView>
        <SelectCurrencyView onClick={() => {
          setModalTokenidOpen(true)
        }}>
          <TokenLogo logoUrl={nftInfo?.[selectCurrency?.address]?.[selectTokenId?.tokenid]?.imageUrl} size={'46px'}></TokenLogo>
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
      {
        account && selectCurrency?.nfttype === ERC_TYPE.erc1155 ? (
          <BalanceTxt>
            {t('balance')}{selectTokenId?.balance ? selectTokenId?.balance : '-'}
          </BalanceTxt>
        ) : ''
      }
    </>
  )
}