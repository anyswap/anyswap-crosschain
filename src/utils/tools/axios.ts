import axios from 'axios'

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