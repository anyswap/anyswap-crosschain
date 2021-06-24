import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import TokenLogo from '../../components/TokenLogo'
import Title from '../../components/Title'
import ModalContent from '../../components/Modal/ModalContent'
import {getBaseInfo} from '../../components/Farming/common'

// import config from '../../config'
import farmlist from '../../config/farmlist'
import {USE_VERSION} from '../../config/constant'
import {VERSION} from '../../config/constant'

import { Button } from '../../theme'


import {getPrice} from '../../utils/tools/getPrice'
import {getAllToken} from '../../utils/bridge/getServerInfo'

import AppBody from '../AppBody'

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  button {
    max-width: 20rem;
  }
  &.pd0 {
    padding: 0
  }
`

const FarmListBox = styled.div`
  ${({ theme }) => theme.flexSC};
  flex-wrap:wrap;
  width: 100%;
  margin-top:20px;
`

const FarmList = styled.div`
width: 50%;
height: 220px;
margin-bottom: 20px;
.default {
  background: linear-gradient(180deg, #81BEFA 0%, #4A8AF4 100%);
}
&:nth-child(2n) {
  padding-left: 10px;
}
&:nth-child(2n-1) {
  padding-right: 10px;
}
&:nth-child(4n + 1) {
  .default {
    background: ${({ theme }) => theme.primary1};
  }
}
&:nth-child(4n + 4) {
  .default {
    background: ${({ theme }) => theme.primary1};
  }
}
@media screen and (max-width: 960px) {
  width: 100%;
  &:nth-child(2n) {
    padding-left: 0px;
  }
  &:nth-child(2n-1) {
    padding-right: 0px;
  }
}
`

const LinkBox = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  display:block;
  border-radius: 10px;
  text-decoration: none;
  cursor:pointer;
  .default {
    ${({ theme }) => theme.flexC};
    flex-wrap:wrap;
    width:100%;
    height:100%;
    padding: 22px 10px 0;
    border-radius: 10px;
    .img {
      ${({ theme }) => theme.flexC};
      height:82px;
      border-radius:100%;
      margin:auth;
      img {
        display:block;
        height:100%;
      }
    }
    .info {
      width:100%;
      text-align:center;
      margin:0px 0 0;
      h3 {
        color: #fff;
        font-size:18px;
        margin:0;
        font-weight: 800;
      }
      p {
        color: #fff;
        font-size:14px;
        margin:0;
        padding:0;
        line-height: 35px;
        .pecent {
          padding: 2px 3px;
          background: #14A15E;
          border-radius:4px;
          display:inline-block;
          margin-left: 5px;
          line-height: 21px;
        }
      }
    }
  }
`

const StyledNavLink = styled(NavLink)`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  display:block;
  border-radius: 10px;
  text-decoration: none;
  .default {
    ${({ theme }) => theme.flexC};
    flex-wrap:wrap;
    width:100%;
    height:100%;
    padding: 22px 10px 0;
    border-radius: 10px;
    .img {
      ${({ theme }) => theme.flexC};
      height:82px;
      border-radius:100%;
      margin:auth;
      img {
        display:block;
        height:100%;
      }
    }
    .info {
      width:100%;
      text-align:center;
      margin:0px 0 0;
      h3 {
        color: #fff;
        font-size:18px;
        margin:0;
        font-weight: 800;
      }
      p {
        color: #fff;
        font-size:14px;
        margin:0;
        padding:0;
        line-height: 35px;
        .pecent {
          padding: 2px 3px;
          background: #14A15E;
          border-radius:4px;
          display:inline-block;
          margin-left: 5px;
          line-height: 21px;
        }
      }
    }
  }
`

const DoubleLogo = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  position:relaitve;
  margin-top: 30px;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    // background:#fff;
    img {
      height: 100%;
      display:block;
    }
  }
  .left {
    z-index: 2;
  }
  .right {
    z-index: 1;
  }
  .add {
    font-size: 50px;
    color:#fff;
    display:block;
    margin:0 20px;
  }
`
const TokenLogo1 = styled(TokenLogo)`
background:none;
`

const JumpTipBox = styled.div`
width:100%;
padding: 20px;
`

// const Web3Fn = require('web3')

const JUMPMODALTIP = USE_VERSION + 'JUMPMODALTIP'
// console.log(config)
export default function FarmsList () {
  
  const { t } = useTranslation()

  const [MATICStakingAPY, setMATICStakingAPY] = useState()
  const [FTMStakingAPY, setFTMStakingAPY] = useState()
  const [TipModal, setTipModal] = useState(false)
  const [JumpTip, setJumpTip] = useState({
    title: '',
    content: '',
    url: '',
    type: ''
  })
  const [price, setPrice] = useState<number>()

  useEffect(() => {
    getPrice('ANY').then((res:any) => {
      // console.log(res)
      setPrice(res)
    })
  }, [])

  function getFarmAPY (key:string) {
    return new Promise(resolve => {
      // console.log(VERSION.V2)
      getAllToken(farmlist[key].chainId, VERSION.V2).then((res:any) => {
        // console.log(farmlist[key])
        if (res) {
          if (price) {
            getBaseInfo(res, farmlist[key].chainId, farmlist[key].farmToken, '', farmlist[key].blockNumber, price).then((res:any) => {
              // console.log(res)
              resolve(res.lpArr[farmlist[key].lpToken].apy)
            })
          }
        }
      })
    })
  }

  useEffect(() => {
    // console.log(price)
    if (price) {
      getFarmAPY('MATIC').then((res:any) => {
        setMATICStakingAPY(res)
      })

      getFarmAPY('FTM').then((res:any) => {
        setFTMStakingAPY(res)
      })
    }
  }, [price])


  function openThirdWeb (url:any, type:any) {
    const isJump = localStorage.getItem(JUMPMODALTIP + type)
    // console.log(isJump)
    if (!Number(isJump)) {
      setJumpTip({
        title: t('htSwapTitle'),
        content: t('htSwapContent'),
        url: url,
        type: type
      })
      setTipModal(true)
    } else {
      window.open(url)
    }
  }

  function farmItem (isDoubleLogo:any, isOutLink:any, url:any, title:any, info:any, coin1:any, coin2?:any, coin3?:any) {
    let coinLogo = isDoubleLogo ? (
      <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} size='100%'/></div>
      </DoubleLogo>
    ) : (
      <div className='img'><img src={coin1} alt={title}/></div>
    )
    if (isDoubleLogo === 0) {
      coinLogo = <div className='img'><img src={coin1} alt={title}/></div>
    } else if (isDoubleLogo === 1) {
      coinLogo = <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} size='100%'/></div>
      </DoubleLogo>
    } else if (isDoubleLogo === 2) {
      coinLogo = <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin3} size='100%'/></div>
      </DoubleLogo>
    }
    const titleInfo = <div className='info'>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{__html: info}}></p>
    </div>
    if (isOutLink) {
      return (
        <FarmList>
          <LinkBox onClick={() => {
            openThirdWeb(url, coin1)
          }}>
            <div className='default'>
              {coinLogo}
              {titleInfo}
            </div>
          </LinkBox>
        </FarmList>
      )
    }
    return (
      <FarmList>
        <StyledNavLink to={url}>
          <div className='default'>
            {coinLogo}
            {titleInfo}
          </div>
        </StyledNavLink>
      </FarmList>
    )
  }


  return (
    <>
    <ModalContent
      isOpen={TipModal}
      title={JumpTip.title}
      onDismiss={() => {
        setTipModal(false)
      }}
    >
      <JumpTipBox>
          {JumpTip.content}
        </JumpTipBox>
        <Flex>
          <Button style={{height: '45px', maxWidth: '200px'}} onClick={() => {
            setTipModal(false)
            localStorage.setItem(JUMPMODALTIP + JumpTip.type, '1')
            window.open(JumpTip.url)
          }}>{t('confirm')}</Button>
        </Flex>
      </ModalContent>
      <AppBody>
        <Title
          title={t('farms')}
        ></Title>
        <FarmListBox>
          {/* {farmItem(1, 1, 'https://app.makiswap.com/farms', 'MAKI Farming', 'MAKI Farming', 'MAKI', 'HT')}
          {farmItem(1, 1, 'https://swap.cometh.io/#/stake', 'MUST Farming', 'MUST Farming', 'MUST', 'MATIC')}
          {farmItem(1, 1, 'https://openfi.land/zh/farms', 'PTT Farming', 'PTT Farming', 'PTT', 'HT')}
          {farmItem(1, 1, 'https://spookyswap.finance/', 'BOO Farming', 'BOO Farming', 'BOO', 'FTM')}

          {farmItem(1, 1, 'https://app.spiritswap.finance/#/farms', 'SPIRIT Farming', 'SPIRIT Farming', 'SPIRIT', 'FTM')}
          {farmItem(1, 1, 'https://ellipsis.finance/fusdt', 'EPS Farming', 'Ellipsis Farming', 'EPS', 'BNB')}
          {farmItem(1, 1, 'https://app.nerve.fi/pools', 'NRV Farming', 'Nerve Farming', 'NRV', 'BNB')}
          {farmItem(1, 1, 'https://dashboard.modefi.io', 'MOD Farming', 'Modefi Farming', 'MOD', 'BNB')}
          {farmItem(2, 1, 'https://popsicle.finance/popsicle-stand', 'ICE Farming', 'Popsicle Farming', 'ICE', 'FTM', 'BNB')}
          {farmItem(1, 0, config.farmUrl + 'ftmfarming', 'ANY Farming', (t('ANYHTStakingTip') + "<span class='pecent'>" + (FTMFarmingAPY ? (Number(FTMFarmingAPY)).toFixed(2) : '0.00') + "%</span>"), 'ANY', 'FTM')}
          {farmItem(1, 0, config.farmUrl + 'fsnfarming', 'ANY Farming', (t('ANYHTStakingTip') + "<span class='pecent'>" + (FSNMATICStakingAPY ? (Number(FSNMATICStakingAPY)).toFixed(2) : '0.00') + "%</span>"), 'ANY', 'FSN')}
          {farmItem(1, 1, 'https://htswap.io/rebase', 'SDC Farming', 'USD Rebase token Farming', 'SDC', 'HT')}
          {farmItem(1, 1, 'http://heco.earndefi.finance/', 'EDC Farming', 'EarnDefiCoin Farming', 'EDC', 'HT')}
          {farmItem(1, 0, config.farmUrl + 'bscfarming2', 'EDC ANY', (t('ANYHTStakingTip') + "<span class='pecent'>" + (BSCFarmingAPY ? (Number(BSCFarmingAPY)).toFixed(2) : '0.00') + "%</span>"), 'ANY', 'BNB')}
          {farmItem(1, 1, 'https://htswap.io', 'HT Swap', t('htSwapTip'), 'HTC', 'HT')}
          {farmItem(1, 0, config.farmUrl + 'htfarming', 'ANY Farming', (t('ANYHTStakingTip') + "<span class='pecent'>" + (HTMATICStakingAPY ? (Number(HTMATICStakingAPY)).toFixed(2) : '0.00') + "%</span>"), 'ANY', 'HT')}
          {farmItem(0, 0, config.farmUrl + 'bscfarming', 'CYC Farming', (t('BSCStakingTip') + "<span class='pecent'>" + (BSCMATICStakingAPY ? (Number(BSCMATICStakingAPY)).toFixed(2) : '0.00') + "%</span>"), require('../../assets/images/icon/cycIcon.svg'))} */}
          {farmItem(
            1,
            0,
            'farm/ftm',
            'USDC Staking',
            (t('maticUSDCStakingTip') + "<span class='pecent'>" + (FTMStakingAPY ? (Number(FTMStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
            'USDC',
            'FTM'
          )}
          {farmItem(
            1,
            0,
            'farm/matic', 'USDC Staking', (t('maticUSDCStakingTip') + "<span class='pecent'>" + (MATICStakingAPY ? (Number(MATICStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
            'USDC',
            'MATIC'
          )}
        </FarmListBox>
      </AppBody>
    </>
  )
}