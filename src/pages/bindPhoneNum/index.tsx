import { Button, View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Taro, { Component, Config } from '@tarojs/taro';
import './index.less';
import { AtInput, AtForm, AtButton } from 'taro-ui';
import { any } from 'prop-types';

interface ICommon{

}

interface IUsers {
  userInfo: any;
}

interface IHome {
  count: number;
  phone: any;
  code: any;
  need: boolean;
  userCode: any;
}

interface IProps {
  dispatch?: any;
  bindPhoneNum: IHome;
  users: IUsers;
  common: ICommon
}

@connect(({ bindPhoneNum, users, common }) => ({ bindPhoneNum, users, common }))
export default class bindPhoneNum extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '绑定手机号码',
  };

  constructor() {
    super(...arguments);

    //数据
    this.state = {
      code: '',
      phone: '',
      disabled: false,
      second: 60,
      userCode: '',
    };
  }

  componentWillMount(){

      Taro.login().then( res => {
        console.log("resres", res);
        this.setState({
          userCode: res.code,
        }); 
      })
      
  }

  //检测disabled值的真假，决定返回值
  showTipText() {
    return this.state.disabled ? `${this.state.second}s后重试` : '发送验证码';
  }

  //监听手机号或验证码改变，并设置到this.state中
  handleInput(setName, setvalue) {
    this.setState({
      [setName]: setvalue,
    });
  }

  //申请发送验证码
  sendCode() {
    const { dispatch } = this.props;
    const { phone } = this.state;
    console.log('bindPhoneNum index sendCode --- phone:', phone);

    //调用方法发送手机号
    dispatch({
      type: 'bindPhoneNum/sendCode',
      payload: phone,
    });

    //如果disabled为真，则中断后面的操作
    if (this.state.disabled) return;

    //价格disabled设为真
    this.setState({
      disabled: true,
    });

    // 倒计时
    const timer = setInterval(() => {
      if (this.state.second > 0) {
        this.setState({
          second: this.state.second - 1,
        });
      } else {
        this.setState({
          second: 60,
          disabled: false,
        });
        clearInterval(timer);
      }
    }, 1000);
  }

  //向服务器发送 手机号和验证码
  submit() {
    const { dispatch } = this.props;
    const { phone, code } = this.state;

    console.log('bindPhoneNum index --- phone+code:', phone, code);

    dispatch({
      type: 'bindPhoneNum/submit',
      payload: { phone, code },
    });
  }

  needChange() {
    Taro.navigateTo({
      url: './../bindPhoneNum/bind',
    });
  }

  gotohome(){
    Taro.switchTab({
      url: './../users/index',
    });
  }

  gotoindex(){
    Taro.switchTab({
      url: './../home/index',
    });
    let doorKey = true
     //存入本地缓存
     Taro.setStorageSync('doorKey', doorKey)
     
  }
  

  //获取用户手机号
  getPhoneNumber(e) {
    console.log('bindPhone', e.detail.iv)
    console.log('bindPhone', e.detail.encryptedData)
    let iv = e.detail.iv;
    let encryptedData = e.detail.encryptedData;
    let code = this.state.userCode;
    console.log("bindPhoneNumber getPhoneNumber code", code);
    console.log("bindPhoneNumber getPhoneNumber iv", iv);
    console.log("bindPhoneNumber getPhoneNumber encryptedData", encryptedData);

    const { dispatch } = this.props
    dispatch({
      type: 'common/getPhoneNum',
      payload: { code, iv, encryptedData }
    })
  }

  render() {
    const {
      dispatch,
      bindPhoneNum: { count },
    } = this.props;

    console.log('bindPhoneNum index this.state', this.state);

    console.log('bindPhoneNUm index handleInput------', this.state.phone);

    console.log("render this.state.userCode", this.state.userCode); 

    const userInfo = this.props.users;
    console.log('用户信息---：', userInfo);
    // let num = Number(userInfo["phone.number"])
    let numS = userInfo["phone.number"];
    

    

    //判断是否显示绑定手机号
    // let need = Number(userInfo.content)
    let content;
    if (numS == null) {
      content = (
        <View className="main">
         
          {/* <AtInput
            className="text"
            title="手机号:"
            name="phoneNum"
            type="phone"
            placeholder="请输入手机号"
            value={this.state.phone}
            onChange={this.handleInput.bind(this, 'phone')}
          >
            {this.state.phone.length == 11 ? (
              <AtButton
                type="primary"
                className="butStyle gitNum"
                onClick={this.sendCode}
                disabled={this.state.disabled}
              >
                {/* <AtButton type='primary' className='butStyle gitNum'> */}
                {/* {this.showTipText()}
              </AtButton>
            ) : (
              <AtButton type="primary" className="butStyle gitNum" disabled>
                {this.showTipText()}
              </AtButton>
            )}
          </AtInput> */} 

          {/* <AtInput
            className="text textNum"
            title="验证码:"
            name="code"
            border={false}
            type="Number"
            placeholder="请输入验证码"
            value={this.state.code}
            onChange={this.handleInput.bind(this, 'code')}
          />

          <AtButton
            type="primary"
            className="butStyle submit"
            onClick={this.submit}
          >
            绑定/更改
          </AtButton> */}

          <View className="bindPhone">
              
              <View className="text1">绑定手机号，享受专属优惠卷！</View>
              <View className="text2">为了给小伙伴们提供更好的服务，小豚希望您可以绑定手机号，完成后即可领取小豚准备的优惠券！</View>
              <Image src="http://image.hetuntech.cn/xhtlogo.png"></Image>
              <Button openType="getPhoneNumber" onGetPhoneNumber={this.getPhoneNumber}>一键绑定手机号</Button>
          </View>

          <View className="del" onClick={this.gotoindex}>
            <Image src="http://image.hetuntech.cn/gogogodel.png"></Image>
          </View>

        </View>
      );
    } else {
      content = (
        <View className="changeBox" >
          <View className="change" onClick={this.needChange} >
            <View className="title">修改手机号:</View>
            <View className="phoneNum">{numS}</View>
            <View className="iconR">></View>
          </View>

          <View className="gotohome" onClick={this.gotohome}>
            返回
          </View>
        </View>
        
      );
    }

    return (
      <View className="index">

        {content}

      </View>
    );
  }
}
