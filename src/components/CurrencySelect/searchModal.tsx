
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

import { CloseIcon } from '../../theme'

import { isAddress } from '../../utils'

import { useToken } from '../../hooks/Tokens'
import CurrencyList from './CurrencyList'

// import {getAllToken} from '../../utils/bridge/getServerInfo'

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
  bridgeKey
}: CurrencySearchModalProps) {
  const { t } = useTranslation()
  const tokenComparator = useTokenComparator(bridgeKey, chainId, false)

  const [searchQuery, setSearchQuery] = useState<string>('')


  const inputRef = useRef<HTMLInputElement>()

  const isAddressSearch = isAddress(searchQuery)

  const searchToken = useToken(searchQuery)

  const tokenList = useMemo(() => {
    const arr:any = []
    for (const token in allTokens) {
      arr.push(allTokens[token].tokenInfo ? allTokens[token].tokenInfo : allTokens[token])
    }
    return arr
  }, [allTokens])

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
    return [
      ...(searchToken ? [searchToken] : []),
      // 首先对任何完全匹配的符号进行排序
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [searchQuery, searchToken, tokenComparator, filteredTokens])

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
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={t('tokenSearchPlaceholder')}
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </PaddedColumn>
        <Separator />
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <>
                <CurrencyList
                  height={height}
                  showETH={false}
                  currencies={filteredSortedTokens}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
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