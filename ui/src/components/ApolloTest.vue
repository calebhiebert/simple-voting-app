<template>
  <div>
    <h1>Apollo Testing</h1>
    <div class="loading" v-if="$apollo.loading"></div>
    <pre>
      {{ JSON.stringify(subjects, null, 2) }}
    </pre>
  </div>
</template>
<script>
import gql from 'graphql-tag';

export default {
  data () {
    return {
      subjects: null,
    };
  },

  apollo: {
    subjects: gql`
      query {
        subjects {
          id
        }
      }
    `,
  },
};
</script>
