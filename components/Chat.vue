<template>
  <div class="chat-column container-fluid px-0 mx-0">
    <div class="chat-container card mb-0 d-flex flex-column">
      <a href="#" class="chat-header w-100 p-3 breadcrumb">
        <div class="d-flex w-100 justify-content-between">
          <h2 class="card-title">Chat</h2>
          <small v-if="hasActiveUsers">{{ activeUsers.length }} online</small>
        </div>
      </a>
      <div class="chat-messages-container px-3" v-chat-scroll="{always: false, smooth: true, scrollonremoved:true}">
        <template v-for="message in messages">
          <chat-message :message="message" :key="message.id" />
        </template>
        <p v-if="isLoadingChatMessages">
          Loading messages...
        </p>
      </div>
      <chat-new-message :is-connected="isConnected" />
    </div>
  </div>
</template>

<script>
  import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
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
        isConnected: false,
        loadingMessages: true,
        chatLoadingError: false,
        usersTyping: [],
        typingTimers: {},
      };
    },
    computed: {
      isLoadingChatMessages() {
        return this.$store.state.isLoadingChatMessages;
      },
      messages() {
        const messages = [];
        const messageCount = this.$store.state.chatMessages.length;
        for (let i = 0; i < messageCount; i++) {
          let previousMessage;
          if (i > 0) {
            previousMessage = this.$store.state.chatMessages[i - 1];
          }

          const message = this.$store.state.chatMessages[i];
          message.previousMessage = previousMessage;

          messages.push(message);
        }

        return messages;
      },
      activeUsers() {
        return this.$store.state.activeUsers;
      },
      hasActiveUsers() {
        return this.activeUsers && this.activeUsers.length;
      },
      stickyMessage() {
        return this.$store.state.stickyMessage;
      },
    },
    async mounted() {
//      this.$store.dispatch('loadChatMessageHistory');

      try {
        const connectionInfoResponse = await axios.get(`${process.env.chatUrl}/api/Connect`);
        const connectionInfo = connectionInfoResponse.data;

        const connection = new HubConnectionBuilder()
          .withUrl(connectionInfo.url, {
            accessTokenFactory() {
              return connectionInfo.accessToken;
            },
          })
          .configureLogging(LogLevel.Information)
          .build();

        connection.on('newMessage', (message) => {
          if (message) {
            // TODO: Clear typing for user
            this.messages.unshift(message);
          }
        });

        connection.on('typing', (user) => {
          // TODO: If user is not this user, add them to the list of users typing
        });

        connection.onclose(() => {
          // TODO: Show message to reconnect?
          console.log('Disconnected from chat websocket');
        });

        await connection.start();
        this.isConnected = true;
      } catch (ex) {
        this.chatLoadingError = true;
        console.error(ex.stack);
      }
    },
  };
</script>
