<template lang="html">
  <div class="">
    <input type="file" v-on:change="uploadFile">
  </div>
</template>

<script>
import { Observable } from 'rxjs/Rx';
// https://stackoverflow.com/questions/43307377/use-worker-loader-with-vue-cli-and-webpack
import Worker from 'worker-loader?name=workers/[hash:7].worker.js!../../web-workers/uploadHangoutsWorker';


function handleJsonFile(worker) {
  const stream = Observable.create(observer => {
    worker.onmessage = (e) => {
      console.info(e)
      if (e.data.action === 'HANDLE_JSON_FILE') {
        observer.next({ data: e.data.payload });
        observer.complete();
      }
    }
  })
  return stream.toPromise()
}

export default {
  methods: {
    async uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      const worker = new Worker();

      worker.postMessage({
        action: 'HANDLE_JSON_FILE',
        file: files[0],
      })

      const res = await handleJsonFile(worker)
      if (res) {
        const { conversationList,
          conversationContents,
          participantList } = res.data;
        this.$store.commit('Hangout/initParticipantList', participantList)
        this.$store.commit('Hangout/initConversationList', conversationList);
        this.$store.commit('Hangout/initConversationContents', conversationContents);
      }
    }
  }
}






</script>

<style lang="css">
</style>
