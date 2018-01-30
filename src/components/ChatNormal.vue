<template lang="html">
  <div class="">
    <ul class="demo-list-three mdl-list">
      <li
        class="mdl-list__item mdl-list__item--three-line mdl-shadow--2dp fuck"
        v-for="(msg,idx) in msgsToShow"
        v-bind:key="idx">
        <span class="mdl-list__item-primary-content">

          <template v-if="showPerson">
            <img
              v-if="profilePics[msg.senderId]"
              v-bind:src="profilePics[msg.senderId].base64">
            <i v-else class="material-icons  mdl-list__item-avatar">person</i>
            <span>{{msg.senderName}}</span>
          </template>

          <span
            v-if="msg.content.message && showMsg"
            class="mdl-list__item-text-body"
            v-html="msg.content.message"></span>

          <div
            v-if="msg.content.photo.url && showPicture"
            class="demo-card-image mdl-card mdl-shadow--2dp"
            v-bind:style="{ background: 'url(' + msg.content.photo.url + ') center / cover' }">
            <div class="mdl-card__title mdl-card--expand"></div>
            <div class="mdl-card__actions">
              <span class="demo-card-image__filename"></span>
            </div>
          </div>

          <span
            class="mdl-list__item-text-body"
            style="float: right;font-style: italic;margin-top:8px;font-size:12px;"
            v-if="showTime">
            {{msg.msgTime}}
          </span>

        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ChatNormal',
  props: ['msgsToShow', 'profilePics'],
  computed: {
    ...mapState({
      showPerson: state => state.settings.showPerson,
      showPicture: state => state.settings.showPicture,
      showMsg: state => state.settings.showMsg,
      showTime: state => state.settings.showTime,
    }),
  },
};
</script>

<style lang="scss">
</style>
