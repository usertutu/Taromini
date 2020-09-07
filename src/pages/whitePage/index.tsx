import {
  Button,
  View,
  Text,
  Image,
  Swiper,
  SwiperItem,
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import urlParse from 'url-parse';
import './index.less';

interface IHome {
  count: number;
}

interface IProps {
  dispatch?: any;
  whitePage: IHome;
}

@connect(({ whitePage }) => ({ whitePage }))
export default class WhitePage extends Component<IProps> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '厨小贤',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    console.log(
      '----------------------------------Authorization componentWillMount this.$router.params',
      this.$router.params,
    );
    console.log(
      '----------------------------------Authorization componentWillMount this.$router.params.q',
      this.$router.params.q,
    );
    const str = this.$router.params.q;
    const rawUrl = decodeURIComponent(str);
    const query = urlParse(rawUrl, true).query;
    const faceToken = query.faceToken;
    console.log(
      '----------------------------------Authorization componentWillMount faceToken',
      faceToken,
    );

    dispatch({
      type: 'common/saveFaceToken',
      payload: faceToken,
    });
    // const { faceToken } = this.$router.params
    // console.log(faceToken);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const {
      dispatch,
      whitePage: { count },
    } = this.props;
    return <View className="index"></View>;
  }
}
