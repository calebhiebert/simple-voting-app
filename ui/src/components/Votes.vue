<template>
  <div>
    <div v-if="votes.length === 0">
      <p>No votes here :(</p>
    </div>
    <div class="tile" v-for="vote of sortedVotes" :key="vote.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(vote.voter, 32)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title"><user-name :userId="vote.voter"></user-name> - <i>{{ distanceInWordsToNow(vote.updatedAt) }} ago</i></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin-bottom: 0rem;
}

.tile {
  margin-bottom: 0.3rem;
}
</style>

<script>
import UserName from '@/components/UserName.vue';

import api from '@/api';
import { distanceInWordsToNow } from 'date-fns';

export default {
  components: {
    UserName,
  },

  props: {
    votes: {
      type: Array,
      required: true,
    },
  },

  methods: {
    distanceInWordsToNow,
    getAvatarUrl (name) {
      return api.avatarURL(name);
    },
  },

  computed: {
    sortedVotes () {
      if (this.votes) {
        return this.votes.slice(0).sort((a, b) => {
          if (a.updatedAt > b.updatedAt) {
            return -1;
          } else if (a.updatedAt < b.updatedAt) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        return this.votes;
      }
    },
  },
};
</script>
