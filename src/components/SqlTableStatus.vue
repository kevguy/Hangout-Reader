<template lang="html">
  <Card
    card-id="sql-table-status"
    title="SQL Tables Status"
    subtitle="Check if tables are created boiiiiii">

    <div class="" slot="content">
      <div class="sql-table-list">
        <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list demo-list demo-list--with-avatars demo-list--icon-placeholders">
          <li class="mdc-list-item">
            <span class="mdc-list-item__graphic" role="presentation">
              <i class="material-icons" aria-hidden="true">{{isConnected ? 'check_box' : 'check_box_outline_blank'}}</i>
            </span>
            <span class="mdc-list-item__text">
              Database Connected
              <span class="mdc-list-item__secondary-text">{{isConnected}}</span>
            </span>
          </li>
          <li
            class="mdc-list-item"
            v-for="(item, idx) in tableList"
            v-bind:key="idx">
            <span class="mdc-list-item__graphic" role="presentation">
              <i class="material-icons" aria-hidden="true">{{item.status ? 'check_box' : 'check_box_outline_blank'}}</i>
            </span>
            <span class="mdc-list-item__text">
              {{item.name}}
              <span class="mdc-list-item__secondary-text">{{item.status}}</span>
            </span>
            <button
              class="mdc-list-item__meta mdc-button mdc-button--raised mdc-ripple-upgraded"
              v-bind:disabled="isConnected && item.status"
              v-on:click="createTable(item, idx)">{{item.status ? 'Created' : 'Create Table'}}</button>
          </li>
        </ul>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from './UI/Card.vue'

export default {
  components: { Card },
  data() {
    return {
      isConnected: false,
      tableList: [
        { name: 'users', status: false },
        { name: 'image', status: false },
        { name: 'announcement', status: false }
      ],
    }
  },
  async created() {
    const result = await fetch(`/api/test-db-connection`).then(res => res.json())
    this.isConnected = result.message
  },
  watch: {
    async isConnected(val) {
      if (val) {
        this.tableList.forEach(async item => {
          const result = await fetch(`/api/${item.name}/check`).then(res => res.json())
          console.log(result)
          if (result.message) {
            item.status = true
          } else {
            item.status = false
          }
        })
      }
    }
  },
  methods: {
    async createTable(item, idx) {
      const result = await fetch(`/api/${item.name}/create-table`).then(res => res.json())
      console.log(result)
      if (result.status === 'Success') {
        item.status = true
      }
    }
  }
}
</script>

<style lang="css">
</style>
