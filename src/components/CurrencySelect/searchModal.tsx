
import React, { KeyboardEvent, useState, RefObject, useCallback, useEffect, useRef, useMemo } from 'react'
import { Currency, Token, ETHER } from 'anyswap-sdk'
import { Text } from 'rebass'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useTranslation } from 'react-i18next'

import Column from '../Column'
import { RowBetween } from '../Row'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { PaddedColumn, SearchInput, Separator } from '../SearchModal/styleds'
import { filterTokens } from '../SearchModal/filtering'
import { useTokenComparator } from '../SearchModal/sorting'
import Row from '../Row'

import CommonBases from './CommonBases'

import { CloseIcon } from '../../theme'

import { isAddress } from '../../utils'

import { useLocalToken } from '../../hooks/Tokens'
import CurrencyList from './CurrencyList'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  // onlyUnderlying?: boolean
  allTokens?: any
  chainId?: any
  bridgeKey?: any
  allBalances?: any
  showETH?: any
  selectDestChainId?: any
}

export default function SearchModal ({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  // onlyUnderlying,
  allTokens = {},
  chainId,
  bridgeKey,
  // allBalances,
  showETH,
  selectDestChainId
}: CurrencySearchModalProps) {
  const { t } = useTranslation()
  const {tokenComparator, balances: allBalances} = useTokenComparator(bridgeKey, chainId, false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [intervalCount, setIntervalCount] = useState<any>(0)

  const inputRef = useRef<HTMLInputElement>()

  const isAddressSearch = isAddress(searchQuery)
  const useAllTokenList = useMemo(() => {
    const list:any = {}
    for (const token in allTokens) {
      const obj:any = allTokens[token].tokenInfo ? allTokens[token].tokenInfo : allTokens[token]
      list[token] = {
        ...obj
      }
    }
    return list
  }, [allTokens])
  const searchToken = useLocalToken(searchQuery && useAllTokenList[searchQuery?.toLowerCase()] ? useAllTokenList[searchQuery?.toLowerCase()] : '')

  const tokenList = useMemo(() => {
    const arr:any = []
    // const mainTokenLists:any = []
    for (const token in useAllTokenList) {
      const obj:any = useAllTokenList[token]
      arr.push(obj)
    }
    return arr
  }, [useAllTokenList])

  const mainTokenList = useMemo(() => {
    const arr:any = []
    for (const token in allTokens) {
      const obj:any = allTokens[token].tokenInfo ? allTokens[token].tokenInfo : allTokens[token]
      if (
        (obj.symbol === 'USDT' && obj.chainId === '250')
        || (obj.address === '0xf5c8054efc6acd25f31a17963462b90e82fdecad' && obj.chainId === '250')
        || ['MultichainUSDC', 'MultichainDAI'].includes(obj.name)
      ) continue
      
      if (['USDC', 'ETH', 'ETHK', 'DAI', 'WBTC', 'USDT', 'MIM', 'BTC', 'BTCB', 'USDC.e', 'WBTC.e', 'WETH', 'fUSDT'].includes(obj.symbol)) {
        arr.push(obj)
      }
    }
    return arr
  }, [useAllTokenList])

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(tokenList), searchQuery)
  }, [isAddressSearch, searchToken, tokenList, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    // console.log(searchToken)
    if (searchToken) return [searchToken]
    // console.log(filteredTokens)
    const sorted = filteredTokens.sort(tokenComparator)
    // console.log(sorted)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted
    const arr = [
      ...(searchToken ? [searchToken] : []),
      // 首先对任何完全匹配的符号进行排序
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
    // console.log(arr)
    setTimeout(() => {
      setIntervalCount(1)
    }, 500)
    if (arr.length > 50 && intervalCount === 0) {
      return arr.splice(0, 50)
    } else {
      return arr
    }
  }, [searchQuery, searchToken, tokenComparator, filteredTokens, intervalCount])

  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    // fixedList.current?.scrollTo(0)
  }, [])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (onCurrencySelect) {
        onCurrencySelect(currency)
        onDismiss()
      }
    },
    [onCurrencySelect]
  )
  
  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    // [searchQuery]
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )
    // console.log(filteredSortedTokens)
  // console.log(isOpen)
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              {t('selectToken')}
              <QuestionHelper text={t('tip6')} />
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={t('tokenSearchPlaceholder')}
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </Row>
          {mainTokenList.length > 0 ? (
            <CommonBases
            // chainId={chainId}
            selectedCurrency={selectedCurrency}
            onSelect={handleCurrencySelect}
            tokenList = {mainTokenList}
            />
          ) : ''}
        </PaddedColumn>
        <Separator />
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <>
                <CurrencyList
                  height={height}
                  showETH={showETH}
                  currencies={filteredSortedTokens}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  allBalances={allBalances}
                  bridgeKey={bridgeKey}
                  selectDestChainId={selectDestChainId}
                  // fixedListRef={fixedList}
                />
              </>
            )}
          </AutoSizer>
        </div>
      </Column>
    </Modal>
  )
}