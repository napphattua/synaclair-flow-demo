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
  const REQ = { ASSESS_HOLD: ['ประเมินอย่างเดียว · พักจ่าย', 'wait'], CLINICAL_REVIEW: ['รอทีมคลินิกตรวจ', 'wait'], REVIEW_DECLINED: ['ทีมโทรคุยก่อน', 'warn'], PAYMENT_PENDING: ['รอชำระเงิน', 'wait'], SLIP_SENT: ['รอตรวจสลิป', 'wait'], PAID: ['รอจับคู่ PT', 'info'], OFFERED: ['รอ PT ตอบรับ', 'info'], BOOKED: ['นัดแล้ว', ''] };
  const CLOSED = { hold30: 'ปิดเคส · คืนเต็มวันที่ 30', noPt: 'ปิดเคส · หา PT ไม่ได้ คืนเต็ม', ptNoShow: 'ปิดเคส · PT ไปไม่ได้ คืนเต็ม', cancelBefore: 'ปิดเคส · คนไข้ยกเลิก คืนเต็ม', cancelAfter: 'ปิดเคส · คนไข้ยกเลิกหลังเดินทาง' };
  const reqPill = r => { const x = r.closed ? [CLOSED[r.closed] || 'ปิดเคสแล้ว', 'gray'] : REQ[r.status] || [r.status, 'gray']; return `<span class="pill ${x[1]}">${esc(x[0])}</span>`; };
  SC.reqPill = reqPill;
  const STEP = ['นัดแล้ว', 'PT กำลังเดินทาง', 'PT ถึงแล้ว', 'กำลังดูแล', 'เสร็จแล้ว'];
  const goalText = s => SC.goalLabels(s).join(' · ');
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
    /* 7 Nov rehearsal P5: a case closed by a full refund drops its matching and hold tasks. Each task names its owner (proposal, see SC.routeAdmin). */
    const closed = !!(r && r.closed), own = id => (SC.TEAM && SC.TEAM[id]) ? `${SC.TEAM[id].name} (${SC.TEAM[id].role})` : id;
    if (s.pt.status === 'PENDING') t.push({ icon: 'badge-check', tag: 'ตรวจใบประกอบ', title: s.pt.legalName || meName(s), sub: `เลขใบประกอบ ${s.pt.license || '—'} · แสดงเป็น ${meName(s)}${s.pt.photo ? ' · มีรูปโปรไฟล์รอตรวจ' : ''}`, go: 'a.license', cta: 'ตรวจใบประกอบ', owner: 'nat', kind: 'team' });
    /* 7 Nov rehearsal P16: a capability the PT asked about (or a specialty task) waits for a reviewer, so it is a task. */
    const capWait = capPending(s); if (s.pt.status === 'VERIFIED' && capWait.length) t.push({ icon: 'list-checks', tag: 'พิจารณาความสามารถ PT', title: `${meName(s)} · ${capWait.map(id => SC.CLIN.th(id)).join(', ')}`, sub: 'PT ตอบว่าทำได้ หรือทำได้แต่ยังไม่มั่นใจ · ระบบไม่อนุมัติเอง · พี่ปาล์ม (Clinical Lead) พิจารณา', go: 'a.caps', cta: 'พิจารณา', owner: 'palm', kind: 'team' });
    if (r && r.status === 'ASSESS_HOLD' && !closed) t.push({ icon: 'phone', tag: 'ประเมินอย่างเดียว · พักจ่าย', title: `${patientName(s)} · ${r.ref}`, sub: 'ทีมประสานงานติดต่อกลับ · ยังไม่ตั้งราคา ไม่ส่ง Offer ไม่คืนเงินอัตโนมัติ', go: 'a.clinical', cta: 'ดูขอบเขต', owner: 'nat', kind: 'clinical' });
    if (r && r.scopeHold && !closed && !(r.review || {}).declined) t.push({ icon: 'clipboard-plus', tag: 'พักกิจกรรม · นัดเดิมยังอยู่', title: `${patientName(s)} · ${r.ref}`, sub: `แอดมินติดตาม · Clinical Lead ตัดสินความปลอดภัย · เรื่องคืนเงิน: พี่ปาล์ม (CEO) อนุมัติ · ${(r.review.reasons || []).join(' · ')}`, go: 'a.clinical', cta: 'ตรวจเคสนี้', owner: 'palm', kind: 'clinical' });
    if (r && r.status === 'CLINICAL_HOLD' && !closed) t.push({ icon: 'clipboard-x', tag: 'C11 จำเป็น · พักไว้', title: `${patientName(s)} · ${r.ref}`, sub: 'ไม่เปิดชำระเงิน ไม่ส่งงาน · วิธีจัดบริการที่ปลอดภัย รอตัดสิน', go: 'a.clinical', cta: 'ดูเคส', owner: 'palm', kind: 'clinical' });
    if (SC.policyTasks) SC.policyTasks(s).forEach(x => t.push(x));
    if (r && r.status === 'CLINICAL_REVIEW' && !closed) t.push({ icon: 'clipboard-plus', tag: r.paid ? 'ตรวจซ้ำ · ชำระแล้ว ไม่เก็บซ้ำ' : 'ตรวจก่อนเก็บเงิน', title: `${patientName(s)} · ${r.ref}`, sub: (r.review.reasons || []).join(' · '), go: 'a.clinical', cta: 'ตรวจเคสนี้', owner: 'palm', kind: 'clinical', hot: true });
    if (r && r.check && r.check.state === 'open') t.push({ icon: 'receipt', tag: 'สลิปผิดปกติ', title: `สลิป ClairMatch · ${r.ref}`, sub: `${patientName(s)} · ${r.check.reasons.join(' · ')} · จับคู่ PT ต่อไปแล้ว`, go: 'a.payments', cta: 'ดูสลิป', owner: 'boss', kind: 'money' });
    if (r && r.status === 'PAID' && !closed) t.push({ icon: 'users-round', tag: 'จับคู่ PT', title: `${patientName(s)} · ${district(s) || 'ยังไม่ระบุเขต'}`, sub: `${r.preferredPt ? `ผู้รับบริการขอ ${ptName(s, r.preferredPt)} · ` : ''}ระบบหา PT ที่ตรงเขตไม่ได้ · ผู้รับผิดชอบ ${own((r.search && r.search.owner) || 'boss')}`, go: 'a.match', cta: 'เลือก PT', owner: (r.search && r.search.owner) || 'boss', kind: 'match', at: r.paidAt ? `${r.paidAt}T09:00` : '' });
    if (s.course && s.course.slip && !s.course.approved) t.push({ icon: 'wallet', tag: 'ตรวจเงินคอร์ส', title: `คอร์ส ${s.course.sessions} ครั้ง ${money(s.course.total)}`, sub: `${patientName(s)} · PT ${meName(s)} ส่งสลิปจากหน้างาน`, go: 'a.payments', cta: 'ตรวจสลิปคอร์ส', owner: 'boss', kind: 'money' });
    if (s.review && s.review.consent && !s.review.approved && !s.review.hidden) t.push({ icon: 'star', tag: 'รีวิวรออนุมัติ', title: `รีวิว ${s.review.stars} ดาว ถึง ${meName(s)}`, sub: 'ผู้รับบริการยินยอมให้แสดงบนหน้าเว็บ อ่านก่อนอนุมัติ', go: 'a.reviews', cta: 'อ่านรีวิว', owner: 'nat', kind: 'team' });
    if (s.review && s.review.needsContact && !a.contacted) t.push({ icon: 'phone', tag: 'ขอให้ติดต่อกลับ', title: patientName(s), sub: 'ผู้รับบริการติ๊กว่าอยากให้ทีมโทรคุย', go: 'a.reviews', cta: 'ดูเรื่องนี้', owner: 'nat', kind: 'team', inline: { act: 'markContacted', label: 'โทรแล้ว' } });
    roster(s).forEach(id => { const n = score(s, id); if (n >= 20) t.push({ icon: 'shield-alert', tag: 'เฝ้าระวัง', title: ptName(s, id), sub: `${n} คะแนน · ${LEVEL[level(n)][0]}`, go: 'a.suspicion', cta: 'ทบทวน', owner: 'nat', kind: 'team' }); });
    return t;
  }
  /* Tasks the PT declared that wait for a reviewer: "ขอคุยก่อน", or a specialty task marked "ทำได้", with no decision yet (or a reopened one). */
  function capPending(s) { const p = s.pt, caps = p.caps || {}, dec = p.capDecisions || {};
    return Object.keys(caps).filter(id => !SC.CLIN.restricted.includes(id) && ((dec[id] || {}).status === 'PENDING' || (!dec[id] && (caps[id] === 'ask' || (id[0] === 'S' && caps[id] === 'can'))))); }
  SC.capPending = capPending;
  function waiting(s) {
    const w = [], r = s.request;
    if (r && r.status === 'PAYMENT_PENDING') w.push({ icon: 'hourglass', title: `${patientName(s)} · รอชำระ ClairMatch`, sub: `${r.ref} · ระบบส่งลิงก์ชำระให้ใน LINE แล้ว`, go: 'a.patients', cta: 'ดูคนไข้' });
    if (r && r.status === 'OFFERED' && !r.closed) w.push({ icon: SC.offerBlock(s) ? 'lock' : 'send', title: `${SC.offerBlock(s) ? `PT ยังรับไม่ได้ · ${SC.offerBlock(s)}` : 'รอ PT ตอบรับข้อเสนอ'} · ${patientName(s)}`, sub: `${r.auto ? 'ระบบส่งงานให้เอง (ห้องซ้อม) · ' : ''}ส่งให้ ${(r.offerTo || []).map(id => ptName(s, id)).join(', ') || '—'} · ภายใน 30 นาที`, go: 'a.match', cta: 'ดูข้อเสนอ' });
    s.visits.filter(x => x.step < 4).forEach(x => w.push({ icon: 'calendar-days', title: `นัดครั้งที่ ${x.n} · ${patientName(s)}`, sub: `${x.date} ${x.time} · ${STEP[x.step]}${SC.visitHold && SC.visitHold(s) ? ' · พักการดูแลอยู่' : ''}`, go: 'a.appts', cta: 'ดูนัด' }));
    return w;
  }
  SC.adminTasks = tasks; SC.adminWaiting = waiting;

  /* ---------- Shared admin layout ---------- */
  /* A05 (UX audit 7 Nov): three groups instead of one long list. */
  const NAV = [['งานวันนี้'], ['a.queue', 'inbox', 'งานรอจัดการ'], ['a.clinical', 'clipboard-plus', 'ตรวจทางคลินิก'], ['a.match', 'users-round', 'จับคู่ PT'], ['a.payments', 'wallet', 'การเงิน'], ['a.refunds', 'banknote', 'คืนเงิน'], ['a.license', 'badge-check', 'ตรวจใบประกอบ'],
    ['ข้อมูล'], ['a.appts', 'calendar-days', 'นัดหมาย'], ['a.patients', 'heart-handshake', 'คนไข้'], ['a.pts', 'stethoscope', 'ทีม PT'], ['a.caps', 'list-checks', 'ความสามารถ PT'], ['a.reviews', 'star', 'รีวิว'], ['a.suspicion', 'shield-alert', 'เฝ้าระวัง'],
    ['ภาพรวม'], ['a.dash', 'layout-dashboard', 'ภาพรวม CEO']];
  function counts(s) {
    const t = tasks(s), c = { 'a.queue': t.length };
    t.forEach(x => { c[x.go] = (c[x.go] || 0) + 1; });
    c['a.appts'] = s.visits.filter(x => x.step < 4).length;
    if (SC.refundCount) c['a.refunds'] = SC.refundCount(s);
    return c;
  }
  /* Main comes first in the DOM so the rehearsal pulses the task button, not the sidebar item; CSS puts the sidebar on the left (or on top at 390px). */
  function shell(s, active, head, body) {
    const c = counts(s);
    const nav = NAV.map(([id, ic, label]) => !ic ? `<span class="adm-grp">${esc(id)}</span>` : `<button data-go="${id}" class="${id === active ? 'on' : ''}" ${id === active ? 'aria-current="page"' : ''}>${I(ic)}${label}${SC.isNewScreen && SC.isNewScreen(id) ? '<span class="nw">ใหม่</span>' : ''}${c[id] ? `<span class="n">${c[id]}</span>` : ''}</button>`).join('');
    return `<div class="scr aa"><div class="adm">
      <main class="adm-main"><header class="adm-head"><div class="grow">${head.kick ? `<div class="kick">${esc(head.kick)}</div>` : ''}<h1>${esc(head.title)}</h1>${head.sub ? `<p class="aa-sub">${esc(head.sub)}</p>` : ''}</div>${head.right || ''}</header>${body}</main>
      <nav class="adm-side" aria-label="เมนูแอดมิน"><div class="brand"><img src="a/synaclair-icon.svg" alt="">SynaClair</div>${nav}</nav>
    </div></div>`;
  }
  SC.adminShell = shell;
  const taskRow = (x, hot) => `<div class="aa-task ${hot ? 'hot' : ''}"><span class="tile ${hot ? 'gold' : ''}">${I(x.icon)}</span><div class="grow">${x.tag ? `<span class="pill ${hot ? 'wait' : 'gray'}">${esc(x.tag)}</span>` : ''}<div class="t">${esc(x.title)}</div><div class="s">${esc(x.sub)}</div></div><button class="btn ${hot ? '' : 'ghost'}" data-go="${x.go}">${esc(x.cta)}${I('chevron-right')}</button></div>`;

  /* a.queue (the admin home) lives in screens-ops.js since the 7 Nov rehearsal round. */
  SC.adminTaskRow = taskRow;

  /* ================= a.license ================= */
  /* พี่ปาล์ม v2.4 R1.2–R1.3: what the PT declared. A tick is self-report, not approval; specialty tasks need evidence checked by the team. */
  const CAP_WORD = { can: 'ทำได้', no: 'ยังทำไม่ได้', ask: 'ทำได้ แต่ยังไม่มั่นใจ' };
  const capNow = () => SC.stamp ? SC.stamp(5) : SC.TODAY;
  /* A declaration can open a review or keep it open, never close one. First-time "ทำได้" on a core task stays as it was: พี่ปาล์ม's D1 is still open. */
  SC.capPick = (s, id, v) => {
    const p = s.pt, caps = p.caps = p.caps || {}, prev = caps[id]; if (prev === v || SC.CLIN.restricted.includes(id)) return;
    caps[id] = v; if (p.status === 'NONE') return; // still filling in the first sign-up: nothing is under review yet
    const dec = p.capDecisions = p.capDecisions || {}, d = dec[id]; let note = '';
    if (v === 'ask' || (prev === 'ask' && !d) || (d && d.status === 'APPROVED' && v === 'no')) { if (!d || d.status !== 'REJECTED') { dec[id] = { status: 'PENDING', at: capNow() }; note = 'รอทีมพิจารณา'; } }
    (p.capLog = p.capLog || []).push({ kind: 'declare', id, from: prev || '', to: v, at: capNow(), note });
    if (note) SC.line('admin', { key: 'note', to: ['palm'], title: `ถึงพี่ปาล์ม (Clinical Lead): ความสามารถ PT รอพิจารณา`, lines: [`${p.displayName || 'PT'} · ${SC.CLIN.label(id)}`, `PT ตอบ: ${CAP_WORD[v] || v}`, 'ระบบไม่อนุมัติเอง'], go: 'a.caps', button: 'พิจารณา' });
  };
  SC.capOpenPending = s => { const dec = s.pt.capDecisions = s.pt.capDecisions || {}; Object.entries(s.pt.caps || {}).forEach(([id, v]) => { if (v === 'ask' && !dec[id]) dec[id] = { status: 'PENDING', at: capNow() }; }); };
  SC.capEligible = (p, id) => { const c = (p.caps || {})[id], d = (p.capDecisions || {})[id]; if (!c || c === 'no') return false; if (d) return d.status === 'APPROVED'; return c === 'can' && id[0] === 'C'; };
  function capsCard(s) {
    const p = s.pt, caps = p.caps || {}, ids = Object.keys(caps); if (!ids.length) return '';
    const names = (p.services || []).map(id => (SC.CLIN.services.find(x => x.id === id) || {}).name).filter(Boolean);
    const by = v => ids.filter(id => caps[id] === v), tl = v => (x => x.length ? SC.CLIN.list(x, { tight: true, code: true }) : '—')(by(v));
    const dec = p.capDecisions || {}, spec = ids.filter(id => (id[0] === 'S' && caps[id] === 'can') || caps[id] === 'ask' || dec[id]);
    return `<div class="card flat"><b class="h3">${I('list-checks')}งานที่ PT แจ้งว่ารับได้</b><p class="small" style="margin:0">กลุ่ม: ${esc(names.join(' · ') || '—')} · ที่ติ๊กเป็นข้อมูลจาก PT ยังไม่ใช่การอนุมัติ</p>
      ${kv([['ทำได้ (' + by('can').length + ')', tl('can')], ['ยังทำไม่ได้ (' + by('no').length + ')', tl('no')], ['ทำได้ แต่ยังไม่มั่นใจ (' + by('ask').length + ')', tl('ask')], ['อุปกรณ์', esc((p.equip || []).join(' · ') || '—')]])}
      ${spec.length ? `<span class="label">ต้องพิจารณาก่อนส่งเคสแบบนี้ · ระบบไม่อนุมัติเอง · อนุมัติเคสไม่เท่ากับอนุมัติ PT</span>
        <div class="field"><span>พิจารณาในบัญชี</span><div class="chips">${REVIEW_ACCOUNTS.map(x => `<button class="chip ${p.capBy === x.id ? 'on' : ''}" data-pick="pt.capBy" data-value="${x.id}">${esc(x.name)} · ${esc(x.role)}</button>`).join('')}</div></div>
        <label class="field"><span>เหตุผล</span><textarea class="in" style="min-height:64px" maxlength="200" data-bind="pt.capReason" placeholder="เช่น คุยกับ PT แล้ว เคยดูแลเคสแบบนี้">${esc(p.capReason || '')}</textarea></label>
        <label class="field"><span>หลักฐานอ้างอิง (ถ้ามี)</span><input class="in" maxlength="120" data-bind="pt.capEvidence" value="${esc(p.capEvidence || '')}" placeholder="เช่น ประสบการณ์หรือใบอบรมที่ดู"></label>
        ${spec.map(id => { const x = dec[id], st = x ? x.status : ''; return `<div class="aa-capd" data-cap="${id}"><div class="grow">${SC.CLIN.row(id, { code: true })}${(rq => rq ? `<small data-cap-req>PT ขอแก้เป็น "${esc(CAP_WORD[rq.to])}" · เหตุผล: ${esc(rq.reason)} · หลักฐาน: ${esc(rq.evidence)}</small>` : '')((p.capReqs || []).find(r => r.id === id && r.status === 'PENDING'))}<small>PT ตอบ: ${esc(CAP_WORD[caps[id]] || '—')}${x && x.by ? ` · ${esc((leadOf(x.by) || {}).name || x.by)} · ${esc(x.at || '')}${x.reason ? ` · ${esc(x.reason)}` : ''}` : ''}</small></div><span class="pill ${st === 'APPROVED' ? '' : st === 'REJECTED' ? 'warn' : 'wait'}">${st === 'APPROVED' ? 'อนุมัติแล้ว' : st === 'REJECTED' ? 'ไม่อนุมัติ' : 'รอพิจารณา'}</span><div class="row"><button class="btn sm" data-act="capDecide" data-id="${id}" data-d="APPROVED">อนุมัติ</button><button class="btn sm ghost" data-act="capDecide" data-id="${id}" data-d="REJECTED">ไม่อนุมัติ</button></div></div>`; }).join('')}
        ${(p.capLog || []).length ? `<details class="small"><summary>ประวัติการเปลี่ยน ${p.capLog.length} รายการ</summary>${p.capLog.slice().reverse().map(l => `<p style="margin:4px 0">${esc(l.at)} · ${esc(SC.CLIN.en[l.id] || l.id)} · ${l.kind === 'decide' ? `${esc((leadOf(l.by) || {}).name || l.by)}: ${esc(l.to)} · ${esc(l.reason || '')}` : `PT แก้คำตอบ ${esc(CAP_WORD[l.from] || '—')} → ${esc(CAP_WORD[l.to] || '—')}${l.note ? ` · ${esc(l.note)}` : ''}`}</p>`).join('')}</details>` : ''}` : ''}
      <p class="small" style="margin:0">${I('lock')} ดูดเสมหะ (Suction) ยังไม่เปิดให้ PT แจ้งรับ ต้องตรวจขอบเขตวิชาชีพไทยก่อน</p></div>`;
  }
  /* พี่ปาล์ม's P0 fix (5 Nov): what the PT says (pt.caps) and what a reviewer decides (pt.capDecisions) are separate. Only capDecide can approve. */
  SC.capsCard = s => capsCard(s);
  SC.action('capDecide', (s, ctx) => {
    const p = s.pt, lead = leadOf(p.capBy), id = ctx.data.id, why = (p.capReason || '').trim();
    if (!lead) { ctx.toast('บัญชีนี้ไม่มีสิทธิ์พิจารณาความสามารถ PT'); return; }
    if (SC.CLIN.restricted.includes(id)) { ctx.toast('งานนี้ล็อกอยู่ อนุมัติจากหน้านี้ไม่ได้'); return; }
    if (!why) { ctx.toast('ใส่เหตุผลก่อน'); return; }
    const at = capNow(), version = ((p.capDecisions || {})[id] || {}).version + 1 || 1, evidence = (p.capEvidence || '').trim(); (p.capDecisions = p.capDecisions || {})[id] = { ptId: 'me', task: id, declared: (p.caps || {})[id] || '', status: ctx.data.d, by: lead.id, at, reason: why, evidence, version };
    (p.capLog = p.capLog || []).push({ kind: 'decide', id, to: ctx.data.d, by: lead.id, at, reason: why, evidence, version }); p.capReason = ''; p.capEvidence = '';
    /* Boss 11 Nov: a PT's change request is applied only when the team approves it. */
    const rq = (p.capReqs || []).find(r => r.id === id && r.status === 'PENDING'); if (rq) { rq.status = ctx.data.d; rq.by = lead.id; rq.decidedAt = at; if (ctx.data.d === 'APPROVED') p.caps[id] = rq.to; }
    /* 7 Nov rehearsal NT-03: the PT hears the decision. */
    ctx.line('pt', { key: 'note', title: ctx.data.d === 'APPROVED' ? `ทีมอนุมัติงาน "${SC.CLIN.th(id)}" ให้คุณแล้ว` : `ทีมยังไม่อนุมัติงาน "${SC.CLIN.th(id)}"`, lines: [SC.CLIN.label(id), ctx.data.d === 'APPROVED' ? 'เคสที่ต้องใช้งานนี้ส่งถึงคุณได้แล้ว' : 'เคสที่ต้องใช้งานนี้จะยังไม่ส่งถึงคุณ · คุยกับทีมได้ในแชตนี้', `เหตุผล: ${why}`], go: 't.hub', button: 'ดูหน้าของฉัน' });
    ctx.toast(ctx.data.d === 'APPROVED' ? 'บันทึกผลอนุมัติแล้ว แจ้ง PT ใน LINE' : 'บันทึกว่าไม่อนุมัติแล้ว แจ้ง PT ใน LINE');
  });
  /* A02 (UX audit 7 Nov): this page checks the licence only. Capability review lives on "ความสามารถ PT"; here is one link with the counts. */
  function capLink(s) {
    const p = s.pt, caps = p.caps || {}, ids = Object.keys(caps); if (!ids.length) return '';
    const dec = p.capDecisions || {}, wait = ids.filter(id => (dec[id] || {}).status === 'PENDING' || (!dec[id] && (caps[id] === 'ask' || (id[0] === 'S' && caps[id] === 'can')))).length;
    const core = ids.filter(id => id[0] === 'C' && caps[id] === 'can'), spec = ids.filter(id => id[0] === 'S' && caps[id] !== 'no');
    return `<div class="card flat aa-caplink"><div class="row between wrap"><b class="h3">${I('list-checks')}งานที่ PT แจ้งว่ารับได้</b><button class="btn sm ghost" data-go="a.caps">ดูและพิจารณา ${I('chevron-right')}</button></div>
      <p class="small" style="margin:0">PT ตอบ ${ids.length} งาน · รอพิจารณา ${wait} · ที่ติ๊กเป็นข้อมูลจาก PT ยังไม่ใช่การอนุมัติ</p>
      <div class="aa-chips"><span class="label">งานพื้นฐาน ${core.length}</span>${core.map(id => `<span class="chip-s">${esc(id)}</span>`).join('')}</div>
      ${spec.length ? `<div class="aa-chips"><span class="label">งานเฉพาะทาง ${spec.length}</span>${spec.map(id => `<span class="chip-s">${esc(id)}</span>`).join('')}</div>` : ''}</div>`;
  }
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
            <div class="grow stack" style="min-width:min(220px,100%);flex:1 1 220px">
              <div class="row wrap"><span class="pill wait">${I('hourglass')}ยังไม่ตรวจ</span><span class="small">สมัครเมื่อ ${esc(SC.TODAY)}</span></div>
              ${kv([['ชื่อจริง', `<b>${esc(p.legalName || '—')}</b>`], ['เลขใบประกอบวิชาชีพ', `<b>${esc(p.license || '—')}</b>`], ['สำเนาใบประกอบ', p.licenseFile ? (p.licenseFile === 'sample' ? '<span class="pill">แนบแล้ว (ไฟล์ตัวอย่าง)</span>' : `<a class="link" href="${esc(p.licenseFile)}" target="_blank" rel="noopener">เปิดไฟล์ที่แนบ</a>`) : '<span class="pill warn">ยังไม่แนบ</span>'], ['เอกสารอื่น', (p.extraDocs || []).length ? p.extraDocs.map(x => `<div>${I('paperclip')} ${x.file === 'sample' ? 'ไฟล์ตัวอย่าง' : `<a class="link" href="${esc(x.file)}" target="_blank" rel="noopener">เปิดไฟล์</a>`} · ${esc(x.note)}</div>`).join('') : '<span class="small">ไม่มี</span>'], ['การศึกษา', ((p.cv && p.cv.edu) || []).length ? p.cv.edu.map(([x, u, f, ef]) => `<div>${esc([x, f, u].filter(Boolean).join(' · '))} · ${ef ? (ef === 'sample' ? '<span class="pill">เอกสารยืนยัน (ตัวอย่าง)</span>' : `<a class="link" href="${esc(ef)}" target="_blank" rel="noopener">เปิดเอกสารยืนยัน</a>`) : '<span class="pill warn">ยังไม่แนบเอกสาร</span>'}</div>`).join('') : '—'], ['ชื่อที่แสดง', esc(meName(s))], ['เขตที่รับงาน', esc((p.zones || []).join(' · ') || '—')],
                ['รูปโปรไฟล์', p.photo ? (consent ? '<span class="pill">ยินยอมให้แสดงบนเว็บ</span>' : '<span class="pill warn">ยังไม่ยินยอม</span>') : '<span class="pill gray">ยังไม่ได้ใส่รูป</span>']])}
            </div>
          </div>
          ${p.bio ? `<div class="note mint"><b>แนะนำตัว:</b> ${esc(p.bio)}</div>` : ''}
          ${capLink(s)}
          ${p.licenseNote ? `<div class="note">${I('message-circle')} ขอข้อมูลเพิ่มแล้วใน LINE: ${esc(p.licenseNote)}</div>` : ''}
          <div class="note mint">เทียบชื่อจริง เลขใบประกอบ และสำเนาที่แนบกับระบบตรวจสอบของสภากายภาพบำบัด และดูว่ารูปเห็นหน้าชัด เป็นรูปจริงของนักกายภาพ</div>
          <div class="aa-acts"><a class="link" href="https://www.pt.or.th/cpte/ptlicense.php" target="_blank" rel="noopener">${I('link')} เปิดระบบตรวจใบประกอบของสภากายภาพบำบัด ${I('external-link')}</a></div>
          <div class="aa-acts aa-decide-bar"><button class="btn" data-act="approvePt">${I('check')}อนุมัติใบประกอบ</button><button class="btn ghost" data-act="askLicenseInfo">${I('message-circle')}ขอข้อมูลเพิ่ม</button></div>
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
        <section class="aa-sec"><h2 class="h3">ตรวจแล้ว</h2>${table(['นักกายภาพ', 'เลขใบประกอบ', 'เขต', 'สถานะ'], done)}</section>
        ${p.status === 'VERIFIED' && Object.keys(p.caps || {}).length ? `<section class="aa-sec"><h2 class="h3">ความสามารถของ ${esc(meName(s))}</h2>${capLink(s)}</section>` : ''}`;
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
    if (r && r.check && r.check.state === 'open') out.push({ kind: 'trial', title: 'ClairMatch', amount: SC.TRIAL, slipAmount: 1500, ref: r.ref, src: r.slip, from: patientName(s), when: SC.TODAY, by: 'ผู้รับบริการส่งสลิปเองใน LINE', flag: r.check.reasons, cta: 'เช็กบัญชีแล้ว ยอดถูก', rej: 'แจ้งคนไข้ให้โอนเพิ่มหรือส่งใหม่' });
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
              ${x.kind === 'course' && SC.coursePerVisit ? SC.coursePerVisit(s.course) : ''}
              <div class="note">ตรวจยอดเงินเข้าบัญชีจริงก่อนยืนยัน ไม่ใช่ดูภาพสลิปอย่างเดียว</div>
              <div class="aa-acts"><button class="btn" data-act="confirmPayment" data-kind="${x.kind}">${I('check')}${esc(x.cta)}</button><button class="btn danger" data-act="rejectPayment" data-kind="${x.kind}">${I('x')}${esc(x.rej || 'ยอดไม่ตรง ตีกลับ')}</button></div>
            </div></div></article>`).join('')
          : `<div class="card flat">${ui.empty('wallet', 'ไม่มีสลิปผิดปกติ', 'สลิป ClairMatch ที่ระบบตรวจผ่านไปต่อเองแล้ว ดูได้ในแท็บตรวจแล้ว ถ้าระบบเจอยอดหรือสลิปแปลก จะขึ้นที่นี่และแจ้งใน LINE แอดมิน')}</div>`;
      } else {
        const rows = [];
        if (trialDone(s)) rows.push({ cells: [`<div class="t">ClairMatch</div><span class="small">${esc(patientName(s))}</span>`, `<span class="money">${money(SC.TRIAL)}</span>`, `<span style="white-space:nowrap">${esc(s.request.ref)}</span>`, `<span class="pill">${s.request.check && s.request.check.state === 'asked' ? 'แจ้งคนไข้แล้ว' : 'รับเงินแล้ว'}</span> <span class="small">${!s.request.check || s.request.check.state === 'auto' ? 'ระบบตรวจผ่านอัตโนมัติ' : s.request.check.state === 'ok' ? 'แอดมินเช็กบัญชีแล้ว' : esc(s.request.check.reasons.join(' · '))}</span>`] });
        if (s.course && s.course.approved) rows.push({ cells: [`<div class="t">คอร์ส ${s.course.sessions} ครั้ง${s.course.bonus ? ` แถม ${s.course.bonus}` : ''}</div><span class="small">${esc(patientName(s))}</span>`, `<span class="money">${money(s.course.total)}</span>`, `<span style="white-space:nowrap">${esc(s.course.code || (s.request ? s.request.ref : '—'))}</span>`, `<span class="pill">รับเงินแล้ว · เปิดสิทธิ์แล้ว</span> <span class="small">${SC.courseValid ? esc(SC.courseValid(s.course)) : ''}</span>`] });
        a.rejects.forEach(x => rows.push({ cells: [`<div class="t">${esc(x.title)}</div><span class="small">${esc(x.from)}</span>`, `<span class="money">${money(x.amount)}</span>`, `<span style="white-space:nowrap">${esc(x.ref)}</span>`, `<span class="pill warn">ตีกลับ</span> <span class="small">${esc(x.reason)}</span>`] }));
        body = rows.length ? table(['รายการ', 'ยอด', 'อ้างอิง', 'ผล'], rows) : `<div class="card flat">${ui.empty('receipt', 'ยังไม่มีรายการที่ตรวจแล้ว', 'รายการที่ยืนยันหรือตีกลับจะเก็บไว้ที่นี่')}</div>`;
        if (s.course && s.course.approved && SC.coursePerVisit) body += `<section class="aa-sec"><h2 class="h3">ค่าธรรมเนียมต่อครั้ง (เห็นเฉพาะทีม)</h2>${SC.coursePerVisit(s.course)}</section>`;
      }
      return shell(s, 'a.payments', { kick: 'ตรวจเงิน', title: 'การเงิน', sub: 'ระบบอ่านสลิป ClairMatch ให้เอง (ยอด ผู้รับ เวลาโอน เลขอ้างอิงซ้ำ) แล้วจับคู่ต่อทันที ที่นี่ขึ้นเฉพาะสลิปที่ผิดปกติ และสลิปคอร์ส', right: seg }, body);
    }
  });
  SC.action('viewSlip', (s, ctx) => {
    const x = payItems(s).find(i => i.kind === ctx.data.kind); if (!x) return;
    openSheet(ctx, `${sheetHead('หลักฐานรับโอน', `${x.title} · ${money(x.amount)}`)}<div style="display:grid;justify-items:center">${slip(x.src, x)}</div>${kv([['ผู้รับบริการ', esc(x.from)], ['เลขอ้างอิง', esc(x.ref)], ['ส่งเมื่อ', esc(x.when)]])}<button class="btn ghost" data-close>ปิด</button>`);
  });
  SC.action('confirmPayment', (s, ctx) => {
    if (ctx.data.kind === 'course') {
      if (!s.course) return;
      s.course.approved = true; s.course.paid = true; s.course.verifiedAt = s.course.verifiedAt || SC.COURSE_VERIFIED_AT || '2026-10-24';
      if (!s.visits.find(x => x.n === 2)) {
        /* Visit 2 is the date the PT booked with the patient on site ('อ. 27 ต.ค. 09:00'). */
        const WDAY = { 'จ.': 'จันทร์', 'อ.': 'อังคาร', 'พ.': 'พุธ', 'พฤ.': 'พฤหัสบดี', 'ศ.': 'ศุกร์', 'ส.': 'เสาร์', 'อา.': 'อาทิตย์' };
        const m = /^(\S+)\s+(\d+\s+\S+)\s+(\d{2}):(\d{2})/.exec(s.course.next || '');
        const date = m && WDAY[m[1]] ? `${WDAY[m[1]]} ${m[2]} 2569` : SC.VISIT2.date;
        const time = m ? `${m[3]}:${m[4]}–${String(+m[3] + 1).padStart(2, '0')}:${m[4]}` : SC.VISIT2.time;
        s.visits.push({ n: 2, date, time, step: 0, soap: {}, published: false });
      }
      ctx.line('patient', { key: 'courseReceipt' }); if (SC.courseValid) ctx.line('patient', { key: 'note', title: 'เปิดสิทธิ์คอร์สแล้ว', lines: [SC.courseLine(s.course.sessions, s.course.bonus || 0, s.course.total), SC.courseValid(s.course)], go: 'p.course', button: 'ดูคอร์สของฉัน' }); ctx.line('patient', { key: 'confirmedCourse' });
      /* 7 Nov rehearsal NT-14: the PT's screen promised "ผลแจ้งใน LINE ทั้งคุณและคนไข้". */
      const v2 = s.visits.find(x => x.n === 2), left = SC.courseLeft ? SC.courseLeft(s.course) : 0, tot = s.course.sessions + (s.course.bonus || 0);
      ctx.line('pt', { key: 'note', title: `ทีมยืนยันเงินคอร์สแล้ว · ${patientName(s)}`, lines: [SC.courseLine(s.course.sessions, s.course.bonus || 0, s.course.total), `คอร์สเหลือ ${left} จาก ${tot} ครั้ง`, v2 ? `นัดครั้งที่ 2 ยืนยันแล้ว: ${v2.date} ${v2.time}` : 'ยังไม่มีนัดครั้งที่ 2'], go: 't.work', button: 'ดูงาน' });
      ctx.toast('ยืนยันรับเงินคอร์สแล้ว เปิดสิทธิ์และนัดครั้งที่ 2 ส่งใบเสร็จให้คนไข้ และแจ้ง PT ใน LINE');
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
    if (s.request && s.request.status === 'ASSESS_HOLD') return;
    const r = s.request; if (!r) return;
    const odd = r.slip === 'odd';
    r.check = odd ? { ok: false, reasons: [ODD], state: 'open' } : { ok: true, reasons: [], state: 'auto' };
    r.status = 'PAID';
    if (odd) line('admin', { key: 'slipFlag', text: `ระบบตรวจสลิป ${r.ref}: ${ODD} · ระบบจับคู่ PT ต่อไปแล้ว รบกวนแอดมินดูสลิปนี้` });
    /* A wrong-amount slip still moves to matching, but the patient is never told the money was checked (ChatGPT review 30 Oct). */
    if (odd) line('patient', { key: 'slipPending', text: 'ได้รับสลิปแล้ว · กำลังหานักกายภาพให้ ระหว่างนี้ทีมขอตรวจยอดชำระอีกครั้ง ถ้ามีอะไรต้องแก้ ทีมจะทักในแชตนี้' });
    else { line('patient', { key: 'receipt' }); line('patient', { key: 'intakeMatching' }); }
    offerIfFits(s, line);
  };
  function offerIfFits(s, line) {
    const r = s.request; if (s.matchPool) { SC.MATCH.dispatch(s, line); return; }
    const mc = meCandidate(s); SC.MATCH.evaluate(s);
    if (mc && mc.ok && (mc.zoneOk || mc.preferred) && !mc.warn) { r.status = 'OFFERED'; r.offerTo = ['me']; r.auto = mc.preferred ? 'ผู้รับบริการขอคนนี้' : 'ตรงเขตที่รับงาน'; line('pt', { key: 'ptOffer' }); SC.MATCH.logOffer(s, ['me'], r.auto); }
  }

  /* ================= a.clinical =================
     พี่ปาล์ม v2.4 R2.5 + R3.3: a request with a safety question waits here BEFORE any payment is asked.
     The reviewer approves specific activities only (never the whole case), writes limits, or declines and calls.
     Routine requests never come here: they pay first, then matching, as before. S06 suction is locked. */
  /* Q-A (3 Nov 2026): Clinical Leads. Rehearsal accounts; the real app checks the CLINICAL_LEAD role on the signed-in user. */
  SC.CLIN_LEADS = [{ id: 'palm', name: 'ปาล์ม', role: 'CEO' }, { id: 'nat', name: 'นัท', role: 'CMO' }, { id: 'boss', name: 'บอส', role: 'CTO' }];
  const REVIEW_ACCOUNTS = [...SC.CLIN_LEADS, { id: 'staff', name: 'แอดมินทั่วไป', role: 'ไม่มีสิทธิ์' }];
  const leadOf = id => SC.CLIN_LEADS.find(x => x.id === id);
  const reviewOpen = r => !!r && (r.status === 'CLINICAL_REVIEW' || (r.scopeHold && !(r.review || {}).cleared && !(r.review || {}).declined));
  const logReview = (r, lead, decision) => { const rv = r.review; (r.reviewLog = r.reviewLog || []).push({ reviewerId: lead.id, reviewer: `${lead.name} (${lead.role})`, decision, allow: rv.allow.slice(), limits: rv.limits, reason: rv.reason, at: SC.REVIEW_AT, version: r.screeningVersion }); };
  SC.clinClear = (s, line) => {
    const r = s.request; if (!reviewOpen(r)) return;
    const rv = r.review; if (!rv.allow.length) rv.allow = ['C01', 'C04', 'C16'];
    rv.allow = rv.allow.filter(id => !SC.CLIN.restricted.includes(id));
    const lead = leadOf(rv.byId) || SC.CLIN_LEADS[0]; rv.byId = lead.id; rv.reason = rv.reason || 'ห้องซ้อม: ปุ่มข้ามด่าน';
    Object.assign(rv, { cleared: true, by: `${lead.name} (${lead.role})`, at: SC.REVIEW_AT, version: r.screeningVersion });
    logReview(r, lead, 'APPROVED');
    if (r.offerId) SC.bumpOffer(r);
    const scope = SC.clinScope(s), said = `ทีมคลินิกตรวจแล้ว · อนุมัติเฉพาะ: ${scope.allow.join(' · ')}${scope.not.length ? ` · ไม่รวม: ${scope.not.join(' · ')}` : ''}`;
    /* D6 (CEO, 5 Nov): assessment only means no automatic payment or offer. No price, refund or cancel is decided here; the team follows up. */
    if (!r.scopeHold && r.status !== 'BOOKED' && scope.assessOnly && SC.RULES.assessHold !== false) { r.status = 'ASSESS_HOLD'; r.offerTo = []; if (line) line('patient', { key: 'clinOk', text: `${said} · ยังไม่เปิดชำระเงิน ทีมจะติดต่อกลับเรื่องขั้นตอนถัดไป` }); return; }
    if (r.scopeHold) { r.scopeHold = false; if (line) { line('patient', { key: 'clinOk', text: `${said} · นัดเดิมยังอยู่ ไม่มีค่าใช้จ่ายเพิ่ม` }); line('pt', { key: 'teamReply', text: `ทีมคลินิกตรวจเคส ${r.ref} แล้ว · ทำได้เฉพาะ: ${scope.allow.join(' · ')}${scope.limits ? ` · ข้อจำกัด: ${scope.limits}` : ''}` }); } return; }
    if (r.paid) { r.status = 'PAID'; if (line) { line('patient', { key: 'clinOk', text: `${said} · ชำระแล้ว ไม่ต้องชำระซ้ำ ทีมกำลังหานักกายภาพ` }); offerIfFits(s, line); } return; }
    r.status = 'PAYMENT_PENDING';
    if (line) { line('patient', { key: 'clinOk', text: `${said} · ชำระ ClairMatch ฿1,599 เพื่อเริ่มหานักกายภาพ` }); line('patient', { key: 'intakePay' }); }
  };
  SC.screen('a.clinical', {
    role: 'admin',
    render(s) {
      const r = s.request, paidAlready = !!(r && (r.paid || r.scopeHold || ['PAID', 'OFFERED', 'BOOKED'].includes(r.status)));
      const head = paidAlready ? { kick: 'ตรวจซ้ำ · ชำระแล้ว', title: 'ตรวจทางคลินิก', sub: 'ข้อมูลเปลี่ยนหลังชำระ ตรวจใหม่ ไม่เก็บเงินซ้ำ · นัดเดิมยังอยู่จนทีมตัดสิน' } : { kick: 'ก่อนเก็บเงิน', title: 'ตรวจทางคลินิก', sub: 'เคสที่มีข้อสงสัยด้านความปลอดภัย ตรวจก่อนส่งลิงก์ชำระ · เคสทั่วไปไม่ผ่านหน้านี้' };
      if (!r || !r.review) return shell(s, 'a.clinical', head, `<div class="card flat">${ui.empty('clipboard-plus', 'ไม่มีเคสรอตรวจ', 'เคสทั่วไปชำระก่อนแล้วจับคู่เหมือนเดิม หน้านี้มีงานเมื่อคำตอบคัดกรองมีข้อที่ทีมต้องดู', '')}</div>`);
      const rv = r.review, g = SC.clinGroup(s), svc = SC.CLIN.services.find(x => x.id === g.id);
      const list = [...new Set([...(svc ? svc.tasks : ['C01', 'C02', 'C04', 'C06', 'C07', 'C11', 'C12', 'C16']), ...SC.clinExtraTasks(s)])];
      const open = reviewOpen(r), declined = r.status === 'REVIEW_DECLINED' || !!rv.declined;
      const row = id => SC.CLIN.restricted.includes(id)
        ? `<div class="aa-pick off" aria-disabled="true"><span class="aa-box">${I('lock')}</span><span class="grow">${SC.CLIN.row(id, { code: true })}<span class="s">ปิดอยู่ · รอตรวจขอบเขตวิชาชีพไทย ห้ามจับคู่อัตโนมัติ อนุมัติงานอื่นไม่ได้หมายถึงอนุมัติดูดเสมหะ</span></span></div>`
        : open ? `<button class="aa-pick" data-toggle="request.review.allow" data-value="${id}" aria-pressed="${rv.allow.includes(id)}"><span class="aa-box">${rv.allow.includes(id) ? I('check') : ''}</span><span class="grow">${SC.CLIN.row(id, { code: true })}<span class="s">${esc(SC.CLIN.tasks[id])}</span></span></button>`
        : `<div class="aa-pick off"><span class="aa-box">${rv.allow.includes(id) ? I('check') : ''}</span><span class="grow">${SC.CLIN.row(id, { code: true })}</span></div>`;
      const caseCard = `<article class="card flat">
        <div class="row between wrap"><b class="h2">${esc(patientName(s))}</b><span class="pill ${open ? 'wait' : declined ? 'warn' : ''}">${open ? (r.scopeHold ? 'รอตรวจ · พักกิจกรรม นัดเดิมยังอยู่' : r.paid ? 'รอตรวจ · ชำระแล้ว ไม่เก็บซ้ำ' : 'รอตรวจ · ยังไม่เก็บเงิน') : declined ? 'โทรคุยก่อน' : 'อนุมัติแล้ว'}</span></div>
        ${kv([['เลขคำขอ', esc(r.ref)], ['ข้อมูลคัดกรองฉบับที่', esc(String(r.screeningVersion || 1))], ['กลุ่มอาการ', esc(g.name || 'ยังไม่ระบุ')], ['เป้าหมาย', esc(goalText(s) || '—')], district(s) ? ['เขต', esc(district(s))] : null])}
        ${g.answers.length ? `<div class="stack"><span class="label">คำตอบคัดกรอง</span>${g.answers.map(([q, a]) => `<span class="small">${esc(q)}<br><b>${esc(a)}</b></span>`).join('')}</div>` : ''}
        <div class="stack"><span class="label">เหตุผลที่ต้องตรวจ</span>${rv.reasons.map(x => `<span class="small">${I('triangle-alert')} ${esc(x)}</span>`).join('')}</div>
        ${assessment(s)}
        <p class="small" style="margin:0">PT ที่ยังไม่รับงานจะไม่เห็นข้อมูลส่วนนี้และที่อยู่เต็ม</p>
      </article>`;
      const decide = `<article class="card flat">
        <b class="h3">อนุมัติเฉพาะกิจกรรมที่ปลอดภัย</b><p class="small" style="margin:0">ติ๊กเฉพาะที่ทำที่บ้านได้ ไม่ใช่อนุมัติทั้งเคส PT จะเห็นรายการนี้ในงานเสนอ</p>
        <div class="stack">${list.map(row).join('')}</div>
        ${open && rv.allow.length ? (rv.allow.every(id => SC.ASSESS_TASKS.includes(id)) ? `<p class="note warn" role="status" style="margin:0" data-scope-effect="assess">ที่เลือกตอนนี้เป็นงานประเมินทั้งหมด ถ้าอนุมัติ ระบบจะพักการชำระเงินและการส่งงานตาม D6 ถ้าอนุญาตให้รักษาด้วย ให้เลือกงานรักษาที่ปลอดภัยเพิ่ม</p>` : `<p class="small" style="margin:0" data-scope-effect="treat">ที่เลือกตอนนี้มีงานรักษารวมอยู่ ถ้าอนุมัติ เคสจะไปต่อตามขั้นตอนชำระเงินปกติ</p>`) : ''}
        ${open && SC.clinExtraChecks ? SC.clinExtraChecks(s, list) : ''}
        ${open ? `<label class="field"><span>ข้อจำกัด / ข้อควรระวัง</span><textarea class="in" rows="2" data-bind="request.review.limits" placeholder="เช่น ห้ามลงน้ำหนักขาซ้าย · ย้ายตัวต้องมีผู้ช่วย 2 คน">${esc(rv.limits)}</textarea></label>
        <div class="field"><span>ตรวจในบัญชี</span><div class="chips">${REVIEW_ACCOUNTS.map(x => `<button class="chip ${rv.byId === x.id ? 'on' : ''}" data-pick="request.review.byId" data-value="${x.id}">${esc(x.name)} · ${esc(x.role)}</button>`).join('')}</div></div>
        <label class="field"><span>เหตุผลการตัดสิน</span><textarea class="in" rows="2" data-bind="request.review.reason" placeholder="บันทึกพร้อมชื่อผู้ตรวจ เวลา และฉบับข้อมูล">${esc(rv.reason || '')}</textarea></label>
        <div class="aa-acts aa-decide-bar"><button class="btn" data-act="clinApprove" data-need="request.review.allow,request.review.byId,request.review.reason">${I('check')}${r.paid || r.scopeHold ? 'อนุมัติที่ติ๊ก' : 'อนุมัติที่ติ๊ก แล้วส่งลิงก์ชำระ'}</button><button class="btn ghost" data-act="clinDecline" data-need="request.review.byId,request.review.reason">${I('phone')}ยังไม่รับ · โทรคุยก่อน</button></div>`
        : `<p class="small">ผู้ตรวจ ${esc(rv.by || '—')} · ${esc(rv.at || '')}${rv.limits ? ` · ข้อจำกัด: ${esc(rv.limits)}` : ''}</p>`}
        <p class="small" style="margin:0">ผู้มีอำนาจตรวจ: ${SC.CLIN_LEADS.map(x => `${esc(x.name)} (${esc(x.role)})`).join(' · ')} · ทุกการตัดสินบันทึกชื่อ เวลา เหตุผล และฉบับข้อมูล</p>
        ${(r.reviewLog || []).length ? `<div class="stack"><span class="label">ประวัติการตรวจ</span>${r.reviewLog.map(l => `<span class="small">ฉบับที่ ${esc(String(l.version))} · ${{ APPROVED: 'ผ่านตรวจ', DECLINED: 'ขอโทรคุย', SUPERSEDED: 'ผลเดิมถูกพัก' }[l.decision]} · ${esc(l.reviewer)} · ${esc(l.at)}${l.allow.length ? ` · ${l.allow.map(id => esc(SC.CLIN.label(id))).join(', ')}` : ''} · ${esc(l.reason)}</span>`).join('')}</div>` : ''}
      </article>`;
      return shell(s, 'a.clinical', head, `${SC.holdPanel ? SC.holdPanel(s) : ''}<div class="aa-split">${caseCard}<div class="stack lg">${decide}</div></div>`);
    }
  });
  /* 7 Nov rehearsal P9: the reviewer sees what the PT will see after accepting, and more: the numbers, the family's story, the daily-living score. */
  const BARTHEL_MAX = { feeding: 2, grooming: 1, transfer: 3, toilet: 2, mobility: 3, dressing: 2, stairs: 2, bathing: 1, bowels: 2, bladder: 2 }; // Thai Barthel ADL, 0–20
  function assessment(s) {
    const p = s.patient, h = p.health || {}, b = p.bp, c = SC.bpCat(b), bar = p.barthel || {}, keys = Object.keys(bar), nums = keys.filter(k => typeof bar[k] === 'number'), unsure = keys.filter(k => bar[k] === null).length;
    const score = nums.reduce((t, k) => t + bar[k], 0), max = Object.keys(BARTHEL_MAX).reduce((t, k) => t + BARTHEL_MAX[k], 0);
    const yes = k => h[k] === 'YES';
    const rows = [
      ['ความดัน', b && b.unknown ? 'ไม่ทราบค่า' : c ? `<b>${esc(b.sys)}/${esc(b.dia)} mmHg</b> · <span class="pill ${c.tone === 'ok' ? '' : c.tone}">${esc(c.label)}</span>` : '—'],
      ['กิจวัตรประจำวัน', keys.length ? `<b>${score} / ${max} คะแนน</b>${unsure ? ` · ไม่แน่ใจ ${unsure} ข้อ` : ''}${nums.length + unsure < 10 ? ` · ตอบ ${nums.length + unsure} จาก 10 ข้อ` : ''}` : 'ยังไม่ได้ตอบ'],
      ['เรื่องที่ญาติ/คนไข้เล่า', p.healthStory ? `“${esc(p.healthStory)}”` : '<span class="small">ไม่ได้เล่าเพิ่ม</span>'],
      yes('q4') ? ['ออกจาก รพ. / ข้อห้ามแพทย์', esc(p.medNote || 'ตอบว่ามี ยังไม่ได้เล่า')] : null,
      yes('q5') ? ['ผ่าตัด / อุปกรณ์ในร่างกาย', esc(p.surgeryNote || 'ตอบว่าเคย ยังไม่ระบุ')] : null,
      yes('q3') ? ['อุปกรณ์ที่ใช้', esc((p.devices || []).map(d => d === 'อื่น ๆ' && p.deviceOther ? p.deviceOther : d).join(' · ') || 'มี ยังไม่ระบุ')] : null,
      yes('q6') ? ['โรคประจำตัว', esc((p.conditions || []).map(x => x === 'อื่น ๆ' && p.conditionOther ? p.conditionOther : x).join(' · ') || 'มี ยังไม่ระบุ')] : null,
      (p.branch || {}).lift ? ['การย้ายตัว', esc({ N0: 'ทำเองได้', N1: 'ต้องมีคนช่วย 1 คน', N2: 'ต้องมีคนช่วย 2 คน หรือใช้เครื่องยก', UNSURE: 'ไม่แน่ใจ' }[p.branch.lift] || '—')] : null,
      ['จองให้', p.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัว (ญาติเป็นคนตอบ)' : 'ตัวเอง']
    ];
    return `<div class="stack" data-clin-assessment><span class="label">ผลประเมินที่คนไข้ส่ง (ฉบับที่ ${esc(String((s.request || {}).screeningVersion || 1))})</span>${kv(rows)}</div>`;
  }
  const reviewerOk = (s, ctx) => { const rv = s.request && s.request.review; if (rv && leadOf(rv.byId)) return true; ctx.toast('บัญชีนี้ไม่มีสิทธิ์ตรวจทางคลินิก'); return false; };
  SC.action('clinApprove', (s, ctx) => { if (!s.request || !s.request.review.allow.length || !reviewerOk(s, ctx)) return;
    /* NEW-02 / MAP-04 (7 Nov): Required tasks are not dropped quietly, unsure suction cannot reach payment, and a case that needs C11 without a safe way stays on hold. */
    const stop = SC.clinApproveStop && SC.clinApproveStop(s, ctx); if (stop) return stop === true ? undefined : stop;
    const again = s.request.paid || s.request.scopeHold; SC.clinClear(s, ctx.line); ctx.toast(again ? 'อนุมัติแล้ว แจ้งทุกฝั่งใน LINE ไม่มีการเก็บเงินซ้ำ' : 'อนุมัติแล้ว ส่งลิงก์ชำระให้ผู้รับบริการใน LINE'); return 'a.queue'; });
  SC.action('clinDecline', (s, ctx) => { const r = s.request; if (!r || !reviewerOk(s, ctx)) return; const lead = leadOf(r.review.byId); if (r.scopeHold) r.review.declined = true; else r.status = 'REVIEW_DECLINED'; Object.assign(r.review, { by: `${lead.name} (${lead.role})`, at: SC.REVIEW_AT, note: 'ทีมคลินิกอยากคุยรายละเอียดเพิ่ม เพื่อหาทางดูแลที่ปลอดภัยที่สุด' }); logReview(r, lead, 'DECLINED'); ctx.line('patient', { key: 'clinCall', text: `ทีมคลินิกขอโทรคุยก่อนนะคะ เพื่อหาทางดูแลที่ปลอดภัยที่สุด${r.paid ? ' ยอดชำระเดิมยังอยู่' : ' ยังไม่มีการเก็บเงิน'}` }); ctx.toast('แจ้งผู้รับบริการแล้ว ทีมโทรคุยต่อ'); });

  /* ================= a.match ================= */
  function meCandidate(s) {
    const r = s.request, d = district(s);
    if (s.pt.status === 'NONE') return null;
    const zoneOk = covers(s.pt.zones || [], d);
    const preferred = r.preferredPt === 'me';
    const st = level(score(s, 'me'));
    let ok = true, reason, warn = '';
    /* One decision for every PT (matching.js). Palm 6 Nov §2.2 order; 30/90-minute widening never relaxes these. Location stays a warning here: the team may call first, and the trace records it. */
    const g = (SC.clinGroup(s) || {}).id, mctx = SC.MATCH.ctxOf(s), ev = SC.MATCH.evalPt(SC.MATCH.adaptMe(s), mctx), cannot = ev.cannot;
    /* Payment is the case's gate, checked at dispatch and accept; this answer is about the PT and the clinical state. */
    const hard = ev.steps.find(x => !x.ok && x.key !== 'LOCATION' && !(x.key === 'CASE' && mctx.code === 'UNPAID'));
    if (hard) { ok = false; reason = hard.key === 'CAPABILITY' ? `ยังไม่ผ่านการพิจารณา: ${cannot.map(id => SC.CLIN.label(id)).join(' · ')}` : hard.why; }
    else if (zoneOk) reason = `ตรงพื้นที่ · รับงานใน${d}`;
    else { reason = `รับงาน: ${(s.pt.zones || []).join(' · ') || 'ยังไม่ระบุ'}`; warn = `${preferred ? 'ผู้รับบริการขอคนนี้ แต่ ' : ''}PT ไม่ได้ลงเขต${d} · ส่งข้ามโซนได้เมื่อทีมยืนยัน และ PT กดยอมรับพื้นที่เอง · ไม่มีค่าเดินทางเพิ่ม`; }
    if (ok && g && g !== 'UNSURE' && !(s.pt.services || []).includes(g)) warn = (warn ? warn + ' · ' : '') + `PT ไม่ได้เลือกรับงานกลุ่ม "${SC.CLIN.services.find(x => x.id === g).name}" · ทีมโทรถามก่อนส่ง`;
    return { id: 'me', ok, zoneOk, preferred, reason, warn, warned: st === 'WARNING', cannot };
  }
  /* FIX-01/02: rechecked when the PT accepts or starts, never trusted from the card. */
  SC.meCandidate = meCandidate;
  SC.patientDistrict = district; SC.ptCovers = covers; SC.ptPaused = s => level(score(s, 'me')) === 'PAUSED';
  /* FIX-R4-03: why this offer can't be accepted right now, for cards and counts. acceptOffer keeps its own check. Terms stay out: accepting leads to the Terms screen. */
  SC.offerBlock = s => { const g = s.request && meCandidate(s); if (!g || g.ok) return ''; if (g.cannot.length) return `ยังไม่ผ่านการพิจารณา: ${g.cannot.map(id => SC.CLIN.label(id)).join(' · ')}`; return s.pt.agreement ? g.reason : ''; };
  SC.visitHold = s => { const r = s.request; if (!r) return ''; if (r.scopeHold) return 'พักกิจกรรมไว้ก่อน ข้อมูลคนไข้เปลี่ยน รอทีมคลินิกแจ้ง นัดเดิมยังอยู่'; if (r.recheck || r.status === 'BOOKED') { const mc = meCandidate(s); if (mc && mc.cannot.length) return `พักกิจกรรมไว้ก่อน ทีมต้องตรวจงานนี้ก่อน: ${mc.cannot.map(id => SC.CLIN.label(id)).join(' · ')}`; } return ''; };
  SC.screen('a.match', {
    role: 'admin',
    render(s) {
      const r = s.request, a = A(s);
      const head = { kick: r && r.auto ? 'ห้องซ้อม: ระบบส่งงานให้เอง' : 'เลือก PT ด้วยตนเอง', title: 'จับคู่ PT', sub: 'แสดงเฉพาะเขตและเวลาที่ผู้รับบริการสะดวก ไม่มีที่อยู่เต็มในหน้านี้' };
      /* 7 Nov rehearsal P5: after a full refund the case is closed; this page must not invite anyone to send the job. */
      if (r && r.closed) { const rf = (s.refunds || []).slice().reverse().find(x => x.ref === r.ref && ['hold30', 'noPt', 'ptNoShow', 'cancelBefore', 'cancelAfter'].includes(x.kind));
        return shell(s, 'a.match', head, `<article class="card flat" data-match-closed><div class="row between wrap"><b class="h2">${esc(patientName(s))}</b>${reqPill(r)}</div>${kv([['เลขคำขอ', esc(r.ref)], ['เงินคืน', rf ? `${SC.money2(rf.amount)} · ${esc(SC.REFUND_STATUS[rf.status][0])} (${esc(rf.id)})` : '—']])}<p class="small" style="margin:0">ไม่ต้องจับคู่หรือค้นหาต่อ · ไม่มีงานค้างในคิว</p><div class="aa-acts"><button class="btn ghost" data-go="a.refunds">${I('banknote')}ดูเคสเงินคืน</button></div></article>`); }
      if (!r || ['CLINICAL_REVIEW', 'REVIEW_DECLINED', 'ASSESS_HOLD', 'PAYMENT_PENDING', 'SLIP_SENT'].includes(r.status)) {
        const cta = r && r.status === 'SLIP_SENT' ? '<button class="btn" data-go="a.payments">ไปตรวจสลิป</button>' : '';
        return shell(s, 'a.match', head, `<div class="card flat">${ui.empty('users-round', 'ยังไม่มีคำขอที่รอจับคู่', r ? `คำขอ ${r.ref} ${'รอผู้รับบริการชำระเงินก่อน'} ระบบจับคู่ให้ทันทีที่ได้สลิป` : 'เมื่อผู้รับบริการประเมินอาการและชำระ ClairMatch แล้ว คำขอจะขึ้นที่นี่', cta)}</div>`);
      }
      const d = district(s), z = zoneOf(d);
      /* PG-16 (CM X-RULE-OFF): the real app keeps automatic dispatch off until the 26 rules pass validation. Whether every request is manual is open (O-14). */
      const ruleOff = `<p class="sim-note" data-rule-off>ห้องซ้อม: ในแอปจริง การส่งงานอัตโนมัติยังปิดอยู่จนกว่ากฎ 26 เคสผ่านการตรวจ · จะปิดทุกคำขอหรือไม่ <b>รอตัดสิน</b></p>`;
      const wins = s.patient.windows || [];
      const bar = Object.values(s.patient.barthel || {}).filter(v => typeof v === 'number');
      const reqCard = `<article class="card flat">
        <div class="row between wrap"><b class="h2">${esc(patientName(s))}</b>${reqPill(r)}</div>
        ${kv([['เลขคำขอ', esc(r.ref)], ['เขต', esc(d ? `${d}${z ? ` · ${z.name}` : ''}` : 'ยังไม่ระบุ')], ['จองให้', s.patient.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัว' : 'ตัวเอง'], ['เป้าหมาย', esc(goalText(s) || '—')],
          bar.length ? ['กิจวัตรประจำวัน', `${bar.reduce((t, v) => t + v, 0)} คะแนน`] : null, ['ชำระแล้ว', `ClairMatch ${money(SC.TRIAL)}`]])}
        ${wins.length ? `<div class="stack"><span class="label">เวลาที่สะดวก</span>${wins.map((w, i) => `<span class="small">${i === 0 ? 'เวลาหลัก' : 'เวลาสำรอง ' + i} · ${esc(w)}</span>`).join('')}</div>` : ''}
      </article>`;
      if (r.status === 'OFFERED' || r.status === 'BOOKED') {
        const names = (r.offerTo || []).filter(id => r.status !== 'BOOKED' || !r.bookedPt || id === r.bookedPt).map(id => esc(SC.MATCH.nameOf(s, id) || ptName(s, id))).join(', ') || '—';
        const sent = r.status === 'OFFERED'
          ? `<article class="card flat"><div class="row"><span class="tile">${I('send')}</span><div class="grow"><b class="h3">${SC.offerBlock(s) ? `PT ยังรับไม่ได้ · ${esc(SC.offerBlock(s))}` : 'ส่งข้อเสนอแล้ว รอ PT ตอบรับภายใน 30 นาที'}</b><p class="p">ส่งให้ ${names} · ${esc(wins[a.win] || wins[0] || '')}</p>${r.auto ? `<span class="pill info">${I('zap')}ระบบส่งให้เอง · ${esc(r.auto)}</span>` : ''}</div></div>
              <p class="small">ถ้าไม่มีใครตอบใน 30 นาที ระบบค้นหาเวลาสำรองและโซนอื่นที่ให้บริการได้ตามลำดับ · ข้ามโซนต้องให้ทีมยืนยันก่อน</p>
              <div class="aa-acts"><button class="btn ghost" data-act="remindOffer">${I('bell')}เตือน PT ใน LINE อีกครั้ง</button></div></article>`
          : `<article class="card flat"><div class="row"><span class="tile">${I('circle-check')}</span><div class="grow"><b class="h3">PT รับงานแล้ว</b><p class="p">${names} · ${esc(SC.VISIT1.date)} ${esc(SC.VISIT1.time)}</p></div></div>
              <div class="aa-acts"><button class="btn ghost" data-go="a.appts">${I('calendar-days')}ดูนัดหมาย</button></div></article>`;
        return shell(s, 'a.match', head, `${ruleOff}<div class="aa-split"><div class="stack lg">${reqCard}${SC.searchCard ? SC.searchCard(s) : ''}</div><div class="stack lg">${sent}${SC.MATCH.traceCard(s)}</div></div>`);
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
        <p class="small" style="margin:0">ส่งได้เฉพาะ PT ที่ผ่านด่าน: ใบประกอบผ่าน · ส่งตารางแล้ว · ทำงานที่ทีมคลินิกอนุมัติได้ แล้วจึงเรียงตามเขตและเวลา · ค้นโซนอื่นต้องให้ทีมยืนยันก่อน และยังใช้ด่านเดิม</p>
        ${r.review && r.review.cleared ? `<div class="note mint">${I('clipboard-check')} ทีมคลินิกอนุมัติเฉพาะ:${SC.CLIN.list(r.review.allow, { tight: true, code: true })}${r.review.limits ? `<br>ข้อจำกัด: ${esc(r.review.limits)}` : ''}</div>` : ''}
        ${banner}
        ${meRow ? `<div class="stack"><span class="label">แนะนำให้ส่ง</span>${meRow}</div>` : `<p class="p">ยังไม่มี PT ที่ส่งได้ในเขตนี้</p>`}
      </article>`;
      // Palm (23 Oct): time + price + send sit right under "แนะนำให้ส่ง"; the long "can't send" list moves below and folds, so phones don't scroll past it.
      const notYet = `<details class="card flat aa-more"><summary class="row between"><span class="label">ยังส่งไม่ได้ ${SAMPLES.length} คน · ดูเหตุผล</span>${I('chevron-down')}</summary><div class="stack">${others}</div></details>`;
      const winCard = wins.length ? `<article class="card flat"><b class="h3">เลือกเวลาที่ผู้รับบริการเสนอ</b><div class="stack">${wins.map((w, i) => `<button class="aa-pick" data-pick="admin.win" data-value="${i}" aria-pressed="${a.win === i}"><span class="aa-box" style="border-radius:50%">${a.win === i ? I('check') : ''}</span><span class="grow"><span class="t">${i === 0 ? 'เวลาหลัก' : 'เวลาสำรอง ' + i}</span><span class="s">${esc(w)}</span></span></button>`).join('')}</div></article>` : '';
      const cross = a.tick.includes('me') && mc && mc.ok && !mc.zoneOk;
      const send = `<article class="card flat"><div class="row between wrap"><span class="label">ราคา</span><span><b class="money">ClairMatch ${money(SC.TRIAL)}</b> <span class="small">· ชำระแล้ว · ไม่มีค่าเดินทางแยก</span></span></div>
        ${cross ? `<label class="check" data-cross-confirm><input type="checkbox" data-bind="admin.crossOk" ${a.crossOk ? 'checked' : ''}><span>ทีมยืนยันส่งข้ามโซน · PT ต้องกดยอมรับพื้นที่เองในงานเสนอ</span></label>` : ''}
        <button class="btn" data-act="sendOffer" data-need="admin.tick">${I('send')}ส่งข้อเสนอให้ PT ที่เลือก${a.tick.length ? ` (${a.tick.length} คน)` : ''}</button>
        <p class="small" style="margin:0">PT ได้การ์ดใน LINE และต้องตอบรับภายใน 30 นาที</p></article>`;
      return shell(s, 'a.match', head, `${ruleOff}<div class="aa-split"><div class="stack lg">${reqCard}${SC.searchCard ? SC.searchCard(s) : ''}</div><div class="stack lg">${picks}${winCard}${send}${SC.MATCH.traceCard(s)}${notYet}</div></div>`);
    }
  });
  SC.action('sendOffer', (s, ctx) => {
    const a = A(s), r = s.request; if (!r || r.status !== 'PAID' || !a.tick || !a.tick.length) return;
    if (a.tick.includes('me')) { const mc = meCandidate(s); if (!mc || !mc.ok) { ctx.toast(`ส่งไม่ได้: ${mc ? mc.reason : 'ไม่พบ PT'}`); return; }
      /* NEW-03 (H13 7 Nov): cross-zone only with staff confirmation, and the PT must accept the zone. */
      if (!mc.zoneOk) { if (!a.crossOk) { ctx.toast('ข้ามโซน: ติ๊กยืนยันของทีมก่อนส่ง'); return; } r.crossZone = true; s.pt.crossOk = false; } }
    r.status = 'OFFERED'; r.offerTo = a.tick.slice();
    ctx.line('pt', { key: 'ptOffer' }); SC.MATCH.evaluate(s); SC.MATCH.logOffer(s, r.offerTo, 'แอดมินส่งเอง');
    ctx.toast(`ส่งข้อเสนอให้ PT ${r.offerTo.length} คนแล้ว รอตอบรับภายใน 30 นาที`);
  });
  SC.action('remindOffer', (s, ctx) => { ctx.line('pt', { key: 'ptOffer' }); ctx.toast('ส่งการ์ดข้อเสนอให้ PT ใน LINE อีกครั้งแล้ว'); });

  /* ================= a.appts ================= */
  SC.screen('a.appts', {
    role: 'admin',
    render(s) {
      const r = s.request;
      const note = r && r.status === 'OFFERED' ? `<div class="note">${I('hourglass')} ส่งข้อเสนอให้ PT แล้ว นัดจะขึ้นที่นี่เมื่อ PT ตอบรับ</div>` : '';
      /* 7 Nov rehearsal P2: a cancelled or no-show visit is not "เสร็จแล้ว". */
      const pill = x => { const o = SC.visitOutcome && SC.visitOutcome(s, x); if (o && !o.done) return `<span class="pill warn" data-outcome="${esc(o.kind)}">${esc(o.label)}</span>${o.money ? `<span class="small">${esc(o.money)}${o.now ? ` · ${esc(o.now)}` : ''}</span>` : ''}`; return x.step >= 4 ? '<span class="pill">เสร็จแล้ว</span>' : x.step === 0 ? '<span class="pill info">นัดแล้ว</span>' : `<span class="pill wait">${STEP[x.step]}</span>`; };
      const body = s.visits.length
        ? table(['นัด', 'นักกายภาพ', 'วันเวลา', 'สถานะ', ''], s.visits.map(x => ({ attrs: `data-act="openAppt" data-n="${x.n}"`, cells: [`<div class="t">${esc(patientName(s))}</div><span class="small">ครั้งที่ ${x.n}</span>`, esc(meName(s)), `${esc(x.date)}<br><span class="small">${esc(x.time)}</span>`, `<div class="stack" style="gap:4px;justify-items:start">${pill(x)}${x.published ? '<span class="small">ส่งสรุปแล้ว</span>' : ''}</div>`, `<button class="ib" data-act="openAppt" data-n="${x.n}" aria-label="ดูรายละเอียดนัดครั้งที่ ${x.n}">${I('chevron-right')}</button>`] })))
        : `<div class="card flat">${ui.empty('calendar-days', 'ยังไม่มีนัด', 'นัดจะขึ้นเมื่อ PT ตอบรับข้อเสนอ หรือเมื่อทีมยืนยันเงินคอร์สและวันนัดครั้งต่อไป')}</div>`;
      return shell(s, 'a.appts', { kick: 'นัดหมาย', title: 'นัดหมาย', sub: 'ทุกนัดในระบบ กดที่แถวเพื่อดูขั้นตอนวันทำเคสและสรุปผล' }, note + body);
    }
  });
  SC.action('openAppt', (s, ctx) => {
    const x = s.visits.find(v => v.n === +ctx.data.n); if (!x) return;
    const o = SC.visitOutcome && SC.visitOutcome(s, x), ex = o && !o.done;
    const steps = ex ? STEP.slice(0, o.stoppedAt + 1).map(t => `<div class="step done"><span class="dot">${I('check')}</span><div><div class="t">${t}</div></div></div>`).join('') + `<div class="step now"><span class="dot">${I('x')}</span><div><div class="t">${esc(o.label)}</div><div class="s">${esc(o.why)}${o.at ? ` · ${esc(o.at)}` : ''}</div></div></div>`
      : STEP.map((t, i) => `<div class="step ${i < x.step || x.step === 4 ? 'done' : i === x.step ? 'now' : ''}"><span class="dot">${i < x.step || x.step === 4 ? I('check') : i + 1}</span><div><div class="t">${t}</div></div></div>`).join('');
    const so = x.soap || {};
    const report = ex ? '' : x.published ? `<div class="card mint"><b class="h3">สรุปที่ส่งให้คนไข้แล้ว</b>${kv([so.goal ? ['เป้าหมาย', esc(so.goal)] : null, so.dx ? ['การวินิจฉัย', esc(so.dx)] : null, so.p ? ['แผน', esc(so.p)] : null, so.family ? ['ฝากญาติ', esc(so.family)] : null])}</div>` : '<div class="note">ยังไม่ส่งสรุปผล PT ส่งหลังจบเคส</div>';
    openSheet(ctx, `${sheetHead(`ครั้งที่ ${x.n} · ${patientName(s)}`, `${x.date} ${x.time}`)}
      ${kv([['นักกายภาพ', esc(meName(s))], ['เขต', esc(district(s) || '—')], ['สถานะ', ex ? esc(o.label) : esc(STEP[x.step])], ex && o.money ? ['เงิน', esc(`${o.money}${o.now ? ' · ' + o.now : ''}`)] : null])}
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
        id === 'me' ? ['ตารางเวลา', s.pt.schedule && s.pt.schedule.sent ? 'ส่งแล้ว' : 'ยังไม่ส่ง'] : null, id === 'me' ? ['ข้อตกลง PT', s.pt.agreement ? 'ยอมรับแล้ว' : 'ยังไม่ยอมรับ'] : null])}
      <div class="stack"><button class="btn ghost" data-act="suspicionReport" data-pt="${id}">${I('shield-alert')}บันทึกเรื่องที่คนไข้แจ้ง</button><button class="btn ghost" data-close>ปิด</button></div>`);
  });

  /* ================= a.patients ================= */
  SC.screen('a.patients', {
    role: 'admin',
    render(s) {
      const r = s.request;
      const em = SC.emCase && SC.emCase(s);
      const emRow = em ? table(['ผู้ตอบว่าฉุกเฉิน', 'เบอร์', 'ตอบเมื่อ', 'สถานะ', ''], [{ attrs: 'data-act="emOpen"', cells: [`<div class="t">${esc(em.name)}</div><span class="small">ยังไม่มีคำขอ · ระบบหยุดการจอง</span>`, esc(em.phone || '—'), esc(em.at), em.closed ? '<span class="pill gray">โทรแล้ว · ปิดงาน</span>' : `<span class="pill warn">${em.revised ? 'แก้คำตอบเป็นไม่มี · ยังต้องโทร' : 'รอโทรตาม'}</span>`, `<button class="ib" data-act="emOpen" aria-label="เปิดงานฉุกเฉิน">${I('chevron-right')}</button>`] }]) : '';
      const emSec = em ? `<section class="aa-sec" data-em-row><h2 class="h3">ตอบว่ามีอาการฉุกเฉิน</h2>${emRow}</section>` : '';
      if (!r) return shell(s, 'a.patients', { kick: 'ผู้รับบริการ', title: 'คนไข้' }, emSec || `<div class="card flat">${ui.empty('heart-handshake', 'ยังไม่มีผู้รับบริการ', 'เมื่อมีคนประเมินอาการและส่งคำขอ รายชื่อจะขึ้นที่นี่')}</div>`);
      const c = s.course;
      const course = c ? (c.refunded ? `<span class="pill gray">คอร์สปิด · คืน ${SC.money2(c.refunded.amount)}</span>` : c.approved ? `<span class="pill">คอร์ส ${c.sessions + (c.bonus || 0)} ครั้ง · ใช้แล้ว ${c.used || 0} · เหลือ ${SC.courseLeft(c)}</span>` : '<span class="pill wait">รอตรวจเงินคอร์ส</span>') : '<span class="small">ยังไม่มีคอร์ส</span>';
      const rows = [{ attrs: 'data-act="openPatient"', cells: [`<div class="t">${esc(patientName(s))}</div><span class="small">${esc(r.ref)}</span>`, esc(district(s) || '—'), r.preferredPt ? esc(ptName(s, r.preferredPt)) : '<span class="small">ให้ทีมเลือก</span>', reqPill(r), course, `<button class="ib" data-act="openPatient" aria-label="ดูรายละเอียด">${I('chevron-right')}</button>`] }];
      return shell(s, 'a.patients', { kick: 'ผู้รับบริการ', title: 'คนไข้', sub: 'ข้อมูลส่วนตัวเปิดดูได้เฉพาะทีมที่ดูแลเคส กดที่แถวเพื่อดูรายละเอียด' }, emSec + table(['ผู้รับบริการ', 'เขต', 'PT ที่ขอ', 'สถานะ', 'คอร์ส', ''], rows));
    }
  });
  SC.action('openPatient', (s, ctx) => {
    const r = s.request; if (!r) return;
    const ad = s.patient.address || {}, c = s.course;
    const addr = [ad.line, ad.subdistrict, ad.district, ad.province, ad.postal].filter(Boolean).join(' ');
    openSheet(ctx, `${sheetHead(patientName(s), r.ref)}
      ${kv([['สถานะ', reqPill(r)], ['จองให้', s.patient.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัว' : 'ตัวเอง'], ['โทร', esc(s.patient.phone || '—')], ['ที่อยู่', esc(addr || '—')], ['เป้าหมาย', esc(goalText(s) || '—')], ['เรื่องสุขภาพที่เล่า', esc(s.patient.healthStory || '—')], ['ออกจาก รพ. / ข้อห้ามแพทย์', s.patient.health && s.patient.health.q4 === 'YES' ? esc(s.patient.medNote || 'มี (ยังไม่ได้เล่า)') : '—'], ['ผ่าตัด / อุปกรณ์ในร่างกาย', s.patient.health && s.patient.health.q5 === 'YES' ? esc(s.patient.surgeryNote || 'เคย (ยังไม่ระบุ)') : '—'], ['อุปกรณ์ที่ใช้', s.patient.health && s.patient.health.q3 === 'YES' ? esc((s.patient.devices || []).map(d => d === 'อื่น ๆ' && s.patient.deviceOther ? s.patient.deviceOther : d).join(' · ') || 'มี (ยังไม่ระบุ)') : '—'], ['โรคประจำตัว', s.patient.health && s.patient.health.q6 === 'YES' ? esc((s.patient.conditions || []).map(c => c === 'อื่น ๆ' && s.patient.conditionOther ? s.patient.conditionOther : c).join(' · ') || 'มี (ยังไม่ระบุ)') : '—'], ['ความดันล่าสุด', (() => { const b = s.patient.bp, c = SC.bpCat(b); return b && b.unknown ? 'ไม่ทราบค่า' : c ? `${esc(b.sys)}/${esc(b.dia)} mmHg · <span class="pill ${c.tone === 'ok' ? '' : c.tone}">${c.label}</span>` : '—'; })()], ['เวลาที่สะดวก', (s.patient.windows || []).map(esc).join('<br>') || '—'], ['PT ที่ขอ', r.preferredPt ? esc(ptName(s, r.preferredPt)) : 'ให้ทีมเลือก'],
        ['คอร์ส', c ? esc(`${c.sessions + (c.bonus || 0)} ครั้ง ${money(c.total)} · ${c.refunded ? `ปิดแล้ว คืน ${SC.money2(c.refunded.amount)}` : c.approved ? `ใช้แล้ว ${c.used || 0} · เหลือ ${SC.courseLeft(c)} ครั้ง` : 'รอตรวจเงิน'}`) : 'ยังไม่มี'], ['นัดถัดไป', esc((s.visits.find(x => x.step < 4) || {}).date || '—')]])}
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
