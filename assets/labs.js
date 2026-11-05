/* Small simulations: no network, personal data or timed interactions. */
(function () {
  'use strict';
  function accessFor(person, login, permission) {
    if (login && person === 'anonymous') return { allowed: false, reason: 'La persona no ha iniciado sesión. El primer control detiene este intento.' };
    if (permission && person !== 'owner') return { allowed: false, reason: person === 'anonymous' ? 'No hay una identidad verificada con permiso sobre este documento.' : 'Bruno tiene sesión, pero este documento pertenece a Ana y no tiene permiso para abrirlo.' };
    return { allowed: true, reason: person === 'owner' ? 'Ana es la propietaria del documento. Su acceso es el esperado en este ejemplo.' : person === 'anonymous' ? 'El documento queda visible sin verificar identidad ni permiso.' : 'Bruno puede abrir un documento ajeno porque falta comprobar el permiso sobre ese archivo.' };
  }
  window.DominionLabs = { accessFor: accessFor };
  function signal(kind) { if (window.DominionExperience) window.DominionExperience.play(kind); }
  function initDesk(root) {
    var items = [
      { title: 'Lo que compartes en la reunión', why: 'Al compartir toda la pantalla también puedes mostrar mensajes y documentos que no forman parte de la reunión.', action: 'Compartir solo la presentación', safe: 'Solo la ventana de la presentación', note: 'Compartir una ventana reduce la exposición. Comprueba también qué contiene esa ventana.' },
      { title: 'El enlace de la carpeta', why: 'Un enlace abierto puede circular fuera del grupo previsto. Tener la dirección no debería bastar para ver los archivos.', action: 'Restringir el enlace al equipo', safe: 'Solo las personas autorizadas del equipo', note: 'El acceso queda limitado en este ejemplo. Revisa los destinatarios y la vigencia según el procedimiento interno.' },
      { title: 'Las notificaciones visibles', why: 'Una vista previa puede exponer un código o un mensaje privado durante una reunión.', action: 'Ocultar las vistas previas', safe: 'Vistas previas ocultas durante la reunión', note: 'Ocultar la vista previa evita mostrar este contenido en pantalla. Nunca compartas códigos de acceso.' },
      { title: 'El documento abierto', why: 'Un listado de clientes no es necesario para esta presentación. Aunque no lo estés usando, puede quedar a la vista al cambiar de ventana.', action: 'Cerrar el documento ajeno a la reunión', safe: 'Documento cerrado antes de presentar', note: 'Cerrar lo que no necesitas reduce la exposición accidental. Comparte información solo por los canales aprobados.' }
    ];
    var selected = -1, fixed = new Set();
    var tiles = Array.from(root.querySelectorAll('[data-inspect]'));
    var heading = root.querySelector('[data-inspect-title]');
    var text = root.querySelector('[data-inspect-text]');
    var action = root.querySelector('[data-protect]');
    var count = root.querySelector('[data-inspect-count]');
    var progress = root.querySelector('progress');
    var feedback = root.querySelector('.inspection-feedback');
    var feedbackHome = feedback && feedback.parentNode;
    var feedbackNext = feedback && feedback.nextSibling;
    var smallScreen = window.matchMedia('(max-width: 560px)');
    function placeFeedback() {
      if (!feedback || !feedbackHome) return;
      if (smallScreen.matches && selected >= 0) {
        if (tiles[selected].nextElementSibling !== feedback) tiles[selected].insertAdjacentElement('afterend', feedback);
        feedback.classList.add('is-inline');
      } else {
        if (feedback.parentNode !== feedbackHome || feedback.nextSibling !== feedbackNext) feedbackHome.insertBefore(feedback, feedbackNext);
        feedback.classList.remove('is-inline');
      }
    }
    if (smallScreen.addEventListener) smallScreen.addEventListener('change', placeFeedback);

    function select(index, reveal) {
      selected = index;
      var item = items[index], secured = fixed.has(index);
      tiles.forEach(function (tile, i) { tile.setAttribute('aria-pressed', String(i === index)); });
      heading.textContent = item.title;
      text.textContent = secured ? item.note : item.why;
      action.disabled = false;
      action.setAttribute('aria-disabled', String(secured));
      action.textContent = secured ? 'Protección aplicada' : item.action;
      placeFeedback();
      if (reveal && smallScreen.matches && feedback) feedback.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
    tiles.forEach(function (tile, index) { tile.addEventListener('click', function () { select(index, true); }); });
    action.addEventListener('click', function () {
      if (selected < 0 || fixed.has(selected)) return;
      fixed.add(selected);
      var tile = tiles[selected];
      tile.classList.add('is-protected');
      tile.querySelector('[data-tile-detail]').textContent = items[selected].safe;
      tile.querySelector('[data-tile-state]').textContent = 'Protección aplicada';
      tile.setAttribute('aria-label', items[selected].title + '. Protección aplicada. Revisar explicación.');
      progress.value = fixed.size;
      count.textContent = fixed.size + ' de 4 protecciones aplicadas';
      select(selected);
      if (fixed.size === 4) {
        heading.textContent = 'Revisión completada';
        text.textContent = 'Aplicaste las cuatro protecciones del ejemplo. Antes de tu próxima reunión, revisa qué compartes, quién puede acceder y qué queda visible.';
      }
      signal(fixed.size === 4 ? 'complete' : 'correct');
    });
    var initial = tiles.map(function (tile) { return { detail: tile.querySelector('[data-tile-detail]').textContent, label: tile.getAttribute('aria-label') }; });
    root.querySelector('[data-reset-lab]').addEventListener('click', function () {
      selected = -1; fixed.clear(); progress.value = 0; placeFeedback();
      count.textContent = '0 de 4 protecciones aplicadas';
      tiles.forEach(function (tile, i) {
        tile.classList.remove('is-protected');tile.setAttribute('aria-pressed', 'false');tile.setAttribute('aria-label', initial[i].label);
        tile.querySelector('[data-tile-detail]').textContent = initial[i].detail;
        tile.querySelector('[data-tile-state]').textContent = 'Por revisar';
      });
      heading.textContent = 'Elige un elemento del escritorio';
      text.textContent = 'Explora una tarjeta para descubrir qué puedes proteger. El ejemplo se ha reiniciado.';
      action.textContent = 'Selecciona un elemento';action.disabled = true;action.setAttribute('aria-disabled', 'true');
    });
    root.querySelector('[data-lab-ui]').hidden = false;
  }
  function initAccess(root) {
    var person = root.querySelector('[data-person]');
    var login = root.querySelector('[data-access-login]');
    var permission = root.querySelector('[data-access-permission]');
    var result = root.querySelector('[data-access-result]');
    var title = root.querySelector('[data-access-title]');
    var reason = root.querySelector('[data-access-reason]');
    var preview = root.querySelector('[data-document-preview]');
    var live = root.querySelector('[data-access-live]');
    var name = root.querySelector('[data-person-name]');
    function paint(announce) {
      var state = accessFor(person.value, login.checked, permission.checked);
      title.textContent = state.allowed ? 'Acceso permitido' : 'Acceso bloqueado';
      reason.textContent = state.reason;
      result.dataset.allowed = state.allowed ? 'yes' : 'no';
      preview.hidden = !state.allowed;
      name.textContent = person.options[person.selectedIndex].text;
      root.querySelector('[data-login-state]').textContent = login.checked ? 'Sesión exigida' : 'Sin comprobar sesión';
      root.querySelector('[data-permission-state]').textContent = permission.checked ? 'Permiso del archivo comprobado' : 'Sin comprobar permiso';
      if (announce) live.textContent = title.textContent + '. ' + state.reason;
    }
    [person,login,permission].forEach(function (control) { control.addEventListener('change', function () { paint(true); }); });
    root.querySelector('[data-reset-lab]').addEventListener('click', function () { person.value = 'colleague';login.checked = false;permission.checked = false;paint(true); });
    paint(false);
    var shortcut = root.querySelector('[data-show-result]');
    if (shortcut) shortcut.addEventListener('click', function () {
      result.setAttribute('tabindex', '-1');
      result.scrollIntoView({ block: 'start', behavior: 'auto' });
      result.focus({ preventScroll: true });
    });
    root.querySelector('[data-lab-ui]').hidden = false;
  }
  function init() {
    document.querySelectorAll('[data-lab="desk"]').forEach(initDesk);
    document.querySelectorAll('[data-lab="access"]').forEach(initAccess);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
