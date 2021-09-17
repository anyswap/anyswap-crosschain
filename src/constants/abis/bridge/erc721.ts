import { Interface } from '@ethersproject/abi'
import ERC721_ABI from './erc721.json'

const ERC721_INTERFACE = new Interface(ERC721_ABI)


export default ERC721_INTERFACE
export { ERC721_ABI }
