
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { useActiveWeb3React } from '../../hooks'
import { useAllTokenBalances } from '../../state/wallet/hooks'

import TokenLogo from '../../components/TokenLogo'
import AppBody from '../AppBody'
import Title from '../../components/Title'

import SearchIcon from '../../assets/images/icon/search.svg'
import { ReactComponent as Dropup } from '../../assets/images/dropup-blue.svg'
import { ReactComponent as Dropdown } from '../../assets/images/dropdown-blue.svg'

import config from '../../config'

const MyBalanceBox = styled.div`
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

const DBTables = styled.table`
  min-width: 100%;
  table-layer: fixed;
  // border-spacing:0px 10px;
`
const DBThead = styled.thead`
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
const DBTh = styled.th`
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
const DBTbody = styled.tbody`
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

const DBTd = styled.td`
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

const TokenTableCoinBox = styled.div`
  ${({ theme }) => theme.flexSC};
  // border-right: 0.0625rem  solid rgba(0, 0, 0, 0.1);
  padding: 0 0px;
  // min-width: 160px;
  // width:25%;
  @media screen and (max-width: 960px) {
    // min-width: 120px;
    padding: 0 5px;
  }
`
const TokenTableLogo = styled.div`
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

const TokenNameBox = styled.div`
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
const TokenActionBtn = styled(NavLink)`
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
const TokenActionBtnSwap = styled(TokenActionBtn)`
  margin-right: 0.125rem;
`
const MoreBtnBox = styled.div`
  ${({ theme }) => theme.flexC};
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
    stroke: ${({ theme }) => theme.selectedBg};
  }
`

const WrappedDropdown = ({ ...rest }) => <Dropdown {...rest} />
const ColoredDropdown = styled(WrappedDropdown)`
  margin-right: 0.625rem;
  path {
    stroke: ${({ theme }) => theme.selectedBg};
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
  const { account } = useActiveWeb3React()
  // const selectedTokenList = useSelectedTokenList()
  // const allTokens = useAllTokenBalances()
  const { t } = useTranslation()
  // const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useAllTokenBalances()

  const [searchBalance, setSearchBalance] = useState('')
  const [searchPool, setSearchPool] = useState('')
  const [showMore, setShowMore] = useState(false)

  const tokenList = useMemo(() => {
    const list: Array<any> = []
    for (const tokenAddress in balances) {
      list.push(balances[tokenAddress])
    }
    console.log(account)
    return list
  }, [balances, account])
  // const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  // const tokenComparator = useTokenComparator(false)
  // console.log(tokenList)
  // console.log(balances)
  useEffect(() => {
    console.log(searchPool)
    // console.log(allTokensArray)
    // setSearchBalance('')
    // setSearchPool('')
    // console.log(tokenComparator)
    // console.log(t)
  }, [searchPool])

  function searchBox(type: number) {
    return (
      <>
        <SearchBox>
          <div className="icon">
            <img src={SearchIcon} alt={''} />
          </div>
          <SearchInput
            placeholder={t('searchToken')}
            onChange={(e: any) => {
              if (type === 1) {
                setSearchBalance(e.target.value)
              } else {
                setSearchPool(e.target.value)
              }
            }}
          ></SearchInput>
        </SearchBox>
      </>
    )
  }

  return (
    <>
      <AppBody>
        <Title title={t('swap')}></Title>
        <MyBalanceBox>
          <TitleAndSearchBox>
            <h3>{t('myBalance')}</h3>
            {searchBox(1)}
          </TitleAndSearchBox>
          <MyBalanceTokenBox className={showMore ? 'showMore' : ''}>
            <DBTables>
              <DBThead>
                <tr>
                  <DBTh className="c">{t('Coins')}</DBTh>
                  <DBTh className="l">{t('price')}</DBTh>
                  <DBTh className="r">{t('balances')}</DBTh>
                  <DBTh className="r">{t('lr')}</DBTh>
                  <DBTh className="r">{t('TotalBalance')}</DBTh>
                  <DBTh className="c">{t('Action')}</DBTh>
                </tr>
              </DBThead>
              <DBTbody>
                {tokenList.length > 0 ? (
                  tokenList.map((item, index) => {
                    if (
                      !searchBalance ||
                      (item?.token?.name &&
                        item?.token?.name.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1) ||
                      (item?.token?.symbol &&
                        item?.token?.symbol.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1) ||
                      (item?.token?.address &&
                        item?.token?.address.toLowerCase().indexOf(searchBalance.toLowerCase()) !== -1)
                    ) {
                      return (
                        <tr key={index}>
                          <DBTd>
                            <TokenTableCoinBox>
                              <TokenTableLogo>
                                <TokenLogo
                                  symbol={config.getBaseCoin(item?.token?.symbol)}
                                  size={'1.625rem'}
                                ></TokenLogo>
                              </TokenTableLogo>
                              <TokenNameBox>
                                <h3>{config.getBaseCoin(item?.token?.symbol)}</h3>
                                <p>{config.getBaseCoin(item?.token?.name, 1)}</p>
                              </TokenNameBox>
                            </TokenTableCoinBox>
                          </DBTd>
                          <DBTd className="l">$ 0.00</DBTd>
                          <DBTd className="r">{item.toSignificant(4)}</DBTd>
                          <DBTd className="r">0.00</DBTd>
                          <DBTd className="r">0.00</DBTd>
                          <DBTd className="c">
                            <span style={{ display: 'inline-block' }}>
                              <TokenActionBtnSwap to={'/swap?outputCurrency=' + item?.token?.address}>
                                {t('swap')}
                              </TokenActionBtnSwap>
                            </span>
                          </DBTd>
                          {/* {
                            poolObj[item.symbol] ? (
                              config.dirSwitchFn(poolObj[item.symbol].isSwitch) ? (
                                <>
                                  <DBTd className='l'>$ {poolObj[item.symbol] && baseMarket ? 
                                    (item.symbol === config.symbol ? formatNum(baseMarket, config.keepDec) : getPrice(poolObj[item.symbol].market, item.symbol)) : '-'
                                  }</DBTd>
                                  <DBTd className='r'>{account ? item.balance : '-'}</DBTd>
                                  {
                                    item.symbol === config.symbol ? (
                                      <>
                                        <DBTd className='r'>
                                          {poolObj[item.symbol] && config.dirSwitchFn(poolObj[item.symbol].isSwitch) ? 
                                            formatNum(amountFormatter(poolObj[item.symbol].Basebalance, 18, config.keepDec)) : '0'
                                          }
                                        </DBTd>
                                        <DBTd className='r'>
                                          {
                                            poolObj[item.symbol]
                                            && config.dirSwitchFn(poolObj[item.symbol].isSwitch)
                                            && item.balance !== '-'
                                            ? formatDecimal(Number(amountFormatter(poolObj[item.symbol].Basebalance, 18, config.keepDec)) + Number(item.balance), config.keepDec) : '0'}
                                        </DBTd>
                                      </>
                                    ) : (
                                      <>
                                        <DBTd className='r'>{poolObj[item.symbol] && config.dirSwitchFn(poolObj[item.symbol].isSwitch) && poolObj[item.symbol].balance && !isNaN(poolObj[item.symbol].balance) ? formatNum(poolObj[item.symbol].balance) : '0'}</DBTd>
                                        <DBTd className='r'>
                                          {
                                            poolObj[item.symbol]
                                            && config.dirSwitchFn(poolObj[item.symbol].isSwitch)
                                            && item.balance !== '-'
                                            && !isNaN(item.balance)
                                            && !isNaN(poolObj[item.symbol].balance)
                                            ? (
                                              Number(poolObj[item.symbol].balance) + Number(item.balance) === 0 ?
                                              '0'
                                              :
                                              formatDecimal(Number(poolObj[item.symbol].balance) + Number(item.balance), config.keepDec)
                                            ) : '0'}</DBTd>
                                      </>
                                    )
                                  }
                                  <DBTd className='c'>
                                    <span style={{display:"inline-block"}}><TokenActionBtnSwap to={'/swap?inputCurrency=' + item.address}>{t('swap')}</TokenActionBtnSwap></span>
                                  </DBTd>
                                </>
                              ) : (
                                <DBTd colSpan='5' className='c'>
                                  <ComineSoon>
                                    <img alt={''} src={ScheduleIcon} style={{marginRight: '10px'}} />
                                    {t('ComineSoon')}
                                  </ComineSoon>
                                </DBTd>
                              )
                            ) : (
                              <>
                                <DBTd className='l'>$-</DBTd>
                                <DBTd className='r'>-</DBTd>
                                <DBTd className='r'>-</DBTd>
                                <DBTd className='r'>-</DBTd>
                                <DBTd className='r'>-</DBTd>
                              </>
                            )
                          } */}
                        </tr>
                      )
                    } else {
                      return (
                        <tr key={index} style={{ display: 'none' }}>
                          <DBTd className="c">$-</DBTd>
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
                    <DBTd className="c">$-</DBTd>
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
