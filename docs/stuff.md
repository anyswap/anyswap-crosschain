# Проблемы

- `src/hooks/terra/index.ts` - импорт с пакета `@terra-money/terra.js` (https://www.npmjs.com/package/@terra-money/core). Пакет обновлялся два года назад, хз как они это использют, но там нет одного из импортов, поэтому нужно опять ставить игноры

- `src/hooks/useBridgeCallback.ts` - то же игноры из-за `@terra-money/terra.js`

# Что происходит

основной конфиг: `src/config/*`

## Что использовать

можно включить последнюю версиию (7) в конфиге:
`export const INIT_VERSION = VERSION.V7`

тогда в итоге мы будем отображать только `src/components/CrossChainPanelV2/index.tsx`. Где есть выбор что показать:
`CrossChainBTC, CrossChainNonEVM, CrossChainEVM`.
Возможно просто удалить `CrossChainNonEVM` и пропустить `CrossChainBTC`.
В `CrossChainEVM` мы при свапе вызываем один из хуков:

- `useBridgeCallback`
- `useBridgeNativeCallback`
- `useBridgeUnderlyingCallback`
- `useCrossBridgeCallback`

В каждом из них мы вызываем какой то метод у `bridgeContract` (кроме `useCrossBridgeCallback`, который использует `signSwapinData` method с [multichain-bridge](https://github.com/anyswap/multichain-bridge) репозитория), который использует определенные методы (описаны ниже) из `bridgeContract` контракта в зависимости от используемого asset'a.

Методы `bridgeContract`:

- `anySwapOutNative` (`useBridgeNativeCallback`)
- `anySwapOut` (`useBridgeCallback`)
- `anySwapOutUnderlying` (`useBridgeUnderlyingCallback`)

...

### Dashboard

в `pages/Dashboard/index.tsx` исходя из номера текущей сети запрашиваем токены из [multichain-bridge](https://github.com/anyswap/multichain-bridge) через метод `GetTokenListByChainID`

---

docs:
https://github.com/anyswap/anyswap-docs/blob/main/docs/DevelopersGuide/integrateBridgeFrontend.md

deploy:
https://github.com/anyswap/chaindata/blob/main/deploy.md

router v4 (используeм его в 7 версии):
https://github.com/W2Ning/Anyswap_Vul_Poc/blob/c039be7e1df8d0901fcc175fb9ead6b8f90d4297/AnyswapV4Router.sol

router v6:
https://github.com/tintinweb/smart-contract-sanctuary-ethereum/blob/38fa8189cff383521956c310309d4e7c924f87e6/contracts/mainnet/ba/ba8da9dcf11b50b03fd5284f164ef5cdef910705_AnyswapV6Router.sol

AnyswapV5ERC20:
https://testnet.bscscan.com/address/0x6fd2b7fc5db32a133a6824e1117d0f290ba43abc#code

AnyswapV6ERC20:
https://bscscan.com/address/0x41a072b1c8d716721e407640e5b1fdcc714239ab#code

Usefull:
https://github.com/andrecronje/anyswap-v1-core/tree/master/contracts
