<template>
  <div id="app" v-on:click.stop="closeDrawer()">
    <Toolbar />
    <Drawer />
    <!-- <header class="header">
      <nav class="inner">
        <router-link to="/" exact>
          <img class="logo" src="~public/logo-48.png" alt="logo">
        </router-link>
        <router-link to="/top">Top</router-link>
        <router-link to="/new">New</router-link>
        <router-link to="/show">Show</router-link>
        <router-link to="/ask">Ask</router-link>
        <router-link to="/job">Jobs</router-link>
        <a class="github" href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank" rel="noopener">
          Built with Vue.js
        </a>
      </nav>
    </header> -->
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
  import Toolbar from './components/UI/Toolbar.vue'
  import Drawer from './components/AppDrawer.vue'

  export default {
    components: { Drawer, Toolbar },
    async created() {
      const res = await fetch(`/api/environment`)
      const result = await res.json()
      this.$store.commit('SET_ENVIRONMENT', result.message)
    },
    methods: {
      closeDrawer() {
        this.$store.commit("toggleDrawer", false)
      }
    }
  }
</script>

<style lang="scss">
  @import "~material-components-web/dist/material-components-web.css";
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
