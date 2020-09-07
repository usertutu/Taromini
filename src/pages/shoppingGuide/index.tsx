import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

interface IHome {
  count: number;
  url: any;
}

interface IProps {
  dispatch?: any;
  gotoUs: IHome;
}

@connect(({ gotoUs }) => ({ gotoUs }))
export default class shopGuide extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '购物指南',
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    backgroundColor: '#10a29f',
  };

  constructor() {
    super(...arguments);
    //数据
    this.state = {
      url: '',
    };
  }

  componentWillMount() {}

  render() {
    return (
      <View className="index">
        <Swiper indicatorDots indicatorActiveColor="#32bcbc" className="swiper">
          <SwiperItem>
            <View className="gifImg">
              <Image src="http://image.hetuntech.cn/qidi/step1.gif"></Image>
            </View>
            <View className="tips">进入小程序，打开进店二维码刷码进店</View>
          </SwiperItem>
          <SwiperItem>
            <View className="gifImg">
              <Image src="http://image.hetuntech.cn/qidi/step2.gif"></Image>
            </View>
            <View className="tips">扫描商品条形码，加入购物车</View>
          </SwiperItem>
          <SwiperItem>
            <View className="gifImg">
              <Image src="http://image.hetuntech.cn/qidi/step3.gif"></Image>
            </View>
            <View className="tips">挑选商品完毕，立即支付</View>
          </SwiperItem>
          <SwiperItem className="item">
            <View className="gifImg">
              <Image src="http://image.hetuntech.cn/qidi/step4.gif"></Image>
            </View>
            <View className="tips">再次打开二维码，刷码离店</View>
            <View className="btnWrapper">
              <View
                className="btn"
                onClick={() => {
                  Taro.navigateBack({ delta: 1 });
                }}
              >
                立即体验
              </View>
            </View>
          </SwiperItem>
        </Swiper>
      </View>
    );
  }
}
