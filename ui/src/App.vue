<template>
  <div id="app">
    <modal ref="settings" title="Settings">
      <settings></settings>
    </modal>
    <transition name="fade-virt-rev">
      <div class="p-2 absolute top" :class="{'wide': isMobile, 'right': !isMobile}" @click="$store.commit('toast', '')" v-if="$store.state.toast !== ''">
        <div class="toast toast-success">
          <button class="btn btn-clear float-right" @click="$store.commit('toast', '')"></button>
          <i class="icon icon-check"></i>
          {{ $store.state.toast }}
        </div>
      </div>
    </transition>
    <button class="btn btn-link mt-2 ml-2 absolute" @click="showSettings">
      <i class="icon icon-more-vert"></i>
    </button>
    <div class="toast toast-warning text-center top" v-if="isBanned">
      <strong>Warning</strong>
      <br/>
      {{ lang.banNotice }}
    </div>
    <transition name="shrink" mode="out-in">
      <router-view style="position: absolute; z-index: -1;"/>
    </transition>
  </div>
</template>
<style>
.top {
  z-index: 100;
}

.wide {
  width: 100%;
}

.right {
  right: 0;
}

.fade-virt-enter-active,
.fade-virt-leave-active {
  transition: all 125ms ease;
}

.fade-virt-enter,
.fade-virt-leave-active {
  opacity: 0;
  transform: translateY(10px);
}

.shrink-enter-active,
.shrink-leave-active {
  transition: all 125ms ease;
}

.shrink-enter,
.shrink-leave-active {
  opacity: 0;
  transform: scale(0.975, 0.975);
}

.fade-virt-rev-enter-active,
.fade-virt-rev-leave-active {
  transition: all 0.25s ease;
}

.fade-virt-rev-enter,
.fade-virt-rev-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
<script>
import lang from '@/lang.json';
import { GET_ME_QUERY } from '@/queries';

import Modal from './components/Modal';
import Settings from './components/Settings';

export default {
  components: {
    Modal,
    Settings,
  },

  data () {
    return { lang };
  },

  methods: {
    showSettings () {
      this.$refs.settings.show();
    },
  },

  apollo: {
    user: GET_ME_QUERY,
  },

  computed: {
    isMobile () {
      return ['sm', 'xs'].indexOf(this.$mq) !== -1;
    },
    isBanned () {
      if (this.user) {
        return this.user.banned;
      } else {
        return false;
      }
    },
  },
};
</script>
