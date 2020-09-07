import { Button, View, Text, Image, WebView } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';

interface IHome {
  count: number;
  url: any;
}

interface IProps {
  dispatch?: any;
  gotoUs: IHome;
}



@connect(({ gotoUs }) => ({ gotoUs }))
export default class GotoUs extends Component<IProps> {
 
  config: Config = {
    navigationBarTitleText: '',
  };

  constructor () {
    super(...arguments)

    //数据
    this.state = {
      url: ''
    }
  }

  componentWillMount() {  
    //this.$router获取 Taro.navigateTo 传来的地址参数
    console.log('gotoUs index WillMount router---',this.$router.params.url);
    let jumpUrl = this.$router.params.url
    console.log('gotoUs index WillMount jumpUrl---', jumpUrl);
    this.setState({
      url: jumpUrl
    })
  }

  
  render() {
    const {
      dispatch,
      gotoUs: { count },
    } = this.props;
    return (
      <View className="index">
        <WebView src={this.state.url}></WebView>
      </View>
    );
  }
}
