import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

import couponSlogan from './../../images/couponSlogan.png';
import couponLogo from './../../images/couponLogo.png';

//引入时间插件
var moment = require('moment');
moment.locale('zh-cn');

interface IGetCoupon {
  gotCoupons: any;
  gainResponse: any;
  userCoupons: [];
  coupons: any;
  list: any;
}

interface IProps {
  dispatch?: any;
  getCoupon: IGetCoupon;
}

@connect(({ getCoupon }) => ({ getCoupon }))
export default class getCoupon extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '获取优惠券',
  };

  state: {
    current: number;
    status: any;
  } = {
    current: 0,
    status: 'useable',
  };

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'getCoupon/init',
      payload: this.state.status,
    });

    dispatch({
      type: 'getCoupon/getUser',
    });

    dispatch({
      type: 'getCoupon/getUserCoupons'
    })
  }

  componentDidMount() {}

  //跳转优惠券
  gotoCoupon() {
    Taro.navigateTo({
      url: './../coupons/index',
    });
  }

  //价格换算
  price(value) {
    let num = value / 100;
    let price = num.toFixed(2);
    return price;
  }

  //价格换算：无小数
  count(value) {
    let num = value / 100;
    return num;
  }

  //跳转-绑定手机号
  gotoBindPhone() {
    Taro.navigateTo({
      url: './../bindPhoneNum/index',
    });
  }

  noPhoneGet() {
    Taro.showToast({
      title: '小伙伴，请先绑定手机号！',
      icon: 'none',
      duration: 1000,
    });
  }

  //领取优惠券
  //TODO:异步执行方法
  //在点击事件上写 async 标志着 这个点击事件为异步的， 只有写了async才能在点击事件中添加await
  async gainCoupon(couponID) {
    console.log('getCoupon index couponID', couponID);
    let activityID = 1;
    const { dispatch } = this.props;

    //await 在此等待这个dispatch方法执行， 等到dispatch执行完成后， 再往下执行
    await dispatch({
      type: 'getCoupon/gain',
      payload: { couponID, activityID },
    });

    const gainResponse = this.props.getCoupon;
    console.log('getCoupon index gainResponse', gainResponse);
    console.log('getCoupon index gainResponse', gainResponse.gainResponse);

    let code = gainResponse.gainResponse.code;
    let msg = gainResponse.gainResponse.msg;
    console.log('getCoupon index code msg', code, msg);

    if (code) {
      Taro.showToast({
        title: msg,
        icon: 'success',
        duration: 1000,
      });
    } else {
      Taro.showToast({
        title: msg,
        icon: 'none',
        duration: 1000,
      });
    }
  }

  render() {
    const mayGotCoupon = this.props.getCoupon;
    const activityCoupon = mayGotCoupon.coupons;
    console.log('getCoupon index render activityCoupon', activityCoupon);
    // console.log('getCoupon index mayGotCoupon.length', mayGotCoupon.length);

    const userInfo = this.props.getCoupon;
    console.log('getCoupon index userInfo', userInfo);

    const userCoupons = this.props.getCoupon
    const userAllCoupons = userCoupons.list;
    console.log('getCoupon index render userAllCoupons', userAllCoupons);
    // console.log('getCoupon index userCoupons.length', userCoupons.length);

    const userInfoPhone = userInfo['phone.number'];
    console.log('getCoupon index userInfoPhone', userInfoPhone);


    return (
      <View className="index">
        {!(userAllCoupons.length == activityCoupon.length) ? (
          //{/* 有优惠券显示的界面 */}
          <View className="main">
            {/* 整个优惠券列表 */}
            <View className="couponsList">
              {activityCoupon.map((item, index) => (
                //  {/* 每条优惠卷 */}
                <View>
                  {userAllCoupons.findIndex(currentValue => {
                    console.log('currentValue', currentValue);
                    console.log('item.id', item.id);

                    return currentValue.couponId == item.id;
                  }) == -1 ? (
                    <View className="coupon" key={'coupon' + index}>
                      {/* 左侧优惠卷金额 */}
                      <View className="couponPrice">
                        <View className="price">
                          ¥
                          <View className="money">
                            {this.count(item.amount)}
                          </View>
                        </View>

                        <View className="text">抵扣券</View>
                      </View>

                      {/* 右侧优惠券详细信息 */}
                      <View className="couponsInfo">
                        <View className="info">
                          <View className="couponGuide">
                            <View className="price">
                              ¥
                              <View className="money">
                                {this.count(item.require)}
                              </View>
                              <View className="guide">
                                满{this.count(item.require)}减
                                {this.count(item.amount)}
                              </View>
                              <View className="text">店铺优惠券</View>
                            </View>
                          </View>

                          {userInfoPhone == null ? (
                            <View
                              className="couponGet"
                              onClick={this.noPhoneGet}
                            >
                              立即领取
                            </View>
                          ) : (
                            <View
                              className="couponGet"
                              onClick={this.gainCoupon.bind(this, item.id)}
                            >
                              立即领取
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            <View className="gotoCoupon" onClick={this.gotoCoupon}>
              查看我的优惠券 》
            </View>
          </View>
        ) : (
          //没有优惠券显示的界面
          <View className="noCoupon">
            <View className="couponlogo">
              <Image src={couponLogo} />
              <View className="text">暂时还没有优惠券</View>
            </View>
            <View className="gotoCoupon" onClick={this.gotoCoupon}>
              查看我的优惠券 》
            </View>
          </View>
        )}
      </View>
    );
  }
}
