import React, {useCallback, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {ChevronDown} from 'react-feather'
import { Text } from 'rebass'
import axios from 'axios'

import ModalContent from '../../components/Modal/ModalContent'
import Column from '../../components/Column'
import { MenuItem } from '../../components/SearchModal/styleds'
import TokenLogo from '../../components/TokenLogo'

// import { useActiveWeb3React } from '../../hooks'
import { useNFT721Contract } from '../../hooks/useContract'
import {useNFT721GetTokenidListCallback} from '../../hooks/useNFTCallback'

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

export function TokenidLogo ({
  size,
  selectCurrency,
  selectTokenId,
  type
}: {
  size?:any
  selectCurrency?:any
  selectTokenId?:any
  type?:any
}) {
  const [logo, setLogo] = useState<any>()

  const contract721 = useNFT721Contract(selectCurrency)

  useEffect(() => {
    try {
      if (contract721 && selectTokenId) {
        contract721.tokenURI(selectTokenId).then((tokenidUri:any) => {
          // console.log(tokenidUri)
          if (tokenidUri) {
            axios.get(tokenidUri).then(res => {
              // console.log(res)
              if (res?.data?.image) {
                setLogo(res?.data?.image)
              } else {
                setLogo('')
              }
            })
          } else {
            setLogo('')
          }
        }).catch((err:any) => {
          console.log(err)
          setLogo('')
        })
      } else {
        setLogo('')
      }
      
    } catch (error) {
      setLogo('')
    }
  }, [selectTokenId])
  if (type) {
    return <img src={logo} />
  }
  return (
    <TokenLogo logoUrl={logo} size={size}></TokenLogo>
  )
}

export default function SelectCurrencyPanel ({
  tokenlist = {},
  selectCurrency,
  selectTokenId,
  onSelectCurrency,
  onSelectTokenId
}: SelectCurrencyProps) {
  const { t } = useTranslation()
  // const { account, chainId } = useActiveWeb3React()
  const [modalCurrencyOpen, setModalCurrencyOpen] = useState(false)
  const [modalTokenidOpen, setModalTokenidOpen] = useState(false)
  // const [tokenidList, setTokenidList] = useState<any>()

  // const contract721 = useNFT721Contract(selectCurrency)

  const {tokenidList} = useNFT721GetTokenidListCallback(selectCurrency)
  
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
        title={t('selectTokenId')}
        onDismiss={() => {
          setModalTokenidOpen(false)
        }}
        padding={'0rem'}
      >
        {
          // Object.keys(tokenidList).map((item:any, index) => {
            tokenidList && Object.keys(tokenidList).sort().map((item:any, index:any) => {
            const isSelected = item === selectTokenId
            return (
              <MenuItem
                className={`token-item-${index}`}
                onClick={() => (isSelected ? null : handleSelectTokenid(item))}
                disabled={isSelected}
                key={index}
                // selected={otherSelected}
              >
                <TokenLogo logoUrl={tokenidList[item]?.image} size={'24px'}></TokenLogo>
                {/* <TokenidLogo size="24px" selectCurrency={selectCurrency} selectTokenId={item} /> */}
                <Column>
                  <Text title={item} fontWeight={500}>
                    {item}
                    {/* <Text fontSize={'10px'}>{item ? item : ''}</Text> */}
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
          <TokenLogo logoUrl={selectTokenId && tokenidList[selectTokenId]?.image} size={'46px'}></TokenLogo>
          {/* <TokenidLogo size="46px" selectCurrency={selectCurrency} selectTokenId={selectTokenId} /> */}
          {
            selectTokenId ? (
              selectTokenId
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