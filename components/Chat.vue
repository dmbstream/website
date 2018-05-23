<template>
  <div class="card">
    <div class="d-flex h-100 align-items-start flex-column">
      <div class="card-block" v-if="chatLoading">
        Loading...
      </div>
      <div v-else>
        <a href="#" class="w-100 p-3 breadcrumb">
          <div class="d-flex w-100 justify-content-between">
            <h2 class="card-title">Chat</h2>
            <small>{{ activeUsers.length }} online</small>
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
  </div>
</template>

<script>
  import axios from '../plugins/axios';

  import ChatMessage from './ChatMessage';
  import ChatNewMessage from './ChatNewMessage';

  export default {
    components: {
      ChatMessage,
      ChatNewMessage,
    },
    data() {
      return {
        stickyMessage: null,
        activeUsers: [],
        messages: [],
        chatLoading: true,
      };
    },
    async mounted() {
      const chatMessagesResult = await axios.get(`/api/chatmessages`, {
        params: {
          includeActiveUsers: true
        },
      });

      this.stickyMessage = chatMessagesResult.data.sticky_message;
      this.activeUsers = chatMessagesResult.data.active_users || [];
      this.messages = chatMessagesResult.data.items || [];
      this.chatLoading = false;
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
