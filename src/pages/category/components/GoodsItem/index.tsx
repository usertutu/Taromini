import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Skeleton from 'taro-skeleton';
import { IGoodsItem } from '../../../../utils/common.d';
import currencyFormatter from 'currency-format-tool';
import './index.less';
interface IProps {
  loading: boolean;
  item: IGoodsItem;
  onAddCart: (item: IGoodsItem, e: any) => void;
  goGoodsDetail: (item: IGoodsItem) => void;
}
interface IState {}
export default class GoodItem extends Component<IProps, IState> {
  render() {
    const { loading, item, onAddCart, goGoodsDetail } = this.props;
    return (
      <View onClick={() => goGoodsDetail(item)}>
        <Skeleton row={2} avatarShape="square" title avatar loading={loading}>
          <View>
            {item && item.code ? (
              <View className="main">
                <View className="goods-container">
                  <View className="goods-image">
                    <Image className="image" src={item.imageUrl}></Image>
                  </View>
                  <View className="goods-info">
                    <View className="title">{item.title}</View>
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

                      <View
                        className="plus"
                        onClick={e => {
                          e.stopPropagation();
                          onAddCart(item, e);
                        }}
                      >
                        <AtIcon
                          value="add-circle"
                          size="30"
                          color="#04b2a9"
                        ></AtIcon>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </Skeleton>
      </View>
    );
  }
}
