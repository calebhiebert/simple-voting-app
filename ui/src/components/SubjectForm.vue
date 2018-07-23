<template>
  <div class="container">
    <div class="columns">
      <div class="column col-10 col-mx-auto">
        <h3>Add Person</h3>
        <form @submit="submit">
          <div class="form-group">
            <label class="form-label">Person Name</label>
            <input class="form-input" type="text" placeholder="ex. John Smith">
          </div>
          <div class="form-group">
            <label class="form-label">Costume</label>
            <input class="form-input" type="text" placeholder="ex. Super Apu">
          </div>
          <button class="btn btn-error" @click="$router.push({name: 'home'})">Cancel</button>
          <button class="btn" type="submit">Add</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  margin-top: 1rem;
}

button {
  margin-right: 0.4rem;
  margin-top: 0.2rem;
}
</style>

<script>
import api from '@/api';
export default {
  data () {
    return {
      personName: '',
      costumeDescription: '',
    };
  },

  methods: {
    submit (event) {
      event.preventDefault();
      api
        .createSubject(this.personName, this.costumeDescription)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
  },
};
</script>
