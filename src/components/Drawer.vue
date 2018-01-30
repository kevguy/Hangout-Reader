<template lang="html">
  <nav class="mdl-navigation navigation-drawer">
    <a class="mdl-navigation__link mdl-menu__item--full-bleed-divider"
      href="https://kevguy.github.io/Hangout-Reader/">
      <i class="material-icons">home</i>Home
    </a>
    <span class="mdl-layout__title">Chats</span>
    <a class="mdl-navigation__link"
      href="javascript:void(0)"
      v-for="conversation in chatList"
      v-bind:key="conversation.id"
      @click="updateChosenChat(conversation.id)">
      {{conversation.list}}
    </a>
    <a class="mdl-navigation__link mdl-menu__item--full-bleed-divider"
      href="https://kevguy.github.io/Hangout-Reader/">
    </a>
    <span class="mdl-layout__title">Group Chats</span>
    <a class="mdl-navigation__link"
      href="javascript:void(0)"
      v-for="conversation in groupChatList"
      v-bind:key="conversation.id"
      @click="updateChosenChat(conversation.id)">
      <b>{{conversation.groupName || 'No Name'}}:</b> <br>{{conversation.list}}
    </a>
    <a class="mdl-navigation__link mdl-menu__item--full-bleed-divider" href=""></a>
    <a class="mdl-navigation__link" href="javascript:void(0)">
      <i class="material-icons">settings</i>Settings
    </a>
    <a class="mdl-navigation__link mdl-menu__item--full-bleed-divider" href=""></a>
    <a class="mdl-navigation__link"
      href="https://github.com/kevguy/Hangout-Reader">
      <i class="material-icons">code</i>Github
    </a>
    <a class="mdl-navigation__link" href="javascript:void(0)">
      <i class="material-icons">map</i>How To Use
    </a>
    <a class="mdl-navigation__link"
      href="https://github.com/kevguy/Hangout-Reader">
      <i class="material-icons">help</i>Help
    </a>
  </nav>
</template>

<script>
export default {
  name: 'drawer',
  computed: {
    conversationList() {
      return this.$store.state.conversationList;
    },
    chatList() {
      return this.$store.state.conversationList.filter(item => item.type !== 'group');
    },
    groupChatList() {
      return this.$store.state.conversationList.filter(item => item.type === 'group');
    },
  },
  methods: {
    updateChosenChat(conversationId) {
      this.$store.dispatch('UPDATE_CHAT_HISTORY', conversationId);
    },
  },
};
</script>

<style lang="scss">
</style>
