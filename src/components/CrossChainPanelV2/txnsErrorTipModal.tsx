import React from "react"
import styled from "styled-components"
import {useTxnsErrorTipOpen} from '../../state/application/hooks'
// import {getParams} from '../../config/tools/getUrlParams'

import ModalContent from '../Modal/ModalContent'

const ErrorTipContent = styled.div`
  padding: 30px 20px;
  color: ${({ theme }) => theme.red1};
`

export default function TxnsErrorTipModal () {
  const {errorTip, isOpenModal, onChangeViewErrorTip} = useTxnsErrorTipOpen()

  return (
    <>
      <ModalContent
        isOpen={isOpenModal}
        title={'Transaction Error'}
        onDismiss={() => {
          onChangeViewErrorTip('', false)
        }}
        padding={'0rem'}
      >
       <ErrorTipContent>{errorTip?.message ?? errorTip.toString()} </ErrorTipContent>
      </ModalContent>
    </>
  )
}