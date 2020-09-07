import {
  Button,
  View,
  Text,
  Image,
  Navigator,
  OpenData,
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import { apiOrigin } from './../../config/index';
import { getStoreInfo } from './service';

import NeedLogin from '../../components/NeedLogin';
import iconPhone from './../../images/icon-phone.png';
import advertisingPic from '../../images/advertising.jpeg';
import iconShop from './../../images/icon-shop.png';
import iconUs from './../../images/icon-us.png';
import iconKefu from './../../images/icon-kefu.png';
import iconNum from './../../images/icon-phonenum.png';
import iconRight from './../../images/icon-right.png';
import iconCoupon from './../../images/iconCoupon.png';
import iconIntegral from './../../images/iconIntegral.png';
import iconhongbao from './../../images/hongbao.png';
import since from './img/since.png';
import ziTi from './img/ziTi.png';
import zhiGou from './img/zhiGou.png';
import done from './img/done.png';
//引入新闻前缀URL
// import { newsOrigin } from './../../config/index';

interface IHome {
  count: number;
  userInfo;
}

interface IProps {
  dispatch?: any;
  users: IHome;
}

@connect(({ users }) => ({ users }))
export default class Users extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '我的',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    backgroundColor: '#eeeeee', //下拉背景颜色
  };

  state: { phone: any; loginState: boolean } = {
    phone: '-',
    loginState: false,
  };
  constructor(...args) {
    super(...args);
  }
  async componentWillMount() {
    const resultToken = Taro.getStorageSync('accessToken');
    if (resultToken) {
      console.log('user componentWillMount resultToken 1');
      this.setState({
        loginState: true,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'users/init',
      });
    }
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }

  async componentDidMount() {
    let result = await getStoreInfo();
    console.log('componentDidMount result', result.list[0].phone);
    this.setState({
      phone: result.list[0].phone ? result.list[0].phone : '-',
    });
  }

  async componentDidShow() {
    const resultToken = await Taro.getStorageSync('accessToken');
    if (resultToken) {
      const { dispatch } = this.props;
      dispatch({
        type: 'users/init',
      });
      this.setState({
        loginState: true,
      });
    }
  }

  //监听下拉刷新事件
  onPullDownRefresh() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/init',
    });

    setTimeout(function () {
      Taro.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  }

  //跳转-门店地址
  gotoaddress() {
    Taro.navigateTo({
      url: './../address/index',
    });
  }

  //跳转-绑定手机号
  gotoBindPhone() {
    Taro.navigateTo({
      url: './../bindPhoneNum/index',
    });
  }

  //跳转-购物指南
  gotoGuide() {
    Taro.navigateTo({
      url: '/pages/shoppingGuide/index',
    });
  }

  //跳转-关于我们
  gotoWeb(src) {
    console.log('home index --- id', src);

    let url2 = apiOrigin;
    console.log('user url2', url2);

    let url = 'https://api.hetuntech.cn/abouts/1';
    console.log('home index --- url', url);

    Taro.navigateTo({
      url: `./../gotoUs/index?url=${url}`,
    });
  }

  //拨打电话
  call() {
    if (this.state.phone === '-') {
      Taro.showModal({
        title: '未设置',
        content: '暂未设置联系电话',
        success(res) {
          if (res.confirm) {
          }
        },
      });
    } else {
      Taro.makePhoneCall({
        phoneNumber: this.state.phone,
      });
    }
  }

  //跳转优惠券
  gotoCoupon() {
    Taro.navigateTo({
      url: './../coupons/index',
    });
  }

  //跳转-开通免密支付
  gotoIntegral() {
    Taro.navigateTo({
      url: './../integral/index',
    });
  }

  //跳转-红包
  gotoHongbao() {
    Taro.navigateTo({
      url: './../hongbao/index',
    });
  }
  // 选择地址
  async choseAddress() {
    const address = await Taro.chooseAddress();
    console.log('address', address);
  }
  render() {
    const {
      dispatch,
      users: { count },
    } = this.props;
    let userInfo;
    let content;
    if (this.props.users) {
      userInfo = this.props.users;

      if (userInfo['phone.number'] == null) {
        content = (
          <View className="userNumber" onClick={this.gotoBindPhone}>
            <Image src={iconPhone} />
            立即绑定
          </View>
        );
      } else {
        content = (
          <View className="userNumber phone" onClick={this.gotoBindPhone}>
            绑定手机号:{userInfo['phone.number']}
          </View>
        );
      }
    }

    const orders = [
      {
        title: '已完成',
        icon: done,
        current: 4,
      },
      {
        title: '店内直购',
        icon: zhiGou,
        current: 1,
      },
      {
        title: '上门配送',
        icon: since,
        current: 3,
      },
      {
        title: '店内自提',
        icon: ziTi,
        current: 2,
      },
    ];

    return (
      <View className="index">
        {this.state.loginState ? (
          <View className="main">
            {/* 用户信息 */}
            <View className="userInfo">
              <View className="userPic">
                <View className="pic">
                  <OpenData type="userAvatarUrl" />
                </View>
              </View>

              <View className="userMsg">
                <View className="userName">
                  <OpenData type="userNickName" />
                </View>

                {/* 判断显示手机号还是显示立即绑定 */}
                {content}
              </View>
            </View>

            {/* 广告位 */}
            {/* <View className="show" onClick={this.gotoGuide}>
              <Image src={advertisingPic} />
            </View> */}
            {/* 订单 */}
            <View className="order">
              <View className="title">
                <View className="left_tip">我的订单</View>
                <View
                  className="right_tip"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/order/index?current=0`,
                    });
                  }}
                >
                  查看全部订单
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>
              <View className="classification">
                {orders.map((item) => {
                  return (
                    <View
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/order/index?current=${item.current}`,
                        });
                      }}
                    >
                      <Image src={item.icon}></Image>
                      <View className="title">{item.title}</View>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* 我的服务 */}
            <View className="myServe">
              <View className="dt">我的服务</View>

              {/* FIXME: 红包活动-用户个人页 */}
              <View className="dd" onClick={this.gotoHongbao}>
                <Image src={iconhongbao} />
                我的红包
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>
              <View className="dd" onClick={this.choseAddress}>
                <Image src={iconShop} />
                收货地址
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>
              <View className="dd" onClick={this.gotoCoupon}>
                <Image src={iconCoupon} />
                我的优惠券
                <View className="serveR">
                  {userInfo.userCoupons.length ? (
                    <View className="text" style="color: black">
                      共
                      <Text style="color: red; margin-right: 8px;">
                        {userInfo.userCoupons.length}
                      </Text>
                      张可用
                    </View>
                  ) : (
                    <View className="text" style="color: black">
                      共 <Text style="color: red; margin-right: 8px;">0</Text>
                      张可用
                    </View>
                  )}
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>

              <View className="dd" onClick={this.gotoIntegral}>
                <Image src={iconIntegral} />
                我的积分
                <View className="serveR">
                  {userInfo.point ? (
                    <View className="text">
                      <Text style="margin-right: 8px;">
                        {userInfo.point / 100}
                      </Text>
                      分
                    </View>
                  ) : (
                    <View className="text">
                      <Text style="margin-right: 8px;">0</Text>分
                    </View>
                  )}

                  <Image src={iconRight} className="iconR" />
                </View>
              </View>

              {/* <View className="dd" onClick={this.gotoaddress}>
                <Image src={iconShop} />
                门店地址
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </View> */}

              {/* TODO: 关于我们 */}
              <View className="dd" onClick={this.gotoWeb}>
                <Image src={iconUs} />
                关于我们
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>

              <Button openType="contact" className="dd" hover-class="none">
                <Image src={iconKefu} />
                联系客服
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </Button>

              <View className="dd" onClick={this.call}>
                <Image src={iconNum} />
                联系电话
                <View className="num">{this.state.phone}</View>
                <View className="serveR">
                  <Image src={iconRight} className="iconR" />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <NeedLogin />
        )}
      </View>
    );
  }
}
