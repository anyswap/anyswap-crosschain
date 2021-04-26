
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { useActiveWeb3React } from '../../hooks'
// import { useTokenTotalSupply, useTokenBalancesList } from '../../state/wallet/hooks'
import { useTokenBalancesList } from '../../state/wallet/hooks'

import TokenLogo from '../../components/TokenLogo'
import AppBody from '../AppBody'
import Title from '../../components/Title'

import SearchIcon from '../../assets/images/icon/search.svg'
import { ReactComponent as Dropup } from '../../assets/images/dropup-blue.svg'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'

import config from '../../config'

import {getAllToken} from '../../utils/bridge/getBaseInfo'
import {fromWei} from '../../utils/tools/tools'

export const MyBalanceBox = styled.div`
  width: 100%;

  border-radius: 0.5625rem;
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  background-color: ${({ theme }) => theme.contentBg};
  padding: 1rem 2.5rem;
  margin-bottom: 20px;
  @media screen and (max-width: 960px) {
    padding: 1rem 1rem;
  }
`

export const Flex = styled.div`
  ${({ theme }) => theme.flexC};
`

const TitleAndSearchBox = styled.div`
  ${({ theme }) => theme.flexBC};
  margin-bottom: 1.5625rem;
  font-family: 'Manrope';
  h3 {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.5;
    color: ${({ theme }) => theme.textColorBold};
    margin: 0 1.25rem 0 0;
    white-space: nowrap;
  }
`
const SearchBox = styled.div`
  width: 100%;
  max-width: 296px;
  height: 2.5rem;

  border-radius: 0.5625rem;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  // background-color: #ffffff;
  padding-left: 2.5rem;
  position: relative;

  .icon {
    ${({ theme }) => theme.flexC};
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.textColorBold};
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: none;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  background: none;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    // color: ${({ theme }) => theme.text4};
    color:#DADADA;
  }
`

const MyBalanceTokenBox = styled.div`
  width: 100%;
  height: 230px;
  overflow-y: hidden;
  overflow-x: auto;
  &.showMore {
    height: auto;
    overflow: auto;
  }
`

export const DBTables = styled.table`
  min-width: 100%;
  table-layer: fixed;
  border-spacing:0px 10px;
`
export const DBThead = styled.thead`
  width: 100%;
  border-radius: 0.5625rem;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-bottom: 0.625rem;
  font-size: 12px;
  tr {
    box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  }
  @media screen and (max-width: 960px) {
    padding: 1rem 5px;
  }
`
export const DBTh = styled.th`
  color: ${({ theme }) => theme.textColorBold};
  background-color: ${({ theme }) => theme.contentBg};
  padding: 12px 8px;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 1.5;
  &.r {
    text-align: right;
  }
  &.l {
    text-align: left;
  }
  &.c {
    text-align: center;
  }
`
export const DBTbody = styled.tbody`
  width: 100%;
  border-radius: 0.5625rem;
  border: solid 1px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin-bottom: 0.625rem;
  font-size: 12px;
  tr {
    // margin-bottom: 10px;
    box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  }
  @media screen and (max-width: 960px) {
    padding: 1rem 5px;
  }
`

export const DBTd = styled.td`
  background-color: ${({ theme }) => theme.contentBg};
  padding: 12px 8px;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: bold;
  line-height: 1.5;
  color: ${({ theme }) => theme.textColorBold};
  &.r {
    text-align: right;
  }
  &.l {
    text-align: left;
  }
  &.c {
    text-align: center;
  }
  p {
    margin: 0;
    &.lr {
      ${({ theme }) => theme.flexBC};
    }
    &.textR {
      ${({ theme }) => theme.flexEC};
    }
  }
`

export const TokenTableCoinBox = styled.div`
  ${({ theme }) => theme.flexSC};
  padding: 0 0px;

  @media screen and (max-width: 960px) {
    padding: 0 5px;
  }
`
export const TokenTableLogo = styled.div`
  ${({ theme }) => theme.flexC};
  width: 36px;
  height: 36px;

  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 100%;
  padding: 0.3125rem;
  margin-right: 1.25rem;
  @media screen and (max-width: 960px) {
    margin-right: 5px;
    padding: 5px;
  }
`

export const TokenNameBox = styled.div`
  font-family: 'Manrope';
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.25;
    color: ${({ theme }) => theme.textColorBold};
    white-space: nowrap;
  }
  p {
    margin: 0.125rem 0 0;
    font-size: 0.75rem;
    font-weight: normal;
    white-space: nowrap;
    line-height: 1;
    color: ${({ theme }) => theme.textColorBold};
  }
`
export const TokenActionBtn = styled(NavLink)`
  ${({ theme }) => theme.flexC};
  font-family: 'Manrope';
  width: 88px;
  height: 38px;

  border-radius: 0.5625rem;
  background: ${({ theme }) => theme.selectedBg};
  margin-right: 0.125rem;

  font-size: 0.75rem;
  font-weight: 500;

  line-height: 1;

  color: ${({ theme }) => theme.textColorBold};
  box-shadow: none;
  padding: 0;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.selectedBg};
  }
`
export const TokenActionBtnSwap = styled(TokenActionBtn)`
  margin-right: 0.125rem;
`
const MoreBtnBox = styled.div`
  ${({ theme }) => theme.flexC};
  background-color: ${({theme}) => theme.tipBg};
  font-family: 'Manrope';
  width: 110px;
  height: 34px;

  border-radius: 6px;

  font-size: 0.75rem;
  font-weight: 500;

  line-height: 1.17;

  color: #734be2;
  margin: 1.25rem auto 0;
  cursor: pointer;
`
const WrappedDropup = ({ ...rest }) => <Dropup {...rest} />
const ColoredDropup = styled(WrappedDropup)`
  margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.textColorBold};
  }
`

const WrappedDropdown = ({ ...rest }) => <Dropdown {...rest} />
const ColoredDropdown = styled(WrappedDropdown)`
  margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.textColorBold};
  }
`
// const ComineSoon = styled.div`
//   ${({theme}) => theme.flexC}
//   width: 118px;
//   font-family: 'Manrope';
//   font-size: 0.75rem;
//   color: #96989e;
//   height: 30px;
//   padding: 0 8px;
//   border-radius: 6px;
//   white-space: nowrap;
// `

export default function DashboardDtil() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [poolArr, setPoolArr] = useState<Array<string>>()

  const [allTokenArr, setAllTokenArr] = useState<Array<string>>()
  const [allTokenList, setAllTokenList] = useState<any>()

  useEffect(() => {
    getAllToken(chainId).then((res:any) => {
      // console.log(res)
      if (res) {
        const ulist:any = []
        const alist:any = []
        const tlist:any = {}
        for (const token in res) {
          if (res[token].list.underlying) {
            ulist.push(res[token].list.underlying.address)
          }
          tlist[token.toLowerCase()] = {
            "address": token,
            "chainId": chainId,
            "decimals": res[token].list.decimals,
            "name": res[token].list.name,
            "symbol": res[token].list.symbol,
            "underlying": res[token].list.underlying
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
        balance = balance ? fromWei(balance, dec) : ''
        underlyingBlance = underlyingBlance ? fromWei(underlyingBlance, dec) : ''
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
                                  symbol={config.getBaseCoin(item?.underlying?.symbol ? item?.underlying?.symbol : item?.symbol)}
                                  size={'1.625rem'}
                                ></TokenLogo>
                              </TokenTableLogo>
                              <TokenNameBox>
                                <h3>{config.getBaseCoin(item?.underlying?.symbol ? item?.underlying?.symbol : item?.symbol)}</h3>
                                <p>{config.getBaseCoin(item?.underlying?.name ? item?.underlying?.name : item?.name, 1)}</p>
                              </TokenNameBox>
                            </TokenTableCoinBox>
                          </DBTd>
                          <DBTd className="r">{item.balance ? item.balance : '-'}</DBTd>
                          <DBTd className="r">{item.poolBlance ? item.poolBlance : '-'}</DBTd>
                          <DBTd className="r">{item.totalBlance ? item.totalBlance : '-'}</DBTd>
                          <DBTd className="c">
                            <span style={{ display: 'inline-block' }}>
                              <TokenActionBtnSwap to={'/swap?bridgetoken=' + item?.address}>
                                {t('swap')}
                              </TokenActionBtnSwap>
                            </span>
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
