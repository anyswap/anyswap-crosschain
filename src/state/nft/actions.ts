import { createAction } from '@reduxjs/toolkit'

export const nftlist = createAction<{ chainId: any; account: any; nftlist: any }>('nft/nftlist')
