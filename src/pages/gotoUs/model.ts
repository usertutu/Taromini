export default {
  namespace: 'gotoUs',

  state: {
    count: 0,
  },

  reducers: {
    add(state) {
      const count = state.count + 1;
      return { ...state, count };
    },

    minus(state) {
      const count = state.count - 1;
      return { ...state, count };
    },
  },
};
