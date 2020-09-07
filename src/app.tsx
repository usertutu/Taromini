import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import models from './models';
import dva from './utils/dva';
//引入taro-ui所需的样式文件
import './utils/custom-theme.scss';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {
  config: Config = {
    pages: [
      //空白页
      'pages/whitePage/index',
      //首页*
      'pages/home/index',
      //进店码
      'pages/Code/index',
      //购物指南
      'pages/shoppingGuide/index',
      //授权界面
      'pages/authorization/index',
      //订单*
      'pages/order/index',
      //我的*
      'pages/users/index',
      //购物车
      'pages/cart/index',
      // 目录页面
      'pages/category/index',
      // 确认订单页面
      'pages/confirmOrder/index',
      //门店地址
      'pages/address/index',
      // 关于我们
      'pages/gotoUs/index',
      //优惠券
      'pages/coupons/index',
      //积分
      'pages/integral/index',
      //红包
      'pages/hongbao/index',
      //红包记录
      'pages/hongbaoRecord/index',
      //获取优惠券
      'pages/getCoupon/index',
      //绑定手机账号界面
      'pages/bindPhoneNum/index',
      //绑定手机账号界面
      'pages/bindPhoneNum/bind',
      //邀请好友
      'pages/InviteFriends/index',
      //选择优惠卷界面
      'pages/coupons/optionCoupon',
      //搜索结果界面
      'pages/searchResult/index',
      // 自提码页面
      'pages/order/pickCode/index',
      //商品详情页
      'pages/goodsDetail/index',

      //TODO:  ++添加组件需要修改的地方 2
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#04B2A9',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: false,
    },
    tabBar: {
      color: '#888',
      selectedColor: '#4FAFA8',
      list: [
        {
          pagePath: 'pages/home/index',
          text: '首页',
          iconPath: './images/home.png',
          selectedIconPath: './images/home-active.png',
        },
        {
          pagePath: 'pages/category/index',
          text: '分类',
          iconPath: './images/category.jpg',
          selectedIconPath: './images/category-active.jpg',
        },
        {
          pagePath: 'pages/cart/index',
          text: '购物车',
          iconPath: './images/cart.jpg',
          selectedIconPath: './images/cart-active.jpg',
        },
        {
          pagePath: 'pages/users/index',
          text: '我的',
          iconPath: './images/user.png',
          selectedIconPath: './images/user-active.png',
        },
      ],
    },
    navigateToMiniProgramAppIdList: ['wxbd687630cd02ce1d'],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于计算您与门店的位置。',
      },
    },
  };

  componentWillMount() {
    //更新检测
    const updateManager = Taro.getUpdateManager();

    console.log('app index updateManager', updateManager);
    console.log('app index updateManager', { updateManager });

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log('app index res', res);
      console.log('app index res.hasUpdate', res.hasUpdate);
      if (res.hasUpdate) {
        Taro.showToast({
          title: '请点击更新！',
          icon: 'loading',
          duration: 3000,
        });
      }
    });

    updateManager.onUpdateReady(function() {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    });

    console.log(
      '----------------------------------App componentWillMount this.$router.params',
      this.$router.params,
    ); // 输出 { id: 2, type: 'test' }
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    return <Provider store={store} />;
  }
}

Taro.render(<App />, document.getElementById('app'));
