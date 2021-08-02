import { chainInfo } from '../chainConfig'
export function selectNetwork (chainID:any) {
  return new Promise(resolve => {
    const { ethereum } = window
    const ethereumFN:any = {
      request: '',
      ...ethereum
    }
    // console.log(config)
    if (ethereumFN && ethereumFN.request) {
      const data = {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x' + Number(chainID).toString(16), // A 0x-prefixed hexadecimal string
            chainName: chainInfo[chainID].networkName,
            nativeCurrency: {
              name: chainInfo[chainID].name,
              symbol: chainInfo[chainID].symbol, // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: [chainInfo[chainID].nodeRpc],
            blockExplorerUrls: chainInfo[chainID].nodeRpcList ? chainInfo[chainID].nodeRpcList : [chainInfo[chainID].explorer],
            iconUrls: null // Currently ignored.
          }
        ],
      }
      // console.log(data)
      ethereumFN.request(data).then((res: any) => {
        console.log(res)
        localStorage.setItem('ENV_NODE_CONFIG', chainInfo[chainID].label)
        // history.go(0)
        resolve({
          msg: 'Success'
        })
      }).catch((err: any) => {
        console.log(err)
        resolve({
          msg: 'Error'
        })
      })
    } else {
      resolve({
        msg: 'Error'
      })
    }
  })
}