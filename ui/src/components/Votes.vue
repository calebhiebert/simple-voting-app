<template>
  <div v-if="votes !== null">
    <div v-if="votes.length === 0">
      <p>No votes here :(</p>
    </div>
    <div class="tile" v-for="vote of sortedVotes" :key="vote.id">
      <div class="tile-icon">
        <figure class="avatar">
          <img :src="getAvatarUrl(vote.voter.name)" alt="avatar">
        </figure>
      </div>
      <div class="tile-content">
        <p class="tile-title">{{ vote.voter.name }} - <i>{{ distanceInWordsToNow(vote.updatedAt) }} ago</i></p>
      </div>
    </div>
  </div>
  <div class="loading loading-lg" v-else-if="$apollo.loading">

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
import { avatarURL } from '@/api';
import { distanceInWordsToNow } from 'date-fns';
import gql from 'graphql-tag';

export default {
  props: {
    subjectId: {
      type: String,
      required: true,
    },
  },

  methods: {
    distanceInWordsToNow,
    getAvatarUrl (name) {
      return avatarURL(name);
    },
  },

  apollo: {
    subject () {
      return {
        query: gql`
          query GetSubject($id: ID!) {
            subject(id: $id) {
              id
              votes {
                id
                updatedAt
                voter {
                  id
                  name
                }
              }
            }
          }
        `,

        variables () {
          return {
            id: this.subjectId,
          };
        },
      };
    },
  },

  computed: {
    votes () {
      if (this.subject) {
        return this.subject.votes;
      } else {
        return null;
      }
    },
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
