// import React, { useRef, useState } from 'react'
import React, { useContext, useRef } from 'react'
// import { Settings, X } from 'react-feather'
import { Settings} from 'react-feather'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
// import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'
import { TYPE } from '../../theme'
// import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
// import Modal from '../Modal'
// import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
// import { RowBetween } from '../Row'
import Toggle from '../Toggle'
// import TransactionSettings from '../TransactionSettings'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

// const StyledCloseIcon = styled(X)`
//   height: 20px;
//   width: 20px;
//   :hover {
//     cursor: pointer;
//   }

//   > * {
//     stroke: ${({ theme }) => theme.text1};
//   }
// `

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

//   svg {
//     margin-top: 2px;
//   }
// `
// const EmojiWrapper = styled.div`
//   position: absolute;
//   bottom: -6px;
//   right: 0px;
//   font-size: 14px;
// `

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 18.125rem;
    right: -0px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
    top: -22rem;
  `};
`

// const Break = styled.div`
//   width: 100%;
//   height: 1px;
//   background-color: ${({ theme }) => theme.bg3};
// `

// const ModalContentWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 2rem 0;
//   background-color: ${({ theme }) => theme.bg2};
//   border-radius: 20px;
// `

export default function SettingsTab() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()
  const { t } = useTranslation()

  const theme = useContext(ThemeContext)
  // const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  // const [ttl, setTtl] = useUserTransactionTTL()

  // const [expertMode, toggleExpertMode] = useExpertModeManager()

  // const [darkMode, toggleDarkMode] = useDarkModeManager()
  const [userInterfaceMode, toggleSetInterfaceMode] = useInterfaceModeManager()
  const [userInterfaceBalanceValid, toggleSetInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  console.log(userInterfaceBalanceValid)
  // show confirmation view before turning on
  // const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              {t('InterfaceSettings')}
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  {t('SimpleMode')}
                </TYPE.black>
              </RowFixed>
              <Toggle isActive={userInterfaceMode} toggle={toggleSetInterfaceMode} />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  {t('BalanceValidated')}
                </TYPE.black>
              </RowFixed>
              <Toggle isActive={userInterfaceBalanceValid} toggle={toggleSetInterfaceBalanceValid} />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
