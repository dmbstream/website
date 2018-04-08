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
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" id="PopularConcertsDuration" aria-haspopup="true" aria-expanded="false">
                  This Week
                </button>
                <div class="dropdown-menu" aria-labelledby="PopularConcertsDuration">
                  <button class="dropdown-item" type="button">This Week</button>
                  <button class="dropdown-item" type="button">All Time</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        <div class="card">
                  <div class="card-header">
                    <h2 class="card-title">Most Popular Tracks</h2>
                  </div>
                  <div class="card-block">
                    <div class="row">
                      <div class="col-2"><nuxt-link to="/artists/1/dave-matthews-band" title="Dave Matthews Band">dmb</nuxt-link></div>
                      <div class="col"><nuxt-link to="/concerts/2001/04/21/scott-stadium?t=3">2001-04-21: Grey St</nuxt-link></div>
                    </div>
                    <div class="row">
                      <div class="col-2"><nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews (Solo)">dm</nuxt-link></div>
                      <div class="col"><nuxt-link to="/concerts/2018/01/06/radio-city-music-hall?t=4">2018-01-06: Don't Drink The Water</nuxt-link></div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" id="PopularTracksDuration" aria-haspopup="true" aria-expanded="false">
                        This Week
                      </button>
                      <div class="dropdown-menu" aria-labelledby="PopularTracksDuration">
                        <button class="dropdown-item" type="button">This Week</button>
                        <button class="dropdown-item" type="button">All Time</button>
                      </div>
                    </div>
                  </div>
                </div>-->
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
          <div class="card-block">
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/1/dave-matthews-band" title="Dave Matthews Band">dmb</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2001/04/21/scott-stadium">2001-04-21: Scott Stadium</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews (Solo)">dm</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2018/01/06/radio-city-music-hall">2018-01-06: A Concert For Island Relief</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/1/dave-matthews-band" title="Dave Matthews Band">dmb</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2001/04/21/scott-stadium">2001-04-21: Scott Stadium</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews and Tim Reynolds">d&amp;t</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2018/01/06/radio-city-music-hall">2018-01-06: A Radio City Music Hall</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews and Tim Reynolds">d&amp;t</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2001/04/21/scott-stadium">2001-04-21: Scott Stadium</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews and Tim Reynolds">d&amp;t</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2018/01/06/radio-city-music-hall">2018-01-06: Samuel Jackson</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews and Tim Reynolds">d&amp;t</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2001/04/21/scott-stadium">2001-04-21: Dlolor de Ipsum</nuxt-link>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <nuxt-link to="/artists/2/dave-matthews" title="Dave Matthews (Solo)">dm</nuxt-link>
              </div>
              <div class="col">
                <nuxt-link to="/concerts/2018/01/06/radio-city-music-hall">2018-01-06: Lorem ipsum</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import ConcertAndArtistLinkRow from '../../components/ConcertAndArtistLinkRow';
  import axios from '../../plugins/axios';

  export default {
    components: {
      ConcertAndArtistLinkRow,
    },
    data() {
      return {
        popularConcertsLoading: true,
        popularConcerts: [],
        newConcertsLoading: true,
        newConcerts: [],
      };
    },
    async asyncData() {
      const [
        popularConcertResults,
        newConcertResults,
      ] = await Promise.all([
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'PlayCount',
            itemsPerPage: 15,
          }
        }),
        axios.get('/api/concerts', {
          params: {
            sortDesc: 'ApprovedOn',
            itemsPerPage: 15,
          }
        }),
      ]);

      return {
        popularConcertsLoading: false,
        newConcertsLoading: false,
        popularConcerts: popularConcertResults.data.items,
        newConcerts: newConcertResults.data.items,
      };
    },
    head() {
      return {
        title: 'Meet At The Show',
      };
    },
  };
</script>
