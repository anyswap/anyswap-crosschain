import React, { useCallback, useEffect, useMemo, useState, useContext } from "react"
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from "styled-components"
import { ArrowDown } from 'react-feather'
import { transparentize } from 'polished'

import {useLocalToken} from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import {useSwapMultiContract} from '../../hooks/useContract'

import {useCurrencyBalances} from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { tryParseAmount } from '../../state/swap/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

import {thousandBit} from '../../utils/tools/tools'

// import { SWAP_MULTI_INTERFACE } from '../../constants/abis/swapMULTIABI'

import { ArrowWrapper, BottomGrouping } from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import { Input as NumericalInput } from '../../components/NumericalInput'
import TokenLogo from '../../components/TokenLogo'

import { TYPE } from '../../theme'

import {
  // InputRow,
  CurrencySelect,
  // ErrorSpanBox,
  // ErrorSpan,
  // ExtraText,
  // LabelRow,
  Aligner,
  TokenLogoBox,
  // StyledDropDownBox,
  // StyledDropDown,
  // InputPanel,
  // Container,
  StyledTokenName,
  // CurrencySelectBox,
  // HideSmallBox
} from '../../components/CurrencySelect/styleds'

import AppBody from '../AppBody'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

// import {
//   useLogin
// } from '../../hooks/near'


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

// const LoaderBox = styled.div`
//   ${({ theme }) => theme.flexC};
//   color: ${({ theme }) => theme.textColorBold};
//   font-size:14px;
//   .txt {
//     margin-left: 10px;
//   }
// `

const SwapInputContent = styled.div`
  ${({ theme }) => theme.flexBC};
`

const CurrencySelect1 = styled(CurrencySelect)`
  width: 180px;
  min-width: 180px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 125px;
    min-width: 125px;
  `}
`

const TokenLogoBox1 = styled(TokenLogoBox)`
  background:none;
  img {
    background: none;
  }
`

const ArrowBox = styled(AutoRow)`
  // background-color: ${({ theme }) => theme.contentBg};
  // background: rgba(255,255,255,.6);
  width: 80%;
  margin: auto;
  height:50px;
`

// const swapToken = '0x4ecf513a7d0E1548e14b621e21d2584bc7570918'
// const supportChain = '4'

const swapList:any = {
  '1': {
    swapToken: '0xaed0472b498548B1354925d222B832b99Bb2EC60',
    anyToken: {
      address: "0xf99d58e463A2E07e5692127302C20A191861b4D6",
      symbol: 'ANY',
      name: 'Anyswap',
      decimals: 18
    },
    multiToken: {
      address: "0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4",
      symbol: "MULTI",
      name: "Multichain",
      decimals: 18
    }
  },
  '56': {
    swapToken: '0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4',
    anyToken: {
      address: "0xf68c9df95a18b2a5a5fa1124d79eeeffbad0b6fa",
      symbol: 'ANY',
      name: 'Anyswap',
      decimals: 18
    },
    multiToken: {
      address: "0x9fb9a33956351cf4fa040f65a13b835a3c8764e3",
      symbol: "MULTI",
      name: "Multichain",
      decimals: 18
    }
  },
  '250': {
    swapToken: '0x65Ef703f5594D2573eb71Aaf55BC0CB548492df4',
    anyToken: {
      address: "0xddcb3ffd12750b45d32e084887fdf1aabab34239",
      symbol: 'ANY',
      name: 'Anyswap',
      decimals: 18
    },
    multiToken: {
      address: "0x9fb9a33956351cf4fa040f65a13b835a3c8764e3",
      symbol: "MULTI",
      name: "Multichain",
      decimals: 18
    }
  }
}

export default function SwapMULTI () {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useContext(ThemeContext)
  const addTransaction = useTransactionAdder()
  // const multicallContract = useMulticallContract()
  // const {login}  = useLogin()
  
  const useSwapInfo = useMemo(() => {
    if (chainId && swapList[chainId]) {
      return swapList[chainId]
    }
    return undefined
  }, [chainId])

  const isSupport = useMemo(() => {
    // console.log(chainId)
    // console.log(supportChain !== chainId?.toString())
    if (!useSwapInfo) {
      return false
    }
    return true
  }, [useSwapInfo])

  
  const [inputValue, setInputValue] = useState<any>()
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  
  const contract = useSwapMultiContract(useSwapInfo?.swapToken)
  const anyCurrency = useLocalToken(useSwapInfo?.anyToken)
  // console.log(anyCurrency)
  const multiCurrency = useLocalToken(useSwapInfo?.multiToken)
  const rate = 1
  // console.log(multiCurrency)
  const balance = useCurrencyBalances((isSupport && account) ? account : undefined, [anyCurrency ?? undefined, multiCurrency ?? undefined])

  const formatInputBridgeValue = tryParseAmount(inputValue, anyCurrency ?? undefined)
  const [approval, approveCallback] = useApproveCallback(formatInputBridgeValue ?? undefined, useSwapInfo?.swapToken ?? undefined, anyCurrency)

  const isInputError = useMemo(() => {
    if (inputValue !== '' || inputValue === '0') {
      // console.log(balance[0])
      // console.log(formatInputBridgeValue)
      const bl = balance[0]
      const sufficientBalance = formatInputBridgeValue && bl && !bl.lessThan(formatInputBridgeValue)
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
      } else if (!sufficientBalance) {
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
    if (isInputError || !inputValue || !rate) {
      return ''
    } else {
      return Number(inputValue) * Number(rate)
    }
  }, [isInputError, inputValue, rate])

  const btnTxt = useMemo(() => {
    if (isInputError) {
      return isInputError?.tip
    }
    return t('swap')
  }, [isInputError])

  const inputAmount = useMemo(() => anyCurrency ? tryParseAmount(inputValue, anyCurrency) : '', [anyCurrency, inputValue])

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

  const swapAnyToMulti = useCallback(() => {
    if (contract && inputAmount) {
      onDelay()
      console.log(inputAmount.raw.toString())
      contract.swap(`0x${inputAmount.raw.toString(16)}`).then((res:any) => {
        console.log(res)
        onClear()
        addTransaction(res, { summary: `Swap ${anyCurrency?.symbol} To ${multiCurrency?.symbol} ${inputAmount.toSignificant(6)} ${anyCurrency?.symbol}` })
      }).catch((err:any) => {
        console.log(err)
        onClear()
      })
    }
  }, [contract, inputAmount, anyCurrency])

  const onMax = useCallback(() => {
    const bl = balance[0]
    // console.log(bl?.toExact())
    if (bl) {
      setInputValue(bl?.toExact())
    }
  }, [balance])

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
                  Object.keys(swapList).map((item, index) => {
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
                        t('Approve') + ' ' + anyCurrency?.symbol ?? anyCurrency?.symbol
                      )}
                    </ButtonConfirmed>
                  ) : (
                    <ButtonPrimary disabled={Boolean(isSwap || delayAction)} onClick={() => {
                      // setModalTipOpen(true)
                      swapAnyToMulti()
                    }}>
                      {btnTxt}
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
    <>
      <AppBody>
        {/* <ButtonLight onClick={() => {
          login()
        }}>test</ButtonLight> */}
        <ContentBody>
          <ContentTitle>
            Swap ANY to MULTI
          </ContentTitle>

          <SwapContentBox>
            <SwapInputBox>
              <SwapInputLabel>
                <TYPE.body
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                  onClick={onMax}
                >{t('balanceTxt') + ': ' + (balance[0] ? thousandBit(balance[0]?.toSignificant(6), 'no') : '-')}</TYPE.body>
                {/* {t('balanceTxt') + ': ' + (balance[0] ? thousandBit(balance[0]?.toSignificant(6), 'no') : '-')} */}
              </SwapInputLabel>
              <SwapInputContent>
                <NumericalInput
                  className={isInputError ? 'error' : ''}
                  value={inputValue ?? ''}
                  onUserInput={val => {
                    setInputValue(val)
                  }}
                  disabled={false}
                />
                <CurrencySelect1 selected={true} className="open-currency-select-button">
                  <Aligner>
                    <TokenLogoBox1>
                      <TokenLogo symbol={anyCurrency?.symbol ?? 'ANY'} size={'100%'} />
                    </TokenLogoBox1>
                    <StyledTokenName className="token-symbol-container">
                      {
                        anyCurrency?.symbol ? (
                          <>
                            <h3>{anyCurrency?.symbol}</h3>
                            <p>{anyCurrency?.name}</p>
                          </>
                        ) : (
                          <>
                            {/* <LoaderBox>
                              <Loader stroke="#ddd" />
                              <span className="txt">Loading</span>
                            </LoaderBox> */}
                            <h3>ANY</h3>
                            <p>Anyswap</p>
                          </>
                        )
                      }
                    </StyledTokenName>
                  </Aligner>
                </CurrencySelect1>
              </SwapInputContent>
            </SwapInputBox>

            <ArrowBox justify="center" style={{ padding: '0 1rem' }}>
              <ArrowWrapper clickable={false}>
                <ArrowDown size="24" color={theme.text2} />
              </ArrowWrapper>
            </ArrowBox>

            <SwapInputBox>
              <SwapInputLabel>
                <TYPE.body
                  color={theme.text2}
                  fontWeight={500}
                  fontSize={14}
                  style={{ display: 'inline', cursor: 'pointer' }}
                >{t('balanceTxt') + ': ' + (balance[1] ? thousandBit(balance[1]?.toSignificant(6), 'no') : '-')}</TYPE.body>
                {/* {t('balanceTxt') + ': ' + (balance[1] ? thousandBit(balance[1]?.toSignificant(6), 'no') : '-')} */}
              </SwapInputLabel>
              <SwapInputContent>
                <NumericalInput
                  value={outputValue ?? ''}
                  onUserInput={() => {
                    // setInputValue(val)
                  }}
                  disabled={true}
                />
                <CurrencySelect1 selected={true} className="open-currency-select-button">
                  <Aligner>
                    <TokenLogoBox1>
                      <TokenLogo symbol={multiCurrency?.symbol ?? 'MULTI'} size={'100%'} />
                    </TokenLogoBox1>
                    <StyledTokenName className="token-symbol-container">
                      {
                        multiCurrency?.symbol ? (
                          <>
                            <h3>{multiCurrency?.symbol}</h3>
                            <p>{multiCurrency?.name}</p>
                          </>
                        ) : (
                          <>
                            {/* <LoaderBox>
                              <Loader stroke="#ddd" />
                              <span className="txt">Loading</span>
                            </LoaderBox> */}
                            <h3>MULTI</h3>
                            <p>Multichain</p>
                          </>
                        )
                      }
                    </StyledTokenName>
                  </Aligner>
                </CurrencySelect1>
              </SwapInputContent>
            </SwapInputBox>
          </SwapContentBox>

          
          {viewBtn(0)}
          
        </ContentBody>
      </AppBody>
    </>
  )
}