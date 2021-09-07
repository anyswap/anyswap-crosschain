import { Web3Provider } from '@ethersproject/providers'

export default function getLibrary(provider: any): any {
  if (provider) {
    const library = new Web3Provider(provider, 'any')
    library.pollingInterval = 2000
    return library
  }
  return ''
}
