<template lang="html">
  <aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
      <nav class="mdc-drawer__drawer">
        <slot name="header"></slot>
        <div class="">
          <slot name="content"></slot>
        </div>
      </nav>
  </aside>
</template>

<script>
import { mapMutations } from 'vuex'
import { MDCTemporaryDrawer } from '@material/drawer/dist/mdc.drawer';

export default {
  data() {
    return {
      drawer: undefined
    }
  },
  computed: {
    drawerOpen() { return this.$store.state.UI.drawerOpen },
    workingEnvironment() { return this.$store.state.environment }
  },
  watch: {
    drawerOpen(val) { this.drawer.open = val }
  },
  mounted() {
    this.drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer'
    })
  }
}
</script>

<style lang="scss">

</style>
