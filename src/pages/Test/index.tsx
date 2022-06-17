import React from "react";

import { ButtonLight } from '../../components/Button'

import AppBody from '../AppBody'

// import {
//   // useLogin,
//   useNearSendTxns
// } from '../../hooks/near'



export default function TestWarpper () {

  // const {execute: sendNearTxns}  = useNearSendTxns('1', 'dwinter.testnet')
  return (
    <>
      <AppBody>
        <ButtonLight onClick={() => {
          // if (sendNearTxns) sendNearTxns()
        }}>test</ButtonLight>
      </AppBody>
    </>
  )
}