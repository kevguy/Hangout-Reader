<template lang="html">
  <div class="">
    <div class="announcement-all-view">
      <AnnouncementCard
        v-for="announcement in announcementList"
        v-bind:key="announcement.id"
        v-bind:id="announcement.id"
        v-bind:date-time="announcement.dateTime"
        v-bind:title="announcement.title"
        v-bind:notification="announcement.notification"
        v-bind:body="announcement.body"
        v-bind:toc="announcement.toc"
        v-bind:type="announcement.type"
        v-bind:lang="announcement.lang"
      />
    </div>
  </div>
</template>

<script>
import AnnouncementCard from '../components/UI/AnnouncementCard.vue'

export default {
  components: { AnnouncementCard },
  data() {
    return {
      announcementList: []
    }
  },
  async created() {
    await fetch(`/api/announcement/list-all`)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.announcementList = result
      })
    await fetch(`/api/users/check`)
      .then(response => response.json())
      .then(result => console.log(result))
  }
}
</script>

<style lang="scss">
.announcement-all-view {
  display: flex;
  flex-flow: row wrap;
}
</style>
