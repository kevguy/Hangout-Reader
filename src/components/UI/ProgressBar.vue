<template lang="html">
  <!-- <div class="demo-linear-progress-indicator">
    <h3 class="mdc-typography--subtitle1">Buffered</h3>
    <div id="profile-progress" role="progressbar" class="mdc-linear-progress ">
      <div class="mdc-linear-progress__buffering-dots"></div>
      <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75);"></div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" style="transform: scaleX(0.5);">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  </div> -->
  <div
    class=""
    v-if="show">
    <h3 class="mdc-typography--subtitle1">{{message}}</h3>
    <div v-bind:id="elementId" role="progressbar" class="mdc-linear-progress">
      <div class="mdc-linear-progress__buffering-dots"></div>
      <div class="mdc-linear-progress__buffer"></div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { MDCLinearProgress } from '@material/linear-progress/dist/mdc.linearProgress'

export default {
  props: ['show', 'message', 'elementId', 'progress'],
  data() {
    return {
      progressBar: undefined,
    }
  },
  watch: {
    progress(val) { this.progressBar.progress = val }
  },
  mounted() {
    this.progressBar = new MDCLinearProgress(
      document.querySelector(`#${this.elementId}`)
    )
  }
}
</script>

<style lang="css">
</style>
