<template>
  <section class="content content-sidebar-right">
    <header class="content__title">
      <h1>Artists</h1>
    </header>

    <div class="row">
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">All Artists</h2>
          </div>
          <div class="card-block" v-if="allArtistsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="artist in allArtists">
                <artist-with-concert-count-link-row :artist="artist" :key="artist.id"/>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Most Popular Artists</h2>
          </div>
          <div class="card-block" v-if="popularArtistsLoading">
            Loading...
          </div>
          <div v-else>
            <div class="card-block">
              <template v-for="artist in popularArtists">
                <artist-with-concert-count-link-row :artist="artist" :key="artist.id"/>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import ArtistWithConcertCountLinkRow from '../../components/ArtistWithConcertCountLinkRow';
  import axios from '../../plugins/axios';
  import sortBy from 'lodash/sortBy';

  export default {
    scrollToTop: true,
    components: {
      ArtistWithConcertCountLinkRow,
    },
    data() {
      return {
        popularArtistsLoading: true,
        popularArtists: [],
        allArtistsLoading: true,
        allArtists: [],
      };
    },
    async asyncData() {
      const popularArtistResults = await axios.get('/api/artists', {
        params: {
          sortDesc: 'ConcertCount',
        },
      });

      return {
        popularArtistsLoading: false,
        popularArtists: popularArtistResults.data.items,
        allArtistsLoading: false,
        allArtists: sortBy(popularArtistResults.data.items, 'name'),
      };
    },
    head() {
      return {
        title: 'Artists',
      };
    },
  };
</script>
