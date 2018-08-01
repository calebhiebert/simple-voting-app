<template>
  <div class="container">
    <div class="columns">
      <div class="column col-8 col-mx-auto">
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
              <td>{{ user.id }}</td>
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
    </div>

  </div>
</template>
<script>
import { GET_ME_QUERY, GET_USERS_QUERY, UPDATE_USER_MUTATION } from '../queries';

export default {
  data () {
    return {
      banning: '',
    };
  },

  apollo: {
    user: GET_ME_QUERY,
    users: GET_USERS_QUERY,
  },

  watch: {
    user () {
      if (this.user && !this.user.admin) {
        this.$router.replace({ name: 'home' });
      }
    },
  },

  methods: {
    ban (user) {
      this.$apollo.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          input: {
            id: user.id,
            banned: true,
            name: user.name,
          },
        },
      });
    },

    unban (user) {
      this.$apollo.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          input: {
            id: user.id,
            banned: false,
            name: user.name,
          },
        },
      });
    },
  },
};
</script>
