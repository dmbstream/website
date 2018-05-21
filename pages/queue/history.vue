<template>
  <section class="content content-sidebar-right">
    <header class="content__title">
      <h1>Play Queue</h1>
    </header>

    <ul class="nav">
      <li class="nav-item"><nuxt-link :to="{name: 'queue'}" class="nav-link">Queue</nuxt-link></li>
      <li class="nav-item"><nuxt-link :to="{name: 'queue-history'}" class="nav-link active">History</nuxt-link></li>
    </ul>

    <div class="card">
      <div class="card-block">
        <h5>History</h5>
        <ol class="tracklist" v-if="hasHistory">
          <li class="tracklist-row" v-for="(track) of historyTracks" :key="track.id">
            <div class="tracklist-col position-outer">
              <div :class="['tracklist-play-pause', {'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">
                <a @click.prevent="playTrack(track)"><i class="zmdi zmdi-play"></i></a>
              </div>
            </div>
            <div class="tracklist-col name">
              <div class="tracklist-top-align" v-if="track.hasAdditionalData">
                <div class="track__name">
                  <div class="row">
                    <div class="col-6">{{ track.name }}</div>
                    <div class="col-3">{{ track.concert.artist.name }}</div>
                    <div class="col-3">{{ toFriendlyDate(track.concert.date) }}</div>
                  </div>
                </div>
                <div class="track__note">
                  <small v-if="track.firstTimePlayed" class="pr-4">&starf; {{ track.firstTimePlayed }}</small>
                  <small v-if="track.additionalData">({{ track.additionalData }})</small>
                </div>
              </div>
              <div class="tracklist-middle-align" v-else>
                <div class="row">
                  <div class="col-6">{{ track.name }}</div>
                  <div class="col-3">{{ track.concert.artist.name }}</div>
                  <div class="col-3">{{ toFriendlyDate(track.concert.date) }}</div>
                </div>
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

        <div v-else>
          Doesn't look like you have played any songs.
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';

  export default {
    scrollToTop: true,
    computed: {
      hasHistory() {
        return this.historyTracks.length;
      },
      historyTracks() {
        return this.$store.state.history;
      },
    },
    methods: {
      playTrack(track) {
        this.$store.dispatch('play', [track]);
      },
      toFriendlyDate(date) {
        return moment(date).format('MMM D, YYYY');
      },
    },
    head() {
      return {
        title: 'Play Queue - History',
      };
    },
  };
</script>
