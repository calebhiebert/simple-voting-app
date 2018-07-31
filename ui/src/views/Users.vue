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
import gql from 'graphql-tag';

export default {
  data () {
    return {
      banning: '',
    };
  },

  apollo: {
    user: gql`
      query GetMe {
        user {
          id
          name
          banned
          admin
        }
      }
    `,

    users: gql`
      query GetUsers {
        users {
          id
          name
          banned
          admin
        }
      }
    `,
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
        mutation: gql`
          mutation UpdateUser($input: UserMutation!) {
            updateUser(input: $input) {
              id
              name
              banned
              admin
              updatedAt
            }
          }
        `,
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
        mutation: gql`
          mutation UpdateUser($input: UserMutation!) {
            updateUser(input: $input) {
              id
              name
              banned
              admin
              updatedAt
            }
          }
        `,
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
