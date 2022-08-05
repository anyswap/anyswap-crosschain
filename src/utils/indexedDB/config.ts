
// In the following line, you should include the prefixes of implementations you want to test.
// const window = window
const w:any = {}
w.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
w.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
w.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
// const isSupportIndexedDB = false
let isSupportIndexedDB = true
if (!w.indexedDB) {
  isSupportIndexedDB = false
}

const TOKENLIST = 'token-list'
const POOLLIST = 'pool-list'

export {
  w,
  isSupportIndexedDB,
  TOKENLIST,
  POOLLIST
}
