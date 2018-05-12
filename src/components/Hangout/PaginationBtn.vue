<template lang="html">
  <button
    class="mdl-button mdl-js-button mdl-js-ripple-effect"
    v-bind:class="{
      'mdl-button--accent mdl-button--raised': isCurrentPageNo,
      'mdl-button--primary': !isCurrentPageNo,
    }"
    v-on:click="changeCurrentPageNo(num)">
    {{num}}
  </button>
</template>

<script>
export default {
  name: 'PaginationBtn',
  props: ['isCurrentPageNo', 'num'],
  methods: {
    changeCurrentPageNo(num) {
      this.$store.commit('Hangout/updateCurrentPageNo', num);
    },
  },
}
</script>

<style lang="css">
</style>
