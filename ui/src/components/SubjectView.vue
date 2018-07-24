<template>
  <div class="clearfix">
    <button class="btn float-right" @click="vote" :class="{loading: voting}">Vote</button>
    <div class="columns">
      <div class="column col-1 col-lg-2 col-sm-3 col-xs-3">
        <figure class="avatar avatar-xl">
          <img :src="avatarUrl" alt="avatar">
        </figure>
      </div>
      <div class="column col" v-if="!editing">
        <h1>{{ subject.personName }}</h1>
        <h4 class="text-gray">{{ subject.costumeDescription }}</h4>
      </div>
      <div class="column col" v-else>
        <div class="form-group">
          <input class="form-input input-lg" placeholder="Name" v-model.trim="subject.personName">
        </div>
        <div class="form-group">
          <input class="form-input" placeholder="Costume" v-model.trim="subject.costumeDescription">
        </div>
        <button class="btn btn-error" @click="editing = false">Cancel</button>
        <button class="btn" @click="update" :class="{loading: saving}">Update</button>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <h4>Votes ({{ subject.votes.length }})</h4>
        <votes :votes="subject.votes"></votes>
      </div>
      <div class="column">
        <h4>Edit History</h4>
        <edit-history :history="subject.history" v-if="subject"></edit-history>
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
</style>

<script>
import api from '@/api';

import EditHistory from '@/components/EditHistory.vue';
import Votes from '@/components/Votes.vue';

export default {
  components: {
    EditHistory,
    Votes,
  },

  props: {
    subject: {
      type: Object,
      required: true,
      default: null,
    },
  },

  data () {
    return {
      editing: false,
      saving: false,
      voting: false,
    };
  },

  computed: {
    avatarUrl () {
      return api.avatarURL(this.subject.personName);
    },
  },

  methods: {
    edit () {
      this.editing = true;
    },

    update () {
      this.saving = true;
      api
        .updateSubject(this.subject.id, this.subject.personName, this.subject.costumeDescription)
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
