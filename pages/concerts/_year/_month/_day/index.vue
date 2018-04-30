<template>
  <section class="content content-sidebar-right">
    <p>Concert not found</p>
  </section>
</template>

<script>
  import moment from 'moment';
  import axios from '../../../../../plugins/axios';
  import stringService from '../../../../../plugins/stringService';

  export default {
    async asyncData({
      params,
      error,
      redirect,
                    }) {
      try {
        const concertResult = await axios.get(`/api/concerts/${params.year}/${params.month}/${params.day}`);

        const concert = concertResult.data;
        if (concert) {
          console.log(concert);
          return redirect(`/concerts/${params.year}/${params.month}/${params.day}/${stringService.slugify(concert.name)}`)
        }
      } catch (ex) {
        // Catch 404
      }

      return error({
        statusCode: 404,
        message: 'Concert not found'
      });
    },
  };
</script>
