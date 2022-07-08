import React from "react";

import { ButtonLight } from '../../components/Button'

import AppBody from '../AppBody'

import {
  getTokenlist,
  // setTokenlist
} from '../../utils/indexedDB'

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
          getTokenlist('56')
        }}>test</ButtonLight>
        <ButtonLight onClick={() => {
          // if (sendNearTxns) sendNearTxns()
          // setTokenlist('56', {name: 'test'})
        }}>test1</ButtonLight>
      </AppBody>
    </>
  )
}