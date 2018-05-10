<template lang="html">
  <div class="mdc-card" v-bind:id="cardId">
    <div class="header">
      <h2 class="mdc-typography--title">{{title}}</h2>
      <h3 class="mdc-typography--subheading1">{{subtitle}}</h3>
    </div>
    <div class="card-content">
      <slot name="content">
        Place Content Here
      </slot>
    </div>
    <div class="card-result" v-show="resultAvailable || loading">
      <h3 class="mdc-typography--subheading1">Result</h3>
      <Spinner v-bind:show="loading" />
      <slot name="result">
        Place Result Here
      </slot>
    </div>
    <!-- <div class="mdc-card__actions">
      <div class="mdc-card__action-buttons">
        <button class="mdc-button mdc-card__action mdc-card__action--button">Action 1</button>
        <button class="mdc-button mdc-card__action mdc-card__action--button">Action 2</button>
      </div>
      <div class="mdc-card__action-icons">
        <i class="material-icons mdc-card__action mdc-card__action--icon" tabindex="0" role="button" title="Share">share</i>
        <i class="material-icons mdc-card__action mdc-card__action--icon" tabindex="0" role="button" title="More options">more_vert</i>
      </div>
    </div> -->
  </div>
</template>

<script>
import Spinner from './Spinner.vue'

export default {
  props: ["cardId", "title", "subtitle", "loading", "resultAvailable"],
  components: { Spinner },
  created() {

  }
}
</script>

<style lang="scss" scoped>
.mdc-card {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.header, .card-content, .card-result {
  margin-left: 8px;
  margin-right: 8px;
}
</style>
