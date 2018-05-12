<template lang="html">
  <div class="">
    <button
      class="mdl-button mdl-js-button mdl-js-ripple-effect"
      v-bind:disabled="currentPageNo === 1"
      v-on:click="decrementCurrentPageNo()">PREV</button>
    <template v-if="numOfPages <= 7" class="">
      <PaginationBtn
        v-bind:key="i"
        v-for="i in numOfPages"
        v-bind:is-current-page-no="i === currentPageNo"
        v-bind:num="i"
      ></PaginationBtn>
    </template>
    <template v-else class="">
      <!-- left part -->
      <PaginationBtn
        v-if="currentPageNo >= 3"
        v-bind:is-current-page-no="1 === currentPageNo"
        v-bind:num="1"
      ></PaginationBtn>
      <PaginationBtn
        v-if="currentPageNo >= 4"
        v-bind:is-current-page-no="2 === currentPageNo"
        v-bind:num="2"
      ></PaginationBtn>

      <span v-if="currentPageNo > 4">...</span>

      <PaginationBtn
        v-if="currentPageNo > 1"
        v-bind:is-current-page-no="(currentPageNo-1) === currentPageNo"
        v-bind:num="currentPageNo-1"
      ></PaginationBtn>
      <PaginationBtn
        v-bind:is-current-page-no="currentPageNo === currentPageNo"
        v-bind:num="currentPageNo"
      ></PaginationBtn>
      <PaginationBtn
        v-if="currentPageNo < numOfPages"
        v-bind:is-current-page-no="(currentPageNo+1) === currentPageNo"
        v-bind:num="currentPageNo+1"
      ></PaginationBtn>

      <!-- right part -->
      <span v-if="currentPageNo <= (numOfPages - 4)">...</span>

      <PaginationBtn
        v-if="currentPageNo < (numOfPages - 2)"
        v-bind:is-current-page-no="(numOfPages-1) === currentPageNo"
        v-bind:num="numOfPages-1"
      ></PaginationBtn>
      <PaginationBtn
        v-if="currentPageNo < (numOfPages - 1)"
        v-bind:is-current-page-no="(numOfPages) === currentPageNo"
        v-bind:num="numOfPages"
      ></PaginationBtn>

    </template>
    <button
      class="mdl-button mdl-js-button mdl-js-ripple-effect"
      v-bind:disabled="currentPageNo === numOfPages"
      v-on:click="incrementCurrentPageNo()">NEXT</button>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';
import PaginationBtn from './PaginationBtn.vue';

export default {
  components: { PaginationBtn },
  // props: ['currentPageNo', 'numOfPages'],
  computed: {
    ...mapGetters('Hangout', {
      numOfPages: 'numOfPages',
    }),
    ...mapState('Hangout', {
      currentPageNo: 'currentPageNo',
    })
  },
  methods: {
    ...mapMutations('Hangout', [
      'updateCurrentPageNo',
      'decrementCurrentPageNo',
      'incrementCurrentPageNo',
    ]),
  },
}
</script>

<style lang="css">
</style>
