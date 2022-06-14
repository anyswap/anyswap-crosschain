import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.5rem 70px;
  overflow:auto;
  margin:auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0rem 0px;
  `};
`

const BodyContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 0rem 0px;
  overflow: auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    overflow:auto;
    padding: 0px;
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
