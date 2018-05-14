import Gapless from 'gapless.js'

export default (context) => {
  return new Gapless.Queue({
    onProgress() {
      context.$store.emit('updateProgress');
    },
    onStartNewTrack() {
      context.$store.emit('startNewTrack');
    },
    onEnded() {
      context.$store.emit('trackEnded');
    }
  })
};
