/**
 * pages页面快速生成脚本
 * 用法：npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run tep test');
  process.exit(0);
}

//页面模板
const indexTep = `
import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import './index.less'

interface Props {
  dispatch: any;
}




// @connect(({ ${dirName} }) => ({
//     ...${dirName},
// }))
export default class ${capPirName} extends Component<Props> {
  config:Config = {
    navigationBarTitleText: '${capPirName}'
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    
    return (
      <View className='${dirName}'>
     
      </View>
    )
  }
}
`;

// scss文件模版
const scssTep = `
.${dirName}{
    width: 100%;
}
`;

//model模板
const modelTep = `
// import Taro from '@tarojs/taro';

export default {
  namespace: '${dirName}',
  state: {
  },

  effects: {},

  reducers: {}

}
`;

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1
fs.writeFileSync(`index.tsx`, indexTep); //tsx
fs.writeFileSync(`index.less`, scssTep); // less
fs.writeFileSync('model.ts', modelTep); // model
process.exit(0);
