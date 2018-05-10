<template lang="html">
  <Card
    card-id="query-user"
    title="Query User"
    subtitle="Query user messages here"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
  <div class="" slot="content">
      <div class="">
        dsvsdvsdv
      </div>
      <!-- <input type="text" name="" value="" v-model="clubId"> -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="query-user--clubid"
          v-model="clubId"
          style="margin-right: 8px;"
        >
        <label
          for="query-user--clubid"
          class="mdc-floating-label">Club ID</label>
      </div>
      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-on:click="sendRequest()">Query</button>
      <div class="">
        <ul>
          <li>Unread English Messages: {{enMsgUnreadCount}}</li>
          <li>Unread Chinese Messages: {{zhMsgUnreadCount}}</li>
        </ul>
      </div>
      <!-- <button type="button" name="button" v-on:click="sendRequest()">Query</button> -->
      <div class="user-all-view">
        <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list demo-list demo-list--with-avatars demo-list--icon-placeholders">
          <li
            class="mdc-list-item"
            v-for="(item, idx) in announcementList"
            v-bind:key="idx">
            <span class="mdc-list-item__graphic" role="presentation">
              <i class="material-icons" aria-hidden="true">folder</i>
            </span>
            <span class="mdc-list-item__text">
              {{item.title}} (ID: {{item.id}})
              <span class="mdc-list-item__secondary-text">{{item.dateTime}}</span>
            </span>
            <button
              v-bind:disabled="item.read"
              class="mdc-list-item__meta mdc-button mdc-button--raised mdc-ripple-upgraded"
              v-on:click="readMsg(item, idx)">Read</button>
            <button
              class="mdc-list-item__meta mdc-button mdc-button--raised mdc-ripple-upgraded"
              v-on:click="deleteMsg(item, idx)">Delete</button>
          </li>
        </ul>
      </div>


  </div>
</Card>

</template>

<script>
import Card from '../components/UI/Card.vue'
import AnnouncementCard from '../components/UI/AnnouncementCard.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'

export default {
  components: { Card, AnnouncementCard },
  data() {
    return {
      clubId: '',
      announcementList: [],
      enMsgUnreadCount: 0,
      zhMsgUnreadCount: 0,
      textFields: [],
      loading: false,
      result: ""
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
      const resultList = await fetch(`/api/users/${this.clubId}`)
        .then((res) => res.json())
      this.announcementList = resultList

      // query number of unread messages
      const zhResult = await fetch(`/api/icon-badge/ZH-HK/${this.clubId}`)
        .then((res) => res.json())
      this.zhMsgUnreadCount = zhResult.no_of_messages
      const enResult = await fetch(`/api/icon-badge/EN-US/${this.clubId}`)
        .then((res) => res.json())
      this.enMsgUnreadCount = enResult.no_of_messages
    },
    async deleteMsg(item, idx) {
      const id = item.id
      const res = await fetch(`/api/users/delete`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clubId: this.clubId,
          messageId: item.id
        })
      })
      const result = await res.json()
      console.log(result)

      if (result.status === 'Success') {
        this.announcementList.splice(idx, 1)
      } else {
        alert('Deletion Failed')
      }
    },
    async readMsg(item, idx) {
      const id = item.id
      const res = await fetch(`/api/users/read`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clubId: this.clubId,
          messageId: item.id
        })
      })
      const result = await res.json()
      console.log(result)

      if (result.status === 'Success') {
        await this.sendRequest()
      } else {
        alert('Read Failed')
      }
    }
  }
}
</script>

<style lang="scss">
#query-user {
  max-width: 600px;
}
.query-user-card {
  height: 350px;
  width: 350px;
}

.mdc-list,
.mdc-list-group {
  max-width: 600px;
}

.user-all-view .mdc-list, .user-all-view .mdc-list-group {
    border: 1px solid rgba(0, 0, 0, 0.1);
}

// .demo-list--icon-placeholders,
// .demo-list--with-avatars {
//   @include mdc-list-item-graphic-ink-color(white);
//   @include mdc-list-item-graphic-fill-color(text-icon-on-background);
// }
//
// .demo-list--avatar-and-meta-icon {
//   @include mdc-list-item-meta-ink-color($material-color-pink-a200);
// }
//
// .demo-list-group--custom,
// .demo-list--custom {
//   @include mdc-list-divider-color($material-color-pink-50);
// }
//
// .demo-list--custom {
//   @include mdc-list-item-primary-text-ink-color($material-color-blue-600);
//   @include mdc-list-item-secondary-text-ink-color($material-color-purple-600);
//   @include mdc-list-item-graphic-fill-color($material-color-pink-400);
//   @include mdc-list-item-graphic-ink-color($material-color-pink-50);
//   @include mdc-list-item-meta-ink-color($material-color-orange-500);
// }
</style>
