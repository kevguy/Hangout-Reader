<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <span>File Dialog Here</span>

    <input type="file" v-on:change="uploadFile">
  </div>
</template>

<script>
/* jslint no-console: "error" */
/* eslint no-console: "error" */
/* eslint-disable no-console */

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  methods: {
    uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.$store.dispatch('HANDLE_JSON_FILE', files[0]);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
