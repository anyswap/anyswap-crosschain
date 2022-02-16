# Проблемы

- `src/hooks/terra/index.ts` - импорт с пакета `@terra-money/terra.js` (https://www.npmjs.com/package/@terra-money/core). Пакет обновлялся два года назад, хз как они это использют, но там нет одного из импортов, поэтому нужно опять ставить игноры

- `src/hooks/useBridgeCallback.ts` - то же игноры из-за `@terra-money/terra.js`

# Что происходит

### Страницы Router

`src/pages/CrossChain/index.tsx` - для начала свапа в модалке вызываем кнопку с названием `t('Confirm')`. Там куча условий где выбираем что вызвать `onWrap, onWrapNative, onWrapUnderlying`. Это переименованные функции из хуков:
`useBridgeCallback, useBridgeUnderlyingCallback, useBridgeNativeCallback`. Хуки из `src/hooks/useBridgeCallback.ts` и в каждом из них основная функция это `execute`, она то и переименовывается. Беглым взглядом в каждом из хуков мы вызываем `bridgeContract` методы с разными параметрами
