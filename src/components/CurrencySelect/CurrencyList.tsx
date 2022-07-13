import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from 'anyswap-sdk'
// import { Currency, CurrencyAmount, ETHER, Token } from 'anyswap-sdk'
import React, { CSSProperties, useMemo, createRef } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveReact } from '../../hooks/useActiveReact'
import { useLocalToken } from '../../hooks/Tokens'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import Column from '../Column'
import { RowFixed } from '../Row'
import TokenLogo from '../TokenLogo'
import { MouseoverTooltip } from '../Tooltip'
import { MenuItem } from '../SearchModal/styleds'
import Loader from '../Loader'
import { LazyList } from '../Lazyload/LazyList';

import config from '../../config'
import {CROSS_BRIDGE_LIST} from '../../config/constant'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const ListBox = styled.div`
  overflow:auto;
`

// function Balance({ balance }: { balance: CurrencyAmount }) {
//   return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(6)}</StyledBalanceText>
// }
function Balance({ balance }: { balance: any }) {
  const isBl = balance instanceof CurrencyAmount ? true : false
  // console.log(balance)
  return <StyledBalanceText title={isBl ? balance.toExact() : balance.balance}>{isBl ? balance.toSignificant(6) : balance.balances.toSignificant(6)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Loading = styled.div`
  line-height: 56px;
  text-align: center;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]
  // console.log(tag)
  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id + Math.random()}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  allBalances,
  ETHBalance,
  bridgeKey,
  selectDestChainId
}: {
  currency: any
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  allBalances?: any
  ETHBalance?: any
  bridgeKey?: any
  selectDestChainId?: any
}) {
  const { account, chainId } = useActiveReact()
  // const { t } = useTranslation()
  const currencyObj = currency
  const key = currencyKey(currencyObj)
  const currencies = useLocalToken(currencyObj)
  // const isNativeToken = config.getCurChainInfo(chainId)?.nativeToken
  // && currencyObj?.address.toLowerCase() === config.getCurChainInfo(chainId)?.nativeToken.toLowerCase()
  // && !CROSS_BRIDGE_LIST.includes(bridgeKey)
  //  ? true : false
  const isNativeToken = currencyObj?.tokenType === 'NATIVE' && !CROSS_BRIDGE_LIST.includes(bridgeKey) ? true : false
  // if (isNativeToken) {
  //   console.log(currencyObj)
  // }
  // const balance = ''
  // const ETHBalance = ''
  // const balance1 = useCurrencyBalance(account ?? undefined, currencies ?? undefined, '', isNativeToken)
  const balance1 = ''
  const balance = useMemo(() => {
    // console.log(currencyObj)
    if (isNaN(chainId)) {
      return ''
    } else {
      if (allBalances && currencies?.address && allBalances[currencies?.address.toLowerCase()] && !isNativeToken) {
        return allBalances[currencies?.address.toLowerCase()]
      } else if (
        isNativeToken
        || currencyObj.address === config.getCurChainInfo(chainId)?.symbol
      ) {
        return ETHBalance
      }
      return balance1
    }
  }, [allBalances, isNativeToken, currencies, isNativeToken, ETHBalance, balance1])
  const isDestChainId = selectDestChainId ? selectDestChainId : chainId
  // console.log(currencyObj)
  // console.log(isNativeToken)
  // console.log(balance)
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <TokenLogo symbol={currencyObj.symbol} logoUrl={currencyObj?.logoUrl} size={'24px'}></TokenLogo>
      <Column>
        <Text title={currencyObj.name} fontWeight={500}>
          {/* {isNativeToken ? config.getBaseCoin(currencyObj.symbol, isDestChainId) : currencyObj.symbol} */}
          {config.getBaseCoin(currencyObj.symbol, isDestChainId)}
          {currencyObj?.type ? (
            ['swapin', 'swapout'].includes(currencyObj?.type) ? ' (Bridge)' : ' (Router ' + currencyObj.sortId + ')'
          ) : ''}
          {/* <Text fontSize={'10px'}>{currencyObj.name ? currencyObj.name : ''}</Text> */}
          <Text fontSize={'10px'}>{currencyObj.name ? config.getBaseCoin(currencyObj.symbol, isDestChainId, 1, currencyObj.name) : ''}</Text>
        </Text>
      </Column>
      <TokenTags currency={currencyObj} />
      {
        selectDestChainId ? null : (
          <RowFixed style={{ justifySelf: 'flex-end' }}>
            {balance ? <Balance balance={balance} /> : (account && chainId && !isNaN(chainId)) ? <Loader stroke="#5f6bfb" /> : null}
          </RowFixed>
        )
      }
    </MenuItem>
  )
}

export default function BridgeCurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  // fixedListRef,
  showETH,
  allBalances,
  bridgeKey,
  selectDestChainId,
  size
}: {
  height: number
  currencies: any[]
  selectedCurrency?: any | null
  onCurrencySelect: (currency: any) => void
  otherCurrency?: any | null
  // fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  allBalances?: any
  bridgeKey?: any
  selectDestChainId?: any
  size?: number
}) {
  const { evmAccount, chainId } = useActiveReact()
  const itemData = useMemo(() => (showETH ? [Currency.ETHER, ...currencies] : currencies), [currencies, showETH])
  const ETHBalance = useETHBalances(evmAccount ? [evmAccount] : [])?.[evmAccount ?? '']
  const pageSize = size || 20
  const boxRef = createRef<any>()
  const watchRef = createRef<any>()
  const { t } = useTranslation()
  // console.log(selectedCurrency)
  const htmlNodes = useMemo(() => {
    const arr = []
    const ethNode:any = []
    for (const obj of itemData) {
      const isNativeToken = obj?.tokenType === 'NATIVE' && !CROSS_BRIDGE_LIST.includes(bridgeKey) ? true : false
      if (
        isNativeToken
        || obj?.address === config.getCurChainInfo(chainId)?.symbol
      ) {
        ethNode.push(obj)
        continue
      }
      arr.push(obj)
    }
    if (ethNode.length > 0) {
      arr.unshift(...ethNode)
    }
    return arr
  }, [itemData, chainId])


  function List({ records }: { records?: any [] }) {
    return (<>{
      records?.map((item:any, index:any) =>{
        const currency: any = item
        // const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
        const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
        const isSelected = Boolean(selectedCurrency?.key?.toLowerCase() === currency?.key?.toLowerCase())
        const handleSelect = () => onCurrencySelect(currency)
        return (
          <CurrencyRow
            style={{margin:'auto'}}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            key={index}
            allBalances={allBalances}
            ETHBalance={ETHBalance}
            bridgeKey={bridgeKey}
            selectDestChainId={selectDestChainId}
          />
        )
      })
    }
    </>);
  }

  return (
    <>
      <ListBox ref={ boxRef } style={{height: height}}>
        <LazyList records={ htmlNodes } pageSize={ pageSize }
          boxRef={ boxRef } watchRef={ watchRef } list={ List }>
          <Loading ref={ watchRef }>{ t('Loading') }...</Loading>
        </LazyList>
        {/* {
          htmlNodes.map((item, index) => {
            const currency: any = item
            // const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
            const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
            const isSelected = Boolean(selectedCurrency?.key?.toLowerCase() === currency?.key?.toLowerCase())
            const handleSelect = () => onCurrencySelect(currency)
            return (
              <CurrencyRow
                style={{margin:'auto'}}
                currency={currency}
                isSelected={isSelected}
                onSelect={handleSelect}
                otherSelected={otherSelected}
                key={index}
                allBalances={allBalances}
                ETHBalance={ETHBalance}
                bridgeKey={bridgeKey}
                selectDestChainId={selectDestChainId}
              />
            )
          })
        } */}
      </ListBox>
    </>
  )
}
