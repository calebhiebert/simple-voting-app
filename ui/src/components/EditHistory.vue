<template>
  <div>
    <div class="tile" v-for="(edit, index) of sortedHistory" :key="edit.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(edit.editor)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title">{{ edit.editor }}<i v-if="index === history.length - 1"> (Original)</i></p>
        <p class="tile-subtitle text-gray">{{ edit.personName }} - {{ edit.costumeDescription }} - <i>{{ distanceInWordsToNow(edit.createdAt) }} ago</i></p>
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
    history: {
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

  computed: {
    sortedHistory() {
      return this.history.slice(0).sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        } else if (a.createdAt > b.createdAt) {
          return -1;
        } else {
          return 0;
        }
      });
    },
  },
};
</script>
