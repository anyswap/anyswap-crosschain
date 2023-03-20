import { Lucid, Blockfrost, Data } from "https://unpkg.com/lucid-cardano@0.9.4/web/mod.js"
// https://github.com/spacebudz/lucid
async function lucid() {
    // testnet
    // const lucid = await Lucid.new(
    //     new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "preview9uMuq0VQk9n6lJkqGUWPo2t5PsRvqFfu"),
    //     "Preview",
    // );

    const lucid = await Lucid.new(
        new Blockfrost("https://cardano-mainnet.blockfrost.io/api/v0/", "mainnet14x6BHJn5rIuSOwGZL8m70MzqPyA5XUV")
    );
    try {
        window.lucid = lucid;
        window.lucid.data = Data;
        if(localStorage.getItem("lucid") === "true") {
            const api = await window.cardano.eternl.enable();
            window.lucid.selectWallet(api);
        }
    } catch (error) {
        console.log(error)
    }
    
}
if(window.cardano && window.cardano.eternl) {
    lucid();
}
