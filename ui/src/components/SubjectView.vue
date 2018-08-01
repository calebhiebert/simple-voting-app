<template>
  <div class="clearfix" v-if="subject">
    <div class="columns col-gapless">
      <!-- Navigation/Vote buttons for desktop -->
      <div class="column col-1 col-lg-2 col-sm-3 min-90" :class="{'voted-for': isVotedFor}" v-if="!isMobile">
        <div class="btn-group">
          <button class="btn btn-sm" @click="$router.push({name: 'home'})">
            <i class="icon icon-arrow-left"></i>
          </button>
          <button class="btn btn-sm btn-primary" :class="{'loading': voting}" @click="vote()" v-if="!isVotedFor && !isBanned">Vote</button>
          <button class="btn btn-sm btn-success" v-else-if="!isBanned">
            <i class="icon icon-check"></i> Voted
          </button>
        </div>
      </div>

      <!-- Avatar -->
      <div class="column col-1 col-lg-2 col-sm-3 col-xs-3 text-center avatar-column" :class="{'col-mx-auto': isMobile}">
        <figure class="avatar avatar-xl">
          <img :src="avatarUrl" alt="avatar">
        </figure>
      </div>

      <!-- Name/Costume View -->
      <div class="column col-5 col-sm-12" :class="{'col-mx-auto': isMobile}" v-if="!editing">
        <div class="text-center show-sm">
          <h1>{{ subject.personName }}</h1>
          <h4 class="text-gray">{{ subject.costumeDescription }}</h4>
        </div>
        <div class="hide-sm">
          <h1>{{ subject.personName }}</h1>
          <h4 class="text-gray">{{ subject.costumeDescription }}</h4>
        </div>
      </div>

      <!-- Name/Costume Edit Form -->
      <div class="column col-sm-12 col-mx-auto edit-form" v-else>
        <subject-edit-form :subject-id="subject.id" @close="editing = false"></subject-edit-form>
      </div>

      <!-- Nagivation/Vote buttons for mobile -->
      <div class="column col-2 col-md-3 col-sm-12 col-ml-auto text-center" v-if="isMobile">
        <button class="btn" @click="$router.push({name: 'home'})">
          <i class="icon icon-arrow-left"></i>
        </button>
        <button class="btn btn-primary" v-if="!isVotedFor && !isBanned" :class="{'loading': voting}" @click="vote()">Vote</button>
        <button class="btn btn-success" v-else-if="!isBanned">
          <i class="icon icon-check"></i> Voted
        </button>
      </div>
    </div>

    <div class="columns">

      <!-- Votes view -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history">
        <h4 class="badge" :data-badge="subject.voteCount">Votes</h4>
        <votes :subject-id="subject.id"></votes>
      </div>

      <!-- Edit History View -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history">
        <button class="btn btn-action btn-sm float-right" @click="toggleEditHistory">
          <i class="icon" :class="{'icon-arrow-down': !editHistoryVisible, 'icon-arrow-up': editHistoryVisible}"></i>
        </button>
        <h4>Edit History</h4>
        <transition name="fade-virt-rev">
          <edit-history :subject-id="subject.id" v-if="subject && editHistoryVisible"></edit-history>
        </transition>
      </div>
    </div>
    <div class="divider"></div>
    <p class="text-center" v-if="!isBanned">{{ lang.editNotice }} <a @click="edit">{{ lang.editText }}</a></p>
    <p class="text-center" v-if="isAdmin"><a @click="deleteSubject">delete</a></p>
  </div>
  <div class="loading loading-lg" v-else></div>
</template>

<style scoped>
a {
  cursor: pointer;
}

button {
  margin-right: 0.4rem;
}

h1 {
  margin-bottom: 0.2rem;
}

.min-90 {
  width: 90px;
}

.min-90.voted-for {
  width: 120px;
}

.avatar-column {
  width: 75px;
}

@media screen and (max-width: 600px) {
  .edit-history {
    margin-top: 1rem;
  }
}

@media screen and (min-width: 600px) {
  .avatar-column {
    margin-right: 0.5rem;
  }
}
</style>

<script>
import { avatarURL } from '@/api';
import lang from '@/lang.json';
import gql from 'graphql-tag';
import {
  GET_ME_QUERY,
  VOTED_FOR_QUERY,
  VOTE_MUTATION,
  DELETE_SUBJECT_MUTATION,
  GET_SUBJECT_BASIC_QUERY,
  SUBJECT_CHANGED_SUBSCRIPTION,
} from '../queries';

import SubjectEditForm from '@/components/SubjectEditForm.vue';
import EditHistory from '@/components/EditHistory.vue';
import Votes from '@/components/Votes.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    SubjectEditForm,
    EditHistory,
    Votes,
    Modal,
  },

  data() {
    return {
      lang,
      editing: false,
      saving: false,
      voting: false,
    };
  },

  apollo: {
    user: GET_ME_QUERY,
    subject() {
      return {
        query: GET_SUBJECT_BASIC_QUERY,
        subscribeToMore: {
          document: SUBJECT_CHANGED_SUBSCRIPTION,
          variables: {
            id: this.$route.params.id,
          },
          updateQuery(previous, { subscriptionData }) {
            console.log(previous, subscriptionData);
          },
        },

        variables() {
          return {
            id: this.$route.params.id,
          };
        },

        result: (queryResult) => {
          if (this.$route.query.doVote && queryResult.data && !this.isBanned) {
            this.vote(queryResult.data.subject.id);
          }
        },
      };
    },
    votedFor: VOTED_FOR_QUERY,
  },

  computed: {
    avatarUrl() {
      return avatarURL(this.subject.personName);
    },

    isMobile() {
      return ['sm', 'xs'].indexOf(this.$mq) !== -1;
    },

    isVotedFor() {
      if (this.votedFor && this.subject) {
        return this.votedFor.id === this.subject.id;
      } else {
        return false;
      }
    },

    isBanned() {
      return this.user ? this.user.banned : false;
    },

    isAdmin() {
      return this.user ? this.user.admin : false;
    },

    editHistoryVisible: {
      get() {
        return this.$store.state.settings.editHistoryVisible;
      },
      set(value) {
        this.$store.commit('setting', { setting: 'editHistoryVisible', value });
      },
    },
  },

  methods: {
    edit() {
      this.editing = true;
    },

    toggleEditHistory() {
      this.editHistoryVisible = !this.editHistoryVisible;
    },

    vote(subjId) {
      this.voting = true;
      this.$apollo
        .mutate({
          mutation: VOTE_MUTATION,

          variables: {
            subjectId: subjId || this.subject.id,
          },

          update: (store, { data: { vote } }) => {
            const subjectsQuery = gql`
              query Subjects {
                subjects {
                  id
                  voteCount
                  votes {
                    id
                  }
                }
              }
            `;

            this.$apollo.query({
              query: subjectsQuery,
              fetchPolicy: 'network-only',
            });

            try {
              const data = store.readQuery({ query: VOTED_FOR_QUERY });
              data.votedFor.id = vote.subject.id;
              store.writeQuery({ query: VOTED_FOR_QUERY, data });
            } catch (err) {
              this.$apollo.query({ query: VOTED_FOR_QUERY, fetchPolicy: 'network-only' });
            }
          },
        })
        .then((vote) => {
          this.voting = false;
          if (this.$store.state.settings.showVotedNotification) {
            this.$store.commit('toast', 'Your vote has been counted');
          }
        })
        .catch((err) => {
          this.voting = false;
        });
    },

    deleteSubject() {
      this.$apollo
        .mutate({
          mutation: DELETE_SUBJECT_MUTATION,

          variables: {
            id: this.subject.id,
          },
        })
        .then(() => {
          this.$router.replace({ name: 'home' });
        });
    },
  },
};
</script>
