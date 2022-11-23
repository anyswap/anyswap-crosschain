import axios from 'axios'
import qs from 'qs'


// axios.defaults.headers.common['Authorization'] = '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249'
export function getUrlData (url:string) {
  return new Promise(resolve => {
    axios.get(url).then((res:any) => {
      if (res && (res.data || res.data === 0) && res.status === 200) {
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
// for (let i = 0; i < 100; i++) {

//   getUrlData('http://stressapi.multichain.org/charts/total-history').then(res => console.log(res))
// }
// console.log(axios.post)
export function postUrlData (url:string, data:any, type?: any) {
  return new Promise(resolve => {
    axios.post(url, type ? data : qs.stringify(data)).then((res:any) => {
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
