import request, { parseGetParams } from '../../utils/request';

export const getItems = () => request('items');

export const getOrders = (options: {
  currentPage?: number;
  pageSize?: number;
  type?: string;
  status?: string;
}) => {
  const params = parseGetParams(options);
  return request('orders' + params, {
    method: 'GET',
    withAccessToken: true,
  });
};

//获取商品
export const getItem = code => request(`items/${code}`);

//付款
export const postOrder = (items, couponId, type, address, storeId) =>
  request('orders', {
    method: 'POST',
    withAccessToken: true,
    data: { items, couponId: Number(couponId), type, address, storeId },
  });
