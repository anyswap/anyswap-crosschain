import {
  w,
  POOLLIST
  // isSupportIndexedDB
} from './config'

const POOLPATH = 'pool-list-table'
const TOKENKEY = 'chainId'


let db:any = {}
// let objectStore: any = {}
const tokenlistReauest = w.indexedDB.open(POOLLIST, 1);
tokenlistReauest.onerror = function(event:any) {
  console.log(event)
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
tokenlistReauest.onsuccess = function(event:any) {
  db = event.target.result;
  console.log(db)
};
tokenlistReauest.onupgradeneeded = function (event:any) {
  db = event.target.result;
  if (!db.objecttables || !db.objecttables.contains(POOLPATH)) { //判断数据库中是否已经存在该名称的数据表
  db.createObjectStore(POOLPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
}
db.onerror = function(event:any) {
  console.error("Database error: " + event.target.errorCode);
}

export function getPoollist (chainId:any) {
  return new Promise(resolve => {
    if (!chainId) {
      resolve('')
      return
    }
    const transaction = db.transaction([POOLPATH], "readwrite")
    const objectStore = transaction.objectStore(POOLPATH);
    const request = objectStore.get(chainId.toString());
    request.onerror = function(event:any) {
      console.log(event)
      // Handle errors!
      resolve('')
    };
    request.onsuccess = function(event:any) {
      // Do something with the request.result!
      const data = event.target.result 
      // console.log(data)
      resolve(data)
      // console.log("Name for SSN 444-44-4444 is " + request.result.name);
    }
  })
}
export function setPoollist (chainId:any, tokenList:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    timestamp: Date.now()
  }
  const request = db.transaction([POOLPATH], 'readwrite') //readwrite表示有读写权限
    .objectStore(POOLPATH)
    // .add(data) //新增数据
    .put(data) //更新数据
  request.onsuccess = function (event:any) {
    console.log(event);
    console.log('数据写入成功');
  };
  request.onerror = function (event:any) {
    console.log(event);
    console.log('数据写入失败');
  }
}