<template>
  <section class="content content-sidebar-right">
    <header class="content__title">
      <h1>Tours</h1>
    </header>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">All Tours</h2>
      </div>
      <div class="card-block" v-if="toursLoading">
        Loading...
      </div>
      <div v-else>
        <div class="card-block">
          <div v-for="tour in tours" :key="tour.id">
            <h5>
              <nuxt-link 
                :to="{
                  name: 'tours-slug',
                  params: {
                    slug: tour.slug,
                  },
                }" 
                :title="tour.name">
                {{ tour.name }}
              </nuxt-link>
              ({{ tour.concert_count }})
            </h5>
            <ul v-if="tour.children && tour.children.length" class="list-unstyled pl-4">
              <li v-for="child in tour.children" :key="child.id">
                <nuxt-link 
                  :to="{
                    name: 'tours-slug',
                    params: {
                      slug: child.slug,
                    },
                  }" 
                  :title="child.name">
                  {{ child.name }}
                </nuxt-link>
                ({{ child.concert_count }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from '../../plugins/axios';
  import stringService from '../../plugins/stringService';

  export default {
    scrollToTop: true,
    components: {
    },
    data() {
      return {
        toursLoading: true,
        tours: [],
      };
    },
    async asyncData() {
      const tourResults = await axios.get('/api/tours', {
        params: {
          sortDesc: 'StartOn',
          itemsPerPage: 5000,
        },
      });

      return {
        toursLoading: false,
        tours: tourResults.data.items,
      };
    },
    methods: {
      slugify: stringService.slugify
    },
    head() {
      return {
        title: 'Tours',
      };
    },
  };
</script>
