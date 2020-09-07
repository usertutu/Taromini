import { View, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import { AtTabs, AtTabsPane } from 'taro-ui';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

import use from './../../images/use.png';
import past from './../../images/past.png';

//引入moment
// import moment from 'moment';

var moment = require('moment');
moment.locale('zh-cn');

interface ICoupons {
  list: [];
}

interface IProps {
  dispatch?: any;
  coupons: ICoupons;
}

@connect(({ coupons }) => ({ coupons }))
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

  render() {
    const tabList = [
      { title: '待使用' },
      { title: '已使用' },
      { title: '已过期' },
    ];
    const { list } = this.props.coupons;
    console.log('coupons index list ---:', list);

    return (
      <View className="index">
        <View className="main">
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
            className="pd"
          >
            {/* 待使用 */}
            <AtTabsPane current={this.state.current} index={0}>
              {/* 整个优惠券列表 */}
              <View className="couponsList">
                {list.map(item => (
                  //  {/* 每条优惠卷 */}
                  <View className="coupon" key={item.id}>
                    {/* 左侧优惠卷金额 */}
                    <View className="couponPrice">
                      <View className="price">
                        ¥
                        <View className="money">{this.count(item.amount)}</View>
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
            </AtTabsPane>

            {/* 已使用 */}
            <AtTabsPane
              current={this.state.current}
              index={1}
              className="disabled"
            >
              {/* 整个优惠券列表 */}
              <View className="couponsList">
                {list.map(item => (
                  //  {/* 每条优惠卷 */}
                  <View className="coupon" key={item.id}>
                    <Image src={use} className="label" />
                    {/* 左侧优惠卷金额 */}
                    <View className="couponPrice">
                      <View className="price">
                        ¥
                        <View className="money">{this.count(item.amount)}</View>
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
            </AtTabsPane>

            {/* 已过期 */}
            <AtTabsPane
              current={this.state.current}
              index={2}
              className="disabled"
            >
              {/* 整个优惠券列表 */}
              <View className="couponsList">
                {list.map(item => (
                  //  {/* 每条优惠卷 */}
                  <View className="coupon" key={item.id}>
                    <Image src={past} className="label" />
                    {/* 左侧优惠卷金额 */}
                    <View className="couponPrice">
                      <View className="price">
                        ¥
                        <View className="money">{this.count(item.amount)}</View>
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
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    );
  }
}
