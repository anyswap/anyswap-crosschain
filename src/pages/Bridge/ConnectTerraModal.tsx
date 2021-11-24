import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useConnectedWallet, useWallet, ConnectType } from '@terra-money/wallet-provider'
import ModalContent from '../../components/Modal/ModalContent'

import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonPrimary } from '../../components/Button'

const Flex = styled.div`
  ${({theme}) => theme.flexC}
`

export default function ConnectTerraModal () {
  const { t } = useTranslation()
  const { connect } = useWallet()
  const connectedWallet = useConnectedWallet()
  const [modalView, setModalView] = useState(false)
  return (
    <>
      <ModalContent
        isOpen={modalView}
        title={t('ConnectWallet')}
        onDismiss={() => {
          setModalView(false)
        }}
      >
        {
          ConnectType.CHROME_EXTENSION === connectedWallet?.connectType ? (
            <>
              <p>{t('WalletAddress')}：</p>
              <p>
                {
                  connectedWallet?.walletAddress.length > 20
                  ? connectedWallet?.walletAddress.slice(0, 10) +
                    '...' +
                    connectedWallet?.walletAddress.slice(connectedWallet?.walletAddress.length - 11, connectedWallet?.walletAddress.length)
                  : ''
                }
              </p>
            </>
          )
          : (
            <Flex>
              {t('Loading')}
            </Flex>
          )
        }
        <BottomGrouping>
          <ButtonPrimary onClick={() => {
            setModalView(false)
          }}>
            {t('Confirm')}
          </ButtonPrimary>
        </BottomGrouping>
      </ModalContent>
      <ButtonPrimary onClick={() => {
        connect(ConnectType.CHROME_EXTENSION)
        setModalView(true)
      }}>
        {t('ConnectTerraStation')}
      </ButtonPrimary>
    </>
  )
}