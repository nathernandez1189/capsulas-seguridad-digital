/* Explicit playback controls and page-rendered captions for mobile consistency. */
(function () {
  'use strict';
  function init() {
    document.querySelectorAll('[data-learning-video]').forEach(function (card) {
      var video = card.querySelector('video');
      var cueData = card.querySelector('[data-video-cues]');
      var status = card.querySelector('[data-video-status]');
      var controls = card.querySelector('[data-video-controls]');
      var play = card.querySelector('[data-video-toggle]');
      var captions = card.querySelector('[data-caption-toggle]');
      var captionLine = card.querySelector('[data-video-caption]');
      if (!video || !cueData) return;
      var track, cues = [], captionsEnabled = true, nativeFullscreen = false;
      function message(text) { if (status) status.textContent = text; }
      function syncPlay() {
        if (!play) return;
        play.textContent = video.ended ? 'Volver a reproducir' : video.paused ? 'Reproducir video' : 'Pausar video';
        play.setAttribute('aria-label', play.textContent);
      }
      function drawCaptions() {
        if (!captionLine) return;
        captionLine.hidden = !captionsEnabled;
        if (!captionsEnabled) return;
        var current = cues.filter(function (cue) { return video.currentTime >= cue.start && video.currentTime < cue.end; })[0];
        captionLine.textContent = current ? current.text : video.ended ? 'Fin del video.' : 'Los subtítulos aparecen al reproducir el video.';
      }
      function syncCaptions() {
        if (captions) {
          captions.textContent = captionsEnabled ? 'Subtítulos activados' : 'Subtítulos desactivados';
          captions.setAttribute('aria-pressed', String(captionsEnabled));
        }
        if (track) track.mode = captionsEnabled ? (nativeFullscreen ? 'showing' : 'hidden') : 'disabled';
        drawCaptions();
      }
      try { cues = JSON.parse(cueData.textContent); }
      catch (e) {
        captionsEnabled = false;
        if (captions) { captions.disabled = true; captions.textContent = 'Transcripción disponible debajo'; }
        message('Puedes leer el contenido completo en la transcripción que está debajo del video.');
      }
      // Native tracks remain available when the mobile player opens full screen.
      try {
        track = video.addTextTrack('captions', 'Español', 'es');
        cues.forEach(function (cue) { track.addCue(new VTTCue(cue.start, cue.end, cue.text)); });
      } catch (e) { track = null; }
      if (play) play.addEventListener('click', function () {
        if (!video.paused && !video.ended) { video.pause(); return; }
        if (video.error) video.load();
        if (video.ended) video.currentTime = 0;
        try {
          var attempt = video.play();
          if (attempt && attempt.catch) attempt.catch(function () {
            syncPlay();message('No se pudo iniciar el video. Pulsa Reproducir de nuevo o usa los controles del reproductor.');
          });
        } catch (e) { message('No se pudo iniciar el video. Puedes leer la transcripción o abrir el archivo mediante el enlace de descarga.'); }
      });
      if (captions) captions.addEventListener('click', function () { captionsEnabled = !captionsEnabled;syncCaptions(); });
      video.addEventListener('timeupdate', drawCaptions);
      video.addEventListener('seeked', drawCaptions);
      video.addEventListener('play', function () {
        syncPlay();drawCaptions();
        document.querySelectorAll('[data-learning-video] video').forEach(function (other) { if (other !== video) other.pause(); });
      });
      video.addEventListener('playing', function () { syncPlay();drawCaptions();message(''); });
      video.addEventListener('waiting', function () { message('Cargando video…'); });
      video.addEventListener('pause', function () { syncPlay();if (!video.error) message(''); });
      video.addEventListener('ended', function () { syncPlay();drawCaptions(); });
      video.addEventListener('error', function () {
        syncPlay();message('No se pudo cargar el video. Lee la transcripción o abre el archivo mediante el enlace de descarga.');
      });
      video.addEventListener('webkitbeginfullscreen', function () { nativeFullscreen = true;syncCaptions(); });
      video.addEventListener('webkitendfullscreen', function () { nativeFullscreen = false;syncCaptions(); });
      video.addEventListener('fullscreenchange', function () { nativeFullscreen = !!document.fullscreenElement;syncCaptions(); });
      var step = card.closest('[data-step]');
      if (step) new MutationObserver(function () { if (!step.classList.contains('is-active')) video.pause(); }).observe(step, { attributes: true, attributeFilter: ['class'] });
      syncPlay();syncCaptions();
      if (controls) controls.hidden = false;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
