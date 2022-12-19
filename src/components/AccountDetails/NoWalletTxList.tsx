import React, { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import {useActiveReact} from '../../hooks/useActiveReact'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { AutoRow } from '../Row'
import Transaction from './Transaction'

// import { SUPPORTED_WALLETS } from '../../constants'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { LinkStyledButton, TYPE } from '../../theme'

import Modal from '../Modal'


import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNoWalletModalToggle } from '../../state/application/hooks'

// import { ChainId } from '../../config/chainConfig/chainId'

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`


const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`


const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`


function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  pendingTransactions: string[]
  confirmedTransactions: string[]
}

export default function NoWalletTxList({
  pendingTransactions,
  confirmedTransactions,
}: AccountDetailsProps) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { chainId} = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  const noWalletModalOpen = useModalOpen(ApplicationModal.NO_WALLET)
  // const {logoutFlow} = useLoginFlow()
  const toggleWalletModal = useNoWalletModalToggle()

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <>
      <Modal isOpen={noWalletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          
        </UpperSection>
        {!!pendingTransactions.length || !!confirmedTransactions.length ? (
          <LowerSection>
            <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
              <TYPE.body>{t('RecentTransactions')}</TYPE.body>
              <LinkStyledButton onClick={clearAllTransactionsCallback}>({t('clearAll')})</LinkStyledButton>
            </AutoRow>
            {renderTransactions(pendingTransactions)}
            {renderTransactions(confirmedTransactions)}
          </LowerSection>
        ) : (
          <LowerSection>
            <TYPE.body color={theme.text1}>{t('tip17')}</TYPE.body>
          </LowerSection>
        )}
      </Modal>
    </>
  )
}
