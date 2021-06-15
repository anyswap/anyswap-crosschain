
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useTokenBalancesList } from '../../state/wallet/hooks'

import TokenLogo from '../../components/TokenLogo'
import AppBody from '../AppBody'
import Title from '../../components/Title'

import SearchIcon from '../../assets/images/icon/search.svg'
import { ReactComponent as Dropup } from '../../assets/images/dropup-blue.svg'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'

import config from '../../config'

import {getAllToken} from '../../utils/bridge/getBaseInfo'
import {fromWei, formatDecimal} from '../../utils/tools/tools'
import { isAddress } from '../../utils'

import {
  SearchBox,
  SearchInput,
  MyBalanceBox,
  TitleAndSearchBox,
  MyBalanceTokenBox,
  DBThead,
  DBTh,
  DBTbody,
  DBTd,
  TokenTableCoinBox,
  TokenTableLogo,
  TokenNameBox,
  TokenActionBtnSwap,
  MoreBtnBox,
  DBTables,
} from './styleds'

const WrappedDropup = ({ ...rest }) => <Dropup {...rest} />
export const ColoredDropup = styled(WrappedDropup)`
  margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.textColorBold};
  }
`

const WrappedDropdown = ({ ...rest }) => <Dropdown {...rest} />
export const ColoredDropdown = styled(WrappedDropdown)`
  margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.textColorBold};
  }
`

export default function DashboardDtil() {
  const { account, chainId } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  const [poolArr, setPoolArr] = useState<Array<string>>()

  const [allTokenArr, setAllTokenArr] = useState<Array<string>>()
  const [allTokenList, setAllTokenList] = useState<any>()

  const ETHBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  useEffect(() => {
    getAllToken(chainId).then((res:any) => {
      // console.log(res)
      if (res) {
        const ulist:any = []
        const alist:any = []
        const tlist:any = {}
        const anyToken = config.getCurChainInfo(chainId)?.anyToken
        if (anyToken) {
          tlist[anyToken] = {
            "address": anyToken,
            "chainId": chainId,
            "decimals": 18,
            "name": "Anyswap",
            "symbol": "ANY",
            "underlying": '',
            "destChain": '',
            "isView": 1
          }
          alist.push(anyToken)
        }
        for (const token in res) {
          if (!isAddress(token)) continue
          if (res[token].list.underlying) {
            ulist.push(res[token].list.underlying.address)
          }
          tlist[token.toLowerCase()] = {
            "address": token,
            "chainId": chainId,
            "decimals": res[token].list.decimals,
            "name": res[token].list.name,
            "symbol": res[token].list.symbol,
            "underlying": res[token].list.underlying,
            "destChain": res[token].list.destChain,
          }
          alist.push(token)
        }
        setAllTokenList(tlist)
        setPoolArr(ulist)
        setAllTokenArr(alist)
      }
    })
  }, [])

  const [searchBalance, setSearchBalance] = useState('')
  const [showMore, setShowMore] = useState(false)

  const [uList, uListLoading] = useTokenBalancesList(account ?? undefined, poolArr)
  const [uAllList, uAllListLoading] = useTokenBalancesList(account ?? undefined, allTokenArr)

  const formatUList = useMemo(() => {
    if (!uListLoading) {
      const obj:any = {}
      for (const token in uList) {
        obj[token.toLowerCase()] = uList[token]
      }
      return obj
    }
    return ''
  }, [uList, uListLoading])

  const formatUAllList = useMemo(() => {
    if (!uAllListLoading) {
      const obj:any = {}
      for (const token in uAllList) {
        obj[token.toLowerCase()] = uAllList[token]
      }
      return obj
    }
    return ''
  }, [uAllList, uAllListLoading])
  const tokenList = useMemo(() => {
    const l:any = []
    if (account && !uListLoading && !uAllListLoading) {
      for (const token in allTokenList) {
        let balance:any = formatUAllList && formatUAllList[token] ? formatUAllList[token] : ''
        let underlyingBlance:any = ''
        let totalBlance:any = 0
        if (allTokenList[token]?.underlying) {
          balance = formatUList && formatUList[allTokenList[token]?.underlying?.address?.toLowerCase()] ? formatUList[allTokenList[token]?.underlying?.address?.toLowerCase()] : ''
          underlyingBlance = formatUAllList && formatUAllList[token] ? formatUAllList[token] : ''
        }
        const dec = allTokenList[token].decimals
        if (ETHBalance && config.getCurChainInfo(chainId)?.nativeToken &&  token === config.getCurChainInfo(chainId).nativeToken.toLowerCase()) {
          balance = ETHBalance ? formatDecimal(ETHBalance.toSignificant(6), 2) : '0'
        } else {
          balance = balance ? fromWei(balance, dec) : '0'
        }
        underlyingBlance = underlyingBlance ? fromWei(underlyingBlance, dec) : '0'
        if (balance && underlyingBlance) {
          totalBlance = Number(balance) + Number(underlyingBlance)
        } else if (balance) {
          totalBlance = balance
        } else if (underlyingBlance) {
          totalBlance = underlyingBlance
        }
        l.push({
          ...allTokenList[token],
          balance: balance,
          poolBlance: underlyingBlance,
          totalBlance: totalBlance
        })
      }
    } else {
      for (const token in allTokenList) {
        l.push({
          ...allTokenList[token]
        })
      }
    }
    return l
  }, [formatUList, formatUAllList, allTokenList])
  // console.log(tokenList)
  function searchBox() {
    return (
      <>
        <SearchBox>
          <div className="icon">
            <img src={SearchIcon} alt={''} />
          </div>
          <SearchInput
            placeholder={t('searchToken')}
            onChange={(e: any) => {
              setSearchBalance(e.target.value)
            }}
          ></SearchInput>
        </SearchBox>
      </>
    )
  }
  return (
    <>
      <AppBody>
        <Title title={t('dashboard')}></Title>
        <MyBalanceBox>
          <TitleAndSearchBox>
            <h3>{t('myBalance')}</h3>
            {searchBox()}
          </TitleAndSearchBox>
          <MyBalanceTokenBox className={showMore ? 'showMore' : ''}>
            <DBTables>
              <DBThead>
                <tr>
                  <DBTh className="c">{t('Coins')}</DBTh>
                  <DBTh className="r">{t('balances')}</DBTh>
                  <DBTh className="r">{t('lr')}</DBTh>
                  <DBTh className="r">{t('TotalBalance')}</DBTh>
                  <DBTh className="c">{t('Action')}</DBTh>
                </tr>
              </DBThead>
              <DBTbody>
                {tokenList.length > 0 ? (
                  tokenList.map((item:any, index:any) => {
                    if (
                      !searchBalance
                      || (item?.name && item?.name.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                      || (item?.symbol && item?.symbol.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                      || (item?.address && item?.address.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                      || (item?.underlying?.address && item?.underlying?.address.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                      || (item?.underlying?.symbol && item?.underlying?.symbol.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                      || (item?.underlying?.name && item?.underlying?.name.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                    ) {
                      return (
                        <tr key={index}>
                          <DBTd>
                            <TokenTableCoinBox>
                              <TokenTableLogo>
                                <TokenLogo
                                  symbol={config.getBaseCoin(item?.underlying?.symbol ? item?.underlying?.symbol : item?.symbol, chainId)}
                                  size={'1.625rem'}
                                ></TokenLogo>
                              </TokenTableLogo>
                              <TokenNameBox>
                                <h3>{config.getBaseCoin(item?.underlying?.symbol ? item?.underlying?.symbol : item?.symbol, chainId)}</h3>
                                <p>{config.getBaseCoin(item?.underlying?.name ? item?.underlying?.name : item?.name, chainId, 1)}</p>
                              </TokenNameBox>
                            </TokenTableCoinBox>
                          </DBTd>
                          <DBTd className="r">{item.balance || item.balance === 0 ? formatDecimal(item.balance, 2) : '-'}</DBTd>
                          <DBTd className="r">{item.poolBlance || item.poolBlance === 0 ? formatDecimal(item.poolBlance, 2) : '-'}</DBTd>
                          <DBTd className="r">{item.totalBlance || item.totalBlance === 0 ? formatDecimal(item.totalBlance, 2) : '-'}</DBTd>
                          <DBTd className="c">
                            {
                              item.isView ? '' : (
                                <span style={{ display: 'inline-block' }}>
                                  <TokenActionBtnSwap to={'/swap?bridgetoken=' + item?.address}>
                                    {t('swap')}
                                  </TokenActionBtnSwap>
                                </span>
                              )
                            }
                          </DBTd>
                        </tr>
                      )
                    } else {
                      return (
                        <tr key={index} style={{ display: 'none' }}>
                          <DBTd className="c">-</DBTd>
                          <DBTd className="c">-</DBTd>
                          <DBTd className="c">-</DBTd>
                          <DBTd className="c">-</DBTd>
                          <DBTd className="c">-</DBTd>
                        </tr>
                      )
                    }
                  })
                ) : (
                  <tr key={0}>
                    <DBTd className="c">-</DBTd>
                    <DBTd className="c">-</DBTd>
                    <DBTd className="c">-</DBTd>
                    <DBTd className="c">-</DBTd>
                    <DBTd className="c">-</DBTd>
                  </tr>
                )}
              </DBTbody>
            </DBTables>
          </MyBalanceTokenBox>
          <MoreBtnBox
            onClick={() => {
              setShowMore(!showMore)
            }}
          >
            {showMore ? (
              <>
                <ColoredDropup></ColoredDropup>
                {t('pichUp')}
              </>
            ) : (
              <>
                <ColoredDropdown></ColoredDropdown>
                {t('showMore')}
              </>
            )}
          </MoreBtnBox>
        </MyBalanceBox>
      </AppBody>
    </>
  )
}
