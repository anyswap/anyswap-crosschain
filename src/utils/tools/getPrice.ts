import axios from 'axios'
// import config from '../../config'


function getApiUrlData (url:string, token:string, address?:string) {
  return new Promise(resolve => {
    axios.get(url).then((res:any) => {
      if (res && res.data && res.status === 200) {
        // let price = res.data[0].current_price
        window.localStorage.setItem(token, JSON.stringify({
          timestamp: Date.now(),
          data: res.data,
          address: address
        }))
        resolve({
          msg: 'Success',
          data: res.data
        })
      } else {
        window.localStorage.setItem(token, '')
        resolve({
          msg: 'Error',
          data: ''
        })
      }
    }).catch((err:any) => {
      console.log(err)
      window.localStorage.setItem(token, '')
      resolve({
        msg: 'Error',
        data: ''
      })
    })
  })
}

function getApiData (url:string, token:string, intarval:number, address?:string) {
  const localData = window.localStorage.getItem(token)
  return new Promise(resolve => {
    if (localData) {
      const localObj = JSON.parse(localData)
      if (
        (Date.now() - Number(localObj.timestamp) > intarval)
        || !localObj.data
        || (address && address !== localObj.address)
      ) {
        getApiUrlData(url, token, address).then((res:any) => {
          // console.log(res)
          if (res.msg === 'Success') {
            resolve(res.data)
          } else {
            resolve('')
          }
        })
      } else {
        resolve(localObj.data)
      }
    } else {
      getApiUrlData(url, token, address).then((res:any) => {
        // console.log(res)
        if (res.msg === 'Success') {
          resolve(res.data)
        } else {
          resolve('')
        }
      })
    }
  })
}
export const getPrice = (coin:string) => {
  return new Promise(resolve => {
    // coin = coin ? coin : config.symbol
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=fsn'
    // if (true) {
    if (coin === 'BNB') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin'
    } else if (coin === 'HT') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=huobi-token'
    } else if (coin === 'FTM') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=fantom'
    } else if (coin === 'ANY') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=anyswap'
    } else if (coin === 'DEP') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=deapcoin'
    } else if (coin === 'HERO') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=hero'
    } else if (coin === 'PLAY') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polyplay'
    } else if (coin === 'BACON') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bacondao'
    } else if (coin === 'KABY') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=kaby-arena'
    } else if (coin === 'MULTI') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=multichain'
    } else if (coin === 'ARB') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=arbitrum'
    } else if (coin === 'ETH') {
      url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum'
    }
    // console.log(url)
    getApiData(url, coin + '_PRICE', 1000 * 60 * 60).then((res:any) => {
      if (res && res.length > 0) {
        const price = res[0].current_price
        resolve(price)
      } else {
        resolve('')
      }
    })
  })
}

export const getLabelPrice = (label:string) => {
  return new Promise(resolve => {
    // coin = coin ? coin : config.symbol
    const url = `https://bridgeapi.anyswap.exchange/token/price?label=${label}`
    // console.log(url)
    getApiData(url, label + '_PRICE', 1000 * 60 * 60).then((res:any) => {
      // console.log(res)
      if (res.usd) {
        const price = res.usd
        resolve(price)
      } else {
        resolve('')
      }
    })
  })
}

const LABRL_PRICE_LIST = 'LABRL_PRICE_LIST'

function getAllLabelPriceLink (labelKey:string) {
  return new Promise(resolve => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${labelKey}&vs_currencies=usd`
    axios.get(url).then((res:any) => {
      if (res && res.data && res.status === 200) {
        resolve({
          msg: 'Success',
          data: res.data
        })
      } else {
        resolve({
          msg: 'Error',
          data: ''
        })
      }
    }).catch((err:any) => {
      console.log(err)
      resolve({
        msg: 'Error',
        data: ''
      })
    })
  })
}
export function getAllLabelPrice (labelArr:Array<string>) {
  return new Promise(resolve => {
    const key = labelArr.join(',')
    const useKey = LABRL_PRICE_LIST + '_' + key
    const localPriceList = sessionStorage.getItem(useKey)
    if (localPriceList) {
      const lpl = JSON.parse(localPriceList)
      if (Date.now() - lpl.timestamp > (1000 * 60 * 10)) {
        getAllLabelPriceLink(key).then((res:any) => {
          if (res.msg === 'Success') {
            sessionStorage.setItem(useKey, JSON.stringify(res.data))
            resolve(res.data)
          } else {
            resolve(lpl)
          }
        }).catch(() => {
          resolve(lpl)
        })
      } else {
        resolve(lpl)
      }
    } else {
      getAllLabelPriceLink(key).then((res:any) => {
        if (res.msg === 'Success') {
          sessionStorage.setItem(useKey, JSON.stringify(res.data))
          resolve(res.data)
        } else {
          resolve('')
        }
      }).catch(() => {
        resolve('')
      })
    }
  })
}

// getAllLabelPrice(['ethereum', 'arbitrum']).then((res) => {
//   console.log(res)
// })