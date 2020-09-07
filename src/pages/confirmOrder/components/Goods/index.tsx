import Taro, { Config } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import currencyFormatter from 'currency-format-tool';
import './index.less';
interface IProps {
  item: any; //商品详情
}
interface IState {}

export default class Goods extends Taro.Component<IProps, IState> {
  componentWillMount() {
    console.log('Goods this.props', this.props);
  }
  render() {
    const { item } = this.props;
    return (
      <View>
        {item && item.code ? (
          <View className="main">
            <View className="goods-container">
              <View className="goods-image">
                <Image className="image" src={item.imageUrl}></Image>
              </View>
              <View className="goods-info">
                <View className="title">
                  {item.title} x {item.number}
                </View>
                <View className="desc">商品条形码:{item.code}</View>
                <View className="add">
                  <View style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <View className="membersPrice">
                      {currencyFormatter(
                        item.membersPrice ? item.membersPrice / 100 : 0,
                        '￥',
                      )}
                    </View>
                    {item.price > item.membersPrice ? (
                      <View className="price">
                        {currencyFormatter(
                          item.price ? item.price / 100 : 0,
                          '￥',
                        )}
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
