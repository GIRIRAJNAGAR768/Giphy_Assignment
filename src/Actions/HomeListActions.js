import { STORE_LIST,READ_LIST } from '../Constants/ListTypes';

export let storeDataListAction = (payload)=>{
    return {
        type: STORE_LIST,
        payload
      }
}

export let readDataListAction = (payload)=>{
  return {
      type: READ_LIST,
      payload
    }
}