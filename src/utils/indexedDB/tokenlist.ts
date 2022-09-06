import {
  w,
  TOKENLIST
  // isSupportIndexedDB
} from './config'

const TOKENPATH = 'token-list-table'
const POOLPATH = 'pool-list-table'
const NFTPATH = 'nft-list-table'
const TOKENKEY = 'chainId'

// const READWRITE = 'versionchange'
const READWRITE = 'readwrite'


let db:any = {}
// let objectStore: any = {}
const tokenlistReauest = w.indexedDB.open(TOKENLIST, 11);
// console.log(tokenlistReauest)
tokenlistReauest.onerror = function(event:any) {
  console.log(event)
  console.log("Why didn't you allow my web app to use IndexedDB?!");
};
tokenlistReauest.onsuccess = function(event:any) {
  // console.log(event)
  db = event.target.result;
};

tokenlistReauest.onupgradeneeded = function (event:any) {
  db = event.target.result;
  // console.log(db)
  // console.log(db.objecttables)
  // console.log(db.objectStoreNames)
  const dbTableList:any = {}
  // console.log(db.objecttables.contains(TOKENPATH))
  if (db?.objectStoreNames) {
    for (const key in db?.objectStoreNames) {
      const val = db?.objectStoreNames[key]
      // console.log(key)
      if (val === TOKENPATH) {
        dbTableList[TOKENPATH] = 1
      }
      if (val === POOLPATH) {
        dbTableList[POOLPATH] = 1
      }
      if (val === NFTPATH) {
        dbTableList[NFTPATH] = 1
      }
    }
  }
  if (!dbTableList[TOKENPATH]) { //判断数据库中是否已经存在该名称的数据表
    db.createObjectStore(TOKENPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
  if (!dbTableList[POOLPATH]) { //判断数据库中是否已经存在该名称的数据表
    db.createObjectStore(POOLPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
  if (!dbTableList[NFTPATH]) { //判断数据库中是否已经存在该名称的数据表
    db.createObjectStore(NFTPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  }
  // if (!db.objecttables || !db.objecttables.contains(TOKENPATH)) { //判断数据库中是否已经存在该名称的数据表
  //   db.createObjectStore(TOKENPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  // }
  // if (!db.objecttables || !db.objecttables.contains(POOLPATH)) { //判断数据库中是否已经存在该名称的数据表
  //   db.createObjectStore(POOLPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  // }
  // if (!db.objecttables || !db.objecttables.contains(NFTPATH)) { //判断数据库中是否已经存在该名称的数据表
  //   db.createObjectStore(NFTPATH, { keyPath: TOKENKEY }).createIndex(TOKENKEY, TOKENKEY, { unique: true });
  // }
}
db.onerror = function(event:any) {
  console.error("Database error: " + event.target.errorCode);
}

tokenlistReauest.addEventListener('success', (event:any) => {
  const db = event.target.result;
  db.addEventListener('versionchange', (event:any) => {
    console.log(event)
    console.log('The version of this database has changed');
  });
});

function getDBdata (path:any, key:any) {
  return new Promise(resolve => {
    if (!key || !db?.transaction) {
      resolve('LOADING')
      return
    }
    try {
      // const transaction = db.transaction([path], "readwrite")
      const transaction = db.transaction([TOKENPATH, POOLPATH, NFTPATH], READWRITE)
      const objectStore = transaction.objectStore(path);
      const request = objectStore.get(key.toString());
      request.onerror = function(event:any) {
        console.log(event)
        // Handle errors!
        resolve('ERROR')
      };
      request.onsuccess = function(event:any) {
        // Do something with the request.result!
        const data = event.target.result
        resolve(data)
      }
    } catch (error) {
      console.log(path)
      console.log(error)
      resolve('ERROR')
    }
  })
}

function setDBdata (path:any, data:any) {
  
  return new Promise(resolve => {
    if (!db?.transaction) {
      console.log(333)
      // console.log(key)
      console.log(db)
      console.log(db?.transaction)
      resolve('LOADING')
      return
    }
    const request = db.transaction([TOKENPATH, POOLPATH, NFTPATH], READWRITE) //readwrite表示有读写权限
      .objectStore(path)
      // .add(data) //新增数据
      .put(data) //更新数据
    request.onsuccess = function () {
      // console.log(event);
      console.log(path + '数据写入成功');
      resolve('Success')
    };
    request.onerror = function (event:any) {
      console.log(event);
      console.log(path + '数据写入失败');
      resolve('Error')
    }
  })
}

export function getTokenlist (chainId:any) {
  return new Promise(resolve => {
    getDBdata(TOKENPATH, chainId).then(res => {
      // console.log(res)
      resolve(res)
    })
  })
}
export function setTokenlist (chainId:any, tokenList:any, version:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    version,
    timestamp: Date.now()
  }
  setDBdata(TOKENPATH, data)
}

export function getPoollist (chainId:any) {
  return new Promise(resolve => {
    // console.log(chainId)
    getDBdata(POOLPATH, chainId).then(res => {
      resolve(res)
    })
  })
}
export function setPoollist (chainId:any, tokenList:any, version:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    version,
    timestamp: Date.now()
  }
  setDBdata(POOLPATH, data)
}

export function getNftlist (chainId:any) {
  return new Promise(resolve => {
    // console.log(chainId)
    getDBdata(NFTPATH, chainId).then(res => {
      resolve(res)
    })
  })
}
export function setNftlist (chainId:any, tokenList:any, version:any) {
  const data = {
    chainId: chainId.toString(),
    tokenList,
    version,
    timestamp: Date.now()
  }
  setDBdata(NFTPATH, data)
}
