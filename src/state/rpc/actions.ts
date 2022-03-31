import { createAction } from '@reduxjs/toolkit'

export const rpclist = createAction<{ chainId: any; rpclist: any }>('rpc/rpclist')
