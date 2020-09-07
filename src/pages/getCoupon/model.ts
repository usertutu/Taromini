import Taro from '@tarojs/taro';
import { getCoupons, postGain, getUserInfo, getUserCoupons} from './service';


export default {
  
  namespace: 'getCoupon',

  state: {},

  effects: {
    *init({payload}, { call, put }) {
      
      const gotCoupons = yield call(getCoupons);
      console.log('getCoupon model mayGotCoupons', gotCoupons);
      
      yield put({
        type: 'save',
        payload: gotCoupons,
      });
    },

    *gain({payload}, { call, put }){
      const  { activityID, couponID } = payload
      console.log('getCoupon model activityID, couponID',activityID, couponID);
      
      const gainResponse = yield call(postGain, activityID, couponID)
      console.log('getCoupon model gainResponse', gainResponse);
      
      yield put({
        type: 'save',
        payload: { gainResponse },
      });
      
    },

    * getUser({psyload}, {call, put}){
      const userInfo = yield call(getUserInfo);
      console.log('getCoupon model --- response', userInfo);
      
      yield put({
        type: 'save',
        payload: userInfo
      })
    },

    *getUserCoupons(action, {call, put}){
      console.log('getCoupon model getUserCoupons start');
      
      const userCoupons = yield call(getUserCoupons)
      console.log('getCoupon model getUserCoupons userCoupons', userCoupons);
      yield put({
        type: 'save',
        payload: userCoupons,
      });
    }
   
  },


  reducers: {
    //保存传来的数据，为了保存之前的数据，所以将state一起传入
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
