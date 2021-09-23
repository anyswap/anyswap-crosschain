import { Interface } from '@ethersproject/abi'
import ERC1155_ABI from './erc1155.json'

const ERC1155_INTERFACE:any = new Interface(ERC1155_ABI)


export default ERC1155_INTERFACE
export { ERC1155_ABI }
