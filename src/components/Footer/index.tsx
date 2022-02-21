import React from 'react'
import styled from 'styled-components'
import { BsTelegram } from 'react-icons/bs'
import Polling from '../Header/Polling'
import { ExternalLink } from '../../theme'
import { useAppState } from '../../state/application/hooks'

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

const Copyright = styled.p<{ pale?: boolean }>`
  padding: 0.4rem;
  margin: 0;
  text-align: center;
  ${({ pale }) => (pale ? `opacity: 0.92; font-size: 0.96em;` : '')}

  a {
    color: ${({ theme }) => theme.blue1};
    text-decoration: none;
  }
`

const SocialLinks = styled.div`
  padding: 0.8rem 0;
  display: flex;
  align-items: center;
`

const Link = styled(ExternalLink)`
  width: 1.6rem;

  :not(:last-child) {
    margin-right: 0.625rem;
  }

  .icon {
    color: ${({ theme }) => theme.primary2};
    width: 100%;
    height: 100%;
  }
`

export default function Footer() {
  const year = new Date().getFullYear()
  const { copyrightName } = useAppState()
  const copyright = copyrightName ? `© ${copyrightName} ${year}` : null
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
        {copyright && <Copyright>{copyright}</Copyright>}
        <Copyright pale>{SourceCopyright}</Copyright>

        <SocialLinks>
          <Link id="link" href="">
            <BsTelegram className="icon" />
          </Link>
        </SocialLinks>
      </Content>

      <Polling />
    </FooterWrapper>
  )
}
