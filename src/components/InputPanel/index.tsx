import React, { useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`

const ContainerRow = styled.div<{ error?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  ${({ error, theme }) => (error ? `border-color: ${theme.red1}` : '')};
  transition: border-color 300ms step-start, color 500ms step-start;
  background-color: ${({ theme }) => theme.bg1};
`

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`

const Input = styled.input<{ disabled: boolean }>`
  outline: none;
  border: none;
  width: 100%;
  padding: 0px;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms step-start;
  color: ${({ theme }) => theme.text1};
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.25rem;
  font-weight: 500;

  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')};

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

export default function AddressInputPanel({
  id,
  label,
  disabled = false,
  type = 'text',
  min,
  max,
  step,
  value,
  onChange,
  error
}: {
  id?: string
  label?: string
  disabled?: boolean
  type?: string
  min?: number
  max?: number
  step?: number
  error?: boolean
  value: string | number
  onChange: (value: string) => void
}) {
  const theme = useContext(ThemeContext)

  const handleInput = useCallback(
    event => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange]
  )

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            {label && (
              <RowBetween>
                <TYPE.black color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.black>
              </RowBetween>
            )}
            <Input
              disabled={disabled}
              type={type}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="..."
              onChange={disabled ? () => null : handleInput}
              value={value}
              min={min}
              max={max}
              step={step}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  )
}
