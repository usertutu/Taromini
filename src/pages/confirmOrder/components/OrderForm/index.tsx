import Taro from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Goods from '../Goods/index';
import iconR from '../../../../images/icon-right.png';
import { AtButton } from 'taro-ui';
import currencyFormatter from 'currency-format-tool';
import moment from 'moment';
import qqMapWX from '../../../../utils/QQMapWx';
import './index.less';
interface ICoupons {
  gotCoupons: any;
  list: any;
  couponInfo: any;
}

interface ICommon {
  cartItems: any;
  cartChecked: any;
}

interface IOrder {
  list: [];
  status: any;
  allPriceStr: any;
  carGoodsList: any;
}

interface IProps {
  tabsHeight: number; // 页面高度
  type: string; // 支付类型
  dispatch?: any;
  order?: IOrder;
  common?: ICommon;
  coupons?: ICoupons;
  home?: any;
}
interface IState {
  cartItems: any; //商品信息
  address: any; // 收货地址
  storeInfo: any; // 门店地址
}

// @ts-ignore
@connect(({ order, common, coupons, home }) => ({
  order,
  common,
  coupons,
  home,
}))
export default class OrderForm extends Taro.Component<IProps, IState> {
  constructor() {
    super(...arguments);
    this.state = {
      cartItems: [],
      address: '',
      storeInfo: {},
    };
  }
  async componentWillMount() {
    console.log('common this.props', this.props);
    const { cartItems } = this.props.common as any;
    // const userInfo = await getUserInfo();
    // console.log('用户信息---：', userInfo);
    // const storeInfo = await getStoreInfo(userInfo.storeId);
    // console.log('userInfo', storeInfo);
    const items = cartItems.filter(cartItem => cartItem.checked);
    this.setState({
      cartItems: items,
      // storeInfo: storeInfo.list[0],
    });
    // console.log('cartItems', JSON.stringify(cartItems));
  }
  //跳转-选择优惠券
  gotoOptionCoupon() {
    Taro.navigateTo({
      url: '../coupons/optionCoupon',
    });
  }

  // 获取用户地址坐标
  geocoder(address: string) {
    return new Promise((resolve, reject) => {
      qqMapWX.geocoder({
        //获取表单传入地址
        address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
        success: function(res) {
          //成功后的回调
          console.log(res);
          var res = res.result;
          var latitude = res.location.lat;
          var longitude = res.location.lng;
          //根据地址解析在地图上标记解析地址位置
          resolve(`${latitude},${longitude}`);
        },
        fail: function(error) {
          console.error('地址信息获取失败', error);
          reject(false);
        },
        complete: function(res) {
          console.log(res);
        },
      });
    });
  }
  // 计算位置距离
  getLocation(from: string) {
    const store = this.props.home.currentStore;
    console.log('current', store);
    return new Promise((resolve, reject) => {
      qqMapWX.calculateDistance({
        from,
        to: `${store.latitude},${store.longitude}`, //终点坐标
        success: function(res) {
          //成功后的回调
          let resp = res.result.elements[0];
          // console.log('位置获取成功', res.result.elements[0]);
          resolve(resp);
        },
        fail: function(error) {
          console.log('获取位置信息失败', error);
          reject(false);
        },
      });
    });
  }
  // 选择地址
  async choseAddress() {
    const address = await Taro.chooseAddress();
    console.log('address', address);
    if (address.errMsg == 'chooseAddress:ok') {
      this.setState({
        address,
      });
    }
  }
  // 去支付
  async goPay(couponId) {
    try {
      const { type, home } = this.props;
      let { address } = this.state;
      console.log('order handlePay couponId', couponId);
      const { dispatch } = this.props;
      if (type == 'distribution' && !address) {
        Taro.showToast({ title: '您还没有选择地址.', icon: 'none' });
        return;
      } else if (address) {
        Taro.showLoading({ title: '正在加载中..,' });
        const from = (await this.geocoder(
          `${address.provinceName}${address.cityName}${address.countyName}${address.detailInfo}`,
        )) as string;
        //判断位置信息
        const result: any = await this.getLocation(from);
        Taro.hideLoading();
        if (result) {
          if (result.distance > 500) {
            console.log('用户与门店的地址', result.distance, '米');
            Taro.showToast({
              title: '您选择的地址与门店的距离超过了500米.',
              icon: 'none',
            });
            return;
          }
          // 格式化地址
          address = JSON.stringify(address);
        } else {
          Taro.showToast({
            icon: 'none',
            title: '未获取到您的位置信息',
          });
          return;
        }
      }
      const storeId = home.currentStore.id;
      await dispatch({
        type: 'common/pay',
        payload: { couponId, type, address, storeId },
      });
    } catch (e) {
      console.log('支付 错误e', e);
      Taro.showToast({
        title: '支付遇到了一些错误,请您稍后再试',
        icon: 'none',
      });
    }
  }
  render() {
    const { tabsHeight, type, coupons, home } = this.props;
    let { couponInfo } = coupons as ICoupons;
    const { cartItems, address } = this.state;
    // 配送金额
    const distributionAmount = home.currentStore.distributionAmount;
    if (!couponInfo) {
      couponInfo = {};
    }
    let cartLength = 0;
    const totalPrice = cartItems.reduce((total, currentValue) => {
      if (currentValue.checked) {
        cartLength += Number.parseInt(currentValue.number);
        return total + currentValue.membersPrice * currentValue.number;
      }
      return total;
    }, 0);
    const cost = currencyFormatter(
      ((totalPrice ? totalPrice : 0) -
        (couponInfo.amount ? couponInfo.amount : 0)) /
        100 <
        0
        ? 0
        : ((totalPrice ? totalPrice : 0) -
            (couponInfo.amount ? couponInfo.amount : 0)) /
            100,
      '￥',
    );
    return (
      <View style={`height:${tabsHeight}px;`}>
        <ScrollView
          scrollY
          className="form"
          style={`height:${tabsHeight - 100}px;`}
        >
          {/* 门店信息开始 */}
          <View className="shop-box">
            <View className="shop-box-title">门店详情</View>
            <View className="address">门店名称:{home.currentStore.name}</View>
            <View className="address">
              门店地址:{home.currentStore.address}
            </View>
          </View>
          {/* 门店信息结束 */}
          {/* 地址信息开始 */}
          {type == 'distribution' && (
            <View className="shop-box">
              <View className="shop-box-title">配送地址</View>
              <View
                className="address"
                onClick={() => {
                  this.choseAddress();
                }}
              >
                {address ? (
                  <View>
                    <View>{`${address.provinceName}${address.cityName}${address.detailInfo}`}</View>
                    <View>
                      {address.userName} 手机号:{address.telNumber}
                    </View>
                  </View>
                ) : (
                  <AtButton type="secondary">请您选择地址</AtButton>
                )}
              </View>
            </View>
          )}
          {/* 地址信息结束 */}
          {/* 商品信息开始 */}
          <View className="shop-box">
            <View className="shop-box-title">商品详情</View>
            {cartItems.map(item => (
              <Goods key={item.code} item={item} />
            ))}
          </View>
          {/* 商品信息结束 */}
          {/* 商品信息开始 */}
          {type == 'since' && (
            <View className="shop-box">
              <View className="info">
                <View>取货时间</View>
                <View>{moment().format('YYYY年MM月DD日')}</View>
              </View>
            </View>
          )}
          {/* 商品信息结束 */}

          {/* 优惠券开始 */}
          <View className="shop-box">
            {/* <View className="shop-box-title">优惠券</View> */}
            <View className="summary" onClick={this.gotoOptionCoupon}>
              {/* 选择优惠券 */}
              <View className="optionCoupon">
                <View className="optionCouponTitle">优惠券:</View>
                {couponInfo.require <= totalPrice && couponInfo.require != 0 ? (
                  <View className="useCoupon">
                    使用{currencyFormatter(couponInfo.amount / 100, '￥')}
                    元优惠券
                  </View>
                ) : (
                  <View
                    className="useCoupon"
                    // onClick={this.gotoOptionCoupon}
                  >
                    不使用优惠券
                    <Image src={iconR} />
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* 优惠券结束 */}
          <View className="shop-box">
            <View className="info">
              <View>总件数:</View>
              <View>共有{cartLength}件商品</View>
            </View>

            <View className="info">
              <View>商品总价:</View>
              <View>{currencyFormatter(totalPrice / 100, '￥')}</View>
            </View>
            <View className="info">
              <View>优惠金额:</View>
              <View>
                {currencyFormatter(
                  couponInfo.amount ? couponInfo.amount / 100 : 0,
                  '￥',
                )}
              </View>
            </View>
            <View className="info">
              <View>支付总价:</View>
              <View>{cost}</View>
            </View>
          </View>
        </ScrollView>
        <View className="action">
          <View className="totalPrice">
            合计:
            {cost}
          </View>
          <View className="button">
            {type == 'distribution' ? (
              <View>
                {totalPrice < distributionAmount ? (
                  <View>
                    还差{((distributionAmount - totalPrice) / 100).toFixed(2)}
                    元起送
                  </View>
                ) : (
                  <View>
                    <AtButton
                      type="primary"
                      onClick={() => {
                        this.goPay(
                          couponInfo.couponId ? couponInfo.couponId : ' ',
                        );
                      }}
                    >
                      立即支付
                    </AtButton>
                  </View>
                )}
              </View>
            ) : (
              <AtButton
                type="primary"
                onClick={() => {
                  this.goPay(couponInfo.couponId ? couponInfo.couponId : ' ');
                }}
              >
                立即支付
              </AtButton>
            )}
          </View>
        </View>
      </View>
    );
  }
}
