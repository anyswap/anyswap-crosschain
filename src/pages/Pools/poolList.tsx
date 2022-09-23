import React, { useEffect, useMemo, useState, createRef, useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import {useActiveReact} from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'
import {usePoolDatas} from '../../hooks/usePools'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'
import CrossChainTitle from '../../components/CrossChainTitle'
import { ButtonLight } from '../../components/Button'
import { LazyList } from '../../components/Lazyload/LazyList'
// import {selectNetwork} from '../../components/Header/SelectNetwork'
import { SearchInput } from '../../components/SearchModal/styleds'

import { useWalletModalToggle } from '../../state/application/hooks'
// import { useBridgeTokenList } from '../../state/lists/hooks'
import { usePoolListState } from '../../state/pools/hooks'
// import { useUserSelectChainId } from '../../state/user/hooks'
// import {usePoolsState} from '../../state/pools/hooks'
// import {poolLiquidity} from '../../state/pools/actions'
import AppBody from '../AppBody'

import {getGroupTotalsupply} from '../../utils/bridge/getBalanceV2'
import {thousandBit, bigToSmallSort, fromWei} from '../../utils/tools/tools'

import {
  DBTablesDiv,
  DBTheadDiv,
  DBTheadTrDiv,
  DBThDiv,
  DBTbodyDiv,
  DBTdDiv,
  DBTbodyTrDiv,
  TokenTableCoinBox,
  TokenTableLogo,
  TokenNameBox,
  MyBalanceBox,
  TokenActionBtn,
  Flex,
  ChainCardList
} from '../Dashboard/styleds'

import {
  ColoredDropup,
  ColoredDropdown
} from '../Dashboard'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'
import { isAddress } from '../../utils/isAddress'
import {spportChainArr} from '../../config/chainConfig'

const BalanceTxt = styled.div`
.p1 {
    font-size:14px;
    font-weight:bold;
    color: ${({ theme }) => theme.textColorBold}
  }
  .p2 {
    color: ${({ theme }) => theme.text3};
    font-weight: normal;
    font-size:14px;
  }
`

const Loading = styled.div`
  line-height: 56px;
  text-align: center;
  font-size:12px;
`

// const TableListBox = styled.div`
//   width:100%;
// `
const TokenList = styled.div`
  ${({ theme }) => theme.flexBC};
  width:100%;
  padding: 8px 8px 8px 30px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.01);

  .chain {
    ${({ theme }) => theme.flexSC};
    width: 20%;
    .label {
      margin-left: 10px;
    }
  }
  .dtil {
    ${({ theme }) => theme.flexBC};
    width: 50%;
    .p {
      font-size: 14px;
      color:#999;
      font-weight:normal;
      width:50%;
    }
  }
  .action {
    width: 30%;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display:none;
  `}
`


const TokenActionBtn1 = styled(ButtonLight)`
  ${({ theme }) => theme.flexC};
  font-family: 'Manrope';
  min-width: 88px;
  max-width: 178px;
  height: 38px;
  word-break:break-all!important;

  border-radius: 0.5625rem;
  background: ${({ theme }) => theme.selectedBg};
  margin-right: 0.125rem;

  font-size: 0.75rem;
  font-weight: 500;

  line-height: 1;

  color: ${({ theme }) => theme.textColorBold};
  box-shadow: none;
  padding: 0 8px;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.selectedBg};
  }
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const TokenActionBtn2 = styled(TokenActionBtn)`
  &.disabled {
    opacity: 0.2;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

// const TokenActionCardBtn = styled(ButtonLight)`
//   background:none;
//   border:none;
//   width: auto;
//   height: 20px;
//   color: ${({ theme }) => theme.tipColor};
//   font-size: 10px;
//   padding:0;
// `

const LogoSize = '28px'
const ChainLogoBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: ${LogoSize};
  height: ${LogoSize};
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow:hidden;
  margin: 0 2px;
`
const MoreView = styled.div`
  ${({ theme }) => theme.flexC};
  width: ${LogoSize};
  height: ${LogoSize};
  border-radius: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow:hidden;
  position:relative;
  margin: 0 2px;
  ::after {
    content: '...';
    line-height: 20px;
    position: absolute;
    top: 0px;
    font-size: 12px;
    color: #ccc;
  }
`

const FlexSC = styled.div`
${({ theme }) => theme.flexSC};
`

let intervalFN:any
export default function PoolLists ({

}) {
  const { chainId, evmAccount, account } = useActiveReact()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  const dispatch = useDispatch()

  // const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)
  const allTokensList:any = usePoolListState(chainId)
  // const toggleNetworkModal = useToggleNetworkModal()
  // const poolInfo = usePoolsState()

  const {getPoolsData} = usePoolDatas()
  // console.log(chainId)
  // console.log(allTokensList)

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()
  const [poolInfo, setPoolInfo] = useState<any>()
  // const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)
  
  const [searchQuery, setSearchQuery] = useState<string>('')

  // const 
  const getPools = useCallback(() => {
    axios.get(`${config.bridgeApi}/data/router/v2/pools`).then(res => {
      const {status, data} = res
      if (status === 200) {
        // dispatch(poolLiquidity({poolLiquidity: data}))
        setPoolInfo(data)
      }
    })
  }, [dispatch])

  useInterval(getPools, 1000 * 30)

  function getOutChainInfo (destList:any) {
    const list:any = {}
    // console.log(destList)
    const arr = []
    const chainarr:any = []
    for (const chainID in destList) {
      
      chainarr.push(chainID)
      const c:any = chainID
      if (isNaN(c)) {
        // console.log(c)
        // console.log(account)
        // console.log(destList[c])
        arr.push(getPoolsData(c, destList[c], isAddress(account, c) ? account : undefined))
      } else {
        arr.push(getGroupTotalsupply(destList[c], c, evmAccount))
      }
    }
    Promise.all(arr).then((res:any) => {
      // console.log(res)
      for (let i = 0; i < chainarr.length; i++) {
        const chainID = chainarr[i]
        list[chainID] = res[i]
      }
      setPoolData(list)
      // console.log(list)
      if (intervalFN) clearTimeout(intervalFN)
      intervalFN = setTimeout(() => {
        setIntervalCount(intervalCount + 1)
      }, 1000 * 10)
    })
    // return list
  }


  useEffect(() => {
    // console.log(allTokensList)
    if (allTokensList) {
      // const list:any = []
      const destList:any = {}
      const allToken = []
      for (const tokenKey in allTokensList) {
        const tObj = allTokensList[tokenKey]
        const token = tObj.address
        const curPoolTokenSet:any = []
        const curPoolTokenArr:any = []
        // if (tObj.chainId) {
        //   // console.log(tObj)
        if (!destList[tObj.chainId]) destList[tObj.chainId] = []
        for (const chainID in tObj.destChains) {
          if (chainID?.toString() === tObj.chainId?.toString()) continue
          // if (!config.chainInfo[chainID]) continue
          if (!spportChainArr.includes(chainID)) continue
          if (!destList[chainID]) destList[chainID] = []
          const destTokenList = tObj.destChains[chainID]
          for (const destTokenKey in destTokenList) {
            const destTokenItem = destTokenList[destTokenKey]
            if (!curPoolTokenSet.includes(destTokenItem.fromanytoken.address)) {
              curPoolTokenSet.push(destTokenItem.fromanytoken.address)
              curPoolTokenArr.push({
                token: destTokenItem.fromanytoken.address,
                dec: tObj.decimals,
                underlying: destTokenItem.isFromLiquidity ? token : '',
                // underlying: token
              })
            }
            destList[chainID].push({
              token: destTokenItem.anytoken.address,
              dec: destTokenItem.decimals,
              underlying: destTokenItem?.underlying ? destTokenItem.address : ''
            })
          }
          // console.log(chainID)
        }
        destList[tObj.chainId].push(...curPoolTokenArr)
        allToken.push({
          ...tObj,
          token: token
        })
      }
      // console.log(destList)
      setPoolList(allToken)
      getOutChainInfo(destList)
    }
  }, [chainId, allTokensList, intervalCount, account])

  const tokenList = useMemo(() => {
    // console.log(poolInfo)
    // console.log(poolList)
    // console.log(poolData)
    const arr = []
    const list:any = {}
    const sortArr:any = []
    if (poolList) {
      for (const obj of poolList) {
        if (
          !searchQuery
          || (
            searchQuery
            && (
              obj.address.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
              || obj.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
              || obj.symbol.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
            )
          )
        ) {

          const objExtend:any = {
            ...obj,
            curPool: [],
            destChains: {},
            totalV: 0
          }
          const curPoolArr:any = []
          for (const destChainId in obj.destChains) {
            const destTokenList:any = {...obj.destChains[destChainId]}
            // if (!config.chainInfo[destChainId]) continue
            if (!spportChainArr.includes(destChainId)) continue
            for (const destTokenKey in destTokenList) {
              const destTokenItem:any = {...destTokenList[destTokenKey], ts: '', bl: ''}
              // const destToken = destTokenItem.address
              const destAnyToken = destTokenItem.anytoken.address
              const poolValue = poolInfo?.[destChainId]?.[destAnyToken] ? poolInfo[destChainId][destAnyToken] : {}
              const poolLocalValue = poolData?.[destChainId]?.[destAnyToken] ? poolData?.[destChainId]?.[destAnyToken] : {}
              // if (destTokenItem.symbol === 'MIM') {
  
              //   console.log(destTokenItem.symbol + '-server', poolValue.liquidity)
              //   console.log(destTokenItem.symbol + '-local', poolLocalValue)
              // }
              const ts = poolValue?.liquidity ? fromWei(poolValue.liquidity,destTokenItem.decimals) : ''
              const bl = poolLocalValue?.balance ? fromWei(poolLocalValue.balance,destTokenItem.decimals) : ''
              objExtend.totalV += ts ? ts : 0
              destTokenItem.ts = ts
              destTokenItem.bl = bl
              if (!objExtend.destChains[destChainId]) objExtend.destChains[destChainId] = {}
              if (!objExtend.destChains[destChainId][destTokenKey]) objExtend.destChains[destChainId][destTokenKey] = destTokenItem
  
              const curAnyToken =  destTokenItem.fromanytoken.address
              if (!curPoolArr.includes(curAnyToken) && destTokenItem.isFromLiquidity) {
                curPoolArr.push(curAnyToken)
                const poolValue = poolInfo?.[obj.chainId]?.[curAnyToken] ? poolInfo[obj.chainId][curAnyToken] : {}
                const poolLocalValue = poolData?.[obj.chainId]?.[curAnyToken] ? poolData?.[obj.chainId]?.[curAnyToken] : {}
                const ts = poolValue?.liquidity ? fromWei(poolValue.liquidity,objExtend.decimals) : ''
                const bl = poolLocalValue?.balance ? fromWei(poolLocalValue.balance,objExtend.decimals) : ''
                objExtend.totalV += ts ? ts : 0
                objExtend.curPool.push({
                  ts,
                  bl,
                  anytoken: curAnyToken,
                  sortId: destTokenItem.sortId
                })
              }
            }
          }
          // console.log(curPoolArr)
          if (!list[obj.sort]) list[obj.sort] = []
          if (!sortArr.includes(obj.sort)) sortArr.push(obj.sort)
          list[obj.sort].push(objExtend)
        }
        
        // arr.push(objExtend)
      }
    }
    // console.log(sortArr)
    sortArr.sort((a:any, b:any) => {
      if (a > b) {
        return 1
      }
      return -1
    })
    // console.log(sortArr)
    for (const k of sortArr) {
      arr.push(...list[k].sort(bigToSmallSort(['totalV'])))
    }
    // console.log(arr)
    return arr
  }, [poolData, poolList, poolInfo, searchQuery])
  

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      // console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      }
    })
  }

  function viewTd (item:any) {
    
    return (
      <>
        <DBTdDiv className='r'>
          <BalanceTxt>
            <p className='p1'>{thousandBit(item.totalV, 2)}</p>
          </BalanceTxt>
        </DBTdDiv>
      </>
    )
  }

  function ViewTd2Model ({
    chainId,
    bl,
    ts,
    token,
    isUnderlying,
    anytoken,
    sortId
  }: any) {
    return <TokenList className='l'>
      <div className="chain">
        <TokenLogo
          symbol={config.getCurChainInfo(chainId).networkLogo ?? config.getCurChainInfo(chainId).symbol}
          size={'1.2rem'}
        ></TokenLogo>
        <span className="label">{config.getCurChainInfo(chainId).name}</span>
      </div>
      <div className="dtil">
        <p className='p'>{t('yourPoolShare')}: {bl}</p>
        {/* <p className='p'>{t('pool')}{sortId ? '(Router ' + sortId + ')' : ''}: {ts} </p> */}
        <p className='p'>{t('pool') + (sortId ? ' ' + sortId : '')}: {ts} </p>
        {/* <p className='p'>{t('pool')}: {thousandBit(anyts, 2)}</p> */}
      </div>
      <div className="action">
        {
          config.isStopSystem ? (
            <Flex>
              <TokenActionBtn1 disabled>{t('stopSystem')}</TokenActionBtn1>
            </Flex>
          ) : (
            <Flex>
              {
                account ? (
                  <>
                  {
                    token ? (<>
                      <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=deposit&anytoken=' + anytoken : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                      <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=withdraw&anytoken=' + anytoken : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
                    </>) : (<>
                      <TokenActionBtn1 onClick={() => {
                      if (isUnderlying) {
                          changeNetwork(chainId)
                        }
                      }} className={isUnderlying ? '' : 'disabled'}>{t('SwitchTo')} {config.getCurChainInfo(chainId).name}</TokenActionBtn1>
                    </>)
                  }
                  </>
                ) : (
                  <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                )
              }
            </Flex>
          )
        }
      </div>
    </TokenList>
  }

  function ViewCard2Model ({
    chainId,
    bl,
    ts,
    token,
    isUnderlying,
    anytoken,
    sortId
  }: any) {
    return <ChainCardList className='l'>
      <div className="chain">
        <TokenLogo symbol={config.getCurChainInfo(chainId).networkLogo ?? config.getCurChainInfo(chainId).symbol} size={'1.2rem'} ></TokenLogo>
        <span className="label">{config.getCurChainInfo(chainId).name}</span>
      </div>
      <div className="dtil">
        <p className='p'>
          <span className='txt'>{t('yourPoolShare')}:</span>
          <span className='txt'>{bl}</span>
        </p>
        <p className='p'>
          {/* <span className='txt'>{t('pool')}{sortId ? '(Router ' + sortId + ')' : ''}:</span> */}
          <span className='txt'>{t('pool') + (sortId ? ' ' + sortId : '')}:</span>
          <span className='txt'>{ts}</span>
        </p>
      </div>
      <div className="action">
        {
          config.isStopSystem ? (
            <Flex>
              <TokenActionBtn1 disabled>{t('stopSystem')}</TokenActionBtn1>
            </Flex>
          ) : (
            <Flex>
              {
                account ? (
                  <>
                    {
                      token ? (
                        <>
                          <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=deposit&anytoken=' + anytoken : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                          <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=withdraw&anytoken=' + anytoken : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
                        </>
                      ) : (
                        <TokenActionBtn1 onClick={() => {
                          if (isUnderlying) {
                            changeNetwork(chainId)
                          }
                        }} className={isUnderlying ? '' : 'disabled'}>{t('SwitchTo')} {config.getCurChainInfo(chainId).name}</TokenActionBtn1>
                      )
                    }
                  </>
                ) : (
                  <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                )
              }
            </Flex>
          )
        }
      </div>
    </ChainCardList>
  }

  function ViewTdModel ({
    chainId,
    bl,
    ts,
    token,
    isUnderlying,
    anytoken,
    sortId
  }: any) {
    return (
      <>
        <ViewTd2Model
          chainId ={chainId}
          bl={bl}
          ts={ts}
          token={token}
          isUnderlying={isUnderlying}
          anytoken={anytoken}
          sortId={sortId}
        />
        <ViewCard2Model
          chainId ={chainId}
          bl={bl}
          ts={ts}
          token={token}
          isUnderlying={isUnderlying}
          anytoken={anytoken}
          sortId={sortId}
        />
      </>
    )
  }

  function viewTd2 (item:any, c?:any) {
    let listView:any = ''
    if (c) {
      if (item.curPool.length > 0) {
        // console.log(item)
        listView = item.curPool.map((curItem:any, index:any) => {
          return <ViewTdModel
            key={index}
            chainId ={c}
            bl={curItem.bl ? thousandBit(curItem.bl, 2) : '0.00'}
            ts={curItem.ts || curItem?.ts?.toString() === '0' ? thousandBit(curItem.ts, 2) : 'Unlimited'}
            token={item?.token}
            isUnderlying={true}
            anytoken={curItem.anytoken}
            sortId={curItem.sortId}
          />
        })
      } else {
        listView =  <ViewTdModel
            chainId ={c}
            bl={'0.00'}
            ts={'Unlimited'}
            token={item?.token}
            isUnderlying={false}
          />
      }
    }
    return (
      <>
        {listView}
        {
          item.destChains && Object.keys(item.destChains).map((chainID:any, indexs:any) => {
            if (chainID?.toString() === chainId?.toString()) return ''
            const destTokenList = item.destChains[chainID]
            // console.log(item)
            return (
              <div key={indexs}>
                {
                  Object.keys(destTokenList).map((tokenKey:any, i:any) => {
                    const destTokenItem = destTokenList[tokenKey]
                    const ts = destTokenItem?.ts
                    const bl = destTokenItem?.bl
                    return <ViewTdModel
                      key={indexs + i}
                      chainId ={chainID}
                      bl={destTokenItem?.underlying ? thousandBit(bl, 2) : '0.00'}
                      ts={destTokenItem?.underlying && destTokenItem.isLiquidity ? thousandBit(ts, 2) : 'Unlimited'}
                      token={''}
                      isUnderlying={Boolean(destTokenItem?.underlying) && destTokenItem.isLiquidity}
                      sortId={destTokenItem.sortId}
                    />
                  })
                }
              </div>
            )
          })
        }
      </>
    )
  }
  // const [expandState, setExpandState] = useState<{[key: any]: boolean}>({});
  const [expandState, setExpandState] = useState<any>({});

  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    // fixedList.current?.scrollTo(0)
  }, [])

  // const handleEnter = useCallback(
  //   (e: KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === 'Enter') {
  //       const s = searchQuery.toLowerCase().trim()
  //       if (s === 'eth') {
  //         handleCurrencySelect(ETHER)
  //       } else if (filteredSortedTokens.length > 0) {
  //         if (
  //           filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
  //           filteredSortedTokens.length === 1
  //         ) {
  //           handleCurrencySelect(filteredSortedTokens[0])
  //         }
  //       }
  //     }
  //   },
  //   // [searchQuery]
  //   [searchQuery]
  // )

  function List({ records }: { records?: any [] }) {
    return (<>{
      records?.map((item:any, index:any) => {
        if (
          !searchQuery
          || (
            searchQuery
            && (
              item.address.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
              || item.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
              || item.symbol.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
            )
          )
        ) {
          return <DBTbodyDiv key={index}>
            <DBTbodyTrDiv onClick={() => {
              const id: any = item.address;
              // const newState = { ...expandState };
              const newState:any = { };
              newState[id] = expandState[id] ? false : true;
              setExpandState(newState);
            }}>
              <DBTdDiv className="token">
                <TokenTableCoinBox>
                  <TokenTableLogo>
                    <TokenLogo
                      symbol={config.getBaseCoin(item?.symbol, chainId)}
                      logoUrl={item.logoUrl}
                      size={'1.625rem'}
                      isLazy={ index > 10 }
                    ></TokenLogo>
                  </TokenTableLogo>
                  <TokenNameBox>
                    <h3>{config.getBaseCoin(item?.symbol, chainId)}</h3>
                    {/* <p>{config.getBaseCoin(item?.name, chainId, 1)}</p> */}
                  </TokenNameBox>
                </TokenTableCoinBox>
              </DBTdDiv>
              <DBTdDiv className="l chain hideSmall">
                <FlexSC>
                  <ChainLogoBox key={index} title={config.getCurChainInfo(chainId).symbol}>
                    <TokenLogo symbol={config.getCurChainInfo(chainId).networkLogo ?? config.getCurChainInfo(chainId).symbol} size={'20px'}></TokenLogo>
                  </ChainLogoBox>
                  {
                    item.destChains && Object.keys(item.destChains).length > 0 ? (
                      <>
                        {
                          item.destChains && Object.keys(item.destChains).length > 0 ? (
                            <>
                              {
                                Object.keys(item.destChains).map((chainID, index) => {
                                  if (index >= 6) return ''
                                  return (
                                    <ChainLogoBox key={index} title={config.getCurChainInfo(chainID).symbol}>
                                      <TokenLogo symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol} size={'20px'}></TokenLogo>
                                    </ChainLogoBox>
                                  )
                                })
                              }
                              {Object.keys(item.destChains).length < 6 ? '' : <MoreView></MoreView>}
                            </>
                          ) : ''
                        }
                      </>
                    ) : ''
                  }
                </FlexSC>
              </DBTdDiv>
              {viewTd(item)}
              <DBTdDiv className="c detail">
                <Flex>
                { expandState[item.address] ? 
                  <ColoredDropup id={'chain_dropup_' + index}></ColoredDropup> :
                  <ColoredDropdown id={'chain_dropdown_' + index}></ColoredDropdown> }
                </Flex>
              </DBTdDiv>
            </DBTbodyTrDiv>
            { expandState[item.address] ? <DBTbodyTrDiv id={'chain_list_' + index}>
              <DBTdDiv className='full'>
                {viewTd2(item, chainId)}
                {/* {viewCard2(item, chainId)} */}
              </DBTdDiv>
            </DBTbodyTrDiv> : null }
          </DBTbodyDiv>
        }
        return ''
      })
    }
    </>)
  }
  const watchRef = createRef<any>();
  return (
    <>
    <AppBody>
      {
        config.getCurConfigInfo().isOpenMerge ? (
          <>
            <CrossChainTitle />
          </>
        ) : (
          <Title
            title={t('pool')}
            isNavLink={config.getCurConfigInfo().isOpenBridge ? true : false}
            tabList={config.getCurConfigInfo().isOpenBridge ? [
              {
                name: config.getCurConfigInfo().isOpenBridge ? t('router') : t('swap'),
                path: config.getCurConfigInfo().isOpenBridge ? '/v1/router' : '/swap',
                regex: config.getCurConfigInfo().isOpenBridge ? /\/v1\/router/ : /\/swap/,
                iconUrl: require('../../assets/images/icon/deposit.svg'),
                iconActiveUrl: require('../../assets/images/icon/deposit-purple.svg')
              },
              {
                name: t('pool'),
                path: '/pool',
                regex: /\/pool/,
                iconUrl: require('../../assets/images/icon/pool.svg'),
                iconActiveUrl: require('../../assets/images/icon/pool-purpl.svg')
              }
            ] : []}
          ></Title>
        )
      }
      <MyBalanceBox>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('tokenSearchPlaceholder')}
          value={searchQuery}
          // ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          // onKeyDown={handleEnter}
          style={{marginBottom: '10px'}}
        />
        <DBTablesDiv>
          <DBTheadDiv>
            <DBTheadTrDiv>
              <DBThDiv className="l token">{t('tokens')}</DBThDiv>
              <DBThDiv className="l chain hideSmall">{t('supportChain')}</DBThDiv>
              <DBThDiv className="r liquidity">{t('lr')}</DBThDiv>
              <DBThDiv className="c detail">{t('details')}</DBThDiv>
            </DBTheadTrDiv>
          </DBTheadDiv>
          {
            tokenList && tokenList.length > 0 ? (
              <LazyList records={ tokenList } pageSize={ 24 }
                list={ List } watchRef={ watchRef }>
                {/* {searchQuery ? '' : <Loading ref={ watchRef }>{ t('Loading') }...</Loading>} */}
                <Loading ref={ watchRef }>{ t('Loading') }...</Loading>
              </LazyList>
            ) : (
              <DBTbodyDiv>
                <DBTbodyTrDiv>
                  <DBTdDiv className='chain'>
                    {/* <Loading>{ t('Loading') }...</Loading> */}
                  </DBTdDiv>
                </DBTbodyTrDiv>
              </DBTbodyDiv>
            )
          }
        </DBTablesDiv>
      </MyBalanceBox>
    </AppBody>
    </>
  )
}