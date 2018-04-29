<template>
  <section class="content content-sidebar-right">
    <p>Redirecting to tour</p>
  </section>
</template>

<script>
  export default {
    async asyncData({
      params,
      redirect,
                    }) {
      return redirect(`/tours/${params.year}`)
    },
  };
</script>
