import Taro, { Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import OrderForm from './components/OrderForm';

import './index.less';
interface IProps {}
interface IState {
  current: number; // 当前的索引
  tabsHeight: number; // 页面高度
}

export default class ConfirmOrder extends Taro.Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '确认订单',
    backgroundTextStyle: 'light',
  };
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      tabsHeight: 726, // 页面高度
    };
  }

  componentWillMount() {
    // 获取屏幕高度
    const result = Taro.getSystemInfoSync();
    this.setState({
      tabsHeight: result.windowHeight,
    });
  }

  // 切换TABS
  handleTabsClick(value) {
    this.setState({
      current: value,
    });
  }

  render() {
    const { tabsHeight } = this.state;
    const tabList = [
      { title: '门店直购', type: 'now' },
      { title: '上门配送', type: 'distribution' },
      { title: '门店自提', type: 'since' },
    ];
    return (
      <AtTabs
        current={this.state.current}
        tabList={tabList}
        onClick={this.handleTabsClick.bind(this)}
        height={tabsHeight + 'px'}
      >
        {tabList.map((item, index) => (
          <AtTabsPane
            key={item.title}
            current={this.state.current}
            index={index}
          >
            <OrderForm tabsHeight={tabsHeight} type={item.type}></OrderForm>
          </AtTabsPane>
        ))}
      </AtTabs>
    );
  }
}
