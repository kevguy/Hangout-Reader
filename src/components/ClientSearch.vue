<template lang="html">
  <div class="">
    <input type="text" name="" value="" v-model="textInput">
    <ul>
      <li v-for="(item, idx) in srchResults" :key="idx"></li>
    </ul>
  </div>
</template>

<script>

import Bloodhound from '../search-engine/bloodhound'

export default {
  data() {
    return {
      list: [
        { type: 'band', name: 'Linkin Park' },
        { type: 'band', name: 'Green day' },
        { type: 'band', name: 'Sum 41' },
        { type: 'band', name: 'Skillet' },
        { type: 'band', name: 'Hollywood Undead' },
        { type: 'band', name: 'Radiohead' },
        { type: 'band', name: 'Coldplay' },
        { type: 'band', name: 'Paramore' },
        { type: 'band', name: 'Avenged Sevenfold' },
        { type: 'band', name: 'Simple Plan' },
        { type: 'show', name: 'How I Met Your Mother' },
        { type: 'show', name: 'Scrubs' },
        { type: 'show', name: 'The Office' },
        { type: 'show', name: 'Parks and Recreation' },
        { type: 'show', name: 'Wizards of Waverly Place' },
        { type: 'show', name: 'Hannah Montana' },
        { type: 'show', name: 'South Park' },
        { type: 'show', name: 'Rick and Morty' },
        { type: 'show', name: 'Unbreakable Kimmy Schmidt' },
        { type: 'show', name: 'Making A Murderer' },
        { type: 'show', name: 'Brooklyn Nine Nine' },
        { type: 'show', name: 'Mr. Robot' },
        { type: 'show', name: 'Doctor Who' },
        { type: 'show', name: 'iZombie' }
      ],
      srchResults: [],
      textInput: '',
      engine: null,
    }
  },
  watch: {
    textInput(newVal) {
      console.log(newVal)
      this.engine.get(newVal,
        (datums) => {
          console.log('datums from `local`, `prefetch`, and `#add`');
          console.log(datums);
        },
        (datums) => {
          console.log('datums from `remote`');
          console.log(datums);
        })
    }
  },
  mounted() {
    console.log(Bloodhound)
    console.log(Bloodhound)
    this.engine = new Bloodhound({
      initialize: false,
      identify: function(obj) { return obj.name; },
      local: this.list,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      datumTokenizer: Bloodhound.tokenizers.whitespace
    })

    var promise = this.engine.initialize();

    promise
    .then(() => {
      console.log('ready to go!');
    })
    .catch(function() { console.log('err, something went wrong :('); });
  }
}
</script>

<style lang="scss">
</style>
