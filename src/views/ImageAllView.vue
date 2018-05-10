<template lang="html">
  <div class="">
    <ClientSrch />
    <nav id="all-image--tab-bar" class="mdc-tab-bar mdc-tab-bar-upgraded">
      <a
        class="mdc-tab mdc-ripple-upgraded"
        href="javascript:void(0)"
        style="--mdc-ripple-fg-size:96px; --mdc-ripple-fg-scale:1.84422; --mdc-ripple-fg-translate-start:35.352px, -24.578px; --mdc-ripple-fg-translate-end:32px, -24px;"
        v-for="mode in modes"
        v-on:click="changeMode(mode)">{{mode}}</a>
      <span class="mdc-tab-bar__indicator" style="transform: translateX(0px) scale(0.333333, 1); visibility: visible;"></span>
    </nav>
    <div class="image-all-view" v-if="chosenMode === 'Normal'">
      <ImageCard
        :key="idx"
        v-for="(image, idx) in imageList"
        v-bind:url="image.url"
        v-bind:original-name="image.originalName"
        v-bind:hashed-name="image.hashedName"
        v-bind:timestamp="image.timestamp"
      />
      <ImageViewDialog
        v-bind:image-list="imageList"
      />
    </div>
    <ImageMasonryMode
      v-if="chosenMode === 'Masonry'"
      v-bind:image-list="imageList"
    />
  </div>
</template>

<script>
import { MDCTabBar } from '@material/tabs/dist/mdc.tabs'

import ImageMasonryMode from '../components/ImageMasonryMode.vue'

import ImageCard from '../components/UI/ImageCard.vue'
import ImageViewDialog from '../components/UI/ImageViewDialog.vue'

import ClientSrch from '../components/ClientSearch.vue'

export default {
  components: { ImageCard, ImageViewDialog, ClientSrch, ImageMasonryMode },
  data() {
    return {
      imageList: [],
      modes: ['Normal', 'Masonry', 'Grid'],
      chosenMode: 'Normal'
    }
  },
  // async created() {
  //   // fetch the metadata first
  //   try {
  //     const result = await fetch(`/image/list-all`)
  //       .then(response => response.json())
  //     this.imageList = result.map(item => ({
  //       ...item,
  //       url: `/image/${item.hashedName}`
  //     }))
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
  mounted() {
    const tabBar = new MDCTabBar(document.querySelector('#all-image--tab-bar'));
  },
  async created() {
    // fetch the metadata first
    await fetch(`/api/image/list-all`)
      .then(response => response.json())
      .then(result => {
        this.imageList = result.map(item => ({
          ...item,
          url: `/api/image/${item.hashedName}`
        }))
      })
  },
  methods: {
    changeMode(mode) {
      this.chosenMode = mode
    }
  }
}
</script>

<style lang="scss">
.image-all-view {
  display: flex;
  flex-flow: row wrap;
}
</style>
