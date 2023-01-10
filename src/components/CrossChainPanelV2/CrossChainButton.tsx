import React, { useMemo } from "react"
import { useTranslation } from 'react-i18next'

import { 
  ApprovalState
} from '../../hooks/useApproveCallback'


import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../Button'
import { AutoRow } from '../Row'
import Loader from '../Loader'
import { BottomGrouping } from '../swap/styleds'

import config from '../../config'
import {isAddress} from '../../utils/isAddress'
import { ChainId } from '../../config/chainConfig/chainId'

import {useActiveReact} from '../../hooks/useActiveReact'
import { useWalletModalToggle } from '../../state/application/hooks'

import {
  // useXlmBalance,
  useTrustlines
} from '../../nonevm/stellar'
import {
  // useNearBalance,
  useLogin,
  useSendNear
} from '../../nonevm/near'
import {
  useSolCreateAccount,
  useLoginSol
} from '../../nonevm/solana'
import {
  // useAptosBalance,
  useAptAllowance,
  useLoginAptos
} from '../../nonevm/apt'



export default function CrossChainButton ({
  isApprove,
  inputBridgeValue,
  approval,
  selectCurrency,
  useChain,
  selectChain,
  recipient,
  destConfig,
  delayAction,
  isCrossBridge,
  xlmlimit,
  xrplimit,
  nearStorageBalance,
  nearStorageBalanceBounds,
  solTokenAddress,
  aptRegisterList,
  onHandleSwap,
  approvalSubmitted,
  onApprovel,
}: {
  isApprove:any
  inputBridgeValue:any
  approval:any
  selectCurrency:any
  useChain:any
  selectChain:any
  recipient:any,
  destConfig:any,
  delayAction:any,
  isCrossBridge:any,
  xlmlimit:any,
  xrplimit:any,
  nearStorageBalance:any,
  nearStorageBalanceBounds:any,
  solTokenAddress:any,
  aptRegisterList:any,
  onHandleSwap: () => void,
  approvalSubmitted?:any,
  onApprovel?: () => void,
}) {
  const { account } = useActiveReact()
  const { t } = useTranslation()
  const toggleWalletModal = useWalletModalToggle()

  const {setTrustlines} = useTrustlines()
  const {depositStorageNear} = useSendNear()
  const {login: loginNear} = useLogin()
  const {
    // validAccount,
    createAccount
  } = useSolCreateAccount()
  const {loginSol} = useLoginSol()
  const {setAptAllowance} = useAptAllowance()
  const {loginAptos} = useLoginAptos()
  

  const maxInputValue = Math.ceil(inputBridgeValue)
  const xrpurl = useMemo(() => {
    let url = ''
    if (
      selectChain === ChainId.XRP
      && destConfig?.address !== 'XRP'
    ) {
      const result = destConfig?.address?.split('/')
      // console.log(result)
      if (result && result.length === 2) {
        url = `https://xrpl.services/?issuer=${result[1]}&currency=${result[0]}&limit=${maxInputValue}`
      }
    }
    return url
  }, [destConfig, selectChain, maxInputValue])
  
  if (!account) {
    return <ButtonLight onClick={toggleWalletModal}>{t('ConnectWallet')}</ButtonLight>
  } else if (isApprove && inputBridgeValue && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)) {
    return <ButtonConfirmed
      onClick={() => {
        // onDelay()
        // approveCallback().then(() => {
        //   onClear(1)
        // })
        if (onApprovel) onApprovel()
      }}
      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted || delayAction}
      width="48%"
      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
      // confirmed={approval === ApprovalState.APPROVED}
    >
      {approval === ApprovalState.PENDING ? (
        <AutoRow gap="6px" justify="center">
          {t('Approving')} <Loader stroke="white" />
        </AutoRow>
      ) : approvalSubmitted ? (
        t('Approved')
      ) : (
        t('Approve') + ' ' + config.getBaseCoin(selectCurrency?.symbol ?? selectCurrency?.symbol, useChain)
      )}
    </ButtonConfirmed>
  } else if (
    xlmlimit === 'INIT'
    || (
      [ChainId.XLM, ChainId.XLM_TEST].includes(selectChain)
      && !isNaN(xlmlimit)
      && !isNaN(inputBridgeValue)
      && Number(xlmlimit) < Number(inputBridgeValue)
    )
  ) {
    if (window?.freighterApi?.isConnected()) {
      return <ButtonPrimary onClick={() => {
        setTrustlines(selectChain, recipient, inputBridgeValue, destConfig)
      }}>
        Trustlines
      </ButtonPrimary>
    } else {
      return <></>
    }
  } else if (
    selectChain === ChainId.XRP
    && xrplimit === 'NOPASS'
  ) {
    return <ButtonPrimary onClick={() => {
      window.open(xrpurl)
    }}>
      TRUST SET
    </ButtonPrimary>
  } else if (
    !nearStorageBalance
    && [ChainId.NEAR, ChainId.NEAR_TEST].includes(selectChain)
    && ['TOKEN'].includes(destConfig?.tokenType)
  ) {
    if (window?.near?.account()) {
      return <ButtonPrimary disabled={!isAddress(recipient, selectChain)} onClick={() => {
        depositStorageNear(destConfig?.address, recipient, nearStorageBalanceBounds).then(() => {
          alert('Deposit storage success.')
        }).catch(() => {
          alert('Deposit storage failure.')
        })
      }}>
        Deposit Storage
      </ButtonPrimary>
    } else {
      return (
        <BottomGrouping>
          <ButtonPrimary style={{marginRight: '5px'}} onClick={() => {
            loginNear()
          }}>
            {t('ConnectWallet')}
          </ButtonPrimary>
          <ButtonPrimary onClick={() => {
            window.open('https://chrome.google.com/webstore/detail/sender-wallet/epapihdplajcdnnkdeiahlgigofloibg')
          }}>
            Install Sender Wallet
          </ButtonPrimary>
        </BottomGrouping>
      )
    }
  } else if (
    !solTokenAddress
    && [ChainId.SOL, ChainId.SOL_TEST].includes(selectChain)
  ) {
    if (window?.solana) {
      return <ButtonPrimary disabled={!isAddress(recipient, selectChain)} onClick={() => {
        createAccount({token: destConfig?.address, account: recipient, chainId: selectChain}).then(() => {
          alert('Create success.')
        }).catch(() => {
          alert('Create failure.')
        })
      }}>
        Create
      </ButtonPrimary>
    } else {
      return (
        <BottomGrouping>
          <ButtonPrimary style={{marginRight: '5px'}} onClick={() => {
            loginSol()
          }}>
            {t('ConnectWallet')}
          </ButtonPrimary>
        </BottomGrouping>
      )
    }
  } else if (
    [ChainId.APT, ChainId.APT_TEST].includes(selectChain)
    && (!aptRegisterList?.[destConfig?.address] || !aptRegisterList?.[destConfig?.anytoken?.address])
  ) {
    if (window?.aptos) {
      return <>
        {
          aptRegisterList.error ? (
            <ButtonPrimary disabled style={{margin: '0 5px'}}>
              Deposit APT
            </ButtonPrimary>
          ) : ''
        }
        {
          !aptRegisterList?.[destConfig?.address] && !aptRegisterList.error ? (
            <ButtonPrimary disabled={!isAddress(recipient, selectChain)} style={{margin: '0 5px'}} onClick={() => {
              setAptAllowance(destConfig?.address, selectChain, recipient, destConfig?.anytoken?.address).then(() => {
                alert('Register success.')
              }).catch((error:any) => {
                alert(error.toString())
              })
            }}>
              Register {destConfig?.symbol}
            </ButtonPrimary>
          ) : ''
        }
        {
          !aptRegisterList?.[destConfig?.anytoken?.address] && !aptRegisterList.error && destConfig?.address !== destConfig?.anytoken?.address ? (
            <ButtonPrimary disabled={!isAddress(recipient, selectChain)} style={{margin: '0 5px'}} onClick={() => {
              setAptAllowance(destConfig?.anytoken?.address, selectChain, recipient, destConfig?.anytoken?.address).then(() => {
                alert('Register success.')
              }).catch((error:any) => {
                alert(error.toString())
              })
            }}>
              Register {destConfig?.anytoken?.symbol}
            </ButtonPrimary>
          ) : ''
        }
      </>
    } else {
      return (
        <BottomGrouping>
          <ButtonPrimary style={{marginRight: '5px'}} onClick={() => {
            loginAptos(selectChain)
          }}>
            {t('ConnectWallet')}
          </ButtonPrimary>
        </BottomGrouping>
      )
    }
  } else {
    return <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
      onHandleSwap()
    }}>
      {t('Confirm')}
    </ButtonPrimary>
  }
}