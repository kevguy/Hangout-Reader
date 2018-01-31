<template lang="html">
  <dialog class="mdl-dialog settings-dialog">
    <h4 class="mdl-dialog__title">Allow data collection?</h4>
    <div class="mdl-dialog__content">
      <p>
        Allowing us to collect data will let us get you the information you want faster.
      </p>
    </div>
    <div class="mdl-dialog__actions">
      <button type="button" class="mdl-button">Agree</button>
      <button
        type="button" class="mdl-button close"
        @click="showSettingsDialog(false)">Disagree</button>
    </div>
  </dialog>
</template>

<script>
/* global dialogPolyfill */
/* eslint no-restricted-globals: ["off", "dialogPolyfill"] */

import { mapState, mapMutations } from 'vuex';


export default {
  name: 'settings-dialog',
  data() {
    return {
      dialog: undefined,
    };
  },
  mounted() {
    this.dialog = document.querySelector('.settings-dialog');
    if (!this.dialog.showModal) {
      dialogPolyfill.registerDialog(this.dialog);
    }
  },
  watch: {
    showDialog(val) {
      if (val === true) {
        this.dialog.showModal();
      } else {
        this.dialog.close();
      }
    },
  },
  computed: {
    ...mapState({
      showPerson: state => state.settings.showPerson,
      showPicture: state => state.settings.showPicture,
      showMsg: state => state.settings.showMsg,
      showTime: state => state.settings.showTime,
      showDialog: state => state.settings.showDialog,
    }),
  },
  methods: {
    ...mapMutations([
      'showSettingsDialog',
    ]),
  },
};
</script>

<style lang="css">
</style>
