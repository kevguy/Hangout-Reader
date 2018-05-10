<template lang="html">
  <ul id="masonry-image-list" class="mdc-image-list mdc-image-list--masonry masonry-image-list mdc-image-list--with-text-protection">
    <li
      class="mdc-image-list__item"
      v-for="(image, idx) in imageList">
      <img class="mdc-image-list__image" v-bind:src="image.url">
      <div class="mdc-image-list__supporting">
        <span class="mdc-image-list__label">{{image.originalName}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['image-list']
}
</script>

<style lang="scss" scoped>
@import "~@material/image-list/dist/mdc.image-list.css";

.mdc-image-list.masonry-image-list {
    -webkit-column-count: 5;
    column-count: 5;
    -webkit-column-gap: 16px;
    column-gap: 16px;
    max-width: 1000px;
}

.mdc-image-list--masonry {
    display: block;

    .mdc-image-list__item {
        -webkit-column-break-inside: avoid;
        break-inside: avoid-column;
    }

    .mdc-image-list__image {
        display: block;
        height: auto;
    }

    &.masonry-image-list .mdc-image-list__item {
        margin-bottom: 16px;
    }
}
</style>
