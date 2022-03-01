import {XummSdkJwt} from 'xumm-sdk'
// const APIKey = '0d8673f8-9664-469d-b5f6-a466ae18f33b'
// export const ott = '2adaafce-5207-40c7-ac4d-c0f651b7814f'
const APIKey = '8525e32b-1bd0-4839-af2f-f794874a80b0'
export const Sdk = new XummSdkJwt(APIKey)

Sdk.getOttData().then(c => {
  console.log('OTT Data', c)
 
  Sdk.ping().then(c => {
      console.log('Pong', c)
  })
 }).catch(err => {
   console.log(err)
 })

 const options = {method: 'GET', headers: {Accept: 'application/json'}};

fetch('https://xumm.app/api/v1/xapp-jwt/authorize', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));