/* SIMKUR MA'HAD - Login page logic (tahap 1)
 * Redirect ke dashboard per-role dikerjakan di tahap berikutnya.
 */

(function () {
  'use strict';

  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');
  const submitBtn = document.getElementById('login-submit');
  const errorBox = document.getElementById('login-error');

  // ---------- Show / hide password ----------

  toggleBtn.addEventListener('click', function () {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    toggleBtn.textContent = show ? 'Sembunyikan' : 'Lihat';
    toggleBtn.setAttribute('aria-pressed', String(show));
    toggleBtn.setAttribute(
      'aria-label',
      show ? 'Sembunyikan password' : 'Tampilkan password'
    );
    passwordInput.focus();
  });

  // ---------- Error helpers ----------

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.hidden = true;
  }

  // ---------- Submit ----------

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginRequest(username, password);

      // Konvensi response GAS: { success: true, token, role, nama }
      //                        atau { success: false, message }
      if (result && result.success) {
        localStorage.setItem('simkur.auth', JSON.stringify({
          token: result.token,
          role: result.role,
          nama: result.nama
        }));

        // Sementara: belum ada redirect ke dashboard.
        alert('Login berhasil, role: ' + result.role);
      } else {
        showError(
          (result && result.message) ||
          'Login gagal. Periksa kembali username dan password.'
        );
      }
    } catch (err) {
      showError('Tidak dapat terhubung ke server. Coba lagi beberapa saat.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Memproses...' : 'Masuk';
  }
})();
