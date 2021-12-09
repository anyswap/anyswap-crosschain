import React, {useEffect, useState, useMemo, useContext, useCallback} from 'react'
import {createAddress, isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import { useUserSelectChainId } from '../../state/user/hooks'
// import { useMergeBridgeTokenList } from '../../state/lists/hooks'
import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'

import {getP2PInfo} from '../../utils/bridge/register'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'
// import {formatDecimal, setLocalConfig, thousandBit} from '../../utils/tools/tools'
import {setLocalConfig} from '../../utils/tools/tools'

import SelectCurrencyInputPanel from '../CurrencySelect/selectCurrency'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
// import Loader from '../Loader'
import AddressInputPanel from '../AddressInputPanel'
import { ButtonPrimary, ButtonLight } from '../Button'
import { ArrowWrapper, BottomGrouping } from '../swap/styleds'
import ModalContent from '../Modal/ModalContent'
import QRcode from '../QRcode'

import SelectChainIdInputPanel from './selectChainID'
import Reminder from './reminder'

// import config from '../../config'
import {getParams} from '../../config/tools/getUrlParams'
// import {selectNetwork} from '../../config/tools/methods'

import {
  ListBox
} from '../../pages/styled'

import {
  outputValue,
  useInitSelectCurrency,
  useDestChainid,
  useDestCurrency
} from './hooks'

export default function CrossChain({
  bridgeKey
}: {
  bridgeKey: any
}) {

  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [selectNetworkInfo] = useUserSelectChainId()
  const theme = useContext(ThemeContext)

  const [p2pAddress, setP2pAddress] = useState<any>('')
  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()
  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<any>()
  const [selectChain, setSelectChain] = useState<any>()
  const [recipient, setRecipient] = useState<any>(account ?? '')
  const [selectChainList, setSelectChainList] = useState<Array<any>>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [delayAction, setDelayAction] = useState<boolean>(false)
  const [modalSpecOpen, setModalSpecOpen] = useState(false)

  const useChainId = useMemo(() => {
    if (selectNetworkInfo?.chainId) {
      return selectNetworkInfo?.chainId
    }
    return chainId
  }, [selectNetworkInfo, chainId])

  let initBridgeToken:any = getParams('bridgetoken') ? getParams('bridgetoken') : ''
  initBridgeToken = initBridgeToken ? initBridgeToken.toLowerCase() : ''

  // const allTokensList:any = useMergeBridgeTokenList(useChainId)
  const allTokensList:any = useAllMergeBridgeTokenList(bridgeKey, useChainId)
  const {initCurrency} = useInitSelectCurrency(allTokensList, useChainId, initBridgeToken)

  useEffect(() => {
    // console.log(initCurrency)
    setSelectCurrency(initCurrency)
  }, [initCurrency])

  const destConfig = useMemo(() => {
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return false
  }, [selectDestCurrency])

  const outputBridgeValue = outputValue(inputBridgeValue, destConfig, selectCurrency)

  const isInputError = useMemo(() => {
    if (!selectCurrency) {
      return {
        state: 'Error',
        tip: t('selectToken')
      }
    } else if (!selectChain) {
      return {
        state: 'Error',
        tip: t('selectChainId')
      }
    } else if (inputBridgeValue !== '' || inputBridgeValue === '0') {
      if (isNaN(inputBridgeValue)) {
        return {
          state: 'Error',
          tip: t('inputNotValid')
        }
      } else if (inputBridgeValue === '0') {
        return {
          state: 'Error',
          tip: t('noZero')
        }
      } else if (Number(inputBridgeValue) < Number(destConfig.MinimumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedLimit')
        }
      } else if (Number(inputBridgeValue) > Number(destConfig.MaximumSwap)) {
        return {
          state: 'Error',
          tip: t('ExceedLimit')
        }
      }
    }
    return undefined
  }, [selectCurrency, selectChain, inputBridgeValue, destConfig])

  const errorTip = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (isInputError) {
      return isInputError
    } else if (!inputBridgeValue) {
      return {
        state: 'Error',
        tip: t('swap')
      }
    } else if (!Boolean(isAddr)) {
      return {
        state: 'Error',
        tip: t('invalidRecipient')
      }
    }
    return undefined
  }, [isInputError, selectChain, recipient, inputBridgeValue])

  const isCrossBridge = useMemo(() => {
    if (errorTip) {
      return true
    }
    return false
  }, [errorTip])

  const onCreateP2pAddress = useCallback(() => {
    setP2pAddress('')
    if (recipient && selectCurrency && destConfig && selectChain) {
      getP2PInfo(recipient, selectChain, selectCurrency?.symbol, selectCurrency?.address).then((res:any) => {
        // console.log(res)
        // console.log(selectCurrency)
        if (res?.p2pAddress) {
          const localAddress = createAddress(recipient, selectCurrency?.symbol, destConfig?.DepositAddress)
          if (res?.p2pAddress === localAddress && isAddress(localAddress, selectNetworkInfo?.chainId)) {
            // console.log(localAddress)
            setP2pAddress(localAddress)
            setLocalConfig(recipient, selectCurrency?.address, selectChain, CROSSCHAINBRIDGE, {p2pAddress: localAddress})
          }
        }
        setModalSpecOpen(true)
        setDelayAction(false)
      })
    } else {
      setDelayAction(false)
    }
  }, [recipient, selectCurrency, destConfig, selectChain])

  const {initChainId, initChainList} = useDestChainid(selectCurrency, selectChain, useChainId)

  useEffect(() => {
    // console.log(selectCurrency)
    setSelectChain(initChainId)
  }, [initChainId])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])
  const {initDestCurrency, initDestCurrencyList} = useDestCurrency(selectCurrency, selectChain)

  useEffect(() => {
    setSelectDestCurrency(initDestCurrency)
  }, [initDestCurrency])

  useEffect(() => {
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  return (
    <>
      <ModalContent
        isOpen={modalSpecOpen}
        title={'Cross-chain Router'}
        onDismiss={() => {
          setModalSpecOpen(false)
        }}
      >
        <ListBox>
          <div className="item">
            <p className="label">Value:</p>
            <p className="value">{inputBridgeValue}</p>
          </div>
          <div className="item">
            <p className="label">Address:</p>
            <p className="value">{p2pAddress}</p>
          </div>
          <div className="item">
            <QRcode uri={p2pAddress} size={160}></QRcode>
          </div>
        </ListBox>
        <BottomGrouping>
          <ButtonLight onClick={() => {
            setModalSpecOpen(false)
          }}>{t('Confirm')}</ButtonLight>
        </BottomGrouping>
      </ModalContent>
      <AutoColumn gap={'sm'}>

        <SelectCurrencyInputPanel
          label={t('From')}
          value={inputBridgeValue}
          onUserInput={(value) => {
            // console.log(value)
            setInputBridgeValue(value)
          }}
          onCurrencySelect={(inputCurrency) => {
            console.log(inputCurrency)
            setSelectCurrency(inputCurrency)
          }}
          onOpenModalView={(value) => {
            // console.log(value)
            setModalOpen(value)
          }}
          // onMax={() => {}}
          currency={selectCurrency}
          disableCurrencySelect={false}
          disableChainSelect={true}
          showMaxButton={true}
          isViewNetwork={true}
          id="selectCurrency"
          isError={false}
          hideBalance={true}
          isViewModal={modalOpen}
          customChainId={useChainId}
          // allBalances={allBalances}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
        />
        <AutoRow justify="center" style={{ padding: '0 1rem' }}>
          <ArrowWrapper clickable={false} style={{cursor:'pointer'}}>
            <ArrowDown size="16" color={theme.text2} />
          </ArrowWrapper>
        </AutoRow>

        <SelectChainIdInputPanel
          label={t('to')}
          value={outputBridgeValue.toString()}
          onUserInput={(value:any) => {
            setInputBridgeValue(value)
          }}
          onChainSelect={(chainID:any) => {
            setSelectChain(chainID)
          }}
          selectChainId={selectChain}
          id="selectChainID"
          onCurrencySelect={(inputCurrency) => {
            setSelectDestCurrency(inputCurrency)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={false}
          selectChainList={selectChainList}
          isViewAllChain={true}
          selectDestCurrency={selectDestCurrency}
          selectDestCurrencyList={selectDestCurrencyList}
          bridgeKey={bridgeKey}
        />
        <AddressInputPanel id="recipient" value={recipient} label={t('Recipient') + '( ' + t('receiveTip') + ' )'} onChange={setRecipient} isValid={false} selectChainId={selectChain} />
      </AutoColumn>

      <Reminder destConfig={destConfig} bridgeType={destConfig?.type} currency={selectCurrency} selectChain={selectChain}/>
      {/* {ButtonView('INIT')} */}
      <BottomGrouping>
        <ButtonPrimary disabled={isCrossBridge || delayAction} onClick={() => {
          setDelayAction(true)
          onCreateP2pAddress()
        }}>
          {t('swap')}
        </ButtonPrimary>
      </BottomGrouping>
    </>
  )
}