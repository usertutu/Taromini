import request from '../../utils/request';

export const getCoupons = () => request('events/1', {
    method: 'GET',
    withAccessToken: true,
  });

  export const postGain = (activityID, couponID) => {
    console.log('getCoupon service activityID, couponID',activityID, couponID);

    return request('user_coupons', {
    method: 'POST',
    data:{
      couponId: couponID,
      eventId: activityID,
    },
    withAccessToken: true,
  });
}

export const getUserInfo = () => request('user/info', {
  method: 'GET',
  withAccessToken: true,
});

export const getUserCoupons = () => request('user_coupons',{
  withAccessToken: true,
})
  