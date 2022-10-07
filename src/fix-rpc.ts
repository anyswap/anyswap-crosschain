import { networks } from 'multichain-bridge'

/*
  Переопределяем rpc из пакета
  В пакете для некоторых сетей используются их внутрение rpc, которые из-за корса перестали работать
*/
networks[1] = 'https://mainnet.infura.io/v3/fdd4494101ed4a28b41bb66d7fe9c692'
networks[4] = 'https://rinkeby.infura.io/v3/fdd4494101ed4a28b41bb66d7fe9c692'
networks[56] = 'https://bsc-dataseed1.binance.org'
networks[97] = 'https://data-seed-prebsc-2-s3.binance.org:8545'

const doNothing = () => {
  if (false) console.log('do nothing')
}

export default doNothing