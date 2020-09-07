import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import GoodsItem from '../GoodsItem';
import Service from '../../service';
import './index.less';
import Tools from '../../../../utils/tools';
interface IProps {
  categoryId: number; // 目录id
  tabsHeight: number; // 高度
  common?: any;
  dispatch?: any;
  currentTabs: number;
  currentIndex: number;
  home?: any;
}
interface IState {
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  list: any;
  loading: boolean;
  isAddCart: boolean;
  storeId: number;
  backCategoryId?: number;
}

// @ts-ignore
@connect(({ common, home }) => ({ common, home }))
export default class Goods extends Component<IProps, IState> {
  constructor() {
    super(...arguments);
    this.state = {
      currentPage: 1, // 当前页
      pageSize: 10, // 数量
      hasMore: true, // 是否还有更多
      list: [], // 数据列表
      loading: false, // 是否正在加载
      isAddCart: false,
      storeId: 0,
    };
  }

  componentWillMount() {
    this.setState({
      backCategoryId: this.props.categoryId,
    });
    this.initList();
  }

  componentWillReceiveProps(nextProps) {
    // 判断店铺id是否更改
    if (this.state.backCategoryId != nextProps.categoryId) {
      this.setState(
        {
          currentPage: 1,
          list: [],
          backCategoryId: nextProps.categoryId,
        },
        () => {
          this.queryCategory();
        },
      );
    } else {
      if (this.props.currentIndex == nextProps.currentTabs) {
        this.initList();
      }
    }
  }

  // 初始化列表
  initList() {
    if (this.state.list.length == 0) {
      //初始化列表
      this.queryCategory();
    }
  }
  // 查询目录
  async queryCategory() {
    if (!this.state.loading) {
      try {
        const oldList = this.state.list;
        this.setState({
          loading: true,
          list: [
            ...oldList,
            { code: 'sk1' },
            { code: 'sk2' },
            { code: 'sk3' },
            { code: 'sk4' },
            { code: 'sk7' },
            { code: 'sk8' },
            { code: 'sk9' },
            { code: 'sk10' },
          ], // 准备一些骨架屏加载数据
        });
        const { pageSize, currentPage } = this.state;
        const itemCategoryId = this.props.categoryId; // 分类id
        const storeId = this.props.home.currentStore.id;
        const result: any = await Service.getCategoryItem({
          pageSize,
          currentPage,
          itemCategoryId,
          storeId,
        });
        const { list, pagination } = result;
        if (list.length != 0) {
          // 合并数组
          let newList = [...oldList, ...list];
          this.setState({
            currentPage: this.state.currentPage + 1,
            list: newList,
            hasMore: newList.length !== pagination.total,
            loading: false,
          });
          // console.log('newList', newList);
        } else {
          // 列表长度为空，设置没有更多
          this.setState({
            list: oldList,
            hasMore: false,
          });
        }
      } catch (error) {
        console.error('Goods queryCategory ', error);
      } finally {
        this.setState({
          loading: false,
        });
      }
    }
  }

  // 上拉加载事件
  handleScrollToLower() {
    // 判断有没有更多数据
    if (this.state.hasMore) {
      // 不能在加载中触发请求
      if (!this.state.loading) {
        console.log('触发onScrollToLower');
        this.queryCategory();
      }
    } else {
      Taro.showToast({
        title: '已经到底啦~',
        icon: 'none',
      });
    }
  }

  // 添加到购物车
  async addCart(item: any, e) {
    const { isAddCart } = this.state;
    console.log('添加到购物车', item);
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
    const { tabsHeight } = this.props;
    const { list, loading } = this.state;
    const { currentIndex, currentTabs } = this.props;
    if (currentIndex == currentTabs) {
      return (
        <View className="main">
          <ScrollView
            scrollY
            style={`height:${tabsHeight + 'px'}`}
            lowerThreshold={200}
            onScrollToLower={this.handleScrollToLower.bind(this)}
          >
            {list.length >= 1 ? (
              list.map((item) => (
                <GoodsItem
                  loading={loading}
                  key={item.code}
                  item={item}
                  onAddCart={this.addCart.bind(this)}
                  goGoodsDetail={this.goGoodsDetail.bind(this)}
                ></GoodsItem>
              ))
            ) : (
              <View className="empty" style={`height:${tabsHeight}px`}>
                <View>
                  <Image
                    className="empty-img"
                    src="http://image.hetuntech.cn/strore/empty.png"
                  />
                </View>
                <View className="empty-text">
                  此分类暂时还没有商品，去其他分类逛逛吧!
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }
    return null;
  }
}
