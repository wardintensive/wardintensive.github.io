/*
  Konfigurasi Portal Ward Intensive
  Ubah link sesuai kebutuhan RS.

  Catatan penting:
  - Dashboard bed pasien internal tetap disarankan berjalan di Google Apps Script.
  - Untuk menampilkan dashboard di halaman SIMRS GitHub Pages, isi APP_SCRIPT_WEBAPP_URL
    dengan URL Web App Apps Script Anda.
*/

window.WARD_CONFIG = {
  hospitalName: "Ward Intensive",
  portalTitle: "Portal Informasi Rawat Inap",
  portalSubtitle: "Portal terintegrasi untuk akses SPO, dokumen akreditasi, formulir, dashboard, dan administrasi pelayanan rawat inap.",
  appScriptWebAppUrl: "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec"
  googleSitesUrl: "https://sites.google.com/view/wardintensive/beranda",
  googleDriveUrl: "", // isi link folder Google Drive internal, bila ada
  quickLinks: [
    { title: "SPO", desc: "Standar prosedur operasional rawat inap", icon: "📘", url: "#" },
    { title: "Dashboard Mutu", desc: "Indikator mutu, BOR, dan monitoring pelayanan", icon: "📊", url: "simrs.html" },
    { title: "Kebijakan & Pedoman", desc: "Dokumen kebijakan, pedoman, dan panduan unit", icon: "📑", url: "#" },
    { title: "Formulir Keperawatan", desc: "Formulir elektronik dan dokumen keperawatan", icon: "📝", url: "#" },
    { title: "Jadwal Shift", desc: "Akses jadwal dinas dan pembagian shift", icon: "🗓️", url: "#" },
    { title: "Register Pasien", desc: "Akses register dan administrasi rawat inap", icon: "🧾", url: "#" }
  ],
  rooms: [
    { name: "Truntum", desc: "Ruang rawat inap Truntum", url: "simrs.html#truntum" },
    { name: "Parang", desc: "Ruang rawat inap Parang", url: "simrs.html#parang" },
    { name: "Nitik", desc: "Ruang rawat inap Nitik", url: "simrs.html#nitik" },
    { name: "Sidomukti", desc: "Ruang rawat inap Sidomukti", url: "simrs.html#sidomukti" },
    { name: "Nifas / Pamiluto", desc: "Ruang nifas dan rawat gabung", url: "simrs.html#nifas" },
    { name: "Perina", desc: "Ruang perinatologi", url: "simrs.html#perina" },
    { name: "ICU", desc: "Intensive Care Unit", url: "simrs.html#icu" },
    { name: "NICU", desc: "Neonatal Intensive Care Unit", url: "simrs.html#nicu" },
    { name: "PICU", desc: "Pediatric Intensive Care Unit", url: "simrs.html#picu" }
  ],
  team: [
    { name: "Kepala Ruang Rawat Inap", role: "Koordinator pelayanan dan mutu rawat inap" },
    { name: "Perawat Penanggung Jawab Shift", role: "Koordinasi operasional harian dan handover pasien" },
    { name: "Admisi / Pendaftaran", role: "Koordinasi ketersediaan bed dan penempatan pasien" },
    { name: "IT / SIMRS", role: "Pemeliharaan dashboard, Google Sheet, dan Apps Script" }
  ]
};
