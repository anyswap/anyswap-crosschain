type Item = {
  token: string
  anyToken: string
  symbol: string
  spender: string
}

export const nonApproveList: {
  [chainId: number]: Item[]
} = {}
