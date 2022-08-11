import { formatUnits, parseUnits } from '@ethersproject/units'
import config from '../../config/index'
import {USE_VERSION} from '../../config/constant'
// console.log(config)
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
  const curVersion = window.localStorage.getItem(version + '_' + VERSION)
  // console.log(curVersion)
  if (curVersion && curVersion !== config.version) {
    sessionStorage.clear()
    return false
  }
  const lStorage = saveType ? window.localStorage : window.sessionStorage
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
  const lStorage = saveType ? window.localStorage : window.sessionStorage
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
  window.localStorage.setItem(version + '_' + VERSION, config.version)
  lStorage.setItem(version + '_' + type, JSON.stringify(lboj))
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

function thousandBitFormat (num:any, dec:any = 8) {
  const numArr = num.toString().split('.')
  const numInt = numArr[0]
  const numDec = numArr[1] ? numArr[1] : ''
  const numStr = numInt.toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    return s+','
  })
  // console.log(num)
  // console.log(numDec)
  // console.log(dec)
  if (isNaN(dec)) {

    return numStr + (numDec ? '.' + numDec : '')
  }
  return numStr + (numDec ? '.' + numDec.substr(0,dec) : '')
}

// console.log(thousandBitFormat(111111))
// console.log(thousandBitFormat(2732816.123456789,2))

export function thousandBit (num:any, dec:any = 8) {
  if (!Number(num)) return '0.00'
  if (Number(num) < 0.00000001) return '<0.00000001'
  if (Number(num) < 0.01) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, 6)
    }
  }
  if (Number(num) < 1) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, 4)
    }
  }
  if (Number(num) < 1000) {
    if (isNaN(dec)) {
      return num
    } else {
      return formatDecimal(num, dec)
    }
  }
  const _num = num = Number(num)
  if (isNaN(num)) {
    num = 0
    num = formatDecimal(num, dec)
  } else {
    num = thousandBitFormat(num, dec)
    // if (isNaN(dec)) {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = Number(num).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     const numSplit = num.toString().split('.')
    //     numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
    //     num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //     // num = Number(numSplit[0]).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //     //   return s+','
    //     // })
    //     num = num.toString().split('.')[0] + '.' + numSplit[1]
    //   }
    // } else {
    //   if (num.toString().indexOf('.') === -1) {
    //     num = formatDecimal(num, dec).toString().replace(/\d{1,3}(?=(\d{3})+$)/g,function(s:any){
    //       return s+','
    //     })
    //   } else {
    //     num = formatDecimal(num, dec).toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    //   }
    // }
  }
  if (_num < 0 && num.toString().indexOf('-') < 0) {
    num = '-' + num
  }
  return num
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
  decimals = decimals !== undefined ? decimals : 18
  if (dec) {
    
    return formatDecimal(Number(formatUnits(value.toString(), decimals)), dec)
  }
  // return formatUnits(value.toString(), decimals)
  return Number(formatUnits(value.toString(), decimals))
}
// console.log(formatUnits('18069854444009912311', 18))
export function toWei (value:any, decimals:number) {
  if (!value || !value) {
    return ''
  }
  if (Number(value) === 0) {
    return 0
  }
  return parseUnits(value.toString(), decimals)
}

export function bigToSmallSort (propertyArray:any) {
  const levelCount = propertyArray.length

  return function (item1:any, item2:any) {
    let level = 0;
    const sorting:any = function () {
      const propertyName = propertyArray[level];
      level++;

      const itemCell1 = item1[propertyName],
          itemCell2 = item2[propertyName];
      if (itemCell1 < itemCell2) {
          return 1; //从小到大排序
      } else if (itemCell1 > itemCell2) {
          return -1;
      } else if (itemCell1 === itemCell2) {
        if (level === levelCount) {
            return 0;
        } else {
            return sorting();
        }
      }
    };
    return sorting();
  };
}

export function fromTime (timestamp:any) {
  if (timestamp.toString().length === 10) {
    timestamp = Number(timestamp) * 1000
  } else if (timestamp.toString().length > 13) {
    timestamp = timestamp.toString().substring(0, 13)
  }
  return Number(timestamp)
}

export function timeChange (timestamp:any, type:any, format?:any) {
  let time:any = timestamp ? new Date(fromTime(timestamp)) : new Date()
  const formatType = format ? format : '/'
  let Y = time.getFullYear()
  const M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
  const D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
  const h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()
  const m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
  const s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()

  if (type === 'yyyy-mm-dd') {
    time = Y + formatType + M + formatType + D
  } else if (type === 'yyyy-mm-dd hh:mm') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  } else if (type === 'yyyy-mm-dd hh:mm:ss') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
  } else if (type === 'yyyy-mm-dd hh') {
    time = Y + formatType + M + formatType + D + ' ' + h
  } else if (type === 'yyyy-mm') {
    time = Y + formatType + M
  } else if (type === 'yyyy') {
    time = Y
  } else if (type === 'yy-mm-dd hh:mm') {
    Y = Y.toString().substr(2)
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  }
  return time
}

function timeSec (time:any) {
	return time + 's ago'
}

function timeMin (time:any, type?:any) {
	const seconds = time - (Math.floor(time / 60) * 60)
	let callback = Math.floor(time / 60) + ' mins ' + timeSec(seconds)
	if (type === 'min') {
		callback = Math.floor(time / 60) + ' mins '
	} else {
		callback = Math.floor(time / 60) + ' mins ' + timeSec(seconds)
	}
	return callback
}

function timeHour (time:any, type?:any) {
	const hours = Math.floor(time / (60 * 60))
	const minute = timeMin(time - (hours * 60 * 60), type)
	let callback = hours + ' hours ' + minute
	if (type === 'hour') {
		callback = hours + ' hours '
	} else {
		callback = hours + ' hours ' + minute
	}
	return callback
}

function timeDay (time:any, type?:any) {
	const days = Math.floor(time / (60 * 60 * 24))
	const hours = timeHour(time - (days * 60 * 60 * 24), type)
	const callback = days + ' days ' + hours
	return callback
}

export function timesFun (time:any, now?:any) {
  // let nowTime = Date.parse(now)
  const nowTime = now ? now : Date.parse(new Date().toString())
  // console.log(nowTime)
  time = time.toString().length > 10 ? time : (time * 1000)
  // console.log(time)
  let dataTime = 0
  let callback:any = 0
  if (isNaN(time)) {
    dataTime = Date.parse(time)
  } else {
    dataTime = time
  }
  let timeDiffer = (nowTime - dataTime) / 1000
  timeDiffer = timeDiffer > 0 ? timeDiffer : 1

  if (timeDiffer < 60) { // seconds
    // console.log(1)
    callback = timeSec(timeDiffer)
  } else if (timeDiffer < (60 * 60)) { // minute
    // console.log(2)
    callback = timeMin(timeDiffer)
  } else if (timeDiffer < (60 * 60 * 24)) { // hours
    // console.log(3)
    callback = timeHour(timeDiffer, 'min')
  } else { // day
    // console.log(4)
    callback = timeDay(timeDiffer, 'hour')
  }
  // console.log(callback)
  return callback
}