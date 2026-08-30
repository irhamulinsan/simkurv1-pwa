/* SIMKUR MA'HAD - API layer
 * Semua komunikasi ke backend Google Apps Script (Web App) lewat file ini.
 */

/**
 * URL Web App Google Apps Script hasil deploy.
 * Isi manual, contoh: "https://script.google.com/macros/s/AKfycb.../exec"
 */
const GAS_EXEC_URL = "";

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
