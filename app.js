/* SynaClair clickable rehearsal · engine: state, screens, actions, stages, LINE chat. Screens live in screens-*.js. */
(function () {
  'use strict';

  /* ---------- Shared facts (same as the real system) ---------- */
  const ZONES = [
    { code: 'Z01', name: 'กรุงเทพกลาง', districts: ['พระนคร', 'ดุสิต', 'ป้อมปราบศัตรูพ่าย', 'สัมพันธวงศ์', 'ดินแดง', 'ห้วยขวาง', 'พญาไท', 'ราชเทวี', 'วังทองหลาง'] },
    { code: 'Z02', name: 'กรุงเทพเหนือ', districts: ['จตุจักร', 'บางซื่อ', 'ลาดพร้าว', 'หลักสี่', 'ดอนเมือง', 'สายไหม', 'บางเขน'] },
    { code: 'Z03', name: 'กรุงเทพใต้', districts: ['ปทุมวัน', 'บางรัก', 'สาทร', 'บางคอแหลม', 'ยานนาวา', 'คลองเตย', 'วัฒนา', 'พระโขนง', 'สวนหลวง', 'บางนา'] },
    { code: 'Z04', name: 'กรุงเทพตะวันออก', districts: ['บางกะปิ', 'สะพานสูง', 'บึงกุ่ม', 'คันนายาว', 'ลาดกระบัง', 'มีนบุรี', 'หนองจอก', 'คลองสามวา', 'ประเวศ'] },
    { code: 'Z05', name: 'กรุงธนเหนือ', districts: ['ธนบุรี', 'คลองสาน', 'จอมทอง', 'บางกอกใหญ่', 'บางกอกน้อย', 'บางพลัด', 'ตลิ่งชัน', 'ทวีวัฒนา'] },
    { code: 'Z06', name: 'กรุงธนใต้', districts: ['ภาษีเจริญ', 'บางแค', 'หนองแขม', 'บางขุนเทียน', 'บางบอน', 'ราษฎร์บูรณะ', 'ทุ่งครุ'] }
  ];
  /* Sample PTs: clearly marked "ตัวอย่าง" on every screen. They are never offered work in the rehearsal. */
  const SAMPLE_PTS = [
    { id: 's1', license: '23418', tags: ['ผู้สูงอายุ', 'หลังผ่าตัด', 'ป้องกันล้ม'], name: 'กภ.ฝน ดูแลผู้สูงอายุ', initials: 'ฝ', hue: 32, zones: ['ประเวศ', 'บางนา'], bio: 'ดูแลผู้สูงอายุและหลังผ่าตัดที่บ้าน ใจเย็น อธิบายให้ญาติเข้าใจทุกครั้ง', rating: { average: 4.8, count: 12 }, cases: 20,
      post: { text: 'ป้องกันหกล้มในห้องน้ำ 3 จุดที่ควรติดราวจับ', video: 'https://youtu.be/example', image: 'elderly.jpg' }, quote: { text: 'แม่ลุกจากเตียงเองได้แล้ว คุณหมอใจเย็นมาก', area: 'ประเวศ', stars: 5 } },
    { id: 's2', license: '31207', tags: ['หลังผ่าตัด', 'กระดูกและข้อ'], name: 'PT วิชัย', initials: 'ว', hue: 150, zones: ['สวนหลวง', 'พระโขนง'], bio: 'ฟื้นฟูหลังผ่าตัดเข่าและสะโพก', rating: { average: 5, count: 4 }, cases: 6,
      post: { text: 'หลังผ่าตัดเข่า เดินแบบไหนปลอดภัย', image: 'post-surgery.jpg' }, quote: null },
    { id: 's3', license: '28845', tags: ['ออฟฟิศซินโดรม', 'กระดูกและข้อ'], name: 'กภ.มายด์ ออฟฟิศซินโดรม', initials: 'ม', hue: 200, zones: ['บางรัก', 'สาทร'], bio: 'ปวดคอ บ่า หลัง จากการทำงาน', rating: null, cases: 0,
      post: { text: 'ยืดคอ 30 วินาทีระหว่างประชุม', image: 'neck.jpg' }, quote: null },
    { id: 's4', license: '19962', tags: ['สโตรก', 'ฝึกเดิน'], name: 'กภ.ต้น ฟื้นฟูหลังสโตรก', initials: 'ต', hue: 12, zones: ['บางแค', 'ภาษีเจริญ'], bio: 'ฝึกเดินและใช้มือหลังสโตรกที่บ้าน', rating: null, cases: 0,
      post: { text: 'ฝึกหยิบของด้วยมือข้างที่อ่อนแรง', image: 'stroke.jpg' }, quote: null },
    { id: 's5', license: '35510', tags: ['ผู้สูงอายุ', 'ป้องกันล้ม'], name: 'PT ปุ้ย ดูแลผู้สูงอายุ', initials: 'ป', hue: 280, zones: ['จตุจักร', 'ลาดพร้าว'], bio: 'ทรงตัว ลุกเดิน ป้องกันล้ม', rating: null, cases: 0,
      post: { text: 'จัดบ้านให้ผู้สูงอายุเดินได้ปลอดภัย' }, quote: null },
    { id: 's6', license: '27731', tags: ['กระดูกและข้อ', 'หลังผ่าตัด'], name: 'กภ.เบียร์ กระดูกและข้อ', initials: 'บ', hue: 95, zones: ['ตลิ่งชัน', 'บางกอกน้อย'], bio: 'เข่า สะโพก ไหล่ ฟื้นฟูหลังผ่าตัด', rating: null, cases: 0,
      post: { text: 'ยกขาตรง 3 แบบหลังผ่าตัดเข่า' }, quote: null },
    { id: 's7', license: '33096', tags: ['ติดเตียง', 'ผู้สูงอายุ'], name: 'กภ.ฟ้า ฝั่งตะวันออก', initials: 'ฟ', hue: 175, zones: ['มีนบุรี', 'ลาดกระบัง'], bio: 'ผู้ป่วยติดเตียงและการจัดท่า', rating: null, cases: 0,
      post: { text: 'พลิกตะแคงตัวทุก 2 ชั่วโมง ทำยังไงให้ง่าย' }, quote: null },
    { id: 's8', license: '24480', tags: ['ปวดหลัง', 'กระดูกและข้อ'], name: 'PT นนท์ ปวดหลัง', initials: 'น', hue: 220, zones: ['ดุสิต', 'พญาไท'], bio: 'ปวดหลัง ปวดคอ และการยกของให้ถูกท่า', rating: null, cases: 0,
      post: { text: 'ยกของจากพื้นยังไงไม่ให้ปวดหลัง' }, quote: null }
  ];
  /* Certificate treatment list (Boss 29 Oct): broad headings only, picked from a dropdown, one bullet each. The detail stays in the SOAP note.
     Draft list for Boss and Palm to confirm. [key, ไทย, English] */
  const CERT_TX = [
    ['ther', 'การออกกำลังกายเพื่อการรักษา', 'Therapeutic exercise'],
    ['rom', 'การเคลื่อนไหวข้อ', 'Range of motion (ROM) exercise'],
    ['strength', 'การเพิ่มความแข็งแรงของกล้ามเนื้อ', 'Strengthening exercise'],
    ['stretch', 'การยืดเหยียดกล้ามเนื้อ', 'Stretching exercise'],
    ['func', 'การฝึกการเคลื่อนไหวในชีวิตประจำวัน', 'Functional training'],
    ['transfer', 'การฝึกลุก นั่ง ยืน และเคลื่อนย้ายตัว', 'Transfer training'],
    ['balance', 'การฝึกการทรงตัว', 'Balance training'],
    ['gait', 'การฝึกเดิน', 'Gait training'],
    ['neuro', 'การฟื้นฟูระบบประสาท', 'Neurological rehabilitation'],
    ['chest', 'การฝึกหายใจและกายภาพบำบัดทรวงอก', 'Breathing exercise and chest physiotherapy'],
    ['manual', 'การรักษาด้วยมือ (ขยับข้อต่อ)', 'Manual therapy (joint mobilization)'],
    ['soft', 'การคลายกล้ามเนื้อและเนื้อเยื่อ', 'Soft tissue mobilization'],
    ['us', 'อัลตราซาวด์เพื่อการรักษา', 'Therapeutic ultrasound'],
    ['estim', 'การกระตุ้นไฟฟ้า', 'Electrical stimulation (TENS / NMES)'],
    ['heat', 'การประคบร้อนหรือเย็น', 'Hot / cold therapy'],
    ['tape', 'การติดเทปเพื่อการรักษา', 'Therapeutic taping'],
    ['position', 'การจัดท่าและป้องกันแผลกดทับ', 'Positioning and pressure-injury prevention'],
    ['home', 'โปรแกรมออกกำลังกายที่บ้านและสอนผู้ดูแล', 'Home exercise program and caregiver education']
  ];
  const certTxText = (key, en, other) => { if (key === 'other') return other || ''; const t = CERT_TX.find(x => x[0] === key); return t ? t[en ? 2 : 1] : ''; };
  const TRIAL = 1599;  // พี่ปาล์ม's Final price sheet (Boss 29 Oct); was 1499
  // Blood pressure categories (AHA chart Boss sent, 23 Oct). sys/dia in mmHg; the higher category of the two wins.
  const BP_CATS = [
    { key: 'normal', label: 'ปกติ', tone: 'ok', note: 'ต่ำกว่า 120/80' },
    { key: 'elevated', label: 'สูงกว่าปกติเล็กน้อย', tone: 'ok', note: 'ตัวบน 120–129 และตัวล่างต่ำกว่า 80' },
    { key: 'stage1', label: 'ความดันสูง ระดับ 1', tone: 'wait', note: 'ตัวบน 130–139 หรือตัวล่าง 80–89' },
    { key: 'stage2', label: 'ความดันสูง ระดับ 2', tone: 'warn', note: 'ตัวบน 140 ขึ้นไป หรือตัวล่าง 90 ขึ้นไป · ทีมดูก่อนนัด' },
    { key: 'severe', label: 'ความดันสูงรุนแรง', tone: 'warn', note: 'เกิน 180 หรือตัวล่างเกิน 120 · ทีมโทรถามอาการก่อนนัด' }
  ];
  function bpCat(bp) {
    if (!bp || bp.unknown) return null; const sy = +bp.sys, di = +bp.dia; if (!(sy > 0 && di > 0)) return null;
    const i = sy > 180 || di > 120 ? 4 : sy >= 140 || di >= 90 ? 3 : sy >= 130 || di >= 80 ? 2 : sy >= 120 ? 1 : 0;
    return BP_CATS[i];
  }
  // The 7 review criteria (Boss's icon set, 21 Oct): key, name, icon number in a/rate-N.png.
  const RATE = [['pro', 'ความเป็นมืออาชีพ', 1], ['explain', 'อธิบายเข้าใจง่าย', 2], ['care', 'บริการด้วยความใส่ใจ', 3], ['ontime', 'ตรงต่อเวลา', 4], ['home', 'ประยุกต์ใช้กับที่บ้านได้ดี', 5], ['result', 'เห็นผลการรักษาชัดเจน', 6], ['advice', 'แนะนำการดูแลอย่างรอบด้าน', 7]];
  const VISIT1 = { date: 'เสาร์ 24 ต.ค. 2569', time: '09:00–10:30', short: 'ส. 24 ต.ค. 09:00' };
  const VISIT2 = { date: 'อังคาร 27 ต.ค. 2569', time: '09:00–10:00', short: 'อ. 27 ต.ค. 09:00' };
  const TODAY = 'พฤหัสบดี 22 ต.ค. 2569';

  /* ---------- State ---------- */
  const initial = () => ({
    pt: { status: 'NONE', loggedIn: false, legalName: '', license: '', licenseFile: null, displayName: '', zones: [], photo: null, photoApproved: false, bio: '',
      posts: [], schedule: { sent: false, blocks: [] },
      // Professional profile (Palm's "Design profile PT" Level 2). Sample values for the rehearsal; the PT fills these in the real profile builder.
      cv: { groups: ['ผู้สูงอายุ', 'ระบบประสาท เช่น Stroke', 'กระดูกและกล้ามเนื้อ'], primary: 'ฟื้นฟูผู้ป่วยหลอดเลือดสมอง (Stroke)', more: ['ผู้สูงอายุเสี่ยงล้ม', 'ฟื้นฟูหลังผ่าตัด'],
        edu: [], train: [] }, agreement: false, xp: 0, xpLog: [], earnings: [] },
    patient: { seenLoading: false, district: null, chosenPt: null, viewPt: null, name: '', legalName: '', phone: '', bookingFor: 'SELF', goals: [], goalOther: '',
      health: {}, barthel: {}, address: { province: 'กรุงเทพมหานคร', district: '', subdistrict: '', postal: '', line: '', pin: false },
      windows: [], consent: false, intakeStep: 0 },
    request: null,      /* { ref, status: SUBMITTED|PAYMENT_PENDING|PAID|OFFERED|BOOKED, preferredPt, offerTo:[], slip, check:{ ok, reasons, state: auto|open|ok|asked }, auto } */
    visits: [],         /* [{ n, date, time, step: 0 BOOKED|1 EN_ROUTE|2 ARRIVED|3 IN_PROGRESS|4 DONE, soap:{}, published, summary }] */
    review: null,       /* { stars, text, consent, needsContact, approved, hidden } */
    cert: { requested: false, lang: 'TH', issued: false, purpose: '', exam: null, dx: null, tx: [], txo: {} },
    renewal: null,      /* { progress, note, rec: renew|pervisit|stop, pack, sent, decided } (end of course) */
    pastCourses: [],
    course: null,       /* { sessions, bonus, perSession, total, code, paid, slip, approved, used, next, backups:[] } */
    chat: { patient: [{ from: 'team', text: 'สวัสดีค่ะ ทีม SynaClair ยินดีช่วยค่ะ ถามได้ทุกเรื่อง ตอบในเวลา 08:00–22:00' }] },
    suspicion: { reports: [] },
    line: { patient: [], pt: [], admin: [] },
    unread: { patient: 0, pt: 0, admin: 0 },
    passed: []
  });

  let s = load() || initial();
  const v = { device: {}, role: 'pt', at: { patient: 'p.loading', pt: 't.join', admin: 'a.queue' }, hist: { patient: [], pt: [], admin: [] }, params: {}, overlay: null, toast: null, panel: 'line', celebrate: null, wi: null, wiCase: null };
  try { const saved = JSON.parse(localStorage.getItem('sc-proto-view') || 'null'); if (saved) Object.assign(v, { role: saved.role, at: saved.at, hist: saved.hist, params: saved.params || {}, device: saved.device || {} }); } catch (e) { /* fresh view */ }

  function load() { try { return JSON.parse(localStorage.getItem('sc-proto-state') || 'null'); } catch (e) { return null; } }
  function persist() { try { localStorage.setItem('sc-proto-state', JSON.stringify(s)); localStorage.setItem('sc-proto-view', JSON.stringify({ role: v.role, at: v.at, hist: v.hist, params: v.params, device: v.device })); } catch (e) { /* storage blocked: rehearsal still works for this visit */ } }

  const get = (path, o = s) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  function set(path, value) { const ks = path.split('.'); let o = s; ks.slice(0, -1).forEach(k => { if (o[k] == null) o[k] = {}; o = o[k]; }); o[ks[ks.length - 1]] = value; }
  const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => '฿' + Math.round(n).toLocaleString('en-US');

  /* ---------- Screens and actions ---------- */
  const screens = {}, actions = {}, shellHooks = [];
  function screen(id, def) { screens[id] = def; }
  function action(name, fn) { actions[name] = fn; }
  function go(id, params) {
    const def = screens[id]; if (!def) { toast('หน้านี้ยังไม่มีในห้องซ้อม: ' + id); return; }
    const role = def.role;
    if (v.at[role] !== id) { v.hist[role].push(v.at[role]); if (v.hist[role].length > 40) v.hist[role].shift(); }
    if (id === 'p.feed' && !s.patient.welcomed) { s.patient.welcomed = true; line('patient', { key: 'welcome' }); }
    v.at[role] = id; v.role = role; if (params) v.params[id] = params; v.overlay = null; v.scrollTop = 0;
    render();
  }
  function back() { const r = v.role; const prev = v.hist[r].pop(); if (prev) { v.at[r] = prev; v.overlay = null; v.scrollTop = 0; render(); } }
  const param = (id) => v.params[id || v.at[v.role]] || {};
  function sheet(html) { v.overlay = { kind: 'sheet', html }; render(true); }
  function dialog(html) { v.overlay = { kind: 'dlg', html }; render(true); }
  function close() { v.overlay = null; render(true); }
  let toastTimer;
  function toast(text) { v.toast = text; clearTimeout(toastTimer); toastTimer = setTimeout(() => { v.toast = null; const el = document.querySelector('#dev .toast'); if (el) el.remove(); }, 2600); render(true); }
  /* XP reward: a gold pill pops with two soft rings, then flies into the XP pill, which glows and counts up (Boss: "ได้รับแล้ว" must be felt).
     The layer lives outside the screen markup so re-renders don't wipe it; the pill shows the old total until the reward lands. */
  let fx;
  function xp(points, reason) {
    if (v.xpShown == null) v.xpShown = s.pt.xp;
    s.pt.xp += points; s.pt.xpLog.unshift({ points, reason });
    const dev = document.getElementById('dev'); if (!dev) return;
    if (!fx) { fx = document.createElement('div'); fx.className = 'xp-fx'; fx.setAttribute('role', 'status'); }
    setTimeout(() => {
      dev.appendChild(fx);
      const el = document.createElement('div'); el.className = 'xp-pop';
      el.innerHTML = `<span class="xp-core"><i></i><i></i><b>${icon('sparkles')}+${points} XP</b></span><small>${esc(reason)} · ได้รับแล้ว</small>`;
      fx.appendChild(el); if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        const pill = dev.querySelector('.xp-pill'), core = el.querySelector('.xp-core');
        if (pill && core) { const a = pill.getBoundingClientRect(), b = core.getBoundingClientRect();
          el.style.setProperty('--dx', (a.left + a.width / 2 - b.left - b.width / 2) + 'px'); el.style.setProperty('--dy', (a.top + a.height / 2 - b.top - b.height / 2) + 'px'); }
        el.classList.add(pill ? 'fly' : 'out');
        setTimeout(() => { el.remove(); xpLand(); }, 520);
      }, 1150);
    }, 60);
  }
  function xpLand() {
    const from = v.xpShown; v.xpShown = null; if (from == null) return;
    const pill = document.querySelector('#dev .xp-pill'), n = pill && pill.querySelector('.xpn'); if (!n) return;
    pill.classList.remove('got'); void pill.offsetWidth; pill.classList.add('got');
    // The level bar and ring on the PT dashboard fill from the old value to the new one.
    document.querySelectorAll('#dev [data-to]').forEach(el => { if (el.tagName === 'circle') el.setAttribute('stroke-dashoffset', el.dataset.to); else el.style.width = el.dataset.to; });
    const to = s.pt.xp, t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 650); n.textContent = Math.round(from + (to - from) * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function line(role, card) { s.line[role].push(card); if (!(v.panel === 'line' && v.role === role)) s.unread[role] = (s.unread[role] || 0) + 1; }

  /* ---------- Small UI helpers shared by every screen file ---------- */
  const icon = (n, cls = '') => `<i data-lucide="${n}" class="${cls}"></i>`;
  const ui = {
    icon,
    bar: (title, o = {}) => `<header class="bar">${o.back === false ? (o.left || '<span style="width:8px"></span>') : `<button class="ib" data-back aria-label="ย้อนกลับ">${icon('chevron-left')}</button>`}<h1>${esc(title)}</h1>${o.right || '<span style="width:44px"></span>'}</header>`,
    tabs: (role, active) => {
      const sets = {
        patient: [['p.feed', 'house', 'หน้าแรก'], ['p.find', 'search', 'ค้นหา'], ['p.chat', 'life-buoy', 'ช่วยเหลือ'], ['p.me', 'user-round', 'ฉัน']],
        pt: [['t.work', 'briefcase-medical', 'งาน'], ['t.schedule', 'calendar-range', 'ตาราง'], ['t.earn', 'wallet', 'รายได้'], ['t.hub', 'user-round', 'หน้าของฉัน']]
      }[role];
      const badge = id => {
        if (id === 't.work') { const n = (s.request && s.request.status === 'OFFERED' ? 1 : 0); return n ? `<span class="dotn">${n}</span>` : ''; }
        if (id === 'p.me') { const n = s.visits.filter(x => x.step < 4).length; return n ? `<span class="dotn">${n}</span>` : ''; }
        return '';
      };
      return `<nav class="tabs" aria-label="เมนูหลัก">${sets.map(([id, ic, label]) => `<button data-go="${id}" class="${id === active ? 'on' : ''}" ${id === active ? 'aria-current="page"' : ''}>${icon(ic)}${label}${badge(id)}</button>`).join('')}</nav>`;
    },
    avatar: (name, photo, size = 56, hue) => photo
      ? `<span class="avatar" style="width:${size}px;height:${size}px"><img src="${esc(photo === 'sample' ? 'a/team-player.jpg' : photo)}" alt="รูป ${esc(name)}"></span>`
      : `<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .38)}px;${hue != null ? `background:hsl(${hue} 45% 88%);color:hsl(${hue} 45% 28%)` : ''}" aria-hidden="true">${esc((name || '?').replace(/^(กภ\.|PT|คุณ)\s*/, '').slice(0, 1))}</span>`,
    // Review criteria chips (Boss's icon set): small icon + name, used on admin, PT and patient screens.
    rateTags: (tags) => (tags || []).length ? `<span class="rt-tags">${tags.map(k => { const r = RATE.find(x => x[0] === k); return r ? `<span class="rt-tag"><img src="a/rate-${r[2]}.png" alt="">${esc(r[1])}</span>` : ''; }).join('')}</span>` : '',
    stars: (avg) => { const f = Math.round(avg); return `<span class="stars" aria-label="${avg} ดาว">${'★'.repeat(f)}<i>${'★'.repeat(5 - f)}</i></span>`; },
    money,
    esc,
    empty: (ic, title, text, cta = '') => `<div class="empty"><span class="tile">${icon(ic)}</span><b class="h3">${esc(title)}</b><p class="p">${esc(text)}</p>${cta}</div>`,
    sample: () => '<span class="sample">ตัวอย่าง</span>',
    xpPill: next => `<span class="xp-pill">${icon('sparkles')}<b class="xpn">${v.xpShown == null ? s.pt.xp : v.xpShown}</b>${next ? ` / ${next}` : ''} XP</span>`
  };

  /* ---------- What the rehearsal is: 13 levels, in the order things really happen ---------- */
  const me = () => ({ id: 'me', name: s.pt.displayName || 'นักกายภาพของคุณ', zones: s.pt.zones, bio: s.pt.bio, photo: s.pt.photo });
  const STAGES = [
    { n: 1, role: 'pt', title: 'นักกายภาพสมัครด้วย LINE', start: 't.join', done: () => s.pt.status !== 'NONE',
      guide: { 't.join': ['[data-go="t.line"]', 'กด "สมัครด้วย LINE"'], 't.line': ['[data-act="ptLogin"]', 'กด "อนุญาต" ในหน้าของ LINE'], 't.loading': ['', 'รอสักครู่ ระบบจะพาเข้าเอง'], 't.signup': ['[data-act="signNext"], [data-act="ptSignup"]', 'กรอกให้ครบ 4 ขั้น: ใบประกอบและสำเนา ประวัติการศึกษา ชื่อที่แสดง เขตที่รับงาน แล้วกด "สร้างโปรไฟล์"'] },
      complete() { Object.assign(s.pt, { loggedIn: true, status: 'PENDING', legalName: 'ณัฐพล ใจดี', license: '12345', displayName: 'กภ.บอส ดูแลถึงบ้าน', zones: ['บางนา', 'พระโขนง', 'สวนหลวง'], licenseFile: 'sample' }); s.pt.cv.edu = [['ปริญญาตรี สาขาวิชากายภาพบำบัด', 'มหาวิทยาลัยตัวอย่าง', 'คณะกายภาพบำบัด', 'sample']]; s.pt.xp += 60; s.pt.xpLog.unshift({ points: 60, reason: 'สร้างโปรไฟล์' }); } },
    { n: 2, role: 'pt', title: 'สร้างโปรไฟล์ระหว่างรอตรวจ', start: 't.hub', done: () => !!s.pt.photo && !!s.pt.bio && !!s.pt.schedule.sent,
      guide: { 't.hub': ['[data-tt-tip] [data-tt-go]', 'ทำตามคำแนะนำทีละอย่าง: ใส่รูป เขียนแนะนำตัว แล้วลงเวลาว่าง (บังคับ)'], 't.photo': ['[data-act="savePhoto"]', 'เลือกรูป แล้วกด "ใช้รูปนี้"'], 't.schedule': ['[data-act="sendSchedule"]', 'ลงเวลาว่าง (แนะนำสัปดาห์ละ 1 สล็อต) แล้วกด "ส่งตารางเดือนหน้า"'] },
      complete() { s.pt.photo = 'sample'; s.pt.bio = 'ดูแลผู้สูงอายุและผู้ป่วยหลังผ่าตัดที่บ้าน 6 ปี เน้นฝึกให้ลุกเดินเองได้'; s.pt.posts.unshift({ id: 'p1', text: 'ท่าลุกจากเก้าอี้ให้ปลอดภัย 3 ขั้น: เลื่อนตัวมาขอบเก้าอี้ โน้มตัวไปหน้า แล้วดันขาลุก', image: 'a/elderly.jpg', video: '' }); s.pt.schedule = { sent: true, blocks: [{ day: 5, week: 2, start: '09:00', end: '15:00', zone: s.pt.zones && s.pt.zones[0] || 'บางนา', repeat: false, sent: true }] }; s.pt.schedXp = true; s.pt.cv.edu = [['ปริญญาตรี สาขาวิชากายภาพบำบัด', 'มหาวิทยาลัยตัวอย่าง', 'คณะกายภาพบำบัด', 'sample']]; s.pt.cv.train = [['2567', 'ฟื้นฟูผู้ป่วย Stroke: ฝึกเดินและการทรงตัว', true]]; s.pt.xp += 130; s.pt.xpLog.unshift({ points: 130, reason: 'รูป แนะนำตัว โพสต์แรก ส่งตาราง' }); } },
    { n: 3, role: 'admin', title: 'แอดมินตรวจใบประกอบและรูป', start: 'a.queue', done: () => s.pt.status === 'VERIFIED',
      guide: { 'a.queue': ['[data-go="a.license"]', 'เปิดงาน "ตรวจใบประกอบ"'], 'a.license': ['[data-act="approvePt"]', 'เทียบเลขกับสภาฯ แล้วกด "อนุมัติ"'] },
      complete() { s.pt.status = 'VERIFIED'; s.pt.photoApproved = true; s.pt.xp += 50; s.pt.xpLog.unshift({ points: 50, reason: 'ใบประกอบได้รับการยืนยัน' }); line('pt', { key: 'ptVerified' }); } },
    { n: 4, role: 'patient', title: 'คนไข้เจอนักกายภาพในฟีด', start: 'p.loading', done: () => !!s.patient.chosenPt || s.patient.intakeStep > 0 || !!s.request,
      guide: { 'p.loading': ['', 'รอสักครู่ ระบบจะพาเข้าเอง'], 'p.feed': ['[data-act="openPt"][data-id="me"]', 'กดชื่อหรือรูปนักกายภาพของคุณในฟีด เพื่อเปิดโปรไฟล์'], 'p.pt': ['[data-act="choosePt"]', 'กด "ขอคนนี้"'] },
      complete() { s.patient.seenLoading = true; s.patient.welcomed = true; s.patient.district = 'บางนา'; s.patient.chosenPt = 'me'; line('patient', { key: 'welcome' }); } },
    { n: 5, role: 'patient', title: 'ประเมินอาการ', start: 'p.intake', done: () => !!s.request,
      guide: { 'p.intake': ['[data-act="intakeNext"], [data-act="submitRequest"]', 'ตอบทีละข้อ แล้วกด "ถัดไป" จนถึงสรุป'] },
      complete() { Object.assign(s.patient, { bp: { sys: '138', dia: '84', unknown: false }, legalName: 'สมใจ รักดี', name: 'คุณแม่สมใจ', phone: '0812345678', bookingFor: 'SOMEONE_ELSE', goals: ['WALK', 'PAIN'], address: { province: 'กรุงเทพมหานคร', district: 'บางนา', subdistrict: 'บางนาเหนือ', postal: '10260', line: '99/1 ซ.บางนา-ตราด 25', landmark: 'ตึกสีครีม ประตูรั้วสีเขียว ตรงข้ามร้านสะดวกซื้อ', pin: true }, windows: [VISIT1.short, 'ส. 24 ต.ค. 13:00', 'อา. 25 ต.ค. 09:00'], consent: true, intakeStep: 8 });
        s.request = { ref: 'SC-2610001', status: 'PAYMENT_PENDING', preferredPt: s.patient.chosenPt, offerTo: [], slip: null }; line('patient', { key: 'received' }); line('patient', { key: 'intakePay' }); } },
    { n: 6, role: 'patient', title: 'ชำระ ClairConnect Trial ฿1,599', start: 'p.result', done: () => !!s.request && ['SLIP_SENT', 'PAID', 'OFFERED', 'BOOKED'].includes(s.request.status),
      guide: { 'p.result': ['[data-go="p.pay"]', 'กดปุ่ม "ClairConnect Trial ฿1,599"'], 'p.pay': ['[data-act="sendSlip"]', 'แนบสลิป (ใช้สลิปตัวอย่างได้) แล้วกด "ส่งสลิป"'] },
      complete() { s.request.slip = 'sample'; SC.autoPay(s, line); } },
    { n: 7, role: 'admin', title: 'ระบบตรวจสลิปและจับคู่ให้เอง', start: 'a.queue', done: () => !!s.request && ['OFFERED', 'BOOKED'].includes(s.request.status),
      guide: { 'a.queue': ['[data-go="a.match"], [data-go="a.payments"]', 'ปกติระบบส่งงานให้ PT เองแล้ว แอดมินทำเฉพาะงานที่ขึ้นในคิว (สลิปผิดปกติ หรือหา PT ไม่ได้)'], 'a.payments': ['[data-act="confirmPayment"]', 'เช็กยอดในบัญชี แล้วกดปิดเรื่อง หรือแจ้งคนไข้'], 'a.match': ['[data-act="sendOffer"]', 'ถ้าคนไข้ขอ PT ไว้ ระบบติ๊กให้แล้ว ถ้าไม่ได้ขอ ติ๊กเลือก PT ที่แนะนำ แล้วกด "ส่งข้อเสนอ"'] },
      complete() { if (!['PAID', 'OFFERED', 'BOOKED'].includes(s.request.status)) { s.request.slip = 'sample'; SC.autoPay(s, line); } if (s.request.status === 'PAID') { s.request.status = 'OFFERED'; s.request.offerTo = ['me']; line('pt', { key: 'ptOffer' }); } } },
    { n: 8, role: 'pt', title: 'นักกายภาพรับงานแรก', start: 't.work', done: () => !!s.request && s.request.status === 'BOOKED',
      guide: { 't.work': ['[data-act="openOffer"]', 'เปิดงานเสนอใหม่'], 't.offer': ['[data-act="acceptOffer"]', 'กด "รับงานนี้"'], 't.agreement': ['[data-act="acceptAgreement"]', 'อ่านข้อตกลง ติ๊กยอมรับ แล้วกดยืนยัน (ครั้งเดียว)'] },
      complete() { s.pt.agreement = true; s.request.status = 'BOOKED'; s.visits = [{ n: 1, date: VISIT1.date, time: VISIT1.time, step: 0, soap: {}, published: false }]; line('patient', { key: 'ptIntro' }); line('patient', { key: 'confirmed' }); } },
    { n: 9, role: 'pt', title: 'วันทำเคสครั้งแรก', start: 't.work', done: () => !!(s.visits[0] && s.visits[0].step >= 4),
      guide: { 't.work': ['[data-tt-skip]', 'ซ้อมข้ามเวลา: 1 วันก่อนนัด → ยืนยันนัด → 1 ชม. ก่อนนัด → เริ่มเดินทาง'], 't.visit': ['[data-act="visitNext"]', 'กดทีละขั้น: เริ่มเดินทาง → ถึงแล้ว → เริ่มดูแล → จบการดูแล'] },
      complete() { const x = s.visits[0]; if ((x.remind || 0) < 3) { line('patient', { key: 'tomorrowPatient' }); line('pt', { key: 'ptTomorrow' }); line('pt', { key: 'ptUpcoming' }); } x.remind = 3; x.step = 4; line('patient', { key: 'enRoute' }); line('patient', { key: 'visitDone' }); line('patient', { key: 'feedback' }); } },
    { n: 10, role: 'pt', title: 'วางแผนการรักษากับคนไข้', start: 't.visit', done: () => !!((s.course && s.course.slip && s.course.next && s.course.notified) || (s.perVisit && s.perVisit.next)),
      guide: { 't.visit': ['[data-go="t.plan"]', 'กด "วางแผนการรักษากับคนไข้"'], 't.work': ['[data-go="t.plan"]', 'เปิดการ์ดคุยแผนการรักษากับคนไข้'], 't.plan': ['[data-act="planNext"], [data-act="coursePaid"], [data-act="bookNext"]', 'พิมพ์เป้าหมายที่คนไข้อยากได้ → ความถี่และวัน → เลือกคอร์ส → คนไข้สแกนจ่าย แล้วแจ้งแอดมิน → นัดครั้งที่ 2'] },
      complete() { s.coursePlan = { step: 6, goal: 'ลุกจากเก้าอี้และเดินในบ้านได้เองอย่างปลอดภัย', freq: 2, weeks: 5, full: 2000, pack: 10, code: false, price: null, bonus: 0, slip: 'sample', next: VISIT2.short, backups: ['ศ. 30 ต.ค. 09:00'] }; s.course = { sessions: 10, bonus: 0, perSession: 1479, fee: 2408, net: 14792, total: 17200, code: '', paid: false, slip: 'sample', approved: false, used: 1, next: VISIT2.short, backups: ['ศ. 30 ต.ค. 09:00'], notified: true }; line('admin', { key: 'paymentReviewCourse' }); } },
    { n: 11, role: 'pt', title: 'เขียน OPD ภายใน 2 ชม.', start: 't.work', done: () => !!(s.visits[0] && s.visits[0].published),
      guide: { 't.plan': ['[data-act="planDone"]', 'กด "เขียน OPD"'], 't.work': ['[data-go="t.opd"]', 'เปิดบันทึกที่ต้องส่ง'], 't.opd': ['[data-act="publishReport"]', 'เป้าหมายดึงมาจากแผนที่คุยกับคนไข้ เขียน OPD แล้วกด "ลงนามและส่งสรุป"'] },
      complete() { const x = s.visits[0]; x.published = true; x.soap = { goal: 'ลุกจากเก้าอี้และเดินในบ้านได้เองอย่างปลอดภัย', s: 'Low back pain when standing up, 6/10', o: 'Needs hands to push up from a chair; slow gait', t: ['Lumbar mobilization', 'Sit-to-stand training, 3 sets', 'Home exercise teaching'], p: 'ฝึกลุกจากเก้าอี้ 10 ครั้ง วันละ 2 รอบ มีคนยืนข้าง ๆ', dx: 'Low back pain with lower-limb weakness', family: 'ให้คุณแม่ฝึกลุกนั่งวันละ 2 รอบ มีคนยืนข้าง ๆ' }; line('patient', { key: 'report' }); } },
    { n: 12, role: 'patient', title: 'คนไข้อ่านสรุปและรีวิว', start: 'p.report', done: () => !!s.review,
      guide: { 'p.report': ['[data-go="p.review"]', 'อ่านสรุป แล้วกด "ให้คะแนน"'], 'p.review': ['[data-act="submitReview"]', 'ให้ดาว เขียนสั้น ๆ ติ๊กยินยอมให้แสดงบนเว็บ แล้วส่ง'] },
      complete() { s.review = { stars: 5, liked: ['pro', 'care', 'result'], improve: [], text: 'คุณหมอใจเย็นมาก แม่ลุกจากเก้าอี้เองได้แล้ว', consent: true, needsContact: false, approved: false, hidden: false }; s.cert.requested = true; s.cert.at = 'หลังครั้งแรก'; line('pt', { key: 'certRequest' }); } },
    { n: 13, role: 'admin', title: 'แอดมินตรวจเงินคอร์สและอนุมัติรีวิว', start: 'a.queue', done: () => !!(((s.course && s.course.approved) || s.perVisit) && s.review && (!s.review.consent || s.review.approved || s.review.hidden)),
      guide: { 'a.queue': ['[data-go="a.payments"], [data-go="a.reviews"]', 'ทำงานที่ค้าง: ตรวจเงินคอร์ส และรีวิวที่ขอแสดง'], 'a.payments': ['[data-act="confirmPayment"]', 'กด "ยืนยันรับเงินและเปิดสิทธิ์"'], 'a.reviews': ['[data-act="approveReview"]', 'อ่านข้อความ แล้วกด "อนุมัติให้แสดง"'] },
      complete() { if (s.course) { s.course.approved = true; s.course.paid = true; } if (s.review.consent) s.review.approved = true; if (!s.visits.find(x => x.n === 2)) s.visits.push({ n: 2, date: VISIT2.date, time: VISIT2.time, step: 0, soap: {}, published: false }); if (s.course) { line('patient', { key: 'courseReceipt' }); line('patient', { key: 'confirmedCourse' }); } } },
    { n: 14, role: 'pt', title: 'ครั้งที่ 2 (ตัดคอร์ส) และใบรับรอง', start: 't.work', done: () => s.cert.issued,
      guide: { 't.work': ['[data-act="openVisit"]', 'เปิดนัดครั้งที่ 2'], 't.visit': ['[data-act="visitNext"], [data-go="t.opd"]', 'ทำเคสทีละขั้นจนจบ'], 't.opd': ['[data-act="publishReport"]', 'เขียน SOAP ครั้งที่ 2 แล้วส่งสรุป'], 't.cert': ['[data-act="issueCert"]', 'ตรวจข้อความ เลือกการรักษาเป็นข้อ ๆ ลงนาม แล้วกด "ส่งให้คนไข้"'] },
      complete() { const x = s.visits[1]; if (x) { x.step = 4; x.published = true; } if (s.course) s.course.used = Math.max(s.course.used || 0, 2); if (!s.cert.tx.length) s.cert.tx = ['ther', 'func', 'home']; s.cert.issued = true; line('patient', { key: 'courseUsed', n: 2 }); line('patient', { key: 'report2' }); line('patient', { key: 'certReady' }); } },
    { n: 15, role: 'pt', title: 'ครบคอร์ส: สรุปผลและเสนอต่อคอร์ส', start: 't.work', done: () => !!(s.renewal && s.renewal.sent),
      guide: { 't.work': ['[data-act="courseSkipLast"], [data-act="openVisit"], [data-go="t.renew"]', 'ซ้อมข้ามเวลาไปครั้งสุดท้ายของคอร์ส → ทำเคสจนจบ (ระบบตัดคอร์สครั้งสุดท้าย) → สรุปจบคอร์ส'], 't.visit': ['[data-act="visitNext"]', 'กดจนจบการดูแล ระบบตัดคอร์สให้เอง'], 't.renew': ['[data-act="renewSend"]', 'เทียบผลกับเป้าหมาย เลือกคำแนะนำ แล้วส่งให้คนไข้'] },
      complete() { const c = s.course; if (c) c.used = c.sessions + (c.bonus || 0); s.renewal = { progress: 'part', note: 'ลุกจากเก้าอี้เองได้แล้ว เดินในบ้านมั่นคงขึ้น ยังต้องฝึกเดินนอกบ้านต่อ', rec: 'renew', pack: 5, next: 'อ. 8 ธ.ค. 09:00', sent: true }; line('patient', { key: 'courseUsed', n: c ? c.used : 10 }); line('patient', { key: 'renewOffer' }); } },
    { n: 16, role: 'patient', title: 'คนไข้เลือกต่อคอร์สหรือจบการรักษา', start: 'p.renew', done: () => !!(s.renewal && s.renewal.decided),
      guide: { 'p.renew': ['[data-act="renewPay"], [data-act="renewStop"]', 'อ่านผลเทียบเป้าหมาย แล้วเลือก: ต่อคอร์ส (สแกนจ่าย ระบบเปิดคอร์สใหม่เอง) หรือยังไม่ต่อ'] },
      complete() { if (!s.renewal) return; s.renewal.choice = s.renewal.choice || 'renew'; SC.renewDecide(s, line); } }
  ];
  const stageNow = () => STAGES.find(st => !st.done()) || null;

  function jumpTo(n) {
    s = initial();
    STAGES.filter(st => st.n < n).forEach(st => st.complete());
    s.passed = STAGES.filter(st => st.n < n).map(st => st.n);
    s.unread = { patient: 0, pt: 0, admin: 0 };
    const st = STAGES.find(x => x.n === n);
    v.hist = { patient: [], pt: [], admin: [] };
    v.at = { patient: s.patient.seenLoading ? 'p.feed' : 'p.loading', pt: s.pt.status === 'NONE' ? 't.join' : 't.hub', admin: 'a.queue' };
    v.celebrate = null; v.overlay = null; v.toast = null; v.caseRun = null;
    if (st) go(st.start); else render();
  }
  function reset() { s = initial(); v.at = { patient: 'p.loading', pt: 't.join', admin: 'a.queue' }; v.hist = { patient: [], pt: [], admin: [] }; v.params = {}; v.celebrate = null; go('t.join'); }

  /* ---------- LINE cards (rendered from the real Flex JSON in raw.json) ---------- */
  let RAW = {};
  const SIZE = { xxs: 10, xs: 11, sm: 12.5, md: 14, lg: 16, xl: 18, xxl: 21 }, PAD = { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16 };
  const px = (val, t) => val == null ? null : (val in t ? t[val] + 'px' : val);
  const ART = { 'request-received': 'line-request-received', welcome: 'line-welcome', 'payment-due': 'line-payment-due', 'payment-received': 'line-payment-received', 'pt-matched': 'line-pt-matched', 'appointment-confirmed': 'line-appointment-confirmed', 'appointment-reminder': 'line-appointment-reminder', 'pt-en-route': 'line-pt-en-route', 'report-ready': 'line-report-ready', feedback: 'line-feedback' };
  const art = url => { const m = /team-20261012-([a-z-]+)\.png/.exec(url || ''); return m && ART[m[1]] ? `a/${ART[m[1]]}.jpg` : ''; };
  function personal(text) {
    return String(text)
      .replace(/คุณแม่สมใจ/g, s.patient.name || 'คุณแม่สมใจ')
      .replace(/คุณบอส/g, s.pt.displayName || 'คุณบอส')
      .replace(/SC-2610-0099/g, (s.request && s.request.ref) || 'SC-2610001')
      .replace(/บางนา/g, s.patient.address.district || s.patient.district || 'บางนา')
      .replace(/เสาร์ 25 ต\.ค\./g, 'เสาร์ 24 ต.ค.').replace(/28 ต\.ค\./g, '27 ต.ค.').replace(/27 ต\.ค\. 09:00–10:30/g, '27 ต.ค. 09:00–10:00');
  }
  function fnode(c, parent, cardKey) {
    const st = []; const t = c.type;
    if (parent === 'horizontal') st.push(`flex:${c.flex ?? 1} 1 0;min-width:0`);
    if (c.margin) st.push(`margin-top:${px(c.margin, PAD)}`);
    if (t === 'text') { st.push(`font-size:${SIZE[c.size || 'md'] || 14}px`, `color:${c.color || '#111'}`); if (c.weight === 'bold') st.push('font-weight:600'); if (c.align) st.push(`text-align:${c.align}`); return `<div class="fx-t" style="${st.join(';')}">${esc(personal(c.text)).replace(/\n/g, '<br>')}</div>`; }
    if (t === 'button') { const style = c.style || 'link', col = c.color || '#00885F'; st.push(style === 'link' ? `background:transparent;color:${col}` : `background:${col};color:${style === 'primary' ? '#fff' : '#0b5c42'}`); return `<button class="fx-b" style="${st.join(';')}" data-card="${cardKey}" data-label="${esc(c.action.label)}">${esc(c.action.label)}</button>`; }
    if (t === 'image') return `<img class="fx-i" src="${art(c.url)}" alt="">`;
    if (t === 'separator') return '<div style="height:1px;background:#e6ece9;margin:6px 0"></div>';
    if (t === 'box') {
      const lay = c.layout || 'vertical'; st.push('display:flex;flex-direction:' + (lay === 'horizontal' || lay === 'baseline' ? 'row' : 'column'));
      if (c.spacing) st.push(`gap:${px(c.spacing, PAD)}`); if (c.paddingAll) st.push(`padding:${px(c.paddingAll, PAD)}`); if (c.paddingTop) st.push(`padding-top:${px(c.paddingTop, PAD)}`);
      if (c.backgroundColor) st.push(`background:${c.backgroundColor}`); if (c.cornerRadius) st.push(`border-radius:${px(c.cornerRadius, { sm: 4, md: 8, lg: 12, xl: 16 })}`);
      if (c.borderColor) st.push(`border:${c.borderWidth || '1px'} solid ${c.borderColor}`);
      return `<div style="${st.join(';')}">${(c.contents || []).map(k => fnode(k, lay, cardKey)).join('')}</div>`;
    }
    return '';
  }
  const fpart = (b, k, pad, key) => b[k] ? fnode(Object.assign({ paddingAll: pad + 'px' }, b[k]), 'vertical', key) : '';
  /* Cards the real templates do not cover yet (same look as premiumCard). */
  const CUSTOM = {
    ptVerified: () => simpleCard('ใบประกอบวิชาชีพ ตรวจสอบได้แล้ว', [`ยินดีด้วย ${s.pt.displayName || ''}`, 'ผู้รับบริการเห็นโปรไฟล์ของคุณแล้ว', '+50 XP'], 'ดูหน้าของฉัน', 'line-welcome'),
    certReady: () => simpleCard('ใบรับรองกายภาพบำบัดพร้อมแล้ว', ['ภาษาไทย และ English', `ออกโดย ${s.pt.displayName || 'นักกายภาพ'}`], 'เปิดใบรับรอง', 'line-report-ready'),
    teamReply: (m) => `<div class="fx-msg">${esc(m.text)}</div>`,
    // Patient asked for a certificate from My Care (Boss 29 Oct): the PT gets a task card.
    certRequest: () => simpleCard('คนไข้ขอใบรับรองกายภาพบำบัด', [`${s.patient.name || 'ผู้รับบริการ'} · ${s.cert.lang === 'EN' ? 'English' : 'ภาษาไทย'}${s.cert.purpose ? ' · ใช้' + s.cert.purpose : ''}`, 'ระบบเติมจาก OPD ให้ เลือกการรักษาเป็นข้อ ๆ แล้วลงนาม'], 'ทำใบรับรอง', 'line-report-ready'),
    // Course deduction (Boss 29 Oct): when the PT taps "จบการดูแล" the visit is cut from the course and the patient gets this slip, with the review button.
    courseUsed: (m) => { const c = s.course; if (!c) return ''; const total = c.sessions + (c.bonus || 0), left = Math.max(0, total - (m.n || c.used || 0));
      const row = (k, val) => `<div class="fx-t" style="font-size:12px;color:#0E7A55;margin-top:8px">${k}</div><div class="fx-t" style="font-size:15px;font-weight:600;color:#073D2C">${esc(val)}</div>`;
      return `<div class="fx-card"><div class="fx-body" style="padding:14px 14px 6px;background:#FFFEFB"><div class="fx-t" style="font-size:17px;font-weight:700;color:#073D2C">ใช้คอร์สครั้งที่ ${m.n} แล้ว</div>
        ${row('คอร์สที่เหลือ', left ? `เหลือ ${left} จาก ${total} ครั้ง` : `ครบ ${total} ครั้งแล้ว`)}${left === 2 ? row('ครั้งหน้า', 'นักกายภาพจะประเมินความก้าวหน้า และคุยแผนต่อกับคุณ') : ''}${!left ? row('ต่อไป', 'นักกายภาพจะส่งสรุปผลเทียบเป้าหมายให้คุณ') : ''}</div>
        <div class="fx-foot" style="padding:10px 14px 14px;display:grid;gap:6px"><button class="fx-b" style="background:#00885F;color:#fff" data-card="courseUsed">ดูคอร์สของฉัน</button>${s.review ? '' : `<button class="fx-b" style="background:#E7F5EF;color:#0b5c42" data-card="courseUsed:review">ให้คะแนนนักกายภาพ</button>`}</div></div>`; },
    renewOffer: () => simpleCard('ครบคอร์สแล้ว · สรุปผลจากนักกายภาพ', [`${s.pt.displayName || 'นักกายภาพ'} สรุปผลเทียบเป้าหมายให้แล้ว`, s.renewal && s.renewal.rec === 'renew' ? `แนะนำต่อคอร์ส ${s.renewal.pack} ครั้ง` : s.renewal && s.renewal.rec === 'pervisit' ? 'แนะนำนัดเป็นครั้งเมื่อจำเป็น' : 'จบการรักษาได้'], 'ดูสรุปและเลือก', 'line-report-ready'),
    // Rich menu "การดูแลของฉัน" (postback menu=my-care): the bot answers with this patient's own state.
    myCareLive: () => {
      const nv = s.visits.find(x => x.step < 4), c = s.course, left = c ? Math.max(0, c.sessions + (c.bonus || 0) - (c.used || 0)) : null;
      if (!s.request) return `<div class="fx-msg">ยังไม่มีนัดค่ะ เริ่มคัดกรองได้ที่ปุ่ม "หน้าของฉัน" ในเมนูด้านล่าง ใช้เวลาไม่ถึง 3 นาที</div>`;
      const row = (k, val) => `<div class="fx-t" style="font-size:12px;color:#0E7A55;margin-top:8px">${k}</div><div class="fx-t" style="font-size:15px;font-weight:600;color:#073D2C">${esc(val)}</div>`;
      return `<div class="fx-card"><div class="fx-body" style="padding:14px 14px 6px;background:#FFFEFB"><div class="fx-t" style="font-size:18px;font-weight:700;color:#073D2C">การดูแลของฉัน</div>
        ${row('นัดครั้งหน้า', nv ? `${nv.date} · ${nv.time}` : 'ยังไม่มีนัด')}${row('นักกายภาพ', s.request.ptId || s.visits.length ? (s.pt.displayName || 'นักกายภาพของคุณ') : 'ทีมกำลังหานักกายภาพให้')}${left !== null ? row('คอร์ส', `เหลือ ${left} ครั้ง`) : ''}</div>
        <div class="fx-foot" style="padding:10px 14px 14px;display:grid;gap:6px"><button class="fx-b" style="background:#00885F;color:#fff" data-card="myCareLive">ดูนัดของฉัน</button>${s.visits.length ? `<button class="fx-b" style="background:#E7F5EF;color:#0b5c42" data-card="myCare:cert">${s.cert.issued ? 'เปิดใบรับรองกายภาพ' : 'ขอใบรับรองกายภาพ'}</button>` : ''}</div></div>`;
    },
    ptIntro: () => ptIntroCard(),
    // Day-before confirmation (real: appointment.tomorrow.v1 goes to everyone on the appointment, 24 h before)
    tomorrowPatient: () => simpleCard('พรุ่งนี้มีนัดหมาย', [`${VISIT1.date} · ${VISIT1.time}`, `นักกายภาพ: ${s.pt.displayName || 'นักกายภาพของคุณ'}`, 'กรุณายืนยันภายใน 18:00 วันนี้'], 'ยืนยันนัด', 'appointment-reminder'),
    ptTomorrow: () => simpleCard('พรุ่งนี้มีนัด', [`${VISIT1.date} · ${VISIT1.time}`, `ผู้รับบริการ: ${s.patient.name || 'ผู้รับบริการ'}`, 'ยืนยันว่าไปได้ตามนัด ภายใน 18:00 วันนี้'], 'ยืนยันนัด', 'appointment-reminder')
  };
  // "Meet your PT" card (Palm's Level 1): who, licence checked, why this PT fits you, then the full profile.
  function ptIntroCard() {
    const p = s.pt, asked = s.request && s.request.preferredPt === 'me', cv = p.cv || {}, name = p.displayName || 'นักกายภาพของคุณ';
    const spec = [cv.primary && cv.primary.replace(/\s*\(.*\)$/, ''), ...(cv.more || [])].filter(Boolean);
    const why = [asked && 'คนที่คุณขอไว้', spec.length && 'ความเชี่ยวชาญตรงกับปัญหาคุณ', (p.zones || []).length && 'ให้บริการในพื้นที่คุณ'].filter(Boolean);
    return `<div class="fx-card fx-pt"><div class="fx-pthead">${asked ? 'นักกายภาพที่คุณขอ รับงานแล้ว' : 'ทีมเลือกนักกายภาพให้คุณแล้ว'}</div>
      <div class="fx-ptid"><span class="fx-ptav">${ui.avatar(name, p.photo, 64, 160)}<i>${icon('badge-check')}</i></span>
        <div><b>${esc(name)}</b><span>นักกายภาพบำบัดวิชาชีพ</span><em>${icon('shield-check')}ตรวจสอบโดย SynaClair</em><span>ใบอนุญาต ก. ${esc(p.license || '—')}</span></div></div>
      ${spec.length ? `<div class="fx-ptsec"><small>ความเชี่ยวชาญที่เกี่ยวข้องกับคุณ</small><div class="fx-ptchips">${spec.map(t => `<span>${esc(t)}</span>`).join('')}</div></div>` : ''}
      ${(p.zones || []).length ? `<div class="fx-ptsec"><small>พื้นที่ให้บริการ</small><p>${icon('map-pin')}${p.zones.map(esc).join(' · ')}</p></div>` : ''}
      <ul class="fx-ptwhy">${why.map(t => `<li>${icon('check')}${t}</li>`).join('')}</ul>
      <p class="fx-ptdate">${icon('calendar-days')}นัดแรก ${esc(VISIT1.short)}</p>
      <div class="fx-foot"><button class="fx-b" style="background:#00885F;color:#fff" data-card="ptIntro">ดูข้อมูลนักกายภาพเพิ่มเติม</button><button class="fx-b" style="background:#E7F5EF;color:#0b5c42" data-card="ptIntro:appts">ดูนัดของฉัน</button></div></div>`;
  }
  function simpleCard(title, lines, button, artKey) {
    return `<div class="fx-card"><img class="fx-hero" src="a/${artKey}.jpg" alt=""><div class="fx-body" style="padding:14px 14px 4px"><div class="fx-t" style="font-size:16px;font-weight:600;color:#004C38">${esc(title)}</div>${lines.map(l => `<div class="fx-t" style="font-size:13px;color:#42564F;margin-top:4px">${esc(l)}</div>`).join('')}</div><div class="fx-foot"><button class="fx-b" style="background:#00885F;color:#fff" data-card="${title}" data-label="${esc(button)}">${esc(button)}</button></div></div>`;
  }
  function card(m) {
    if (m.me) return `<div class="fx-msg fx-me">${esc(m.text)}</div>`;
    if (CUSTOM[m.key]) return CUSTOM[m.key](m);
    const r = RAW[m.key]; if (!r) return `<div class="fx-msg">${esc(m.text || m.key)}</div>`;
    if (r.type === 'text') return `<div class="fx-msg">${esc(personal(r.text))}</div>`;
    const b = r.contents; const hero = b.hero ? `<img class="fx-hero" src="${art(b.hero.url)}" alt="">` : '';
    return `<div class="fx-card">${hero}${fpart(b, 'header', 14, m.key)}<div class="fx-body">${fpart(b, 'body', 14, m.key)}</div><div class="fx-foot">${fpart(b, 'footer', 10, m.key)}</div></div>`;
  }
  /* LINE buttons that answer in the chat run an action instead of opening a page. */
  const CARD_ACT = { 'พรุ่งนี้มีนัด': 'ptConfirmTomorrow', ptIntro: 'openMatchedPt' };
  /* Where a LINE button lands (the LIFF page it opens). */
  const CARD_TARGET = {
    welcome: 'p.feed', received: 'p.paywait', intakePay: 'p.pay', invoiceOpen: 'p.pay', receipt: 'p.paywait', intakeMatching: 'p.paywait', ptAccepted: 'p.appts', confirmed: 'p.appts', tomorrow: 'p.appts',
    enRoute: 'p.appts', visitDone: 'p.appts', report: 'p.report', report2: 'p.report', feedback: 'p.review', courseProposal: 'p.course', courseReceipt: 'p.course', courseFollowup: 'p.course', confirmedCourse: 'p.appts', myCare: 'p.me', myCareLive: 'p.appts',
    ptOffer: 't.work', ptUpcoming: 't.visit', travelStarted: 't.work', paymentReview: 'a.payments', paymentReviewCourse: 'a.payments',
    'ใบประกอบวิชาชีพ ตรวจสอบได้แล้ว': 't.hub', 'พรุ่งนี้มีนัดหมาย': 'p.appts', 'ptIntro:appts': 'p.appts', 'ใบรับรองกายภาพบำบัดพร้อมแล้ว': 'p.cert',
    'myCare:cert': 'p.certreq', 'คนไข้ขอใบรับรองกายภาพบำบัด': 't.cert', courseUsed: 'p.course', 'courseUsed:review': 'p.review', 'ครบคอร์สแล้ว · สรุปผลจากนักกายภาพ': 'p.renew'
  };

  /* ---------- LINE rich menus (v3.1, docs/design/rich-menu) ----------
     Tap areas follow the 2500×1686 image: logo band on top (no action), a big left card, then the right half as 1 or 2 columns × 2 rows.
     Each area does what the real menu does: open a LIFF page (go), send a text (say), or ask the bot (postback). */
  const RM_ROWS = [400 / 1686, 1043 / 1686, 1];
  const RICH = {
    patient: { img: 'a/rm-patient.jpg', label: 'เมนูคนไข้', areas: [
      { x: 0, y: 0, w: .5, h: 2, name: 'การดูแลของฉัน', post: 'my-care' },
      { x: .5, y: 0, w: .5, h: 1, name: 'คุยกับทีม', say: 'ติดต่อทีม' },
      { x: .5, y: 1, w: .5, h: 1, name: 'หน้าของฉัน', go: 'p.feed' }] },
    pt: { img: 'a/rm-pt.jpg', label: 'เมนูนักกายภาพ', areas: [
      { x: 0, y: 0, w: .5, h: 2, name: 'หน้าของฉัน', go: 't.hub' },
      { x: .5, y: 0, w: .25, h: 1, name: 'ข้อเสนองาน', go: 't.work' },
      { x: .75, y: 0, w: .25, h: 1, name: 'ตารางรับงาน', go: 't.schedule' },
      { x: .5, y: 1, w: .25, h: 1, name: 'โพสต์ใหม่', go: 't.hub', act: 'compose' },
      { x: .75, y: 1, w: .25, h: 1, name: 'คุยกับทีม', say: 'ติดต่อทีม' }] },
    admin: { img: 'a/rm-admin.jpg', label: 'เมนูแอดมิน', areas: [
      { x: 0, y: 0, w: .5, h: 2, name: 'งานรอทำ', go: 'a.queue' },
      { x: .5, y: 0, w: .25, h: 1, name: 'ตรวจเงิน', go: 'a.payments' },
      { x: .75, y: 0, w: .25, h: 1, name: 'จับคู่ PT', go: 'a.match' },
      { x: .5, y: 1, w: .25, h: 1, name: 'นัดหมาย', go: 'a.appts' },
      { x: .75, y: 1, w: .25, h: 1, name: 'ใบประกอบ PT', go: 'a.license' }] }
  };
  function richMenuHtml() {
    const m = RICH[v.role]; if (!m) return '';
    const open = v.rmOpen !== false;
    const areas = m.areas.map((a, i) => { const top = RM_ROWS[a.y], bot = RM_ROWS[a.y + a.h]; return `<button class="rm-hit" data-rm="${i}" aria-label="${esc(a.name)}" style="left:${a.x * 100}%;width:${a.w * 100}%;top:${top * 100}%;height:${(bot - top) * 100}%"></button>`; }).join('');
    return `${open ? `<div class="rm-img"><img src="${m.img}" alt="${esc(m.label)}">${areas}</div>` : ''}<button class="rm-bar" data-rm-toggle aria-expanded="${open}"><span>${icon('keyboard')}</span><b>${esc(m.label)} ${icon(open ? 'chevron-down' : 'chevron-up')}</b></button>`;
  }
  function richTap(i) {
    const a = RICH[v.role].areas[i], role = v.role;
    if (a.say) { line(role, { me: true, text: a.say }); line(role, { key: 'teamReply', text: 'ทีม SynaClair รับเรื่องแล้ว พิมพ์คำถามในแชตนี้ได้เลย ทีมตอบทุกวัน 08:00–22:00' }); render(true); return; }
    if (a.post === 'my-care') { line(role, { key: 'myCareLive' }); render(true); return; }
    document.body.classList.remove('line-open'); go(a.go);
    if (a.act) runAct(a.act, { dataset: {} });
  }

  /* ---------- Shell ---------- */
  const ROLE = { patient: { label: 'คนไข้', icon: 'heart-handshake', device: 'phone' }, pt: { label: 'นักกายภาพ', icon: 'stethoscope', device: 'phone' }, admin: { label: 'แอดมิน', icon: 'layout-dashboard', device: 'desktop' } };
  let lastKey = '', lastOv = null, lastToast = null, scrT = 0, ovT = 0, toastT = 0;
  function render(keepScroll) {
    const dev = document.getElementById('dev'); if (!dev) return;
    const scroller = dev.querySelector('.dev-scroll');
    const key = v.role + ':' + v.at[v.role];
    const top = keepScroll || key === lastKey ? (scroller ? scroller.scrollTop : 0) : 0;
    const id = v.at[v.role]; const def = screens[id];
    let html;
    try { html = def ? def.render(s, { param: param(id), me: me() }) : `<div class="scr"><div class="body">${ui.empty('construction', 'กำลังสร้างหน้านี้', id)}</div></div>`; }
    catch (e) { console.error(e); html = `<div class="scr"><div class="body">${ui.empty('triangle-alert', 'หน้านี้แสดงไม่ได้', String(e.message))}</div></div>`; }
    const ohtml = v.overlay ? (typeof v.overlay.html === 'function' ? v.overlay.html(s) : v.overlay.html) : '';
    const overlay = v.overlay ? (v.overlay.kind === 'sheet' ? `<div class="sheet-bg" data-close><div class="sheet" role="dialog" aria-modal="true"><span class="grab"></span>${ohtml}</div></div>` : `<div class="dlg" data-close><div role="dialog" aria-modal="true">${ohtml}</div></div>`) : '';
    const device = v.device[v.role] || ROLE[v.role].device;
    dev.className = 'dev dev-' + device;
    dev.dataset.url = v.role === 'admin' ? 'admin.synaclair.com' : v.role === 'pt' ? 'synaclair.com/pt' : 'synaclair.com';
    // Live inputs re-render on every keystroke: keep focus and caret on the same field.
    const ae = document.activeElement, keep = ae && dev.contains(ae) && ae.dataset && ae.dataset.bind ? { b: ae.dataset.bind, a: ae.selectionStart, z: ae.selectionEnd } : null;
    dev.innerHTML = `<div class="dev-scroll">${html}</div>${overlay}${v.toast ? `<div class="toast" role="status">${icon('circle-check')}${esc(v.toast)}</div>` : ''}`;
    const sc2 = dev.querySelector('.dev-scroll'); sc2.scrollTop = top; lastKey = key;
    if (keep) { const el = dev.querySelector(`[data-bind="${keep.b}"]`); if (el && el.type !== 'checkbox' && el.type !== 'radio') { el.focus({ preventScroll: true }); try { if (keep.a !== null) el.setSelectionRange(keep.a, keep.z); } catch (e) { } } }
    if (def && def.mount) try { def.mount(dev, s); } catch (e) { console.error(e); }
    settle(dev, key);
    if (fx && fx.childElementCount) dev.appendChild(fx);
    refreshNeeds(dev);
    renderShell();
    if (window.lucide) window.lucide.createIcons();
    highlight();
    persist();
  }
  /* Every render rebuilds the DOM, which would replay entrance motion on each chip tap and make the page look like it reloaded (Boss 21 Oct).
     Fast-forward one-shot CSS animations by the time since that page, sheet or toast first appeared, so motion plays once and continues seamlessly. */
  function settle(dev, key) {
    const now = performance.now();
    if (key !== lastKey || !scrT) scrT = now;
    if (v.overlay !== lastOv) ovT = now;
    if (v.toast !== lastToast) toastT = now;
    lastOv = v.overlay; lastToast = v.toast;
    dev.getAnimations({ subtree: true }).forEach(a => {
      const el = a.effect && a.effect.target; if (!el || !a.animationName) return;
      const t = a.effect.getTiming(); if (t.iterations === Infinity || el.closest('[data-keep-anim], .xp-fx')) return;
      const t0 = el.closest('.sheet-bg, .dlg') ? ovT : el.closest('.toast') ? toastT : scrT;
      a.currentTime = (a.currentTime || 0) + (now - t0);
    });
  }
  function refreshNeeds(root) {
    root.querySelectorAll('[data-need]').forEach(btn => {
      const ok = btn.dataset.need.split(',').every(p => { const val = get(p.trim()); return Array.isArray(val) ? val.length > 0 : !!(val && String(val).trim()); });
      btn.disabled = !ok; btn.classList.toggle('off', !ok);
    });
  }
  function highlight() {
    document.querySelectorAll('.sc-pulse').forEach(el => el.classList.remove('sc-pulse'));
    const st = stageNow(); if (!st || st.role !== v.role || v.overlay) return;
    const g = st.guide[v.at[v.role]]; if (!g || !g[0]) return;
    const el = document.querySelector('#dev ' + g[0].split(',').map(x => x.trim()).join(', #dev '));
    if (el) el.classList.add('sc-pulse');
  }
  function stageOfRole(st) { return ROLE[st.role].label; }
  function renderShell() {
    const st = stageNow();
    STAGES.forEach(x => { if (x.done() && !s.passed.includes(x.n)) { s.passed.push(x.n); v.celebrate = x.n; } });
    const doneCount = STAGES.filter(x => x.done()).length;
    // Level rail
    const rail = document.getElementById('rail');
    rail.innerHTML = `<div class="rail-head"><b>ด่านซ้อม</b><span>${doneCount}/${STAGES.length}</span></div><div class="progress"><i style="width:${doneCount / STAGES.length * 100}%"></i></div>
      <ol class="levels">${STAGES.map(x => { const k = wiOf(x.n).length; return `<li class="${v.wi === x.n ? 'wi-on' : ''}"><button class="lv ${x.done() ? 'done' : ''} ${st && st.n === x.n ? 'now' : ''} r-${x.role}" data-jump="${x.n}"><span class="lv-n">${x.done() ? icon('check') : x.n}</span><span class="lv-t"><b>${esc(x.title)}</b><small>${stageOfRole(x)}</small></span></button>${k ? `<button class="wi-chip" data-wi="${x.n}" aria-expanded="${v.wi === x.n}" aria-label="ด่าน ${x.n} มี ${k} กรณีแยก">${icon('git-branch')}${k}</button>` : ''}
        ${v.wi === x.n ? `<div class="wi-drop">${wiOf(x.n).map((c, i) => `<button class="wi-row ${v.wiCase === i ? 'on' : ''}" data-wi-case="${i}"><i class="${c.status === 'ตกลงแล้ว' ? 'ok' : 'wait'}"></i>${esc(c.title)}</button>`).join('')}</div>` : ''}</li>`; }).join('')}</ol>
      <div class="rail-foot"><button class="btn sm ghost" data-reset>${icon('rotate-ccw')}เริ่มใหม่ทั้งหมด</button></div>`;
    renderWhatIf();
    // Mini level bar (phones)
    const lineBtn = `<button class="mini-line" data-open-line aria-label="เปิดแชต LINE">LINE${s.unread[v.role] ? `<span>${s.unread[v.role]}</span>` : ''}</button>`;
    document.getElementById('minibar').innerHTML = (st ? `<button data-open-levels><span class="lv-n r-${st.role}">${st.n}</span><span class="grow"><b>ด่าน ${st.n}/${STAGES.length} · ${esc(st.title)}</b><small>${stageOfRole(st)}</small></span>${icon('chevrons-up-down')}</button>` : `<button data-open-levels><span class="lv-n done">${icon('check')}</span><span class="grow"><b>ซ้อมครบทุกด่านแล้ว</b><small>กดเพื่อเลือกด่าน</small></span></button>`) + lineBtn;
    // Device switch (phone / iPad / computer) for the role on screen
    const curDev = v.device[v.role] || ROLE[v.role].device;
    document.getElementById('devsw').innerHTML = [['phone', 'smartphone', 'มือถือ'], ['tablet', 'tablet', 'iPad'], ['desktop', 'monitor', 'คอม']].map(([k, ic, label]) => `<button class="${curDev === k ? 'on' : ''}" data-device="${k}" aria-pressed="${curDev === k}">${icon(ic)}${label}</button>`).join('');
    // Role switch
    document.getElementById('roles').innerHTML = Object.entries(ROLE).map(([r, d]) => `<button class="${v.role === r ? 'on' : ''}" data-role="${r}">${icon(d.icon)}${d.label}${s.unread[r] ? `<span class="dotn">${s.unread[r]}</span>` : ''}</button>`).join('');
    // Guide
    const guide = document.getElementById('guide');
    if (v.celebrate) {
      const nx = stageNow();
      guide.innerHTML = `<div class="g-pass"><button class="g-lv g-icon" data-open-levels aria-label="เลือกด่าน">${icon('party-popper')}</button><div class="grow"><b>ผ่านด่าน ${v.celebrate} แล้ว</b><small>${nx ? `ต่อไป: ด่าน ${nx.n} ${esc(nx.title)} (${stageOfRole(nx)})` : 'ซ้อมครบทั้งวงจรแล้ว'}</small></div>${nx ? `<button class="btn sm" data-next>ไปด่านต่อไป ${icon('arrow-right')}</button>` : `<button class="btn sm" data-dismiss>ดูต่อ</button>`}${lineBtn}</div>`;
    } else if (st) {
      const g = st.guide[v.at[v.role]];
      const wrongRole = st.role !== v.role;
      guide.innerHTML = `<div class="g-now r-${st.role}"><button class="lv-n g-lv" data-open-levels aria-label="เลือกด่าน (ตอนนี้ด่าน ${st.n} จาก ${STAGES.length})">${st.n}</button><div class="grow"><b><span class="g-count">ด่าน ${st.n}/${STAGES.length} · </span>${esc(st.title)}</b><small>${wrongRole ? `ด่านนี้เป็นของ${stageOfRole(st)}` : g ? esc(g[1]) : 'ลองกดดูได้ทุกปุ่ม หรือกลับไปหน้าที่ด่านนี้ใช้'}</small></div>${wrongRole ? `<button class="btn sm" data-role="${st.role}">สลับเป็น${stageOfRole(st)}</button>` : !g ? `<button class="btn sm ghost" data-gostart>ไปหน้าของด่านนี้</button>` : ''}${lineBtn}</div>`;
    } else guide.innerHTML = `<div class="g-pass"><button class="g-lv g-icon" data-open-levels aria-label="เลือกด่าน">${icon('trophy')}</button><div class="grow"><b>ซ้อมครบทั้ง ${STAGES.length} ด่าน</b><small>เปิดหน้าแรกคนไข้เพื่อดูรีวิวที่ขึ้นเว็บ หรือกดดูทุกหน้าได้อิสระ</small></div><button class="btn sm" data-gofeed>ดูหน้าแรก</button>${lineBtn}</div>`;
    if (v.caseRun) guide.insertAdjacentHTML('afterbegin', `<div class="g-case">${icon('git-branch')}<span>กำลังซ้อมกรณี: <b>${esc(v.caseRun)}</b></span><button class="ib" data-case-end aria-label="จบการซ้อมกรณีนี้">${icon('x')}</button></div>`);
    // LINE panel
    const chat = s.line[v.role] || [];
    document.getElementById('lineHead').innerHTML = `<img src="a/synaclair-icon.svg" alt="" width="28" height="28"><div class="grow"><b>SynaClair</b><small>LINE ของ${ROLE[v.role].label} · ห้องซ้อม ไม่ส่งจริง</small></div><button class="line-x" data-open-line aria-label="ปิดแชต LINE">${icon('x')}</button>`;
    document.getElementById('lineBody').innerHTML = chat.length ? chat.map(m => `<div class="msg${m.me ? ' me' : ''}">${card(m)}</div>`).join('') : `<p class="line-empty">ยังไม่มีข้อความถึง${ROLE[v.role].label}<br>ทำตามด่านแล้วการ์ดจะเด้งมาที่นี่</p>`;
    const lb = document.getElementById('lineBody'); lb.scrollTop = lb.scrollHeight;
    document.getElementById('lineMenu').innerHTML = richMenuHtml();
    document.getElementById('lineBadge').textContent = s.unread[v.role] ? s.unread[v.role] : '';
    document.body.dataset.scRole = v.role;
    document.body.dataset.scWide = v.role !== 'admin' && ['tablet', 'desktop'].includes(v.device[v.role]) ? '1' : '';
    shellHooks.forEach(fn => { try { fn(s, v, stageNow()); } catch (e) { console.error(e); } });
  }

  /* ---------- Events ---------- */
  function onClick(e) {
    const t = e.target.closest('button, a, [data-go], [data-act], [data-close], [data-jump], [data-role], [data-card], [data-toggle], [data-pick], [data-device], [data-wi]');
    if (!t) return;
    if (t.matches('[data-close]') && (t.tagName === 'BUTTON' || e.target === t)) { close(); return; }
    if (t.dataset.jump) { const n = +t.dataset.jump; if (STAGES.find(x => x.n === n).done() || n === (stageNow() || {}).n) { const st = STAGES.find(x => x.n === n); go(st.start); closeLevels(); return; } confirmJump(n); return; }
    if (t.hasAttribute('data-reset')) { confirmReset(); return; }
    if (t.dataset.device && !t.closest('#dev')) { v.device[v.role] = t.dataset.device; render(); return; }
    if (t.dataset.role && !t.closest('#dev')) { v.role = t.dataset.role; s.unread[v.role] = 0; v.overlay = null; render(); return; }
    if (t.hasAttribute('data-next')) { v.celebrate = null; const nx = stageNow(); if (nx) { s.unread[nx.role] = 0; go(nx.start); } else render(); return; }
    if (t.hasAttribute('data-dismiss')) { v.celebrate = null; render(true); return; }
    if (t.hasAttribute('data-gostart')) { const st = stageNow(); if (st) go(st.start); return; }
    if (t.hasAttribute('data-gofeed')) { go('p.feed'); return; }
    if (t.hasAttribute('data-open-levels')) { document.body.classList.toggle('levels-open'); return; }
    if (t.hasAttribute('data-open-line')) { document.body.classList.toggle('line-open'); s.unread[v.role] = 0; renderShell(); return; }
    if (t.dataset.wi) { const n = +t.dataset.wi; v.wi = v.wi === n ? null : n; v.wiCase = null; renderShell(); if (v.wi && t.closest('#flow')) document.getElementById('whatif').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (t.dataset.wiCase !== undefined) { v.wiCase = +t.dataset.wiCase; renderShell(); const c = document.querySelector('#whatif .wi-br.on'); if (c) { closeLevels(); c.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return; }
    if (t.hasAttribute('data-wi-close')) { v.wi = null; v.wiCase = null; renderShell(); return; }
    if (t.hasAttribute('data-case-end')) { v.caseRun = null; renderShell(); return; }
    if (t.dataset.wiPlay) { const f = PLAY[t.dataset.wiPlay]; if (f) { v.wi = null; v.wiCase = null; closeLevels(); f(); } return; }
    if (t.dataset.rm !== undefined) { richTap(+t.dataset.rm); return; }
    if (t.hasAttribute('data-rm-toggle')) { v.rmOpen = v.rmOpen === false; renderShell(); return; }
    if (t.dataset.card !== undefined && t.closest('#lineBody')) { const target = CARD_TARGET[t.dataset.card]; document.body.classList.remove('line-open'); if (CARD_ACT[t.dataset.card]) runAct(CARD_ACT[t.dataset.card], t); else if (target) go(target); else toast('ปุ่มนี้ตอบกลับในแชต'); return; }
    if (!t.closest('#dev')) return;
    if (t.hasAttribute('data-back')) { e.preventDefault(); back(); return; }
    if (t.dataset.toggle) { const arr = (get(t.dataset.toggle) || []).slice(); const val = t.dataset.value; const i = arr.indexOf(val); if (i >= 0) arr.splice(i, 1); else arr.push(val); set(t.dataset.toggle, arr); render(true); return; }
    if (t.dataset.pick) { let val = t.dataset.value; if (val === 'true') val = true; else if (val === 'false') val = false; else if (/^-?\d+(\.\d+)?$/.test(val)) val = +val; set(t.dataset.pick, val); if (t.dataset.then) { runAct(t.dataset.then, t); return; } render(true); return; }
    if (t.dataset.act) { e.preventDefault(); runAct(t.dataset.act, t); return; }
    if (t.dataset.go) { e.preventDefault(); const params = {}; Object.keys(t.dataset).filter(k => k.startsWith('p') && k.length > 1 && k[1] === k[1].toUpperCase()).forEach(k => { params[k[1].toLowerCase() + k.slice(2)] = t.dataset[k]; }); go(t.dataset.go, Object.keys(params).length ? params : undefined); return; }
    if (t.tagName === 'A' && t.getAttribute('href') === '#') { e.preventDefault(); toast('ห้องซ้อม: ลิงก์นี้เปิดหน้าภายนอกในระบบจริง'); }
  }
  function runAct(name, el) {
    const fn = actions[name]; if (!fn) { toast('ปุ่มนี้ยังไม่ได้ต่อ: ' + name); return; }
    const next = fn(s, { el, data: el.dataset, go, toast, xp, line, sheet, dialog, close, render, param: param() });
    if (typeof next === 'string') go(next); else render(true);
  }
  function onInput(e) {
    const t = e.target; if (!t.dataset || !t.dataset.bind || !t.closest('#dev')) return;
    let val = t.type === 'checkbox' ? t.checked : t.value;
    if (t.type === 'number') val = t.value === '' ? '' : +t.value;
    set(t.dataset.bind, val); refreshNeeds(document.getElementById('dev'));
    if (t.dataset.live !== undefined || t.type === 'checkbox' || t.tagName === 'SELECT' || t.type === 'radio') render(true); else persist();
  }
  /* ---------- What-if branches per level (data in whatif.js) ---------- */
  const wiOf = n => (window.WHATIF || []).filter(c => c.level === n);
  // Playable branches: jump to the level with the branch's starting state.
  // Each preset starts the rehearsal on that branch and shows a "กำลังซ้อมกรณี" strip above the guide until it is closed.
  const caseRun = (title, f) => () => { f(); v.caseRun = title; render(true); };
  const noAsk = () => { s.patient.chosenPt = null; if (s.request) s.request.preferredPt = null; };
  // See the "meet your PT" LINE card the patient gets: jump past the PT accepting, switch to the patient, open LINE at the card.
  const peekCard = () => {
    v.role = 'patient'; s.unread.patient = 0; document.body.classList.add('line-open'); go('p.appts');
    setTimeout(() => { const lb = document.getElementById('lineBody'), f = lb && lb.querySelector('.fx-pt'); if (!f) return; const m = f.closest('.msg'); lb.scrollTop += m.getBoundingClientRect().top - lb.getBoundingClientRect().top - 12; m.classList.add('line-hl'); }, 80);
  };
  const PLAY = {
    'l7-team': caseRun('คนไข้ไม่ได้ขอใคร · แอดมินติ๊กเลือก PT ที่แนะนำ แล้วส่งข้อเสนอ', () => { jumpTo(7); noAsk(); }),
    'l7-asked': caseRun('คนไข้ขอ PT ไว้ · ระบบติ๊กคนนั้นให้แล้ว กดส่งข้อเสนอ', () => { jumpTo(7); }),
    'l5-emergency': caseRun('ตอบว่ามีอาการฉุกเฉิน · ระบบให้โทร 1669 และไม่รับจอง', () => { jumpTo(5); s.patient.intakeStep = 3; s.patient.health = { q1: 'YES' }; go('p.intake'); }),
    'card-asked': caseRun('การ์ดที่คนไข้ได้ เมื่อ PT ที่คนไข้ขอรับงาน', () => { jumpTo(9); peekCard(); }),
    'card-team': caseRun('การ์ดที่คนไข้ได้ เมื่อทีมจับคู่ PT ให้', () => { jumpTo(9); noAsk(); peekCard(); })
  };
  function renderWhatIf() {
    const box = document.getElementById('whatif'); if (!box) return;
    const n = v.wi, list = n ? wiOf(n) : [], st = n && STAGES.find(x => x.n === n);
    if (!st) { box.innerHTML = ''; return; }
    box.innerHTML = `<section class="wi-panel" aria-label="กรณีแยกของด่าน ${n}"><header><span class="lv-n r-${st.role}">${n}</span><div class="grow"><b>ด่าน ${n} · ถ้าไม่เป็นไปตามทางหลัก</b><small>${esc(st.title)} · ${list.length} กรณี · <i class="wi-d ok"></i>ตกลงแล้ว <i class="wi-d wait"></i>รอตัดสิน</small></div><button class="ib" data-wi-close aria-label="ปิด">${icon('x')}</button></header>
      <div class="wi-tree"><div class="wi-root">${icon('route')}ทางหลักที่ซ้อมอยู่: ${esc(st.title)}</div>
      <ol class="wi-brs">${list.map((c, i) => `<li class="wi-br ${c.status === 'ตกลงแล้ว' ? 'ok' : 'wait'} ${v.wiCase === i ? 'on' : ''}"><div class="wi-card"><b>${esc(c.title)}</b>
        <ol class="wi-steps">${c.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="wi-meta"><span class="pill ${c.status === 'ตกลงแล้ว' ? '' : 'wait'}">${esc(c.status)}</span><small>${esc(c.source || '')}</small></div>
        ${c.note ? `<p class="wi-note">${icon('circle-help')}${esc(c.note)}</p>` : ''}
        ${(c.play && PLAY[c.play]) || (c.peek && PLAY[c.peek]) ? `<div class="wi-acts">${c.play && PLAY[c.play] ? `<button class="btn sm" data-wi-play="${c.play}">${icon('play')}ลองซ้อมกรณีนี้</button>` : ''}${c.peek && PLAY[c.peek] ? `<button class="btn sm ghost" data-wi-play="${c.peek}">${icon('message-square')}ดูการ์ดที่คนไข้ได้</button>` : ''}</div>` : ''}</div></li>`).join('')}</ol></div></section>`;
    if (window.lucide) window.lucide.createIcons();
  }
  function confirmJump(n) {
    const st = STAGES.find(x => x.n === n);
    v.overlay = { kind: 'dlg', html: `<b class="h2">ข้ามไปด่าน ${n}?</b><p class="p">${esc(st.title)} · ห้องซ้อมจะทำด่าน 1–${n - 1} ให้อัตโนมัติด้วยข้อมูลตัวอย่าง ข้อมูลที่กรอกไว้จะหาย</p><div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn" id="doJump">ข้ามไปเลย</button></div>` };
    render(true); closeLevels();
    document.getElementById('doJump').onclick = () => jumpTo(n);
  }
  function confirmReset() {
    v.overlay = { kind: 'dlg', html: `<b class="h2">เริ่มซ้อมใหม่ทั้งหมด?</b><p class="p">ข้อมูลทุกบทบาทและข้อความ LINE ในห้องซ้อมจะถูกล้าง</p><div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn danger" id="doReset">เริ่มใหม่</button></div>` };
    render(true); closeLevels();
    document.getElementById('doReset').onclick = reset;
  }
  const closeLevels = () => document.body.classList.remove('levels-open');

  /* ---------- Boot ---------- */
  /* Full-motion preview: this is a design review tool, so a Mac with Reduce motion on can still see the real motion.
     It turns the page's reduced-motion CSS blocks off (or back on); the product itself keeps honouring the setting. */
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  let fullMotion = (() => { try { const v = localStorage.getItem('sc-full-motion'); return v === null ? true : v === '1'; } catch (e) { return true; } })();
  function applyMotion() {
    for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      for (const r of rules) if (r instanceof CSSMediaRule && /prefers-reduced-motion/.test(r.__orig || r.conditionText || r.media.mediaText)) {
        if (!r.__orig) r.__orig = r.media.mediaText;
        r.media.mediaText = fullMotion && RM.matches ? 'not all' : r.__orig; } }
    const b = document.getElementById('motionBtn');
    if (b) { b.hidden = !RM.matches; b.classList.toggle('on', fullMotion); b.innerHTML = `${icon(fullMotion ? 'sparkles' : 'pause')}โมชั่นเต็ม ${fullMotion ? 'เปิด' : 'ปิด'}`; b.title = 'เครื่องนี้ตั้งค่าลดการเคลื่อนไหวไว้ · แตะเพื่อสลับ'; if (window.lucide) window.lucide.createIcons(); }
  }
  async function boot() {
    try { RAW = await (await fetch('raw.json')).json(); } catch (e) { RAW = {}; }
    document.addEventListener('click', onClick);
    const mb = document.createElement('button'); mb.id = 'motionBtn'; mb.className = 'motion-btn'; mb.hidden = true;
    mb.addEventListener('click', () => { fullMotion = !fullMotion; try { localStorage.setItem('sc-full-motion', fullMotion ? '1' : '0'); } catch (e) { } applyMotion(); render(); });
    const roles = document.getElementById('roles'); if (roles) roles.parentNode.insertBefore(mb, roles);
    setTimeout(applyMotion, 0); RM.addEventListener && RM.addEventListener('change', applyMotion);
    document.addEventListener('input', onInput);
    document.addEventListener('change', e => { if (e.target.type === 'file' && e.target.dataset.file && e.target.closest('#dev')) { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { set(e.target.dataset.file, r.result); if (e.target.dataset.then) runAct(e.target.dataset.then, e.target); else render(true); }; r.readAsDataURL(f); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && v.overlay) close(); });
    render();
  }

  window.SC = { screen, action, go, back, sheet, dialog, close, toast, xp, line, render, get, set, ui, esc, money, me, param,
    jump: jumpTo, reset, confirmJump, onShell: fn => shellHooks.push(fn), stageNow, get s() { return s; }, get v() { return v; }, ZONES, SAMPLE_PTS, CERT_TX, certTxText, TRIAL, VISIT1, RATE, bpCat, VISIT2, TODAY, STAGES };
  document.addEventListener('DOMContentLoaded', boot);
})();
