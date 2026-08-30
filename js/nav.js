/* SIMKUR MA'HAD - shell tampilan (tahap 4)
 * MURNI TAMPILAN. Tidak menyentuh logic data (apiCall/fetch):
 *  - menandai menu aktif (.snav / .bnv -> class .on) sesuai section yang tampak
 *  - membuka <details> saat menunya diklik
 *  - mengisi nama user di elemen .js-nama (sidebar + topbar)
 *  - menyambungkan tombol [data-logout] ke logout() milik guard.js
 * Di-include SETELAH js/guard.js.
 */
(function () {
  'use strict';

  // --- nama user di shell ---
  if (typeof currentUser === 'function') {
    var nama = currentUser().nama || '';
    [].forEach.call(document.querySelectorAll('.js-nama'), function (el) {
      if (nama) el.textContent = nama;
    });
  }

  // --- tombol keluar tambahan (mis. di topbar) ---
  if (typeof logout === 'function') {
    [].forEach.call(document.querySelectorAll('[data-logout]'), function (btn) {
      btn.addEventListener('click', logout);
    });
  }

  // --- menu aktif + buka details ---
  var links = [].slice.call(document.querySelectorAll('[data-sec]'));
  if (!links.length) return;

  function activate(id) {
    links.forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-sec') === id);
    });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('data-sec');
      activate(id);
      var target = document.getElementById(id);
      if (target && target.tagName === 'DETAILS') target.open = true;
    });
  });

  var ids = [];
  links.forEach(function (a) {
    var id = a.getAttribute('data-sec');
    if (ids.indexOf(id) === -1) ids.push(id);
  });

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    for (var i = 0; i < ids.length; i++) {
      if (visible[ids[i]]) { activate(ids[i]); break; }
    }
  }, { rootMargin: '-40% 0px -50% 0px' });

  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  activate(ids[0]);
})();
