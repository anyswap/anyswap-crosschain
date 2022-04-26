import React from 'react'
import styled from 'styled-components'
import { useDarkModeManager } from '../../state/user/hooks'

const LockReason = styled.strong<{ isDark?: boolean }>`
  display: inline-block;
  margin-bottom: 0.4rem;
  color: ${({ theme, isDark }) => (isDark ? theme.yellow2 : theme.yellow3)};
`

const LockWrapper = styled.div<{ enabled?: boolean }>`
  ${({ enabled }) =>
    enabled
      ? `
      cursor: not-allowed;
      opacity: 0.3;
      pointer-events: none;
    `
      : ''}
`

export default function Lock({
  children,
  enabled,
  reason
}: {
  children: JSX.Element | JSX.Element[]
  enabled?: boolean
  reason?: string
}) {
  const [isDark] = useDarkModeManager()

  return (
    <>
      {reason && <LockReason isDark={isDark}>{reason}</LockReason>}
      <LockWrapper enabled={enabled}>{children}</LockWrapper>
    </>
  )
}
