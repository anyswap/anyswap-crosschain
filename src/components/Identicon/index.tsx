import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

// import { useActiveWeb3React } from '../../hooks'
import {useActiveReact} from '../../hooks/useActiveReact'
import Jazzicon from 'jazzicon'

const StyledIdenticonContainer = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.bg4};
`

export default function Identicon() {
  const ref = useRef<HTMLDivElement>()

  const { account, chainId, evmAccount } = useActiveReact()

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
    } else if (evmAccount && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(evmAccount.slice(2, 10), 16)))
    } else if (chainId && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(Jazzicon(16, parseInt(chainId, 16)))
    }
  }, [account, account, evmAccount])

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer ref={ref as any} />
}
