import request from '../../utils/request';

export const postLogin = (code, name, storeId) =>
  request('user/login', {
    method: 'POST',
    data: { code, nickName: name, storeId },
  });
