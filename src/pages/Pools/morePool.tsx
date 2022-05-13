import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Check } from 'react-feather'
// import config from '../../config'

// import { useActiveWeb3React } from '../../hooks'

import {fromWei, thousandBit} from '../../utils/tools/tools'

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
      font-weight: 500;
      line-height: 1.83;
      margin: 0;
      width:33.333%;
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
    width:40px;
    height:40px;
    position:absolute;
    top: -5px;
    right:-5px;
    border: 2px solid ${({ theme }) => theme.tipColor};
    border-radius:100%;
    opacity:.8;
    display:none;
  }
  &.active {
    .selected {
      display:flex;
    }
  }
`

const CheckIcon = styled(Check)`
  color: ${({ theme }) => theme.tipColor};
`

export default function PoolTip ({
  anyTokenList,
  poolData,
  selectCurrency,
  selectAnyToken,
  onSelectAnyToken
}: {
  anyTokenList:any
  poolData:any
  selectCurrency:any
  selectAnyToken?:any
  onSelectAnyToken?: (value: any) => void
}) {
  // const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  
  return (
    <>
        {
          anyTokenList && anyTokenList.length > 0 ? anyTokenList.map((item:any, index:any) => {
            return (
              <SubCurrencySelectBox
                key={index}
                className={selectAnyToken?.address === item.address ? 'active' : ''}
                onClick={() => {
                  if (onSelectAnyToken) {
                    onSelectAnyToken(item)
                  }
                }}
              >
                <div className='selected'>
                  <CheckIcon />
                </div>
                <dl className='list'>
                  <dt>
                    {item.address}
                  </dt>
                  <dd>
                    <i></i>
                    {t('currentPoolSize') + ' '}: 
                    {
                      poolData?.[item.address] ? (
                        <>
                          {(thousandBit(fromWei(poolData?.[item.address].totalSupply, item.decimals), 2) + ' ' + item?.symbol)}
                        </>
                      ) : ''
                    }
                  </dd>
                  <dd>
                    <i></i>
                    {t('yourPoolShare') + ' '}: 
                    {
                      poolData?.[item.address] ? (
                        <>
                          {(thousandBit(fromWei(poolData?.[item.address].balance, item.decimals), 2) + ' ' + item?.symbol)}
                        </>
                      ) : ''
                    }
                  </dd>
                  <dd>
                    <i></i>
                    {t('UnderlyingLiquidity') + ' '}: 
                    {
                      poolData?.[item.address] ? (
                        <>
                          {(thousandBit(fromWei(poolData?.[item.address].balanceOf, item.decimals), 2) + ' ' + selectCurrency?.symbol)}
                        </>
                      ) : ''
                    }
                  </dd>
                </dl>
              </SubCurrencySelectBox>
            )
          }) : ''
        }
      {/* <SubCurrencySelectBox>
        <dl className='list'>
          <dd>
            <i></i>
            {t('currentPoolSize') + ' '}: 
            {
              bridgeConfig ? (
                <>
                  {(thousandBit(bridgeConfig.anyTotalsupply, 2) + ' ' + anyCurrency?.symbol)}
                </>
              ) : ''
            }
          </dd>
          <dd>
            <i></i>
            {t('yourPoolShare') + ' '}: 
            {
              bridgeConfig ? (
                <>
                  {(
                    (thousandBit(bridgeConfig.balance, 2) + ' ' + anyCurrency?.symbol)
                    +
                    bridgeConfig.percent
                  )}
                </>
              ) : ''
            }
          </dd>
          <dd>
            <i></i>
            {t('UnderlyingLiquidity') + ' '}: 
            {
              bridgeConfig ? (
                <>
                  {(thousandBit(bridgeConfig.totalsupply, 2) + ' ' + config.getBaseCoin(anyCurrency?.underlying?.symbol, chainId))}
                </>
              ) : ''
            }
          </dd>
          {
            swapType !== 'deposit' && destChain && typeof destChain.ts !== 'undefined' ? (
              <dd>
                <i></i>
                {t('destTS') + ' '}: 
                {
                  destChain && typeof destChain.ts !== 'undefined' ? (
                    <>
                      {(thousandBit(destChain.ts, 2) + ' ' + config.getBaseCoin(anyCurrency?.underlying?.symbol, chainId))}
                    </>
                  ) : ''
                }
              </dd>
            ) : ''
          }
        </dl>
      </SubCurrencySelectBox> */}
    </>
  )
}