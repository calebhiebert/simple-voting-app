<template>
  <div>
    <div v-if="votes.length === 0">
      <p>No votes here :(</p>
    </div>
    <div class="tile" v-for="vote of votes" :key="vote.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(vote.voter)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title">{{ vote.voter }} - <i>{{ distanceInWordsToNow(vote.createdAt) }} ago</i></p>
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
import api from '@/api';
import { distanceInWordsToNow } from 'date-fns';

export default {
  props: {
    votes: {
      type: Array,
      required: true,
    },
  },

  methods: {
    distanceInWordsToNow,
    getAvatarUrl(name) {
      return api.avatarURL(name);
    },
  },
};
</script>
