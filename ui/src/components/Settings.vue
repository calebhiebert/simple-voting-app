<template>
  <div>
    <div class="form-group">
      <label class="form-switch">
        <input type="checkbox" v-model="autoVoteOnClick">
        <i class="form-icon"></i> Automatically submit a vote when I select a person from the list
      </label>
    </div>
    <div class="form-group">
      <label class="form-switch">
        <input type="checkbox" v-model="editHistoryVisible">
        <i class="form-icon"></i> Automatically open edit history when I view a person
      </label>
    </div>
    <div class="form-group">
      <label class="form-switch">
        <input type="checkbox" v-model="showVotedNotification">
        <i class="form-icon"></i> Show a notification after my votes are submitted
      </label>
    </div>
    <button class="btn" v-if="$store.getters.isAdmin" @click="$router.push({name: 'users'})">Users</button>
  </div>
</template>
<script>
const makeSettingGetSet = (settingName) => {
  return {
    get () {
      return this.$store.state.settings[settingName];
    },

    set (value) {
      this.$store.commit('setting', { setting: settingName, value });
    },
  };
};

export default {
  computed: {
    autoVoteOnClick: makeSettingGetSet('autoVoteOnClick'),
    editHistoryVisible: makeSettingGetSet('editHistoryVisible'),
    showVotedNotification: makeSettingGetSet('showVotedNotification'),
  },
};
</script>
