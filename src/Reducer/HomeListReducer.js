import { STORE_LIST,READ_LIST } from '../Constants/ListTypes';

let initialState = {
    list:[]
};

export default function homeList(state = initialState, action) {
  
    switch (action.type) {

        case STORE_LIST:
            return { ...state, list:action.payload.list }
      
        case READ_LIST:
            return {...state} 

      default:
        return state;
    }
  }