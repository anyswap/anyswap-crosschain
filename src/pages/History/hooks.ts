export function getSymbol (pairid:any) {
  if (pairid === 'any') {
    return pairid.toUpperCase()
  }
  // const pairid = row.pairid ? row.pairid.replace('v2', '').replace('v3', '').replace('v4', '').replace('v5', '').replace('v6', '').replace('any', '').toUpperCase() : (obj ? obj.symbol : '')
  
  // console.log(row.pairid)
  const symbol = pairid ? pairid.replace(/v[0-9]+$/, '').replace('any', '').toUpperCase() : ''
  return symbol
}