<template>
  <div class="container">
    <main-page-vote-view :name="'Name Here'" :votePercent="0.9"></main-page-vote-view>
  </div>
</template>

<script>
// @ is an alias to /src
import MainPageVoteView from '@/components/MainPageVoteView.vue';

export default {
  name: 'home',
  components: {
    MainPageVoteView,
  },
};
</script>
