(function(){
  const defaults = {
    hospitalName: "Ward Intensive",
    portalTitle: "Portal Kendali Rawat Inap",
    portalSubtitle: "Pusat akses internal untuk dashboard bed, dokumen pelayanan, alur admisi, dan koordinasi ruang rawat inap.",
    appScriptWebAppUrl: "ISI_URL_WEB_APP_APPS_SCRIPT_ANDA",
    googleDriveUrl: "#",
    spoUrl: "#",
    formAdmisiUrl: "#",
    jadwalUrl: "#",
    kontakAdmisiUrl: "#",
    akreditasiUrl: "#",
    quickLinks: [],
    rooms: [],
    team: []
  };

  const cfg = Object.assign({}, defaults, window.SITE_CONFIG || {});
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const isRealUrl = value => value && value !== "#" && !String(value).includes("ISI_URL");
  const linkFromItem = item => item.urlKey ? (cfg[item.urlKey] || "#") : (item.url || "#");

  function initIdentity(){
    $$('[data-hospital-name]').forEach(el => el.textContent = cfg.hospitalName || defaults.hospitalName);
    $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    const title = $('#portalTitle');
    if(title) title.textContent = cfg.portalTitle;
    const subtitle = $('#portalSubtitle');
    if(subtitle) subtitle.textContent = cfg.portalSubtitle;
    const lastPolicy = $('#lastPolicyUpdate');
    if(lastPolicy) lastPolicy.textContent = cfg.lastPolicyUpdate || '-';
  }

  function initTime(){
    const el = $('#todayInfo');
    if(!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('id-ID', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
  }

  function renderQuickLinks(){
    const wrap = $('#quickLinks');
    if(!wrap) return;
    const links = cfg.quickLinks && cfg.quickLinks.length ? cfg.quickLinks : [
      {title:'Dashboard Bed', desc:'Buka dashboard rawat inap.', icon:'📊', url:'simrs.html', cta:'Buka dashboard'},
      {title:'Team', desc:'Lihat struktur tim internal.', icon:'👥', url:'team.html', cta:'Lihat tim'}
    ];
    wrap.innerHTML = links.map(item => {
      const url = linkFromItem(item);
      const target = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : '';
      return `<a class="quick-card" href="${escapeHtml(url)}"${target}>
        <div class="quick-icon">${item.icon || '🔗'}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc || '')}</p>
        <span class="link">${escapeHtml(item.cta || 'Buka')} <span>→</span></span>
      </a>`;
    }).join('');
  }

  function renderRooms(){
    const wrap = $('#roomLinks');
    if(!wrap) return;
    const rooms = cfg.rooms || [];
    wrap.innerHTML = rooms.map(room => `<a class="room-card" href="simrs.html">
      <div>
        <h3>${escapeHtml(room.name)}</h3>
        <p>${escapeHtml(room.desc || 'Informasi ruang rawat inap')}</p>
      </div>
      <span class="room-chip">${escapeHtml(room.tag || 'Ruang')}</span>
    </a>`).join('');
  }

  function renderTeam(){
    const wrap = $('#teamList');
    if(!wrap) return;
    const team = cfg.team || [];
    wrap.innerHTML = team.map(member => `<div class="team-card">
      <div class="avatar">👤</div>
      <div>
        <h3>${escapeHtml(member.name || 'PIC Internal')}</h3>
        <strong>${escapeHtml(member.role || 'Tim')}</strong>
        <p>${escapeHtml(member.desc || '')}</p>
      </div>
    </div>`).join('');
  }

  function renderDashboard(){
    const wrap = $('#dashboardEmbed');
    if(!wrap) return;
    if(isRealUrl(cfg.appScriptWebAppUrl)){
      wrap.innerHTML = `<div class="iframe-wrap"><iframe src="${escapeHtml(cfg.appScriptWebAppUrl)}" loading="lazy" title="Dashboard Internal Rawat Inap"></iframe></div>`;
    }else{
      wrap.innerHTML = `<div class="placeholder">
        <strong>Link Apps Script belum diisi.</strong><br>
        Buka file <code>config.js</code>, lalu isi bagian <code>appScriptWebAppUrl</code> dengan URL Web App Google Apps Script yang berakhiran <code>/exec</code>.
      </div>`;
    }
  }

  function initSearch(){
    const input = $('#portalSearch');
    if(!input) return;
    input.addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      $$('.quick-card, .room-card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  function escapeHtml(value){
    return String(value || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  document.addEventListener('DOMContentLoaded', function(){
    initIdentity();
    initTime();
    renderQuickLinks();
    renderRooms();
    renderTeam();
    renderDashboard();
    initSearch();
  });
})();
