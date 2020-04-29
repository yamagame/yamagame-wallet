import { combineReducers } from 'redux'
import {
  CategoryName,
  loadCategoryData,
  addDealData,
  loadAccountData, 
  saveAccountData, 
  asyncStorage,
} from './localstore'

export const fontSize = (payload) => {
  var size = (payload.width < payload.height) ? payload.width : payload.height;
  return parseInt(size*0.8/10, 10);
}

export const fontScale = (size) => {
  if (window.innerWidth > window.innerHeight) {
    return size;
  }
  return size*window.devicePixelRatio/2;
}

const initialState = {
  debit: { category: 'Expenses', name: '食費' },
  credit: { category: 'Assets', name: '現金' },
  comment: '',
  value: '',
}

export const types = {
  PARAMS: 'PARAMS',
  LAYOUT: 'LAYOUT',
}

const setValues = (state = {}, action) => {
  if (action.type === types.PARAMS) {
    return {
      ...state,
      ...action.payload,
    }
  }
  if (action.type === types.LAYOUT) {
    return {
      ...state,
      ...action.payload,
    }
  }
  return state;
}

export const accountApp = combineReducers({
  app: setValues,
})

export const loadInitialData = (params) => async (dispatch, getState) => {
  const payload = {
    ...initialState,
    ...params,
    width: window.innerWidth,
    height: window.innerHeight,
  }
  payload.fontSize = fontSize(payload);
  payload.category = {};
  payload.loading = false;
  await Promise.all(Object.keys(initialState).map(async (key) => {
    payload[key] = await asyncStorage.getItem(key, payload[key]);
  }));
  dispatch({
    type: types.PARAMS,
    payload,
  });
}

export const changeLayout = (payload) => async (dispatch, getState) => {
  dispatch({
    type: types.LAYOUT,
    payload: {
      ...payload,
      fontSize: fontSize(payload),
    },
  });
}

export const setParams = (payload, callback) => async (dispatch, getState) => {
  await Promise.all(Object.keys(payload).map(async (key) => {
    await asyncStorage.setItem(key, payload[key]);
  }));
  dispatch({
    type: types.PARAMS,
    payload,
  });
  if (callback) callback();
}

export const loadCategory = (category, callback) => async (dispatch, getState) => {
  loadCategoryData(category, (data) => {
    const payload = {
      category: {},
    }
    payload.category[category] = data;
    dispatch({
      type: types.PARAMS,
      payload,
    });
    if (callback) callback();
  });
}

export const loadAccount = (filter, callback) => async (dispatch, getState) => {
  loadAccountData(filter, (data) => {
    const payload = {
      account: data,
    }
    dispatch({
      type: types.PARAMS,
      payload,
    });
    if (callback) callback(data);
  });
}

export const saveAccount = (jsonData, callback) => async (dispatch, getState) => {
  await saveAccountData(jsonData, callback);
}

export const addDeal = (deal, callback) => async (dispatch, getState) => {
  console.log(deal);
  addDealData(deal, () => {
    dispatch({
      type: types.PARAMS,
      payload: {},
    });
    if (callback) callback();
  });
}

export const startLoading = (callback) => async (dispatch, getState) => {
  dispatch({
    type: types.PARAMS,
    payload: {
      loading: true,
    },
  });
  if (callback) callback();
}

export const stopLoading = (callback) => async (dispatch, getState) => {
  dispatch({
    type: types.PARAMS,
    payload: {
      loading: false,
    },
  });
  if (callback) callback();
}
