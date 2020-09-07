import { View, Text, Image } from '@tarojs/components';
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
export default class Authorization extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '授权登陆',
  };

  // 授权-获取用户信息
  onGetUserInfo(e) {
    console.log(e.detail.userInfo);
    console.log(e.detail.userInfo.nickName);
    let name = e.detail.userInfo.nickName;
    const { dispatch } = this.props;
    Taro.login({
      success(res) {
        let code = res.code;
        dispatch({
          type: 'authorization/login',
          payload: { code, name, e },
        });
      },
    });
  }

  render() {
    return (
      <View className="index">
        <View className="main">
          <Image
            src="https://image.hetuntech.cn/WechatIMG135.jpeg"
            className="logo"
          />
          <View className="text">
            <View className="text_one">申请获取以下权限</View>
            <View className="text_two">获得你的公开信息（昵称、头像等）</View>
          </View>
          <AtButton
            className="submit"
            openType="getUserInfo"
            onGetUserInfo={this.onGetUserInfo.bind(this)}
            type="primary"
          >
            授权登陆
          </AtButton>
        </View>
      </View>
    );
  }
}
