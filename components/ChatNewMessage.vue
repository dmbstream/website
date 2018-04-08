<template>
  <div class="p-2 w-100">
    <input type="text" placeholder="Send a message" class="p-2 w-100" v-model="message" @keyup.enter="sendMessage"/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: '',
      };
    },
    methods: {
      sendMessage() {
        if (this.message) {
          this.$emit('chat.newMessage', this.message);
          this.message = '';
        }
      },
    },
  };
</script>
