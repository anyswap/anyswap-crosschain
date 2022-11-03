import React, { useEffect, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import AppBody from './AppBody'
import AddressInputPanel from '../AddressInputPanel'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import CrossChainTitle from '../CrossChainTitle'
import { getWeb3, abi } from './utils'
import { isAddress } from '../../utils/isAddress'
import { ButtonPrimary } from '../../components/Button'
import { FlexEC } from '../../pages/styled'
import SelectCurrencyInputPanel from './CurrencySelect/selectCurrency'
import SelectChainIdInputPanel from './CrossChainPanelV2/selectChainID'
import { useActiveWeb3React } from '../../hooks'
import { AutoRow } from '../Row'
import { ArrowWrapper } from '../swap/styleds'
import { ArrowDown, Plus } from 'react-feather'
import chainInfo from './chainConfig'
import BulbIcon from '../../assets/images/icon/bulb.svg'
import { useTransactionAdder } from '../../state/transactions/hooks'
import ErrorTip from './CrossChainPanelV2/errorTip'

const chains = Object.keys(chainInfo)

const SubCurrencySelectBox = styled.div`
  width: 100%;
  object-fit: contain;
  border-radius: 0.5625rem;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding: 1rem 1.25rem;
  margin-top: 0.625rem;

  .tip {
    ${({ theme }) => theme.flexSC};
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.tipColor};
    padding: 2px 20px 18px;
    border-bottom: 1px solid #f1f6fa;
    word-break: break-all;
    img {
      display: inlne-block;
    }
    p {
      ${({ theme }) => theme.flexSC};
      flex-wrap: wrap;
      display: inline-block;
      margin: 0;
      line-height: 1rem;
      .span {
        text-decoration: underline;
        margin: 0 5px;
      }
      a {
        display: inline-block;
        overflow: hidden;
        height: 1rem;
      }
    }
  }
  .list {
    margin: 0;
    padding: 0 0px 0;
    font-size: 12px;
    color: ${({ theme }) => theme.tipColor};
    dt {
      ${({ theme }) => theme.flexSC};
      font-weight: bold;
      line-height: 1.5;
      img {
        margin-right: 8px;
      }
    }
    dd {
      font-weight: 500;
      line-height: 1.83;
      i {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background: ${({ theme }) => theme.tipColor};
        margin-right: 10px;
      }
    }
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 1rem 0.5rem;
    .list {
      dd {
        margin-left: 20px;
      }
    }
  `};
`

const Index = () => {
  const addTransaction = useTransactionAdder()
  const theme = useContext(ThemeContext)
  const [value, setValue] = useState()
  const [recipient, setRecipient] = useState('')
  const [price, setPrice] = useState({})
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const web3 = getWeb3('https://rpc.testnet.fantom.network/')

  const pollingCurrencyInfo = () => {
    web3.setProvider('https://rpc.testnet.fantom.network/')
    const contract = new web3.eth.Contract(abi)
    contract.options.address = '0xcfD1ee7EA7300F106506e7454fD73E87664B8992'
    const batch = new web3.BatchRequest()
    const newPrice = {}
    chains.forEach(async item => {
      batch.add(contract.methods.getCurrencyInfo(web3.utils.toHex(item)))
      await contract.methods
        .getCurrencyInfo(web3.utils.toHex(item))
        .call()
        .then(r => {
          newPrice[item] = r.price / Math.pow(10, 6)
          if (Object.keys(newPrice).length === chains.length) {
            setPrice(newPrice)
          }
        })
    })
  }

  useEffect(() => {
    pollingCurrencyInfo()
    const interval = setInterval(() => {
      pollingCurrencyInfo()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const isError = () => {
    if ([undefined, ''].includes(value)) return false
    const isZero = value <= 0
    const isNan = isNaN(value)
    const greaterTenU = (price['4002'] || 0) * value > 10
    const lessU = (price['4002'] || 0) * value < 0.5
    console.info('lessU', lessU)
    return isZero || isNan || greaterTenU || lessU
  }

  const getAPTNumber = () => {
    const ftmM = (price['4002'] || 0) * value

    console.info('price[4002]', price['4002'])
    console.info('price[1000004280406]', price['1000004280406'])
    if (ftmM && price['1000004280406']) {
      const aptNumber = ftmM / price['1000004280406']
      return aptNumber.toFixed(8)
    }
    return '0.0'
  }
  const onSend = async () => {
    if (!value || isError() || !recipient || !Boolean(isAddress(recipient, 'APT'))) {
      debugger
      return
    }
    const transactionData = {
      from: account,
      to: chainInfo['4002'].RouterContract,
      value: web3.utils.numberToHex(String(value * Math.pow(10, chainInfo['4002'].decimal))),
      data: Buffer.from(`${recipient}:1000004280406:${getAPTNumber() / 1.02}`, 'utf8').toString('hex')
    }
    const txHash = await window?.ethereum?.request({
      method: 'eth_sendTransaction',
      params: [transactionData]
    })
    addTransaction(txHash, { summary: `Stake ${getAPTNumber()} APTOS` })
    // console.info('txHash=====', txHash)
    // const interval = setInterval(() => {
    //   web3.eth.getTransactionReceipt(txHash).then(v => {
    //     if (v?.status) {
    //       clearInterval(interval)
    //       message.success('合约执行成功')
    //     }
    //   })
    // }, 2000)
  }

  const switchNetwork = () => {
    const web3 = getWeb3('https://rpc.testnet.fantom.network/')
    console.info('web3.utils ', web3.utils.hexToNumber(0xfa2))
    window?.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(4002) //链id
        }
      ]
    })
  }

  const recipientError = () => {
    return !Boolean(isAddress(recipient, 'APT')) || !recipient
  }

  return (
    <AppBody>
      <CrossChainTitle />
      <SelectCurrencyInputPanel
        label={t('From')}
        value={value}
        disableCurrencySelect={false}
        showMaxButton={true}
        isViewNetwork={true}
        customChainId={4002}
        onUserInput={setValue}
        isError={isError()}
      />
      <AutoRow justify="center" style={{ padding: '0.8rem' }}>
        <ArrowWrapper
          clickable={false}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            // toggleNetworkModal()
            // changeNetwork(selectChain)
          }}
        >
          <ArrowDown size="16" color={theme.text2} />
        </ArrowWrapper>
        <FlexEC style={{ position: 'absolute', right: 0 }}>
          <Plus size="16" color={theme.text2} />{' '}
          <span style={{ fontSize: '12px', lineHeight: '12px' }}>{t('sendto')}</span>
        </FlexEC>
      </AutoRow>
      <SelectChainIdInputPanel label={t('to')} value={getAPTNumber()} />
      <div style={{ marginTop: '0.28rem' }}></div>
      <AddressInputPanel
        id="recipient"
        value={recipient}
        label={t('Recipient')}
        labelTip={'( ' + t('receiveTip') + ' )'}
        onChange={setRecipient}
        isValid={false}
        isError={!Boolean(isAddress(recipient, 'APT'))}
      />
      <SubCurrencySelectBox>
        <dl className="list">
          <dt>
            <img src={BulbIcon} alt="" />
            {t('Reminder')}:
          </dt>
          <dd>
            <i></i>
            {t('redeemTip6', { max: '10 USD', min: '0.5 USD' })}
          </dd>
          <dd>
            <i></i>
            {t('redeemTip7', { amount: !value ? 0 : value * price['4002'] })} USD
          </dd>
          <dd>
            <i></i>
            {t('redeemTip8', {
              priceContent: `FTM: ${price['4002']} USD,     APT: ${price['1000004280406']} USD`
            })}
          </dd>
          {/* <dd>
            <i></i>
            {t('redeemTip3')} 10 $
          </dd>
          <dd>
            <i></i>FTM {price['4002']} $
          </dd>
          <dd>
            <i></i>APT {price['1000004280406']} $
          </dd>
          <dd>
            <i></i>
            {!value && 0}
            {value && value * price['4002']} $
          </dd> */}
        </dl>
      </SubCurrencySelectBox>
      {isError() ? (
        <ErrorTip
          errorTip={{
            state: 'Error',
            tip: `${t('ExceedMinLimit')} 0.5 USD`
          }}
        />
      ) : (
        recipientError() && (
          <ErrorTip
            errorTip={{
              state: 'Error',
              tip: t('invalidRecipient')
            }}
          />
        )
      )}
      {web3.utils.hexToNumber(chainId) === 4002 ? (
        <ButtonPrimary style={{ margin: '1rem auto' }} onClick={onSend}>
          {t('swap')}
        </ButtonPrimary>
      ) : (
        <ButtonPrimary style={{ margin: '1rem auto' }} onClick={switchNetwork}>
          {t('switchNetwork', {
            correctNetwork: 'FANTOM'
          })}
        </ButtonPrimary>
      )}
    </AppBody>
  )
}

export default Index
