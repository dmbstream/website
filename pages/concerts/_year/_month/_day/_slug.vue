<template>
  <section class="content content-sidebar-right">
    <div class="d-flex w-100 justify-content-between mb-2" v-if="nextConcert || previousConcert">
      <small v-if="previousConcert">
        <previous-concert-link :concert="previousConcert" />
      </small>
      <small v-if="nextConcert">
        <next-concert-link :concert="nextConcert" />
      </small>
    </div>

    <header class="content__title">
      <h1>{{ concertDate | toDate }} &mdash; {{ concert.name }}</h1>

      <!--
      <div class="actions">
        <a href="#" class="actions__item" title="Favorite"><i class="zmdi zmdi-favorite-outline"></i></a>
      </div>-->
    </header>

    <p>
      <button type="button" class="btn btn-success btn-wide waves-effect">Play</button>
      <button type="button" class="btn btn-secondary btn-wide waves-effect">Add to Queue</button>
    </p>

    <div class="card">
      <div class="card-block">
        <table class="table">
          <tbody>
            <tr>
              <th>Artist</th>
              <td>
                <nuxt-link
                  :to="{
                    name: 'artists-id-slug',
                    params: {
                      id: concert.artist.id,
                      slug: slugify(concert.artist.name),
                    },
                  }"
                  :title="concert.artist.name">{{ concert.artist.name }}</nuxt-link>
              </td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{{ concertDate.format('MMM D, YYYY') }}</td>
            </tr>
            <tr>
              <th>Tour</th>
              <td>
                <tour-breadcrumb :tour="concert.tour" :tours-by-id="toursById" />
              </td>
            </tr>
            <tr>
              <th>Venue</th>
              <td>
                <span class="location vcard">
                  <nuxt-link
                    :to="{
                      name: 'venues-id-slug',
                      params: {
                        id: concert.venue.id,
                        slug: slugify(concert.venue.name),
                      },
                    }"
                    :title="concert.venue.name"
                    class="url"><span class="fn n org">{{ concert.venue.name }}</span></nuxt-link>
                  <div class="adr">
                    <span class="street-address">{{ concert.venue.address }}</span><br>
                    <span class="locality">{{ concert.venue.city }}</span>,
                    <span class="region">{{ concert.venue.state }}</span>
                    <span class="country-name" v-show="concert.venue.country !== 'United States'">{{ concert.venue.country }}</span>
                    <span class="postal-code">{{ ` ${concert.venue.postal_code}` }}</span>
                  </div>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-block">
        <ol class="tracklist">
          <li class="tracklist-row" v-for="(track, index) of concert.tracks" :key="track.id">
            <div class="tracklist-col position-outer">
              <div :class="['tracklist-play-pause', {'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">
                <i class="zmdi zmdi-play"></i>
              </div>
              <div :class="['position', {'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">{{ index + 1 }}.</div>
            </div>
            <div class="tracklist-col name">
              <div class="tracklist-top-align" v-if="track.hasAdditionalData">
                <div class="track__name">{{ track.name }}</div>
                <div class="track__note">
                  <small v-if="track.firstTimePlayed" class="pr-4">&starf; {{ track.firstTimePlayed }}</small>
                  <small v-if="track.additionalData">({{ track.additionalData }})</small>
                </div>
              </div>
              <div class="tracklist-middle-align" v-else>
                <span>{{ track.name }}</span>
              </div>
            </div>
            <div class="tracklist-col more">
              <div :class="[{'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">
                <span>&hellip;</span>
              </div>
            </div>
            <div class="tracklist-col tracklist-col-duration">
              <div :class="[{'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">
                <span>{{ track.duration }}</span>
              </div>
            </div>
          </li>
        </ol>
      </div>
      <div class="card-block" v-if="noteLines.length">
        <template v-for="(line, index) of noteLines">
          {{ line }}
          <br :key="`${index}${line}}`" />
        </template>
      </div>
    </div>

    <div class="card">
      <div class="card-block" v-if="concert.recording_information">
        <template v-for="(line, index) of concert.recording_information.trim().split('\n')">
          {{ line }}
          <br :key="`${index}${line}}`" />
        </template>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="card" v-if="relatedConcertsLoading || relatedConcerts.length">
          <div class="card-header">
            <h2 class="card-title">Related Concerts</h2>
          </div>
          <div class="card-block" v-if="relatedConcertsLoading">
            Loading...
          </div>
          <div v-else-if="relatedConcertsByTour.length > 0">
            <div class="card-block">
              <div v-for="tourHolder in relatedConcertsByTour" :key="tourHolder.concerts[0].id" class="pb-4">
                <tour-breadcrumb-row :tour="tourHolder.tour" :tours-by-id="toursById" :key="tourHolder.tour.id" />
                <template v-for="concert in tourHolder.concerts">
                  <concert-and-artist-link-row :concert="concert" :compact="hasPoster" :key="concert.id"/>
                </template>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="concert in relatedConcerts">
                <concert-and-artist-link-row :concert="concert" :compact="hasPoster" :key="concert.id"/>
              </template>
            </div>
          </div>
        </div>

        <div class="card" v-if="venueConcertsLoading || venueConcerts.length">
          <div class="card-header">
            <h2 class="card-title">Additional Venue Concerts</h2>
          </div>
          <div class="card-block" v-if="venueConcertsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="concert in venueConcerts">
                <concert-and-artist-link-row :concert="concert" :compact="hasPoster" :key="concert.id"/>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6" v-if="posterUrl">
        <div class="card">
          <img class="card-img-top" :src="posterUrl"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import ConcertAndArtistLinkRow from '../../../../../components/ConcertAndArtistLinkRow';
  import NextConcertLink from '../../../../../components/NextConcertLink';
  import PreviousConcertLink from '../../../../../components/PreviousConcertLink';
  import TourBreadcrumb from '../../../../../components/TourBreadcrumb';
  import TourBreadcrumbRow from '../../../../../components/TourBreadcrumbRow';
  import axios from '../../../../../plugins/axios';
  import stringService from '../../../../../plugins/stringService';
  import orderBy from 'lodash/orderBy';

  export default {
    scrollToTop: true,
    components: {
      ConcertAndArtistLinkRow,
      NextConcertLink,
      PreviousConcertLink,
      TourBreadcrumb,
      TourBreadcrumbRow,
    },
    data() {
      return {
        concertLoading: true,
        concert: {},
        relatedConcertsLoading: true,
        relatedConcerts: [],
        relatedConcertsByTour: [],
        venueConcertsLoading: true,
        venueConcerts: [],
        toursById: {},
        previousConcert: null,
        nextConcert: null,
        noteLines: [],
      };
    },
    async asyncData({
      params,
      error,
                    }) {
      const concertResult = await axios.get(`/api/concerts/${params.year}/${params.month}/${params.day}/${params.slug}`);

      const concert = concertResult.data;

      if (!concert.id) {
        console.log(concertResult.data);
        return error({
          statusCode: 404,
          message: 'Concert not found',
          response: concertResult.data,
        });
      }

      const [
        tourResults,
        venueConcertResults,
        relatedConcertResults,
      ] = await Promise.all([
        axios.get('/api/tours'),
        axios.get(`/api/venues/${concert.venue.id}/concerts`),
        axios.get(`/api/concerts/${concert.id}/related?itemsPerPage=15`),
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

      const relatedConcerts = orderBy(relatedConcertResults.data.items, ['date'], ['desc']);

      let previousConcert;
      let nextConcert;
      const relatedConcertsByTour = [];
      for (const relatedConcert of relatedConcerts) {
        if (!relatedConcertsByTour.length || relatedConcertsByTour[relatedConcertsByTour.length - 1].tour.id !== relatedConcert.tour.id) {
          relatedConcertsByTour.push({
            tour: toursById[relatedConcert.tour.id],
            concerts: [],
          });
        }

        relatedConcertsByTour[relatedConcertsByTour.length - 1].concerts.push(relatedConcert);

        if (moment(relatedConcert.date).isBefore(concert.date) && (!previousConcert || moment(relatedConcert.date).isAfter(previousConcert.date))) {
          previousConcert = relatedConcert;
        }

        if (moment(relatedConcert.date).isAfter(concert.date) && (!nextConcert || moment(relatedConcert.date).isBefore(nextConcert.date))) {
          nextConcert = relatedConcert;
        }
      }

      concert.tour = toursById[concert.tour.id];

      const additionalDataByToken = {};
      const noteLines = [];
      let hasMoreTokens = true;
      for (const line of concert.notes.trim().split('\n')) {
        let isToken = false;
        if (line) {
          const token = line[0];
          switch (token) {
            case '!':
            case '@':
            case '#':
            case '$':
            case '%':
            case '^':
            case '&':
            case '*':
              additionalDataByToken[token] = line.slice(1).trim();
              isToken = true;
              break;
            default:
              break;
          }
        } else if (hasMoreTokens) {
          hasMoreTokens = false;
          // Skip the first blank line between additional details and other notes
          isToken = true;
        }

        if (!hasMoreTokens && !isToken) {
          noteLines.push(line);
        }
      }

      for (const track of concert.tracks) {
        const additionalDataText = [];
        for (const char of track.additional_info.trim()) {
          // Skip spaces between characters
          if (char) {
            const additionalData = additionalDataByToken[char];
            if (additionalData) {
              if (/^first time/ig.test(additionalData)) {
                track.firstTimePlayed = additionalData;
              } else {
                additionalDataText.push(additionalData);
              }
            } else {
              track.name += ` ${char}`;
            }
          }
        }

        if (additionalDataText.length) {
          track.additionalData = additionalDataText.join(', ');
        }

        track.hasAdditionalData = track.firstTimePlayed || track.additionalData;
      }

      return {
        concertLoading: false,
        concert,
        toursById,
        relatedConcertsLoading: false,
        relatedConcerts,
        relatedConcertsByTour,
        venueConcertsLoading: false,
        venueConcerts: venueConcertResults.data.items.filter((venueConcert) => {
          return venueConcert.id !== concert.id;
        }),
        previousConcert,
        nextConcert,
        noteLines,
      };
    },
    computed: {
      concertDate() {
        return moment(this.concert.date);
      },
      hasPoster() {
        return !!this.concert.poster_url;
      },
      posterUrl() {
        if (!this.concert.poster_url) {
          return '';
        }

        return `${process.env.apiUrl}${this.concert.poster_url}`;
      },
    },
    filters: {
      toDate(value) {
        return moment(value).format('YYYY-MM-DD');
      },
    },
    methods: {
      slugify: stringService.slugify,
    },
    head() {
      let alternateVenueName = '';
      let hasAlternateVenueName;
      if (this.concert.name !== this.concert.venue.name) {
        hasAlternateVenueName = true;
        alternateVenueName = ` (${this.concert.venue.name})`;
      }

      return {
        title: `${this.concertDate.format('YYYY-MM-DD')} - ${this.concert.name} - ${this.concert.artist.name}`,
        meta: [{
          hid: "description",
          property: "description",
          content: `${this.concert.artist.name} concert at ${this.concert.name}${alternateVenueName} on ${this.concertDate.format('MMMM d, YYYY')}`,
        }, {
          hid: "keywords",
          property: "keywords",
          content: `${this.concert.artist.name},${this.concert.artist.abbr},concert,show,${hasAlternateVenueName ? this.concert.name + ',' : ''}${this.concert.venue.name},${this.concertDate.format('MMMM,YYYY,YYYY-MM-DD')}`,
        }, {
          hid: "og:band",
          property: "og:band",
          content: this.concert.artist.name,
        }, {
          hid: "og:type",
          property: "og:type",
          content: 'album',
        }]
      };
    },
  };
</script>
