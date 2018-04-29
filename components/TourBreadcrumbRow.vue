<template>
  <h6 class="pb-2">
    <tour-breadcrumb :tour="tour" :skip-parent="skipParent" :tours-by-id="toursById" />
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
        default: false,
      },
      toursById: {
        type: Object,
        required: true,
      },
    },
  };
</script>
