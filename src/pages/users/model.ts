import { getUserInfo } from './service'

export default {
  namespace: 'users',

  state: {
    count: 0,
  },

  effects:{
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
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};
