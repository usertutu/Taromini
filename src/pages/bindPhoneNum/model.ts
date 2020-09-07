import Taro from  '@tarojs/taro'
import { sendSmsCode, submit } from './service'

export default {
  namespace: 'bindPhoneNum',

  state: {},

  effects: {
    //发送验证码
    *sendCode({payload:phone}, { call }){
      console.log('bindPhoneNum model sendCode --- phone:', phone);
      const response = yield call (sendSmsCode, phone)
      console.log('bindPhoneNum model sendCode --- response:', response);
      
    },

    *submit({payload}, {call}){
      console.log('bindPhoneNum model submit');
      try {
        //需要在try里面进行调用调用接口操作
        const {phone, code} = payload;
        console.log('bindPhoneNum model submit --- phone + code:', phone, code);
        let coder = code + ''
        const response = yield call(submit, phone, coder)
        console.log('bindPhoneNum model submit --- response:', response);
        Taro.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          Taro.switchTab({
            url: '../users/index'
  
            })
        }, 1000) 
      } catch (error) {
        console.log('bindPhoneNum model submit --- error:', error);
        Taro.showToast({
          title: '请核对验证码！',
          icon: 'none',
          duration: 1500
        })
      }


    }

  },

  reducers: {
   
  },
};
