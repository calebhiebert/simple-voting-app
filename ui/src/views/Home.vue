<template>
  <div class="container">
    <div class="columns mt-2">
      <div class="column col-6 col-mx-auto text-center">
        <h1>Guests</h1>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-mx-auto">
        <main-page-vote-view class="mt-2" :name="'Name Here'" :votePercent="0.75"></main-page-vote-view>
        <main-page-vote-view class="mt-2" :name="'John Doe'" :votePercent="0.75"></main-page-vote-view>
        <main-page-vote-view class="mt-2" :name="'Jane Smith'" :votePercent="0.5"></main-page-vote-view>
        <main-page-vote-view class="mt-2" :name="'Potato Salad'" :votePercent="0.5"></main-page-vote-view>
        <main-page-vote-view class="mt-2" :name="'Rick'" :votePercent="0.5"></main-page-vote-view>
      </div>
    </div>
    <div class="divider"></div>
    <div class="columns">
      <div class="column col-mx-auto text-center">
        Don't see the person/costume you're looking for? <a href="#">Add them</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
</style>

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
