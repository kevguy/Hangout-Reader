<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header" id="app">
    <NavHeader></NavHeader>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Conversation List</span>
      <drawer></drawer>
    </div>
    <main class="mdl-layout__content">
      <div class="page-content"><!-- Your content goes here -->
        <router-view/>
      </div>
    </main>
    <SettingsDialog></SettingsDialog>
  </div>
</template>

<script>
import drawer from '@/components/Drawer.vue';
import NavHeader from '@/components/Header.vue';
import SettingsDialog from '@/components/UI/SettingsDialog.vue';

export default {
  components: { drawer, NavHeader, SettingsDialog },
};
</script>

<style lang="scss">
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
//colors
$black:  black;
$color_silver_approx: #bdbdbd;

//urls
$url_0: url(https://lh3.googleusercontent.com/-vqNxyIZxl-8/WNTMdSC7kqI/AAAAAAAAQTE/Ar-VYIa_Jl0GoZNQ2IliWlGqj11f6oPQwCK8B/s0/873677350047079933%253Faccount_id%253D2);

//@extend-elements
//original selectors
//.kev-dropzone.kev-dragover, .kev-dropzone:hover
%extend_1 {
  border: dashed 5px $color_silver_approx;
  opacity: 1;
  color: $color_silver_approx;
}


.fuck {
  margin: 4px;
}
.mdl-list__item--three-line {
  height: initial;
  .mdl-list__item-primary-content {
    height: initial;
  }
  .mdl-list__item-text-body {
    height: initial;
  }
}
.file-dialog {
  width: initial;
  margin: 4px;
}
.kev-dropzone {
  opacity: 0;
  border: 1px dashed $black;
  //Instead of the line below you could use
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: opacity 1.35s, transform 1.35s;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: border 1.35s, transform 1.35s;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: color 1.35s, transform 1.35s;
  &.kev-init {
    opacity: 1;
  }
  p {
    margin: 0;
  }
  > p {
    opacity: 1;
  }
  &.kev-dragover {
    @extend %extend_1;
  }
  &:hover {
    @extend %extend_1;
  }
}
.image-resize {
  opacity: 1;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: opacity 1.35s, transform 1.35s;
  max-width: 230px;
  max-height: 130px;
  vertical-align: middle;
  &.kev-dragover {
    opacity: 0.3;
  }
}
.image-grid {
  position: absolute;
  width: 100%;
  height: 150px;
  line-height: 150px;
  border: 5px dashed $black;
  text-align: center;
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 25px;
}
.kev-upload-preview {
  display: none;
  position: absolute;
  top: -25px;
  z-index: 100;
}
.kev-upload-preview-text {
  opacity: .7;
  &:hover + .kev-upload-preview {
    display: block;
  }
}
.file-container {
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  width: 100%;
}
.upload-file-zone {
  height: 200px;
  width: 250px;
  flex: 1 auto;
  display: flex;
  align-items: center;
  div {
    margin: 0 8px;
    height: 67px;
    flex-grow: 1;
  }
}
.drop-file-zone {
  height: 200px;
  width: 250px;
  flex: 1 auto;
}
.drop-file-upload-zone {
  position: relative;
  margin: 8px 16px;
}
.file-upload-input {
  width: 80%;
  float: left;
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
.upload-dialog {
  visibility: visible;
  opacity: 1;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: visibility 0s linear 0.5s,opacity 0.5s linear;
  &.upload-not-visible {
    display: none;
    visibility: hidden;
    height: 0;
    opacity: 0;
  }
}
.upload-progress-bar {
  margin: 0 auto;
  visibility: visible;
  opacity: 1;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: visibility 0s linear 0.5s,opacity 0.5s linear;
  &.progress-bar-not-visible {
    display: none;
    visibility: hidden;
    height: 0;
    opacity: 0;
  }
}
.upload-status {
  visibility: visible;
  opacity: 1;
  //  @include transition($transition-1,
  // $transition-2, $transition-3, $transition-4, $transition-5, $transition-6,
  // $transition-7, $transition-8, $transition-9, $transition-10)
  transition: visibility 0s linear 0.5s,opacity 0.5s linear;
  &.upload-complete-not-visible {
    display: none;
    visibility: hidden;
    height: 0;
    opacity: 0;
  }
}
.demo-card-image.mdl-card {
  width: 256px;
  height: 256px;
  background: $url_0 center / cover;
}
button.file-upload-btn.mdl-button
  .mdl-js-button.mdl-button--fab.mdl-button--mini-fab.mdl-button--colored {
  position: relative;
  margin-top: 10px;
  float: right;
}
.navigation-drawer .material-icons {
  margin: 0 4px 0 0;
}

.msg-info {
  font-style:italic;
  text-align:right;
  margin-right:4px;
}


.mdl-dialog.instruction-dialog{
  width: 400px;
  div ul li {
    padding: 0 0 0 0;
  }
}

</style>
