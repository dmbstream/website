<template>
  <span>
    <span v-if="parent">
      <tour-breadcrumb :tour="parent" :tours-by-id="toursById" />
      &raquo;
    </span>
    <nuxt-link
      :to="{
        name: 'tours-slug',
        params: {
          slug: tour.slug,
        },
      }"
      :title="tour.name">{{ tour.name }}</nuxt-link>
  </span>
</template>

<script>
  import stringService from '../plugins/stringService';

  export default {
    name: 'TourBreadcrumb',
    props: {
      tour: {
        type: Object,
        required: true,
      },
      skipParent: {
        type: Boolean,
        default: false,
      },
      toursById: {
        type: Object,
        required: true,
      },
    },
    methods: {
      slugify: stringService.slugify
    },
    computed: {
      parent() {
        if (this.tour.parent && !this.skipParent) {
          return this.toursById[this.tour.parent];
        }

        return null;
      }
    }
  };
</script>
