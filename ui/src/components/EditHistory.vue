<template>
  <div v-if="sortedHistory !== null">
    <div class="tile" v-for="(edit, index) of sortedHistory" :key="edit.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(edit.editor.name)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title"> {{ edit.editor.name }} <i v-if="index === history.length - 1"> (Original)</i></p>
        <p class="tile-subtitle text-gray">{{ edit.personName }} - {{ edit.costumeDescription }} - <i>{{ distanceInWordsToNow(edit.createdAt) }} ago</i></p>
      </div>
    </div>

  </div>
  <div class="loading loading-lg" v-else-if="$apollo.loading"></div>
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
import { distanceInWordsToNow } from 'date-fns';
import { EDIT_HISTORY_QUERY } from '../queries';
import api from '@/api';

export default {
  props: {
    subjectId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      reverting: false,
    };
  },

  apollo: {
    subject () {
      return {
        query: EDIT_HISTORY_QUERY,
        variables () {
          return {
            id: this.subjectId,
          };
        },
      };
    },
  },

  methods: {
    distanceInWordsToNow,
    getAvatarUrl (name) {
      return api.avatarURL(name);
    },
  },

  computed: {
    history () {
      if (this.subject) {
        return this.subject.history;
      } else {
        return null;
      }
    },
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
