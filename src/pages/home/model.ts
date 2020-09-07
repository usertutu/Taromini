import Taro from '@tarojs/taro';
import {
  bindFaceToken,
  getBanners,
  getNews,
  getOpenDoor,
  getUserInfo,
} from './service';
import { getStoreInfoMessage } from '../users/service';
import CategoryService from '../category/service';
export default {
  namespace: 'home',

  state: {
    count: 0,
  },

  effects: {
    *init(action, { call, put, select }) {
      const faceToken = yield select(state => state.common.faceToken);
      if (faceToken) {
        const response = yield call(bindFaceToken, faceToken);
        console.log('response', response);
      }

      const banners = yield call(getBanners);
      console.log('home model banners', banners);

      const news = yield call(getNews);
      console.log('home model News', news);
      let currentStore = Taro.getStorageSync('currentStore');
      if (!currentStore) {
        const allStore = yield call(getStoreInfoMessage);
        currentStore = allStore.list[0];
        Taro.setStorageSync('currentStore', currentStore);
      }
      const categories = yield CategoryService.getCategories({
        pageSize: 10,
        currentPage: 1,
        storeId: currentStore.id,
      });
      const recommendationList = yield CategoryService.getCategoryItem({
        pageSize: 10,
        currentPage: 1,
        storeId: currentStore.id,
        recommend: 'true', // 推荐
      });
      console.log('home init categories', categories);
      //使用 put 调用reducers中的 save 方法将数据存到 state 中
      yield put({
        type: 'save',
        payload: {
          banners,
          news,
          currentStore,
          categories: categories.list,
          recommendationList: recommendationList.list,
        },
      });
    },

    *open({ payload }, { call }) {
      console.log('home model open 被调用');
      const { id, timestamp, hash } = payload;
      console.log('home model open id:', id);
      console.log('home model open timestamp:', timestamp);
      console.log('home model open hash:', hash);
      try {
        const userInfo = yield call(getUserInfo);
        console.log('home model open userInfo', userInfo);
        const userID = userInfo.id;
        const response = yield call(getOpenDoor, id, timestamp, hash, userID);
        if (response.errCode == 54001) {
          Taro.showToast({
            title: response.errMsg,
            icon: 'none',
            duration: 2000,
          });
          return;
        }
        Taro.showToast({
          title: '开门中,请稍等!',
          icon: 'success',
          duration: 2000,
        });
        console.log('model open response', response);
      } catch (e) {
        Taro.showToast({
          title: '未成功开门,请您重新扫码!',
          icon: 'none',
          duration: 2000,
        });
      }
    },

    *getUser({ payload }, { call, put }) {
      const userInfo = yield call(getUserInfo);
      console.log('home model --- response', userInfo);

      yield put({
        type: 'save',
        payload: { userInfo },
      });
    },
  },

  //只有reducers才能修改 state 中的值，所以需要使用put来调用这里的方法
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
