<template>
  <div class="container">
    <div class="columns mt-2">
      <div class="column col-8 col-sm-10 col-mx-auto text-center">
        <h1>{{ lang.title }}</h1>
        <p v-if="!$store.state.settings.hideWelcomeMessage">{{ lang.subtitle }}</p>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-sm-11 col-mx-auto">
        <div class="has-icon-right">
          <input type="text" class="form-input" placeholder="Search" v-model="searchQuery">
          <i class="form-icon icon icon-search"></i>
        </div>
        <transition-group name="list-change" v-if="filteredSubjects">
          <main-page-vote-view @selected="detailSubject(subject)" class="mt-2" v-for="subject of filteredSubjects" :votedFor="votedFor ? subject.id === votedFor.id : false" :name="subject.personName" :costume="subject.costumeDescription" :key="subject.id" :votePercent="subject.voteCount / totalVotes"></main-page-vote-view>
        </transition-group>
        <div v-else>
          <main-page-vote-view-placeholder class="mt-2" v-for="pid of placeholderIds" :key="pid"></main-page-vote-view-placeholder>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="columns" v-if="!isBanned">
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

.list-change-move {
  transition: transform 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>

<script>
import lang from '@/lang.json';
import { VOTE_CAST_SUBSCRIPTION, GET_ME_QUERY, VOTED_FOR_QUERY, GET_ALL_SUBJECTS_QUERY } from '../queries';

import MainPageVoteView from '@/components/MainPageVoteView.vue';
import MainPageVoteViewPlaceholder from '@/components/MainPageVoteViewPlaceholder.vue';
import Modal from '@/components/Modal.vue';
import Settings from '@/components/Settings.vue';

export default {
  name: 'home',
  components: {
    MainPageVoteView,
    MainPageVoteViewPlaceholder,
    Modal,
    Settings,
  },

  apollo: {
    subjects: {
      query: GET_ALL_SUBJECTS_QUERY,
      fetchPolicy: 'cache-and-network',
      subscribeToMore: {
        document: VOTE_CAST_SUBSCRIPTION,
      },
    },

    votedFor: VOTED_FOR_QUERY,
    user: GET_ME_QUERY,
  },

  data () {
    return { lang, searchQuery: '' };
  },

  computed: {
    sortedSubjects () {
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

    filteredSubjects () {
      if (this.searchQuery.trim() !== '') {
        return this.sortedSubjects.filter((ss) => {
          return (
            ss.personName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1 ||
            ss.costumeDescription.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1
          );
        });
      } else {
        return this.sortedSubjects;
      }
    },

    isBanned () {
      if (this.user) {
        return this.user.banned;
      } else {
        return false;
      }
    },

    totalVotes () {
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

    placeholderIds () {
      return [1, 2, 3, 4];
    },
  },

  methods: {
    detailSubject (subject) {
      this.$router.push({
        name: 'subject-view',
        params: { id: subject.id },
        query: {
          doVote: this.$store.state.settings.autoVoteOnClick && !this.isBanned ? true : undefined,
        },
      });
    },
  },
};
</script>
