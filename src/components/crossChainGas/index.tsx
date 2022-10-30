import { Card, Form, Row, Select, Col, InputNumber, Button, Input, message } from 'antd'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getWeb3, abi } from './utils'
import { ethers } from 'ethers'
import chainInfo from './chainConfig'
import Tx from 'ethereumjs-tx'
import 'antd/dist/antd.css'
import './style.less'

const CrossChain = styled.div`
  .card-box {
    ${({ theme }) => {
      console.info('theme==========', theme)
      return { background: theme.arrowBg, color: theme.textColor }
    }};
    width: 420px;
    border-radius: 10px;
    padding: 10px;
    margin: 15vh auto;
    max-width: 98%;
    .ant-card-body {
      ${({ theme }) => {
        console.info('theme==========', theme)
        return { background: theme.arrowBg, color: theme.textColor }
      }};
    }
    .ant-form {
      color: inherit;
      .ant-form-item-label > label,
      .anticon-arrow-down {
        ${({ theme }) => {
          console.info('theme==========', theme)
          return { color: theme.textColor }
        }};
      }
    }
    & > .title {
      text-align: center;
      font-size: 30px;
      line-height: 90px;
    }
    .info {
      background-color: #f6f7f8;
      padding: 15px;
      border-radius: 8px;
      .item {
        display: flex;
        justify-content: space-between;
        line-height: 28px;
      }
    }
  }
  p.ta_r {
    text-align: right;
    padding: 0;
    margin: 0;
    height: 22px;
  }
  p.ta_l {
    text-align: left;
    padding: 0;
    margin: 0;
    height: 22px;
  }
  .space_between {
    height: 22px;
    display: flex;
    justify-content: space-between;
  }
`

const Index = () => {
  const [form] = Form.useForm()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [price, setPrice] = useState({})
  const [values, setValues] = useState({})

  const init = async () => {
    const web3 = getWeb3('https://rpc.testnet.fantom.network/')
    const contract = new web3.eth.Contract(abi)
    contract.options.address = '0x1A07Efb2926b3b1281dDD822239379dE31D0A736'
    const getallchainid = await contract.methods.getAllChainIDs().call()
    contract.options.address = '0xcfD1ee7EA7300F106506e7454fD73E87664B8992'
  }

  const pollingCurrencyInfo = () => {
    const web3 = getWeb3('https://rpc.testnet.fantom.network/')
    web3.setProvider('https://rpc.testnet.fantom.network/')
    const contract = new web3.eth.Contract(abi)
    contract.options.address = '0xcfD1ee7EA7300F106506e7454fD73E87664B8992'
    const batch = new web3.BatchRequest()

    const chains = Object.keys(chainInfo)
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
    // console.info(
    //   "batch.requestManager.sendBatch",
    //   batch.requestManager.sendBatch
    // );
    // batch.requestManager.sendBatch(batch.requests);
  }
  useEffect(() => {
    pollingCurrencyInfo()
    init()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      pollingCurrencyInfo()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])
  const send = async v => {
    const { ReceiveAddress, SendAmount, from, to, ReceiveAmount } = v
    const web3 = getWeb3('https://rpc.testnet.fantom.network/')
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(from) //链id
        }
      ]
    })
    // value: String(ethers.utils.parseEther("3.0")),
    const account = window.ethereum?.selectedAddress
    const transactionData = {
      from: account,
      to: chainInfo[form.getFieldValue('from')]['RouterContract'],
      value: web3.utils.numberToHex(String(SendAmount * Math.pow(10, chainInfo[from].decimal))),
      data: Buffer.from(`${ReceiveAddress}:${to}:${ReceiveAmount / 1.02}`, 'utf8').toString('hex')
    }
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionData]
    })

    const interval = setInterval(() => {
      web3.eth.getTransactionReceipt(txHash).then(v => {
        if (v?.status) {
          clearInterval(interval)
          message.success('合约执行成功')
        }
      })
    }, 2000)

    // fetch(`http://107.155.55.39:11556/swap/register/${from}/${txHash}`, {
    //   method: "post",
    // }).then((r) => {
    //   console.info("res", r);
    // });
  }
  useEffect(() => {
    form.setFieldValue('SendAmount', null)
    form.setFieldValue('ReceiveAmount', null)
  }, [to])

  return (
    <CrossChain className="cross-chain">
      <div className="card-box">
        <div className="title">Move gas across chains easily</div>
        <Card>
          <Form name="form" layout="vertical" form={form} onFinish={send} onValuesChange={setValues}>
            <p className="ta_r">Slippage 2%</p>
            <Row>
              <Col span={10}>
                <Form.Item label="From" name="from" required={false} rules={[{ required: true, message: 'required' }]}>
                  <Select
                    onChange={v => {
                      setFrom(v)
                      if (v === form.getFieldValue('to')) {
                        form.setFieldValue('to', null)
                        return
                      }

                      const sA = form.getFieldValue('SendAmount')
                      if (sA) {
                        debugger
                        setValues({
                          ...values,
                          ReceiveAmount: (sA * price[v]) / price[to]
                        })
                        form.setFieldValue('ReceiveAmount', (sA * price[v]) / price[to])
                      }
                    }}
                    options={Object.entries(chainInfo)
                      .map(item => ({
                        label: item[1].BlockChain,
                        value: item[0]
                      }))
                      .filter(item => item.value !== '1000004280406')}
                  />
                </Form.Item>
              </Col>
              <Col span={4} style={{ textAlign: 'center', marginTop: 35 }}>
                <ArrowRightOutlined />
              </Col>
              <Col span={10}>
                <Form.Item label="To" name="to" required={false} rules={[{ required: true, message: 'required' }]}>
                  <Select
                    onChange={setTo}
                    options={Object.entries(chainInfo)
                      .map(item => ({
                        label: item[1].BlockChain,
                        value: item[0]
                      }))
                      .filter((item: any) => item.value !== from)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Send Amount"
              name="SendAmount"
              style={{ marginBottom: 0 }}
              required={false}
              rules={[{ required: true, message: 'required' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0.00001}
                precision={chainInfo[from]?.decimal}
                stringMode
                max={price[from] ? 10 / price[from] : null}
                onChange={v => {
                  form.setFieldValue('ReceiveAmount', ((v * price[from]) / price[to] || 0).toFixed(8))

                  setValues({
                    ...values,
                    SendAmount: v,
                    ReceiveAmount: ((v * price[from]) / price[to]).toFixed(8)
                  })
                }}
                addonAfter={from ? chainInfo[from].symbol : null}
              />
            </Form.Item>
            <div className="space_between">
              <span>{price[from] && `Price：${price[from]} $`}</span>
              <span>{price[from] && `Total：${(price[from] * values.SendAmount || 0).toFixed(6)} $`}</span>
            </div>
            <Form.Item style={{ marginBottom: 0, padding: 0, textAlign: 'center' }}>
              <ArrowDownOutlined />
            </Form.Item>
            <Form.Item label="Estimated Amount" name="ReceiveAmount" style={{ marginBottom: 0 }}>
              <InputNumber
                disabled
                style={{ width: '100%' }}
                addonAfter={to ? chainInfo[to].symbol : null}
                step={to ? 1 / Math.pow(10, chainInfo[to].decimal) : 0.00000000001}
              />
            </Form.Item>
            <div className="space_between">
              <span>{price[to] && `Price：${price[to]} $`}</span>
              <span>
                {price[from] &&
                  values.ReceiveAmount &&
                  `Total：${(price[to] * values.ReceiveAmount || 0).toFixed(6)} $`}
              </span>
            </div>
            <Form.Item
              label="Receive Address"
              name="ReceiveAddress"
              rules={[{ required: true, message: 'required' }]}
              required={false}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
            {/* <div className="info">
              <div className="item">
                <div className="label">Destination Transaction Fee</div>
                <div className="value">-</div>
              </div>
              <div className="item">
                <div className="label">Refuel Fee</div>
                <div className="value">-</div>
              </div>
              <div className="item">
                <div className="label">Estimated Time</div>
                <div className="value">-</div>
              </div>
              <div className="item">
                <div className="label">Estimated Receiving Amount</div>
                <div className="value">-</div>
              </div>
            </div> */}
            <Button style={{ width: '100%', marginTop: 10 }} type="primary" size="large" htmlType="submit">
              Send
            </Button>
          </Form>
        </Card>
      </div>
    </CrossChain>
  )
}

export default Index
