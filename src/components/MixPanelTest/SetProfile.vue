<template lang="html">
  <Card
    card-id="mixpanel-set-profile"
    title="Set Profile"
    subtitle="Set Profile and Store it in Mixpanel"
    >
    <div class="" slot="content">
      <!-- Club ID -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="sample-pish-notification--clubId"
          v-model="clubId"
        >
        <label
          for="sample-pish-notification--clubId"
          class="mdc-floating-label">Club ID</label>
      </div>
      <button
        class="mdc-button mdc-button--raised mdc-ripple-upgraded"
        v-on:click="setProfile()">Punch It</button>
    </div>
  </Card>
</template>

<script>
import Card from '../UI/Card.vue'
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'

export default {
  components: { Card },
  props: [ 'mixpanel' ],
  mounted() {
    this.mountHandler()
    console.info(this.mixpanel)
  },
  created() {
    console.info(this.mixpanel)
  },
  data() {
    return {
      textFields: [],
      clubId: this.$store.state.MixPanel.mixPanelProfileId
    }
  },
  methods: {
    setProfile(clubId) {
      const result = this.mixpanel.identify(clubId)
      console.log(result)
      this.$store.commit('setMixPanelProfileId', clubId)
    },
    mountHandler() {
      const textFields = document.querySelectorAll('.mdc-text-field');
      for (let i = 0; i < textFields.length; i++) {
        this.textFields.push(new MDCTextField(textFields[i]))
      }
      // const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    }
  }
}
</script>

<style lang="scss">
</style>
