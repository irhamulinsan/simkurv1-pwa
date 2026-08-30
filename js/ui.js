/* SIMKUR MA'HAD - helper UI bersama (tahap 3)
 * Di-include SETELAH js/api.js, SEBELUM js/guard.js, di tiap halaman dashboard.
 */

/** Escape teks supaya aman dimasukkan sebagai innerHTML. */
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

/** Tampilkan satu baris pesan status di dalam container (mengganti isinya). */
function sectionMsg(container, kind, msg) {
  container.innerHTML = '<p class="status-msg ' + kind + '">' + esc(msg) + '</p>';
}

/** Nilai pertama yang ada (bukan null/undefined/"") dari daftar kemungkinan key. */
function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return '';
  for (var i = 0; i < keys.length; i++) {
    var v = obj[keys[i]];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}

/** Array pertama yang cocok: obj sendiri kalau array, atau salah satu field-nya. */
function firstArray(obj, keys) {
  if (Array.isArray(obj)) return obj;
  if (!obj || typeof obj !== 'object') return [];
  for (var i = 0; i < keys.length; i++) {
    if (Array.isArray(obj[keys[i]])) return obj[keys[i]];
  }
  return [];
}

/**
 * Bangun tabel sederhana (scroll horizontal di layar kecil) ke dalam container.
 *
 * @param {Element} container
 * @param {Array<{label:string, key?:string, get?:function}>|null} columns
 *        kalau null -> kolom diturunkan dari key baris pertama
 * @param {Array<Object>} rows
 * @param {string} [emptyMsg]
 */
function buildTable(container, columns, rows, emptyMsg) {
  if (!Array.isArray(rows) || !rows.length) {
    sectionMsg(container, 'info', emptyMsg || 'Belum ada data.');
    return;
  }
  if (!columns) {
    columns = Object.keys(rows[0]).map(function (k) { return { label: k, key: k }; });
  }

  var html = '<div class="table-wrap"><table class="simple"><thead><tr>';
  columns.forEach(function (c) { html += '<th>' + esc(c.label) + '</th>'; });
  html += '</tr></thead><tbody>';

  rows.forEach(function (row) {
    html += '<tr>';
    columns.forEach(function (c) {
      var v = typeof c.get === 'function' ? c.get(row) : row[c.key];
      if (v && typeof v === 'object') v = JSON.stringify(v);
      html += '<td>' + esc(v) + '</td>';
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;
}
