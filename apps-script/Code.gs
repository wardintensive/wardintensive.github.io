/********************************************************
 * DASHBOARD INTERNAL RAWAT INAP & BED MANAGEMENT
 * Versi siap pakai untuk Google Apps Script Web App
 *
 * Cara pakai singkat:
 * 1. Buat project Google Apps Script.
 * 2. Buat file Code.gs, tempel isi file ini.
 * 3. Buat file HTML bernama Index, tempel isi Index.html.
 * 4. Pastikan SPREADSHEET_ID dan nama SHEETS sesuai Google Sheet.
 * 5. Deploy sebagai Web App untuk akses internal RS.
 ********************************************************/

const APP_TITLE = "Dashboard Internal Rawat Inap";
const APP_SUBTITLE = "Monitoring ketersediaan bed, penempatan pasien, BOR, dan antrian pasien";
const REFRESH_SECONDS = 30;

// Spreadsheet sumber data penempatan bed.
const SPREADSHEET_ID = "1Sm5An84TeHl_yUaaJhrNyBJdg0pnEX1Jq9fpzKZcoQA";

const SHEETS = [
  "SIDOMUKTI",
  "TRUNTUM",
  "ICU, NICU, PICU",
  "PARANG",
  "NIFAS / PAMILUTO",
  "NITIK",
  "PERINA"
];

const ROOM_ORDER = [
  "TRUNTUM",
  "PARANG",
  "SIDOMUKTI",
  "NITIK",
  "NIFAS",
  "PERINA",
  "ICU",
  "NICU",
  "PICU"
];

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle(APP_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getAppConfig() {
  return {
    title: APP_TITLE,
    subtitle: APP_SUBTITLE,
    refreshSeconds: REFRESH_SECONDS,
    roomOrder: ROOM_ORDER
  };
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUpper(value) {
  return normalizeText(value).toUpperCase();
}

function normKey(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function canonicalSheetName(sheetName) {
  const key = normKey(sheetName);

  if (key === "SIDOMUKTI") return "SIDOMUKTI";
  if (key === "TRUNTUM") return "TRUNTUM";
  if (key === "PARANG") return "PARANG";
  if (key === "NITIK") return "NITIK";
  if (key === "PERINA") return "PERINA";
  if (key === "NIFASPAMILUTO") return "NIFAS_PAMILUTO";
  if (key === "ICUNICUPICU") return "ICU_NICU_PICU";

  return normalizeUpper(sheetName);
}

function getSheetFlexible(ss, expectedName) {
  // Ambil sheet secara fleksibel agar aman dari beda spasi, garis miring, koma, atau typo ringan.
  // Contoh: "NIFAS / PAMILUTO", "NIFAS PAMILUTO", "NIFAS  PAMILUTO" akan dianggap sama.
  const aliases = {
    "NIFASPAMILUTO": [
      "NIFAS / PAMILUTO",
      "NIFAS PAMILUTO",
      "NIFAS  PAMILUTO",
      "NIFAS/PAMILUTO"
    ],
    "ICUNICUPICU": [
      "ICU, NICU, PICU",
      "ICU NICU PICU",
      "ICU / NICU / PICU",
      "ICU,NICU,PICU"
    ]
  };

  const directSheet = ss.getSheetByName(expectedName);
  if (directSheet) return directSheet;

  const expectedKey = normKey(expectedName);

  if (aliases[expectedKey]) {
    for (let a = 0; a < aliases[expectedKey].length; a++) {
      const aliasSheet = ss.getSheetByName(aliases[expectedKey][a]);
      if (aliasSheet) return aliasSheet;
    }
  }

  const allSheets = ss.getSheets();

  for (let i = 0; i < allSheets.length; i++) {
    const actualName = allSheets[i].getName();
    const actualKey = normKey(actualName);

    if (actualKey === expectedKey) {
      return allSheets[i];
    }

    if (canonicalSheetName(actualName) === canonicalSheetName(expectedName)) {
      return allSheets[i];
    }
  }

  return null;
}

function sortByRoomOrder(a, b) {
  const ia = ROOM_ORDER.indexOf(a.room);
  const ib = ROOM_ORDER.indexOf(b.room);
  return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
}

/********************************************************
 * PARSING BED
 ********************************************************/

function parseBed(text, sheetName) {
  const t = normalizeUpper(text);
  const sheetKind = canonicalSheetName(sheetName);
  let m;

  switch (sheetKind) {
    case "SIDOMUKTI":
      m = t.match(/^SIDOMUKTI\s+(\d+)$/);
      if (m) return { unit: "SIDOMUKTI", kamar: m[1], bed: "1" };
      break;

    case "TRUNTUM":
      m = t.match(/^TRUNTUM\s+(\d+)\s*([A-D])$/);
      if (m) return { unit: "TRUNTUM", kamar: m[1], bed: m[2] };
      break;

    case "PARANG":
      m = t.match(/^PARANG\s+(\d+)\s*([A-D])$/);
      if (m) return { unit: "PARANG", kamar: m[1], bed: m[2] };
      break;

    case "NIFAS_PAMILUTO":
      m = t.match(/^NIFAS\s+(\d+)\s*([A-B])$/);
      if (m) return { unit: "NIFAS", kamar: m[1], bed: m[2] };
      break;

    case "NITIK":
      m = t.match(/^NITIK\s+(\d+)\s*([A-D])$/);
      if (m) return { unit: "NITIK", kamar: m[1], bed: m[2] };
      break;

    case "ICU_NICU_PICU":
      m = t.match(/^ICU\s+(\d+)$/);
      if (m) return { unit: "ICU", kamar: "ICU", bed: m[1] };

      m = t.match(/^NICU\s+(\d+)$/);
      if (m) return { unit: "NICU", kamar: "NICU", bed: m[1] };

      if (t === "PICU") return { unit: "PICU", kamar: "PICU", bed: "1" };
      break;

    case "PERINA":
      m = t.match(/^PERINA\s+(\d+)$/);
      if (m) return { unit: "PERINA", kamar: "PERINA", bed: m[1] };
      break;
  }

  return null;
}

function isBedCell(text, sheetName) {
  return parseBed(text, sheetName) !== null;
}

function isAnyBedCell(text) {
  for (let i = 0; i < SHEETS.length; i++) {
    if (parseBed(text, SHEETS[i])) return true;
  }
  return false;
}

function isFieldLabel(text) {
  const t = normalizeUpper(text);

  return (
    /NO\s*RM\s*\/\s*NAMA/.test(t) ||
    t === "JENIS KELAMIN" ||
    t === "JENIS KELAMIN BAYI" ||
    t === "DPJP" ||
    t === "DPJP IBU" ||
    t === "DPJP BAYI" ||
    t === "BAYI (RAWAT GABUNG)" ||
    t === "KETERANGAN"
  );
}

function isMarkerCell(text, sheetName) {
  const t = normalizeUpper(text);

  return (
    t === "ANTRIAN" ||
    /^PENEMPATAN PASIEN/.test(t) ||
    isBedCell(text, sheetName)
  );
}

function isNumberOnly(text) {
  const t = normalizeText(text);
  return /^\d+$/.test(t);
}

function isUnavailableText(text) {
  const t = normalizeUpper(text);
  return /(RUSAK|BOCOR|PERBAIKAN|BED RUSAK|TIDAK BISA DIKUNCI|TIDAK BISA|MAINTENANCE|RENOVASI)/.test(t);
}

function getBedRowHeight(sheetName) {
  if (canonicalSheetName(sheetName) === "NIFAS_PAMILUTO") return 8;
  return 4;
}

function getLocalEndCol(data, rowIndex, startCol, sheetName) {
  const row = data[rowIndex] || [];
  let endCol = row.length;

  for (let c = startCol + 1; c < row.length; c++) {
    if (isMarkerCell(row[c], sheetName)) {
      endCol = c;
      break;
    }
  }

  endCol = Math.min(endCol, startCol + 5, row.length);
  return endCol;
}

function getValueRight(row, labelCol, endCol, sheetName) {
  for (let c = labelCol + 1; c < endCol; c++) {
    const value = normalizeText(row[c]);

    if (!value) continue;
    if (isFieldLabel(value)) continue;
    if (isMarkerCell(value, sheetName)) continue;
    if (isNumberOnly(value)) continue;

    return value;
  }

  return "";
}

function readBedBlock(data, rowIndex, colIndex, sheetName, lokasi, fullBed) {
  const endCol = getLocalEndCol(data, rowIndex, colIndex, sheetName);
  const rowHeight = getBedRowHeight(sheetName);
  const maxRow = Math.min(rowIndex + rowHeight, data.length);

  let nama = "";
  let jk = "";
  let dpjp = "";
  let ket = "";
  let bayi = "";
  let jkBayi = "";
  let dpjpBayi = "";

  for (let r = rowIndex; r < maxRow; r++) {
    const row = data[r] || [];

    for (let c = colIndex; c < endCol; c++) {
      const label = normalizeUpper(row[c]);
      if (!label) continue;

      const value = getValueRight(row, c, endCol, sheetName);
      if (!value) continue;

      if (/NO\s*RM\s*\/\s*NAMA/.test(label)) {
        nama = value;
      }
      else if (label === "JENIS KELAMIN") {
        jk = value;
      }
      else if (label === "DPJP" || label === "DPJP IBU") {
        dpjp = value;
      }
      else if (label === "KETERANGAN") {
        ket = value;
      }
      else if (label === "BAYI (RAWAT GABUNG)") {
        bayi = value;
      }
      else if (label === "JENIS KELAMIN BAYI") {
        jkBayi = value;
      }
      else if (label === "DPJP BAYI") {
        dpjpBayi = value;
      }
    }
  }

  let unavailable = false;

  if (nama && isUnavailableText(nama)) {
    ket = ket || nama;
    nama = "";
    unavailable = true;
  }

  if (ket && isUnavailableText(ket)) {
    unavailable = true;
  }

  let status = "KOSONG";

  if (unavailable) {
    status = "RUSAK/PERBAIKAN";
  }
  else if (nama) {
    status = "TERISI";
  }

  return {
    room: lokasi.unit,
    kamar: lokasi.kamar,
    bed: lokasi.bed,
    fullBed: fullBed,
    nama: nama,
    jk: jk,
    dpjp: dpjp,
    ket: ket,
    bayi: bayi,
    jkBayi: jkBayi,
    dpjpBayi: dpjpBayi,
    status: status
  };
}

/********************************************************
 * PARSING ANTRIAN
 ********************************************************/

function getQueueRoomByColumn(sheetName, colIndex) {
  const sheetKind = canonicalSheetName(sheetName);

  if (sheetKind === "SIDOMUKTI") return "SIDOMUKTI";
  if (sheetKind === "PERINA") return "PERINA";

  if (sheetKind === "TRUNTUM") {
    if (colIndex < 6) return "TRUNTUM 1";
    if (colIndex < 11) return "TRUNTUM 2";
    if (colIndex < 16) return "TRUNTUM 3";
    return "TRUNTUM 4";
  }

  if (sheetKind === "PARANG") {
    if (colIndex < 6) return "PARANG 1";
    if (colIndex < 11) return "PARANG 2";
    return "PARANG 3";
  }

  if (sheetKind === "NIFAS_PAMILUTO") {
    if (colIndex < 6) return "NIFAS 1";
    return "NIFAS 2";
  }

  if (sheetKind === "NITIK") {
    if (colIndex < 6) return "NITIK 1";
    if (colIndex < 11) return "NITIK 2";
    return "NITIK 3";
  }

  if (sheetKind === "ICU_NICU_PICU") {
    if (colIndex < 7) return "ICU";
    return "NICU/PICU";
  }

  return sheetName;
}

function splitQueueRoomName(ruang) {
  if (ruang === "NICU/PICU" || ruang === "NICU / PICU") {
    return ["NICU", "PICU"];
  }
  return [ruang];
}

function getExpectedQueueRooms(sheetName) {
  const sheetKind = canonicalSheetName(sheetName);

  if (sheetKind === "SIDOMUKTI") return ["SIDOMUKTI"];
  if (sheetKind === "TRUNTUM") return ["TRUNTUM 1", "TRUNTUM 2", "TRUNTUM 3", "TRUNTUM 4"];
  if (sheetKind === "PARANG") return ["PARANG 1", "PARANG 2", "PARANG 3"];
  if (sheetKind === "NIFAS_PAMILUTO") return ["NIFAS 1", "NIFAS 2"];
  if (sheetKind === "NITIK") return ["NITIK 1", "NITIK 2", "NITIK 3"];
  if (sheetKind === "ICU_NICU_PICU") return ["ICU", "NICU", "PICU"];
  if (sheetKind === "PERINA") return ["PERINA"];
  return [sheetName];
}

function isQueueCandidateValue(value) {
  const t = normalizeText(value);
  const u = normalizeUpper(t);

  if (!t) return false;
  if (isNumberOnly(t)) return false;
  if (isFieldLabel(t)) return false;
  if (u === "ANTRIAN") return false;
  if (/^PENEMPATAN PASIEN/.test(u)) return false;
  if (isAnyBedCell(t)) return false;
  if (/^(SIDOMUKTI|TRUNTUM|PARANG|NITIK|NIFAS|PERINA)\s+\d+/.test(u)) return false;
  if (/^(ICU|NICU)\s+\d+$/.test(u)) return false;
  if (u === "PICU") return false;
  if (u === "TIDAK ADA ANTRIAN") return false;

  return true;
}

function getQueueSearchColumns(c, rowLength) {
  const cols = [];
  const start = Math.max(0, c - 1);
  const end = Math.min(rowLength - 1, c + 4);

  for (let x = start; x <= end; x++) {
    cols.push(x);
  }

  return cols;
}

function addQueueResult(hasil, hasilByRoom, ruang, daftar) {
  const key = normKey(ruang);

  if (!hasilByRoom[key]) {
    hasilByRoom[key] = {
      ruang: ruang,
      daftar: []
    };
    hasil.push(hasilByRoom[key]);
  }

  const seen = {};
  hasilByRoom[key].daftar.forEach(function(nama) {
    seen[normKey(nama)] = true;
  });

  daftar.forEach(function(nama) {
    const n = normalizeText(nama);
    if (!n) return;
    if (normalizeUpper(n) === "TIDAK ADA ANTRIAN") return;

    const namaKey = normKey(n);
    if (!seen[namaKey]) {
      seen[namaKey] = true;
      hasilByRoom[key].daftar.push(n);
    }
  });
}

function getAntrianPasien(data, sheetName) {
  const hasil = [];
  const hasilByRoom = {};

  for (let r = 0; r < data.length; r++) {
    const row = data[r] || [];

    for (let c = 0; c < row.length; c++) {
      const val = normalizeUpper(row[c]);
      if (val !== "ANTRIAN") continue;

      const ruangUtama = getQueueRoomByColumn(sheetName, c);
      const ruangList = splitQueueRoomName(ruangUtama);

      const daftar = [];
      const seenNama = {};

      for (let rr = r + 1; rr < data.length; rr++) {
        const rowBelow = data[rr] || [];
        const candidateCols = getQueueSearchColumns(c, rowBelow.length);

        for (let i = 0; i < candidateCols.length; i++) {
          const cc = candidateCols[i];
          const nama = normalizeText(rowBelow[cc]);

          if (!isQueueCandidateValue(nama)) continue;

          const keyNama = normKey(nama);
          if (!seenNama[keyNama]) {
            seenNama[keyNama] = true;
            daftar.push(nama);
          }
        }
      }

      ruangList.forEach(function(ruang) {
        addQueueResult(hasil, hasilByRoom, ruang, daftar);
      });
    }
  }

  const expectedRooms = getExpectedQueueRooms(sheetName);
  expectedRooms.forEach(function(ruang) {
    const key = normKey(ruang);
    if (!hasilByRoom[key]) {
      hasilByRoom[key] = {
        ruang: ruang,
        daftar: []
      };
      hasil.push(hasilByRoom[key]);
    }
  });

  hasil.forEach(function(item) {
    if (!item.daftar || item.daftar.length === 0) {
      item.daftar = ["Tidak Ada Antrian"];
    }
  });

  return hasil;
}

/********************************************************
 * DATA UTAMA DASHBOARD INTERNAL
 ********************************************************/

function getDashboardData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const beds = [];
  const seenBeds = {};
  const antrian = [];
  const missingSheets = [];

  SHEETS.forEach(function(sheetName) {
    const sh = getSheetFlexible(ss, sheetName);
    if (!sh) {
      missingSheets.push(sheetName);
      return;
    }

    const actualSheetName = sh.getName();
    const data = sh.getDataRange().getDisplayValues();

    const daftarAntrian = getAntrianPasien(data, actualSheetName);
    daftarAntrian.forEach(function(item) {
      antrian.push(item);
    });

    for (let r = 0; r < data.length; r++) {
      const row = data[r] || [];

      for (let c = 0; c < row.length; c++) {
        const cell = normalizeText(row[c]);
        const lokasi = parseBed(cell, actualSheetName);

        if (!lokasi) continue;

        const key = lokasi.unit + "|" + lokasi.kamar + "|" + lokasi.bed;
        if (seenBeds[key]) continue;
        seenBeds[key] = true;

        const bedData = readBedBlock(data, r, c, actualSheetName, lokasi, cell);
        beds.push(bedData);
      }
    }
  });

  beds.sort(function(a, b) {
    const roomDiff = sortByRoomOrder({ room: a.room }, { room: b.room });
    if (roomDiff !== 0) return roomDiff;

    const kamarA = parseInt(a.kamar, 10) || 999;
    const kamarB = parseInt(b.kamar, 10) || 999;
    if (kamarA !== kamarB) return kamarA - kamarB;

    return String(a.bed).localeCompare(String(b.bed));
  });

  const total = beds.length;

  const occupied = beds.filter(function(b) {
    return b.status === "TERISI";
  }).length;

  const unavailable = beds.filter(function(b) {
    return b.status === "RUSAK/PERBAIKAN";
  }).length;

  const activeTotal = Math.max(total - unavailable, 0);
  const empty = Math.max(activeTotal - occupied, 0);

  const bor = activeTotal > 0
    ? ((occupied / activeTotal) * 100).toFixed(1)
    : "0.0";

  const roomStats = {};

  beds.forEach(function(b) {
    if (!roomStats[b.room]) {
      roomStats[b.room] = {
        total: 0,
        occupied: 0,
        unavailable: 0
      };
    }

    roomStats[b.room].total++;

    if (b.status === "TERISI") {
      roomStats[b.room].occupied++;
    }

    if (b.status === "RUSAK/PERBAIKAN") {
      roomStats[b.room].unavailable++;
    }
  });

  const rooms = Object.keys(roomStats).map(function(room) {
    const stat = roomStats[room];
    const active = Math.max(stat.total - stat.unavailable, 0);
    const emptyRoom = Math.max(active - stat.occupied, 0);

    return {
      room: room,
      total: stat.total,
      occupied: stat.occupied,
      unavailable: stat.unavailable,
      empty: emptyRoom,
      active: active,
      bor: active > 0
        ? ((stat.occupied / active) * 100).toFixed(1)
        : "0.0"
    };
  }).sort(sortByRoomOrder);

  const totalQueue = antrian.reduce(function(sum, item) {
    const daftar = item.daftar || [];
    const valid = daftar.filter(function(x) {
      return normalizeUpper(x) !== "TIDAK ADA ANTRIAN";
    });
    return sum + valid.length;
  }, 0);

  return {
    appTitle: APP_TITLE,
    appSubtitle: APP_SUBTITLE,
    refreshSeconds: REFRESH_SECONDS,
    total: total,
    activeTotal: activeTotal,
    occupied: occupied,
    unavailable: unavailable,
    empty: empty,
    bor: bor,
    totalQueue: totalQueue,
    beds: beds,
    rooms: rooms,
    antrian: antrian,
    missingSheets: missingSheets,
    update: Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    )
  };
}

/********************************************************
 * FUNGSI TES - BOLEH DI-RUN DI APPS SCRIPT
 ********************************************************/

function testDashboard() {
  const data = getDashboardData();
  Logger.log("Total bed: " + data.total);
  Logger.log("Bed terisi: " + data.occupied);
  Logger.log("Bed kosong: " + data.empty);
  Logger.log("BOR: " + data.bor + "%");
  Logger.log("Antrian: " + JSON.stringify(data.antrian, null, 2));
}

function testAntrian() {
  const data = getDashboardData();
  Logger.log(JSON.stringify(data.antrian, null, 2));
}

function testNifas() {
  const data = getDashboardData();
  const nifasBeds = data.beds.filter(function(b) {
    return b.room === "NIFAS";
  });

  Logger.log("Total bed NIFAS: " + nifasBeds.length);
  Logger.log(JSON.stringify(nifasBeds, null, 2));
}
