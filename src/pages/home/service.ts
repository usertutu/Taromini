import request from '../../utils/request';

export const getItems = () => request('items');

export const getBanners = () => request('banners?position=top');

export const getNews = () => request('news');


//将facetoken和token传递给后端调用
export const bindFaceToken = faceToken =>
  request('user/bind_by_face_token', {
    method: 'POST',
    data: {
      faceToken,
    },
    withAccessToken: true,
  });

  export const postLogin = (code, name) => request('user/login', {
    method: 'POST',
    data: {code, nickName: name},
})


export const getOpenDoor = (id,timestamp,hash,userID) => request(`open-door?id=${id}${timestamp?`&timestamp=${timestamp}`:''}&hash=${hash}&userID=${userID}`,{
  method: 'GET',
});

export const getUserInfo = () => request('user/info', {
  method: 'GET',
  withAccessToken: true,
});