import {
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
  ScrollView,
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import { AtInput } from 'taro-ui';
import './index.less';
import Tools from '../../utils/tools';
import Store from './components/Store';
import Recommend from './components/Recommend';
//引入图片
import scan from './../../images/scan.png';
import searchPic from './../../images/search.png';
//引入新闻前缀URL
import { newsOrigin } from './../../config/index';
import Service from '../category/service';
const topGoodsBack1 = require('./img/top-background.png');
const topGoodsBack2 = require('./img/top2-background.png');
const good1 = require('./img/top-goods1.png');
const good2 = require('./img/top-goods2.png');
const milkGood1 = require('./img/milkGoods.png');
const milkGood2 = require('./img/milkGoods2.png');
const discount = require('./img/discount-back.png');
const get = require('./img/get.png');

//使用‘home界面’的数据
interface IHome {
  count: number;
  banners: any;
  news: any;
  userInfo: any;
  currentStore: any;
  categories: any;
  recommendationList: any;
}

//使用‘授权页’的model中的数据
interface IAuthorization {
  token: any;
}

interface IProps {
  dispatch?: any;
  home: IHome;
  //调用‘授权页’的model
  authorization: IAuthorization;
  common: any;
}

//新增model的时候，需要定义接口， 定义接口中需要数据，需要再定义接口进行声明
@connect(({ authorization, home, common }) => ({ authorization, home, common }))
export default class Home extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '厨小贤',
    navigationBarBackgroundColor: '#10a29f',
    navigationBarTextStyle: 'white',
    // backgroundColor: '#10a29f',
    backgroundColor: '#eeeeee', //下拉背景颜色
    enablePullDownRefresh: true, //是否开启下拉刷新
    onReachBottomDistance: 50,
    backgroundTextStyle: 'dark', //下拉loading颜色
  };

  state: {
    optionStoreStatus: boolean;
    search: string;
    searchPlaceholder: string;
    currentPage: number;
    pageSize: number;
    total: number;
    list: any;
  } = {
    optionStoreStatus: false,
    search: '',
    searchPlaceholder: '手工酸奶',
    currentPage: 1, // 当前页
    pageSize: 10, // 数量
    total: 0,
    list: [], // 数据列表
  };

  async componentWillMount() {
    console.log('componentWillMount');
    // 获取店铺
    const { dispatch } = this.props;
    await dispatch({
      type: 'home/init',
    });

    // 查询为您推荐
    this.queryList();
    Taro.showShareMenu({
      withShareTicket: true,
    });
  }

  //下拉事件
  async onPullDownRefresh() {
    try {
      const { dispatch } = this.props;
      await dispatch({
        type: 'home/init',
      });
      // 查询为您推荐
      this.queryList();
    } catch (error) {
      console.log('code onPullDownRefresh error', error);
    } finally {
      Taro.stopPullDownRefresh();
    }
  }

  async componentDidShow() {
    const { dispatch } = this.props;
    const resultToken = Taro.getStorageSync('accessToken');
    console.log('home componentWillMount resultToken', resultToken);
    if (resultToken) {
      await dispatch({
        type: 'home/getUser',
      });
      //从本地缓存中取出
      const doorKey = Taro.getStorageSync('doorKey');
      if (doorKey) {
      } else {
        const { userInfo } = this.props.home;
        console.log('home index componentWillMount userInfo', userInfo);
        if (userInfo['phone.number']) {
          // Taro.showToast({
          //   title: `您好${userInfo.nickname}，欢迎您来到合豚！`,
          //   icon: 'none',
          //   duration: 2000,
          // })
        } else {
          Taro.redirectTo({
            url: '../bindPhoneNum/index',
          });
        }
      }
    } else {
    }
  }

  // 获取为你推荐列表
  async getList() {
    const result = await Service.getCategoryItem({
      pageSize: 10,
      currentPage: 1,
    });
    this.setState({
      recommendationList: result.list,
    });
    console.log('resultList', result);
  }

  //跳转-web网页
  gotoWeb(src) {
    console.log('home index --- id', src);
    let url = newsOrigin + src;
    console.log('home index --- url', url);
    Taro.navigateTo({
      url: `./../gotoUs/index?url=${url}`,
    });
  }

  //扫码事件
  async onOpenDoor() {
    const resultToken = await Taro.getStorageSync('accessToken');
    if (resultToken) {
      const { result: code } = await Taro.scanCode();
      console.log('home onOpenDoor code', code);
      if (!code) {
        console.log('-------------------------code is NaN');
        Taro.showToast({
          title: '请扫描商品条码^_^',
          icon: 'none',
          duration: 1000,
        });
        return;
      }
      const { dispatch } = this.props;
      if (code.indexOf('hetun') != -1) {
        const faceToken = code.split('open-door/')[1];
        let id;
        let timestamp;
        let hash;
        console.log('home onOpenDoor faceToken:', faceToken);
        const arr = faceToken.match(/[a-zA-Z0-9]+/g);
        console.log('home onOpenDoor arr:', arr);
        if (arr.length === 4) {
          id = arr[0];
          timestamp = arr[2];
          hash = arr[3];
        } else {
          id = arr[0];
          timestamp = '';
          hash = arr[1];
        }
        console.log('home onOpenDoor id:', id);
        console.log('home onOpenDoor timestamp:', timestamp);
        console.log('home onOpenDoor hash:', hash);
        await dispatch({
          type: 'home/open',
          payload: { id, timestamp, hash },
        });
      } else {
        console.log('------------------------- code is number');
        await dispatch({
          type: 'common/addToCartByCode',
          payload: code,
        });
        Taro.switchTab({ url: '../cart/index' });
      }
    } else {
      Taro.navigateTo({
        url: '../authorization/index',
      });
    }
  }

  //敬请期待 轻提示
  gotoNull() {
    Taro.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 1000,
    });
  }

  //显示选择商店
  showOptionStore() {
    this.setState({
      optionStoreStatus: !this.state.optionStoreStatus,
    });
  }
  //选择商店
  async choseStore(item: any) {
    const { dispatch } = this.props;
    // 判断是否同一店铺
    if (item.id != this.props.home.currentStore.id) {
      // 放一份放在本地
      Taro.setStorageSync('currentStore', item);
      await dispatch({
        type: 'home/save',
        payload: { currentStore: item },
      });
      // 重新刷新首页
      await dispatch({
        type: 'home/init',
      });
      this.setState(
        {
          list: [],
        },
        () => {
          // 重新查询为您推荐列表
          this.queryList();
        },
      );
    }
    this.setState({
      optionStoreStatus: !this.state.optionStoreStatus,
    });
  }

  // 搜索框内容存入state
  searchChange(value) {
    this.setState({
      search: value,
    });
  }

  // 搜索
  onActionClick() {
    console.log('开始搜索');
    console.log('this.state.searchPlaceholder', this.state.searchPlaceholder);
    let key = '';
    if (!this.state.search) {
      key = this.state.searchPlaceholder;
    } else {
      key = this.state.search;
    }
    Tools.go('../searchResult/index?search=' + key);
  }

  // 上拉加载
  onScrollToLower() {
    console.log('上拉加载');
    const { currentPage, total } = this.state;
    const pageCount = Tools.pageCount(total, 10);
    if (currentPage < pageCount) {
      this.setState({ currentPage: currentPage + 1 }, () => {
        this.queryList();
      });
    } else {
      Taro.showToast({ title: '到底啦！', duration: 2000, icon: 'none' });
    }
  }

  // 查询列表
  async queryList() {
    try {
      this.setState({
        loading: true,
      });
      const { pageSize, currentPage, list } = this.state;
      const storeId = this.props.home.currentStore.id;
      const result = await Service.getCategoryItem({
        pageSize,
        currentPage,
        storeId,
        recommend: 'true', // 推荐
      });
      result.list.map((item) => {
        list.push(item);
      });
      console.log('为您推荐', list);

      const total = result.pagination.total;
      this.setState({ total });
      // console.log('result', result);
    } catch (error) {
      console.error('Store queryList ', error);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    let banners: any = [];
    let news: any = [];
    // 分类
    let categories: any = [];
    if (this.props.home) {
      banners = this.props.home.banners;
      news = this.props.home.news;
      categories = this.props.home.categories;
      console.log('home index banners', banners);
      console.log('home index News', news);
      console.log('home index categories', categories);
    }

    return (
      <ScrollView
        className="index"
        lowerThreshold={100}
        onScrollToLower={this.onScrollToLower.bind(this)}
        scrollY
      >
        <View className="main">
          {/* 扫一扫 */}
          <View className="scan" onClick={this.onOpenDoor}>
            <Image src={scan} />
          </View>

          {/* 所在位置 二维码按钮 合豚到家按钮 */}
          <View className="locationBGI">
            {/* <Image
              src="http://image.hetuntech.cn/locationBGI.png"
              mode="aspectFit"
              className="bg"
            ></Image> */}
            <View className="bg"></View>
            <View className="location" onClick={this.showOptionStore}>
              <View className="textBGI">
                <View className="position">
                  <Image src="http://image.hetuntech.cn/ht2NewPosition2.png" />
                </View>
                <Text className="text">
                  您所在的门店: {this.props.home.currentStore.name}
                  <View className="sjx" />
                </Text>
                {/* <View className="sjx" /> */}
              </View>
            </View>

            {/* 选择门店 */}
            {this.state.optionStoreStatus ? (
              <View className="optionStore">
                <View className="sjx" />
                <View className="StoreList">
                  <Store showOptionStore={this.choseStore.bind(this)}></Store>
                </View>
              </View>
            ) : null}

            {/* 搜索框 */}
            <View className="setPadding">
              <View className="searchBar">
                <Image src={searchPic} mode="aspectFit" />
                <AtInput
                  placeholderClass="placeholder"
                  name="search"
                  type="text"
                  placeholder={this.state.searchPlaceholder}
                  value={this.state.search}
                  onConfirm={this.onActionClick.bind(this)}
                  onChange={this.searchChange.bind(this)}
                  confirmType="search"
                />
              </View>
            </View>
          </View>

          <View className="setPadding">
            {/* 轮播图*/}
            <View className="banner">
              <Swiper
                className="test-h"
                indicatorColor="#999"
                indicatorActiveColor="#333"
                circular
                autoplay
              >
                {banners
                  ? banners.list.map((item) => (
                      <SwiperItem key={item.id}>
                        <View
                          className="demo-text-1"
                          onClick={this.gotoWeb.bind(this, 1)}
                        >
                          {/* <Image src={`${imageOrigin}${item.imageHash}`}/>   */}
                          <Image src={item.imageUrl} mode="scaleToFill" />
                        </View>
                      </SwiperItem>
                    ))
                  : null}
              </Swiper>
            </View>

            {/* 分类 */}
            <View className="classification">
              {categories.map((item) => (
                <View
                  key={item.name}
                  className="item"
                  onClick={() =>
                    Tools.go('../searchResult/index?itemCategoryId=' + item.id)
                  }
                >
                  <Image
                    src={item.imageUrl}
                    style={{ borderRadius: '50%' }}
                    mode="aspectFit"
                  ></Image>
                  <View className="title">{item.name}</View>
                </View>
              ))}
            </View>

            {/* 扫码 + 门店 */}
            <View className="topBar">
              <View className="Logo" onClick={this.onOpenDoor}>
                <Image
                  className="LogoImage"
                  src="http://image.hetuntech.cn/qidi/top/code.png"
                />
                <View className="text">扫码购物</View>
              </View>
              {/* <View
                className="Logo"
                onClick={() => Tools.go('../Code/index', false, true)}
              >
                <Image
                  className="LogoImage"
                  src="http://image.hetuntech.cn/qidi/top/code2.png"
                />
                <View className="text">进店二维码</View>
              </View> */}
              <View
                className="Logo"
                onClick={() => Tools.go('../address/index')}
              >
                <Image
                  className="LogoImage"
                  src="http://image.hetuntech.cn/qidi/top/shop.png"
                />
                <View className="text">门店</View>
              </View>
            </View>

            {/* 优惠券 红包 */}
            {/* <View className="activity">
              <View
                className="coupon"
                onClick={() => Tools.go('../getCoupon/index')}
              >
                <Image src={discount} className="discount">
                  <Image src={get} className="get"></Image>
                </Image>
              </View>
              <View
                className="top"
                onClick={() => {
                  Tools.go('../searchResult/index?itemCategoryId=10');
                }}
              >
                <Swiper
                  className="goodsSwiper"
                  indicatorColor="#999"
                  indicatorActiveColor="#333"
                  autoplay
                  vertical
                  circular
                >
                  <SwiperItem>
                    <View className="swiperItem">
                      <Image
                        src={good1}
                        style={{
                          width: '98rpx',
                          height: '89rpx',
                        }}
                      ></Image>
                      <Image
                        src={good2}
                        style={{
                          marginLeft: '20rpx',
                          width: '65rpx',
                          height: '88rpx',
                        }}
                      ></Image>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className="swiperItem">
                      <Image
                        src={good1}
                        style={{
                          width: '98rpx',
                          height: '89rpx',
                        }}
                      ></Image>
                      <Image
                        src={good2}
                        style={{
                          marginLeft: '20rpx',
                          width: '65rpx',
                          height: '88rpx',
                        }}
                      ></Image>
                    </View>
                  </SwiperItem>
                </Swiper>
                <Swiper
                  className="goodsSwiperBottom"
                  indicatorColor="#999"
                  indicatorActiveColor="#333"
                  autoplay
                  vertical
                >
                  <SwiperItem>
                    <View>
                      <Text className="goodsText">
                        爆款零食
                        <Text className="subTitle">店内热销量TOP10</Text>
                      </Text>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Text className="goodsText">
                        爆款零食
                        <Text className="subTitle">店内热销量TOP10</Text>
                      </Text>
                    </View>
                  </SwiperItem>
                </Swiper>
              </View>
              <View
                className="top"
                onClick={() => {
                  Tools.go('../searchResult/index?itemCategoryId=3');
                }}
              >
                <Swiper
                  className="goodsSwiper"
                  indicatorColor="#999"
                  indicatorActiveColor="#333"
                  circular
                  autoplay
                  vertical
                >
                  <SwiperItem>
                    <View className="swiperItem">
                      <Image
                        src={milkGood2}
                        style={{ width: '30rpx', height: '98rpx' }}
                      ></Image>
                      <Image
                        src={milkGood1}
                        style={{
                          marginLeft: '20rpx',
                          width: '114rpx',
                          height: '79rpx',
                        }}
                      ></Image>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className="swiperItem">
                      <Image
                        src={milkGood2}
                        style={{ width: '30rpx', height: '98rpx' }}
                      ></Image>
                      <Image
                        src={milkGood1}
                        style={{
                          marginLeft: '20rpx',
                          width: '114rpx',
                          height: '79rpx',
                        }}
                      ></Image>
                    </View>
                  </SwiperItem>
                </Swiper>
                <Swiper
                  className="goodsSwiperBottom"
                  indicatorColor="#999"
                  indicatorActiveColor="#333"
                  autoplay
                  vertical
                >
                  <SwiperItem>
                    <View>
                      <Text className="goodsText">
                        饮料专场
                        <Text className="subTitle">好品质放心选</Text>
                      </Text>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Text className="goodsText">
                        饮料专场
                        <Text className="subTitle">好品质放心选</Text>
                      </Text>
                    </View>
                  </SwiperItem>
                </Swiper>
              </View>
            </View> */}

            {/* 为你推荐 */}
            <Recommend list={this.state.list} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
