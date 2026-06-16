/* =========================================================
   KONFIGURASI PORTAL WARD INTENSIVE
   Edit link di file ini tanpa perlu mengubah desain halaman.
   Jangan simpan data pasien di file GitHub.
========================================================= */
window.SITE_CONFIG = {
  hospitalName: "Ward Intensive",
  portalTitle: "Portal Kendali Rawat Inap",
  portalSubtitle: "Pusat akses internal untuk dashboard bed, dokumen pelayanan, alur admisi, dan koordinasi ruang rawat inap.",
  appScriptWebAppUrl: https://script.google.com/macros/s/AKfycbyFyxBJXvffelASke-7yfaC7Nhw9KMYQJbNS7s2wsCFUiqHWlUIeolsHiyAQlsZ98H7/exec,
  googleDriveUrl: "#",
  spoUrl: "#",
  formAdmisiUrl: "#",
  jadwalUrl: "#",
  kontakAdmisiUrl: "#",
  akreditasiUrl: "#",
  lastPolicyUpdate: "16 Juni 2026",
  quickLinks: [
    {
      title: "Dashboard Bed",
      desc: "Pantau ketersediaan bed, BOR, pasien masuk, pasien pindah, dan antrian ruang secara real-time.",
      icon: "📊",
      url: "simrs.html",
      cta: "Buka dashboard"
    },
    {
      title: "Pengisian GDrive",
      desc: "Akses folder pengisian data, laporan harian, dan dokumen operasional rawat inap.",
      icon: "📁",
      urlKey: "googleDriveUrl",
      cta: "Buka folder"
    },
    {
      title: "SPO & Alur Pelayanan",
      desc: "Kumpulan SPO, alur admisi, transfer pasien, discharge planning, dan administrasi ruang.",
      icon: "📋",
      urlKey: "spoUrl",
      cta: "Lihat dokumen"
    },
    {
      title: "Form Admisi",
      desc: "Form koordinasi admisi, kebutuhan kamar, pindah ruang, rujukan internal, dan monitoring keterisian bed.",
      icon: "📝",
      urlKey: "formAdmisiUrl",
      cta: "Isi form"
    },
    {
      title: "Jadwal Petugas",
      desc: "Akses jadwal jaga, pembagian tugas, PIC shift, dan informasi koordinasi unit.",
      icon: "🗓️",
      urlKey: "jadwalUrl",
      cta: "Lihat jadwal"
    },
    {
      title: "Tim & Kontak Internal",
      desc: "Daftar peran tim, kontak internal, PIC admisi, ruangan, dan eskalasi operasional.",
      icon: "👥",
      url: "team.html",
      cta: "Lihat tim"
    }
  ],
  rooms: [
    { name: "TRUNTUM", desc: "Ruang rawat inap dewasa / kelas sesuai pengaturan RS", tag: "Rawat Inap" },
    { name: "PARANG", desc: "Monitoring keterisian kamar dan penempatan pasien", tag: "Rawat Inap" },
    { name: "SIDOMUKTI", desc: "Ruang rawat inap dengan pemantauan bed harian", tag: "Rawat Inap" },
    { name: "NITIK", desc: "Ketersediaan kamar dan koordinasi admisi ruang", tag: "Rawat Inap" },
    { name: "NIFAS / PAMILUTO", desc: "Ruang ibu, bayi rawat gabung, dan monitoring bed nifas", tag: "Ibu & Bayi" },
    { name: "PERINA", desc: "Monitoring kebutuhan bed perinatologi dan koordinasi neonatal", tag: "Perina" },
    { name: "ICU", desc: "Unit intensif dengan prioritas koordinasi admisi kritis", tag: "Intensif" },
    { name: "NICU", desc: "Unit intensif neonatal untuk monitoring kebutuhan bed bayi", tag: "Intensif" },
    { name: "PICU", desc: "Unit intensif anak untuk koordinasi penempatan pasien", tag: "Intensif" }
  ],
  team: [
    { role: "Koordinator Rawat Inap", name: "PIC Ruang Rawat Inap", desc: "Mengawal koordinasi operasional ruang, alur pasien, dan pemenuhan kebutuhan pelayanan." },
    { role: "Admisi / Pendaftaran", name: "PIC Admisi", desc: "Memastikan alur masuk pasien, verifikasi kelas, dan koordinasi ketersediaan bed." },
    { role: "IGD / Poliklinik", name: "PIC Sumber Pasien", desc: "Menghubungkan kebutuhan rawat inap dari IGD/poliklinik dengan admisi dan ruang perawatan." },
    { role: "Tim SIMRS", name: "PIC Dashboard", desc: "Menjaga integrasi data Google Sheet, Apps Script, dashboard, dan akses portal internal." }
  ]
};
