<template>
  <form @submit.prevent="submit">
    <div class="form-group" :class="{'has-error': errors.has('person_name')}">
      <input class="form-input input-lg" data-vv-as="name" v-validate="{required: true, max: 255, min: 3}" name="person_name" placeholder="Name" v-model.trim="personName">
      <p class="form-input-hint" v-if="errors.has('person_name')">{{ errors.first('person_name') }}</p>
    </div>
    <div class="form-group" :class="{'has-error': errors.has('costume')}">
      <input class="form-input" name="costume" v-validate="{required: true, max: 255, min: 3}" placeholder="Costume" v-model.trim="costumeDescription">
      <p class="form-input-hint" v-if="errors.has('costume')">{{ errors.first('costume') }}</p>
    </div>
    <button class="btn" type="button" @click="$emit('close')">Cancel</button>
    <button class="btn btn-primary" :class="{loading: saving}">Update</button>
  </form>
</template>
<script>
import { EDIT_SUBJECT_MUTATION, GET_SUBJECT_BASIC_QUERY } from '../queries';

export default {
  props: {
    subjectId: {
      type: String,
      required: true,
    },
  },

  apollo: {
    subject: {
      query: GET_SUBJECT_BASIC_QUERY,

      variables () {
        return {
          id: this.subjectId,
        };
      },

      result ({ data }) {
        if (data !== undefined) {
          this.personName = data.subject.personName;
          this.costumeDescription = data.subject.costumeDescription;
        }
      },
    },
  },

  data () {
    return {
      personName: '',
      costumeDescription: '',
      saving: false,
    };
  },

  methods: {
    submit () {
      this.$validator.validate().then((valid) => {
        if (valid) {
          this.saving = true;
          this.$apollo
            .mutate({
              mutation: EDIT_SUBJECT_MUTATION,
              variables: {
                subject: {
                  id: this.subjectId,
                  personName: this.personName,
                  costumeDescription: this.costumeDescription,
                },
              },
            })
            .then((result) => {
              this.saving = false;
              this.$emit('close');
            });
        }
      });
    },
  },
};
</script>
<style scoped>
button {
  margin-right: 0.4rem;
}

form {
  margin-bottom: 1rem;
}

@media screen and (max-width: 600px) {
  form {
    margin-top: 1rem;
  }
}
</style>
