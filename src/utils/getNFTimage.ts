import axios from 'axios'

export function getIpfsImg (nftUrl:any) {
  const url = `https://gateway.pinata.cloud/ipfs/${nftUrl.replace('ipfs://', '')}`
  return new Promise(resolve => {
    axios.get(url).then(res => {
      const {status, data} = res
      if (status === 200) {
        resolve({
          ...data,
          imageUrl: data.image && data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
          initurl: nftUrl,
          useurl: url
        })
      } else {
        console.log(res)
        resolve({
          imageUrl: '',
          initurl: nftUrl,
          useurl: url
        })
      }
    }).catch(err => {
      console.log(err)
      resolve({
        imageUrl: '',
        initurl: nftUrl,
        useurl: url
      })
    })
  })
}

export function getUriImg (nftUrl:any) {
  return new Promise(resolve => {
    axios.get(nftUrl).then(res => {
      const {status, data} = res
      if (status === 200) {
        resolve({
          ...data,
          imageUrl: data.image,
          initurl: nftUrl,
          useurl: nftUrl
        })
      } else {
        resolve({
          imageUrl: '',
          initurl: nftUrl,
          useurl: nftUrl
        })
      }
    }).catch(err => {
      console.log(err)
      resolve({
        imageUrl: '',
        initurl: nftUrl,
        useurl: nftUrl
      })
    })
  })
}

export function getNftImage (nftUrl:any) {
  if (nftUrl.indexOf('ipfs://') === 0) {
    return getIpfsImg(nftUrl)
  } else {
    return getUriImg(nftUrl)
  }
}

export function getAllNftImage (list:any) {
  const arr:any = []
  return new Promise(resolve => {
    for (const url of list) {
      arr.push(getNftImage(url))
    }
    Promise.all(arr).then(res => {
      resolve(res)
    })
  })
}