The commit in anyswap-crosschain repo - https://github.com/noxonsu/anyswap-crosschain/pull/35/commits/65600f285bfab781737e70d7fbf77f183f8eb979

To add new EVM-like Network we need to add: 
- Add logo to the follow path `src/assets/coin/source/<NETWORK_NATIVE_COIN_SYMBOL_UPPER_CASE>.png`
- Add network config to to the follow path `src/config/chainConfig/<network_short_name>.js`:
    - Just copy paste config from `src/config/chainConfig/nsc.js` and fill new networks data;
    - There are also required to deploy (or to fill, if you already have these) in new network the `wrappedToken` and the `multicalToken` smart contracts. For instance: [`wrappedToken` from BSC](https://bscscan.com/address/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c#code) and [`multicalToken` from ethereum](https://etherscan.io/address/0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696#code);
    - Check and fill the following props: `lookHash`, `lookAddr`, `lookBlock`. The routes can be different depending on a network explorer.

The commit in crosschain-router repo - https://github.com/noxonsu/CrossChain-Router/commit/7ff3800404fde7ae287e0b00895ec64068b68a7e

- Add similar network data to the `build/bin/config.toml` in two places: `[Gateways]` and `[GatewaysExt]`;
- Make commit and merge it;
- Update your crosschain-router server.

Testing:
- Add test token to your test config via anyswap-crosschain admin panel;
- Restart your crosschain-router server;
- Add some tokens to the pool of test token from new network;
- Make swaps between new network <> other.
