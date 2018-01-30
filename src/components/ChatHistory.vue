<template lang="html">
  <div class="">
    {{mode}} {{msgsToShow.length}}
    <ChatTable v-if="mode ==='table'"></ChatTable>
    <ChatNormal
      v-if="mode ==='normal'"
      v-bind:msgs-to-show="msgsToShow"
      v-bind:profile-pics="profilePics"></ChatNormal>
    <Pagination
      v-bind:current-page-no="currentPageNo"
      v-bind:num-of-pages="numOfPages"></Pagination>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import ChatTable from '@/components/ChatTable.vue';
import ChatNormal from '@/components/ChatNormal.vue';

import Pagination from '@/components/Pagination.vue';

export default {
  name: 'ChatHistory',
  components: {
    ChatTable, ChatNormal, Pagination,
  },
  computed: {
    ...mapGetters([
      'msgsToShow',
      'numOfPages',
    ]),
    ...mapState({
      mode: state => state.settings.mode,
      currentPageNo: state => state.chatHistory.currentPageNo,
      profilePics: state => state.profileImgs.profileMap,
    }),
  },
  methods: {
    prevPage() {
      if (this.currentPageNo > 1) {
        this.$store.commit('decrementCurrentPageNo');
      }
    },
    nextPage() {
      if (this.currentPageNo < this.numOfPages) {
        this.$store.commit('incrementCurrentPageNo');
      }
    },
    gotoPage(num) {
      this.$store.commit('updateCurrentPageNo', num);
    },
  },
};
</script>

<style lang="scss">
</style>
