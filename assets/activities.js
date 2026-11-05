/* Learning activities use native controls and local, fictional examples only. */
(function () {
  'use strict';
  function permissionIssues(scope, role, duration) {
    var issues = [];
    if (scope !== 'project') issues.push('Limita el alcance a la carpeta del proyecto.');
    if (role !== 'read') issues.push('La tarea descrita necesita lectura, no edición ni administración.');
    if (duration === 'unlimited') issues.push('Acuerda una fecha de fin: el ejemplo requiere catorce días.');
    else if (duration !== '14') issues.push('La vigencia es menor que la tarea del ejemplo; coordina su duración o una renovación aprobada.');
    return issues;
  }
  function pipelineState(brief, review, test) {
    return { stages: [brief ? 'Tarea delimitada' : 'Entrada sin delimitar', 'Borrador de IA', review ? 'Revisión humana' : 'Sin revisión humana', test ? 'Validación realizada' : 'Sin validación'], complete: brief && review && test };
  }
  function releaseState(logs, rollback) {
    return { count: Number(logs) + Number(rollback), title: logs && rollback ? 'Dos evidencias para revisar con el equipo' : 'Explora las evidencias del ejemplo' };
  }
  window.DominionActivities = { permissionIssues: permissionIssues, pipelineState: pipelineState, releaseState: releaseState };
  function initActivity(root) {
    var config = {};
    try { config = JSON.parse(root.querySelector('[data-activity-config]').textContent); }
    catch (e) { return; }
    var kind = root.dataset.activity;
    var live = root.querySelector('[data-activity-live]');
    var ui = root.querySelector('[data-activity-ui]');
    function el(selector) { return root.querySelector(selector); }
    function all(selector) { return Array.from(root.querySelectorAll(selector)); }
    function text(selector, value) { var node = el(selector); if (node) node.textContent = value; }
    function checked(key) { var node = el('[data-toggle="' + key + '"]'); return !!(node && node.checked); }
    function value(key) { return el('[data-select="' + key + '"]').value; }
    function announce(message) { if (live) live.textContent = message; }
    function sound() { if (window.DominionExperience) window.DominionExperience.play('step'); }
    var reset = function () {};
    if (kind === 'explore') {
      var cards = all('[data-explore]');
      cards.forEach(function (button) {
        button.addEventListener('click', function () {
          var index = Number(button.dataset.explore), item = config.items[index];
          if (!item) return;
          cards.forEach(function (card) { card.setAttribute('aria-pressed', String(card === button)); });
          text('[data-preview-title]', item.title);text('[data-preview-text]', item.text);text('[data-preview-rule]', item.rule);
          announce(item.title + '. ' + item.text + ' ' + item.rule);sound();
        });
      });
      reset = function () {
        cards.forEach(function (card) { card.setAttribute('aria-pressed', 'false'); });
        text('[data-preview-title]', 'Elige un elemento para explorar');text('[data-preview-text]', 'Puedes recorrer todos los elementos y volver a abrirlos.');text('[data-preview-rule]', '');
      };
    } else if (kind === 'sequence') {
      var current = 0;
      var stops = all('[data-sequence]');
      function show(index, notify) {
        current = Math.max(0, Math.min(config.steps.length - 1, index));
        var step = config.steps[current];
        stops.forEach(function (button, i) { button.setAttribute('aria-current', i === current ? 'step' : 'false'); });
        text('[data-sequence-count]', 'Etapa ' + (current + 1) + ' de ' + config.steps.length);
        text('[data-sequence-title]', step.title);text('[data-sequence-text]', step.text);
        el('[data-sequence-prev]').disabled = current === 0;
        el('[data-sequence-next]').disabled = current === config.steps.length - 1;
        if (notify) announce('Etapa ' + (current + 1) + '. ' + step.title + '. ' + step.text);
      }
      stops.forEach(function (button, i) { button.addEventListener('click', function () { show(i, true); }); });
      el('[data-sequence-prev]').addEventListener('click', function () { show(current - 1, true); });
      el('[data-sequence-next]').addEventListener('click', function () { show(current + 1, true); });
      reset = function () { show(0, false); };
    } else if (kind === 'redact') {
      function redact(notify) {
        var parts = config.parts.map(function (part) { return checked(part.key) ? part.replacement : part.original; });
        text('[data-redacted]', 'Revisa la cláusula de ' + parts[0] + '. ' + parts[1] + '. ' + parts[2] + '.');
        var count = config.parts.filter(function (part) { return checked(part.key); }).length;
        var status = count + ' de 3 transformaciones aplicadas. ' + (count === 3 ? 'Falta revisar el contexto y la autorización antes de compartir.' : 'Observa qué detalles del ejemplo aún quedan visibles.');
        text('[data-redact-status]', status);
        if (notify) announce(el('[data-redacted]').textContent + ' ' + status);
      }
      all('[data-toggle]').forEach(function (control) { control.addEventListener('change', function () { redact(true); }); });
      reset = function () { all('[data-toggle]').forEach(function (c) { c.checked = false; });redact(false); };
    } else if (kind === 'pipeline') {
      function pipeline(notify) {
        var state = pipelineState(checked('brief'), checked('review'), checked('test'));
        var list = el('[data-pipeline]');list.textContent = '';
        state.stages.forEach(function (stage) { var li = document.createElement('li');li.textContent = stage;list.appendChild(li); });
        var title = state.complete ? 'El ejemplo incluye revisión y validación' : 'El recorrido todavía tiene etapas por resolver';
        var detail = state.complete ? 'La persona responsable puede evaluar el resultado con la evidencia de la tarea. No equivale a una aprobación automática.' : 'Observa el flujo: la generación del borrador no reemplaza delimitar la tarea, revisar el contenido ni validar su uso.';
        text('[data-pipeline-title]', title);text('[data-pipeline-text]', detail);
        if (notify) announce(state.stages.join('. ') + '. ' + title);
      }
      all('[data-toggle]').forEach(function (control) { control.addEventListener('change', function () { pipeline(true); }); });
      reset = function () { all('[data-toggle]').forEach(function (c) { c.checked = false; });pipeline(false); };
    } else if (kind === 'words') {
      var count = 2, example = 0;
      function words(notify) {
        var selected = config.examples[example].slice(0, count), phrase = selected.join(' ');
        var holder = el('[data-words]');holder.textContent = '';
        selected.forEach(function (word) { var span = document.createElement('span');span.textContent = word;holder.appendChild(span); });
        var detail = count + (count === 1 ? ' palabra · ' : ' palabras · ') + phrase.length + ' caracteres, incluidos los espacios. Ejemplo público: no lo uses como contraseña.';
        text('[data-word-count]', detail);
        el('[data-word-add]').disabled = count === 6;el('[data-word-remove]').disabled = count === 1;
        if (notify) announce(phrase + '. ' + detail);
      }
      el('[data-word-add]').addEventListener('click', function () { count = Math.min(6, count + 1);words(true); });
      el('[data-word-remove]').addEventListener('click', function () { count = Math.max(1, count - 1);words(true); });
      el('[data-word-refresh]').addEventListener('click', function () { example = (example + 1) % config.examples.length;words(true); });
      reset = function () { count = 2;example = 0;words(false); };
    } else if (kind === 'permissions') {
      function permissions(notify) {
        var issues = permissionIssues(value('scope'), value('role'), value('duration'));
        var title = issues.length ? 'Propuesta por ajustar' : 'Propuesta ajustada a esta tarea';
        text('[data-permission-title]', title);
        text('[data-permission-text]', issues.length ? issues.join(' ') : 'Lectura de la carpeta del proyecto durante catorce días. Envía la propuesta por el proceso de aprobación interno antes de conceder el acceso.');
        text('[data-permission-detail]', 'Cambios de alcance, función o duración requieren revisar de nuevo la necesidad.');
        if (notify) announce(title + '. ' + el('[data-permission-text]').textContent);
      }
      all('[data-select]').forEach(function (control) { control.addEventListener('change', function () { permissions(true); }); });
      reset = function () { all('[data-select]').forEach(function (control) { control.selectedIndex = 0; });permissions(false); };
    } else if (kind === 'repo') {
      function repo(notify) {
        text('[data-code-secret]', checked('secret') ? 'API_KEY = gestorAprobado.obtener("API_KEY")  // pseudocódigo' : 'API_KEY = "[SECRETO_FICTICIO_DE_EJEMPLO]"');
        text('[data-code-dependency]', checked('dependency') ? 'Dependencia de ejemplo: versión y licencia revisadas' : 'Dependencia de ejemplo: revisión de versión y licencia pendiente');
        text('[data-code-scan]', checked('scan') ? 'Proceso de cambios: incluye detección de secretos' : 'Proceso de cambios: sin detección de secretos en este ejemplo');
        var count = ['secret','dependency','scan'].filter(checked).length;
        text('[data-repo-title]', count + ' de 3 mejoras incorporadas');
        var detail = checked('secret') ? 'El valor ya no aparece incrustado en esta vista. Si una credencial real estuvo expuesta, también hay que gestionar su revocación o rotación.' : 'La vista todavía incluye un valor que representa un secreto. Evita incluir credenciales reales en el código o el repositorio.';
        text('[data-repo-text]', detail);if (notify) announce(count + ' de 3 mejoras. ' + detail);
      }
      all('[data-toggle]').forEach(function (control) { control.addEventListener('change', function () { repo(true); }); });
      reset = function () { all('[data-toggle]').forEach(function (c) { c.checked = false; });repo(false); };
    } else if (kind === 'release') {
      function release(notify) {
        var logs = el('[data-release-evidence="logs"]').getAttribute('aria-pressed') === 'true', rollback = el('[data-release-evidence="rollback"]').getAttribute('aria-pressed') === 'true', state = releaseState(logs, rollback);
        all('[data-evidence-panel]').forEach(function (panel) { panel.hidden = panel.dataset.evidencePanel === 'logs' ? !logs : !rollback; });
        text('[data-release-logs]', logs ? 'Ejemplo de registros explorado' : 'Por explorar: revisión de registros');
        text('[data-release-rollback]', rollback ? 'Ejemplo de reversión explorado' : 'Por explorar: prueba de reversión');
        el('[data-release-logs]').dataset.complete = String(logs);el('[data-release-rollback]').dataset.complete = String(rollback);
        text('[data-release-title]', state.title);
        var detail = state.count === 2 ? 'Ya puedes comparar las dos evidencias del ejemplo. En un caso real, el equipo responsable debe revisar su suficiencia y autorizar la decisión.' : 'Explora ambos ejemplos para ver qué evidencia conviene revisar. Abrir un ejemplo no ejecuta una prueba real.';
        text('[data-release-text]', detail);if (notify) announce(state.title + '. ' + detail);
      }
      all('[data-release-evidence]').forEach(function (control) { control.addEventListener('click', function () { control.setAttribute('aria-pressed', control.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');release(true); }); });
      reset = function () { all('[data-release-evidence]').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });release(false); };
    }
    var resetButton = el('[data-activity-reset]');
    if (resetButton) resetButton.addEventListener('click', function () { reset();announce('Actividad reiniciada. Puedes volver a explorar.'); });
    reset();ui.hidden = false;
  }
  function init() {
    document.querySelectorAll('[data-activity]').forEach(initActivity);
    document.querySelectorAll('[data-show-result]').forEach(function (button) {
      button.addEventListener('click', function () {
        var root = button.closest('[data-activity],[data-lab]');
        var target = root && root.querySelector(button.dataset.showResult);
        if (!target) return;
        target.setAttribute('tabindex', '-1');
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
        target.focus({ preventScroll: true });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
