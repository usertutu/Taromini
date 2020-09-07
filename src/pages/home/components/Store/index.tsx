import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import { getStoreInfoMessage } from '../../../users/service';
import './index.less';
interface IProps {
  showOptionStore: any;
}
interface IState {
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  list: any;
  loading: boolean;
}
export default class Store extends Component<IProps, IState> {
  state = {
    currentPage: 1, // 当前页
    pageSize: 10, // 数量
    hasMore: true, // 是否还有更多
    list: [], // 数据列表
    loading: false, // 是否正在加载
  };
  async componentWillMount() {
    // const store = await getStoreInfoMessage({});
    // console.log('componentWillMount getStoreInfoMessage', store);
    this.queryList();
  }

  // 查询列表
  async queryList() {
    try {
      const oldList = this.state.list;
      this.setState({
        loading: true,
      });
      const { pageSize, currentPage } = this.state;
      const result: any = await getStoreInfoMessage({
        pageSize,
        currentPage,
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
        console.log('Store newList', newList);
      } else {
        // 列表长度为空，设置没有更多
        this.setState({
          list: oldList,
          hasMore: false,
        });
      }
    } catch (error) {
      console.error('Store queryList ', error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }
  // 上拉加载事件
  handleScrollToLower() {
    // 判断有没有更多数据
    if (this.state.hasMore) {
      // 不能在加载中触发请求
      if (!this.state.loading) {
        console.log('触发onScrollToLower');
        this.queryList();
      }
    } else {
      // Taro.showToast({
      //   title: '已经到底啦~',
      //   icon: 'none',
      // });
    }
  }
  render() {
    const { showOptionStore } = this.props;
    const { list, loading } = this.state;
    return (
      <ScrollView
        className="scrollView"
        scrollY
        scrollWithAnimation
        scrollTop={0}
        upperThreshold={20}
        lowerThreshold={20}
        onScrollToLower={this.handleScrollToLower.bind(this)}
      >
        {list.length ? (
          list.map((item: any) => (
            <View
              className="Store "
              key={item.id}
              onClick={() => showOptionStore(item)}
            >
              <Image src="https://image.hetuntech.cn/WechatIMG135.jpeg" />
              <View className="title">{item.name}</View>
              <View className="text">{item.address}</View>
            </View>
          ))
        ) : (
          <View>{!loading && <View>您暂时没有店铺</View>}</View>
        )}
      </ScrollView>
    );
  }
}
