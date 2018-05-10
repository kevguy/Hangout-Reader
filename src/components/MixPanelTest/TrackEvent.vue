<template lang="html">
  <Card
    card-id="mixpanel-track-events"
    title="Track Events"
    subtitle="Track some event changes here">
    <div class="" slot="content">
      <div class="track-event-list">
        <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list demo-list demo-list--with-avatars demo-list--icon-placeholders">
          <li
            class="mdc-list-item"
            v-for="(item, idx) in mockData"
            v-bind:key="idx">
            <!-- <span class="mdc-list-item__graphic" role="presentation">
              <i class="material-icons" aria-hidden="true">{{item.status ? 'check_box' : 'check_box_outline_blank'}}</i>
            </span> -->
            <span class="mdc-list-item__text">
              {{item.eventName}}
              <span class="mdc-list-item__secondary-text">Choose an option</span>
            </span>
            <span class="mdc-list-item__text">
              <div class="mdc-select">
                <select class="mdc-select__native-control" v-model="item.chosenVal">
                  <option
                    v-for="choice in item.list"
                    v-bind:value="choice"
                    >
                    {{choice}}
                  </option>
                </select>
                <!-- <div class="mdc-select__label mdc-select__label--float-above">Pick a Food Group</div>
                <div class="mdc-select__bottom-line"></div> -->
              </div>
            </span>
            <button
              class="mdc-list-item__meta mdc-button mdc-button--raised mdc-ripple-upgraded"
              v-on:click="sendMixEvent(item)">Send</button>
          </li>
        </ul>
      </div>
    </div>
  </Card>
</template>

<script>
import Vue from 'vue'
import Card from '../UI/Card.vue'
import { MDCSelect } from '@material/select/dist/mdc.select';

export default {
  components: { Card },
  props: ['mixpanel'],
  mounted() {
    // Vue.nextTick(this.setupSelectBoxes)
    this.setupSelectBoxes()
  },
  data() {
    return {
      selectBoxes: [],
      mockData: [
        {
          eventName: 'Played Song Artist',
          list: [
            'Linkin Park', 'Muse', 'Green Day', 'Glitch Mob',
            'Sufjan Stevens', 'Jens Lekman', 'Eminem', 'Hollywood Undead',
            'Fall Out Boy', 'Halestorm'
          ],
          chosenVal: 'Linkin Park'
        },
        {
          eventName: 'Watched TV Show',
          list: [
            'Scrubs', 'Legion', 'iZombie', 'Unbreakable Kimmy Schmidt',
            'Parks and Rec', 'The Office', 'Brooklyn Nine Nine', 'The Americans',
            'Mr. Robot', 'South Park'
          ],
          chosenVal: 'Scrubs'
        }
      ]
    }
  },
  methods: {
    setupSelectBoxes() {
      // console.log(document.querySelector('.mdc-select').classList)
      // const mdcSelectBox = new MDCSelect(document.querySelector('.mdc-select'))
    },
    sendMixEvent(item) {
      const result = mixpanel.track(
        item.eventName,
        {
          name: item.chosenVal,
          genre: 'Whatever'
        }
      )
      console.log(result)
    }
  }
}
</script>

<style lang="scss">
</style>
