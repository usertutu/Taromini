import request from '../../utils/request';

export const sendSmsCode = phone => {
    console.log('bindPHoneNum service sendSmsCode --- phone:', phone);
    return request('user/get_code', {
      method: 'POST',
      data: { phone },
      withAccessToken: true,
    });
  };



export const submit = (phone, code) =>{
    console.log('bindPHoneNum service sendSmsCode --- phone, code:', phone, code);
    
    return request('user/bind_phone',{
        method: 'POST',
        data: {phone, code},
        withAccessToken: true,
    })
}

export const postPhone = (code, iv, encryptedData) => request('user/phone_by_wx',{
    method: 'POST',
    data: {code, iv, encryptedData},
    withAccessToken: true,
})