<template lang="html">
  <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->
      <span class="mdl-layout-title">Hangout Reader
        <span class="conversation-info"></span>
      </span>
      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
      <!-- <div class="mdl-layout-spacer msg-info">
        Showing {{history.length}} of {{full_history.length}} messages
      </div> -->
      <!-- Navigation. We hide it in small screens. -->
      <nav class="mdl-navigation mdl-layout--large-screen-only">
        <a class="mdl-navigation__link" href="https://kevguy.github.io/Hangout-Reader/">Home</a>
        <a class="mdl-navigation__link" href="https://github.com/kevguy/Hangout-Reader">Github</a>
      </nav>
      <button id="demo-menu-lower-right"
              class="mdl-button mdl-js-button mdl-button--icon">
        <i class="material-icons">more_vert</i>
      </button>

      <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
          for="demo-menu-lower-right">
        <li class="mdl-menu__item" @click="showSettingsDialog(true)">Settings</li>
        <li disabled class="mdl-menu__item">Email Me</li>
        <li class="mdl-menu__item">How To Use</li>
        <li class="mdl-menu__item">Help</li>
      </ul>
    </div>

  </header>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'nav-header',
  methods: {
    ...mapMutations([
      'showSettingsDialog',
    ]),
  },
};
</script>

<style lang="css">
</style>
