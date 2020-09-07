import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtButton } from 'taro-ui';
import './index.less';

interface IHome {
  count: number;
  token: {};
  userInfo: any;
}

interface IProps {
  dispatch?: any;
  authorization: IHome;
}

@connect(({ authorization }) => ({ authorization }))
export default class NeedLogin extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '需要登陆',
  };

  render() {
    return (
      <View className="index">
        <View className="main">
          <Image
            src="https://image.hetuntech.cn/WechatIMG135.jpeg"
            className="logo"
          />
          <View className="text">
            <View className="text_one">请授权后访问</View>
            <View className="text_two">登陆查看更多信息</View>
          </View>

          <AtButton
            type="primary"
            className="submit"
            onClick={() =>
              Taro.navigateTo({
                url: '../authorization/index',
              })
            }
          >
            微信授权登陆
          </AtButton>
        </View>
      </View>
    );
  }
}
