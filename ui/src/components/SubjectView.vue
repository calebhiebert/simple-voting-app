<template>
  <div class="clearfix">
    <div class="columns col-gapless">
      <!-- Navigation/Vote buttons for desktop -->
      <div class="column col-1 col-lg-2 col-sm-3 min-90" :class="{'voted-for': votedFor}" v-if="!isMobile">
        <div class="btn-group">
          <button class="btn btn-sm" @click="$router.push({name: 'home'})">
            <i class="icon icon-arrow-left"></i>
          </button>
          <button class="btn btn-sm btn-primary" :class="{'loading': voting}" @click="vote" v-if="!votedFor && !$store.getters.isBanned">Vote</button>
          <button class="btn btn-sm btn-success" v-else-if="!$store.getters.isBanned">
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
        <div class="form-group" :class="{'has-error': errors.has('person_name')}">
          <input class="form-input input-lg" data-vv-as="name" v-validate="{required: true, max: 255, min: 3}" name="person_name" placeholder="Name" v-model.trim="eName">
          <p class="form-input-hint" v-if="errors.has('person_name')">{{ errors.first('person_name') }}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.has('costume')}">
          <input class="form-input" name="costume" v-validate="{required: true, max: 255, min: 3}" placeholder="Costume" v-model.trim="eCostume">
          <p class="form-input-hint" v-if="errors.has('costume')">{{ errors.first('costume') }}</p>
        </div>
        <button class="btn" @click="editing = false">Cancel</button>
        <button class="btn btn-primary" @click="update" :class="{loading: saving}">Update</button>
      </div>

      <!-- Nagivation/Vote buttons for mobile -->
      <div class="column col-2 col-md-3 col-sm-12 col-ml-auto text-center" v-if="isMobile">
        <button class="btn" @click="$router.push({name: 'home'})">
          <i class="icon icon-arrow-left"></i>
        </button>
        <button class="btn btn-primary" v-if="!votedFor && !$store.getters.isBanned" :class="{'loading': voting}" @click="vote">Vote</button>
        <button class="btn btn-success" v-else-if="!$store.getters.isBanned">
          <i class="icon icon-check"></i> Voted
        </button>
      </div>
    </div>

    <div class="columns">

      <!-- Votes view -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history" v-if="subject.votes">
        <h4 class="badge" :data-badge="subject.votes.length">Votes</h4>
        <votes :votes="subject.votes"></votes>
      </div>

      <!-- Edit History View -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history">
        <button class="btn btn-action btn-sm float-right" @click="toggleEditHistory">
          <i class="icon" :class="{'icon-arrow-down': !editHistoryVisible, 'icon-arrow-up': editHistoryVisible}"></i>
        </button>
        <h4>Edit History</h4>
        <transition name="fade-virt-rev">
          <edit-history :history="subject.history" v-if="subject && editHistoryVisible"></edit-history>
        </transition>
      </div>
    </div>
    <div class="divider"></div>
    <p class="text-center" v-if="!$store.getters.isBanned">{{ lang.editNotice }} <a @click="edit">{{ lang.editText }}</a></p>
    <p class="text-center" v-if="$store.getters.isAdmin"><a @click="deleteSubject">delete</a></p>
  </div>
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

.edit-form {
  margin-bottom: 1rem;
}

@media screen and (max-width: 600px) {
  .edit-history {
    margin-top: 1rem;
  }

  .edit-form {
    padding-right: 1rem;
    padding-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

@media screen and (min-width: 600px) {
  .avatar-column {
    margin-right: 0.5rem;
  }
}
</style>

<script>
import api from '@/api';
import lang from '@/lang.json';

import EditHistory from '@/components/EditHistory.vue';
import Votes from '@/components/Votes.vue';
import Modal from '@/components/Modal.vue';

export default {
  components: {
    EditHistory,
    Votes,
    Modal,
  },

  props: {
    subject: {
      type: Object,
      required: true,
      default: null,
    },
  },

  mounted () {
    if (this.subject.history === null) {
      this.refresh();
    }

    if (this.$route.query.voted === true) {
      if (this.$store.state.settings.showVotedNotification) {
        this.$store.commit(
          'toast',
          'Your vote has been counted. Visit the settings menu in the top left corner to turn off auto voting',
        );
      }
      this.$router.replace({ name: 'subject-view', params: { id: this.$route.params.id } });
    }
  },

  data () {
    return {
      lang,
      editing: false,
      saving: false,
      voting: false,
      eName: '',
      eCostume: '',
    };
  },

  watch: {
    subject () {
      if (this.subject.history === null) {
        this.refresh();
      }
    },
  },

  computed: {
    avatarUrl () {
      return api.avatarURL(this.subject.personName);
    },

    isMobile () {
      return ['sm', 'xs'].indexOf(this.$mq) !== -1;
    },

    votedFor () {
      if (this.$store.getters.votedFor) {
        return this.subject.id === this.$store.getters.votedFor;
      } else {
        return false;
      }
    },

    editHistoryVisible: {
      get () {
        return this.$store.state.settings.editHistoryVisible;
      },
      set (value) {
        this.$store.commit('setting', { setting: 'editHistoryVisible', value });
      },
    },
  },

  methods: {
    edit () {
      this.eName = this.subject.personName;
      this.eCostume = this.subject.costumeDescription;
      this.editing = true;
    },

    toggleEditHistory () {
      this.editHistoryVisible = !this.editHistoryVisible;
    },

    refresh () {
      api.getSubject(this.subject.id).then((subject) => {
        this.$store.commit('setSubject', { history: subject.history });
      });
    },

    update () {
      this.$validator.validate().then((valid) => {
        if (valid) {
          this.saving = true;
          api
            .updateSubject(this.subject.id, this.eName, this.eCostume)
            .then((subject) => {
              return api.getSubject(subject.id).then((subject) => {
                this.$store.commit('setSubject', subject);
                return subject;
              });
            })
            .then((subject) => {
              this.editing = false;
              this.saving = false;
            })
            .catch(() => {
              this.saving = false;
              this.editing = false;
            });
        }
      });
    },

    vote () {
      if (!this.$store.state.subject.votes) {
        this.$store.state.subject.votes = [];
      }

      const vote = {
        id: -1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        subjectId: this.subject.id,
        voter: this.$store.state.me.userId,
      };

      this.$store.commit('patchSubjectVote', vote);

      this.voting = true;
      api
        .vote(this.subject.id)
        .then((vote) => {
          return api.getSubject(this.subject.id).then((subject) => {
            this.$store.commit('setSubject', subject);
            return vote;
          });
        })
        .then((vote) => {
          this.voting = false;
        })
        .catch((err) => {
          this.voting = false;
          console.error(err);
        });
    },

    deleteSubject () {
      api.deleteSubject(this.subject.id).then((subject) => {
        this.$router.replace({ name: 'home' });
      });
    },
  },
};
</script>
