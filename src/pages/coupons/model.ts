import Taro from '@tarojs/taro';
import { getCoupons } from './service';

export default {
  namespace: 'coupons',

  state: { couponInfo: {} },

  effects: {
    *init({ payload }, { call, put }) {
      const status = payload;
      console.log('coupons model status --- :', status);

      const gotCoupons = yield call(getCoupons, status);
      console.log('coupons model gotCoupons', gotCoupons);

      yield put({
        type: 'save',
        payload: { list: gotCoupons.list },
      });
    },

    *saveCouponID({ payload }, { put }) {
      console.log('saveCouponID 触发');
      const { coupon } = payload;
      console.log('coupons model saceCouponID id', coupon);
      yield put({
        type: 'save',
        payload: { couponInfo: coupon },
      });
    },
  },

  reducers: {
    //保存传来的数据，为了保存之前的数据，所以将state一起传入
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    delectCoupon(state, { payload }) {
      console.log('coupons model couponInfo 被调用');
      const { couponInfo } = state;
      console.log('coupons model couponInfo', couponInfo);
      const newState = {
        ...state,
        couponInfo: null,
      };
      return newState;
    },
  },
};
