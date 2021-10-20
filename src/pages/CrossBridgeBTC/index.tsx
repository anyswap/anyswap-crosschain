import React, {useEffect, useState, useMemo, useContext} from 'react'
import {createAddress, isAddress} from 'multichain-bridge'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'
import { ArrowDown } from 'react-feather'

import { useActiveWeb3React } from '../../hooks'
import { useUserSelectChainId } from '../../state/user/hooks'

import {getP2PInfo} from '../../utils/bridge/register'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'
import {formatDecimal, setLocalConfig, thousandBit} from '../../utils/tools/tools'

import SelectCurrencyInputPanel from '../../components/CurrencySelect/selectCurrency'
import { AutoColumn } from '../../components/Column'
// import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { AutoRow } from '../../components/Row'
// import Loader from '../../components/Loader'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ArrowWrapper } from '../../components/swap/styleds'
import Title from '../../components/Title'
// import ModalContent from '../../components/Modal/ModalContent'
// import QRcode from '../../components/QRcode'

import SelectChainIdInputPanel from '../CrossChain/selectChainID'
import Reminder from '../CrossChain/reminder'
import AppBody from '../AppBody'

import config from '../../config'
import {selectNetwork} from '../../config/tools/methods'

export default function CrossBridgeBTC () {

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

  const useTolenList:any = useMemo(() => {
    setSelectChainList([])
    return {}
  }, [])

  const bridgeConfig = useMemo(() => {
    if (selectCurrency?.address && useTolenList[selectCurrency?.address]) return useTolenList[selectCurrency?.address]
    return ''
  }, [selectCurrency, useTolenList])

  const destConfig = useMemo(() => {
    // console.log(bridgeConfig)
    // console.log(selectChain)
    if (bridgeConfig && bridgeConfig?.destChains[selectChain]) {
      return bridgeConfig?.destChains[selectChain]
    }
    return false
  }, [bridgeConfig, selectChain])

  const outputBridgeValue = useMemo(() => {
    if (inputBridgeValue && destConfig) {
      const baseFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : 0
      const fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion)
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

  function changeNetwork (chainID:any) {
    selectNetwork(chainID).then((res: any) => {
      console.log(res)
      
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

  useEffect(() => {
    setP2pAddress('')
    if (account && selectCurrency && destConfig && chainId) {
      getP2PInfo(account, chainId, selectCurrency?.symbol, selectCurrency?.address).then((res:any) => {
        // console.log(res)
        // console.log(selectCurrency)
        if (res?.p2pAddress) {
          const localAddress = createAddress(account, selectCurrency?.symbol, destConfig?.DepositAddress)
          if (res?.p2pAddress === localAddress && isAddress(localAddress, selectNetworkInfo?.chainId)) {
            // console.log(localAddress)
            setP2pAddress(localAddress)
            setLocalConfig(account, selectCurrency?.address, chainId, CROSSCHAINBRIDGE, {p2pAddress: localAddress})
          }
        }
      })
    }
  }, [account, selectCurrency, destConfig, chainId])

  return (
    <>
      <AppBody>
        <Title
          title={t('bridge')}
        ></Title>
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
            onMax={() => {}}
            currency={selectCurrency}
            disableCurrencySelect={false}
            disableChainSelect={true}
            showMaxButton={true}
            isViewNetwork={true}
            id="selectCurrency"
            isError={false}
            allTokens={useTolenList}
            hideBalance={true}
            isViewModal={modalOpen}
            customChainId={selectNetworkInfo?.chainId}
            // allBalances={allBalances}
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
            bridgeConfig={bridgeConfig}
            isNativeToken={false}
            selectChainList={selectChainList}
            // isViewAllChain={swapType === BridgeType.deposit}
          />
          {destConfig?.type === 'swapout' && (isNaN(selectChain)) ? (
            <>
              <AddressInputPanel id="recipient" value={recipient} onChange={setRecipient} isValid={false} />
            </>
          ): ''}
          {
            p2pAddress ? <AddressInputPanel id="p2pAddress" value={p2pAddress} disabledInput={true} /> : ''
          }
        </AutoColumn>

        {/* <Reminder bridgeConfig={bridgeConfig} bridgeType='bridgeAssets' currency={selectCurrency} /> */}
        <Reminder bridgeConfig={bridgeConfig} bridgeType={destConfig?.type} currency={selectCurrency} selectChain={selectChain}/>
        {/* {ButtonView('INIT')} */}
      </AppBody>
    </>
  )
}