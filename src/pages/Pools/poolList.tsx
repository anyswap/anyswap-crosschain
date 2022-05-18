import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import {useActiveReact} from '../../hooks/useActiveReact'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'
import CrossChainTitle from '../../components/CrossChainTitle'
import { ButtonLight } from '../../components/Button'
// import {selectNetwork} from '../../components/Header/SelectNetwork'

import { useWalletModalToggle } from '../../state/application/hooks'
// import { useBridgeTokenList } from '../../state/lists/hooks'
import { usePoolListState } from '../../state/pools/hooks'
// import { useUserSelectChainId } from '../../state/user/hooks'
import {usePoolsState} from '../../state/pools/hooks'
import AppBody from '../AppBody'

import {getGroupTotalsupply} from '../../utils/bridge/getBalanceV2'
import {thousandBit, bigToSmallSort, fromWei} from '../../utils/tools/tools'

import {
  DBTables,
  DBThead,
  DBTh,
  DBTbody,
  DBTd,
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
// import { isAddress } from '@ethersproject/address'

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
// const BRIDGETYPE = 'routerTokenList'
export default function PoolLists ({

}) {
  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  // const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)
  const allTokensList:any = usePoolListState(chainId)
  // const toggleNetworkModal = useToggleNetworkModal()
  const poolInfo = usePoolsState()
  // console.log(poolInfo)

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()
  // const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)

  // const 

  function getOutChainInfo (destList:any) {
    const list:any = {}
    // console.log(destList)
    const arr = []
    const chainarr:any = []
    for (const chainID in destList) {
      // list[chainID] = await getGroupTotalsupply(destList[chainID], chainID, evmAccount)
      chainarr.push(chainID)
      arr.push(getGroupTotalsupply(destList[chainID], chainID, evmAccount))
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
        // if (!isAddress(token)) continue
        const tObj = allTokensList[tokenKey]
        const token = tObj.address
        const curPoolTokenSet:any = []
        const curPoolTokenArr:any = []
        // if (tObj.chainId) {
        //   // console.log(tObj)
        if (!destList[tObj.chainId]) destList[tObj.chainId] = []
        for (const chainID in tObj.destChains) {
          if (chainID?.toString() === tObj.chainId?.toString()) continue
          if (!config.chainInfo[chainID]) continue
          if (!destList[chainID]) destList[chainID] = []
          const destTokenList = tObj.destChains[chainID]
          for (const destTokenKey in destTokenList) {
            const destTokenItem = destTokenList[destTokenKey]
            if (!curPoolTokenSet.includes(destTokenItem.fromanytoken.address)) {
              curPoolTokenArr.push({
                token: destTokenItem.fromanytoken.address,
                dec: tObj.decimals,
                underlying: destTokenItem.isFromLiquidity ? tObj.address : ''
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
  }, [chainId, allTokensList, intervalCount])

  const tokenList = useMemo(() => {
    // console.log(poolInfo)
    // console.log(poolList)
    // console.log(poolData)
    const arr = []
    const list:any = {}
    const sortArr:any = []
    if (poolList) {
      for (const obj of poolList) {
        const objExtend:any = {
          ...obj,
          curPool: [],
          destChains: {},
          totalV: 0
        }
        const curPoolArr:any = []
        for (const destChainId in obj.destChains) {
          const destTokenList:any = {...obj.destChains[destChainId]}
          if (!config.chainInfo[destChainId]) continue
          for (const destTokenKey in destTokenList) {
            const destTokenItem:any = {...destTokenList[destTokenKey], ts: '', bl: ''}
            // const destToken = destTokenItem.address
            const destAnyToken = destTokenItem.anytoken.address
            const poolValue = poolInfo?.[destChainId]?.[destAnyToken] ? poolInfo[destChainId][destAnyToken] : {}
            const poolLocalValue = poolData?.[destChainId]?.[destAnyToken] ? poolData?.[destChainId]?.[destAnyToken] : {}
            const ts = poolValue?.liquidity ? fromWei(poolValue.liquidity,destTokenItem.decimals) : poolLocalValue?.anyts
            const bl = poolLocalValue?.balance ? poolLocalValue.balance : ''
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
              const ts = poolValue?.liquidity ? fromWei(poolValue.liquidity,objExtend.decimals) : poolLocalValue?.anyts
              const bl = poolLocalValue?.balance ? poolLocalValue.balance : ''
              objExtend.curPool.push({
                ts,
                bl
              })
            }
          }
        }
        // console.log(curPoolArr)
        if (!list[obj.sort]) list[obj.sort] = []
        if (!sortArr.includes(obj.sort)) sortArr.push(obj.sort)
        list[obj.sort].push(objExtend)
        
        // arr.push(objExtend)
      }
    }
    sortArr.sort()
    for (const k of sortArr) {
      arr.push(...list[k].sort(bigToSmallSort(['totalV'])))
    }
    // console.log(arr)
    return arr
  }, [poolData, poolList, poolInfo])
  

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
        <DBTd className='r'>
          <BalanceTxt>
            <p className='p1'>{thousandBit(item.totalV, 2)}</p>
          </BalanceTxt>
        </DBTd>
      </>
    )
  }

  function ViewTd2Model ({
    chainId,
    bl,
    ts,
    token,
    isUnderlying
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
        <p className='p'>{t('pool')}: {ts}</p>
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
                evmAccount ? (
                  <>
                  {
                    token ? (<>
                      <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=deposit' : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                      <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=withdraw' : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
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
    isUnderlying
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
          <span className='txt'>{t('pool')}:</span>
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
                evmAccount ? (
                  <>
                    {
                      token ? (
                        <>
                          <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=deposit' : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                          <TokenActionBtn2 to={isUnderlying ? '/pool/add?bridgetoken=' + token + '&bridgetype=withdraw' : '/pool'} className={isUnderlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
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
    isUnderlying
  }: any) {
    return (
      <>
        <ViewTd2Model
          chainId ={chainId}
          bl={bl}
          ts={ts}
          token={token}
          isUnderlying={isUnderlying}
        />
        <ViewCard2Model
          chainId ={chainId}
          bl={bl}
          ts={ts}
          token={token}
          isUnderlying={isUnderlying}
        />
      </>
    )
  }

  function viewTd2 (item:any, c?:any) {
    let listView:any = ''
    if (c) {
      if (item.curPool.length > 0) {
        listView = item.curPool.map((curItem:any, index:any) => {
          return <ViewTdModel
            key={index}
            chainId ={c}
            bl={curItem.bl ? thousandBit(curItem.bl, 2) : '0.00'}
            ts={curItem.ts || curItem?.ts?.toString() === '0' ? thousandBit(curItem.ts, 2) : 'Unlimited'}
            token={item?.token}
            isUnderlying={true}
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
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="l hideSmall">{t('supportChain')}</DBTh>
              <DBTh className="r">{t('lr')}</DBTh>
              <DBTh className="c">{t('details')}</DBTh>
            </tr>
          </DBThead>
          {
            tokenList && tokenList.length > 0 ? (
              tokenList.map((item:any, index:any) => {
                return (
                  <DBTbody key={index}>
                    <tr onClick={() => {
                      // console.log(1)
                      const htmlNode = document.getElementById('chain_list_' + index)
                      const upNode = document.getElementById('chain_dropup_' + index)
                      const downNode = document.getElementById('chain_dropdown_' + index)
                      if (htmlNode && upNode && downNode) {
                        if (htmlNode.style.display === 'none') {
                          htmlNode.style.display = ''
                          upNode.style.display = ''
                          downNode.style.display = 'none'
                        } else {
                          htmlNode.style.display = 'none'
                          upNode.style.display = 'none'
                          downNode.style.display = ''
                        }
                      }
                    }}>
                      <DBTd width={'150'}>
                        <TokenTableCoinBox>
                          <TokenTableLogo>
                            <TokenLogo
                              symbol={config.getBaseCoin(item?.symbol, chainId)}
                              logoUrl={item.logoUrl}
                              size={'1.625rem'}
                            ></TokenLogo>
                          </TokenTableLogo>
                          <TokenNameBox>
                            <h3>{config.getBaseCoin(item?.symbol, chainId)}</h3>
                            {/* <p>{config.getBaseCoin(item?.name, chainId, 1)}</p> */}
                          </TokenNameBox>
                        </TokenTableCoinBox>
                      </DBTd>
                      <DBTd className="l hideSmall">
                        <FlexSC>
                          <ChainLogoBox key={index} title={config.getCurChainInfo(chainId).symbol}>
                            <TokenLogo symbol={config.getCurChainInfo(chainId).networkLogo ?? config.getCurChainInfo(chainId).symbol} size={'20px'}></TokenLogo>
                          </ChainLogoBox>
                          {
                            item.destChains && Object.keys(item.destChains).length > 0 ? (
                              <>
                                {
                                  Object.keys(item.destChains).map((chainID, index) => {
                                  // chainList.map((chainID, index) => {
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
                        </FlexSC>
                      </DBTd>
                      {viewTd(item)}
                      <DBTd className="c" width={'180'}>
                        <Flex>
                          <ColoredDropup id={'chain_dropup_' + index} style={{display: 'none'}}></ColoredDropup>
                          <ColoredDropdown id={'chain_dropdown_' + index}></ColoredDropdown>
                        </Flex>
                      </DBTd>
                    </tr>
                    <tr id={'chain_list_' + index} style={{display: 'none'}}>
                      <DBTd colSpan={4}>
                        {viewTd2(item, chainId)}
                        {/* {viewCard2(item, chainId)} */}
                      </DBTd>
                    </tr>
                  </DBTbody>
                )
              })
            ) : (
              <DBTbody>
                <tr>
                  <DBTd></DBTd>
                  <DBTd></DBTd>
                  <DBTd></DBTd>
                  <DBTd></DBTd>
                </tr>
              </DBTbody>
            )
          }
        </DBTables>
      </MyBalanceBox>
    </AppBody>
    </>
  )
}