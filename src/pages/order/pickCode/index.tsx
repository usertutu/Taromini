import { Button, View, Text, Image, CheckboxGroup } from '@tarojs/components';
import Taro, { Component, Config } from '@tarojs/taro';
import { getStoreInfo, getUserInfo } from '../../users/service';
import { connect } from '@tarojs/redux';
import './index.less';

interface IProps {
  users: any;
  common: any;
}

@connect(({ users, common }) => ({ users, common }))
export default class Order extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '取货码',
  };

  state: {
    storeInfo: any;
    phone: string;
  } = {
    storeInfo: {},
    phone: '',
  };

  async componentWillMount() {
    console.log('this.$router.params', this.$router.params);
    // const { code } = this.$router.params;
    const userInfo = await getUserInfo();
    console.log('用户信息---：', userInfo);
    // const storeInfo = await getStoreInfo(userInfo.storeId);
    // console.log('storeInfo', storeInfo);
    this.setState({
      // storeInfo: storeInfo.list[0],
      phone: userInfo['phone.number'],
    });
  }
  render() {
    const { storeInfo, phone } = this.state;

    return (
      <View className="index">
        <View className="content">
          <View className="title">到店自提码</View>
          <View className="code">{this.$router.params.code}</View>
          <View className="phone">门店:{this.$router.params.store}</View>
          <View className="phone">{phone ? phone : ''}</View>
        </View>
      </View>
    );
  }
}
