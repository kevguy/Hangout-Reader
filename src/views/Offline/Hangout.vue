<template lang="html">
  <div class="">
    <section id="dynamic-demo-toolbar">
      <nav id="dynamic-tab-bar" class="mdc-tab-bar" role="tablist">
        <a role="tab" aria-controls="panel-1"
           class="mdc-tab mdc-tab--active" href="#panel-1">List</a>
        <a role="tab" aria-controls="panel-2"
           class="mdc-tab" href="#panel-2">Conversation</a>
        <a role="tab" aria-controls="panel-3"
           class="mdc-tab" href="#panel-3">Item Three</a>
        <span class="mdc-tab-bar__indicator"></span>
      </nav>
    </section>
    <ConversationList />
  </div>
</template>

<script>
import { MDCTabBar } from '@material/tabs/dist/mdc.tabs'
import ConversationList from '../../components/Hangout/ConversationList.vue';

export default {
  components: { ConversationList },
  data() {
    return {
      dynamicBar: undefined,
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
  }
}
</script>

<style lang="css">
</style>
