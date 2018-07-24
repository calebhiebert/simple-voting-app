<template>
  <span v-if="user !== null">{{ user.name }}</span>
  <span v-else>...</span>
</template>
<script>
import api from '@/api';

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },

  created () {
    this.get(this.userId);
  },

  watch: {
    userId () {
      this.get(this.userId);
    },
  },

  data () {
    return {
      user: null,
    };
  },

  methods: {
    get (id) {
      api.getUser(id).then((user) => {
        this.user = user;
      });
    },
  },
};
</script>
