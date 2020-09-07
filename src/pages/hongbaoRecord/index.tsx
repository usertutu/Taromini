import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtTabs, AtTabsPane } from 'taro-ui';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

import hblogo from './../../images/notuseHB.png';

//引入时间插件
var moment = require('moment');
moment.locale('zh-cn');

interface IHongbaoRecord {
  list: [];
}

interface IProps {
  dispatch?: any;
  hongbaoRecord: IHongbaoRecord;
}

@connect(({ hongbaoRecord }) => ({ hongbaoRecord }))
export default class hongbaoRecord extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '红包',
  };

  state: {
    current: number;
  } = {
    current: 0,
  };

  handleClick(value) {
    this.setState({
      current: value,
    });
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    const tabList = [{ title: '已使用' }, { title: '已过期' }];

    return (
      <View className="index">
        <View className="main">
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
          >
            {/* 已使用界面 */}
            <AtTabsPane current={this.state.current} index={0}>
              {/* 红包列表 */}
              <View className="hongbaoList">
               
                {/* 每个红包*/}

                {/* <View className="hongbao">
                  <View className="hblogo">
                    <Image src={hblogo} />
                  </View>
                  <View className="hbinfo">
                    <View className="hbText1">双12红包</View>
                    <View className="hbText2">2019.01.01 - 2019.02.02</View>
                  </View>
                  <View className="hbprice">¥ 5.00</View>
                </View>
               */}

              </View>
            </AtTabsPane>

            {/* 已过期界面 */}
            <AtTabsPane current={this.state.current} index={1}>
              {/* 红包列表 */}
              <View className="hongbaoList">
                {/* 每个红包*/}
                {/* <View className="hongbao">
                  <View className="hblogo">
                    <Image src={hblogo} />
                  </View>
                  <View className="hbinfo">
                    <View className="hbText1">双12红包</View>
                    <View className="hbText2">2019.01.01 - 2019.02.02</View>
                  </View>
                  <View className="hbprice">¥ 5.00</View>
                </View> */}
             
              </View>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    );
  }
}
