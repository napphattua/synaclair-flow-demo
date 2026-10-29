/* screens-admin.js · SynaClair admin (desktop window, also works at 390px). Kit classes only; scoped extras use the aa- prefix. */
(function () {
  'use strict';
  const { ui, esc, money } = SC;
  const I = ui.icon;

  document.head.insertAdjacentHTML('beforeend', `<style>
  /* The admin window is 700-1180px wide inside the rehearsal shell (and full width on phones), so layout follows container width, not the viewport. */
  .aa { container-type: inline-size; text-align: left; }
  .aa .adm-side { grid-column: 1; grid-row: 1; min-width: 0; }
  .aa .adm-main { grid-column: 2; grid-row: 1; container-type: inline-size; }
  .aa .adm-side .brand img { width: 26px; height: 26px; }
  .aa .btn.ghost { box-shadow: inset 0 0 0 1.5px var(--mint2); }
  .aa .btn.danger { box-shadow: inset 0 0 0 1.5px #f2c8c0; }
  .aa .adm-head > .grow { min-width: min(100%, 300px); }
  .aa .adm-side button { white-space: nowrap; }
  .aa .link { justify-self: start; }
  .aa-rt .pill, .aa-rt .ver { white-space: nowrap; }
  .aa-rt td:first-child { min-width: 130px; }
  .aa-sh { display: grid; gap: 12px; text-align: left; }
  .aa-sub { margin: 4px 0 0; color: var(--sub); font-size: 14px; max-width: 72ch; }
  .aa-sec { display: grid; gap: 10px; }
  .aa-kv dt { white-space: nowrap; }
  .aa .kpis { grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); }
  .aa .kpi b { font-size: 24px; }
  .aa-task { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: #fff; border-radius: 16px; box-shadow: inset 0 0 0 1px var(--line); min-width: 0; }
  .aa-task.hot { background: #fffcf5; box-shadow: inset 3px 0 0 var(--gold), inset 0 0 0 1px #ecdcbd; }
  .aa-task .t { font: 600 15.5px var(--display); color: var(--forest); }
  .aa-task .s { font-size: 13.5px; color: var(--sub); }
  .aa-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 16px; align-items: start; }
  .aa-lv { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .aa-lv > div { background: #fff; border-radius: 14px; padding: 12px 14px; box-shadow: inset 0 0 0 1px var(--line); display: grid; gap: 4px; align-content: start; }
  .aa-lv b { font-size: 15px; color: var(--forest); }
  .aa-lv span { font-size: 13px; color: var(--sub); }
  .aa-pick { display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 14px; background: #fff; text-align: left; color: inherit; }
  .aa-pick > .grow { display: grid; gap: 2px; }
  .aa-more summary { list-style: none; cursor: pointer; min-height: 44px; } .aa-more summary::-webkit-details-marker { display: none; } .aa-more summary svg { width: 18px; height: 18px; color: var(--sub); transition: transform .2s; } .aa-more[open] summary svg { transform: rotate(180deg); } .aa-more[open] summary { margin-bottom: 8px; }
  .aa-pick[aria-pressed="true"] { border-color: var(--em2); background: #eaf3ee; }
  .aa-pick.off { background: #f8faf9; color: var(--sub); cursor: default; }
  .aa-box { width: 22px; height: 22px; border-radius: 7px; border: 2px solid var(--mint2); display: grid; place-items: center; flex: none; margin-top: 1px; background: #fff; color: #fff; }
  .aa-pick[aria-pressed="true"] .aa-box { background: var(--g-sheen), var(--g-em); border-color: var(--em); }
  .aa-pick.off .aa-box { background: #eef1ef; border-color: #e1e7e4; }
  .aa-box svg.lucide { width: 14px; height: 14px; stroke-width: 3; }
  .aa-pick .t { font: 600 15px var(--display); color: var(--forest); }
  .aa-pick .s { font-size: 13.5px; color: var(--sub); }
  .aa-slip { width: 100%; max-width: 280px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 6px 18px #07302310; padding: 14px; display: grid; gap: 6px; font-size: 13px; }
  .aa-slip-h { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font: 600 13.5px var(--display); color: var(--em); }
  .aa-slip-amt { font: 700 24px var(--display); color: var(--forest); }
  .aa-slip .kv { font-size: 12.5px; gap: 3px 10px; }
  .aa-slipimg { width: 100%; max-width: 280px; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--line); }
  .aa-pay { display: grid; grid-template-columns: minmax(170px, 240px) minmax(0, 1fr); gap: 18px; align-items: start; }
  .aa-photo { width: 112px; height: 112px; border-radius: 18px; object-fit: cover; box-shadow: inset 0 0 0 1px var(--line); flex: none; background: var(--mint); display: grid; place-items: center; color: var(--em); }
  .aa-quote { margin: 0; font: 500 16px/1.6 var(--display); color: var(--forest); }
  .aa .tbl.aa-rt { min-width: 0; }
  .aa-rt th, .aa-rt td { padding-left: 12px; padding-right: 12px; }
  .aa-rt tr[data-act] { cursor: pointer; }
  .aa-rt tr[data-act]:hover td { background: #fafcfb; }
  .aa-rt td .t { font: 600 14.5px var(--display); color: var(--forest); }
  .aa-rt td:has(> .ib:only-child) { width: 52px; padding: 4px; color: var(--mute); }
  .aa-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  .aa-head-sheet { display: flex; align-items: flex-start; gap: 10px; }
  .aa-head-sheet .grow b { display: block; }
  details.aa-more { background: #fff; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--line); padding: 4px 14px; }
  details.aa-more summary { min-height: 44px; display: flex; align-items: center; font: 600 14px var(--display); color: var(--em); cursor: pointer; }
  details.aa-more ul { margin: 0 0 12px; padding-left: 18px; color: var(--sub); font-size: 13.5px; display: grid; gap: 4px; }
  @container (max-width: 900px) {
    .aa .adm { grid-template-columns: 186px minmax(0, 1fr); }
    .aa .adm-main { padding: 18px; }
    .aa .adm-side button { padding: 0 9px; gap: 8px; }
  }
  @container (max-width: 760px) { .aa-split { grid-template-columns: minmax(0, 1fr); } }
  @container (max-width: 470px) {
    .aa-pay, .aa-lv { grid-template-columns: minmax(0, 1fr); }
    .aa .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .aa .kpis.k3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .aa .kpis.k3 .kpi { padding: 12px; }
    .aa-task { display: grid; grid-template-columns: auto minmax(0, 1fr); }
    .aa-task .btn { grid-column: 1 / -1; width: 100%; }
    .aa-rt { display: block; }
    .aa-rt thead { display: none; }
    .aa-rt tbody, .aa-rt tr { display: block; }
    .aa-rt tr { padding: 10px 0; }
    .aa-rt tr + tr { border-top: 1px solid var(--line); }
    .aa-rt td { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 10px; align-items: center; border-top: 0; padding: 4px 14px; }
    .aa-rt td::before { content: attr(data-label); color: var(--sub); font-size: 13px; }
    .aa-rt td:first-child, .aa-rt td[data-label=""] { grid-template-columns: minmax(0, 1fr); }
    .aa-rt td:first-child::before, .aa-rt td[data-label=""]::before { display: none; }
    .aa-rt td:has(> .ib:only-child) { display: none; }
  }
  @media (min-width: 761px) {
    .dev-desktop .sheet-bg { justify-content: flex-end; align-items: stretch; }
    .dev-desktop .sheet { width: min(480px, 100%); max-height: none; height: 100%; border-radius: 20px 0 0 20px; align-content: start; padding: 20px 22px; }
    .dev-desktop .sheet .grab { display: none; }
  }
  @media (max-width: 760px) {
    .aa .adm { grid-template-columns: minmax(0, 1fr); }
    .aa .adm-main { padding: 16px; }
    .aa .adm-side { grid-row: 1; grid-column: 1; }
    .aa .adm-main { grid-row: 2; grid-column: 1; }
  }
  </style>`);

  /* ---------- Facts and small helpers ---------- */
  const SAMPLES = SC.SAMPLE_PTS;
  const DEF = { tick: null, tickRef: null, win: 0, payTab: 'wait', licenseAsk: '', rejectReason: '', rep: { pt: '', text: '', evidence: false }, clearReason: '', rejects: [], contacted: false };
  function A(s) {
    const a = s.admin || (s.admin = {});
    Object.keys(DEF).forEach(k => { if (a[k] === undefined) a[k] = JSON.parse(JSON.stringify(DEF[k])); });
    if (!a.rep || typeof a.rep !== 'object') a.rep = { pt: '', text: '', evidence: false };
    return a;
  }
  const meName = s => s.pt.displayName || 'นักกายภาพ';
  const ptName = (s, id) => id === 'me' ? meName(s) : ((SAMPLES.find(p => p.id === id) || {}).name || 'PT');
  const patientName = s => s.patient.name || 'ผู้รับบริการ';
  const district = s => (s.patient.address && s.patient.address.district) || s.patient.district || '';
  const zoneOf = d => SC.ZONES.find(z => z.districts.includes(d));
  const covers = (zones, d) => { if (!d) return false; const z = zoneOf(d); return zones.includes(d) || (!!z && (zones.includes(z.name) || zones.includes(z.code))); };
  const REQ = { PAYMENT_PENDING: ['รอชำระเงิน', 'wait'], SLIP_SENT: ['รอตรวจสลิป', 'wait'], PAID: ['รอจับคู่ PT', 'info'], OFFERED: ['รอ PT ตอบรับ', 'info'], BOOKED: ['นัดแล้ว', ''] };
  const reqPill = r => { const x = REQ[r.status] || [r.status, 'gray']; return `<span class="pill ${x[1]}">${esc(x[0])}</span>`; };
  const STEP = ['นัดแล้ว', 'PT กำลังเดินทาง', 'PT ถึงแล้ว', 'กำลังดูแล', 'เสร็จแล้ว'];
  const GOALS = { WALK: 'เดินได้มั่นคงขึ้น', PAIN: 'ลดปวด', TRANSFER: 'ลุกนั่งเองได้', STAND: 'ลุกยืนเองได้', BALANCE: 'ทรงตัวดี ไม่หกล้ม', FALL: 'ป้องกันหกล้ม', STRENGTH: 'แข็งแรงขึ้น', SURGERY: 'ฟื้นตัวหลังผ่าตัด', POST_SURGERY: 'ฟื้นตัวหลังผ่าตัด', STROKE: 'ฟื้นฟูหลังอัมพฤกษ์', SELF_CARE: 'ดูแลตัวเองได้', BREATH: 'หายใจได้ดีขึ้น', OFFICE: 'ลดปวดจากการทำงาน' };
  const goalText = s => (s.patient.goals || []).map(g => g === 'OTHER' ? (s.patient.goalOther || 'อื่น ๆ') : (GOALS[g] || g)).join(' · ');
  const reports = (s, id) => (s.suspicion.reports || []).filter(r => r.pt === id && !r.cleared);
  const score = (s, id) => reports(s, id).reduce((t, r) => t + (r.evidence ? 60 : 20), 0);
  const LEVEL = { NORMAL: ['ปกติ', 'gray', ''], WATCH: ['เฝ้าดู', 'wait', 'สุ่มโทรถามคนไข้ของ PT คนนี้ ถามตามปกติ ไม่กล่าวหา'], WARNING: ['เตือน', 'warn', 'ส่งหนังสือเตือนถึง PT · ระบบเรียงไว้ท้ายรายชื่อตอนจับคู่'], PAUSED: ['พักรับงานใหม่', 'warn', 'ระบบหยุดส่งงานใหม่ นัดเดิมยังดำเนินต่อ · ทีมทบทวนภายใน 3 วันทำการ'] };
  const level = n => n >= 60 ? 'PAUSED' : n >= 40 ? 'WARNING' : n >= 20 ? 'WATCH' : 'NORMAL';
  const STANDING = { NORMAL: ['รับงานปกติ', ''], WATCH: ['รับงานปกติ', ''], WARNING: ['เรียงไว้ท้าย', 'wait'], PAUSED: ['พักรับงานใหม่', 'warn'] };
  const standing = (s, id) => STANDING[level(score(s, id))];
  const roster = s => (s.pt.status !== 'NONE' ? ['me'] : []).concat(SAMPLES.map(p => p.id));
  const meRating = s => s.review ? { average: s.review.stars, count: 1 } : null;
  const meCases = s => s.visits.filter(x => x.step >= 4).length;
  const ratingText = r => r && r.count ? `${ui.stars(r.average)} <span class="small">${r.average.toFixed(1)} · ${r.count} รีวิว</span>` : '<span class="small">ยังไม่มีรีวิว</span>';
  const photoSrc = p => p === 'sample' ? 'a/team-player.jpg' : p;
  const trialDone = s => !!s.request && ['PAID', 'OFFERED', 'BOOKED'].includes(s.request.status);
  const openSheet = (ctx, html) => ctx.sheet(`<div class="aa-sh">${html}</div>`);
  const openDlg = (ctx, html) => ctx.dialog(`<div class="aa-sh">${html}</div>`);
  const sheetHead = (title, sub) => `<div class="aa-head-sheet"><div class="grow"><b class="h2">${esc(title)}</b>${sub ? `<span class="small">${esc(sub)}</span>` : ''}</div><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>`;
  const kv = pairs => `<dl class="kv aa-kv">${pairs.filter(Boolean).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>`;
  const table = (cols, rows) => `<div class="tbl-wrap"><table class="tbl aa-rt"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr ${r.attrs || ''}>${r.cells.map((c, i) => `<td data-label="${esc(cols[i])}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  /* ---------- Work queue (derived from state only) ---------- */
  function tasks(s) {
    const a = A(s), t = [], r = s.request;
    if (s.pt.status === 'PENDING') t.push({ icon: 'badge-check', tag: 'ตรวจใบประกอบ', title: s.pt.legalName || meName(s), sub: `เลขใบประกอบ ${s.pt.license || '—'} · แสดงเป็น ${meName(s)}${s.pt.photo ? ' · มีรูปโปรไฟล์รอตรวจ' : ''}`, go: 'a.license', cta: 'ตรวจใบประกอบ' });
    if (r && r.check && r.check.state === 'open') t.push({ icon: 'receipt', tag: 'สลิปผิดปกติ', title: `สลิป ClairConnect Trial · ${r.ref}`, sub: `${patientName(s)} · ${r.check.reasons.join(' · ')} · จับคู่ PT ต่อไปแล้ว`, go: 'a.payments', cta: 'ดูสลิป' });
    if (r && r.status === 'PAID') t.push({ icon: 'users-round', tag: 'จับคู่ PT', title: `${patientName(s)} · ${district(s) || 'ยังไม่ระบุเขต'}`, sub: `${r.preferredPt ? `ผู้รับบริการขอ ${ptName(s, r.preferredPt)} · ` : ''}ระบบหา PT ที่ตรงเขตไม่ได้ ต้องเลือกเอง`, go: 'a.match', cta: 'เลือก PT' });
    if (s.course && s.course.slip && !s.course.approved) t.push({ icon: 'wallet', tag: 'ตรวจเงินคอร์ส', title: `คอร์ส ${s.course.sessions} ครั้ง ${money(s.course.total)}`, sub: `${patientName(s)} · PT ${meName(s)} ส่งสลิปจากหน้างาน`, go: 'a.payments', cta: 'ตรวจสลิปคอร์ส' });
    if (s.review && s.review.consent && !s.review.approved && !s.review.hidden) t.push({ icon: 'star', tag: 'รีวิวรออนุมัติ', title: `รีวิว ${s.review.stars} ดาว ถึง ${meName(s)}`, sub: 'ผู้รับบริการยินยอมให้แสดงบนหน้าเว็บ อ่านก่อนอนุมัติ', go: 'a.reviews', cta: 'อ่านรีวิว' });
    if (s.review && s.review.needsContact && !a.contacted) t.push({ icon: 'phone', tag: 'ขอให้ติดต่อกลับ', title: patientName(s), sub: 'ผู้รับบริการติ๊กว่าอยากให้ทีมโทรคุย', go: 'a.reviews', cta: 'ดูเรื่องนี้' });
    roster(s).forEach(id => { const n = score(s, id); if (n >= 20) t.push({ icon: 'shield-alert', tag: 'เฝ้าระวัง', title: ptName(s, id), sub: `${n} คะแนน · ${LEVEL[level(n)][0]}`, go: 'a.suspicion', cta: 'ทบทวน' }); });
    return t;
  }
  function waiting(s) {
    const w = [], r = s.request;
    if (r && r.status === 'PAYMENT_PENDING') w.push({ icon: 'hourglass', title: `${patientName(s)} · รอชำระ ClairConnect Trial`, sub: `${r.ref} · ระบบส่งลิงก์ชำระให้ใน LINE แล้ว`, go: 'a.patients', cta: 'ดูคนไข้' });
    if (r && r.status === 'OFFERED') w.push({ icon: 'send', title: `รอ PT ตอบรับข้อเสนอ · ${patientName(s)}`, sub: `${r.auto ? 'ระบบจับคู่ให้อัตโนมัติ · ' : ''}ส่งให้ ${(r.offerTo || []).map(id => ptName(s, id)).join(', ') || '—'} · ภายใน 30 นาที`, go: 'a.match', cta: 'ดูข้อเสนอ' });
    s.visits.filter(x => x.step < 4).forEach(x => w.push({ icon: 'calendar-days', title: `นัดครั้งที่ ${x.n} · ${patientName(s)}`, sub: `${x.date} ${x.time} · ${STEP[x.step]}`, go: 'a.appts', cta: 'ดูนัด' }));
    return w;
  }

  /* ---------- Shared admin layout ---------- */
  const NAV = [['a.queue', 'inbox', 'งานรอจัดการ'], ['a.license', 'badge-check', 'ตรวจใบประกอบ'], ['a.payments', 'wallet', 'การเงิน'], ['a.match', 'users-round', 'จับคู่ PT'], ['a.appts', 'calendar-days', 'นัดหมาย'], ['a.pts', 'stethoscope', 'ทีม PT'], ['a.patients', 'heart-handshake', 'คนไข้'], ['a.reviews', 'star', 'รีวิว'], ['a.suspicion', 'shield-alert', 'เฝ้าระวัง']];
  function counts(s) {
    const t = tasks(s), c = { 'a.queue': t.length };
    t.forEach(x => { c[x.go] = (c[x.go] || 0) + 1; });
    c['a.appts'] = s.visits.filter(x => x.step < 4).length;
    return c;
  }
  /* Main comes first in the DOM so the rehearsal pulses the task button, not the sidebar item; CSS puts the sidebar on the left (or on top at 390px). */
  function shell(s, active, head, body) {
    const c = counts(s);
    const nav = NAV.map(([id, ic, label]) => `<button data-go="${id}" class="${id === active ? 'on' : ''}" ${id === active ? 'aria-current="page"' : ''}>${I(ic)}${label}${c[id] ? `<span class="n">${c[id]}</span>` : ''}</button>`).join('');
    return `<div class="scr aa"><div class="adm">
      <main class="adm-main"><header class="adm-head"><div class="grow">${head.kick ? `<div class="kick">${esc(head.kick)}</div>` : ''}<h1>${esc(head.title)}</h1>${head.sub ? `<p class="aa-sub">${esc(head.sub)}</p>` : ''}</div>${head.right || ''}</header>${body}</main>
      <nav class="adm-side" aria-label="เมนูแอดมิน"><div class="brand"><img src="a/synaclair-icon.svg" alt="">SynaClair</div>${nav}</nav>
    </div></div>`;
  }
  const taskRow = (x, hot) => `<div class="aa-task ${hot ? 'hot' : ''}"><span class="tile ${hot ? 'gold' : ''}">${I(x.icon)}</span><div class="grow">${x.tag ? `<span class="pill ${hot ? 'wait' : 'gray'}">${esc(x.tag)}</span>` : ''}<div class="t">${esc(x.title)}</div><div class="s">${esc(x.sub)}</div></div><button class="btn ${hot ? '' : 'ghost'}" data-go="${x.go}">${esc(x.cta)}${I('chevron-right')}</button></div>`;

  /* ================= a.queue ================= */
  SC.screen('a.queue', {
    role: 'admin',
    render(s) {
      const t = tasks(s), w = waiting(s);
      const pay = t.filter(x => x.go === 'a.payments').length;
      const kpis = `<div class="kpis">
        <div class="kpi"><b>${t.length}</b><span>งานค้างที่ทีมต้องทำ</span></div>
        <div class="kpi"><b>${pay}</b><span>สลิปรอตรวจ</span></div>
        <div class="kpi"><b>${t.filter(x => x.go === 'a.match').length}</b><span>คำขอรอจับคู่ PT</span></div>
        <div class="kpi"><b>${s.visits.filter(x => x.step < 4).length}</b><span>นัดที่กำลังจะถึง</span></div></div>`;
      const list = t.length ? `<div class="aa-sec">${t.map(x => taskRow(x, true)).join('')}</div>`
        : `<div class="card flat">${ui.empty('circle-check', 'ไม่มีงานค้าง', 'ทุกเรื่องที่ต้องให้ทีมตอบได้ทำครบแล้ว งานใหม่จะขึ้นที่นี่ทันทีพร้อมแจ้งใน LINE แอดมิน')}</div>`;
      const wait = w.length ? `<section class="aa-sec"><div class="row between"><h2 class="h3">กำลังรอคนอื่น</h2><span class="small">ไม่นับเป็นงานค้าง</span></div>${w.map(x => taskRow(x, false)).join('')}</section>` : '';
      return shell(s, 'a.queue', { kick: 'ต้องดำเนินการ', title: 'งานรอจัดการ', sub: 'เฉพาะงานที่ต้องให้ทีมตอบสนอง เรื่องที่กำลังรอ PT หรือผู้รับบริการอยู่ด้านล่าง' }, kpis + list + wait);
    }
  });

  /* ================= a.license ================= */
  SC.screen('a.license', {
    role: 'admin',
    render(s) {
      const p = s.pt;
      let queue;
      if (p.status === 'PENDING') {
        const consent = p.photo && p.photoConsent !== false;
        queue = `<article class="card flat">
          <div class="row top wrap" style="gap:18px">
            ${p.photo ? `<img class="aa-photo" src="${esc(photoSrc(p.photo))}" alt="รูปโปรไฟล์ที่ ${esc(meName(s))} ส่งมา">` : `<div class="aa-photo">${I('image')}</div>`}
            <div class="grow stack" style="min-width:220px">
              <div class="row wrap"><span class="pill wait">${I('hourglass')}ยังไม่ตรวจ</span><span class="small">สมัครเมื่อ ${esc(SC.TODAY)}</span></div>
              ${kv([['ชื่อจริง', `<b>${esc(p.legalName || '—')}</b>`], ['เลขใบประกอบวิชาชีพ', `<b>${esc(p.license || '—')}</b>`], ['สำเนาใบประกอบ', p.licenseFile ? (p.licenseFile === 'sample' ? '<span class="pill">แนบแล้ว (ไฟล์ตัวอย่าง)</span>' : `<a class="link" href="${esc(p.licenseFile)}" target="_blank" rel="noopener">เปิดไฟล์ที่แนบ</a>`) : '<span class="pill warn">ยังไม่แนบ</span>'], ['เอกสารอื่น', (p.extraDocs || []).length ? p.extraDocs.map(x => `<div>${I('paperclip')} ${x.file === 'sample' ? 'ไฟล์ตัวอย่าง' : `<a class="link" href="${esc(x.file)}" target="_blank" rel="noopener">เปิดไฟล์</a>`} · ${esc(x.note)}</div>`).join('') : '<span class="small">ไม่มี</span>'], ['การศึกษา', ((p.cv && p.cv.edu) || []).length ? p.cv.edu.map(([x, u, f, ef]) => `<div>${esc([x, f, u].filter(Boolean).join(' · '))} · ${ef ? (ef === 'sample' ? '<span class="pill">เอกสารยืนยัน (ตัวอย่าง)</span>' : `<a class="link" href="${esc(ef)}" target="_blank" rel="noopener">เปิดเอกสารยืนยัน</a>`) : '<span class="pill warn">ยังไม่แนบเอกสาร</span>'}</div>`).join('') : '—'], ['ชื่อที่แสดง', esc(meName(s))], ['เขตที่รับงาน', esc((p.zones || []).join(' · ') || '—')],
                ['รูปโปรไฟล์', p.photo ? (consent ? '<span class="pill">ยินยอมให้แสดงบนเว็บ</span>' : '<span class="pill warn">ยังไม่ยินยอม</span>') : '<span class="pill gray">ยังไม่ได้ใส่รูป</span>']])}
            </div>
          </div>
          ${p.bio ? `<div class="note mint"><b>แนะนำตัว:</b> ${esc(p.bio)}</div>` : ''}
          ${p.licenseNote ? `<div class="note">${I('message-circle')} ขอข้อมูลเพิ่มแล้วใน LINE: ${esc(p.licenseNote)}</div>` : ''}
          <div class="note mint">เทียบชื่อจริง เลขใบประกอบ และสำเนาที่แนบกับระบบตรวจสอบของสภากายภาพบำบัด และดูว่ารูปเห็นหน้าชัด เป็นรูปจริงของนักกายภาพ</div>
          <div class="aa-acts"><a class="link" href="https://www.pt.or.th/cpte/ptlicense.php" target="_blank" rel="noopener">${I('link')} เปิดระบบตรวจใบประกอบของสภากายภาพบำบัด ${I('external-link')}</a></div>
          <div class="aa-acts"><button class="btn" data-act="approvePt">${I('check')}อนุมัติ</button><button class="btn ghost" data-act="askLicenseInfo">${I('message-circle')}ขอข้อมูลเพิ่ม</button></div>
        </article>`;
      } else if (p.status === 'NONE') {
        queue = `<div class="card flat">${ui.empty('badge-check', 'ไม่มีใบประกอบรอตรวจ', 'เมื่อนักกายภาพสมัครด้วย LINE ใบประกอบจะขึ้นที่นี่ (ซ้อมด่าน 1 ก่อน)')}</div>`;
      } else {
        queue = `<div class="card flat">${ui.empty('circle-check', 'ไม่มีใบประกอบรอตรวจ', 'ตรวจครบทุกคนแล้ว')}</div>`;
      }
      const done = [];
      const ok = '<span class="ver">' + I('badge-check') + 'ยืนยันแล้ว</span>';
      if (p.status === 'VERIFIED') done.push({ cells: [`<div class="row">${ui.avatar(meName(s), p.photo, 36)}<div class="grow"><div class="t">${esc(p.legalName || meName(s))}</div><span class="small">แสดงเป็น ${esc(meName(s))}</span></div></div>`, esc(p.license || '—'), esc((p.zones || []).join(' · ')), `<div class="stack" style="gap:4px">${ok}<span class="small">${p.photoApproved && p.photo ? 'รูปโปรไฟล์อนุมัติแล้ว' : 'ยังไม่มีรูป'}</span></div>`] });
      SAMPLES.forEach(x => done.push({ cells: [`<div class="row">${ui.avatar(x.name, null, 36, x.hue)}<div class="grow"><div class="t">${esc(x.name)}</div>${ui.sample()}</div></div>`, '<span class="small">ข้อมูลตัวอย่าง</span>', esc(x.zones.join(' · ')), ok] }));
      const body = `<section class="aa-sec"><h2 class="h3">รอตรวจ</h2>${queue}</section>
        <section class="aa-sec"><h2 class="h3">ตรวจแล้ว</h2>${table(['นักกายภาพ', 'เลขใบประกอบ', 'เขต', 'สถานะ'], done)}</section>`;
      return shell(s, 'a.license', { kick: 'ทีม PT', title: 'ตรวจใบประกอบ + รูปโปรไฟล์', sub: 'นักกายภาพสมัครเองด้วย LINE แล้ว เทียบชื่อจริงกับเลขใบประกอบ แล้วกดอนุมัติ ไม่ต้องสัมภาษณ์' }, body);
    }
  });
  SC.action('approvePt', (s, ctx) => {
    if (s.pt.status !== 'PENDING') return;
    s.pt.status = 'VERIFIED'; s.pt.photoApproved = true;
    s.pt.xp += (SC.XP ? SC.XP.verified : 50); s.pt.xpLog.unshift({ points: 50, reason: 'ใบประกอบได้รับการยืนยัน' });
    ctx.line('pt', { key: 'ptVerified' });
    ctx.toast(`ยืนยันใบประกอบของ ${meName(s)} แล้ว ส่ง LINE แจ้ง PT แล้ว`);
  });
  const ASKS = ['ชื่อจริงไม่ตรงกับเลขใบประกอบ รบกวนตรวจและแก้ไขค่ะ', 'รบกวนส่งรูปบัตรใบประกอบวิชาชีพเพิ่มค่ะ', 'รบกวนเปลี่ยนรูปโปรไฟล์เป็นรูปที่เห็นหน้าชัดค่ะ'];
  const askSheet = s => `${sheetHead('ขอข้อมูลเพิ่ม', `ส่งถึง ${meName(s)} ใน LINE`)}
    <div class="chips">${ASKS.map((t, i) => `<button class="chip" data-act="licenseAskPreset" data-i="${i}">${esc(t.split(' ')[0])}</button>`).join('')}</div>
    <label class="field"><span>ข้อความถึงนักกายภาพ</span><textarea class="in" maxlength="300" data-bind="admin.licenseAsk" placeholder="เช่น ขอรูปบัตรใบประกอบ หรือชื่อไม่ตรงกับเลขใบประกอบ">${esc(A(s).licenseAsk)}</textarea></label>
    <button class="btn" data-act="sendLicenseAsk" data-need="admin.licenseAsk">${I('send')}ส่งคำขอใน LINE</button>`;
  SC.action('askLicenseInfo', (s, ctx) => { A(s); openSheet(ctx, askSheet(s)); });
  SC.action('licenseAskPreset', (s, ctx) => { A(s).licenseAsk = ASKS[+ctx.data.i]; openSheet(ctx, askSheet(s)); });
  SC.action('sendLicenseAsk', (s, ctx) => {
    const a = A(s), text = (a.licenseAsk || '').trim(); if (!text) return;
    s.pt.licenseNote = text; a.licenseAsk = '';
    ctx.line('pt', { key: 'teamReply', text: 'ทีม SynaClair: ' + text });
    ctx.close(); ctx.toast(`ส่งคำขอข้อมูลถึง ${meName(s)} ใน LINE แล้ว`);
  });

  /* ================= a.payments ================= */
  function slip(src, o) {
    if (src && src !== 'sample' && src !== 'odd') return `<img class="aa-slipimg" src="${esc(src)}" alt="สลิปที่แนบมา ยอด ${money(o.amount)}">`;
    return `<div class="aa-slip" role="img" aria-label="สลิปตัวอย่าง ยอด ${money(o.amount)}"><div class="aa-slip-h">${I('circle-check')}โอนเงินสำเร็จ <span class="sample">สลิปตัวอย่าง</span></div><div class="aa-slip-amt">${money(o.slipAmount || o.amount)}.00</div>${kv([['จาก', esc(o.from)], ['ไปยัง', 'SynaClair'], ['บันทึกช่วยจำ', esc(o.ref)], ['เวลา', esc(o.when)]])}</div>`;
  }
  function payItems(s) {
    const out = [], r = s.request, c = s.course;
    if (r && r.check && r.check.state === 'open') out.push({ kind: 'trial', title: 'ClairConnect Trial', amount: SC.TRIAL, slipAmount: 1500, ref: r.ref, src: r.slip, from: patientName(s), when: SC.TODAY, by: 'ผู้รับบริการส่งสลิปเองใน LINE', flag: r.check.reasons, cta: 'เช็กบัญชีแล้ว ยอดถูก', rej: 'แจ้งคนไข้ให้โอนเพิ่มหรือส่งใหม่' });
    if (c && c.slip && !c.approved) out.push({ kind: 'course', title: `คอร์ส ${c.sessions} ครั้ง${c.bonus ? ` แถม ${c.bonus} ครั้ง` : ''}`, amount: c.total, ref: c.code || (r ? r.ref : '—'), src: c.slip, from: patientName(s), when: SC.VISIT1.date, by: `${meName(s)} ส่งสลิปแทนจากหน้างาน`, cta: 'ยืนยันรับเงินและเปิดสิทธิ์' });
    return out;
  }
  SC.screen('a.payments', {
    role: 'admin',
    render(s) {
      const a = A(s), items = payItems(s);
      const seg = `<div class="seg" role="tablist" style="max-width:360px"><button role="tab" class="${a.payTab === 'wait' ? 'on' : ''}" data-pick="admin.payTab" data-value="wait">${items.some(x => x.flag) ? 'ผิดปกติ' : 'รอตรวจ'} (${items.length})</button><button role="tab" class="${a.payTab === 'done' ? 'on' : ''}" data-pick="admin.payTab" data-value="done">ตรวจแล้ว</button></div>`;
      let body;
      if (a.payTab === 'wait') {
        body = items.length ? items.map(x => `<article class="card flat"><div class="aa-pay">
            <div class="stack">${slip(x.src, x)}<button class="link" data-act="viewSlip" data-kind="${x.kind}">${I('eye')} ดูสลิปขนาดเต็ม</button></div>
            <div class="stack">
              <div class="row wrap"><span class="pill ${x.flag ? 'warn' : 'wait'}">${x.flag ? 'ระบบเจอจุดผิดปกติ' : 'รอตรวจ'}</span><b class="h3">${esc(x.title)}</b></div>
              ${x.flag ? `<div class="note" style="color:var(--red)">${I('triangle-alert')} ${x.flag.map(esc).join(' · ')}<br><span class="small">ระบบไม่ได้หยุดงาน: จับคู่ PT ต่อไปแล้ว ยังไม่ส่งใบเสร็จ</span></div>` : ''}
              <div class="price">${money(x.amount)}</div>
              ${kv([['ผู้รับบริการ', esc(x.from)], ['เลขอ้างอิง', esc(x.ref)], ['ส่งเมื่อ', esc(x.when)], ['ส่งโดย', esc(x.by)]])}
              <div class="note">ตรวจยอดเงินเข้าบัญชีจริงก่อนยืนยัน ไม่ใช่ดูภาพสลิปอย่างเดียว</div>
              <div class="aa-acts"><button class="btn" data-act="confirmPayment" data-kind="${x.kind}">${I('check')}${esc(x.cta)}</button><button class="btn danger" data-act="rejectPayment" data-kind="${x.kind}">${I('x')}${esc(x.rej || 'ยอดไม่ตรง ตีกลับ')}</button></div>
            </div></div></article>`).join('')
          : `<div class="card flat">${ui.empty('wallet', 'ไม่มีสลิปผิดปกติ', 'สลิป Trial ที่ระบบตรวจผ่านไปต่อเองแล้ว ดูได้ในแท็บตรวจแล้ว ถ้าระบบเจอยอดหรือสลิปแปลก จะขึ้นที่นี่และแจ้งใน LINE แอดมิน')}</div>`;
      } else {
        const rows = [];
        if (trialDone(s)) rows.push({ cells: [`<div class="t">ClairConnect Trial</div><span class="small">${esc(patientName(s))}</span>`, `<span class="money">${money(SC.TRIAL)}</span>`, `<span style="white-space:nowrap">${esc(s.request.ref)}</span>`, `<span class="pill">${s.request.check && s.request.check.state === 'asked' ? 'แจ้งคนไข้แล้ว' : 'รับเงินแล้ว'}</span> <span class="small">${!s.request.check || s.request.check.state === 'auto' ? 'ระบบตรวจผ่านอัตโนมัติ' : s.request.check.state === 'ok' ? 'แอดมินเช็กบัญชีแล้ว' : esc(s.request.check.reasons.join(' · '))}</span>`] });
        if (s.course && s.course.approved) rows.push({ cells: [`<div class="t">คอร์ส ${s.course.sessions} ครั้ง</div><span class="small">${esc(patientName(s))}</span>`, `<span class="money">${money(s.course.total)}</span>`, `<span style="white-space:nowrap">${esc(s.course.code || (s.request ? s.request.ref : '—'))}</span>`, '<span class="pill">รับเงินแล้ว · เปิดสิทธิ์แล้ว</span>'] });
        a.rejects.forEach(x => rows.push({ cells: [`<div class="t">${esc(x.title)}</div><span class="small">${esc(x.from)}</span>`, `<span class="money">${money(x.amount)}</span>`, `<span style="white-space:nowrap">${esc(x.ref)}</span>`, `<span class="pill warn">ตีกลับ</span> <span class="small">${esc(x.reason)}</span>`] }));
        body = rows.length ? table(['รายการ', 'ยอด', 'อ้างอิง', 'ผล'], rows) : `<div class="card flat">${ui.empty('receipt', 'ยังไม่มีรายการที่ตรวจแล้ว', 'รายการที่ยืนยันหรือตีกลับจะเก็บไว้ที่นี่')}</div>`;
      }
      return shell(s, 'a.payments', { kick: 'ตรวจเงิน', title: 'การเงิน', sub: 'ระบบอ่านสลิป ClairConnect Trial ให้เอง (ยอด ผู้รับ เวลาโอน เลขอ้างอิงซ้ำ) แล้วจับคู่ต่อทันที ที่นี่ขึ้นเฉพาะสลิปที่ผิดปกติ และสลิปคอร์ส', right: seg }, body);
    }
  });
  SC.action('viewSlip', (s, ctx) => {
    const x = payItems(s).find(i => i.kind === ctx.data.kind); if (!x) return;
    openSheet(ctx, `${sheetHead('หลักฐานรับโอน', `${x.title} · ${money(x.amount)}`)}<div style="display:grid;justify-items:center">${slip(x.src, x)}</div>${kv([['ผู้รับบริการ', esc(x.from)], ['เลขอ้างอิง', esc(x.ref)], ['ส่งเมื่อ', esc(x.when)]])}<button class="btn ghost" data-close>ปิด</button>`);
  });
  SC.action('confirmPayment', (s, ctx) => {
    if (ctx.data.kind === 'course') {
      if (!s.course) return;
      s.course.approved = true; s.course.paid = true;
      if (!s.visits.find(x => x.n === 2)) {
        /* Visit 2 is the date the PT booked with the patient on site ('อ. 27 ต.ค. 09:00'). */
        const WDAY = { 'จ.': 'จันทร์', 'อ.': 'อังคาร', 'พ.': 'พุธ', 'พฤ.': 'พฤหัสบดี', 'ศ.': 'ศุกร์', 'ส.': 'เสาร์', 'อา.': 'อาทิตย์' };
        const m = /^(\S+)\s+(\d+\s+\S+)\s+(\d{2}):(\d{2})/.exec(s.course.next || '');
        const date = m && WDAY[m[1]] ? `${WDAY[m[1]]} ${m[2]} 2569` : SC.VISIT2.date;
        const time = m ? `${m[3]}:${m[4]}–${String(+m[3] + 1).padStart(2, '0')}:${m[4]}` : SC.VISIT2.time;
        s.visits.push({ n: 2, date, time, step: 0, soap: {}, published: false });
      }
      ctx.line('patient', { key: 'courseReceipt' }); ctx.line('patient', { key: 'confirmedCourse' });
      ctx.toast('ยืนยันรับเงินคอร์สแล้ว เปิดสิทธิ์และนัดครั้งที่ 2 ส่งใบเสร็จให้คนไข้ใน LINE');
      return;
    }
    const r = s.request; if (!r || !r.check || r.check.state !== 'open') return;
    r.check.state = 'ok';
    ctx.line('patient', { key: 'receipt' });
    ctx.toast('ปิดเรื่องแล้ว ส่งใบเสร็จให้คนไข้ใน LINE · การจับคู่เดินต่อตามปกติ');
  });
  const REJECTS = ['ยอดเงินไม่ตรง', 'ยังไม่พบเงินเข้าบัญชี', 'สลิปไม่ชัด อ่านไม่ได้'];
  const rejectDlg = (s, kind) => `<b class="h2">ตีกลับสลิปนี้?</b><p class="p">${kind === 'course' ? `ระบบแจ้ง ${esc(meName(s))} ให้ส่งสลิปใหม่` : 'ระบบแจ้งผู้รับบริการใน LINE ให้แนบสลิปใหม่'} พร้อมเหตุผลด้านล่าง</p>
    <div class="chips">${REJECTS.map((t, i) => `<button class="chip ${A(s).rejectReason === t ? 'on' : ''}" data-act="rejectPreset" data-kind="${kind}" data-i="${i}">${esc(t)}</button>`).join('')}</div>
    <label class="field"><span>เหตุผล</span><textarea class="in" style="min-height:80px" data-bind="admin.rejectReason" placeholder="เช่น ยอดโอน 1,400 บาท ขาดอีก 99 บาท">${esc(A(s).rejectReason)}</textarea></label>
    <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn danger" data-act="rejectPaymentConfirm" data-kind="${kind}" data-need="admin.rejectReason">ตีกลับ</button></div>`;
  SC.action('rejectPayment', (s, ctx) => { A(s).rejectReason = ''; openDlg(ctx, rejectDlg(s, ctx.data.kind)); });
  SC.action('rejectPreset', (s, ctx) => { A(s).rejectReason = REJECTS[+ctx.data.i]; openDlg(ctx, rejectDlg(s, ctx.data.kind)); });
  SC.action('rejectPaymentConfirm', (s, ctx) => {
    const a = A(s), reason = (a.rejectReason || '').trim(); if (!reason) return;
    const x = payItems(s).find(i => i.kind === ctx.data.kind); if (!x) { ctx.close(); return; }
    a.rejects.unshift({ kind: x.kind, title: x.title, from: x.from, amount: x.amount, ref: x.ref, reason });
    if (x.kind === 'trial') { s.request.check.state = 'asked'; ctx.line('patient', { key: 'teamReply', text: `ทีม SynaClair: สลิปยังไม่ครบ (${reason}) รบกวนโอนส่วนที่ขาดหรือส่งสลิปใหม่ในแชตนี้ได้เลยค่ะ ทีมยังหานักกายภาพให้ตามปกติ` }); }
    else { s.course.slip = null; ctx.line('pt', { key: 'teamReply', text: `ทีม SynaClair: สลิปคอร์สของ ${patientName(s)} ยังตรวจไม่ผ่าน (${reason}) รบกวนส่งใหม่ค่ะ` }); }
    a.rejectReason = ''; ctx.close();
    ctx.toast(x.kind === 'trial' ? 'แจ้งผู้รับบริการใน LINE แล้ว การจับคู่เดินต่อตามปกติ' : `ตีกลับแล้ว แจ้ง ${meName(s)} ใน LINE ให้ส่งสลิปใหม่`);
  });

  /* ================= auto slip check + auto match (Boss 29 Oct) =================
     Admin is no longer the bottleneck: when the patient sends a slip the system reads it (amount, payee, transfer time, reference
     not used before) and the request goes straight to matching. Clean slip → receipt in LINE. Odd slip → matching still goes ahead,
     no receipt yet, and admin gets one "สลิปผิดปกติ" task to confirm or ask the patient. Matching offers the PT the patient asked for,
     or the PT whose zone covers the district; if nobody fits, the request waits for admin in "จับคู่ PT" as before.
     Real build: slip-reading service (bank slip verify API / QR payload) + the same candidate rules as a.match. */
  const ODD = 'ยอดในสลิป ฿1,500 ไม่ตรงกับยอดที่ต้องชำระ ฿1,599';
  SC.autoPay = (s, line) => {
    const r = s.request; if (!r) return;
    const odd = r.slip === 'odd';
    r.check = odd ? { ok: false, reasons: [ODD], state: 'open' } : { ok: true, reasons: [], state: 'auto' };
    r.status = 'PAID';
    if (odd) line('admin', { key: 'slipFlag', text: `ระบบตรวจสลิป ${r.ref}: ${ODD} · ระบบจับคู่ PT ต่อไปแล้ว รบกวนแอดมินดูสลิปนี้` });
    else line('patient', { key: 'receipt' });
    line('patient', { key: 'intakeMatching' });
    const mc = meCandidate(s);
    if (mc && mc.ok && (mc.zoneOk || mc.preferred) && !mc.warn) { r.status = 'OFFERED'; r.offerTo = ['me']; r.auto = mc.preferred ? 'ผู้รับบริการขอคนนี้' : 'ตรงเขตที่รับงาน'; line('pt', { key: 'ptOffer' }); }
  };

  /* ================= a.match ================= */
  function meCandidate(s) {
    const r = s.request, d = district(s);
    if (s.pt.status === 'NONE') return null;
    const zoneOk = covers(s.pt.zones || [], d);
    const preferred = r.preferredPt === 'me';
    const st = level(score(s, 'me'));
    let ok = true, reason, warn = '';
    if (s.pt.status !== 'VERIFIED') { ok = false; reason = 'ใบประกอบยังรอตรวจ · อนุมัติก่อนจึงส่งงานได้'; }
    else if (st === 'PAUSED') { ok = false; reason = 'พักรับงานใหม่ชั่วคราว · รอทีมทบทวน'; }
    else if (zoneOk) reason = `ตรงพื้นที่ · รับงานใน${d}`;
    else { reason = `รับงาน: ${(s.pt.zones || []).join(' · ') || 'ยังไม่ระบุ'}`; warn = preferred ? `ผู้รับบริการขอคนนี้ แต่ PT ไม่ได้ลงเขต${d} · โทรถาม PT ก่อนส่ง` : `PT ไม่ได้ลงเขต${d} · โทรถามก่อนส่ง`; }
    return { id: 'me', ok, zoneOk, preferred, reason, warn, warned: st === 'WARNING' };
  }
  SC.screen('a.match', {
    role: 'admin',
    render(s) {
      const r = s.request, a = A(s);
      const head = { kick: r && r.auto ? 'ระบบจับคู่ให้อัตโนมัติ' : 'เลือก PT ด้วยตนเอง', title: 'จับคู่ PT', sub: 'แสดงเฉพาะเขตและเวลาที่ผู้รับบริการสะดวก ไม่มีที่อยู่เต็มในหน้านี้' };
      if (!r || ['PAYMENT_PENDING', 'SLIP_SENT'].includes(r.status)) {
        const cta = r && r.status === 'SLIP_SENT' ? '<button class="btn" data-go="a.payments">ไปตรวจสลิป</button>' : '';
        return shell(s, 'a.match', head, `<div class="card flat">${ui.empty('users-round', 'ยังไม่มีคำขอที่รอจับคู่', r ? `คำขอ ${r.ref} ${'รอผู้รับบริการชำระเงินก่อน'} ระบบจับคู่ให้ทันทีที่ได้สลิป` : 'เมื่อผู้รับบริการประเมินอาการและชำระ ClairConnect Trial แล้ว คำขอจะขึ้นที่นี่', cta)}</div>`);
      }
      const d = district(s), z = zoneOf(d);
      const wins = s.patient.windows || [];
      const bar = Object.values(s.patient.barthel || {}).filter(v => typeof v === 'number');
      const reqCard = `<article class="card flat">
        <div class="row between wrap"><b class="h2">${esc(patientName(s))}</b>${reqPill(r)}</div>
        ${kv([['เลขคำขอ', esc(r.ref)], ['เขต', esc(d ? `${d}${z ? ` · ${z.name}` : ''}` : 'ยังไม่ระบุ')], ['จองให้', s.patient.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัว' : 'ตัวเอง'], ['เป้าหมาย', esc(goalText(s) || '—')],
          bar.length ? ['กิจวัตรประจำวัน', `Barthel ${bar.reduce((t, v) => t + v, 0)}/${bar.length * 2} คะแนน`] : null, ['ชำระแล้ว', `ClairConnect Trial ${money(SC.TRIAL)}`]])}
        ${wins.length ? `<div class="stack"><span class="label">เวลาที่สะดวก</span>${wins.map((w, i) => `<span class="small">${i === 0 ? 'เวลาหลัก' : 'เวลาสำรอง ' + i} · ${esc(w)}</span>`).join('')}</div>` : ''}
      </article>`;
      if (r.status === 'OFFERED' || r.status === 'BOOKED') {
        const names = (r.offerTo || []).map(id => esc(ptName(s, id))).join(', ') || '—';
        const sent = r.status === 'OFFERED'
          ? `<article class="card flat"><div class="row"><span class="tile">${I('send')}</span><div class="grow"><b class="h3">ส่งข้อเสนอแล้ว รอ PT ตอบรับภายใน 30 นาที</b><p class="p">ส่งให้ ${names} · ${esc(wins[a.win] || wins[0] || '')}</p>${r.auto ? `<span class="pill info">${I('zap')}ระบบส่งให้เอง · ${esc(r.auto)}</span>` : ''}</div></div>
              <p class="small">ถ้าไม่มีใครตอบใน 30 นาที ระบบขยายการค้นหา ครบสองรอบแล้วทีมช่วยประสานเอง</p>
              <div class="aa-acts"><button class="btn ghost" data-act="remindOffer">${I('bell')}เตือน PT ใน LINE อีกครั้ง</button></div></article>`
          : `<article class="card flat"><div class="row"><span class="tile">${I('circle-check')}</span><div class="grow"><b class="h3">PT รับงานแล้ว</b><p class="p">${names} · ${esc(SC.VISIT1.date)} ${esc(SC.VISIT1.time)}</p></div></div>
              <div class="aa-acts"><button class="btn ghost" data-go="a.appts">${I('calendar-days')}ดูนัดหมาย</button></div></article>`;
        return shell(s, 'a.match', head, `<div class="aa-split">${reqCard}<div class="stack lg">${sent}</div></div>`);
      }
      const mc = meCandidate(s);
      if (a.tick == null || a.tickRef !== r.ref) { a.tick = mc && mc.ok && mc.preferred && mc.zoneOk ? ['me'] : []; a.tickRef = r.ref; }
      if (mc && !mc.ok) a.tick = a.tick.filter(id => id !== 'me');
      const banner = r.preferredPt ? (r.preferredPt === 'me'
        ? (mc && mc.ok && mc.zoneOk ? `<div class="note mint">${I('heart-handshake')} ผู้รับบริการขอ <b>${esc(meName(s))}</b> จากหน้าโปรไฟล์ (ขอคนนี้) · เลือกไว้ให้แล้ว ยังเป็นการตัดสินใจของทีม</div>` : `<div class="note">ผู้รับบริการขอ <b>${esc(meName(s))}</b> จากหน้าโปรไฟล์ (ขอคนนี้) · ${esc(mc ? (mc.ok ? 'ยังไม่ได้เลือกให้ เพราะเขตไม่ตรง ดูด้านล่าง' : mc.reason) : 'ยังไม่มีในทีม')}</div>`)
        : `<div class="note">ผู้รับบริการขอ <b>${esc(ptName(s, r.preferredPt))}</b> ${ui.sample()} · ช่วงนี้ยังส่งให้ไม่ได้ ดูเหตุผลด้านล่าง หรือประสาน PT ก่อน</div>`) : '';
      const pick = (id, on, title, lines, tags) => `<button class="aa-pick" data-toggle="admin.tick" data-value="${id}" aria-pressed="${on}"><span class="aa-box">${on ? I('check') : ''}</span><span class="grow"><span class="row wrap" style="gap:6px"><span class="t">${title}</span>${tags}</span>${lines}</span></button>`;
      const off = (title, lines, tags) => `<div class="aa-pick off" aria-disabled="true"><span class="aa-box"></span><span class="grow"><span class="row wrap" style="gap:6px"><span class="t">${title}</span>${tags}</span>${lines}</span></div>`;
      const meRow = mc ? (mc.ok
        ? pick('me', a.tick.includes('me'), esc(meName(s)), `<span class="s">${esc(mc.reason)}</span><span class="s">${ratingText(meRating(s))}</span>${mc.warn ? `<span class="s" style="color:var(--red)">${I('triangle-alert')} ${esc(mc.warn)}</span>` : ''}`,
            `${mc.preferred ? '<span class="pill gold">ผู้รับบริการขอคนนี้</span>' : ''}${mc.zoneOk ? '' : '<span class="pill warn">เขตไม่ตรง</span>'}${mc.warned ? '<span class="pill wait">เรียงไว้ท้าย</span>' : ''}`)
        : off(esc(meName(s)), `<span class="s">${esc(mc.reason)}</span>`, mc.preferred ? '<span class="pill gold">ผู้รับบริการขอคนนี้</span>' : '')) : '';
      const others = SAMPLES.map(x => off(`${esc(x.name)} ${ui.sample()}`, `<span class="s">ยังไม่ได้ลงเวลาช่วงนี้ · รับงาน: ${esc(x.zones.join(' · '))}</span><span class="s">${ratingText(x.rating)}</span>`, r.preferredPt === x.id ? '<span class="pill gold">ผู้รับบริการขอคนนี้</span>' : '')).join('');
      const recCount = mc && mc.ok ? 1 : 0;
      const picks = `<article class="card flat">
        <div class="row between wrap"><b class="h3">เลือก PT พร้อมกัน 1–4 คน</b><span class="small">แนะนำ ${recCount} คน</span></div>
        <p class="small" style="margin:0">แนะนำจากเวลาที่ลงและเขตที่รับงานเท่านั้น ยังต้องดูเส้นทางจริงก่อนตัดสินใจ</p>
        ${banner}
        ${meRow ? `<div class="stack"><span class="label">แนะนำให้ส่ง</span>${meRow}</div>` : `<p class="p">ยังไม่มี PT ที่ส่งได้ในเขตนี้</p>`}
      </article>`;
      // Palm (23 Oct): time + price + send sit right under "แนะนำให้ส่ง"; the long "can't send" list moves below and folds, so phones don't scroll past it.
      const notYet = `<details class="card flat aa-more"><summary class="row between"><span class="label">ยังส่งไม่ได้ ${SAMPLES.length} คน · ดูเหตุผล</span>${I('chevron-down')}</summary><div class="stack">${others}</div></details>`;
      const winCard = wins.length ? `<article class="card flat"><b class="h3">เลือกเวลาที่ผู้รับบริการเสนอ</b><div class="stack">${wins.map((w, i) => `<button class="aa-pick" data-pick="admin.win" data-value="${i}" aria-pressed="${a.win === i}"><span class="aa-box" style="border-radius:50%">${a.win === i ? I('check') : ''}</span><span class="grow"><span class="t">${i === 0 ? 'เวลาหลัก' : 'เวลาสำรอง ' + i}</span><span class="s">${esc(w)}</span></span></button>`).join('')}</div></article>` : '';
      const send = `<article class="card flat"><div class="row between wrap"><span class="label">ราคา</span><span><b class="money">ClairConnect Trial ${money(SC.TRIAL)}</b> <span class="small">· ชำระแล้ว · ไม่มีค่าเดินทางแยก</span></span></div>
        <button class="btn" data-act="sendOffer" data-need="admin.tick">${I('send')}ส่งข้อเสนอให้ PT ที่เลือก${a.tick.length ? ` (${a.tick.length} คน)` : ''}</button>
        <p class="small" style="margin:0">PT ได้การ์ดใน LINE และต้องตอบรับภายใน 30 นาที</p></article>`;
      return shell(s, 'a.match', head, `<div class="aa-split">${reqCard}<div class="stack lg">${picks}${winCard}${send}${notYet}</div></div>`);
    }
  });
  SC.action('sendOffer', (s, ctx) => {
    const a = A(s), r = s.request; if (!r || r.status !== 'PAID' || !a.tick || !a.tick.length) return;
    r.status = 'OFFERED'; r.offerTo = a.tick.slice();
    ctx.line('pt', { key: 'ptOffer' });
    ctx.toast(`ส่งข้อเสนอให้ PT ${r.offerTo.length} คนแล้ว รอตอบรับภายใน 30 นาที`);
  });
  SC.action('remindOffer', (s, ctx) => { ctx.line('pt', { key: 'ptOffer' }); ctx.toast('ส่งการ์ดข้อเสนอให้ PT ใน LINE อีกครั้งแล้ว'); });

  /* ================= a.appts ================= */
  SC.screen('a.appts', {
    role: 'admin',
    render(s) {
      const r = s.request;
      const note = r && r.status === 'OFFERED' ? `<div class="note">${I('hourglass')} ส่งข้อเสนอให้ PT แล้ว นัดจะขึ้นที่นี่เมื่อ PT ตอบรับ</div>` : '';
      const pill = x => x.step >= 4 ? '<span class="pill">เสร็จแล้ว</span>' : x.step === 0 ? '<span class="pill info">นัดแล้ว</span>' : `<span class="pill wait">${STEP[x.step]}</span>`;
      const body = s.visits.length
        ? table(['นัด', 'นักกายภาพ', 'วันเวลา', 'สถานะ', ''], s.visits.map(x => ({ attrs: `data-act="openAppt" data-n="${x.n}"`, cells: [`<div class="t">${esc(patientName(s))}</div><span class="small">ครั้งที่ ${x.n}</span>`, esc(meName(s)), `${esc(x.date)}<br><span class="small">${esc(x.time)}</span>`, `<div class="stack" style="gap:4px;justify-items:start">${pill(x)}${x.published ? '<span class="small">ส่งสรุปแล้ว</span>' : ''}</div>`, `<button class="ib" data-act="openAppt" data-n="${x.n}" aria-label="ดูรายละเอียดนัดครั้งที่ ${x.n}">${I('chevron-right')}</button>`] })))
        : `<div class="card flat">${ui.empty('calendar-days', 'ยังไม่มีนัด', 'นัดจะขึ้นเมื่อ PT ตอบรับข้อเสนอ หรือเมื่อทีมยืนยันเงินคอร์สและวันนัดครั้งต่อไป')}</div>`;
      return shell(s, 'a.appts', { kick: 'นัดหมาย', title: 'นัดหมาย', sub: 'ทุกนัดในระบบ กดที่แถวเพื่อดูขั้นตอนวันทำเคสและสรุปผล' }, note + body);
    }
  });
  SC.action('openAppt', (s, ctx) => {
    const x = s.visits.find(v => v.n === +ctx.data.n); if (!x) return;
    const steps = STEP.map((t, i) => `<div class="step ${i < x.step || x.step === 4 ? 'done' : i === x.step ? 'now' : ''}"><span class="dot">${i < x.step || x.step === 4 ? I('check') : i + 1}</span><div><div class="t">${t}</div></div></div>`).join('');
    const so = x.soap || {};
    const report = x.published ? `<div class="card mint"><b class="h3">สรุปที่ส่งให้คนไข้แล้ว</b>${kv([so.goal ? ['เป้าหมาย', esc(so.goal)] : null, so.dx ? ['การวินิจฉัย', esc(so.dx)] : null, so.p ? ['แผน', esc(so.p)] : null, so.family ? ['ฝากญาติ', esc(so.family)] : null])}</div>` : '<div class="note">ยังไม่ส่งสรุปผล PT ส่งหลังจบเคส</div>';
    openSheet(ctx, `${sheetHead(`ครั้งที่ ${x.n} · ${patientName(s)}`, `${x.date} ${x.time}`)}
      ${kv([['นักกายภาพ', esc(meName(s))], ['เขต', esc(district(s) || '—')], ['สถานะ', esc(STEP[x.step])]])}
      <div class="steps">${steps}</div>${report}
      ${x.step === 0 ? `<button class="btn ghost" data-act="remindAppt">${I('bell')}ส่งการ์ดเตือนนัดให้คนไข้</button>` : ''}
      <button class="btn ghost" data-close>ปิด</button>`);
  });
  SC.action('remindAppt', (s, ctx) => { ctx.line('patient', { key: 'tomorrow' }); ctx.close(); ctx.toast('ส่งการ์ดเตือนนัดให้คนไข้ใน LINE แล้ว'); });

  /* ================= a.pts ================= */
  function ptRow(s, id) {
    if (id === 'me') return { id, name: meName(s), photo: s.pt.photo, hue: null, sample: false, verified: s.pt.status === 'VERIFIED', zones: s.pt.zones || [], rating: meRating(s), cases: meCases(s), bio: s.pt.bio, posts: s.pt.posts.length };
    const x = SAMPLES.find(p => p.id === id);
    return { id, name: x.name, photo: null, hue: x.hue, sample: true, verified: true, zones: x.zones, rating: x.rating, cases: x.cases, bio: x.bio, posts: x.post ? 1 : 0 };
  }
  SC.screen('a.pts', {
    role: 'admin',
    render(s) {
      const rows = roster(s).map(id => {
        const p = ptRow(s, id), st = standing(s, id);
        return { attrs: `data-act="openPtRow" data-id="${id}"`, cells: [`<div class="row">${ui.avatar(p.name, p.photo, 36, p.hue)}<div class="grow stack" style="gap:3px;justify-items:start"><div class="t">${esc(p.name)}</div><span class="row wrap" style="gap:6px">${p.verified ? '<span class="ver">' + I('badge-check') + 'ใบประกอบยืนยันแล้ว</span>' : '<span class="pill wait">รอตรวจใบประกอบ</span>'}${p.sample ? ui.sample() : ''}</span></div></div>`, esc(p.zones.join(' · ') || '—'), `${ratingText(p.rating)}<br><span class="small">จบแล้ว ${p.cases} เคส</span>`, `<span class="pill ${st[1]}">${st[0]}</span>`] };
      });
      const kp = `<div class="kpis k3"><div class="kpi"><b>${roster(s).length}</b><span>PT ในระบบ</span></div><div class="kpi"><b>${roster(s).filter(id => ptRow(s, id).verified).length}</b><span>ยืนยันใบประกอบแล้ว</span></div><div class="kpi"><b>${roster(s).filter(id => level(score(s, id)) === 'PAUSED').length}</b><span>พักรับงานใหม่</span></div></div>`;
      return shell(s, 'a.pts', { kick: 'ทีม PT', title: 'ทีม PT', sub: 'กดที่แถวเพื่อดูโปรไฟล์ สถานะการรับงานมาจากหน้าเฝ้าระวัง PT ไม่เห็นสถานะนี้' }, kp + table(['นักกายภาพ', 'เขตที่รับงาน', 'รีวิวและเคส', 'การรับงาน'], rows));
    }
  });
  SC.action('openPtRow', (s, ctx) => {
    const id = ctx.data.id, p = ptRow(s, id), st = standing(s, id);
    const pic = p.photo ? `<img class="aa-photo" style="width:72px;height:72px" src="${esc(photoSrc(p.photo))}" alt="รูป ${esc(p.name)}">` : ui.avatar(p.name, null, 72, p.hue);
    openSheet(ctx, `${sheetHead(p.name, p.sample ? 'ข้อมูลตัวอย่าง' : 'นักกายภาพในห้องซ้อม')}
      <div class="row">${pic}<div class="grow stack" style="gap:4px">${p.sample ? ui.sample() : ''}${p.verified ? '<span class="ver">' + I('badge-check') + 'ใบประกอบยืนยันแล้ว</span>' : '<span class="pill wait">รอตรวจใบประกอบ</span>'}<span class="pill ${st[1]}" style="justify-self:start">${st[0]}</span></div></div>
      ${p.bio ? `<p class="p">${esc(p.bio)}</p>` : ''}
      ${kv([id === 'me' ? ['ชื่อจริง', esc(s.pt.legalName || '—')] : null, id === 'me' ? ['เลขใบประกอบ', esc(s.pt.license || '—')] : null, ['เขตที่รับงาน', esc(p.zones.join(' · ') || '—')], ['คะแนนรีวิว', ratingText(p.rating)], ['เคสที่จบ', String(p.cases)], ['โพสต์', `${p.posts} โพสต์`],
        id === 'me' ? ['XP', `<span class="xp-pill">${I('sparkles')}${s.pt.xp} XP</span>`] : null, id === 'me' ? ['ตารางเวลา', s.pt.schedule && s.pt.schedule.sent ? 'ส่งแล้ว' : 'ยังไม่ส่ง'] : null, id === 'me' ? ['ข้อตกลง PT', s.pt.agreement ? 'ยอมรับแล้ว' : 'ยังไม่ยอมรับ'] : null])}
      <div class="stack"><button class="btn ghost" data-act="suspicionReport" data-pt="${id}">${I('shield-alert')}บันทึกเรื่องที่คนไข้แจ้ง</button><button class="btn ghost" data-close>ปิด</button></div>`);
  });

  /* ================= a.patients ================= */
  SC.screen('a.patients', {
    role: 'admin',
    render(s) {
      const r = s.request;
      if (!r) return shell(s, 'a.patients', { kick: 'ผู้รับบริการ', title: 'คนไข้' }, `<div class="card flat">${ui.empty('heart-handshake', 'ยังไม่มีผู้รับบริการ', 'เมื่อมีคนประเมินอาการและส่งคำขอ รายชื่อจะขึ้นที่นี่')}</div>`);
      const c = s.course;
      const course = c ? (c.approved ? `<span class="pill">คอร์ส ${c.sessions} ครั้ง · ใช้แล้ว ${c.used || 0}</span>` : '<span class="pill wait">รอตรวจเงินคอร์ส</span>') : '<span class="small">ยังไม่มีคอร์ส</span>';
      const rows = [{ attrs: 'data-act="openPatient"', cells: [`<div class="t">${esc(patientName(s))}</div><span class="small">${esc(r.ref)}</span>`, esc(district(s) || '—'), r.preferredPt ? esc(ptName(s, r.preferredPt)) : '<span class="small">ให้ทีมเลือก</span>', reqPill(r), course, `<button class="ib" data-act="openPatient" aria-label="ดูรายละเอียด">${I('chevron-right')}</button>`] }];
      return shell(s, 'a.patients', { kick: 'ผู้รับบริการ', title: 'คนไข้', sub: 'ข้อมูลส่วนตัวเปิดดูได้เฉพาะทีมที่ดูแลเคส กดที่แถวเพื่อดูรายละเอียด' }, table(['ผู้รับบริการ', 'เขต', 'PT ที่ขอ', 'สถานะ', 'คอร์ส', ''], rows));
    }
  });
  SC.action('openPatient', (s, ctx) => {
    const r = s.request; if (!r) return;
    const ad = s.patient.address || {}, c = s.course;
    const addr = [ad.line, ad.subdistrict, ad.district, ad.province, ad.postal].filter(Boolean).join(' ');
    openSheet(ctx, `${sheetHead(patientName(s), r.ref)}
      ${kv([['สถานะ', reqPill(r)], ['จองให้', s.patient.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัว' : 'ตัวเอง'], ['โทร', esc(s.patient.phone || '—')], ['ที่อยู่', esc(addr || '—')], ['เป้าหมาย', esc(goalText(s) || '—')], ['เรื่องสุขภาพที่เล่า', esc(s.patient.healthStory || '—')], ['ออกจาก รพ. / ข้อห้ามแพทย์', s.patient.health && s.patient.health.q4 === 'YES' ? esc(s.patient.medNote || 'มี (ยังไม่ได้เล่า)') : '—'], ['ผ่าตัด / อุปกรณ์ในร่างกาย', s.patient.health && s.patient.health.q5 === 'YES' ? esc(s.patient.surgeryNote || 'เคย (ยังไม่ระบุ)') : '—'], ['อุปกรณ์ที่ใช้', s.patient.health && s.patient.health.q3 === 'YES' ? esc((s.patient.devices || []).map(d => d === 'อื่น ๆ' && s.patient.deviceOther ? s.patient.deviceOther : d).join(' · ') || 'มี (ยังไม่ระบุ)') : '—'], ['โรคประจำตัว', s.patient.health && s.patient.health.q6 === 'YES' ? esc((s.patient.conditions || []).map(c => c === 'อื่น ๆ' && s.patient.conditionOther ? s.patient.conditionOther : c).join(' · ') || 'มี (ยังไม่ระบุ)') : '—'], ['ความดันล่าสุด', (() => { const b = s.patient.bp, c = SC.bpCat(b); return b && b.unknown ? 'ไม่ทราบค่า' : c ? `${esc(b.sys)}/${esc(b.dia)} mmHg · <span class="pill ${c.tone === 'ok' ? '' : c.tone}">${c.label}</span>` : '—'; })()], ['เวลาที่สะดวก', (s.patient.windows || []).map(esc).join('<br>') || '—'], ['PT ที่ขอ', r.preferredPt ? esc(ptName(s, r.preferredPt)) : 'ให้ทีมเลือก'],
        ['คอร์ส', c ? esc(`${c.sessions} ครั้ง ${money(c.total)} · ${c.approved ? `ใช้แล้ว ${c.used || 0} ครั้ง` : 'รอตรวจเงิน'}`) : 'ยังไม่มี'], ['นัดถัดไป', esc((s.visits.find(x => x.step < 4) || {}).date || '—')]])}
      <div class="grid2"><button class="btn ghost" data-act="callPatient">${I('phone')}โทรหา</button><button class="btn ghost" data-go="a.appts">${I('calendar-days')}ดูนัดหมาย</button></div>`);
  });
  SC.action('callPatient', (s, ctx) => { ctx.toast(`ห้องซ้อม: ระบบจริงโทรออกไปที่ ${s.patient.phone || 'เบอร์ผู้รับบริการ'}`); });

  /* ================= a.reviews ================= */
  SC.screen('a.reviews', {
    role: 'admin',
    render(s) {
      const a = A(s), rv = s.review, d = district(s) || '—';
      let consented = '', starsOnly = '', follow = '';
      if (rv && rv.consent) {
        const status = rv.hidden ? '<span class="pill gray">ซ่อนจากหน้าเว็บ</span>' : rv.approved ? '<span class="pill">แสดงบนหน้าเว็บอยู่</span>' : '<span class="pill wait">รออนุมัติ</span>';
        const btn = rv.approved && !rv.hidden ? `<button class="btn ghost" data-act="hideReview">${I('eye-off')}ซ่อนจากหน้าเว็บ</button>`
          : rv.hidden ? `<button class="btn" data-act="approveReview">${I('eye')}แสดงอีกครั้ง</button>`
          : `<button class="btn" data-act="approveReview">${I('check')}อนุมัติให้แสดง</button><button class="btn ghost" data-act="hideReview">${I('eye-off')}ซ่อนจากหน้าเว็บ</button>`;
        consented = `<article class="card flat"><div class="row between wrap">${ui.stars(rv.stars)}${status}</div>${ui.rateTags(rv.liked)}${(rv.improve || []).length ? `<span class="small">อยากให้ดีขึ้น</span>${ui.rateTags(rv.improve)}` : ''}${rv.text ? `<p class="aa-quote">“${esc(rv.text)}”</p>` : '<p class="small">ไม่มีข้อความ ให้แค่ดาว</p>'}<span class="small">${esc(d)} · ถึง ${esc(meName(s))} · ไม่แสดงชื่อผู้รีวิว</span><div class="aa-acts">${btn}</div></article>`;
      } else if (rv) {
        starsOnly = `<article class="card flat"><div class="row between wrap">${ui.stars(rv.stars)}<span class="pill gray">ไม่ยินยอมให้แสดงข้อความ</span></div><span class="small">${esc(d)} · ถึง ${esc(meName(s))} · ใช้คิดคะแนนเฉลี่ยของ PT เท่านั้น</span></article>`;
      }
      const sample = SAMPLES.filter(x => x.quote).map(x => `<article class="card flat"><div class="row between wrap"><span>${ui.stars(x.quote.stars)} ${ui.sample()}</span><span class="pill">แสดงบนหน้าเว็บอยู่</span></div><p class="aa-quote">“${esc(x.quote.text)}”</p><span class="small">${esc(x.quote.area)} · ถึง ${esc(x.name)}</span></article>`).join('');
      if (rv && rv.needsContact) {
        follow = `<section class="aa-sec"><h2 class="h3">ขอให้ทีมติดต่อกลับ</h2><article class="card flat"><div class="row between wrap"><b class="h3">${esc(patientName(s))}</b>${a.contacted ? '<span class="pill">โทรแล้ว</span>' : '<span class="pill wait">รอโทร</span>'}</div><span class="small">${ui.stars(rv.stars)} · หลังทำเคสกับ ${esc(meName(s))} · โทร ${esc(s.patient.phone || '—')}</span>
          <div class="aa-acts"><button class="btn ghost" data-act="callPatient">${I('phone')}โทรหา</button>${a.contacted ? '' : `<button class="btn" data-act="markContacted">${I('check')}บันทึกว่าโทรแล้ว</button>`}</div></article></section>`;
      }
      const main = consented || sample ? `<section class="aa-sec"><h2 class="h3">รีวิวที่ผู้รับบริการยินยอมให้แสดง</h2><p class="aa-sub" style="margin:0">ตรวจข้อความก่อนขึ้นหน้าแรกและหน้านักกายภาพ ระบบไม่แสดงชื่อผู้รีวิว แสดงแค่เขตและดาว</p>${consented}${sample}</section>` : '';
      const empty = !rv ? `<div class="card flat">${ui.empty('star', 'ยังไม่มีรีวิวใหม่', 'หลังผู้รับบริการให้คะแนนหลังทำเคส รีวิวจะขึ้นที่นี่')}</div>` : '';
      const other = starsOnly ? `<section class="aa-sec"><h2 class="h3">คะแนนที่ไม่ขอแสดงข้อความ</h2>${starsOnly}</section>` : '';
      return shell(s, 'a.reviews', { kick: 'คุณภาพบริการ', title: 'รีวิว', sub: 'อนุมัติก่อนขึ้นเว็บ และติดตามคนที่ขอให้ทีมติดต่อกลับ' }, empty + follow + main + other);
    }
  });
  SC.action('approveReview', (s, ctx) => { if (!s.review) return; s.review.approved = true; s.review.hidden = false; ctx.toast('แสดงรีวิวบนหน้าเว็บแล้ว'); });
  SC.action('hideReview', (s, ctx) => { if (!s.review) return; s.review.hidden = true; ctx.toast('ซ่อนรีวิวจากหน้าเว็บแล้ว'); });
  SC.action('markContacted', (s, ctx) => { A(s).contacted = true; ctx.toast('บันทึกว่าโทรคุยกับผู้รับบริการแล้ว'); });

  /* ================= a.suspicion ================= */
  SC.screen('a.suspicion', {
    role: 'admin',
    render(s) {
      const ids = roster(s).filter(id => score(s, id) > 0);
      const lv = `<div class="aa-lv"><div><b>20 · เฝ้าดู</b><span>${LEVEL.WATCH[2]}</span></div><div><b>40 · เตือน</b><span>${LEVEL.WARNING[2]}</span></div><div><b>60 · พักรับงานใหม่</b><span>${LEVEL.PAUSED[2]}</span></div></div>`;
      const pts = `<details class="aa-more"><summary>คะแนนแต่ละเรื่อง (นับ 90 วัน)</summary><ul>
        <li>คนไข้แจ้งพร้อมหลักฐาน เช่น แชตหรือสลิป +60</li><li>คนไข้แจ้งแต่ไม่มีหลักฐาน +20</li><li>PT ยกเลิกหรือเลื่อน แล้วคนไข้ไม่จองต่อใน 30 วัน +10</li><li>คอร์สยังมีครั้งเหลือแต่ไม่มีนัดเกิน 21 วัน +8</li><li>คืนเงินคอร์สหลังเจอ PT คนเดิม 1–2 ครั้ง +8</li><li>ครั้งแรกเสนอคอร์สต่อแต่ไม่มีนัดใน 30 วัน +5</li><li>อัตรานัดต่อต่ำกว่าครึ่งของค่าเฉลี่ย (ตั้งแต่ 5 เคสแรก) +10 ต่อเดือน</li><li>คนไข้เรียนคอร์สจบ −5</li>
        <li>ห้องซ้อมคำนวณเฉพาะเรื่องที่คนไข้แจ้ง ส่วนสัญญาณจากนัดและคอร์ส ระบบจริงคำนวณทุก 6 ชั่วโมง</li></ul></details>`;
      const tbl = ids.length ? table(['นักกายภาพและเรื่องล่าสุด', 'คะแนน', 'ระดับและสิ่งที่ระบบทำ', ''], ids.map(id => {
        const n = score(s, id), L = LEVEL[level(n)], last = reports(s, id)[0];
        return { cells: [`<div class="t">${esc(ptName(s, id))}</div>${id === 'me' ? '' : ui.sample()}${last ? `<div class="small">ล่าสุด: ${esc(last.text)} · ${last.evidence ? 'มีหลักฐาน' : 'ไม่มีหลักฐาน'}</div>` : ''}`, `<b>${n}</b>`, `<div class="stack" style="gap:4px;justify-items:start"><span class="pill ${L[1]}">${L[0]}</span><span class="small">${esc(L[2] || 'ยังไม่ถึงเกณฑ์ 20')}</span></div>`, `<button class="btn sm ghost" data-act="openClear" data-pt="${id}">เคลียร์</button>`] };
      })) : `<div class="card flat">${ui.empty('shield-check', 'ไม่มี PT ที่คะแนนถึง 20', 'เมื่อคนไข้แจ้งว่า PT ชวนจ่ายนอกระบบ ให้กด "บันทึกเรื่องที่คนไข้แจ้ง" ด้านบน')}</div>`;
      const clears = (s.suspicion.clears || []);
      const hist = clears.length ? `<section class="aa-sec"><h2 class="h3">ประวัติการเคลียร์</h2>${table(['นักกายภาพ', 'ผลการตรวจสอบ', 'วันที่'], clears.map(c => ({ cells: [esc(ptName(s, c.pt)), esc(c.reason), esc(c.at)] })))}</section>` : '';
      const right = `<button class="btn" data-act="suspicionReport">${I('plus')}บันทึกเรื่องที่คนไข้แจ้ง</button>`;
      return shell(s, 'a.suspicion', { kick: 'ทีม PT', title: 'เฝ้าระวังนัดนอกระบบ', sub: 'คะแนนรวมจากเรื่องที่คนไข้แจ้งและสัญญาณจากนัดหรือคอร์ส แต่ละเรื่องนับ 90 วัน ทุกขั้นย้อนคืนได้', right },
        `<div class="note mint">${I('eye-off')} PT ไม่เห็นหน้านี้และไม่เห็นคะแนน แบนถาวรต้องมีหลักฐานและให้ PT ชี้แจงก่อน ทำนอกหน้านี้</div>${lv}${pts}<section class="aa-sec"><h2 class="h3">คะแนนของ PT</h2>${tbl}</section>${hist}`);
    }
  });
  const repSheet = s => {
    const a = A(s), rep = a.rep;
    return `${sheetHead('บันทึกเรื่องที่คนไข้แจ้ง', 'คนไข้แจ้งว่า PT ชวนจ่ายนอกระบบ')}
      <div class="field"><span>PT</span><div class="chips">${roster(s).map(id => `<button class="chip ${rep.pt === id ? 'on' : ''}" data-act="repPick" data-pt="${id}">${esc(ptName(s, id))}${id === 'me' ? '' : ' (ตัวอย่าง)'}</button>`).join('')}</div></div>
      <div class="field"><span>หลักฐาน</span>
        <button class="aa-pick" data-act="repEvidence" data-v="1" aria-pressed="${!!rep.evidence}"><span class="aa-box" style="border-radius:50%">${rep.evidence ? I('check') : ''}</span><span class="grow"><span class="t">มีหลักฐาน เช่น แชตหรือสลิป</span><span class="s">+60 พักรับงานใหม่ทันที</span></span></button>
        <button class="aa-pick" data-act="repEvidence" data-v="0" aria-pressed="${!rep.evidence}"><span class="aa-box" style="border-radius:50%">${!rep.evidence ? I('check') : ''}</span><span class="grow"><span class="t">ไม่มีหลักฐาน</span><span class="s">+20</span></span></button></div>
      <label class="field"><span>สิ่งที่คนไข้เล่า</span><textarea class="in" maxlength="1000" data-bind="admin.rep.text" placeholder="เช่น PT ส่งเลขบัญชีส่วนตัวทาง LINE และเสนอราคาถูกกว่า">${esc(rep.text)}</textarea></label>
      <button class="btn" data-act="saveReport" data-need="admin.rep.pt,admin.rep.text">บันทึก</button>`;
  };
  SC.action('suspicionReport', (s, ctx) => { const a = A(s); a.rep = { pt: ctx.data.pt || (roster(s)[0] || ''), text: '', evidence: false }; openSheet(ctx, repSheet(s)); });
  SC.action('repPick', (s, ctx) => { A(s).rep.pt = ctx.data.pt; openSheet(ctx, repSheet(s)); });
  SC.action('repEvidence', (s, ctx) => { A(s).rep.evidence = ctx.data.v === '1'; openSheet(ctx, repSheet(s)); });
  SC.action('saveReport', (s, ctx) => {
    const a = A(s), rep = a.rep; if (!rep.pt || !(rep.text || '').trim()) return;
    s.suspicion.reports.unshift({ pt: rep.pt, text: rep.text.trim(), evidence: !!rep.evidence, at: SC.TODAY });
    const n = score(s, rep.pt), name = ptName(s, rep.pt);
    a.rep = { pt: '', text: '', evidence: false }; ctx.close();
    ctx.toast(`บันทึกเรื่องของ ${name} แล้ว · รวม ${n} คะแนน (${LEVEL[level(n)][0]})`);
    if (SC.v.at.admin !== 'a.suspicion') return 'a.suspicion';
  });
  const clearSheet = (s, id) => `${sheetHead(`เคลียร์คะแนนของ ${ptName(s, id)}`, `ตอนนี้ ${score(s, id)} คะแนน`)}
    <label class="field"><span>ผลการตรวจสอบ (เก็บไว้ในประวัติ)</span><textarea class="in" maxlength="500" data-bind="admin.clearReason" placeholder="เช่น โทรถามคนไข้ 3 รายแล้ว ไม่พบการชวนจ่ายนอกระบบ">${esc(A(s).clearReason)}</textarea></label>
    <button class="btn" data-act="clearSuspicion" data-pt="${id}" data-need="admin.clearReason">ยืนยันเคลียร์คะแนน</button>`;
  SC.action('openClear', (s, ctx) => { A(s).clearReason = ''; openSheet(ctx, clearSheet(s, ctx.data.pt)); });
  SC.action('clearSuspicion', (s, ctx) => {
    const a = A(s), id = ctx.data.pt, reason = (a.clearReason || '').trim(); if (!reason) return;
    s.suspicion.reports.forEach(r => { if (r.pt === id) r.cleared = true; });
    (s.suspicion.clears || (s.suspicion.clears = [])).unshift({ pt: id, reason, at: SC.TODAY });
    a.clearReason = ''; ctx.close(); ctx.toast(`เคลียร์คะแนนของ ${ptName(s, id)} แล้ว`);
  });
})();
