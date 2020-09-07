import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

import iconIntegral2 from './../../images/iconIntegral2.png';
import guideLogo from './../../images/guideLogo.png';

//引入时间插件
var moment = require('moment');
moment.locale('zh-cn');

interface IIntegral {
  list: [];
}

interface IProps {
  dispatch?: any;
  integral: IIntegral;
}

@connect(({ integral }) => ({ integral }))
export default class integral extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '积分',
  };

  state: {
    current: number;
    status: any;
  } = {
    current: 0,
    status: 'useable',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'integral/init',
    });
  }

  render() {
    const userInfo = this.props.integral;
    console.log('integral index num', userInfo);

    return (
      <View className="index">
        <View className="main">
          {/* 积分显示 */}
          <View className="integralTitle">
            <View className="point">
              <Image src={iconIntegral2} />
              {userInfo.point / 100} 
            </View>
            <View className="pointGuide">
              <View className="guide1" style="font-size: '30px'">
                购物消费
              </View>
              <View className="guide2">每消费1元可得1积分</View>
              <Image src={guideLogo} />
            </View>
          </View>

          {/* 积分记录 */}
          <View className="record">
            <View className="recordTitle">积分记录</View>

            {/* 每条获取积分的记录 */}
            {/* <View className="recordMode">
              <View className="score">
                + 30
              </View>
              <View className="mode">
                绑定手机号
              </View>
              <View className="time">
                2019-02-12
              </View>
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}
