<template>
  <div class="container">
    <div class="table table-striped table-hover" v-if="users">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Banned</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user of users" :key="user.id">
          <td>{{ user.userId }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.banned }}</td>
          <td>
            <button class="btn btn-sm" :class="{'loading': user.userId === banning}" v-if="!user.banned" @click="ban(user)">
              Ban
            </button>
            <button class="btn btn-sm" :class="{'loading': user.userId === banning}" v-else @click="unban(user)">
              Unban
            </button>
          </td>
        </tr>
      </tbody>
    </div>
    <div class="loading loading-lg" v-else></div>
  </div>
</template>
<script>
import api from '@/api';

export default {
  created () {
    this.loadUsers();
    if (!this.$store.getters.isAdmin) {
      this.$router.replace({ name: 'home' });
    }
  },

  data () {
    return {
      users: null,
      banning: '',
    };
  },

  methods: {
    loadUsers () {
      api.getUsers().then((users) => {
        this.users = users;
      });
    },

    ban (user) {
      this.banning = user.userId;
      api.banUser(user.userId).then(() => {
        this.banning = '';
        user.banned = true;
      });
    },

    unban (user) {
      this.banning = user.userId;
      api.unBanUser(user.userId).then(() => {
        this.banning = '';
        user.banned = false;
      });
    },
  },
};
</script>
