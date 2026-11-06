/* matching.js · Clinical Matching engine (Palm, CTO Instruction 6 Nov 2026 §2–§3, Clinical Matching Rules v2.3).
   One decision for every PT: case gate → licence → terms → case-essential capability → resources → location → availability.
   Nothing here decides price, refund or a clinical rule. 26 case rules are NOT_VALIDATED: fixtures and a rehearsal profile, not sign-off.
   DR-01 (CEO, 6 Nov): Required = the PT must be capable. Conditional = preparation information, never a filter on its own. Optional, Not indicated and unlabelled tasks never exclude a PT.
   Safety, equipment, helpers and restricted procedures are separate gates and are never skipped. No resolved requirement never means "everyone passes" (DR-05). */
(function () {
  'use strict';
  const { esc, ui } = SC, I = ui.icon, RULES = window.SC_CASE_RULES, CASES = RULES.cases;
  const M = SC.MATCH = { version: RULES.version, validation: RULES.clinical_validation_status, cases: CASES, active: {} };
  const STEPS = { CASE: 'เงื่อนไขของเคส', LICENSE: 'ใบประกอบและบัญชี', TERMS: 'ข้อตกลง', CAPABILITY: 'ทักษะที่เคสนี้จำเป็น', RESOURCE: 'อุปกรณ์หรือคนช่วย', LOCATION: 'พื้นที่', AVAILABILITY: 'ตารางเวลา' };
  M.STEP_ORDER = Object.keys(STEPS);
  M.caseById = id => CASES.find(c => c.case_id === id);
  const labelsOf = c => Object.assign({}, c.labels, c.extra_task_labels);
  const restrictedOf = c => [...new Set([...(c.restricted_tasks || []), ...Object.keys(labelsOf(c)).filter(id => SC.CLIN.restricted.includes(id) && labelsOf(c)[id] === 'Required')])];
  /* A template's tasks by label. Absent labels stay unknown, never Not indicated (handoff v2.3). */
  M.tasks = c => {
    const l = labelsOf(c), by = x => Object.keys(l).filter(id => l[id] === x), restricted = restrictedOf(c);
    return { essential: by('Required').filter(id => !restricted.includes(id)), conditional: by('Conditional'), optional: by('Optional'), notIndicated: by('Not indicated'), unknown: c.unclassified_main_mapping_tasks || [], restricted };
  };
  /* When screening can't name one template: only what every template of that service marks Required. Taken from the data, nothing added. */
  M.floor = svc => {
    const list = CASES.filter(c => c.service_id === svc).map(c => M.tasks(c).essential);
    return list.length ? list[0].filter(id => list.every(x => x.includes(id))) : [];
  };
  /* §2.1 gate for a template. A rule that is not active never becomes routine by itself. */
  M.gate = (c, f = {}) => {
    const st = c.safety_status || '';
    if (f.emergency) return { gate: 'EMERGENCY', why: 'มีสัญญาณฉุกเฉิน หยุดการจองปกติ' };
    if (restrictedOf(c).length) return { gate: 'RESTRICTED', why: `มีงานที่จำกัด ${restrictedOf(c).join(', ')} ไม่จับคู่อัตโนมัติ` };
    if (f.missing) return { gate: 'CLINICAL_REVIEW', why: 'ข้อมูลสำคัญไม่ครบ ไม่ถือว่าปลอดภัย' };
    if (st.startsWith('CLINICAL_REVIEW') && !f.approved) return { gate: 'CLINICAL_REVIEW', why: st };
    if (!(f.active !== undefined ? f.active : M.active[c.case_id])) return { gate: 'CLINICAL_REVIEW', why: 'กฎนี้ยังไม่เปิดใช้ (ยังไม่ผ่าน Clinical Validation)' };
    if (st === 'ROUTINE_IF_CONDITIONS_MET' && !f.conditionsMet) return { gate: 'CLINICAL_REVIEW', why: 'ยังไม่ครบเงื่อนไขของกฎนี้' };
    return { gate: 'ROUTINE', why: 'ผ่านกฎที่เปิดใช้' };
  };
  const NEURO_CASE = { STROKE: 'NEURO-01', PD: 'NEURO-02', SCI: 'NEURO-03', TBI: 'NEURO-04' };
  const asksSuction = p => { const b = p.branch || {}; return (p.group === 'BED' && b.cough === 'SUCTION') || (p.group === 'CARDIO' && b.airway === 'SUCTION'); };
  /* DR-02 (CEO, 6 Nov): a request that still needs suction never auto-matches, even when a lead approves other activities. */
  M.asksSuction = s => asksSuction(s.patient);
  /* DR-05 (CEO, 6 Nov): an unknown symptom group goes routine only through a validated, active rule that resolves the case. There are none today, so these go to review. */
  M.unknownResolved = s => { const p = s.patient; if (p.group !== 'UNSURE') return null; const id = (p.goals || []).map(g => (SC.RULES.unknownGroup || {})[g]).find(Boolean), c = id && M.caseById(id); return c && M.active[id] ? c : null; };
  M.templateOf = s => {
    const p = s.patient, b = p.branch || {};
    if (asksSuction(p)) return M.caseById('RESP-03');
    if (M.unknownResolved(s)) return M.unknownResolved(s);
    if (SC.clinBed04(p)) return M.caseById('BED-04');
    if (p.group === 'NEURO' && NEURO_CASE[b.neuro]) return M.caseById(NEURO_CASE[b.neuro]);
    return null;
  };
  /* The live request, read the same way for auto dispatch, manual dispatch, accept and visit start. */
  M.ctxOf = s => {
    const r = s.request, p = s.patient, rv = r.review, tpl = M.templateOf(s), svc = (SC.clinGroup(s) || {}).id, cleared = !!(rv && rv.cleared), labels = tpl ? labelsOf(tpl) : {};
    let block = '', code = '';
    const allow = (rv && rv.allow) || [];
    if (rv && !cleared) { code = 'REVIEW'; block = 'เคสนี้รอทีมคลินิกตรวจ'; }
    else if (r.status === 'ASSESS_HOLD') { code = 'ASSESS'; block = 'อนุมัติเฉพาะการประเมิน · พักการจับคู่อัตโนมัติ ทีมประสานเอง'; }
    else if (asksSuction(p) || allow.some(id => SC.CLIN.restricted.includes(id))) { code = 'RESTRICTED'; block = 'มีงานดูดเสมหะ · ไม่จับคู่อัตโนมัติ ทีมคลินิกประสานเอง'; }
    /* With a template, only its Required labels filter; an unlabelled task stays unknown, never required (handoff v2.3). Without one, the lead's approved list is all there is. */
    const essential = cleared ? allow.filter(id => tpl ? labels[id] === 'Required' : true) : tpl ? M.tasks(tpl).essential : svc && svc !== 'UNSURE' ? M.floor(svc) : [];
    /* Fail closed: an empty requirement list is not a pass. */
    if (!code && !essential.length) { code = 'NO_MAPPING'; block = 'ยังระบุงานที่เคสนี้จำเป็นไม่ได้ · ไม่จับคู่อัตโนมัติ ส่งให้ทีมตรวจ'; }
    if (!code && !r.paid && !['PAID', 'OFFERED', 'BOOKED'].includes(r.status)) { code = 'UNPAID'; block = 'ยังไม่ยืนยันการชำระเงิน'; }
    /* Conditional tasks travel with the offer as preparation information. After a review, only what the lead approved. */
    const prep = tpl ? M.tasks(tpl).conditional.filter(id => !cleared || allow.includes(id)) : [];
    /* Safety and resource gate, from the patient's answers. A PT passing every task doesn't lift it. */
    const b = p.branch || {}, need = [...(r.required || [])];
    if (p.group === 'BED' && b.lift === 'N2' && !['N2', 'HOIST'].includes(b.helpers) && (!cleared || allow.includes('C11'))) need.push('คนช่วยย้ายตัว 2 คน หรือเครื่องยก');
    if (p.group === 'ORTHO' && ['NO', 'UNSURE'].includes(b.gear)) need.push('อุปกรณ์ที่แพทย์สั่ง');
    const from = cleared ? `งานที่ทีมคลินิกอนุมัติ โดย ${rv.by || '—'}` : tpl ? `ต้นแบบ ${tpl.case_id}` : svc && svc !== 'UNSURE' ? `ขั้นต่ำของกลุ่มบริการ ${svc}` : 'ยังระบุกลุ่มบริการไม่ได้';
    return { code, block, essential, from, prep, template: tpl ? tpl.case_id : '', district: SC.patientDistrict(s), required: need, patientHas: r.patientHas || [], round: r.round || 0, group: svc };
  };
  const capCause = (p, id) => { const c = (p.caps || {})[id], d = (p.capDecisions || {})[id]; if (!c) return 'ยังไม่ตอบ'; if (c === 'no') return 'ตอบว่าทำไม่ได้'; if (d && d.status === 'PENDING') return 'รอทีมพิจารณา'; if (d && d.status === 'REJECTED') return 'ทีมไม่อนุมัติ'; if (c === 'ask') return 'ขอคุยก่อน'; return id[0] === 'S' ? 'ยังไม่ผ่านการอนุมัติ Specialty' : 'ยังไม่ผ่าน'; };
  /* Every step is recorded so the team can see all reasons. failedAt is the first in Palm's order. */
  M.evalPt = (pt, ctx, opt = {}) => {
    const round = opt.round !== undefined ? opt.round : ctx.round, cannot = ctx.essential.filter(id => !SC.capEligible(pt, id));
    const lack = ctx.required.filter(x => !ctx.patientHas.includes(x) && !(pt.equip || []).includes(x));
    const prepGaps = (ctx.prep || []).filter(id => !SC.capEligible(pt, id)), zoneOk = !!pt.zoneOk || (ctx.district && (pt.zones || []).includes(ctx.district)), near = round >= 30 && (pt.near || []).includes(ctx.district);
    const steps = [
      ['CASE', !ctx.code, ctx.block],
      ['LICENSE', pt.status === 'VERIFIED' && !pt.paused, pt.paused ? 'พักรับงานใหม่ชั่วคราว · รอทีมทบทวน' : 'ใบประกอบยังรอตรวจ · อนุมัติก่อนจึงส่งงานได้'],
      ['TERMS', !!pt.agreement, 'ยังไม่ยอมรับข้อตกลงการรับงาน'],
      ['CAPABILITY', !cannot.length, `ยังไม่ผ่านการพิจารณา: ${cannot.map(id => `${SC.CLIN.label(id)} (${capCause(pt, id)})`).join(' · ')}`],
      ['RESOURCE', !lack.length, `ขาด: ${lack.join(' · ')}`],
      ['LOCATION', zoneOk || near, `ไม่ได้ลงเขต ${ctx.district || '—'}`],
      ['AVAILABILITY', !!(pt.schedule && pt.schedule.sent), 'ยังไม่ส่งตาราง · ร่างตารางยังใช้จับคู่ไม่ได้']
    ].map(([key, ok, why]) => ({ key, ok, why: ok ? '' : why }));
    const first = steps.find(x => !x.ok);
    return { id: pt.id, name: pt.name, sample: !!pt.sample, eligible: !first, failedAt: first ? first.key : '', reason: first ? first.why : 'ผ่านทุกเงื่อนไข', cannot, prepGaps, steps, viaExpansion: !zoneOk && near, caps: ctx.essential.map(id => [id, (pt.caps || {})[id] || '', ((pt.capDecisions || {})[id] || {}).status || '']) };
  };
  M.adaptMe = s => Object.assign({}, s.pt, { id: 'me', name: (s.pt.displayName || 'นักกายภาพในห้องซ้อม'), zoneOk: SC.ptCovers(s.pt.zones || [], SC.patientDistrict(s)), paused: SC.ptPaused(s) });
  M.pool = s => [M.adaptMe(s), ...(s.matchPool || [])];
  M.nameOf = (s, id) => (M.pool(s).find(x => x.id === id) || {}).name;
  /* ---------- Decision trace (§2.3): who passed, who didn't and why, what was offered, who accepted, which booking and visit. ---------- */
  const now = () => new Date().toISOString();
  const trace = r => { r.trace = r.trace || { requestId: r.ref, ruleVersion: `${M.version} · ${M.validation}`, simRules: SC.RULES.version, evals: [], offers: [], events: [] }; return r.trace; };
  M.evaluate = (s, record = true) => {
    const r = s.request, ctx = M.ctxOf(s), results = M.pool(s).map(pt => M.evalPt(pt, ctx));
    if (record) { const t = trace(r); t.template = ctx.template; t.essential = ctx.essential; t.essentialFrom = ctx.from; t.prep = ctx.prep; t.screeningVersion = r.screeningVersion || 1; t.evals.push({ at: now(), round: ctx.round, gate: ctx.code || 'READY', results }); }
    return results;
  };
  M.logOffer = (s, to, how) => { const r = s.request; if (!r.offerId) SC.bumpOffer(r); trace(r).offers.push({ offerId: r.offerId, to: to.slice(), how, round: r.round || 0, at: now() }); };
  M.logEvent = (r, kind, data) => { trace(r).events.push(Object.assign({ kind, at: now() }, data)); };
  /* Pool mode: everyone who passes gets the offer. Without a pool the rehearsal's single-PT path stays as it was. */
  M.dispatch = (s, line) => {
    const r = s.request, ok = M.evaluate(s).filter(x => x.eligible).map(x => x.id), add = ok.filter(id => !(r.offerTo || []).includes(id));
    if (!add.length) return add;
    r.status = 'OFFERED'; r.offerTo = [...(r.offerTo || []), ...add]; r.auto = 'ผ่านทุกเงื่อนไข';
    M.logOffer(s, add, r.round ? `ขยายรอบ ${r.round} นาที` : 'อัตโนมัติ');
    if (add.includes('me') && line) line('pt', { key: 'ptOffer' });
    return add;
  };
  /* 30/90 minutes widen the area only. Clinical gates are the same function with a later round. */
  M.expand = (s, line) => { const r = s.request; if (!['PAID', 'OFFERED'].includes(r.status)) return []; r.round = (r.round || 0) >= 30 ? 90 : 30; return M.dispatch(s, line); };
  /* First accept wins. Recheck everything at the moment of accepting, never trust the card. */
  M.accept = (s, ptId, offerId, line) => {
    const r = s.request, fail = code => { M.logEvent(r, 'ACCEPT_REJECTED', { ptId, offerId, code }); return { ok: false, code }; };
    if (r.status === 'BOOKED') return fail('ALREADY_BOOKED');
    if (r.status !== 'OFFERED') return fail('NOT_OPEN');
    if (offerId && offerId !== r.offerId) return fail('STALE_OFFER');
    if (!(r.offerTo || []).includes(ptId)) return fail('NOT_OFFERED');
    const pt = M.pool(s).find(x => x.id === ptId), ev = pt && M.evalPt(pt, M.ctxOf(s));
    if (!ev || !ev.eligible) return fail(ev ? ev.failedAt : 'UNKNOWN_PT');
    M.book(s, ptId);
    if (line && ptId !== 'me') line('patient', { key: 'confirmed' });
    return { ok: true, bookingId: r.bookingId };
  };
  M.book = (s, ptId) => { const r = s.request; r.status = 'BOOKED'; r.bookedPt = ptId; r.bookingId = `${r.ref}-B1`; const t = trace(r); t.accept = { ptId, offerId: r.offerId, at: now() }; t.bookingId = r.bookingId; };
  const LABEL = id => esc(SC.CLIN.label(id));
  /* DR-01: what the PT should prepare for. Shown with the offer; it never decides eligibility. */
  M.prepCard = s => { if (!s.request) return ''; const c = M.ctxOf(s); return c.prep.length ? `<div class="card flat" data-offer-prep><span class="small">ข้อมูลเตรียมตัวก่อนพบผู้ป่วย</span><b style="display:block;font-size:14px">${c.prep.map(LABEL).join(' · ')}</b></div>` : ''; };
  /* ---------- Team view ---------- */
  M.traceCard = s => {
    const r = s.request; if (!r) return '';
    const ctx = M.ctxOf(s), results = M.evaluate(s, false), t = r.trace || { offers: [], events: [] }, demo = !!s.matchPool, open = r.status === 'OFFERED';
    const rows = results.map(x => `<details class="mt-pt ${x.eligible ? 'ok' : 'no'}" data-mt-pt="${esc(x.id)}"><summary><span class="grow"><b>${esc(x.name)}</b>${x.sample ? ` ${ui.sample()}` : ''}<small>${esc(x.eligible ? (x.viaExpansion ? 'ผ่านทุกเงื่อนไข · เข้ามาจากการขยายพื้นที่' : 'ผ่านทุกเงื่อนไข') : x.reason)}</small></span><span class="pill ${x.eligible ? '' : 'warn'}">${x.eligible ? 'ผ่าน' : `ไม่ผ่าน: ${STEPS[x.failedAt]}`}</span></summary>
      <ol class="mt-steps">${x.steps.map(st => `<li class="${st.ok ? 'y' : 'n'}">${I(st.ok ? 'check' : 'x')}<span>${STEPS[st.key]}${st.why ? ` · ${esc(st.why)}` : ''}</span></li>`).join('')}</ol>
      ${demo && open && x.id !== 'me' && (r.offerTo || []).includes(x.id) ? `<button class="btn sm ghost" data-act="matchSampleAccept" data-id="${esc(x.id)}">จำลองให้ PT นี้กดรับ</button>` : ''}</details>`).join('');
    const passed = results.filter(x => x.eligible).length;
    return `<article class="card flat mt-card" data-match-trace>
      <div class="row between wrap"><b class="h3">เหตุผลการจับคู่</b><span class="pill wait">กฎ ${esc(M.version)} · ยังไม่ผ่าน Clinical Validation</span></div>
      <p class="small" style="margin:0">เลขคำขอ ${esc(r.ref)} · คัดกรองฉบับที่ ${esc(r.screeningVersion || 1)} · ${esc(ctx.from)}${ctx.round ? ` · ขยายรอบ ${ctx.round} นาที` : ''}</p>
      <div class="mt-need"><span class="label">งานที่เคสนี้จำเป็น</span>${ctx.essential.length ? ctx.essential.map(id => `<span class="chip-s">${LABEL(id)}</span>`).join('') : '<span class="small">ยังระบุไม่ได้</span>'}</div>
      ${ctx.prep.length ? `<div class="mt-need" data-mt-prep><span class="label">ข้อมูลให้ PT เตรียมตัว ไม่ใช้ตัด PT</span>${ctx.prep.map(id => `<span class="chip-s">${LABEL(id)}</span>`).join('')}</div>` : ''}
      ${ctx.code ? `<p class="note warn" role="status" style="margin:0">${esc(ctx.block)}</p>` : ''}
      <span class="label">ผ่าน ${passed} จาก ${results.length} คน</span><div class="mt-pts">${rows}</div>
      ${t.offers.length ? `<div class="stack"><span class="label">ประวัติการส่งงาน</span>${t.offers.map(o => `<span class="small" data-mt-offer>${esc(o.offerId)} · ${esc(o.how)} · ${esc(o.to.map(id => M.nameOf(s, id) || id).join(', '))}</span>`).join('')}</div>` : ''}
      ${t.accept ? `<p class="small" style="margin:0" data-mt-booked>${esc(M.nameOf(s, t.accept.ptId) || t.accept.ptId)} รับงานจาก ${esc(t.accept.offerId)} · การจอง ${esc(t.bookingId)}${t.visitId ? ` · การเยี่ยม ${esc(t.visitId)}` : ''}</p>` : ''}
      ${(t.events || []).filter(e => e.kind === 'ACCEPT_REJECTED').map(e => `<p class="small" style="margin:0">ปฏิเสธการกดรับของ ${esc(M.nameOf(s, e.ptId) || e.ptId)}: ${esc(e.code)}</p>`).join('')}
      ${demo && ['PAID', 'OFFERED'].includes(r.status) && (r.round || 0) < 90 ? `<button class="btn sm ghost" data-act="matchExpand">จำลองครบ ${(r.round || 0) >= 30 ? 90 : 30} นาที</button>` : ''}
    </article>`;
  };
  SC.action('matchExpand', (s, c) => { const add = M.expand(s, c.line); c.toast(add.length ? `ส่งเพิ่ม ${add.length} คน` : 'ไม่มี PT ที่ผ่านเพิ่ม เงื่อนไขทางคลินิกยังเท่าเดิม'); });
  SC.action('matchSampleAccept', (s, c) => { const x = M.accept(s, c.data.id, s.request.offerId, c.line); c.toast(x.ok ? `รับงานแล้ว · ${x.bookingId}` : `รับไม่ได้: ${x.code}`); });
  /* ---------- Fixture: one patient, PTs who differ by one gate each. All samples, labelled on screen. ---------- */
  const fullCaps = () => { const c = {}; Object.keys(SC.CLIN.en).forEach(id => { if (id !== 'S06') c[id] = 'can'; }); return c; };
  const samplePt = (id, name, change = {}) => { const caps = Object.assign(fullCaps(), change.caps); return Object.assign({ id, name, sample: true, status: 'VERIFIED', agreement: true, zones: ['บางนา'], schedule: { sent: true }, equip: [], capDecisions: { S03: { status: 'APPROVED' } } }, change, { caps }); };
  M.fixturePool = () => [
    samplePt('t1', 'PT ตัวอย่าง ก · ผ่านครบ'),
    samplePt('t2', 'PT ตัวอย่าง ข · ไม่มี Conditional และ Optional', { caps: { C02: 'no', C06: 'no', C15: 'no', C17: 'no' } }),
    samplePt('t3', 'PT ตัวอย่าง ค · ทำ Transfer ไม่ได้', { caps: { C11: 'no' } }),
    samplePt('t4', 'PT ตัวอย่าง ง · รอพิจารณา Core', { capDecisions: { S03: { status: 'APPROVED' }, C04: { status: 'PENDING' } } }),
    samplePt('t5', 'PT ตัวอย่าง จ · Specialty ยังไม่อนุมัติ', { capDecisions: {} }),
    samplePt('t6', 'PT ตัวอย่าง ฉ · ใบประกอบรอตรวจ', { status: 'PENDING' }),
    samplePt('t7', 'PT ตัวอย่าง ช · ยังไม่รับข้อตกลง', { agreement: false }),
    samplePt('t8', 'PT ตัวอย่าง ซ · อยู่เขตข้างเคียง', { zones: ['พระโขนง'], near: ['บางนา'] }),
    samplePt('t9', 'PT ตัวอย่าง ฌ · ยังไม่ส่งตาราง', { schedule: { sent: false } })
  ];
  M.demo = () => {
    SC.reset(); SC.jump(4); const s = SC.s;
    Object.assign(s.patient, { name: 'คุณทดสอบ', legalName: 'ทดสอบ สมมติ', phone: '0800000000', bookingFor: 'SELF', goals: ['WALK'], goalOther: '', group: 'NEURO', branch: { neuro: 'STROKE' }, health: { q1: 'NO', q3: 'NO', q4: 'NO', q5: 'NO', q6: 'NO' }, bp: { unknown: true }, intakeStep: 8, chosenPt: null, address: Object.assign({}, s.patient.address, { district: 'บางนา' }) });
    SC.go('p.intake'); SC.fireAct('submitRequest');
    Object.assign(s.pt, { services: ['03'], zones: ['บางนา'], status: 'VERIFIED', agreement: true, photoApproved: true, caps: fullCaps(), capLog: [], capDecisions: { S03: { status: 'APPROVED', by: 'ปาล์ม (CEO)', at: SC.REVIEW_AT } } });
    s.pt.schedule = Object.assign({}, s.pt.schedule, { sent: true });
    s.matchPool = M.fixturePool();
    s.request.slip = 'sample'; SC.autoPay(s, SC.line);
    SC.go('a.match');
    return s;
  };
})();
