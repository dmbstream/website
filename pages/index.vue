<template>
  <section class="content content-sidebar-right">
    <div class="row">
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
            <h2 class="card-title">Most Popular Tracks</h2>
          </div>
          <div class="card-block" v-if="popularTracksLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="track in popularTracks">
                <track-with-artist-link-row :track="track" :key="track.id"/>
              </template>
            </div>
            <div class="card-body">
              <b-dropdown :text="popularTracksTimeSpan">
                <b-dropdown-item-button @click="changePopularTracksTimeSpan('This week')">This week</b-dropdown-item-button>
                <b-dropdown-item-button @click="changePopularTracksTimeSpan('All time')">All time</b-dropdown-item-button>
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md">
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

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Latest Performances</h2>
          </div>
          <div class="card-block" v-if="latestConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <div v-for="tourHolder in latestConcertsByTour" :key="tourHolder.concerts[0].id" class="pb-2">
                <tour-breadcrumb-row :tour="tourHolder.tour" :toursById="toursById" :key="tourHolder.tour.id" />
                <template v-for="concert in tourHolder.concerts">
                  <concert-and-artist-link-row :concert="concert" :key="concert.id"/>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import ConcertAndArtistLinkRow from '../components/ConcertAndArtistLinkRow';
  import TrackWithArtistLinkRow from "../components/TrackWithArtistLinkRow";
  import TourBreadcrumbRow from '../components/TourBreadcrumbRow';
  import axios from '../plugins/axios';
  import take from 'lodash/take';

  export default {
    components: {
      ConcertAndArtistLinkRow,
      TrackWithArtistLinkRow,
      TourBreadcrumbRow,
    },
    data() {
      return {
        popularConcertsLoading: true,
        popularConcerts: [],
        popularTracksLoading: true,
        popularTracks: [],
        newConcertsLoading: true,
        newConcerts: [],
        latestConcertsLoading: true,
        latestConcertsByTour: [],
        popularConcertsTimeSpan: 'This week',
        popularTracksTimeSpan: 'This week',
      };
    },
    async asyncData() {
      const [
        popularConcertResults,
        popularTrackResults,
        newConcertResults,
        latestConcertResults,
        tourResults,
      ] = await Promise.all([
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'PlayCount',
            itemsPerPage: 10,
            startDate: moment().subtract(1, 'w').startOf('day').toDate(),
          }
        }),
        axios.get('/api/tracks', {
          params: {
            sortDesc: 'PlayCount',
            itemsPerPage: 10,
            startDate: moment().subtract(1, 'w').startOf('day').toDate(),
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
            itemsPerPage: 10,
          }
        }),
        axios.get('/api/tours'),
      ]);

      console.log(popularTrackResults.response);

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
        popularConcertsLoading: false,
        popularTracksLoading: false,
        newConcertsLoading: false,
        latestConcertsLoading: false,
        popularConcerts: take(popularConcertResults.data.items, 10),
        popularTracks: take(popularTrackResults.data.items, 10),
        newConcerts: take(newConcertResults.data.items, 10),
        latestConcertsByTour,
        toursById,
      };
    },
    methods: {
      async changePopularConcertsTimeSpan(timeSpan) {
        this.popularConcertsTimeSpan = timeSpan;

        this.popularConcertsLoading = true;
        const concertResults = await axios.get('/api/concerts', {
          params: {
            sortDesc: 'PlayCount',
            itemsPerPage: 10,
            startDate: timeSpan === 'This week' ? moment().subtract(1, 'w').startOf('day').toDate() : undefined,
          }
        });

        this.popularConcerts = concertResults.data.items;
        this.popularConcertsLoading = false;
      },
      async changePopularTracksTimeSpan(timeSpan) {
        this.popularTracksTimeSpan = timeSpan;

        this.popularTracksLoading = true;
        const trackResults = await axios.get('/api/tracks', {
          params: {
            sortDesc: 'PlayCount',
            itemsPerPage: 10,
            startDate: timeSpan === 'This week' ? moment().subtract(1, 'w').startOf('day').toDate() : undefined,
          }
        });

        this.popularTracks = trackResults.data.items;
        this.popularTracksLoading = false;
      },
    },
    head() {
      return {
        title: 'Meet At The Show',
      };
    },
  };
</script>
