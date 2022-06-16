import React from "react";

import { ButtonLight } from '../../components/Button'

import AppBody from '../AppBody'

import {
  // useLogin,
  useNearSendTxns
} from '../../hooks/near'



export default function TestWarpper () {

  const {sendNearTxns}  = useNearSendTxns()
  return (
    <>
      <AppBody>
        <ButtonLight onClick={() => {
          sendNearTxns('dwinter.testnet', '100')
        }}>test</ButtonLight>
      </AppBody>
    </>
  )
}