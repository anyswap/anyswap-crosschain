import React, { useState } from 'react'
import styled from 'styled-components'
import { CleanButton } from '../Button'
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'

const Wrapper = styled.div<{ minimalStyles?: boolean; padding: number; borderRadius: number }>`
  ${({ minimalStyles, padding, borderRadius, theme }) =>
    minimalStyles
      ? ``
      : `
    padding: ${padding}rem ${padding * 1.6}rem;
    border-radius: ${borderRadius}rem;
    border: 1px solid ${theme.bg4};
    background-color: ${theme.bg3};
  `}
`

const Header = styled(CleanButton)`
  padding: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h4`
  font-weight: 400;
  margin: 0;
`

const ArrowWrapper = styled.div`
  padding: 0.3rem;
`

const Content = styled.div<{ padding: boolean }>`
  ${({ padding }) => (padding ? `padding: inherit` : '')}
`

export default function Accordion({
  title,
  children,
  padding = 0.4,
  borderRadius = 1.25,
  contentPadding = false,
  minimalStyles,
  openByDefault
}: {
  title: string
  children: JSX.Element | JSX.Element[]
  padding?: number
  borderRadius?: number
  contentPadding?: boolean
  minimalStyles?: boolean
  openByDefault?: boolean
}) {
  const [open, setOpen] = useState<boolean>(openByDefault ?? false)

  return (
    <Wrapper padding={padding} borderRadius={borderRadius} minimalStyles={minimalStyles}>
      <Header onClick={() => setOpen(!open)}>
        <Title>{title}</Title>
        <ArrowWrapper>{open ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}</ArrowWrapper>
      </Header>

      {open && <Content padding={minimalStyles ? false : contentPadding}>{children}</Content>}
    </Wrapper>
  )
}
