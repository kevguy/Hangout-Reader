<template lang="html">
  <Card
    card-id="send-announcement"
    title="Send an announcement"
    subtitle="Fill in this form to send an announcement"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <!-- Title -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="send-announcement--title"
          v-model="title"
        >
        <label
          for="send-announcement--title"
          class="mdc-floating-label">Title</label>
      </div>

      <!-- Notification -->
      <div class="mdc-text-field mdc-text-field--textarea">
        <textarea id="send-announcement--notification" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="notification"></textarea>
        <label for="send-announcement--notification" class="mdc-floating-label">Notification</label>
      </div>

      <hr class="mdc-card__divider">
      <!-- Upload Image -->
      <h4>Upload Image</h4>
      <div class="send-announcement--image-form">
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
          v-on:click="sendImage()">{{imageText}}</button>
      </div>
      <hr class="mdc-card__divider">
      <!-- Body -->
      <div class="">
        <h4>Body</h4>
        <div v-for="(item, idx) in body" v-if="item.type==='text'" v-bind:key="idx">
          <div class="mdc-card" v-if="item.type==='hyperlink'">
            <div class="card-content">
              <div class="mdc-text-field">
                <input
                  type="text"
                  class="mdc-text-field__input"
                  v-bind:id="'send-announcement--body-hyperlink' + idx"
                  v-model="item.content"
                >
                <label
                  v-bind:for="'send-announcement--body-hyperlink' + idx"
                  class="mdc-floating-label">Hyperlink</label>
              </div>
            </div>
          </div>
          <div class="mdc-card" v-else-if="item.type==='text'">
            <div class="card-content">
              <div class="mdc-text-field">
                <input
                  type="text"
                  class="mdc-text-field__input"
                  v-bind:id="'send-announcement--body-heading' + idx"
                  v-model="item.heading"
                >
                <label
                  v-bind:for="'send-announcement--body-heading' + idx"
                  class="mdc-floating-label">Heading</label>
              </div>
              <div class="mdc-text-field mdc-text-field--textarea">
                <textarea v-bind:id="'send-announcement--body-content' + idx" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="item.content"></textarea>
                <label v-bind:for="'send-announcement--body-content' + idx" class="mdc-floating-label">Content</label>
              </div>
            </div>
            <div class="mdc-card__actions">
              <div class="mdc-card__action-buttons">
                <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="deleteText(idx)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons for adding new texts -->
      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="addText()">Add Text</button>
          <!-- <button class="mdc-button mdc-card__action mdc-card__action--button">Add Image</button> -->
        </div>
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="addLink()">Add Hyperlink</button>
          <!-- <button class="mdc-button mdc-card__action mdc-card__action--button">Add Image</button> -->
        </div>
      </div>
      <hr class="mdc-card__divider">
      <!-- Terms and Conditions -->
      <div class="mdc-text-field mdc-text-field--textarea">
        <textarea id="send-announcement--toc" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="toc"></textarea>
        <label for="send-announcement--toc" class="mdc-floating-label">Terms and Conditions</label>
      </div>

      <hr class="mdc-card__divider">
      <!-- Language Preference -->
      <div class="demo-radio-row">
        <h4>Language:</h4>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="send-announcement-chin-radio" checked="" name="lang-pref" v-model="lang" v-bind:value="'ZH-HK'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="send-announcement-chin-label" for="send-announcement-chin-radio">Chinese</label>
        </div>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="send-announcement-eng-radio" name="lang-pref" v-model="lang" v-bind:value="'EN-US'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="send-announcement-eng-label" for="send-announcement-eng-radio">English</label>
        </div>
      </div>
      <hr class="mdc-card__divider">
      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="sendRequest()">Send</button>
        </div>
      </div>
    </div>
    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Vue from 'vue'
import Card from './Card.vue'
import Spinner from './Spinner.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'
import { MDCRadio } from '@material/radio/dist/mdc.radio'

export default {
  components: { Card, Spinner },
  data() {
    return {
      // for uploading images
      imageText: 'Upload',
      fileInput: null,
      fileName: "No File Input",
      disableUploadBtn: true,

      loading: false,
      result: "",
      textFields: [],
      title: "",
      notification: "",
      toc: "",
      lang: "ZH-HK",
      body: [
        { type: "image", imageId: "" }
      ]
    }
  },
  mounted() {
    this.mountHandler()
  },
  methods: {
    addLink() {
      this.body.push({
        type: "hyperlink",
        content: ""
      })
      Vue.nextTick(() => {
        this.mountHandler()
      })
    },
    addText() {
      this.body.push({
        type: "text",
        heading: "",
        content: ""
      })
      Vue.nextTick(() => {
        this.mountHandler()
      })
    },
    deleteText(idx) {
      this.body.splice(idx, 1)
    },
    async sendRequest() {
      this.loading = true
      if (this.title === "" || this.notification === "") {
        alert("Title or Notification should not be empty")
        return
      }

      const payload = {
        title: this.title,
        notification: this.notification,
        body: JSON.stringify(this.body),
        toc: this.toc,
        msgType: 'Promotion',
        language: this.lang
      }

      const res = await fetch('/api/announcement/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json();

      this.loading = false
      if (data.status !== 'Success') {
        this.result = `Failure: ${data.message}`;
      } else {
        this.result = `Sucess: ${data.message}`;
      }
      console.log(this.result);
    },
    async uploadImage(e) {
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
        await this.sendImage()
      } else {
        this.disableUploadBtn = true
      }
    },
    async sendImage() {
      // this.loading = true;
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

      if (data.status === 'Success') {
        this.imageText = `Uploaded`;
        this.body[0].imageId = data.fileHandle
      } else {
        this.imageText = `Failed`;
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
    mountHandler() {
      const textFields = document.querySelectorAll('.mdc-text-field');
      for (let i = 0; i < textFields.length; i++) {
        this.textFields.push(new MDCTextField(textFields[i]))
      }
      const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    }
  }
}
</script>

<style lang="scss">
.mdc-text-field {
  width: 100%
}

.mdc-card hr.mdc-card__divider {
  border-top: 1px solid rgba(0, 0, 0, .1);
  border-bottom: none;
  margin: 8px 0px 8px 0px;
}

.send-announcement--image-form {
  display: flex;
  flex-flow: row wrap;

  .mdc-text-field.mdc-text-field--disabled, .mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box):not(.mdc-text-field--textarea):not(.mdc-text-field--outlined) {
    max-width: 300px;
    height: 20px;
  }
}
</style>
