import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'

import AppBody from '../AppBody'

import {getAllToken} from '../../utils/bridge/getBaseInfo'
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
  Flex
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
export default function PoolLists ({

}) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [poolData, setPoolData] = useState<any>()
  const [poolList, setPoolList] = useState<any>()

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
    getAllToken(chainId).then((res:any) => {
      if (res) {
        // console.log(res)
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
              destList[chainID].push({token: tObj.destChain[chainID], dec: tObj.decimals})
              // console.log(chainID)
            }
            // console.log(Object.keys(tObj.destChain))
            allToken.push({
              ...tObj,
              token: token
            })
          }
        }
        // console.log(destList)
        setPoolList(allToken)
        getOutChainInfo(destList)
      }
    })
  }, [chainId])

  function viewTd (item:any, c?:any) {
    console.log(poolList)
    let ts = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].ts ? Number(poolData[c][item.token].ts) : 0
    let bl = c && poolData && poolData[c] && item.token && poolData[c][item.token] && poolData[c][item.token].balance ? Number(poolData[c][item.token].balance) : 0

    for (const chainID in poolList[0].destChain) {
      const ts1 = poolData && poolData[chainID] && poolData[chainID][item.destChain[chainID]] && poolData[chainID][item.destChain[chainID]].ts ? Number(poolData[chainID][item.destChain[chainID]].ts) : 0
      const bl1 = poolData && poolData[chainID] && poolData[chainID][item.destChain[chainID]] && poolData[chainID][item.destChain[chainID]].balance ? Number(poolData[chainID][item.destChain[chainID]].balance) : 0
      ts += ts1
      bl += bl1
    }
    return (
      <>
        <DBTd className='r'>
          <BalanceTxt>
            <p className='p1'>User: {thousandBit(bl, 2)}</p>
          </BalanceTxt>
        </DBTd>
        <DBTd className='r'>
          <BalanceTxt>
            <p className='p1'>Pool: {thousandBit(ts, 2)}</p>
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
            <p className='p'>User: {thousandBit(bl, 2)}</p>
            <p className='p'>Pool: {thousandBit(ts, 2)}</p>
          </div>
          <div>
            <Flex>
              <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit'}>{t('Add')}</TokenActionBtn>
              <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw'}>{t('Remove')}</TokenActionBtn>
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
                  <p className='p'>User: {thousandBit(bl, 2)}</p>
                  <p className='p'>Pool: {thousandBit(ts, 2)}</p>
                </div>
                <div className="action">
                  <Flex>
                    
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
              <DBTh className="c">{t('Coins')}</DBTh>
              <DBTh className="r">Total(Users)</DBTh>
              <DBTh className="r">Total(Pools)</DBTh>
              <DBTh className="c">{t('lr')}</DBTh>
            </tr>
          </DBThead>
            {
              poolList && poolList.length > 0 ? (
                poolList.map((item:any, index:any) => {
                  return (
                    <DBTbody key={index}>
                      <tr>
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
                        {viewTd(item, chainId)}
                        {/* {viewTd(item)} */}
                        <DBTd className="c" width={'180'}>
                          <Flex>
                            <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=deposit'}>{t('Add')}</TokenActionBtn>
                            <TokenActionBtn to={'/pool/add?bridgetoken=' + item?.token + '&bridgetype=withdraw'}>{t('Remove')}</TokenActionBtn>
                          </Flex>
                        </DBTd>
                      </tr>
                      <tr>
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