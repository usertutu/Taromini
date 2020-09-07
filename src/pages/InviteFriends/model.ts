import Taro from '@tarojs/taro';

export default {
  namespace: 'InviteFriends',

  state: {},

  effects: {},

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
