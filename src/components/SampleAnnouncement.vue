<template lang="html">
  <Card
    card-id="sample-announcement"
    title="Send Sample Announcement"
    subtitle="Try sending a sample announcment here"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-on:click="sendRequest()">Try</button>
    </div>

    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'

export default {
  components: { Card },
  data() {
    return {
      loading: false,
      result: ""
    }
  },
  methods: {
    async sendRequest() {
      this.loading = true;
      const res = await fetch(`/announcement/send-sample`)
      const data = await res.json();
      console.log(data);

      this.loading = false;

      // if (data.status === 'FAILED' || data.statue === 'failure') {
      //   this.result = data
      // }
      this.result = data.message

      const hihi = await fetch(`/announcement/list-all`)
      const hihihihi = await hihi.json()
      console.log(hihihihi)
    }
  }
}
</script>

<style lang="scss">
</style>
