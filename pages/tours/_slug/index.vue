<template>
  <section class="content content-sidebar-right">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link :to="{
            name: 'tours',
          }">Tours</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-if="tour.parent">
          <nuxt-link :to="{
            name: 'tours-slug',
            params: {
              slug: tour.parent.slug,
            },
          }" v-if="tour.parent">{{ tour.parent.name }}</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ tour.name }}
        </li>
      </ol>
    </nav>

    <header class="content__title" v-if="tour.name">
      <h1>{{ tour.name }}</h1>
    </header>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Tour Information</h2>
      </div>
      <div class="card-block" v-if="tourLoading">
        Loading...
      </div>
      <div v-else>
        <div class="card-block">
          <strong>Concerts: </strong> {{ tour.concert_count }}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Concerts</h2>
      </div>
      <div class="card-block" v-if="concertsByTourLoading">
        Loading...
      </div>
      <div v-else>
        <div class="card-block">
          <div v-for="tourHolder in concertsByTour" :key="tourHolder.concerts[0].id" class="pb-4">
            <tour-breadcrumb-row :tour="tourHolder.tour" :toursById="toursById" :key="tourHolder.tour.id" :skipParent="true" v-if="tourHolder.tour.id !== tour.id" />
            <template v-for="concert in tourHolder.concerts">
              <concert-and-artist-link-row :concert="concert" :key="concert.id" :compact="false" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import ConcertAndArtistLinkRow from '../../../components/ConcertAndArtistLinkRow';
  import TourBreadcrumbRow from '../../../components/TourBreadcrumbRow';
  import axios from '../../../plugins/axios';
  import stringService from '../../../plugins/stringService';

  export default {
    scrollToTop: true,
    components: {
      ConcertAndArtistLinkRow,
      TourBreadcrumbRow,
    },
    data() {
      return {
        tourLoading: true,
        tour: {},
        concertsByTourLoading: true,
        concertsByTour: {},
        toursById: {},
      };
    },
    async asyncData({
      params,
      error,
                    }) {
      const tourResult = await axios.get(`/api/tours/${params.slug}`);

      const tour = tourResult.data;

      if (!tour.id) {
        return error({
          statusCode: 404,
          message: 'Tour not found',
          response: tourResult,
        });
      }

      const [
        concertResults,
        tourResults,
      ] = await Promise.all([
        axios.get(`/api/tours/${tour.slug}/concerts`, {
          params: {
            itemsPerPage: 5000,
          }
        }),
        axios.get('/api/tours'),
      ]);

      const toursById = {};
      for (const tour of tourResults.data.items) {
        toursById[tour.id] = tour;

        if (tour.children) {
          for (const child of tour.children) {
            child.parent = tour.id;
            toursById[child.id] = child;
          }
        }
      }

      const concertsByTour = [];
      for (const concert of concertResults.data.items) {
        if (!concertsByTour.length || concertsByTour[concertsByTour.length - 1].tour.id !== concert.tour.id) {
          concertsByTour.push({
            tour: toursById[concert.tour.id],
            concerts: [],
          });
        }

        concertsByTour[concertsByTour.length - 1].concerts.push(concert);
      }

      return {
        tourLoading: false,
        tour,
        concertsByTourLoading: false,
        concertsByTour,
        toursById,
      };
    },
    head() {
      return {
        title: this.tour.name,
      };
    },
    methods: {
      slugify: stringService.slugify
    },
  };
</script>
