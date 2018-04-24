<template>
  <section class="content content-sidebar-right">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link :to="{
            name: 'artists',
          }">Artists</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ artist.name }}
        </li>
      </ol>
    </nav>

    <header class="content__title" v-if="artist.name">
      <h1>{{ artist.name }}</h1>
    </header>

    <div class="row">
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Artist Information</h2>
          </div>
          <div class="card-block" v-if="artistLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <strong>Concerts: </strong> {{ artist.concert_count }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Latest Concerts</h2>
          </div>
          <div class="card-block" v-if="latestConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <div v-for="tourHolder in latestConcertsByTour" :key="tourHolder.concerts[0].id" class="pb-4">
                <tour-breadcrumb-row :tour="tourHolder.tour" :toursById="toursById" :key="tourHolder.tour.id" />
                <template v-for="concert in tourHolder.concerts">
                  <concert-link-row :concert="concert" :key="concert.id"/>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Most Popular Concerts</h2>
          </div>
          <div class="card-block" v-if="popularConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="concert in popularConcerts">
                <concert-link-row :concert="concert" :key="concert.id"/>
              </template>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Recently Added Concerts</h2>
          </div>
          <div class="card-block" v-if="newConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="concert in newConcerts">
                <concert-link-row :concert="concert" :key="concert.id"/>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import ConcertLinkRow from '../../../components/ConcertLinkRow';
  import TrackLinkRow from "../../../components/TrackLinkRow";
  import TourBreadcrumbRow from '../../../components/TourBreadcrumbRow';
  import axios from '../../../plugins/axios';
  import take from 'lodash/take';

  export default {
    scrollToTop: true,
    components: {
      ConcertLinkRow,
      TrackLinkRow,
      TourBreadcrumbRow,
    },
    data() {
      return {
        artistLoading: true,
        artist: {},
        popularConcertsLoading: true,
        popularConcerts: [],
        newConcertsLoading: true,
        newConcerts: [],
        latestConcertsLoading: true,
        latestConcertsByTour: [],
        toursById: {},
      };
    },
    async asyncData({
      params,
      error,
                    }) {
      const artistResult = await axios.get(`/api/artists/${params.id}`);

      const artist = artistResult.data;

      if (!artist.id) {
        console.log(artist);
        return error({
          statusCode: 404,
          message: 'Artist not found',
          response: artistResult,
        });
      }

      const [
        popularConcertResults,
        newConcertResults,
        latestConcertResults,
        tourResults,
      ] = await Promise.all([
        axios.get(`/api/artists/${artist.id}/concerts`, {
          params: {
            sortDesc: 'Popular',
            itemsPerPage: 15,
          }
        }),
        axios.get(`/api/artists/${artist.id}/concerts`, {
          params: {
            sortDesc: 'ApprovedOn',
            itemsPerPage: 10,
          }
        }),
        axios.get(`/api/artists/${artist.id}/concerts`, {
          params: {
            sortDesc: 'ConcertDate',
            itemsPerPage: 20,
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

      const latestConcertsByTour = [];
      for (const concert of take(latestConcertResults.data.items, 20)) {
        if (!latestConcertsByTour.length || latestConcertsByTour[latestConcertsByTour.length - 1].tour.id !== concert.tour.id) {
          latestConcertsByTour.push({
            tour: toursById[concert.tour.id],
            concerts: [],
          });
        }

        latestConcertsByTour[latestConcertsByTour.length - 1].concerts.push(concert);
      }

      return {
        artistLoading: false,
        popularConcertsLoading: false,
        newConcertsLoading: false,
        latestConcertsLoading: false,
        artist,
        popularConcerts: take(popularConcertResults.data.items, 15),
        newConcerts: take(newConcertResults.data.items, 10),
        latestConcertsByTour,
        toursById,
      };
    },
    head() {
      return {
        title: this.artist.name,
      };
    },
  };
</script>
