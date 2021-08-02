import { formatUnits, parseUnits } from '@ethersproject/units'
import config from '../../config/index'
import {USE_VERSION} from '../../config/constant'
console.log(config)
export function formatWeb3Str (str:string, len = 64) {
  // console.log(str)
  str = str.indexOf('0x') === 0 ? str.substr(2) : str
  const strLen = str.length / len
  const arr = []
  for (let i = 0; i < strLen; i++) {
    const str1 = str.substr(i * len, len)
    arr.push('0x' + str1)
  }
  return arr
}

const VERSION = 'VERSION'

export function getLocalConfig (
  account:string,
  token:string,
  chainID:any,
  type:string,
  timeout?:string|number|undefined,
  saveType?:number|undefined,
  version?: string
) {
  version = version ? version : USE_VERSION
  const curVersion = localStorage.getItem(version + '_' + VERSION)
  // console.log(curVersion)
  if (curVersion && curVersion !== config.version) {
    sessionStorage.clear()
    return false
  }
  const lStorage = saveType ? localStorage : sessionStorage
  // console.log(version + '_' + type)
  const lstr = lStorage.getItem(version + '_' + type)
  if (!lstr) {
    return false
  } else {
    const lboj = JSON.parse(lstr)
    // console.log(lboj)
    if (!lboj[chainID]) {
      return false
    } else if (!lboj[chainID][account]) {
      return false
    } else if (!lboj[chainID][account][token] && token !== 'all') {
      return false
    } else if (
      (lboj[chainID][account].timestamp < config.localDataDeadline && token !== 'all')
      || (lboj[chainID][account].timestamp < config.localDataDeadline && token === 'all')
    ) { // 在某个时间之前的数据无效
      lStorage.setItem(version + '_' + type, '')
      return false
    } else if (token === 'all') {
      return lboj[chainID][account]
    } else if (timeout && (Date.now() - lboj[chainID][account][token].timestamp) > timeout) {
      return false
    } else {
      return lboj[chainID][account][token]
    }
  }
}

export function setLocalConfig (
  account:string,
  token:string,
  chainID:any,
  type:string,
  data: any,
  saveType?:number|undefined,
  version?: string
) {
  version = version ? version : USE_VERSION 
  const lStorage = saveType ? localStorage : sessionStorage
  const lstr = lStorage.getItem(version + '_' + type)
  let lboj:any = {}
  if (!lstr) {
    lboj[chainID] = {timestamp: Date.now()}
    lboj[chainID][account] = {timestamp: Date.now()}
    lboj[chainID][account][token] = {
      ...data,
      timestamp: Date.now()
    }
  } else {
    lboj = JSON.parse(lstr)
    if (!lboj[chainID]) {
      lboj[chainID] = {timestamp: Date.now()}
      lboj[chainID][account] = {timestamp: Date.now()}
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now()
      }
    } else if (!lboj[chainID][account]) {
      lboj[chainID] = {
        ...lboj[chainID],
        timestamp: Date.now()
      }
      lboj[chainID][account] = {timestamp: Date.now()}
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now()
      }
    } else {
      lboj[chainID][account][token] = {
        ...data,
        timestamp: Date.now()
      }
    }
  }
  localStorage.setItem(version + '_' + VERSION, config.version)
  lStorage.setItem(version + '_' + type, JSON.stringify(lboj))
}


export function thousandBit (num:any, dec:any = 8) {
  if (!Number(num)) return '0.00'
    if (Number(num) < 0.00000001) return '<0.00000001'
    if (Number(num) < 0.01) return Number(Number(num).toFixed(6))
    if (Number(num) < 1) return Number(Number(num).toFixed(4))
    if (Number(num) < 1000) {
      if (isNaN(dec)) {
        return num
      } else {
        return Number(num).toFixed(dec)
      }
    }
    const _num = num = Number(num)
    if (isNaN(num)) {
      num = 0
      num = num.toFixed(dec)
    } else {
      if (isNaN(dec)) {
        if (num.toString().indexOf('.') === -1) {
          num = Number(num).toLocaleString()
        } else {
          const numSplit = num.toString().split('.')
          numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
          num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
          num = num.toString().split('.')[0] + '.' + numSplit[1]
        }
      } else {
        num = num.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
      }
    }
    if (_num < 0 && num.toString().indexOf('-') < 0) {
      num = '-' + num
    }
    return num
}

export function formatDecimal(num:any, decimal:number) {
  if (isNaN(num)) {
    return num
  }
  const minnum = 1 / Math.pow(10, decimal)
  // console.log(decimal)
  // console.log(minnum)
  if (!num || Number(num) <= 0) {
    return '0.00'
  }
  if (Number(num) < minnum) {
    return '<' + minnum
  }
  // num = (num * 10000).toFixed(decimal) / 10000
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
  } else {
      num = num.substring(0)
  }
  return Number(parseFloat(num).toFixed(decimal))
}

export function formatNum (num:any) {
  if (isNaN(num)) {
    return num
  }
  num = Number(num)
  if (num >= 1) {
    return formatDecimal(num, 2)
  } else {
    return formatDecimal(num, config.keepDec)
  }
}

export function fromWei (value:any, decimals?:number, dec?:number) {
  if (!value || !value) {
    return ''
  }
  if (Number(value) === 0) {
    return 0
  }
  decimals = decimals ? decimals : 18
  if (dec) {
    return formatDecimal(Number(formatUnits(value.toString(), decimals)), dec)
  }
  return Number(formatUnits(value.toString(), decimals))
}

export function toWei (value:any, decimals:number) {
  if (!value || !value) {
    return ''
  }
  if (Number(value) === 0) {
    return 0
  }
  return parseUnits(value.toString(), decimals)
}
