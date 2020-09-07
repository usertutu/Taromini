import Taro from '@tarojs/taro';
// 检测是否登录
const checkLogin = () => {
  return new Promise(resolve => {
    try {
      const token = Taro.getStorageSync('accessToken');
      Taro.getSetting({
        success(res) {
          if (token && res.authSetting['scope.userInfo']) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
      });
    } catch (e) {
      resolve(false);
    }
  });
};
export default {
  go: async (path: string, isTab?: boolean, check?: boolean) => {
    if (check) {
      const isLogin = await checkLogin();
      if (!isLogin) {
        Taro.navigateTo({ url: '/pages/authorization/index' });
        return;
      }
    }
    if (isTab) {
      Taro.switchTab({
        url: path,
      });
    } else {
      Taro.navigateTo({
        url: path,
      });
    }
  },

  /** 计算页面总数
   * totalCount:数据总条数
   * pageSize:页面数据条数
   */
  pageCount(totalCount: number, pageSize: number) {
    const pageCount = Math.ceil(totalCount / pageSize);
    return pageCount;
  },
  checkLogin,
};
