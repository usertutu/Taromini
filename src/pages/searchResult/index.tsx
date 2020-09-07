import { View, Image, ScrollView } from '@tarojs/components';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import Service from '../category/service';
import Tools from '../../utils/tools';
import { connect } from '@tarojs/redux';

interface IProps {
  dispatch?: any;
  common: any;
  home?: any;
}

@connect(({ common, home }) => ({ common, home }))
export default class Home extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '搜索结果',
  };

  state: {
    resultList: any;
    currentPage: number;
    total: number;
    loading: boolean;
    isAddCart: boolean;
  } = {
    resultList: [],
    currentPage: 1,
    total: 0,
    loading: true,
    isAddCart: false, // 是否在添加购物车
  };

  async componentWillMount() {
    this.getList().then(() => this.setState({ loading: false }));
  }

  // 获取列表
  async getList() {
    const search = this.$router.params.search;
    const itemCategoryId = this.$router.params.itemCategoryId;
    console.log('search', search);
    console.log('itemCategoryId', itemCategoryId);
    const storeId = this.props.home.currentStore.id;
    console.log('getList storeId', storeId);
    const { resultList, currentPage } = this.state;
    try {
      if (search) {
        const result = await Service.getCategoryItem({
          titleLike: search,
          pageSize: 10,
          currentPage: currentPage,
          storeId,
        });
        console.log('result', result);
        result.list.map(item => {
          resultList.push(item);
        });
        this.setState({ resultList, total: result.pagination.total });
      }
      if (itemCategoryId) {
        const result = await Service.getCategoryItem({
          itemCategoryId: Number(itemCategoryId),
          pageSize: 10,
          currentPage: currentPage,
          storeId,
        });
        console.log('result', result);
        result.list.map(item => {
          resultList.push(item);
        });
        this.setState({ resultList, total: result.pagination.total });
      }

      console.log('this.state.resultList', this.state.resultList);
    } catch (e) {
      Taro.showToast({
        title: '连接服务器失败',
        icon: 'none',
      });
    }
  }

  // 上拉加载
  onScrollToLower() {
    console.log('上拉加载');
    const { currentPage, total } = this.state;
    const pageCount = Tools.pageCount(total, 10);
    if (currentPage < pageCount) {
      this.setState({ currentPage: currentPage + 1 }, () => {
        this.getList();
      });
    }
  }

  // 加入购物车
  async addCart(item: any, e) {
    console.log('event', e);
    e.stopPropagation(); // 阻止事件冒泡
    console.log('添加到购物车', item);
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
    const { resultList, loading } = this.state;
    return (
      <View className="index">
        <View className="main">
          {loading ? null : (
            <ScrollView
              className="scrollView"
              scrollY={true}
              lowerThreshold={100}
              onScrollToLower={this.onScrollToLower.bind(this)}
            >
              <View className="content">
                {resultList.length != 0 ? (
                  <View className="full">
                    {resultList.map((item, index) => (
                      <View
                        key={item.title + index}
                        className="item"
                        onClick={this.goGoodsDetail.bind(this, item)}
                      >
                        <Image
                          src={item.imageUrl}
                          className="goods"
                          mode="aspectFit"
                        />
                        <View className="info">
                          <View className="title">{item.title}</View>
                          <View className="price_cart">
                            <View className="price">
                              <View className="presentPrice">
                                ￥{(item.membersPrice / 100).toFixed(2)}/个
                              </View>
                              {item.price > item.membersPrice ? (
                                <View className="originalPrice">
                                  ￥{(item.price / 100).toFixed(2)}
                                </View>
                              ) : null}
                            </View>
                            <Image
                              src="https://image.ygbh.hetunai.cn/mall_cart.png"
                              className="cart"
                              mode="aspectFit"
                              onClick={this.addCart.bind(this, item)}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="empty">暂无商品</View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}
