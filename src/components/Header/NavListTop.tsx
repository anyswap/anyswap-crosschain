
import React, {useMemo, useRef} from 'react'
// import { Text } from 'rebass'
import { MoreHorizontal } from 'react-feather'
import { NavLink } from 'react-router-dom'
// import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
// import styled, {ThemeContext} from 'styled-components'
import styled from 'styled-components'

import { ExternalLink } from '../../theme'
import {
  // LinkList,
  navList,
  moreList
} from './nav'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleNavMenu } from '../../state/application/hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
// import config from '../../config'
import { AutoColumn } from '../Column'
// import Modal from '../Modal'
// import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
// import { TYPE } from '../../theme'

const HeaderLinks = styled.div`
  ${({ theme }) => theme.flexEC};
  width: 100%;
  height: 100%;
  padding: 0rem 1rem 0rem;
  border-bottom: none;
  position:relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    ${({ theme }) => theme.flexBC}
    padding: 0.5rem 1rem;
  `};
`
const MoreIcon = styled(MoreHorizontal)`
color: ${({ theme }) => theme.textNav};
min-width: 41px;
max-width: 41px;
cursor:pointer;
padding: 0 8px;
display:block;
// width: 100%;
// height: 100%;
// font-size: 16px;
  // ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //   display: none;
  // `};
`

const activeClassName = 'ACTIVE'

const LinkStyle = styled.div.attrs({
  activeClassName
})`
  height:100%;
  a {
    ${({ theme }) => theme.flexSC}
    align-items: left;
    outline: none;
    cursor: pointer;
    text-decoration: none;
  
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.textNav};
    font-size: 16px;
    // font-weight: bold;
    font-family: 'Manrope';
    box-sizing: border-box;
    padding: 1rem 8px;
    line-height: 1rem;
    margin: 0;
    // border-radius: 0.5625rem;
    position: relative;
    white-space: nowrap;
    border-bottom: 2px solid transparent;;
    &.small {
      padding: 0.5rem 8px;
    }
    &:hover {
      color: ${({ theme }) => theme.textColor};
      font-weight: 600;
    }
    &.${activeClassName} {
      // color: #ffffff;
      // background: ${({ theme }) => theme.bgColorLinear};
      // background: rgba(0,0,0,.1);
      border-bottom: none;
      font-weight: 600;
      border-bottom: 2px solid ${({ theme }) => theme.tabActiveColor};
      color: ${({ theme }) => theme.tabActiveColor};
      // box-shadow: 0 0.25rem 0.75rem 0 rgba(115, 75, 226, 0.51);
    }
    &:focus,&:hover,&:active{
      text-decoration: none;
    }
    ${({ theme }) => theme.mediaWidth.upToMedium`
      ${({ theme }) => theme.flexC};
      margin:0;
    `}
  }
  &.top {
    ${({ theme }) => theme.flexSC};
  }
  &.bottom {
    display:none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    &.top {
      display:none;
    }
    &.bottom {
      width:100%;
      ${({ theme }) => theme.flexBC};
    }
  `}
`

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  text-decoration: auto;
  &.small {
    padding: 0.5rem 8px;
  }
  &:hover {
    text-decoration: auto;
  }
`
// console.log(StyledNavLink)

const StyledNavLink1 = styled(ExternalLink)`
  &:hover {
    text-decoration: auto;
  }
`

const MenuFlyout = styled.span`
  min-width: 15.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  // ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  //   min-width: 18.125rem;
  //   right: -0px;
  // `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
    top: auto;
    bottom:4.2rem;
    right: 10px;
  `};
`

export default function NavList({position}:{position:string}) {
  const node = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  const navKey = useMemo(() => {
    if (position === 'top') {
      return ApplicationModal.NAV_TOP
    }
    return ApplicationModal.NAV_BOTTOM
  }, [position, ApplicationModal])
  const open = useModalOpen(navKey)
  const toggle = useToggleNavMenu(navKey)
  useOnClickOutside(node, open ? toggle : undefined)
  // const theme = useContext(ThemeContext)
  // console.log(open)

  // const viewNavList = useMemo(() => {
  //   const arr = []
  //   for (const obj of LinkList) {
  //     if (!obj.isView) continue
  //     arr.push(obj)
  //   }
  //   // console.log(arr)
  //   // console.log(arr.slice(4))
  //   // return {
  //   //   list: arr,
  //   //   more: []
  //   // }
  //   return {
  //     list: arr.slice(0,4),
  //     more: arr.slice(4)
  //   }
  // }, [LinkList])

  return (
    <>
      <HeaderLinks ref={node as any}>
        <LinkStyle className={position}>
          {
            navList.map((item, index) => {
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
                      // console.log('match',match)
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
          {/* {viewNavList.more.length > 0 ? <MoreIcon onClick={() => {
            console.log(111111)
            toggle()
          }}></MoreIcon> : ''} */}
          <MoreIcon id={"open-settings-dialog-button-" + position} onClick={toggle}></MoreIcon>
          {open && (
            <MenuFlyout>
              <AutoColumn gap="md" style={{ padding: '1rem' }}>
                {
                  moreList.map((item:any, index:any) => {
                    if (!item.isView) return ''
                    if (!item.isOutLink) {
                      return (
                        <RowBetween key={index}>
                          <StyledNavLink
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
                            className={(item.className ? item.className : '') + '  small'} 
                          >
                            <RowFixed>
                              {t(item.textKey)}
                            </RowFixed>
                          </StyledNavLink>
                        </RowBetween>
                      )
                    } else {
                      return (
                        <RowBetween key={index}>
                          <StyledNavLink1 key={index} href={item.path} className="small">
                            <RowFixed>
                                {t(item.textKey)}
                            </RowFixed>
                          </StyledNavLink1>
                        </RowBetween>
                      )
                    }
                  })
                }
              </AutoColumn>
            </MenuFlyout>
          )}
        </LinkStyle>
      </HeaderLinks>
    </>
  )
}
