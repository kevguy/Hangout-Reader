<template lang="html">
  <div class="mdc-card">
    <div class="header">
      <h2 class="mdc-typography--title">{{title}}</h2>
      <!-- <h3 class="mdc-typography--subheading1">{{notification}}</h3> -->
    </div>
    <div class="card-content">
      <div class="">
        <div class="">
          <h4>Date: </h4>
          {{dateTime}}
        </div>
        <div class="">
          <h4>Title: </h4>
          {{title}}
        </div>
        <div class="">
          <h4>Notification: </h4>
          {{notification}}
        </div>
        <div class="">
          <h4>Body: </h4>
          <div v-for="item in body">
            <div  v-if="item.type==='image'">
              <img class="announcement-image" v-bind:src="'/api/image/' + item.imageId" alt="">
            </div>
            <div class="" v-if="item.type==='text'">
              <div class="">
                Header: {{item.heading}}
              </div>
              <div class="">
                Content: {{item.content}}
              </div>
            </div>
          </div>
          <!-- Body: {{body}} -->
        </div>
        <div class="">
          <h4>Terms and Condition: </h4>
          {{toc}}
        </div>
        <div class="">
          <h4>Language</h4>
          {{lang}}
        </div>
      </div>
    </div>
    <div class="mdc-card__actions">
      <div class="mdc-card__action-buttons">
        <button class="mdc-button mdc-card__action mdc-card__action--button">Action 1</button>
        <button class="mdc-button mdc-card__action mdc-card__action--button">Action 2</button>
      </div>
      <div class="mdc-card__action-icons">
        <i class="material-icons mdc-card__action mdc-card__action--icon" tabindex="0" role="button" title="Share">share</i>
        <i class="material-icons mdc-card__action mdc-card__action--icon" tabindex="0" role="button" title="More options">more_vert</i>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  components: { Card },
  props: ["id", "dateTime", "title", "notification", "body", "toc", "lang"]
}
</script>

<style lang="scss" scoped>
.mdc-card {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.header, .card-content, .card-result {
  margin-left: 8px;
  margin-right: 8px;
}

.announcement-image {
    width: 350px;
    margin: 48px;
}
</style>
