
// import React, { useEffect, useMemo, useState } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {CurrentBridgeInfo} from 'anyswapsdk'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { useTokenBalancesList } from '../../state/wallet/hooks'

import TokenLogo from '../../components/TokenLogo'
import AppBody from '../AppBody'
import Title from '../../components/Title'

import SearchIcon from '../../assets/images/icon/search.svg'
import { ReactComponent as Dropup } from '../../assets/images/dropup-blue.svg'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'

import NextkIcon from '../../assets/images/icon/Next.svg'
import PreviouskIcon from '../../assets/images/icon/Previous.svg'

import config from '../../config'

import {getAllToken} from '../../utils/bridge/getServerInfo'
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

const SelectHDPathPage = styled.div`
  ${({ theme }) => theme.flexBC};
  height: 34px;
  object-fit: contain;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.tipBg};
  padding: 0 1.25rem;
`
const ArrowBox = styled.div`
${({theme}) => theme.flexC}
  font-family: 'Manrope';
  font-size: 0.75rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: ${({theme}) => theme.textColorBold};
  cursor:pointer;
`

const pagesize = 18

export default function DashboardDtil() {
  const { account, chainId } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  const [poolArr, setPoolArr] = useState<Array<string>>()

  const [allTokenArr, setAllTokenArr] = useState<Array<string>>()
  const [allTokenList, setAllTokenList] = useState<any>()
  const [pagecount, setPagecount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const ETHBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  // const totalCount:number = allTokenList ? allTokenList.length : 0

  const getAllTokens = useCallback(() => {
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
        "destChains": '',
        "isView": 1
      }
      alist.push(anyToken)
    }
    const arr:any = []
    const tObj:any = {}
    if (config.getCurConfigInfo().isOpenRouter) {
      arr.push(getAllToken(chainId))
      tObj.router = 1
    } else {
      arr.push('')
    }
    if (config.getCurConfigInfo().isOpenBridge) {
      arr.push(CurrentBridgeInfo(chainId))
      tObj.bridge = 1
    } else {
      arr.push('')
    }
    Promise.all(arr).then((res:any) => {
      // console.log(res)
      // console.log(arr)
      if (res[0]) {
        for (const token in res[0]) {
          if (!isAddress(token)) continue
          if (anyToken === token) continue
          const item = res[0][token].list
          
          if (chainId?.toString() !== item.chainId?.toString()) continue
          if (item.underlying) {
            ulist.push(item.underlying.address)
          }
          tlist[token.toLowerCase()] = {
            "address": token,
            "chainId": chainId,
            "decimals": item.decimals,
            "name": item.name,
            "symbol": item.symbol,
            "underlying": item.underlying,
            "destChains": item.destChains,
            "logoUrl": item.logoUrl,
            "type": "router"
          }
          alist.push(token)
        }
      }
      if (res[1]) {
        for (const type in res[1]) {
          const list = res[1][type]
          for (const token in list) {
            if (!isAddress(token)) continue
            if (anyToken === token) continue
            const item = list[token]
            // if (chainId?.toString !== item.chainId) continue
            if (item.underlying) {
              if (ulist.includes(item.underlying.address)) continue
              ulist.push(item.underlying.address)
            }
            if (tlist[token.toLowerCase()]) continue
            tlist[token.toLowerCase()] = {
              "address": token,
              "chainId": chainId,
              "decimals": item.decimals,
              "name": item.name,
              "symbol": item.symbol,
              "underlying": item.underlying,
              "destChains": item.destChains,
              "logoUrl": item.logoUrl,
              "type": "bridge",
              "bridgeType": type
            }
            alist.push(token)
          }
        }
      }
      // console.log(alist)
      // console.log(tlist)
      setTotalCount(alist.length)
      setAllTokenList(tlist)
      setPoolArr(ulist)
      setAllTokenArr(alist)
    })
  }, [chainId])

  useEffect(() => {
    
    setAllTokenList([])
    setPoolArr([])
    setAllTokenArr([])
    getAllTokens()
    // getAllToken(chainId).then((res:any) => {
    //   // console.log(res)
    //   if (res) {
    //     const ulist:any = []
    //     const alist:any = []
    //     const tlist:any = {}
    //     const anyToken = config.getCurChainInfo(chainId)?.anyToken
    //     if (anyToken) {
    //       tlist[anyToken] = {
    //         "address": anyToken,
    //         "chainId": chainId,
    //         "decimals": 18,
    //         "name": "Anyswap",
    //         "symbol": "ANY",
    //         "underlying": '',
    //         "destChains": '',
    //         "isView": 1
    //       }
    //       alist.push(anyToken)
    //     }
    //     for (const token in res) {
    //       if (!isAddress(token)) continue
    //       if (res[token].list.underlying) {
    //         ulist.push(res[token].list.underlying.address)
    //       }
    //       tlist[token.toLowerCase()] = {
    //         "address": token,
    //         "chainId": chainId,
    //         "decimals": res[token].list.decimals,
    //         "name": res[token].list.name,
    //         "symbol": res[token].list.symbol,
    //         "underlying": res[token].list.underlying,
    //         "destChains": res[token].list.destChains,
    //       }
    //       alist.push(token)
    //     }
    //     setAllTokenList(tlist)
    //     setPoolArr(ulist)
    //     setAllTokenArr(alist)
    //   }
    // })
  }, [chainId])

  const [searchBalance, setSearchBalance] = useState('')
  const [showMore, setShowMore] = useState(true)

  const viewTokenList = useMemo(() => {
    // console.log(pagecount)
    const start = pagecount * pagesize
    const end = start + pagesize
    if (allTokenArr) {
      const resArr = searchBalance ? allTokenArr : allTokenArr.slice(start, end)
      return resArr
    }
    return []
  }, [pagecount, allTokenArr, searchBalance])
  // console.log(viewTokenList)
  const [uList, uListLoading] = useTokenBalancesList(account ?? undefined, poolArr)
  // const [uAllList, uAllListLoading] = useTokenBalancesList(account ?? undefined, allTokenArr)
  const [uAllList, uAllListLoading] = useTokenBalancesList(account ?? undefined, viewTokenList)
  // console.log(allTokenArr)
  // console.log(uAllList)
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
      for (const token of viewTokenList) {
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
      for (const token of viewTokenList) {
        l.push({
          ...allTokenList[token]
        })
      }
    }
    l.sort((a:any, b:any) => {
      if (!isNaN(a.totalBlance) && !isNaN(b.totalBlance) && Number(a.totalBlance) > Number(b.totalBlance)) {
        return -1
      }
      return 0
    })
    return l
  }, [formatUList, formatUAllList, viewTokenList, allTokenList])
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

  function changePage (callback:any, pCount:any) {
    
    return (
      <SelectHDPathPage>
        <ArrowBox onClick={() => {
          // console.log(pCount)
          if (pCount >= 1) {
            callback(pCount - 1)
            setSearchBalance('')
          }
        }}><img alt={''} src={PreviouskIcon} style={{marginRight: '0.625rem'}}/>Previous</ArrowBox>
        <ArrowBox onClick={() => {
          if (totalCount && pCount < parseInt((totalCount / pagesize).toString())) {
            callback(pCount + 1)
            setSearchBalance('')
          }
        }}>Next<img alt={''} src={NextkIcon} style={{marginLeft: '0.625rem'}} /></ArrowBox>
      </SelectHDPathPage>
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
                {/* <tr>
                  <DBTd>
                    <TokenTableCoinBox>
                      <TokenTableLogo>
                        <TokenLogo
                          symbol={config.getCurChainInfo(chainId).symbol}
                          size={'1.625rem'}
                        ></TokenLogo>
                      </TokenTableLogo>
                      <TokenNameBox>
                        <h3>{config.getBaseCoin(config.getCurChainInfo(chainId)?.symbol, chainId)}</h3>
                        <p>{config.getBaseCoin(config.getCurChainInfo(chainId)?.name, chainId, 1)}</p>
                      </TokenNameBox>
                    </TokenTableCoinBox>
                  </DBTd>
                  <DBTd className="r">{ETHBalance?.toSignificant(6) ? formatDecimal(ETHBalance?.toSignificant(6), 2) : '-'}</DBTd>
                  <DBTd className="r">{ETHBalance ? '0.00' : '-'}</DBTd>
                  <DBTd className="r">{ETHBalance?.toSignificant(6) ? formatDecimal(ETHBalance?.toSignificant(6), 2) : '-'}</DBTd>
                  <DBTd className="c"></DBTd>
                </tr> */}
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
                                  logoUrl={item.logoUrl}
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
                                  {
                                    item.type === 'router' ? (
                                      <TokenActionBtnSwap to={'/swap?bridgetoken=' + item?.address}>
                                        {t('swap')}
                                      </TokenActionBtnSwap>
                                    ) : (
                                      <TokenActionBtnSwap to={'/bridge?bridgetoken=' + item?.address + '&bridgetype=' + item.bridgeType}>
                                        {t('bridge')}
                                      </TokenActionBtnSwap>
                                    )
                                  }
                                  {/* <TokenActionBtnSwap to={(item.type === 'router' ? '/swap?bridgetoken=' : '/bridge?bridgetoken=') + item?.address}>
                                    {t('swap')}
                                  </TokenActionBtnSwap> */}
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
            {showMore && totalCount > pagesize ? changePage(setPagecount, pagecount) : ''}
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
