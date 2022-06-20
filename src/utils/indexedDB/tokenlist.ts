import {
  w,
  TOKENLIST
  // isSupportIndexedDB
} from './config'

const TOKENPATH = 'token-list-table'
const POOLPATH = 'pool-list-table'
const TOKENKEY = 'chainId'


let db:any = {}
// let objectStore: any = {}
const tokenlistReauest = w.indexedDB.open(TOKENLIST, 1);
tokenlistReauest.onerror = function(event:any) {
  console.log(event)
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
tokenlistReauest.onsuccess = function(event:any) {
  db = event.target.result;
  // console.log(db)
};

tokenlistReauest.onupgradeneeded = function (event:any) {
  db = event.target.result;
  if (!db.objecttables || !db.objecttables.contains(TOKENPATH)) { //判断数据库中是否已经存在该名称的数据表
    db.createObjectStore(TOKENPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
  if (!db.objecttables || !db.objecttables.contains(POOLPATH)) { //判断数据库中是否已经存在该名称的数据表
    db.createObjectStore(POOLPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
}
db.onerror = function(event:any) {
  console.error("Database error: " + event.target.errorCode);
}

function getDBdata (path:any, key:any) {
  return new Promise(resolve => {
    if (!key || !db?.transaction) {
      resolve('')
      return
    }
    const transaction = db.transaction([path], "readwrite")
    const objectStore = transaction.objectStore(path);
    const request = objectStore.get(key.toString());
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

function setDBdata (path:any, data:any) {
  const request = db.transaction([path], 'readwrite') //readwrite表示有读写权限
    .objectStore(path)
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

export function getTokenlist (chainId:any) {
  return new Promise(resolve => {
    getDBdata(TOKENPATH, chainId).then(res => {
      resolve(res)
    })
  })
}
export function setTokenlist (chainId:any, tokenList:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    timestamp: Date.now()
  }
  setDBdata(TOKENPATH, data)
}

export function getPoollist (chainId:any) {
  return new Promise(resolve => {
    getDBdata(POOLPATH, chainId).then(res => {
      resolve(res)
    })
  })
}
export function setPoollist (chainId:any, tokenList:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    timestamp: Date.now()
  }
  setDBdata(POOLPATH, data)
}