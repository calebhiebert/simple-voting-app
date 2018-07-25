import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

Vue.use(Vuex);

let toastTimeout = null;

export default new Vuex.Store({
  state: {
    subjects: null,
    subject: null,
    me: null,
    toast: '',
    settings: {
      autoVoteOnClick: true,
      autoLogoutOnVote: false,
      editHistoryVisible: false,
    },
  },
  mutations: {
    toast (state, toast) {
      state.toast = toast;

      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      toastTimeout = setTimeout(() => {
        state.toast = '';
      }, 2500);
    },

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
    setting (state, { setting, value }) {
      state.settings[setting] = value;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
  },
  actions: {
    loadSettings (ctx) {
      const settings = localStorage.getItem('settings');

      if (settings !== null) {
        const parsedSettings = JSON.parse(settings);

        for (const setting in parsedSettings) {
          ctx.commit('setting', { setting, value: parsedSettings[setting] });
        }
      }
    },
  },

  getters: {
    isAdmin (state) {
      return router.currentRoute.query.admin === 'true';
    },
    isBanned (state) {
      if (state.me) {
        return state.me.banned;
      } else {
        return false;
      }
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
