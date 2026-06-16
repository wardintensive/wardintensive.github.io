const CONFIG = window.WARD_CONFIG || {};

function $(selector){ return document.querySelector(selector); }
function $all(selector){ return Array.from(document.querySelectorAll(selector)); }
function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function setCommonText(){
  $all("[data-hospital-name]").forEach(el=> el.textContent = CONFIG.hospitalName || "Ward Intensive");
  $all("[data-year]").forEach(el=> el.textContent = new Date().getFullYear());
}

function renderHome(){
  const title = $("#portalTitle");
  const subtitle = $("#portalSubtitle");
  if(title) title.textContent = CONFIG.portalTitle || "Portal Informasi Rawat Inap";
  if(subtitle) subtitle.textContent = CONFIG.portalSubtitle || "Portal terintegrasi rawat inap.";

  const quick = $("#quickLinks");
  if(quick){
    quick.innerHTML = (CONFIG.quickLinks || []).map(item => `
      <a class="quick-card" href="${escapeHtml(item.url || '#')}">
        <div class="quick-icon">${escapeHtml(item.icon || '🔗')}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc || '')}</p>
        <span class="link">Buka akses →</span>
      </a>
    `).join("");
  }

  const rooms = $("#roomLinks");
  if(rooms){
    rooms.innerHTML = (CONFIG.rooms || []).map(room => `
      <a class="room-card" href="${escapeHtml(room.url || '#')}">
        <div>
          <h3>${escapeHtml(room.name)}</h3>
          <p>${escapeHtml(room.desc || 'Link ke sumber')}</p>
        </div>
        <span class="room-chip">Link ke sumber</span>
      </a>
    `).join("");
  }

  const drive = $("#driveLink");
  if(drive){
    drive.href = CONFIG.googleDriveUrl || "#";
    if(!CONFIG.googleDriveUrl) drive.addEventListener("click", e => e.preventDefault());
  }
}

function renderSimrs(){
  const holder = $("#dashboardEmbed");
  if(!holder) return;

  const url = CONFIG.appScriptWebAppUrl;
  if(url){
    holder.innerHTML = `<div class="iframe-wrap"><iframe src="${escapeHtml(url)}" title="Dashboard Internal Rawat Inap"></iframe></div>`;
  }else{
    holder.innerHTML = `
      <div class="panel">
        <h2>URL Apps Script belum diisi</h2>
        <p>Isi variabel <span class="code">appScriptWebAppUrl</span> di file <span class="code">config.js</span> dengan URL Web App Apps Script dashboard internal rawat inap Anda.</p>
        <div class="notice">Dashboard bed pasien sebaiknya tetap berjalan dari Google Apps Script agar koneksi ke Google Sheet tetap aman dan stabil.</div>
        <div class="empty-state">Contoh: https://script.google.com/macros/s/AKfycbxxxxxxxxxxxx/exec</div>
      </div>
    `;
  }
}

function renderTeam(){
  const team = $("#teamList");
  if(!team) return;
  team.innerHTML = (CONFIG.team || []).map(member => `
    <div class="team-card">
      <h3>${escapeHtml(member.name)}</h3>
      <p>${escapeHtml(member.role || '')}</p>
    </div>
  `).join("");
}

setCommonText();
renderHome();
renderSimrs();
renderTeam();
