
import React from 'react'
// import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
// import { Twitch } from 'react-feather'

import styled from 'styled-components'

import { ExternalLink } from '../../theme'

import config from '../../config'

const HeaderLinks = styled.div`
  width: 100%;
  padding: 1.5625rem 1.5625rem 0.625rem;
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.06);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexBC}
    padding: 0.5rem 1rem;
  `};
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexSC}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;

  width: 100%;
  font-weight: 500;
  color: ${({ theme }) => theme.textNav};
  font-size: 0.875rem;
  font-family: 'Manrope';
  box-sizing: border-box;
  padding: 1rem 0.875rem;
  line-height: 1rem;
  margin: 6px 0;
  height: 48px;
  border-radius: 0.5625rem;
  position: relative;
  white-space: nowrap;

  .icon {
    ${({ theme }) => theme.flexC};
    width: 38px;
    height: 38px;
    border-radius: 100%;
    background: ${({ theme }) => theme.navIconBg};
    margin-right: 1rem;
    .on {
      display: none;
    }
    .off {
      display: block;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    .icon {
      background: ${({ theme }) => theme.navBg2};
      .on {
        display: block;
      }
      .off {
        display: none;
      }
    }
  }
  &.${activeClassName} {
    color: #ffffff;
    background: ${({ theme }) => theme.bgColorLinear};
    border-bottom: none;
    font-weight: 600;
    box-shadow: 0 0.25rem 0.75rem 0 rgba(115, 75, 226, 0.51);
    .icon {
      background: ${({ theme }) => theme.navBg};
      box-shadow: 0 0.25rem 0.75rem 0 rgba(115, 75, 226, 0.51);
      .on {
        display: block;
      }
      .off {
        display: none;
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexC};
    margin:0;
    .icon {
      display:none;
    }
  `}
`

// const StyledNavLink1 = styled(ExternalLink)`
//   ${({ theme }) => theme.flexSC}
//   align-items: left;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;

//   width: 100%;
//   font-weight: 500;
//   color: ${({ theme }) => theme.textNav};
//   font-size: 0.875rem;
//   font-family: 'Manrope';
//   box-sizing: border-box;
//   padding: 1rem 0.875rem;
//   line-height: 1rem;
//   margin: 6px 0;
//   height: 48px;
//   border-radius: 0.5625rem;
//   position: relative;
//   white-space: nowrap;

//   .icon {
//     ${({ theme }) => theme.flexC};
//     width: 38px;
//     height: 38px;
//     border-radius: 100%;
//     background: ${({ theme }) => theme.navIconBg};
//     margin-right: 1rem;
//     .on {
//       display: none;
//     }
//     .off {
//       display: block;
//     }
//     img {
//       height: 100%;
//     }
//   }

//   &:hover {
//     color: ${({ theme }) => theme.textColor};
//     font-weight: 600;
//     text-decoration: none;
//     .icon {
//       background: ${({ theme }) => theme.navBg2};
//       .on {
//         display: block;
//       }
//       .off {
//         display: none;
//       }
//     }
//   }
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     ${({ theme }) => theme.flexC};
//     margin:0;
//     .icon {
//       display:none;
//     }
//   `}
// `
// const Tabs = styled.div`
//   ${({ theme }) => theme.flexColumnNoWrap}
//   align-items: center;
//   margin-bottom: 19px;
//   width: 100%;
//   padding: 1rem 1.5625rem;
//   box-sizing: border-box;
//   border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.06);
//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     display: none;
//   `}
// `

// const MenuItem = styled(ExternalLink)`
//   ${({ theme }) => theme.flexSC};
//   width: 100%;
//   height: 2.5rem;
//   font-size: 0.75rem;
//   font-weight: normal;
//   color: #96989e;
//   border-bottom: none;
//   margin: 0;
//   padding: 0.0625rem 0.875rem;
//   border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.06);
//   .icon {
//     ${({ theme }) => theme.flexC};
//     width: 38px;
//     height: 38px;
//     margin-right: 1rem;
//     .on {
//       display: none;
//     }
//     .off {
//       display: block;
//     }
//   }
//   .arrow {
//     position: absolute;
//     top: 0.875rem;
//     right: 1rem;
//   }
//   &:hover {
//     color: ${({ theme }) => theme.textColor};
//     font-weight: 600;
//     text-decoration: none;
//     .icon {
//       .on {
//         display: block;
//       }
//       .off {
//         display: none;
//       }
//     }
//   }
//   &:last-child {
//     border: none;
//   }
// `
const OutLink = styled.div`
  padding-left: 30px;
  margin-top: 78px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`
const CopyRightBox = styled.div`
  font-family: 'Manrope';
  h5 {
    font-size: 0.75rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: ${({ theme }) => theme.textColorBold};
    margin: 1rem 0 0px;
    span {
      font-weight: bold;
    }
  }
  p {
    font-size: 0.75rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: normal;
    color: #96989e;
    margin-top: 6px;
    margin-bottom: 0;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`
const OutLinkImgBox = styled.div`
  ${({ theme }) => theme.flexSC};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`
const Link = styled(ExternalLink)`
  .icon {
    ${({ theme }) => theme.flexC};
    width: 34px;
    height: 34px;
    background-color: ${({ theme }) => theme.outLinkIconBg};
    border-radius: 100%;
    margin-right: 0.625rem;
    padding: 8px;
    &:hover {
      background-color: #5f6cfc;
    }
    img {
      display: block;
      width: 100%;
    }
    .on {
      display: none;
    }
    .off {
      display: block;
    }
  }
  &:hover {
    .icon {
      .on {
        display: block;
      }
      .off {
        display: none;
      }
    }
  }
`

export default function NavList() {
  const { t } = useTranslation()

  return (
    <>
      <HeaderLinks>
        <StyledNavLink id={`dashboard-nav-link`} to={'/dashboard'}>
          <div className="icon">
            <img src={require('../../assets/images/icon/application.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/application-purpl.svg')} className="on" alt="" />
          </div>
          {t('dashboard')}
        </StyledNavLink>

        {
          config.getCurConfigInfo().isOpenRouter ? (
            <StyledNavLink
              id={`swap-nav-link`}
              to={config.getCurConfigInfo().isOpenBridge ? '/router' : '/swap'}
              
              isActive={(match, { pathname }) =>
                Boolean(match)
                || pathname.startsWith('/router')
                || pathname.startsWith('/swap')
                || (
                  config.getCurConfigInfo().isOpenBridge
                  && (
                      pathname.startsWith('/pool')
                    || pathname.startsWith('/add')
                    || pathname.startsWith('/remove')
                    || pathname.startsWith('/create')
                    || pathname.startsWith('/find')
                  )
                )
              }
            >
              <div className="icon">
                <img src={require('../../assets/images/icon/router.svg')} className="off" alt="" />
                <img src={require('../../assets/images/icon/network-white.svg')} className="on" alt="" />
              </div>
              {config.getCurConfigInfo().isOpenBridge ? t('router') : t('swap')}
            </StyledNavLink>
          ) : ''
        }
        {
          config.getCurConfigInfo().isOpenRouterTxns ? (
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              <div className="icon">
                <img src={require('../../assets/images/icon/swap.svg')} className="off" alt="" />
                <img src={require('../../assets/images/icon/swap-purpl.svg')} className="on" alt="" />
              </div>
              {t('swap')}
            </StyledNavLink>
          ) : ''
        }
        {
          config.getCurConfigInfo().isOpenBridge ? (
            <StyledNavLink id={`bridge-nav-link`} to={'/bridge'}>
              <div className="icon">
                <img src={require('../../assets/images/icon/bridge.svg')} className="off" alt="" />
                <img src={require('../../assets/images/icon/bridge-purpl.svg')} className="on" alt="" />
              </div>
              {t('bridge')}
            </StyledNavLink>
          ) : (
            config.getCurConfigInfo().isOpenRouter ? (
              <StyledNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/create') ||
                  pathname.startsWith('/find')
                }
              >
                <div className="icon">
                  <img src={require('../../assets/images/icon/pool.svg')} className="off" alt="" />
                  <img src={require('../../assets/images/icon/pool-purpl.svg')} className="on" alt="" />
                </div>
                {t('pool')}
              </StyledNavLink>
            ) : ''
          )
        }
        {
          config.getCurConfigInfo().isOpenNFT ? (
            <StyledNavLink id={`bridge-nav-link`} to={'/nft'}>
              <div className="icon">
                <img src={require('../../assets/images/icon/bridge.svg')} className="off" alt="" />
                <img src={require('../../assets/images/icon/bridge-purpl.svg')} className="on" alt="" />
              </div>
              {t('nftrouter')}
            </StyledNavLink>
          ) : ''
        }

        {
          config.getCurConfigInfo().isOpenMerge ? (
            <StyledNavLink
              id={`swap-nav-link`}
              to={'/v2/mergeswap'}
            >
              <div className="icon">
                <img src={require('../../assets/images/icon/router.svg')} className="off" alt="" />
                <img src={require('../../assets/images/icon/network-white.svg')} className="on" alt="" />
              </div>
              {t('bridge')}
            </StyledNavLink>
          ) : ''
        }


        {/* <StyledNavLink
          id={`swap-nav-link`}
          to={'/farm'}
        >
          <div className="icon">
            <img src={require('../../assets/images/icon/send.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/send-purpl.svg')} className="on" alt="" />
          </div>
          {t('farms')}
        </StyledNavLink> */}
        {/* <StyledNavLink1 id="link" href="https://anyswap.net">
          <div className="icon">
            <img src={require('../../assets/images/icon/explorer-purpl.png')} className="off" alt="" />
            <img src={require('../../assets/images/icon/explorer.png')} className="on" alt="" />
          </div>
          {t('explorer')}
        </StyledNavLink1> */}
      </HeaderLinks>
      {/* <Tabs>
        <MenuItem id="link" href={config.getCurChainInfo(chainId).marketsUrl}>
          <div className="icon">
            <img src={require('../../assets/images/icon/markets.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/markets-purpl.svg')} className="on" alt="" />
          </div>
          {t('Markets')}
        </MenuItem>
        <MenuItem id="link" href="https://anyswaphelp.zendesk.com/hc/en-us">
          <div className="icon">
            <Twitch className="off" style={{color: '#96989E',fontSize:'18px',width:'18px',height:'18px'}} />
            <Twitch className="on" style={{color: '#062536',fontSize:'18px',width:'18px',height:'18px'}} />
          </div>
          {t('support')}
        </MenuItem>
        <MenuItem id="link" href="https://vote.anyswap.exchange/">
          <div className="icon">
            <img src={require('../../assets/images/icon/any.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/any-purpl.svg')} className="on" alt="" />
          </div>
          {t('ANYToken')}
        </MenuItem>
        <MenuItem id="link" href="https://anyswap.net/network">
          <div className="icon">
            <img src={require('../../assets/images/icon/network.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/network-purpl.svg')} className="on" alt="" />
          </div>
          {t('Network')}
        </MenuItem>
        <MenuItem id="link" href="https://anyswap-faq.readthedocs.io/en/latest/index.html">
          <div className="icon">
            <img src={require('../../assets/images/icon/documents.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/documents-purpl.svg')} className="on" alt="" />
          </div>
          {t('Documents')}
        </MenuItem>
        <MenuItem id="link" href="https://dard6erxu8t.typeform.com/to/C7RwF08A">
          <div className="icon">
            <img src={require('../../assets/images/icon/bridge-gray.svg')} className="off" alt="" />
            <img src={require('../../assets/images/icon/bridge.svg')} className="on" alt="" />
          </div>
          {t('Listing')}
        </MenuItem>
      </Tabs> */}
      <OutLink>
        <OutLinkImgBox>
          <Link id="link" href="https://t.me/anyswap">
            <div className="icon">
              <img src={require('../../assets/images/icon/telegram.svg')} className="off" alt="" />
              <img src={require('../../assets/images/icon/telegram-white.svg')} className="on" alt="" />
            </div>
          </Link>
        </OutLinkImgBox>
        <CopyRightBox>
          <p>© CHANGE_NAME 2020. All rights reserved.</p>
        </CopyRightBox>
      </OutLink>
    </>
  )
}
