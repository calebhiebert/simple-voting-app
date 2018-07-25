<template>
  <div class="container">
    <div class="columns mt-2">
      <div class="column col-8 col-sm-10 col-mx-auto text-center">
        <h1>{{ lang.title }}</h1>
        <p>{{ lang.subtitle }}</p>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-sm-11 col-mx-auto" v-if="sortedSubjects">
        <main-page-vote-view @selected="detailSubject(subject)" class="mt-2" v-for="subject of sortedSubjects" :votedFor="subject.id === votedFor" :name="subject.personName" :costume="subject.costumeDescription" :key="subject.id" :votePercent="subject.votes.length / totalVotes"></main-page-vote-view>
      </div>
      <div class="column col-10 col-sm-11 col-mx-auto" v-else>
        <div class="loading loading-lg"></div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="columns" v-if="!$store.getters.isBanned">
      <div class="column col-mx-auto text-center">
        {{ lang.addNotice }} <router-link :to="{name: 'subject-create'}">{{ lang.addText }}</router-link>
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
import Modal from '@/components/Modal.vue';
import Settings from '@/components/Settings.vue';
import lang from '@/lang.json';

export default {
  name: 'home',
  components: {
    MainPageVoteView,
    Modal,
    Settings,
  },

  created () {
    api.getSubjects().then((subjects) => {
      this.$store.commit('setSubjects', subjects);
    });
  },

  data () {
    return { lang };
  },

  computed: {
    subjects () {
      return this.$store.state.subjects;
    },

    votedFor () {
      return this.$store.getters.votedFor;
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

      if (this.$store.state.settings.autoVoteOnClick && !this.$store.getters.isBanned) {
        if (this.$store.getters.votedFor !== subject.id) {
          if (this.$store.state.subject.votes) {
            const vote = {
              id: -1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              subjectId: subject.id,
              voter: this.$store.state.me.userId,
            };

            this.$store.commit('patchSubjectVote', vote);
          }

          api
            .vote(subject.id)
            .then((vote) => {
              return api.getSubject(subject.id);
            })
            .then((subject) => {
              this.$store.commit('setSubject', subject);
            });
        }
      }

      this.$router.push({
        name: 'subject-view',
        params: { id: subject.id },
        query: { voted: this.$store.state.settings.autoVoteOnClick && !this.$store.getters.isBanned },
      });
    },
  },
};
</script>
