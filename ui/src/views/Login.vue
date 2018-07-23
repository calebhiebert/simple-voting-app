<template>
  
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
import axios from 'axios';

export default {
  created() {
    const lock = new Auth0Lock('l15qBjZMwq4NVeKCwFruwJJpaWI4Dphy', 'halloween-voting.auth0.com', {
      closeable: false,
      languageDictionary: {
        title: '',
      },
      theme: {
        primaryColor: '#5755d9',
        logo: '',
      },
    });

    lock.on('authenticated', (authResult) => {
      localStorage.setItem('access-token', authResult.accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authResult.accessToken}`;
      this.$router.replace({ name: 'home' });
    });

    if (location.hash === '') {
      lock.show();
    }
  },
};
</script>

