<template lang="html">
  <div class="">
    {{this.$store.getters['Hangout/msgToShow']}}
    {{this.$store.getters['Hangout/numOfPages']}}
    {{this.$store.state.Hangout.currentPageNo}}
    <Pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Pagination from './Pagination.vue';

export default {
  components: { Pagination },
  data() {
    return {

    }
  },
  computed: {
    // ...mapGetters() {
    //
    // }
  },
  methods: {

  }
}
</script>

<style lang="css">
</style>
