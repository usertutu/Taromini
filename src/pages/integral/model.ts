import Taro from '@tarojs/taro';
import { getUserInfo } from './service';


export default {
  
  namespace: 'integral',

  state: {},

  effects: {
    * init({psyload}, {call, put}){
      const userInfo = yield call(getUserInfo);
      console.log('users model --- response', userInfo);
      
      yield put({
        type: 'save',
        payload: userInfo
      })
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
