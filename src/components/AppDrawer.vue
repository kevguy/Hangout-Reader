<template lang="html">
  <Drawer>
    <template slot="header">
      <header class="mdc-drawer__header">
        <div class="mdc-drawer__header-content mdc-theme--text-primary-on-primary mdc-theme--primary-bg">
          Hangout Reader
        </div>
      </header>
    </template>
    <template slot="content">
      <div id="icon-with-text-demo" class="mdc-list">
        <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/admin" exact>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Admin
        </router-link>
        <hr class="mdc-list-divider">
        <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/images" exact>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>All Images
        </router-link>
        <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/announcements" exact>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">email</i>All Announcements
        </router-link>
        <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/send-announcement" exact>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">announcement</i>Send Announcement
        </router-link>
        <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/query-user" exact>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">account_circle</i>Query User
        </router-link>
      </div>

      <hr class="mdc-list-divider">

      <div class="mdc-list">
        <a class="mdc-list-item demo-drawer-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">email</i>All Mail
        </a>
        <a class="mdc-list-item demo-drawer-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">delete</i>Trash
        </a>
        <a class="mdc-list-item demo-drawer-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">report</i>Spam
        </a>
      </div>

      <hr class="mdc-list-divider">

      <HangoutDrawer />
    </template>
  </Drawer>
</template>

<script>
import Drawer from './UI/Drawer.vue';
import HangoutDrawer from './Hangout/Drawer.vue';

export default {
  components: { Drawer, HangoutDrawer }
}
</script>

<style lang="scss">

</style>
