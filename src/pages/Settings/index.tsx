import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { MyBalanceBox } from '../Dashboard/styleds'
import Interface from './Interface'
import Contracts from './Contracts'
import config from '../../config'

export const OptionWrapper = styled.div<{ margin?: number; flex?: boolean }>`
  margin: ${({ margin }) => margin || 0.2}rem 0;
  padding: 0.3rem 0;

  ${({ flex }) => (flex ? 'display: flex; align-items: center; justify-content: space-between' : '')}
`

export const Notice = styled.div<{ warning?: boolean; error?: boolean }>`
  margin: 0.6rem auto;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme, warning, error }) => (warning ? theme.yellow3 : error ? theme.red2 : theme.bg3)};
  background-color: ${({ theme, warning, error }) => (warning ? theme.yellow1 : error ? theme.red1 : theme.bg3)};
`

export const OptionLabel = styled.label`
  display: flex;
  flex-direction: column;
`

const SettingsWrapper = styled(MyBalanceBox)`
  max-width: 50rem;
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
  const { chainId } = useActiveWeb3React()
  const [tabs, setTabs] = useState<string[]>([])
  const [tab, setTab] = useState('interface')

  useEffect(() => {
    if (chainId === config.STORAGE_CHAIN_ID) {
      setTabs(['interface', 'contracts'])
      setTab('interface')
    } else {
      setTabs(['contracts'])
      setTab('contracts')
    }
  }, [chainId])

  return (
    <AppBody>
      <SettingsWrapper>
        {tabs.length > 1 ? (
          <Tabs>
            {tabs.map((name, index) => (
              <Tab key={index} active={tab === name} onClick={() => setTab(name)}>
                {t(name)}
              </Tab>
            ))}
          </Tabs>
        ) : null}
        <Content>
          {tab === 'contracts' && <Contracts />}
          {chainId === config.STORAGE_CHAIN_ID && tab === 'interface' && <Interface />}
        </Content>
      </SettingsWrapper>
    </AppBody>
  )
}
