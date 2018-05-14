import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';
import player from '../plugins/player';

const store = () => {
  return new Vuex.Store({
    state: {
      queue: [],
      history: [],
      currentTrack: null,
      currentTime: 0,
      duration: 0,
    },
    mutations: {
      clearQueue(state) {
        Vue.set(state.queue, []);
        // Retain play history with player queue, but remove all non-played songs
        player.tracks.length = player.state.currentTrackIdx;
      },
      queue(state, tracks) {
        for (const track of tracks) {
          state.queue.push(track);
          player.addTrack({
            trackUrl: track.url_high || track.url_low,
            metadata: track,
          });
        }
      },
      startNewTrack(state, playHistory) {
        Vue.set(state.history, playHistory);
        Vue.set(state.currentTrack, player.currentTrack ? player.currentTrack.metadata : null);
      },
      updateProgress(state) {
        if (player.currentTrack) {
          Vue.set(state.currentTrack, player.currentTrack.metadata);
          Vue.set(state.currentTime, player.currentTrack.currentTime);
          Vue.set(state.duration, player.currentTrack.duration);
        } else {
          Vue.set(state.currentTrack, null);
          Vue.set(state.currentTime, 0);
          Vue.set(state.duration, 0);
        }
      },
    },
    actions: {
      async clearQueue(context) {
        context.commit('clearQueue');
      },
      async queue(context, tracks) {
        if (Array.isArray(tracks)) {
          context.commit('queue', tracks);
        } else {
          context.commit('queue', [tracks]);
        }
      },
      async togglePlayPause() {
        player.togglePlayPause();
      },
      async playNext() {
        player.playNext();
      },
      async playPrevious(context) {
        // Less than 3 seconds, then play previous
        if (context.state.currentTime < 3) {
          player.playPrevious();
        } else {
          context.dispatch('seek');
        }
      },
      async seek(context, to) {
        if (player.currentTrack) {
          player.currentTrack.seek(to);
        }
      },
      async setVolume(context, volume) {
        context.commit('setVolume', volume);
      },
      /**
       * This action should only be fired from the player
       * @param context
       * @returns {Promise<void>}
       */
      async updateProgress(context) {
        context.commit('updateProgress');
      },
      /**
       * This action should only be fired from the player
       * @param context
       * @param track - Player Track object representing track being played
       * @returns {Promise<void>}
       */
      async startNewTrack(context, track) {
        const playHistory = await axios.get('/api/tracks/trackplay', {
          params: {
            maxResults: 30,
          },
        });

        context.commit('startNewTrack', playHistory);
      },
    },
  });
};

export default store;
