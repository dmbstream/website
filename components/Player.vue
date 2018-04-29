<template>
  <footer class="footer">
    <div class="footer__details">
      <div class="footer__details__song">When the world ends</div>
      <div class="footer__details__song">d+t :: 2016-02-14</div>
    </div>
    <div class="footer__player">
      <div class="footer__player__controls">
        <button class="control-button control-button--active footer__player__controls__secondary" title="Enable shuffle"><i class="zmdi zmdi-shuffle"></i></button>
        <button class="control-button control-button--disabled" title="Previous"><i class="zmdi zmdi-skip-previous"></i></button>
        <button class="control-button control-button--play control-button--circled" title="Play"><i class="zmdi zmdi-play"></i></button>
        <button class="control-button" title="Next"><i class="zmdi zmdi-skip-next"></i></button>
        <button class="control-button footer__player__controls__secondary" title="Enable repeat"><i class="zmdi zmdi-repeat"></i></button>
      </div>
      <div class="footer__player__playback">
        <div class="footer__player__playback__progressTime">00:00</div>
        <div class="footer__player__playback__progress">
          <div class="progress">
            <div 
              class="progress-bar" 
              role="progressbar" 
              style="width: 42%" 
              aria-valuenow="50" 
              aria-valuemin="0" 
              aria-valuemax="100"></div>
          </div>
        </div>
        <div class="footer__player__playback__totalTime">06:42</div>
      </div>
    </div>
    <div class="footer__actions">
      <ul>
        <li><a href="#"><i class="zmdi zmdi-playlist-audio zmdi-hc-2x"></i></a></li>
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
                  style="width: 72%" 
                  aria-valuenow="50" 
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
  export default {
    metaInfo: {
      bodyScript: [
        { src: 'https://raw.githubusercontent.com/RelistenNet/gapless.js/master/index.js', async: true, },
      ],
    },
  }
</script>
