import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Check } from 'react-feather'
// import config from '../../config'

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

export default function PoolTip ({
  anyTokenList,
  poolData,
  type,
  selectCurrency,
  selectAnyToken,
  tipTitleKey,
  onSelectAnyToken
}: {
  anyTokenList:any
  poolData:any
  type: any
  selectCurrency:any
  selectAnyToken?:any
  tipTitleKey?:any
  onSelectAnyToken?: (value: any) => void
}) {
  const { t } = useTranslation()
  
  return (
    <>
      {
        type === "S" && selectCurrency && anyTokenList && anyTokenList.length > 0 ? anyTokenList.map((item:any, index:any) => {
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
              
              <dl className='list'>
                <dd>
                  {
                    selectAnyToken ? (
                      <div className='selected'>
                        <CheckIcon className='icon' />
                      </div>
                    ) : (
                    <>
                      <i></i>
                      {t('destTS')}
                    </>
                    )
                  }
                  {tipTitleKey ? t(tipTitleKey, {index: item.sortId}) : ''}
                </dd>
                <dd>
                  {t('yourPoolShare') + ' '}: 
                  {
                    poolData?.[item.address] ? (
                      <>
                        {/* {(thousandBit(fromWei(poolData?.[item.address].balance, item.decimals), 2) + ' ' + item?.symbol)} */}
                        {(thousandBit(fromWei(poolData?.[item.address].balance, item.decimals), 2))}
                      </>
                    ) : ''
                  }
                </dd>
                <dd>
                  {t('pool') + ' '}: 
                  {
                    poolData?.[item.address] ? (
                      <>
                        {/* {(thousandBit(fromWei(poolData?.[item.address].balanceOf, item.decimals), 2) + ' ' + selectCurrency?.symbol)} */}
                        {(thousandBit(fromWei(poolData?.[item.address].balanceOf, item.decimals), 2))}
                      </>
                    ) : ''
                  }
                </dd>
              </dl>
            </SubCurrencySelectBox>
          )
        }) : ''
      }
      {
        type === "M" && selectCurrency && anyTokenList && anyTokenList.length > 0 ? anyTokenList.map((item:any, index:any) => {
          const poolKey = item.fromanytoken.address
          const decimals = item.fromanytoken.decimals
          return (
            <SubCurrencySelectBox
              key={index}
              className={selectAnyToken?.key === item.key ? 'active' : ''}
              onClick={() => {
                if (onSelectAnyToken) {
                  onSelectAnyToken(item)
                }
              }}
            >
              <dl className='list'>
                <dd>
                  {/* <i></i> */}
                  {/* L{' ' + (index + 1)} */}
                  <div className='selected'>
                    <CheckIcon className='icon'  />
                  </div>
                  {tipTitleKey ? t(tipTitleKey, {index: item.sortId}) : ''}
                </dd>
                <dd>
                  {t('yourPoolShare') + ' '}: 
                  {
                    poolData?.[poolKey] ? (
                      <>
                        {/* {(thousandBit(fromWei(poolData?.[item.address].balance, item.decimals), 2) + ' ' + item?.symbol)} */}
                        {(thousandBit(fromWei(poolData?.[poolKey].balance, decimals), 2))}
                      </>
                    ) : ''
                  }
                </dd>
                <dd>
                  {t('pool') + ' '}: 
                  {
                    poolData?.[poolKey] ? (
                      <>
                        {/* {(thousandBit(fromWei(poolData?.[item.address].balanceOf, item.decimals), 2) + ' ' + selectCurrency?.symbol)} */}
                        {(thousandBit(fromWei(poolData?.[poolKey].balanceOf, decimals), 2))}
                      </>
                    ) : ''
                  }
                </dd>
              </dl>
            </SubCurrencySelectBox>
          )
        }) : ''
      }
    </>
  )
}