<template>
  <div class="columns hov s-rounded">
    <div class="column">
      <div class="tile">
        <div class="tile-icon">
          <figure class="avatar avatar-lg low-opacity">
            <img :src="avatarUrl">
          </figure>
        </div>
        <div class="tile-content">
          <div class="tile-title text-secondary">{{ name }}</div>
          <div class="costume-description text-secondary">{{ costume }}</div>
          <progress class="progress low-opacity" max="100"></progress>
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

.costume-description {
  margin-top: -0.2rem;
  margin-bottom: -0.4rem;
}

.low-opacity {
  opacity: 0.2;
}
</style>

<script>
import { avatarURL } from '@/api';
import lang from '../lang.json';

export default {
  computed: {
    avatarUrl () {
      return avatarURL('Placeholder');
    },

    name () {
      const name = lang.names[Math.round(Math.random() * lang.names.length - 1)];
      return name;
    },

    costume () {
      return 'Dwarf';
    },
  },
};
</script>
