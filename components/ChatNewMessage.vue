<template>
  <div v-if="isConnected" class="p-2 w-100">
    <!--<emoji-picker :data="data" :custom-data="customEmojis" />-->
    <input
      type="text"
      placeholder="Send a message"
      class="p-2 w-100"
      v-model="message"
      @keyup.enter="sendMessage"/>
  </div>
  <div v-else class="p-2 w-100">
    <input
      type="text"
      placeholder="Connecting..."
      class="p-2 w-100"
      disabled="disabled"
    />
  </div>
</template>

<script>
  import { NimblePicker as EmojiPicker } from 'emoji-mart-vue';
  import data from 'emoji-mart-vue/data/apple.json';
  import * as customEmojis from '../utils/emojis';

  export default {
    components: {
      EmojiPicker,
    },
    props: {
      isConnected: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        data,
        customEmojis,
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
