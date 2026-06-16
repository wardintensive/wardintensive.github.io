# Ward Intensive - Versi Premium GitHub Pages

Paket ini berisi desain portal yang sudah dirapikan untuk GitHub Pages.

## File utama

- `index.html` = Beranda portal yang sudah disempurnakan.
- `simrs.html` = Halaman embed Dashboard Bed dari Apps Script.
- `team.html` = Halaman struktur tim internal.
- `config.js` = Tempat mengubah link Apps Script, GDrive, SPO, form admisi, jadwal, dan daftar ruang.
- `assets/app.css` = Desain tampilan.
- `assets/app.js` = Render konten dinamis dari `config.js`.
- `apps-script/` = Backup kode Apps Script dashboard rawat inap.

## Cara upload ke GitHub

1. Extract ZIP.
2. Buka repository `wardintensive.github.io`.
3. Upload semua isi folder ini ke root repository.
4. Jika GitHub meminta replace file, pilih replace.
5. Commit changes.
6. Tunggu 1-5 menit, lalu buka `https://wardintensive.github.io/index.html`.

## Menghubungkan dashboard Apps Script

Buka `config.js`, lalu ganti:

```js
appScriptWebAppUrl: "ISI_URL_WEB_APP_APPS_SCRIPT_ANDA"
```

menjadi URL Web App Google Apps Script yang berakhiran `/exec`.

## Catatan keamanan

Jangan upload Excel penempatan pasien, nama pasien, atau data pasien ke GitHub. GitHub Pages dipakai sebagai portal statis. Data pasien tetap tampil melalui Apps Script dengan akses internal.
