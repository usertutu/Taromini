import Taro from '@tarojs/taro';
import { postLogin } from './service';

export default {
  namespace: 'authorization',

  state: {
    count: 0,
  },

  effects: {
    *login({ payload }, { call, put }) {
      //从dispatch获取 name，code数据
      const { code, name, e } = payload;
      // console.log('authorization name code', code ,name);
      const currentStore = Taro.getStorageSync('currentStore');
      console.log('login currentStore', currentStore);
      //调用postLogin方法传 数据给后端
      console.log('authorization model payload', payload);

      const response = yield call(postLogin, code, name, currentStore.id);
      console.log('authorization model response', response);
      const { token } = response;

      //将获取到的 token 存入缓存
      Taro.setStorage({
        key: 'accessToken',
        data: token,
      });

      //取token
      Taro.getStorage({
        key: 'accessToken',
      }).then(res => console.log('authorization model accessToken', res.data));

      console.log('authorization e.detail.userInfo', e.detail.userInfo);

      if (e.detail.userInfo) {
        Taro.switchTab({
          url: './../home/index',
        });
      } else {
        Taro.showToast({
          title: '您取消了授权！',
          icon: 'none',
        });
      }
      yield put({
        type: 'save',
        payload: { response },
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
