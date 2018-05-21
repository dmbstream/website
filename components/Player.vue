<template>
  <footer class="footer">
    <div class="footer__details">
      <div v-if="currentTrack">
        <div class="footer__details__song"><strong>{{ currentTrack.name }}</strong></div>
        <div class="footer__details__song">{{ currentTrack.concert.artist.abbr }} :: {{ concertDate | toDate }}</div>
      </div>
    </div>
    <div class="footer__player">
      <div class="footer__player__controls">
        <!--
        <button class="control-button control-button--active footer__player__controls__secondary" title="Enable shuffle"><i class="zmdi zmdi-shuffle"></i></button>
        -->
        <button class="control-button" title="Previous" @click.prevent="playPrevious()"><i class="zmdi zmdi-skip-previous"></i></button>
        <button
          class="control-button control-button--play control-button--circled"
          title="Play"
          @click.prevent="togglePlayPause()"
          v-show="isPaused"><i class="zmdi zmdi-play"></i></button>
        <button
          class="control-button control-button--pause control-button--circled"
          title="Pause"
          @click.prevent="togglePlayPause()"
          v-show="!isPaused"><i class="zmdi zmdi-pause"></i></button>
        <button class="control-button" title="Next" @click.prevent="playNext()"><i class="zmdi zmdi-skip-next"></i></button>
        <!--
        <button class="control-button footer__player__controls__secondary" title="Enable repeat"><i class="zmdi zmdi-repeat"></i></button>
        -->
      </div>
      <div class="footer__player__playback">
        <div v-if="currentTrack" class="footer__player__playback__progressTime">{{ currentTime | toDuration }}</div>
        <div class="footer__player__playback__progress">
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{width: `${progressAsPercent}%`}"
              :aria-valuenow="currentTime"
              aria-valuemin="0"
              :aria-valuemax="duration"></div>
          </div>
        </div>
        <div v-if="currentTrack" class="footer__player__playback__totalTime">{{ duration | toDuration }}</div>
      </div>
    </div>
    <div class="footer__actions">
      <ul>
        <li><nuxt-link :to="{name: 'queue'}"><i class="zmdi zmdi-playlist-audio zmdi-hc-2x"></i></nuxt-link></li>
        <li class="volume">
          <div class="volume-row">
            <div class="volume-icon">
              <i class="zmdi zmdi-volume-up"></i>
            </div>
            <div class="volume-progress">
              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="{width: `${volume}%`}"
                  :aria-valuenow="volume"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script>
  import moment from 'moment';
  import momentDuration from 'moment-duration-format';
  import Gapless from 'gapless.js'

  momentDuration(moment);

  export default {
    mounted() {
      const ctx = this;
      const player = new Gapless.Queue({
        onProgress() {
          ctx.$store.dispatch('updateProgress');
        },
        onStartNewTrack() {
          ctx.$store.dispatch('startNewTrack');
        },
        onEnded() {
          ctx.$store.dispatch('trackEnded');
        }
      });

      this.$store.dispatch('loadPlayer', player);
    },
    computed: {
      concertDate() {
        if (this.currentTrack) {
          return moment(this.currentTrack.concert.date);
        }

        return moment();
      },
      currentTrack() {
        return this.$store.state.currentTrack;
      },
      currentTime() {
        return this.$store.state.currentTime;
      },
      duration() {
        return this.$store.state.duration;
      },
      progressAsPercent() {
        return 100 * (this.currentTime / this.duration);
      },
      volume() {
        return this.$store.state.volume;
      },
      isPaused() {
        return this.$store.state.isPaused;
      },
    },
    filters: {
      toDate(value) {
        return moment(value).format('YYYY-MM-DD');
      },
      toDuration(value) {
        if (value > 60) {
          return moment.duration(value, 'seconds').format('m:ss');
        }

        return moment.duration(value, 'seconds').format('0:ss');
      }
    },
    methods: {
      togglePlayPause() {
        this.$store.dispatch('togglePlayPause');
      },
      playPrevious() {
        this.$store.dispatch('playPrevious');
      },
      playNext() {
        this.$store.dispatch('playNext');
      },
    },
  }
</script>
