<template>
  <section class="content content-sidebar-right">
    <div class="row">
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">All Concerts</h2>
          </div>
          <div class="card-block" v-if="allConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <div v-for="tourHolder in allConcertsByTour" :key="tourHolder.concerts[0].id" class="pb-4">
                <tour-breadcrumb-row :tour="tourHolder.tour" :tours-by-id="toursById" :key="tourHolder.tour.id" />
                <template v-for="concert in tourHolder.concerts">
                  <concert-and-artist-link-row :concert="concert" :key="concert.id"/>
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
                <concert-and-artist-link-row :concert="concert" :key="concert.id"/>
              </template>
            </div>
            <div class="card-body">
              <b-dropdown :text="popularConcertsTimeSpan">
                <b-dropdown-item-button @click="changePopularConcertsTimeSpan('This week')">This week</b-dropdown-item-button>
                <b-dropdown-item-button @click="changePopularConcertsTimeSpan('All time')">All time</b-dropdown-item-button>
              </b-dropdown>
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
                <concert-and-artist-link-row :concert="concert" :key="concert.id"/>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import ConcertAndArtistLinkRow from '../../components/ConcertAndArtistLinkRow';
  import TrackWithArtistLinkRow from "../../components/TrackWithArtistLinkRow";
  import TourBreadcrumbRow from '../../components/TourBreadcrumbRow';
  import axios from '../../plugins/axios';
  import take from 'lodash/take';

  export default {
    scrollToTop: true,
    components: {
      ConcertAndArtistLinkRow,
      TrackWithArtistLinkRow,
      TourBreadcrumbRow,
    },
    data() {
      return {
        popularConcertsLoading: true,
        popularConcerts: [],
        newConcertsLoading: true,
        newConcerts: [],
        allConcertsLoading: true,
        allConcertsByTour: [],
        popularConcertsTimeSpan: 'This week',
        toursById: {},
      };
    },
    async asyncData() {
      const [
        popularConcertResults,
        newConcertResults,
        allConcertResults,
        tourResults,
      ] = await Promise.all([
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'Popular',
            itemsPerPage: 10,
            since: moment().subtract(1, 'w').startOf('day').toDate(),
          }
        }),
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'ApprovedOn',
            itemsPerPage: 10,
          }
        }),
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'ConcertDate',
            page: 1,
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

      const allConcertsByTour = [];
      for (const concert of allConcertResults.data.items) {
        if (!allConcertsByTour.length || allConcertsByTour[allConcertsByTour.length - 1].tour.id !== concert.tour.id) {
          allConcertsByTour.push({
            tour: toursById[concert.tour.id],
            concerts: [],
          });
        }

        allConcertsByTour[allConcertsByTour.length - 1].concerts.push(concert);
      }

      return {
        popularConcertsLoading: false,
        popularTracksLoading: false,
        newConcertsLoading: false,
        allConcertsLoading: false,
        popularConcerts: take(popularConcertResults.data.items, 15),
        newConcerts: take(newConcertResults.data.items, 10),
        allConcertsByTour,
        toursById,
      };
    },
    methods: {
      async changePopularConcertsTimeSpan(timeSpan) {
        this.popularConcertsTimeSpan = timeSpan;

        this.popularConcertsLoading = true;
        const concertResults = await axios.get('/api/concerts', {
          params: {
            sortDesc: 'Popular',
            itemsPerPage: 10,
            since: timeSpan === 'This week' ? moment().subtract(1, 'w').startOf('day').toDate() : undefined,
          }
        });

        this.popularConcerts = take(concertResults.data.items, 15);
        this.popularConcertsLoading = false;
      },
    },
    head() {
      return {
        title: 'Concerts',
      };
    },
  };
</script>
