<template>
  <div class="py-2 chat-row">
    <div class="d-flex w-100 justify-content-between">
      <nuxt-link
        :to="{
          path: 'users',
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
