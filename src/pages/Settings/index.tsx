import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'
import { resetAppData } from '../../utils/storage'
import AppBody from '../AppBody'
import { chainInfo } from '../../config/chainConfig'
import { useAppState } from '../../state/application/hooks'
import { MyBalanceBox } from '../Dashboard/styleds'
import Interface from './Interface'
import Contracts from './Contracts'
import FirstSetup from './FirstSetup'
import config from '../../config'

export const OptionWrapper = styled.div<{ margin?: number; flex?: boolean }>`
  margin: ${({ margin }) => margin || 0.2}rem 0;
  padding: 0.2rem;
  ${({ flex }) => (flex ? 'display: flex; align-items: center; justify-content: space-between' : '')}
`

export const Notice = styled.div<{ warning?: boolean; error?: boolean; margin?: string }>`
  width: 100%;
  padding: 0.5rem;
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
  border-radius: 0.4rem;
  background-color: ${({ theme, warning, error }) => (warning ? theme.yellow1 : error ? theme.red1 : theme.bg3)};
`

const StorageNotice = styled.div`
  margin-bottom: 0.6rem;
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
  const { chainId, account, library } = useActiveWeb3React()
  const [tabs, setTabs] = useState<string[]>([])
  const [tab, setTab] = useState('interface')

  const { owner } = useAppState()

  const [onStorageChain, setOnStorageChain] = useState(false)
  const [isInstalledOnDomain] = useState<boolean>(!!owner)

  useEffect(() => {
    setOnStorageChain(!!chainId && chainId === config.STORAGE_CHAIN_ID)
  }, [chainId])

  useEffect(() => {
    if (!isInstalledOnDomain) {
      setTabs(['install'])
      setTab('install')
    } else {
      if (onStorageChain) {
        setTabs(['interface', 'contracts'])
        setTab('interface')
      } else {
        setTabs(['contracts'])
        setTab('contracts')
      }
    }
  }, [onStorageChain])

  const [isOwner, setIsOwner] = useState<boolean>(!owner || account?.toLowerCase() === owner?.toLowerCase())

  useEffect(() => {
    setIsOwner(!owner || account?.toLowerCase() === owner?.toLowerCase())
  }, [account, owner])

  const reset = async () => {
    await resetAppData({
      library,
      owner: account || ''
    })
  }

  return isOwner ? (
    <AppBody>
      <SettingsWrapper>
        <StorageNotice>
          {t('storageNetwork')}: {chainInfo[config.STORAGE_CHAIN_ID]?.networkName}. {t('useThisNetworkToSaveSettings')}.{' '}
          {t('interfaceSettingsAreVisibleOnlyForThisNetwork')}.
        </StorageNotice>
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
          {tab === 'install' && <FirstSetup />}
          {tab === 'contracts' && <Contracts />}
          {tab === 'interface' && chainId === config.STORAGE_CHAIN_ID && <Interface />}
        </Content>

        {process.env.NODE_ENV === 'development' && (
          <button onClick={reset} disabled={!account || !onStorageChain}>
            Reset app data
          </button>
        )}
      </SettingsWrapper>
    </AppBody>
  ) : null
}
