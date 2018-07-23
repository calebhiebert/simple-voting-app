<template>
<div class="container">
  <div class="columns">
    <div class="column col-10 col-sm-12 col-mx-auto">
      <subject-view :subject="subject" v-if="subject"></subject-view>
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
import api from '@/api';

export default {
  components: {
    SubjectView,
  },

  created () {
    this.$store.commit('setSubject', null);
    api.getSubject(this.$route.params.id).then((subject) => {
      this.$store.commit('setSubject', subject);
    });
  },

  computed: {
    subject () {
      return this.$store.state.subject;
    },
  },
};
</script>
