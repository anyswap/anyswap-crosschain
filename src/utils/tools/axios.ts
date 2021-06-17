import axios from 'axios'
import qs from 'qs'


export function getUrlData (url:string) {
  return new Promise(resolve => {
    axios.get(url).then((res:any) => {
      if (res && res.data && res.status === 200) {
        resolve({
          msg: 'Success',
          data: res.data
        })
      } else {
        resolve({
          msg: 'Error',
          data: 'Error'
        })
      }
    }).catch((err:any) => {
      resolve({
        msg: 'Error',
        data: err.toString()
      })
    })
  })
}

export function postUrlData (url:string, data:any) {
  return new Promise(resolve => {
    axios.post(url, qs.stringify(data)).then((res:any) => {
      if (res && res.data && res.status === 200) {
        resolve({
          msg: 'Success',
          data: res.data
        })
      } else {
        resolve({
          msg: 'Error',
          data: 'Error'
        })
      }
    }).catch((err:any) => {
      resolve({
        msg: 'Error',
        data: err.toString()
      })
    })
  })
}