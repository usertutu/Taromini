import Taro from '@tarojs/taro';
import { getOrders } from './service';

export default {
  namespace: 'order',

  state: {
    status: [],
  },

  effects: {
    *init({payload}, { call, put }) {
      const gotOrders = yield call(getOrders);
      console.log('coupons effects gotOrders', gotOrders);

      yield put({
        type: 'save',
        payload: { list: gotOrders.list },
      });
    },

  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },


  },


};
