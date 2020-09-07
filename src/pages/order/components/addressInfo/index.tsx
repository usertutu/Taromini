import {
  Button,
  View,
  Text,
  Image,
  Checkbox,
  CheckboxGroup,
} from '@tarojs/components';
import Taro, { Component, Config } from '@tarojs/taro';

export default ({ item }) => {
  // if (item.indexOf(';')) {
  //   return;
  // }
  let address = JSON.parse(item);
  // console.log('转换成功的地址', address);
  return (
    <View>
      <View>
        {address.userName} 手机号:{address.telNumber}
      </View>
      <View>{`${address.provinceName}${address.cityName}${address.detailInfo}`}</View>
    </View>
  );
};
