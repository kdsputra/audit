(() => {
  const isManager = document.title.includes('Manajer Investasi');
  const type = isManager ? 'Manajer Investasi' : 'Custodian Bank';
  const subject = isManager ? 'reksadana, unit penyertaan, NAB, transaksi pending, dividen, dan biaya manajemen' : 'saham, obligasi, transaksi pending, pembatasan, kupon, dan biaya manajemen';
  const rowName = isManager ? 'manajer investasi' : 'custodian';
  const back = document.querySelector('.back');
  if (!back || document.getElementById('sharedGuideBtn')) return;

  const css = document.createElement('style');
  css.textContent = `.guide-btn{white-space:nowrap}.shared-guide-overlay{position:fixed;inset:0;background:#0008;z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:.2s;backdrop-filter:blur(5px)}.shared-guide-overlay.show{opacity:1;pointer-events:auto}.shared-guide-card{width:min(720px,100%);max-height:86vh;background:#fff;border-radius:20px;box-shadow:0 20px 50px #0004;display:flex;flex-direction:column;transform:translateY(18px);transition:.2s}.shared-guide-overlay.show .shared-guide-card{transform:none}.shared-guide-head{display:flex;align-items:center;justify-content:space-between;padding:22px 28px;border-bottom:1px solid #e8e8ed}.shared-guide-head h2{font:600 20px/1.2 inherit;margin:0}.shared-guide-close{width:34px;height:34px;border:0;border-radius:50%;background:#e8e8ed;font:22px/1 inherit;cursor:pointer}.shared-guide-body{padding:26px 28px;overflow:auto;font-size:14px;line-height:1.6}.shared-guide-body h3{font-size:16px;margin:22px 0 8px}.shared-guide-body h3:first-child{margin-top:0}.shared-guide-body p{margin:0 0 10px}.shared-guide-body ul{margin:0 0 12px;padding-left:20px}.shared-guide-body li{margin:5px 0}.shared-guide-note{padding:12px 14px;border-left:4px solid #0066cc;background:#f5f5f7;border-radius:0 9px 9px 0}@media(max-width:720px){.guide-btn{flex:1}.shared-guide-head,.shared-guide-body{padding-left:20px;padding-right:20px}}`;
  document.head.appendChild(css);

  const button = document.createElement('button');
  button.id = 'sharedGuideBtn';
  button.className = 'btn ghost guide-btn';
  button.type = 'button';
  button.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 4.8 2.4c-1 .7-1.9 1.2-1.9 2.6"/><path d="M12 18h.01"/></svg>Panduan';
  back.insertAdjacentElement('afterend', button);

  const overlay = document.createElement('div');
  overlay.className = 'shared-guide-overlay';
  overlay.innerHTML = `<div class="shared-guide-card" role="dialog" aria-modal="true" aria-labelledby="sharedGuideTitle"><div class="shared-guide-head"><h2 id="sharedGuideTitle">Panduan Konfirmasi ${type}</h2><button class="shared-guide-close" type="button" aria-label="Tutup">×</button></div><div class="shared-guide-body"><h3>1. Pengaturan umum</h3><p>Isi data klien, tanggal cut-off, KAP, alamat auditor, kontak, tanggal surat, serta format nomor surat.</p><ul><li>Isi satu penandatangan untuk posisi tunggal.</li><li>Isi penandatangan kiri dan kanan untuk dua orang.</li><li>Nilai default dapat ditimpa untuk setiap ${rowName} pada tahap berikutnya.</li></ul><h3>2. Daftar ${type}</h3><p>Tambahkan penerima dengan salah satu cara berikut:</p><ul><li><b>Unggah Excel</b> menggunakan template yang dapat diunduh dari aplikasi.</li><li><b>Tempel Teks</b> yang disalin langsung dari Excel.</li><li><b>Tambah Manual</b> untuk mengisi satu per satu.</li><li><b>Muat Contoh Data</b> untuk melihat format pengisian.</li></ul><div class="shared-guide-note">Nama penerima wajib diisi. Nomor surat, tanggal, serta penandatangan dapat berbeda pada setiap baris.</div><h3>3. Pratinjau surat</h3><p>Pilih salah satu ${rowName} untuk memeriksa surat dan lampiran ${subject}. Pratinjau akan menyesuaikan ukuran layar secara otomatis.</p><h3>4. Buat dan unduh</h3><p>Klik <b>Buat &amp; Unduh Word</b>. Satu penerima menghasilkan satu berkas Word; beberapa penerima dikemas menjadi ZIP. Pantau progress dan status setiap dokumen pada log proses.</p><p>Klik <b>Unduh Confirmation Control (Excel)</b> untuk membuat daftar kontrol dari seluruh ${rowName} yang sudah diinput. Lengkapi status pengiriman, tanggal diterima, PIC, exception, tindak lanjut, dan catatan pada Excel tersebut.</p><h3>Catatan</h3><p>Data hanya diproses selama halaman aplikasi terbuka. Periksa kembali nomor surat, tanggal, nama penerima, alamat, dan penandatangan sebelum mengunduh.</p></div></div>`;
  document.body.appendChild(overlay);
  const close = () => overlay.classList.remove('show');
  button.addEventListener('click', () => overlay.classList.add('show'));
  overlay.querySelector('.shared-guide-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
