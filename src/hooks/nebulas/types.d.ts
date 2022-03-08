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
      call(args)
    }
  }
}

declare const NasExtWallet

declare module 'nebpay.js' {
  export default class {
    pay(to, value, arg)
    call(to, value, callFunction, callArgs, payload)
  }
}
