// firebase/database.ts

import {
  ref,
  set,
  push,
  get,
  update,
  remove,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import { database } from "./config";


// ===============================
// Create Data
// ===============================

export async function createData(
  path: string,
  data: any
) {
  const dataRef = ref(database, path);

  await set(dataRef, data);
}


// ===============================
// Add Data With Auto ID
// ===============================

export async function addData(
  path: string,
  data: any
) {
  const dataRef = push(
    ref(database, path)
  );

  await set(dataRef, {
    id: dataRef.key,
    ...data,
  });


  return dataRef.key;
}


// ===============================
// Get Single Data
// ===============================

export async function getData(
  path: string
) {
  const dataRef = ref(database, path);

  const snapshot = await get(dataRef);


  if (snapshot.exists()) {
    return snapshot.val();
  }


  return null;
}


// ===============================
// Update Data
// ===============================

export async function updateData(
  path: string,
  data: any
) {
  const dataRef = ref(database, path);

  await update(dataRef, data);
}


// ===============================
// Delete Data
// ===============================

export async function deleteData(
  path: string
) {
  const dataRef = ref(database, path);

  await remove(dataRef);
}


// ===============================
// Listen For Real-time Changes
// ===============================

export function listenToData(
  path: string,
  callback: (data: any) => void
) {
  const dataRef = ref(database, path);


  const unsubscribe = onValue(
    dataRef,
    (snapshot) => {

      if(snapshot.exists()){
        callback(snapshot.val());
      }else{
        callback(null);
      }

    }
  );


  return unsubscribe;
}


// ===============================
// Query Data
// ===============================

export async function queryData(
  path: string,
  child: string,
  value: string
) {

  const dataQuery = query(
    ref(database, path),
    orderByChild(child),
    equalTo(value)
  );


  const snapshot = await get(dataQuery);


  if(snapshot.exists()){
    return snapshot.val();
  }


  return null;
}