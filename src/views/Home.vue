<template>
  <div class="home">
    <!-- <img src="../assets/logo.png"> -->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <ChatHistory></ChatHistory>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ChatHistory from '@/components/ChatHistory.vue';

export default {
  name: 'home',
  components: {
    HelloWorld, ChatHistory,
  },
};
</script>
