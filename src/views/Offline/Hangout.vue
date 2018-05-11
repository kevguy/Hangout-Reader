<template lang="html">
  <div class="">
    <section id="dynamic-demo-toolbar">
      <nav id="dynamic-tab-bar" class="mdc-tab-bar" role="tablist">
        <a role="tab" aria-controls="panel-1"
           class="mdc-tab mdc-tab--active" href="#panel-1"
           v-on:click="changeMode('list')">List</a>
        <a role="tab" aria-controls="panel-2"
           class="mdc-tab" href="#panel-2"
           v-on:click="changeMode('conversation')">Conversation</a>
        <a role="tab" aria-controls="panel-3"
           class="mdc-tab" href="#panel-3">Item Three</a>
        <span class="mdc-tab-bar__indicator"></span>
      </nav>
    </section>
    <UploadFile />
    <ConversationList v-if="mode === 'list'"/>
    <Conversation v-if="mode === 'conversation'" />
  </div>
</template>

<script>
import { MDCTabBar } from '@material/tabs/dist/mdc.tabs'
import UploadFile from '../../components/Hangout/UploadFile.vue';
import ConversationList from '../../components/Hangout/ConversationList.vue';
import Conversation from '../../components/Hangout/Conversation.vue';

export default {
  components: { UploadFile, Conversation, ConversationList },
  data() {
    return {
      dynamicBar: undefined,
      mode: 'list'
    }
  },
  mounted() {
    this.initDynamicBar()
  },
  methods: {
    initDynamicBar() {
      this.dynamicBar = new MDCTabBar(document.querySelector('#dynamic-tab-bar'))
      this.dynamicBar.tabs.forEach((tab) => {
        tab.preventDefaultOnClick = true;
      })
    },
    changeMode(mode) { this.mode = mode; }
  }
}
</script>

<style lang="css">
</style>
