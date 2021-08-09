import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import config from '../../config'

import { useActiveWeb3React } from '../../hooks'

import {thousandBit} from '../../utils/tools/tools'

const SubCurrencySelectBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 1.25rem;
  margin-top: 0.625rem;

  .list {
    margin:0;
    padding: 0 0px 0;
    font-size: 12px;
    color: ${({ theme }) => theme.tipColor};
    dt {
      ${({ theme }) => theme.flexSC};
      font-weight: bold;
      line-height: 1.5;
      img {
        margin-right: 8px;
      }
    }
    dd {
      font-weight: 500;
      line-height: 1.83;
      margin: 0;
      i{
        display:inline-block;
        width:4px;
        height: 4px;
        border-radius:100%;
        background:${({ theme }) => theme.tipColor};
        margin-right: 10px;
      }
    }
  }
`

export default function PoolTip ({
  anyCurrency,
  bridgeConfig,
  destChain,
  swapType
}: {
  anyCurrency: any
  bridgeConfig: any
  destChain: any
  swapType: any
}) {
  const { chainId } = useActiveWeb3React()
  // const account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  
  return (
    <SubCurrencySelectBox>
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
    </SubCurrencySelectBox>
  )
}