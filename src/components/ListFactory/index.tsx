import React, { useState } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'
import { CleanButton, ButtonAdd } from '../Button'
import { RiCloseFill } from 'react-icons/ri'
import Accordion from '../Accordion'

const List = styled.ul`
  margin: 0;
  padding: 0.4rem;
  list-style: none;
`

const Item = styled.li`
  padding: 0.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Overflow = styled.span`
  overflow-x: auto;
`

const RemoveButton = styled(CleanButton)`
  width: auto;
  padding: 0.3rem;
`

const NewItemWrapper = styled(Box)`
  display: flex;
  align-items: center;
`

const NewItemInput = styled.input<{ error: boolean }>`
  border-radius: 0.5rem;
  margin-right: 0.4rem !important;
  ${({ error, theme }) => (error ? `border: 2px solid ${theme.red2} !important;` : '')}
`

export default function ListFactory({
  title,
  placeholder,
  isValidItem,
  items,
  setItems
}: {
  title: string
  setItems: (callback: any) => void
  isValidItem: (item: string) => boolean
  items: string[]
  placeholder?: string
}) {
  const [newItem, setNewItem] = useState<string>('')
  const [itemError, setItemError] = useState<boolean>(false)

  const onRemove = (targetIndex: number) => {
    setItems((prevItems: string[]) => prevItems.filter((_, index) => index !== targetIndex))
  }

  const onNewItemChange = (event: any) => {
    setItemError(false)
    setNewItem(event.target.value)
  }

  const onAdd = () => {
    if (isValidItem(newItem)) {
      setItems((prevItems: string[]) => [...prevItems, newItem])
      setNewItem('')
    } else {
      setItemError(true)
    }
  }

  return (
    <Accordion title={title}>
      <List>
        {items.map((item, index) => (
          <Item key={index}>
            <Overflow>{item}</Overflow>
            <RemoveButton type="button" onClick={() => onRemove(index)} title="Remove item">
              <RiCloseFill />
            </RemoveButton>
          </Item>
        ))}
      </List>

      <NewItemWrapper>
        <NewItemInput error={itemError} type="text" placeholder={placeholder || ''} onChange={onNewItemChange} />
        <ButtonAdd onClick={onAdd} disabled={!newItem} />
      </NewItemWrapper>
    </Accordion>
  )
}
