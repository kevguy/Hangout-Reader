<template lang="html">
  <Card
    card-id="upload-image"
    title="Upload Image"
    subtitle="Try uploading image here"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <div class="mdc-text-field mdc-text-field--disabled">
        <input
          type="text"
          class="mdc-text-field__input"
          id="upload-image-file-name"
          aria-controls="my-text-field-helper-text"
          autocomplete="off"
          v-bind:value="fileName">
        <!-- <label for="upload-image-file-name" class="mdc-floating-label">File name:</label> -->
        <div class="mdc-line-ripple" style="transform-origin: 78px center"></div>
      </div>
      <label class="mdc-button mdc-card__action mdc-card__action--button">
        Browse
        <input type="file" style="display: none;"  v-on:change="uploadImage">
      </label>
      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-bind:disabled="disableUploadBtn"
        v-on:click="sendRequest()">Upload</button>
    </div>
    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'

export default {
  components: { Card },
  mounted() {
    const textField = new MDCTextField(document.querySelector('.mdc-text-field'))
  },
  data() {
    return {
      fileInput: null,
      fileName: "No File Input",
      disableUploadBtn: true,
      debugMessage: "",
      loading: false,
      result: ""
    }
  },
  methods: {
    uploadImage(e) {
      const files = e.target.files || e.dataTransfer.files
      this.fileInput = files[0];
      // if (this.fileInput.type !== 'text/csv') {
      //   this.result = `Please Upload another file that is a CSV file.`;
      //   this.fileCheck = false;
      // } else {
      //   this.fileCheck = true;
      //   this.result = ``;
      // }
      this.fileName = this.fileInput.name || "No File Input"
      if (this.fileInput.name) {
        this.disableUploadBtn = false
      } else {
        this.disableUploadBtn = true
      }
    },
    async sendRequest() {
      this.loading = true;
      const formData = new FormData();
      formData.append('name', 'hihi');
      formData.append('file', this.fileInput);
      console.info(formData);
      // const res = await fetch(`/files/save-file`, {
      const res = await fetch(`/api/image/upload`, {
        method: 'POST',
        headers: {
          // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          // 'x-access-token': this.accessToken
        },
        body: formData
      });

      const data = await res.json();
      console.log(data);

      this.loading = false;

      if (data.status !== 'Success') {
        this.result = `Failure: ${data.message}`;
      } else {
        this.result = `Sucess: ${data.message}`;
      }

      // if (data.status === 'FAILED' || data.status === 'failure') {
      //   if (data.message !== undefined) {
      //     this.result = `Failure: ${data.message}`;
      //   } else {
      //     this.result = `Failure: ${data.description}`;
      //   }
      // } else {
      //   this.result = `Success: ${data.description}`;
      // }
    },
  }
}
</script>

<style lang="scss">
</style>
