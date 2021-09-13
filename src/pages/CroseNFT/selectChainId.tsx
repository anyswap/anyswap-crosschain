import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'

import ModalContent from '../../components/Modal/ModalContent'
import {
  OptionCardClickable,
  Option
} from '../../components/Header/SelectNetwork'
import TokenLogo from '../../components/TokenLogo'

import config from '../../config'

interface SelectChainIDProps {
  id?: any
  selectChainId?: any
  chainList?: Array<any>
  onChainSelect?: (selectChainId: any) => void
}

const SelectChainBox = styled.div`
  ${({ theme }) => theme.flexC};
  flex-wrap: wrap;
  width: 100px;
  height: 120px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  cursor:pointer;
  .txt {
    width: 100%;
    text-align: center;
  }
`

export default function SelectChainIDPanel ({
  id,
  selectChainId,
  chainList = [],
  onChainSelect
}: SelectChainIDProps) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)

  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
      }
    },
    [onChainSelect]
  )

  return (
    <>
      <ModalContent
        isOpen={modalOpen}
        title={t('selectNetwork')}
        onDismiss={() => {
          setModalOpen(false)
        }}
        padding={'0rem'}
      >
        {
          chainList.map((item, index) => {
            return (
              <OptionCardClickable
                key={index}
                className={selectChainId && selectChainId === item ? 'active' : ''}
                onClick={() => (selectChainId && selectChainId === item ? null : handleCurrencySelect(item))}
              >
                {/* {Option(item, selectChainId)} */}
                <Option curChainId={item} selectChainId={chainId}></Option>
              </OptionCardClickable>
            )
          })
        }
      </ModalContent>

      <SelectChainBox
        id={id}
        onClick={() => setModalOpen(true)}
      >
        <TokenLogo symbol={config.getCurChainInfo(selectChainId).networkLogo ?? config.getCurChainInfo(selectChainId).symbol} size={'50px'}></TokenLogo>
        <p className="txt">{config.getCurChainInfo(selectChainId).symbol}</p>
      </SelectChainBox>
    </>
  )
}