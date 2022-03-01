import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import { MyBalanceBox } from '../Dashboard/styleds'
import Interface from './Interface'
import Contracts from './Contracts'

const SettingsWrapper = styled(MyBalanceBox)`
  max-width: 35rem;
  margin: 0 auto;
`

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.bg3};
`

const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  cursor: pointer;
  padding: 0.4rem 0.7rem;
  //margin: 0.1rem 0 0.4rem;
  font-size: 1em;
  border: none;
  background-color: ${({ theme, active }) => (active ? theme.bg2 : 'transparent')};
  color: ${({ theme }) => theme.text1};

  :first-child {
    border-top-left-radius: inherit;
    border-bottom-left-radius: inherit;
  }

  :last-child {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
  }
`

const Content = styled.div`
  border-radius: 1rem;
`

export default function Settings() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('interface')

  const returnTabs = () => {
    return [
      { tabKey: 'interface', tabName: 'interface' },
      { tabKey: 'contracts', tabName: 'contracts' }
    ].map((info, index) => {
      return (
        <Tab key={index} active={tab === info.tabKey} onClick={() => setTab(info.tabKey)}>
          {t(info.tabName)}
        </Tab>
      )
    })
  }

  return (
    <AppBody>
      <SettingsWrapper>
        <Tabs>{returnTabs()}</Tabs>
        <Content>
          {tab === 'contracts' && <Contracts />}
          {tab === 'interface' && <Interface />}
        </Content>
      </SettingsWrapper>
    </AppBody>
  )
}
