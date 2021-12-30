export function getSymbol (pairid:any) {
  if (pairid === 'any') {
    return pairid.toUpperCase()
  }
  // const pairid = row.pairid ? row.pairid.replace('v2', '').replace('v3', '').replace('v4', '').replace('v5', '').replace('v6', '').replace('any', '').toUpperCase() : (obj ? obj.symbol : '')
  
  // console.log(row.pairid)
  const symbol = pairid ? pairid.replace(/v[0-9]+$/, '').replace('any', '').toUpperCase() : ''
  return symbol
}

const txnsType = ['swapout']

export function getFromChainId (tx:any) {
  if (tx?.fromChainID) {
    return tx?.fromChainID
  } else if (!txnsType.includes(tx?.historyType)) {
    return tx?.srcChainID
  } else {
    return tx?.destChainID
  }
}

export function getToChainId (tx:any) {
  if (tx?.toChainID) {
    return tx?.toChainID
  } else if (!txnsType.includes(tx?.historyType)) {
    return tx?.destChainID
  } else {
    return tx?.srcChainID
  }
}