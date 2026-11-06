/* screens-copy.js · Review page for Thai Clinical Copy Master v1.0 (Consolidated Prompt §6.4 step 2): one card per message.
   It sits outside the rehearsal on purpose: Palm, Nat and Boss review words here, nobody works a case. Link straight to it with #copy.
   A mark is one reviewer's opinion, not approval. Marks live outside the rehearsal state so "เริ่มใหม่" keeps them.
   With API_URL set, each card is sent on its own through tools/copy-review-worker and saved as a new version in a private GitHub repo. Without it, marks stay on this device and go back by copy. */
(function () {
  'use strict';
  const { esc, ui } = SC, I = ui.icon, ALL = window.SC_COPY || [];
  const VER = 'Copy v1.1 · PROPOSED', KEY = 'sc-copy-review-v1', COPY_VERSION = 'v1.1-PROPOSED';
  const API_URL = 'https://synaclair-copy-review.synaclair-review.workers.dev'; /* tools/copy-review-worker; not a secret */
  /* Only sites the Worker allows can send. Elsewhere, such as a claude.ai Artifact, marks stay on this device and go back by copy. */
  const api = () => window.SC_COPY_API !== undefined ? window.SC_COPY_API : /(^|\.)napphattua\.github\.io$|^127\.0\.0\.1$/.test(location.hostname) ? API_URL : '';
  const STAGES = { A: 'ลงทะเบียนและคัดกรอง', B: 'ผลด่านความปลอดภัย', C: 'ตรวจทางคลินิก', D: 'ชำระเงิน', E: 'จับคู่และ Offer', F: 'นัดและการเยี่ยม', G: 'ข้ามบทบาทและ LINE' };
  const WHO = { palm: 'พี่ปาล์ม', nat: 'นัท', boss: 'บอส' };
  const ROLES = ['คนไข้/ญาติ', 'PT', 'LINE', 'Clinical Lead', 'Admin'];
  const SPECIAL = { A05: 'ข้อความฉุกเฉิน ต้องให้ Clinical Leads ยืนยัน', B03: 'ข้อความฉุกเฉิน ต้องให้ Clinical Leads ยืนยัน', D03: 'ตอนนี้ระบบถือว่า "ประเมินอย่างเดียว" คือ C01–C05 ต้องยืนยันนิยาม', C01: 'ถ้าจะบอกเวลาตอบกลับ ต้องมีเวลาที่อนุมัติก่อน' };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } };
  const db = Object.assign({ who: 'palm', palm: {}, nat: {}, boss: {}, view: { stage: 'A', role: 'all', show: 'all' } }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* the marks still work for this visit */ } };
  const mine = () => db[db.who];
  const remote = { rows: [], loading: false, error: '', sending: {}, fail: {} };
  const draftOf = id => (mine()[id] || {}).st || '';
  const sentOf = id => remote.rows.filter(x => x.id === id && x.by === db.who).pop();
  const stOf = id => draftOf(id) || (api() && sentOf(id) ? sentOf(id).status : '');
  /* Progress counts what was really sent when sending is on; a draft is not a result yet. */
  const doneSt = id => api() ? (sentOf(id) || {}).status || '' : draftOf(id);
  const when = x => { try { return new Date(x).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }); } catch (e) { return x; } };
  const has = x => x && x !== '—';
  const fill = t => esc(t).replace(/\{[^{}]+\}/g, m => `<span class="ck-var">${m}</span>`);
  const tally = () => ({ ok: ALL.filter(x => doneSt(x[0]) === 'ok').length, fix: ALL.filter(x => doneSt(x[0]) === 'fix').length });
  function report() {
    const m = mine(), t = tally(), ids = st => ALL.filter(x => stOf(x[0]) === st);
    const lines = [`ผลตรวจ Thai Clinical Copy Master (${VER}) โดย ${WHO[db.who]}`, `ผ่าน ${t.ok} · ขอแก้ ${t.fix} · ยังไม่ตรวจ ${ALL.length - t.ok - t.fix} จาก ${ALL.length} ข้อความ`];
    if (t.fix) lines.push('', 'ขอแก้', ...ids('fix').map(x => `${x[0]} ${x[3]}: ${(m[x[0]].note || '').trim() || '(ยังไม่ได้เขียนว่าแก้อย่างไร)'}`));
    if (t.ok) lines.push('', 'ผ่าน', ids('ok').map(x => x[0]).join(', '));
    return lines.join('\n');
  }
  const card = x => {
    const [id, role, trigger, title, body, cta, no, dyn, risk, bold, old] = x, online = !!api(), draft = draftOf(id), sent = online ? sentOf(id) : null, st = online ? draft : stOf(id), isLine = role === 'LINE', rows = remote.rows.filter(r => r.id === id);
    const statusPill = (s, tail = '') => s === 'ok' ? `<span class="pill">${I('check')}ผ่าน${tail}</span>` : `<span class="pill warn">ขอแก้${tail}</span>`;
    const badge = online && draft ? '<span class="pill wait">ยังไม่ได้ส่ง</span>' : sent ? statusPill(sent.status, ` · ส่งแล้ว v${sent.v}`) : st ? statusPill(st) : '<span class="pill gray">ยังไม่ตรวจ</span>';
    const noteBox = (online && draft) || (!online && st === 'fix') ? `<label class="ck-note"><span>${draft === 'ok' ? 'โน้ตเพิ่มเติม (ไม่บังคับ)' : 'อยากให้แก้อย่างไร'}</span><textarea rows="2" data-ck-note="${id}" placeholder="${draft === 'ok' ? 'เขียนถ้ามีเรื่องอยากฝากไว้' : 'เขียนคำที่อยากให้ใช้ หรือเหตุผล'}">${esc((mine()[id] || {}).note || '')}</textarea></label>` : '';
    const send = online && draft ? `<button class="btn sm" data-ck="send" data-id="${id}" ${remote.sending[id] ? 'disabled' : ''}>${I('send')}${remote.sending[id] ? 'กำลังส่ง' : `ส่ง${sent ? ` เป็น v${(rows.length || 0) + 1}` : ''}`}</button>${remote.fail[id] ? `<p class="ck-fail" role="alert">${esc(remote.fail[id])}</p>` : ''}` : '';
    const hist = rows.length ? `<details class="ck-hist" data-id="${id}"><summary>ประวัติ ${rows.length} เวอร์ชัน</summary><ol>${[...rows].reverse().map(r => `<li><b>v${esc(r.v)}</b> ${esc(WHO[r.by] || r.by)} · ${r.status === 'ok' ? 'ผ่าน' : 'ขอแก้'} · ${esc(when(r.at))}${r.note ? `<p>${esc(r.note)}</p>` : ''}</li>`).join('')}</ol></details>` : '';
    return `<article class="ck-card ${(online ? draft || (sent || {}).status : st) ? 'is-' + (online ? draft || sent.status : st) : ''}" data-copy-card="${id}">
      <header class="ck-top"><b class="ck-id">${id}</b><span class="ck-role">${esc(role)}</span><span class="grow"></span>${badge}</header>
      <p class="ck-when"><span>แสดงเมื่อ</span> ${esc(trigger)}</p>
      <div class="ck-msg ${isLine ? 'line' : ''}">${isLine ? '<small>แจ้งเตือนใน LINE</small>' : ''}<b>${fill(title)}</b><p>${bold ? fill(body).replace(esc(bold), `<b>${esc(bold)}</b>`) : fill(body)}</p>${has(cta) ? `<span class="ck-cta">${esc(cta)}</span>` : ''}</div>
      ${old ? `<details class="ck-old"><summary>ดูข้อความ v1.0 ก่อนนัทแก้</summary><p><b>${fill(old[0])}</b><br>${fill(old[1])}${has(old[2]) ? `<br>ปุ่ม: ${esc(old[2])}` : ''}</p></details>` : ''}
      ${SPECIAL[id] ? `<p class="ck-special">${I('flag')}<span><b>ตรวจเป็นพิเศษ</b> ${esc(SPECIAL[id])}</span></p>` : ''}
      <dl class="ck-meta"><div class="no"><dt>ห้ามใช้</dt><dd>${esc(no)}</dd></div><div><dt>ถ้าสื่อสารผิด</dt><dd>${esc(risk)}</dd></div>${has(dyn) ? `<div><dt>ดึงจากระบบ</dt><dd>${esc(dyn)}</dd></div>` : ''}</dl>
      <div class="ck-acts"><button class="ck-mark ${st === 'ok' ? 'on ok' : ''}" aria-pressed="${st === 'ok'}" data-ck="mark" data-id="${id}" data-st="ok">${I('check')}ผ่าน</button><button class="ck-mark ${st === 'fix' ? 'on fix' : ''}" aria-pressed="${st === 'fix'}" data-ck="mark" data-id="${id}" data-st="fix">${I('pencil-line')}ขอแก้</button></div>
      ${noteBox}${send}${hist}
    </article>`;
  };
  function html() {
    const f = db.view, t = tally(), left = ALL.length - t.ok - t.fix;
    const shown = ALL.filter(x => (f.stage === 'all' || x[0][0] === f.stage) && (f.role === 'all' || x[1] === f.role) && (f.show === 'all' || (f.show === 'todo' && !(api() ? sentOf(x[0]) : stOf(x[0]))) || (f.show === 'fix' && (api() ? doneSt(x[0]) === 'fix' || draftOf(x[0]) === 'fix' : stOf(x[0]) === 'fix')) || (f.show === 'special' && SPECIAL[x[0]])));
    const chip = (k, v, label) => `<button class="${f[k] === v ? 'on' : ''}" aria-pressed="${f[k] === v}" data-ck="filter" data-k="${k}" data-v="${esc(v)}">${esc(label)}</button>`;
    const tabLeft = k => ALL.filter(x => (k === 'all' || x[0][0] === k) && !doneSt(x[0])).length;
    const tab = (k, label) => `<button class="${f.stage === k ? 'on' : ''}" aria-current="${f.stage === k ? 'page' : 'false'}" data-ck="filter" data-k="stage" data-v="${k}">${esc(label)}${tabLeft(k) ? `<span>${tabLeft(k)}</span>` : ''}</button>`;
    return `<header class="ck-head"><div class="grow"><h1>ตรวจข้อความไทย</h1><p>อ่านทีละการ์ด ถ้าโอเคกดผ่าน ถ้าไม่โอเคกดขอแก้แล้วเขียนสั้นๆ</p></div><span class="pill wait">${VER}</span><button class="btn sm ghost" data-ck="close">${I('arrow-left')}กลับห้องซ้อม</button></header>
      <section class="ck-bar">
        <div class="ck-who" role="group" aria-label="ตรวจในชื่อ"><span>ตรวจในชื่อ</span>${Object.keys(WHO).map(k => `<button class="${db.who === k ? 'on' : ''}" aria-pressed="${db.who === k}" data-ck="who" data-v="${k}">${WHO[k]}</button>`).join('')}</div>
        <div class="ck-prog"><div class="ck-track" role="img" aria-label="ผ่าน ${t.ok} ขอแก้ ${t.fix} จาก ${ALL.length}"><i style="width:${t.ok / ALL.length * 100}%"></i><i class="f" style="width:${t.fix / ALL.length * 100}%"></i></div><span>ผ่าน <b>${t.ok}</b> · ขอแก้ <b>${t.fix}</b> · เหลือ <b>${left}</b></span></div>
        ${api() ? `<button class="btn sm ghost" data-ck="refresh" ${remote.loading ? 'disabled' : ''}>${I('refresh-cw')}${remote.loading ? 'กำลังโหลด' : 'ดูผลล่าสุด'}</button>` : `<button class="btn sm" data-ck="export">${I('copy')}คัดลอกผลตรวจ</button>`}
      </section>
      ${api() && !db.code ? `<form class="ck-gate" data-ck-gate><label for="ckCode">รหัสทีม</label><input id="ckCode" type="password" autocomplete="off" required><button class="btn sm">ใช้รหัสนี้</button></form>` : ''}
      ${remote.error ? `<p class="ck-fail" role="alert">${esc(remote.error)}</p>` : ''}
      <p class="dc-note">${I('info')}<span><b>กดผ่านยังไม่ใช่การอนุมัติ</b> ${api() ? 'ส่งแล้วบันทึกเป็นเวอร์ชันใหม่ ของเดิมยังอยู่ครบ' : 'ผลอยู่ในเครื่องนี้ กดคัดลอกแล้วส่งกลับทางแชท'} · ยังไม่รวมคำถามคัดกรองรายข้อ</span></p>
      <nav class="dc-tabs ck-tabs" aria-label="ขั้นตอน">${tab('all', 'ทั้งหมด')}${Object.keys(STAGES).map(k => tab(k, `${k} ${STAGES[k]}`)).join('')}</nav>
      <div class="row between wrap ck-filters"><div class="dc-f">${chip('role', 'all', 'ทุกคนอ่าน')}${ROLES.map(r => chip('role', r, r)).join('')}</div><div class="dc-f">${chip('show', 'all', 'ทุกข้อ')}${chip('show', 'todo', 'ยังไม่ตรวจ')}${chip('show', 'fix', 'ขอแก้')}${chip('show', 'special', 'ตรวจเป็นพิเศษ')}</div></div>
      <div class="ck-grid">${shown.length ? shown.map(card).join('') : `<p class="ck-empty">${f.show === 'todo' ? 'ตรวจครบแล้วในกลุ่มนี้' : 'ไม่มีข้อความในกลุ่มนี้'}</p>`}</div>
      ${api() ? '' : `<details class="ck-out"><summary>ดูข้อความผลตรวจ</summary><textarea id="ckOut" rows="8" readonly aria-label="ข้อความผลตรวจ">${esc(report())}</textarea></details>`}`;
  }
  const page = document.createElement('main'), status = document.createElement('div'), openBtn = document.createElement('button');
  page.id = 'copyPage'; page.hidden = true; status.className = 'ck-toast'; status.setAttribute('role', 'status');
  openBtn.id = 'copyOpen'; openBtn.type = 'button'; openBtn.innerHTML = `${I('message-square-text')}ตรวจข้อความไทย`;
  document.querySelector('header.top').appendChild(openBtn);
  document.querySelector('header.top').after(page); document.body.appendChild(status);
  /* Every paint rebuilds the page, so put keyboard focus back on the button that was pressed. */
  function paint(pressed) {
    const key = pressed && Object.values(pressed.dataset).join('|'), open = page.querySelector('.ck-out[open]'), hists = [...page.querySelectorAll('.ck-hist[open]')].map(x => x.dataset.id), ae = document.activeElement, typing = ae && ae.dataset && ae.dataset.ckNote ? [ae.dataset.ckNote, ae.selectionStart, ae.selectionEnd] : null;
    page.innerHTML = html();
    if (open && page.querySelector('.ck-out')) page.querySelector('.ck-out').open = true;
    hists.forEach(id => { const d = page.querySelector(`.ck-hist[data-id="${id}"]`); if (d) d.open = true; });
    if (typing && !key) { const n = page.querySelector(`[data-ck-note="${typing[0]}"]`); if (n) { n.focus({ preventScroll: true }); n.setSelectionRange(typing[1], typing[2]); } }
    if (window.lucide) window.lucide.createIcons();
    if (key) { const b = [...page.querySelectorAll('button')].find(x => Object.values(x.dataset).join('|') === key); if (b) b.focus({ preventScroll: true }); }
  }
  function show(on) {
    page.hidden = !on; document.body.classList.toggle('copy-open', on);
    openBtn.setAttribute('aria-pressed', on);
    try { history.replaceState(null, '', on ? '#copy' : location.pathname + location.search); } catch (e) { /* the page still opens, only the link stays the same */ }
    if (on) { paint(); window.scrollTo(0, 0); loadRemote(); }
  }
  SC.openCopy = () => show(true);
  const ask = (path, init = {}) => fetch(`${api().replace(/\/$/, '')}${path}`, { ...init, headers: { 'content-type': 'application/json', 'x-team-code': db.code || '', ...(init.headers || {}) } });
  const badCode = () => { db.code = ''; save(); remote.error = 'รหัสทีมไม่ถูกต้อง กรุณาใส่ใหม่'; };
  async function loadRemote(pressed) {
    if (!api() || !db.code || remote.loading) return;
    remote.loading = true; remote.error = ''; paint(pressed);
    try {
      const res = await ask('/reviews'), data = await res.json().catch(() => ({}));
      if (res.status === 401) badCode(); else if (!res.ok) throw new Error(data.error); else remote.rows = data.reviews || [];
    } catch (e) { remote.error = 'โหลดผลล่าสุดไม่ได้ ลองกด "ดูผลล่าสุด" อีกครั้ง'; }
    remote.loading = false; paint();
  }
  const SEND_ERR = { NOTE_REQUIRED: 'เขียนว่าอยากให้แก้อย่างไรก่อนส่ง', NOTE_TOO_LONG: 'โน้ตยาวเกิน 2,000 ตัวอักษร' };
  async function sendCard(id) {
    const m = mine(), d = m[id] || {};
    if (!d.st || remote.sending[id]) return;
    if (!db.code) { remote.fail[id] = 'ใส่รหัสทีมก่อนส่ง'; paint(); const c = page.querySelector('#ckCode'); if (c) c.focus(); return; }
    if (d.st === 'fix' && !(d.note || '').trim()) { remote.fail[id] = SEND_ERR.NOTE_REQUIRED; paint(); return; }
    remote.sending[id] = true; delete remote.fail[id]; paint();
    try {
      const res = await ask('/reviews', { method: 'POST', body: JSON.stringify({ id, status: d.st, note: d.note || '', by: db.who, copyVersion: COPY_VERSION }) }), data = await res.json().catch(() => ({}));
      if (res.status === 401) { badCode(); remote.fail[id] = 'ยังไม่ได้ส่ง โน้ตยังอยู่ ใส่รหัสทีมแล้วกดส่งอีกครั้ง'; }
      else if (!res.ok) remote.fail[id] = SEND_ERR[data.error] || 'ส่งไม่สำเร็จ โน้ตยังอยู่ กดส่งอีกครั้งได้';
      else { remote.rows.push(data.entry); delete m[id]; save(); say(`บันทึก ${id} v${data.entry.v} แล้ว`); }
    } catch (e) { remote.fail[id] = 'ส่งไม่สำเร็จ โน้ตยังอยู่ กดส่งอีกครั้งได้'; }
    delete remote.sending[id]; paint();
  }
  let hide;
  const say = t => { status.textContent = t; status.classList.add('on'); clearTimeout(hide); hide = setTimeout(() => status.classList.remove('on'), 2400); };
  document.addEventListener('click', e => {
    if (e.target.closest('#copyOpen')) { show(!document.body.classList.contains('copy-open')); return; }
    if (e.target.closest('#roles [data-role]')) { show(false); return; }
    const b = e.target.closest('#copyPage [data-ck]'); if (!b) return;
    const d = b.dataset;
    if (d.ck === 'close') show(false);
    if (d.ck === 'filter') { db.view[d.k] = d.v; save(); paint(b); }
    if (d.ck === 'who') { db.who = d.v; save(); paint(b); }
    if (d.ck === 'mark') {
      const m = mine(), x = m[d.id] = m[d.id] || {}; x.st = x.st === d.st ? '' : d.st; delete remote.fail[d.id]; save(); paint(b);
      if (x.st === 'fix' || (api() && x.st)) { const n = page.querySelector(`[data-ck-note="${d.id}"]`); if (n) n.focus({ preventScroll: true }); }
    }
    if (d.ck === 'refresh') loadRemote(b);
    if (d.ck === 'send') sendCard(d.id);
    if (d.ck === 'export') {
      const fail = () => { page.querySelector('.ck-out').open = true; say('คัดลอกไม่ได้ เลือกข้อความด้านล่างแทน'); };
      if (navigator.clipboard) navigator.clipboard.writeText(report()).then(() => say('คัดลอกผลตรวจแล้ว ส่งกลับทางแชทได้เลย'), fail); else fail();
    }
  });
  document.addEventListener('submit', e => {
    if (!e.target.matches('[data-ck-gate]')) return;
    e.preventDefault(); db.code = page.querySelector('#ckCode').value.trim(); save(); remote.error = ''; loadRemote();
  });
  document.addEventListener('input', e => {
    const id = e.target.dataset && e.target.dataset.ckNote; if (!id) return;
    (mine()[id] = mine()[id] || {}).note = e.target.value; save();
    const o = document.getElementById('ckOut'); if (o) o.value = report();
  });
  if (location.hash === '#copy') show(true);
})();
