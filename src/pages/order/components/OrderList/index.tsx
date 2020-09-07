import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import AddressInfo from '../addressInfo';
import tools from '../../../../utils/tools';
import { getOrders } from '../../service';
// import position from '../../../images/position.png';
// import {  } from 'taro-ui';
import './index.less';
//引入moment
var moment = require('moment');
moment.locale('zh-cn');

interface IProps {
  dispatch?: any;
  type: string; // 订单类型
  status: string; // 订单状态
}

export default class Order extends Component<IProps> {
  state: {
    currentPage: number;
    pageSize: number;
    hasMore: boolean;
    list: any;
    loading: boolean;
    tabsHeight: number;
  } = {
    currentPage: 1, // 当前页
    pageSize: 10, // 数量
    hasMore: true, // 是否还有更多
    list: [], // 数据列表
    loading: true, // 是否正在加载
    tabsHeight: 726, // 高度计算
  };

  async componentWillMount() {
    // 获取屏幕高度
    const result = Taro.getSystemInfoSync();
    this.setState({
      tabsHeight: result.windowHeight,
    });
  }

  async componentDidShow() {
    this.queryOrder();
  }

  // 查询订单
  async queryOrder() {
    try {
      Taro.showLoading({ title: '正在加载中...' });
      const { pageSize, currentPage } = this.state;
      const { type, status } = this.props;
      const result = await getOrders({ pageSize, currentPage, type, status });
      const { list, pagination } = result;
      console.log('orders', list);
      if (list.length != 0) {
        // 合并数组
        let newList = [...this.state.list, ...list];
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
          hasMore: false,
        });
      }
    } catch (error) {
      console.error('OrderList queryOrder ', error);
    } finally {
      this.setState({
        loading: false,
      });
      Taro.hideLoading();
    }
  }
  // 上拉加载
  handleScrollToLower() {
    // 判断有没有更多数据
    if (this.state.hasMore) {
      // 不能在加载中触发请求
      if (!this.state.loading) {
        console.log('触发onScrollToLower');
        this.queryOrder();
      }
    } else {
      Taro.showToast({
        title: '已经到底啦~',
        icon: 'none',
      });
    }
  }

  //跳转页面
  handleClick(value) {
    console.log('order handleClick value', value);
    //用于监听跳转页面
    this.setState({
      current: value,
    });
  }

  //价格换算
  price(value) {
    let num = value / 100;
    let price = num.toFixed(2);
    return price;
  }

  render() {
    const { list, tabsHeight, loading } = this.state;
    // console.log('Order render list', list);

    return (
      <View className="index">
        {!loading && (
          <View className="main">
            <ScrollView
              scrollY
              style={`height:${tabsHeight + 'px'}`}
              lowerThreshold={200}
              onScrollToLower={this.handleScrollToLower.bind(this)}
            >
              {list.length ? (
                <View className="finish">
                  {list.map((order: any) => (
                    //订单块
                    <View className="listInfo" key={order.id}>
                      {/* 订单ID */}
                      <View className="listID">
                        <Text>订单编号:</Text>
                        <Text style="color: #484848">{order.trade}</Text>
                      </View>

                      {order.sinceCode && (
                        <View
                          className="sinceCode"
                          onClick={() => {
                            tools.go(
                              `/pages/order/pickCode/index?code=${order.sinceCode}&store=${order.store.name}`,
                            );
                          }}
                        >
                          取货码:{order.sinceCode}
                        </View>
                      )}

                      {/* 订单物品列表 */}
                      <View className="goodslist">
                        {order.items.map(item => (
                          //订单物品
                          <View className="goods" key={item.id}>
                            <View className="goodsPic">
                              <View className="floor">
                                <Image src={item.imageUrl} className="gPic" />
                              </View>
                            </View>

                            <View className="goodsInfo">
                              <View className="text">
                                <View className="name">{item.title}</View>
                                <View className="sizi">{item.number}</View>
                              </View>
                            </View>

                            <View className="goodsPrice">
                              <View className="text">
                                <View className="price">
                                  ¥ {this.price(item.orderItem.price)}
                                </View>
                                <View className="goodsNum">
                                  x {item.orderItem.number}
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                      {order.address && (
                        <View className="address">
                          <View className="title">配送地址:</View>
                          <View className="addressInfo" style="color: #484848">
                            <AddressInfo item={order.address}></AddressInfo>
                          </View>
                        </View>
                      )}
                      {/* 订单概要 */}
                      <View className="summary">
                        <View className="sum">{order.title}</View>
                        <View className="sum">
                          购买方式:
                          {(() => {
                            switch (order.type) {
                              case 'now':
                                return '门店直购';
                              case 'since':
                                return '店内自提';
                              case 'distribution':
                                return '上门配送';
                              default:
                                return '门店直购';
                            }
                          })()}
                        </View>
                        <View className="time">
                          {moment(order.createdAt).format('YYYY-MM-DD HH:mm')}
                        </View>
                        <View className="position">
                          {/* <Image src={position} /> */}
                          购买商品门店：{order.store.name}
                        </View>
                        <View className="sumPrice">
                          合计： ¥ {this.price(order.amount)}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="msg">
                  <View>
                    <Image src="http://image.hetuntech.cn/strore/emptyOrder.png" />
                  </View>
                  <View style="margin-top:40px;">
                    您暂时还没有订单，去商店逛逛吧!
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}
