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
import { useToggleNetworkModal } from '../../state/application/hooks'

import config from '../../config'

interface SelectChainIDProps {
  id?: any
  selectChainId?: any
  chainList?: Array<any>
  onChainSelect?: (selectChainId: any) => void
  label?: string
  type?: string
}

const SelectChainBox = styled.div`
  width: 100px;
`

const SelectChainContent = styled.div`
  width: 100%;
  ${({ theme }) => theme.flexC};
  flex-wrap: wrap;
  height: 100px;
  padding: 10px;
  border-radius: 20px;
  // border: 1px solid #ddd;
  cursor:pointer;
  .txt {
    width: 100%;
    text-align: center;
  }
`

const LabelTxt = styled.div`
  // margin-bottom: 10px;
  text-align: center;
  white-space:nowrap;
`

export default function SelectChainIDPanel ({
  id,
  selectChainId,
  chainList = [],
  onChainSelect,
  label,
  type
}: SelectChainIDProps) {
  const { chainId } = useActiveWeb3React()
  const toggleNetworkModal = useToggleNetworkModal()
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)

  const handleCurrencySelect = useCallback(
    (chainID) => {
      if (onChainSelect) {
        onChainSelect(chainID)
        setModalOpen(false)
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
              >
                <Option curChainId={item} selectChainId={chainId} changeNetwork={(val) => (selectChainId && selectChainId === item ? null : handleCurrencySelect(val.chainID))}></Option>
              </OptionCardClickable>
            )
          })
        }
      </ModalContent>
      {
        selectChainId ? (
          <SelectChainBox
            id={id}
            onClick={() => {
              if (type === 'CURRENT') {
                toggleNetworkModal()
              } else {
                setModalOpen(true)
              }
            }}
          >
            {
              label ? (
                <LabelTxt>
                  {label}
                  {config.getCurChainInfo(selectChainId).name}
                </LabelTxt>
              ) : ''
            }
            <SelectChainContent>
              <TokenLogo symbol={config.getCurChainInfo(selectChainId).networkLogo ?? config.getCurChainInfo(selectChainId).symbol} size={'50px'}></TokenLogo>
              {/* <p className="txt">{config.getCurChainInfo(selectChainId).name}</p> */}
            </SelectChainContent>
          </SelectChainBox>
        ) : (
          <SelectChainBox
            id={id}
            onClick={() => {
              if (type === 'CURRENT') {
                toggleNetworkModal()
              } else {
                setModalOpen(true)
              }
            }}
          >
            {
              label ? (
                <LabelTxt>
                  {label}
                  {t('selectNetwork')}
                </LabelTxt>
              ) : ''
            }
            <SelectChainContent>
              <TokenLogo symbol={''} size={'50px'}></TokenLogo>
            </SelectChainContent>
          </SelectChainBox>
        )
      }
    </>
  )
}