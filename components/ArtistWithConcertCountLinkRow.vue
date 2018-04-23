<template>
  <div class="row">
    <div class="col"><nuxt-link :to="{
      name: 'artists-id-slug',
      params: {
        id: artist.id,
        slug: slugify(artist.name),
      },
    }">{{ artist.name }} ({{ artist.concert_count }} concerts)</nuxt-link></div>
  </div>
</template>

<script>
  import stringService from '../plugins/stringService';

  export default {
    props: {
      artist: {
        type: Object,
        required: true,
      },
    },
    methods: {
      slugify: stringService.slugify
    },
  };
</script>
