import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: null,
    subject: null,
    me: null,
  },
  mutations: {
    setSubject (state, subject) {
      state.subject = subject;

      if (state.subjects && subject) {
        const index = state.subjects.findIndex((s) => s.id === subject.id);
        if (index !== -1) {
          Vue.set(state.subjects, index, subject);
          console.log(state.subjects[index], subject, state.subjects[index] === subject);
        }
      }
    },
    setSubjects (state, subjects) {
      state.subjects = subjects;
    },
    setMe (state, me) {
      state.me = me;
    },
  },
  actions: {},

  getters: {
    votedFor (state, getters) {
      if (state.me) {
        if (state.subject) {
          const votedForSubject = state.subject.votes.some((v) => {
            return v.voter === state.me.userId;
          });

          if (votedForSubject) {
            return state.subject.id;
          }
        }

        if (state.subjects) {
          const votedFor = state.subjects.find((s) => {
            return s.votes.some((v) => {
              return v.voter === state.me.userId;
            });
          });

          if (votedFor) {
            return votedFor.id;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },
});
