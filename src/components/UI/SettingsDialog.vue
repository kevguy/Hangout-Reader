<template lang="html">
  <dialog class="mdl-dialog settings-dialog">
    <h4 class="mdl-dialog__title">Allow data collection?</h4>
    <div class="mdl-dialog__content">
      <p>
        Allowing us to collect data will let us get you the information you want faster.
      </p>
      <div class="mdl-card__actions mdl-card--border settings-container">
        <div class="settings-column">
          <ul class="demo-list-control mdl-list">
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">view_list</i>
                Table Mode
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="table-mode-switch">
                  <input type="checkbox" id="table-mode-switch" class="mdl-switch__input" />
                </label>
              </span>
            </li>
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">photo</i>
                Only show pictures
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="picture-mode-switch">
                  <input type="checkbox" id="picture-mode-switch" class="mdl-switch__input" />
                </label>
              </span>
            </li>
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">update</i>
                Performance Mode
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="performance-mode-switch">
                  <input type="checkbox" id="performance-mode-switch" class="mdl-switch__input" />
                </label>
              </span>
            </li>
          </ul>
        </div>
        <div class="settings-column">
          <ul class="demo-list-control mdl-list">
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">person</i>
                Show Person
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="show-person-switch">
                  <input type="checkbox" id="show-person-switch" class="mdl-switch__input"/>
                </label>
              </span>
            </li>
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">av_timer</i>
                Show Time
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="show-time-switch">
                  <input type="checkbox" id="show-time-switch" class="mdl-switch__input"/>
                </label>
              </span>
            </li>
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <i class="material-icons  mdl-list__item-avatar">textsms</i>
                Show Message
              </span>
              <span class="mdl-list__item-secondary-action">
                <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
                  for="show-msg-switch">
                  <input type="checkbox" id="show-msg-switch" class="mdl-switch__input"/>
                </label>
              </span>
            </li>
          </ul>
        </div>
      </div>
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
/* global componentHandler */
/* eslint no-restricted-globals: ["off", "dialogPolyfill"] */
/* eslint no-restricted-globals: ["off", "componentHandler"] */

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
    this.$nextTick(() => {
      componentHandler.upgradeDom();
      componentHandler.upgradeAllRegistered();
    });
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

<style lang="scss">

.mdl-dialog {
  width: auto;
  max-width: 570px;
}

.is-small-screen {
  .mdl-dialog {
    width: auto;
    max-width: 280px;
  }
}

.settings-container {
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  width: 100%;
}
.settings-column {
  flex: 1 auto;
  width: 50%;
  min-width: 250px;
}
.setting-dialog {
  visibility: visible;
  opacity: 1;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: visibility 0s linear 0.5s,opacity 0.5s linear;
  &.setting-not-visible {
    display: none;
    visibility: hidden;
    height: 0;
    opacity: 0;
  }
}
</style>
