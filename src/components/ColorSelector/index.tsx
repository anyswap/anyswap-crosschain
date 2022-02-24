import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { HuePicker } from 'react-color'
import InputPanel from '../../components/InputPanel'

const ColorTop = styled.div`
  display: flex;
  margin-bottom: 0.7rem;
  align-items: center;
  justify-content: space-between;
`

const Label = styled.label`
  width: auto !important;
  display: flex;
  align-items: center;
`

const colorPickerStyles = {
  default: {
    picker: {
      width: '100%'
    }
  }
}

export default function ColorSelector({
  name,
  defaultColor,
  onColor
}: {
  name: string
  defaultColor: string
  onColor: (v: string) => void
}) {
  const { t } = useTranslation()
  const [color, setColor] = useState(defaultColor)
  const [customColor, setCustomColor] = useState(false)

  const updateColor = (value: string) => {
    setColor(value)
    onColor(value)
  }

  return (
    <div>
      <ColorTop>
        <span>{name}</span>
        <Label>
          <input type="checkbox" name="use custom color" onChange={() => setCustomColor(prevState => !prevState)} />{' '}
          {t('own')}
        </Label>
      </ColorTop>

      {customColor ? (
        <InputPanel label={`(rgb, hsl, hex)`} value={color} onChange={updateColor} />
      ) : (
        <HuePicker
          color={color}
          onChangeComplete={(color: { hex: string }) => updateColor(color.hex)}
          styles={colorPickerStyles}
        />
      )}
    </div>
  )
}
