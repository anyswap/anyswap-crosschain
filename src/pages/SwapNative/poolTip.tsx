import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import config from '../../config'

import { useActiveWeb3React } from '../../hooks'
// import {useTokenBalancesWithLoadingIndicator, useTokenTotalSupplyWithLoadingIndicator} from '../../state/wallet/hooks'

// import {fromWei} from '../../utils/tools/tools'
// import {getNodeBalance, getNodeTotalsupply} from '../../utils/bridge/getBalance'
// import {getNodeTotalsupply} from '../../utils/bridge/getBalance'

// import TokenLogo from '../../components/TokenLogo'
// import config from '../../config'

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

// const PoolList = styled.ul`
// padding-left: 15px;
// list-style:none;
// margin: 0;
// li {
//     ${({ theme }) => theme.flexSC};
//     margin-bottom: 5px;
//   }
// `

export default function PoolTip ({
  anyCurrency,
  bridgeConfig
}: {
  anyCurrency: any
  bridgeConfig: any
}) {
  // const { account, chainId } = useActiveWeb3React()
  // const { account } = useActiveWeb3React()
  const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  
  // const list = [anyCurrency]
  // console.log(anyCurrency)
  // const [userTokenList, userTokenLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, list)
  // const [totalsupplyList, totalsupplyLoading] = useTokenTotalSupplyWithLoadingIndicator(list)
  // const dec = anyCurrency?.decimals

  // const [outChainBalance, setOutChainBalance] = useState<any>()
  // console.log(outChainBalance)
  // const poolsView = useMemo(() => {
  //   if (!totalsupplyLoading) {
  //     const l1:any = {}
  //     for (const token in totalsupplyList) {
  //       // console.log(totalsupplyList[token]?.raw.toString())
  //       const balance = totalsupplyList[token]
  //       // console.log(token)
  //       // console.log(balance?.raw.toString())
  //       l1[token.toLowerCase()] = {
  //         balance: balance,
  //         viewBalance: fromWei(balance?.raw.toString(), dec)
  //       }
  //     }

  //     return l1
  //   }
  //   return ''
  // }, [totalsupplyList, totalsupplyLoading])

  // const usersView = useMemo(() => {
  //   if (!userTokenLoading) {
  //     const l1:any = {}
  //     for (const token in userTokenList) {
  //       // console.log(userTokenList[token]?.raw.toString())
  //       const balance = userTokenList[token]
  //       l1[token.toLowerCase()] = {
  //         balance: balance,
  //         viewBalance: fromWei(balance?.raw.toString(), dec)
  //       }
  //     }

  //     return l1
  //   }
  //   return ''
  // }, [userTokenList, userTokenLoading])

  // function formatPercent (n1:any, n2:any) {
  //   if (!n1 || !n2) return ''
  //   const n = (Number(n1) / Number(n2)) * 100
  //   if (n < 0.01) {
  //     return '(<0.01%)'
  //   } else {
  //     return '(' + n.toFixed(2) + '%)'
  //   }
  // }
  // async function getAllOutBalance (account:any) {
  //   const list:any = []
  //   // for (const c in bridgeConfig.destChain) {
  //   //   const destToken = bridgeConfig.destChain[c].token
  //   //   const obj:any = await getNodeTotalsupply(destToken, c, bridgeConfig.destChain[c].decimals, account)
  //   //   // console.log(obj)
  //   //   const ts = obj[destToken].ts
  //   //   const bl = obj[destToken].balance
  //   //   list.push({
  //   //     chainId: c,
  //   //     balance: bl,
  //   //     totalsupply: ts,
  //   //     percent: formatPercent(bl, ts)
  //   //   })
  //   // }
    // console.log(bridgeConfig)
  //   const token = bridgeConfig.address
  //   const obj:any = await getNodeTotalsupply(token, chainId, bridgeConfig.decimals, account)
  //   // console.log(obj)
  //   const ts = obj[token].ts
  //   const bl = obj[token].balance
  //   list.push({
  //     chainId: chainId,
  //     balance: bl,
  //     totalsupply: ts,
  //     percent: formatPercent(bl, ts)
  //   })
  //   // console.log(list)
  //   return list
  // }
  // useEffect(() => {
  //   // console.log(bridgeConfig)
  //   if (bridgeConfig) {
  //     getAllOutBalance(account).then((res:any) => {
  //       // console.log(res)
  //       setOutChainBalance(res)
  //     })
  //   }
  // }, [bridgeConfig, account])

  return (
    <SubCurrencySelectBox>
      <dl className='list'>
        {/* <dd>
          <i></i>
          {t('currentPoolSize')}:
          {
            !totalsupplyLoading && poolsView ? (
              <>
                {(poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.underlying?.symbol)}
              </>
            ) : ''
          }
        </dd>
        <dd>
          <i></i>
          {t('yourPoolShare')}:
          {
            !userTokenLoading && usersView && account ? (
              <>
                {(
                  (usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.underlying?.symbol)
                  +
                  (
                    formatPercent(
                      usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance,
                      poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance
                    )
                  )
                )}
              </>
            ) : ''
          }
        </dd> */}
        <dd>
          <i></i>
          {t('currentPoolSize') + ' '}: 
          {
            bridgeConfig ? (
              <>
                {(bridgeConfig.anyTotalsupply + ' ' + anyCurrency?.symbol)}
              </>
            ) : ''
          }
        </dd>
        <dd>
          <i></i>
          {t('yourPoolShare') + ' '}: 
          {
            bridgeConfig ? (
              <>
                {(
                  (bridgeConfig.balance + ' ' + anyCurrency?.symbol)
                  +
                  bridgeConfig.percent
                )}
              </>
            ) : ''
          }
        </dd>
        <dd>
          <i></i>
          {t('UnderlyingLiquidity') + ' '}: 
          {
            bridgeConfig ? (
              <>
                {(bridgeConfig.totalsupply + ' ' + config.getBaseCoin(anyCurrency?.underlying?.symbol, chainId))}
              </>
            ) : ''
          }
        </dd>
      </dl>
      {/* <dl className='list'>
        <dd>
          <i></i>
          {t('currentPoolSize')}:
          <PoolList>
            <li>
              {
                !userTokenLoading && usersView && account ? (
                  <>
                    <TokenLogo symbol={config.getCurChainInfo(chainId)?.symbol} size={'16px'} style={{margin: '0 5px'}} />
                    {(
                      (usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.underlying?.symbol)
                      +
                      (
                        formatPercent(
                          usersView[anyCurrency?.address?.toLowerCase()]?.viewBalance,
                          poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance
                        )
                      )
                      + '(User)'
                    )}
                  </>
                ) : ''
              }
              {!userTokenLoading && usersView && account && !totalsupplyLoading && poolsView ? '/' : ''}
              {
                !totalsupplyLoading && poolsView ? (
                  <>
                    {(poolsView[anyCurrency?.address?.toLowerCase()]?.viewBalance + ' ' + anyCurrency?.underlying?.symbol)}
                  </>
                ) : ''
              }
            </li>
            {
              outChainBalance ? (
                outChainBalance.map((item:any, index:number) => {
                  // if (!item.totalsupply) return ''
                  return (
                    <li key={index}>
                      <TokenLogo symbol={config.getCurChainInfo(item.chainId)?.symbol} size={'16px'} style={{margin: '0 5px'}} />
                      {item.balance ? item.balance : '0.00'} {anyCurrency?.symbol}
                      {item.percent ? item.percent : '(0.00%)'}
                      +
                      {item.totalsupply ? item.totalsupply : '0.00'} {anyCurrency?.symbol}
                    </li>
                  )
                })
              ) : ''
            }
          </PoolList>
        </dd>
      </dl> */}
    </SubCurrencySelectBox>
  )
}