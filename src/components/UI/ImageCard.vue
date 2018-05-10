<template lang="html">
  <div class="mdc-card demo-card demo-card--music">
    <a
      class="mdc-card__primary-action demo-card__primary-action mdc-ripple-upgraded mdc-ripple-upgraded--foreground-activation"
      href="javascript:void(0)"
      style="--mdc-ripple-fg-size:210px; --mdc-ripple-fg-scale:1.79466; --mdc-ripple-fg-translate-start:-66.148px, -62.2419px; --mdc-ripple-fg-translate-end:70px, -50px;">
      <div class="demo-card__music-row">
        <!-- <div
          v-bind:style="{ backgroundImage: `url(${url})`}"
          class="mdc-card__media mdc-card__media--square demo-card__media demo-card__media--music">
        </div> -->
        <div class="image-image">
          <img class="" v-bind:src="url" alt="" style="max-height: 110px">
        </div>
        <div class="demo-card__music-info">
          <div class="demo-card__music-title mdc-typography--headline">{{originalName}}</div>
          <div class="demo-card__music-artist mdc-typography--body1">{{hashedName}}</div>
          <div class="demo-card__music-year mdc-typography--body1">({{timestamp}})</div>
        </div>
      </div>
    </a>
    <hr class="mdc-list-divider">
    <div class="mdc-card__actions">
      <!-- <div class="mdc-card__action-buttons demo-card__action-buttons--text-only">Actions</div> -->
      <!-- <div class="mdc-card__action-icons">
        <i class="material-icons demo-card__action-icon--star" tabindex="0" role="button" title="1 star">
          star_border
        </i>
        <i class="material-icons demo-card__action-icon--star" tabindex="0" role="button" title="2 stars">
          star_border
        </i>
        <i class="material-icons demo-card__action-icon--star" tabindex="0" role="button" title="3 stars">
          star_border
        </i>
        <i class="material-icons demo-card__action-icon--star" tabindex="0" role="button" title="4 stars">
          star_border
        </i>
        <i class="material-icons demo-card__action-icon--star" tabindex="0" role="button" title="5 stars">
          star_border
        </i>
      </div> -->
      <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click.stop="view()">View</button>
      <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="download(url, originalName)">Download</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["url", "originalName", "hashedName", "timestamp"],
  methods: {
    async download(sourceUrl, name) {
      await fetch(sourceUrl)
        .then(response => response.blob())
        .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
        });
    },
    view() {
      this.$store.commit('updateChosenImage', {
        url: this.url,
        name: this.originalName
      })
      this.$store.commit('toggleImageDialog', true)
    }
  }
}
</script>

<style lang="scss">
.demo-card--music {
    border-radius: 24px 4px;
}

.demo-card {
    width: 350px;
    margin: 48px;
}

.demo-card__music-row {
    display: flex;
    border-top-left-radius: inherit;
}

.demo-card__media--music {
    width: 110px;
    border-top-left-radius: inherit;
}

.demo-card__music-info {
    display: flex;
    flex-direction: column;
    padding: 8px 16px;
}
</style>
