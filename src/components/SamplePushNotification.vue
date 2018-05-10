<template lang="html">
  <Card
    card-id="sample-push-notification"
    title="Sample Notification"
    subtitle="Send yourself some of 'em fine notifications"
    v-bind:loading="loading"
    v-bind:resultAvailable="result">
    <div class="" slot="content">

      <!-- Club ID -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="sample-pish-notification--clubId"
          v-model="clubId"
        >
        <label
          for="sample-pish-notification--clubId"
          class="mdc-floating-label">Club ID</label>
      </div>

      <!-- Language -->
      <div class="demo-radio-row">
        <h4>Language:</h4>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="sample-push-notification-chin-radio" checked="" name="lang-pref" v-model="lang" v-bind:value="'ZH-HK'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="sample-push-notification-chin-label" for="sample-push-notification-chin-radio">Chinese</label>
        </div>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="sample-push-notification-eng-radio" name="lang-pref" v-model="lang" v-bind:value="'EN-US'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="sample-push-notification-eng-label" for="sample-push-notification-eng-radio">English</label>
        </div>
      </div>

      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-on:click="sendRequest()">Punch It</button>
    </div>
    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'
import { MDCRadio } from '@material/radio/dist/mdc.radio'

export default {
  components: { Card },
  data() {
    return {
      textFields: [],
      clubId: "8096399897",
      lang: "ZH-HK",
      loading: false,
      result: ""
    }
  },
  mounted() {
    this.mountHandler()
  },
  methods: {
    async sendRequest() {
      this.loading = true
      const res = await fetch(`/api/notification/send`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clubId: this.clubId,
          lang: this.lang,
          title: 'Sample Title',
          notification: 'Sample Notification'
        })
      })

      const data = await res.json();

      this.loading = false
      if (data.status !== 'Success') {
        this.result = `Failure: ${data.message}`;
      } else {
        this.result = `Success: ${data.message}`;
      }
      console.log(this.result);
    },
    mountHandler() {
      const textFields = document.querySelectorAll('.mdc-text-field');
      for (let i = 0; i < textFields.length; i++) {
        this.textFields.push(new MDCTextField(textFields[i]))
      }
      const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    }
  }
}
</script>

<style lang="css">
</style>
