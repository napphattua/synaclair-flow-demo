/* policy-1107.js · What the 7 Nov 2026 documents add to the rehearsal (rules-latest-20261107.md).
   Sources: CEO Decision Review Handoff v1.3 (H13), Non-Pricing Policy Master v1.1 (M11), Clinical Matching CTO handoff (CM),
   Pricing & Bonus Sessions v1.0 (PR), decision log 7 Nov (DL7). Money figures match apps/api/src/trial-policy.
   - Visit exits after the PT leaves (cancel, no-show, assessment only, unsafe home, refusal, stopped, wrong scope, emergency, PT no-show)
   - Refund cases: request → only the CEO approves → a third person transfers → reconcile (requester ≠ approver ≠ transferer)
   - Search log: 3 times × serviceable zones, cross-zone only with staff confirmation and PT consent, 24 h notice, named owner, patient choice
   - Clinical Hold day 14 / day 30 counted from the verified payment date
   - Course validity, per-visit fee for the team, course refund at the average price including bonus visits
   Nothing here is a real refund, transfer or message. Open questions show as "รอตัดสิน"; nothing is guessed. */
(function () {
  'use strict';
  const { esc, ui, money } = SC, money2 = SC.money2, P = SC.POLICY, I = ui.icon;

  /* ---------- Team and dates ---------- */
  const TEAM = { nat: { id: 'nat', name: 'พี่นัท', role: 'CMO' }, palm: { id: 'palm', name: 'พี่ปาล์ม', role: 'CEO' }, boss: { id: 'boss', name: 'บอส', role: 'CTO' } };
  const who = id => TEAM[id] ? `${TEAM[id].name} (${TEAM[id].role})` : '—';
  SC.TEAM = TEAM;
  const TH_MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = iso => { const d = new Date(iso + 'T00:00:00Z'); return `${d.getUTCDate()} ${TH_MON[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`; };
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  /* One rehearsal clock (7 Nov rehearsal P10). s.clock is scenario time ('2026-10-22T09:00'), moved by what happens in the case
     (a visit exit happens at the visit, day 14 happens on day 14), never by the computer's clock. It only moves forward. */
  const pad = n => String(n).padStart(2, '0');
  const isoOf = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  const parseIso = iso => new Date(String(iso).slice(0, 16) + ':00Z');
  SC.clockNow = st => ((st || SC.s) || {}).clock || '2026-10-22T09:00';
  SC.clockTo = (st, iso) => { if (iso && iso > SC.clockNow(st)) st.clock = iso; else st.clock = SC.clockNow(st); return st.clock; };
  SC.clockAdd = (st, min) => { const d = parseIso(SC.clockNow(st)); d.setUTCMinutes(d.getUTCMinutes() + min); st.clock = isoOf(d); return st.clock; };
  SC.clockText = iso => { const d = parseIso(iso || SC.clockNow()); return `${d.getUTCDate()} ${TH_MON[d.getUTCMonth()]} ${d.getUTCFullYear() + 543} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`; };
  SC.clockHours = (from, to) => Math.max(0, Math.round((parseIso(to || SC.clockNow()) - parseIso(from)) / 36e5 * 10) / 10);
  /* 'เสาร์ 24 ต.ค. 2569' + '09:00–10:30' → '2026-10-24T09:00' (+ minutes) */
  SC.visitIso = (v, add = 0) => { const m = /(\d+)\s+(\S+)\s+(\d{4})/.exec((v && v.date) || ''), h = /^(\d{2}):(\d{2})/.exec((v && v.time) || ''); if (!m || TH_MON.indexOf(m[2]) < 0) return null;
    const d = new Date(Date.UTC(+m[3] - 543, TH_MON.indexOf(m[2]), +m[1], h ? +h[1] : 9, h ? +h[2] : 0)); d.setUTCMinutes(d.getUTCMinutes() + add); return isoOf(d); };
  /* Every logged event moves the clock a few minutes, so logs read in order. */
  const stamp = (min = 5) => SC.clockText(SC.clockAdd(SC.s, min));
  SC.stamp = stamp;
  SC.thDateIso = thDate; SC.addDays = addDays;
  /* Who gets which admin card (7 Nov rehearsal P14, proposal for Boss): พี่ปาล์ม = clinical, emergencies, refund approval, capability;
     บอส = money in, transfers, matching; พี่นัท = case owner, refund requester, PT sign-ups, follow-ups. A card can name more than one. */
  SC.routeAdmin = m => { const t = (m.title || m.text || '');
    if (/^ถึงพี่ปาล์ม|Clinical Lead|ทางคลินิก|ต้องตรวจใหม่|ฉุกเฉิน/.test(t) || m.key === 'clinQueue') return ['palm'];
    if (/^ถึงผู้โอน|^ถึงบอส/.test(t) || ['slipFlag', 'paymentReview', 'paymentReviewCourse'].includes(m.key)) return ['boss'];
    return ['nat']; };
  /* A course that was refunded is closed: nothing left to book (7 Nov rehearsal P1). */
  SC.courseLeft = co => !co ? 0 : co.refunded ? 0 : Math.max(0, co.sessions + (co.bonus || 0) - (co.used || 0));
  SC.caseClosed = s => !!(s.request && s.request.closed);
  /* Rehearsal clock: the ClairMatch slip is verified on 22 Oct, the course transfer on 24 Oct (the day of visit 1). */
  const TRIAL_PAID_AT = '2026-10-22';
  SC.COURSE_VERIFIED_AT = '2026-10-24';
  const pname = s => s.patient.name || 'ผู้รับบริการ';
  const ref = s => (s.request && s.request.ref) || 'SC-2610001';
  const tag = (t, tone = 'wait') => `<span class="pill ${tone}">${esc(t)}</span>`;
  const OPEN = t => `<span class="pill gray open-q">${esc(t)} · รอตัดสิน</span>`;

  /* ---------- Courses (PR, DL7) ---------- */
  SC.courseLine = (n, bonus, total) => bonus ? `${n} ครั้ง แถม ${bonus} · รวม ${n + bonus} ครั้ง · เฉลี่ย ${money2(total / (n + bonus))}` : `${n} ครั้ง · เฉลี่ย ${money2(total / n)}`;
  SC.courseValid = (co, short) => {
    if (!co || !co.verifiedAt) return short ? 'นับ 365 วันจากวันยืนยันยอดโอน' : 'ใช้ได้ 365 วัน นับจากวันที่ทีมยืนยันยอดโอน';
    const end = thDate(addDays(co.verifiedAt, P.courseValidDays));
    return short ? end : `ใช้ได้ถึง ${end} (365 วันจากวันยืนยันยอดโอน ${thDate(co.verifiedAt)})`;
  };
  /* PR-17 (DL7 l.73, l.114): only the team sees the fee per visit. */
  SC.coursePerVisit = co => { if (!co) return ''; const n = co.sessions + (co.bonus || 0), fee = co.fee || 0, net = co.net || (co.total - fee);
    return `<dl class="kv aa-kv" data-per-visit><dt>จำนวนครั้งรวมแถม</dt><dd>${n} ครั้ง${co.bonus ? ` (ซื้อ ${co.sessions} แถม ${co.bonus})` : ''}</dd><dt>คนไข้จ่ายเฉลี่ย/ครั้ง</dt><dd>${money2(co.total / n)}</dd><dt>ค่าธรรมเนียม/ครั้ง</dt><dd>${money2(fee / n)}</dd><dt>PT สุทธิ/ครั้ง</dt><dd>${money2(net / n)}</dd></dl><p class="small" style="margin:0">PT และคนไข้ไม่เห็นค่าธรรมเนียมนี้</p>`; };
  /* RF-23 (Boss, DL7 l.121–127): course price × unused visits ÷ all visits including bonus, rounded once. When a refund is allowed is open (O-10). */
  const courseRefundAmt = co => { const n = co.sessions + (co.bonus || 0), left = Math.max(0, n - (co.used || 0)); return { n, left, amt: Math.round(co.total * left / n * 100) / 100 }; };
  SC.courseRefundAmt = courseRefundAmt;
  SC.courseRefundCard = s => { const co = s.course; if (!co || !co.approved || co.refunded) return ''; const x = courseRefundAmt(co), open = (s.refunds || []).find(r => r.kind === 'course' && !['DECLINED'].includes(r.status));
    return `<div class="card" data-course-refund><b class="h3">${I('banknote')} ขอคืนเงินคอร์ส</b><p class="p">ครั้งที่ยังไม่ได้ใช้ ${x.left} จาก ${x.n} ครั้ง (รวมครั้งแถม) · คืน <b>${money2(x.amt)}</b></p>
      <p class="small" style="margin:0">คิดจาก ${money(co.total)} × ${x.left} ÷ ${x.n} · ครั้งแถมมีมูลค่าเท่าครั้งที่จ่าย</p><p class="small" style="margin:0">กรณีไหนคืนได้บ้าง ${OPEN('ทีมกำลังกำหนด')}</p>
      ${open ? `<p class="note mint" style="margin:0" data-course-refund-state>ส่งคำขอแล้ว · ${esc(SC.refundWords(open).now)}<br><span class="small">${esc(SC.refundWords(open).next)}</span></p>` : `<button class="btn ghost" data-act="courseRefundAsk">ขอคืนเงินคอร์ส</button>`}</div>`; };
  /* After the transfer the course is closed: what came back, when, and that nothing is left to book. */
  SC.courseClosedCard = s => { const co = s.course, f = co && co.refunded; if (!f) return '';
    return `<div class="card" data-course-closed><div class="row between wrap"><b class="h3">${I('circle-check')} คืนเงินคอร์สแล้ว · ปิดคอร์ส</b>${tag('ปิดแล้ว', 'gray')}</div>
      <dl class="kv"><dt>เงินคืน</dt><dd><b>${money2(f.amount)}</b> · โอนเมื่อ ${esc(f.at)}</dd><dt>ครั้งที่คืนเงิน</dt><dd>${f.left} จาก ${f.n} ครั้ง ปิดแล้ว ใช้ต่อไม่ได้</dd>${f.cancelled ? `<dt>นัดที่ยกเลิก</dt><dd>${f.cancelled} นัด</dd>` : ''}<dt>เลขเคส</dt><dd>${esc(f.id)}</dd></dl>
      <p class="small" style="margin:0">อยากกลับมาดูแลต่อ ทักทีมใน LINE ได้เลย</p></div>`; };
  SC.action('courseRefundAsk', (s, c) => { const co = s.course, x = courseRefundAmt(co);
    const lastDone = s.visits.filter(v => v.step >= 4 && !v.exit).sort((a, b) => b.n - a.n)[0]; if (lastDone) SC.clockTo(s, SC.visitIso(lastDone, 24 * 60 + 60));
    refundOpen(s, { kind: 'course', title: `คืนเงินคอร์ส ${co.sessions}${co.bonus ? ` แถม ${co.bonus}` : ''} ครั้ง`, amount: x.amt, reason: `ยังไม่ได้ใช้ ${x.left} จาก ${x.n} ครั้ง · ${money(co.total)} × ${x.left} ÷ ${x.n}`, basis: 'DL7 l.121–127 (บอส)' }, c.line);
    c.line('patient', { key: 'note', title: 'รับคำขอคืนเงินคอร์สแล้ว', lines: [`ยอดที่ขอคืน ${money2(x.amt)}`, 'ทีมตรวจแล้วส่งให้ผู้บริหารอนุมัติ อนุมัติแล้วโอนคืนเข้าบัญชีที่คุณแจ้งในแชตนี้', 'ระหว่างนี้นัดที่จองไว้ยังอยู่ ทีมจะแจ้งก่อนเปลี่ยนอะไร'], go: 'p.refund', button: 'ดูสถานะ' });
    /* 7 Nov rehearsal NT-27: the PT whose bookings this touches hears it too. */
    c.line('pt', { key: 'note', title: `คนไข้ขอคืนเงินคอร์ส · ${pname(s)}`, lines: [`ครั้งที่ยังไม่ได้ใช้ ${x.left} จาก ${x.n} ครั้ง`, 'ทีมกำลังพิจารณา นัดที่จองไว้ยังอยู่จนกว่าทีมจะแจ้ง', 'ครั้งที่ทำไปแล้ว รายได้ของคุณไม่เปลี่ยน'], go: 't.work', button: 'ดูงาน' });
    c.toast('ส่งคำขอคืนเงินคอร์สแล้ว'); });

  /* ---------- Refund cases (H13 NEW-07 §2E, M11 §5.4) ---------- */
  const STATUS = { DRAFT: ['รอผู้ขอส่งเรื่อง', 'wait'], REQUESTED: ['รอพี่ปาล์ม (CEO) อนุมัติ', 'wait'], APPROVED: ['อนุมัติแล้ว · รอโอน', 'info'], TRANSFERRED: ['โอนแล้ว · รอกระทบยอด', 'info'], RECONCILED: ['กระทบยอดแล้ว', ''], DECLINED: ['ไม่อนุมัติ', 'warn'] };
  SC.REFUND_STATUS = STATUS;
  /* What the patient reads (7 Nov rehearsal P11): no "ผู้ขอ" or "กระทบยอด". Now / what happens next. How fast a transfer happens is still open (O-01), so no day count is promised. */
  SC.refundWords = x => { const at = (x.log || []).filter(l => /โอนแล้ว/.test(l.what)).map(l => l.at).pop();
    return { DRAFT: { now: 'ทีมกำลังตรวจเรื่อง', next: 'ตรวจแล้วส่งให้ผู้บริหารอนุมัติ · แจ้งใน LINE ทุกขั้น', tone: 'wait' },
      REQUESTED: { now: 'รอผู้บริหารอนุมัติ', next: 'อนุมัติแล้วทีมโอนคืนเข้าบัญชีที่คุณแจ้งในแชต LINE', tone: 'wait' },
      APPROVED: { now: 'อนุมัติแล้ว · รอโอน', next: 'ทีมกำลังโอนคืน จะส่งหลักฐานการโอนใน LINE', tone: 'info' },
      TRANSFERRED: { now: 'โอนคืนแล้ว', next: at ? `โอนเมื่อ ${at} · หลักฐานอยู่ในหน้านี้` : 'หลักฐานการโอนอยู่ในหน้านี้', tone: '' },
      RECONCILED: { now: 'โอนคืนแล้ว', next: at ? `โอนเมื่อ ${at} · หลักฐานอยู่ในหน้านี้` : 'หลักฐานการโอนอยู่ในหน้านี้', tone: '' },
      DECLINED: { now: 'ยังคืนตามคำขอนี้ไม่ได้', next: 'ทีมจะโทรอธิบายเหตุผล', tone: 'warn' } }[x.status] || { now: '', next: '', tone: 'gray' }; };
  const refunds = s => (s.refunds = s.refunds || []);
  function refundOpen(s, o, line) {
    const list = refunds(s), id = `RF-${String(list.length + 1).padStart(4, '0')}`;
    const x = Object.assign({ id, ref: ref(s), status: 'DRAFT', payTo: pname(s), channel: 'บัญชีที่คนไข้แจ้งในแชต LINE (ตัวอย่าง)', amount: null, manual: false, owner: 'nat', by: {}, log: [{ at: stamp(), who: 'ระบบ', what: 'เปิดเคส' }] }, o);
    x.openedAt = SC.clockNow(s);
    list.push(x);
    if (line) line('admin', { key: 'note', to: [x.owner], title: x.manual ? `เคสทบทวนเอง ${id} · เจ้าของ ${who(x.owner)}` : `เคสคืนเงิน ${id} · รอ ${who(x.owner)} ส่งเรื่อง`, lines: [x.title, x.amount != null ? `ยอดคืน ${money2(x.amount)}` : 'ยอดเงิน: ทีมกำหนดเอง ไม่มีสูตร', `คำขอ ${x.ref} · ${x.payTo}`], go: 'a.refunds', button: 'เปิดเคส' });
    return x;
  }
  SC.refundOpen = refundOpen;
  SC.refundCount = s => refunds(s).filter(x => !['RECONCILED', 'DECLINED'].includes(x.status)).length;
  const actor = s => ((s.admin = s.admin || {}).actor) || 'nat';
  const NOT = (ctx, t) => { ctx.toast('ทำไม่ได้: ' + t); };
  SC.action('rfActor', (s, c) => { (s.admin = s.admin || {}).actor = c.data.id; });
  SC.action('rfSubmit', (s, c) => {
    const x = refunds(s).find(r => r.id === c.data.id), me = actor(s); if (!x || x.status !== 'DRAFT') return;
    if (me === 'palm') return NOT(c, 'พี่ปาล์มเป็นผู้อนุมัติ จึงเป็นผู้ขอไม่ได้ (ผู้ขอ ≠ ผู้อนุมัติ)');
    if (x.amount == null) { const a = Number(String(x.amountDraft || '').replace(/[^\d.]/g, '')); if (!(a > 0)) return NOT(c, 'เคสทบทวนเอง ต้องใส่ยอดที่ทีมตัดสิน'); if (!(x.decideWhy || '').trim()) return NOT(c, 'ใส่เหตุผลและหลักฐานที่ใช้ตัดสิน'); x.amount = a; }
    x.status = 'REQUESTED'; x.by.requester = me; x.log.push({ at: stamp(), who: who(me), what: `ส่งขออนุมัติ ${money2(x.amount)}${x.decideWhy ? ' · ' + x.decideWhy : ''}` });
    c.line('admin', { key: 'note', to: ['palm'], title: `ถึงพี่ปาล์ม (CEO): คำขอคืนเงิน ${x.id} รออนุมัติ`, lines: [`${x.title} · ${money2(x.amount)}`, `ผู้ขอ ${who(me)} · คืนให้ ${x.payTo}`], go: 'a.refunds', button: 'ดูคำขอ' });
    c.toast('ส่งขออนุมัติแล้ว แจ้งพี่ปาล์มใน LINE');
  });
  SC.action('rfApprove', (s, c) => {
    const x = refunds(s).find(r => r.id === c.data.id), me = actor(s); if (!x || x.status !== 'REQUESTED') return;
    if (me !== 'palm') return NOT(c, 'ช่วงเริ่มต้น พี่ปาล์ม (CEO) เป็นผู้อนุมัติคืนเงินคนเดียว');
    if (x.by.requester === me) return NOT(c, 'ผู้ขอกับผู้อนุมัติต้องเป็นคนละคน');
    const yes = c.data.d !== 'no';
    x.status = yes ? 'APPROVED' : 'DECLINED'; x.by.approver = me; x.log.push({ at: stamp(), who: who(me), what: yes ? 'อนุมัติ (CEO)' : 'ไม่อนุมัติ' });
    if (yes) c.line('admin', { key: 'note', to: ['boss'], title: `ถึงผู้โอน: คืนเงิน ${x.id} อนุมัติแล้ว รอโอน`, tag: 'ผู้โอน: บอส (ข้อเสนอ · รอตัดสิน)', lines: [`โอน ${money2(x.amount)} ให้ ${x.payTo}`, x.channel, 'โอนแล้วแนบหลักฐานในหน้าคืนเงิน'], go: 'a.refunds', button: 'บันทึกการโอน' });
    else c.line('patient', { key: 'note', title: 'ผลคำขอคืนเงิน', lines: ['ทีมทบทวนแล้ว ยังคืนเงินตามคำขอนี้ไม่ได้', 'ทีมจะโทรอธิบายเหตุผล'], go: 'p.refund', button: 'ดูรายละเอียด' });
    c.toast(yes ? 'อนุมัติแล้ว แจ้งผู้โอนใน LINE' : 'บันทึกว่าไม่อนุมัติแล้ว');
  });
  SC.action('rfTransfer', (s, c) => {
    const x = refunds(s).find(r => r.id === c.data.id), me = actor(s); if (!x || x.status !== 'APPROVED') return;
    if (me === x.by.requester || me === x.by.approver) return NOT(c, `ผู้โอนต้องไม่ใช่ผู้ขอ (${who(x.by.requester)}) และไม่ใช่ผู้อนุมัติ (${who(x.by.approver)})`);
    x.status = 'TRANSFERRED'; x.by.transferer = me; x.proof = `สลิปโอนคืน ${x.id} (ตัวอย่าง)`; const at = stamp(30); x.log.push({ at, who: who(me), what: `โอนแล้ว ${money2(x.amount)} · แนบหลักฐาน` });
    const closed = x.kind === 'course' ? closeCourse(s, x, at, c.line) : null;
    c.line('patient', { key: 'note', title: 'คืนเงินเรียบร้อย', lines: [`ยอด ${money2(x.amount)} · โอนเมื่อ ${at}`, `เลขเคส ${x.id} · ${x.title}`, closed ? `คอร์สปิดแล้ว · ${closed.left} ครั้งที่คืนเงินใช้ต่อไม่ได้${closed.cancelled ? ` · ยกเลิกนัดที่จองไว้ ${closed.cancelled} นัด` : ''}` : '', 'หลักฐานการโอนอยู่ในหน้าการคืนเงิน'], go: x.kind === 'course' ? 'p.course' : 'p.refund', button: x.kind === 'course' ? 'ดูคอร์สของฉัน' : 'ดูหลักฐาน' });
    c.toast(closed ? 'บันทึกการโอนแล้ว ปิดคอร์ส แจ้งคนไข้และ PT ใน LINE' : 'บันทึกการโอนแล้ว แจ้งคนไข้ใน LINE');
  });
  /* 7 Nov rehearsal P1: the transfer closes the course. Visits not yet done are cancelled (no step ticks), the PT is told, nothing is left to book. */
  function closeCourse(s, x, at, line) {
    const co = s.course; if (!co || co.refunded) return co && co.refunded;
    const n = co.sessions + (co.bonus || 0), left = Math.max(0, n - (co.used || 0)), open = s.visits.filter(v => v.n >= 2 && v.step < 4);
    open.forEach(v => { v.exit = 'courseRefunded'; v.exitAt = at; v.exitStep = v.step; v.step = 4; });
    co.refunded = { id: x.id, amount: x.amount, at, n, left, cancelled: open.length };
    line('pt', { key: 'note', title: `คอร์สของ ${pname(s)} ปิดแล้ว`, lines: [`ทีมคืนเงิน ${left} ครั้งที่ยังไม่ได้ใช้ (จาก ${n} ครั้ง)`, open.length ? `ยกเลิกนัดที่จองไว้ ${open.length} นัด: ${open.map(v => `ครั้งที่ ${v.n} ${v.date}`).join(' · ')} · เวลานั้นว่างแล้ว` : 'ไม่มีนัดค้างในคอร์สนี้', 'ครั้งที่ทำไปแล้ว รายได้ของคุณไม่เปลี่ยน'], go: 't.work', button: 'ดูงาน' });
    return co.refunded;
  }
  SC.closeCourse = closeCourse;
  SC.action('rfReconcile', (s, c) => {
    const x = refunds(s).find(r => r.id === c.data.id), me = actor(s); if (!x || x.status !== 'TRANSFERRED') return;
    x.status = 'RECONCILED'; x.by.reconciler = me; x.log.push({ at: stamp(), who: who(me), what: 'กระทบยอดกับบัญชีแล้ว' }); c.toast('กระทบยอดแล้ว ปิดเคส');
  });
  SC.action('rfLeadOk', (s, c) => {
    const x = refunds(s).find(r => r.id === c.data.id); if (!x || !x.needLead) return;
    x.needLead = false; x.log.push({ at: stamp(), who: who(actor(s)) + ' · Clinical Lead', what: 'ตรวจรับผลประเมินอย่างเดียว (มีหลักฐานว่าประเมินครบ)' }); c.toast('Clinical Lead ตรวจรับแล้ว ส่งต่อขั้นขออนุมัติได้');
  });
  const step = (on, done, t, by) => `<li class="${done ? 'd' : on ? 'n' : ''}"><i>${done ? I('check') : ''}</i><span>${t}${by ? `<small>${esc(by)}</small>` : ''}</span></li>`;
  function refundCard(s, x, i) {
    const st = STATUS[x.status], o = ['DRAFT', 'REQUESTED', 'APPROVED', 'TRANSFERRED', 'RECONCILED'].indexOf(x.status);
    const act = x.status === 'DRAFT' ? (x.needLead ? `<button class="btn" data-act="rfLeadOk" data-id="${x.id}">${I('stethoscope')}Clinical Lead ตรวจรับผลประเมิน</button>`
      : `${x.amount == null ? `<label class="field"><span>ยอดที่ทีมตัดสิน (บาท)</span><input class="in" inputmode="decimal" data-bind="refunds.${i}.amountDraft" value="${esc(x.amountDraft || '')}" placeholder="ทีมกำหนดเอง ไม่มีสูตร"></label><label class="field"><span>เหตุผลและหลักฐาน</span><input class="in" data-bind="refunds.${i}.decideWhy" value="${esc(x.decideWhy || '')}" placeholder="เช่น ฟังเสียงโทร ดูรูปหน้าบ้าน"></label>` : ''}<button class="btn" data-act="rfSubmit" data-id="${x.id}">${I('send')}ส่งขออนุมัติ</button>`)
      : x.status === 'REQUESTED' ? `<div class="aa-acts"><button class="btn" data-act="rfApprove" data-id="${x.id}">${I('check')}อนุมัติ</button><button class="btn ghost" data-act="rfApprove" data-id="${x.id}" data-d="no">ไม่อนุมัติ</button></div>`
      : x.status === 'APPROVED' ? `<button class="btn" data-act="rfTransfer" data-id="${x.id}">${I('landmark')}โอนแล้ว · แนบหลักฐาน</button>`
      : x.status === 'TRANSFERRED' ? `<button class="btn ghost" data-act="rfReconcile" data-id="${x.id}">${I('scale')}กระทบยอดแล้ว</button>` : '';
    return `<article class="card flat rf-card" data-refund="${x.id}"><div class="row between wrap"><b class="h3">${esc(x.id)} · ${esc(x.title)}</b>${tag(st[0], st[1])}</div>
      <dl class="kv aa-kv"><dt>คืนให้</dt><dd><b>${esc(x.payTo)}</b> · ${esc(x.channel)}</dd><dt>ยอดคืน</dt><dd>${x.amount != null ? `<b class="money">${money2(x.amount)}</b>` : `ทีมกำหนดเอง ${OPEN('ยอดเงินเคสนี้')}`}</dd>
        ${x.keep ? `<dt>ค่าชดเชยที่เก็บ</dt><dd>${money2(x.keep)}${x.ptShare != null ? ` → PT ${money2(x.ptShare)} · แพลตฟอร์ม ${money2(x.platformShare)}` : ''}</dd>` : ''}
        <dt>เหตุผล</dt><dd>${esc(x.reason || '—')}</dd><dt>ที่มา</dt><dd>${esc(x.basis || '—')}</dd><dt>คำขอ</dt><dd>${esc(x.ref)}</dd>${x.manual ? `<dt>เจ้าของเคส</dt><dd>${esc(who(x.owner))} (ข้อเสนอ)</dd>` : ''}</dl>
      <ol class="rf-steps">${step(o === 0, o > 0, 'ขอ', who(x.by.requester))}${step(o === 1, o > 1, 'อนุมัติ', x.by.approver ? who(x.by.approver) : 'พี่ปาล์ม (CEO) เท่านั้น')}${step(o === 2, o > 2, 'โอน', x.by.transferer ? who(x.by.transferer) : 'บอส (ข้อเสนอ)')}${step(o === 3, o > 3, 'กระทบยอด', who(x.by.reconciler))}</ol>
      ${act}
      ${x.proof ? `<p class="small" style="margin:0">${I('paperclip')} ${esc(x.proof)}</p>` : ''}
      <details class="small"><summary>บันทึก ${x.log.length} รายการ</summary>${x.log.map(l => `<p style="margin:4px 0">${esc(l.at)} · ${esc(l.who)} · ${esc(l.what)}</p>`).join('')}</details></article>`;
  }
  SC.screen('a.refunds', {
    role: 'admin',
    render(s) {
      const list = refunds(s), me = actor(s), pay = list.filter(x => x.status === 'APPROVED');
      const picker = `<div class="field"><span>ทำในบัญชี</span><div class="chips">${Object.values(TEAM).map(x => `<button class="chip ${me === x.id ? 'on' : ''}" data-act="rfActor" data-id="${x.id}" aria-pressed="${me === x.id}">${esc(x.name)} · ${esc(x.role)}</button>`).join('')}</div>
        <small class="hint">ข้อเสนอ: พี่นัทขอ → พี่ปาล์มอนุมัติ → บอสโอน · ผู้โอนและคนทำแทน ${OPEN('O-01')} · การปรึกษาไม่ใช่การอนุมัติ</small></div>`;
      const toPay = pay.length ? `<section class="aa-sec" data-to-pay><h2 class="h3">ต้องโอนคืน</h2>${pay.map(x => `<div class="aa-task hot"><span class="tile gold">${I('landmark')}</span><div class="grow"><div class="t">${esc(x.payTo)} · ${money2(x.amount)}</div><div class="s">${esc(x.id)} · ${esc(x.channel)}</div></div></div>`).join('')}</section>` : '';
      const groups = [['รอทำ', list.filter(x => ['DRAFT', 'REQUESTED', 'APPROVED', 'TRANSFERRED'].includes(x.status))], ['ปิดแล้ว', list.filter(x => ['RECONCILED', 'DECLINED'].includes(x.status))]];
      const body = list.length ? groups.filter(g => g[1].length).map(([t, xs]) => `<section class="aa-sec"><h2 class="h3">${t} (${xs.length})</h2>${xs.map(x => refundCard(s, x, list.indexOf(x))).join('')}</section>`).join('')
        : `<div class="card flat">${ui.empty('banknote', 'ยังไม่มีเคสคืนเงิน', 'เคสจะขึ้นที่นี่เมื่อยกเลิกนัด ไม่พบคนไข้ ประเมินอย่างเดียว หานักกายภาพไม่ได้ หรือคนไข้ขอคืนคอร์ส')}</div>`;
      return SC.adminShell(s, 'a.refunds', { title: 'คืนเงิน', sub: 'ขอ → พี่ปาล์ม (CEO) อนุมัติคนเดียว → อีกคนโอน → กระทบยอด · ผู้ขอ ผู้อนุมัติ ผู้โอน ต้องเป็นคนละคน · ห้องซ้อม ไม่โอนจริง' }, `${picker}${toPay}${body}`);
    }
  });
  /* Patient view: what was asked, where it is, and the transfer proof. */
  SC.screen('p.refund', {
    role: 'patient',
    render(s) {
      const list = refunds(s);
      return `<div class="scr pp">${ui.bar('การคืนเงิน')}<div class="body">${list.length ? list.map(x => { const w = SC.refundWords(x); return `<div class="card" data-refund-patient="${esc(x.id)}"><div class="row between wrap"><b class="h3">${esc(x.title)}</b>${tag(w.now, w.tone)}</div>
        <dl class="kv"><dt>เงินคืน</dt><dd>${x.amount != null ? `<b>${money2(x.amount)}</b>` : 'ทีมกำลังพิจารณายอด'}</dd>${x.keep ? `<dt>หักไว้</dt><dd>${money2(x.keep)}</dd>` : ''}<dt>ขั้นต่อไป</dt><dd>${esc(w.next)}</dd><dt>เลขเคส</dt><dd>${esc(x.id)}</dd>${x.proof ? `<dt>หลักฐาน</dt><dd>${esc(x.proof)}</dd>` : ''}</dl></div>`; }).join('')
        : ui.empty('banknote', 'ยังไม่มีรายการคืนเงิน', 'ถ้ามีการคืนเงิน ทีมจะแจ้งในแชต LINE และแสดงที่นี่')}</div></div>`;
    }
  });

  /* ---------- Visit exits (M11 §4–§6, H13 NEW-01, RF-01…RF-19) ---------- */
  const T = P.trial, CA = P.cancelAfterTravel, NS = P.noShow, AO = P.assessOnly;
  const EXITS = {
    ptCancel: { steps: [0], label: 'ไปไม่ได้ ขอยกเลิกงานนี้', sub: 'ทีมหานักกายภาพแทนหรือนัดใหม่ ไม่มีค่าใช้จ่ายเพิ่มให้คนไข้', pay: 0, src: 'M11 P06, §3 ข้อ 7' },
    noShow: { steps: [2], label: 'ไม่พบคนไข้ (รอครบ 15 นาที)', sub: `โทรแล้ว รอครบ 15 นาที มีหลักฐาน · คืนคนไข้ ${money(NS.refund)} · คุณได้ ${money2(NS.pt)}`, pay: NS.pt, src: 'M11 P10, §5.2, AC16' },
    unsafe: { steps: [1, 2, 3], label: 'บ้านไม่ปลอดภัย หรือย้ายตัวไม่ปลอดภัย', sub: 'หยุดได้ทันที · ทีมทบทวนเอง ไม่ใช้อัตราไม่พบคนไข้', pay: null, src: 'M11 P13, §4 · H13 NEW-01' },
    emergency: { steps: [1, 2, 3], label: 'เหตุฉุกเฉิน', sub: 'ดูแลความปลอดภัยก่อน · ทีมพิจารณายกเว้นค่าหักเป็นรายกรณี', pay: null, src: 'M11 P08, §5.2, AC17' },
    assessOnly: { steps: [3], label: 'ประเมินแล้ว รักษาไม่ได้เพราะอาการหรือข้อห้าม', sub: `Clinical Lead ตรวจรับ · คืนคนไข้ ${money(AO.refund)} · คุณได้ ${money(AO.pt)}`, pay: AO.pt, src: 'M11 P02, §5.1, AC10 · H13 l.27' },
    assessIncomplete: { steps: [3], label: 'ประเมินไม่ครบเพราะเหตุฉุกเฉิน', sub: 'ไม่ใช้ยอดประเมินอย่างเดียวอัตโนมัติ · ทีมทบทวนเอง', pay: null, src: 'M11 §5.1, AC11' },
    refusal: { steps: [3], label: 'คนไข้ปฏิเสธการรักษา', sub: 'บันทึกว่าคนไข้ปฏิเสธหลังรับทราบ · ยอดคืนเงินรอตัดสิน', pay: null, src: 'M11 §4, §9 C5' },
    stopped: { steps: [3], label: 'เริ่มรักษาแล้วต้องหยุด', sub: 'นับเป็น 1 ครั้ง คุณได้ค่าตอบแทนปกติ · ถ้าคนไข้ขอคืนเงิน Clinical Lead กับทีมพิจารณา', pay: P.trialPtNet, src: 'M11 P12, §4, AC12' },
    scope: { steps: [3], label: 'งานเกินขอบเขตที่ทีมอนุมัติ', sub: 'หยุดงานนั้น · เปิดเหตุการณ์ (Incident) มีเจ้าของ · ไม่หักค่าประเมินอัตโนมัติ', pay: null, src: 'M11 P15, §9 B2' }
  };
  const EXIT_DONE = { patientCancelBefore: 'คนไข้ยกเลิกก่อนออกเดินทาง', patientCancelAfter: 'คนไข้ยกเลิกหลังออกเดินทาง', closedCase: 'ยกเลิก · คนไข้ขอคืนเต็ม', courseRefunded: 'ยกเลิก · คืนเงินคอร์สแล้ว' };
  SC.EXITS = EXITS;
  SC.exitLabel = v => (EXITS[v.exit] || {}).label || EXIT_DONE[v.exit] || '';
  SC.exitPay = v => v.exit === 'patientCancelAfter' ? CA.pt : ['patientCancelBefore', 'closedCase', 'courseRefunded'].includes(v.exit) ? 0 : EXITS[v.exit] ? EXITS[v.exit].pay : null;
  SC.visitExitButton = (s, v, n) => { const any = Object.values(EXITS).some(x => x.steps.includes(v.step)); return any ? `<button class="btn ghost tt-exit" data-act="visitExitOpen" data-n="${n}">${I('door-open')}${v.step === 0 ? 'ไปไม่ได้ / ยกเลิกงานนี้' : 'จบงานแบบอื่น (ไม่ใช่รักษาครบ)'}</button>` : ''; };
  const exitSheet = (st, n) => { const v = st.visits.find(x => x.n === n) || {}, pick = (st.pt.exitPick || ''), opts = Object.entries(EXITS).filter(([, x]) => x.steps.includes(v.step));
    const ns = pick === 'noShow';
    return `<b class="h2">จบงานแบบอื่น</b><p class="small">เลือกสิ่งที่เกิดขึ้นจริง ระบบไม่บันทึกว่า "จบการดูแล" และไม่ต้องเขียนบันทึกการรักษาที่ไม่ได้ทำ</p>
      <div class="stack">${opts.map(([k, x]) => `<button class="opt tt-exitopt" style="width:100%;text-align:left;${pick === k ? 'border-color:var(--em2);background:#eaf3ee' : ''}" data-pick="pt.exitPick" data-value="${k}" data-then="visitExitSheet" data-n="${n}">${pick === k ? I('circle-check') : I('circle')}<span><b>${esc(x.label)}</b><small style="display:block">${esc(n === 1 ? x.sub : 'นัดในคอร์ส: ทีมพิจารณาตามกฎคอร์ส ไม่ใช้ยอดของ ClairMatch')}</small></span></button>`).join('')}</div>
      ${ns ? `<div class="card flat"><label class="check"><input type="checkbox" data-bind="pt.nsCalled" ${st.pt.nsCalled ? 'checked' : ''}><span>โทรหาคนไข้และญาติแล้ว ติดต่อไม่ได้</span></label><label class="check"><input type="checkbox" data-bind="pt.nsWaited" ${st.pt.nsWaited ? 'checked' : ''}><span>ห้องซ้อม: ข้ามเวลาไปครบ 15 นาทีหลังถึง</span></label></div>` : ''}
      ${pick && MANUAL_EXITS.includes(pick) ? `<label class="field" data-exit-note><span>เล่าสั้น ๆ ว่าเกิดอะไรขึ้น ${pick === 'scope' ? '(ส่งถึง Clinical Lead)' : '(ทีมใช้ทบทวน)'}</span><textarea class="in" rows="2" maxlength="300" data-bind="pt.exitNote" placeholder="เช่น ญาติขอให้ดูดเสมหะ ซึ่งทีมไม่ได้อนุมัติ จึงหยุดงานนั้น">${esc(st.pt.exitNote || '')}</textarea></label>` : ''}
      ${pick === 'refusal' ? `<p class="note" style="margin:0">อธิบายความเสี่ยงให้คนไข้ฟังแล้ว · ยอดคืนเงิน ${OPEN('O-02')}</p>` : ''}${pick === 'assessOnly' ? `<p class="note" style="margin:0">เกณฑ์ "ประเมินครบอย่างมีสาระ" ที่ Clinical Lead ลงนาม ${OPEN('O-03')}</p>` : ''}
      <div class="grid2"><button class="btn ghost" data-close>กลับ</button><button class="btn" data-act="visitExitDo" data-n="${n}" ${pick && (!ns || (st.pt.nsCalled && st.pt.nsWaited)) ? '' : 'disabled'}>ยืนยัน</button></div>`; };
  const MANUAL_EXITS = ['unsafe', 'emergency', 'assessIncomplete', 'refusal', 'stopped', 'scope'];
  SC.action('visitExitOpen', (s, c) => { const n = +(c.data.n || 1); s.pt.exitPick = ''; s.pt.exitNote = ''; s.pt.nsCalled = false; s.pt.nsWaited = false; c.sheet(st => exitSheet(st, n)); });
  SC.action('visitExitSheet', (s, c) => { const n = +(c.data.n || 1); c.sheet(st => exitSheet(st, n)); });
  SC.action('visitExitDo', (s, c) => { const n = +(c.data.n || 1); applyExit(s, n, s.pt.exitPick, c.line); c.close(); c.toast(`บันทึกแล้ว: ${EXITS[s.pt.exitPick] ? EXITS[s.pt.exitPick].label : ''}`); });
  function applyExit(s, n, key, line) {
    const v = s.visits.find(x => x.n === n), x = EXITS[key]; if (!v || !x) return;
    /* The exit happens at the visit (clock): before travel, on the road, 15 min after arriving, or during care. */
    SC.clockTo(s, SC.visitIso(v, [-90, -20, 15, 45][Math.min(v.step, 3)]));
    const note = (s.pt.exitNote || '').trim();
    v.exit = key; v.exitAt = stamp(1); v.exitStep = v.step; v.step = 4; if (note) v.exitNote = note;
    const trial = n === 1, nm = pname(s), r = ref(s);
    if (key === 'ptCancel') {
      s.request.ptCancelled = { at: v.exitAt, choice: '' };
      line('patient', { key: 'note', title: 'นักกายภาพไปตามนัดไม่ได้', lines: ['ทีมกำลังหานักกายภาพแทน หรือนัดเวลาใหม่ ไม่มีค่าใช้จ่ายเพิ่ม', trial ? `ถ้าจัดให้ไม่ได้ หรือไม่สะดวก ขอคืนเต็ม ${money(T)} ได้` : 'สิทธิ์คอร์สครั้งนี้ไม่ถูกหัก'], go: 'p.choice?ptNoShow', button: 'เลือกทางที่สะดวก' });
      line('admin', { key: 'note', to: ['boss'], title: `PT ยกเลิกงาน ${r}`, lines: ['หา PT แทนหรือนัดใหม่ · คนไข้ขอคืนเต็มได้', 'ผู้รับผิดชอบ: บอส (ข้อเสนอ)'], go: 'a.match', button: 'หา PT แทน' });
      return;
    }
    const base = { ref: r, payTo: nm, basis: x.src, n };
    /* 7 Nov rehearsal P13: one admin card per exit (the refund case card was a duplicate), written to the team, not to the PT. */
    let rf;
    if (key === 'noShow' && trial) rf = refundOpen(s, Object.assign(base, { kind: 'noShow', title: 'ไม่พบคนไข้หลังรอ 15 นาที', amount: NS.refund, keep: NS.keep, ptShare: NS.pt, platformShare: NS.platform, reason: 'PT ถึงบ้าน โทรแล้ว รอครบ 15 นาที มีหลักฐาน · ค่าชดเชยแยกจากประเมินอย่างเดียว' }));
    else if (key === 'assessOnly' && trial) rf = refundOpen(s, Object.assign(base, { kind: 'assessOnly', title: 'ประเมินอย่างเดียว รักษาไม่ได้เพราะอาการ', amount: AO.refund, keep: AO.keep, ptShare: AO.pt, platformShare: AO.platform, needLead: true, reason: 'ประเมินครบ มีหลักฐาน · ไม่หักค่าธรรมเนียมซ้ำ' }));
    else if (key === 'stopped') rf = refundOpen(s, Object.assign(base, { kind: 'stopped', title: 'เริ่มรักษาแล้วต้องหยุด (ถ้าคนไข้ขอคืน)', manual: true, reason: 'นับ 1 ครั้ง PT ได้ค่าตอบแทนปกติ · Clinical Lead กับทีมพิจารณาคำขอคืนเงิน' }));
    else rf = refundOpen(s, Object.assign(base, { kind: key, title: x.label, manual: true, reason: key === 'scope' ? 'Incident: งานเกินขอบเขตที่ทีมอนุมัติ · ระบบควรกันไว้ก่อน' : x.sub }));
    if (note && rf) rf.log.push({ at: v.exitAt, who: `${s.pt.displayName || 'PT'} (PT)`, what: `เล่าเหตุ: ${note}` });
    /* 7 Nov rehearsal P15: going beyond the approved scope is a safety incident with a named owner (Clinical Lead), not only a money case. */
    let inc = null;
    if (key === 'scope' || key === 'unsafe' || key === 'emergency') { const list = s.incidents = s.incidents || [];
      inc = { id: `INC-${String(list.length + 1).padStart(4, '0')}`, kind: key, title: x.label, ref: r, visit: n, owner: 'palm', note, at: v.exitAt, open: true, refund: rf ? rf.id : '', log: [{ at: v.exitAt, who: `${s.pt.displayName || 'PT'} (PT)`, what: note ? `แจ้งเหตุ: ${note}` : 'แจ้งเหตุจากหน้างาน' }] };
      list.push(inc); }
    const pay = SC.exitPay(v);
    line('patient', { key: 'note', title: key === 'assessOnly' ? 'ผลการประเมินวันนี้' : key === 'noShow' ? 'นักกายภาพไปถึงแล้ว แต่ติดต่อคุณไม่ได้' : 'นัดวันนี้หยุดก่อนรักษาครบ', lines: key === 'assessOnly' ? ['นักกายภาพประเมินแล้ว วันนี้ยังรักษาไม่ได้เพราะอาการหรือข้อห้าม', trial ? `คืนเงิน ${money(AO.refund)} หลัง Clinical Lead ตรวจรับ` : 'ไม่หักสิทธิ์คอร์ส ทีมจะโทรคุย', 'ไม่เสียสิทธิ์ ClairMatch'] : key === 'noShow' ? ['นักกายภาพรอและโทรหาแล้ว 15 นาที', trial ? `คืนเงิน ${money(NS.refund)} · ไม่เห็นด้วย แจ้งทีมในแชตนี้ได้` : 'ทีมจะโทรคุยเรื่องนัดในคอร์ส'] : ['ทีมจะโทรหาคุณเพื่อคุยขั้นต่อไป', 'เรื่องเงินทีมพิจารณาเป็นรายกรณี'], go: 'p.refund', button: 'ดูรายละเอียด' });
    line('pt', { key: 'note', title: `บันทึกแล้ว: ${x.label}`, lines: [pay != null ? `รายได้ของคุณจากนัดนี้ ${money2(pay)}` : 'รายได้ของนัดนี้ ทีมพิจารณาเอง แจ้งใน LINE', 'ไม่ต้องเขียนบันทึกการรักษาที่ไม่ได้ทำ'], go: 't.earn', button: 'ดูรายได้' });
    const adminSub = key === 'noShow' ? `PT ถึงบ้าน โทรแล้ว รอครบ 15 นาที · คืนคนไข้ ${money(NS.refund)} · PT ได้ ${money2(NS.pt)} · แพลตฟอร์ม ${money2(NS.platform)}`
      : key === 'assessOnly' ? `Clinical Lead ตรวจรับก่อน · คืนคนไข้ ${money(AO.refund)} · PT ได้ ${money(AO.pt)} · แพลตฟอร์ม ${money(AO.platform)}`
      : key === 'stopped' ? 'นับ 1 ครั้ง PT ได้ค่าตอบแทนปกติ · ถ้าคนไข้ขอคืน ทีมพิจารณา' : 'ทีมทบทวนเอง ยังไม่มียอดตั้งต้น';
    if (inc) line('admin', { key: 'note', to: ['palm', 'nat'], title: `ถึงพี่ปาล์ม (Clinical Lead): ${inc.id} ${x.label}`, tag: 'Incident · เจ้าของ พี่ปาล์ม (Clinical Lead)', lines: [`คำขอ ${r} · ครั้งที่ ${n} · ${nm}`, note ? `PT เล่า: ${note}` : 'PT ยังไม่ได้เล่ารายละเอียด', `เคสเงิน ${rf ? rf.id : '—'} · เจ้าของเคสเงิน พี่นัท (ข้อเสนอ) · ${adminSub}`], go: 'a.queue', button: 'เปิดงาน' });
    else line('admin', { key: 'note', to: ['nat'], title: `เคสหลังเดินทาง ${r}: ${x.label}`, lines: [`เคสเงิน ${rf ? rf.id : '—'} · รอ พี่นัท (CMO) ส่งเรื่อง`, adminSub, rf && rf.needLead ? 'ต้องให้ Clinical Lead ตรวจรับผลประเมินก่อน' : ''], go: 'a.refunds', button: 'เปิดเคส' });
  }
  SC.applyExit = applyExit;
  /* Patient cancels ClairMatch from p.appt (RF-02 / RF-03 / RF-05: one outcome per booking). */
  SC.patientCancel = (s, n, c) => {
    const v = s.visits.find(x => x.n === n); if (!v || v.exit) return;
    const after = v.step >= 1; SC.clockTo(s, SC.visitIso(v, after ? -20 : -24 * 60));
    v.exit = after ? 'patientCancelAfter' : 'patientCancelBefore'; v.exitAt = stamp(1); v.exitStep = v.step; v.step = 4;
    if (s.request && n === 1) s.request.closed = after ? 'cancelAfter' : 'cancelBefore';
    refundOpen(s, after ? { kind: 'cancelAfter', n, title: 'คนไข้ยกเลิกหลังนักกายภาพออกเดินทาง', amount: CA.refund, keep: CA.keep, ptShare: CA.pt, platformShare: CA.platform, reason: `ยกเลิกหลังเริ่มเดินทาง (${s.patient.cancelDraft || 'ไม่ระบุ'}) · เก็บ ${money(CA.keep)} แบ่ง PT 80% แพลตฟอร์ม 20%`, basis: 'M11 P10, §5.2, AC15' }
      : { kind: 'cancelBefore', n, title: 'คนไข้ยกเลิกก่อนนักกายภาพออกเดินทาง', amount: T, reason: `ยกเลิกก่อนเริ่มเดินทาง (${s.patient.cancelDraft || 'ไม่ระบุ'}) · คืนเต็ม ไม่หักใด ๆ`, basis: 'M11 P09, §5.2, AC14' }, c.line);
    c.line('patient', { key: 'note', title: 'ยกเลิกนัดแล้ว', lines: [`ครั้งที่ ${n} · ${v.date} · ${v.time} น. ยกเลิกแล้ว`, after ? `เงินคืน ${money(CA.refund)} · หัก ${money(CA.keep)} เพราะนักกายภาพออกเดินทางแล้ว` : `เงินคืนเต็ม ${money(T)}`, 'ทีมตรวจแล้วส่งให้ผู้บริหารอนุมัติ อนุมัติแล้วโอนคืนเข้าบัญชีที่คุณแจ้งในแชตนี้ · แจ้งทุกขั้น'], go: 'p.refund', button: 'ดูสถานะเงินคืน' });
    c.line('pt', { key: 'note', title: 'คนไข้ยกเลิกนัด', lines: [`${v.date} · ${v.time}`, after ? `คุณได้ค่าชดเชย ${money(CA.pt)}` : 'ยกเลิกก่อนคุณออกเดินทาง งานนี้ปิดแล้ว'], go: 't.work', button: 'ดูงาน' });
    c.toast(after ? `ยกเลิกแล้ว · คืน ${money(CA.refund)}` : `ยกเลิกแล้ว · คืนเต็ม ${money(T)}`);
  };
  SC.visitExitCard = (s, v, n) => { const x = EXITS[v.exit], pay = SC.exitPay(v), rf = SC.visitRefund(s, v);
    return `<div class="card" data-exit="${esc(v.exit)}"><b class="h3">${I('door-open')} ${esc(SC.exitLabel(v))}</b><p class="small" style="margin:0">บันทึกเมื่อ ${esc(v.exitAt || '')} · ไม่บันทึกเป็น "จบการดูแล"</p>
      ${x ? `<p class="p" style="margin:0">${esc(x.sub)}</p>` : ''}${v.exitNote ? `<p class="small" style="margin:0">คุณเล่า: ${esc(v.exitNote)}</p>` : ''}<dl class="kv"><dt>รายได้ของคุณ</dt><dd>${pay != null ? money2(pay) : v.exit === 'courseRefunded' ? 'ไม่มี (นัดถูกยกเลิกก่อนวันนัด)' : 'ทีมพิจารณาเอง'}</dd>${rf ? `<dt>เคสเงิน</dt><dd>${esc(rf.id)} · ${esc(STATUS[rf.status][0])}</dd>` : ''}</dl></div>`; };
  /* The money case that belongs to a visit (new cases carry n; older saves fall back to the latest case of that kind). */
  const EXIT_KIND = { patientCancelAfter: 'cancelAfter', patientCancelBefore: 'cancelBefore' };
  SC.visitRefund = (s, v) => { const list = refunds(s); if (v.exit === 'courseRefunded') return list.find(r => r.kind === 'course' && s.course && s.course.refunded && r.id === s.course.refunded.id) || null;
    return list.filter(r => r.n === v.n && r.kind !== 'course').slice(-1)[0] || list.filter(r => r.kind === (EXIT_KIND[v.exit] || v.exit)).slice(-1)[0] || (v.n === 1 && s.request && s.request.closed ? list.filter(r => ['hold30', 'noPt', 'ptNoShow'].includes(r.kind)).slice(-1)[0] : null) || null; };
  /* 7 Nov rehearsal P2: what happened to a visit, in plain Thai, for the patient and the admin list. A visit that ended another way is never "เสร็จแล้ว". */
  const OUT = { patientCancelBefore: ['ยกเลิกแล้ว', 'คุณยกเลิกก่อนนักกายภาพออกเดินทาง'], patientCancelAfter: ['ยกเลิกแล้ว', 'คุณยกเลิกหลังนักกายภาพออกเดินทาง'], noShow: ['ไม่พบคนไข้', 'นักกายภาพไปถึงแล้ว รอและโทรครบ 15 นาที แต่ติดต่อไม่ได้'],
    ptCancel: ['นักกายภาพไปไม่ได้', 'ทีมหานักกายภาพแทนหรือนัดใหม่ ไม่มีค่าใช้จ่ายเพิ่ม'], assessOnly: ['ประเมินแล้ว ยังรักษาไม่ได้', 'นักกายภาพประเมินแล้ว วันนั้นรักษาไม่ได้เพราะอาการหรือข้อห้าม'], courseRefunded: ['ยกเลิกแล้ว · คืนเงินคอร์ส', 'คอร์สปิดหลังโอนเงินคืน นัดนี้จึงยกเลิก'],
    unsafe: ['หยุดก่อนรักษา', 'หยุดเพื่อความปลอดภัย ทีมจะโทรคุย'], emergency: ['หยุดเพราะเหตุฉุกเฉิน', 'ทีมจะโทรคุยขั้นต่อไป'], assessIncomplete: ['หยุดเพราะเหตุฉุกเฉิน', 'ประเมินไม่ครบ ทีมจะโทรคุย'], refusal: ['ไม่ได้รักษา', 'บันทึกว่าคุณไม่ประสงค์รับการรักษาวันนั้น'],
    stopped: ['หยุดกลางคัน', 'เริ่มรักษาแล้วต้องหยุด ทีมจะโทรคุย'], scope: ['หยุดก่อนรักษาครบ', 'มีงานที่อยู่นอกขอบเขตที่ทีมอนุมัติ ทีมคลินิกจะโทรคุย'], closedCase: ['ยกเลิกแล้ว', 'เคสปิดหลังคืนเงินเต็ม'] };
  SC.visitOutcome = (s, v) => { if (!v) return null;
    if (!v.exit) return v.step >= 4 ? { kind: 'done', label: 'เสร็จแล้ว', tone: 'gray', done: true } : null;
    const o = OUT[v.exit] || ['จบแบบอื่น', SC.exitLabel(v)], rf = SC.visitRefund(s, v), w = rf ? SC.refundWords(rf) : null;
    const money = rf ? (rf.amount != null ? `เงินคืน ${money2(rf.amount)}${rf.keep ? ` · หัก ${money2(rf.keep)}` : ''}` : 'เงินคืน: ทีมกำลังพิจารณายอด') : v.exit === 'ptCancel' ? 'ไม่มีค่าใช้จ่ายเพิ่ม' : v.exit === 'courseRefunded' ? 'อยู่ในเงินคืนคอร์ส' : '';
    return { kind: v.exit, label: o[0], why: o[1], tone: 'warn', done: false, at: v.exitAt || '', refund: rf, money, now: w ? w.now : '', next: w ? w.next : '', stoppedAt: v.exitStep == null ? 0 : v.exitStep }; };

  /* ---------- Patient choices (search exhausted, PT can't come, Hold day 30) ---------- */
  const CHOICES = {
    search: { title: 'ยังหานักกายภาพไม่ได้', lead: 'ทีมค้นหาครบ 3 เวลาที่คุณเลือก ในทุกโซนที่ให้บริการได้แล้ว', opts: [['more', 'ให้ทีมหาต่อ'], ['time', 'เลือกเวลาใหม่'], ['refund', `ขอคืนเต็ม ${money(T)}`]], src: 'M11 P05, §3 ข้อ 6 · H13 NEW-03' },
    ptNoShow: { title: 'นักกายภาพไปตามนัดไม่ได้', lead: 'ทีมหานักกายภาพแทนหรือนัดเวลาใหม่ให้ ไม่มีค่าใช้จ่ายเพิ่ม', opts: [['wait', 'รอนักกายภาพแทนหรือนัดใหม่'], ['refund', `ขอคืนเต็ม ${money(T)}`]], src: 'M11 P06' },
    hold30: { title: 'ครบ 30 วันที่ทีมคลินิกพักการดูแล', lead: 'นับจากวันชำระที่ยืนยันแล้ว เลือกได้ว่าจะรอต่อ หรือขอคืนเต็ม', opts: [['wait', 'เลื่อนนัดออกไปก่อน'], ['refund', `ขอคืนเต็ม ${money(T)} และยกเลิกนัด`]], src: 'H13 NEW-06 · M11 P07' }
  };
  SC.screen('p.choice', {
    role: 'patient',
    render(s, { param }) {
      const k = param.k || (s.choice && s.choice.kind) || 'search', c = CHOICES[k], picked = s.choice && s.choice.kind === k ? s.choice.picked : '';
      return `<div class="scr pp">${ui.bar(c.title)}<div class="body"><div class="card hero"><b class="h2">${esc(c.title)}</b><p class="p">${esc(c.lead)}</p></div>
        ${picked ? `<p class="note mint">${I('check')} เลือกแล้ว: ${esc((c.opts.find(o => o[0] === picked) || [])[1] || '')} · ทีมแจ้งขั้นต่อไปใน LINE</p>` : `<div class="stack">${c.opts.map(([v, t]) => `<button class="pp-choice" data-act="choicePick" data-k="${k}" data-v="${v}"><span>${esc(t)}</span>${I('chevron-right')}</button>`).join('')}</div>`}
        <p class="small">ไม่ต้องเลือกวันใหม่ก่อนจึงจะขอคืนเงินได้ · ข้อความนี้ยังรอ Legal ตรวจ</p></div></div>`;
    }
  });
  SC.action('choicePick', (s, c) => {
    const k = c.data.k, val = c.data.v; if (k === 'hold30') SC.clockTo(s, `${addDays((s.request && s.request.paidAt) || TRIAL_PAID_AT, 30)}T10:00`); s.choice = { kind: k, picked: val, at: stamp() };
    if (val === 'refund') {
      refundOpen(s, { kind: k === 'hold30' ? 'hold30' : k === 'ptNoShow' ? 'ptNoShow' : 'noPt', title: k === 'hold30' ? 'ครบ 30 วันพักการดูแล คนไข้ขอคืนเต็ม' : k === 'ptNoShow' ? 'PT ไปไม่ได้ คนไข้ขอคืนเต็ม' : 'หานักกายภาพไม่ได้ คนไข้ขอคืนเต็ม', amount: T, reason: 'คืนเต็ม ไม่หักใด ๆ', basis: CHOICES[k].src }, c.line);
      if (s.request) { s.request.closed = k; s.request.offerTo = []; }
      const open = s.visits.filter(x => x.step < 4);
      open.forEach(x => { x.exit = 'closedCase'; x.exitAt = s.choice.at; x.exitStep = x.step; x.step = 4; });
      const rf = refunds(s).slice(-1)[0]; if (rf && open[0]) rf.n = open[0].n;
      c.line('patient', { key: 'note', title: 'รับคำขอคืนเต็มแล้ว', lines: [`เงินคืนเต็ม ${money(T)}${open.length ? ` · ยกเลิกนัด ${open.map(x => x.date).join(', ')}` : ''}`, 'ทีมตรวจแล้วส่งให้ผู้บริหารอนุมัติ อนุมัติแล้วโอนคืนเข้าบัญชีที่คุณแจ้งในแชตนี้'], go: 'p.refund', button: 'ดูสถานะ' });
      /* 7 Nov rehearsal NT-23: the PT hears that the booking is gone, the same moment it leaves the work list. */
      if (open.length && s.request && s.request.status === 'BOOKED') c.line('pt', { key: 'note', title: `นัด ${pname(s)} ถูกยกเลิก`, lines: [open.map(x => `ครั้งที่ ${x.n} · ${x.date} ${x.time}`).join(' · '), k === 'hold30' ? 'ครบ 30 วันที่ทีมคลินิกพักการดูแล คนไข้ขอคืนเต็ม' : 'คนไข้ขอคืนเต็ม', 'เวลานั้นว่างแล้ว ไม่ต้องเดินทาง'], go: 't.work', button: 'ดูงาน' });
      return 'p.refund';
    }
    c.line('admin', { key: 'note', to: [k === 'hold30' ? 'nat' : 'boss'], title: `คนไข้เลือก: ${(CHOICES[k].opts.find(o => o[0] === val) || [])[1]}`, lines: [`คำขอ ${ref(s)}`, k === 'hold30' ? 'เจ้าของเคส: พี่นัท (ข้อเสนอ)' : 'ผู้รับผิดชอบ: บอส (ข้อเสนอ)'], go: k === 'hold30' ? 'a.clinical' : 'a.match', button: 'เปิดงาน' });
    c.toast('ส่งให้ทีมแล้ว');
  });

  /* ---------- Search log: 3 times × serviceable zones (H13 NEW-03 §2C, M11 §3) ---------- */
  const zoneOf = d => SC.ZONES.find(z => z.districts.includes(d));
  const serviceable = s => { const zs = new Set(); [...(s.pt.zones || []), ...SC.SAMPLE_PTS.flatMap(p => p.zones)].forEach(d => { const z = zoneOf(d); if (z) zs.add(z.code); }); return SC.ZONES.filter(z => zs.has(z.code)); };
  function searchOf(s) {
    const r = s.request; if (!r) return null;
    const S = r.search = r.search || { done: [], owner: 'boss', notice24: false, handoff: false };
    const home = zoneOf(SC.patientDistrict(s)), wins = (s.patient.windows || []).slice(0, 3);
    const zones = [home, ...serviceable(s).filter(z => !home || z.code !== home.code)].filter(Boolean);
    S.plan = wins.flatMap((w, i) => zones.map((z, k) => ({ key: `${i}-${z.code}`, win: w, winLabel: i ? `สำรอง ${i}` : 'หลัก', zone: z.name, cross: k > 0 })));
    return S;
  }
  const rowResult = (s, row) => { const mc = SC.meCandidate(s); if (!mc || !mc.ok) return { found: false, why: mc ? mc.reason : 'ยังไม่มี PT ในทีม' };
    if (!s.pt.schedule || !s.pt.schedule.sent) return { found: false, why: 'ไม่มีตารางว่าง' };
    if (!row.cross) return mc.zoneOk ? { found: true, why: 'พบ PT ที่ผ่านทุกด่าน' } : { found: false, why: 'ไม่มี PT ที่ลงเขตนี้และผ่านด่าน' };
    const z = SC.ZONES.find(x => x.name === row.zone), serves = (s.pt.zones || []).some(d => z && z.districts.includes(d));
    return serves ? { found: true, why: 'พบ PT ในโซนนี้ · ข้ามโซน ต้องให้ทีมยืนยันและ PT กดยอมรับ' } : { found: false, why: 'ไม่มี PT ที่ผ่านด่านในโซนนี้' }; };
  SC.searchCard = s => {
    const r = s.request, S = searchOf(s); if (!S || !S.plan.length) return '';
    const done = S.done, next = S.plan.find(x => !done.some(d => d.key === x.key)), found = done.find(d => d.found), exhausted = !next && !found;
    const live = ['OFFERED', 'BOOKED'].includes(r.status) && !done.length;
    const rows = S.plan.map(x => { const d = done.find(y => y.key === x.key); return `<tr><td>${esc(x.winLabel)} · ${esc(x.win)}</td><td>${esc(x.zone)}${x.cross ? ' <span class="pill gray">ข้ามโซน</span>' : ''}</td><td>${d ? `${d.found ? tag('พบ', '') : tag('ไม่พบ', 'gray')} <span class="small">${esc(d.why)} · ${esc(d.at)}</span>` : live && x.key === S.plan[0].key ? tag('ส่งงานแล้ว', '') : '<span class="small">ยังไม่ค้น</span>'}</td></tr>`; }).join('');
    const declines = ((r.trace || {}).events || []).filter(e => e.kind === 'DECLINED');
    return `<article class="card flat" data-search-log><div class="row between wrap"><b class="h3">${I('list-checks')}บันทึกการค้นหา</b><span class="small">${S.plan.length} ช่อง = 3 เวลา × ${S.plan.length / Math.max(1, (s.patient.windows || []).slice(0, 3).length)} โซน</span></div>
      <p class="small" style="margin:0">ค้นทีละเวลา: โซนบ้านคนไข้ก่อน แล้วโซนอื่นที่ให้บริการได้จริง · ข้ามโซนต้องให้ทีมยืนยัน และ PT กดยอมรับเอง · ไม่มีค่าเดินทางเพิ่ม · นิยามโซนที่ให้บริการได้ ${OPEN('O-05')}</p>
      <div class="tbl-wrap"><table class="tbl aa-rt"><thead><tr><th>เวลา</th><th>โซน</th><th>ผล</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${declines.length ? `<p class="small" style="margin:0">PT ปฏิเสธ: ${declines.map(e => esc(e.reason)).join(' · ')}</p>` : ''}
      ${r.closed ? `<p class="note" style="margin:0" data-search-closed>${I('circle-check')} เคสปิดแล้ว (คืนเงินเต็ม) · ไม่ต้องค้นต่อ</p>` : ''}
      <div class="field"><span>ผู้รับผิดชอบการค้นหา</span><div class="chips">${Object.values(TEAM).map(x => `<button class="chip ${S.owner === x.id ? 'on' : ''}" data-pick="request.search.owner" data-value="${x.id}">${esc(x.name)}</button>`).join('')}</div><small class="hint">ข้อเสนอ: บอส · กำหนดเวลาที่ต้องปิดงาน ${OPEN('O-06')}</small></div>
      <div class="sim-box"><span class="sim-tag">ห้องซ้อม</span><div class="aa-acts">
        ${next && !found ? (next.cross && !r.crossZone ? `<button class="btn sm" data-act="searchCross">ทีมยืนยัน: ค้นโซนอื่น</button>` : `<button class="btn sm ghost" data-act="searchNext">ค้นช่องถัดไป</button>`) : ''}
        ${next && !found ? `<button class="btn sm ghost" data-act="searchAll" data-search-all>ค้นทุกช่องที่เหลือ (${S.plan.filter(x => !done.some(d => d.key === x.key)).length})</button>` : ''}
        ${!S.notice24 ? `<button class="btn sm ghost" data-act="search24">ข้ามเวลา: ครบ 24 ชม.</button>` : ''}
        ${exhausted && !S.exhaustSent ? `<button class="btn sm" data-act="searchExhausted">ครบทุกช่องแล้ว · ให้คนไข้เลือก</button>` : ''}</div>
        <p class="small" style="margin:0">${S.notice24 ? `แจ้งสถานะคนไข้แล้ว ${esc(S.notice24)}` : 'ยังไม่ได้แจ้งสถานะ 24 ชม.'}${S.handoff ? ` · ส่งต่อ ${esc(who(S.owner))} แล้ว` : ''}${S.exhaustSent ? ' · ส่งทางเลือกให้คนไข้แล้ว' : ''}</p></div></article>`;
  };
  SC.searchPatientCard = s => { const S = s.request && s.request.search; if (!S || !(S.notice24 || S.exhaustSent)) return ''; return `<div class="card mint" data-search-status><b class="h3">${I('search')} สถานะการค้นหา</b><p class="p" style="margin:0">${S.exhaustSent ? 'ทีมค้นหาครบทุกช่องแล้ว เลือกทางที่สะดวกได้' : 'ทีมยังค้นหาอยู่ แจ้งให้ทราบ ไม่ได้แปลว่ารับประกันว่าหาได้'}</p>${S.exhaustSent ? `<button class="btn" data-go="p.choice" data-p-k="search">เลือกทางที่สะดวก</button>` : ''}</div>`; };
  SC.action('searchNext', (s, c) => { const S = searchOf(s), next = S.plan.find(x => !S.done.some(d => d.key === x.key)); if (!next) return; if (next.cross && !s.request.crossZone) { c.toast('ช่องถัดไปเป็นโซนอื่น · ทีมต้องยืนยันก่อน'); return; } const res = rowResult(s, next);
    S.done.push(Object.assign({ key: next.key, at: stamp(10) }, res));
    if (res.found && next.cross) { s.request.crossZone = true; c.toast('พบ PT ข้ามโซน · ส่งได้เมื่อทีมยืนยันและ PT กดยอมรับ'); } else c.toast(res.found ? 'พบ PT ในช่องนี้' : `ไม่พบ: ${res.why}`); });
  /* 7 Nov rehearsal: 18 slots took 21 taps. One tap runs the rest in order; it still stops at a cross-zone slot until the team confirms, and stops when a PT is found. */
  SC.action('searchAll', (s, c) => { const S = searchOf(s); let n = 0;
    for (let i = 0; i < 60; i++) { const next = S.plan.find(x => !S.done.some(d => d.key === x.key)); if (!next || S.done.some(d => d.found)) break;
      if (next.cross && !s.request.crossZone) { c.toast(`ค้นแล้ว ${n} ช่อง · ช่องถัดไปเป็นโซนอื่น ทีมต้องยืนยันก่อน`); return; }
      const res = rowResult(s, next); S.done.push(Object.assign({ key: next.key, at: stamp(10) }, res)); n++; if (res.found && next.cross) s.request.crossZone = true; }
    c.toast(S.done.some(d => d.found) ? `ค้นแล้ว ${n} ช่อง · พบ PT` : `ค้นแล้ว ${n} ช่อง · ยังไม่พบ PT`); });
  SC.action('searchCross', (s, c) => { s.request.crossZone = true; SC.MATCH.logEvent(s.request, 'CROSS_ZONE_CONFIRMED', { by: who(actor(s)) }); c.toast('ทีมยืนยันแล้ว ค้นโซนอื่นได้ · PT ต้องกดยอมรับพื้นที่เอง'); });
  SC.action('search24', (s, c) => { const S = searchOf(s); SC.clockTo(s, `${addDays((s.request && s.request.paidAt) || TRIAL_PAID_AT, 1)}T10:00`); S.notice24 = stamp(1); const left = S.plan.some(x => !S.done.some(d => d.key === x.key)) && !S.done.some(d => d.found);
    c.line('patient', { key: 'note', title: 'สถานะการหานักกายภาพ', lines: ['ทีมยังค้นหาตามเวลาที่คุณเลือก', 'แจ้งให้ทราบเท่านั้น ยังไม่ใช่การรับประกันว่าหาได้', 'มีคำถาม ทักทีมในแชตนี้ได้'], go: 'p.paywait', button: 'ดูสถานะ' });
    if (left) { S.handoff = true; c.line('admin', { key: 'note', to: [S.owner || 'boss'], title: `ถึง${who(S.owner)}: ค้นหา ${ref(s)} ยังไม่จบตามกำหนด`, lines: ['ส่งต่อผู้รับผิดชอบการจับคู่', 'กำหนดเวลาที่ต้องปิดงาน รอตัดสิน'], go: 'a.match', button: 'เปิดงาน' }); }
    c.toast('แจ้งสถานะคนไข้แล้ว' + (left ? ' · ส่งต่อผู้รับผิดชอบแล้ว' : '')); });
  SC.action('searchExhausted', (s, c) => { const S = searchOf(s); S.exhaustSent = stamp();
    c.line('patient', { key: 'note', title: 'ยังหานักกายภาพไม่ได้', lines: ['ทีมค้นหาครบ 3 เวลา ในทุกโซนที่ให้บริการได้แล้ว', `เลือกได้: ให้หาต่อ · เลือกเวลาใหม่ · ขอคืนเต็ม ${money(T)}`], go: 'p.choice?search', button: 'เลือกทางที่สะดวก' });
    c.toast('ส่งทางเลือกให้คนไข้แล้ว'); });

  /* ---------- Clinical Hold day 14 / day 30 (H13 NEW-06) ---------- */
  SC.holdPanel = s => { const r = s.request; if (!r || !r.scopeHold) return ''; const H = r.hold = r.hold || {}, paid = r.paidAt || TRIAL_PAID_AT;
    return `<article class="card flat" data-hold-clock><div class="row between wrap"><b class="h3">${I('calendar-clock')}พักการดูแล · นับจากวันชำระที่ยืนยันแล้ว ${thDate(paid)}</b>${tag('ไม่คืนเงินอัตโนมัติ', 'gray')}</div>
      <dl class="kv aa-kv"><dt>วันที่ 14</dt><dd>${thDate(addDays(paid, 14))} · ติดตามความพร้อม ${H.d14 ? tag('แจ้งแล้ว', '') : ''}</dd><dt>วันที่ 30</dt><dd>${thDate(addDays(paid, 30))} · คนไข้เลือกเลื่อนต่อหรือคืนเต็ม ${H.d30 ? tag('แจ้งแล้ว', '') : ''}</dd></dl>
      <p class="small" style="margin:0">นับจากวันชำระ ไม่ใช่วันเปิดพัก · ถ้าเลยกำหนดแล้วให้ทีมทำเอง ไม่เดาวันย้อนหลัง · เจ้าของเคส: พี่นัท (ข้อเสนอ)</p>
      <div class="sim-box"><span class="sim-tag">ห้องซ้อม · ข้ามเวลา</span><div class="aa-acts"><button class="btn sm ghost" data-act="holdDay" data-d="14" ${H.d14 ? 'disabled' : ''}>ถึงวันที่ 14</button><button class="btn sm ghost" data-act="holdDay" data-d="30" ${H.d30 ? 'disabled' : ''}>ถึงวันที่ 30</button><button class="btn sm ghost" data-act="holdEmergency">ฉุกเฉินรุนแรงก่อน PT เดินทาง</button></div></div></article>`; };
  SC.action('holdDay', (s, c) => { const r = s.request, H = r.hold = r.hold || {}, d = c.data.d;
    SC.clockTo(s, `${addDays(r.paidAt || TRIAL_PAID_AT, +d)}T09:00`);
    if (d === '14') { H.d14 = stamp(); c.line('patient', { key: 'note', title: 'ติดตามความพร้อม (วันที่ 14)', lines: ['ทีมคลินิกยังพักการดูแลไว้ นัดและยอดเดิมยังอยู่', 'ทีมจะโทรถามความพร้อมของคุณ'], go: 'p.result', button: 'ดูสถานะ' }); c.line('admin', { key: 'note', to: ['nat'], title: `ถึงพี่นัท (เจ้าของเคส): ${r.ref} ครบวันที่ 14`, lines: ['โทรติดตามความพร้อม · บันทึกผล'], go: 'a.clinical', button: 'เปิดเคส' }); }
    else { H.d30 = stamp(); c.line('patient', { key: 'note', title: 'ครบ 30 วันที่พักการดูแล', lines: ['เลือกได้: เลื่อนนัดออกไปก่อน หรือขอคืนเต็ม ฿1,599', 'ถ้าเลือกคืนเงิน นัดเดิมจะยกเลิก'], go: 'p.choice?hold30', button: 'เลือกทางที่สะดวก' }); c.line('admin', { key: 'note', to: ['nat'], title: `ถึงพี่นัท (เจ้าของเคส): ${r.ref} ครบวันที่ 30`, lines: ['คนไข้ได้ทางเลือกแล้ว · ไม่คืนอัตโนมัติ'], go: 'a.clinical', button: 'เปิดเคส' }); }
    c.toast(`ซ้อมถึงวันที่ ${d} แล้ว`); });
  SC.action('holdEmergency', (s, c) => { refundOpen(s, { kind: 'emergencyBefore', title: 'ฉุกเฉินรุนแรงก่อน PT เดินทาง ยังไม่ได้รับบริการ', amount: T, reason: 'จัดการความปลอดภัยแล้ว · คืนเต็ม', basis: 'M11 P08, §2.3 ข้อ 4' }, c.line); c.toast('เปิดเคสคืนเต็มแล้ว'); });

  /* ---------- Clinical review additions (NEW-02, MAP-01, MAP-03, MAP-04) ---------- */
  SC.clinExtraChecks = (s, list) => {
    const r = s.request, rv = r.review, M = SC.MATCH, tpl = M.templateOf(s), b = s.patient.branch || {}, out = [];
    const gap = tpl ? M.tasks(tpl).essential.filter(id => !rv.allow.includes(id)) : [];
    if (tpl && gap.length) out.push(`<div class="note" data-required-gap><b>งานจำเป็นของต้นแบบ ${esc(tpl.case_id)} ที่ยังไม่ติ๊ก:</b> ${gap.map(id => esc(SC.CLIN.label(id))).join(' · ')}<br><span class="small">ติ๊กเพิ่ม หรือเลือก Limited Scope พร้อมเหตุผล · ห้ามตัดงานจำเป็นออกเงียบ ๆ</span>
      <label class="check"><input type="checkbox" data-bind="request.review.limited" ${rv.limited ? 'checked' : ''}><span>Limited Scope: ทำเฉพาะงานที่ติ๊ก</span></label>${rv.limited ? `<label class="field"><span>เหตุผล Limited Scope</span><input class="in" data-bind="request.review.limitedWhy" value="${esc(rv.limitedWhy || '')}"></label>` : ''}${OPEN('เงื่อนไข Limited Scope')}</div>`);
    if (M.suctionUnsure(s)) out.push(`<label class="check" data-no-suction><input type="checkbox" data-bind="request.review.noSuction" ${rv.noSuction ? 'checked' : ''}><span>ยืนยันแล้วว่าเคสนี้ไม่ต้องดูดเสมหะ (ไม่ติ๊ก = พักไว้ ไปชำระเงินไม่ได้)</span></label>`);
    if (['GERI', 'BED'].includes(s.patient.group) && ['YES', 'UNSURE'].includes(b.breath)) out.push(`<label class="check"><input type="checkbox" data-bind="request.review.s04Need" ${rv.s04Need ? 'checked' : ''}><span>MAP-01: S04 จำเป็น · ส่งได้เฉพาะ PT ที่ได้อนุมัติ S04</span></label>`);
    if (s.patient.group === 'CARDIO' && b.heart && b.heart !== 'NO') out.push(`<div class="note"><b>MAP-03 CARDIO-01:</b> S08 จำเป็น · แค่แนบไฟล์ยังไม่ผ่าน ต้องตรวจหลักฐานได้ · ไม่มีหรือไม่แน่ใจ ให้พักไว้ ${OPEN('หลักฐานที่รับได้')}<label class="check"><input type="checkbox" data-bind="request.review.cardioOk" ${rv.cardioOk ? 'checked' : ''}><span>ตรวจหลักฐานโปรแกรมหัวใจแล้ว</span></label></div>`);
    if (list.includes('C11')) out.push(`<label class="check" data-c11-need><input type="checkbox" data-bind="request.review.c11Need" ${rv.c11Need ? 'checked' : ''}><span>MAP-04: C11 จำเป็นต่อการดูแล แต่ยังไม่มีวิธีจัดบริการที่ปลอดภัย → พักเคส ไม่ชำระเงิน ไม่ส่งงาน</span></label>${OPEN('วิธีจัดบริการที่ปลอดภัย')}`);
    return out.join('');
  };
  SC.clinApproveStop = (s, ctx) => {
    const r = s.request, rv = r.review, M = SC.MATCH, tpl = M.templateOf(s), p = s.patient, b = p.branch || {};
    if (rv.s04Need && !rv.allow.includes('S04')) rv.allow.push('S04');
    if (M.suctionUnsure(s) && !rv.noSuction) { ctx.toast('ยังเปิดชำระเงินไม่ได้: ไม่แน่ใจเรื่องดูดเสมหะ · ยืนยันว่าไม่ต้องดูด หรือพักเคสไว้'); return true; }
    if (rv.c11Need) { const lead = (SC.CLIN_LEADS.find(x => x.id === rv.byId) || {}); if (r.scopeHold) { ctx.toast('เคสพักอยู่แล้ว · บันทึกว่า C11 จำเป็น'); return true; }
      r.status = 'CLINICAL_HOLD'; r.offerTo = []; (r.reviewLog = r.reviewLog || []).push({ reviewerId: lead.id, reviewer: `${lead.name} (${lead.role})`, decision: 'DECLINED', allow: rv.allow.slice(), limits: rv.limits, reason: `C11 จำเป็น · ${rv.reason}`, at: SC.REVIEW_AT, version: r.screeningVersion });
      ctx.line('patient', { key: 'note', title: 'ทีมคลินิกขอพักเคสไว้ก่อน', lines: ['ยังไม่ต้องชำระเงิน', 'ทีมจะโทรคุยวิธีดูแลที่ปลอดภัย'], go: 'p.result', button: 'ดูสถานะ' });
      ctx.toast('พักเคสแล้ว: C11 จำเป็น · ไม่เปิดชำระเงิน ไม่ส่งงาน'); return 'a.queue'; }
    const assessOnly = rv.allow.every(id => SC.ASSESS_TASKS.includes(id));
    if (tpl && !assessOnly && !rv.limited) { const gap = M.tasks(tpl).essential.filter(id => !rv.allow.includes(id)); if (gap.length) { ctx.toast(`งานจำเป็นของ ${tpl.case_id} ยังไม่ได้ติ๊ก: ${gap.join(', ')} · ติ๊กเพิ่ม หรือเลือก Limited Scope พร้อมเหตุผล`); return true; } }
    if (rv.limited && !(rv.limitedWhy || '').trim()) { ctx.toast('Limited Scope ต้องมีเหตุผล'); return true; }
    if (p.group === 'CARDIO' && b.heart && b.heart !== 'NO' && !rv.cardioOk) { ctx.toast('CARDIO-01: ตรวจหลักฐานโปรแกรมหัวใจก่อน · ไม่มีหรือไม่แน่ใจ ให้พักไว้'); return true; }
    return false;
  };
  /* MT-24 / MT-36 (CM §4.1, §7.3): what this PT can do, what is optional, and C11 when this PT is not authorised. */
  SC.scopeExtra = s => {
    if (!s.request) return ''; const ctx = SC.MATCH.ctxOf(s), can = ctx.essential.filter(id => SC.capEligible(s.pt, id)), cant = ctx.essential.filter(id => !SC.capEligible(s.pt, id));
    const c11 = [...ctx.essential, ...ctx.prep].includes('C11') && !SC.capEligible(s.pt, 'C11');
    return `${can.length ? `<p class="small" style="margin:0" data-pt-can><b>คุณทำได้:</b> ${can.map(id => esc(SC.CLIN.label(id))).join(' · ')}</p>` : ''}${cant.length ? `<p class="small" style="margin:0"><b>ยังทำไม่ได้:</b> ${cant.map(id => esc(SC.CLIN.label(id))).join(' · ')}</p>` : ''}
      ${ctx.optional.length ? `<p class="small" style="margin:0" data-optional><b>ทำได้แต่ไม่บังคับ:</b> ${ctx.optional.map(id => esc(SC.CLIN.label(id))).join(' · ')}</p>` : ''}
      ${c11 ? `<p class="note warn" style="margin:0" data-c11-block><b>C11 NOT AUTHORIZED FOR THIS PT</b> · ปิดกิจกรรมฝึกย้ายตัว (C11) สำหรับคุณในเคสนี้</p>` : ''}`;
  };
  /* MT-28 (H13 NEW-01 §2A ข้อ 3): the transfer answers go to the PT who took the job. */
  const LIFT = { N0: 'ทำเองได้', N1: 'ต้องมีคนช่วย 1 คน', N2: 'ต้องมีคนช่วย 2 คน หรือใช้เครื่องยก', UNSURE: 'ไม่แน่ใจ' }, HELP = { N0: 'ไม่มีคนช่วย', N1: 'มีคนช่วย 1 คน', N2: 'มีคนช่วย 2 คนขึ้นไป', HOIST: 'มีเครื่องยก' };
  SC.transferRow = s => { const b = s.patient.branch || {}, bt = (s.patient.barthel || {}).transfer; if (!b.lift && bt === undefined) return '';
    const parts = [b.lift ? `ย้ายตัว: ${LIFT[b.lift]}` : '', b.helpers ? `วันนัด: ${HELP[b.helpers]}` : '', bt !== undefined ? `กิจวัตรข้อลุกนั่ง: ${bt === null ? 'ไม่แน่ใจ' : bt + ' คะแนน'}` : ''].filter(Boolean);
    return `<div class="li" data-transfer><span class="tile gold">${I('armchair')}</span><span class="grow"><span class="t">การย้ายตัว (คนไข้ตอบ)</span><br><span class="s">${esc(parts.join(' · '))}</span><br><span class="s">คุณตัดสินหน้างาน · ไม่ปลอดภัย กด "จบงานแบบอื่น" › บ้านไม่ปลอดภัย · เกณฑ์เสี่ยงสูงที่ต้องตรวจก่อน รอตัดสิน</span></span></div>`; };

  /* ---------- Admin queue tasks ---------- */
  /* Each refund step has an owner (proposal): ขอ = พี่นัท · อนุมัติ = พี่ปาล์ม · โอน = บอส · กระทบยอด = พี่นัท (not the transferer). */
  const STEP_OWNER = { DRAFT: 'nat', REQUESTED: 'palm', APPROVED: 'boss', TRANSFERRED: 'nat' };
  const STEP_ACT = { DRAFT: ['rfSubmit', 'ส่งขออนุมัติ'], REQUESTED: ['rfApprove', 'อนุมัติ'], APPROVED: ['rfTransfer', 'โอนแล้ว'], TRANSFERRED: ['rfReconcile', 'กระทบยอด'] };
  SC.REFUND_STEP_OWNER = STEP_OWNER;
  SC.policyTasks = s => { const t = [], r = s.request, closed = !!(r && r.closed);
    refunds(s).forEach(x => { if (['RECONCILED', 'DECLINED'].includes(x.status)) return; const st = x.needLead ? 'รอ Clinical Lead ตรวจรับ' : STATUS[x.status][0], own = x.needLead ? 'palm' : STEP_OWNER[x.status], a = STEP_ACT[x.status];
      const inline = x.needLead ? { act: 'rfLeadOk', id: x.id, label: 'Clinical Lead ตรวจรับ', as: 'palm' } : x.amount == null && x.status === 'DRAFT' ? null : { act: a[0], id: x.id, label: a[1], as: own };
      t.push({ icon: 'banknote', tag: x.manual ? 'เคสทบทวนเอง' : 'คืนเงิน', title: `${x.id} · ${x.title}`, sub: `${st} · ${x.amount != null ? money2(x.amount) : 'ยอดทีมกำหนด'} · คืนให้ ${x.payTo}`, go: 'a.refunds', cta: 'เปิดเคส', owner: own, at: x.openedAt, kind: 'refund', inline, ref: x.ref, hot: x.status === 'APPROVED' }); });
    if (r && r.ptCancelled && !closed && !(s.choice && s.choice.kind === 'ptNoShow' && s.choice.picked === 'refund')) t.push({ icon: 'user-x', tag: 'PT ยกเลิก', title: `หา PT แทนหรือนัดใหม่ · ${r.ref}`, sub: 'ไม่มีค่าใช้จ่ายเพิ่มให้คนไข้ · คนไข้ขอคืนเต็มได้ · ผู้รับผิดชอบ บอส (ข้อเสนอ)', go: 'a.match', cta: 'หา PT แทน', owner: 'boss', kind: 'match', ref: r.ref });
    if (r && r.search && r.search.handoff && !closed && !['BOOKED'].includes(r.status)) t.push({ icon: 'search', tag: 'ค้นหาไม่จบตามกำหนด', title: `${r.ref} · ส่งต่อ ${who(r.search.owner)}`, sub: 'ค้นต่อ 3 เวลา × โซนที่ให้บริการได้ · กำหนดปิดงานรอตัดสิน', go: 'a.match', cta: 'เปิดงาน', owner: r.search.owner || 'boss', kind: 'match', ref: r.ref });
    const em = SC.emCase(s);
    if (em && !em.closed) t.push({ icon: 'siren', tag: em.revised ? 'ฉุกเฉิน · คนไข้แก้คำตอบเป็นไม่มี' : 'มีผู้ตอบว่าฉุกเฉิน', title: `${em.name} · ${em.phone || 'ยังไม่มีเบอร์'}`, sub: `ตอบเมื่อ ${em.at} · ระบบให้โทร 1669 แล้ว · ทีมโทรตามดูความปลอดภัย · ผู้ดูแล พี่ปาล์ม (Clinical Lead)`, go: 'a.patients', cta: 'ดูคนไข้', owner: 'palm', at: em.iso, kind: 'safety', inline: { act: 'emOpen', label: 'โทรแล้ว / ปิดงาน' }, hot: true });
    (s.incidents || []).filter(x => x.open).forEach(x => t.push({ icon: 'triangle-alert', tag: 'Incident · Clinical Lead', title: `${x.id} · ${x.title}`, sub: `${x.ref} ครั้งที่ ${x.visit} · ${x.note ? 'PT เล่า: ' + x.note : 'PT ยังไม่ได้เล่ารายละเอียด'} · เจ้าของ พี่ปาล์ม (Clinical Lead)`, go: 'a.refunds', cta: 'เคสเงิน', owner: 'palm', kind: 'safety', inline: { act: 'incOpen', id: x.id, label: 'บันทึกผล / ปิด' }, hot: true, ref: x.ref }));
    return t; };
  /* PG-05 emergency answer as a case the team can call and close (7 Nov rehearsal P6). Older saves only had the emFlag text. */
  SC.emCase = s => { const p = s.patient; if (!p.emFlag && !p.em) return null; if (!p.em) p.em = { name: p.name || 'ผู้รับบริการ', phone: p.phone || '', at: String(p.emFlag).split(' · ').pop() || '', iso: SC.clockNow(s) }; return p.em; };

  /* ---------- PG-05 / NT-03 (M11 AC01): an emergency answer alerts the team, with as little data as possible ---------- */
  SC.onShell(st => { const q1 = (st.patient.health || {}).q1;
    if (q1 === 'YES' && !st.patient.emFlag) { const at = stamp(); st.patient.emFlag = `${st.patient.name || 'ผู้รับบริการ'} · ${at}`; st.patient.em = { name: st.patient.name || 'ผู้รับบริการ', phone: st.patient.phone || '', at, iso: SC.clockNow(st), closed: false, log: [{ at, who: 'ระบบ', what: 'คนไข้ตอบว่ามีอาการฉุกเฉิน · ระบบให้โทร 1669' }] };
      SC.line('admin', { key: 'note', to: ['palm', 'nat'], title: 'มีผู้ตอบว่ามีอาการฉุกเฉิน', tag: 'ข้อมูลน้อยที่สุด', lines: [`${st.patient.name || 'ผู้รับบริการ'} · ${st.patient.phone || 'ยังไม่มีเบอร์'}`, 'ระบบแนะนำโทร 1669 และไม่รับจองแล้ว', 'ผู้ดูแล: พี่ปาล์ม (Clinical Lead) · ทีมโทรตามดูความปลอดภัย'], go: 'a.queue', button: 'เปิดงาน' });
      setTimeout(() => SC.render(true), 0); }
    /* 7 Nov rehearsal NT-34: the patient changes the answer back to "ไม่มี". The task stays until someone has called, but the team is told. */
    const em = st.patient.em; if (em && !em.closed && !em.revised && q1 && q1 !== 'YES') { em.revised = stamp(); (em.log = em.log || []).push({ at: em.revised, who: 'คนไข้', what: 'แก้คำตอบฉุกเฉินเป็น "ไม่มี"' });
      SC.line('admin', { key: 'note', to: ['palm', 'nat'], title: 'คนไข้แก้คำตอบฉุกเฉินเป็น "ไม่มี"', lines: [`${em.name} · ${em.phone || 'ยังไม่มีเบอร์'}`, 'งานโทรตามยังเปิดอยู่ โทรยืนยันก่อนปิดงาน'], go: 'a.queue', button: 'เปิดงาน' });
      setTimeout(() => SC.render(true), 0); } });

  /* go:screen?param from LINE notes */
  const go0 = SC.go;
  document.addEventListener('click', e => { const b = e.target.closest('#lineBody [data-card^="go:p.choice?"]'); if (!b) return; e.stopImmediatePropagation(); document.body.classList.remove('line-open'); go0('p.choice', { k: b.dataset.card.split('?')[1] }); }, true);
})();
