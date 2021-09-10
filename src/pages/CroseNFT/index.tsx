import React, { useEffect } from 'react'

import {useNFT721Callback} from '../../hooks/useNFTCallback'
import {useApproveCallback} from '../../hooks/useNFTApproveCallback'
import { useActiveWeb3React } from '../../hooks'

import { BottomGrouping } from '../../components/swap/styleds'
import { ButtonConfirmed } from '../../components/Button'

export default function CroseNFT () {
  const { account } = useActiveWeb3React()
  // const [selectCurrency, setSelectCurrency] = useState<any>()

  // const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
  //   '0x5F69b7Ab8F7cAb199a310Fd5A27B43Fef44ddcC0',
  //   {symbol: 'NFT'},
  //   '0x9bd3fac4d9b051ef7ca9786aa0ef5a7e0558d44c',
  //   '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
  //   '7003',
  //   '250'
  // )
  const selectToken = '0x937e077abaea52d3abf879c9b9d3f2ebd15baa21'
  const selectTokenid = '7001'
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useNFT721Callback(
    '0x63D3F3b271dBbd43A788687B86D516Fe185D2509',
    {symbol: 'NFT'},
    selectToken,
    account,
    selectTokenid,
    '4'
  )
  const [approval, approveCallback] = useApproveCallback(selectToken, '0x63D3F3b271dBbd43A788687B86D516Fe185D2509', selectTokenid)

  useEffect(() => {
    console.log(wrapType)
    console.log(wrapInputError)
    console.log(approval)
  }, [wrapType, wrapInputError, approval])
  return (
    <>
      <BottomGrouping>
        <ButtonConfirmed onClick={() => {
          if (onWrap) onWrap()
        }}>
          Test
        </ButtonConfirmed>
        <ButtonConfirmed onClick={() => {
          if (approveCallback) approveCallback()
        }}>
          Test approveCallback
        </ButtonConfirmed>
      </BottomGrouping>
    </>
  )
}