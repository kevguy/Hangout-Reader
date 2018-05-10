<template lang="html">
  <div class="admin-content">
    <!-- <ClientSrch /> -->
    <UploadImage />
    <SampleAnnouncement />
    <SqlTableStatus />
    <SamplePushNotification />
    <TestCustomDbConnection />
  </div>
</template>

<script>
import UploadImage from '../components/UploadImage.vue'
import SampleAnnouncement from '../components/SampleAnnouncement.vue'
import SqlTableStatus from '../components/SqlTableStatus.vue'
import SamplePushNotification from '../components/SamplePushNotification.vue'
import TestCustomDbConnection from '../components/TestCustomDbConnection.vue'
import Card from '../components/UI/Card.vue'

// import ClientSrch from '../components/ClientSearch.vue'

export default {
  components: {
    UploadImage,
    Card,
    SampleAnnouncement,
    SqlTableStatus,
    SamplePushNotification,
    TestCustomDbConnection
  }
}
</script>

<style lang="scss">
.admin-content {
  display: flex;
  flex-flow: row wrap;
}
</style>
