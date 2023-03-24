
import { useCallback, useEffect } from 'react'
import { useActiveReact } from '../../hooks/useActiveReact'
// import {
//   // useDispatch,
//   useSelector
// } from 'react-redux'
// import {
//   AppState,
//   // AppDispatch
// } from '../../state'
import { ChainId } from '../../config/chainConfig/chainId'
// import config from '../../config'
import {
  useLoginReef,
  // useReefProvider,
  useReefClient,
  // useReefSigner
} from './index'

// function wssFN (chainId:any) {
//   return new Promise(() => {
//     const wss = new WebSocket(config.chainInfo[chainId].nodeRpcWs)
//     wss.onopen = function(){
//       //当WebSocket创建成功时，触发onopen事件
//       console.log("websocket连接成功");
//       //ws.send("hello"); //将消息发送到服务端
//       // wss.send({
//       //   id: 29,
//       //   jsonrpc: "2.0",
//       //   method: "author_submitAndWatchExtrinsic",
//       //   params: [
//       //     '0xf9014a01831e84808303715294a75982f7e27ac8311a12c0470642133b670daa6280b8e4c604b0b80000000000000000000000009a0f7fbc52324bad4c2c6dedf6f6f1a7a1f1b9fd000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000002a30784330333033336438623833336646376361303842463241353843394243396437313132353732343900000000000000000000000000000000000000000000826d09a0982f8ae67fc7ecd0db299062ead1426e48f1e7a564ae06ee0846c829b7b04e0fa01d75acf657df0f20b012a0271b5b03a3c6b772af71fc678d8b69cbb438758e85'
//       //   ]
//       // })
//       wss.send(JSON.stringify( {"id":29,"jsonrpc":"2.0","method":"author_submitAndWatchExtrinsic","params":["0xfd0584005622ecd69ce9d65a99c9b5dbe70ecce50e93af54e9828b11a1a79b4b93daab7f0156547be1a613981dc1322eea8d40dfbb3c5423f3c355fecf53624e378506f17bbf3bb0f12308ade36b6e9de21036132e8985f147457b3fb7be4a71e5b7d21889b5014c001500a75982f7e27ac8311a12c0470642133b670daa629103049b4e7e0000000000000000000000000e1f6c7568bdee24b2cf81d758a1aec2f6865ada00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000002a30784330333033336438623833336646376361303842463241353843394243396437313132353732343900000000000000000000000000000000000000000000000000000000000000000000000000002af009000000000000000000"]}	))
//     }
//     wss.onmessage = function(e:any){
//       //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
//       console.log("收到数据");
//       console.log(e.data);
//     }
//     wss.onclose = function(e:any){
//       //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
//       console.log("websocket已断开");
//       console.log(e);
//     }
//     wss.onerror = function(e:any){
//       //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
//       console.log("websocket发生错误"+e);
//     }
//   })
// }

export default function Updater(): null {
  const { chainId } = useActiveReact()
  
  const {loginReef} = useLoginReef()
  // const reefClient:any = useSelector<AppState, AppState['reef']>(state => state.reef.reefClient)

  const getClient = useReefClient()
  // const getReefSigner = useReefSigner()
  // const getReefProvider = useReefProvider()

  const getReefAddress = useCallback(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      loginReef(chainId, 1)
    }
  }, [chainId])

  // useEffect(() => {
  //   if (reefClient) {
  //     getReefSigner(reefClient)
  //   }
  // }, [reefClient])

  

  useEffect(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      // getReefProvider(chainId)
      getClient()
      // wssFN(chainId)
    }
  // }, [chainId, getReefProvider])
  }, [chainId])

  useEffect(() => {
    if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      getReefAddress()
      
    }
  }, [chainId])

  return null
}
