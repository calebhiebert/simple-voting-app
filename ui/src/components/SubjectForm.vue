<template>
  <div class="container">
    <div class="columns">
      <div class="column col-10 col-mx-auto">
        <h3>Add Person</h3>
        <form @submit.prevent="submit">
          <div class="form-group" :class="{'has-error': errors.has('person_name')}">
            <label class="form-label">Person Name</label>
            <input class="form-input" data-vv-as="name" v-validate="{required: true, max: 255, min: 3}" name="person_name" type="text" placeholder="ex. John Smith" v-model="personName">
            <p class="form-input-hint" v-if="errors.has('person_name')">{{ errors.first('person_name') }}</p>
          </div>
          <div class="form-group" :class="{'has-error': errors.has('costume')}">
            <label class="form-label">Costume</label>
            <input class="form-input" name="costume" v-validate="{required: true, max: 255, min: 3}" type="text" placeholder="ex. Super Apu" v-model="costumeDescription">
            <p class="form-input-hint" v-if="errors.has('costume')">{{ errors.first('costume') }}</p>
          </div>
          <button class="btn" type="button" @click="$router.push({name: 'home'})">Cancel</button>
          <button class="btn btn-primary" type="submit" :class="{'loading': saving}">Add</button>
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

.form-input-hint {
  margin-bottom: 0.2rem;
}
</style>

<script>
import api from '@/api';
import gql from 'graphql-tag';
export default {
  data () {
    return {
      personName: '',
      costumeDescription: '',
      saving: false,
    };
  },

  methods: {
    submit (event) {
      event.preventDefault();

      this.$validator.validate().then((valid) => {
        if (valid) {
          this.saving = true;
          this.$apollo
            .mutate({
              mutation: gql`
                mutation CreateSubject($subject: SubjectCreation!) {
                  createSubject(input: $subject) {
                    id
                    personName
                    costumeDescription
                    history {
                      id
                      createdAt
                      editor {
                        id
                        name
                      }
                    }
                  }
                }
              `,
              variables: {
                subject: {
                  personName: this.personName,
                  costumeDescription: this.costumeDescription,
                },
              },
            })
            .then((result) => {
              this.$router.replace({ name: 'home' });
              this.saving = false;
            })
            .catch((err) => {
              this.saving = false;
            });
        }
      });
    },
  },
};
</script>
