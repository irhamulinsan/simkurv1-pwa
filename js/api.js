/* SIMKUR MA'HAD - API layer
 * Semua komunikasi ke backend Google Apps Script (Web App) lewat file ini.
 */

/**
 * URL Web App Google Apps Script hasil deploy.
 * Isi manual, contoh: "https://script.google.com/macros/s/AKfycb.../exec"
 */
const GAS_EXEC_URL = "https://script.google.com/macros/s/AKfycbzq-XjBF4qywmTaNZhn_fS5nAFrcH8SdsanBo33ojnCszdgUmx7oiejnFBXUHqyRENE/exec";

/**
 * Kirim permintaan login ke backend.
 *
 * Catatan penting soal header:
 * Content-Type sengaja "text/plain;charset=utf-8", BUKAN "application/json".
 * Ini membuat request tergolong "simple request" sehingga browser TIDAK
 * mengirim preflight OPTIONS. Google Apps Script Web App tidak menangani
 * preflight CORS dengan baik, jadi ini cara paling aman.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} objek hasil parse JSON dari response GAS
 */
async function loginRequest(username, password) {
  if (!GAS_EXEC_URL) {
    throw new Error('GAS_EXEC_URL belum diisi di js/api.js');
  }

  const response = await fetch(GAS_EXEC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      action: 'login',
      username: username,
      password: password
    })
  });

  if (!response.ok) {
    throw new Error('Server merespons dengan status ' + response.status);
  }

  return response.json();
}

/**
 * Root aplikasi (folder tempat index.html berada), diakhiri "/".
 * Dipakai untuk redirect supaya benar baik di root maupun di dalam /pages/,
 * dan tidak bergantung apakah situs di-host di root domain atau subfolder
 * (GitHub Pages project page: /simkurv1-pwa/).
 */
function appRoot() {
  const path = window.location.pathname;
  const marker = '/pages/';
  const idx = path.indexOf(marker);
  if (idx !== -1) {
    return path.slice(0, idx + 1);
  }
  return path.slice(0, path.lastIndexOf('/') + 1);
}

/** Buang sesi lokal lalu kembali ke halaman login. */
function forceLogout() {
  try {
    localStorage.clear();
  } catch (e) {
    /* abaikan */
  }
  window.location.href = appRoot() + 'index.html';
}

/**
 * Pemanggil generic ke action router doPost di backend GAS.
 *
 * @param {string} action  nama action, mis. "getSantriPerKelas"
 * @param {Object} [params] parameter untuk action tsb
 * @returns {Promise<Object>} objek { success, data } atau { success:false, message }
 */
async function apiCall(action, params) {
  const token = localStorage.getItem('token');

  const res = await fetch(GAS_EXEC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: action, token: token, params: params || {} })
  });

  if (!res.ok) {
    throw new Error('Server merespons dengan status ' + res.status);
  }

  const json = await res.json();

  // Sesi habis / token tidak valid -> paksa login ulang.
  if (
    json &&
    json.success === false &&
    typeof json.message === 'string' &&
    /sesi habis/i.test(json.message)
  ) {
    forceLogout();
  }

  return json;
}
