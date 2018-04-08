<template>
  <main class="main">
    <header class="header">
      <div class="header__logo">
        <h1><nuxt-link to="/">DMB</nuxt-link></h1>
      </div>
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
    <aside class="sidebar">
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
    head: {
      bodyAttrs: {
        "data-ma-theme": 'blue',
      },
    },
  };
</script>
