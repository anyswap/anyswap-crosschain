import {
  USE_VERSION,
  version
} from './constant'
import {
  w,
  TOKENLIST
} from '../utils/indexedDB'

function initVersion (version:any, configVersion:any) {
  const VERSION = version + '_VERSION'
  const curVersion = localStorage.getItem(VERSION)
  // console.log(curVersion)
  // console.log(configVersion)
  if (curVersion && curVersion !== configVersion) {
    sessionStorage.clear()
    localStorage.clear()
    w.indexedDB.deleteDatabase(TOKENLIST)
    localStorage.setItem(VERSION, configVersion)
  } else if (!curVersion) {
    localStorage.setItem(VERSION, configVersion)
  }
}
initVersion(USE_VERSION, version)