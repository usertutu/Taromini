import request from '../../utils/request';

export default {
  getOpenDoorCode() {
    return request('get_open_door_qrcode', {
      method: 'GET',
      withAccessToken: true,
    });
  },
};
