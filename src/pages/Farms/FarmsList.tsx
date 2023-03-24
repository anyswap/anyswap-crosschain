import React, { useEffect, useMemo, useState } from 'react'
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

// import { Button } from '../../theme'
import { ButtonConfirmed } from '../../components/Button'


import {getPrice} from '../../utils/tools/getPrice'

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
  position:relative;
  overflow:hidden;
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
  position:relative;
  overflow:hidden;
  .default {
    ${({ theme }) => theme.flexC};
    flex-wrap:wrap;
    width:100%;
    height:100%;
    padding: 22px 10px 0;
    border-radius: 10px;
    overflow:hidden;
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

const FarmStatus = styled.div`
  width: 200px;
  height: 30px;
  line-height:30px;
  background: ${({ theme }) => theme.white};
  position:absolute;
  top:10px;
  right: -70px;
  transform: rotate( 45deg );
  text-align:center;
  font-size:14px;
  color: #96989e!important;
  &.live {
    opacity: 1;
  }
  &.finished {
    opacity: 1;
  }
`
// const Web3Fn = require('web3')

const JUMPMODALTIP = USE_VERSION + 'JUMPMODALTIP'
// console.log(config)
export default function FarmsList () {
  
  const { t } = useTranslation()

  const [ARBStakingAPY, setARBStakingAPY] = useState()
  const [ARBStakingAPYV2, setARBStakingAPYV2] = useState()
  // const [MATICStakingAPY, setMATICStakingAPY] = useState()
  // const [FTMStakingAPY, setFTMStakingAPY] = useState()
  // const [BSCStakingAPY, setBSCStakingAPY] = useState()
  // const [BSCHEROStakingAPY, setBSCHEROStakingAPY] = useState()
  // const [BSCPLAYStakingAPY, setBSCPLAYStakingAPY] = useState()
  // const [BSCBACONStakingAPY, setBSCBACONStakingAPY] = useState()
  // const [BSCTROStakingAPY, setBSCTROStakingAPY] = useState()
  // const [BSCKABYStakingAPY, setBSCKABYStakingAPY] = useState()
  // const [BSCPTLKXStakingAPY, setBSCPTLKXStakingAPY] = useState()
  const [TipModal, setTipModal] = useState(false)
  const [JumpTip, setJumpTip] = useState({
    title: '',
    content: '',
    url: '',
    type: ''
  })
  
  function getFarmAPY (key:string, price:any) {
    return new Promise(resolve => {
      if (farmlist[key].lpTokenIno) {
        if (price) {
          getBaseInfo(farmlist[key].lpTokenIno, farmlist[key].chainId, farmlist[key].farmToken, '', farmlist[key].blockNumber, price).then((res:any) => {
            // console.log(res)
            resolve(res?.lpArr[farmlist[key]?.lpToken]?.apy)
          })
        }
      }
    })
  }

  useEffect(() => {
    getPrice('ARB').then((res:any) => {
      if (farmlist['ARB'].isEnd) {
        getFarmAPY('ARB', res).then((res:any) => {
          setARBStakingAPY(res)
        })
      }
      if (farmlist['ARB2'].isEnd) {
        getFarmAPY('ARB2', res).then((res:any) => {
          setARBStakingAPYV2(res)
        })
      }
      // getFarmAPY('MATIC', res).then((res:any) => {
      //   setMATICStakingAPY(res)
      // })

      // getFarmAPY('FTM', res).then((res:any) => {
      //   setFTMStakingAPY(res)
      // })
    })
    // getPrice('DEP').then((res:any) => {
    //   getFarmAPY('BSC', res).then((res:any) => {
    //     setBSCStakingAPY(res)
    //   })
    // })
    // getPrice('HERO').then((res:any) => {
    //   getFarmAPY('BSC_HERO', res).then((res:any) => {
    //     setBSCHEROStakingAPY(res)
    //   })
    // })
    // getFarmAPY('BSC_TRO', '0.015').then((res:any) => {
    //   setBSCTROStakingAPY(res)
    // })
    // getPrice('PLAY').then((res:any) => {
    //   getFarmAPY('BSC_PLAY', res).then((res:any) => {
    //     setBSCPLAYStakingAPY(res)
    //   })
    // })
    // getPrice('BACON').then((res:any) => {
    //   getFarmAPY('BSC_BACON', res).then((res:any) => {
    //     setBSCBACONStakingAPY(res)
    //   })
    // })
    // getPrice('KABY').then((res:any) => {
    //   getFarmAPY('BSC_KABY', res).then((res:any) => {
    //     setBSCKABYStakingAPY(res)
    //   })
    // })
    // getFarmAPY('BSC_PTLKX', farmlist['BSC_PTLKX'].price).then((res:any) => {
    //   setBSCPTLKXStakingAPY(res)
    // })
  }, [])

  // console.log(BSCPLAYStakingAPY)
  function openThirdWeb (url:any, type:any) {
    const isJump = localStorage.getItem(JUMPMODALTIP + type)
    // console.log(isJump)
    if (!Number(isJump)) {
      setJumpTip({
        title: t('farmLinkTitle'),
        content: t('farmLinkTip'),
        url: url,
        type: type
      })
      setTipModal(true)
    } else {
      window.open(url)
    }
  }
  const farmList = useMemo(() => {
    return [
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/' + farmlist['BSC_PTLKX'].url,
      //   title: farmlist['BSC_PTLKX'].key + ' Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCPTLKXStakingAPY ? (Number(BSCPTLKXStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: farmlist['BSC_PTLKX'].logoUrl,
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCPTLKXStakingAPY !== 'undefined' && Number(BSCPTLKXStakingAPY) === 0 && Date.now() > new Date('2021-09-17 18:00').getTime()  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/' + farmlist['BSC_KABY'].url,
      //   title: farmlist['BSC_KABY'].key + ' Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCKABYStakingAPY ? (Number(BSCKABYStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: farmlist['BSC_KABY'].logoUrl,
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCKABYStakingAPY !== 'undefined' && Number(BSCKABYStakingAPY) === 0 && Date.now() > new Date('2021-09-10 18:00').getTime()  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/farm/bsc/bacon',
      //   title: 'BACON Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCBACONStakingAPY ? (Number(BSCBACONStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'https://assets.coingecko.com/coins/images/18059/small/xDV_bhdA_400x400.jpg',
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCBACONStakingAPY !== 'undefined' && Number(BSCBACONStakingAPY) === 0 && Date.now() > 1630663200000  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/farm/bsc/polyplay',
      //   title: 'PLAY Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCPLAYStakingAPY ? (Number(BSCPLAYStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'https://assets.coingecko.com/coins/images/17314/small/09ee5fe7-7f9c-4e77-8872-d9053ac2a936.png',
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCPLAYStakingAPY !== 'undefined' && Number(BSCPLAYStakingAPY) === 0 && Date.now() > 1629885600000  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 1,
      //   url: 'https://yel.finance/',
      //   title: 'YEL Farming',
      //   info: 'YEL Farming',
      //   coin1: 'https://assets.coingecko.com/coins/images/17429/small/Logo200.png',
      //   coin2: 'FTM',
      //   coin3: '',
      //   status: 'finished'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/farm/bsc/hero',
      //   title: 'HERO Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCHEROStakingAPY ? (Number(BSCHEROStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'https://assets.coingecko.com/coins/images/16245/small/HERO-200.png',
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCHEROStakingAPY !== 'undefined' && Number(BSCHEROStakingAPY) === 0  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: 'farm/bsc',
      //   title: 'DEP Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCStakingAPY ? (Number(BSCStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'DEP',
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCStakingAPY !== 'undefined' && Number(BSCStakingAPY) === 0  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: '/farm/bsc/tro',
      //   title: 'TRO Staking',
      //   info: (t('StakingTip', {symbol: 'ANY'}) + "<span class='pecent'>" + (BSCTROStakingAPY ? (Number(BSCTROStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'TRO',
      //   coin2: 'BNB',
      //   coin3: '',
      //   status: typeof BSCTROStakingAPY !== 'undefined' && Number(BSCTROStakingAPY) === 0  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: 'farm/ftm',
      //   title: 'USDC Staking',
      //   info: (t('StakingTip', {symbol: 'USDC'}) + "<span class='pecent'>" + (FTMStakingAPY ? (Number(FTMStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'USDC',
      //   coin2: 'FTM',
      //   coin3: '',
      //   status: typeof FTMStakingAPY !== 'undefined' && Number(FTMStakingAPY) === 0  ? 'finished' : 'live'
      // },
      // {
      //   isDoubleLogo: 1,
      //   isOutLink: 0,
      //   url: 'farm/matic',
      //   title: 'USDC Staking',
      //   info: (t('StakingTip', {symbol: 'USDC'}) + "<span class='pecent'>" + (MATICStakingAPY ? (Number(MATICStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
      //   coin1: 'USDC',
      //   coin2: 'MATIC',
      //   coin3: '',
      //   status: typeof MATICStakingAPY !== 'undefined' && Number(MATICStakingAPY) === 0  ? 'finished' : 'live'
      // },
      {
        isDoubleLogo: 0,
        isOutLink: 0,
        url: farmlist['ARB2'].url,
        title: 'ARB Staking',
        info: (t('StakingTip', {symbol: 'ARB'}) + "<span class='pecent'>" + (ARBStakingAPYV2 ? (Number(ARBStakingAPYV2)).toFixed(2) : '0.00') + "%</span>"),
        coin1: 'ARB',
        coin2: 'ARBITRUM',
        coin3: '',
        status: typeof ARBStakingAPYV2 !== 'undefined' && Number(ARBStakingAPYV2) === 0 && Date.now() > 1679661322000  ? 'finished' : 'live'
      },
      {
        isDoubleLogo: 0,
        isOutLink: 0,
        url: farmlist['ARB'].url,
        title: 'ARB Staking',
        info: (t('StakingTip', {symbol: 'ARB'}) + "<span class='pecent'>" + (ARBStakingAPY ? (Number(ARBStakingAPY)).toFixed(2) : '0.00') + "%</span>"),
        coin1: 'ARB',
        coin2: 'ARBITRUM',
        coin3: '',
        status: 'finished'
      },
    ]
  }, [
    ARBStakingAPY,
    ARBStakingAPYV2,
    // MATICStakingAPY,
    // FTMStakingAPY,
    // BSCStakingAPY,
    // BSCHEROStakingAPY,
    // BSCPLAYStakingAPY,
    // BSCTROStakingAPY
  ])
  
  function FarmItem ({
    isDoubleLogo,
    isOutLink,
    url,
    title,
    info,
    coin1,
    coin2,
    coin3,
    status
  }: {isDoubleLogo:any, isOutLink:any, url:any, title:any, info:any, coin1:any, coin2?:any, coin3?:any, status?:any}) {
    let coinLogo = isDoubleLogo ? (
      <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} logoUrl={coin1.indexOf('http') === 0 ? coin1 : ''} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} logoUrl={coin2.indexOf('http') === 0 ? coin2 : ''} size='100%'/></div>
      </DoubleLogo>
    ) : (
      <div className='img'><img src={coin1} alt={title}/></div>
    )
    if (isDoubleLogo === 0) {
      // coinLogo = <div className='img'><img src={coin1} alt={title}/></div>
      coinLogo = <div className='img'><TokenLogo1 symbol={coin1} logoUrl={coin1.indexOf('http') === 0 ? coin1 : ''} size='100%'/></div>
    } else if (isDoubleLogo === 1) {
      coinLogo = <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} logoUrl={coin1.indexOf('http') === 0 ? coin1 : ''} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} logoUrl={coin2.indexOf('http') === 0 ? coin2 : ''} size='100%'/></div>
      </DoubleLogo>
    } else if (isDoubleLogo === 2) {
      coinLogo = <DoubleLogo>
        <div className="logo left"><TokenLogo1 symbol={coin1} logoUrl={coin1.indexOf('http') === 0 ? coin1 : ''} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin2} logoUrl={coin2.indexOf('http') === 0 ? coin2 : ''} size='100%'/></div>
        <span className="add">+</span>
        <div className="logo right"><TokenLogo1 symbol={coin3} logoUrl={coin3.indexOf('http') === 0 ? coin3 : ''} size='100%'/></div>
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
            {
              status === 'live' ? '' : (
                <FarmStatus className='finished'>{t('Finished')}</FarmStatus> 
              )
            }
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
          {
            status === 'live' ? '' : (
              <FarmStatus className='finished'>{t('Finished')}</FarmStatus> 
            )
          }
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
          <ButtonConfirmed style={{height: '45px', maxWidth: '200px'}} onClick={() => {
            setTipModal(false)
            localStorage.setItem(JUMPMODALTIP + JumpTip.type, '1')
            window.open(JumpTip.url)
          }}>{t('Confirm')}</ButtonConfirmed>
        </Flex>
      </ModalContent>
      <AppBody>
        <Title
          title={t('farms')}
        >
        </Title>
        <FarmListBox>
          {
            farmList.map((item:any, index:number) => {
              return (
                <FarmItem
                  key={index}
                  isDoubleLogo={item.isDoubleLogo}
                  isOutLink={item.isOutLink}
                  url={item.url}
                  title={item.title}
                  info={item.info}
                  coin1={item.coin1}
                  coin2={item.coin2}
                  coin3={item.coin3}
                  status={item.status}
                ></FarmItem>
              )
            })
          }
        </FarmListBox>
      </AppBody>
    </>
  )
}