<template>
  <div v-if="sortedHistory !== null">
    <div class="tile" v-for="(edit, index) of sortedHistory" :key="edit.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(edit.editor, 32)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title"><user-name :userId="edit.editor"></user-name><i v-if="index === history.length - 1"> (Original)</i></p>
        <p class="tile-subtitle text-gray">{{ edit.personName }} - {{ edit.costumeDescription }} - <i>{{ distanceInWordsToNow(edit.createdAt) }} ago</i></p>
      </div>
      <button class="btn btn-sm float-right" :class="{'loading': reverting}" v-if="$store.getters.isAdmin" @click="revert(edit)">
        <i class="icon icon-refresh"></i>
      </button>
    </div>

  </div>
  <div class="loading loading-lg" v-else></div>
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
    history: {
      type: Array,
    },
  },

  data () {
    return {
      reverting: false,
    };
  },

  methods: {
    distanceInWordsToNow,
    getAvatarUrl (name) {
      return api.avatarURL(name);
    },

    revert (history) {
      this.reverting = true;
      api.updateSubject(history.subjectId, history.personName, history.costumeDescription).then((subject) => {
        this.reverting = false;
        this.$store.commit('setSubject', subject);
      });
    },
  },

  computed: {
    sortedHistory () {
      if (this.history) {
        return this.history.slice(0).sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1;
          } else if (a.createdAt > b.createdAt) {
            return -1;
          } else {
            return 0;
          }
        });
      } else {
        return null;
      }
    },
  },
};
</script>
