/* screens-web.js · SynaClair public website (Boss 11 Nov 2026): synaclair.com is one website. A visitor from Google browses without logging in;
   LINE login is asked only when they act (ขอคนนี้ / ประเมินอาการ / เข้าสู่ระบบ). Layout borrows Fastwork's calm structure (search first, categories,
   problem tiles, PT rows, articles, collapsed SEO text, full footer) in SynaClair's own colours and type. Scoped classes use the ww- prefix. */
(function () {
  'use strict';
  const { ui, esc } = SC;
  const I = ui.icon;
  document.head.insertAdjacentHTML('beforeend', `<style>
  .scr.ww { background: #fff; color: var(--ink); }
  .ww-in { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 20px; }
  .ww-sec { padding: 36px 0; }
  .ww-sec.alt { background: #f6f8f7; }
  .ww-h { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 0 0 18px; }
  .ww-h h2 { margin: 0; font: 600 21px/1.35 var(--display); color: var(--forest); letter-spacing: -.01em; }
  .ww-h .more { border: 0; background: none; padding: 6px 0; color: var(--em); font: 600 14px var(--display); display: inline-flex; align-items: center; gap: 2px; white-space: nowrap; min-height: 40px; }
  .ww-lead { margin: 6px 0 0; color: var(--sub); font-size: 15px; max-width: 46em; }
  .ww-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 22px; border: 0; border-radius: 12px; background: var(--em); color: #fff; font: 600 15px var(--display); white-space: nowrap; }
  .ww-btn:hover { background: var(--forest); }
  .ww-btn.ghost { background: #fff; color: var(--forest); box-shadow: inset 0 0 0 1px #cfdcd5; }
  .ww-btn.ghost:hover { background: var(--mint); }
  .ww-btn.sm { min-height: 40px; padding: 0 14px; font-size: 14px; border-radius: 10px; }

  /* header */
  .ww-top { position: sticky; top: 0; z-index: 6; background: #fff; border-bottom: 1px solid var(--line); }
  .ww-top .ww-in { display: flex; align-items: center; gap: 18px; min-height: 60px; }
  .ww-top img.logo { height: 30px; width: auto; display: block; }
  .ww-nav { display: none; gap: 22px; margin-left: 8px; }
  .ww-nav button { border: 0; background: none; padding: 8px 0; font: 500 14.5px var(--text); color: var(--ink); min-height: 40px; }
  .ww-nav button.on, .ww-nav button:hover { color: var(--em); }
  .ww-top .sp { flex: 1; }
  .ww-top .ib { width: 40px; height: 40px; }
  .ww-login { display: none; }

  /* hero */
  /* Hero (Boss 11 Nov, round 2): three directions from real references (Hinge Health, Luna, Sword). One photo carries the colour; chrome stays quiet.
     The photo is the sample PT cover: replace it with the team's own photo before launch. */
  .ww-hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--line); }
  .ww-hero .ww-in { position: relative; z-index: 1; display: grid; gap: 24px; }
  .ww-hero h1 { margin: 0; font: 500 32px/1.25 var(--display); color: var(--forest); letter-spacing: -.02em; }
  .ww-hero .copy { text-align: center; }
  .ww-hero .ww-match { justify-content: center; }
  .ww-hero .hph { position: relative; overflow: hidden; }
  .ww-hero .hph img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ww-hero .hph.gen img { object-position: 50% 50% !important; }
  .ww-hero.B .hph.gen, .ww-hero.C .hph.gen { aspect-ratio: 1536 / 1024 !important; }
  .ww-hero.B .hph.gen { overflow: visible; clip-path: inset(0 round 16px); } .ww-hero.C .hph.gen { overflow: visible; clip-path: inset(0 round 16px 16px 0 0); }
  .ww-hero.B .vis:has(.hph.gen) { padding-bottom: 150px; }
  .ww-hero .hcurve { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; --hcover: #fbfaf6; }
  .ww-hero.A .hcurve { --hcover: #02170f; }
  /* Logo window: pops in (soft edges), holds so the logo reads, then the head-dot grows into the full photo while the cover dissolves. The photo inside drifts slowly (1.06 -> 1). */
  .ww-hero .hcurve .cover { fill: var(--hcover); animation: wwCoverOut .9s ease-in-out 2.75s forwards; }
  .ww-hero .hcurve .zoom { transform-box: view-box; transform: scale(.8); opacity: 1; animation: wwLogoIn .9s cubic-bezier(.34,1.45,.64,1) .15s forwards, wwLogoOpen 1.4s cubic-bezier(.65,0,.35,1) 2.3s forwards; }
  .ww-hero .hcurve .soft { filter: blur(1.6px); }
  .ww-hero .hph.gen:has(.hcurve) img { transform: scale(1.06); }
  .ww-hero .hph.gen:has(.hcurve.go) img { transform: scale(1); transition: transform 4.2s cubic-bezier(.2,.8,.2,1); }
  @keyframes wwLogoIn { to { transform: scale(1); } }
  @keyframes wwLogoOpen { from { transform: scale(1); } to { transform: scale(18); } }
  @keyframes wwCoverOut { to { opacity: 0; } }
  .ww-hero .hcurve:not(.go) .cover, .ww-hero .hcurve:not(.go) .zoom { animation-play-state: paused; }
  /* Reduced motion: no zoom or drift; the logo window still shows, then the cover simply fades away */
  @media (prefers-reduced-motion: reduce) {
    .ww-hero .hcurve .zoom { animation: none; transform: none; }
    .ww-hero .hcurve .cover { animation: wwCoverOut 1s ease 1.6s forwards; }
    .ww-hero .hph.gen:has(.hcurve) img { transform: none !important; transition: none !important; }
    .ww-hero .dchip, .ww-hero .dvis > .ww-pass { animation: none !important; } }
  /* A on phone with this photo: the photo becomes a band (same shape as the photo, so the logo stays on the heads), copy below on forest */
  .ww-hero.A:has(.hph.gen) { display: block; min-height: 0; padding: 0 0 30px; background: #02170f; }
  .ww-hero.A .hph.gen { position: relative; aspect-ratio: 1536 / 1024; margin-bottom: 22px; }
  .ww-hero.A .hph.gen::after { background: linear-gradient(180deg, #02170f00 70%, #02170f 100%); }
  /* D: phone = A's photo band; desktop = centred hero (Fastwork-style search + popular words, old-home pass card and chips) */
  .ww-hero.D .hph.gen img { object-position: 50% 0% !important; }
  .ww-hero .dvis { display: contents; }
  .ww-hero .dchip, .ww-hero .dvis > .ww-pass, .ww-hero .dpop { display: none; }
  .ww-hero .hcap { position: absolute; right: 10px; top: 10px; z-index: 2; padding: 2px 8px; border-radius: 99px; font: 500 10.5px/1.6 var(--text); color: #fff; background: #0439284d; }
  /* A · scene: one full-bleed photo, a neutral forest scrim for legibility, white type */
  .ww-hero.A { min-height: 600px; display: flex; align-items: flex-end; padding: 0 0 30px; border-bottom: 0; }
  .ww-hero.A .hph { position: absolute; inset: 0; }
  .ww-hero.A .hph img { object-position: 64% 30%; }
  .ww-hero.A .hph::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, #02170f00 25%, #02170fb3 60%, #02170fe8 100%); }
  .ww-hero.A h1 { color: #fff; }
  .ww-hero.A .ww-type { color: #dfeee6; } .ww-hero.A .ww-type b { color: #fff; } .ww-hero.A .ww-type i { background: #fff; }
  .ww-hero.A .ww-match { color: #dfeee6; } .ww-hero.A .ww-match button { color: #fff; }
  .ww-hero.A .ww-search { box-shadow: none; }
  /* B · split: quiet off-white, text and one large photo, the ClairMatch pass as the one object */
  .ww-hero.B { padding: 32px 0 36px; background: #fbfaf6; }
  .ww-hero.B .hph { border-radius: 16px; aspect-ratio: 4 / 3; }
  .ww-hero.B .hph img { object-position: 60% 30%; }
  .ww-hero.B .vis { position: relative; padding-bottom: 54px; }
  .ww-hero.B .vis .ww-pass { position: absolute; left: 12px; bottom: 0; width: 230px; transform: rotate(-3deg); }
  .ww-hero.B .vis .ww-pass .bt { font-size: 11.5px; }
  .ww-hero.B .vis .ww-pass .nm b { font-size: 20px; } .ww-hero.B .vis .ww-pass .st { width: 58px; height: 58px; font-size: 13px; }
  /* C · editorial: centred large type on one soft green-to-champagne tone, the photo as a wide band below */
  .ww-hero.C { padding: 40px 0 0; background: linear-gradient(180deg, #eef5f0 0%, #f7f3e8 100%); border-bottom: 0; }
  .ww-hero.C .copy { max-width: 720px; margin: 0 auto; }
  .ww-hero.C .hph { border-radius: 16px 16px 0 0; aspect-ratio: 4 / 3; margin-top: 8px; }
  .ww-hero.C .hph img { object-position: 60% 32%; }
  .ww-type { display: block; margin-top: 8px; font: 500 17px/1.5 var(--text); color: var(--sub); min-height: 26px; }
  .ww-type b { color: var(--em); font-weight: 600; font-family: var(--text); }
  .ww-type i { display: inline-block; width: 2px; height: 1.05em; margin-left: 2px; background: var(--em); vertical-align: -2px; animation: wwBlink 1s steps(2) infinite; }
  @keyframes wwBlink { 50% { opacity: 0; } }
  .ww-search { display: flex; align-items: center; gap: 8px; margin-top: 20px; padding: 6px 6px 6px 16px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px #cfdcd5, 0 6px 18px #0439280a; }
  .ww-search:focus-within { box-shadow: inset 0 0 0 2px var(--em), 0 6px 18px #0439280f; }
  .ww-search > svg { color: var(--mute); }
  .ww-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font-size: 16px; min-height: 44px; }
  .ww-match { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 14px; font-size: 14.5px; color: var(--sub); }
  .ww-match button { display: inline-flex; align-items: center; gap: 6px; border: 0; background: none; padding: 6px 0; color: var(--em); font: 600 14.5px var(--display); min-height: 40px; text-decoration: underline; text-underline-offset: 4px; }

  /* categories */
  .ww-cats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .ww-cat { display: grid; justify-items: center; gap: 8px; padding: 16px 8px 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff; text-align: center; font: 500 13.5px/1.35 var(--text); color: var(--ink); min-height: 104px; transition: border-color .2s, transform .2s var(--ease); }
  .ww-cat:hover { border-color: #b8d0c3; transform: translateY(-2px); }
  .ww-cat .t { width: 44px; height: 44px; border-radius: 12px; background: var(--mint); color: var(--em); display: grid; place-items: center; }
  .ww-cat .t svg { width: 22px; height: 22px; }

  /* problem tiles */
  .ww-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .ww-tile { position: relative; border: 0; padding: 0; border-radius: 14px; overflow: hidden; aspect-ratio: 4 / 3; background: var(--mint); text-align: left; }
  .ww-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s var(--ease); }
  .ww-tile:hover img { transform: scale(1.04); }
  .ww-tile span { position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 12px 10px; background: linear-gradient(0deg, #021c13cc, #021c1300); color: #fff; font: 600 14.5px/1.35 var(--display); }

  /* trust */
  .ww-trust { display: grid; gap: 0; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
  .ww-trust > div { display: flex; gap: 12px; align-items: flex-start; padding: 16px; }
  .ww-trust > div + div { border-top: 1px solid var(--line); }
  .ww-trust .t { flex: none; width: 40px; height: 40px; border-radius: 10px; background: var(--mint); color: var(--em); display: grid; place-items: center; }
  .ww-trust b { display: block; font: 600 15.5px var(--display); color: var(--forest); }
  .ww-trust small { display: block; color: var(--sub); font-size: 13.5px; line-height: 1.5; }

  /* PT cards */
  .ww-row { display: grid; grid-auto-flow: column; grid-auto-columns: 78%; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; scrollbar-width: thin; }
  .ww-pt { scroll-snap-align: start; display: grid; gap: 10px; align-content: start; padding: 14px; border: 1px solid var(--line); border-radius: 14px; background: #fff; min-width: 0; text-align: left; }
  .ww-pt .who { display: flex; gap: 12px; align-items: center; min-width: 0; border: 0; background: none; padding: 0; text-align: left; }
  .ww-pt .who b { display: block; font: 600 15.5px/1.35 var(--display); color: var(--forest); overflow-wrap: anywhere; }
  .ww-pt .who small { display: block; font-size: 12.5px; color: var(--mute); }
  .ww-ver { display: inline-flex; align-items: center; gap: 4px; color: var(--em); font: 500 12.5px var(--text); }
  .ww-ver svg { width: 14px; height: 14px; }
  .ww-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 13px; color: var(--sub); }
  .ww-meta span { display: inline-flex; align-items: center; gap: 4px; }
  .ww-meta svg { width: 14px; height: 14px; color: var(--mute); }
  .ww-star { color: #b98a3e; } .ww-star b { color: var(--ink); font-family: var(--text); }
  .ww-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .ww-tags span { padding: 2px 9px; border-radius: 6px; background: #f2f5f3; color: var(--sub); font-size: 12.5px; }
  .ww-pt .acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 2px; }

  /* zone map */
  .ww-zone { display: grid; gap: 16px; }
  .ww-map { border: 1px solid var(--line); border-radius: 14px; background: #fbfcfb; padding: 10px; }
  .ww-map svg { width: 100%; height: auto; display: block; }
  .ww-map path { stroke: #fff; stroke-width: 2; cursor: pointer; transition: fill .2s; }
  .ww-zchips { display: flex; flex-wrap: wrap; gap: 8px; }
  .ww-zchips button { min-height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #cfdcd5; background: #fff; font: 500 14px var(--text); }
  .ww-zchips button.on { background: var(--em); border-color: var(--em); color: #fff; }
  .ww-zlist { display: grid; gap: 8px; }
  .ww-zlist .ww-pt { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
  .ww-zlist .acts { display: block; margin: 0; }
  .ww-none { padding: 14px; border-radius: 12px; background: #f6f8f7; color: var(--sub); font-size: 14px; }

  /* reviews */
  .ww-rv { scroll-snap-align: start; display: grid; gap: 8px; align-content: start; padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
  .ww-rv blockquote { margin: 0; font: 500 15px/1.6 var(--text); color: var(--ink); }
  .ww-rv .to { display: flex; align-items: center; gap: 8px; border: 0; background: none; padding: 6px 0 0; border-top: 1px solid var(--line); text-align: left; font-size: 13px; color: var(--sub); min-height: 44px; }

  /* articles */
  .ww-arts { display: grid; gap: 14px; }
  .ww-art { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 12px; align-items: start; border: 0; background: none; padding: 0; text-align: left; }
  .ww-art .im { aspect-ratio: 4 / 3; border-radius: 10px; overflow: hidden; background: var(--mint); display: grid; place-items: center; color: var(--em); }
  .ww-art .im img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ww-art .k { font: 500 12px var(--text); color: var(--em); }
  .ww-art b { display: block; font: 600 15px/1.45 var(--display); color: var(--forest); margin-top: 2px; }
  .ww-art small { display: block; margin-top: 4px; font-size: 12.5px; color: var(--mute); }

  /* steps */
  .ww-steps { display: grid; gap: 0; counter-reset: st; }
  .ww-steps li { list-style: none; display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 12px; padding: 12px 0; }
  .ww-steps li + li { border-top: 1px solid var(--line); }
  .ww-steps li::before { counter-increment: st; content: counter(st); width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--em); color: var(--em); display: grid; place-items: center; font: 600 14px var(--display); }
  .ww-steps b { display: block; font: 600 15.5px var(--display); color: var(--forest); }
  .ww-steps small { display: block; color: var(--sub); font-size: 13.5px; }
  .ww-steps { margin: 0; padding: 0; }

  /* ClairMatch band: the pass card is ours (owner loves it), kept still and flat */
  .ww-cm { display: grid; gap: 22px; align-items: center; padding: 22px; border: 1px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, #fbf6ec 0%, #fff 55%); }
  .ww-pass { width: 100%; max-width: 300px; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px #ecdcbc, 0 14px 30px #5a3d1414; overflow: hidden; justify-self: center; }
  .ww-pass .tp { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px 10px; }
  .ww-pass .tp img { height: 24px; }
  .ww-pass .tp small { font: 600 10.5px var(--display); letter-spacing: .08em; color: var(--gink); }
  .ww-pass .nm { padding: 0 18px 14px; } .ww-pass .nm b { display: block; font: 700 25px/1.1 var(--display); color: var(--forest); }
  .ww-pass .nm small { color: var(--sub); font-size: 12.5px; }
  .ww-pass .pf { margin: 0 16px; border-top: 2px dashed #e6d3ad; }
  .ww-pass .bt { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 18px 16px; font-size: 12.5px; color: var(--sub); }
  .ww-pass .st { width: 70px; height: 70px; border-radius: 50%; border: 2px solid var(--em); color: var(--em); display: grid; place-content: center; text-align: center; font: 700 15px/1.1 var(--display); transform: rotate(-12deg); flex: none; }
  .ww-pass .st small { font: 600 10px var(--display); }
  .ww-cm h2 { margin: 0; font: 600 21px/1.35 var(--display); color: var(--forest); }
  .ww-cm .price { margin: 8px 0 4px; font: 700 34px/1 var(--display); color: var(--forest); letter-spacing: -.02em; }
  .ww-cm ul { margin: 12px 0 18px; padding: 0; display: grid; gap: 8px; }
  .ww-cm li { list-style: none; display: flex; gap: 8px; font-size: 14.5px; color: var(--ink); }
  .ww-cm li svg { color: var(--em); margin-top: 4px; }

  /* LINE band */
  .ww-line { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; padding: 18px; border-radius: 16px; border: 1px solid var(--line); background: #fff; }
  .ww-line .lg { width: 48px; height: 48px; border-radius: 12px; background: var(--linegreen); color: #fff; display: grid; place-items: center; font: 700 12px var(--display); flex: none; }
  .ww-line .grow { flex: 1; min-width: 180px; }
  .ww-line b { display: block; font: 600 16px var(--display); color: var(--forest); }
  .ww-line small { color: var(--sub); font-size: 13.5px; }
  .ww-btn.line { background: var(--linegreen); } .ww-btn.line:hover { background: #05a849; }

  /* SEO text and FAQ */
  .ww-seo { border-top: 1px solid var(--line); padding-top: 18px; }
  .ww-seo summary, .ww-faq summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 48px; font: 600 15.5px var(--display); color: var(--forest); }
  .ww-seo summary::-webkit-details-marker, .ww-faq summary::-webkit-details-marker { display: none; }
  .ww-seo summary::after, .ww-faq summary::after { content: '+'; flex: none; width: 26px; height: 26px; border-radius: 50%; background: var(--mint); color: var(--em); display: grid; place-items: center; font-weight: 500; }
  .ww-seo[open] summary::after, .ww-faq details[open] summary::after { content: '−'; }
  .ww-seo p { margin: 0 0 10px; color: var(--sub); font-size: 14.5px; }
  .ww-faq details { border-bottom: 1px solid var(--line); }
  .ww-faq details p { margin: 0 0 14px; color: var(--sub); font-size: 14.5px; }

  /* footer */
  .ww-foot { background: var(--forest); color: #cfe0d7; padding: 30px 0 26px; font-size: 13.5px; }
  .ww-foot .cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 16px; }
  .ww-foot h3 { margin: 0 0 8px; font: 600 14px var(--display); color: #fff; }
  .ww-foot button { display: block; border: 0; background: none; padding: 5px 0; color: #cfe0d7; font: 400 13.5px var(--text); text-align: left; min-height: 32px; }
  .ww-foot button:hover { color: #fff; text-decoration: underline; }
  .ww-foot .brand { grid-column: 1 / -1; }
  .ww-foot .brand img { height: 28px; filter: brightness(0) invert(1); opacity: .95; }
  .ww-foot .ww-ph { background: #ffffff1a; color: #fff; border-bottom-color: #ffffff88; }
  .ww-foot .legal { margin-top: 22px; padding-top: 14px; border-top: 1px solid #ffffff22; display: flex; flex-wrap: wrap; gap: 6px 16px; color: #a9c4b7; font-size: 12.5px; }

  /* inner pages */
  .ww-crumb { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; padding: 14px 0 0; font-size: 13px; color: var(--mute); }
  .ww-crumb button { border: 0; background: none; padding: 4px 0; color: var(--em); font: 400 13px var(--text); min-height: 32px; }
  .ww-crumb svg { width: 14px; height: 14px; }
  .ww-page-h { padding: 10px 0 24px; border-bottom: 1px solid var(--line); }
  .ww-page-h h1 { margin: 0; font: 600 28px/1.3 var(--display); color: var(--forest); letter-spacing: -.02em; }
  .ww-page-h p { margin: 10px 0 0; color: var(--sub); font-size: 15.5px; max-width: 44em; }
  .ww-cmb { display: grid; gap: 14px; padding: 18px; border-radius: 16px; background: #f4f8f6; border: 1px solid #dbe7e0; }
  .ww-cmb .hd { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .ww-cmb .hd b { font: 600 17px var(--display); color: var(--forest); }
  .ww-cmb .tag { padding: 2px 9px; border-radius: 6px; background: var(--em); color: #fff; font: 600 12px var(--display); }
  .ww-cmb .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .ww-cmb .grid button { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 52px; padding: 8px 12px; border: 1px solid #dbe7e0; border-radius: 12px; background: #fff; font: 500 14px/1.35 var(--text); color: var(--ink); text-align: left; }
  .ww-cmb .grid button span.go { flex: none; font: 600 12.5px var(--display); color: var(--em); display: inline-flex; align-items: center; gap: 2px; }
  .ww-note { font-size: 12.5px; color: var(--mute); }
  .ww-art-h .by { display: flex; align-items: center; gap: 10px; margin-top: 16px; flex-wrap: wrap; font-size: 13.5px; color: var(--sub); }
  .ww-art-h .by b { color: var(--forest); font-family: var(--display); }
  .ww-rev { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; background: var(--mint); color: var(--em); font: 500 13px var(--text); }
  .ww-rev.wait { background: #fff6dc; color: var(--gink); }
  .ww-hero-im { margin: 22px 0 0; border-radius: 14px; overflow: hidden; aspect-ratio: 16 / 9; background: var(--mint); }
  .ww-hero-im img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ww-body p { font-size: 16.5px; line-height: 1.8; color: var(--ink); margin: 0 0 14px; }
  .ww-two { display: grid; gap: 20px; }
  .ww-box { padding: 18px; border: 1px solid var(--line); border-radius: 14px; background: #fff; display: grid; gap: 10px; align-content: start; }
  .ww-box h3 { margin: 0; font: 600 16px var(--display); color: var(--forest); }
  .ww-team { display: grid; gap: 10px; }
  .ww-team > div { display: flex; gap: 12px; align-items: center; padding: 14px; border: 1px solid var(--line); border-radius: 14px; }
  .ww-team b { display: block; font: 600 15.5px var(--display); color: var(--forest); }
  .ww-team small { color: var(--sub); font-size: 13px; }
  .ww-ph { display: inline-block; padding: 0 6px; border-radius: 4px; background: #fff6dc; color: var(--gink); border-bottom: 1.5px dashed var(--gold); font-size: 13px; }
  .ww-name { display: grid; gap: 14px; }
  .ww-name > div { padding: 18px; border-radius: 14px; border: 1px solid var(--line); }
  .ww-name strong { display: block; font: 700 40px/1 var(--display); color: var(--em); letter-spacing: -.03em; }
  .ww-name > div + div strong { color: var(--forest); }
  .ww-name p { margin: 10px 0 0; color: var(--sub); font-size: 14.5px; }

  @container (min-width: 720px) {
    .ww-in { padding: 0 32px; }
    .ww-sec { padding: 52px 0; }
    .ww-nav, .ww-login { display: flex; }
    .ww-menu { display: none !important; }
    .ww-hero h1 { font-size: 48px; }
    .ww-hero.A { min-height: 600px; align-items: center; padding: 0; }
    .ww-hero.A:has(.hph.gen) { display: flex; min-height: 600px; padding: 0; background: none; }
    .ww-hero.A .hph.gen { position: absolute; aspect-ratio: auto; margin: 0; }
    .ww-hero.A .hph.gen::after { background: linear-gradient(90deg, #02170fe0 0%, #02170fa6 34%, #02170f00 56%); }
    .ww-hero.A .hph img { object-position: 70% 30%; }
    .ww-hero.A .hph::after { background: linear-gradient(90deg, #02170fe0 0%, #02170fa6 38%, #02170f00 66%); }
    .ww-hero.A .copy { max-width: 540px; text-align: left; } .ww-hero.A .ww-match { justify-content: flex-start; }
    .ww-hero.B { padding: 56px 0; }
    .ww-hero.B .ww-in { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); align-items: center; gap: 56px; }
    .ww-hero.B .copy { text-align: left; } .ww-hero.B .ww-match { justify-content: flex-start; }
    .ww-hero.B .vis .ww-pass { left: -28px; width: 250px; }
    .ww-hero.C { padding-top: 72px; }
    .ww-hero.C h1 { font-size: 56px; }
    .ww-hero.C .hph { aspect-ratio: 21 / 8; margin-top: 24px; }
    .ww-hero.A.D:has(.hph.gen) { display: flex; flex-direction: column; min-height: 0; padding: 20px 0 64px; border-bottom: 0;
      background: radial-gradient(60% 55% at 50% 0%, #dff0e6 0%, #dff0e600 70%), radial-gradient(45% 45% at 85% 90%, #f6e7c8 0%, #f6e7c800 70%), linear-gradient(180deg, #f6fbf8 0%, #fbf6ec 100%); }
    .ww-hero.A.D .ww-in { width: 100%; margin-top: -24px; position: relative; z-index: 2; }
    .ww-hero.A.D .copy { max-width: 780px; margin: 0 auto; text-align: center; display: grid; justify-items: center; gap: 16px; }
    .ww-hero.A.D h1 { color: var(--forest); font-size: 56px; line-height: 1.15; }
    .ww-hero.A.D .ww-type { color: #46605a; font-size: 19px; } .ww-hero.A.D .ww-type b { color: #0e7a55; } .ww-hero.A.D .ww-type i { background: #0e7a55; }
    .ww-hero.A.D .ww-search { width: 100%; max-width: 680px; padding: 8px 8px 8px 20px; border-radius: 99px; box-shadow: 0 0 0 1px #d5efe1, 0 18px 40px -18px #0439283d; }
    .ww-hero.A.D .ww-search input { font-size: 16px; }
    .ww-hero.A.D .ww-search .ww-btn { border-radius: 99px; padding: 0 26px; }
    .ww-hero.A.D .ww-match { color: #46605a; justify-content: center; } .ww-hero.A.D .ww-match button { color: #0e7a55; }
    .ww-hero.D .dpop { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px; font: 500 13.5px/1 var(--text); color: #46605a; }
    .ww-hero.D .dpop button { padding: 8px 14px; border-radius: 99px; border: 1px solid #d5efe1; background: #ffffffcc; color: #1d3a31; font: 500 13.5px/1 var(--text); cursor: pointer; }
    .ww-hero.D .dpop button:hover { border-color: #0e7a55; color: #0e7a55; }
    .ww-hero.D .dvis { display: block; position: relative; width: min(1120px, calc(100% - 160px)); margin: 0 auto; }
    .ww-hero.A.D .hph.gen { position: relative; aspect-ratio: 2 / 1; margin: 0; overflow: hidden;
      -webkit-mask-image: radial-gradient(closest-side, #000 72%, #0000 100%); mask-image: radial-gradient(closest-side, #000 72%, #0000 100%); -webkit-mask-size: 100% 100%; mask-size: 100% 100%; }
    .ww-hero.A.D .hph.gen::after { display: none; }
    .ww-hero.D .hcurve { --hcover: #eef6f1; }
    .ww-hero.D .dvis > .ww-pass { display: block; position: absolute; left: -40px; bottom: 70px; width: 230px; z-index: 3; transform: rotate(-6deg); animation: wwFloat 5.5s cubic-bezier(.45,0,.55,1) infinite; }
    .ww-hero.D .dvis > .ww-pass .bt { font-size: 11.5px; } .ww-hero.D .dvis > .ww-pass .nm b { font-size: 20px; } .ww-hero.D .dvis > .ww-pass .st { width: 58px; height: 58px; font-size: 13px; }
    .ww-hero.D .dchip { display: flex; position: absolute; z-index: 3; align-items: center; gap: 10px; padding: 10px 16px 10px 10px; border-radius: 99px; background: #fff; box-shadow: 0 0 0 1px #e3efe8, 0 16px 34px -16px #0439284d; text-align: left; animation: wwFloat 5s cubic-bezier(.45,0,.55,1) infinite; }
    .ww-hero.D .dchip .t { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 12px; background: #e9f6ef; color: #0e7a55; flex: none; }
    .ww-hero.D .dchip .t svg { width: 18px; height: 18px; }
    .ww-hero.D .dchip b { display: block; font: 600 13.5px/1.3 var(--text); color: #073d2c; } .ww-hero.D .dchip small { display: block; font: 400 12px/1.35 var(--text); color: #46605a; }
    .ww-hero.D .dchip.c1 { right: -40px; top: 22%; animation-delay: -1.6s; }
    .ww-hero.D .dchip.c2 { right: -20px; bottom: 26%; animation-delay: -3.2s; }
    @keyframes wwFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8px; } }
    .ww-cats { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .ww-tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .ww-trust { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ww-trust > div + div { border-top: 0; border-left: 1px solid var(--line); }
    .ww-row { grid-auto-flow: row; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: visible; }
    .ww-row.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .ww-zone { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; }
    .ww-arts { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    .ww-art { grid-template-columns: minmax(0, 1fr); }
    .ww-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
    .ww-steps li { grid-template-columns: minmax(0, 1fr); padding: 0; }
    .ww-steps li + li { border-top: 0; }
    .ww-cm { grid-template-columns: 320px minmax(0, 1fr); padding: 32px; }
    .ww-foot .cols { grid-template-columns: 1.4fr repeat(4, minmax(0, 1fr)); }
    .ww-foot .brand { grid-column: auto; }
    .ww-page-h h1 { font-size: 38px; }
    .ww-cmb .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .ww-two { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); align-items: start; }
    .ww-team { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ww-name { grid-template-columns: 1fr 1fr; }
    .ww-name strong { font-size: 64px; }
  }
  </style>`);

  /* ---------------- data ---------------- */
  /* Palm's 6 service groups (clinical matching v2.3), in patient words. Sub-problems and page copy wait for the Clinical Lead (Q-G). */
  const SVC = {
    MSK: { icon: 'bone', name: 'ปวดกล้ามเนื้อ ข้อ หลัง คอ', h1: ['ปวดหลัง คอ บ่า ข้อ', 'กายภาพบำบัดที่บ้าน'], tags: ['กระดูกและข้อ', 'ปวดหลัง', 'ออฟฟิศซินโดรม'],
      intro: 'ปวดหลัง ปวดคอ บ่า ไหล่ ปวดเข่า หรือออฟฟิศซินโดรม นักกายภาพประเมินที่บ้านแล้วสอนท่าที่ทำต่อเองได้',
      subs: ['ปวดหลัง', 'ปวดคอ บ่า ไหล่', 'ปวดเข่า', 'ออฟฟิศซินโดรม'] },
    ORTHO: { icon: 'bandage', name: 'หลังผ่าตัดและกระดูกหัก', h1: ['ฟื้นฟูหลังผ่าตัด', 'กายภาพบำบัดที่บ้าน'], tags: ['หลังผ่าตัด'],
      intro: 'หลังผ่าตัดเปลี่ยนข้อเข่า สะโพก ผ่าตัดหลัง หรือกระดูกหัก ฝึกเดินและเคลื่อนไหวในบ้านจริงของคุณ',
      subs: ['ผ่าตัดเปลี่ยนข้อเข่า', 'ผ่าตัดสะโพก', 'กระดูกหัก', 'ผ่าตัดหลัง'] },
    NEURO: { icon: 'brain', name: 'สโตรกและระบบประสาท', h1: ['ฟื้นฟูหลังสโตรก', 'กายภาพบำบัดที่บ้าน'], tags: ['สโตรก', 'ฝึกเดิน'],
      intro: 'อัมพฤกษ์ อัมพาต พาร์กินสัน หรือโรคทางสมอง ฝึกการเคลื่อนไหวและการใช้มือในชีวิตประจำวัน',
      subs: ['หลังสโตรก', 'อ่อนแรงครึ่งซีก', 'พาร์กินสัน', 'ฝึกเดิน'] },
    GERI: { icon: 'person-standing', name: 'ผู้สูงอายุ', h1: ['ผู้สูงอายุ ทรงตัว ป้องกันล้ม', 'กายภาพบำบัดที่บ้าน'], tags: ['ผู้สูงอายุ', 'ป้องกันล้ม'],
      intro: 'เดินไม่มั่นคง เคยหกล้ม หรือลุกนั่งลำบาก นักกายภาพดูทั้งร่างกายและบ้าน เพื่อให้เดินในบ้านได้ปลอดภัย',
      subs: ['ทรงตัวไม่ดี', 'เคยหกล้ม', 'ลุกนั่งลำบาก', 'กล้ามเนื้ออ่อนแรง'] },
    BED: { icon: 'bed', name: 'ผู้ป่วยติดเตียง', h1: ['ผู้ป่วยติดเตียง', 'กายภาพบำบัดที่บ้าน'], tags: ['ติดเตียง'],
      intro: 'จัดท่า พลิกตัว ฝึกลุกนั่ง และสอนผู้ดูแลให้ช่วยได้ถูกท่า',
      subs: ['จัดท่าและพลิกตัว', 'ฝึกลุกนั่ง', 'สอนผู้ดูแล', 'ป้องกันข้อติด'] },
    CARDIO: { icon: 'heart-pulse', name: 'หัวใจและปอด', h1: ['ฟื้นฟูหัวใจและปอด', 'กายภาพบำบัดที่บ้าน'], tags: [],
      intro: 'เหนื่อยง่ายหลังป่วย หรือแพทย์ให้ฝึกฟื้นฟูหัวใจและปอด ทีมคลินิกดูข้อมูลก่อนส่งงานทุกครั้ง',
      subs: ['เหนื่อยง่ายหลังป่วย', 'หลังโรคปอด', 'ฟื้นฟูหัวใจตามแพทย์สั่ง', 'ฝึกหายใจ'],
      note: 'ไม่รับดูดเสมหะ (งานนี้ล็อกไว้และไม่จับคู่อัตโนมัติ)' }
  };
  const ORDER = ['MSK', 'ORTHO', 'NEURO', 'GERI', 'BED', 'CARDIO'];
  const TILES = [['neck.jpg', 'ปวดคอ บ่า หลัง จากการทำงาน', 'MSK'], ['post-surgery.jpg', 'หลังผ่าตัดเข่า สะโพก', 'ORTHO'], ['stroke.jpg', 'ฝึกเดินหลังสโตรก', 'NEURO'], ['elderly.jpg', 'ผู้สูงอายุ ป้องกันล้ม', 'GERI']];
  const TYPED = ['คุณแม่หลังผ่าตัดเข่า', 'คุณพ่อที่เพิ่งเป็นสโตรก', 'คนที่ปวดหลังจากงาน', 'ผู้สูงอายุที่เดินไม่มั่นคง'];
  const SLUG = { me: 'boss-7f3a', s1: 'fon-2c81', s2: 'wichai-91d0', s3: 'mind-4b7e', s4: 'ton-58a2', s5: 'pui-0e6c', s6: 'beer-73f1', s7: 'fah-a9d4', s8: 'non-16bb' };
  const ZFILL = { Z01: '#d9e9e0', Z02: '#cfe3d8', Z03: '#e3efe8', Z04: '#d4e6dc', Z05: '#dcebe3', Z06: '#e8f1ec' };
  const FAQ = [
    ['ครั้งแรกราคาเท่าไหร่ ใช้เวลานานแค่ไหน', 'ClairMatch ฿1,599 ราคาเดียวทุกพื้นที่ ประเมินและรักษาครั้งแรกที่บ้าน ไม่เกิน 90 นาที'],
    ['ต้องลงแอปไหม', 'ไม่ต้อง ใช้ LINE ที่มีอยู่แล้ว นัด จ่าย และรับสรุปผลในแชตเดียว'],
    ['ลูกหลานทำแบบประเมินแทนได้ไหม', 'ได้ ใช้เวลาไม่ถึง 3 นาที'],
    ['เลือกนักกายภาพเองได้ไหม', 'ได้ ดูโปรไฟล์แล้วกด "ขอคนนี้" จากนั้นประเมินอาการตามปกติ หรือให้ทีมจับคู่ให้ก็ได้'],
    ['รู้ได้อย่างไรว่ามีใบประกอบวิชาชีพจริง', 'ทีมเทียบชื่อและเลขกับระบบของสภากายภาพบำบัดก่อนผู้รับบริการจะเห็นโปรไฟล์'],
    ['ถ้าฉุกเฉินต้องทำอย่างไร', 'โทร 1669 ทันที SynaClair ไม่ใช่บริการฉุกเฉิน']
  ];

  /* ---------------- helpers ---------------- */
  const P = () => SC.pp;
  const logged = s => !!s.patient.seenLoading;
  const slug = id => SLUG[id] || 'pt';
  const ptsFor = (s, tags) => P().ranked(s).filter(p => !tags || p.tags.some(t => tags.includes(t)));
  const posts = s => { const seen = new Set(); return P().allPts(s).flatMap(p => (P().worksOf ? P().worksOf(p) : []).slice(0, 2).map((w, i) => ({ p, w, i })))
    .filter(x => x.w && x.w.text && !(x.w.image && seen.has(x.w.image)) && (seen.add(x.w.image), true)); };
  const typeOf = w => w.video ? 'คลิป' : w.image ? 'บทความ' : 'เคล็ดลับ';
  const rate = r => r ? `<span class="ww-star">${I('star')} <b>${r.average.toFixed(1)}</b> (${r.count} รีวิว)</span>` : '<span>นักกายภาพใหม่ใน SynaClair</span>';

  function header(s, on) {
    const nav = [['p.feed', 'หน้าแรก', 'home'], ['w.svc', 'บริการ', 'svc'], ['p.find', 'นักกายภาพ', 'find'], ['w.articles', 'บทความ', 'art'], ['w.about', 'เกี่ยวกับเรา', 'about']];
    return `<header class="ww-top"><div class="ww-in">
      <button class="ib" data-go="p.feed" aria-label="หน้าแรก SynaClair" style="width:auto;height:auto;border-radius:6px;padding:4px 0"><img class="logo" src="a/synaclair-logo.svg" alt="SynaClair"></button>
      <nav class="ww-nav" aria-label="เมนูเว็บ">${nav.slice(1).map(([g, t, k]) => `<button data-go="${g}" ${g === 'w.svc' ? 'data-p-group="GERI"' : ''} class="${on === k ? 'on' : ''}">${t}</button>`).join('')}</nav>
      <span class="sp"></span>
      <button class="ib" data-go="p.find" aria-label="ค้นหานักกายภาพ">${I('search')}</button>
      ${logged(s) ? `<button class="ww-btn sm ghost ww-login" data-go="p.feed">${I('user-round')}หน้าของฉัน</button>` : `<button class="ww-btn sm ghost ww-login" data-act="webLogin">เข้าสู่ระบบ</button>`}
      <button class="ib ww-menu" data-act="webMenu" aria-label="เปิดเมนู">${I('menu')}</button>
    </div></header>`;
  }
  function footer() {
    return `<footer class="ww-foot"><div class="ww-in">
      <div class="cols">
        <div class="brand"><img src="a/synaclair-logo.svg" alt="SynaClair"><p style="margin:10px 0 0">The right connection to better care.<br>เพราะการดูแลที่ดี เริ่มต้นจากคนที่ใช่</p></div>
        <div><h3>บริการ</h3>${ORDER.map(g => `<button data-go="w.svc" data-p-group="${g}">${esc(SVC[g].name)}</button>`).join('')}</div>
        <div><h3>วิธีใช้บริการ</h3><button data-go="w.about" data-p-sec="steps">ขั้นตอนการใช้บริการ</button><button data-go="w.about" data-p-sec="vet">เราตรวจนักกายภาพอย่างไร</button><button data-go="w.articles">บทความ</button><button data-go="w.about" data-p-sec="faq">คำถามที่พบบ่อย</button></div>
        <div><h3>เกี่ยวกับเรา</h3><button data-go="w.about">เกี่ยวกับ SynaClair</button><button data-act="webPolicy" data-k="terms">ข้อตกลงการใช้บริการ</button><button data-act="webPolicy" data-k="privacy">นโยบายความเป็นส่วนตัว</button></div>
        <div><h3>ติดต่อ</h3><button data-act="webLine">LINE @678zucgo</button><p style="margin:4px 0 0">ทีมตอบทุกวัน 08:00–22:00 น.<br>นักกายภาพรับเคส 08:00–20:00 น.</p></div>
      </div>
      <div class="legal"><span>ไม่ใช่บริการฉุกเฉิน · ฉุกเฉินโทร 1669</span><span class="ww-ph">[ชื่อบริษัทตามทะเบียน]</span><span>ภาพประกอบจาก Pexels และภาพหัวเว็บสร้างด้วย AI</span><span>แผนที่เขต: OpenGISData-Thailand (CC BY 4.0)</span></div>
    </div></footer>`;
  }
  function ptCard(s, p, compact) {
    const P0 = P();
    return `<article class="ww-pt" aria-label="${esc(p.name)}">
      <button class="who" data-act="openPt" data-id="${p.id}" aria-label="ดูโปรไฟล์ ${esc(p.name)}">${P0.plAv(p, compact ? 48 : 56)}<span style="min-width:0"><b>${esc(p.name)} ${p.sample ? ui.sample() : ''}</b><small>นักกายภาพบำบัด</small><span class="ww-ver">${I('badge-check')}ใบประกอบวิชาชีพ ตรวจสอบได้</span></span></button>
      ${compact ? '' : `<div class="ww-meta">${rate(p.rating)}${p.zones.length ? `<span>${I('map-pin')}${esc(p.zones.slice(0, 2).join(' · '))}</span>` : ''}</div>
      ${p.tags.length ? `<div class="ww-tags">${p.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}`}
      <div class="acts">${compact ? `<button class="ww-btn sm ghost" data-act="openPt" data-id="${p.id}">ดูโปรไฟล์</button>` : `<button class="ww-btn sm ghost" data-act="openPt" data-id="${p.id}">ดูโปรไฟล์</button><button class="ww-btn sm" data-act="choosePt" data-id="${p.id}">ขอคนนี้</button>`}</div>
    </article>`;
  }
  const pass = () => `<div class="ww-pass" aria-label="บัตร ClairMatch ครั้งแรก 1,599 บาท"><div class="tp"><img src="a/synaclair-logo.svg" alt=""><small>FIRST VISIT</small></div>
    <div class="nm"><b>ClairMatch</b><small>ประเมินและรักษาครั้งแรกที่บ้านคุณ</small></div><div class="pf"></div>
    <div class="bt"><span>ครั้งแรก · ไม่เกิน 90 นาที<br>สรุปผลใน LINE ภายใน 2 ชม.</span><span class="st">฿1,599<small>ทุกพื้นที่</small></span></div></div>`;
  function cmBand() {
    return `<section class="ww-cm" aria-labelledby="ww-cm-h">${pass()}<div>
      <h2 id="ww-cm-h">ครั้งแรกกับ SynaClair</h2><p class="price">฿1,599</p><p class="ww-note" style="margin:0">ClairMatch · ราคาเดียวทุกพื้นที่</p>
      <ul><li>${I('check')}ประเมินอาการที่บ้านคุณ แล้วรักษาครั้งแรกทันที</li><li>${I('check')}ไม่เกิน 90 นาที</li><li>${I('check')}สรุปผลและท่าฝึกส่งเข้า LINE ภายใน 2 ชม.</li></ul>
      <button class="ww-btn" data-act="webAssess">${I('clipboard-check')}เริ่มประเมินอาการ</button></div></section>`;
  }
  const lineBand = () => `<div class="ww-line"><span class="lg">LINE</span><div class="grow"><b>นัด จ่าย และรับสรุปผลใน LINE</b><small>ไม่ต้องลงแอปเพิ่ม · ทีมตอบทุกวัน 08:00–22:00 น.</small></div><button class="ww-btn line" data-act="webLine">${I('plus')}เพิ่มเพื่อน @678zucgo</button></div>`;
  const faqHtml = () => `<div class="ww-faq">${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
  function zoneMap(s) {
    const zc = s.patient.webZone || 'Z03', z = SC.ZONES.find(x => x.code === zc) || SC.ZONES[0];
    const list = P().ranked(s).filter(p => p.zones.some(d => z.districts.includes(d)));
    const B = window.BKK;
    const svg = B ? `<svg viewBox="0 0 ${B.w} ${B.h}" role="img" aria-label="แผนที่ 6 โซน 50 เขตในกรุงเทพฯ">${B.d.map(d => `<path d="${d.p}" fill="${d.z === zc ? '#00583e' : ZFILL[d.z] || '#e3efe8'}" data-act="webZone" data-z="${d.z}"><title>${esc(d.n)}</title></path>`).join('')}</svg>` : '';
    return `<div class="ww-zone"><div class="ww-map">${svg}</div><div style="display:grid;gap:12px;align-content:start">
      <div class="ww-zchips" role="group" aria-label="เลือกโซน">${SC.ZONES.map(x => `<button data-act="webZone" data-z="${x.code}" class="${x.code === zc ? 'on' : ''}" aria-pressed="${x.code === zc}">${esc(x.name)}</button>`).join('')}</div>
      <p class="ww-note" style="margin:0">${esc(z.name)}: ${esc(z.districts.join(' · '))}</p>
      <div class="ww-zlist">${list.length ? list.slice(0, 3).map(p => ptCard(s, p, true)).join('') : `<p class="ww-none">ยังไม่มีนักกายภาพที่ตรวจแล้วในโซนนี้ · ให้ทีมช่วยหาได้ ทีมติดต่อกลับใน LINE</p>`}</div>
      <p class="ww-note" style="margin:0">พบ ${list.length} คนในโซนนี้ <span class="ww-ph">[เขตที่เปิดจริงรอ Boss ยืนยัน]</span></p></div></div>`;
  }
  function articleRow(s, n) {
    const list = posts(s).slice(0, n || 3);
    if (!list.length) return '<p class="ww-none">ยังไม่มีบทความ</p>';
    return `<div class="ww-arts">${list.map(({ p, w, i }) => `<button class="ww-art" data-go="w.article" data-p-id="${p.id}" data-p-i="${i}">
      <span class="im">${w.image ? `<img src="${esc(w.image)}" alt="">` : I('lightbulb')}</span>
      <span><span class="k">${typeOf(w)}</span><b>${esc(w.text)}</b><small>${esc(p.name)} ${p.sample ? '· ตัวอย่าง' : ''}</small></span></button>`).join('')}</div>`;
  }

  function heroHtml(s) {
    const v = s.patient.webHero || 'D';
    const copy = `<div class="copy"><h1>นักกายภาพบำบัด<br>ถึงบ้านคุณ</h1>
        <span class="ww-type" aria-live="off">สำหรับ<b data-ww-type> ${esc(TYPED[0])}</b><i aria-hidden="true"></i></span>
        <form class="ww-search" data-ww-search role="search">${I('search')}<input data-bind="patient.q" value="${esc(s.patient.q || '')}" placeholder="ค้นหาอาการ เขต หรือชื่อนักกายภาพ" aria-label="ค้นหาอาการ เขต หรือชื่อนักกายภาพ"><button class="ww-btn sm" data-go="p.find">ค้นหา</button></form>
        <div class="ww-match">ไม่รู้จะเลือกใคร?<button data-act="webAssess">ให้ทีมช่วยหา · ประเมินไม่ถึง 3 นาที</button></div>
        <div class="dpop">ค้นหาบ่อย:${[['ปวดคอ บ่า หลัง', 'MSK'], ['หลังผ่าตัดเข่า', 'ORTHO'], ['ฝึกเดินหลังสโตรก', 'NEURO'], ['ผู้สูงอายุ ป้องกันล้ม', 'GERI'], ['ผู้ป่วยติดเตียง', 'BED']].map(([t, g]) => `<button data-go="w.svc" data-p-group="${g}">${t}</button>`).join('')}</div></div>`;
    /* Generated photo (ChatGPT, 12 Nov, 1536x1024, Boss-approved pose that echoes the logo): no faces. Intro: the photo first shows only through a window cut in the exact logo (paths from a/synaclair-icon.svg), its two dots on the two real heads, then the window opens to the full photo. */
    const photo = `<div class="hph gen"><img src="a/hero-home-visit.jpg" alt="ภาพประกอบ: นักกายภาพประคองเอวคุณยายด้วยเข็มขัดพยุงขณะฝึกเดินในบ้าน">
        <svg class="hcurve" viewBox="0 0 1536 1024" preserveAspectRatio="${v === 'D' ? 'xMidYMin' : 'xMidYMid'} slice" aria-hidden="true">
          <mask id="wwLogoWin" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><rect x="-2000" y="-2000" width="5000" height="5000" fill="#fff"/>
            <g class="zoom" style="transform-origin:848px 228px"><g class="soft"><g transform="translate(648 190) rotate(10.9) scale(1.342) translate(-117.5 -144)"><g transform="translate(41 108)"><g transform="scale(0.25) translate(0.000000,1216.000000) scale(0.100000,-0.100000)"><path fill="#000" d="M3241 12140 c-21 -18 -39 -20 -201 -20 -150 0 -187 -3 -240 -20 -34 -11 -71 -20 -80 -20 -46 0 -298 -93 -354 -131 -33 -21 -86 -49 -118 -60 -46 -17 -68 -33 -105 -78 -27 -31 -101 -110 -166 -175 -92 -93 -126 -135 -154 -190 -20 -39 -48 -87 -63 -106 -60 -77 -120 -247 -120 -340 0 -32 -9 -86 -20 -120 -29 -90 -29 -310 0 -400 11 -34 20 -70 20 -80 0 -81 142 -388 227 -490 120 -144 140 -166 198 -228 41 -44 82 -75 130 -99 39 -20 86 -48 105 -63 78 -61 362 -160 460 -160 31 0 86 -9 120 -20 50 -16 90 -20 199 -20 85 0 156 -6 189 -14 80 -22 166 4 253 75 55 46 87 59 140 59 56 0 100 21 133 64 16 22 49 46 79 60 31 13 63 38 80 59 15 20 64 64 107 97 50 38 87 75 100 99 10 21 37 53 59 70 38 31 101 135 101 170 1 24 37 100 75 156 20 30 40 77 49 115 8 36 22 97 31 135 9 39 23 89 31 113 21 62 18 187 -6 262 -11 34 -20 72 -20 84 -1 11 -8 39 -16 61 -8 22 -19 75 -24 117 -6 51 -19 96 -39 135 -16 33 -34 85 -40 116 -13 71 -13 71 -86 153 -33 37 -68 80 -77 96 -25 40 -158 171 -207 203 -22 15 -52 43 -67 62 -14 19 -49 45 -77 58 -29 14 -72 36 -96 50 -24 14 -54 25 -67 25 -86 0 -252 87 -270 142 -8 27 -139 26 -173 -2z"/><path fill="#000" d="M14875 12093 c-33 -14 -117 -45 -187 -69 -137 -47 -253 -101 -308 -144 -19 -15 -58 -39 -87 -54 -28 -14 -69 -46 -90 -71 -21 -26 -54 -56 -73 -67 -81 -48 -170 -169 -170 -229 0 -10 -16 -41 -36 -70 -65 -98 -63 -92 -120 -339 -8 -36 -22 -84 -30 -108 -23 -71 -20 -381 6 -462 11 -34 20 -71 20 -80 0 -38 101 -321 152 -427 63 -129 70 -140 113 -157 18 -8 72 -53 121 -101 51 -51 108 -96 134 -108 25 -11 65 -35 89 -54 24 -18 50 -33 56 -33 7 0 37 -16 66 -36 116 -78 374 -160 439 -139 10 3 45 -1 78 -10 74 -19 229 -19 299 -1 46 12 60 12 109 -1 68 -17 95 -12 146 29 22 17 83 45 141 65 108 37 151 59 183 94 10 12 39 30 64 41 24 10 67 38 95 62 27 23 67 52 87 65 20 12 47 39 59 59 13 20 44 62 69 92 26 30 55 69 63 85 9 17 42 57 73 90 63 68 84 108 84 162 0 64 19 111 68 171 47 57 47 57 50 302 3 246 3 246 -34 355 -20 61 -40 142 -45 182 -8 74 -32 133 -79 193 -15 19 -34 49 -43 65 -8 17 -86 102 -172 190 -87 88 -172 183 -190 211 -40 63 -130 113 -321 178 -71 24 -156 55 -189 69 -60 27 -60 27 -345 27 -285 0 -285 0 -345 -27z"/><path fill="#000" d="M13175 8829 c-22 -6 -49 -7 -60 -4 -21 5 -138 -17 -220 -43 -28 -9 -108 -18 -180 -22 -119 -6 -135 -9 -191 -37 -33 -17 -89 -37 -124 -43 -36 -6 -73 -16 -84 -22 -11 -6 -61 -14 -112 -18 -87 -6 -97 -9 -154 -48 -34 -22 -83 -48 -108 -57 -26 -9 -66 -24 -89 -32 -23 -8 -68 -32 -99 -53 -54 -36 -175 -81 -255 -94 -39 -7 -134 -70 -192 -128 -22 -22 -61 -45 -98 -59 -44 -16 -69 -33 -92 -61 -17 -21 -51 -51 -76 -67 -26 -16 -116 -97 -201 -181 -85 -84 -175 -165 -200 -181 -60 -37 -120 -126 -227 -334 -88 -170 -88 -170 -88 -485 0 -359 -3 -346 95 -460 25 -30 56 -71 68 -92 13 -20 45 -51 72 -68 27 -17 59 -48 71 -68 56 -94 134 -158 210 -172 29 -6 75 -24 102 -42 42 -27 62 -33 141 -39 50 -4 109 -15 131 -23 138 -52 435 3 565 104 19 15 67 44 105 63 39 20 86 51 105 69 83 79 110 96 160 107 29 6 69 24 89 40 20 16 63 40 96 54 115 48 160 66 208 82 26 9 71 33 100 53 91 63 198 92 336 92 91 0 133 5 181 20 48 15 90 20 179 20 67 0 138 6 169 14 44 12 60 12 105 0 28 -7 70 -14 92 -14 22 -1 58 -8 80 -17 26 -10 91 -17 190 -22 150 -6 150 -6 210 -44 33 -20 68 -37 76 -37 9 0 47 -20 85 -45 37 -25 93 -54 123 -66 30 -11 71 -33 92 -50 21 -16 82 -45 136 -64 93 -33 102 -38 174 -112 41 -43 128 -129 192 -191 65 -63 126 -130 136 -151 11 -20 55 -72 98 -116 43 -44 99 -105 124 -135 46 -56 77 -93 139 -163 40 -46 83 -67 138 -67 44 0 197 -47 263 -80 27 -14 58 -22 81 -20 36 2 77 2 216 -1 111 -3 419 93 493 153 24 20 62 41 85 47 50 13 76 42 164 181 14 22 37 56 51 77 84 124 101 158 144 286 81 247 65 508 -44 737 -17 36 -31 72 -31 80 0 22 -32 68 -85 125 -26 28 -56 70 -67 95 -13 29 -51 73 -105 124 -46 43 -91 92 -100 110 -9 17 -46 65 -83 106 -37 41 -74 89 -83 105 -21 42 -143 162 -198 197 -26 16 -60 45 -75 65 -34 45 -100 113 -130 133 -12 8 -54 44 -94 80 -40 36 -84 72 -99 80 -15 8 -45 27 -67 43 -105 74 -142 98 -175 116 -20 11 -63 50 -96 86 -59 66 -59 66 -130 75 -61 8 -99 23 -251 99 -98 49 -198 95 -222 101 -25 7 -67 23 -94 37 -58 29 -181 71 -250 84 -27 5 -70 22 -95 38 -48 31 -180 66 -241 64 -44 -2 -179 22 -237 42 -34 12 -97 15 -282 15 -211 0 -246 2 -301 20 -69 22 -306 27 -385 9z"/><path fill="#000" d="M3960 8780 c-30 -10 -65 -19 -76 -19 -12 -1 -50 -10 -84 -21 -34 -11 -88 -20 -120 -20 -32 0 -86 -9 -120 -20 -34 -11 -72 -20 -84 -20 -11 -1 -39 -8 -61 -16 -22 -8 -83 -19 -135 -23 -86 -8 -105 -13 -190 -56 -52 -26 -147 -64 -210 -85 -64 -21 -139 -49 -166 -63 -27 -14 -77 -30 -109 -36 -38 -7 -78 -24 -110 -45 -27 -19 -90 -54 -140 -79 -49 -25 -114 -61 -144 -81 -29 -20 -60 -36 -70 -36 -9 0 -45 -18 -81 -40 -36 -22 -72 -40 -80 -40 -25 0 -71 -34 -150 -109 -41 -40 -88 -79 -104 -88 -17 -8 -56 -37 -87 -63 -32 -27 -73 -53 -93 -60 -22 -7 -52 -32 -82 -68 -50 -61 -107 -116 -164 -160 -69 -53 -134 -126 -165 -183 -17 -32 -69 -99 -115 -149 -46 -49 -93 -105 -104 -125 -12 -19 -58 -79 -103 -134 -45 -55 -89 -117 -98 -137 -9 -21 -26 -52 -39 -69 -13 -17 -51 -86 -86 -154 -34 -68 -77 -146 -96 -173 -19 -28 -34 -58 -34 -68 0 -10 -47 -113 -104 -228 -65 -130 -108 -230 -115 -264 -5 -29 -26 -102 -45 -161 -20 -60 -36 -126 -36 -146 0 -21 -9 -67 -20 -101 -11 -34 -20 -71 -20 -82 0 -10 -9 -44 -20 -75 -15 -43 -20 -83 -20 -159 0 -74 -5 -118 -20 -164 -17 -53 -20 -90 -20 -240 0 -162 -2 -179 -20 -203 -14 -18 -20 -40 -20 -77 0 -37 6 -59 20 -77 18 -24 20 -41 20 -203 0 -150 3 -187 20 -240 13 -42 20 -90 20 -147 0 -55 6 -96 16 -121 10 -22 19 -84 24 -152 7 -112 8 -117 58 -216 30 -61 55 -126 62 -164 6 -35 23 -86 37 -114 14 -27 42 -102 63 -167 42 -129 52 -150 104 -228 20 -29 36 -61 36 -70 0 -9 15 -49 34 -88 19 -40 39 -97 45 -128 14 -74 22 -87 80 -125 60 -38 85 -76 100 -150 10 -46 22 -67 70 -120 32 -36 65 -79 73 -95 9 -17 87 -102 173 -190 87 -88 171 -181 187 -207 17 -27 49 -60 76 -77 58 -37 122 -97 192 -179 34 -40 72 -73 104 -89 58 -29 112 -69 171 -124 22 -21 63 -48 90 -60 28 -12 69 -37 93 -56 24 -19 66 -43 93 -53 28 -11 65 -30 83 -43 17 -14 78 -48 134 -76 57 -29 121 -65 144 -81 22 -16 63 -36 91 -44 29 -9 78 -31 110 -51 37 -22 86 -41 134 -51 42 -8 101 -29 131 -45 30 -16 62 -29 71 -29 9 0 43 -14 76 -30 39 -19 76 -30 105 -30 25 -1 63 -8 85 -16 22 -8 83 -19 135 -23 79 -7 107 -14 160 -42 64 -33 67 -33 240 -40 122 -5 187 -11 215 -22 67 -27 580 -24 665 3 53 17 90 20 241 20 178 0 178 0 346 56 94 31 200 60 240 65 76 8 178 53 282 123 29 20 60 36 70 36 24 0 69 31 136 95 33 31 80 73 104 93 24 20 70 71 102 114 33 42 76 90 96 105 42 32 63 76 63 131 0 22 9 68 20 102 11 34 20 70 20 80 0 10 9 46 20 80 34 105 29 348 -9 466 -32 99 -129 300 -171 354 -15 19 -34 49 -43 66 -18 34 -177 198 -216 222 -15 8 -48 30 -76 48 -56 37 -204 89 -298 105 -134 23 -450 23 -524 0 -43 -14 -93 -21 -143 -21 -51 0 -99 -7 -141 -21 -55 -18 -78 -20 -169 -14 -58 4 -135 6 -172 5 -38 -1 -87 6 -113 14 -29 10 -81 16 -144 16 -88 0 -112 4 -221 40 -67 22 -130 40 -139 40 -58 0 -225 67 -310 124 -29 20 -60 36 -70 36 -24 0 -114 44 -163 80 -81 58 -143 100 -178 119 -43 24 -200 175 -261 251 -25 30 -56 67 -71 81 -15 15 -38 48 -51 75 -14 27 -41 73 -61 103 -20 29 -36 61 -36 71 0 9 -25 68 -56 131 -43 88 -57 128 -64 184 -4 38 -24 119 -44 178 -49 149 -55 448 -10 583 21 62 26 97 25 162 -1 72 2 89 28 140 22 44 51 145 51 178 0 1 22 29 50 64 30 38 52 76 56 98 12 72 25 98 84 162 33 36 64 76 69 90 5 14 16 46 26 73 12 33 32 60 66 90 28 23 59 58 71 77 30 51 88 109 128 131 19 10 64 46 100 79 69 65 129 101 198 119 23 7 67 33 100 60 74 62 122 86 196 100 33 6 80 24 105 40 56 36 190 81 241 81 21 0 66 9 100 20 34 11 79 20 100 20 21 0 66 9 100 20 45 14 90 20 160 20 70 0 115 -6 160 -20 40 -13 90 -20 140 -20 50 0 100 -7 140 -20 34 -11 80 -20 101 -20 21 0 58 -7 83 -15 24 -8 68 -20 97 -25 29 -6 73 -23 98 -39 25 -17 84 -42 131 -56 123 -38 127 -40 155 -84 33 -54 62 -71 133 -81 72 -10 87 -18 152 -75 28 -25 57 -45 66 -45 23 0 94 -39 101 -56 3 -8 24 -28 47 -44 64 -43 517 -501 553 -557 9 -15 47 -62 83 -103 37 -41 76 -91 88 -111 12 -20 45 -52 74 -71 40 -26 62 -51 88 -99 26 -47 53 -77 100 -114 36 -27 83 -68 105 -91 128 -129 200 -215 220 -259 15 -33 43 -67 80 -99 31 -27 70 -70 86 -97 18 -29 49 -59 77 -77 26 -16 79 -62 117 -102 39 -41 95 -99 126 -129 31 -31 68 -74 81 -96 14 -22 69 -85 123 -140 53 -55 103 -113 112 -130 22 -43 71 -92 129 -130 30 -19 55 -44 61 -61 6 -16 17 -44 24 -63 8 -22 29 -44 65 -67 29 -18 87 -72 131 -120 43 -47 95 -94 115 -105 20 -10 60 -47 90 -81 58 -69 206 -225 334 -352 45 -45 91 -97 103 -118 12 -20 44 -50 71 -68 26 -17 61 -48 76 -68 15 -20 37 -46 48 -58 12 -11 38 -42 60 -68 22 -27 56 -55 80 -66 46 -20 61 -35 99 -101 17 -29 45 -58 76 -79 28 -17 60 -48 72 -68 31 -53 88 -111 129 -132 19 -10 100 -82 180 -160 80 -78 161 -150 181 -160 19 -10 78 -62 130 -115 342 -349 349 -355 405 -376 30 -12 74 -39 98 -62 96 -91 188 -158 292 -211 67 -34 130 -75 164 -106 76 -71 89 -79 155 -91 38 -7 119 -41 229 -96 94 -47 223 -103 287 -123 63 -21 138 -49 165 -63 27 -14 69 -30 94 -37 24 -7 72 -26 105 -43 55 -28 72 -31 195 -38 81 -4 151 -13 175 -23 26 -10 75 -15 141 -16 86 0 105 -3 127 -20 39 -31 795 -31 834 0 21 16 41 20 107 20 47 1 98 7 121 16 22 8 83 19 135 23 74 7 108 15 150 37 30 15 90 36 133 46 42 10 114 27 160 39 45 11 111 27 146 35 35 8 90 30 120 49 31 19 63 35 71 35 9 0 48 16 88 35 40 19 91 39 114 46 55 14 273 124 318 159 19 15 85 53 145 84 120 61 178 98 270 174 68 56 120 85 183 101 50 14 115 69 142 120 21 42 79 98 132 130 20 12 47 39 59 59 12 20 58 73 103 118 44 44 104 105 131 135 28 30 66 63 85 74 24 14 48 43 75 92 22 40 77 118 123 173 45 55 87 113 93 128 15 41 78 136 135 205 66 80 121 191 169 341 25 78 47 129 66 151 29 33 29 33 29 221 0 162 -2 190 -17 206 -9 11 -20 46 -24 82 -23 187 -303 566 -418 566 -9 0 -39 14 -67 32 -120 77 -150 81 -614 99 -44 2 -244 -20 -278 -30 -19 -6 -53 -28 -77 -50 -24 -22 -61 -45 -83 -51 -45 -12 -265 -216 -305 -283 -48 -79 -84 -131 -133 -190 -28 -34 -58 -77 -68 -94 -35 -69 -392 -411 -469 -450 -39 -19 -92 -52 -117 -73 -25 -21 -65 -44 -89 -50 -47 -12 -161 -84 -161 -101 0 -21 -93 -67 -157 -79 -36 -6 -91 -24 -122 -40 -31 -15 -77 -33 -101 -40 -24 -7 -72 -26 -105 -43 -52 -26 -75 -31 -175 -38 -63 -4 -133 -14 -155 -23 -64 -24 -304 -22 -385 4 -52 17 -90 20 -220 20 -158 0 -158 0 -297 46 -76 25 -159 58 -184 75 -25 16 -70 33 -100 39 -32 6 -75 24 -104 44 -27 19 -92 55 -142 80 -90 44 -233 141 -233 156 0 9 -126 102 -167 124 -15 8 -62 47 -103 88 -42 40 -106 100 -144 132 -42 38 -77 79 -93 110 -15 30 -66 92 -124 151 -54 55 -156 159 -227 230 -70 72 -158 157 -196 190 -52 45 -77 76 -106 135 -34 65 -59 94 -190 220 -83 80 -159 158 -167 174 -24 47 -136 176 -203 234 -33 30 -69 70 -79 91 -11 21 -75 94 -143 164 -244 250 -276 285 -314 343 -21 33 -71 92 -111 132 -40 40 -73 77 -73 82 0 5 -36 50 -80 100 -44 50 -80 95 -80 99 0 18 -131 166 -215 244 -47 43 -93 93 -102 111 -9 17 -46 65 -82 106 -37 41 -75 88 -84 103 -19 29 -79 93 -311 329 -76 78 -152 163 -168 189 -17 28 -49 60 -78 79 -27 17 -59 48 -71 68 -26 44 -246 263 -300 299 -21 14 -52 47 -68 73 -16 26 -54 69 -85 96 -62 53 -175 183 -199 230 -23 43 -85 98 -143 127 -33 17 -70 48 -104 89 -63 74 -116 124 -187 178 -28 22 -55 44 -58 50 -4 6 -30 22 -58 35 -29 13 -79 49 -112 79 -33 31 -89 72 -125 90 -36 19 -89 50 -119 70 -29 20 -60 36 -70 36 -24 1 -52 19 -121 80 -81 71 -81 71 -160 80 -52 6 -81 16 -127 44 -32 20 -66 36 -75 36 -8 0 -80 32 -159 71 -133 66 -299 129 -339 129 -10 0 -46 9 -80 20 -34 11 -79 20 -100 20 -44 0 -181 43 -227 71 -23 14 -56 21 -125 25 -51 3 -111 9 -133 14 -22 5 -92 10 -156 10 -88 0 -132 5 -179 20 -92 29 -753 29 -840 0z"/></g></g></g></g></g></mask>
          <rect class="cover" x="-2000" y="-2000" width="5000" height="5000" mask="url(#wwLogoWin)"/>
        </svg></div>`;
    if (v === 'B') return `<section class="ww-hero B"><div class="ww-in">${copy}<div class="vis">${photo}${pass()}</div></div></section>`;
    if (v === 'C') return `<section class="ww-hero C"><div class="ww-in">${copy}${photo}</div></section>`;
    if (v === 'D') return `<section class="ww-hero A D"><div class="dvis">${photo}${pass()}
        <div class="dchip c1"><span class="t">${I('badge-check')}</span><span><b>ใบประกอบวิชาชีพ ตรวจสอบได้</b><small>ตรวจกับสภาฯ ทุกคน</small></span></div>
        <div class="dchip c2"><span class="t">${I('message-circle')}</span><span><b>สรุปผลเข้า LINE</b><small>ภายใน 2 ชม. หลังเยี่ยม</small></span></div></div><div class="ww-in">${copy}</div></section>`;
    return `<section class="ww-hero A">${photo}<div class="ww-in">${copy}</div></section>`;
  }
  /* ---------------- public home: synaclair.com/home before LINE login ---------------- */
  function home(s) {
    const all = P().ranked(s);
    const geri = ptsFor(s, ['ผู้สูงอายุ', 'ป้องกันล้ม']), ortho = ptsFor(s, ['กระดูกและข้อ', 'หลังผ่าตัด']);
    const quotes = all.flatMap(p => (p.quotes || []).map(q => [p, q])).slice(0, 3);
    return `<div class="scr wide ww">${header(s, 'home')}
      ${heroHtml(s)}

      <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>เลือกตามเรื่องที่ต้องการดูแล</h2></div>
        <div class="ww-cats">${ORDER.map(g => `<button class="ww-cat" data-go="w.svc" data-p-group="${g}"><span class="t">${I(SVC[g].icon)}</span>${esc(SVC[g].name)}</button>`).join('')}</div></div></section>

      <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>ปัญหาที่พบบ่อย</h2></div>
        <div class="ww-tiles">${TILES.map(([im, t, g]) => `<button class="ww-tile" data-go="w.svc" data-p-group="${g}"><img src="a/${im}" alt=""><span>${esc(t)}</span></button>`).join('')}</div></div></section>

      <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>ทำไมครอบครัวไว้ใจ SynaClair</h2></div>
        <div class="ww-trust">
          <div><span class="t">${I('badge-check')}</span><span><b>ใบประกอบวิชาชีพ ตรวจกับสภาทุกคน</b><small>เทียบชื่อและเลขกับระบบของสภากายภาพบำบัด ก่อนคุณจะเห็นโปรไฟล์</small></span></div>
          <div><span class="t">${I('shield-check')}</span><span><b>ทุกนัดผ่านทีม จ่ายผ่านระบบ</b><small>ทีมคลินิกดูข้อมูลก่อนส่งงาน มีใบเสร็จทุกครั้ง</small></span></div>
          <div><span class="t">${I('message-circle')}</span><span><b>สรุปผลเข้า LINE ภายใน 2 ชม.</b><small>พร้อมท่าฝึกต่อที่บ้าน ส่งต่อให้คนในบ้านดูได้</small></span></div>
        </div></div></section>

      <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>นักกายภาพแนะนำ</h2><button class="more" data-go="p.find">ดูทั้งหมด${I('chevron-right')}</button></div>
        <div class="ww-row">${all.slice(0, 3).map(p => ptCard(s, p)).join('')}</div></div></section>

      <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>หานักกายภาพตามโซน</h2></div>${zoneMap(s)}</div></section>

      <section class="ww-sec alt"><div class="ww-in">
        <div class="ww-h"><h2>ถนัดดูแลผู้สูงอายุ</h2><button class="more" data-go="w.svc" data-p-group="GERI">ดูทั้งหมด${I('chevron-right')}</button></div>
        <div class="ww-row">${geri.slice(0, 3).map(p => ptCard(s, p)).join('')}</div>
        <div class="ww-h" style="margin-top:34px"><h2>ถนัดกระดูกและข้อ หลังผ่าตัด</h2><button class="more" data-go="w.svc" data-p-group="ORTHO">ดูทั้งหมด${I('chevron-right')}</button></div>
        <div class="ww-row">${ortho.slice(0, 3).map(p => ptCard(s, p)).join('')}</div></div></section>

      ${quotes.length ? `<section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>รีวิวจากผู้รับบริการ</h2></div>
        <div class="ww-row">${quotes.map(([p, q]) => `<article class="ww-rv"><span class="ww-star">${'★'.repeat(q.stars)}</span><blockquote>“${esc(q.text)}”</blockquote><small class="ww-note">ผู้รับบริการ · ${esc(q.area)} ${p.sample ? ui.sample() : ''}</small>
          <button class="to" data-act="openPt" data-id="${p.id}">${P().plAv(p, 28)}<span>รีวิวถึง <b>${esc(p.name)}</b></span></button></article>`).join('')}</div>
        <p class="ww-note" style="margin:10px 0 0">แสดงเฉพาะรีวิวที่ผู้รับบริการยินยอมและทีมตรวจแล้ว</p></div></section>` : ''}

      <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>บทความจากนักกายภาพ</h2><button class="more" data-go="w.articles">ดูทั้งหมด${I('chevron-right')}</button></div>${articleRow(s, 3)}</div></section>

      <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>เริ่มใช้บริการ 4 ขั้น</h2></div>
        <ol class="ww-steps"><li><span><b>ค้นหา หรือให้ทีมช่วยหา</b><small>เลือกนักกายภาพเอง หรือประเมินอาการให้ทีมจับคู่</small></span></li><li><span><b>ประเมินอาการใน LINE</b><small>ไม่ถึง 3 นาที ญาติทำแทนได้</small></span></li><li><span><b>ชำระ ClairMatch</b><small>ทีมยืนยันนัดกับนักกายภาพให้</small></span></li><li><span><b>นักกายภาพถึงบ้าน</b><small>รับสรุปผลใน LINE ภายใน 2 ชม.</small></span></li></ol></div></section>

      <section class="ww-sec alt"><div class="ww-in" style="display:grid;gap:18px">${cmBand()}${lineBand()}</div></section>

      <section class="ww-sec"><div class="ww-in"><details class="ww-seo"><summary>SynaClair คืออะไร</summary>
        <p>SynaClair (ซินอะแคลร์) เป็นแพลตฟอร์มที่เชื่อมผู้ป่วยและครอบครัวกับนักกายภาพบำบัดที่มีใบประกอบวิชาชีพ ให้ไปประเมินและรักษาที่บ้านในกรุงเทพฯ ทั้ง 6 โซน 50 เขต ดูแลผู้สูงอายุ ผู้ป่วยหลังผ่าตัด หลังสโตรก ผู้ป่วยติดเตียง และอาการปวดกล้ามเนื้อ ข้อ หลัง คอ</p>
        <p>ครั้งแรกเป็น ClairMatch ราคา ฿1,599 ทุกพื้นที่ ใช้เวลาไม่เกิน 90 นาที หลังจากนั้นจะจ่ายรายครั้งหรือเลือกคอร์สก็ได้ ราคาคอร์สนักกายภาพแจ้งหลังประเมิน นัด ชำระเงิน และรับสรุปผลผ่าน LINE ทีมตอบทุกวัน 08:00–22:00 น.</p>
        <p>นักกายภาพทุกคนผ่านการตรวจใบประกอบวิชาชีพกับระบบของสภากายภาพบำบัด และทุกนัดผ่านทีม SynaClair</p></details></div></section>
      ${footer()}</div>`;
  }

  /* ---------------- service page: synaclair.com/บริการ/<group> ---------------- */
  SC.screen('w.svc', {
    role: 'patient',
    url: (s, p) => '/บริการ/' + SVC[p.group || 'GERI'].name.split(' ')[0],
    render(s) {
      const g = SC.param('w.svc').group || 'GERI', d = SVC[g] || SVC.GERI;
      const list = d.tags.length ? ptsFor(s, d.tags) : [];
      return `<div class="scr wide ww">${header(s, 'svc')}
        <div class="ww-in"><nav class="ww-crumb" aria-label="ตำแหน่งหน้า"><button data-go="p.feed">หน้าแรก</button>${I('chevron-right')}<span>บริการ</span>${I('chevron-right')}<span>${esc(d.name)}</span></nav>
          <header class="ww-page-h"><h1>${esc(d.h1[0])}<br>${esc(d.h1[1])}</h1><p>${esc(d.intro)}</p></header></div>
        <section class="ww-sec"><div class="ww-in"><div class="ww-cmb">
          <div class="hd"><span class="tag">ClairMatch</span><b>ให้ทีมหานักกายภาพให้</b></div>
          <p class="ww-note" style="margin:0;font-size:14px;color:var(--sub)">เลือกเรื่องที่ใกล้ที่สุด แล้วประเมินอาการใน LINE ไม่ถึง 3 นาที ครั้งแรก ฿1,599 ทุกพื้นที่</p>
          <div class="grid">${d.subs.map(t => `<button data-act="webAssess" data-group="${g}">${esc(t)}<span class="go">เริ่ม${I('chevron-right')}</span></button>`).join('')}</div>
          ${d.note ? `<p class="ww-note" style="margin:0">${I('info')} ${esc(d.note)}</p>` : ''}
        </div></div></section>
        <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>นักกายภาพที่รับงานนี้</h2><span class="ww-note">พบ ${list.length} คน</span></div>
          ${list.length ? `<div class="ww-row">${list.slice(0, 6).map(p => ptCard(s, p)).join('')}</div>` : `<p class="ww-none">ยังไม่มีนักกายภาพที่ทีมอนุมัติงานกลุ่มนี้ · ให้ทีมช่วยหาได้ด้านบน</p>`}
          <p class="ww-note" style="margin:10px 0 0">แสดงเฉพาะงานที่ทีมคลินิกอนุมัติให้นักกายภาพคนนั้นแล้ว</p></div></section>
        <section class="ww-sec"><div class="ww-in ww-two"><div><div class="ww-h"><h2>ครั้งแรกเป็นอย่างไร</h2></div>
          <ol class="ww-steps" style="grid-template-columns:minmax(0,1fr)"><li><span><b>ประเมินอาการใน LINE</b><small>ถ้ามีเรื่องที่ควรให้ทีมคลินิกดูก่อน ทีมดูให้ก่อนเก็บเงิน</small></span></li><li><span><b>ประเมินและรักษาที่บ้าน</b><small>ไม่เกิน 90 นาที</small></span></li><li><span><b>วางแผนต่อด้วยกัน</b><small>จ่ายรายครั้ง หรือเลือกคอร์สก็ได้</small></span></li><li><span><b>สรุปผลเข้า LINE</b><small>ภายใน 2 ชม.</small></span></li></ol></div>
          <aside class="ww-box"><h3>บทความที่เกี่ยวข้อง</h3>${articleRow(s, 2).replace('ww-arts', 'ww-arts" style="grid-template-columns:minmax(0,1fr)')}</aside></div></section>
        <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>คำถามที่พบบ่อย</h2></div>${faqHtml()}
          <p class="ww-note" style="margin:14px 0 0">ข้อความในหน้านี้รอทีมคลินิกตรวจคำ (Q-G)</p></div></section>
        ${footer()}</div>`;
    }
  });

  /* ---------------- articles ---------------- */
  SC.screen('w.articles', {
    role: 'patient', url: '/บทความ',
    render(s) {
      return `<div class="scr wide ww">${header(s, 'art')}<div class="ww-in"><nav class="ww-crumb"><button data-go="p.feed">หน้าแรก</button>${I('chevron-right')}<span>บทความ</span></nav>
        <header class="ww-page-h"><h1>บทความจากนักกายภาพ</h1><p>เขียนโดยนักกายภาพบำบัดในระบบ บทความที่ขึ้น Google ผ่านการตรวจทานจาก Clinical Lead ก่อนเผยแพร่</p></header></div>
        <section class="ww-sec"><div class="ww-in">${articleRow(s, 12)}</div></section>${footer()}</div>`;
    }
  });
  SC.screen('w.article', {
    role: 'patient',
    url: (s, p) => '/บทความ/' + slug(p.id || 's1') + '-' + (p.i || 0),
    render(s) {
      const pr = SC.param('w.article'), p = P().findPt(s, pr.id || 's1'); const w = p && P().worksOf ? P().worksOf(p)[+pr.i || 0] : null;
      if (!p || !w) return `<div class="scr wide ww">${header(s, 'art')}<div class="ww-in ww-sec">${ui.empty('file-text', 'ไม่พบบทความนี้', 'กลับไปดูบทความอื่นได้', '<button class="ww-btn" data-go="w.articles">ดูบทความทั้งหมด</button>')}</div></div>`;
      /* Boss 11 Nov: a feed post goes live at once; an article with its own Google URL needs a Clinical Lead review first. */
      const reviewed = !!p.sample;
      return `<div class="scr wide ww">${header(s, 'art')}
        <div class="ww-in"><nav class="ww-crumb"><button data-go="p.feed">หน้าแรก</button>${I('chevron-right')}<button data-go="w.articles">บทความ</button>${I('chevron-right')}<span>${typeOf(w)}</span></nav>
          <header class="ww-page-h ww-art-h"><h1 style="font-size:clamp(24px,4cqw,34px)">${esc(w.text)}</h1>
            <div class="by">${P().plAv(p, 36)}<span>เขียนโดย <b>${esc(p.name)}</b> · นักกายภาพบำบัด</span>${p.sample ? ui.sample() : ''}</div>
            <p style="margin:12px 0 0">${reviewed ? `<span class="ww-rev">${I('shield-check')}ตรวจทานโดย นัท · CMO · Clinical Lead</span>` : `<span class="ww-rev wait">${I('clock')}รอ Clinical Lead ตรวจทาน · ตอนนี้แสดงในฟีดเท่านั้น ยังไม่ขึ้น Google</span>`}</p></header></div>
        <section class="ww-sec"><div class="ww-in ww-two"><article class="ww-body">
          ${w.image ? `<div class="ww-hero-im" style="margin:0 0 18px"><img src="${esc(w.image)}" alt=""></div>` : ''}
          <p>${esc(w.text)}</p>
          <p class="ww-note">เนื้อหาเต็มเขียนโดยนักกายภาพ ห้องซ้อมแสดงเฉพาะหัวข้อ${w.video ? ' · มีคลิปประกอบ' : ''}</p></article>
          <aside class="ww-box">${P().plAv(p, 56)}<h3>${esc(p.name)}</h3><span class="ww-ver">${I('badge-check')}ใบประกอบวิชาชีพ ตรวจสอบได้</span>
            <button class="ww-btn" data-act="choosePt" data-id="${p.id}">ขอคนนี้</button><button class="ww-btn ghost" data-act="openPt" data-id="${p.id}">ดูโปรไฟล์</button></aside></div></section>
        <section class="ww-sec alt"><div class="ww-in"><div class="ww-h"><h2>บทความอื่น</h2></div>${articleRow(s, 3)}</div></section>
        ${footer()}</div>`;
    }
  });

  /* ---------------- about / trust ---------------- */
  SC.screen('w.about', {
    role: 'patient', url: '/about',
    render(s) {
      return `<div class="scr wide ww">${header(s, 'about')}
        <div class="ww-in"><nav class="ww-crumb"><button data-go="p.feed">หน้าแรก</button>${I('chevron-right')}<span>เกี่ยวกับเรา</span></nav>
          <header class="ww-page-h"><h1>เพราะการดูแลที่ดี<br>เริ่มต้นจากคนที่ใช่</h1><p>SynaClair เชื่อมผู้ป่วยและครอบครัวกับนักกายภาพบำบัดที่เหมาะสม ให้การฟื้นฟูเกิดขึ้นที่บ้าน ที่ที่คุณใช้ชีวิตจริง</p></header></div>
        <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>ชื่อของเราบอกสิ่งที่เราทำ</h2><span class="ww-note">อ่านว่า ซินอะแคลร์</span></div>
          <div class="ww-name"><div><strong>Syna</strong><p>มาจาก Synapse จุดเชื่อมต่อ เราเชื่อมคนไข้กับนักกายภาพ ครอบครัวกับผู้เชี่ยวชาญ</p></div><div><strong>Clair</strong><p>ความชัดเจนและการดูแล ทำเรื่องสุขภาพให้เข้าใจง่าย</p></div></div></div></section>
        <section class="ww-sec alt" data-ww-sec="vet"><div class="ww-in ww-two"><div><div class="ww-h"><h2>เราตรวจนักกายภาพอย่างไร</h2></div>
          <ol class="ww-steps" style="grid-template-columns:minmax(0,1fr)"><li><span><b>ส่งหลักฐาน</b><small>ใบประกอบวิชาชีพ และหลักฐานการศึกษาทุกรายการ</small></span></li><li><span><b>ทีมตรวจกับสภา</b><small>เทียบชื่อและเลขกับระบบของสภากายภาพบำบัด</small></span></li><li><span><b>งานที่รับต้องผ่านทีมคลินิก</b><small>งานเฉพาะทางต้องมีหลักฐาน ทีมอนุมัติก่อน</small></span></li><li><span><b>จึงเห็นโปรไฟล์</b><small>ผู้รับบริการเห็นและขอคนนี้ได้หลังตรวจผ่านเท่านั้น</small></span></li></ol></div>
          <aside class="ww-box"><h3>ตรวจเองได้</h3><p class="ww-note" style="margin:0;font-size:14px">ค้นเลขใบประกอบวิชาชีพที่ระบบของสภากายภาพบำบัด</p><button class="ww-btn ghost" data-act="webCouncil">${I('external-link')}เปิดระบบของสภา</button></aside></div></section>
        <section class="ww-sec"><div class="ww-in"><div class="ww-h"><h2>ทีมดูแลคลินิก</h2></div>
          <div class="ww-team">${[['ป', 'ปาล์ม', 'CEO · Clinical Lead'], ['น', 'นัท', 'CMO · Clinical Lead'], ['บ', 'บอส', 'CTO · Clinical Lead']].map(([a, n, r]) => `<div>${ui.avatar(n, null, 48, 150)}<span><b>${n}</b><small>${r}</small><br><span class="ww-ph">[รูป ชื่อเต็ม ประวัติ]</span></span></div>`).join('')}</div></div></section>
        <section class="ww-sec alt" data-ww-sec="steps"><div class="ww-in">${cmBand()}</div></section>
        <section class="ww-sec" data-ww-sec="faq"><div class="ww-in ww-two"><div><div class="ww-h"><h2>คำถามที่พบบ่อย</h2></div>${faqHtml()}</div>
          <aside class="ww-box"><h3>ข้อมูลบริษัท</h3><p class="ww-note" style="margin:0;font-size:14px"><span class="ww-ph">[ชื่อบริษัทตามทะเบียน]</span><br><span class="ww-ph">[เลขนิติบุคคล]</span><br><span class="ww-ph">[ที่อยู่]</span></p>${lineBand()}</aside></div></section>
        ${footer()}</div>`;
    },
    mount(root) { const sec = SC.param('w.about').sec; const el = sec && root.querySelector(`[data-ww-sec="${sec}"]`); if (el) el.scrollIntoView({ block: 'start' }); }
  });

  /* ---------------- actions ---------------- */
  const login = (s, next) => { if (s.patient.seenLoading) return next; s.patient.afterLogin = next; return 'p.loading'; };
  SC.action('webLogin', (s, c) => { c.toast('ห้องซ้อม: เข้าสู่ระบบด้วย LINE (ไม่ต้องลงแอป)'); return login(s, 'p.feed'); });
  SC.action('webAssess', (s, c) => {
    if (c.data.group) { s.patient.group = c.data.group; s.patient.branch = s.patient.branch || {}; }
    return login(s, 'p.intake');
  });
  SC.action('webZone', (s, c) => { s.patient.webZone = c.data.z; });
  SC.action('webLine', (s, c) => c.toast('ห้องซ้อม: เปิดหน้าเพิ่มเพื่อน LINE @678zucgo'));
  SC.action('webCouncil', (s, c) => c.toast('ห้องซ้อม: เปิด pt.or.th ในแท็บใหม่ (ระบบค้นใบประกอบของสภากายภาพบำบัด)'));
  SC.action('webPolicy', (s, c) => c.toast(c.data.k === 'terms' ? 'ข้อตกลงการใช้บริการ: หน้า /terms ของเว็บจริง' : 'นโยบายความเป็นส่วนตัว: หน้า /privacy-policy ของเว็บจริง'));
  SC.action('webMenu', (s, c) => {
    c.sheet(`<div class="row between"><b class="h2">เมนู</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <div class="stack" style="display:grid;gap:8px">
        <button class="btn ghost" data-go="p.feed">หน้าแรก</button>
        ${ORDER.map(g => `<button class="btn ghost" data-go="w.svc" data-p-group="${g}">${I(SVC[g].icon)}${esc(SVC[g].name)}</button>`).join('')}
        <button class="btn ghost" data-go="p.find">${I('search')}นักกายภาพ</button><button class="btn ghost" data-go="w.articles">${I('file-text')}บทความ</button><button class="btn ghost" data-go="w.about">${I('info')}เกี่ยวกับเรา</button>
        ${logged(s) ? '' : '<button class="btn line" data-act="webLogin">เข้าสู่ระบบด้วย LINE</button>'}</div>`);
  });

  /* Typing line in the hero: one word at a time, then the next (calm, stops under reduced motion). */
  function typeMount(root) {
    /* Logo-window intro waits until the photo is on screen (on desktop the centred hero puts it below the fold). */
    const hc = root.querySelector('.ww-hero .hcurve');
    if (hc && 'IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { hc.classList.add('go'); io.disconnect(); } }, { threshold: .45 }); io.observe(hc); }
    else if (hc) hc.classList.add('go');
    const el = root.querySelector('[data-ww-type]'); if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w = 0, n = TYPED[0].length, dir = -1;
    clearInterval(window.__wwType);
    window.__wwType = setInterval(() => {
      if (!document.body.contains(el)) { clearInterval(window.__wwType); return; }
      n += dir;
      if (n <= 0) { dir = 1; w = (w + 1) % TYPED.length; }
      if (n >= TYPED[w].length + 14) dir = -1;
      el.textContent = ' ' + TYPED[w].slice(0, Math.max(0, Math.min(n, TYPED[w].length)));
    }, 90);
  }
  const feed = SC.screens['p.feed'], oldMount = feed && feed.mount;
  if (feed) feed.mount = (root, s) => { if (!s.patient.seenLoading) typeMount(root); else if (oldMount) oldMount(root, s); };
  document.addEventListener('submit', e => { if (e.target.closest('[data-ww-search]')) { e.preventDefault(); SC.go('p.find'); } });

  SC.web = { home, slug, SVC };
})();
