<template>
  <section class="content content-sidebar-right">
    <p>Artist not found</p>
  </section>
</template>

<script>
  import axios from '../../../plugins/axios';
  import stringService from '../../../plugins/stringService';

  export default {
    async asyncData({
      params,
      error,
      redirect,
                    }) {
      try {
        const artistResult = await axios.get(`/api/artists/${params.id}`);

        const artist = artistResult.data;
        if (artist) {
          return redirect(`/artists/${artist.id}/${stringService.slugify(artist.name)}`)
        }
      } catch (ex) {
        // Catch 404
      }

      return error({
        statusCode: 404,
        message: 'Artist not found'
      });
    },
  };
</script>
