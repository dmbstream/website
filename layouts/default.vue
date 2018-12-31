<template>
  <div class="body container-layout d-flex flex-column">
    <header class="d-flex flex-row">
      <ul class="head-nav ml-0 mr-4">
        <li><a @click="toggleMenu"><img
          src="//www.gstatic.com/images/icons/material/system/1x/menu_white_24dp.png"
          srcset="//www.gstatic.com/images/icons/material/system/2x/menu_white_24dp.png 2x"
          aria-hidden="true"
        /></a></li>
        <li><nuxt-link to="/"><i class="fas fa-home"></i></nuxt-link></li>
      </ul>

      <form class="search">
        <div class="header_search">
          <input type="text" class="search_text" placeholder="Search for concerts by date, songs, venues...">
          <i class="fas fa-search search_icon"></i>
        </div>
      </form>

      <ul class="head-nav ml-4">
        <li><a href="#"><i class="fas fa-infinity"></i></a></li>
        <li><a href="#" class="profile__nav"><span class="profile"></span></a></li>
      </ul>
    </header>

    <main class="d-flex flex-row flex-nowrap align-items-stretch">
      <nav v-if="showMenu">
        <ul class="navigation">
          <li class="navigation__active"><nuxt-link to="/">Home</nuxt-link></li>
          <li><nuxt-link to="/concerts">Concerts</nuxt-link></li>
          <li><nuxt-link to="/tours">Tours</nuxt-link></li>
          <li class="navigation__sub"><nuxt-link to="/playlists">Playlists</nuxt-link>
            <ul style="display:block">
              <li><a href="/playlists/1/my-ideal-setlist">My Ideal Playlist</a></li>
            </ul>
          </li>
          <li><nuxt-link to="/compilations">Compilations</nuxt-link></li>
          <li><nuxt-link to="/chat">Chat (42)</nuxt-link></li>
        </ul>
      </nav>

      <div class="main-container flex-grow-1 container-fluid mx-0">
        <nuxt/>
      </div>

      <chat/>
    </main>

    <player />
  </div>
</template>

<script>
  import Chat from '~/components/Chat.vue';
  import Player from '~/components/Player.vue';

  export default {
    components: {
      Chat,
      Player,
    },
    data() {
      return {
        showMenu: false,
      };
    },
    head: {
      bodyAttrs: {
        "data-ma-theme": 'blue',
      },
    },
    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
    },
  };
</script>
