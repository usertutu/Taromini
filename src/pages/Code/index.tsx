import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Service from './service';
import Tools from '../../utils/tools';
import { connect } from '@tarojs/redux';
import './index.less';
// const io = require('weapp.socket.io');
const cartImg = require('./img/cart-code.png');
const codeImg = require('./img/QR-code.png');
const QRCode = require('../../utils/weapp-qrcode');
const rpx2px: any = Taro.getSystemInfoSync().windowWidth / 750;
const arrowImg = require('./img/arrow-code.png');

interface IProps {
  dispatch: any;
  common: any;
}
interface IState {
  QRUrl: any;
  isOK: boolean;
  link: boolean;
}

let QRcodeTimer: any; // 定时器
let ScreenBrightness: number; // 备份屏幕亮度
// let socket: any;

// @ts-ignore
@connect(({ common }) => ({ common }))
export default class Code extends Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '进店码',
    navigationBarBackgroundColor: '#32a8bc',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true, //是否开启下拉刷新
    onReachBottomDistance: 50,
    backgroundTextStyle: 'dark', //下拉loading颜色
    backgroundColor: '#eeeeee', //下拉背景颜色
  };

  state = {
    QRUrl: '', // 二维码图片
    isOK: false, // 是否正常
    link: false, // 是否连接socket
  };

  async componentWillMount() {
    try {
      // const url = 'https://api.future.hetuntech.cn/openDoorByQrCode';
      // const UserInfo = await Service.getUserInfo();
      // socket = io(url, { query: { userId: UserInfo.id } });
      // socket.on('connect', () => {
      //   console.log('socket connected');
      //   this.setState({ link: true });
      // });
      // socket.on('receive', ({ data }) => {
      //   Taro.showModal({
      //     title: '提示',
      //     content: data.message,
      //     showCancel: false,
      //   });
      // });
      // socket.on('disconnect', async () => {
      //   Taro.showToast({
      //     title: '您与服务器的连接已断开',
      //   });
      //   if (socket) {
      //     socket('reconnect', () => {
      //       console.log('重新连接');
      //       this.setState({
      //         link: true,
      //       });
      //     });
      //   }
      // });
      this.drawCode();
    } catch (e) {
      this.setState({
        isOK: false,
      });
    }
  }

  componentWillUnmount() {
    // socket = null;
  }
  componentDidMount() {
    Taro.getScreenBrightness().then(res => {
      if (!ScreenBrightness) {
        // 备份屏幕亮度
        ScreenBrightness = res.value;
      }
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

  // 绘制二维码
  async drawCode() {
    const doorCode = await Service.getOpenDoorCode();
    // console.log('获取到doorCode', doorCode);
    let imgData = QRCode.drawImg(doorCode, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: parseInt(rpx2px),
    });
    // 先清空timer
    if (QRcodeTimer) {
      clearInterval(QRcodeTimer);
    }
    //定时刷新
    QRcodeTimer = setInterval(() => {
      this.drawCode();
    }, 1000 * 59);
    this.setState({
      QRUrl: imgData,
      isOK: true,
    });
  }

  //下拉事件
  onPullDownRefresh() {
    try {
      //订单查询
      this.drawCode();
    } catch (error) {
      console.log('code onPullDownRefresh error', error);
    } finally {
      Taro.stopPullDownRefresh();
    }
  }

  componentDidShow() {
    // 设置屏幕亮度
    Taro.setScreenBrightness({
      value: 0.8,
    });
  }

  componentDidHide() {
    // 清空定时器
    clearInterval(QRcodeTimer);
    // 还原屏幕亮度
    Taro.setScreenBrightness({
      value: ScreenBrightness,
    });
  }

  render() {
    const { QRUrl, isOK } = this.state;
    return (
      <View className="Code">
        <View className="container">
          <View className="title">二维码对准闸机扫描口刷码进店</View>
          <View className="content" onClick={this.drawCode.bind(this)}>
            {isOK ? (
              <Image className="codeImg" src={QRUrl} />
            ) : (
              <View>正在连接服务器...</View>
            )}
          </View>
          <View className="reload" onClick={this.drawCode.bind(this)}>
            <AtIcon value="reload" size="21rpx" color="#666666"></AtIcon>
            <Text style={{ marginLeft: '14rpx' }}>点击二维码</Text>
            <Text className="refresh">刷新</Text>
          </View>
        </View>
        <View className="other">
          <View
            className="actionItem"
            style={{ borderBottom: '4rpx dashed #fff' }}
            onClick={() => {
              Tools.go('/pages/shoppingGuide/index');
            }}
          >
            <View className="itemLeft">
              <Image className="itemImg" src={cartImg}></Image>
            </View>
            <View className="itemCenter">进店指南</View>
            <View className="itemRight">
              <Image className="itemImg" src={arrowImg}></Image>
            </View>
          </View>
          <View
            className="actionItem"
            style={{ marginTop: '20rpx' }}
            onClick={this.onOpenDoor.bind(this)}
          >
            <View className="itemLeft">
              <Image className="itemImg" src={codeImg}></Image>
            </View>
            <View className="itemCenter">扫码购物</View>
            <View className="itemRight">
              <Image className="itemImg" src={arrowImg}></Image>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
