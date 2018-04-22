<template>
  <div class="row">
    <div class="col"><nuxt-link :to="{
      name: 'concerts-year-month-day-slug',
      params: {
        id: track.concert.id,
        year: concertDate.format('YYYY'),
        month: concertDate.format('MM'),
        day: concertDate.format('DD'),
        slug: slugify(track.concert.name),
      },
      query: {
        t: track.id,
      },
    }">{{ concertDate | toDate }}: {{ track.name }}</nuxt-link></div>
  </div>
</template>

<script>
  import moment from 'moment';
  import stringService from '../plugins/stringService';

  export default {
    props: {
      track: {
        type: Object,
        required: true,
      },
    },
    methods: {
      slugify: stringService.slugify
    },
    computed: {
      concertDate() {
        return moment(this.track.concert.date);
      },
    },
    filters: {
      toDate(value) {
        return value.format('YYYY-MM-DD');
      },
    },
  };
</script>
