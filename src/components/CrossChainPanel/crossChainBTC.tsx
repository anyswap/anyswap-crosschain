import React, {useEffect, useState, useMemo, useContext, useCallback} from 'react'
import {createAddress, isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import { useUserSelectChainId } from '../../state/user/hooks'
import { useMergeBridgeTokenList } from '../../state/lists/hooks'

import {getP2PInfo} from '../../utils/bridge/register'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'
import {formatDecimal, setLocalConfig, thousandBit} from '../../utils/tools/tools'

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

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

import {
  ListBox
} from '../../pages/styled'

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
  const [inputBridgeValue, setInputBridgeValue] = useState('')
  const [selectCurrency, setSelectCurrency] = useState<any>()
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

  const allTokensList:any = useMergeBridgeTokenList(useChainId)

  // const useTolenList = useMemo(() => {

  // }, [allTokensList, useChainId])
  useEffect(() => {
    // console.log(allTokensList)
    if (allTokensList) {
      let initToken = selectCurrency?.address && selectCurrency?.chainId === useChainId ? selectCurrency?.address : ''
      for (const token in allTokensList) {
        if (!initToken) initToken = token
      }
      if (initToken) {
        setSelectCurrency(allTokensList[initToken])
      }
    }
  }, [allTokensList, useChainId])

  const destConfig = useMemo(() => {
    // console.log(bridgeConfig)
    // console.log(selectChain)
    if (selectCurrency && selectCurrency?.destChains[selectChain]) {
      return selectCurrency?.destChains[selectChain]
    }
    return false
  }, [selectCurrency, selectChain])

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const baseFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : 0
      const fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      // console.log(destConfig)
      // console.log(baseFee)
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(destConfig.MinimumSwapFee)) {
        value = Number(inputBridgeValue) - Number(destConfig.MinimumSwapFee)
      } else if (fee > destConfig.MaximumSwapFee) {
        value = Number(inputBridgeValue) - Number(destConfig.MaximumSwapFee)
      } else {
        value = Number(inputBridgeValue) - fee - baseFee
      }
      if (value && Number(value) && Number(value) > 0) {
        return thousandBit(formatDecimal(value, Math.min(6, selectCurrency.decimals)), 'no')
      }
      return ''
    } else {
      return ''
    }
  }, [inputBridgeValue, destConfig])

  const isCrossBridge = useMemo(() => {
    const isAddr = isAddress( recipient, selectChain)
    if (
      destConfig
      && selectCurrency
      && inputBridgeValue
      && Boolean(isAddr)
      && selectChain
    ) {
      if (
        Number(inputBridgeValue) < Number(destConfig.MinimumSwap)
        || Number(inputBridgeValue) > Number(destConfig.MaximumSwap)
      ) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }, [recipient, selectChain, destConfig, selectCurrency, inputBridgeValue])

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      } else {
        if (selectCurrency?.chainId) {
          // sessionStorage.setItem(SelectBridgeChainIdLabel, selectCurrency.chainId)
          history.go(0)
          // setSelectChain(selectCurrency.chainId)
        }
      }
    })
  }

  // useEffect(() => {
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

  useEffect(() => {
    // console.log(selectCurrency)
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === selectChain?.toString()) continue
        arr.push(c)
      }
      console.log(arr)
      let useChain:any = selectChain ? selectChain : config.getCurChainInfo(selectChain).bridgeInitChain
      if (arr.length > 0) {
        if (
          !useChain
          || (useChain && !arr.includes(useChain))
        ) {
          for (const c of arr) {
            if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
            useChain = c
            break
          }
        }
      }
      setSelectChain(useChain)
      setSelectChainList(arr)
    }
  }, [selectCurrency])

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
          customChainId={selectNetworkInfo?.chainId}
          // allBalances={allBalances}
          bridgeKey={bridgeKey}
          allTokens={allTokensList}
        />
        <AutoRow justify="center" style={{ padding: '0 1rem' }}>
          <ArrowWrapper clickable={false} style={{cursor:'pointer'}} onClick={() => {
            // toggleNetworkModal()
            changeNetwork(selectChain)
          }}>
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
          onOpenModalView={(value:any) => {
            console.log(value)
            setModalOpen(value)
          }}
          bridgeConfig={selectCurrency}
          isNativeToken={false}
          selectChainList={selectChainList}
          isViewAllChain={true}
        />
        <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} isValid={false} />
      </AutoColumn>

      <Reminder bridgeConfig={selectCurrency} bridgeType={destConfig?.type} currency={selectCurrency} selectChain={selectChain}/>
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