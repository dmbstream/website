<template>
  <main :class="['main', {'hide-menu': hideMenu}]">
    <header class="header">
      <ul class="top-nav mr-4">
        <li><a @click="toggleMenu"><img
          src="//www.gstatic.com/images/icons/material/system/1x/menu_white_24dp.png"
          srcset="//www.gstatic.com/images/icons/material/system/2x/menu_white_24dp.png 2x"
          aria-hidden="true"
        /></a></li>
        <li><nuxt-link to="/"><i class="zmdi zmdi-home"></i></nuxt-link></li>
      </ul>

      <form class="search">
        <div class="search__inner">
          <input type="text" class="search__text" placeholder="Search for concerts by date, songs, venues...">
          <i class="zmdi zmdi-search search__helper" data-ma-action="search-close"></i>
        </div>
      </form>
      <ul class="top-nav">
        <li><a href="#">&infin;</a></li>
        <li><a href="#" class="profile__nav"><span class="profile"></span></a></li>
      </ul>
    </header>
    <aside class="sidebar sidebar-menu">
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
    </aside>
    <aside class="sidebar sidebar-right">
      <chat/>
    </aside>

    <nuxt/>

    <player/>
  </main>
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
        hideMenu: true,
      };
    },
    head: {
      bodyAttrs: {
        "data-ma-theme": 'blue',
      },
    },
    methods: {
      toggleMenu() {
        this.hideMenu = !this.hideMenu;
      },
    },
  };
</script>
