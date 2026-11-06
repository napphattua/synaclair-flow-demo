/* screens-copy.js · Review page for Thai Clinical Copy Master v1.0 (Consolidated Prompt §6.4 step 2): one card per message.
   It sits outside the rehearsal on purpose: Palm, Nat and Boss review words here, nobody works a case. Link straight to it with #copy.
   A mark is one reviewer's opinion on this device, not approval. Marks live outside the rehearsal state so "เริ่มใหม่" keeps them. */
(function () {
  'use strict';
  const { esc, ui } = SC, I = ui.icon, ALL = window.SC_COPY || [];
  const VER = 'Copy v1.0 · PROPOSED', KEY = 'sc-copy-review-v1';
  const STAGES = { A: 'ลงทะเบียนและคัดกรอง', B: 'ผลด่านความปลอดภัย', C: 'ตรวจทางคลินิก', D: 'ชำระเงิน', E: 'จับคู่และ Offer', F: 'นัดและการเยี่ยม', G: 'ข้ามบทบาทและ LINE' };
  const WHO = { palm: 'พี่ปาล์ม', nat: 'นัท', boss: 'บอส' };
  const ROLES = ['คนไข้/ญาติ', 'PT', 'LINE', 'Clinical Lead', 'Admin'];
  const SPECIAL = { A05: 'ข้อความฉุกเฉิน ต้องให้ Clinical Leads ยืนยัน', B03: 'ข้อความฉุกเฉิน ต้องให้ Clinical Leads ยืนยัน', D03: 'ตอนนี้ระบบถือว่า "ประเมินอย่างเดียว" คือ C01–C05 ต้องยืนยันนิยาม', C01: 'ถ้าจะบอกเวลาตอบกลับ ต้องมีเวลาที่อนุมัติก่อน' };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } };
  const db = Object.assign({ who: 'palm', palm: {}, nat: {}, boss: {}, view: { stage: 'A', role: 'all', show: 'all' } }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* the marks still work for this visit */ } };
  const mine = () => db[db.who];
  const stOf = id => (mine()[id] || {}).st || '';
  const has = x => x && x !== '—';
  const fill = t => esc(t).replace(/\{[^{}]+\}/g, m => `<span class="ck-var">${m}</span>`);
  const tally = () => ({ ok: ALL.filter(x => stOf(x[0]) === 'ok').length, fix: ALL.filter(x => stOf(x[0]) === 'fix').length });
  function report() {
    const m = mine(), t = tally(), ids = st => ALL.filter(x => stOf(x[0]) === st);
    const lines = [`ผลตรวจ Thai Clinical Copy Master (${VER}) โดย ${WHO[db.who]}`, `ผ่าน ${t.ok} · ขอแก้ ${t.fix} · ยังไม่ตรวจ ${ALL.length - t.ok - t.fix} จาก ${ALL.length} ข้อความ`];
    if (t.fix) lines.push('', 'ขอแก้', ...ids('fix').map(x => `${x[0]} ${x[3]}: ${(m[x[0]].note || '').trim() || '(ยังไม่ได้เขียนว่าแก้อย่างไร)'}`));
    if (t.ok) lines.push('', 'ผ่าน', ids('ok').map(x => x[0]).join(', '));
    return lines.join('\n');
  }
  const card = x => {
    const [id, role, trigger, title, body, cta, no, dyn, risk] = x, st = stOf(id), isLine = role === 'LINE';
    const badge = st === 'ok' ? `<span class="pill">${I('check')}ผ่าน</span>` : st === 'fix' ? '<span class="pill warn">ขอแก้</span>' : '<span class="pill gray">ยังไม่ตรวจ</span>';
    return `<article class="ck-card ${st ? 'is-' + st : ''}" data-copy-card="${id}">
      <header class="ck-top"><b class="ck-id">${id}</b><span class="ck-role">${esc(role)}</span><span class="grow"></span>${badge}</header>
      <p class="ck-when"><span>แสดงเมื่อ</span> ${esc(trigger)}</p>
      <div class="ck-msg ${isLine ? 'line' : ''}">${isLine ? '<small>แจ้งเตือนใน LINE</small>' : ''}<b>${fill(title)}</b><p>${fill(body)}</p>${has(cta) ? `<span class="ck-cta">${esc(cta)}</span>` : ''}</div>
      ${SPECIAL[id] ? `<p class="ck-special">${I('flag')}<span><b>ตรวจเป็นพิเศษ</b> ${esc(SPECIAL[id])}</span></p>` : ''}
      <dl class="ck-meta"><div class="no"><dt>ห้ามใช้</dt><dd>${esc(no)}</dd></div><div><dt>ถ้าสื่อสารผิด</dt><dd>${esc(risk)}</dd></div>${has(dyn) ? `<div><dt>ดึงจากระบบ</dt><dd>${esc(dyn)}</dd></div>` : ''}</dl>
      <div class="ck-acts"><button class="ck-mark ${st === 'ok' ? 'on ok' : ''}" aria-pressed="${st === 'ok'}" data-ck="mark" data-id="${id}" data-st="ok">${I('check')}ผ่าน</button><button class="ck-mark ${st === 'fix' ? 'on fix' : ''}" aria-pressed="${st === 'fix'}" data-ck="mark" data-id="${id}" data-st="fix">${I('pencil-line')}ขอแก้</button></div>
      ${st === 'fix' ? `<label class="ck-note"><span>อยากให้แก้อย่างไร</span><textarea rows="2" data-ck-note="${id}" placeholder="เขียนคำที่อยากให้ใช้ หรือเหตุผล">${esc((mine()[id] || {}).note || '')}</textarea></label>` : ''}
    </article>`;
  };
  function html() {
    const f = db.view, t = tally(), left = ALL.length - t.ok - t.fix;
    const shown = ALL.filter(x => (f.stage === 'all' || x[0][0] === f.stage) && (f.role === 'all' || x[1] === f.role) && (f.show === 'all' || (f.show === 'todo' && !stOf(x[0])) || (f.show === 'fix' && stOf(x[0]) === 'fix') || (f.show === 'special' && SPECIAL[x[0]])));
    const chip = (k, v, label) => `<button class="${f[k] === v ? 'on' : ''}" aria-pressed="${f[k] === v}" data-ck="filter" data-k="${k}" data-v="${esc(v)}">${esc(label)}</button>`;
    const tabLeft = k => ALL.filter(x => (k === 'all' || x[0][0] === k) && !stOf(x[0])).length;
    const tab = (k, label) => `<button class="${f.stage === k ? 'on' : ''}" aria-current="${f.stage === k ? 'page' : 'false'}" data-ck="filter" data-k="stage" data-v="${k}">${esc(label)}${tabLeft(k) ? `<span>${tabLeft(k)}</span>` : ''}</button>`;
    return `<header class="ck-head"><div class="grow"><h1>ตรวจข้อความไทย</h1><p>อ่านทีละการ์ด ถ้าโอเคกดผ่าน ถ้าไม่โอเคกดขอแก้แล้วเขียนสั้นๆ</p></div><span class="pill wait">${VER}</span><button class="btn sm ghost" data-ck="close">${I('arrow-left')}กลับห้องซ้อม</button></header>
      <section class="ck-bar">
        <div class="ck-who" role="group" aria-label="ตรวจในชื่อ"><span>ตรวจในชื่อ</span>${Object.keys(WHO).map(k => `<button class="${db.who === k ? 'on' : ''}" aria-pressed="${db.who === k}" data-ck="who" data-v="${k}">${WHO[k]}</button>`).join('')}</div>
        <div class="ck-prog"><div class="ck-track" role="img" aria-label="ผ่าน ${t.ok} ขอแก้ ${t.fix} จาก ${ALL.length}"><i style="width:${t.ok / ALL.length * 100}%"></i><i class="f" style="width:${t.fix / ALL.length * 100}%"></i></div><span>ผ่าน <b>${t.ok}</b> · ขอแก้ <b>${t.fix}</b> · เหลือ <b>${left}</b></span></div>
        <button class="btn sm" data-ck="export">${I('copy')}คัดลอกผลตรวจ</button>
      </section>
      <p class="dc-note">${I('info')}<span><b>กดผ่านยังไม่ใช่การอนุมัติ</b> ผลอยู่ในเครื่องนี้ กดคัดลอกแล้วส่งกลับทางแชท · ยังไม่รวมคำถามคัดกรองรายข้อ</span></p>
      <nav class="dc-tabs ck-tabs" aria-label="ขั้นตอน">${tab('all', 'ทั้งหมด')}${Object.keys(STAGES).map(k => tab(k, `${k} ${STAGES[k]}`)).join('')}</nav>
      <div class="row between wrap ck-filters"><div class="dc-f">${chip('role', 'all', 'ทุกคนอ่าน')}${ROLES.map(r => chip('role', r, r)).join('')}</div><div class="dc-f">${chip('show', 'all', 'ทุกข้อ')}${chip('show', 'todo', 'ยังไม่ตรวจ')}${chip('show', 'fix', 'ขอแก้')}${chip('show', 'special', 'ตรวจเป็นพิเศษ')}</div></div>
      <div class="ck-grid">${shown.length ? shown.map(card).join('') : `<p class="ck-empty">${f.show === 'todo' ? 'ตรวจครบแล้วในกลุ่มนี้' : 'ไม่มีข้อความในกลุ่มนี้'}</p>`}</div>
      <details class="ck-out"><summary>ดูข้อความผลตรวจ</summary><textarea id="ckOut" rows="8" readonly aria-label="ข้อความผลตรวจ">${esc(report())}</textarea></details>`;
  }
  const page = document.createElement('main'), status = document.createElement('div'), openBtn = document.createElement('button');
  page.id = 'copyPage'; page.hidden = true; status.className = 'ck-toast'; status.setAttribute('role', 'status');
  openBtn.id = 'copyOpen'; openBtn.type = 'button'; openBtn.innerHTML = `${I('message-square-text')}ตรวจข้อความไทย`;
  document.querySelector('header.top').appendChild(openBtn);
  document.querySelector('header.top').after(page); document.body.appendChild(status);
  /* Every paint rebuilds the page, so put keyboard focus back on the button that was pressed. */
  function paint(pressed) {
    const key = pressed && Object.values(pressed.dataset).join('|'), open = page.querySelector('.ck-out[open]');
    page.innerHTML = html();
    if (open) page.querySelector('.ck-out').open = true;
    if (window.lucide) window.lucide.createIcons();
    if (key) { const b = [...page.querySelectorAll('button')].find(x => Object.values(x.dataset).join('|') === key); if (b) b.focus({ preventScroll: true }); }
  }
  function show(on) {
    page.hidden = !on; document.body.classList.toggle('copy-open', on);
    openBtn.setAttribute('aria-pressed', on);
    try { history.replaceState(null, '', on ? '#copy' : location.pathname + location.search); } catch (e) { /* the page still opens, only the link stays the same */ }
    if (on) { paint(); window.scrollTo(0, 0); }
  }
  SC.openCopy = () => show(true);
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
      const m = mine(), x = m[d.id] = m[d.id] || {}; x.st = x.st === d.st ? '' : d.st; save(); paint(b);
      if (x.st === 'fix') { const n = page.querySelector(`[data-ck-note="${d.id}"]`); if (n) n.focus({ preventScroll: true }); }
    }
    if (d.ck === 'export') {
      const fail = () => { page.querySelector('.ck-out').open = true; say('คัดลอกไม่ได้ เลือกข้อความด้านล่างแทน'); };
      if (navigator.clipboard) navigator.clipboard.writeText(report()).then(() => say('คัดลอกผลตรวจแล้ว ส่งกลับทางแชทได้เลย'), fail); else fail();
    }
  });
  document.addEventListener('input', e => {
    const id = e.target.dataset && e.target.dataset.ckNote; if (!id) return;
    (mine()[id] = mine()[id] || {}).note = e.target.value; save();
    const o = document.getElementById('ckOut'); if (o) o.value = report();
  });
  if (location.hash === '#copy') show(true);
})();
