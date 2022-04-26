import React from 'react'
import validUrl from 'valid-url'
import styled from 'styled-components'
import Polling from '../Header/Polling'
import { useAppState } from '../../state/application/hooks'
import { TiSocialInstagram } from 'react-icons/ti'
import { FaTelegramPlane } from 'react-icons/fa'
import { BsQuestionCircle } from 'react-icons/bs'
import { SiTwitter } from 'react-icons/si'
import { AiOutlineYoutube } from 'react-icons/ai'
import { BsFacebook, BsGithub, BsDiscord, BsMedium, BsReddit, BsLinkedin, BsLightningChargeFill } from 'react-icons/bs'

const FooterWrapper = styled.footer`
  padding: 0.6rem 0.3rem 1.6rem;
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
  padding-top: 0.5rem;
  display: flex;
  align-items: center;
`

const SocialLink = styled.a`
  font-size: 1.6em;
  color: ${({ theme }) => theme.primary3};
  transition: 0.2s;

  & + & {
    margin-left: 17%;
  }

  :hover {
    opacity: 0.7;
  }
`

const returnIconByUri = (uri: string) => {
  const lowerUri = uri.toLowerCase()
  let icon = <BsQuestionCircle title={uri} />

  if (uri.length) {
    if (lowerUri.match(/twitter/)) icon = <SiTwitter title="Twitter" />
    if (lowerUri.match(/instagram/)) icon = <TiSocialInstagram title="Instagram" />
    if (lowerUri.match(/t\.me/)) icon = <FaTelegramPlane title="Telegram" />
    if (lowerUri.match(/youtube/)) icon = <AiOutlineYoutube title="Youtube" />
    if (lowerUri.match(/facebook/)) icon = <BsFacebook title="Facebook" />
    if (lowerUri.match(/github/)) icon = <BsGithub title="Github" />
    if (lowerUri.match(/discord/)) icon = <BsDiscord title="Discord" />
    if (lowerUri.match(/medium/)) icon = <BsMedium title="Medium" />
    if (lowerUri.match(/reddit/)) icon = <BsReddit title="Reddit" />
    if (lowerUri.match(/linkedin/)) icon = <BsLinkedin title="Linkedin" />
    if (lowerUri.match(/snapshot/)) icon = <BsLightningChargeFill title="Snapshot" />
  }

  return icon
}

export default function Footer() {
  const year = new Date().getFullYear()
  const { projectName, disableSourceCopyright, socialLinks } = useAppState()
  const copyright = projectName ? `© ${projectName} ${year}` : null
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
        {!disableSourceCopyright && <Copyright pale>{SourceCopyright}</Copyright>}

        {!!socialLinks?.length && (
          <SocialLinks>
            {socialLinks.map((link: string, index: number) => {
              if (validUrl.isUri(link)) {
                return (
                  <SocialLink key={index} href={link} target="_blank">
                    {returnIconByUri(link)}
                  </SocialLink>
                )
              }

              return null
            })}
          </SocialLinks>
        )}
      </Content>

      <Polling />
    </FooterWrapper>
  )
}
