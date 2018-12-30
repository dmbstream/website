<template>
  <div class="py-2 chat-row" :class="{'chat-system-message':!isUserMessage}">
    <div class="d-flex w-100 justify-content-between">
      <nuxt-link
        v-if="showAuthor"
        :to="{
          name: 'users-id-slug',
          params: {
            id: message.created_by.id,
            slug: slugify(message.created_by.name),
          }
        }"
        class="chat-author">{{ message.created_by.name }}</nuxt-link>
      <small>{{ message.created_on | relativeTime }}</small>
    </div>
    <div class="pt-1" v-html="body"></div>
  </div>
</template>

<script>
  const moment = require('moment');
  import stringService from '../plugins/stringService';

  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '\n': '<br>',
  };

  function escapeHtml(string) {
    if (!string) {
      return '';
    }

    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }

  export default {
    props: {
      message: {
        type: Object,
        required: true,
      },
    },
    computed: {
      isUserMessage() {
        return this.message.created_by.id > 0;
      },
      showAuthor() {
        if (!this.isUserMessage) {
          return false;
        }

        if (this.message.previousMessage && this.message.created_by.id === this.message.previousMessage.created_by.id) {
          return false;
        }

        return true;
      },
      body() {
        const body = escapeHtml(this.message.text);
        // TODO: Add in emoji rendering
        return body;
      }
    },
    methods: {
      slugify: stringService.slugify
    },
    filters: {
      relativeTime(value) {
        if (!value) {
          return '';
        }

        const date = moment(value);
        const today = moment().startOf('d');
        if (date.isBefore(today)) {
          return date.format('MMM d h:mma')
        }

        return date.format('h:mma')
      },
    },
  };
</script>
