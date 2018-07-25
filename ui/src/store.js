import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    subjects: null,
    subject: null,
    me: null,
    settings: {
      autoVoteOnClick: true,
      autoLogoutOnVote: false,
    },
  },
  mutations: {
    setSubject (state, subject) {
      if (state.subject === null) {
        state.subject = subject;
      } else {
        state.subject = { ...state.subject, ...subject };
      }

      if (state.subjects && subject) {
        const index = state.subjects.findIndex((s) => s.id === subject.id);
        if (index !== -1) {
          Vue.set(state.subjects, index, subject);
        }
      }
    },
    setSubjects (state, subjects) {
      state.subjects = subjects;
    },
    setMe (state, me) {
      state.me = me;
    },
    patchSubjectVote (state, vote) {
      if (state.subject) {
        if (!state.subject.votes) {
          state.subject.votes = [];
        }

        const index = state.subject.votes.findIndex((v) => v.id === vote.id);

        if (index !== -1) {
          Vue.set(state.subject.votes, index, vote);
        } else {
          state.subject.votes.push(vote);
        }
      }
    },
  },
  actions: {},

  getters: {
    isAdmin (state) {
      return router.currentRoute.query.admin === 'true';
    },
    votedFor (state, getters) {
      if (state.me) {
        if (state.subject && state.subject.votes) {
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
