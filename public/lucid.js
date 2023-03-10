import { Lucid, Blockfrost, Data } from "https://unpkg.com/lucid-cardano@0.9.4/web/mod.js"
// https://github.com/spacebudz/lucid
async function lucid() {
    // testnet
    // const lucid = await Lucid.new(
    //     new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewernfU9eH3ThnjBHP4TMeFmlb4tuM4BIZ"),
    //     "Preview",
    // );

    const lucid = await Lucid.new(
        new Blockfrost("https://cardano-mainnet.blockfrost.io/api/v0/", "mainnet14x6BHJn5rIuSOwGZL8m70MzqPyA5XUV")
    );
    try {
        const api = await window.cardano.eternl.enable();
        
        lucid.selectWallet(api);
        window.lucid = lucid;
        window.lucid.data = Data;
    } catch (error) {
        console.log(3)
        console.log(error)
    }
    
}
if(window.cardano && window.cardano.eternl) {
    lucid();
}
