import { Lucid, Blockfrost, Data } from "https://unpkg.com/lucid-cardano@0.9.4/web/mod.js"
// https://github.com/spacebudz/lucid
async function lucid() {
    const lucid = await Lucid.new(
        new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewernfU9eH3ThnjBHP4TMeFmlb4tuM4BIZ"),
        "Preview",
    );
    
    const api = await window.cardano.eternl.enable();
    lucid.selectWallet(api);
    window.lucid = lucid;
    window.lucid.data = Data;
}
if(window.cardano && window.cardano.eternl) {
    lucid();
}
