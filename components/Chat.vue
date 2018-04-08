<template>
  <div class="card">
    <div class="d-flex h-100 align-items-start flex-column">
      <a href="#" class="w-100 p-3 breadcrumb">
        <div class="d-flex w-100 justify-content-between">
          <h2 class="card-title">Chat</h2>
          <small>42 online</small>
        </div>
      </a>
      <div class="px-3" style="flex:1" v-scroll-bottom>
        <template v-for="message in messages">
          <chat-message :message="message" :key="message.id" />
        </template>
      </div>
      <chat-new-message />
    </div>
  </div>
</template>

<script>
  import ChatMessage from './ChatMessage';
  import ChatNewMessage from './ChatNewMessage';

  export default {
    data() {
      return {
        messages: [],
      };
    },
    components: {
      ChatMessage,
      ChatNewMessage,
    },
    directives: {
      scrollBottom: {
        componentUpdated (el) {
          el.scrollTop = el.scrollHeight
        },
      },
    },
  };
</script>
