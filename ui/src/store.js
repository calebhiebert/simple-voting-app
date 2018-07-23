import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: null,
    subject: null,
  },
  mutations: {
    setSubject (state, subject) {
      state.subject = subject;
    },
    setSubjects (state, subjects) {
      state.subjects = subjects;
    },
  },
  actions: {},
});
