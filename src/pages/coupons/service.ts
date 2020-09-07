import request from '../../utils/request';

export const getCoupons = status =>
  request(`user_coupons?status=${status}`, {
    method: 'GET',
    withAccessToken: true,
  });
