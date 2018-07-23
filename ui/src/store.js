import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: null,
  },
  mutations: {
    setSubjects (state, subjects) {
      state.subjects = subjects;
    },
  },
  actions: {},
});
