const countStore = {
  namespaced: true,
  state: {
    count: 1,
  },
  getters: {
    doubledCount: state => state.count * 2,
    quadrupledCount: (state, getters) => getters.doubledCount * 2,
  },
  mutations: {
    setCount: (state, newCount) => state.count = newCount,
  },
  actions: {
    setCount: function ({ commit }, newCount) {
      commit('setCount', newCount)
    },
  }
};

export default countStore;