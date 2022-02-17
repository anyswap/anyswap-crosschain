import React from 'react'
import styled from 'styled-components'
import Polling from '../Header/Polling'
import { ExternalLink } from '../../theme'

const FooterWrapper = styled.div`
  padding: 0.3rem;
  font-size: 0.9em;
  color: ${({ theme }) => theme.text2};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const Copyright = styled.p<{ pale?: boolean }>`
  margin: 0 0 0.7rem 0;
  text-align: center;
  ${({ pale }) => (pale ? `opacity: 0.92; font-size: 0.96em;` : '')}

  a {
    color: ${({ theme }) => theme.blue1};
    text-decoration: none;
  }
`

export default function Footer() {
  const year = new Date().getFullYear()
  const copyright = `© CHANGE_ME ${year}`
  const SourceCopyright = (
    <>
      Powered by{' '}
      <a href="#" target="_blank" rel="noopener noreferrer">
        OnOut - no-code tool for creating CROSS-CHAIN
      </a>
    </>
  )

  return (
    <FooterWrapper>
      <Content>
        <Copyright>{copyright}</Copyright>
        <Copyright pale>{SourceCopyright}</Copyright>

        <Link id="link" href="https://t.me/anyswap">
          <div className="icon">
            <img src={require('../../assets/icon/telegram.svg')} className="off" alt="" />
            <img src={require('../../assets/icon/telegram-white.svg')} className="on" alt="" />
          </div>
        </Link>
      </Content>

      <Polling />
    </FooterWrapper>
  )
}
