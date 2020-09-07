import {
  Button,
  View,
  Text,
  Image,
  Checkbox,
  CheckboxGroup,
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import { AtInputNumber } from 'taro-ui';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import scan from './../../images/scan.png';

import iconR from './../../images/icon-right.png';

//引入moment
// import moment from 'moment';

var moment = require('moment');
moment.locale('zh-cn');

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
  dispatch?: any;
  order: IOrder;
  common: ICommon;
  coupons: ICoupons;
}

@connect(({ order, common, coupons }) => ({ order, common, coupons }))
export default class Order extends Component<IProps> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '购物车',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    backgroundColor: '#eeeeee', //下拉背景颜色
  };

  state: {
    current: number;
    allPrice: number;
    value: any;
    discount: any;
    activiId: any;
    couponId: any;
    cartChecked: any;
  } = {
    current: 0,
    allPrice: 0,
    value: null,
    discount: 0,
    activiId: 0,
    couponId: '',
    cartChecked: '',
  };

  async componentWillMount() {}

  async componentDidShow() {
    const resultToken = await Taro.getStorageSync('accessToken');
    if (!resultToken) {
      Taro.switchTab({
        url: '../users/index',
      });
    }
  }

  //勾选状态
  onCheckboxGroupChange(e) {
    this.setState({
      discount: 0,
      activiId: 0,
    });
    console.log('buy onCheckboxGroupChange items');
    const { dispatch } = this.props;
    dispatch({
      type: 'common/changeCartItemsChecked',
      payload: e.detail.value,
    });
  }

  changeCheck() {
    console.log('buy changeCheck items');
    const { dispatch } = this.props;
    const { cartChecked } = this.state;
    dispatch({
      type: 'common/changeAllCheckedCartItems',
      payload: cartChecked,
    });
    this.setState({
      cartChecked: !cartChecked,
    });
  }

  //监听下拉刷新事件
  onPullDownRefresh() {
    setTimeout(function() {
      Taro.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  }

  //跳转页面
  handleClick(value) {
    console.log('order handleClick value', value);
    switch (value) {
      case 0:
        break;
      case 1:
        const { dispatch } = this.props;
        dispatch({
          type: 'order/init',
        });
        break;
      default:
    }
    //用于监听跳转页面
    this.setState({
      current: value,
    });
  }

  //价格换算
  price(value) {
    let num = value / 100;
    let price = num.toFixed(2);
    return price;
  }

  //扫码事件
  async onScanCode() {
    const { result: code } = await Taro.scanCode();
    console.log('order onScanCode code', code);
    if (!code) {
      console.log('-------------------------code is NaN');
      Taro.showToast({
        title: '请扫描商品条码^_^',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    const { dispatch } = this.props;
    if (code.indexOf('hetun') != -1) {
      const faceToken = code.split('open-door/')[1];
      let id;
      let timestamp;
      let hash;
      console.log('home onScanCode faceToken:', faceToken);
      const arr = faceToken.match(/[a-zA-Z0-9]+/g);
      console.log('home onScanCode arr:', arr);
      if (arr.length === 4) {
        id = arr[0];
        timestamp = arr[2];
        hash = arr[3];
      } else {
        id = arr[0];
        timestamp = '';
        hash = arr[1];
      }
      console.log('home onScanCode id:', id);
      console.log('home onScanCode timestamp:', timestamp);
      console.log('home onScanCode hash:', hash);
      await dispatch({
        type: 'home/open',
        payload: { id, timestamp, hash },
      });
    } else {
      await dispatch({
        type: 'common/addToCartByCode',
        payload: code,
      });
      Taro.switchTab({ url: '../order/index' });
    }
  }

  //跳转-选择优惠券
  gotoOptionCoupon() {
    Taro.navigateTo({
      url: '../coupons/optionCoupon',
    });
  }

  //付款
  handlePay(couponId) {
    Taro.navigateTo({ url: '/pages/confirmOrder/index' });

    // console.log('order handlePay couponId', couponId);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'common/pay',
    //   payload: couponId,
    // });
  }

  handleChange(value) {
    this.setState({
      value,
    });
  }

  handleNumberChange(itemCode, number) {
    this.setState({
      discount: 0,
      activiId: 0,
    });
    console.log('buy', 'handleNumberChange', 'itemCode', itemCode);
    console.log('buy', 'handleNumberChange', 'number', number);
    const { dispatch } = this.props;
    dispatch({
      type: 'common/changeCartItemNumer',
      payload: { code: itemCode, number },
    });
    // dispatch({
    //   type: 'coupons/delectCoupon'
    // })
  }

  //删除商品
  deleteCart(cartItems, index) {
    Taro.showModal({
      title: '',
      content: '确认删除选中的商品吗？',
    }).then(res => {
      if (res.confirm) {
        const { dispatch } = this.props;
        dispatch({
          type: 'common/delete',
          payload: cartItems,
          index,
        });
        dispatch({
          type: 'coupons/delectCoupon',
        });
        Taro.showToast({
          title: '删除完成',
          icon: 'succes',
          duration: 1000,
        });
      }
    });
    console.log('order deleteCart items', index);
    console.log('models deleteCartItems order deleteCart cartItems', cartItems);
  }

  removeAll() {
    const { dispatch } = this.props;
    Taro.showModal({
      title: '',
      content: '确认清空购物车商品吗?',
    }).then(res => {
      if (res.confirm) {
        dispatch({
          type: 'common/removeAll',
        });
        dispatch({
          type: 'coupons/delectCoupon',
        });
      }
    });
  }

  render() {
    // TODO: //扫码加入购物车的数据  可用数据！！
    const { cartChecked, cartItems } = this.props.common;
    console.log('order index render cartChecked', cartChecked);
    console.log('order index render cartItems', cartItems);

    // const gotCoupons = this.props.coupons;
    // let { couponInfo } = this.props.coupons;
    // if(!couponInfo){
    //   couponInfo = {}
    // }
    // console.log('order index render gotCoupons', gotCoupons);
    // console.log('order index render couponInfo', couponInfo);
    // const check = cartItems.every(item => item.checked === true);
    // console.log('buy render check', check);
    let cartLength = 0;
    const totalPrice = cartItems.reduce((total, currentValue) => {
      if (currentValue.checked) {
        cartLength += Number.parseInt(currentValue.number);
        return total + currentValue.membersPrice * currentValue.number;
      }
      return total;
    }, 0);

    console.log('buy render totalPrice', totalPrice);

    return (
      <View className="index">
        <View className="main">
          <View className="scan" onClick={this.onScanCode}>
            <Image src={scan} />
          </View>
          {/* 订单-"购物车" */}
          {cartItems.length ? (
            <View className="finish">
              {/* 订单模块 */}
              <View className="listInfo">
                <View className="listID">购物车中有{cartLength}件商品</View>
                <View className="removeAll" onClick={this.removeAll}>
                  <Image src="http://image.hetuntech.cn/clearCart.png"></Image>
                  清空购物车
                </View>

                {/* 订单物品列表 */}
                <View className="goodslist">
                  <CheckboxGroup onChange={this.onCheckboxGroupChange}>
                    {cartItems.map((item, index) => (
                      //结构-订单物品
                      <View className="goods" key={item.cost}>
                        {/* FIXME: 勾选选择框 */}
                        {/* <View className="goodsOption">
                              <Checkbox
                                value={item.code}
                                checked={item.checked}
                              />
                            </View> */}

                        {/* 物品图片 */}
                        <View className="goodsPic">
                          <View className="floor">
                            <Image src={item.imageUrl} className="gPic" />
                          </View>
                        </View>

                        {/* 物品信息 */}
                        <View className="goodsInfo">
                          <View className="text">
                            <View className="name">{item.title}</View>
                            {/* <View className="sizi">{item.number}</View> */}
                            <View className="price">
                              ¥ {this.price(item.membersPrice)}
                            </View>
                          </View>
                        </View>

                        {/* 物品价格 */}
                        <View className="goodsPrice">
                          <View className="text">
                            {item.number == 1 ? (
                              <View>
                                <View
                                  className="del"
                                  onClick={this.deleteCart.bind(
                                    this,
                                    cartItems,
                                    index,
                                  )}
                                ></View>
                                <View className="delText">
                                  <View>再次点击</View>删除商品
                                </View>
                              </View>
                            ) : (
                              <View></View>
                            )}

                            <View className="count">
                              <AtInputNumber
                                min={1}
                                max={99}
                                step={1}
                                width={100}
                                value={item.number}
                                onChange={this.handleNumberChange.bind(
                                  this,
                                  item.code,
                                )}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </CheckboxGroup>
                </View>
              </View>
            </View>
          ) : (
            <View className="msg">您的购物车空空如也，去商店逛逛吧!</View>
          )}
          {/* 购物车商品结算栏 */}
          {this.state.current ? (
            <View />
          ) : (
            <View className="total">
              {/* FIXME: 全选选择框 */}
              {/* {
              cartItems.length > 0 ?
                <View className="total-check">
                  <View className="total-check-pic">
                    <Checkbox
                      value="all"
                      checked={check}
                      onClick={this.changeCheck}
                    />
                  </View>
                  <View className="total-check-text">全选</View>
                </View>
              :
                <View/>
            }
               */}
              <View className="totalMoney">
                合计: ¥{(totalPrice / 100).toFixed(2)}
              </View>
              {totalPrice > 0 ? (
                <Button
                  className="totalPay"
                  onClick={this.handlePay.bind(this)}
                >
                  立即下单
                </Button>
              ) : (
                <Button className="totalPay" style="background:#ccc;">
                  立即下单
                </Button>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
