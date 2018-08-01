<template>
<div class="container">
  <div class="columns">
    <div class="column col-10 col-sm-12 col-mx-auto">
      <subject-view :status="status" v-show="status.loaded === true"></subject-view>
      <subject-view-placeholder v-if="status.loaded === false"></subject-view-placeholder>
    </div>
  </div>
</div>
</template>

<style scoped>
.container {
  margin-top: 1rem;
}
</style>

<script>
import SubjectView from '@/components/SubjectView.vue';
import SubjectViewPlaceholder from '@/components/SubjectViewPlaceholder.vue';

export default {
  components: {
    SubjectView,
    SubjectViewPlaceholder,
  },

  data () {
    return {
      status: {
        loaded: false,
      },
    };
  },
};
</script>
