<template lang="html">
  <aside id="my-mdc-dialog"
    class="mdc-dialog"
    v-bind:class="{ 'mdc-dialog--open': show }"
    role="alertdialog"
    aria-labelledby="my-mdc-dialog-label"
    aria-describedby="my-mdc-dialog-description">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
          {{chosenImage.name}}
        </h2>
      </header>
      <section id="my-mdc-dialog-description" class="mdc-dialog__body">
        <img v-bind:src="chosenImage.url" alt="">
      </section>
      <footer class="mdc-dialog__footer">
        <!-- <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel" v-on:click="closeDialog()">Decline</button> -->
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept" v-on:click="closeDialog()">Close</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop" v-on:click="closeDialog()"></div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import { MDCDialog } from '@material/dialog/dist/mdc.dialog'

export default {
  data() {
    return {
      dialog: null,
      show: false
    }
  },
  mounted() {
    this.dialog = new MDCDialog(document.querySelector('#my-mdc-dialog'));
  },
  computed: {
    ...mapState({
      imageDialogOpen: state => state.UI.imageDialogOpen,
      chosenImage: state => state.UI.chosenImage
    })
  },
  watch: {
    imageDialogOpen(newVal) {
      if (newVal) {
        this.dialog = new MDCDialog(document.querySelector('#my-mdc-dialog'));

        // has to do it this way otherwise the dialog won't open
        // this.dialog.show()
        this.show = true

      } else {
        // this.dialog.close()
        this.show = false
      }
    }
  },
  methods: {
    openDialog() { this.$store.commit('toggleImageDialog', true) },
    closeDialog() { this.$store.commit('toggleImageDialog', false) }
  }
}
</script>

<style lang="scss">
.mdc-dialog__body {
  img {
    max-width: 100%
  }
}
</style>
