<template>
  <h6 class="pb-2">
    <tour-breadcrumb :tour="tour" :skip-parent="skipParent" :toursById="toursById" />
  </h6>
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
      skipParent: {
        type: Boolean,
      },
      toursById: {
        type: Object,
        required: true,
      },
    },
  };
</script>
