import {
  Button,
  View,
  Text,
  Image,
  CheckboxGroup,
  Swiper,
  SwiperItem,
} from '@tarojs/components';
import Taro, { Component, Config } from '@tarojs/taro';
import { getStoreInfo, getUserInfo } from '../../users/service';
import { connect } from '@tarojs/redux';
import './index.less';
import Service from '../category/service';
import cart from '../../images/addCart.png';

interface IProps {
  users: any;
  common: any;
  dispatch?: any;
}

@connect(({ users, common }) => ({ users, common }))
export default class Order extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '商品详情',
  };

  state: {
    goods: any;
    isAddCart: boolean;
    loading: boolean;
  } = {
    goods: {},
    isAddCart: false, // 是否在添加购物车
    loading: true,
  };

  async componentWillMount() {
    const code = this.$router.params.code;
    try {
      const result = await Service.getCategoryItem({ code });
      console.log('result', result);
      this.setState({ goods: result.list[0] });
    } catch (e) {
      Taro.showToast({
        title: '连接服务器失败',
        icon: 'none',
        duration: 3000,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  // 添加到购物车
  async addCart(code) {
    const { isAddCart } = this.state;
    if (!isAddCart) {
      this.setState({
        isAddCart: true,
      });
      const result = await this.props.dispatch({
        type: 'common/addToCartByCode',
        payload: code,
      });
      console.log('addCart result', result);
      this.setState({
        isAddCart: false,
      });
    }
  }
  render() {
    const { goods, loading } = this.state;
    return (
      <View className="index">
        {!loading && (
          <View>
            {/* 轮播图 */}
            <Swiper
              className="swiper"
              indicatorDots
              indicatorActiveColor="#04B2A9"
              indicatorColor="#DDDDDD"
            >
              <SwiperItem>
                <Image src={goods.imageUrl} mode="aspectFit" />
              </SwiperItem>
            </Swiper>

            {/* 价格 */}
            <View className="price">
              <View className="tip">会员价</View>
              <View className="presentPrice">
                {/* ￥{(goods.membersPrice / 100).toFixed(2)} */}
              </View>
              <View className="membersPrice">
                ￥{(goods.membersPrice / 100).toFixed(2)}
              </View>
              {goods.price > goods.membersPrice ? (
                <View className="oldPrice">
                  ￥{(goods.price / 100).toFixed(2)}
                </View>
              ) : null}
            </View>

            {/* 标题 */}
            <View className="title">{goods.title}</View>

            {/* 商品介绍 */}
            <View className="intro">
              <View className="introTitle">商品介绍</View>
              <View className="introContent">
                <View className="key">条形码</View>
                <View className="value">{goods.code}</View>
              </View>
              <View className="introContent">
                <View className="key">库存</View>
                <View className="value">{goods.stock}</View>
              </View>
            </View>

            {/* 底部信息 */}
            <View
              className="footer"
              onClick={this.addCart.bind(this, goods.code)}
            >
              <Image src={cart} mode="aspectFit"></Image>
              <Text style="margin-left:10px;">添加到购物车</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
