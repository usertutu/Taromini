import {
  Button,
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
//引入taro-ui
import Taro, { Component, Config } from '@tarojs/taro';
import { AtFloatLayout } from 'taro-ui';
import './index.less';

import hbbt from './../../images/hbbt.png';
import wechat from './../../images/wechat.png';
import twocode from './../../images/2code.png';

//引入时间插件
var moment = require('moment');
moment.locale('zh-cn');

interface IInviteFriends {
  list: [];
}

interface IProps {
  dispatch?: any;
  InviteFriends: IInviteFriends;
}

@connect(({ InviteFriends }) => ({ InviteFriends }))
export default class InviteFriends extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '邀请好友 分享有礼',
  };

  state: {
    current: number;
    status: any;
    bool: boolean;
  } = {
    current: 0,
    status: 'useable',
    bool: false,
  };

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }

  isOpen() {
    this.setState({
      bool: !false,
    });
  }

  render() {
    return (
      <View className="index">
        <View className="main">
          {/* 邀请标题 */}
          <View className="activityTitle">
            {/* 顶部公告与规则  */}
            <View className="titleTop">
              <View className="notice">
                <View className="gitText">
                  <Swiper
                    className="test-h"
                    indicatorColor="#999"
                    indicatorActiveColor="#333"
                    vertical={true}
                    circular
                    indicatorDots
                    autoplay={true}
                  >
                    <SwiperItem>
                      <View className="demo-text-1">
                        德**力成功邀请1位好友，获得2元红包
                      </View>
                    </SwiperItem>
                    <SwiperItem>
                      <View className="demo-text-2">
                        小**可成功邀请1位好友，获得2元红包
                      </View>
                    </SwiperItem>
                    <SwiperItem>
                      <View className="demo-text-3">
                        马**梅成功邀请1位好友，获得2元红包
                      </View>
                    </SwiperItem>
                  </Swiper>
                </View>
              </View>
              <View className="guide">
                <View className="text">活动规则</View>
              </View>
            </View>

            {/* 中间大标题 */}
            <View className="titleCenter">
              <Image src="http://image.hetuntech.cn/bg.png" />
              <View className="o">
                <View className="centerInfo">
                  <View className="text1">每邀请1位新好友</View>
                  <View className="text2">
                    立得
                    <Text className="text3">2</Text>元
                  </View>
                </View>
              </View>

              <View className="centerTitle">邀好友 得红包</View>
              {/* <View className="centerInfo">
                

              </View> */}
            </View>

            {/* 底部邀请按钮 */}
            <View className="titleBottom">
              <Button className="share" onClick={this.isOpen}>
                立即邀请领红包
              </Button>
              <AtFloatLayout isOpened={this.state.bool} className="shareBox">
                <View className="mode">
                  <Button openType="share">
                    <Image src={wechat}></Image>
                  </Button>
                  <Image src={twocode} className="twocode"></Image>
                </View>
              </AtFloatLayout>
            </View>
          </View>

          {/* 邀请信息 */}
          <View className="activityInfo">
            {/* 邀请攻略 */}
            <View className="strategy">
              <Image src="http://image.hetuntech.cn/yqgl.png" />
            </View>

            {/* 我的红包 */}
            <View className="mine">
              <View className="title">
                <Image src={hbbt} />
              </View>
              <View className="gain">
                <View className="wait">
                  <View className="money">¥ 0</View>
                  <View className="text">待发放</View>
                </View>
                <View className="wait, get">
                  <View className="money">¥ 0</View>
                  <View className="text">已获得</View>
                </View>
              </View>
              <View className="gainRecord">
                <Image src="http://image.hetuntech.cn/xhtlogo.png" />
                <View className="gainRecordText">
                  暂无奖励，快去邀请好友赚红包吧！
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
