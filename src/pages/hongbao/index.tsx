import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

import logoHongbao from './../../images/logoHongbao.png';
import hblogo from './../../images/hblogo.png';

//引入时间插件
var moment = require('moment');
moment.locale('zh-cn');

interface IHongbao {
  list: [];
}

interface IProps {
  dispatch?: any;
  hongbao: IHongbao;
}

@connect(({ hongbao }) => ({ hongbao }))
export default class hongbao extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '红包',
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
  }

  componentDidMount() {}

  gotohongbaoRecord() {
    Taro.navigateTo({
      url: './../hongbaoRecord/index',
    });
  }

  render() {
    return (
      <View className="index">
        <View className="main">
          {/* 顶部公告栏 */}
          <View className="top">红包:下单时抵扣</View>

          {1 ? (
            // {/* 没有红包时显示 */}
            <View className="nullLogo">
              <Image src={logoHongbao} />
              <View className="text1">竟然一个红包都没有</View>
              <View className="text2">邀请好友立得红包</View>
            </View>
          ) : (
            <View className="hongbaoInfo">
              <View className="hongbaoTitle">
                <View className="text1">共计 2 个红包</View>
                <View className="text2">¥ 10</View>
              </View>

              {/* 红包列表 */}
              <View className="hongbaoList">
                {/* 每个红包*/}
                <View className="hongbao">
                  <View className="hblogo">
                    <Image src={hblogo} />
                  </View>
                  <View className="hbinfo">
                    <View className="hbText1">双12红包</View>
                    <View className="hbText2">2019.01.01 - 2019.02.02</View>
                  </View>
                  <View className="hbprice">¥ 5.00</View>
                </View>

                {/* 每个红包*/}
                <View className="hongbao">
                  <View className="hblogo">
                    <Image src={hblogo} />
                  </View>
                  <View className="hbinfo">
                    <View className="hbText1">双12红包</View>
                    <View className="hbText2">2019.01.01 - 2019.02.02</View>
                  </View>
                  <View className="hbprice">¥ 5.00</View>
                </View>
              </View>
            </View>
          )}

          {/* 底部跳转按钮 */}
          <View className="gotoHongbao" onClick={this.gotohongbaoRecord}>
            查看红包使用记录
          </View>
        </View>
      </View>
    );
  }
}
