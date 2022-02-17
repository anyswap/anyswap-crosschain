# Проблемы

- `src/hooks/terra/index.ts` - импорт с пакета `@terra-money/terra.js` (https://www.npmjs.com/package/@terra-money/core). Пакет обновлялся два года назад, хз как они это использют, но там нет одного из импортов, поэтому нужно опять ставить игноры

- `src/hooks/useBridgeCallback.ts` - то же игноры из-за `@terra-money/terra.js`

# Что происходит

основной конфиг: `src/config/*`

### Router (`src/pages/CrossChain/`)

- мы заполнили форму и нажимаем свап. Отображается модалка где мы подтверждаем кнопкой Confirm
- запускается функция `onSwap`, где мы выбираем тип свапа. В зависимости от типа, мы вызываем `execute` функцию у `useBridgeCallback`, `useBridgeUnderlyingCallback` или `useBridgeNativeCallback`. Эти хуки экспортируем из `src/hooks/useBridgeCallback.ts`
- в каждом из них мы вызываем какой то метод `bridgeContract`

### Bridge (`src/pages/Bridge/`)


