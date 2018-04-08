<template>
  <div class="pb-2">
    <tour-breadcrumb :tour="tour" :toursById="toursById" />
  </div>
</template>

<script>
  import TourBreadcrumb from './TourBreadcrumb';

  export default {
    components: {
      TourBreadcrumb,
    },
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
  };
</script>
