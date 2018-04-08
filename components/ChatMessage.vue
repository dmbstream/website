<template>
  <div class="py-2 chat-row">
    <div class="d-flex w-100 justify-content-between">
      <nuxt-link :to="{ path: 'user', params: { id: message.user.id } }" class="chat-author">{{ message.user.name }}</nuxt-link>
      <small>{{ message.sentAt | relativeTime }}</small>
    </div>
    <div class="pt-1" v-html="body"></div>
  </div>
</template>

<script>
  const moment = require('moment');

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
      body() {
        const body = escapeHtml(this.message.body);
        // TODO: Add in emoji rendering
        return body;
      }
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
