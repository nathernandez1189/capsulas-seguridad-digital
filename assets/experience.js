/* Optional feedback and preferences. No audio is started without consent. */
(function () {
  'use strict';
  var key = 'dominion.capsulas.preferences.v1';
  var prefs = { sound: false, motion: 'system' };
  try {
    var saved = JSON.parse(localStorage.getItem(key));
    if (saved) {
      prefs.sound = saved.sound === true;
      prefs.motion = saved.motion === 'reduce' ? 'reduce' : 'system';
    }
  } catch (e) { /* Preferences remain available for this visit. */ }
  // Local-file storage may be isolated per page; carry only UI preferences in links.
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.has('cs_sound')) prefs.sound = params.get('cs_sound') === '1';
    if (params.has('cs_motion')) prefs.motion = params.get('cs_motion') === 'reduce' ? 'reduce' : 'system';
  } catch (e) {}
  var siteRoot;
  try { siteRoot = new URL('../', document.currentScript.src).href; } catch (e) {}
  var report = function () {};
  var context;
  var lastSound = -Infinity;
  var media = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateMotion() {
    document.documentElement.dataset.motion = prefs.motion === 'reduce' || media.matches ? 'reduce' : 'normal';
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(prefs)); } catch (e) {}
    updateMotion();
  }
  function play(kind) {
    if (!prefs.sound || document.hidden) return;
    if (Array.prototype.some.call(document.querySelectorAll('[data-learning-video] video'), function (video) { return !video.paused && !video.ended; })) return;
    var Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!context || context.state === 'closed') context = new Audio();
      var now = context.currentTime;
      if (now - lastSound < 0.16) return;
      lastSound = now;
      var tones = kind === 'complete' ? [523.25, 659.25, 783.99] : kind === 'correct' ? [587.33, 783.99] : kind === 'review' ? [392, 349.23] : [523.25];
      function schedule() {
        if (!prefs.sound || document.hidden) return;
        var start = context.currentTime;
        tones.forEach(function (frequency, i) {
          var oscillator = context.createOscillator();
          var gain = context.createGain();
          var at = start + i * 0.11;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.10, at + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, at + 0.16);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(at);
          oscillator.stop(at + 0.18);
          oscillator.onended = function () { oscillator.disconnect(); gain.disconnect(); };
        });
      }
      if (context.state !== 'running') context.resume().then(function () {
        if (context.state === 'running') { schedule(); report('Señal de audio enviada. Si no la oyes, revisa el volumen y que la pestaña no esté silenciada.'); }
        else report('El navegador mantiene el audio bloqueado. Pulsa de nuevo Probar sonido.');
      }).catch(function () { report('El navegador bloqueó el audio. Revisa el permiso de sonido de esta página y pulsa Probar sonido.'); });
      else { schedule(); report('Señal de audio enviada. Si no la oyes, revisa el volumen y que la pestaña no esté silenciada.'); }
    } catch (e) { report('No se pudo iniciar el sonido en este navegador. Los ejercicios siguen disponibles.'); }
  }
  window.DominionExperience = { play: play };
  updateMotion();
  if (media.addEventListener) media.addEventListener('change', updateMotion);
  function init() {
    var toolbar = document.querySelector('.topbar-in');
    if (!toolbar) return;
    var details = document.createElement('details');
    details.className = 'experience-settings no-print';
    details.innerHTML = '<summary aria-label="Preferencias de sonido y animaciones"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="white"/><circle cx="15" cy="17" r="3" fill="white"/></svg><span>Preferencias</span></summary>' +
      '<div class="experience-panel"><strong>A tu ritmo</strong><label class="sound-option"><input type="checkbox" data-sound> Sonidos de respuesta</label><p>Señales breves y suaves al responder y completar. Sin música de fondo.</p><button type="button" class="btn btn-sm sound-test" data-sound-test>Activar y probar sonido</button><label for="motion-preference">Animaciones</label><select id="motion-preference"><option value="system">Según mi dispositivo</option><option value="reduce">Reducir movimiento</option></select><p>Se respeta siempre la preferencia de movimiento reducido de tu dispositivo.</p><p class="sound-status" role="status" data-preference-status></p></div>';
    toolbar.appendChild(details);
    var sound = details.querySelector('[data-sound]');
    var motion = details.querySelector('select');
    var status = details.querySelector('[data-preference-status]');
    var test = details.querySelector('[data-sound-test]');
    report = function (message) { status.textContent = message; };
    function paintSound() {
      sound.checked = prefs.sound;
      test.textContent = prefs.sound ? 'Probar sonido' : 'Activar y probar sonido';
      report(prefs.sound ? 'Sonido activado. Pulsa Probar sonido para comprobarlo.' : 'Sonido apagado. Pulsa Activar y probar sonido para escucharlo.');
    }
    paintSound();
    if (!(window.AudioContext || window.webkitAudioContext)) {
      sound.disabled = true;
      test.disabled = true;
      report('Tu navegador no ofrece audio para esta página.');
      details.querySelector('.experience-panel p').textContent = 'El sonido no está disponible en este navegador. Puedes usar todos los ejercicios con los mensajes escritos.';
    }
    sound.checked = prefs.sound;
    motion.value = prefs.motion;
    sound.addEventListener('change', function () {
      prefs.sound = sound.checked;
      save();
      if (!prefs.sound && context && context.state === 'running') context.suspend().catch(function () {});
      paintSound();
      lastSound = -Infinity;
      if (prefs.sound) play('correct');
    });
    test.addEventListener('click', function () {
      prefs.sound = true;
      save();
      paintSound();
      lastSound = -Infinity;
      play('complete');
    });
    motion.addEventListener('change', function () { prefs.motion = motion.value; save(); status.textContent = 'Preferencia de animaciones actualizada'; });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && details.open) { details.open = false; details.querySelector('summary').focus(); }
    });
    document.addEventListener('click', function (event) { if (!details.contains(event.target)) details.open = false; });
  }
  function carryPreferences(event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || !siteRoot) return;
    try {
      var url = new URL(link.href, window.location.href);
      if (!url.href.startsWith(siteRoot) || !url.pathname.endsWith('.html')) return;
      url.searchParams.set('cs_sound', prefs.sound ? '1' : '0');
      url.searchParams.set('cs_motion', prefs.motion);
      link.href = url.href;
    } catch (e) {}
  }
  document.addEventListener('click', carryPreferences, true);
  document.addEventListener('auxclick', carryPreferences, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
