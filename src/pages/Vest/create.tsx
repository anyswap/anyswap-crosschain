import React, { useEffect, useMemo, useState, useContext } from "react"
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from "styled-components"
import { transparentize } from 'polished'
import { ArrowDown } from 'react-feather'
import moment from 'moment';

import { AutoRow } from '../../components/Row'
import {
  ArrowWrapper,
  BottomGrouping
} from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import Loader from '../../components/Loader'

import {useCurrencyBalances} from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useActiveWeb3React } from '../../hooks'
import {useLocalToken} from '../../hooks/Tokens'
import { tryParseAmount } from '../../state/swap/hooks'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

import AppBody from '../AppBody'

import {MULTI_TOKEN, veMULTI} from './data'

import LockAmount from './lockAmount'
import LockDuration from './lockDuration'
import VestingInfo from './vestingInfo'

import {useCreateLockCallback} from './hooks'

const ContentBody = styled.div`
  background-color: ${({ theme }) => theme.contentBg};
  // background:transparent radial-gradient(closest-side at 50% 50%, #6CA5FF 0%, #524DFB 100%) 0% 0% no-repeat padding-box;
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
  // background: rgba(255,255,255,.5);
  padding: 30px 20px 60px;
  width: 100%;
  max-width: 600px;
  margin: auto;
  border-radius: 20px;
`

const ContentTitle = styled.h3`
  color: ${({ theme }) => theme.textColorBold};
  text-align: center;
`
const SwapContentBox = styled.div`
  width: 100%;
  margin:50px 0;
`

const ArrowBox = styled(AutoRow)`
  width: 80%;
  margin: auto;
  height:50px;
`
export default function CreateLock () {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()

  const useLockToken = useMemo(() => {
    if (chainId && MULTI_TOKEN[chainId]) {
      return MULTI_TOKEN[chainId]
    }
    return undefined
  }, [chainId])

  const useVeMultiToken = useMemo(() => {
    if (chainId && veMULTI[chainId]) {
      return veMULTI[chainId]
    }
    return undefined
  }, [chainId])

  const isSupport = useMemo(() => {
    if (!useLockToken) {
      return false
    }
    return true
  }, [useLockToken])

  const formatCurrency = useLocalToken(useLockToken)

  const [inputValue, setInputValue] = useState<any>()
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [lockDuration, setLockDuration] = useState<any>()
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  
  const balance = useCurrencyBalances((isSupport && account) ? account : undefined, [formatCurrency ?? undefined])
  const formatInputBridgeValue = tryParseAmount(inputValue, formatCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useVeMultiToken)

  const { execute: onWrap, inputError: wrapInputError } = useCreateLockCallback(
    useVeMultiToken,
    formatCurrency ?? undefined,
    inputValue,
    lockDuration
  )

  const isInputError = useMemo(() => {
    if (inputValue !== '' || inputValue === '0') {
      // console.log(balance[0])
      // console.log(formatInputBridgeValue)
      // const bl = balance[0]
      // const sufficientBalance = formatInputBridgeValue && bl && !bl.lessThan(formatInputBridgeValue)
      // console.log(sufficientBalance)
      if (isNaN(inputValue)) {
        return {
          state: 'Error',
          tip: t('inputNotValid')
        }
      } else if (inputValue === '0') {
        return {
          state: 'Error',
          tip: t('noZero')
        }
      } else if (wrapInputError) {
        return {
          state: 'Error',
          tip: t('Insufficient', {symbol: formatCurrency?.symbol})
        }
      }
    }
    return undefined
  }, [inputValue, formatCurrency, wrapInputError])

  const isSwap = useMemo(() => {
    if (isInputError || !inputValue) {
      return true
    }
    return false
  }, [isInputError, inputValue])

  useEffect(() => {
    console.log(approval)
    console.log(ApprovalState)
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(false)
    }
  }, [approval])

  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setInputValue('')
    setDelayAction(false)
  }

  function viewBtn (type:any) {
    if (type) {
      return <BottomGrouping>
      <ButtonLight disabled>Coming Soon</ButtonLight>
    </BottomGrouping>
    }
    return (
      <>
        {
          !isSupport ? (
            <>
              <BottomGrouping>
                {
                  Object.keys(veMULTI).map((item, index) => {
                    return <ButtonLight key={index} style={{margin: '0 5px'}} onClick={() => {
                      selectNetwork(item).then((res: any) => {
                        console.log(res)
                        if (res.msg === 'Error') {
                          alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(item).networkName}))
                        }
                      })
                    }}>{t('ConnectedWith') + ' ' + config.getCurChainInfo(item).name}</ButtonLight>
                  })
                }
                {/* <ButtonLight onClick={() => {
                  selectNetwork(supportChain).then((res: any) => {
                    console.log(res)
                    if (res.msg === 'Error') {
                      alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(supportChain).networkName}))
                    }
                  })
                }}>{t('ConnectedWith') + ' ' + config.getCurChainInfo(supportChain).name}</ButtonLight> */}
              </BottomGrouping>
            </>
          ) : (
            <BottomGrouping>
              {!account ? (
                  <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
                ) : (
                  inputValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)? (
                    <ButtonConfirmed
                      onClick={() => {
                        onDelay()
                        approveCallback().then(() => {
                          onClear()
                        })
                      }}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t('Approving')} <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted ? (
                        t('Approved')
                      ) : (
                        t('Approve') + ' ' + formatCurrency?.symbol ?? formatCurrency?.symbol
                      )}
                    </ButtonConfirmed>
                  ) : (
                    <ButtonPrimary disabled={Boolean(isSwap || delayAction)} onClick={() => {
                      
                      if (onWrap) {
                        onDelay()
                        onWrap().then(() => {
                          onClear()
                        })
                      }
                    }}>
                      Lock
                    </ButtonPrimary>
                  )
                )
              }
            </BottomGrouping>
          )
        }
      </>
    )
  }

  return (
    <AppBody>
      <ContentBody>
        <ContentTitle>
          {t('Create New Lock')}
        </ContentTitle>

        <SwapContentBox>
          <LockAmount
            selectCurrency={formatCurrency}
            balance={balance ? balance[0] : undefined}
            isInputError={isInputError}
            inputValue={inputValue}
            onInputValue={(value) => {
              setInputValue(value)
            }}
            onMax={(value) => {
              setInputValue(value)
            }}
          ></LockAmount>

          <ArrowBox justify="center" style={{ padding: '0 1rem' }}>
            <ArrowWrapper clickable={false}>
              <ArrowDown size="24" color={theme.text2} />
            </ArrowWrapper>
          </ArrowBox>
          <LockDuration
            lockEnds={''}
            updateLockDuration={(date:any) => {
              const expiry = moment(date)
              console.log(expiry)
              setLockDuration(expiry.unix())
            }}
          ></LockDuration>

          <VestingInfo
            // currentNFT={{nft}}
            futureNFT={{
              lockAmount: inputValue,
              lockValue: '',
              lockEnds: lockDuration,
            }}
            // veToken={veToken}
            showVestingStructure={ false }
          ></VestingInfo>
        </SwapContentBox>
        {viewBtn(0)}
      </ContentBody>
    </AppBody>
  )
}