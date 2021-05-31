import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'
import { ButtonLight } from '../../components/Button'

import { useWalletModalToggle, useToggleNetworkModal } from '../../state/application/hooks'

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
  ColoredDropup,
  ColoredDropdown
} from '../Dashboard'

import config from '../../config'

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

const TableListBox = styled.div`
  width:100%;
`
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
`
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

export default function PoolLists ({

}) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  const toggleNetworkModal = useToggleNetworkModal()

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()
  const [chainList, setChainList] = useState<Array<any>>([])
  const [count, setCount] = useState<number>(0)

  async function getOutChainInfo (destList:any) {
    const list:any = {}
    for (const chainID in destList) {
      list[chainID] = await getGroupTotalsupply(destList[chainID], chainID, account)
    }
    setPoolData(list)
    console.log(list)
    return list
  }
  // console.log(poolData)

  useEffect(() => {
    getAllChainIDs(chainId).then((res:any) => {
      console.log(res)
      if (res && res.length > 0) {
        setChainList(res)
      } else {
        setChainList([])
      }
    })
  }, [chainId])

  useEffect(() => {
    setPoolList([])
    getAllToken(chainId).then((res:any) => {
      // console.log(res)
      if (res) {
        // const list:any = []
        const destList:any = {}
        const allToken = []
        for (const token in res) {
          const tObj = res[token].list
          if (tObj.underlying) {
            if (chainId) {
              if (!destList[chainId]) destList[chainId] = []
              destList[chainId].push({token: token, dec: tObj.decimals})
            }
            for (const chainID in tObj.destChain) {
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
        setTimeout(() => {
          setCount(count + 1)
        }, 1000)
      }
    })
  }, [chainId, count])

  function viewTd (item:any, c?:any) {
    // console.log(poolList)
    let ts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].ts ? Number(poolData[c][item.token].ts) : 0
    // let bl = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].balance ? Number(poolData[c][item.token].balance) : 0

    for (const chainID in poolList[0].destChain) {
      const ts1 = poolData && poolData[chainID] && poolData[chainID][item.destChain[chainID]] && poolData[chainID][item.destChain[chainID]].ts ? Number(poolData[chainID][item.destChain[chainID]].ts) : 0
      ts += ts1
      // bl += bl1
    }
    return (
      <>
        {/* <DBTd className='r'>
          <BalanceTxt>
            <p className='p1'>{thousandBit(bl, 2)}</p>
          </BalanceTxt>
        </DBTd> */}
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
      const bl = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].balance ? poolData[c][item.token].balance : '0.00'
      listView = <TokenList className='l'>
          <div className="chain">
            <TokenLogo
              symbol={config.getCurChainInfo(c).symbol}
              size={'1.2rem'}
            ></TokenLogo>
            <span className="label">{config.getCurChainInfo(c).name}</span>
          </div>
          <div className="dtil">
            <p className='p'>{t('yourPoolShare')}: {thousandBit(bl, 2)}</p>
            <p className='p'>{t('pool')}: {thousandBit(ts, 2)}</p>
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
            const ts = poolData && poolData[chainID] && poolData[chainID][item.destChain[chainID]] && poolData[chainID][item.destChain[chainID]].ts ? poolData[chainID][item.destChain[chainID]].ts : '0.00'
            const bl = poolData && poolData[chainID] && poolData[chainID][item.destChain[chainID]] && poolData[chainID][item.destChain[chainID]].balance ? poolData[chainID][item.destChain[chainID]].balance : '0.00'
            return (
              <TokenList className='l' key={indexs}>
                <div className="chain">
                  <TokenLogo
                    symbol={config.getCurChainInfo(chainID).symbol}
                    size={'1.2rem'}
                  ></TokenLogo>
                  <span className="label">{config.getCurChainInfo(chainID).name}</span>
                </div>
                <div className="dtil">
                  <p className='p'>{t('yourPoolShare')}: {thousandBit(bl, 2)}</p>
                  <p className='p'>{t('pool')}: {thousandBit(ts, 2)}</p>
                </div>
                <div className="action">
                  <Flex>
                    {
                      account ? (
                        <TokenActionBtn1 onClick={toggleNetworkModal}>{t('SwitchTo')} {config.getCurChainInfo(chainID).name}</TokenActionBtn1>
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
  return (
    <AppBody>
      <Title title={t('pool')}></Title>

      <TableListBox>
        {/* {
          poolList && poolList.length > 0 ? (
            <TokenList>
              <div className="item">
    
              </div>
            </TokenList>
          ) : ''
        } */}
      </TableListBox>

      <MyBalanceBox>
        <DBTables>
          <DBThead>
            <tr>
              <DBTh className="l">{t('tokens')}</DBTh>
              <DBTh className="c">{t('supportChain')}</DBTh>
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
                        // console.log(e)
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
                        <DBTd className="c">
                          <Flex>
                            {
                              chainList && chainList.length > 0 ? (
                                chainList.map((chainID, index) => {
                                  if (index >= 2) return ''
                                  return (
                                    <ChainLogoBox key={index} title={config.getCurChainInfo(chainID).symbol}><TokenLogo symbol={config.getCurChainInfo(chainID).symbol} size={'20px'}></TokenLogo></ChainLogoBox>
                                  )
                                })
                              ) : ''
                            }
                            {/* <ChainLogoBox title="ETH"><TokenLogo symbol={'ETH'} size={'20px'}></TokenLogo></ChainLogoBox>
                            <ChainLogoBox title="BSC"><TokenLogo symbol={'BNB'} size={'20px'}></TokenLogo></ChainLogoBox> */}
                            <MoreView></MoreView>
                          </Flex>
                        </DBTd>
                        {viewTd(item, chainId)}
                        {/* {viewTd(item)} */}
                        <DBTd className="c" width={'180'}>
                          <Flex>
                            {/* <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit'}>{t('Add')}</TokenActionBtn>
                            <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw'}>{t('Remove')}</TokenActionBtn> */}
                            <ColoredDropup id={'chain_dropup_' + index} style={{display: 'none'}}></ColoredDropup>
                            <ColoredDropdown id={'chain_dropdown_' + index}></ColoredDropdown>
                          </Flex>
                        </DBTd>
                      </tr>
                      <tr id={'chain_list_' + index} style={{display: 'none'}}>
                        <DBTd colSpan={4}>
                          {viewTd2(item, chainId)}
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
          {/* <DBTbody>
          </DBTbody> */}
        </DBTables>
      </MyBalanceBox>
    </AppBody>
  )
}