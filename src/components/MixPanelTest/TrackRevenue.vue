<template lang="html">
  <Card
    card-id="mixpanel-track-revenue"
    title="Track Revenue"
    subtitle="Track amount of money the client paid"
    >
    <div class="" slot="content">
      <div class="" slot="content">
        <div class="sql-table-list">
          <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list demo-list demo-list--with-avatars demo-list--icon-placeholders">
            <li
              class="mdc-list-item"
              v-for="(item, idx) in mockData"
              v-bind:key="idx">
              <!-- <span class="mdc-list-item__graphic" role="presentation">
                <i class="material-icons" aria-hidden="true">{{item.status ? 'check_box' : 'check_box_outline_blank'}}</i>
              </span> -->
              <span class="mdc-list-item__text">
                {{item.mixPropName}}
                <span class="mdc-list-item__secondary-text"></span>
              </span>
              <button
                class="mdc-list-item__meta mdc-button mdc-button--raised mdc-ripple-upgraded"
                v-on:click="sendRequest(item.mixPropName, item.amount)">{{item.text}}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from '../UI/Card.vue'

export default {
  props: [ 'mixpanel' ],
  components: { Card },
  data() {
    return {
      mockData: [
        {
          mixPropName: 'Buy 5 swimming pools',
          text: 'Pay 50 dollars',
          amount: '50'
        },
        {
          mixPropName: 'Buy 20 boxes of tissues',
          text: 'Pay 100 dollars',
          amount: '100'
        }
      ]
    }
  },
  methods: {
    sendRequest(propName, amount) {
      const result = mixpanel.people.increment(propName, amount);
      console.log(result)
    }
  }
}
</script>

<style lang="css">
</style>
