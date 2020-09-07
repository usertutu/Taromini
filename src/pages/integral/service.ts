import request from '../../utils/request';

export const getUserInfo = () => request('user/info', {
  method: 'GET',
  withAccessToken: true,
});


