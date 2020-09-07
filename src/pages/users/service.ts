import request, { parseGetParams } from '../../utils/request';

export const getUserInfo = () =>
  request('user/info', {
    method: 'GET',
    withAccessToken: true,
  });

export const getStoreInfo = (options: { id?: any }) => {
  // const params = parseGetParams(options);
  return request('store/get_store_info', {
    data: options,
    method: 'POST',
    // withAccessToken: true,
  });
};
export const getStoreInfoMessage = (options: {
  id?: any;
  pageSize?: number;
  currentPage?: number;
}) => {
  const params = parseGetParams(options);
  return request('store/get_store_info_message' + params, {
    data: options,
    method: 'GET',
  });
};
