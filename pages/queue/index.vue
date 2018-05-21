<template>
  <section class="content content-sidebar-right">
    <header class="content__title">
      <h1>Play Queue</h1>
    </header>

    <ul class="nav">
      <li class="nav-item"><nuxt-link :to="{name: 'queue'}" class="nav-link active">Queue</nuxt-link></li>
      <li class="nav-item"><nuxt-link :to="{name: 'queue-history'}" class="nav-link">History</nuxt-link></li>
    </ul>

    <div class="card" v-if="currentTrack">
      <div class="card-block">
        <h5>Now Playing</h5>
        <ol class="tracklist">
          <li class="tracklist-row">
            <div class="tracklist-col position-outer">
              <div :class="['tracklist-play-pause', {'tracklist-middle-align': !currentTrack.hasAdditionalData, 'tracklist-top-align': currentTrack.hasAdditionalData}]">
                <a @click.prevent="togglePlayPause()"><i :class="[{'zmdi': true, 'zmdi-play': isPaused, 'zmdi-pause': !isPaused}]"></i></a>
              </div>
            </div>
            <div class="tracklist-col name">
              <div class="tracklist-top-align" v-if="currentTrack.hasAdditionalData">
                <div class="track__name">
                  <div class="row">
                    <div class="col-6">{{ currentTrack.name }}</div>
                    <div class="col-3">{{ currentTrack.concert.artist.name }}</div>
                    <div class="col-3">{{ toFriendlyDate(currentTrack.concert.date) }}</div>
                  </div>
                </div>
                <div class="track__note">
                  <small v-if="currentTrack.firstTimePlayed" class="pr-4">&starf; {{ currentTrack.firstTimePlayed }}</small>
                  <small v-if="currentTrack.additionalData">({{ currentTrack.additionalData }})</small>
                </div>
              </div>
              <div class="tracklist-middle-align" v-else>
                <div class="row">
                  <div class="col-6">{{ currentTrack.name }}</div>
                  <div class="col-3">{{ currentTrack.concert.artist.name }}</div>
                  <div class="col-3">{{ toFriendlyDate(currentTrack.concert.date) }}</div>
                </div>
              </div>
            </div>
            <div class="tracklist-col more">
              <div :class="[{'tracklist-middle-align': !currentTrack.hasAdditionalData, 'tracklist-top-align': currentTrack.hasAdditionalData}]">
                <span>&hellip;</span>
              </div>
            </div>
            <div class="tracklist-col tracklist-col-duration">
              <div :class="[{'tracklist-middle-align': !currentTrack.hasAdditionalData, 'tracklist-top-align': currentTrack.hasAdditionalData}]">
                <span>{{ currentTrack.duration }}</span>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <div class="card" v-if="hasNextUp">
      <div class="card-block">
        <h5>Next Up</h5>
        <ol class="tracklist">
          <li class="tracklist-row" v-for="(track, index) of nextUpTracks" :key="track.id">
            <div class="tracklist-col position-outer">
              <div :class="['tracklist-play-pause', {'tracklist-middle-align': !track.hasAdditionalData, 'tracklist-top-align': track.hasAdditionalData}]">
                <a @click.prevent="playTrack(track, index)"><i class="zmdi zmdi-play"></i></a>
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
      </div>
    </div>

    <div class="card" v-if="!currentTrack && !hasNextUp">
      <div class="card-block">
        Doesn't look like you have any songs queued up.
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';

  export default {
    scrollToTop: true,
    computed: {
      currentTrack() {
        return this.$store.state.currentTrack;
      },
      hasNextUp() {
        return this.nextUpTracks.length;
      },
      nextUpTracks() {
        if (!this.$store.state.queue.length) {
          return this.$store.state.queue;
        }

        return this.$store.state.queue.slice(1);
      },
      isPaused() {
        return this.$store.state.isPaused;
      },
    },
    methods: {
      togglePlayPause() {
        this.$store.dispatch('togglePlayPause');
      },
      playTrack(track, index) {
        const tracks = this.nextUpTracks.slice(index);
        this.$store.dispatch('play', tracks);
      },
      toFriendlyDate(date) {
        return moment(date).format('MMM D, YYYY');
      },
    },
    head() {
      return {
        title: 'Play Queue',
      };
    },
  };
</script>
