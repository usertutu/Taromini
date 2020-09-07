import request, { parseGetParams } from '../../utils/request';

export default {
  // 获取分类
  getCategories(options: {
    pageSize?: number;
    currentPage?: number;
    id?: string;
    storeId?: number;
  }) {
    const params = parseGetParams(options);
    return request(`item_categories${params}`, {
      method: 'GET',
    });
  },
  // 获取分类的子项
  getCategoryItem(options: {
    pageSize?: number;
    currentPage?: number;
    itemCategoryId?: number;
    codeLike?: string;
    titleLike?: string;
    code?: string;
    storeId?: any;
    recommend?: string;
  }) {
    const params = parseGetParams(options);
    return request(`items${params}`, {
      method: 'GET',
    });
  },
};
