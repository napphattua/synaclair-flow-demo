/* Circuit-board flowchart (the one the owner liked in the first simulator), now live: it follows the rehearsal and every chip is clickable. */
(function () {
  'use strict';
  // lane: P คนไข้ · X แอดมิน · T นักกายภาพ ; n = level ; screen = page the chip opens
  const NODES = [
    { lane: 'T', n: 1, label: 'สมัครด้วย LINE', screen: 't.join' },
    { lane: 'T', n: 1, label: 'กรอก 4 ช่อง', screen: 't.signup' },
    { lane: 'T', n: 2, label: 'ใส่รูป', screen: 't.photo' },
    { lane: 'T', n: 2, label: 'ลงเวลาว่าง', screen: 't.schedule' },
    { lane: 'X', n: 3, label: 'ตรวจใบประกอบ', screen: 'a.license' },
    { lane: 'P', n: 4, label: 'เปิดแอป', screen: 'p.loading' },
    { lane: 'P', n: 4, label: 'ฟีดนักกายภาพ', screen: 'p.feed' },
    { lane: 'P', n: 4, label: 'ขอคนนี้', screen: 'p.pt' },
    { lane: 'P', n: 5, label: 'ประเมินอาการ', screen: 'p.intake' },
    { lane: 'P', n: 6, label: 'ผลประเมิน', screen: 'p.result' },
    { lane: 'P', n: 6, label: 'จ่าย Trial', screen: 'p.pay' },
    { lane: 'X', n: 7, label: 'สลิปผิดปกติ', screen: 'a.payments' },
    { lane: 'X', n: 7, label: 'จับคู่ PT', screen: 'a.match' },
    { lane: 'T', n: 8, label: 'รับงานแรก', screen: 't.offer' },
    { lane: 'T', n: 9, label: 'วันนัด', screen: 't.visit' },
    { lane: 'T', n: 10, label: 'วางแผนกับคนไข้', screen: 't.plan' },
    { lane: 'T', n: 11, label: 'เขียน OPD', screen: 't.opd' },
    { lane: 'P', n: 12, label: 'อ่านสรุป', screen: 'p.report' },
    { lane: 'P', n: 12, label: 'รีวิว', screen: 'p.review' },
    { lane: 'X', n: 13, label: 'ตรวจเงินคอร์ส', screen: 'a.payments' },
    { lane: 'X', n: 13, label: 'อนุมัติรีวิว', screen: 'a.reviews' },
    { lane: 'T', n: 14, label: 'ครั้งที่ 2', screen: 't.visit' },
    { lane: 'T', n: 14, label: 'ทำใบรับรอง', screen: 't.cert' },
    { lane: 'P', n: 14, label: 'ได้ใบรับรอง', screen: 'p.cert' },
    { lane: 'T', n: 15, label: 'ครั้งสุดท้าย', screen: 't.visit' },
    { lane: 'T', n: 15, label: 'สรุปจบคอร์ส', screen: 't.renew' },
    { lane: 'P', n: 16, label: 'ต่อคอร์ส?', screen: 'p.renew' }
  ];
  const ROLE_OF = { P: 'patient', X: 'admin', T: 'pt' };
  const LANE = { P: 52, X: 104, T: 156 }, HGT = 184, W = 104, H = 36, COL = 124, X0 = 108, R = 8, PIN = 9;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let svg, board, chips = [], traces = [], vias = [], sig, comet, cur = -1, anim, scale = 1;
  const xOf = i => X0 + i * COL;

  function build() {
    board = document.getElementById('board'); svg = document.getElementById('flowsvg'); if (!svg) return;
    const width = X0 + NODES.length * COL + 24;
    scale = matchMedia('(max-width: 760px)').matches ? 0.7 : 1;
    svg.setAttribute('viewBox', `0 0 ${width} ${HGT}`); svg.setAttribute('width', width * scale); svg.setAttribute('height', HGT * scale);
    document.querySelectorAll('#flow .lanes span').forEach(sp => { sp.style.top = (LANE[sp.dataset.lane] * scale) + 'px'; });
    document.querySelector('#flow .boardbox').style.height = (HGT * scale) + 'px';
    for (const y of Object.values(LANE)) el('line', { x1: 0, y1: y, x2: width, y2: y, class: 'rail' }, svg);
    // one dashed module per level
    let start = 0;
    NODES.forEach((n, i) => { const nx = NODES[i + 1]; if (!nx || nx.n !== n.n) {
      const k = (window.WHATIF || []).filter(c => c.level === n.n).length;
      const g = el('g', k ? { class: 'mod has-wi', 'data-wi': n.n, role: 'button', tabindex: 0, 'aria-label': `ด่าน ${n.n} มี ${k} กรณีแยก` } : { class: 'mod' }, svg);
      el('rect', { x: xOf(start) - 10, y: 6, width: xOf(i) - xOf(start) + W + 20, height: HGT - 12, rx: 14 }, g);
      const t = el('text', { x: xOf(start) - 2, y: 21 }, g); t.textContent = 'ด่าน ' + n.n;
      if (k) { const b = el('tspan', { class: 'wi-t' }, t); b.textContent = ` · ถ้า… ${k} กรณี`; }
      start = i + 1; } });
    for (let i = 1; i < NODES.length; i++) {
      const a = NODES[i - 1], b = NODES[i], x1 = xOf(i - 1) + W, y1 = LANE[a.lane], x2 = xOf(i), y2 = LANE[b.lane], mx = (x1 + x2) / 2;
      let d;
      if (y1 === y2) d = `M${x1} ${y1} H${x2}`;
      else { const sgn = y2 > y1 ? 1 : -1; d = `M${x1} ${y1} H${mx - R} Q${mx} ${y1} ${mx} ${y1 + sgn * R} V${y2 - sgn * R} Q${mx} ${y2} ${mx + R} ${y2} H${x2}`; vias.push([i, el('circle', { cx: mx, cy: y1, r: 3.2, class: 'via' }, svg)]); }
      traces.push(el('path', { d, class: 'tr' }, svg));
    }
    chips = NODES.map((n, i) => {
      const g = el('g', { class: `chip ${n.lane.toLowerCase()}`, tabindex: 0, role: 'button', 'data-flow': i, 'aria-label': `ด่าน ${n.n} ${n.label}`, transform: `translate(${xOf(i)} ${LANE[n.lane] - H / 2})` }, svg);
      for (const px of [18, 38, 66, 86]) { el('line', { x1: px, y1: -4, x2: px, y2: 0, class: 'pin' }, g); el('line', { x1: px, y1: H, x2: px, y2: H + 4, class: 'pin' }, g); }
      el('rect', { class: 'ring', x: -4, y: -4, width: W + 8, height: H + 8, rx: 10 }, g);
      el('rect', { class: 'body', width: W, height: H, rx: 7 }, g);
      const t1 = el('text', { class: 'n', x: 9, y: 13 }, g); t1.textContent = String(i + 1).padStart(2, '0');
      const t2 = el('text', { class: 'l', x: 9, y: 28 }, g); t2.textContent = n.label;
      return g;
    });
    comet = el('path', { class: 'comet', d: '', opacity: 0 }, svg);
    sig = el('circle', { r: 5, class: 'sig', cx: xOf(0) - PIN, cy: LANE[NODES[0].lane] }, svg);
    svg.addEventListener('click', e => { const c = e.target.closest('[data-flow]'); if (c) open(+c.dataset.flow); });
    svg.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.flow) { e.preventDefault(); open(+e.target.dataset.flow); } });
  }

  function open(i) {
    const node = NODES[i], st = SC.STAGES.find(x => x.n === node.n), now = SC.stageNow();
    if (st.done() || (now && now.n === node.n)) SC.go(node.screen);
    else SC.confirmJump(node.n);
  }

  function rest(i) { const lane = NODES[Math.min(i, NODES.length - 1)].lane; sig.setAttribute('cx', (i >= NODES.length ? xOf(NODES.length - 1) + W + PIN : xOf(i) - PIN)); sig.setAttribute('cy', LANE[lane]); sig.classList.add('idle'); comet.setAttribute('opacity', 0); }
  function arrive(i) { const c = chips[i]; if (!c) return; c.classList.remove('arrive'); void c.getBBox(); c.classList.add('arrive'); }
  function travel(from, to) {
    cancelAnimationFrame(anim);
    if (reduce || to - from !== 1 || !traces[to - 1]) { rest(to); arrive(to); return; }
    const path = traces[to - 1], len = path.getTotalLength(), stop = len - PIN, tail = 26, t0 = performance.now(), dur = 900;
    comet.setAttribute('d', path.getAttribute('d')); comet.setAttribute('stroke-dasharray', `${tail} ${len + tail}`); comet.setAttribute('opacity', 1); sig.classList.remove('idle');
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2, pos = e * stop, p = path.getPointAtLength(pos);
      sig.setAttribute('cx', p.x); sig.setAttribute('cy', p.y); comet.setAttribute('stroke-dashoffset', tail - pos);
      if (k < 1) anim = requestAnimationFrame(step); else { rest(to); arrive(to); }
    };
    anim = requestAnimationFrame(step);
  }

  // Where the rehearsal is now: the chip of the current level whose page is open, else that level's first chip.
  function position(s, v, now) {
    if (!now) return NODES.length;
    const inLevel = NODES.map((n, i) => [n, i]).filter(([n]) => n.n === now.n);
    const open = inLevel.find(([n]) => ROLE_OF[n.lane] === v.role && v.at[v.role] === n.screen);
    return open ? open[1] : inLevel[0][1];
  }

  function update(s, v, now) {
    if (!svg) return;
    const next = position(s, v, now);
    chips.forEach((c, k) => { const lvl = SC.STAGES.find(x => x.n === NODES[k].n); c.classList.toggle('done', lvl.done()); c.classList.toggle('on', k === next); });
    traces.forEach((t, k) => t.classList.toggle('lit', k < next));
    vias.forEach(([k, c]) => c.classList.toggle('lit', k <= next));
    if (next !== cur) {
      const prev = cur; cur = next;
      if (prev < 0) rest(cur); else travel(prev, cur);
      const left = (Math.min(cur, NODES.length - 1) * COL + X0 + W / 2) * scale - board.clientWidth / 2;
      board.scrollTo({ left: Math.max(0, left), behavior: reduce || prev < 0 ? 'auto' : 'smooth' });
    }
  }

  document.addEventListener('DOMContentLoaded', () => { build(); SC.onShell(update); });
})();
