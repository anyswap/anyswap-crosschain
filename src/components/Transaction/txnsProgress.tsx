import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  // ChevronsRight,
  CheckCircle,
  Info
} from 'react-feather'

// import {Status} from '../../config/status'


import { useAllTransactions } from '../../state/transactions/hooks'

import Loader from "../Loader";

const ProgressBox = styled.div`
  // width:100%;
  width: 380px;
  margin-bottom: 10px;
  // border-radius: 10px;
  // border: solid 0.5px ${({ theme }) => theme.tipBorder};
  // background-color: ${({ theme }) => theme.tipBg};
  // border: 1px solid ${({theme}) => theme.bg3};
  padding:10px 0;
  .list-box {
    position:relative;
    font-size: 12px;
    width: 100%;
    .lineBox {
      width:75%;
      height:20px;
      position: absolute;
      top:0;
      left:12.5%;
      right:12.5%;
      z-index:0;
      // padding-left: 12px;
      .lineWrapper {
        width:100%;
        position: relative;
        background: ${({ theme }) => theme.text1};
        margin-top:10px;
        // margin-left: 10px;
        height: 1px;
        .line {
          width: 30%;
          background: #10f732;
          height: 1px;
        }
      }
    }
    .list {
      width: 100%;
      ${({ theme }) => theme.flexBC};
      .item {
        z-index:1;
        width: 25%;
        ${({ theme }) => theme.text1};
        .step {
          ${({ theme }) => theme.flexC};
          .num {
            display:block;
            width:20px;
            height:20px;
            line-height:18px;
            border-radius: 100%;
            border: 1px solid ${({ theme }) => theme.text1};
            font-size:12px;
            text-align:center;
            background:${({ theme }) => theme.contentBg};
          }
        }
        .label {
          ${({ theme }) => theme.flexC};
        }
        &.yellow {
          color: ${({ theme }) => theme.birdgeStateBorder};
          .step {
            .num {
              border: 1px solid ${({ theme }) => theme.birdgeStateBorder};
            }
          }
        }
        &.green{
          color: #10f732;
          // .lineBox {
          //   .line {
          //     background: #10f732;
          //   }
          // }
          .step {
            // color: #10f732;
            .num {
              border: 1px solid #10f732;
            }
          }
        }
        &.red{
          color: ${({ theme }) => theme.birdgeStateBorder2};
          .step {
            .num {
              border: 1px solid ${({ theme }) => theme.birdgeStateBorder2};
            }
          }
        }
      }
    }
  }

  .arrow {color: ${({ theme }) => theme.tipBorder};}
`

const Loading = styled(Loader)`
  color: #5f6bfb;
`

const FailureBox = styled.div`
  ${({ theme }) => theme.flexC};
  width:100%;
  margin-bottom: 10px;
  border-radius: 10px;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding:10px;
  // color: ${({ theme }) => theme.birdgeStateBorder2};
  color: ${({ theme }) => theme.red1};
`

export default function TxnsProgress({
  hash,
  txData
}:any) {
  const allTransactions = useAllTransactions()
  const tx:any = allTransactions?.[hash]

  const [step, setStep] = useState(0)

  useEffect(() => {
    let stepNum = 1
    // console.log(tx)
    if (tx || txData) {
      const txInfo = tx?.info ?? txData
      if (txInfo) {
        const status = txInfo?.status ?? ''
        if (status === '' || [-1, 0, 5].includes(status)) {
          stepNum = 3 // Confirming
        } else if ([0, 5].includes(status)) {
          stepNum = 4 // Confirmed
        } else if ([7, 8].includes(status)) {
          stepNum = 5 // Routing
        } else if ([9].includes(status) && (!txInfo?.confirmations || txInfo?.confirmations <= 1)) {
          stepNum = 6 // Routed
        } else if (([9].includes(status) && txInfo?.confirmations > 1) || [10].includes(status)) {
          stepNum = 7 // Success
        } else if ([-3, -2, 1, 2, 4, 6, 3, 16, 11, 14, 20].includes(status)) {
          stepNum = 99
        } else if ([12].includes(status)) {
          stepNum = 98
        }
      } else {
        if (!tx.receipt) {
          stepNum = 1 // pending
        } else if (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined') {
          stepNum = 2 // Sent
        } else {
          stepNum = -1
        }
      }
    }
    // console.log(tx)
    // console.log(stepNum)
    setStep(stepNum)
  }, [tx, txData])

  const CheckCircleView = <CheckCircle size={12} style={{marginRight: 5, display: 'none'}} />
  const LoaderView = <Loading size={'14px'} stroke="#5f6bfb" style={{marginRight: 5}} />

  const PendingView = (status:any) => {
    if (status >= 2) {
      return <div className={"item green"}>
      <div className="step"><span className="num">1</span></div>
      <div className="label">{CheckCircleView}Sent</div>
    </div>
    }
    return <div className={"item"}>
      <div className="step"><span className="num">1</span></div>
      <div className="label">{status === 1 ? LoaderView : ''}Pending</div>
    </div>
  }
  const ConfirmingView = (status:any) => {
    if (status >= 4) {
      return <div className={"item green"}>
      <div className="step"><span className="num">2</span></div>
      <div className="label">{CheckCircleView}Confirmed</div>
    </div>
    }
    return <div className={"item"}>
      <div className="step"><span className="num">2</span></div>
      <div className="label">{[2,3].includes(status) ? LoaderView : ''}Confirming</div>
    </div>
  }
  const RoutingView = (status:any) => {
    if (status >= 6) {
      return <div className={"item green"}>
      <div className="step"><span className="num">3</span></div>
      <div className="label">{CheckCircleView}Routing</div>
    </div>
    }
    return <div className={"item"}>
      <div className="step"><span className="num">3</span></div>
      <div className="label">{[4,5].includes(status) ? LoaderView : ''}Routing</div>
    </div>
  }
  const SuccessView = (status:any) => {
    if (status >= 7 && status < 98) {
      return <div className={"item green"}>
        <div className="step"><span className="num">4</span></div>
        <div className="label">{CheckCircleView}Success</div>
      </div>
    } else if (status === 98) {
      return <div className={"item yellow"}>
        <div className="step"><span className="num">4</span></div>
        <div className="label"><Info size={12} style={{marginRight: 5}} />Big Amount</div>
      </div>
    }
    return <div className={"item"}>
      <div className="step"><span className="num">4</span></div>
      <div className="label">{[6].includes(status) ? LoaderView : ''}Success</div>
    </div>
  }
  // console.log(ProgressNum)
  function ProgressView (status:any) {
    // console.log(status)
    if (status === 99) {
      return (
        <FailureBox>
          <Info size={16} style={{marginRight: 5}} />Failure
        </FailureBox>
      )
    }
    return (
      <>
        {PendingView(status)}

        {ConfirmingView(status)}

        {RoutingView(status)}

        {SuccessView(status)}
      </>
    )
  }
  function LineView (ProgressNum:any) {
    if (ProgressNum > 6) {
      return <div className={"line "}style={{ width: '100%' }}></div>
    } else if (ProgressNum >= 5) {
      return <div className={"line "}style={{ width: '66%' }}></div>
    } if (ProgressNum >= 3) {
      return <div className={"line "}style={{ width: '33%' }}></div>
    }
    return <div className={"line "}style={{ width: '0%' }}></div>
  }
  return (
    <>
      <ProgressBox>
        <div className="list-box">
          {
            step === 99 ? '' : (
              <div className="lineBox">
                <div className="lineWrapper">
                  {LineView(step)}
                </div>
              </div>
            )
          }
          <div className="list">
            {ProgressView(step)}
          </div>
        </div>
      </ProgressBox>
    </>
  )
}