declare module 'nebulas' {
  export class Account {
    static isValidAddress(address: string): boolean
  }

  export class HttpRequest {
    constructor(endpoint)
  }

  export class Neb {
    setRequest(HttpRequest)

    api: {
      getAccountState(address)
    }
  }
}

declare const NasExtWallet
