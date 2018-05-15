<template lang="html">
  <div class="">
    <!-- {{this.$store.getters['Hangout/msgToShow']}}
    {{this.$store.getters['Hangout/numOfPages']}}
    {{this.$store.state.Hangout.currentPageNo}} -->
    Showing Page {{currentPageNo}} of {{numOfPages}}
    <ul
      class="mdc-list demo-list mdc-list--two-line mdc-list--avatar-list">



      <li class="mdc-list-divider" role="separator"></li>
      <li
        class="mdc-list-item mdc-ripple-upgraded fuck"
        v-for="msg in msgToShow">
        <img
          class="mdc-list-item__graphic material-icons"
          v-bind:src="imageMap[msg.senderId]"
          aria-hidden="true">
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__sender-name">{{msg.senderName}}: </span>
          <span
            class="mdc-list-item__text mdc-list-item__msg-text"
            v-if="msg.content.type === 'text'"
            v-for="content in msg.content.contents">
            <br v-if="content.content === '\n'">
            <span v-else>{{content.content}}</span>
          </span>
          <span
            v-else
            class="mdc-list-item__text">
            {{msg.content}}
          </span>
          <span class="mdc-list-item__secondary-text">{{msg.msgTime}}</span>
        </span>
        <span class="mdc-list-item__meta material-icons" aria-hidden="true">info</span>
      </li>
      <!-- <li class="mdc-list-divider" role="separator"></li> -->
    </ul>

    <ul>
      <li v-for="msg in msgToShow">
        <ul>
          <li>SenderName: {{msg.senderName}}</li>
          <li>MsgTime: {{msg.msgTime}}</li>
          <li>{{msg}}</li>
        </ul>
      </li>
    </ul>

    <Pagination />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Pagination from './Pagination.vue';

import { MDCRipple } from '@material/ripple/dist/mdc.ripple';

export default {
  components: { Pagination },
  data() {
    return {
      msglist: [],
    }
  },
  mounted() {
    const lists = document.querySelectorAll('.mdc-list-item')
    const arr = []

    arr.forEach.call(lists, (list) => {
      // do whatever
      const item = new MDCRipple(list)
      this.msglist.push(item)
    })
  },
  watch: {
    msgToShow(val) {
      val.forEach((item) => {
        console.log(item.content.type)
      })
    }
  },
  computed: {
    ...mapState('Hangout', {
      currentPageNo: state => state.currentPageNo,
      imageMap: state => state.profileImgMap,
    }),
    ...mapGetters({
      msgToShow: 'Hangout/msgToShow',
      numOfPages: 'Hangout/numOfPages'
    })
    // ...mapGetters() {
    //
    // }
  },
  methods: {

  }
}
</script>

<style lang="scss">
// .demo-list {
//   max-width: 600px;
//   border: 1px solid rgba(0, 0, 0, 0.1); }

.mdc-list--two-line {

  .mdc-list-item {
    height: auto;
    margin-top: 4px;
    margin-bottom: 4px;

    .mdc-list-item__text, .mdc-list-item__secondary-text {
      white-space: unset;
    }

    .mdc-list--avatar-list .mdc-list-item__graphic {
      background-color: rgba(0, 0, 0, 0.3);
      color: white;
    }

    .mdc-list-item__msg-text {
      // font-size: 18px;
    }

    .mdc-list-item__sender-name {
      // font-weight: bold;
      font-size: 18px;
    }
  }
}

.fuck {
  height: 0;
  margin: 0;
  border: none;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.12);
}



</style>
