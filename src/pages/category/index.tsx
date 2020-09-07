import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { AtTabsPane, AtTabs, AtSearchBar } from 'taro-ui';
import Goods from './components/Goods';
import Service from './service';
import './index.less';
import Tools from '../../utils/tools';

interface IProps {
  dispatch?: any;
  common: any;
  home: any;
}
interface IState {
  current: number;
  tabsHeight: number;
  searchValue: string;
  category: any;
  backCurrent: number;
  storeId: any;
}
@connect(({ common, home }) => ({ common, home }))
export default class Category extends Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '分类',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    backgroundColor: '#eeeeee', //下拉背景颜色
  };
  constructor() {
    super(...arguments);
    this.state = {
      current: 0, // 当前tab项索引
      tabsHeight: 726, // 页面高度
      searchValue: '', //搜索的值
      category: [], // 分类名
      backCurrent: 0, // 保存离开之前的分类
      storeId: '',
    };
  }

  async componentWillMount() {
    console.log('componentWillMount common current');

    // 获取传递的current
    // console.log('', this.$router.params); // 输出 { current:1 }
    const { current } = this.props.common.current;
    // 获取屏幕高度
    const result = Taro.getSystemInfoSync();
    this.setState({
      tabsHeight: result.windowHeight - 42,
      current: (current ? current : 0) as number,
    });
    this.queryCategories();
  }

  async queryCategories() {
    const storeId = this.props.home.currentStore.id;
    // 查询分类
    const { list } = await Service.getCategories({
      pageSize: 30,
      currentPage: 1,
      storeId,
    });
    // 生成分类列表
    const category = list.map(item => {
      return {
        id: item.id,
        title: item.name,
      };
    });
    this.setState({
      category,
    });
  }

  componentDidShow() {
    // 处理更换店面刷新逻辑
    const currentStoreId = this.props.home.currentStore.id;
    if (currentStoreId != this.state.storeId) {
      this.queryCategories();
      this.setState({
        current: 0,
      });
    } else {
      this.setState({
        current: this.state.backCurrent,
      });
    }
  }

  // 处理搜索输入
  handleSearchValueChange(value) {
    this.setState({
      searchValue: value,
    });
  }

  componentDidHide() {
    this.setState({
      current: -1,
      backCurrent: this.state.current,
    });
  }

  // 搜索点击
  handleActionClick() {
    // Taro.showToast({ title: '您点击了搜索', icon: 'none' });
    this.setState({
      searchValue: '',
    });
    Tools.go('../searchResult/index?search=' + this.state.searchValue);
  }

  // 处理tab切换
  handleTabClick(value) {
    // this.props.dispatch({
    //   type: 'common/goCategory',
    //   payload: { current: value },
    // });
    this.setState({
      current: value,
    });
  }

  render() {
    const { tabsHeight, searchValue, category } = this.state;
    // const { current } = this.props.common;
    const { current } = this.state;
    return (
      <View className="index">
        <AtSearchBar
          showActionButton
          actionName="搜索"
          value={searchValue}
          onChange={this.handleSearchValueChange.bind(this)}
          onActionClick={this.handleActionClick.bind(this)}
        />
        <AtTabs
          current={current}
          scroll
          className="tabs"
          tabDirection="vertical"
          tabList={category}
          height={tabsHeight + 'px'}
          onClick={this.handleTabClick.bind(this)}
          animated={false}
        >
          {category.map((item, index) => (
            <AtTabsPane
              tabDirection="vertical"
              current={current}
              index={index}
              key={item.id}
            >
              <Goods
                currentTabs={current}
                currentIndex={index}
                categoryId={item.id}
                tabsHeight={tabsHeight}
              />
            </AtTabsPane>
          ))}
        </AtTabs>
      </View>
    );
  }
}
