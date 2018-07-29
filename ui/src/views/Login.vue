<template>
<div></div>
</template>
<style>
.auth0-lock-badge-bottom {
  display: none !important;
}

.auth0-lock-widget {
  box-shadow: 0 0 0 0 !important;
  transition-delay: 0 !important;
}

.auth0-lock-overlay {
  opacity: 0.7 !important;
}

.auth0-lock-header {
  height: 2.5rem !important;
}
</style>

<script>
import { getLock } from '@/auth';
import api from '@/api';
import axios from 'axios';

export default {
  created () {
    const lock = getLock();

    if (location.hash === '') {
      lock.show();
    } else {
      lock.resumeAuth(location.hash, (err, result) => {
        if (err) {
          this.$router.replace({ name: 'login' });
          lock.show();
        } else {
          localStorage.setItem('access-token', result.accessToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${
            result.accessToken
          }`;
          this.$router.replace({ name: 'home' });

          // api.getMe().then((me) => {
          //   this.$store.commit('setMe', me);
          // });
        }
      });
    }
  },
};
</script>
