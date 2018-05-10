<template lang="html">
  <header class="mdc-toolbar">
    <div class="mdc-toolbar__row">
      <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
        <a href="#" class="material-icons mdc-toolbar__menu-icon" @click.stop="toggleDrawer(true)">menu</a>
        <span class="mdc-toolbar__title">Hangout Reader ({{workingEnvironment}})</span>
      </section>
    </div>
  </header>
</template>

<script>
import { mapMutations } from 'vuex'
// import {toolbar as MDCToolbar} from 'material-components-web/dist/material-components-web';

import {MDCToolbar} from '@material/toolbar/dist/mdc.toolbar';
export default {
  computed: {
    workingEnvironment() { return this.$store.state.environment }
  },
  mounted() {
    const toolbar = new MDCToolbar(document.querySelector('.mdc-toolbar'));
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer'
    })
    // toggleDrawer(val) {
    //   this.$store.commit('toggleDrawer', val)
    // }
  }
}
</script>

<style lang="scss">
</style>
