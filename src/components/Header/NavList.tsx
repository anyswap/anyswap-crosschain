
import React from 'react'
// import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
// import { Twitch } from 'react-feather'

import styled from 'styled-components'

import { ExternalLink } from '../../theme'
import {LinkList} from './nav'
// import config from '../../config'

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

const StyledNavLink1 = styled(ExternalLink)`
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
    img {
      height: 100%;
    }
  }

  &:hover {
    color: ${({ theme }) => theme.textColor};
    font-weight: 600;
    text-decoration: none;
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
  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexC};
    margin:0;
    .icon {
      display:none;
    }
  `}
`

export default function NavList() {
  const { t } = useTranslation()

  return (
    <>
      <HeaderLinks>

        {
          LinkList.map((item, index) => {
            if (!item.isView) return ''
            if (!item.isOutLink) {
              return (
                <StyledNavLink
                  key={index}
                  to={item.path}
                  isActive={(match, { pathname }) => {
                    Boolean(match)
                    || pathname.startsWith('/router')
                    || pathname.startsWith('/v1/router')
                    || pathname.startsWith('/swap')
                    if (Boolean(match)) {
                      return true
                    } else if (item.isActive) {
                      let isAc = false
                      for (const k of item.isActive) {
                        if (pathname.startsWith(k)) isAc = true; break;
                      }
                      return isAc
                    } else {
                      return false
                    }
                  }}
                  className={(item.className ? item.className : '')} 
                >
                  {t(item.textKey)}
                </StyledNavLink>
              )
            } else {
              return (
                <StyledNavLink1 key={index} href={item.path}>
                  {t(item.textKey)}
                </StyledNavLink1>
              )
            }
          })
        }
      </HeaderLinks>
    </>
  )
}
