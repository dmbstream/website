<template>
  <section class="content content-sidebar-right">
    <p>Tour not found</p>
  </section>
</template>

<script>
  import axios from '../../../plugins/axios';
  import stringService from '../../../plugins/stringService';
  import find from 'lodash/find';

  export default {
    async asyncData({
      params,
      error,
      redirect,
                    }) {
      try {
        const tourResult = await axios.get(`/api/tours/${params.id}`);

        const tour = tourResult.data;

        if (tour.id) {
          return redirect(302, `/tours/${tour.id}/${stringService.slugify(tour.name)}`)
        }
      } catch (ex) {
        // Catch 404
      }

      // Try to find it by name
      const allToursResult = await axios.get(`/api/tours`);
      const tourByName = find(allToursResult.data.items, {
        name: params.id,
      });

      if (tourByName) {
        return redirect(302, `/tours/${tourByName.id}/${stringService.slugify(tourByName.name)}`)
      }

      return error({
        statusCode: 404,
        message: 'Tour not found',
      });
    },
  };
</script>
