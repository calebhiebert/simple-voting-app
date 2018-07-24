<template>
  <div class="clearfix">
    <div class="columns col-gapless">
      <div class="column col-1 col-lg-2 col-sm-3 text-center min-90" :class="{'voted-for': votedFor}" v-if="!isMobile">
        <div class="btn-group">
          <button class="btn btn-sm" @click="$router.push({name: 'home'})">
            <i class="icon icon-arrow-left"></i>
          </button>
          <button class="btn btn-sm btn-primary" :class="{'loading': voting}" @click="vote" v-if="!votedFor">Vote</button>
          <button class="btn btn-sm btn-success" v-else>
            <i class="icon icon-check"></i> Voted
          </button>
        </div>
      </div>
      <div class="column col-1 col-lg-2 col-sm-3 col-xs-3 text-center avatar-column" :class="{'col-mx-auto': isMobile}">
        <figure class="avatar avatar-xl">
          <img :src="avatarUrl" alt="avatar">
        </figure>
      </div>
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
      <div class="column col-10 col-sm-12 col-mx-auto edit-form" v-else>
        <div class="form-group">
          <input class="form-input input-lg" placeholder="Name" v-model.trim="eName">
        </div>
        <div class="form-group">
          <input class="form-input" placeholder="Costume" v-model.trim="eCostume">
        </div>
        <button class="btn" @click="editing = false">Cancel</button>
        <button class="btn btn-primary" @click="update" :class="{loading: saving}">Update</button>
      </div>
      <div class="column col-2 col-md-3 col-sm-12 col-ml-auto text-center" v-if="isMobile">
        <button class="btn" @click="$router.push({name: 'home'})">
          <i class="icon icon-arrow-left"></i>
        </button>
        <button class="btn btn-primary" v-if="!votedFor" :class="{'loading': voting}" @click="vote">Vote</button>
        <button class="btn btn-success" v-else>
          <i class="icon icon-check"></i> Voted
        </button>
      </div>
    </div>
    <div class="columns">
      <div class="column col-6 col-sm-10 col-mx-auto edit-history">
        <h4>Votes</h4>
        <votes :votes="subject.votes"></votes>
      </div>
      <div class="column col-6 col-sm-10 col-mx-auto edit-history">
        <button class="btn btn-action btn-sm float-right" @click="toggleEditHistory">
          <i class="icon" :class="{'icon-arrow-down': !editHistoryVisible, 'icon-arrow-up': editHistoryVisible}"></i>
        </button>
        <h4>Edit History</h4>
        <edit-history :history="subject.history" v-if="subject && editHistoryVisible"></edit-history>
      </div>
    </div>
    <div class="divider"></div>
    <p class="text-center">Something not right here? Please <a @click="edit">fix it</a></p>
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
  width: 88px;
}

.min-90.voted-for {
  width: 113px;
}

.avatar-column {
  width: 75px;
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
  },

  data () {
    return {
      editing: false,
      saving: false,
      voting: false,
      editHistoryVisible: false,
      eName: '',
      eCostume: '',
    };
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
        this.$store.commit('setSubject', subject);
      });
    },

    update () {
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
        });
    },

    vote () {
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
        });
    },
  },
};
</script>
