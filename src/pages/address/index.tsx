import { Button, View, Text, Navigator, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

//引入图片
import shopPic from './../../images/address-pic.jpeg';

interface IHome {
  count: number;
}

interface IProps {
  dispatch?: any;
  address: IHome;
}

@connect(({ address }) => ({ address }))
export default class Address extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '门店地址',
  };

  render() {
    const {
      dispatch,
      address: { count },
    } = this.props;
    return (
      <View className="index">
        <View className="main">
          {/* 门店地址 */}
          <View className="shopInfo">
            <View className="shopPic">
              <Image src={shopPic} />
            </View>

            <View className="shopAddress">
              <View className="shopName">合豚未来店</View>

              {/* <View className="distance">
                100.23m
              </View> */}

              <View className="shopPosition">瑶海都市科技店</View>
            </View>
          </View>
          <View className="shopInfo">
            <View className="shopPic">
              <Image src="http://image.hetuntech.cn/qidi/top/shop-intro.png" />
            </View>

            <View className="shopAddress">
              <View className="shopName">合豚清华科技城启迪店</View>

              {/* <View className="distance">
                100.23m
              </View> */}

              <View className="shopPosition">
                清华启迪科技城机器人产业基地2栋1楼
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
