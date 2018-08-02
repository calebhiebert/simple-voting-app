<template>
<div class="container top">
  <div class="columns">
    <div class="column col-sm-12 col-xl-6 col-lg-7 col-md-10 col-5 col-mx-auto flex-parent">
      <div class="card phat">
        <div class="card-header">
          <h5 class="card-title h5">Login</h5>
          <div class="card-subtitle" v-if="!working">
            {{ lang.greeting }}
          </div>
          <div class="card-subtitle text-gray" v-if="working && error === null">
            Working on getting you logged in...
          </div>
        </div>
        <div class="card-body" v-if="!working">
          <div class="columns hide-xs">
            <div class="column text-center">
              <button class="btn btn-primary btn-lg phat" @click="goog">Login with Google</button>
            </div>
            <div class="divider-vert" data-content="OR"></div>
            <div class="column text-center">
              <button class="btn btn-primary btn-lg phat" @click="fb">Login with Facebook</button>
            </div>
          </div>
          <div class="columns show-xs">
            <div class="column text-center">
              <button class="btn btn-primary btn-lg phat" @click="goog">Login with Google</button>
            </div>
            <div class="divider-vert" data-content="OR"></div>
            <div class="column text-center">
              <button class="btn btn-primary btn-lg phat" @click="fb">Login with Facebook</button>
            </div>
          </div>
          <div class="toast toast-error mt-2" v-if="error !== null">
            <strong>Whoops!</strong><br/>
            {{ error }}
          </div>
        </div>
        <div class="card-body" v-else>
          <div class="loading"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.container,
.columns {
  height: 100%;
}

.top {
  z-index: 400;
}

.phat {
  width: 100%;
}

.flex-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { WebAuth } from 'auth0-js';
import lang from '../lang.json';
import axios from 'axios';

const webAuth = new WebAuth({
  domain: 'halloween-voting.auth0.com',
  clientID: 'l15qBjZMwq4NVeKCwFruwJJpaWI4Dphy',
});

export default {
  created () {
    if (location.hash !== '') {
      this.working = true;
      webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (err) {
          console.log(err);
          this.error = 'Something went wrong with the login! Please try a different connection.';
          this.working = false;
        } else {
          localStorage.setItem('access-token', authResult.accessToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${authResult.accessToken}`;
          this.$router.replace({ name: 'home' });
        }
      });
    }
  },

  data () {
    return {
      working: false,
      error: null,
    };
  },

  computed: {
    lang () {
      return lang;
    },
  },

  methods: {
    authenticate (connection) {
      webAuth.authorize({
        connection: connection,
        responseType: 'token',
        scope: 'openid profile',
        clientID: 'l15qBjZMwq4NVeKCwFruwJJpaWI4Dphy',
        redirectUri: 'http://localhost:8080/login',
      });
    },

    goog () {
      this.authenticate('google-oauth2');
    },

    fb () {
      this.authenticate('facebook');
    },
  },
};
</script>
