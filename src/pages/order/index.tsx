import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtButton, AtInputNumber } from 'taro-ui';
import Taro, { Component, Config } from '@tarojs/taro';
import OrderList from './components/OrderList';
import tools from '../../utils/tools';
import './index.less';
// import { connect } from '@tarojs/redux';

var moment = require('moment');
moment.locale('zh-cn');

interface IProps {
  dispatch?: any;
}

// @connect(({ common  }) => ({  common }))
export default class Order extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '订单',
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    backgroundColor: '#10a29f',
  };

  state: {
    current: number;
  } = {
    current: 0,
  };

  async componentWillMount() {
    const { current } = this.$router.params;
    console.log('current', current);
    this.setState({
      current: Number.parseInt(current),
    });
  }

  componentDidMount() {}

  //监听下拉刷新事件
  onPullDownRefresh() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'order/init',
    // });
    // setTimeout(function() {
    //   Taro.stopPullDownRefresh(); //停止下拉刷新
    // }, 1000);
  }

  //跳转页面
  handleClick(value) {
    console.log('current value', value);
    this.setState({
      current: value,
    });
  }

  render() {
    const tabList = [
      { title: '全部', type: '', status: '' },
      { title: '直购', type: 'now', status: 'completed' },
      { title: '自提', type: 'since', status: 'completed' },
      { title: '配送', type: 'distribution', status: 'completed' },
      { title: '已完成', type: '', status: 'completed' },
    ];

    return (
      <View className="index">
        <View className="main">
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
            swipeable={false}
          >
            {tabList.map((item, index) => {
              return (
                <AtTabsPane
                  key={item.title}
                  current={this.state.current}
                  index={index}
                  className="bottom"
                >
                  <OrderList type={item.type} status={item.status} />
                </AtTabsPane>
              );
            })}
          </AtTabs>
        </View>
      </View>
    );
  }
}
