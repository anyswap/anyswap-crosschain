import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import {useTokenBalancesWithLoadingIndicator, useTokenTotalSupplyWithLoadingIndicator} from '../../state/wallet/hooks'

import {fromWei} from '../../utils/tools/tools'

const SubCurrencySelectBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 1.25rem;
  margin-top: 0.625rem;

  .list {
    margin:0;
    padding: 0 0px 0;
    font-size: 12px;
    color: ${({ theme }) => theme.tipColor};
    dt {
      ${({ theme }) => theme.flexSC};
      font-weight: bold;
      line-height: 1.5;
      img {
        margin-right: 8px;
      }
    }
    dd {
      font-weight: 500;
      line-height: 1.83;
      margin: 0;
      i{
        display:inline-block;
        width:4px;
        height: 4px;
        border-radius:100%;
        background:${({ theme }) => theme.tipColor};
        margin-right: 10px;
      }
    }
  }
`

export default function PoolTip ({
  anyCurrency,
  underlyingCurrency
}: {
  anyCurrency: any
  underlyingCurrency: any
}) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  // console.log(account)
  // console.log(underlyingCurrency)
  // const anyCoinBalance = useCurrencyBalance(account ?? undefined, anyCurrency)
  // const underlyingCoinBalance = useCurrencyBalance(account ?? undefined, underlyingCurrency)
  const list = [anyCurrency, underlyingCurrency]
  const [userTokenList, userTokenLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, list)
  const [totalsupplyList, totalsupplyLoading] = useTokenTotalSupplyWithLoadingIndicator(list)
  const dec = anyCurrency?.decimals
  const poolsView = useMemo(() => {
    if (!totalsupplyLoading) {
      const l1:any = {}
      for (const token in totalsupplyList) {
        // console.log(totalsupplyList[token]?.raw.toString())
        const balance = totalsupplyList[token]
        l1[token.toLowerCase()] = {
          balance: balance,
          viewBalance: fromWei(balance?.raw.toString(), dec)
        }
      }

      return l1
    }
    return ''
  }, [totalsupplyList, totalsupplyLoading])

  const usersView = useMemo(() => {
    if (!userTokenLoading) {
      const l1:any = {}
      for (const token in userTokenList) {
        // console.log(userTokenList[token]?.raw.toString())
        const balance = userTokenList[token]
        l1[token.toLowerCase()] = {
          balance: balance,
          viewBalance: fromWei(balance?.raw.toString(), dec)
        }
      }

      return l1
    }
    return ''
  }, [userTokenList, userTokenLoading])

  function formatPercent (n1:any, n2:any) {
    if (!n1 || !n2) return ''
    const n = (Number(n1) / Number(n2)) * 100
    if (n < 0.01) {
      return '(<0.01%)'
    } else {
      return '(' + n.toFixed(2) + '%)'
    }
  }
  // console.log(tipView)
  return (
    <SubCurrencySelectBox>
      <dl className='list'>
        <dd><i></i>{t('exchangeRate')}: 1:1</dd>
        <dd>
          <i></i>
          {t('currentPoolSize')}: {
            !totalsupplyLoading && poolsView ? (
              (poolsView[underlyingCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + underlyingCurrency?.symbol)
              + ' + ' +
              (poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.symbol)
            ) : ''
          }
        </dd>
        <dd>
          <i></i>
          {t('yourPoolShare')}: {
            !userTokenLoading && usersView && account ? (
              (
                usersView[underlyingCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + underlyingCurrency?.symbol
                +
                (
                  formatPercent(
                    usersView[underlyingCurrency?.address?.toLowerCase()]?.viewBalance,
                    poolsView[underlyingCurrency?.address?.toLowerCase()]?.viewBalance
                  )
                )
              )
              + ' + ' +
              (
                (usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.symbol)
                +
                (
                  formatPercent(
                    usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance,
                    poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance
                  )
                )
              )
            ) : ''
          }
        </dd>
      </dl>
    </SubCurrencySelectBox>
  )
}