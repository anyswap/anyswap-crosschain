import React, { Suspense, useState } from 'react'
import { Card, Form, Row, Select, Col, InputNumber, Button, Input, message } from 'antd'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import AppBody from './AppBody'
import { useTranslation } from 'react-i18next'
import CrossChainTitle from '../CrossChainTitle'
import { ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { FormRowBox, StyledInput, ArrowDown } from './dom'
import chainInfo from './chainConfig'

const chains = Object.keys(chainInfo)

const Index = () => {
  const [values, setValues] = useState({ from: 4002 })
  const { t } = useTranslation()
  return (
    <AppBody>
      <CrossChainTitle />
      {/* <Suspense fallback={null}></Suspense> */}
      <FormRowBox>
        <div className="head">
          <span>发送</span>
        </div>
        <div className="row" id="crossChainGasFrom">
          <div style={{ flex: 4 }}>
            <StyledInput
              type="number"
              // readonly
              onChange={event => {
                // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                console.info(event.target.value.replace(/,/g, ''))
                setValues({ ...values, SendAmount: event.target.value.replace(/,/g, '') })
              }}
            />
          </div>

          <Select
            placeholder="please select"
            style={{ flex: 1, marginLeft: 25 }}
            onChange={e => console.info(e)}
            // getPopupContainer={() => document.getElementById('crossChainGasFrom')}
            options={Object.entries(chainInfo)
              .map(item => ({
                label: (
                  <div style={{ lineHeight: '38px' }}>
                    <img src={item[1].icon} width="25" />
                    <span style={{ marginLeft: 15 }}>{item[1].BlockChain}</span>
                  </div>
                ),
                value: item[0]
              }))
              .filter(item => item.value !== '1000004280406')}
          />
        </div>
      </FormRowBox>
      <ArrowDown>
        <ArrowDownOutlined />
      </ArrowDown>
      <FormRowBox>
        <div className="head">
          <span>至</span>
        </div>
        <div className="row" id="crossChainGasFrom">
          <div style={{ flex: 4 }}>
            <StyledInput
              type="number"
              // readonly
              onChange={event => {
                // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                console.info(event.target.value.replace(/,/g, ''))
                setValues({ ...values, SendAmount: event.target.value.replace(/,/g, '') })
              }}
            />
          </div>

          <Select
            placeholder="please select"
            style={{ flex: 1, marginLeft: 25 }}
            onChange={e => console.info(e)}
            // getPopupContainer={() => document.getElementById('crossChainGasFrom')}
            options={Object.entries(chainInfo).map(item => ({
              label: (
                <div style={{ lineHeight: '38px' }}>
                  <img src={item[1].icon} width="25" />
                  <span style={{ marginLeft: 15 }}>{item[1].BlockChain}</span>
                </div>
              ),
              value: item[0]
            }))}
          />
        </div>
      </FormRowBox>
      <div style={{ height: 10 }}></div>
      <FormRowBox>
        <div className="head">
          <span>接收</span>
        </div>
        <div className="row" id="crossChainGasFrom">
          <StyledInput
            type="number"
            // readonly
            onChange={event => {
              // replace commas with periods, because uniswap exclusively uses period as the decimal separator
              console.info(event.target.value.replace(/,/g, ''))
              setValues({ ...values, SendAmount: event.target.value.replace(/,/g, '') })
            }}
          />
        </div>
      </FormRowBox>
      <div style={{ textAlign: 'center' }}>
        <ButtonLight style={{ margin: '20px auto' }}>{t('ConnectWallet')}</ButtonLight>
      </div>
    </AppBody>
  )
}

export default Index
