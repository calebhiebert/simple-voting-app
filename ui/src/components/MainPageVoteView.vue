<template>

      <div class="columns">
      <div class="column">
          <div class="tile">
    <div class="tile-icon">
      <figure class="avatar avatar-x1">
        <img :src="avatarUrl">
      </figure>
    </div>
    <div class="tile-content">
      <p class="tile-title">{{ name }}</p>
      <div class="bar bar-sm">
        <div class="bar-item" role="progressbar" :style="{width: barWidth}" :aria-valuenow="votePercent * 100" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
      </div>
      <div class="column col-xs-12">
        <button class="btn btn-action btn-sm btn-primary circle">
          <i class="icon icon-menu"></i>
        </button>
      </div>
    </div>
</template>
<script>
import md5 from 'md5';

export default {
  props: {
    name: {
      type: String,
      required: true,
      default: 'John Smith',
    },
    votePercent: {
      type: Number,
      required: true,
      default: 1,
    },
  },

  computed: {
    barWidth () {
      return this.votePercent * 100 + '%';
    },
    avatarUrl () {
      return `http://www.gravatar.com/avatar/${md5(this.name)}.jpg?r=g&d=monsterid`;
    },
  },
};
</script>
<style scoped>
.tile-content > .tile-title {
  margin-bottom: 0.2rem !important;
}
</style>
