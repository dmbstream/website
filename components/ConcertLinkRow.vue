<template>
  <div class="row">
    <div class="col"><nuxt-link 
      :to="{
        name: 'concerts-year-month-day-slug',
        params: {
          id: concert.id,
          year: concertDate.format('YYYY'),
          month: concertDate.format('MM'),
          day: concertDate.format('DD'),
          slug: slugify(concert.name),
        },
    }">{{ concertDate | toDate }}: {{ concert.name }}</nuxt-link></div>
  </div>
</template>

<script>
  import moment from 'moment';
  import stringService from '../plugins/stringService';

  export default {
    props: {
      concert: {
        type: Object,
        required: true,
      },
    },
    methods: {
      slugify: stringService.slugify
    },
    computed: {
      concertDate() {
        return moment(this.concert.date);
      },
    },
    filters: {
      toDate(value) {
        return value.format('YYYY-MM-DD');
      },
    },
  };
</script>
