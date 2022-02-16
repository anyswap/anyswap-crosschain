import React from 'react'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'

// import { AlertTriangle, X } from 'react-feather'
import { X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: #fdf6ec;
  color: #062536;
  font-size: 11px;
  justify-content: center;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  position: relative;
`

export const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()

  return null

  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}></div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}></div>
      <StyledClose size={12} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}
