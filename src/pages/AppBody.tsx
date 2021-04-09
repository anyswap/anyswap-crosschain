import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  // max-width: 420px;
  width: 100%;
  height: 100%;
  // background: ${({ theme }) => theme.bg1};
  // box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
  //   0px 24px 32px rgba(0, 0, 0, 0.01);
  // border-radius: 30px;
  padding: 1rem;
  overflow:auto;
`

const BodyContent = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  bottom: 0;
  left: 320px;
  padding: 2.5rem 97px;
  overflow: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow:auto;
    padding: 16px;
    left:0;
    bottom:65px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BodyContent>
      <BodyWrapper>{children}</BodyWrapper>
    </BodyContent>
  )
}
