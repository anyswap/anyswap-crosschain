import React, { useMemo } from "react";
import styled from "styled-components";

import {ChevronsRight, CheckCircle, Info} from 'react-feather'

import {Status} from '../../config/status'

import Loader from "../Loader";

const ProgressBox = styled.div`
  width:100%;
  margin-bottom: 10px;
  border-radius: 10px;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  background-color: ${({ theme }) => theme.tipBg};
  padding:10px;
  .list {
    ${({ theme }) => theme.flexBC};
    font-size: 12px;
    .item {
      ${({ theme }) => theme.flexC};
      &.yellow {
        // border: 1px solid ${({ theme }) => theme.birdgeStateBorder};
        // background: ${({ theme }) => theme.birdgeStateBg};
        color: ${({ theme }) => theme.birdgeStateBorder};
      }
      &.green{
        // border: 1px solid ${({ theme }) => theme.birdgeStateBorder1};
        // background: ${({ theme }) => theme.birdgeStateBg1};
        // color: ${({ theme }) => theme.birdgeStateBorder1};
        color: #10f732;
      }
      &.red{
        // border: 1px solid ${({ theme }) => theme.birdgeStateBorder2};
        // background: ${({ theme }) => theme.birdgeStateBg2};
        color: ${({ theme }) => theme.birdgeStateBorder2};
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
  color: ${({ theme }) => theme.birdgeStateBorder2};
`

export default function TxnsProgress({
  fromStatus,
  toStatus
}:any) {
  const ProgressNum = useMemo(() => {
    if (!toStatus) {
      if ([Status.Null].includes(fromStatus)) {
        return 0
      } else if ([Status.Pending].includes(fromStatus)) {
        return 1
      } else if ([Status.Success].includes(fromStatus)) {
        return 2
      } else if ([Status.Failure].includes(fromStatus)) {
        return -1
      }
    } else {
      if ([Status.Confirming].includes(toStatus)) {
        return 3
      } else if ([Status.Crosschaining].includes(toStatus)) {
        return 4
      } else if ([Status.Success].includes(toStatus)) {
        return 5
      } else if ([Status.BigAmount].includes(toStatus)) {
        return 6
      } else if (!toStatus || [Status.Failure, Status.Null].includes(toStatus)) {
        return -2
      }
    }
    return 0
  }, [fromStatus, toStatus])

  const ChevronsRightView = <div className="item"><ChevronsRight className="arrow" size={14} /></div>
  const CheckCircleView = <CheckCircle size={12} style={{marginRight: 5}} />
  const LoaderView = <Loading size={'14px'} stroke="#5f6bfb" style={{marginRight: 5}} />

  const PendingView = (status:any) => {
    if (status === 0) {
      return <div className={"item"}>{LoaderView}Pending</div>
    }
    return <div className={"item green"}>{CheckCircleView}Pending</div>
  }
  const ConfirmingView = (status:any) => {
    if (status >= 1 && status < 2) {
      return <div className={"item"}>{LoaderView}Confirming</div>
    }
    return <div className={"item green"}>{CheckCircleView}Confirming</div>
  }
  const CrosschainingView = (status:any) => {
    if (status >= 3 && status < 4) {
      return <div className={"item"}>{LoaderView}Crosschaining</div>
    }
    return <div className={"item green"}>{CheckCircleView}Crosschaining</div>
  }
  // const FailureView = <div className={"item red"}><Info size={12} style={{marginRight: 5}} />Failure</div>
  const SuccessView = (status:any) => {
    if (status >= 4 && status < 5) {
      return <div className={"item"}>{LoaderView}Success</div>
    } else if (status === 6) {
      return <div className={"item yellow"}><Info size={12} style={{marginRight: 5}} />Big Amount</div>
    }
    return <div className={"item green"}>{CheckCircleView}Success</div>
  }
  // console.log(ProgressNum)
  function ProgressView (status:any) {
    if (status >= 0) {
      return (
        <>
          {PendingView(status)}
          {ChevronsRightView}

          {ConfirmingView(status)}
          {ChevronsRightView}

          {CrosschainingView(status)}
          {ChevronsRightView}

          {SuccessView(status)}
        </>
      )
    } else {
      return (
        <FailureBox>
          <Info size={16} style={{marginRight: 5}} />Failure
        </FailureBox>
      )
      // if (status === -1) {
      //   return (
      //     <>
      //       {FailureView}
      //     </>
      //   )
      // } else {

      // }
      // if (status === -1) {
      //   return (
      //     <>
      //       {PendingView(status)}
      //       {ChevronsRightView}
  
      //       {FailureView}
      //       {ChevronsRightView}

      //       {CrosschainingView(status)}
      //       {ChevronsRightView}

      //       {SuccessView(status)}
      //     </>
      //   )
      // } else {
      //   return (
      //     <>
      //       {PendingView(status)}
      //       {ChevronsRightView}
  
      //       {ConfirmingView(status)}
      //       {ChevronsRightView}

      //       {CrosschainingView(status)}
      //       {ChevronsRightView}

      //       {FailureView}
      //     </>
      //   )
      // }
    }
  }
  return (
    <>
          {/* {ProgressView(-1)} */}
      {
        ProgressNum < 0 ? (
          <>
            {ProgressView(-1)}
          </>
        ) : (
          <ProgressBox>
            <div className="list">
              {ProgressView(ProgressNum)}
            </div>
          </ProgressBox>
        )
      }
    </>
  )
}