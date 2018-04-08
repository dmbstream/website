<template>
  <span>
    <span v-if="parent">
      <tour-breadcrumb :tour="parent" :toursById="toursById" />
      &raquo;
    </span>
    <nuxt-link :to="{
      name: 'tours-id-slug',
      params: {
        id: tour.id,
        slug: slugify(tour.name),
      },
    }" :title="tour.name">{{ tour.name }}</nuxt-link>
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
        if (this.tour.parent) {
          return this.toursById[this.tour.parent];
        }

        return null;
      }
    }
  };
</script>
