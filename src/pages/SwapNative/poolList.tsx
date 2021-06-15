import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'
import { ButtonLight } from '../../components/Button'
import {selectNetwork} from '../../components/Header/SelectNetwork'

import { useWalletModalToggle } from '../../state/application/hooks'

import AppBody from '../AppBody'

import {getAllToken, getAllChainIDs} from '../../utils/bridge/getBaseInfo'
import {getGroupTotalsupply} from '../../utils/bridge/getBalance'
import {thousandBit} from '../../utils/tools/tools'

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
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 28px;
    margin-bottom: 10px;
  `}
`

const TokenActionBtn2 = styled(TokenActionBtn)`
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
// const MoreView = styled.div`
//   ${({ theme }) => theme.flexC};
//   width: ${LogoSize};
//   height: ${LogoSize};
//   border-radius: 100%;
//   border: 1px solid rgba(0, 0, 0, 0.1);
//   overflow:hidden;
//   position:relative;
//   margin: 0 2px;
//   ::after {
//     content: '...';
//     line-height: 20px;
//     position: absolute;
//     top: 0px;
//     font-size: 12px;
//     color: #ccc;
//   }
// `
let intervalFN:any

export default function PoolLists ({

}) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  // const toggleNetworkModal = useToggleNetworkModal()

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()
  const [chainList, setChainList] = useState<Array<any>>([])
  const [count, setCount] = useState<number>(0)
  const [intervalCount, setIntervalCount] = useState<number>(0)


  useEffect(() => {
    getAllChainIDs(chainId).then((res:any) => {
      // console.log(res)
      if (res && res.length > 0) {
        setChainList(res)
      } else {
        setChainList([])
      }
    })
  }, [chainId])

  async function getOutChainInfo (destList:any) {
    const list:any = {}
    for (const chainID in destList) {
      list[chainID] = await getGroupTotalsupply(destList[chainID], chainID, account)
    }
    setPoolData(list)
    console.log(list)
    if (intervalFN) clearTimeout(intervalFN)
    intervalFN = setTimeout(() => {
      setIntervalCount(intervalCount + 1)
    }, 1000 * 10)
    // return list
  }

  useEffect(() => {
    // setPoolList([])
    getAllToken(chainId).then((res:any) => {
      // console.log(res)
      if (res) {
        // const list:any = []
        const destList:any = {}
        const allToken = []
        for (const token in res) {
          if (!isAddress(token)) continue
          const tObj = res[token].list
          if (tObj.underlying) {
            if (chainId) {
              if (!destList[chainId]) destList[chainId] = []
              destList[chainId].push({token: token, dec: tObj.decimals})
              // destList[chainId].push({token: token, dec: tObj.decimals})
            }
            for (const chainID in tObj.destChain) {
              if (Number(chainID) === Number(chainId)) continue
              if (!destList[chainID]) destList[chainID] = []
              destList[chainID].push({token: tObj.destChain[chainID].token, dec: tObj.destChain[chainID].decimals})
              // console.log(chainID)
            }
            allToken.push({
              ...tObj,
              token: token
            })
          }
        }
        // console.log(destList)
        setPoolList(allToken)
        getOutChainInfo(destList)
      } else {
        setPoolList([])
        setTimeout(() => {
          setCount(count + 1)
        }, 1000)
      }
    })
  }, [chainId, count, intervalCount])
  
  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      }
    })
  }

  function viewTd (item:any, c?:any) {
    // console.log(poolList)
    // const token = 
    let ts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].ts ? Number(poolData[c][item.token].ts) : 0

    for (const chainID in poolList[0].destChain) {
      if (Number(chainID) === Number(chainId)) continue
      const token = item.destChain[chainID].token
      const ts1 = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].ts ? Number(poolData[chainID][token].ts) : 0
      ts += ts1
      // bl += bl1
    }
    return (
      <>
        <DBTd className='r'>
          <BalanceTxt>
            <p className='p1'>{thousandBit(ts, 2)}</p>
          </BalanceTxt>
        </DBTd>
      </>
    )
  }
  function viewTd2 (item:any, c?:any) {
    let listView:any = ''
    if (c) {
      const ts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].ts ? poolData[c][item.token].ts : '0.00'
      // const anyts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].anyts ? poolData[c][item.token].anyts : '0.00'
      const bl = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].balance ? poolData[c][item.token].balance : '0.00'
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
            <p className='p'>{t('yourPoolShare')}: {thousandBit(bl, 2)}</p>
            <p className='p'>{t('pool')}: {thousandBit(ts, 2)}</p>
            {/* <p className='p'>{t('pool')}: {thousandBit(anyts, 2)}</p> */}
          </div>
          <div className="action">
            <Flex>
              {
                account ? (
                  <>
                    <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit'}>{t('Add')}</TokenActionBtn>
                    <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw'}>{t('Remove')}</TokenActionBtn>
                  </>
                ) : (
                  <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                )
              }
            </Flex>
          </div>
        </TokenList>
    }
    return (
      <>
        {listView}
        {
          Object.keys(poolList[0].destChain).map((chainID:any, indexs:any) => {
            if (Number(chainID) === Number(chainId)) return ''
            const token = item.destChain[chainID].token
            const ts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].ts ? poolData[chainID][token].ts : '0.00'
            // const anyts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].anyts ? poolData[chainID][token].anyts : '0.00'
            const bl = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].balance ? poolData[chainID][token].balance : '0.00'
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
                  <p className='p'>{t('yourPoolShare')}: {thousandBit(bl, 2)}</p>
                  <p className='p'>{t('pool')}: {thousandBit(ts, 2)}</p>
                  {/* <p className='p'>{t('pool')}: {thousandBit(anyts, 2)}</p> */}
                </div>
                <div className="action">
                  <Flex>
                    {
                      account ? (
                        <TokenActionBtn1 onClick={() => changeNetwork(chainID)}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionBtn1>
                      ) : (
                        <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                      )
                    }
                  </Flex>
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
      const ts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].ts ? poolData[c][item.token].ts : '0.00'
      // const anyts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].anyts ? poolData[c][item.token].anyts : '0.00'
      const bl = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].balance ? poolData[c][item.token].balance : '0.00'
      // console.log(ts)
      listView = <ChainCardList className='l'>
          <div className="chain">
            <TokenLogo symbol={config.getCurChainInfo(c).networkLogo ?? config.getCurChainInfo(c).symbol} size={'1.2rem'} ></TokenLogo>
            <span className="label">{config.getCurChainInfo(c).name}</span>
          </div>
          <div className="dtil">
            <p className='p'>
              <span className='txt'>{t('yourPoolShare')}:</span>
              <span className='txt'>{thousandBit(bl, 2)}</span>
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
            <Flex>
              {
                account ? (
                  <>
                    <TokenActionBtn2 to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit'}>{t('Add')}</TokenActionBtn2>
                    <TokenActionBtn2 to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw'}>{t('Remove')}</TokenActionBtn2>
                  </>
                ) : (
                  <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                )
              }
            </Flex>
          </div>
        </ChainCardList>
    }
    return (
      <>
        {listView}
        {
          Object.keys(poolList[0].destChain).map((chainID:any, indexs:any) => {
            if (Number(chainID) === Number(chainId)) return ''
            const token = item.destChain[chainID].token
            const ts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].ts ? poolData[chainID][token].ts : '0.00'
            // const anyts = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].anyts ? poolData[chainID][token].anyts : '0.00'
            const bl = poolData && poolData[chainID] && poolData[chainID][token] && poolData[chainID][token].balance ? poolData[chainID][token].balance : '0.00'
            return (
              <ChainCardList className='l' key={indexs}>
                <div className="chain">
                  <TokenLogo symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol} size={'1.2rem'} ></TokenLogo>
                  <span className="label">{config.getCurChainInfo(chainID).name}</span>
                  {/* {
                    account ? (
                      <TokenActionCardBtn onClick={() => changeNetwork(chainID)}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionCardBtn>
                    ) : (
                      <TokenActionCardBtn onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionCardBtn>
                    )
                  } */}
                </div>
                <div className="dtil">
                  <p className='p'>
                    <span className='txt'>{t('yourPoolShare')}:</span>
                    <span className='txt'>{thousandBit(bl, 2)}</span>
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
                  <Flex>
                    {
                      account ? (
                        <TokenActionBtn1 onClick={() => changeNetwork(chainID)}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionBtn1>
                      ) : (
                        <TokenActionBtn1 onClick={toggleWalletModal}>{t('ConnectWallet')}</TokenActionBtn1>
                      )
                    }
                  </Flex>
                </div>
              </ChainCardList>
            )
          })
        }
      </>
    )
  }

  return (
    <AppBody>
      <Title title={t('pool')}></Title>

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="c hideSmall">{t('supportChain')}</DBTh>
              <DBTh className="r">{t('lr')}</DBTh>
              <DBTh className="c">{t('details')}</DBTh>
            </tr>
          </DBThead>
          {
            poolList && poolList.length > 0 ? (
              poolList.map((item:any, index:any) => {
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
                      <DBTd className="c hideSmall">
                        <Flex>
                          {
                            chainList && chainList.length > 0 ? (
                              chainList.map((chainID, index) => {
                                // if (index >= 2) return ''
                                return (
                                  <ChainLogoBox key={index} title={config.getCurChainInfo(chainID).symbol}>
                                    <TokenLogo symbol={config.getCurChainInfo(chainID).networkLogo ?? config.getCurChainInfo(chainID).symbol} size={'20px'}></TokenLogo>
                                  </ChainLogoBox>
                                )
                              })
                            ) : ''
                          }
                        </Flex>
                      </DBTd>
                      {viewTd(item, chainId)}
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
  )
}