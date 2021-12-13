import React, { useCallback, useEffect, useMemo, useState, useContext } from "react"
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from "styled-components"
import { ArrowDown } from 'react-feather'
import { transparentize } from 'polished'

import {useToken} from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import {useSwapMultiContract} from '../../hooks/useContract'

import {useCurrencyBalances} from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

import {thousandBit} from '../../utils/tools/tools'

import { ArrowWrapper, BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import { Input as NumericalInput } from '../../components/NumericalInput'
import TokenLogo from '../../components/TokenLogo'

import AppBody from '../AppBody'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

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
  // padding: 20px;
  margin:50px 0;
`

const SwapInputLabel = styled.div`
  width: 100%;
`

const SwapInputBox = styled.div`
  // background-color: ${({ theme }) => theme.contentBg};
  // background: rgba(255,255,255,.5);
  padding: 20px;
  width: 100%;
  // margin-bottom: 20px;
  border-radius: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0;
  `}
`

const SwapInputContent = styled.div`
  ${({ theme }) => theme.flexBC};
`

const TokenLogoBox = styled.div`
  margin-right: 15px;
  width: 50px;
  margin-top: 15px;
`

const ArrowBox = styled(AutoRow)`
  // background-color: ${({ theme }) => theme.contentBg};
  // background: rgba(255,255,255,.6);
  width: 80%;
  margin: auto;
  height:50px;
`

const anyToken = '0xea88171509a8772cc39f7f36f34a7b7d9985d101'
const multiToken = '0xd8ac5e2990b1cbf062ea2145807f530b76e91f98'
const swapToken = '0xba484d2c9ca181de85228ff6bf75709fcf5664e7'
const supportChain = '4'

export default function SwapMULTI () {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useContext(ThemeContext)
  const addTransaction = useTransactionAdder()

  const isSupport = useMemo(() => {
    if (!chainId || supportChain !== chainId.toString()) {
      return false
    }
    return true
  }, [chainId])

  const contract = useSwapMultiContract(swapToken)
  const anyCurrency = useToken(anyToken)
  const multiCurrency = useToken(multiToken)
  const balance = useCurrencyBalances((isSupport && account) ? account : undefined, [anyCurrency ?? undefined, multiCurrency ?? undefined])
  
  const [inputValue, setInputValue] = useState<any>()
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  

  const formatInputBridgeValue = tryParseAmount(inputValue, anyCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, account ?? undefined)

  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setInputValue('')
    setDelayAction(false)
  }


  const isInputError = useMemo(() => {
    if (inputValue !== '' || inputValue === '0') {
      const bl = balance[0]?.toSignificant(6)
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
      } else if (!bl || Number(bl) < Number(inputValue)) {
        return {
          state: 'Error',
          tip: t('Insufficient', {symbol: anyCurrency?.symbol})
        }
      }
    }
    return undefined
  }, [inputValue, balance, anyCurrency])

  const isSwap = useMemo(() => {
    if (isInputError || !inputValue) {
      return true
    }
    return false
  }, [isInputError, inputValue])

  const outputValue = useMemo(() => {
    if (isInputError || !inputValue) {
      return ''
    } else {
      return Number(inputValue) * 10
    }
  }, [isInputError, inputValue])

  const inputAmount = useMemo(() => anyCurrency ? tryParseAmount(inputValue, anyCurrency) : '', [anyCurrency, inputValue])

  // useEffect(() => {
  //   console.log(balance)
  //   console.log(balance[0]?.raw?.toString())
  //   console.log(balance[0]?.toSignificant(6))
  // }, [balance])

  useEffect(() => {
    // console.log(approval)
    // console.log(ApprovalState)
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(false)
    }
  }, [approval])

  const swapAnyToMulti = useCallback(() => {
    if (contract && inputAmount) {
      contract.swap(`0x${inputAmount.raw.toString(16)}`).then((res:any) => {
        console.log(res)
        addTransaction(res, { summary: `Swap ${anyCurrency?.symbol} To ${multiCurrency?.symbol} ${inputAmount.toSignificant(6)} ${anyCurrency?.symbol}` })
      })
    }
  }, [contract, inputAmount, anyCurrency])

  return (
    <>
      <AppBody>
        <ContentBody>
          <ContentTitle>
            Swap ANY to MULTI
          </ContentTitle>

          <SwapContentBox>
            <SwapInputBox>
              <SwapInputLabel>
                {t('balanceTxt') + ': ' + (balance[0] ? thousandBit(balance[0]?.toSignificant(6), 'no') + ' ' + anyCurrency?.symbol : '-')}
              </SwapInputLabel>
              <SwapInputContent>
                {anyCurrency?.symbol ? (
                  <TokenLogoBox><TokenLogo symbol={anyCurrency?.symbol} size={'100%'}></TokenLogo></TokenLogoBox>
                ) : ''}
                <NumericalInput
                  className={isInputError ? 'error' : ''}
                  value={inputValue ?? ''}
                  onUserInput={val => {
                    setInputValue(val)
                  }}
                  disabled={false}
                />
                {anyCurrency?.symbol}
              </SwapInputContent>
            </SwapInputBox>

            <ArrowBox justify="center" style={{ padding: '0 1rem' }}>
              <ArrowWrapper clickable={false}>
                <ArrowDown size="24" color={theme.text2} />
              </ArrowWrapper>
            </ArrowBox>

            <SwapInputBox>
              <SwapInputLabel>
                {t('balanceTxt') + ': ' + (balance[1] ? thousandBit(balance[1]?.toSignificant(6), 'no') + ' ' + multiCurrency?.symbol : '-')}
              </SwapInputLabel>
              <SwapInputContent>
                {multiCurrency?.symbol ? (
                  <TokenLogoBox><TokenLogo symbol={multiCurrency?.symbol} size={'100%'}></TokenLogo></TokenLogoBox>
                ) : ''}
                <NumericalInput
                  value={outputValue ?? ''}
                  onUserInput={() => {
                    // setInputValue(val)
                  }}
                  disabled={true}
                />
                {multiCurrency?.symbol}
              </SwapInputContent>
            </SwapInputBox>
          </SwapContentBox>
          
          {
            !isSupport ? (
              <>
                <BottomGrouping>
                  <ButtonLight onClick={() => {
                    selectNetwork(supportChain).then((res: any) => {
                      console.log(res)
                      if (res.msg === 'Error') {
                        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(supportChain).networkName}))
                      }
                    })
                  }}>{t('ConnectedWith') + ' ' + config.getCurChainInfo(supportChain).name}</ButtonLight>
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
                          t('Approve') + ' ' + anyCurrency?.symbol ?? anyCurrency?.symbol
                        )}
                      </ButtonConfirmed>
                    ) : (
                      <ButtonPrimary disabled={Boolean(isSwap || delayAction)} onClick={() => {
                        // setModalTipOpen(true)
                        swapAnyToMulti()
                      }}>
                        {t('swap')}
                      </ButtonPrimary>
                    )
                  )
                }
              </BottomGrouping>
            )
          }
        </ContentBody>
      </AppBody>
    </>
  )
}