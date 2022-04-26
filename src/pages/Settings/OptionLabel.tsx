import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Notice } from './index'

export const OptionLabelWrapper = styled.label`
  display: flex;
  flex-direction: column;
`

export default function OptionLabel({
  children,
  displayChainsLink
}: {
  children: JSX.Element | JSX.Element[]
  displayChainsLink?: boolean
}) {
  const { t } = useTranslation()

  return (
    <OptionLabelWrapper>
      {displayChainsLink && (
        <Notice margin="0 0 .5rem">
          {t('networksInfo')}:{' '}
          <a href="https://chainlist.org/" target="_blank" rel="noreferrer">
            chainlist.org
          </a>
        </Notice>
      )}

      {children}
    </OptionLabelWrapper>
  )
}
