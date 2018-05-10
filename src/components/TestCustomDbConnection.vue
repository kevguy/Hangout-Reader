<template lang="html">
  <Card
    card-id="test-custom-db-connection"
    title="Test Custom DB Connection"
    subtitle="Test different config to see if it can connect to a Oracle database"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <!-- User -->
      <div class="">
        <div class="mdc-text-field">
          <input
            type="text"
            class="mdc-text-field__input"
            id="test-custom-db-connection--user"
            v-model="user">
          <label
            for="test-custom-db-connection--user"
            class="mdc-floating-label">User</label>
        </div>
      </div>

      <!-- Password -->
      <div class="">
        <div class="mdc-text-field">
          <input
            type="text"
            class="mdc-text-field__input"
            id="test-custom-db-connection--password"
            v-model="password">
          <label
            for="test-custom-db-connection--password"
            class="mdc-floating-label">Password</label>
        </div>
      </div>

      <!-- Connect String -->
      <div class="">
        <div class="mdc-text-field">
          <input
            type="text"
            class="mdc-text-field__input"
            id="test-custom-db-connection--connectstring"
            v-model="connectString">
          <label
            for="test-custom-db-connection--connectstring"
            class="mdc-floating-label">Connect String</label>
        </div>
      </div>

      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="sendRequest()">Test</button>
        </div>
      </div>
    </div>
    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'

export default {
  components: { Card },
  data() {
    return {
      user: '',
      password: '',
      connectString: '',
      loading: false,
      result: '',
      textFields: [],
    }
  },
  mounted() {
    const textFields = document.querySelectorAll('.mdc-text-field');
    for (let i = 0; i < textFields.length; i++) {
      this.textFields.push(new MDCTextField(textFields[i]))
    }

  },
  methods: {
    async sendRequest() {
      this.loading = true
      const result = await fetch(`/api/test-custom-db-connection`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: this.user,
            password: this.password,
            connectString: this.connectString
          })
        })
        .then(res => res.json())

      this.loading = false
      if (result.status !== 'Success') {
        this.result = `Failure: ${result.message}`
      } else {
        this.result = `Success: ${result.message}`
      }
    }
  }
}
</script>

<style lang="scss">
#test-custom-db-connection {
  .mdc-text-field {
      margin-bottom: 25px;
  }
}
</style>
