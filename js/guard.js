/* SIMKUR MA'HAD - Auth guard (tahap 2)
 * Di-include di setiap halaman dashboard SETELAH js/api.js.
 * Kalau tidak ada token di localStorage -> tendang ke halaman login.
 */

(function () {
  'use strict';

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace(appRoot() + 'index.html');
  }
})();

/** Data sesi user yang sedang login. */
function currentUser() {
  return {
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    nama: localStorage.getItem('nama') || ''
  };
}

/** Keluar: hapus sesi lokal, kembali ke halaman login. */
function logout() {
  try {
    localStorage.clear();
  } catch (e) {
    /* abaikan */
  }
  window.location.replace(appRoot() + 'index.html');
}
