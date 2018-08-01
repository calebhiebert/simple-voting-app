<template>
  <div class="clearfix">
    <div class="columns col-gapless">
      <!-- Navigation/Vote buttons for desktop -->
      <div class="column col-1 col-lg-2 col-sm-3 min-90" v-if="!isMobile">
        <div class="btn-group">
          <button class="btn btn-sm" @click="$router.push({name: 'home'})" disabled>
            <i class="icon icon-arrow-left"></i>
          </button>
          <button class="btn btn-sm btn-primary" disabled>Vote</button>
        </div>
      </div>

      <!-- Avatar -->
      <div class="column col-1 col-lg-2 col-sm-3 col-xs-3 text-center avatar-column" :class="{'col-mx-auto': isMobile}">
        <figure class="avatar avatar-xl low-opacity">
          <img :src="avatarUrl" alt="avatar">
        </figure>
      </div>

      <!-- Name/Costume View -->
      <div class="column col-5 col-sm-12 text-secondary" :class="{'col-mx-auto': isMobile}">
        <div class="text-center show-sm">
          <h1>{{ name }}</h1>
          <h4>Dwarf</h4>
        </div>
        <div class="hide-sm">
          <h1>{{ name }}</h1>
          <h4>Dwarf</h4>
        </div>
      </div>

      <!-- Nagivation/Vote buttons for mobile -->
      <div class="column col-2 col-md-3 col-sm-12 col-ml-auto text-center" v-if="isMobile">
        <button class="btn" @click="$router.push({name: 'home'})" disabled>
          <i class="icon icon-arrow-left"></i>
        </button>
        <button class="btn btn-primary" disabled>Vote</button>
      </div>
    </div>

    <div class="columns">

      <!-- Votes view -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history text-secondary">
        <h4>Votes</h4>
        <div class="loading low-opacity"></div>
      </div>

      <!-- Edit History View -->
      <div class="column col-6 col-sm-10 col-mx-auto edit-history text-secondary">
        <button class="btn btn-action btn-sm float-right" disabled>
          <i class="icon" :class="{'icon-arrow-down': !editHistoryVisible, 'icon-arrow-up': editHistoryVisible}"></i>
        </button>
        <h4>Edit History</h4>
      </div>
    </div>
    <div class="divider"></div>
    <p class="text-center text-secondary">{{ lang.editNotice }} <a class="text-secondary">{{ lang.editText }}</a></p>
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

.low-opacity {
  opacity: 0.5;
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

  data () {
    return {
      lang,
    };
  },

  computed: {
    avatarUrl () {
      return avatarURL('Placeholder');
    },

    isMobile () {
      return ['sm', 'xs'].indexOf(this.$mq) !== -1;
    },

    name () {
      const name = lang.names[Math.round(Math.random() * lang.names.length - 1)];
      return name;
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
};
</script>
