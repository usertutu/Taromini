// 分类Item的定义接口
export interface IGoodsItem {
  code: string; // 条形码
  cost: number; // 花费
  price: number; // 价格
  membersPrice: number; // 会员价
  originalPrice: any; // 旧价格
  title: string; // 标题
  status: string; // 状态
  order: any;
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  imageHash: null;
  itemCategoryId: number; //目录id
  imageUrl: string; // 图片
}
