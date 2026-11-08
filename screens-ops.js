/* screens-ops.js · Admin home "งานรอจัดการ" as a one-stop board (7 Nov rehearsal, section "แอดมินอยากเห็นอะไรในหน้าแรก").
   Everything here is read from the rehearsal state: no sample numbers. An empty box says "ยังไม่มีข้อมูล".
   - Alert strip: new emergency, hold day 14/30 coming, search past 24 h, OPD past 2 h, odd slip, open incident
   - 8 live counters; tapping one filters the list
   - "ตาใคร": every open task with its owner (พี่นัท / พี่ปาล์ม / บอส), inline action, gone when the case closes
   - Case timeline: one case end to end with amounts and who did what
   Also the emergency and incident close actions (P6, P15). Kit classes plus the ops- prefix. Load after policy-1107.js. */
(function () {
  'use strict';
  const { ui, esc, money } = SC, money2 = SC.money2, I = ui.icon;

  document.head.insertAdjacentHTML('beforeend', `<style>
  .ops { display: grid; gap: 14px; }
  .ops-alerts { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 12px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); }
  .ops-alerts.calm { color: var(--sub); font-size: 13.5px; }
  .ops-alerts > b { font: 600 13.5px var(--display); color: var(--forest); margin-right: 2px; }
  .ops-al { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 4px 12px; border: 0; border-radius: 99px; background: var(--cream); color: var(--gink); font: 600 13px var(--display); text-align: left; cursor: pointer; }
  .ops-al.red { background: var(--redbg); color: var(--red); }
  .ops-al svg { width: 16px; height: 16px; flex: none; }
  .ops-k { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  .ops-c { display: grid; align-content: start; gap: 3px; min-width: 0; padding: 12px 14px; border: 0; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); text-align: left; color: inherit; cursor: pointer; }
  .ops-c[aria-pressed="true"] { box-shadow: inset 0 0 0 2px var(--em); background: #f3f8f5; }
  .ops-c .h { display: flex; align-items: center; gap: 6px; font: 600 13px var(--display); color: var(--sub); }
  .ops-c .h svg { width: 15px; height: 15px; color: var(--em); }
  .ops-c .n { font: 700 24px/1.15 var(--display); color: var(--forest); }
  .ops-c .n small { font: 600 13px var(--display); color: var(--sub); margin-left: 4px; }
  .ops-c .d { font-size: 12.5px; color: var(--sub); line-height: 1.45; overflow-wrap: anywhere; }
  .ops-c .d b { color: var(--ink); font-weight: 600; }
  .ops-c.hot .n { color: var(--red); }
  .ops-c .none { font-size: 13px; color: var(--mute); }
  .ops-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 14px; align-items: start; }
  .ops-panel { display: grid; gap: 10px; padding: 14px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); min-width: 0; }
  .ops-ph { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
  .ops-ph h2 { margin: 0; font: 600 16px var(--display); color: var(--forest); }
  .ops-own { display: flex; flex-wrap: wrap; gap: 6px; }
  .ops-own button { min-height: 34px; padding: 0 12px; border: 0; border-radius: 99px; background: var(--mint); color: var(--forest); font: 600 13px var(--display); cursor: pointer; }
  .ops-own button[aria-pressed="true"] { background: var(--em); color: #fff; }
  .ops-own button span { margin-left: 4px; opacity: .8; }
  .ops-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px 12px; align-items: center; padding: 10px 0; border-top: 1px solid var(--line); }
  .ops-row:first-of-type { border-top: 0; }
  .ops-row .tile { width: 36px; height: 36px; border-radius: 11px; }
  .ops-row .t { font: 600 14.5px var(--display); color: var(--forest); overflow-wrap: anywhere; }
  .ops-row .s { font-size: 12.5px; color: var(--sub); overflow-wrap: anywhere; }
  .ops-row .m { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 2px; }
  .ops-who { display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 99px; background: var(--forest); color: #fff; font: 600 11.5px var(--display); }
  .ops-who.palm { background: var(--em); } .ops-who.boss { background: #2c4a5e; } .ops-who.nat { background: #5b4a2e; }
  .ops-age { font-size: 12px; color: var(--mute); }
  .ops-acts { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
  .ops-acts .btn { min-height: 36px; padding: 0 12px; font-size: 13.5px; }
  .ops-empty { padding: 18px 4px; text-align: center; color: var(--sub); font-size: 14px; }
  .ops-tl { list-style: none; margin: 0; padding: 0; display: grid; }
  .ops-tl li { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 10px; position: relative; padding-bottom: 12px; }
  .ops-tl li::before { content: ''; position: absolute; left: 12px; top: 26px; bottom: 0; width: 2px; background: var(--line); }
  .ops-tl li:last-child::before { display: none; }
  .ops-tl i { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: #eef1ef; color: var(--mute); font: 700 12px var(--display); font-style: normal; }
  .ops-tl li.d i { background: var(--em); color: #fff; }
  .ops-tl li.n i { background: var(--gold2); color: var(--forest); }
  .ops-tl li.x i { background: var(--redbg); color: var(--red); }
  .ops-tl i svg { width: 14px; height: 14px; }
  .ops-tl b { display: block; font: 600 14px var(--display); color: var(--forest); }
  .ops-tl p { margin: 2px 0 0; font-size: 12.5px; color: var(--sub); overflow-wrap: anywhere; }
  .ops-tl p em { font-style: normal; color: var(--ink); font-weight: 600; }
  .ops-sum { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .ops-sum div { padding: 8px 10px; border-radius: 12px; background: var(--mint); }
  .ops-sum span { display: block; font-size: 12px; color: var(--sub); }
  .ops-sum b { font: 700 15px var(--display); color: var(--forest); }
  @container (max-width: 860px) { .ops-grid { grid-template-columns: minmax(0, 1fr); } }
  @container (max-width: 640px) { .ops-k { grid-template-columns: repeat(2, minmax(0, 1fr)); } .ops-row { grid-template-columns: auto minmax(0, 1fr); } .ops-acts { grid-column: 1 / -1; justify-content: stretch; } .ops-acts .btn { flex: 1 1 auto; } .ops-sum { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }
  </style>`);

  const TEAM = () => SC.TEAM || {};
  const nameOf = id => (TEAM()[id] || {}).name || id;
  const Q = s => { const a = s.admin = s.admin || {}; a.q = a.q || { f: 'now', owner: 'all' }; return a.q; };
  const NONE = 'ยังไม่มีข้อมูล';
  const taskKey = x => `${x.kind || 'x'}:${x.title}`;
  const hours = from => from && SC.clockHours ? SC.clockHours(from) : null;
  const ageText = h => h == null ? '' : h < 1 ? 'ไม่ถึง 1 ชม.' : h < 48 ? `${Math.round(h)} ชม.` : `${Math.round(h / 24)} วัน`;
  const visitEnd = v => { const m = /–(\d{2}):(\d{2})/.exec(v.time || ''), h = /^(\d{2}):(\d{2})/.exec(v.time || ''); if (!m || !h) return 60; return (+m[1] * 60 + +m[2]) - (+h[1] * 60 + +h[2]); };
  const isoDate = iso => String(iso || '').slice(0, 10);

  /* ---------- What the counters read ---------- */
  function facts(s) {
    const r = s.request, refunds = s.refunds || [], tasks = SC.adminTasks(s), now = SC.clockNow(s), co = s.course, P = SC.POLICY;
    /* money in */
    const slipWait = [], slipOk = [];
    if (r && r.check && r.check.state === 'open') slipWait.push({ t: 'ClairMatch', amt: SC.TRIAL });
    if (co && co.slip && !co.approved) slipWait.push({ t: 'คอร์ส', amt: co.total });
    if (r && ['PAID', 'OFFERED', 'BOOKED'].includes(r.status) && !(r.check && r.check.state === 'open')) slipOk.push({ t: 'ClairMatch', amt: SC.TRIAL });
    if (co && co.approved) slipOk.push({ t: 'คอร์ส', amt: co.total });
    /* refunds by step */
    const steps = ['DRAFT', 'REQUESTED', 'APPROVED', 'TRANSFERRED'].map(k => { const xs = refunds.filter(x => x.status === k); return { k, n: xs.length, amt: xs.reduce((t, x) => t + (x.amount || 0), 0) }; });
    const refundOpen = refunds.filter(x => ['DRAFT', 'REQUESTED', 'APPROVED', 'TRANSFERRED'].includes(x.status));
    const refunded = refunds.filter(x => ['TRANSFERRED', 'RECONCILED'].includes(x.status)).reduce((t, x) => t + (x.amount || 0), 0);
    /* waiting for a PT: paid, not matched, not closed */
    const waitPt = r && r.status === 'PAID' && !r.closed ? [{ ref: r.ref, since: `${r.paidAt || '2026-10-22'}T09:00`, d24: !!(r.search && r.search.notice24) }] : [];
    /* today's visits by real state */
    const today = isoDate(now), vToday = s.visits.filter(v => isoDate(SC.visitIso(v)) === today);
    const byState = { travel: 0, arrived: 0, care: 0, done: 0, other: 0, opd: 0 };
    vToday.forEach(v => { const o = SC.visitOutcome(s, v); if (o && !o.done) byState.other++; else if (v.step >= 4) { byState.done++; if (!v.published) byState.opd++; } else if (v.step === 3) byState.care++; else if (v.step === 2) byState.arrived++; else if (v.step === 1) byState.travel++; });
    const nextV = s.visits.filter(v => v.step < 4).map(v => SC.visitIso(v)).filter(x => x && x >= now).sort()[0];
    /* OPD past 2 h after the visit ends */
    const opdLate = s.visits.filter(v => v.step >= 4 && !v.exit && !v.published && SC.visitIso(v) && SC.visitIso(v, visitEnd(v) + 120) < now);
    /* safety */
    const em = SC.emCase(s), emOpen = em && !em.closed ? em : null, inc = (s.incidents || []).filter(x => x.open);
    const hold = r && r.scopeHold && !r.closed ? (() => { const paid = r.paidAt || '2026-10-22', H = r.hold || {}; return { d14: SC.addDays(paid, 14), d30: SC.addDays(paid, 30), sent14: !!H.d14, sent30: !!H.d30 }; })() : null;
    /* PT team */
    const lic = s.pt.status === 'PENDING' ? 1 : 0, caps = SC.capPending ? (s.pt.status === 'VERIFIED' ? SC.capPending(s) : []) : [], sched = s.pt.status !== 'NONE' && s.pt.schedule && s.pt.schedule.sent ? 1 : 0;
    /* owed to PTs: every visit that ended, at the rate the documents set; the rehearsal has no payout run yet */
    let normal = 0, comp = 0; const owed = [];
    s.visits.forEach(v => { if (v.step < 4) return; const pay = v.exit ? SC.exitPay(v) : v.n === 1 ? P.trialPtNet : co && co.approved ? (co.net || 0) / (co.sessions + (co.bonus || 0)) : s.perVisit ? s.perVisit.net : 0;
      if (!pay) return; if (v.exit) comp += pay; else normal += pay; owed.push({ n: v.n, pay, exit: !!v.exit, label: v.exit ? SC.exitLabel(v) : 'ดูแลครบ' }); });
    return { r, tasks, slipWait, slipOk, steps, refundOpen, refunded, waitPt, vToday, byState, today, nextV, opdLate, emOpen, inc, hold, lic, caps, sched, normal, comp, owed };
  }

  /* ---------- Alert strip ---------- */
  function alerts(s, f) {
    const a = [], r = f.r;
    if (f.emOpen) a.push(['red', 'siren', `ฉุกเฉิน: ${f.emOpen.name}${f.emOpen.revised ? ' (แก้คำตอบแล้ว ยังต้องโทร)' : ''}`, 'emOpen']);
    f.inc.forEach(x => a.push(['red', 'triangle-alert', `Incident ${x.id} · ${x.title}`, 'incOpen', x.id]));
    if (f.hold) { if (!f.hold.sent14) a.push(['', 'calendar-clock', `พักการดูแล ${r.ref}: วันที่ 14 = ${SC.thDateIso(f.hold.d14)}`, 'go:a.clinical']); else if (!f.hold.sent30) a.push(['', 'calendar-clock', `พักการดูแล ${r.ref}: วันที่ 30 = ${SC.thDateIso(f.hold.d30)}`, 'go:a.clinical']); }
    if (f.waitPt.some(x => x.d24)) a.push(['', 'search', `ค้นหา ${r.ref} ครบ 24 ชม. แล้วยังไม่ได้ PT`, 'go:a.match']);
    f.opdLate.forEach(v => a.push(['', 'file-clock', `OPD ครั้งที่ ${v.n} เกิน 2 ชม. แล้ว`, 'go:a.appts']));
    if (r && r.check && r.check.state === 'open') a.push(['', 'receipt', `สลิปยอดไม่ตรง ${r.ref}`, 'go:a.payments']);
    if (!a.length) return `<div class="ops-alerts calm" data-ops-alerts="0">${I('circle-check')} ไม่มีเรื่องด่วน · ฉุกเฉิน Incident วันที่ 14/30 ค้นหาเกิน 24 ชม. OPD เกิน 2 ชม. และสลิปผิดยอด จะขึ้นที่นี่</div>`;
    return `<div class="ops-alerts" data-ops-alerts="${a.length}" role="status"><b>${I('bell-ring')} เตือน</b>${a.map(([tone, ic, t, to, id]) => to.startsWith('go:') ? `<button class="ops-al ${tone}" data-go="${to.slice(3)}">${I(ic)}${esc(t)}</button>` : `<button class="ops-al ${tone}" data-act="${to}" ${id ? `data-id="${esc(id)}"` : ''}>${I(ic)}${esc(t)}</button>`).join('')}</div>`;
  }

  /* ---------- Counters ---------- */
  function counters(s, f, q) {
    const own = q.owner, mine = f.tasks.filter(x => own === 'all' || x.owner === own), oldest = Math.max(-1, ...mine.map(x => hours(x.at)).filter(h => h != null));
    const c = (k, ic, title, n, unit, detail, hot) => `<button class="ops-c ${hot ? 'hot' : ''}" data-act="opsFilter" data-f="${k}" aria-pressed="${q.f === k}" data-counter="${k}" data-n="${n}"><span class="h">${I(ic)}${title}</span>${n === null ? `<span class="n" style="font-size:16px">—</span><span class="none">${NONE}</span>` : `<span class="n">${n}${unit ? `<small>${unit}</small>` : ''}</span><span class="d">${detail}</span>`}</button>`;
    const sum = xs => xs.reduce((t, x) => t + x.amt, 0);
    const st = Object.fromEntries(f.steps.map(x => [x.k, x]));
    const waitH = f.waitPt.length ? Math.max(...f.waitPt.map(x => hours(x.since) || 0)) : 0;
    const b = f.byState, anyToday = f.vToday.length;
    return `<div class="ops-k" role="group" aria-label="ตัวเลขสด กดเพื่อกรองรายการ">
      ${c('now', 'list-todo', 'ต้องทำตอนนี้', mine.length, 'งาน', mine.length ? `${own === 'all' ? 'ทุกคน' : `ตา${esc(nameOf(own))}`}${oldest >= 0 ? ` · เก่าสุด <b>${ageText(oldest)}</b>` : ''}` : 'ไม่มีงานค้าง', mine.some(x => x.hot))}
      ${c('money', 'wallet', 'เงินเข้า', f.slipWait.length || f.slipOk.length ? f.slipWait.length : null, 'รอตรวจ', `${f.slipWait.length ? `รอตรวจ <b>${money(sum(f.slipWait))}</b> · ` : ''}ยืนยันแล้ว <b>${money(sum(f.slipOk))}</b>${f.slipOk.length ? ` (${f.slipOk.map(x => x.t).join(' + ')})` : ''}`)}
      ${c('refund', 'banknote', 'คืนเงินแต่ละขั้น', (s.refunds || []).length ? f.refundOpen.length : null, 'เปิดอยู่', `รอผู้ขอ <b>${st.DRAFT.n}</b> · รอพี่ปาล์ม <b>${st.REQUESTED.n}</b> · รอโอน <b>${st.APPROVED.n}</b> · รอกระทบยอด <b>${st.TRANSFERRED.n}</b><br>ค้าง ${money2(f.refundOpen.reduce((t, x) => t + (x.amount || 0), 0))} · คืนแล้ว ${money2(f.refunded)}`, st.APPROVED.n > 0)}
      ${c('waitpt', 'user-search', 'รอ PT (นานสุด)', f.r && ['PAID', 'OFFERED', 'BOOKED'].includes(f.r.status) || f.waitPt.length ? f.waitPt.length : null, 'เคส', f.waitPt.length ? `นานสุด <b>${ageText(waitH)}</b> นับจากชำระ · ครบ 24 ชม. <b>${f.waitPt.filter(x => x.d24).length}</b>` : f.r && f.r.closed ? 'เคสปิดแล้ว ไม่ต้องหา PT' : 'ทุกเคสที่ชำระแล้วมี PT', f.waitPt.some(x => x.d24))}
      ${c('today', 'calendar-days', `นัดวันนี้ · ${SC.thDateIso(f.today)}`, s.visits.length ? anyToday : null, 'นัด', anyToday ? `เดินทาง <b>${b.travel}</b> · ถึงแล้ว <b>${b.arrived}</b> · กำลังดูแล <b>${b.care}</b> · จบ <b>${b.done}</b> · จบแบบอื่น <b>${b.other}</b> · OPD ค้าง <b>${b.opd}</b>` : f.nextV ? `ไม่มีนัดวันนี้ · นัดถัดไป <b>${esc(SC.clockText(f.nextV))}</b>` : 'ไม่มีนัดวันนี้', b.other > 0 || f.opdLate.length > 0)}
      ${c('safety', 'shield-alert', 'ความปลอดภัย', f.emOpen || f.inc.length || f.hold || SC.emCase(s) || (s.incidents || []).length ? (f.emOpen ? 1 : 0) + f.inc.length + (f.hold ? 1 : 0) : null, 'เปิดอยู่', `ฉุกเฉิน <b>${f.emOpen ? 1 : 0}</b> · Incident <b>${f.inc.length}</b> · พักการดูแล <b>${f.hold ? 1 : 0}</b>${f.hold ? `<br>วันที่ 14 = ${SC.thDateIso(f.hold.d14)}${f.hold.sent14 ? ' (แจ้งแล้ว)' : ''} · วันที่ 30 = ${SC.thDateIso(f.hold.d30)}${f.hold.sent30 ? ' (แจ้งแล้ว)' : ''}` : ''}`, !!f.emOpen || f.inc.length > 0)}
      ${c('team', 'stethoscope', 'ทีม PT รอตรวจ', s.pt.status === 'NONE' ? null : f.lic + (f.caps.length ? 1 : 0), 'เรื่อง', `ใบประกอบ <b>${f.lic}</b> · งานเฉพาะทาง/ขอคุย <b>${f.caps.length}</b>${f.caps.length ? ` (${esc(f.caps.join(', '))})` : ''} · ส่งตารางแล้ว <b>${f.sched}</b> คน`)}
      ${c('ptpay', 'hand-coins', 'ค้างจ่าย PT', f.owed.length ? money2(f.normal + f.comp) : null, '', `รอบโอนถัดไป · ปกติ <b>${money2(f.normal)}</b> · ค่าชดเชย <b>${money2(f.comp)}</b><br>ห้องซ้อมยังไม่มีรอบจ่าย นับทุกนัดที่จบแล้ว`)}
    </div>`;
  }

  /* ---------- "ตาใคร" list ---------- */
  const KIND_OF = { now: null, money: ['money'], refund: ['refund'], waitpt: ['match'], safety: ['safety', 'clinical'], team: ['team'] };
  function rows(s, f, q) {
    let list = f.tasks.filter(x => q.owner === 'all' || x.owner === q.owner);
    if (q.f === 'today') return visitRows(s, f);
    if (q.f === 'ptpay') return payRows(f);
    if (KIND_OF[q.f]) list = list.filter(x => KIND_OF[q.f].includes(x.kind));
    list = list.slice().sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0) || (hours(b.at) || 0) - (hours(a.at) || 0));
    if (!list.length) return `<div class="ops-empty" data-ops-empty>${I('circle-check')} ${q.owner === 'all' ? 'ไม่มีงานค้างในหมวดนี้' : `ไม่มีงานที่เป็นตา${esc(nameOf(q.owner))}`} · งานใหม่จะขึ้นที่นี่ทันที พร้อมแจ้งใน LINE ของคนนั้น</div>`;
    return list.map(x => { const age = ageText(hours(x.at)), inl = x.inline;
      return `<div class="ops-row" data-task="${esc(taskKey(x))}" data-owner="${esc(x.owner || '')}"><span class="tile ${x.hot ? 'gold' : ''}">${I(x.icon)}</span>
        <div class="grow"><div class="m"><span class="ops-who ${esc(x.owner || '')}">ตา${esc(nameOf(x.owner))}</span>${x.tag ? `<span class="pill ${x.hot ? 'wait' : 'gray'}">${esc(x.tag)}</span>` : ''}${age ? `<span class="ops-age">ค้าง ${age}</span>` : ''}</div><div class="t">${esc(x.title)}</div><div class="s">${esc(x.sub)}</div></div>
        <div class="ops-acts">${inl ? `<button class="btn" data-act="opsDo" data-key="${esc(taskKey(x))}">${esc(inl.label)}</button>` : ''}<button class="btn ${inl ? 'ghost' : ''}" data-go="${x.go}">${esc(x.cta)}${I('chevron-right')}</button>${x.ref ? `<button class="btn ghost" data-act="opsCase" data-ref="${esc(x.ref)}" aria-label="ดูเส้นทางเคส ${esc(x.ref)}">${I('route')}</button>` : ''}</div></div>`; }).join('');
  }
  function visitRows(s, f) {
    if (!f.vToday.length) return `<div class="ops-empty">${I('calendar-days')} ไม่มีนัดวันนี้ (${SC.thDateIso(f.today)})${f.nextV ? ` · นัดถัดไป ${esc(SC.clockText(f.nextV))}` : ''}</div>`;
    const STEP = ['นัดแล้ว', 'PT กำลังเดินทาง', 'PT ถึงแล้ว', 'กำลังดูแล', 'จบแล้ว'];
    return f.vToday.map(v => { const o = SC.visitOutcome(s, v), ex = o && !o.done;
      return `<div class="ops-row"><span class="tile">${I(ex ? 'circle-x' : 'calendar-days')}</span><div class="grow"><div class="m"><span class="pill ${ex ? 'warn' : v.step >= 4 ? '' : 'info'}">${esc(ex ? o.label : STEP[v.step])}</span>${v.step >= 4 && !v.exit && !v.published ? '<span class="pill wait">OPD ยังไม่ส่ง</span>' : ''}</div><div class="t">ครั้งที่ ${v.n} · ${esc(s.patient.name || 'ผู้รับบริการ')}</div><div class="s">${esc(v.date)} ${esc(v.time)}${ex && o.money ? ` · ${esc(o.money)}` : ''}</div></div><div class="ops-acts"><button class="btn ghost" data-act="openAppt" data-n="${v.n}">ดูนัด${I('chevron-right')}</button></div></div>`; }).join('');
  }
  function payRows(f) {
    if (!f.owed.length) return `<div class="ops-empty">${I('hand-coins')} ${NONE} · ยังไม่มีนัดที่จบ</div>`;
    return f.owed.map(x => `<div class="ops-row"><span class="tile">${I('hand-coins')}</span><div class="grow"><div class="m"><span class="pill ${x.exit ? 'wait' : ''}">${x.exit ? 'ค่าชดเชย' : 'ปกติ'}</span></div><div class="t">ครั้งที่ ${x.n} · ${money2(x.pay)}</div><div class="s">${esc(x.label)}</div></div><div class="ops-acts"><button class="btn ghost" data-go="a.payments">การเงิน${I('chevron-right')}</button></div></div>`).join('');
  }

  /* ---------- Case timeline ---------- */
  function timeline(s) {
    const r = s.request, em = SC.emCase(s);
    if (!r && em) return `<ol class="ops-tl" data-timeline="em"><li class="${em.closed ? 'd' : 'x'}"><i>${I('siren')}</i><div><b>ตอบว่ามีอาการฉุกเฉิน</b><p>${esc(em.name)} · ${esc(em.phone || 'ยังไม่มีเบอร์')} · ${esc(em.at)}</p>${(em.log || []).map(l => `<p>${esc(l.at)} · ${esc(l.who)} · ${esc(l.what)}</p>`).join('')}</div></li></ol>`;
    if (!r) return `<div class="ops-empty" data-timeline="none">${I('route')} ${NONE} · เคสจะขึ้นเมื่อคนไข้ส่งแบบประเมิน</div>`;
    const co = s.course, rf = s.refunds || [], log = r.reviewLog || [], T = r.trace || {}, P = SC.POLICY;
    const paid = ['SLIP_SENT', 'PAID', 'OFFERED', 'BOOKED'].includes(r.status) || r.paid;
    const li = (st, ic, title, lines) => `<li class="${st}"><i>${st === 'd' ? I('check') : st === 'x' ? I('x') : I(ic)}</i><div><b>${title}</b>${lines.filter(Boolean).map(l => `<p>${l}</p>`).join('')}</div></li>`;
    const steps = [];
    steps.push(li('d', 'clipboard-check', 'ประเมิน', [`${esc(r.ref)} · ${esc(s.patient.name || 'ผู้รับบริการ')} · ฉบับที่ ${esc(String(r.screeningVersion || 1))}`, `ส่งโดย ${s.patient.bookingFor === 'SOMEONE_ELSE' ? 'ญาติที่จองให้' : 'คนไข้'} · ${esc(s.patient.address && s.patient.address.district || '')}`]));
    steps.push(li(r.review ? (r.status === 'CLINICAL_REVIEW' || (r.scopeHold && !(r.review || {}).cleared) ? 'n' : 'd') : 'd', 'stethoscope', 'ตรวจทางคลินิก', r.review ? [...log.map(l => `${esc(l.at)} · <em>${esc(l.reviewer)}</em> · ${{ APPROVED: 'อนุมัติเฉพาะที่ติ๊ก', DECLINED: 'ขอโทรคุย', SUPERSEDED: 'ผลเดิมถูกพัก' }[l.decision] || esc(l.decision)}`), r.status === 'CLINICAL_REVIEW' ? 'รอ <em>พี่ปาล์ม (Clinical Lead)</em> ตรวจ' : '', r.scopeHold ? 'พักการดูแลอยู่ · นัดเดิมยังอยู่' : ''] : ['เคสทั่วไป ไม่ต้องตรวจก่อน']));
    steps.push(li(paid ? 'd' : 'n', 'wallet', `จ่าย ClairMatch ${money(SC.TRIAL)}`, paid ? [r.check && r.check.state === 'open' ? 'สลิปยอดไม่ตรง รอ <em>บอส</em> เช็กบัญชี' : r.check && r.check.state === 'ok' ? 'แอดมินเช็กบัญชีแล้ว' : 'ระบบตรวจสลิปผ่าน', co && co.approved ? `คอร์ส ${co.sessions}${co.bonus ? ` แถม ${co.bonus}` : ''} ครั้ง <em>${money(co.total)}</em> · ยืนยันโดยทีม (ใช้ได้ถึง ${esc(SC.courseValid(co, true))})` : co && co.slip ? `คอร์ส ${money(co.total)} · รอตรวจสลิป` : ''] : ['รอชำระ']));
    const offers = (T.offers || []), acc = T.accept || (s.visits.length ? { at: '' } : null);
    steps.push(li(r.closed && !acc ? 'x' : r.status === 'BOOKED' || acc ? 'd' : paid ? 'n' : '', 'users-round', 'จับคู่ PT', [offers.length ? offers.map(o => `${esc(o.at || '')} · ส่งให้ ${esc(o.to.map(id => id === 'me' ? (s.pt.displayName || 'PT') : id).join(', '))} (${esc(o.how || '')})`).join('<br>') : '', r.search && (r.search.done || []).length ? `บันทึกการค้นหา ${r.search.done.length} ช่อง · ผู้รับผิดชอบ ${esc(nameOf(r.search.owner || 'boss'))}` : '', acc ? `<em>${esc(s.pt.displayName || 'PT')}</em> รับงาน${acc.at ? ' ' + esc(acc.at) : ''}` : '', r.closed && !acc ? 'ปิดเคสก่อนได้ PT' : '']));
    const vs = s.visits;
    steps.push(li(vs.length ? (vs.some(v => v.step < 4) ? 'n' : vs.every(v => v.exit) ? 'x' : 'd') : '', 'calendar-days', 'นัด', vs.length ? vs.map(v => { const o = SC.visitOutcome(s, v); return `ครั้งที่ ${v.n} · ${esc(v.date)} ${esc(v.time)} · <em>${esc(o ? o.label : ['นัดแล้ว', 'กำลังเดินทาง', 'ถึงแล้ว', 'กำลังดูแล', 'เสร็จแล้ว'][v.step])}</em>${v.published ? ' · ส่งสรุปแล้ว' : ''}`; }).concat(co ? [`คอร์สเหลือ <em>${SC.courseLeft(co)}</em> จาก ${co.sessions + (co.bonus || 0)} ครั้ง${co.refunded ? ' · ปิดแล้ว' : ''}`] : []) : ['ยังไม่มีนัด']));
    const exits = vs.filter(v => v.exit), inc = s.incidents || [];
    steps.push(li(exits.length ? 'x' : '', 'door-open', 'ทางออก', exits.length ? exits.map(v => `ครั้งที่ ${v.n} · <em>${esc(SC.exitLabel(v))}</em> · ${esc(v.exitAt || '')}${v.exitNote ? ` · PT เล่า: ${esc(v.exitNote)}` : ''}`).concat(inc.map(x => `${esc(x.id)} · ${esc(x.title)} · เจ้าของ พี่ปาล์ม (Clinical Lead) · ${x.open ? 'เปิดอยู่' : `ปิดแล้ว ${esc(x.closedAt || '')}`}`)) : ['ไม่มี · ทุกนัดเป็นไปตามแผน']));
    steps.push(li(rf.length ? (rf.every(x => ['RECONCILED', 'DECLINED'].includes(x.status)) ? 'd' : 'n') : '', 'banknote', 'เงินคืน', rf.length ? rf.map(x => `<em>${esc(x.id)}</em> ${esc(x.title)} · ${x.amount != null ? money2(x.amount) : 'ยอดทีมกำหนด'} · ${esc(SC.REFUND_STATUS[x.status][0])}<br>${x.log.map(l => `${esc(l.at)} · ${esc(l.who)} · ${esc(l.what)}`).join('<br>')}`) : ['ไม่มีการคืนเงิน']));
    const inAmt = (paid ? SC.TRIAL : 0) + (co && co.approved ? co.total : 0), outAmt = rf.filter(x => ['TRANSFERRED', 'RECONCILED'].includes(x.status)).reduce((t, x) => t + (x.amount || 0), 0);
    return `<div class="ops-sum" data-timeline-sum><div><span>รับเงินแล้ว</span><b>${money(inAmt)}</b></div><div><span>คืนแล้ว</span><b>${money2(outAmt)}</b></div><div><span>คอร์สเหลือ</span><b>${co ? `${SC.courseLeft(co)} ครั้ง` : '—'}</b></div></div>
      <ol class="ops-tl" data-timeline="${esc(r.ref)}">${steps.join('')}</ol>`;
  }

  /* ---------- Screen ---------- */
  SC.screen('a.queue', {
    role: 'admin',
    render(s) {
      const q = Q(s), f = facts(s), w = SC.adminWaiting(s);
      const owners = [['all', 'ทุกคน']].concat(Object.values(TEAM()).map(x => [x.id, x.name]));
      const ownBar = `<div class="ops-own" role="group" aria-label="ตาใคร">${owners.map(([k, t]) => `<button data-act="opsOwner" data-o="${k}" aria-pressed="${q.owner === k}">${esc(t)}<span>${k === 'all' ? f.tasks.length : f.tasks.filter(x => x.owner === k).length}</span></button>`).join('')}</div>`;
      const FL = { now: 'ต้องทำตอนนี้', money: 'เงินเข้า', refund: 'คืนเงิน', waitpt: 'รอ PT', today: 'นัดวันนี้', safety: 'ความปลอดภัย', team: 'ทีม PT', ptpay: 'ค้างจ่าย PT' };
      const list = `<section class="ops-panel" data-ops-list aria-label="ตาใคร"><div class="ops-ph"><h2>ตาใคร · ${esc(FL[q.f] || 'ทั้งหมด')}</h2>${ownBar}</div>${rows(s, f, q)}</section>`;
      const wait = w.length ? `<section class="ops-panel"><div class="ops-ph"><h2>กำลังรอคนอื่น</h2><span class="small">ไม่นับเป็นงานค้าง</span></div>${w.map(x => `<div class="ops-row"><span class="tile">${I(x.icon)}</span><div class="grow"><div class="t">${esc(x.title)}</div><div class="s">${esc(x.sub)}</div></div><div class="ops-acts"><button class="btn ghost" data-go="${x.go}">${esc(x.cta)}${I('chevron-right')}</button></div></div>`).join('')}</section>` : '';
      const tl = `<section class="ops-panel" data-ops-timeline aria-label="เส้นทางเคส"><div class="ops-ph"><h2>เส้นทางเคส</h2><span class="small">ประเมิน → ตรวจ → จ่าย → จับคู่ → นัด → ทางออก → เงินคืน</span></div>${timeline(s)}</section>`;
      const body = `<div class="ops">${alerts(s, f)}${counters(s, f, q)}<div class="ops-grid"><div class="stack lg">${list}${wait}</div>${tl}</div></div>`;
      return SC.adminShell(s, 'a.queue', { kick: `หน้าแรกแอดมิน · เวลาซ้อม ${SC.clockText(SC.clockNow(s))}`, title: 'งานรอจัดการ', sub: 'ตัวเลขทุกช่องมาจากเคสที่ซ้อมอยู่ กดตัวเลขเพื่อกรอง · เลือกคนเพื่อดูว่าตาใคร · งานของเคสที่ปิดแล้วหายเอง' }, body);
    }
  });
  SC.action('opsFilter', (s, c) => { const q = Q(s); q.f = q.f === c.data.f && c.data.f !== 'now' ? 'now' : c.data.f; });
  SC.action('opsOwner', (s, c) => { Q(s).owner = c.data.o; });
  SC.action('opsCase', (s, c) => { const el = document.querySelector('#dev [data-ops-timeline]'); if (el) el.scrollIntoView({ block: 'nearest' }); });
  /* Inline action: run the step as the person whose turn it is (the separation rules still apply). */
  SC.action('opsDo', (s, c) => {
    const x = SC.adminTasks(s).find(t => taskKey(t) === c.data.key); if (!x || !x.inline) return;
    const inl = x.inline; if (inl.as) (s.admin = s.admin || {}).actor = inl.as;
    const fn = SC.actions[inl.act]; if (!fn) return;
    const data = { id: inl.id || '', kind: inl.kind || '' };
    return fn(s, Object.assign({}, c, { data, el: { dataset: data } }));
  });

  /* ---------- Emergency answer: call, note, close (P6) ---------- */
  const emSheet = st => { const em = SC.emCase(st) || {};
    return `<div class="aa-sh"><div class="aa-head-sheet"><div class="grow"><b class="h2">ตอบว่ามีอาการฉุกเฉิน</b><span class="small">ผู้ดูแล: พี่ปาล์ม (Clinical Lead) · ข้อมูลน้อยที่สุด</span></div><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <dl class="kv aa-kv"><dt>ชื่อ</dt><dd><b>${esc(em.name)}</b></dd><dt>เบอร์</dt><dd>${esc(em.phone || 'ยังไม่มีเบอร์ · ดูในแชต LINE')}</dd><dt>ตอบเมื่อ</dt><dd>${esc(em.at)}</dd><dt>ตอนนี้</dt><dd>${em.closed ? `ปิดงานแล้ว · ${esc(em.closedAt || '')}` : em.revised ? 'คนไข้แก้คำตอบเป็น "ไม่มี" · ยังต้องโทรยืนยัน' : 'ระบบให้โทร 1669 และหยุดการจอง'}</dd></dl>
      ${(em.log || []).length ? `<details class="small"><summary>บันทึก ${em.log.length} รายการ</summary>${em.log.map(l => `<p style="margin:4px 0">${esc(l.at)} · ${esc(l.who)} · ${esc(l.what)}</p>`).join('')}</details>` : ''}
      ${em.closed ? '' : `<button class="btn ghost" data-act="callPatient">${I('phone')}โทรหา ${esc(em.phone || '')}</button>
      <label class="field"><span>ผลการโทร (บังคับ)</span><textarea class="in" rows="3" maxlength="300" data-bind="patient.em.note" placeholder="เช่น โทรแล้ว ญาติบอกว่าอาการเดิมตั้งแต่สโตรก ไม่ใช่อาการใหม่ แนะนำให้ประเมินใหม่">${esc(em.note || '')}</textarea></label>
      <button class="btn" data-act="emClose" data-need="patient.em.note">${I('phone-call')}โทรแล้ว / ปิดงาน</button>`}</div>`; };
  SC.action('emOpen', (s, c) => { if (!SC.emCase(s)) return; c.sheet(st => emSheet(st)); });
  SC.action('emClose', (s, c) => { const em = SC.emCase(s); if (!em || !(em.note || '').trim()) { c.toast('ใส่ผลการโทรก่อนปิดงาน'); return; }
    const me = (s.admin && s.admin.actor) || 'palm', at = SC.stamp(10); em.closed = true; em.closedAt = at; (em.log = em.log || []).push({ at, who: `${nameOf(me)}`, what: `โทรแล้ว ปิดงาน · ${em.note.trim()}` });
    c.close(); c.toast('ปิดงานฉุกเฉินแล้ว · บันทึกผลการโทรไว้แล้ว'); });

  /* ---------- Incident (P15): Clinical Lead owns it; note and close ---------- */
  const incSheet = (st, id) => { const x = (st.incidents || []).find(i => i.id === id) || {};
    return `<div class="aa-sh"><div class="aa-head-sheet"><div class="grow"><b class="h2">${esc(x.id || '')} · ${esc(x.title || '')}</b><span class="small">เจ้าของ: พี่ปาล์ม (Clinical Lead) · เคสเงิน ${esc(x.refund || '—')} อยู่ที่หน้าคืนเงิน</span></div><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <dl class="kv aa-kv"><dt>คำขอ</dt><dd>${esc(x.ref || '')} · ครั้งที่ ${esc(String(x.visit || ''))}</dd><dt>PT เล่า</dt><dd>${esc(x.note || 'ยังไม่ได้เล่า')}</dd><dt>เปิดเมื่อ</dt><dd>${esc(x.at || '')}</dd></dl>
      ${(x.log || []).map(l => `<p class="small" style="margin:0">${esc(l.at)} · ${esc(l.who)} · ${esc(l.what)}</p>`).join('')}
      ${x.open ? `<label class="field"><span>สิ่งที่ Clinical Lead ตัดสิน / ทำแล้ว (บังคับ)</span><textarea class="in" rows="3" maxlength="300" data-bind="admin.incNote" placeholder="เช่น คุยกับ PT และญาติแล้ว ปรับขอบเขตงาน ส่งต่อพยาบาลสำหรับดูดเสมหะ">${esc((st.admin || {}).incNote || '')}</textarea></label>
      <button class="btn" data-act="incClose" data-id="${esc(x.id || '')}" data-need="admin.incNote">${I('check')}บันทึกผลและปิด Incident</button>` : `<p class="note mint" style="margin:0">ปิดแล้ว ${esc(x.closedAt || '')}</p>`}</div>`; };
  SC.action('incOpen', (s, c) => { const id = c.data.id || ((s.incidents || []).find(i => i.open) || {}).id; if (!id) return; (s.admin = s.admin || {}).incNote = ''; c.sheet(st => incSheet(st, id)); });
  SC.action('incClose', (s, c) => { const x = (s.incidents || []).find(i => i.id === c.data.id), note = ((s.admin || {}).incNote || '').trim(); if (!x || !note) { c.toast('ใส่สิ่งที่ตัดสินก่อนปิด'); return; }
    const at = SC.stamp(15); x.open = false; x.closedAt = at; x.log.push({ at, who: 'พี่ปาล์ม (Clinical Lead)', what: `ปิด · ${note}` }); s.admin.incNote = ''; c.close(); c.toast(`ปิด ${x.id} แล้ว`); });
})();
