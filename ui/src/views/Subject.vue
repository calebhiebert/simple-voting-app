<template>
<div class="container">
  <div class="columns">
    <div class="column col-10 col-mx-auto">
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

  data () {
    return {
      subject: null,
    };
  },

  created () {
    api.getSubject(this.$route.params.id).then((subject) => {
      console.log(subject);
      this.subject = subject;
    });
  },
};
</script>
