import React from "react"
import styled from "styled-components"

import { useAllTransactions } from '../../state/transactions/hooks'
import {useTxnsDtilOpen} from '../../state/application/hooks'

import TokenLogo from "../TokenLogo"

const TxnsListBox = styled.div`
  position:fixed;
  top: 100px;
  right: 20px
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
`

export default function TxnsListModal () {
  const allTransactions = useAllTransactions()
  const {onChangeViewDtil} = useTxnsDtilOpen()

  // console.log(allTransactions)
  // const hash = getParams('hash')
  console.log(allTransactions)
  return (
    <>
      <TxnsListBox>
        {Object.keys(allTransactions).map((hash) => {
          const symbol = allTransactions[hash].symbol
          return (
            <div onClick={() => {onChangeViewDtil(hash, true)}} key={hash}>
              <TokenLogo symbol={symbol} size={'36px'} />
            </div>
          )
        })}
      </TxnsListBox>
    </>
  )
}