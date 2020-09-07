import Taro from '@tarojs/taro';
import { apiOrigin, noConsole } from '../config';

interface IOptions {
  method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
    | undefined;
  data: object;
  withAccessToken?: boolean;
}

interface IHeader {
  'Content-Type': 'application/json';
  Authorization?: string;
}
/**
 * 解析对象转成get请求参数
 * @param options 参数对象
 */
export function parseGetParams(options: any) {
  let params = '';
  if (options) {
    const keys = Object.keys(options);
    params = keys.reduce((value, item, index) => {
      // console.log('item', item, 'value', value, 'index', index);
      let params = value;
      if (index === 0) {
        params += `?${item}=${options[item]}`;
      } else {
        params += `&${item}=${options[item]}`;
      }
      return params;
    }, '');
  }
  return params;
}

export default async (path, newOptions?) => {
  const options: IOptions = {
    method: 'GET',
    data: {},
    withAccessToken: false,
    ...newOptions,
  };
  if (!noConsole) {
    console.log('src utils request path', path);
    console.log('src utils request options', options);
  }
  const header: IHeader = {
    'Content-Type': 'application/json',
  };
  if (options.withAccessToken) {
    header.Authorization = `Bearer ${Taro.getStorageSync('accessToken')}`;
  }
  try {
    const requestData = {
      url: apiOrigin + path,
      data: options.data,
      header,
      method: options.method,
    };
    console.log('requestData', requestData);
    const res = await Taro.request(requestData);
    const { statusCode, data } = res;
    console.log('src utils request statusCode', statusCode);
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log('src utils request path', path);
        console.log('src utils request options', options);
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  } catch (error) {
    console.log('src utils request error', error);
    //catch需要将值返回，在model中catch才会接受到返回值
    throw error;
  }
};
