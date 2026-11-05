/* ==========================================================================
   Dominion · Cápsulas de seguridad digital
   Motor compartido: navegación por pasos, retos interactivos, quiz,
   progreso local y constancia. Sin dependencias externas.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------------------- */
  /* Icons (2px stroke, manual de marca)                                     */
  /* ---------------------------------------------------------------------- */
  var ICONS = {
    shield: '<path d="M12 3 4.5 6v5.2c0 4.4 3 8.4 7.5 9.8 4.5-1.4 7.5-5.4 7.5-9.8V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/>',
    key: '<circle cx="8" cy="15" r="3.5"/><path d="m10.6 12.4 8.1-8.1"/><path d="m15.5 7.5 2 2"/><path d="m17.8 5.2 2 2"/>',
    fingerprint: '<path d="M12 3.5a8.5 8.5 0 0 0-8.5 8.5c0 1.9.6 3.6 1.6 5"/><path d="M20.5 12A8.5 8.5 0 0 0 12 3.5"/><path d="M7 12a5 5 0 0 1 10 0c0 3.5-1.4 6.5-3 8.2"/><path d="M9.6 12a2.4 2.4 0 0 1 4.8 0c0 2.4-.8 4.6-2 6.1"/><path d="M12 12v2"/>',
    eye: '<path d="M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12Z"/><circle cx="12" cy="12" r="3"/>',
    database: '<ellipse cx="12" cy="5.8" rx="7.5" ry="2.8"/><path d="M4.5 5.8v12.4c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.8"/><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m18.5 14 .9 2.6L22 17.5l-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z"/><path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z"/>',
    bot: '<rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M9.5 16.5h5"/>',
    code: '<path d="m8.5 8-5 4 5 4"/><path d="m15.5 8 5 4-5 4"/><path d="m13.5 6-3 12"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 9 3 3-3 3"/><path d="M12.5 15H17"/>',
    git: '<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="12" cy="17.5" r="2.5"/><path d="M9 6.5h6"/><path d="M6.5 9v1.5a3 3 0 0 0 3 3h5"/><path d="M17.5 9v1.5a3 3 0 0 1-3 3"/><path d="M12 13.5v1.5"/>',
    cloud: '<path d="M7.5 18.5h9a4 4 0 0 0 .7-7.9A5.8 5.8 0 0 0 6.4 9.7a4.5 4.5 0 0 0 1.1 8.8Z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 5.5L20 7"/>',
    alert: '<path d="M12 4 3.5 19h17L12 4Z"/><path d="M12 9v4.5"/><circle cx="12" cy="16.6" r=".8" fill="currentColor" stroke="none"/>',
    check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
    'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12.2 2.4 2.4 4.8-5"/>',
    'arrow-right': '<path d="M4.5 12h15"/><path d="m14 6.5 5.5 5.5L14 17.5"/>',
    'arrow-left': '<path d="M19.5 12h-15"/><path d="M10 6.5 4.5 12l5.5 5.5"/>',
    'arrow-up': '<path d="M12 19.5v-15"/><path d="M6.5 10 12 4.5 17.5 10"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
    book: '<path d="M4.5 5.5h5.2c1.3 0 2.3 1 2.3 2.3v11c0-1.3-1-2.3-2.3-2.3H4.5v-11Z"/><path d="M19.5 5.5h-5.2c-1.3 0-2.3 1-2.3 2.3v11c0-1.3 1-2.3 2.3-2.3h5.2v-11Z"/>',
    layers: '<path d="m12 3.5 8 4.2-8 4.2-8-4.2 8-4.2Z"/><path d="m4 12 8 4.2 8-4.2"/><path d="m4 16.2 8 4.2 8-4.2"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3 2.7-4.7 5.5-4.7s4.9 1.7 5.5 4.7"/><path d="M15.5 5.7a3.2 3.2 0 0 1 0 5.9"/><path d="M17 14.6c2 .5 3.2 2 3.6 4.4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.4L3.5 9"/><path d="M3.5 4.5V9H8"/><path d="M4 13a8 8 0 0 0 14.6 4.4l1.9-2.4"/><path d="M20.5 19.5V15H16"/>',
    printer: '<path d="M7 8V4.5h10V8"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 14h10v5.5H7V14Z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.3a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.9-1.1 1.7v.3"/><circle cx="12" cy="16.6" r=".8" fill="currentColor" stroke="none"/>',
    x: '<path d="m6 6 12 12"/><path d="m18 6-12 12"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v4a3.5 3.5 0 0 0 3.5 3.5H15"/>',
    bug: '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M9 5.5 7.5 4"/><path d="m15 5.5 1.5-1.5"/><path d="M3.5 12H7"/><path d="M17 12h3.5"/><path d="M4.5 17H7"/><path d="M17 17h2.5"/><path d="M4.5 7H7"/><path d="M17 7h2.5"/>',
    file: '<path d="M13.5 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9.5l-6-6Z"/><path d="M13.5 3.5v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    siren: '<path d="M6 18.5v-5a6 6 0 0 1 12 0v5"/><path d="M4 18.5h16"/><path d="M12 4.5V3"/><path d="m5.2 7.2-1-1"/><path d="m18.8 7.2 1-1"/><path d="M9.5 18.5v-5a2.5 2.5 0 0 1 5 0v5"/>',
    scan: '<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M4 12h16"/>',
    scale: '<path d="M12 4v16"/><path d="M7 4h10"/><path d="M5 9h14"/><path d="m5 9-2.5 5h5L5 9Z"/><path d="m19 9-2.5 5h5L19 9Z"/><path d="M8 20h8"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    bolt: '<path d="M13 3 5.5 13.5H11l-1 7.5 7.5-10.5H12l1-7.5Z"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || ICONS.shield;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.dataset.iconDone) return;
      el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon));
      el.dataset.iconDone = '1';
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Storage                                                                */
  /* ---------------------------------------------------------------------- */
  var KEY = 'dominion.capsulas.v1';
  var store = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    },
    write: function (data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); }
      catch (e) { /* modo privado: seguimos sin persistir */ }
    },
    get: function (id) {
      return this.read().capsules ? this.read().capsules[id] : null;
    },
    update: function (id, patch) {
      var data = this.read();
      data.capsules = data.capsules || {};
      data.capsules[id] = Object.assign({}, data.capsules[id] || {}, patch, { updated: Date.now() });
      data.last = id;
      this.write(data);
      return data.capsules[id];
    },
    last: function () { return this.read().last || null; },
    setLast: function (id) {
      var data = this.read();
      data.last = id;
      this.write(data);
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Small helpers                                                          */
  /* ---------------------------------------------------------------------- */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg, ms) {
    var el = qs('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-visible'); }, ms || 2600);
  }
  function confetti() {
    if (document.documentElement.dataset.motion === 'reduce' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var wrap = document.createElement('div');
    wrap.className = 'confetti';
    wrap.setAttribute('aria-hidden', 'true');
    var colors = ['#005FF9', '#6BA2FB', '#3FD5AE', '#F5A524', '#1824AA', '#FFFFFF'];
    for (var i = 0; i < 70; i++) {
      var bit = document.createElement('i');
      bit.style.left = Math.random() * 100 + 'vw';
      bit.style.background = colors[i % colors.length];
      bit.style.setProperty('--x', (Math.random() * 220 - 110) + 'px');
      bit.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      bit.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
      bit.style.animationDelay = (Math.random() * 0.6) + 's';
      bit.style.opacity = 0.5 + Math.random() * 0.5;
      wrap.appendChild(bit);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 5200);
  }
  function ringSvg(percent, size, cls) {
    var r = 46, c = 2 * Math.PI * r;
    var off = c - (Math.max(0, Math.min(100, percent)) / 100) * c;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle class="track" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="value" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg>';
  }

  /* ---------------------------------------------------------------------- */
  /* Hub                                                                    */
  /* ---------------------------------------------------------------------- */
  function openHelp() {
    ensureHelp();
    var o = qs('.help-overlay');
    if (!o) return;
    o._returnFocus = document.activeElement;
    o.classList.add('is-visible');
    var c = qs('[data-close-help]', o);
    if (c) setTimeout(function () { c.focus(); }, 40);
  }

  function closeHelp() {
    var o = qs('.help-overlay');
    if (!o || !o.classList.contains('is-visible')) return;
    o.classList.remove('is-visible');
    if (o._returnFocus && o._returnFocus.focus) o._returnFocus.focus();
  }

  function toggleHelp() {
    var o = qs('.help-overlay');
    if (o && o.classList.contains('is-visible')) closeHelp(); else openHelp();
  }

  function ensureHelp() {
    if (qs('.help-overlay')) return;
    var wrap = document.createElement('div');
    wrap.className = 'help-overlay';
    wrap.innerHTML = '<div class="help-card" role="dialog" aria-modal="true" aria-label="Atajos de teclado">' +
      '<h3>Atajos de teclado</h3>' +
      '<dl>' +
        '<dt><kbd>1</kbd>–<kbd>9</kbd></dt><dd>Ir a un paso concreto</dd>' +
        '<dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Retroceder o avanzar de paso</dd>' +
        '<dt><kbd>?</kbd></dt><dd>Mostrar u ocultar esta ayuda</dd>' +
        '<dt><kbd>Esc</kbd></dt><dd>Cerrar la ayuda</dd>' +
      '</dl>' +
      '<div style="margin-top:20px;text-align:right"><button class="btn btn-sm" type="button" data-close-help>Cerrar</button></div>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.closest('[data-close-help]')) closeHelp();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = qsa('button, [href], [tabindex]:not([tabindex="-1"])', wrap).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  var TRACKS = {
    datos: { label: 'Datos', icon: 'database', file: '01-datos-que-valen-oro.html' },
    ia: { label: 'IA con criterio', icon: 'sparkles' },
    accesos: { label: 'Accesos', icon: 'key' },
    desarrollo: { label: 'Desarrollo seguro', icon: 'code' }
  };

  function initHub() {
    if (!document.body.classList.contains('hub')) return;
    var cards = qsa('[data-capsule]');
    if (!cards.length) return;
    var total = cards.length;
    var progress = store.read().capsules || {};

    function doneCount() {
      return cards.filter(function (c) { return progress[c.dataset.capsule] && progress[c.dataset.capsule].done; }).length;
    }
    function paint() {
      var done = doneCount();
      var pct = Math.round((done / total) * 100);

      qsa('[data-stat-done]').forEach(function (el) { el.textContent = done; });
      qsa('[data-stat-total]').forEach(function (el) { el.textContent = total; });
      qsa('[data-stat-pct]').forEach(function (el) { el.textContent = pct + '%'; });
      qsa('[data-overall-progress]').forEach(function (el) { el.max = total; el.value = done; });
      qsa('[data-track-block]').forEach(function (route) {
        var routeCards = qsa('[data-capsule]', route);
        var completed = routeCards.filter(function (card) { return progress[card.dataset.capsule] && progress[card.dataset.capsule].done; }).length;
        var count = qs('[data-route-count]', route), bar = qs('[data-route-bar]', route);
        if (count) count.textContent = completed + ' de ' + routeCards.length + ' completadas';
        if (bar) bar.style.width = (routeCards.length ? completed / routeCards.length * 100 : 0) + '%';
      });

      qsa('[data-ring]').forEach(function (el) {
        el.innerHTML = ringSvg(pct) + '<div class="ring-label"><b>' + pct + '%</b><span>Completado</span></div>';
      });

      cards.forEach(function (card) {
        var id = card.dataset.capsule;
        var rec = progress[id];
        var isDone = !!(rec && rec.done);
        card.classList.toggle('is-done', isDone);
        var status = card.querySelector('[data-status]');
        if (status) {
          if (isDone) {
            status.textContent = rec.score != null && rec.total ? 'Completada · ' + rec.score + '/' + rec.total : 'Completada';
            status.classList.add('score-badge');
            status.classList.remove('status-dot');
          } else {
            status.textContent = rec && typeof rec.step === 'number' ? 'En curso' : 'Pendiente';
            status.classList.add('status-dot');
            status.classList.remove('score-badge');
          }
        }
        var go = card.querySelector('.caps-go');
        if (go) { go.innerHTML = icon(isDone ? 'check' : 'arrow-right'); go.dataset.iconDone = '1'; }
        var action = qs('[data-card-action]', card);
        if (action) action.textContent = isDone ? 'Repasar' : (rec && typeof rec.step === 'number' ? 'Continuar' : 'Abrir');
      });

      // Continue banner
      var cont = qs('[data-continue]');
      if (cont) {
        var last = store.last();
        var target = null;
        if (last) {
          var lastCard = cards.filter(function (c) { return c.dataset.capsule === last; })[0];
          if (lastCard && !(progress[last] && progress[last].done)) target = lastCard;
        }
        var next = cards.filter(function (c) { return !(progress[c.dataset.capsule] && progress[c.dataset.capsule].done); })[0];
        if (!target) target = next || cards[0];
        var label = qs('[data-continue-label]', cont);
        var title = qs('[data-continue-title]', cont);
        var link = qs('[data-continue-link]', cont);
        var rec = progress[target.dataset.capsule];
        var continuing = rec && !rec.done;
        if (label) label.textContent = continuing ? 'Continúa donde ibas' : (next ? (done === 0 && !last ? 'Empieza aquí' : 'Siguiente cápsula') : 'Repasa el programa');
        if (title) title.textContent = target.dataset.title || target.textContent.trim();
        if (link) {
          link.href = target.getAttribute('href');
          link.innerHTML = (continuing ? 'Retomar' : 'Abrir') + ' ' + icon('arrow-right');
        }
      }

      // Certificate
      var cert = qs('[data-cert]');
      if (cert) {
        var allDone = done >= total;
        cert.classList.toggle('is-visible', allDone);
        var hint = qs('[data-cert-hint]');
        if (hint) hint.classList.toggle('hide', allDone);
        var nameEl = qs('[data-cert-name]');
        if (nameEl) {
          var saved = '';
          try { saved = localStorage.getItem('dominion.capsulas.name') || ''; } catch (e) {}
          nameEl.textContent = saved || 'Participante';
        }
        var stats = qs('[data-cert-stats]');
        if (stats) {
          var sum = 0, q = 0;
          for (var id in progress) {
            if (progress[id].done) { sum += progress[id].score || 0; q += progress[id].total || 0; }
          }
          stats.innerHTML =
            '<div><b>' + done + '/' + total + '</b><span>Cápsulas</span></div>' +
            '<div><b>' + (q ? sum + '/' + q : '—') + '</b><span>Respuestas correctas</span></div>' +
            '<div><b>' + new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) + '</b><span>Fecha</span></div>';
        }
      }
    }

    // Deep status on cards
    cards.forEach(function (card) {
      var id = card.dataset.capsule;
      var rec = progress[id];
      if (rec && rec.done) {
        var status = card.querySelector('[data-status]');
        if (status) {
          status.textContent = rec.score != null && rec.total ? 'Completada · ' + rec.score + '/' + rec.total : 'Completada';
          status.classList.add('score-badge');
          status.classList.remove('status-dot');
        }
        card.classList.add('is-done');
      }
    });

    // Filters
    var filters = qsa('[data-filter]');
    filters.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('is-active') ? 'true' : 'false');
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        var f = btn.dataset.filter;
        cards.forEach(function (card) {
          var show = f === 'all' || card.dataset.track === f;
          card.classList.toggle('hide', !show);
        });
        qsa('.track').forEach(function (track) {
          var any = qsa('[data-capsule]', track).some(function (c) { return !c.classList.contains('hide'); });
          track.classList.toggle('hide', !any);
          if (any && f !== 'all') track.open = true;
        });
      });
    });

    // Name for certificate
    var nameInput = qs('[data-name-input]');
    if (nameInput) {
      try { nameInput.value = localStorage.getItem('dominion.capsulas.name') || ''; } catch (e) {}
      nameInput.addEventListener('input', function () {
        try { localStorage.setItem('dominion.capsulas.name', nameInput.value.trim()); } catch (e) {}
        var nameEl = qs('[data-cert-name]');
        if (nameEl) nameEl.textContent = nameInput.value.trim() || 'Participante';
      });
    }

    var printBtn = qs('[data-print]');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    var resetBtn = qs('[data-reset]');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (confirm('¿Reiniciar el progreso de todas las cápsulas?')) {
        store.reset();
        location.reload();
      }
    });

    var hubHelp = qs('[data-help]');
    if (hubHelp) hubHelp.addEventListener('click', openHelp);

    paint();
    var recommended = qs('[data-continue-link]');
    var recommendedCard = recommended && cards.filter(function (card) { return card.getAttribute('href') === recommended.getAttribute('href'); })[0];
    if (recommendedCard) { var route = recommendedCard.closest('[data-track-block]'); if (route) route.open = true; }
    hydrateIcons();
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeHelp();
      if (e.key === '?' && !/input|textarea|select/i.test(document.activeElement.tagName)) toggleHelp();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Capsule                                                                */
  /* ---------------------------------------------------------------------- */
  function initCapsule() {
    var body = document.body;
    if (!body.classList.contains('capsule')) return;

    var cfg = {};
    var cfgEl = qs('#capsule-config');
    if (cfgEl) {
      try { cfg = JSON.parse(cfgEl.textContent); } catch (e) { cfg = {}; }
    }
    var id = body.dataset.capsule || cfg.id;
    var title = body.dataset.title || cfg.title || document.title;
    var track = body.dataset.track || cfg.track || 'datos';
    var trackLabel = (TRACKS[track] && TRACKS[track].label) || cfg.trackLabel || 'Seguridad digital';
    var minutes = body.dataset.minutes || cfg.minutes || '';
    var nextFile = body.dataset.nextFile || cfg.next || '../index.html';
    var root = body.dataset.root || '../';

    var steps = qsa('.step', qs('main'));
    if (!steps.length) return;
    var current = 0;
    var maxSeen = 0;

    store.setLast(id);

    /* Topbar */
    var topbar = qs('[data-auto-topbar]');
    if (topbar) {
      topbar.innerHTML =
        '<div class="shell topbar-in">' +
          '<a class="brand" href="' + root + 'index.html" aria-label="Dominion · Seguridad digital, volver al inicio">' +
            '<img src="' + root + 'assets/logo-dominion.png" alt="Dominion">' +
            '<span class="brand-sep"></span><span class="brand-label">Seguridad digital</span>' +
          '</a>' +
          '<div class="topbar-meta">' +
            '<span class="chip chip-blue">' + icon(TRACKS[track] ? TRACKS[track].icon : 'shield') + esc(trackLabel) + '</span>' +
            '<span class="topbar-title">' + esc(title) + '</span>' +
            '<a class="icon-btn" href="' + root + 'index.html" aria-label="Ver todas las cápsulas">' + icon('grid') + '</a>' +
            '<button class="icon-btn" type="button" data-help aria-label="Atajos de teclado">' + icon('help') + '</button>' +
          '</div>' +
        '</div>';
    }

    /* Bottom nav */
    var nav = qs('[data-auto-nav]');
    if (nav) {
      var dots = steps.map(function (s, i) {
        return '<button class="dot" type="button" data-goto="' + i + '" aria-label="Paso ' + (i + 1) + ': ' + (s.dataset.label || '') + '"></button>';
      }).join('');
      nav.innerHTML =
        '<div class="shell step-context" data-step-context aria-hidden="true"></div>' +
        '<div class="shell bottom-in">' +
          '<div class="nav-side">' +
            '<button class="btn btn-ghost btn-sm" type="button" data-prev>' + icon('arrow-left') + ' Atrás</button>' +
          '</div>' +
          '<div class="dots" role="group" aria-label="Pasos de la cápsula">' + dots + '</div>' +
          '<div class="nav-side right">' +
            '<span class="step-label" data-step-label></span>' +
            '<button class="btn btn-sm" type="button" data-next>Continuar ' + icon('arrow-right') + '</button>' +
          '</div>' +
        '</div>';
    }

    var prevBtn = qs('[data-prev]', nav || document);
    var nextBtn = qs('[data-next]', nav || document);
    var stepLabel = qs('[data-step-label]', nav || document);

    var live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    function paintStep(opts) {
      opts = opts || {};
      steps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === current);
        s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      qsa('.dot').forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
        d.classList.toggle('is-done', i < current);
        d.setAttribute('aria-current', i === current ? 'step' : 'false');
      });
      if (prevBtn) prevBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
      if (nextBtn) {
        var isLast = current === steps.length - 1;
        nextBtn.style.display = isLast ? 'none' : '';
        nextBtn.innerHTML = (current === steps.length - 2 ? 'Ir al cierre ' : 'Continuar ') + icon('arrow-right');
      }
      if (stepLabel) stepLabel.textContent = (current + 1) + ' de ' + steps.length;
      var contextLabel = qs('[data-step-context]', nav || document);
      if (contextLabel) contextLabel.textContent = 'Paso ' + (current + 1) + ' de ' + steps.length + ' · ' + (steps[current].dataset.label || '');
      var rail = qs('[data-progress-rail]');
      if (rail) rail.style.width = ((current + 1) / steps.length) * 100 + '%';
      maxSeen = Math.max(maxSeen, current);
      store.update(id, { step: current, totalSteps: steps.length });
      if (!opts.silent) {
        try { history.replaceState(null, '', location.pathname + location.search + (current === 0 ? '' : '#paso-' + (current + 1))); } catch (e) {}
        window.scrollTo({ top: 0, behavior: 'auto' });
        var active = steps[current];
        if (live) live.textContent = 'Paso ' + (current + 1) + ' de ' + steps.length + ': ' + (active.dataset.label || '');
        var h = active.querySelector('h1, h2');
        if (h) {
          h.setAttribute('tabindex', '-1');
          setTimeout(function () { h.focus({ preventScroll: true }); }, 60);
        }
      }
    }

    function goTo(i) {
      if (i < 0 || i >= steps.length) return;
      if (i === current) return;
      current = i;
      if (window.DominionExperience) window.DominionExperience.play('step');
      paintStep();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    qsa('[data-goto]').forEach(function (d) {
      d.addEventListener('click', function () { goTo(parseInt(d.dataset.goto, 10)); });
    });

    document.addEventListener('keydown', function (e) {
      if (/input|textarea|select|video/i.test(document.activeElement.tagName) || document.activeElement.closest('[data-learning-video],[data-lab],[data-activity],.experience-settings')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { next(); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { prev(); }
      if (e.key === 'Home') { goTo(0); }
      if (/^[1-9]$/.test(e.key)) { goTo(parseInt(e.key, 10) - 1); }
      if (e.key === 'End') { goTo(steps.length - 1); }
      if (e.key === '?') toggleHelp();
      if (e.key === 'Escape') closeHelp();
    });

    // Swipe
    var tx = 0, ty = 0, ignoreSwipe = false;
    var main = qs('main');
    main.addEventListener('touchstart', function (e) {
      ignoreSwipe = e.touches.length !== 1 || !!(e.target.closest && e.target.closest('[data-learning-video],[data-lab],[data-activity]'));
      if (ignoreSwipe) return;
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (ignoreSwipe || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });

    // Help overlay
    var help = qs('[data-help]');
    var overlay = qs('.help-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.closest('[data-close-help]')) closeHelp();
      });
    }
    if (help) help.addEventListener('click', openHelp);

    /* ------------------------------------------------------------------ */
    /* Classify widget                                                    */
    /* ------------------------------------------------------------------ */
    qsa('[data-widget="classify"]').forEach(function (widget) {
      var items = qsa('.classify-item', widget);
      var counter = qs('.game-progress', widget);
      qsa('.explain', widget).forEach(function (el) { el.setAttribute('aria-live', 'polite'); });
      var answered = 0, correct = 0;

      items.forEach(function (item) {
        var answer = item.dataset.answer;
        qsa('.classify-btn', item).forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (item.dataset.answered) return;
            item.dataset.answered = '1';
            var picked = btn.dataset.value;
            var ok = picked === answer;
            if (window.DominionExperience) window.DominionExperience.play(ok ? 'correct' : 'review');
            qsa('.classify-btn', item).forEach(function (b) { b.classList.remove('is-picked'); });
            btn.classList.add('is-picked');
            item.classList.add(ok ? 'is-correct' : 'is-wrong');
            var explain = qs('.explain', item);
            if (explain) {
              var label = item.dataset.answerLabel || answer;
              explain.innerHTML = ok
                ? '<strong>Correcto.</strong> ' + (item.dataset.explain || '')
                : '<strong>La respuesta correcta es «' + esc(label) + '».</strong> ' + (item.dataset.explain || '');
            }
            answered++; if (ok) correct++;
            if (counter) counter.textContent = correct + ' de ' + items.length + ' correctos';
            if (answered === items.length) {
              toast(correct === items.length ? 'Clasificación perfecta. Así se protege la información.' : correct + '/' + items.length + ' correctos. Revisa las explicaciones.');
            }
          });
        });
      });
    });

    /* ------------------------------------------------------------------ */
    /* Checklist widget                                                   */
    /* ------------------------------------------------------------------ */
    qsa('[data-widget="checklist"]').forEach(function (widget) {
      var boxes = qsa('input[type="checkbox"]', widget);
      var bar = qs('.check-progress .bar i', widget);
      var out = qs('.check-progress span', widget);
      function paint() {
        var n = boxes.filter(function (b) { return b.checked; }).length;
        boxes.forEach(function (b) {
          var row = b.closest('.check');
          if (row) row.classList.toggle('is-checked', b.checked);
        });
        if (bar) bar.style.width = (n / boxes.length) * 100 + '%';
        if (out) out.textContent = n + ' de ' + boxes.length;
        if (n === boxes.length && boxes.length) toast('Checklist completo. Ya puedes aplicar la cápsula.');
      }
      boxes.forEach(function (b) { b.addEventListener('change', paint); });
      paint();
    });

    /* ------------------------------------------------------------------ */
    /* Scenario widget                                                    */
    /* ------------------------------------------------------------------ */
    qsa('[data-widget="scenario"]').forEach(function (widget) {
      var feedback = qs('.scenario-feedback', widget);
      if (feedback) feedback.setAttribute('aria-live', 'polite');
      qsa('.scenario-btn', widget).forEach(function (btn) {
        btn.addEventListener('click', function () {
          qsa('.scenario-btn', widget).forEach(function (b) { b.classList.remove('is-picked'); });
          btn.classList.add('is-picked');
          var ok = btn.dataset.ok === 'true';
          if (window.DominionExperience) window.DominionExperience.play(ok ? 'correct' : 'review');
          if (feedback) {
            feedback.className = 'scenario-feedback is-visible ' + (ok ? 'ok' : 'no');
            feedback.innerHTML = '<b>' + (ok ? 'Buena decisión.' : 'Ojo: esto abre un riesgo.') + '</b>' + esc(btn.dataset.feedback || '');
          }
          if (ok) toast('Correcto. Sigue con el siguiente paso.');
        });
      });
    });

    /* ------------------------------------------------------------------ */
    /* Password meter                                                     */
    /* ------------------------------------------------------------------ */
    qsa('[data-widget="meter"]').forEach(function (widget) {
      var input = qs('input', widget);
      var bar = qs('.meter-bar i', widget);
      var scoreEl = qs('[data-score]', widget);
      var hint = qs('[data-hint]', widget);
      var checksEl = qs('.meter-checks', widget);
      if (!input) return;

      function evaluate(v) {
        var checks = [
          { k: 'len12', ok: v.length >= 12, t: '12 caracteres o más' },
          { k: 'len16', ok: v.length >= 16, t: '16 caracteres o más' },
          { k: 'mix', ok: /[a-z]/.test(v) && /[A-Z]/.test(v), t: 'Mayúsculas y minúsculas' },
          { k: 'num', ok: /\d/.test(v), t: 'Al menos un número' },
          { k: 'sym', ok: /[^A-Za-z0-9]/.test(v), t: 'Un símbolo' },
          { k: 'common', ok: !/^(123456|password|qwerty|admin|dominion|colombia|hola|clave)/i.test(v) && v.length > 0, t: 'Sin palabras predecibles' }
        ];
        var pts = 0;
        checks.forEach(function (c) { if (c.ok) pts += c.k === 'len16' ? 2 : 1; });
        var max = 7;
        var pct = v ? Math.round((pts / max) * 100) : 0;
        var label = !v ? 'Escribe una contraseña para evaluarla' : pct < 35 ? 'Débil' : pct < 60 ? 'Aceptable' : pct < 85 ? 'Fuerte' : 'Muy fuerte';
        var barColor = pct < 35 ? '#E5484D' : pct < 60 ? '#F5A524' : pct < 85 ? '#005FF9' : '#3FD5AE';
        var textColor = pct < 35 ? '#B4232A' : pct < 60 ? '#8A5A00' : pct < 85 ? '#0047BA' : '#0A7C60';
        if (bar) { bar.style.width = pct + '%'; bar.style.background = barColor; }
        if (scoreEl) { scoreEl.textContent = label; scoreEl.style.color = textColor; }
        if (hint) hint.textContent = pct < 60 ? 'Mejor una frase larga y única que una palabra corta con símbolos.' : 'Bien. Guárdala en el gestor de contraseñas, no en un archivo ni en el chat.';
        if (checksEl) {
          checksEl.innerHTML = checks.map(function (c) {
            return '<li class="' + (c.ok ? 'ok' : 'no') + '">' + icon(c.ok ? 'check-circle' : 'x') + esc(c.t) + '</li>';
          }).join('');
        }
        input.dataset.score = pts;
      }
      input.addEventListener('input', function () { evaluate(input.value); });
      evaluate('');
    });

    /* ------------------------------------------------------------------ */
    /* Quiz                                                               */
    /* ------------------------------------------------------------------ */
    var quizRoot = qs('[data-quiz]');
    var questions = (cfg.questions || []).slice();
    if (quizRoot && questions.length) {
      var qIndex = 0, score = 0, answered = false;
      var qCount = qs('[data-quiz-count]', quizRoot);
      var qScore = qs('[data-quiz-score]', quizRoot);
      var qBar = qs('.quiz-bar i', quizRoot);
      var qText = qs('.quiz-q', quizRoot);
      var qOpts = qs('.quiz-options', quizRoot);
      var qFb = qs('.quiz-feedback', quizRoot);
      if (qFb) qFb.setAttribute('aria-live', 'polite');
      if (qCount) qCount.setAttribute('aria-live', 'polite');
      var qNext = qs('[data-quiz-next]', quizRoot);
      var qResult = qs('.quiz-result', quizRoot);
      var qBody = qs('.quiz-body', quizRoot);

      function renderQ(moveFocus) {
        answered = false;
        var q = questions[qIndex];
        if (qCount) qCount.textContent = 'Pregunta ' + (qIndex + 1) + ' de ' + questions.length;
        if (qScore) qScore.textContent = score + ' correctas';
        if (qBar) qBar.style.width = ((qIndex) / questions.length) * 100 + '%';
        if (qText) qText.textContent = q.q;
        if (moveFocus && qText) { qText.setAttribute('tabindex', '-1'); qText.focus({ preventScroll: true }); }
        if (qFb) { qFb.className = 'quiz-feedback'; qFb.innerHTML = ''; }
        if (qNext) qNext.style.visibility = 'hidden';
        if (qOpts) {
          qOpts.innerHTML = q.options.map(function (opt, i) {
            return '<button class="quiz-opt" type="button" data-i="' + i + '"><span class="key">' + String.fromCharCode(65 + i) + '</span><span>' + esc(opt) + '</span></button>';
          }).join('');
          qsa('.quiz-opt', qOpts).forEach(function (btn) {
            btn.addEventListener('click', function () {
              if (answered) return;
              answered = true;
              var i = parseInt(btn.dataset.i, 10);
              var ok = i === q.a;
              if (window.DominionExperience) window.DominionExperience.play(ok ? 'correct' : 'review');
              if (ok) score++;
              qsa('.quiz-opt', qOpts).forEach(function (b) {
                b.classList.add('is-locked');
                b.setAttribute('aria-disabled', 'true');
                if (parseInt(b.dataset.i, 10) === q.a) b.classList.add('is-correct');
              });
              if (!ok) btn.classList.add('is-wrong');
              if (qScore) qScore.textContent = score + ' correctas';
              if (qFb) {
                qFb.className = 'quiz-feedback is-visible ' + (ok ? 'ok' : 'no');
                qFb.innerHTML = '<b>' + (ok ? 'Correcto. ' : 'Respuesta incorrecta. ') + '</b>' + esc(ok ? (q.ok || '') : (q.no || ''));
              }
              if (qNext) {
                qNext.style.visibility = 'visible';
                qNext.textContent = qIndex === questions.length - 1 ? 'Ver resultado' : 'Siguiente';
              }
            });
          });
        }
      }

      function finish() {
        if (window.DominionExperience) window.DominionExperience.play('complete');
        if (qBody) qBody.style.display = 'none';
        if (qResult) {
          qResult.classList.add('is-visible');
          var pct = Math.round((score / questions.length) * 100);
          var ring = qs('[data-result-ring]', qResult);
          if (ring) {
            var r = 46, c = 2 * Math.PI * r;
            var off = c - (pct / 100) * c;
            ring.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="' + r + '"/><circle class="value" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/></svg><b>' + score + '/' + questions.length + '</b>';
            var val = qs('.value', ring);
            if (val) requestAnimationFrame(function () { val.style.strokeDashoffset = off.toFixed(1); });
          }
          var titleEl = qs('[data-result-title]', qResult);
          var subEl = qs('[data-result-sub]', qResult);
          if (titleEl) { titleEl.textContent = score + ' de ' + questions.length + ' respuestas correctas'; titleEl.setAttribute('tabindex', '-1'); titleEl.focus({ preventScroll: true }); }
          if (subEl) subEl.textContent = 'Guarda la idea principal: ' + (cfg.takeaway || 'seguridad desde el diseño, sin frenar la innovación.') + '';
          var nextLink = qs('[data-result-next]', qResult);
          if (nextLink) {
            nextLink.href = nextFile;
            nextLink.innerHTML = (nextFile.indexOf('../') === 0 ? 'Volver al inicio' : 'Siguiente cápsula') + ' ' + icon('arrow-right');
          }
          var retry = qs('[data-result-retry]', qResult);
          if (retry) retry.onclick = function () {
            qIndex = 0; score = 0;
            qResult.classList.remove('is-visible');
            if (qBody) qBody.style.display = '';
            renderQ(true);
          };
        }
        store.update(id, { done: true, score: score, total: questions.length, step: steps.length });
        if (Math.round((score / questions.length) * 100) >= 75) confetti();
        toast('Cápsula completada. Progreso guardado.');
      }

      if (qNext) qNext.addEventListener('click', function () {
        if (qIndex < questions.length - 1) { qIndex++; renderQ(true); }
        else finish();
      });

      renderQ();
      // Re-render bar when entering quiz step
      var quizStep = quizRoot.closest('.step');
      if (quizStep) {
        var obs = new MutationObserver(function () {
          if (quizStep.classList.contains('is-active')) {
            if (qBar) qBar.style.width = (qIndex / questions.length) * 100 + '%';
          }
        });
        obs.observe(quizStep, { attributes: true, attributeFilter: ['class'] });
      }
    }

    /* ------------------------------------------------------------------ */
    /* Boot                                                               */
    /* ------------------------------------------------------------------ */
    hydrateIcons();

    var savedStep = (store.get(id) || {}).step || 0;
    var m = (location.hash || '').match(/#paso-(\d+)/);
    var start = m ? parseInt(m[1], 10) - 1 : savedStep;
    if (start < 0 || start >= steps.length) start = 0;

    // If the capsule was already completed, start at the beginning to allow review.
    var rec = store.get(id);
    if (rec && rec.done && !m) start = 0;

    current = start;
    paintStep({ silent: true });

  }

  ready(function () {
    hydrateIcons();
    ensureHelp();
    initHub();
    initCapsule();
  });
})();
