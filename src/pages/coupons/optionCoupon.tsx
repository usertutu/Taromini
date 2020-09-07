import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

var moment = require('moment');
moment.locale('zh-cn');

interface ICommon {
  cartItems: any;
}

interface ICoupons {
  list: [];
}

interface IProps {
  dispatch?: any;
  coupons: ICoupons;
  common: ICommon;
}

@connect(({ coupons, common }) => ({ coupons, common }))
export default class coupons extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '优惠券',
  };

  state: {
    current: number;
    status: any;
  } = {
    current: 0,
    status: 'useable',
  };

  componentWillMount() {
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'coupons/init',
    //   payload: this.state.status,
    // })

    Taro.showShareMenu({
      withShareTicket: true,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'coupons/init',
      payload: this.state.status,
    });
  }

  handleClick(value) {
    let status = '';
    console.log(value);

    switch (value) {
      case 0:
        status = 'useable';
        console.log('0', status);
        break;

      case 1:
        status = 'used';
        console.log('1', status);

        break;

      case 2:
        status = 'expired';
        console.log('2', status);
        break;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'coupons/init',
      payload: status,
    });

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

  //价格换算：无小数
  count(value) {
    let num = value / 100;
    return num;
  }

  //选择优惠券
  optionThis(coupon, totalPrice) {
    console.log('coupons optionCoupon optionThis id', coupon);
    if (totalPrice >= coupon.require) {
      console.log('optionTHis totalPrice', totalPrice);
      console.log('optionTHis coupon.require', coupon.require);

      const { dispatch } = this.props;
      dispatch({
        type: 'coupons/saveCouponID',
        payload: { coupon },
      });
      Taro.navigateBack({
        delta: 1,
      });
    } else {
      console.log('optionTHis totalPrice', totalPrice);
      console.log('optionTHis coupon.require', coupon.require);
      Taro.showToast({
        title: '未达优惠金额',
        icon: 'none',
        duration: 1000,
      });
    }
  }

  render() {
    const { list } = this.props.coupons;
    console.log('optionCoupon index list', list);

    const { cartItems } = this.props.common;
    const totalPrice = cartItems.reduce((total, currentValue) => {
      if (currentValue.checked) {
        return total + currentValue.price * currentValue.number;
      }
      return total;
    }, 0);

    console.log('optionCoupon index cartItems', cartItems);
    console.log('optionCoupon index totalPrice', totalPrice);

    //测试数据
    const list1 = [
      {
        id: 1,
        amount: 1000,
        require: 2000,
        createdAt: '20190101',
        expiredDate: '20190202',
      },
      {
        id: 2,
        amount: 3000,
        require: 4000,
        createdAt: '20190101',
        expiredDate: '20190202',
      },
    ];

    return (
      <View className="index">
        <View className="main">
          {/* 选择优惠券 */}
          <View>
            <View
              className="noUseCoupon"
              onClick={this.optionThis.bind(
                this,
                { require: 0, amount: 0 },
                totalPrice,
              )}
            >
              <View className="noUseCouponText">不使用优惠券</View>
            </View>

            {/* 整个优惠券列表 */}
            <View className="couponsList">
              {list.map(item => (
                //  {/* 每条优惠卷 */}
                <View
                  className="coupon"
                  key={item.id}
                  onClick={this.optionThis.bind(this, item, totalPrice)}
                >
                  {/* 左侧优惠卷金额 */}
                  <View className="couponPrice">
                    <View className="price">
                      ¥<View className="money">{this.count(item.amount)}</View>
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
                            {this.count(item.amount)}
                          </View>
                          <View className="guide">
                            满{this.count(item.require)}减
                            {this.count(item.amount)}
                          </View>
                          <View className="text">店铺优惠券</View>
                        </View>
                        {/* <Checkbox value={item.code} checked={item.checked}></Checkbox> */}
                      </View>
                      <View className="couponTime">
                        {moment(item.createdAt).format('YYYY.MM.DD')}
                        {moment(item.expiredDate).format(' - YYYY.MM.DD')}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
