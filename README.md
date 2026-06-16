# Ward Intensive - Portal Informasi Rawat Inap

Paket ini adalah versi GitHub Pages dari portal informasi rawat inap.
Isi portal dibuat sebagai pengganti/pendamping Google Sites:

- Beranda
- SIMRS / Dashboard Rawat Inap
- Team
- Akses cepat dokumen internal
- Link ruang rawat inap

## Struktur file

```text
index.html                  Beranda portal
simrs.html                  Halaman embed dashboard Apps Script
team.html                   Halaman tim
config.js                   Konfigurasi link dan daftar ruang
assets/app.css              Desain tampilan
assets/app.js               Render konten dari config.js
apps-script/Code.gs         Backend dashboard Google Apps Script
apps-script/Index.html      Frontend dashboard Google Apps Script
.nojekyll                   Agar GitHub Pages tidak memproses dengan Jekyll
```

## Cara upload ke GitHub Pages

1. Login ke GitHub.
2. Buat repository baru, misalnya `ward-intensive`.
3. Upload semua file/folder dari paket ini ke repository tersebut.
4. Buka `Settings` → `Pages`.
5. Pada `Build and deployment`, pilih:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Klik `Save`.
7. Tunggu beberapa menit sampai muncul URL GitHub Pages.

URL biasanya menjadi:

```text
https://USERNAME.github.io/ward-intensive/
```

## Menghubungkan dashboard Apps Script

Dashboard bed pasien tetap disarankan berjalan di Google Apps Script karena data berasal dari Google Sheet.

1. Deploy dashboard Apps Script sebagai Web App.
2. Salin URL Web App.
3. Buka file `config.js`.
4. Isi bagian:

```js
appScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbxxxxxxxx/exec"
```

5. Commit/push ulang ke GitHub.
6. Buka halaman `simrs.html`.

## Catatan keamanan internal

Jangan memasukkan data pasien langsung ke file GitHub.
Untuk dashboard yang berisi nama pasien, DPJP, dan keterangan rawat inap, gunakan pembatasan akses pada Apps Script/Google Workspace.
GitHub Pages biasa lebih cocok untuk portal statis, bukan penyimpanan data pasien.
