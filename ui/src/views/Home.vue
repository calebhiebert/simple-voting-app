<template>
  <div class="container">
    <div class="columns mt-2">
      <div class="column col-8 col-sm-10 col-mx-auto text-center">
        <h1>{{ lang.title }}</h1>
        <p>{{ lang.subtitle }}</p>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-sm-11 col-mx-auto" v-if="!$apollo.loading">
        <main-page-vote-view @selected="detailSubject(subject)" class="mt-2" v-for="subject of sortedSubjects" :votedFor="subject.id === votedFor.id" :name="subject.personName" :costume="subject.costumeDescription" :key="subject.id" :votePercent="subject.voteCount / totalVotes"></main-page-vote-view>
      </div>
      <div class="column col-10 col-sm-11 col-mx-auto" v-if="$apollo.queries.subjects.loading">
        <div class="loading loading-lg"></div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="columns" v-if="!$store.getters.isBanned">
      <div class="column col-12 col-mx-auto text-center">
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
// @ is an alias to /src
import MainPageVoteView from '@/components/MainPageVoteView.vue';
import Modal from '@/components/Modal.vue';
import Settings from '@/components/Settings.vue';
import ApolloTest from '@/components/ApolloTest.vue';
import lang from '@/lang.json';
import gql from 'graphql-tag';

export default {
  name: 'home',
  components: {
    MainPageVoteView,
    Modal,
    Settings,
    ApolloTest,
  },

  created() {},

  apollo: {
    subjects: gql`
      query GetAllSubjects {
        subjects {
          id
          personName
          costumeDescription
          voteCount
        }
      }
    `,

    votedFor: gql`
      query VotedFor {
        votedFor {
          id
        }
      }
    `,
  },

  data() {
    return { lang };
  },

  computed: {
    sortedSubjects() {
      if (this.subjects) {
        return this.subjects.slice(0).sort((a, b) => {
          if (a.voteCount > b.voteCount) {
            return -1;
          } else if (a.voteCount < b.voteCount) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        return null;
      }
    },

    totalVotes() {
      if (this.subjects) {
        let votes = 0;

        for (const subject of this.subjects) {
          if (subject.voteCount) {
            votes += subject.voteCount;
          }
        }

        return votes;
      } else {
        return 0;
      }
    },
  },

  methods: {
    detailSubject(subject) {
      this.$router.push({
        name: 'subject-view',
        params: { id: subject.id },
        query: {
          doVote:
            this.$store.state.settings.autoVoteOnClick &&
            !this.$store.getters.isBanned,
        },
      });
    },
  },
};
</script>
