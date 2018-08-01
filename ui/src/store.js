import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let toastTimeout = null;

export default new Vuex.Store({
  state: {
    toast: '',
    settings: {
      autoVoteOnClick: true,
      autoLogoutOnVote: false,
      editHistoryVisible: false,
      showVotedNotification: true,
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
});
