<template>
  <div class="columns hov s-rounded">
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
          <button class="btn btn-sm">
      <i class="icon icon-plus"></i>
    </button>
    </div>
  </div>
  <!-- <div class="column col-1">
    <button class="btn btn-sm">
      <i class="icon icon-plus"></i>
    </button>
  </div> -->
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
