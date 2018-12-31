import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';

const store = () => {
  return new Vuex.Store({
    state: {
      queue: [],
      history: [],
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 60,
      player: null,
      isPaused: true,
      user: null,
      isLoadingChatMessages: true,
      stickyMessage: null,
      activeUsers: [],
      chatMessages: [],
    },
    getters: {
      isAuthenticated(state) {
        return !!state.user;
      },
    },
    mutations: {
      loadPlayer(state, player) {
        Vue.set(state, 'player', player);
      },
      clearQueue(state) {
        Vue.set(state, 'queue', []);
        // Retain play history with player queue, but remove all non-played songs
        state.player.tracks.length = Math.min(state.player.state.currentTrackIdx + 1, state.player.tracks.length);
      },
      queue(state, tracks) {
        for (const track of tracks) {
          state.queue.push(track);
          state.player.addTrack({
            trackUrl: track.url_high || track.url_low,
            metadata: track,
          });
        }
      },
      startNewTrack(state, playHistory) {
        const tracks = state.player.tracks.splice(state.player.state.currentTrackIdx);
        Vue.set(state, 'queue', tracks.map((track) => track.metadata));
        Vue.set(state, 'history', playHistory);
        Vue.set(state, 'currentTrack', state.player.currentTrack ? state.player.currentTrack.metadata : null);
      },
      updateProgress(state) {
        if (state.player.currentTrack) {
          Vue.set(state, 'currentTrack', state.player.currentTrack.metadata);
          Vue.set(state, 'currentTime', state.player.currentTrack.currentTime);
          Vue.set(state, 'duration', state.player.currentTrack.duration);
          Vue.set(state, 'isPaused', state.player.currentTrack.isPaused);
        } else {
          Vue.set(state, 'currentTrack', null);
          Vue.set(state, 'currentTime', 0);
          Vue.set(state, 'duration', 0);
          Vue.set(state, 'isPaused', true);
        }
      },
      togglePlayPause(state) {
        state.player.togglePlayPause();
        if (state.player.currentTrack) {
          Vue.set(state, 'isPaused', state.player.currentTrack.isPaused);
        } else {
          Vue.set(state, 'isPaused', true);
        }
      },
      setVolume(state, volume) {
        state.player.setVolume(volume / 100);
        Vue.set(state, 'volume', volume);
      },
      setIsLoadingChatMessages(state, isLoading) {
        Vue.set(state, 'isLoadingChatMessages', isLoading);
      },
      setStickyMessage(state, stickyMessage) {
        Vue.set(state, 'stickyMessage', stickyMessage);
      },
      setActiveUsers(state, activeUsers) {
        Vue.set(state, 'activeUsers', activeUsers);
      },
      setChatMessages(state, messages) {
        Vue.set(state, 'chatMessages', messages);
      },
    },
    actions: {
      async play(context, tracks) {
        const isPlaying = context.state.player.currentTrack && !context.state.player.currentTrack.isPaused;
        context.state.player.pauseAll();
        context.commit('clearQueue');
        context.commit('queue', tracks);

        if (isPlaying) {
          context.dispatch('playNext');
        } else {
          context.state.player.play();
        }
      },
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
      async loadPlayer(context, player) {
        context.commit('loadPlayer', player);
      },
      async togglePlayPause(context) {
        context.commit('togglePlayPause');
      },
      async playNext(context) {
        context.state.player.playNext();
      },
      async playPrevious(context) {
        // Less than 3 seconds, then play previous
        if (context.state.currentTime < 3) {
          context.state.player.playPrevious();
        } else {
          context.dispatch('seek');
        }
      },
      async seek(context, to) {
        if (context.state.player.currentTrack) {
          context.state.player.currentTrack.seek(to);
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
      async loadChatMessageHistory(context, lastMessageId) {
        try {
          context.commit('setIsLoadingChatMessages', true);
          const chatMessagesResult = await axios.get(`/api/chatmessages/history?lastMessageId=${lastMessageId || ''}`);
          context.commit('setStickyMessage', chatMessagesResult.data.sticky_message);
          context.commit('setActiveUsers', chatMessagesResult.data.active_users || []);
          context.commit('setChatMessages', chatMessagesResult.data.items || []);
          context.commit('setIsLoadingChatMessages', false);
        } catch (ex) {
          // TODO: Do something useful here like show a growl message or exponentially retry
        }
      },
    },
  });
};

export default store;
