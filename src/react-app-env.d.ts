/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'jazzicon' {
  export default function(diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

declare module 'qrcode.react'

declare module '@makerdao/multicall';

declare module 'toformat';

declare module 'big.js';

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
  }
  okexchain:any
  tronWeb:any
  web3?: {}
  returnCitySN?: {},
  near: any,
  mozIndexedDB: any
  webkitIndexedDB: any
  msIndexedDB: any
  webkitIDBTransaction: any
  msIDBTransaction: any
  webkitIDBKeyRange: any
  msIDBKeyRange: any
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}

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

declare module 'nebpay.js'