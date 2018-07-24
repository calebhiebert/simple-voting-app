<template>
  <div class="container">
    <div class="columns mt-2">
      <div class="column col-6 col-sm-10 col-mx-auto text-center">
        <h1>Guests</h1>
        <p>Please select the person you would like to vote for</p>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-sm-12 col-xs-12 col-mx-auto">
        <main-page-vote-view @selected="detailSubject(subject)" @click="detailSubject(subject)" class="mt-2" v-for="subject of sortedSubjects" :name="subject.personName" :costume="subject.costumeDescription" :key="subject.id" :votePercent="subject.votes.length / totalVotes"></main-page-vote-view>
      </div>
    </div>
    <div class="divider"></div>
    <div class="columns">
      <div class="column col-mx-auto text-center">
        Don't see the person/costume you're looking for? <router-link :to="{name: 'subject-create'}">Add them</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
</style>

<script>
import api from '../api';

// @ is an alias to /src
import MainPageVoteView from '@/components/MainPageVoteView.vue';

export default {
  name: 'home',
  components: {
    MainPageVoteView,
  },

  created () {
    api.getSubjects().then((subjects) => {
      this.$store.commit('setSubjects', subjects);
    });
  },

  computed: {
    subjects () {
      return this.$store.state.subjects;
    },

    sortedSubjects () {
      if (this.subjects) {
        return this.subjects.slice(0).sort((a, b) => {
          if (a.votes.length > b.votes.length) {
            return -1;
          } else if (a.votes.length < b.votes.length) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        return null;
      }
    },

    totalVotes () {
      if (this.subjects) {
        let votes = 0;

        for (const subject of this.subjects) {
          if (subject.votes) {
            votes += subject.votes.length;
          }
        }

        return votes;
      } else {
        return 0;
      }
    },
  },

  methods: {
    detailSubject (subject) {
      this.$store.commit('setSubject', subject);
      this.$router.push({ name: 'subject-view', params: { id: subject.id } });
    },

    vote (subjectId) {
      api.vote(subjectId).then((vote) => {
        return api.getSubject(subjectId).then((subject) => {
          this.$store.commit('setSubject', subject);
          return vote;
        });
      });
    },
  },
};
</script>
