<template>
  <div class="columns hov s-rounded" @click="$emit('selected')">
    <div class="column">
      <div class="tile">
        <div class="tile-icon">
          <figure class="avatar avatar-lg">
            <img :src="avatarUrl">
          </figure>
        </div>
        <div class="tile-content">
          <p class="tile-title">{{ name }} ({{costume}})</p>
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

.hov:hover {
  background-color: rgba(0, 0, 0, 0.116);
}
</style>

<script>
import api from '@/api';

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
  },

  methods: {
    vote() {
      console.log('Vote');
    },
  },

  computed: {
    barWidth() {
      return this.votePercent * 100 + '%';
    },
    avatarUrl() {
      return api.avatarURL(this.name);
    },
  },
};
</script>
<style scoped>
.tile-content > .tile-title {
  margin-bottom: 0.2rem !important;
}
</style>
