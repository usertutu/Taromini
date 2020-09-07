import Taro from '@tarojs/taro';
import { getItem, postOrder } from '../pages/order/service';
import failure from '../images/failure.png';
import { postPhone } from '../pages/bindPhoneNum/service';

export default {
  namespace: 'common',

  state: {
    accessToken: Taro.getStorageSync('accessToken'),
    cartChecked: true,
    cartItems: [],
    newState: {},
    data: '',
    current: 0,
  },

  effects: {
    *saveFaceToken({ payload: faceToken }, { put }) {
      yield put({
        type: 'save',
        payload: { faceToken },
      });
      //检测用户是否授权过
      Taro.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            Taro.switchTab({
              url: '../home/index',
            });
          } else {
            Taro.switchTab({
              url: '../home/index',
            });
          }
        },
      });
    },
    *goCategory({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload,
      });
      Taro.switchTab({
        url: '/pages/category/index',
      });
    },
    //往购物车加商品
    *addToCartByCode({ payload: code }, { call, put, select }) {
      try {
        const resultToken = Taro.getStorageSync('accessToken');
        if (!resultToken) {
          Taro.navigateTo({ url: '/pages/authorization/index' });
          return;
        }

        //查询购物车是否有商品
        const cartItems = yield select(state => state.common.cartItems);
        //对比商品是否存在， 不存在为-1， 找到了则是找的商品的索引
        const index = cartItems.findIndex(
          currentValue => currentValue.code === code,
        );
        console.log('common addToCartByCode index', index);
        if (index === -1) {
          try {
            console.log('common addToCartByCode code', code);
            // Taro.showLoading({ title: '正在添加到购物车', mask: true });
            const gotItem = yield call(getItem, code);
            Taro.showToast({
              title: '成功加入购物车',
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            console.log('common addToCartByCode gotItem', gotItem);
            yield put({
              type: 'cartItemsAppend',
              payload: gotItem,
            });
          } catch (e) {
            Taro.showToast({
              title: '识别失败请重试',
              duration: 1000,
              mask: true,
              image: failure,
            });
          }
        } else {
          Taro.showToast({
            title: '成功加入购物车',
            icon: 'success',
            duration: 1000,
            mask: true,
          });
          yield put({
            type: 'addOneToCartItemNumerByIndex',
            payload: index,
          });
        }
      } catch (error) {
        console.log('addToCartByCode error', error);
      } finally {
        // Taro.hideLoading();
      }
      return true;
    },

    //付款
    *pay(
      { payload: { couponId, address, type, storeId } },
      { call, select, put },
    ) {
      const cartItems = yield select(state => state.common.cartItems);
      const cancel = 'requestPayment:fail cancel';
      console.log('common effects pay cartItems', cartItems);
      const items = cartItems.filter(cartItem => cartItem.checked);
      console.log('common effects pay items', items);
      console.log('common effects pay couponId', couponId);
      const response = yield call(
        postOrder,
        items.map(({ code, number }) => ({ code, number })),
        couponId,
        type,
        address,
        storeId,
      );
      console.log('common effects pay response', response);
      try {
        yield Taro.requestPayment(response);
        Taro.showToast({
          title: '支付成功',
          icon: 'succes',
          duration: 1000,
          mask: true,
        });
        Taro.switchTab({ url: '/pages/cart/index' });
        yield put({
          type: 'deleteCart',
        });
        yield put({
          type: 'coupons/delectCoupon',
        });
      } catch (e) {
        console.log('model goPay e', e);
        if (e.errMsg === cancel) {
          Taro.showToast({
            title: '您取消了支付',
            icon: 'none',
            duration: 1000,
          });
          yield put({
            type: 'coupons/delectCoupon',
          });
        } else {
          Taro.showToast({
            title: '支付失败',
            icon: 'failure',
            duration: 1000,
            mask: true,
            image: failure,
          });
        }
      }
    },

    //删除
    *delete(payload, { put }) {
      console.log('models common delete payload', payload);

      const { index } = payload;
      console.log('models common delete index', index);

      yield put({
        type: 'save',
        payload: { index },
      });

      yield put({
        type: 'deleteCheckedCartItems',
      });
    },

    //获取用户手机号
    *getPhoneNum({ payload }, { call, put }) {
      const { code, iv, encryptedData } = payload;
      console.log('getPhoneNum getPhoneNumber code', code);
      console.log('getPhoneNum getPhoneNumber iv', iv);
      console.log('getPhoneNum getPhoneNumber encryptedData', encryptedData);
      let phoneInfo = yield call(postPhone, code, iv, encryptedData);
      console.log('getPhoneNum getPhoneNumber response', phoneInfo);
      try {
        Taro.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1000,
        });
        setTimeout(function() {
          Taro.switchTab({
            url: '../home/index',
          });
        }, 1000);
      } catch (error) {
        console.log('common getPhoneNum --- error:', error);
        Taro.showToast({
          title: '绑定失败，请重试！',
          icon: 'none',
          duration: 1500,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    //往购物车增加一个商品
    cartItemsAppend(state, { payload: item }) {
      console.log('common reducers cartItemsAppend item', item);
      const { cartItems } = state;
      console.log('common reducers cartItemsAppend cartItems', cartItems);
      cartItems.unshift({ ...item, number: 1, checked: true });
      console.log('common reducers cartItemsAppend cartItems', cartItems);
      return {
        ...state,
        cartItems: cartItems.slice(),
      };
    },

    //购物车商品+1
    addOneToCartItemNumerByIndex(state, { payload: index }) {
      const { cartItems } = state;
      console.log('common', 'changeCartItemNumer', 'index', index);
      cartItems[index].number += 1;
      return {
        ...state,
        cartItems: cartItems.slice(),
      };
    },

    //改变购物车商品的选中状态
    changeCartItemsChecked(state, { payload: checkeds }) {
      const { cartItems } = state;
      console.log('common changeCartItemsChecked state', state);
      const currentCartChecked =
        checkeds.findIndex(currentValue => currentValue === 'all') !== -1;
      console.log(
        'common changeCartItemsChecked currentCartChecked',
        currentCartChecked,
      );
      const cartItemCheckedCodes = checkeds.filter(
        currentValue => currentValue !== 'all',
      );
      const newCartChecked = cartItemCheckedCodes.length === cartItems.length;
      console.log(
        'common changeCartItemsChecked newCartChecked',
        newCartChecked,
      );
      for (let i = 0; i < cartItems.length; i++) {
        const cartItem = cartItems[i];
        cartItem.checked =
          cartItemCheckedCodes.findIndex(
            currentValue => currentValue === cartItem.code,
          ) !== -1;
      }
      return {
        ...state,
        cartChecked: currentCartChecked,
        cartItems: cartItems.slice(),
      };
    },

    //购物车全选
    changeAllCheckedCartItems(state, { payload: check }) {
      const { cartItems } = state;
      for (let i = 0; i < cartItems.length; i++) {
        cartItems[i].checked = !check;
      }
      console.log('models changeAllCheckedCartItems cartItems', cartItems);
      return state;
    },

    //删除选中商品
    deleteCheckedCartItems(state) {
      const { cartItems, index } = state;
      console.log('models deleteCartItems cartItems', cartItems);
      console.log('models deleteCartItems index', index);
      cartItems.splice(index, 1);
      const uncheckedCartItems = cartItems;
      // const uncheckedCartItems = cartItems.filter(
      // currentValue => !currentValue.checked,
      // );
      console.log(
        'models deleteCartItems uncheckedCartItems',
        uncheckedCartItems,
      );

      const newState = {
        ...state,
        cartItems: uncheckedCartItems.slice(0),
      };
      // newState.cartItems.length=0;
      // for (var i = 0; i < uncheckedCartItems.length; i++) {
      //   newState.cartItems[i]=uncheckedCartItems[i];
      // }
      return newState;
    },

    //删除购物车所有商品
    deleteCartItems(state) {
      const { cartItems } = state;
      console.log('models deleteCartItems cartChecked', cartItems);
      cartItems.findIndex((currentValue, index) => {
        if (currentValue.checked !== false) {
          cartItems.splice(index, 1);
        }
      });
      console.log('models deleteCartItems cartItems', cartItems);
      return {
        ...state,
        cartItems: cartItems.slice(),
      };
    },

    //改变购物车商品数量
    changeCartItemNumer(state, { payload: { code, number } }) {
      // console.log('common', 'changeCartItemNumer');
      // console.log('common', 'changeCartItemNumer', 'state', state);
      console.log('common', 'changeCartItemNumer', 'code', code);
      console.log('common', 'changeCartItemNumer', 'number', number);
      const { cartItems } = state;
      // console.log('common', 'changeCartItemNumer', 'cartItems', cartItems);
      const index = cartItems.findIndex(
        currentValue => currentValue.code === code,
      );
      console.log('common', 'changeCartItemNumer', 'index', index);
      cartItems[index].number = number;
      const newState = {
        ...state,
        cartItems: cartItems.slice(),
      };
      // console.log('common', 'changeCartItemNumer', 'newState', newState);
      return newState;
    },

    //付款完成 后清空购物车
    deleteCart(state) {
      const { cartItems } = state;
      cartItems.splice(0, cartItems.length);
      const newCar = cartItems;

      console.log('model common newCar', newCar);

      const newState = {
        ...state,
        cartItems: newCar.slice(0),
      };

      return newState;
    },

    //清空购物车
    removeAll(state) {
      const { cartItems } = state;
      cartItems.splice(0, cartItems.length);
      return {
        ...state,
        cartItems: cartItems.slice(),
      };
    },
  },
};
