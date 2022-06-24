import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from 'react-i18next'
import styled from "styled-components"
import { transparentize } from 'polished'
// import { ArrowDown } from 'react-feather'
import moment from 'moment';
import BigNumber from 'bignumber.js';

// import { AutoRow } from '../../components/Row'
import {
  // ArrowWrapper,
  BottomGrouping
} from '../../components/swap/styleds'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
// import Loader from '../../components/Loader'
import ErrorTip from '../../components/CrossChainPanelV2/errorTip'

import {useCurrencyBalances} from '../../state/wallet/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import {useActiveReact} from '../../hooks/useActiveReact'
import { useVeMULTIContract } from '../../hooks/useContract'
import {useLocalToken} from '../../hooks/Tokens'
import { useUserSelectChainId } from '../../state/user/hooks'
// import { tryParseAmount } from '../../state/swap/hooks'
// import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import {BigAmount} from '../../utils/formatBignumber'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'
import {getParams} from '../../config/tools/getUrlParams'

import AppBody from '../AppBody'

import {MULTI_TOKEN, veMULTI} from './data'

import LockAmount from './lockAmount'
import LockDuration from './lockDuration'
import VestingInfo from './vestingInfo'

import {useInCreaseAmountCallback, useInCreaseUnlockTimeCallback, useLockDurationTip} from './hooks'
import { BackArrow } from "../../theme"

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
  position:relative;
`
const SwapContentBox = styled.div`
  width: 100%;
  margin:50px 0;
`

const BackArrowView = styled.div`
  ${({ theme }) => theme.flexC};
  position: absolute;
  left: 10px;
  top:5px;
`
export default function CreateLock () {
  const { t } = useTranslation()
  const { chainId, evmAccount: account } = useActiveReact()
  // const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const {setUserSelectNetwork} = useUserSelectChainId()
  const idx = getParams('id')
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

  const now = moment().add(7, 'days').format('YYYY-MM-DD')

  const [inputValue, setInputValue] = useState<any>('')
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [lockDuration, setLockDuration] = useState<any>(now)
  const [lockData, setLockData] = useState<any>(now)
  // console.log(lockDuration)
  const balance = useCurrencyBalances((isSupport && account) ? account : undefined, [formatCurrency ?? undefined])

  const { execute: onWrap, inputError: wrapInputError } = useInCreaseAmountCallback(
    useVeMultiToken?.address,
    formatCurrency ?? undefined,
    inputValue,
    lockData?.id
  )
  const { execute: onInCreaseUnlockWrap } = useInCreaseUnlockTimeCallback(
    useVeMultiToken?.address,
    formatCurrency ?? undefined,
    lockDuration ? moment(lockDuration).add(1, 'days').unix() : undefined,
    // lockDuration ? lockDuration : undefined,
    lockData?.id,
    lockData?.lockEnds,
  )

  const selectTimeTip = useLockDurationTip(lockDuration, lockData?.lockEnds)

  const contract = useVeMULTIContract(useVeMultiToken?.address)

  const getNFT = useCallback(async() => {
    // console.log(contract)
    // console.log(idx)
    // console.log(account)
    if (contract && idx && account) {
      const tokenIndex = await contract.tokenOfOwnerByIndex(account, idx)
      const locked = await contract.locked(tokenIndex)
      const lockValue = await contract.balanceOfNFT(tokenIndex)
      const data = {
        id: tokenIndex?.toString(),
        lockEnds: locked.end.toNumber(),
        lockAmount: BigAmount.format(useLockToken.decimals, locked.amount).toExact(),
        lockValue: BigAmount.format(useVeMultiToken.decimals, lockValue).toExact()
      }
      console.log(data)
      // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
      setLockData(data)
    }
  }, [contract, account, idx])
  useEffect(() => {
    getNFT()
  }, [contract, account, idx])

  const isInputError = useMemo(() => {
    if (inputValue !== '' || inputValue === '0') {
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

  const errorTip = useMemo(() => {
    
    if (!account || !chainId) {
      return undefined
    } else if (isInputError) {
      return isInputError
    }
    return undefined
  }, [isInputError, account, chainId])

  const errorTimeTip = useMemo(() => {
    if (selectTimeTip) {
      return {
        state: 'Error',
        tip: selectTimeTip
      }
    }
    return undefined
  }, [selectTimeTip])

  const futureNFT = useMemo(() => {
    if (lockData) {
      const tmpNFT = {
        lockAmount: inputValue ? inputValue : lockData.lockAmount,
        lockValue: lockData.lockValue,
        lockEnds: lockDuration ? moment(lockDuration).unix() : lockData.lockEnds,
      }
  
      const now = moment()
      const expiry = moment.unix(tmpNFT.lockEnds)
      const dayToExpire:any = expiry.diff(now, 'days')
  
      // tmpNFT.lockAmount = inputValue ? new BigNumber(tmpNFT.lockAmount).plus(inputValue).toFixed(18) : tmpNFT.lockAmount
      tmpNFT.lockAmount = inputValue ? inputValue : tmpNFT.lockAmount
      tmpNFT.lockValue = new BigNumber(tmpNFT.lockAmount).times(parseInt(dayToExpire + '')+1).div(1460).toFixed(18)
      // console.log(lockData)
      // console.log(tmpNFT)
      // console.log(lockDuration)
      // console.log(inputValue)
      return tmpNFT
    }
    return undefined
    
    // setFutureNFT(tmpNFT)
  }, [lockData, inputValue, lockDuration])

  function onDelay () {
    setDelayAction(true)
  }
  function onClear () {
    setInputValue('')
    setDelayAction(false)
  }

  function viewBtn (type:any, btnName: string, methodsType: string) {
    if (type) {
      return <BottomGrouping>
      <ButtonLight disabled>Coming Soon</ButtonLight>
    </BottomGrouping>
    }
    let isDisabled = true
    if (methodsType === 'increase_amount') {
      isDisabled = Boolean(isSwap || delayAction)
    } else if (methodsType === 'increase_unlock_time') {
      isDisabled = Boolean(!lockDuration || delayAction || errorTimeTip)
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
                      if (setUserSelectNetwork) {
                        setUserSelectNetwork({
                          chainId: config.getCurChainInfo(item).chainID,
                          label: config.getCurChainInfo(item)?.chainType
                        })
                      }
                      selectNetwork(item).then((res: any) => {
                        console.log(res)
                        if (res.msg === 'Error') {
                          alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(item).networkName}))
                        }
                      })
                    }}>{t('ConnectedWith') + ' ' + config.getCurChainInfo(item).name}</ButtonLight>
                  })
                }
              </BottomGrouping>
            </>
          ) : (
            <BottomGrouping>
              {!account ? (
                  <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
                ) : (
                  <ButtonPrimary disabled={isDisabled} onClick={() => {
                    if (methodsType === 'increase_amount') {
                      if (onWrap) {
                        onDelay()
                        onWrap().then(() => {
                          onClear()
                        })
                      }
                    } else if (methodsType === 'increase_unlock_time') {
                      if (onInCreaseUnlockWrap) {
                        onDelay()
                        onInCreaseUnlockWrap().then(() => {
                          onClear()
                        })
                      }
                    }
                  }}>
                    {btnName}
                  </ButtonPrimary>
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
          <BackArrowView><BackArrow to="/vest"></BackArrow></BackArrowView>
          {t('Manage Existing Lock')}
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
        </SwapContentBox>
        <ErrorTip errorTip={errorTip} />
        {viewBtn(0, t('Increase Lock Amount'), 'increase_amount')}

        <SwapContentBox>
          <LockDuration
            lockEnds={lockDuration}
            minDate={lockData?.lockEnds ? moment.unix(lockData?.lockEnds).add(7, 'days').format('YYYY-MM-DD') : undefined}
            updateLockDuration={(date:any) => {
              console.log(date)
              const expiry = moment(date)
              console.log(expiry.unix())
              setLockDuration(date)
            }}
            type="manger"
          ></LockDuration>

          <VestingInfo
            // currentNFT={currentNFT}
            currentNFT={lockData}
            futureNFT={futureNFT}
            veToken={useVeMultiToken}
            govToken={useLockToken}
            showVestingStructure={ false }
          ></VestingInfo>
        </SwapContentBox>
        <ErrorTip errorTip={errorTimeTip} />
        {viewBtn(0, t('Increase Duration'), 'increase_unlock_time')}
      </ContentBody>
    </AppBody>
  )
}