<template lang="html">
  <Card
    card-id="query-announcement"
    title="Send Sample Announcement"
    subtitle="Try sending a sample announcment here"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <input type="text" name="" value="" v-model="messageId">
      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-on:click="sendRequest()">Try</button>

    </div>

    <div class="" slot="result">
      <AnnouncementCard
        v-bind:key="announcement.id"
        v-bind:id="announcement.id"
        v-bind:date-time="announcement.dateTime"
        v-bind:title="announcement.title"
        v-bind:notification="announcement.notification"
        v-bind:body="announcement.body"
        v-bind:type="announcement.type"
        v-bind:lang="announcement.lang"
      />
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'
import AnnouncementCard from './UI/AnnouncementCard.vue'

export default {
  components: { Card, AnnouncementCard },
  data() {
    return {
      messageId: '',
      announcement: {}
    }
  },
  async sendRequest() {
    const res = fetch(`/api/messages/${messageId}`)
    const result = res.json()
    this.announcement = result
  }
}
</script>

<style lang="css">
</style>
