<template>
  <div class="columns hov s-rounded" :class="{'voted-for': votedFor}" @click="$emit('selected')">
    <div class="column">
      <div class="tile">
        <div class="tile-icon">
          <figure class="avatar avatar-lg" :class="{'badge': votedFor}">
            <img :src="avatarUrl">
          </figure>
        </div>
        <div class="tile-content">
          <div class="tile-title">{{ name }}</div>
          <div class="costume-description text-gray">{{ costume }}</div>
          <div class="bar bar-sm">
            <div class="bar-item" role="progressbar" :style="{width: barWidth}" :aria-valuenow="votePercent * 100" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hov {
  padding: 0.5rem;
  cursor: pointer;
}

.costume-description {
  margin-top: -0.2rem;
  margin-bottom: 0.2rem;
}

.hov:hover {
  background-color: rgba(0, 0, 0, 0.116);
}

.tile-content > .tile-title {
  margin-bottom: 0.2rem !important;
}

.voted-for {
  background-color: #5755d917;
  /* border: 1px solid #5755d9; */
}

.bar-item {
  transition: width 0.35s;
}
</style>

<script>
import { avatarURL } from '@/api';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    costume: {
      type: String,
      required: true,
    },
    votePercent: {
      type: Number,
      required: true,
      default: 1,
    },
    votedFor: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    barWidth () {
      return this.votePercent * 100 + '%';
    },
    avatarUrl () {
      return avatarURL(this.name);
    },
  },
};
</script>
