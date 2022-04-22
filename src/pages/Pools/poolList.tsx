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
import { useBridgeTokenList } from '../../state/lists/hooks'
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
import { isAddress } from '@ethersproject/address'

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
const BRIDGETYPE = 'routerTokenList'
export default function PoolLists ({

}) {
  const { chainId, evmAccount } = useActiveReact()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const allTokensList:any = useBridgeTokenList(BRIDGETYPE, chainId)
  // const toggleNetworkModal = useToggleNetworkModal()
  const poolInfo = usePoolsState()
  // console.log(poolInfo)

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()
  // const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)



  async function getOutChainInfo (destList:any) {
    const list:any = {}
    // console.log(destList)
    for (const chainID in destList) {
      list[chainID] = await getGroupTotalsupply(destList[chainID], chainID, evmAccount)
    }
    setPoolData(list)
    // console.log(list)
    if (intervalFN) clearTimeout(intervalFN)
    intervalFN = setTimeout(() => {
      setIntervalCount(intervalCount + 1)
    }, 1000 * 10)
    // return list
  }


  useEffect(() => {
    if (allTokensList) {
      // const list:any = []
      const destList:any = {}
      const allToken = []
      for (const token in allTokensList) {
        if (!isAddress(token)) continue
        const tObj = allTokensList[token].tokenInfo
        if (tObj.chainId) {
          // console.log(tObj)
          if (!destList[tObj.chainId]) destList[tObj.chainId] = []
          const curData = {
            token: tObj?.underlying ? tObj?.underlying?.address : token,
            dec: tObj.decimals,
            underlying: tObj?.underlying ? token : ''
          }
          destList[tObj.chainId].push(curData)
        }
        for (const chainID in tObj.destChains) {
          if (chainID?.toString() === tObj.chainId?.toString()) continue
          if (!config.chainInfo[chainID]) continue
          if (!destList[chainID]) destList[chainID] = []
          destList[chainID].push({
            token: tObj.destChains[chainID]?.underlying ? tObj.destChains[chainID]?.underlying?.address : tObj.destChains[chainID].address,
            dec: tObj.destChains[chainID].decimals,
            underlying: tObj.destChains[chainID]?.underlying ? tObj.destChains[chainID].address : ''
          })
          // console.log(chainID)
        }
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
    const arr = []
    const list:any = {}
    const sortArr:any = []
    if (poolList) {
      for (const obj of poolList) {
        const objExtend:any = {
          ...obj,
          ts: '',
          bl: '',
          destChains: {},
          totalV: 0
        }
        const c1 = objExtend.chainId
        const t1 = objExtend.underlying ? objExtend.underlying.address : objExtend.address
        const tu1 = objExtend.address
        objExtend.ts = poolInfo && poolInfo[c1] && poolInfo[c1][tu1] && poolInfo[c1][tu1].liquidity ? fromWei(poolInfo[c1][tu1].liquidity, objExtend.decimals) : 0
        objExtend.bl = poolData && poolData[c1] && poolData[c1][t1] && poolData[c1][t1].balance ? poolData[c1][t1].balance : 0
        objExtend.totalV += objExtend.ts
        for (const objChild in obj.destChains) {
          if (!config.chainInfo[objChild]) continue
          const c2 = objChild
          const t2 = obj.destChains[c2].underlying ? obj.destChains[c2].underlying.address : obj.destChains[c2].address
          const tu2 = obj.destChains[c2].address
          const dObj = {
            ...obj.destChains[c2],
            ts: '',
            bl: ''
          }
          dObj.ts = poolInfo && poolInfo[c2] && poolInfo[c2][tu2] && poolInfo[c2][tu2].liquidity ? fromWei(poolInfo[c2][tu2].liquidity,obj.destChains[c2].decimals) : 0
          dObj.bl = poolData && poolData[c2] && poolData[c2][t2] && poolData[c2][t2].balance ? poolData[c2][t2].balance : 0
          objExtend.totalV += dObj.ts
          objExtend.destChains[c2] = dObj
        }
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
  }, [poolData, poolList, bigToSmallSort, poolInfo])
  

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
  function viewTd2 (item:any, c?:any) {
    // console.log(item)
    let listView:any = ''
    if (c) {
      const ts = item.ts ? item.ts : '0.00'
      const bl = item.bl ? item.bl : '0.00'
      // console.log(ts)
      listView = <TokenList className='l'>
          <div className="chain">
            <TokenLogo
              symbol={config.getCurChainInfo(c).networkLogo ?? config.getCurChainInfo(c).symbol}
              size={'1.2rem'}
            ></TokenLogo>
            <span className="label">{config.getCurChainInfo(c).name}</span>
          </div>
          <div className="dtil">
            <p className='p'>{t('yourPoolShare')}: {item.underlying ? thousandBit(bl, 2) : '0.00'}</p>
            <p className='p'>{t('pool')}: {item.underlying ? thousandBit(ts, 2) : 'Unlimited'}</p>
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
                        <TokenActionBtn2 to={item?.underlying ? '/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit' : '/pool'} className={item?.underlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                        <TokenActionBtn2 to={item?.underlying ? '/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw' : '/pool'} className={item?.underlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
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
    return (
      <>
        {listView}
        {
          item.destChains && Object.keys(item.destChains).map((chainID:any, indexs:any) => {
            if (chainID?.toString() === chainId?.toString()) return ''
            // const token = item.destChains[chainID]?.address
            // const token = item.destChains[chainID].underlying?.address ? item.destChains[chainID].underlying?.address : item.destChains[chainID]?.address
            const ts = item.destChains[chainID].ts ? item.destChains[chainID].ts : '0.00'
            // const anyts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].anyts ? poolData[chainID][token].anyts : '0.00'
            const bl = item.destChains[chainID].bl ? item.destChains[chainID].bl : '0.00'

            return (
              <TokenList className='l' key={indexs}>
                <div className="chain">
                  <TokenLogo
                    symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol}
                    size={'1.2rem'}
                  ></TokenLogo>
                  <span className="label">{config.getCurChainInfo(chainID).name}</span>
                </div>
                <div className="dtil">
                  <p className='p'>{t('yourPoolShare')}: {item?.destChains[chainID]?.underlying ? thousandBit(bl, 2) : '0.00'}</p>
                  <p className='p'>{t('pool')}: {item?.destChains[chainID]?.underlying ? thousandBit(ts, 2) : 'Unlimited'}</p>
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
                          <TokenActionBtn1 onClick={() => {
                            if (item?.destChains[chainID]?.underlying) {
                              changeNetwork(chainID)
                            }
                          }} className={item?.destChains[chainID]?.underlying ? '' : 'disabled'}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionBtn1>
                        ) : (
                          <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                        )
                      }
                    </Flex>
                    )
                  }
                </div>
              </TokenList>
            )
          })
        }
      </>
    )
  }

  function viewCard2 (item:any, c?:any) {
    let listView:any = ''
    if (c) {
      const ts = item.ts ? item.ts : '0.00'
      const bl = item.bl ? item.bl : '0.00'
      // console.log(ts)
      listView = <ChainCardList className='l'>
          <div className="chain">
            <TokenLogo symbol={config.getCurChainInfo(c).networkLogo ?? config.getCurChainInfo(c).symbol} size={'1.2rem'} ></TokenLogo>
            <span className="label">{config.getCurChainInfo(c).name}</span>
          </div>
          <div className="dtil">
            <p className='p'>
              <span className='txt'>{t('yourPoolShare')}:</span>
              <span className='txt'>{item?.underlying ? thousandBit(bl, 2) : '0.00'}</span>
            </p>
            <p className='p'>
              <span className='txt'>{t('pool')}:</span>
              <span className='txt'>{thousandBit(ts, 2)}</span>
            </p>
            {/* <p className='p'>
              <span className='txt'>{t('pool')}:</span>
              <span className='txt'>{thousandBit(anyts, 2)}</span>
            </p> */}
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
                        <TokenActionBtn2 to={item?.underlying ? '/pool/add?bridgetoken=' + item?.address + '&bridgetype=deposit' : '/pool'} className={item?.underlying ? '' : 'disabled'}>{t('Add')}</TokenActionBtn2>
                        <TokenActionBtn2 to={item?.underlying ? '/pool/add?bridgetoken=' + item?.address + '&bridgetype=withdraw' : '/pool'} className={item?.underlying ? '' : 'disabled'}>{t('Remove')}</TokenActionBtn2>
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
    return (
      <>
        {listView}
        {
          item.destChains && Object.keys(item.destChains).map((chainID:any, indexs:any) => {
            if (chainID?.toString() === chainId?.toString()) return ''
            // const token = item.destChains[chainID]?.address
            // const token = item.destChains[chainID].underlying?.address ? item.destChains[chainID].underlying?.address : item.destChains[chainID]?.address
            const ts = item.destChains[chainID].ts ? item.destChains[chainID].ts : 'Unlimited'
            // const anyts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].anyts ? poolData[chainID][token].anyts : '0.00'
            const bl = item.destChains[chainID].bl ? item.destChains[chainID].bl : '0.00'
            return (
              <ChainCardList className='l' key={indexs}>
                <div className="chain">
                  <TokenLogo symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol} size={'1.2rem'} ></TokenLogo>
                  <span className="label">{config.getCurChainInfo(chainID).name}</span>
                </div>
                <div className="dtil">
                  <p className='p'>
                    <span className='txt'>{t('yourPoolShare')}:</span>
                    <span className='txt'>{item?.destChains[chainID]?.underlying ? thousandBit(bl, 2) : '0.00'}</span>
                  </p>
                  <p className='p'>
                    <span className='txt'>{t('pool')}:</span>
                    <span className='txt'>{thousandBit(ts, 2)}</span>
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
                            <TokenActionBtn1 onClick={() => {
                              if (item?.destChains[chainID]?.underlying) {
                                changeNetwork(chainID)
                              }
                            }} className={item?.destChains[chainID]?.underlying ? '' : 'disabled'}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionBtn1>
                          ) : (
                            <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                          )
                        }
                      </Flex>
                    )
                  }
                </div>
              </ChainCardList>
            )
          })
        }
      </>
    )
  }
  // console.log(config.getCurConfigInfo().isOpenMerge)
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
                                    // if (index >= 2) return ''
                                    return (
                                      <ChainLogoBox key={index} title={config.getCurChainInfo(chainID).symbol}>
                                        <TokenLogo symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol} size={'20px'}></TokenLogo>
                                      </ChainLogoBox>
                                    )
                                  })
                                }
                                {Object.keys(item.destChains).length > 0 ? '' : <MoreView></MoreView>}
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
                        {viewCard2(item, chainId)}
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