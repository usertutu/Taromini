import Taro, { Component } from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import addCart2 from '../../../../images/addCart2.png';
import Tools from '../../../../utils/tools';
import { connect } from '@tarojs/redux';
import './index.less';
interface IProps {
  list?: any;
  common?: any;
  dispatch?: any;
  // isAddCart:boolean
}

// @ts-ignore
@connect(({ common }) => ({ common }))
export default class Recommend extends Component<IProps> {
  state = {
    isAddCart: false,
  };
  async componentWillMount() {}

  // 添加到购物车
  async addCart(item: any, e) {
    e.stopPropagation(); // 阻止事件冒泡
    const { isAddCart } = this.state;
    if (!isAddCart) {
      this.setState({
        isAddCart: true,
      });
      const result = await this.props.dispatch({
        type: 'common/addToCartByCode',
        payload: item.code,
      });
      console.log('addCart result', result);
      this.setState({
        isAddCart: false,
      });
    }
  }

  // 跳转商品详情页
  goGoodsDetail(item: any) {
    Tools.go('../goodsDetail/index?code=' + item.code);
  }

  render() {
    // 为您推荐列表
    const { list } = this.props;
    return (
      <View className="recommendation">
        {list.length >= 1 && (
          <View>
            <View className="title">为您推荐</View>
            <View className="content">
              {list.map(item => (
                <View
                  key={item.id}
                  className="item"
                  onClick={this.goGoodsDetail.bind(this, item)}
                >
                  <Image
                    src={item.imageUrl}
                    mode="aspectFit"
                    className="goodsImage"
                  ></Image>
                  <View className="info">
                    <View className="name">{item.title}</View>
                    <View className="priceDetail">
                      <View className="membersPrice">
                        ￥{(item.membersPrice / 100).toFixed(2)}
                      </View>
                      <View className="price">
                        ￥{(item.price / 100).toFixed(2)}
                      </View>
                    </View>
                    <Image
                      src={addCart2}
                      mode="aspectFit"
                      className="addCart"
                      onClick={this.addCart.bind(this, item)}
                    ></Image>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }
}
