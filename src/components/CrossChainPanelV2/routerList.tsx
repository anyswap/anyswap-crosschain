import React, { useMemo } from "react"
import styled from "styled-components"
import { useTranslation } from 'react-i18next'
import { Check } from 'react-feather'

import {useActiveReact} from '../../hooks/useActiveReact'
import {usePools} from '../../hooks/usePools'
import {calcReceiveValueAndFee} from './hooks'

import {BigAmount} from '../../utils/formatBignumber'
import {thousandBit} from '../../utils/tools/tools'


const RouterListBox = styled.div`
  width: 100%;
`
// const RouterListItem = styled.div`
//   width: 100%;
//   border-radius: 0.5625rem;
//   border: solid 0.5px ${({ theme }) => theme.tipBorder};
//   background-color: ${({ theme }) => theme.tipBg};
//   padding: 1rem 1.25rem;
//   &.active {

//   }
// `

const SubCurrencySelectBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 1.25rem;
  margin-top: 0.625rem;
  cursor:pointer;
  position:relative;
  overflow:hidden;
  opacity:0.8;
  .list {
    ${({ theme }) => theme.flexSC};
    flex-wrap:wrap;
    margin:0;
    padding: 0 0px 0;
    font-size: 12px;
    color: ${({ theme }) => theme.tipColor};
    dt {
      ${({ theme }) => theme.flexSC};
      font-weight: bold;
      line-height: 1.5;
      width:100%;
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow:hidden;
    }
    dd {
      ${({ theme }) => theme.flexSC};
      font-weight: 500;
      line-height: 1.83;
      margin: 0;
      width:25%;
      i{
        display:inline-block;
        width:4px;
        height: 4px;
        border-radius:100%;
        background:${({ theme }) => theme.tipColor};
        margin-right: 10px;
      }
      ${({ theme }) => theme.mediaWidth.upToMedium`
        width:100%;
      `}
    }
  }
  .selected {
    ${({ theme }) => theme.flexC};
    width:20px;
    height:20px;
    // position:absolute;
    // top: -5px;
    // right:-5px;
    border: 2px solid ${({ theme }) => theme.tipColor};
    border-radius:100%;
    margin-right:5px;
    padding: 2px;
    // display:none;
    .icon {
      opacity:0;
    }
  }
  &.active {
    opacity:1;
    .selected {
      // display:flex;
      // opacity:0.8;
      .icon {
        opacity:1;
      }
    }
  }
`

const CheckIcon = styled(Check)`
  color: ${({ theme }) => theme.tipColor};
  width:100%;
  height:100%;
`

export default function RouterList ({
  // selectCurrency,
  // tipTitleKey,
  selectChain,
  selectDestKey,
  routerlist,
  inputBridgeValue,
  onCurrencySelect
}: {
  selectChain:any
  selectDestKey:any
  routerlist:any
  inputBridgeValue:any
  onCurrencySelect?: (value: any) => void
}) {
  const { evmAccount } = useActiveReact()
  const { t } = useTranslation()

  const tokenlist = useMemo(() => {
    const arr = []
    for (const k in routerlist) {
      const obj = routerlist[k]
      if (obj.isLiquidity) {
        arr.push({
          underlying: obj.underlying.address,
          anytoken: obj.anytoken.address,
        })
      }
    }
    return arr
  }, [routerlist])

  const feeList = useMemo(() => {
    const list:any = {}
    // if 
    for (const k in routerlist) {
      const obj = routerlist[k]
      if (inputBridgeValue) {
        list[k] = calcReceiveValueAndFee(inputBridgeValue, obj, obj.decimals)
        if (!list[k].fee) {
          list[k] = {fee: obj.MinimumSwapFee}
        }
      } else {
        list[k] = {fee: obj.MinimumSwapFee}
      }
    }
    return list
  }, [inputBridgeValue, routerlist])

  const {poolData} = usePools({
    account: evmAccount,
    chainId: selectChain,
    tokenList: tokenlist
  })

  // console.log(selectDestKey)
  // console.log(feeList)
  // console.log(poolData)
  return (
    <>
      <RouterListBox>
        {
          routerlist && Object.keys(routerlist).map((key:any, index:any) => {
            const obj = routerlist[key]
            let poolLiquidity:any = '-'
            let poolMyLiquidity:any = '-'
            if (obj.isLiquidity) {
              const pool = poolData?.[obj?.anytoken?.address] ? poolData?.[obj?.anytoken?.address] : ''
              poolLiquidity = pool?.balanceOf ? BigAmount.format(obj?.decimals, pool.balanceOf).toExact() : ''
              poolLiquidity = poolLiquidity ? thousandBit(poolLiquidity, 2) : ''
              poolMyLiquidity = pool?.balance ? BigAmount.format(obj?.decimals, pool.balance).toExact() : ''
              poolMyLiquidity = poolMyLiquidity ? thousandBit(poolMyLiquidity, 2) : ''
            } else {
              poolLiquidity = 'Unlimited'
            }
            
            // return (
            //   <RouterListItem key={index} className={selectDestKey === key ? 'active' : ''}>
            //     <h3>Router: {obj.sortId}</h3>
            //     <p>{t('pool')}: {poolLiquidity} {obj.symbol}</p>
            //     <p>{t('fee')}: {feeList?.[key]?.fee} {obj.symbol}</p>
            //     <p>{t('yourPoolShare')}: {poolMyLiquidity} {obj.symbol}</p>
            //   </RouterListItem>
            // )
            return (
              <SubCurrencySelectBox
                key={index}
                className={selectDestKey === key ? 'active' : ''}
                onClick={() => {
                  if (onCurrencySelect) {
                    onCurrencySelect(obj)
                  }
                }}
              >
                
                <dl className='list'>
                  {
                    obj.sortId === 0 ? <dd>
                      <div className='selected'>
                        <CheckIcon className='icon' />
                      </div>
                      {'Bridge'}
                    </dd> : <dd>
                      <div className='selected'>
                        <CheckIcon className='icon' />
                      </div>
                      {'Router ' + obj.sortId}
                    </dd>
                  }
                  <dd>
                    {t('pool') + ' '}: 
                    {poolLiquidity}
                  </dd>
                  <dd>
                    {t('yourPoolShare') + ' '}: 
                    {poolMyLiquidity}
                  </dd>
                  <dd>
                    {t('fee') + ' '}: 
                    {feeList?.[key]?.fee}
                  </dd>
                </dl>
              </SubCurrencySelectBox>
            )
          })
        }
      </RouterListBox>
    </>
  )
}