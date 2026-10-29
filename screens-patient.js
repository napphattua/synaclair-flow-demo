/* screens-patient.js · SynaClair rehearsal, patient side (LIFF screens in LINE). Uses kit.css; scoped extras use the pp- prefix. */
(function () {
  'use strict';
  const { ui, esc, money } = SC;
  const I = ui.icon;
  document.head.insertAdjacentHTML('beforeend', `<style>
  /* loading */
  .pp-load { position: relative; overflow: hidden; background: #fff; min-height: 100%; display: flex; flex-direction: column; align-items: center; padding: 0 20px 22px; }
  .pp-aur { position: absolute; inset: -20%; z-index: 0; filter: blur(46px); pointer-events: none; }
  .pp-aur i { position: absolute; border-radius: 50%; opacity: .75; }
  .pp-aur i:nth-child(1) { width: 50%; height: 30%; left: -6%; top: 4%; background: #dcf1e5; animation: ppd1 14s var(--float) infinite alternate; }
  .pp-aur i:nth-child(2) { width: 46%; height: 28%; right: -8%; top: 44%; background: #f7e8cb; animation: ppd2 17s var(--float) infinite alternate; }
  .pp-aur i:nth-child(3) { width: 48%; height: 26%; left: 4%; bottom: -2%; background: #e3f4ec; animation: ppd1 19s var(--float) infinite alternate-reverse; }
  @keyframes ppd1 { to { transform: translate(18%, 12%) scale(1.15); } }
  @keyframes ppd2 { to { transform: translate(-16%, -10%) scale(1.2); } }
  .pp-stage { position: relative; z-index: 1; flex: 1; display: grid; justify-items: center; align-content: center; padding-bottom: 12px; }
  .pp-logo { position: relative; width: 96px; height: 96px; cursor: pointer; }
  .pp-logo canvas.inf { display: block; width: 100%; height: 100%; }
  .pp-halo { position: absolute; inset: -60%; border-radius: 50%; background: radial-gradient(closest-side, #f6e6c7, #fff8e800); animation: ppbreathe 3.2s var(--float) infinite; z-index: -1; }
  @keyframes ppbreathe { 0%,100% { transform: scale(.88); opacity: .55; } 50% { transform: scale(1.06); opacity: 1; } }
  .pp-word { margin-top: -6px; width: 178px; font: 600 28px/1 var(--display); color: var(--em); text-align: center; }
  .pp-wm { display: block; width: 100%; height: auto; overflow: visible; }
  .pp-wm .wl { transform-box: fill-box; transform-origin: 50% 100%; opacity: 0; }
  .pp-dots i { display: inline-block; width: 6px; height: 6px; margin: 0 2px; border-radius: 50%; background: var(--g-sheen), var(--g-em); animation: ppblink 1.4s infinite both; }
  .pp-dots i:nth-child(2) { animation-delay: .2s; } .pp-dots i:nth-child(3) { animation-delay: .4s; }
  @keyframes ppblink { 0%,80%,100% { opacity: .2; } 40% { opacity: 1; } }
  @keyframes ppup { from { opacity: 0; transform: translateY(12px); } }
  .pp-tips { position: relative; z-index: 1; margin-top: auto; width: 100%; padding: 16px 16px 14px; border-radius: 22px; background: #ffffffd9; box-shadow: 0 14px 34px #00583e14, inset 0 0 0 1px #fff; backdrop-filter: blur(10px); animation: ppup .7s var(--ease) .7s both; display: grid; gap: 8px; }
  .pp-tip { display: none; gap: 6px; }
  .pp-tip.on { display: grid; animation: ppup .5s var(--ease) both; }
  .pp-tip b { font-size: 16.5px; color: var(--forest); }
  .pp-tip p { margin: 0; font-size: 15.5px; color: var(--ink); }
  .pp-tipdots { display: flex; gap: 5px; } .pp-tipdots i { width: 6px; height: 6px; border-radius: 99px; background: #e4ece8; transition: width .3s; } .pp-tipdots i.on { width: 18px; background: var(--gold); }
  /* Intake intro: a floating "first step" ticket with a 3-minute stamp, same object-as-picture idea as the ClairConnect pass (Boss 26 Oct) */
  .pp-ih { position: relative; display: grid; justify-items: center; padding: 24px 16px 28px; border-radius: 24px; background: radial-gradient(90% 70% at 85% 0%, #fbefd8 0%, #fbf7ee 40%, transparent 70%), radial-gradient(100% 90% at 0% 100%, #dcefe4 0%, #eef6f1 45%, #f8faf6 100%); overflow: hidden; }
  .pp-ih::before { content: ''; position: absolute; left: 50%; top: 52%; width: 300px; height: 150px; translate: -50% -50%; border-radius: 50%; background: radial-gradient(closest-side, #00583e1f, transparent); filter: blur(6px); }
  .pp-tk { position: relative; z-index: 1; width: min(272px, 82%); filter: drop-shadow(0 16px 22px #0439281f) drop-shadow(0 2px 4px #0439280f); animation: pptkin .9s cubic-bezier(.2,.8,.2,1) both, pptkfl 6s cubic-bezier(.45,0,.55,1) 1s infinite; }
  .pp-tk .top { position: relative; padding: 20px 20px 22px; border-radius: 20px 20px 0 0; background: radial-gradient(120% 120% at 100% 0%, #14946a 0%, #0b6e4f 45%, #043928 100%); color: #fff; overflow: hidden; -webkit-mask: radial-gradient(circle 10px at 0 100%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) right / 51% 100% no-repeat; mask: radial-gradient(circle 10px at 0 100%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at 100% 100%, #0000 98%, #000) right / 51% 100% no-repeat; }
  .pp-tk .top::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, #ffffff40 48%, transparent 60%); translate: -120% 0; animation: pptksh 5.5s ease-in-out 1.4s infinite; }
  .pp-tk .tk-logo { position: relative; display: block; height: 20px; width: auto; margin-bottom: 18px; filter: brightness(0) invert(1); }
  .pp-tk .tk-mark { position: absolute; right: -24px; bottom: -34px; width: 132px; height: auto; filter: brightness(0) invert(1); opacity: .09; pointer-events: none; }
  .pp-tk h2 { position: relative; margin: 0; font: 600 21px/1.3 var(--display); color: #fff; } .pp-tk .top p { position: relative; margin: 4px 0 0; font-size: 13.5px; line-height: 1.5; color: #d5efe1; }
  .pp-tk .perf { position: absolute; left: 16px; right: 16px; height: 0; border-top: 2px dashed #dfe8e2; z-index: 1; }
  .pp-tk .bot { position: relative; padding: 16px 20px 18px; border-radius: 0 0 20px 20px; background: #fff; -webkit-mask: radial-gradient(circle 10px at 0 0, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at 100% 0, #0000 98%, #000) right / 51% 100% no-repeat; mask: radial-gradient(circle 10px at 0 0, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at 100% 0, #0000 98%, #000) right / 51% 100% no-repeat; }
  .pp-tk .tk-parts { display: flex; gap: 18px; } .pp-tk .tk-parts span { display: grid; justify-items: center; gap: 6px; font: 600 12px/1.2 var(--text); color: var(--forest); white-space: nowrap; animation: ppup .45s var(--ease) both; animation-delay: calc(.7s + var(--i) * .14s); }
  .pp-tk .tk-parts i { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #eaf5ef; } .pp-tk .tk-parts svg { width: 16px; height: 16px; color: var(--em); }
  .pp-stamp { position: absolute; z-index: 2; right: -18px; bottom: -16px; display: grid; place-items: center; width: 88px; height: 88px; border-radius: 50%; background: #fffdf8; box-shadow: 0 10px 22px #7a54242b; animation: ppstamp .6s cubic-bezier(.2,.8,.2,1.4) 1.1s both; }
  .pp-stamp svg { position: absolute; inset: 4px; width: calc(100% - 8px); height: calc(100% - 8px); transform: rotate(-90deg); } .pp-stamp circle { fill: none; stroke-width: 3; } .pp-stamp .bg { stroke: #f1e6cf; } .pp-stamp .fg { stroke: url(#ppStampG); stroke-linecap: round; stroke-dasharray: 220; stroke-dashoffset: 220; animation: ppring 2.2s cubic-bezier(.2,.8,.2,1) 1.4s forwards; }
  @keyframes ppring { to { stroke-dashoffset: 30; } }
  .pp-stamp b { position: relative; display: grid; justify-items: center; gap: 1px; color: #7a5424; font: 500 11px/1.25 var(--text); text-align: center; } .pp-stamp b strong { font: 700 26px/1 var(--display); }
  @keyframes pptkin { from { opacity: 0; transform: translateY(22px) scale(.96); } }
  @keyframes pptkfl { 50% { transform: translateY(-6px); } }
  @keyframes pptksh { 0%, 55% { translate: -120% 0; } 80%, 100% { translate: 120% 0; } }
  @keyframes ppstamp { from { opacity: 0; transform: scale(1.6); } }
  .pp-i0 { display: grid; gap: 22px; }
  .pp-ihead { display: grid; gap: 8px; } .pp-ihead .h1 { margin: 0; line-height: 1.3; } .pp-ihead .p { margin: 0; font-size: 16px; line-height: 1.6; }
  .pp-ifacts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
  .pp-ifacts li { display: grid; justify-items: center; align-content: start; gap: 6px; padding: 12px 6px 10px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); text-align: center; font: 600 12.5px/1.35 var(--text); color: var(--forest); }
  .pp-ifacts .tile { width: 34px; height: 34px; border-radius: 50%; } .pp-ifacts .tile svg { width: 17px; height: 17px; }
  .pp-ihchips { position: relative; z-index: 1; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px; }
  .pp-ihchips span { display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px 6px 6px; border-radius: 99px; background: #fff; box-shadow: 0 8px 18px #00583e17; font: 600 13px var(--text); color: var(--forest); animation: pptkfl 5s cubic-bezier(.45,0,.55,1) infinite; } .pp-ihchips span:nth-child(2) { animation-delay: -2.5s; }
  .pp-ihchips .tile { width: 26px; height: 26px; border-radius: 50%; } .pp-ihchips .tile svg { width: 14px; height: 14px; }
  @media (prefers-reduced-motion: reduce) { .pp-tk, .pp-tk .top::after, .pp-ihchips span, .pp-stamp { animation: none; } .pp-tk .tk-parts span { animation: none; } .pp-stamp .fg { animation: none; stroke-dashoffset: 30; } }
  @keyframes ppfloat { 50% { transform: translateY(-5px); } }
  /* feed */
  .pp-hd { background: #fff; padding: 14px 16px 16px; display: grid; gap: 12px; box-shadow: 0 1px 0 var(--line); }
  .pp-hi { display: flex; align-items: center; gap: 10px; } .pp-hi img { width: 36px; height: 36px; } .pp-hi b { font-size: 18px; color: var(--forest); }
  .pp-where { display: flex; align-items: center; gap: 6px; font-size: 15.5px; color: var(--sub); min-width: 0; } .pp-where > svg { color: var(--em); } .pp-where b { color: var(--forest); }
  .pp-where .link { margin-left: auto; flex: none; }
  .pp-linecard { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px; border-radius: 20px; background: linear-gradient(135deg, #fff, #eef5f1); box-shadow: 0 0 0 1px var(--mint2), 0 10px 24px #0730230f; }
  .pp-linecard .lg { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: #06c755; color: #fff; flex: none; }
  .pp-linecard b { display: block; font: 600 17px var(--display); color: var(--forest); } .pp-linecard small { display: block; font-size: 13.5px; color: var(--sub); margin-top: 2px; }
  .pp .btn.pp-linebtn { width: 100%; background: #06c755; color: #fff; box-shadow: 0 8px 18px #06c75533; }
  .pp-help { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .pp-help button { display: grid; justify-items: start; gap: 8px; padding: 14px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); font: 600 15px var(--display); color: var(--forest); text-align: left; }
  .pp-geo { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--mint2), 0 6px 16px #0730230d; font-size: 15px; color: var(--sub); }
  .pp-geo > svg { flex: none; color: var(--em); } .pp-geo b { color: var(--forest); } .pp-geo small { display: block; font-size: 12.5px; color: var(--mute); }
  .pp-geo .btn { flex: none; min-height: 38px; padding: 0 16px; } .pp-geo .link { flex: none; }
  .pp-cta { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; border: 0; border-radius: 18px; background: var(--g-sheen), var(--g-em); color: #fff; box-shadow: 0 12px 24px #00583e40; text-align: left; }
  .pp-cta .ic { width: 50px; height: 50px; border-radius: 15px; background: #ffffff24; display: grid; place-items: center; flex: none; } .pp-cta .ic svg { width: 27px; height: 27px; }
  .pp-cta b { display: block; font-size: 19px; color: #fff; } .pp-cta small { font-size: 14px; opacity: .92; } .pp-cta > svg { margin-left: auto; width: 24px; height: 24px; }
  .pp-post { background: #fff; border-radius: 20px; box-shadow: 0 6px 18px #07302312; padding: 14px; display: grid; gap: 10px; min-width: 0; }
  .pp-near { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 10px; background: #e8f1ec; color: var(--em); font: 600 14px var(--display); }
  .pp-who { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .pp-who h3 { margin: 0; font-size: 17px; line-height: 1.3; color: var(--forest); }
  .pp-who small { display: flex; align-items: center; gap: 5px; font-size: 14px; color: var(--sub); } .pp-who small svg { color: var(--em); width: 15px; height: 15px; }
  .pp-rate { display: flex; align-items: center; gap: 6px; font-size: 15px; } .pp-rate .stars { font-size: 17px; } .pp-rate span:last-child { color: var(--sub); }
  .pp-work { position: relative; display: flex; align-items: flex-end; width: 100%; height: 176px; padding: 0; border: 0; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, #d7e9de, #f6ecd8); text-align: left; }
  .pp-work img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .pp-play { position: absolute; inset: 0; margin: auto; width: 58px; height: 58px; border-radius: 50%; background: #000000a6; display: grid; place-items: center; color: #fff; } .pp-play svg { width: 28px; height: 28px; margin-left: 3px; }
  .pp-cap { position: relative; width: 100%; padding: 30px 12px 10px; background: linear-gradient(transparent, #000000a6); color: #fff; font: 600 15px/1.45 var(--display); }
  .pp-work.text { height: auto; min-height: 110px; } .pp-work.text .pp-cap { background: none; color: var(--forest); padding: 16px; font-size: 16px; }
  .pp-quote { margin: 0; padding: 10px 12px; border-radius: 14px; background: var(--cream); font-size: 15px; } .pp-quote small { display: block; margin-top: 4px; font-size: 13px; color: var(--gink); }
  .pp-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .pp-acts .btn { min-height: 50px; padding: 0 10px; font-size: 15.5px; box-shadow: none; }
  .pp-status { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 6px 18px #07302310; text-align: left; color: inherit; }
  .pp-status b { display: block; font-size: 15.5px; color: var(--forest); } .pp-status small { font-size: 13.5px; color: var(--sub); } .pp-status > svg:last-child { margin-left: auto; color: var(--mute); }
  .pp-zone { border-radius: 14px; box-shadow: inset 0 0 0 1px var(--line); }
  .pp-zone summary { list-style: none; display: flex; align-items: center; justify-content: space-between; min-height: 52px; padding: 0 14px; font: 600 16px var(--display); color: var(--forest); cursor: pointer; }
  .pp-zone summary::-webkit-details-marker { display: none; }
  .pp-zone[open] summary svg { transform: rotate(90deg); }
  .pp-zone .chips { padding: 0 12px 12px; } .pp-zone .chip { min-height: 46px; font-size: 15.5px; }
  /* PT page */
  .pp-cover { position: relative; height: 128px; background: linear-gradient(135deg, var(--em), #9ad9b8 70%, var(--cream)); flex: none; }
  .pp-cover .ib { position: absolute; left: 12px; top: 12px; background: #fff; box-shadow: 0 4px 12px #07302320; }
  .pp-cover .sample { position: absolute; right: 14px; top: 22px; }
  .pp-pp { position: relative; margin-top: -52px; display: grid; gap: 8px; }
  .pp-pp .avatar { box-shadow: 0 0 0 4px #fff, 0 8px 18px #07302322; }
  .pp-cv { display: grid; gap: 8px; padding: 14px; border-radius: 18px; background: #fff; box-shadow: 0 0 0 1px var(--line); } .pp-cv h2 { margin: 0; font-size: 15px; color: var(--sub); }
  .pp-cv ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; } .pp-cv li { display: flex; gap: 10px; align-items: flex-start; } .pp-cv li > svg { flex: none; width: 20px; height: 20px; color: var(--em); margin-top: 2px; }
  .pp-cv li b { display: block; font-size: 15.5px; color: var(--forest); font-weight: 600; } .pp-cv li small { display: block; font-size: 14px; color: var(--sub); }
  .pp-nums { display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 6px; text-align: center; }
  .pp-nums div { padding: 9px 4px; border-radius: 12px; background: var(--mint); } .pp-nums b { display: block; font-size: 19px; color: var(--forest); } .pp-nums span { font-size: 13px; color: var(--sub); }
  .pp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .pp-tile { position: relative; aspect-ratio: 1; padding: 0; border: 0; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, #d7e9de, #f6ecd8); text-align: left; }
  .pp-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .pp-tile .t { position: absolute; inset: 0; padding: 8px; font: 500 12.5px/1.4 var(--text); color: var(--forest); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; }
  .pp-tile .pl { position: absolute; right: 6px; bottom: 6px; width: 26px; height: 26px; border-radius: 50%; background: #000000a6; color: #fff; display: grid; place-items: center; } .pp-tile .pl svg { width: 14px; height: 14px; }
  .pp-bub { display: grid; gap: 4px; justify-items: start; } .pp-bub .bubble { max-width: 92%; } .pp-bub small { font-size: 13px; color: var(--sub); padding-left: 6px; }
  .pp-bigimg { width: 100%; max-height: 260px; object-fit: cover; border-radius: 16px; }
  /* intake */
  .pp-prog { display: grid; gap: 6px; padding: 12px 16px 4px; background: #fff; }
  .pp-prog .row { justify-content: space-between; font: 600 14px var(--display); color: var(--forest); } .pp-prog .row span:last-child { color: var(--mute); font-weight: 500; }
  .pp-chosen { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); } .pp-chosen .tile { flex: none; width: 34px; height: 34px; border-radius: 50%; } .pp-chosen .tile svg { width: 17px; height: 17px; } .pp-chosen .link { flex: none; font-size: 14px; color: var(--red, #b3402e); }
  .pp-chosen b { color: var(--forest); } .pp-chosen small { display: block; font-size: 13px; color: var(--sub); line-height: 1.4; } .pp-chosen .btn { flex: none; } .pp-chosen .btn.danger { gap: 4px; box-shadow: inset 0 0 0 1.5px #f2c8c0; } .pp-chosen .btn.danger svg { width: 16px; height: 16px; }
  .pp-qh { display: grid; justify-items: start; gap: 8px; } .pp-qh .tile { width: 56px; height: 56px; border-radius: 18px; } .pp-qh .tile svg { width: 28px; height: 28px; }
  .pp-choice { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 58px; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 16px; background: #fff; text-align: left; color: var(--ink); font-size: 16px; }
  .pp-choice > svg:first-child { color: var(--em); width: 24px; height: 24px; }
  .pp-choice .ck { margin-left: auto; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; border: 1.5px solid var(--mint2); color: transparent; flex: none; } .pp-choice .ck svg { width: 16px; height: 16px; }
  .pp-choice[aria-pressed="true"] { border-color: var(--em2); background: #eaf3ee; } .pp-choice[aria-pressed="true"] .ck { background: var(--g-sheen), var(--g-em); border-color: var(--em); color: #fff; }
  .pp-choice span small { display: block; font-size: 13.5px; color: var(--sub); line-height: 1.4; }
  .pp-q { display: grid; gap: 10px; }
  .pp-q .n { font: 600 13px var(--display); color: var(--mute); }
  .pp-yn { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .pp-yn button { min-height: 50px; border: 1.5px solid var(--line); border-radius: 13px; background: #fff; font: 600 15.5px var(--display); color: var(--ink); }
  .pp-yn button[aria-pressed="true"] { background: var(--g-sheen), var(--g-em); border-color: var(--em); color: #fff; }
  .pp-yn button.red[aria-pressed="true"] { background: var(--red); border-color: var(--red); }
  .field .req { font-style: normal; margin-left: 6px; padding: 1px 7px; border-radius: 99px; background: #faf3e7; color: #7a5a2c; font-size: 11.5px; font-weight: 600; vertical-align: 1px; }
  .pp-bp { display: flex; align-items: flex-end; gap: 8px; } .pp-bp label { flex: 1; display: grid; gap: 4px; font-size: 13px; color: var(--sub); } .pp-bp .in { text-align: center; font: 600 22px var(--display); } .pp-bp > b { font: 600 24px var(--display); color: var(--sub); padding-bottom: 10px; } .pp-bp em { font-style: normal; color: var(--sub); padding-bottom: 14px; } .pp-bp.off { opacity: .45; }
  .pp-bpres { margin: 0; display: grid; gap: 2px; padding: 10px 12px; border-radius: 12px; background: var(--mint); } .pp-bpres b { color: var(--forest); } .pp-bpres span { font-size: 13.5px; color: var(--sub); } .pp-bpres.wait { background: #faf3e7; } .pp-bpres.wait b { color: #7a5a2c; } .pp-bpres.warn { background: var(--redbg); } .pp-bpres.warn b { color: var(--red); }
  .pp-bq { display: grid; gap: 8px; } .pp-bq .pp-choice { min-height: 52px; padding: 9px 12px; font-size: 15px; }
  /* ADL stickers: two-tone drawings; the next card to answer moves, an answered card gets a gold tick */
  .pp-adl { position: relative; flex: none; width: 56px; height: 56px; border-radius: 18px; display: grid; place-items: center; background: linear-gradient(150deg, #eef5f1 0%, #faf3e7 100%); box-shadow: inset 0 0 0 1.5px #fff, 0 8px 18px #00583e14; animation: ppadlin .5s cubic-bezier(.2,.8,.2,1) both; }
  .pp-adl svg { width: 42px; height: 42px; overflow: visible; }
  .pp-adl .e { fill: none; stroke: #00583e; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .pp-adl .m { fill: #b5d3c3; } .pp-adl .g { fill: #e9c98d; } .pp-adl .w { fill: #fff; } .pp-adl .gi { fill: none; stroke: #c8a066; stroke-width: 2; stroke-linecap: round; }
  .pp-adl.cur { background: linear-gradient(150deg, #e4efe8 0%, #faf3e7 100%); box-shadow: inset 0 0 0 2px #fff, 0 0 0 4px #00583e14, 0 10px 22px #00583e20; }
  .pp-adl.ok { box-shadow: inset 0 0 0 2px #f2e3c6, 0 8px 18px #c8a0661f; }
  .pp-adl .tick { position: absolute; right: -6px; bottom: -6px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(140deg, #e9cda1, #c8a066); color: #fff; box-shadow: 0 0 0 2.5px #fff, 0 4px 10px #c8a06655; }
  .pp-adl .tick svg { width: 13px; height: 13px; stroke-width: 3; }
  .pp-adl .tick[data-keep-anim] { animation: pptick .55s cubic-bezier(.2,.8,.2,1.4) both; }
  .pp-adl .a { transform-box: fill-box; transform-origin: center; }
  .pp-adl.cur .a-steam path { animation: ppsteam 2.4s ease-in-out infinite; } .pp-adl.cur .a-steam path:nth-child(2) { animation-delay: .4s; } .pp-adl.cur .a-steam path:nth-child(3) { animation-delay: .8s; }
  .pp-adl.cur .a-brush { animation: ppbrush 1.6s ease-in-out infinite; }
  .pp-adl.cur .a-twinkle { animation: pptwinkle 2s ease-in-out infinite; }
  .pp-adl.cur .a-hop { animation: pphop 1.8s cubic-bezier(.45,0,.55,1) infinite; }
  .pp-adl.cur .a-stepL { animation: ppstep 1.6s ease-in-out infinite; } .pp-adl.cur .a-stepR { animation: ppstep 1.6s ease-in-out .8s infinite; }
  .pp-adl.cur .a-sway { transform-origin: 50% 0; animation: ppsway 2.6s cubic-bezier(.45,0,.55,1) infinite; }
  .pp-adl.cur .a-climb { animation: ppclimb 2.8s cubic-bezier(.45,0,.55,1) infinite; }
  .pp-adl.cur .a-bub circle { animation: ppbub 2.4s ease-in infinite; } .pp-adl.cur .a-bub circle:nth-child(2) { animation-delay: .7s; } .pp-adl.cur .a-bub circle:nth-child(3) { animation-delay: 1.4s; }
  .pp-adl.cur .a-check { stroke-dasharray: 20; animation: ppcheck 2.6s ease-in-out infinite; }
  .pp-adl.cur .a-bob { animation: ppadlbob 2.4s cubic-bezier(.45,0,.55,1) infinite; }
  .pp-adl.cur .a-ripple { animation: ppripple 2.4s ease-out infinite; }
  @keyframes ppadlin { from { opacity: 0; transform: scale(.7) rotate(-8deg); } }
  @keyframes pptick { from { opacity: 0; transform: scale(0) rotate(-40deg); } }
  @keyframes ppsteam { 0% { opacity: 0; transform: translateY(3px); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateY(-4px); } }
  @keyframes ppbrush { 0%,100% { transform: translateX(0) rotate(-6deg); } 25% { transform: translateX(-2.5px) rotate(-6deg); } 75% { transform: translateX(2.5px) rotate(-6deg); } }
  @keyframes pptwinkle { 0%,100% { opacity: .2; transform: scale(.5); } 50% { opacity: 1; transform: scale(1.1); } }
  @keyframes pphop { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes ppstep { 0%,100% { transform: translateY(0); } 30% { transform: translateY(-3px) rotate(-6deg); } 60% { transform: translateY(0); } }
  @keyframes ppsway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
  @keyframes ppclimb { 0%,8% { transform: translate(0,0); } 20% { transform: translate(4px,-8px); } 28% { transform: translate(8px,-7px); } 40% { transform: translate(12px,-15px); } 48% { transform: translate(16px,-14px); } 60% { transform: translate(20px,-22px); } 68%,88% { transform: translate(23px,-21px); opacity: 1; } 100% { transform: translate(23px,-21px); opacity: 0; } }
  @keyframes ppbub { 0% { opacity: 0; transform: translateY(4px) scale(.6); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-9px) scale(1); } }
  @keyframes ppcheck { 0% { stroke-dashoffset: 20; } 40%,80% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 0; opacity: 0; } }
  @keyframes ppadlbob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  @keyframes ppripple { 0% { opacity: .8; transform: scale(.5); } 100% { opacity: 0; transform: scale(1.3); } }
  @media (prefers-reduced-motion: reduce) { .pp-adl, .pp-adl * { animation: none !important; } }
  .pp-map { position: relative; height: 190px; border-radius: 16px; overflow: hidden; background:
      linear-gradient(90deg, transparent 47%, #fff 47%, #fff 53%, transparent 53%) 0 0 / 120px 100%,
      linear-gradient(0deg, transparent 46%, #fff 46%, #fff 54%, transparent 54%) 0 0 / 100% 90px,
      linear-gradient(28deg, transparent 49%, #f6e7c9 49%, #f6e7c9 52%, transparent 52%),
      radial-gradient(40% 50% at 80% 20%, #cfe9d9, transparent 70%), #e8efe9; box-shadow: inset 0 0 0 1px var(--line); }
  .pp-map .pin { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -100%); color: var(--red); filter: drop-shadow(0 4px 6px #0003); }
  .pp-map .pin svg { width: 44px; height: 44px; fill: #fff; }
  .pp-map.ok .pin { color: var(--em); }
  .pp-map .lbl { position: absolute; left: 10px; bottom: 10px; padding: 4px 10px; border-radius: 99px; background: #fff; font: 600 13px var(--display); color: var(--forest); box-shadow: 0 2px 8px #07302318; }
  .pp-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .pp-slots button { position: relative; min-height: 48px; border: 1.5px solid var(--line); border-radius: 12px; background: #fff; font: 600 15px var(--display); color: var(--ink); }
  .pp-slots button[aria-pressed="true"] { background: linear-gradient(150deg, #00583e, #043928); border-color: var(--em); color: #fff; }
  .pp-slots button.k1, .pp-slots button.k2 { background: #fff; border-color: var(--em); color: var(--em); box-shadow: inset 0 0 0 1px var(--em); }
  .pp-slots button em { position: absolute; top: -8px; right: -3px; padding: 0 6px; border-radius: 99px; background: #fff; color: var(--forest); box-shadow: 0 0 0 1px #cfe5d8, 0 2px 6px #04392818; font: 600 10px/16px var(--display); font-style: normal; }
  .pp-slots button.k1 em, .pp-slots button.k2 em { background: var(--em); color: #fff; box-shadow: none; }
  .pp-ropt { display: flex; align-items: center; gap: 10px; width: 100%; padding: 14px; border-radius: 16px; border: 1.5px solid var(--line); background: #fff; text-align: left; }
  .pp-ropt .grow { display: grid; gap: 3px; } .pp-ropt b { font: 600 16px var(--display); color: var(--forest); } .pp-ropt small { font-size: 13.5px; color: var(--mute); }
  .pp-ropt i { flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; box-shadow: inset 0 0 0 1.5px var(--line); color: #fff; } .pp-ropt i svg { width: 15px; height: 15px; }
  .pp-ropt.on { border-color: var(--em); background: #f3faf6; } .pp-ropt.on i { background: var(--em); box-shadow: none; }
  .pp-doc .f ul { margin: 2px 0 0; padding-left: 18px; }
  .pp-tray { position: sticky; top: 56px; z-index: 4; display: grid; gap: 8px; margin: 0 -16px; padding: 10px 16px 12px; background: #fffffff2; backdrop-filter: blur(8px); box-shadow: 0 6px 14px #04392812; }
  .pp-tray > b { font: 600 14px var(--display); color: var(--forest); }
  .pp-trayrow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  /* Chosen times (Boss 29 Oct: colours weren't pretty): one green family. Main = deep forest card; backups = white cards with an emerald edge. */
  .pp-pick { position: relative; display: grid; gap: 3px; align-content: start; min-height: 64px; padding: 8px 26px 8px 10px; border-radius: 14px; background: #fff; color: var(--forest); box-shadow: inset 0 0 0 1.5px #cfe5d8; }
  .pp-pick small { justify-self: start; padding: 1px 8px; border-radius: 99px; background: #e8f4ed; color: var(--em); font: 600 11px/16px var(--text); }
  .pp-pick b { font: 600 13.5px/1.3 var(--display); }
  .pp-pick .ib { position: absolute; top: 3px; right: 1px; min-height: 0; width: 28px; height: 28px; aspect-ratio: 1; color: var(--mute); }
  .pp-pick .ib svg { width: 15px; height: 15px; }
  .pp-pick.k0 { background: linear-gradient(150deg, #00583e, #043928); color: #fff; box-shadow: 0 8px 18px #04392833; }
  .pp-pick.k0 small { background: #ffffff26; color: #fff; } .pp-pick.k0 .ib { color: #ffffffcc; }
  .pp-pick.empty { background: #fff; color: var(--mute); box-shadow: none; border: 1.5px dashed #cfe5d8; } .pp-pick.empty b { font-weight: 500; } .pp-pick.empty small { background: #f2f5f3; color: var(--mute); }
  .pp-pick.pop { animation: ppPick .5s cubic-bezier(.2,.8,.2,1.35) both; }
  @keyframes ppPick { 0% { transform: translateY(16px) scale(.85); opacity: 0; } 60% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .pp-pick.pop { animation: none; } }
  .pp-win { display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 6px 6px 6px 14px; border-radius: 14px; background: var(--mint); }
  .pp-win b { color: var(--forest); } .pp-win small { color: var(--sub); }
  .pp-sum { display: grid; gap: 4px; } .pp-sum .row { justify-content: space-between; } .pp-sum .link { min-height: 40px; padding: 4px 8px; }
  .pp-sum p { margin: 0; font-size: 15px; }
  .pp-hint { font-size: 13.5px; color: var(--mute); text-align: center; margin: 0; }
  /* result */
  .pp-portrait { width: 190px; height: 190px; border-radius: 50%; overflow: hidden; justify-self: center; box-shadow: 0 0 0 8px #fff, 0 0 0 10px var(--mint2), 0 18px 34px #07302322; }
  .pp-portrait img { width: 100%; height: 100%; object-fit: cover; }
  /* Result reveal: portrait pops in and floats inside a slow gold ring, three sparkles twinkle, level bars fill one by one */
  .pp-reveal { position: relative; width: 236px; height: 236px; display: grid; place-items: center; justify-self: center; }
  .pp-reveal .ring { position: absolute; inset: 0; border-radius: 50%; animation: ppring-in .8s cubic-bezier(.2,.8,.2,1) .15s both; }
  .pp-reveal .ring svg { width: 100%; height: 100%; animation: ppspin 26s linear infinite; }
  .pp-reveal .ring circle { fill: none; stroke: #e0bd80; stroke-width: 1.6; stroke-dasharray: 2 9; stroke-linecap: round; }
  .pp-reveal .halo { position: absolute; inset: 22px; border-radius: 50%; background: radial-gradient(circle, #faf3e7 0%, #eef5f100 70%); animation: ppbreathe 4.5s cubic-bezier(.45,0,.55,1) infinite; }
  .pp-reveal .pp-portrait { position: relative; animation: pppop .9s cubic-bezier(.2,.8,.2,1.25) both, ppfloat 5s cubic-bezier(.45,0,.55,1) 1s infinite; }
  .pp-reveal .spk { position: absolute; width: 20px; height: 20px; color: #c8a066; animation: pptwinkle 2.6s ease-in-out infinite; }
  .pp-reveal .spk svg { width: 100%; height: 100%; display: block; }
  .pp-reveal .spk.s1 { top: 18px; right: 22px; animation-delay: .9s; } .pp-reveal .spk.s2 { left: 6px; top: 104px; width: 14px; height: 14px; animation-delay: 1.6s; color: #00583e; } .pp-reveal .spk.s3 { bottom: 22px; right: 34px; width: 15px; height: 15px; animation-delay: 2.3s; }
  .pp-level i.on { transform-origin: left center; animation: ppfill .5s cubic-bezier(.2,.8,.2,1) both; }
  .pp-level i.on:nth-child(1) { animation-delay: .7s; } .pp-level i.on:nth-child(2) { animation-delay: .82s; } .pp-level i.on:nth-child(3) { animation-delay: .94s; } .pp-level i.on:nth-child(4) { animation-delay: 1.06s; } .pp-level i.on:nth-child(5) { animation-delay: 1.18s; }
  @keyframes pppop { 0% { opacity: 0; transform: scale(.55) rotate(-6deg); } 60% { opacity: 1; } 100% { transform: scale(1) rotate(0); } }
  @keyframes ppring-in { from { opacity: 0; transform: scale(.85) rotate(-40deg); } }
  @keyframes ppspin { to { transform: rotate(360deg); } }
  @keyframes ppfill { from { transform: scaleX(0); } }
  @media (prefers-reduced-motion: reduce) { .pp-reveal .ring svg, .pp-reveal .halo, .pp-reveal .spk { animation: none; } .pp-reveal .pp-portrait { animation: pppop .4s ease both; } }
  .pp-level { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; } .pp-level i { height: 10px; border-radius: 99px; background: var(--mint2); } .pp-level i.on { background: linear-gradient(90deg, var(--em), var(--em2)); }
  .pp-ends { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--mute); }
  .pp-ul { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; } .pp-ul li { display: flex; gap: 10px; align-items: flex-start; font-size: 15.5px; }
  .pp-ul li > svg { margin-top: 3px; color: var(--em); } .pp-ul.gold li > svg { color: var(--gold); }
  /* pay */
  .pp-qr { justify-self: center; width: 216px; padding: 10px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); }
  .pp-qr svg { display: block; width: 100%; height: auto; }
  .pp-count { font: 700 22px var(--display); color: var(--forest); font-variant-numeric: tabular-nums; }
  .pp-file { position: relative; } .pp-file input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
  .pp-slip { justify-self: center; width: 180px; padding: 14px; border-radius: 14px; background: #fff; box-shadow: 0 8px 20px #07302318, inset 0 0 0 1px var(--line); display: grid; gap: 4px; font-size: 12.5px; text-align: center; }
  .pp-slip b { font-size: 20px; color: var(--forest); } .pp-slip .ok { color: var(--em); font: 600 13px var(--display); }
  .pp-slipimg { justify-self: center; max-width: 180px; max-height: 240px; border-radius: 12px; box-shadow: 0 8px 20px #07302318; }
  /* appointments */
  .pp-appt { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px; border: 0; border-radius: var(--r); background: #fff; box-shadow: 0 6px 18px #07302310; text-align: left; color: inherit; }
  .pp-date { display: grid; place-items: center; width: 60px; min-height: 64px; border-radius: 16px; background: var(--mint); color: var(--forest); flex: none; line-height: 1.15; }
  .pp-date b { font-size: 24px; } .pp-date small { font-size: 12.5px; color: var(--sub); }
  .pp-appt .t { font: 600 16px var(--display); color: var(--forest); } .pp-appt .s { font-size: 14px; color: var(--sub); }
  /* chat */
  .pp-msgs { display: grid; gap: 10px; align-content: start; }
  .pp-msgs .bubble { justify-self: start; max-width: 86%; }
  .pp-me { justify-self: end; max-width: 80%; padding: 11px 14px; border-radius: 18px 4px 18px 18px; background: var(--g-sheen), var(--g-em); color: #fff; font-size: 15.5px; }
  .pp-typing { justify-self: start; padding: 10px 14px; border-radius: 4px 18px 18px 18px; background: #e9f2ed; }
  .pp-dock { position: sticky; bottom: 0; z-index: 6; background: #fff; }
  .pp-dock .tabs { position: static; }
  .pp-compose { display: grid; gap: 8px; padding: 10px 12px; box-shadow: 0 -1px 0 var(--line); }
  .pp-compose .row .in { min-height: 50px; }
  .pp-compose .btn { width: 52px; min-height: 50px; padding: 0; flex: none; box-shadow: none; }
  /* me */
  .pp-sw { position: relative; width: 54px; height: 32px; border: 0; border-radius: 99px; background: #d9e2de; flex: none; transition: background .2s; }
  .pp-sw::after { content: ''; position: absolute; top: 3px; left: 3px; width: 26px; height: 26px; border-radius: 50%; background: #fff; box-shadow: 0 2px 6px #0003; transition: transform .2s var(--ease); }
  .pp-sw[aria-checked="true"] { background: var(--g-sheen), var(--g-em); } .pp-sw[aria-checked="true"]::after { transform: translateX(22px); }
  /* review */
  .pp-starin { display: flex; justify-content: center; gap: 4px; }
  .pp-starin button { width: 56px; height: 60px; border: 0; background: none; font-size: 44px; line-height: 1; color: #e4dccd; }
  .pp-starin button.on { color: var(--gold); }
  .pp-rate { display: grid; gap: 4px; padding: 14px 12px; border-radius: 20px; background: linear-gradient(160deg, #eef5f1, #faf3e7); animation: ppup .45s var(--ease) both; }
  .pp-rate h2 { margin: 0; text-align: center; } .pp-rate > .small { margin: 0 0 8px; text-align: center; }
  .pp-rgrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .pp-rt { display: grid; justify-items: center; align-content: start; gap: 6px; min-height: 0; padding: 10px 4px 9px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1.5px #ece7dc; font: 600 13px/1.35 var(--text); color: var(--ink); text-align: center; transition: transform .2s var(--ease), box-shadow .2s; }
  .pp-rt:active { transform: scale(.96); }
  .pp-rt .ic { position: relative; width: 58px; height: 58px; } .pp-rt .ic img { width: 100%; height: 100%; border-radius: 50%; transition: transform .25s cubic-bezier(.2,.8,.2,1.4); }
  .pp-rt .ic i { position: absolute; right: -4px; bottom: -2px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--g-sheen), var(--g-em); color: #fff; box-shadow: 0 0 0 2px #fff; animation: pptick .4s cubic-bezier(.2,.8,.2,1.4) both; } .pp-rt .ic i svg { width: 13px; height: 13px; }
  .pp-rt.on { box-shadow: 0 0 0 2px var(--em), 0 8px 18px #00583e22; color: var(--forest); } .pp-rt.on .ic img { transform: scale(1.06); }
  .pp-rate.fix .pp-rt.on { box-shadow: 0 0 0 2px #c8a066, 0 8px 18px #c8a06626; } .pp-rate.fix .pp-rt .ic i { background: #c8a066; }
  .pp-rgrid .pp-rt { gap: 4px; padding: 8px 2px 7px; border-radius: 14px; font-size: 11.5px; line-height: 1.3; } .pp-rgrid .pp-rt .ic { width: 40px; height: 40px; }
  .pp-rgrid .pp-rt .ic i { width: 18px; height: 18px; right: -5px; } .pp-rgrid .pp-rt .ic i svg { width: 11px; height: 11px; }
  .pp-rt { transition: transform .25s var(--ease), box-shadow .25s, background .25s; }
  .pp-rt.on { transform: translateY(-2px); background: linear-gradient(180deg, #fff, #eef5f1); } .pp-rate.fix .pp-rt.on { background: linear-gradient(180deg, #fff, #fdf6ea); }
  @media (hover: hover) { .pp-rt:hover .ic img { transform: translateY(-3px) rotate(-5deg); } }
  .pp-rt .ic::before { content: ''; position: absolute; inset: -7px; border-radius: 50%; background: radial-gradient(circle, #0b6e4f30 0%, #0b6e4f00 70%); opacity: 0; transform: scale(.6); transition: opacity .35s, transform .35s; }
  .pp-rate.fix .pp-rt .ic::before { background: radial-gradient(circle, #e9cda155 0%, #e9cda100 70%); }
  .pp-rt.on .ic::before { opacity: 1; transform: scale(1); animation: rtHalo 3s ease-in-out infinite; }
  .pp-rt.in { animation: rtIn .55s cubic-bezier(.2,.8,.2,1.15) both; animation-delay: calc(var(--i) * 55ms); }
  .pp-rt.in .ic img { animation: rtWobble .7s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i) * 55ms + .12s); }
  .pp-rt.pop .ic img { animation: rtJelly .65s cubic-bezier(.2,.8,.2,1); }
  .pp-rt.pop .ic::after { content: ''; position: absolute; inset: -2px; border-radius: 50%; border: 2px solid var(--em2); animation: rtRing .6s ease-out forwards; }
  .pp-rate.fix .pp-rt.pop .ic::after { border-color: #c8a066; }
  .pp-rt .sp { position: absolute; inset: 0; pointer-events: none; }
  .pp-rt .sp em { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px; border-radius: 50%; background: #e9cda1; opacity: 0; animation: rtSpark .65s ease-out forwards; }
  .pp-rt .sp em:nth-child(even) { background: #0b6e4f; width: 5px; height: 5px; }
  .pp-rt.drop .ic img { animation: rtDrop .35s ease; }
  @keyframes rtIn { from { opacity: 0; transform: translateY(14px) scale(.9); } }
  @keyframes rtWobble { 0% { transform: scale(.6) rotate(-12deg); } 60% { transform: scale(1.08) rotate(4deg); } 100% { transform: none; } }
  @keyframes rtJelly { 0% { transform: scale(1); } 30% { transform: scale(1.22, .9); } 50% { transform: scale(.92, 1.12); } 70% { transform: scale(1.09, .97); } 100% { transform: scale(1.06); } }
  @keyframes rtRing { from { opacity: .9; transform: scale(.85); } to { opacity: 0; transform: scale(1.55); } }
  @keyframes rtSpark { 0% { opacity: 1; transform: rotate(var(--a)) translateY(-22px) scale(.4); } 100% { opacity: 0; transform: rotate(var(--a)) translateY(-46px) scale(1); } }
  @keyframes rtHalo { 50% { transform: scale(1.14); opacity: .55; } }
  @keyframes rtDrop { 0% { transform: scale(1.06); } 40% { transform: scale(.86); } 100% { transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .pp-rt, .pp-rt * , .pp-rt .ic::before, .pp-rt .ic::after { animation: none !important; } .pp-rt .sp { display: none; } } .pp-rt b { display: inline-block; font-weight: 600; }
  /* certificate document (no SynaClair logo) */
  .pp-doc { background: #fff; color: #111; padding: 24px 18px 18px; border-radius: 4px; box-shadow: 0 14px 34px #07302322; font: 400 13.5px/1.75 var(--text); display: grid; gap: 10px; }
  .pp-doc h2 { margin: 0 0 4px; text-align: center; font: 700 18px var(--display); color: #111; text-decoration: underline; text-underline-offset: 5px; }
  .pp-doc p { margin: 0; } .pp-doc .r { text-align: right; font-size: 12.5px; }
  .pp-doc u { text-decoration: none; border-bottom: 1px dotted #555; padding: 0 3px; font-weight: 600; }
  .pp-doc .f b { display: block; font: 600 13.5px var(--display); color: #111; } .pp-doc .f p { padding-left: 12px; }
  .pp-sign { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-top: 8px; }
  .pp-sign > div:first-child { display: grid; justify-items: center; font-size: 12px; }
  .pp-sig { font: 600 22px 'Segoe Script', 'Brush Script MT', cursive; color: #1d3a6b; }
  .pp-vfy { display: grid; justify-items: center; gap: 4px; text-align: center; font-size: 10px; color: #666; line-height: 1.3; }
  .pp-qr3 { width: 52px; height: 52px; background: repeating-conic-gradient(#222 0 25%, #fff 0 50%) 0 0 / 8.6px 8.6px; box-shadow: 0 0 0 3px #fff, 0 0 0 4px #ddd; }
  .pp-pn { width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.55; }
  .pp-pn th, .pp-pn td { border: 1px solid #bbb; padding: 6px; vertical-align: top; text-align: left; }
  .pp-pn th { background: #f4f4f4; font: 600 12px var(--display); } .pp-pn td:first-child { width: 26%; } .pp-pn td:first-child small { display: block; color: #777; font-size: 10.5px; }
  /* ---------- Palm's board (23 Oct): Level 1 Quick Match ---------- */
  .pl-top { background: radial-gradient(90% 120% at 100% 0%, #e7f2ec 0%, #ffffff00 60%), #fff; padding: 12px 16px 16px; display: grid; gap: 12px; box-shadow: 0 1px 0 var(--line); }
  .pl-brand { display: flex; align-items: center; justify-content: space-between; } .pl-brand img { height: 34px; width: auto; }
  .pl-hello { margin: 0; font: 600 20px/1.3 var(--display); color: var(--em); }
  .pl-q { margin: 2px 0 0; font: 500 15.5px/1.4 var(--text); color: var(--sub); }
  .pl-search { display: flex; align-items: center; gap: 8px; padding: 0 14px; border-radius: 14px; background: #fff; box-shadow: 0 0 0 1.5px var(--mint2), 0 6px 16px #04392810; }
  .pl-search > svg { color: var(--em); flex: none; } .pl-search .in { border: 0; box-shadow: none; padding: 0; min-height: 48px; background: transparent; flex: 1; min-width: 0; }
  .pl-search .in:focus { outline: none; } .pl-search:focus-within { box-shadow: 0 0 0 2px var(--em), 0 6px 16px #04392810; }
  .pl-cats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .pl-cats button { display: grid; justify-items: center; gap: 6px; border: 0; background: none; padding: 4px 0; font: 600 13px/1.25 var(--text); color: var(--ink); text-align: center; min-width: 0; }
  .pl-cats button span { width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; background: var(--g-tile); box-shadow: 0 0 0 1px var(--mint2), 0 6px 14px #04392812; color: var(--em); transition: transform .2s var(--ease), background .2s; }
  .pl-cats button span svg { width: 26px; height: 26px; }
  .pl-cats button.on span { background: var(--g-em); color: #fff; box-shadow: 0 8px 18px #00583e40; transform: translateY(-2px); } .pl-cats button.on { color: var(--em); }
  .pl-rhead .h2 span { font: 500 15px var(--text); color: var(--mute); }
  .pl-sort { display: flex; gap: 8px; margin-top: -4px; overflow-x: auto; }
  .pl-sort button { flex: none; min-height: 38px; padding: 0 16px; border-radius: 99px; border: 0; background: #fff; box-shadow: 0 0 0 1.5px var(--mint2); font: 600 14px var(--text); color: var(--sub); }
  .pl-sort button.on { background: var(--em); color: #fff; box-shadow: none; }
  .pl-card { background: #fff; border-radius: 20px; padding: 14px; display: grid; gap: 12px; box-shadow: 0 0 0 1px var(--line), 0 10px 24px #04392810; min-width: 0; }
  .pl-crow { display: flex; gap: 12px; min-width: 0; } .pl-crow .grow { display: grid; gap: 3px; min-width: 0; align-content: start; }
  .pl-card h3 { margin: 0; font-size: 17px; line-height: 1.3; color: var(--forest); }
  .pl-role { font-size: 13.5px; color: var(--mute); }
  .pl-ver { display: inline-flex; align-items: center; gap: 5px; font: 600 13.5px var(--text); color: var(--em); } .pl-ver svg { width: 16px; height: 16px; }
  .pl-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 13.5px; color: var(--sub); } .pl-meta > span { display: inline-flex; align-items: center; gap: 4px; } .pl-meta svg { width: 15px; height: 15px; color: var(--em); }
  .pl-vbox { display: grid; gap: 5px; margin-top: 6px; }
  .pl-vbox .pl-ver { display: inline-flex; align-items: center; gap: 6px; width: fit-content; padding: 3px 11px 3px 4px; border-radius: 999px; background: #e8f4ed; font: 600 13.5px var(--text); color: var(--forest); }
  .pl-vbox .pl-ver i { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: var(--g-sheen), var(--g-em); color: #fff; } .pl-vbox .pl-ver i svg { width: 12px; height: 12px; stroke-width: 3; }
  .pl-no { display: inline-flex; align-items: center; gap: 6px; padding-left: 4px; font-size: 14px; color: var(--sub); } .pl-no i { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: #dff0e7; color: #7fbf9d; } .pl-no i svg { width: 12px; height: 12px; }
  .pl-vbox .pl-rate { display: inline-flex; align-items: center; gap: 5px; padding-left: 4px; font-size: 13.5px; color: var(--mute); } .pl-vbox .pl-rate svg { width: 18px; height: 18px; } .pl-vbox .pl-rate b { font: 600 16px var(--display); color: var(--ink); }
  .pl-rate svg { color: var(--gold); fill: var(--gold); } .pl-rate b { color: var(--ink); font-size: 14.5px; } .pl-rate.new, .pl-mr.new { color: var(--emerald, #0e7a55); font-weight: 600; } .pl-rate.new svg, .pl-mr.new svg { fill: none; color: var(--gold); }
  .pl-av { position: relative; flex: none; width: var(--s); height: var(--s); border-radius: 18px; overflow: visible; }
  .pl-av img, .pl-av .ini { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; display: grid; place-items: center; }
  .pl-av .ini { background: linear-gradient(150deg, hsl(var(--h) 45% 90%), hsl(var(--h) 40% 80%)); color: hsl(var(--h) 45% 26%); font: 600 calc(var(--s) * .4) var(--display); }
  .pl-av i { position: absolute; right: -4px; bottom: -4px; width: 24px; height: 24px; border-radius: 50%; background: var(--em); color: #fff; display: grid; place-items: center; box-shadow: 0 0 0 3px #fff; }
  .pl-av i svg { width: 14px; height: 14px; stroke-width: 3; }
  .pl-tags { display: flex; flex-wrap: wrap; gap: 6px; } .pl-tags span { padding: 4px 12px; border-radius: 99px; background: var(--mint); color: var(--em); font: 600 13px var(--text); }
  .pl-tags .pl-fit { display: inline-flex; align-items: center; gap: 4px; background: var(--cream); color: var(--gink); } .pl-fit svg { width: 14px; height: 14px; }
  .pl-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; } .pl-acts .btn { min-height: 46px; padding: 0 10px; font-size: 15px; }
  .pl-none { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 16px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line); color: var(--sub); margin: 0; }

  .pl-ftabs { display: flex; gap: 4px; padding: 4px; border-radius: 99px; background: #fff; box-shadow: 0 0 0 1px var(--line); }
  .pl-ftabs button { flex: 1; min-height: 40px; border: 0; border-radius: 99px; background: none; font: 600 14.5px var(--text); color: var(--sub); }
  .pl-ftabs button.on { background: var(--g-em); color: #fff; box-shadow: 0 6px 14px #00583e33; }
  .pl-ftabs i { font-style: normal; display: inline-grid; place-items: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 99px; background: #E9CDA1; color: var(--forest); font-size: 12px; }
  .pl-post { position: relative; display: grid; gap: 10px; padding: 12px; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px var(--line), 0 10px 24px #04392810; animation: plIn .5s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes plIn { from { opacity: 0; transform: translateY(14px); } }
  .pl-au { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .pl-aul { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; padding: 0; border: 0; background: none; text-align: left; }
  .pl-aul .pl-av, .pl-aul .pl-av img, .pl-aul .pl-av .ini { border-radius: 50%; } .pl-aul .pl-av i { width: 18px; height: 18px; right: -2px; bottom: -2px; } .pl-aul .pl-av i svg { width: 10px; height: 10px; }
  .pl-aul .grow { display: grid; gap: 2px; min-width: 0; } .pl-aul b { font: 600 15.5px var(--display); color: var(--forest); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pl-aul small { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 13px; color: var(--mute); }
  .pl-vd { display: inline-flex; align-items: center; gap: 3px; color: var(--em); font-weight: 600; } .pl-vd svg { width: 14px; height: 14px; }
  .pl-mr { display: inline-flex; align-items: center; gap: 3px; } .pl-mr svg { width: 14px; height: 14px; color: #c8a066; fill: #c8a066; } .pl-mr b { color: var(--ink); }
  .pl-fol { flex: none; display: inline-flex; align-items: center; gap: 4px; min-height: 36px; padding: 0 14px; border: 0; border-radius: 99px; background: var(--g-em); color: #fff; font: 600 13.5px var(--text); transition: transform .2s cubic-bezier(.2,.8,.2,1), background .2s; }
  .pl-fol svg { width: 15px; height: 15px; } .pl-fol:active { transform: scale(.94); }
  .pl-fol.on { background: #fff; color: var(--em); box-shadow: 0 0 0 1.5px var(--mint2); }
  .pl-media { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; padding: 0; border: 0; border-radius: 16px; overflow: hidden; background: var(--mint); }
  .pl-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); } .pl-media:hover img { transform: scale(1.03); }
  .pl-media.txt { aspect-ratio: 16 / 9; background: radial-gradient(120% 90% at 0 0, #fff 0, #f3faf6 40%, #fbf3e4 100%); }
  .pl-media .q { display: grid; gap: 8px; align-content: center; height: 100%; padding: 22px; text-align: left; color: var(--forest); }
  .pl-media .q svg { width: 26px; height: 26px; color: #c8a066; } .pl-media .q b { font: 600 20px/1.35 var(--display); }
  .pl-kind { position: absolute; top: 10px; left: 10px; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 99px; background: #fffffff0; color: var(--forest); font: 600 12.5px var(--text); box-shadow: 0 4px 10px #04392818; } .pl-kind svg { width: 13px; height: 13px; color: var(--em); }
  .pl-playb { position: absolute; inset: 0; margin: auto; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; background: #ffffffe8; color: var(--em); box-shadow: 0 8px 22px #04392830; } .pl-playb svg { width: 24px; height: 24px; fill: currentColor; margin-left: 3px; }
  .pl-pt { margin: 0; font: 600 16.5px/1.4 var(--display); color: var(--ink); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .pl-pa { display: flex; gap: 4px; border-top: 1px solid var(--line); padding-top: 6px; }
  .pl-pa button { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 40px; border: 0; border-radius: 12px; background: none; font: 500 13.5px var(--text); color: var(--sub); }
  .pl-pa button svg { width: 17px; height: 17px; transition: transform .25s cubic-bezier(.2,.8,.2,1); }
  .pl-pa button.on { color: var(--em); } .pl-pa button.on svg { fill: currentColor; transform: scale(1.15); }
  .pl-pa button[data-act="likePost"].on { color: #c2410c; }
  .pl-sugs { display: grid; gap: 10px; } .pl-rhead { display: flex; align-items: center; justify-content: space-between; }
  .pl-sugrow { display: flex; gap: 10px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px 10px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .pl-sug { flex: none; width: 236px; scroll-snap-align: start; gap: 8px; justify-items: start; }
  .pl-sugtop { display: grid; justify-items: start; gap: 8px; padding: 0; border: 0; background: none; text-align: left; } .pl-sugtop b { font: 600 15.5px var(--display); color: var(--forest); }
  .pl-sug .pl-vbox { margin-top: 0; } .pl-sugb { display: flex; gap: 6px; width: 100%; margin-top: auto; } .pl-sugb > * { flex: 1; min-height: 38px; justify-content: center; white-space: nowrap; padding: 0 10px; }
  .pl-rvc { display: grid; gap: 6px; padding: 16px; border-radius: 20px; background: linear-gradient(160deg, #fbf3e4, #fff 70%); box-shadow: 0 0 0 1px #E9CDA1; }
  .pl-rvh { display: inline-flex; align-items: center; gap: 6px; font: 600 13px var(--text); color: #8a5a1f; } .pl-rvh svg { width: 16px; height: 16px; }
  .pl-rvc .stars { color: #c8a066; letter-spacing: 2px; font-size: 18px; } .pl-rvc blockquote { margin: 0; font: 600 17px/1.45 var(--display); color: var(--forest); }
  .pl-rvc small { color: var(--mute); font-size: 13px; }
  .pl-rvto { display: flex; align-items: center; gap: 8px; margin-top: 4px; padding: 8px 10px; border: 0; border-radius: 14px; background: #fff; box-shadow: 0 0 0 1px var(--line); text-align: left; font-size: 14px; color: var(--sub); }
  .pl-rvto span { flex: 1; } .pl-rvto b { color: var(--forest); } .pl-rvto .pl-av, .pl-rvto .pl-av img, .pl-rvto .pl-av .ini { border-radius: 50%; } .pl-rvto .pl-av i { display: none; } .pl-rvto > svg { width: 18px; height: 18px; color: var(--mute); }
  .pl-empty2 { display: grid; justify-items: center; gap: 6px; padding: 22px 16px 6px; text-align: center; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px var(--line); }
  .pl-empty2 > svg { width: 30px; height: 30px; color: var(--em); } .pl-empty2 small { color: var(--mute); } .pl-empty2 .pl-sugrow { width: calc(100% + 0px); margin: 8px -16px 0; padding: 2px 16px 12px; justify-self: stretch; }
  .pl-acts3 { display: grid; grid-template-columns: auto 1fr 1fr; gap: 8px; } .pl-acts3 .btn { min-height: 46px; padding: 0 10px; font-size: 15px; } .pl-acts3 .pl-fol { min-height: 46px; }
  .pl-fh { margin: 0; font: 600 24px/1.25 var(--display); color: var(--forest); letter-spacing: -.015em; }
  .pl-count { margin: -2px 0 0; font-size: 13.5px; color: var(--mute); }
  .pl-fc.rec { box-shadow: 0 0 0 1.5px #E9CDA1, 0 10px 24px #04392810; }
  .pl-badges { display: flex; flex-wrap: wrap; gap: 6px; }
  .pl-bdg { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 99px; font: 600 12.5px var(--text); } .pl-bdg svg { width: 14px; height: 14px; }
  .pl-bdg.rec { background: linear-gradient(135deg, #f6e7cc, #E9CDA1); color: #6b4a1c; } .pl-bdg.near { background: var(--mint); color: var(--em); }
  .pl-fopen { width: 100%; padding: 0; border: 0; background: none; text-align: left; align-items: flex-start; } .pl-fn { font: 600 17px/1.3 var(--display); color: var(--forest); }
  .pl-fopen .pl-chev { align-self: center; width: 20px; height: 20px; color: var(--mute); flex: none; }
  .pl-idfol { margin-top: 8px; justify-self: start; min-height: 42px; padding: 0 18px; }
  @media (prefers-reduced-motion: reduce) { html:not(.motion-on) .pl-post { animation: none; } }
  /* ---------- Palm's board: Level 1 detail + Level 2 profile ---------- */
  .pl-hero { position: relative; height: 230px; flex: none; overflow: hidden; background: linear-gradient(150deg, hsl(var(--h) 40% 90%), hsl(var(--h) 35% 78%)); }
  .pl-hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
  .pl-hero .ini { display: grid; place-items: center; height: 100%; font: 600 96px var(--display); color: hsl(var(--h) 45% 30%); opacity: .55; }
  .pl-hero::after { content: ''; position: absolute; inset: auto 0 0; height: 70px; background: linear-gradient(#fff0, #fff); }
  .pl-hero .ib { position: absolute; top: 12px; left: 12px; background: #ffffffe6; box-shadow: 0 4px 12px #04392820; z-index: 1; }
  .pl-hero .smp { position: absolute; top: 20px; right: 16px; z-index: 1; }
  .pl-body { margin-top: -46px; position: relative; z-index: 1; }
  .pl-id { display: grid; gap: 5px; padding: 16px; border-radius: 22px; background: #fff; box-shadow: 0 0 0 1px var(--line), 0 14px 30px #04392814; }
  .pl-id h1 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 23px; line-height: 1.25; color: var(--forest); }
  .pl-id h1 i { width: 24px; height: 24px; border-radius: 50%; background: var(--em); color: #fff; display: grid; place-items: center; flex: none; } .pl-id h1 i svg { width: 14px; height: 14px; stroke-width: 3; }
  .pl-id .pl-tags { margin-top: 6px; }
  .pl-why { padding: 14px 16px; border-radius: 20px; background: var(--g-goldglow), linear-gradient(150deg, #f3f8f5, #fbf6ec); box-shadow: 0 0 0 1px #e8dcc4; }
  .pl-why h2 { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; font-size: 16.5px; color: var(--forest); } .pl-why h2 svg { color: var(--gold); }
  .pl-why ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  .pl-why li { display: flex; gap: 8px; align-items: flex-start; font-size: 15px; color: var(--ink); } .pl-why li svg { color: var(--em); margin-top: 3px; }
  .pl-tabs { position: sticky; top: 0; z-index: 3; display: flex; gap: 4px; padding: 4px; border-radius: 99px; background: var(--mint); overflow-x: auto; }
  .pl-tabs button { flex: 1 0 auto; min-height: 40px; padding: 0 12px; border: 0; border-radius: 99px; background: none; font: 600 14.5px var(--text); color: var(--sub); white-space: nowrap; }
  .pl-tabs button.on { background: #fff; color: var(--forest); box-shadow: 0 4px 12px #04392818; }
  .pl-tab { display: grid; gap: 12px; }
  .pl-sec { padding: 14px 16px; border-radius: 20px; background: #fff; box-shadow: 0 0 0 1px var(--line), 0 8px 20px #0439280c; display: grid; gap: 10px; min-width: 0; }
  .pl-sec > h2 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 16.5px; color: var(--forest); }
  .pl-sec > h2 svg { width: 30px; height: 30px; padding: 6px; border-radius: 10px; background: var(--mint); color: var(--em); }
  .pl-bio { margin: 0; padding: 12px 14px; border-radius: 14px; background: var(--cream); color: var(--ink); font-size: 15.5px; line-height: 1.65; position: relative; }
  .pl-bio::before { content: '“'; position: absolute; top: -10px; left: 8px; font: 700 40px/1 var(--display); color: var(--gold); }
  .pl-kv { display: grid; grid-template-columns: auto 1fr; gap: 8px 12px; margin: 0; font-size: 14.5px; }
  .pl-kv dt { display: flex; align-items: center; gap: 6px; color: var(--mute); white-space: nowrap; } .pl-kv dt svg { color: var(--em); width: 16px; height: 16px; } .pl-kv dd { margin: 0; color: var(--ink); min-width: 0; }
  .pl-ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  .pl-ul li { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 14px; background: #f7faf8; }
  .pl-ul li > svg { width: 30px; height: 30px; padding: 7px; border-radius: 50%; background: #fff; color: var(--em); box-shadow: 0 0 0 1px var(--mint2); flex: none; }
  .pl-ul li.main { background: var(--mint); } .pl-ul li.main > svg { background: var(--em); color: #fff; box-shadow: none; }
  .pl-ul b { display: block; font-size: 15px; color: var(--ink); } .pl-ul small { font-size: 12.5px; color: var(--mute); }
  .pl-line { list-style: none; margin: 0; padding: 0 0 0 18px; display: grid; gap: 12px; border-left: 2px solid var(--mint2); }
  .pl-line li { position: relative; display: grid; gap: 1px; } .pl-line li::before { content: ''; position: absolute; left: -25px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px var(--em); }
  .pl-line b { font-size: 15px; color: var(--ink); } .pl-line span { font-size: 14px; color: var(--sub); } .pl-line small { font-size: 13px; color: var(--em); font-weight: 600; }
  .pl-lic { display: flex; align-items: center; gap: 10px; margin: 0; } .pl-lic > svg { width: 36px; height: 36px; padding: 8px; border-radius: 12px; background: var(--g-em); color: #fff; }
  .pl-lic b { display: block; font-size: 16px; color: var(--forest); } .pl-lic small { font-size: 13px; color: var(--mute); }
  .pl-certf { display: grid; justify-items: center; gap: 4px; padding: 14px; border-radius: 12px; background: linear-gradient(#fffdf7, #f8f0df); box-shadow: inset 0 0 0 6px #fff, inset 0 0 0 7px #e5d3ad; text-align: center; }
  .pl-certf i { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--gold2), var(--gold)); color: #fff; }
  .pl-certf b { font: 600 14px var(--display); color: var(--gink); letter-spacing: .02em; } .pl-certf small { font-size: 12.5px; color: var(--sub); }
  .pl-score { display: flex; align-items: center; gap: 10px; margin: 0; } .pl-score b { font-size: 34px; line-height: 1; color: var(--forest); } .pl-score span:last-child { color: var(--mute); font-size: 14px; }
  .pl-rv { margin: 0; padding: 12px 14px; border-radius: 14px; background: #f7faf8; display: grid; gap: 4px; }
  .pl-rv .stars { color: var(--gold); letter-spacing: 2px; } .pl-rv blockquote { margin: 0; font-size: 15px; color: var(--ink); } .pl-rv figcaption { font-size: 13px; color: var(--mute); }
  .pl-empty { display: flex; align-items: center; gap: 8px; margin: 0; padding: 14px 16px; border-radius: 16px; background: #f7faf8; color: var(--sub); font-size: 14.5px; } .pl-empty svg { color: var(--em); flex: none; }
  </style>`);
  /* ---------------- Facts ---------------- */
  const POSTAL = { 'พระนคร': '10200', 'ดุสิต': '10300', 'ป้อมปราบศัตรูพ่าย': '10100', 'สัมพันธวงศ์': '10100', 'ดินแดง': '10400', 'ห้วยขวาง': '10310', 'พญาไท': '10400', 'ราชเทวี': '10400', 'วังทองหลาง': '10310',
    'จตุจักร': '10900', 'บางซื่อ': '10800', 'ลาดพร้าว': '10230', 'หลักสี่': '10210', 'ดอนเมือง': '10210', 'สายไหม': '10220', 'บางเขน': '10220',
    'ปทุมวัน': '10330', 'บางรัก': '10500', 'สาทร': '10120', 'บางคอแหลม': '10120', 'ยานนาวา': '10120', 'คลองเตย': '10110', 'วัฒนา': '10110', 'พระโขนง': '10260', 'สวนหลวง': '10250', 'บางนา': '10260',
    'บางกะปิ': '10240', 'สะพานสูง': '10240', 'บึงกุ่ม': '10240', 'คันนายาว': '10230', 'ลาดกระบัง': '10520', 'มีนบุรี': '10510', 'หนองจอก': '10530', 'คลองสามวา': '10510', 'ประเวศ': '10250',
    'ธนบุรี': '10600', 'คลองสาน': '10600', 'จอมทอง': '10150', 'บางกอกใหญ่': '10600', 'บางกอกน้อย': '10700', 'บางพลัด': '10700', 'ตลิ่งชัน': '10170', 'ทวีวัฒนา': '10170',
    'ภาษีเจริญ': '10160', 'บางแค': '10160', 'หนองแขม': '10160', 'บางขุนเทียน': '10150', 'บางบอน': '10150', 'ราษฎร์บูรณะ': '10140', 'ทุ่งครุ': '10140' };
  // All 180 แขวง of Bangkok's 50 เขต with their postcodes, from the real app's geography data (apps/web/src/features/addresses/data/thailand-geography.ts).
  const SUBS = {"พระนคร":["พระบรมมหาราชวัง","วังบูรพาภิรมย์","วัดราชบพิธ","สำราญราษฎร์","ศาลเจ้าพ่อเสือ","เสาชิงช้า","บวรนิเวศ","ตลาดยอด","ชนะสงคราม","บ้านพานถม","บางขุนพรหม","วัดสามพระยา"],"ดุสิต":["ดุสิต","วชิรพยาบาล","สวนจิตรลดา","สี่แยกมหานาค","ถนนนครไชยศรี"],"หนองจอก":["กระทุ่มราย","หนองจอก","คลองสิบ","คลองสิบสอง","โคกแฝด","คู้ฝั่งเหนือ","ลำผักชี","ลำต้อยติ่ง"],"บางรัก":["มหาพฤฒาราม","สีลม","สุริยวงศ์","บางรัก","สี่พระยา"],"บางเขน":["อนุสาวรีย์","ท่าแร้ง"],"บางกะปิ":["คลองจั่น","หัวหมาก"],"ปทุมวัน":["รองเมือง","วังใหม่","ปทุมวัน","ลุมพินี"],"ป้อมปราบศัตรูพ่าย":["ป้อมปราบ","วัดเทพศิรินทร์","คลองมหานาค","บ้านบาตร","วัดโสมนัส"],"พระโขนง":["บางจาก","พระโขนงใต้"],"มีนบุรี":["มีนบุรี","แสนแสบ"],"ลาดกระบัง":["ลาดกระบัง","คลองสองต้นนุ่น","คลองสามประเวศ","ลำปลาทิว","ทับยาว","ขุมทอง"],"ยานนาวา":["ช่องนนทรี","บางโพงพาง"],"สัมพันธวงศ์":["จักรวรรดิ","สัมพันธวงศ์","ตลาดน้อย"],"พญาไท":["สามเสนใน","พญาไท"],"ธนบุรี":["วัดกัลยาณ์","หิรัญรูจี","บางยี่เรือ","บุคคโล","ตลาดพลู","ดาวคะนอง","สำเหร่"],"บางกอกใหญ่":["วัดอรุณ","วัดท่าพระ"],"ห้วยขวาง":["ห้วยขวาง","บางกะปิ","สามเสนนอก"],"คลองสาน":["สมเด็จเจ้าพระยา","คลองสาน","บางลำภูล่าง","คลองต้นไทร"],"ตลิ่งชัน":["คลองชักพระ","ตลิ่งชัน","ฉิมพลี","บางพรม","บางระมาด","บางเชือกหนัง"],"บางกอกน้อย":["ศิริราช","บ้านช่างหล่อ","บางขุนนนท์","บางขุนศรี","อรุณอมรินทร์"],"บางขุนเทียน":["ท่าข้าม","แสมดำ"],"ภาษีเจริญ":["บางหว้า","บางด้วน","บางจาก","บางแวก","คลองขวาง","ปากคลองภาษีเจริญ","คูหาสวรรค์"],"หนองแขม":["หนองแขม","หนองค้างพลู"],"ราษฎร์บูรณะ":["ราษฎร์บูรณะ","บางปะกอก"],"บางพลัด":["บางพลัด","บางอ้อ","บางบำหรุ","บางยี่ขัน"],"ดินแดง":["ดินแดง","รัชดาภิเษก"],"บึงกุ่ม":["คลองกุ่ม","นวมินทร์","นวลจันทร์"],"สาทร":["ทุ่งวัดดอน","ยานนาวา","ทุ่งมหาเมฆ"],"บางซื่อ":["บางซื่อ","วงศ์สว่าง"],"จตุจักร":["ลาดยาว","เสนานิคม","จันทรเกษม","จอมพล","จตุจักร"],"บางคอแหลม":["บางคอแหลม","วัดพระยาไกร","บางโคล่"],"ประเวศ":["ประเวศ","หนองบอน","ดอกไม้"],"คลองเตย":["คลองเตย","คลองตัน","พระโขนง"],"สวนหลวง":["สวนหลวง","อ่อนนุช","พัฒนาการ"],"จอมทอง":["บางขุนเทียน","บางค้อ","บางมด","จอมทอง"],"ดอนเมือง":["สีกัน","ดอนเมือง","สนามบิน"],"ราชเทวี":["ทุ่งพญาไท","ถนนพญาไท","ถนนเพชรบุรี","มักกะสัน"],"ลาดพร้าว":["ลาดพร้าว","จรเข้บัว"],"วัฒนา":["คลองเตยเหนือ","คลองตันเหนือ","พระโขนงเหนือ"],"บางแค":["บางแค","บางแคเหนือ","บางไผ่","หลักสอง"],"หลักสี่":["ทุ่งสองห้อง","ตลาดบางเขน"],"สายไหม":["สายไหม","ออเงิน","คลองถนน"],"คันนายาว":["คันนายาว","รามอินทรา"],"สะพานสูง":["สะพานสูง","ราษฎร์พัฒนา","ทับช้าง"],"วังทองหลาง":["วังทองหลาง","สะพานสอง","คลองเจ้าคุณสิงห์","พลับพลา"],"คลองสามวา":["สามวาตะวันตก","สามวาตะวันออก","บางชัน","ทรายกองดิน","ทรายกองดินใต้"],"บางนา":["บางนาเหนือ","บางนาใต้"],"ทวีวัฒนา":["ทวีวัฒนา","ศาลาธรรมสพน์"],"ทุ่งครุ":["บางมด","ทุ่งครุ"],"บางบอน":["บางบอนเหนือ","บางบอนใต้","คลองบางพราน","คลองบางบอน"]};
  const POSTAL_SUB = {"พระนคร|พระบรมมหาราชวัง":"10200","พระนคร|วังบูรพาภิรมย์":"10200","พระนคร|วัดราชบพิธ":"10200","พระนคร|สำราญราษฎร์":"10200","พระนคร|ศาลเจ้าพ่อเสือ":"10200","พระนคร|เสาชิงช้า":"10200","พระนคร|บวรนิเวศ":"10200","พระนคร|ตลาดยอด":"10200","พระนคร|ชนะสงคราม":"10200","พระนคร|บ้านพานถม":"10200","พระนคร|บางขุนพรหม":"10200","พระนคร|วัดสามพระยา":"10200","ดุสิต|ดุสิต":"10300","ดุสิต|วชิรพยาบาล":"10300","ดุสิต|สวนจิตรลดา":"10300","ดุสิต|สี่แยกมหานาค":"10300","ดุสิต|ถนนนครไชยศรี":"10300","หนองจอก|กระทุ่มราย":"10530","หนองจอก|หนองจอก":"10530","หนองจอก|คลองสิบ":"10530","หนองจอก|คลองสิบสอง":"10530","หนองจอก|โคกแฝด":"10530","หนองจอก|คู้ฝั่งเหนือ":"10530","หนองจอก|ลำผักชี":"10530","หนองจอก|ลำต้อยติ่ง":"10530","บางรัก|มหาพฤฒาราม":"10500","บางรัก|สีลม":"10500","บางรัก|สุริยวงศ์":"10500","บางรัก|บางรัก":"10500","บางรัก|สี่พระยา":"10500","บางเขน|อนุสาวรีย์":"10220","บางเขน|ท่าแร้ง":"10220","บางกะปิ|คลองจั่น":"10240","บางกะปิ|หัวหมาก":"10240","ปทุมวัน|รองเมือง":"10330","ปทุมวัน|วังใหม่":"10330","ปทุมวัน|ปทุมวัน":"10330","ปทุมวัน|ลุมพินี":"10330","ป้อมปราบศัตรูพ่าย|ป้อมปราบ":"10100","ป้อมปราบศัตรูพ่าย|วัดเทพศิรินทร์":"10100","ป้อมปราบศัตรูพ่าย|คลองมหานาค":"10100","ป้อมปราบศัตรูพ่าย|บ้านบาตร":"10100","ป้อมปราบศัตรูพ่าย|วัดโสมนัส":"10100","พระโขนง|บางจาก":"10260","พระโขนง|พระโขนงใต้":"10260","มีนบุรี|มีนบุรี":"10510","มีนบุรี|แสนแสบ":"10510","ลาดกระบัง|ลาดกระบัง":"10520","ลาดกระบัง|คลองสองต้นนุ่น":"10520","ลาดกระบัง|คลองสามประเวศ":"10520","ลาดกระบัง|ลำปลาทิว":"10520","ลาดกระบัง|ทับยาว":"10520","ลาดกระบัง|ขุมทอง":"10520","ยานนาวา|ช่องนนทรี":"10120","ยานนาวา|บางโพงพาง":"10120","สัมพันธวงศ์|จักรวรรดิ":"10100","สัมพันธวงศ์|สัมพันธวงศ์":"10100","สัมพันธวงศ์|ตลาดน้อย":"10100","พญาไท|สามเสนใน":"10400","พญาไท|พญาไท":"10400","ธนบุรี|วัดกัลยาณ์":"10600","ธนบุรี|หิรัญรูจี":"10600","ธนบุรี|บางยี่เรือ":"10600","ธนบุรี|บุคคโล":"10600","ธนบุรี|ตลาดพลู":"10600","ธนบุรี|ดาวคะนอง":"10600","ธนบุรี|สำเหร่":"10600","บางกอกใหญ่|วัดอรุณ":"10600","บางกอกใหญ่|วัดท่าพระ":"10600","ห้วยขวาง|ห้วยขวาง":"10310","ห้วยขวาง|บางกะปิ":"10310","ห้วยขวาง|สามเสนนอก":"10310","คลองสาน|สมเด็จเจ้าพระยา":"10600","คลองสาน|คลองสาน":"10600","คลองสาน|บางลำภูล่าง":"10600","คลองสาน|คลองต้นไทร":"10600","ตลิ่งชัน|คลองชักพระ":"10170","ตลิ่งชัน|ตลิ่งชัน":"10170","ตลิ่งชัน|ฉิมพลี":"10170","ตลิ่งชัน|บางพรม":"10170","ตลิ่งชัน|บางระมาด":"10170","ตลิ่งชัน|บางเชือกหนัง":"10170","บางกอกน้อย|ศิริราช":"10700","บางกอกน้อย|บ้านช่างหล่อ":"10700","บางกอกน้อย|บางขุนนนท์":"10700","บางกอกน้อย|บางขุนศรี":"10700","บางกอกน้อย|อรุณอมรินทร์":"10700","บางขุนเทียน|ท่าข้าม":"10150","บางขุนเทียน|แสมดำ":"10150","ภาษีเจริญ|บางหว้า":"10160","ภาษีเจริญ|บางด้วน":"10160","ภาษีเจริญ|บางจาก":"10160","ภาษีเจริญ|บางแวก":"10160","ภาษีเจริญ|คลองขวาง":"10160","ภาษีเจริญ|ปากคลองภาษีเจริญ":"10160","ภาษีเจริญ|คูหาสวรรค์":"10160","หนองแขม|หนองแขม":"10160","หนองแขม|หนองค้างพลู":"10160","ราษฎร์บูรณะ|ราษฎร์บูรณะ":"10140","ราษฎร์บูรณะ|บางปะกอก":"10140","บางพลัด|บางพลัด":"10700","บางพลัด|บางอ้อ":"10700","บางพลัด|บางบำหรุ":"10700","บางพลัด|บางยี่ขัน":"10700","ดินแดง|ดินแดง":"10400","ดินแดง|รัชดาภิเษก":"10400","บึงกุ่ม|คลองกุ่ม":"10240","บึงกุ่ม|นวมินทร์":"10240","บึงกุ่ม|นวลจันทร์":"10240","สาทร|ทุ่งวัดดอน":"10120","สาทร|ยานนาวา":"10120","สาทร|ทุ่งมหาเมฆ":"10120","บางซื่อ|บางซื่อ":"10800","บางซื่อ|วงศ์สว่าง":"10800","จตุจักร|ลาดยาว":"10900","จตุจักร|เสนานิคม":"10900","จตุจักร|จันทรเกษม":"10900","จตุจักร|จอมพล":"10900","จตุจักร|จตุจักร":"10900","บางคอแหลม|บางคอแหลม":"10120","บางคอแหลม|วัดพระยาไกร":"10120","บางคอแหลม|บางโคล่":"10120","ประเวศ|ประเวศ":"10250","ประเวศ|หนองบอน":"10250","ประเวศ|ดอกไม้":"10250","คลองเตย|คลองเตย":"10110","คลองเตย|คลองตัน":"10110","คลองเตย|พระโขนง":"10110","สวนหลวง|สวนหลวง":"10250","สวนหลวง|อ่อนนุช":"10250","สวนหลวง|พัฒนาการ":"10250","จอมทอง|บางขุนเทียน":"10150","จอมทอง|บางค้อ":"10150","จอมทอง|บางมด":"10150","จอมทอง|จอมทอง":"10150","ดอนเมือง|สีกัน":"10210","ดอนเมือง|ดอนเมือง":"10210","ดอนเมือง|สนามบิน":"10210","ราชเทวี|ทุ่งพญาไท":"10400","ราชเทวี|ถนนพญาไท":"10400","ราชเทวี|ถนนเพชรบุรี":"10400","ราชเทวี|มักกะสัน":"10400","ลาดพร้าว|ลาดพร้าว":"10230","ลาดพร้าว|จรเข้บัว":"10230","วัฒนา|คลองเตยเหนือ":"10110","วัฒนา|คลองตันเหนือ":"10110","วัฒนา|พระโขนงเหนือ":"10110","บางแค|บางแค":"10160","บางแค|บางแคเหนือ":"10160","บางแค|บางไผ่":"10160","บางแค|หลักสอง":"10160","หลักสี่|ทุ่งสองห้อง":"10210","หลักสี่|ตลาดบางเขน":"10210","สายไหม|สายไหม":"10220","สายไหม|ออเงิน":"10220","สายไหม|คลองถนน":"10220","คันนายาว|คันนายาว":"10230","คันนายาว|รามอินทรา":"10230","สะพานสูง|สะพานสูง":"10240","สะพานสูง|ราษฎร์พัฒนา":"10240","สะพานสูง|ทับช้าง":"10250","วังทองหลาง|วังทองหลาง":"10310","วังทองหลาง|สะพานสอง":"10310","วังทองหลาง|คลองเจ้าคุณสิงห์":"10310","วังทองหลาง|พลับพลา":"10310","คลองสามวา|สามวาตะวันตก":"10510","คลองสามวา|สามวาตะวันออก":"10510","คลองสามวา|บางชัน":"10510","คลองสามวา|ทรายกองดิน":"10510","คลองสามวา|ทรายกองดินใต้":"10510","บางนา|บางนาเหนือ":"10260","บางนา|บางนาใต้":"10260","ทวีวัฒนา|ทวีวัฒนา":"10170","ทวีวัฒนา|ศาลาธรรมสพน์":"10170","ทุ่งครุ|บางมด":"10140","ทุ่งครุ|ทุ่งครุ":"10140","บางบอน|บางบอนเหนือ":"10150","บางบอน|บางบอนใต้":"10150","บางบอน|คลองบางพราน":"10150","บางบอน|คลองบางบอน":"10150"};
  const subsOf = d => d ? (SUBS[d] || [d]) : [];
  const zoneOf = d => SC.ZONES.find(z => z.districts.includes(d));
  const DAYS = ['ส. 24 ต.ค.', 'อา. 25 ต.ค.', 'จ. 26 ต.ค.', 'อ. 27 ต.ค.', 'พ. 28 ต.ค.', 'พฤ. 29 ต.ค.', 'ศ. 30 ต.ค.'];
  const TIMES = Array.from({ length: 23 }, (_, i) => `${String(8 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
  const STEP_LABELS = ['เริ่มต้น', 'ผู้รับบริการ', 'เป้าหมาย', 'ข้อมูลสุขภาพ', 'กิจวัตร', 'ที่อยู่', 'เวลา', 'การใช้ข้อมูล', 'สรุป'];
  const GOALS = [['WALK', 'เดินในบ้านได้มั่นใจขึ้น', 'footprints'], ['TRANSFER', 'ลุกนั่งและย้ายตัวได้สะดวกขึ้น', 'armchair'], ['SELF_CARE', 'ดูแลตัวเองในชีวิตประจำวันได้มากขึ้น', 'heart-handshake'],
    ['PAIN', 'ลดอาการปวด', 'heart'], ['ACTIVITIES', 'กลับไปทำกิจกรรมที่ชอบ', 'activity'], ['OTHER', 'อื่น ๆ', 'sparkles']];
  const GOAL_TEXT = { WALK: 'เดินในบ้านได้มั่นใจขึ้น', TRANSFER: 'ลุกนั่งและย้ายตัวได้สะดวกขึ้น', SELF_CARE: 'ดูแลตัวเองได้มากขึ้น', PAIN: 'ลดอาการปวด', ACTIVITIES: 'กลับไปทำกิจกรรมที่ชอบ', OTHER: 'เป้าหมายอื่นที่คุณเล่าไว้' };
  const HEALTH = [
    { k: 'q1', t: 'ตอนนี้มีอาการเหล่านี้ไหม?', sub: 'เจ็บแน่นหน้าอกขึ้นมาใหม่ · หอบมาก หายใจไม่ทัน · อ่อนแรง ปากเบี้ยว พูดไม่ชัดฉับพลัน', yes: 'มี', no: 'ไม่มี', urgent: true },
    { k: 'q2', t: 'ความดันโลหิตที่วัดครั้งล่าสุดเท่าไหร่?', sub: 'ดูจากเครื่องวัดหรือสมุดบันทึก ใส่ตัวบนและตัวล่าง', bp: true },
    { k: 'q3', t: 'มีสายหรืออุปกรณ์ช่วยดูแลอยู่ไหม?', sub: 'เช่น สายให้อาหาร ออกซิเจน ท่อเจาะคอ เครื่องช่วยหายใจ', yes: 'มี', no: 'ไม่มี' },
    { k: 'q4', t: 'เพิ่งออกจากโรงพยาบาล หรือมีข้อห้ามจากแพทย์ไหม?', yes: 'มี', no: 'ไม่มี' },
    { k: 'q5', t: 'เคยผ่าตัด หรือมีอุปกรณ์ในร่างกายไหม?', sub: 'เช่น เหล็ก สกรู ข้อเทียม เครื่องกระตุ้นหัวใจ', yes: 'เคย', no: 'ไม่เคย' },
    { k: 'q6', t: 'มีโรคประจำตัวไหม?', sub: 'เช่น เบาหวาน โรคหัวใจ โรคไต หลอดเลือดสมอง', yes: 'มี', no: 'ไม่มี' }
  ];
  const DEVICES = ['สายให้อาหาร', 'ออกซิเจน', 'ท่อเจาะคอ', 'เครื่องช่วยหายใจ', 'สายสวนปัสสาวะ', 'สายน้ำเกลือ / สายให้ยา', 'ถุงหน้าท้อง', 'อื่น ๆ'];
  const CONDITIONS = ['เบาหวาน', 'โรคหัวใจ', 'โรคไต', 'หลอดเลือดสมอง', 'กระดูกพรุน', 'พาร์กินสัน', 'อื่น ๆ'];
  const BARTHEL = [
    { k: 'feeding', t: 'การรับประทานอาหาร', c: 'เมื่อเตรียมอาหารไว้ตรงหน้าแล้ว', ic: 'soup', o: [[2, 'ตักอาหารกินเองได้'], [1, 'กินเองได้ แต่ต้องช่วยเตรียม', 'เช่น ตัดเป็นชิ้นเล็ก'], [0, 'ต้องมีคนป้อน']] },
    { k: 'grooming', t: 'ล้างหน้า แปรงฟัน หวีผม', c: 'ใน 1–2 วันที่ผ่านมา', ic: 'smile', o: [[1, 'ทำได้เอง', 'รวมถึงเมื่อมีคนเตรียมของให้'], [0, 'ต้องมีคนช่วย']] },
    { k: 'transfer', t: 'ลุกนั่งและย้ายไปเก้าอี้', c: 'ลุกจากที่นอน หรือย้ายจากเตียงไปเก้าอี้', ic: 'armchair', o: [[3, 'ทำได้เอง'], [2, 'ต้องช่วยเล็กน้อย', 'พยุงนิดหน่อย หรือมีคนดูอยู่ข้าง ๆ'], [1, 'ต้องช่วยพยุงมาก', 'คนแข็งแรง 1 คน หรือคนทั่วไป 2 คน'], [0, 'นั่งเองไม่ได้ หรือต้องยกตัว']] },
    { k: 'toilet', t: 'การใช้ห้องน้ำ', c: 'ทำความสะอาดและจัดเสื้อผ้าหลังขับถ่าย', ic: 'toilet', o: [[2, 'ช่วยตัวเองได้ดี'], [1, 'ทำเองได้บางส่วน'], [0, 'ช่วยตัวเองไม่ได้']] },
    { k: 'mobility', t: 'การเคลื่อนที่ในบ้าน', ic: 'footprints', o: [[3, 'เดินได้เอง', 'ใช้ไม้เท้าหรือที่ช่วยเดินได้'], [2, 'เดินได้เมื่อมีคนช่วย'], [1, 'ใช้รถเข็นเองได้'], [0, 'เคลื่อนที่เองไม่ได้']] },
    { k: 'dressing', t: 'การแต่งตัว', ic: 'shirt', o: [[2, 'แต่งตัวเองได้'], [1, 'ทำเองได้ประมาณครึ่งหนึ่ง'], [0, 'ต้องมีคนแต่งตัวให้']] },
    { k: 'stairs', t: 'การขึ้นลงบันได 1 ชั้น', c: 'ตอบจากที่ทำได้ ไม่ต้องลองเพื่อกรอก', ic: 'arrow-up-down', o: [[2, 'ขึ้นลงเองได้'], [1, 'ต้องมีคนช่วย'], [0, 'ขึ้นลงไม่ได้']] },
    { k: 'bathing', t: 'การอาบน้ำ', ic: 'bath', o: [[1, 'อาบน้ำเองได้'], [0, 'ต้องมีคนช่วยอาบน้ำ']] },
    { k: 'bowels', t: 'การกลั้นอุจจาระ', c: 'ใน 1 สัปดาห์ที่ผ่านมา', ic: 'toilet', o: [[2, 'กลั้นได้ตามปกติ'], [1, 'กลั้นไม่ได้บางครั้ง', 'ไม่เกินสัปดาห์ละครั้ง'], [0, 'กลั้นไม่ได้ หรือต้องสวนประจำ']] },
    { k: 'bladder', t: 'การกลั้นปัสสาวะ', c: 'ใน 1 สัปดาห์ที่ผ่านมา', ic: 'droplets', o: [[2, 'กลั้นได้ตามปกติ'], [1, 'กลั้นไม่ได้บางครั้ง', 'ไม่เกินวันละครั้ง'], [0, 'กลั้นไม่ได้ หรือดูแลสายสวนเองไม่ได้']] }
  ];
  const MAX = Object.fromEntries(BARTHEL.map(q => [q.k, q.o[0][0]]));
  // Hand-drawn ADL stickers (viewBox 40): e = emerald line, m = mint fill, g = gold fill, gi = gold line. Classes a-* move only on the next card to answer.
  const ADL_ART = {
    feeding: `<g class="a a-steam"><path class="gi" d="M15 13c-2-2 2-3.5 0-6"/><path class="gi" d="M20 13c-2-2 2-3.5 0-6"/><path class="gi" d="M25 13c-2-2 2-3.5 0-6"/></g><path class="m" d="M6 19h28a14 14 0 0 1-28 0z"/><path class="e" d="M6 19h28a14 14 0 0 1-28 0zM4 19h32M15 33h10"/><path class="g" d="M11 23a9 9 0 0 0 6 6" opacity=".9"/>`,
    grooming: `<g class="a a-brush"><rect class="m" x="5" y="22" width="22" height="6" rx="3"/><rect class="g" x="22" y="14" width="11" height="8" rx="2.5"/><path class="e" d="M8 22h16.5a3 3 0 0 1 0 6H8a3 3 0 0 1 0-6zM22 22v-5.5a2.5 2.5 0 0 1 2.5-2.5h6a2.5 2.5 0 0 1 2.5 2.5V22M25.5 14v8M29.5 14v8"/></g><path class="a a-twinkle gi" d="M10 8v6M7 11h6"/>`,
    transfer: `<rect class="m" x="9" y="7" width="6" height="17" rx="3"/><rect class="g" x="9" y="20" width="19" height="6" rx="3"/><path class="e" d="M12 7v17M9.5 23h18M12 26v8M26 26v8"/><g class="a a-hop"><path class="e" d="M32 20V8M28 12l4-4 4 4"/></g>`,
    toilet: `<rect class="m" x="9" y="6" width="13" height="11" rx="3"/><path class="w" d="M7 17h25a11 11 0 0 1-11 11h-3A11 11 0 0 1 7 17z"/><path class="g" d="M15 28l-1.5 6h12l-1.5-6z"/><path class="e" d="M9 17V9a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v8M7 17h25a11 11 0 0 1-11 11h-3A11 11 0 0 1 7 17zM15 28l-1.5 6h12l-1.5-6"/><path class="a a-twinkle gi" d="M33 5v6M30 8h6"/>`,
    mobility: `<g class="a a-stepL"><path class="m" d="M13 19c3.4 0 5.4 3.4 5.4 8.2S16.4 37 13 37s-5.4-3.6-5.4-9.8S9.6 19 13 19z"/><path class="e" d="M13 19c3.4 0 5.4 3.4 5.4 8.2S16.4 37 13 37s-5.4-3.6-5.4-9.8S9.6 19 13 19z"/><circle cx="9.6" cy="15.6" r="1.5" fill="#00583e"/><circle cx="13" cy="14.2" r="1.7" fill="#00583e"/><circle cx="16.4" cy="15.6" r="1.5" fill="#00583e"/></g><g class="a a-stepR"><path class="g" d="M27 12c3.4 0 5.4 3.4 5.4 8.2S30.4 30 27 30s-5.4-3.6-5.4-9.8S23.6 12 27 12z"/><path class="e" d="M27 12c3.4 0 5.4 3.4 5.4 8.2S30.4 30 27 30s-5.4-3.6-5.4-9.8S23.6 12 27 12z"/><circle cx="23.6" cy="8.6" r="1.5" fill="#00583e"/><circle cx="27" cy="7.199999999999999" r="1.7" fill="#00583e"/><circle cx="30.4" cy="8.6" r="1.5" fill="#00583e"/></g>`,
    dressing: `<g class="a a-sway"><path class="gi" d="M20 3v3"/><path class="m" d="M14 9l-8 5 3.5 6 4.5-2.5V34h12V17.5l4.5 2.5 3.5-6-8-5c-1 2.5-3.2 3.6-6 3.6s-5-1.1-6-3.6z"/><path class="e" d="M14 9l-8 5 3.5 6 4.5-2.5V34h12V17.5l4.5 2.5 3.5-6-8-5c-1 2.5-3.2 3.6-6 3.6s-5-1.1-6-3.6z"/><rect class="g" x="21" y="20" width="4.5" height="4.5" rx="1"/></g>`,
    stairs: `<path class="m" d="M5 33h9v-7h8v-7h8v-7h6v21z"/><path class="e" d="M4 33h10v-7h8v-7h8v-7h7"/><g class="a a-climb"><circle class="g" cx="9.5" cy="29" r="3"/><circle class="e" cx="9.5" cy="29" r="3"/></g>`,
    bathing: `<g class="a a-bub"><circle class="w" cx="19" cy="15" r="2.4" stroke="#00583e" stroke-width="1.6"/><circle class="w" cx="25" cy="13" r="1.8" stroke="#00583e" stroke-width="1.6"/><circle class="w" cx="29.5" cy="16" r="2.2" stroke="#00583e" stroke-width="1.6"/></g><path class="m" d="M5 20h30v4a9 9 0 0 1-9 9H14a9 9 0 0 1-9-9z"/><path class="e" d="M3.5 20h33M5 20v4a9 9 0 0 0 9 9h12a9 9 0 0 0 9-9v-4M9 20V10a3.5 3.5 0 0 1 7 0M12 33l-1.5 3M28 33l1.5 3"/><path class="g" d="M8 24h8" opacity=".9"/>`,
    bowels: `<rect class="w" x="6" y="9" width="28" height="25" rx="5"/><path class="m" d="M6 14a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v2H6z"/><path class="e" d="M11 9h18a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5zM6 16h28M13 6v6M27 6v6"/><path class="a a-check" d="M14 25l4 4 8-8" fill="none" stroke="#c8a066" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`,
    bladder: `<ellipse class="a a-ripple gi" cx="20" cy="35" rx="9" ry="2.4"/><g class="a a-bob"><path class="m" d="M20 4c6.5 8.5 11 14 11 19.5a11 11 0 0 1-22 0C9 18 13.5 12.5 20 4z"/><path class="e" d="M20 4c6.5 8.5 11 14 11 19.5a11 11 0 0 1-22 0C9 18 13.5 12.5 20 4z"/><path class="g" d="M14.5 23a6 6 0 0 0 4 5.5" stroke="#e9cda1" stroke-width="3" stroke-linecap="round" fill="none"/></g>`
  };
  let adlSeen = null, adlPop = { k: '', t: 0 };
  function adlIcon(q, b, cur) {
    const ok = b[q.k] !== undefined, fresh = ok && adlPop.k === q.k && performance.now() - adlPop.t < 200;
    return `<span class="pp-adl ${cur ? 'cur' : ''} ${ok ? 'ok' : ''}" aria-hidden="true"><svg viewBox="0 0 40 40">${ADL_ART[q.k]}</svg>${ok ? `<span class="tick" ${fresh ? 'data-keep-anim' : ''}>${I('check')}</span>` : ''}</span>`;
  }
  const CAN_DO = { feeding: 'กินอาหารเองได้', grooming: 'ล้างหน้า แปรงฟันเองได้', transfer: 'ลุกนั่ง ย้ายตัวเองได้', toilet: 'เข้าห้องน้ำเองได้', mobility: 'เดินในบ้านเองได้', dressing: 'แต่งตัวเองได้', stairs: 'ขึ้นลงบันไดเองได้', bathing: 'อาบน้ำเองได้', bowels: 'กลั้นอุจจาระได้ปกติ', bladder: 'กลั้นปัสสาวะได้ปกติ' };
  const AREA = { feeding: 'การกินอาหาร', grooming: 'การล้างหน้า แปรงฟัน', transfer: 'การลุกนั่งและย้ายตัว', toilet: 'การเข้าห้องน้ำ', mobility: 'การเดินในบ้าน', dressing: 'การแต่งตัว', stairs: 'การขึ้นลงบันได', bathing: 'การอาบน้ำ', bowels: 'การขับถ่ายอุจจาระ', bladder: 'การขับถ่ายปัสสาวะ' };
  const PROFILES = {
    SELF_STARTER: { img: 'self-starter', title: 'สายลุยเองได้', tagline: 'กิจวัตรแทบทั้งหมดคุณทำได้เอง', level: 5,
      reading: 'คุณยังลุย ๆ ทำอะไรเองได้เกือบทุกอย่าง สิ่งที่ต้องการคือความมั่นใจและความคล่องตัวที่มากขึ้น นักกายภาพจะช่วยต่อยอดให้แข็งแรงขึ้นและกลับไปทำสิ่งที่ชอบได้เต็มที่',
      tips: ['ขยับร่างกายเบา ๆ ทุกวัน เช่น เดินในบ้านสั้น ๆ', 'ถ้าปวดมากขึ้นระหว่างทำกิจกรรม ให้พักก่อน'] },
    LIGHT_HELPER: { img: 'light-helper', title: 'สายมีตัวช่วย', tagline: 'ทำเองได้เยอะ มีคนช่วยอีกนิดก็สบายขึ้น', level: 4,
      reading: 'คุณยังทำหลายอย่างได้ด้วยตัวเอง มีแค่บางเรื่องที่มีคนอยู่ใกล้ ๆ หรือมีอุปกรณ์ช่วยก็จะมั่นใจขึ้นมาก เป้าหมายของเราคือทำให้เรื่องเหล่านั้นง่ายขึ้นและปลอดภัยขึ้น',
      tips: ['จัดทางเดินในบ้านให้โล่ง ไม่มีของวางเกะกะ', 'ลุกจากเตียงหรือเก้าอี้ช้า ๆ นั่งพักสักครู่ก่อนเดิน'] },
    TEAM_PLAYER: { img: 'team-player', title: 'สายทีมเวิร์ก', tagline: 'หลายเรื่องทำร่วมกับผู้ดูแล', level: 3,
      reading: 'ตอนนี้คุณกับผู้ดูแลเป็นทีมเดียวกัน หลายกิจวัตรทำได้ดีเมื่อมีคนช่วยกัน นักกายภาพจะวางแผนให้ทั้งคุณและผู้ดูแลทำได้ง่ายขึ้น และค่อย ๆ เพิ่มส่วนที่คุณทำเองได้',
      tips: ['ผู้ดูแลช่วยพยุงจากด้านข้าง ไม่ดึงแขน', 'วางของใช้บ่อยไว้ในระยะที่หยิบถึงง่าย'] },
    COMPANION: { img: 'companion', title: 'สายเพื่อนคู่ใจ', tagline: 'มีเพื่อนคู่ใจอยู่ข้าง ๆ เกือบทุกเรื่อง', level: 2,
      reading: 'หลายเรื่องคุณยังต้องมีผู้ดูแลอยู่ข้าง ๆ เหมือนเพื่อนคู่ใจ ไม่ต้องกังวลนะคะ นักกายภาพจะค่อย ๆ หาจุดที่คุณทำได้เพิ่ม และช่วยให้การดูแลแต่ละวันเหนื่อยน้อยลงทั้งสองฝ่าย',
      tips: ['เปลี่ยนท่านั่งหรือท่านอนทุก 2 ชั่วโมง', 'ให้ผู้ดูแลได้พักบ้าง การดูแลระยะยาวต้องมีแรงทั้งสองฝ่าย'] },
    CLOSE_CARE: { img: 'close-care', title: 'สายดูแลใกล้ชิด', tagline: 'ตอนนี้ผู้ดูแลช่วยเกือบทุกเรื่อง', level: 1,
      reading: 'ช่วงนี้คุณต้องการการดูแลอย่างใกล้ชิด เป้าหมายแรกคือความสบายและความปลอดภัย นักกายภาพจะวางแผนไปด้วยกัน ทีละก้าวเล็ก ๆ ที่ทำได้จริง',
      tips: ['พลิกตัวหรือเปลี่ยนท่าบ่อย ๆ เพื่อลดแผลกดทับ', 'ขยับข้อมือ ข้อเท้าเบา ๆ ระหว่างวัน'] },
    TEAM_REVIEW: { img: 'team-review', title: 'สายขอทีมช่วยดู', tagline: 'มีหลายข้อที่ยังไม่แน่ใจ ไม่เป็นไรเลย', level: null,
      reading: 'คำถามบางข้ออาจตอบยากถ้าไม่ได้อยู่ด้วยกันตลอด ไม่เป็นไรเลยค่ะ ทีมและนักกายภาพจะช่วยดูภาพรวมไปกับคุณตอนพบกัน',
      tips: ['ลองสังเกตกิจวัตรวันนี้ แล้วเล่าให้นักกายภาพฟัง', 'ถ้ามีเอกสารจากโรงพยาบาล เตรียมไว้ให้นักกายภาพดูได้'] }
  };
  // Loading tips: home-care knowledge for patients and their carers only (elderly, stroke, bed-bound). No PT or app tips here.
  const LOAD_TIPS = [
    ['ผู้สูงอายุ', 'bed', 'ลุกจากเตียงช้า ๆ', 'นั่งขอบเตียงนับ 1 ถึง 10 ก่อนยืน ช่วยลดหน้ามืดและล้ม'],
    ['หลังสโตรก', 'hand', 'ให้ข้างที่อ่อนแรงได้ช่วยทุกวัน', 'วางมือข้างนั้นบนโต๊ะ หรือช่วยถือของเบา ๆ ร่างกายจะค่อย ๆ จำการขยับ'],
    ['ผู้สูงอายุ', 'house', 'บ้านปลอดภัย ล้มยากขึ้น', 'เปิดไฟทางเดินตอนกลางคืน เก็บพรมที่ลื่น ติดราวจับในห้องน้ำ'],
    ['หลังสโตรก', 'armchair', 'วางแขนข้างที่อ่อนแรงบนหมอน', 'ตอนนั่งหรือนอน อย่าปล่อยแขนห้อย ช่วยลดปวดไหล่'],
    ['ผู้ดูแล', 'heart-handshake', 'พยุงที่ลำตัว ไม่ดึงแขน', 'ยืนข้างที่อ่อนแรง จับเอวหรือเข็มขัด การดึงแขนทำให้ไหล่บาดเจ็บได้'],
    ['หลังสโตรก', 'footprints', 'ขึ้นบันไดขาดีก่อน ลงขาอ่อนแรงก่อน', 'จับราวทุกครั้ง ก้าวทีละขั้น ไม่ต้องรีบ'],
    ['ติดเตียง', 'rotate-cw', 'พลิกตัวทุก 2 ชั่วโมง', 'สลับนอนหงายและตะแคง ช่วยลดแผลกดทับ']
  ];
  const VISIT_STEPS = ['นัดยืนยันแล้ว', 'นักกายภาพกำลังเดินทาง', 'ถึงบ้านแล้ว', 'กำลังดูแล', 'เสร็จแล้ว'];
  const VISIT_PILL = [['ยืนยันแล้ว', ''], ['กำลังเดินทาง', 'info'], ['ถึงบ้านแล้ว', 'info'], ['กำลังดูแล', 'info'], ['เสร็จแล้ว', 'gray']];
  const MONTH_EN = { 'ม.ค.': 'January', 'ก.พ.': 'February', 'มี.ค.': 'March', 'เม.ย.': 'April', 'พ.ค.': 'May', 'มิ.ย.': 'June', 'ก.ค.': 'July', 'ส.ค.': 'August', 'ก.ย.': 'September', 'ต.ค.': 'October', 'พ.ย.': 'November', 'ธ.ค.': 'December' };
  /* ---------------- Helpers ---------------- */
  const ppSheet = (c, html) => c.sheet(html);
  const ppDialog = (c, html) => c.dialog(html);
  const img = src => !src ? '' : (src.startsWith('data:') || src.includes('/')) ? src : 'a/' + src;
  const top = () => { const sc = document.querySelector('#dev .dev-scroll'); if (sc) sc.scrollTop = 0; };
  const thDate = d => String(d || '').replace(/^\S+\s/, '');                         // 'เสาร์ 24 ต.ค. 2569' → '24 ต.ค. 2569'
  const enDate = d => { const m = /(\d+)\s(\S+)\s(\d{4})/.exec(d || ''); return m ? `${m[1]} ${MONTH_EN[m[2]] || m[2]} ${+m[3] - 543}` : d; };
  const dayNum = d => (/(\d+)\s(\S+)/.exec(d || '') || [])[1] || '';
  const dayMon = d => (/(\d+)\s(\S+)/.exec(d || '') || [])[2] || '';
  const weekday = d => String(d || '').split(' ')[0];
  const ptHue = 160;
  function meItem(s) {
    const m = SC.me();
    const r = s.review;
    return { id: 'me', name: m.name, tags: meTags(s.pt.cv), zones: s.pt.zones || [], bio: s.pt.bio, photo: s.pt.photo, hue: ptHue, license: s.pt.license, cv: s.pt.cv,
      rating: r ? { average: r.stars, count: 1 } : null,
      cases: s.visits.some(v => v.published) ? 1 : 0,
      posts: (s.pt.posts || []).map(p => ({ text: p.text, image: p.image ? img(p.image) : '', video: p.video || '' })),
      quotes: r && r.approved && r.consent && !r.hidden && r.text ? [{ text: r.text, area: s.patient.address.district || s.patient.district || 'กรุงเทพฯ', stars: r.stars }] : [] };
  }
  // Specialty chips in Palm's cards: the PT's own patient groups, said the short way patients search for them.
  const meTags = cv => ((cv && cv.groups) || []).map(g => /stroke|ประสาท/i.test(g) ? 'สโตรก' : /กระดูก/.test(g) ? 'กระดูกและข้อ' : g);
  function sampleItem(p) {
    return { id: p.id, name: p.name, license: p.license, tags: p.tags || [], zones: p.zones, bio: p.bio, photo: null, hue: p.hue, sample: true, rating: p.rating, cases: p.cases,
      posts: p.post ? [{ text: p.post.text, image: p.post.image ? img(p.post.image) : '', video: p.post.video || '' }] : [], quotes: p.quote ? [p.quote] : [] };
  }
  const meVisible = s => s.pt.status === 'VERIFIED' && s.pt.photoApproved;
  function allPts(s) { return [...(meVisible(s) ? [meItem(s)] : []), ...SC.SAMPLE_PTS.map(sampleItem)]; }
  function findPt(s, id) {
    if (id === 'me') return meItem(s);
    const p = SC.SAMPLE_PTS.find(x => x.id === id); return p ? sampleItem(p) : null;
  }
  const ptName = (s, id) => { const p = id && findPt(s, id); return p ? p.name : ''; };
  function ranked(s) {
    const d = s.patient.district, z = d && zoneOf(d);
    return allPts(s).map(p => {
      let tier = 2, near = '';
      if (d && p.zones.includes(d)) { tier = 0; near = `อยู่ใกล้คุณ · รับงานเขต${d}`; }
      else if (z && p.zones.some(x => z.districts.includes(x))) { tier = 1; near = `อยู่ใกล้คุณ · รับงาน${z.name}`; }
      return Object.assign(p, { tier, near });
    }).sort((a, b) => a.tier - b.tier || (b.rating ? b.rating.average : -1) - (a.rating ? a.rating.average : -1) || (b.rating ? b.rating.count : 0) - (a.rating ? a.rating.count : 0) || b.cases - a.cases || b.posts.length - a.posts.length);
  }
  const rate = r => r ? `<div class="pp-rate">${ui.stars(r.average)}<b>${r.average.toFixed(1)}</b><span>(${r.count} รีวิว)</span></div>` : '';
  const ver = () => `<span class="ver">${I('badge-check')}ตรวจสอบโดย SynaClair</span>`;
  const workCover = (p, act) => { const w = p.posts[0]; if (!w) return '';
    return `<button class="pp-work ${w.image ? '' : 'text'}" data-act="${act}" data-id="${p.id}" aria-label="ดูผลงาน ${esc(p.name)}: ${esc(w.text)}">${w.image ? `<img src="${esc(w.image)}" alt="">` : ''}${w.video ? `<span class="pp-play">${I('play')}</span>` : ''}<span class="pp-cap">${w.video ? 'คลิป · ' : ''}${esc(w.text)}</span></button>`; };
  const quoteHtml = q => `<blockquote class="pp-quote">“${esc(q.text)}”<small>ผู้รับบริการ · ${esc(q.area)} · ${'★'.repeat(q.stars)}</small></blockquote>`;
  function profileOf(s) {
    const b = s.patient.barthel || {}, keys = BARTHEL.map(q => q.k), goals = s.patient.goals || [];
    const answered = keys.filter(k => b[k] !== undefined);
    let key, strengths = [], plan = [], unsure = [];
    if (answered.length === keys.length) {
      const known = keys.filter(k => b[k] !== null); unsure = keys.filter(k => b[k] === null);
      const max = known.reduce((a, k) => a + MAX[k], 0), got = known.reduce((a, k) => a + b[k], 0);
      const score = max ? Math.floor(got / max * 20) : 0;
      key = unsure.length >= 4 ? 'TEAM_REVIEW' : score >= 20 ? 'SELF_STARTER' : score >= 12 ? 'LIGHT_HELPER' : score >= 9 ? 'TEAM_PLAYER' : score >= 5 ? 'COMPANION' : 'CLOSE_CARE';
      strengths = known.filter(k => b[k] === MAX[k]).map(k => CAN_DO[k]).slice(0, 4);
      plan = known.filter(k => b[k] < MAX[k]).map(k => AREA[k]).slice(0, 4);
    } else {
      /* No daily-life answers yet (e.g. a level jump): read the goals instead. */
      key = goals.includes('TRANSFER') || goals.includes('SELF_CARE') ? 'TEAM_PLAYER' : goals.includes('WALK') ? 'LIGHT_HELPER' : goals.length ? 'SELF_STARTER' : 'TEAM_REVIEW';
    }
    return Object.assign({ key, strengths, plan: [...plan, ...unsure.map(k => AREA[k] + ' (ทีมจะช่วยดู)')], goals: goals.map(g => g === 'OTHER' && s.patient.goalOther ? s.patient.goalOther : GOAL_TEXT[g]) }, PROFILES[key]);
  }
  const bpOk = p => !!(p.bp && (p.bp.unknown || (+p.bp.sys >= 60 && +p.bp.sys <= 300 && +p.bp.dia >= 30 && +p.bp.dia <= 200)));
  const healthFlags = s => HEALTH.slice(1).filter(q => !q.bp && (s.patient.health || {})[q.k] === 'YES').length + (['stage2', 'severe'].includes((SC.bpCat(s.patient.bp) || {}).key) ? 1 : 0);
  const bpLine = p => { const c = SC.bpCat(p.bp); return p.bp && p.bp.unknown ? '<span class="pill gray">ไม่ทราบค่าความดัน</span>' : c ? `<span class="pill ${c.tone === 'ok' ? '' : c.tone}">${esc(p.bp.sys)}/${esc(p.bp.dia)} · ${c.label}</span>` : ''; };
  function bpField(p) {
    const b = p.bp || {}, c = SC.bpCat(b);
    return `<div class="pp-bp${b.unknown ? ' off' : ''}"><label><span>ตัวบน</span><input class="in" type="text" inputmode="numeric" maxlength="3" data-bind="patient.bp.sys" data-live value="${esc(b.sys || '')}" ${b.unknown ? 'disabled' : ''} aria-label="ความดันตัวบน"></label><b>/</b><label><span>ตัวล่าง</span><input class="in" type="text" inputmode="numeric" maxlength="3" data-bind="patient.bp.dia" data-live value="${esc(b.dia || '')}" ${b.unknown ? 'disabled' : ''} aria-label="ความดันตัวล่าง"></label><em>mmHg</em></div>
      <label class="check"><input type="checkbox" data-bind="patient.bp.unknown" ${b.unknown ? 'checked' : ''}><span>ไม่แน่ใจ / จำค่าไม่ได้</span></label>
      ${c ? `<p class="pp-bpres ${c.tone}"><b>${c.label}</b><span>${c.note}</span></p>` : ''}`;
  }
  const latestReport = s => s.visits.filter(v => v.published).sort((a, b) => b.n - a.n)[0] || null;
  const nextVisit = s => s.visits.filter(v => v.step < 4).sort((a, b) => a.n - b.n)[0] || null;
  const trialState = s => !s.request ? null : s.request.status === 'PAYMENT_PENDING' ? 'due' : s.request.status === 'SLIP_SENT' ? 'checking' : 'paid';
  const courseState = s => !s.course ? null : s.course.approved ? 'paid' : s.course.slip ? 'checking' : 'due';
  const PAY_PILL = { due: ['รอชำระ', 'wait'], checking: ['ทีมกำลังตรวจ', 'info'], paid: ['ชำระแล้ว', ''] };
  /* QR drawn in code: a deterministic pattern with the three finder squares. */
  function qrSvg(seed) {
    const n = 29; let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#043928"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#043928"/>`;
    const inF = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    let cells = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const r = rnd(); if (!inF(x, y) && !(x > 11 && x < 17 && y > 11 && y < 17) && r > .52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
    return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" role="img" aria-label="QR พร้อมเพย์ สำหรับชำระ ${esc(seed)}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><g fill="#043928">${cells}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}<rect x="12" y="12" width="5" height="5" rx="1" fill="#00583e"/><path d="M13.3 14.6l1 1 1.6-2" stroke="#fff" stroke-width=".5" fill="none"/></svg>`;
  }
  /* ================================================================ p.loading */
  // One loading screen for everyone (Boss 21 Oct): patients and PTs both see the patient home-care tips while the app opens.
  // The approved loading mark (loading-v2 option A): the logo wipes in, the two heads pop and bob, a light sweeps across.
  function loadingHtml(next) {
      return `<div class="scr pp pp-load">
        <div class="pp-aur" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="pp-stage" role="status" aria-label="กำลังเปิด SynaClair">
          <div class="pp-logo" data-replay-logo title="แตะเพื่อเล่นโมชั่นอีกครั้ง"><div class="pp-halo"></div><canvas class="inf" aria-hidden="true"></canvas></div>
          <div class="pp-word">${window.SCInfinity ? SCInfinity.wordmark() : 'SynaClair'}</div>
        </div>
        <div class="pp-tips" aria-live="polite">
          ${LOAD_TIPS.map((t, i) => `<div class="pp-tip ${i === 0 ? 'on' : ''}"><span class="pill" style="justify-self:start">${I(t[1])}${t[0]}</span><b>${t[2]}</b><p>${t[3]}</p></div>`).join('')}
          <div class="pp-tipdots" aria-hidden="true">${LOAD_TIPS.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div>
        </div>
      </div>`;
  }
  function loadingMount(root, role, id, next) {
      // The infinity logo plays one full loop (ribbon in, hold, ribbon out) before the screen moves on; tap the logo to replay it.
      const fresh = !window.__ppLoadT;
      if (window.SCInfinity) window.SCInfinity.mount(root, fresh);
      const lg = root.querySelector('[data-replay-logo]');
      if (lg) lg.addEventListener('click', e => { e.stopPropagation(); if (window.SCInfinity) window.SCInfinity.mount(root, true); });
      // No tap-to-enter and no status line: the turning logo already says it is loading, and the screen moves on by itself when done.
      if (fresh) window.__ppLoadT = setTimeout(() => {
        window.__ppLoadT = null;
        const v = SC.v; if (v.role === role && v.at[role] === id && !v.overlay) SC.go(next);
      }, window.SCInfinity ? window.SCInfinity.LOOP : 6000);
      const box = root.querySelector('.pp-tips'); if (!box) return;
      const tips = [...box.querySelectorAll('.pp-tip')], dots = [...box.querySelectorAll('.pp-tipdots i')];
      let i = Math.floor(Date.now() / 1000) % tips.length;
      const show = () => { tips.forEach((t, n) => t.classList.toggle('on', n === i)); dots.forEach((d, n) => d.classList.toggle('on', n === i)); };
      show();
      const t = setInterval(() => { if (!document.body.contains(box)) { clearInterval(t); return; } i = (i + 1) % tips.length; show(); }, 2400);
  }
  SC.loading = { html: loadingHtml, mount: loadingMount };
  SC.screen('p.loading', {
    role: 'patient',
    render: () => loadingHtml('p.feed'),
    mount(root, s) { s.patient.seenLoading = true; loadingMount(root, 'patient', 'p.loading', 'p.feed'); }
  });
  /* ================================================================ p.feed */
  function districtSheet(s) {
    const d = s.patient.district;
    return `<div class="row between"><b class="h2">บ้านอยู่เขตไหน</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <p class="p">เราจะเรียงนักกายภาพที่รับงานใกล้บ้านขึ้นก่อน</p>
      <div class="stack">${SC.ZONES.map(z => `<details class="pp-zone" ${z.districts.includes(d) ? 'open' : ''}><summary>${esc(z.name)}${I('chevron-right')}</summary>
        <div class="chips">${z.districts.map(n => `<button class="chip ${n === d ? 'on' : ''}" data-pick="patient.district" data-value="${esc(n)}" data-then="districtChosen">${esc(n)}</button>`).join('')}</div></details>`).join('')}</div>
      ${d ? `<button class="btn ghost" data-act="clearDistrict">ไม่ระบุย่าน</button>` : ''}`;
  }
  /* Palm's Level 1 "Quick Match" home (board 23 Oct): greeting + search, care categories, one match card, then PT cards
     with photo, licence check, rating, zones and specialty chips. Search and chips filter the real list; nothing is decorative. */
  const CATS = [['กระดูกและข้อ', 'bone'], ['หลังผ่าตัด', 'bandage'], ['สโตรก', 'brain'], ['ผู้สูงอายุ', 'heart-handshake']];
  const SORTS = [['rec', 'แนะนำ'], ['near', 'ใกล้ฉัน'], ['top', 'คะแนนสูงสุด']];
  function feedList(s) {
    const q = (s.patient.q || '').trim().toLowerCase(), cat = s.patient.cat || '', sort = s.patient.sort || 'rec';
    let list = ranked(s).filter(p => (!cat || p.tags.includes(cat)) && (!q || [p.name, p.bio || '', ...p.zones, ...p.tags].join(' ').toLowerCase().includes(q)));
    if (sort === 'near') list = list.filter(p => p.tier < 2).concat(list.filter(p => p.tier === 2));
    if (sort === 'top') list = list.slice().sort((a, b) => (b.rating ? b.rating.average * 100 + b.rating.count : -1) - (a.rating ? a.rating.average * 100 + a.rating.count : -1));
    return list;
  }
  const plAv = (p, size) => `<span class="pl-av" style="--s:${size}px">${p.photo ? `<img src="${esc(p.photo === 'sample' ? 'a/team-player.jpg' : p.photo)}" alt="">` : `<span class="ini" style="--h:${p.hue}">${esc((p.name.replace(/^(กภ\.|PT)\s*/, '')[0]) || '')}</span>`}<i>${I('check')}</i></span>`;
  const plVer = p => `<span class="pl-vbox"><span class="pl-ver"><i>${I('check')}</i>ตรวจสอบโดย SynaClair</span>${p.license ? `<span class="pl-no"><i>${I('badge-check')}</i>ใบอนุญาต ก. ${esc(p.license)}</span>` : ''}${plRate(p.rating)}</span>`;
  const plRate = r => r ? `<span class="pl-rate">${I('star')}<b>${r.average.toFixed(1)}</b><span>(${r.count} รีวิว)</span></span>` : `<span class="pl-rate new">${I('sparkles')}นักกายภาพใหม่ใน SynaClair</span>`;
  function plCard(p) {
    return `<article class="pl-card" aria-label="${esc(p.name)}">
      <div class="pl-crow">${plAv(p, 76)}
        <div class="grow"><h3>${esc(p.name)} ${p.sample ? ui.sample() : ''}</h3><small class="pl-role">นักกายภาพบำบัด</small>
          ${plVer(p)}
          ${p.zones.length ? `<span class="pl-meta"><span>${I('map-pin')}${esc(p.zones.slice(0, 2).join(' · '))}</span></span>` : ''}</div></div>
      ${p.tags.length || p.tier < 2 ? `<div class="pl-tags">${p.tier < 2 ? `<span class="pl-fit">${I('sparkles')}ใกล้คุณ</span>` : ''}${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="pl-acts"><button class="btn ghost" data-act="openPt" data-id="${p.id}">ดูข้อมูลเพิ่มเติม</button><button class="btn" data-act="choosePt" data-id="${p.id}">${I('clipboard-check')}ขอคนนี้</button></div>
    </article>`;
  }
  /* Social home (Boss comment 29 Oct): a feed like a social app. PT posts (บทความ / คลิป / เคล็ดลับ) with the author's verified line and stars,
     a follow button on every author, suggested PTs, consented reviews and the assessment CTA in the flow. Tap a name or photo to open the profile.
     No like or follower counts: there is no real data for them yet. Search, care chips and "ใกล้ฉัน" filter the authors. */
  const FEED_TABS = [['all', 'สำหรับคุณ'], ['follow', 'กำลังติดตาม']];
  const follows = s => (s.patient.follow = s.patient.follow || []);
  const isFol = (s, id) => follows(s).includes(id);
  const folBtn = (s, p, cls = '') => { const on = isFol(s, p.id);
    return `<button class="pl-fol ${on ? 'on' : ''} ${cls}" data-act="followPt" data-id="${p.id}" aria-pressed="${on}" aria-label="${on ? 'เลิกติดตาม' : 'ติดตาม'} ${esc(p.name)}">${on ? `${I('check')}กำลังติดตาม` : `${I('plus')}ติดตาม`}</button>`; };
  const kindOf = w => w.video ? ['คลิป', 'play'] : w.image ? ['บทความ', 'file-text'] : ['เคล็ดลับ', 'lightbulb'];
  const miniRate = r => r ? `<span class="pl-mr">${I('star')}<b>${r.average.toFixed(1)}</b>(${r.count} รีวิว)</span>` : `<span class="pl-mr new">${I('sparkles')}นักกายภาพใหม่</span>`;
  function postCard(s, p, w, i) {
    const [kt, ki] = kindOf(w), liked = (s.patient.likes || []).includes(p.id + ':' + i), saved = (s.patient.saves || []).includes(p.id + ':' + i);
    return `<article class="pl-post" aria-label="โพสต์ของ ${esc(p.name)}">
      <header class="pl-au"><button class="pl-aul" data-act="openPt" data-id="${p.id}" aria-label="ดูโปรไฟล์ ${esc(p.name)}">${plAv(p, 44)}
        <span class="grow"><b>${esc(p.name)}</b><small><span class="pl-vd">${I('badge-check')}ตรวจสอบแล้ว</span>${miniRate(p.rating)}${p.sample ? ui.sample() : ''}</small></span></button>${folBtn(s, p)}</header>
      <button class="pl-media ${w.image ? '' : 'txt'}" data-act="openWork" data-id="${p.id}" data-i="${i}" aria-label="เปิด${kt}: ${esc(w.text)}" style="--h:${p.hue}">
        ${w.image ? `<img src="${esc(w.image)}" alt="">` : `<span class="q">${I('lightbulb')}<b>${esc(w.text)}</b></span>`}
        <span class="pl-kind">${I(ki)}${kt}</span>${w.video ? `<span class="pl-playb">${I('play')}</span>` : ''}</button>
      ${w.image ? `<p class="pl-pt">${esc(w.text)}</p>` : ''}
      <footer class="pl-pa">
        <button class="${liked ? 'on' : ''}" data-act="likePost" data-k="${p.id}:${i}" aria-pressed="${liked}">${I('heart')}ถูกใจ</button>
        <button class="${saved ? 'on' : ''}" data-act="savePost" data-k="${p.id}:${i}" aria-pressed="${saved}">${I('bookmark')}บันทึก</button>
        <button data-act="openPt" data-id="${p.id}">${I('user-round')}ดูโปรไฟล์</button>
      </footer>
    </article>`;
  }
  function sugCard(s, p) {
    return `<article class="pl-card pl-sug" aria-label="${esc(p.name)}">
      <button class="pl-sugtop" data-act="openPt" data-id="${p.id}" aria-label="ดูโปรไฟล์ ${esc(p.name)}">${plAv(p, 64)}<b>${esc(p.name)}</b></button>
      ${plVer(p)}
      ${p.zones.length ? `<span class="pl-meta"><span>${I('map-pin')}${esc(p.zones.slice(0, 2).join(' · '))}</span></span>` : ''}
      <div class="pl-sugb">${folBtn(s, p)}<button class="btn ghost sm" data-act="openPt" data-id="${p.id}">ดูโปรไฟล์</button></div>
    </article>`;
  }
  function reviewCard(p, q) {
    return `<article class="pl-rvc" aria-label="รีวิวถึง ${esc(p.name)}"><span class="pl-rvh">${I('message-square-quote')}รีวิวจากผู้รับบริการจริง</span>
      <span class="stars" aria-label="${q.stars} ดาว">${'★'.repeat(q.stars)}</span><blockquote>“${esc(q.text)}”</blockquote>
      <small>ผู้รับบริการ · ${esc(q.area)}</small>
      <button class="pl-rvto" data-act="openPt" data-id="${p.id}">${plAv(p, 32)}<span>รีวิวถึง <b>${esc(p.name)}</b></span>${I('chevron-right')}</button></article>`;
  }
  function feedStream(s, list, tab) {
    const authors = tab === 'follow' ? list.filter(p => isFol(s, p.id)) : list;
    const posts = authors.flatMap(p => p.posts.map((w, i) => [p, w, i]));
    if (tab === 'follow' && !authors.length) return `<div class="pl-empty2">${I('user-plus')}<b>ยังไม่ได้ติดตามนักกายภาพ</b><small>กดติดตามคนที่สนใจ โพสต์ใหม่ของเขาจะขึ้นที่แท็บนี้</small>
      <div class="pl-sugrow">${list.slice(0, 6).map(p => sugCard(s, p)).join('')}</div></div>`;
    const quotes = authors.flatMap(p => p.quotes.map(q => [p, q]));
    const sug = list.filter(p => !isFol(s, p.id)).slice(0, 6);
    const out = [];
    posts.forEach(([p, w, i], n) => {
      out.push(postCard(s, p, w, i));
      if (n === 0 && tab === 'all' && sug.length) out.push(`<section class="pl-sugs" aria-label="นักกายภาพแนะนำ"><div class="pl-rhead"><h2 class="h2">นักกายภาพแนะนำ</h2><button class="link" data-go="p.find">ดูทั้งหมด</button></div><div class="pl-sugrow">${sug.map(p => sugCard(s, p)).join('')}</div></section>`);
      if (n === 1 && quotes[0]) out.push(reviewCard(...quotes[0]));
      if (n === 4 && quotes[1]) out.push(reviewCard(...quotes[1]));
    });
    if (!posts.length) out.push(`<p class="pl-none">${I('search-x')}ไม่พบโพสต์ที่ตรงกับคำค้น ลองคำอื่น หรือ <button class="link" data-act="feedClear">ล้างตัวกรอง</button></p>`);
    return out.join('');
  }
  SC.screen('p.feed', {
    role: 'patient',
    render(s) {
      const list = feedList(s), tab = s.patient.feedTab || 'all', nf = follows(s).length;
      return `<div class="scr pp pl">
        <header class="pl-top">
          <div class="pl-brand"><img src="a/synaclair-logo.svg" alt="SynaClair"><button class="ib soft" data-go="p.chat" aria-label="ข้อความจากทีม">${I('bell')}</button></div>
          <div><p class="pl-hello">สวัสดีค่ะ คุณ${esc((s.patient.lineName || LINE_NAME).replace(/^คุณ\s*/, ''))}</p><h1 class="pl-q">วันนี้มีอะไรใหม่จากนักกายภาพ</h1></div>
          <label class="pl-search">${I('search')}<input class="in" data-bind="patient.q" data-live value="${esc(s.patient.q || '')}" placeholder="ค้นหานักกายภาพ / อาการ / เขต" aria-label="ค้นหานักกายภาพ อาการ หรือเขต" autocomplete="off"></label>
        </header>
        <div class="body enter">
          <div class="pl-ftabs" role="tablist" aria-label="ฟีด">${FEED_TABS.map(([k, t]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-pick="patient.feedTab" data-value="${k}">${t}${k === 'follow' && nf ? ` <i>${nf}</i>` : ''}</button>`).join('')}</div>
          ${feedStream(s, list, tab === 'pts' ? 'all' : tab)}
          <div class="trustbar" role="list" aria-label="ทำไมไว้ใจ SynaClair ได้">${[['shield-check', 'ตรวจสอบโดย<br>SynaClair'], ['users', 'ทุกนัด<br>ผ่านทีม'], ['star', 'รีวิวจาก<br>ผู้รับบริการจริง']].map(([ic, t]) => `<span role="listitem">${I(ic)}${t}</span>`).join('')}</div>
          <p class="pp-hint">ติดตามเพื่ออ่านโพสต์ใหม่ได้ แต่ไม่มีปุ่มทักนักกายภาพตรง ทุกนัดผ่านทีม · มีคำถาม ทักทีมใน LINE ได้เลย</p>
        </div>
        ${ui.tabs('patient', 'p.feed')}
      </div>`;
    }
  });
  const toggle = (arr, k) => { const i = arr.indexOf(k); if (i < 0) arr.push(k); else arr.splice(i, 1); return i < 0; };
  SC.action('followPt', (s, c) => { const on = toggle(follows(s), c.data.id), n = ptName(s, c.data.id);
    c.toast(on ? `ติดตาม ${n} แล้ว · โพสต์ใหม่จะขึ้นในแท็บกำลังติดตาม` : `เลิกติดตาม ${n} แล้ว`); });
  SC.action('likePost', (s, c) => { toggle(s.patient.likes = s.patient.likes || [], c.data.k); });
  SC.action('savePost', (s, c) => { if (toggle(s.patient.saves = s.patient.saves || [], c.data.k)) c.toast('บันทึกโพสต์แล้ว'); });
  SC.action('feedClear', s => { s.patient.q = ''; s.patient.cat = ''; s.patient.sort = 'rec'; });
  /* No district picker up front (Boss 21 Oct): the site reads the device location, guesses the district and asks "ใช่ไหม".
     Real build: navigator.geolocation → nearest district in BKK; if the visitor declines, "แก้" opens the same district list. Here the guess is fixed. */
  const GEO_GUESS = 'บางนา';
  /* Greeting uses the LINE display name from login (LIFF profile), not the intake name, which may belong to the person being cared for. */
  const LINE_NAME = 'สมศรี';
  SC.action('geoYes', (s, c) => { s.patient.district = GEO_GUESS; c.toast(`เรียงนักกายภาพใกล้ ${GEO_GUESS} ขึ้นก่อนแล้ว`); });
  SC.action('openDistrict', (s, c) => { ppSheet(c, districtSheet(s)); });
  SC.action('districtChosen', (s, c) => { c.close(); c.toast(`เรียงนักกายภาพใกล้ ${s.patient.district} ขึ้นก่อนแล้ว`); });
  SC.action('clearDistrict', (s, c) => { s.patient.district = null; c.close(); c.toast('ไม่ระบุย่าน: เรียงตามรีวิว'); });
  const openPt = (s, c) => { s.patient.viewPt = c.data.id; s.patient.ptTab = 'about'; return 'p.pt'; };
  SC.action('openPt', openPt);
  SC.action('openPtCover', openPt);
  SC.action('choosePt', (s, c) => {
    s.patient.chosenPt = c.data.id;
    // Palm 29 Oct: asking for a PT still runs the full assessment, and a first visit pays the Trial price.
    const n = ptName(s, c.data.id); if (n) c.toast(`จำไว้แล้ว: ทีมจะส่งงานให้ ${n} ก่อน`);
    return 'p.intake';
  });
  /* ================================================================ p.find */
  /* Search tab (Boss comment 29 Oct, replaces นัดของฉัน in the tab bar; appointments moved into ฉัน). Search every PT in the system,
     tap into each profile, see which ones SynaClair recommends and which work near the patient's district.
     "แนะนำ" in the rehearsal = the care type the patient picked matches the PT's skills, or 4.5+ stars from at least 3 reviews. Rule still to confirm with Boss. */
  const FIND_F = [['all', 'ทั้งหมด'], ['rec', 'แนะนำ'], ['near', 'ใกล้ฉัน']];
  const isRec = (s, p) => !!((s.patient.cat && p.tags.includes(s.patient.cat)) || (p.rating && p.rating.average >= 4.5 && p.rating.count >= 3));
  function findCard(s, p) {
    const rec = isRec(s, p), near = p.tier < 2;
    return `<article class="pl-card pl-fc ${rec ? 'rec' : ''}" aria-label="${esc(p.name)}">
      ${rec || near ? `<div class="pl-badges">${rec ? `<span class="pl-bdg rec">${I('award')}SynaClair แนะนำ</span>` : ''}${near ? `<span class="pl-bdg near">${I('map-pin')}${p.tier === 0 ? `รับงานเขต${esc(s.patient.district)}` : 'ใกล้โซนของคุณ'}</span>` : ''}</div>` : ''}
      <button class="pl-crow pl-fopen" data-act="openPt" data-id="${p.id}" aria-label="ดูโปรไฟล์ ${esc(p.name)}">${plAv(p, 68)}
        <span class="grow"><b class="pl-fn">${esc(p.name)} ${p.sample ? ui.sample() : ''}</b><small class="pl-role">นักกายภาพบำบัด</small>${plVer(p)}
          ${p.zones.length ? `<span class="pl-meta"><span>${I('map-pin')}${esc(p.zones.join(' · '))}</span></span>` : ''}</span>${I('chevron-right', 'pl-chev')}</button>
      ${p.tags.length ? `<div class="pl-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="pl-acts3">${folBtn(s, p)}<button class="btn ghost" data-act="openPt" data-id="${p.id}">ดูโปรไฟล์</button><button class="btn" data-act="choosePt" data-id="${p.id}">${I('clipboard-check')}ขอคนนี้</button></div>
    </article>`;
  }
  SC.screen('p.find', {
    role: 'patient',
    render(s) {
      const d = s.patient.district, cat = s.patient.cat || '', f = s.patient.findF || 'all';
      let list = feedList(s);
      const nRec = list.filter(p => isRec(s, p)).length, nNear = list.filter(p => p.tier < 2).length;
      if (f === 'rec') list = list.filter(p => isRec(s, p)); else if (f === 'near') list = list.filter(p => p.tier < 2);
      else list = list.slice().sort((a, b) => (b.tier < 2) + isRec(s, b) * 2 - (a.tier < 2) - isRec(s, a) * 2 || a.tier - b.tier);
      return `<div class="scr pp pl">
        <header class="pl-top">
          <h1 class="pl-fh">ค้นหานักกายภาพ</h1>
          <label class="pl-search">${I('search')}<input class="in" data-bind="patient.q" data-live value="${esc(s.patient.q || '')}" placeholder="ชื่อ อาการ หรือเขต เช่น สโตรก บางนา" aria-label="ค้นหาชื่อนักกายภาพ อาการ หรือเขต" autocomplete="off"></label>
          ${d ? `<p class="pp-where" style="margin:0">${I('map-pin')}<span>บ้านอยู่ <b>${esc(d)}</b> · ${nNear} คนรับงานใกล้คุณ</span><button class="link" data-act="openDistrict" aria-haspopup="dialog">เปลี่ยน</button></p>`
            : `<div class="pp-geo" role="group" aria-label="ย่านจากตำแหน่งของคุณ">${I('locate-fixed')}<span class="grow">อยู่แถว <b>${GEO_GUESS}</b> ใช่ไหมคะ<small>บอกเขตแล้วจะเห็นว่าใครใกล้คุณ</small></span><button class="btn sm" data-act="geoYes">ใช่</button><button class="link" data-act="openDistrict">แก้</button></div>`}
        </header>
        <div class="body enter">
          <nav class="pl-cats" aria-label="หมวดการดูแล">${CATS.map(([t, ic]) => `<button class="${cat === t ? 'on' : ''}" data-pick="patient.cat" data-value="${cat === t ? '' : t}" aria-pressed="${cat === t}"><span>${I(ic)}</span>${t}</button>`).join('')}</nav>
          <div class="pl-sort" role="group" aria-label="กรอง">${FIND_F.map(([k, t]) => `<button class="${f === k ? 'on' : ''}" data-pick="patient.findF" data-value="${k}" aria-pressed="${f === k}">${t}${k === 'rec' ? ` (${nRec})` : k === 'near' ? ` (${nNear})` : ''}</button>`).join('')}</div>
          <p class="pl-count">${list.length} คน${f === 'all' ? ' · แนะนำและใกล้คุณขึ้นก่อน' : ''}</p>
          ${list.length ? list.map(p => findCard(s, p)).join('')
            : `<p class="pl-none">${I('search-x')}${f === 'near' && !d ? 'บอกเขตบ้านก่อน แล้วจะเห็นคนที่ใกล้คุณ' : 'ไม่พบนักกายภาพที่ตรงกับคำค้น'} <button class="link" data-act="findClear">ล้างตัวกรอง</button></p>`}
          <p class="pp-hint">${I('award')} SynaClair แนะนำ = ถนัดเรื่องที่คุณเลือก หรือได้ 4.5 ดาวขึ้นไปจากอย่างน้อย 3 รีวิว · ทุกนัดผ่านทีม</p>
        </div>
        ${ui.tabs('patient', 'p.find')}
      </div>`;
    }
  });
  SC.action('findClear', s => { s.patient.q = ''; s.patient.cat = ''; s.patient.findF = 'all'; });
  /* ================================================================ p.pt */
  /* Palm's Level 1 detail + Level 2 "Personal Professional Profile" (board 23 Oct): photo header, identity card with licence check and
     rating, "why this PT fits you", then tabs for about / specialties / history / reviews. Booking still goes through the team. */
  const PT_TABS = [['about', 'เกี่ยวกับ'], ['skill', 'ความเชี่ยวชาญ'], ['cv', 'ประวัติ'], ['review', 'รีวิว']];
  const plSec = (ic, t, body) => `<section class="pl-sec"><h2>${I(ic)}${t}</h2>${body}</section>`;
  const plLine = items => `<ol class="pl-line">${items.map(([a, b, c]) => `<li><b>${esc(a)}</b>${b ? `<span>${esc(b)}</span>` : ''}${c ? `<small>${esc(c)}</small>` : ''}</li>`).join('')}</ol>`;
  function whyFits(s, p) {
    const d = s.patient.district, cat = s.patient.cat, out = [];
    if (d && p.zones.includes(d)) out.push(['map-pin', `รับงานเขต${d} ใกล้บ้านคุณ`]);
    else if (p.tier === 1 && p.near) out.push(['map-pin', p.near]);
    if (cat && p.tags.includes(cat)) out.push(['sparkles', `ถนัดดูแลกลุ่ม${cat} ตรงกับที่คุณเลือก`]);
    else if (p.tags[0]) out.push(['sparkles', `ถนัดดูแล${p.tags.slice(0, 2).join(' และ')}`]);
    if (p.rating) out.push(['star', `คะแนน ${p.rating.average.toFixed(1)} จาก ${p.rating.count} รีวิวของผู้รับบริการจริง`]);
    out.push(['shield-check', 'ใบประกอบวิชาชีพตรวจแล้วโดยทีม SynaClair']);
    return out.slice(0, 3);
  }
  function ptTab(s, p, tab) {
    const c = p.cv || {};
    if (tab === 'skill') return `${c.primary || (c.more || []).length ? plSec('target', 'ความเชี่ยวชาญ', `<ul class="pl-ul">${c.primary ? `<li class="main">${I('star')}<span><b>${esc(c.primary)}</b><small>ความเชี่ยวชาญหลัก</small></span></li>` : ''}${(c.more || []).map(m => `<li>${I('plus')}<span><b>${esc(m)}</b><small>ความเชี่ยวชาญเพิ่มเติม</small></span></li>`).join('')}</ul>`) : ''}
      ${plSec('users', 'กลุ่มคนไข้ที่ดูแล', `<ul class="pl-ul">${((c.groups && c.groups.length) ? c.groups : p.tags).map(g => `<li>${I('user-round')}<span><b>${esc(g)}</b></span></li>`).join('')}</ul>`)}
      ${p.tags.length ? plSec('sparkles', 'ทักษะเด่น', `<div class="pl-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>`) : ''}`;
    if (tab === 'cv') {
      const any = (c.edu || []).length || (c.train || []).length;
      return `${plSec('badge-check', 'ใบอนุญาตประกอบวิชาชีพ', `<p class="pl-lic">${I('shield-check')}<span><b>${p.license ? 'ก. ' + esc(p.license) : 'ตรวจสอบแล้ว'}</b><small>ตรวจสอบโดย SynaClair</small></span></p>`)}
        ${(c.edu || []).length ? plSec('graduation-cap', 'ประวัติการศึกษา', plLine(c.edu.map(([d, u, y]) => [d, u, y]))) : ''}
        ${(c.train || []).length ? plSec('award', 'การอบรมและใบ certificate', `${plLine(c.train.map(([y, t, cert]) => [t, cert ? 'มีใบ certificate · ทีมตรวจแล้ว' : '', y]))}<div class="pl-certf" aria-hidden="true"><i>${I('award')}</i><b>Certificate of Attendance</b><small>${esc(c.train[0][1])}</small></div>`) : ''}
        ${any ? '' : `<p class="pl-empty">${I('file-clock')}นักกายภาพยังไม่ได้เพิ่มประวัติการศึกษาและการอบรม</p>`}`;
    }
    if (tab === 'review') return p.quotes.length || p.rating
      ? `${plSec('star', 'รีวิวจากผู้รับบริการ', `${p.rating ? `<p class="pl-score"><b>${p.rating.average.toFixed(1)}</b>${ui.stars(p.rating.average)}<span>${p.rating.count} รีวิว</span></p>` : ''}
          ${p.quotes.map(q => `<figure class="pl-rv"><span class="stars">${'★'.repeat(q.stars)}</span><blockquote>“${esc(q.text)}”</blockquote><figcaption>ผู้รับบริการ · ${esc(q.area)}</figcaption></figure>`).join('')}
          ${p.rating && p.rating.count > p.quotes.length ? `<p class="small">รีวิวที่ผู้รับบริการยินยอมให้แสดง ${p.quotes.length} จาก ${p.rating.count} รีวิว</p>` : ''}`)}`
      : `<p class="pl-empty">${I('message-square-dashed')}ยังไม่มีรีวิว · รีวิวจะขึ้นหลังผู้รับบริการให้คะแนนและยินยอมให้แสดง</p>`;
    return `${p.bio ? plSec('user-round', 'เกี่ยวกับฉัน', `<blockquote class="pl-bio">${esc(p.bio)}</blockquote>`) : ''}
      ${plSec('map-pinned', 'ข้อมูลการให้บริการ', `<dl class="pl-kv"><dt>${I('map-pin')}พื้นที่ให้บริการ</dt><dd>${p.zones.length ? p.zones.map(esc).join(' · ') : 'ทีมแจ้งตอนจับคู่'}</dd>
        <dt>${I('clock-3')}เวลารับเคส</dt><dd>ตามเวลาว่างในตาราง ทีมนัดให้</dd><dt>${I('house')}รูปแบบ</dt><dd>ดูแลที่บ้าน</dd></dl>`)}
      ${p.posts.length ? plSec('images', 'ผลงาน', `<div class="pp-grid">${p.posts.map((w, i) => `<button class="pp-tile" data-act="openWork" data-id="${p.id}" data-i="${i}" aria-label="${w.video ? 'ดูคลิป' : 'ดูผลงาน'}: ${esc(w.text)}">${w.image ? `<img src="${esc(w.image)}" alt="">` : `<span class="t">${esc(w.text)}</span>`}${w.video ? `<span class="pl">${I('play')}</span>` : ''}</button>`).join('')}</div>`) : ''}`;
  }
  SC.screen('p.pt', {
    role: 'patient',
    render(s) {
      const id = s.patient.viewPt || (meVisible(s) ? 'me' : 's1');
      const p0 = findPt(s, id);
      if (!p0) return `<div class="scr pp">${ui.bar('นักกายภาพ')}<div class="body">${ui.empty('user-round', 'ไม่พบนักกายภาพคนนี้', 'กลับไปเลือกจากหน้าแรกได้เลย', `<button class="btn auto" data-go="p.feed">กลับหน้าแรก</button>`)}</div></div>`;
      const p = ranked(s).find(x => x.id === p0.id) || Object.assign(p0, { tier: 2, near: '' });
      const tab = s.patient.ptTab || 'about';
      const photo = p.photo && (p.photo === 'sample' ? 'a/team-player.jpg' : p.photo);
      return `<div class="scr pp white pl">
        <div class="pl-hero" style="--h:${p.hue}">${photo ? `<img src="${esc(photo)}" alt="รูป ${esc(p.name)}">` : `<span class="ini">${esc((p.name.replace(/^(กภ\.|PT)\s*/, '')[0]) || '')}</span>`}
          <button class="ib" data-back aria-label="ย้อนกลับ">${I('chevron-left')}</button>${p.sample ? `<span class="smp">${ui.sample()}</span>` : ''}</div>
        <div class="body pl-body">
          <section class="pl-id">
            <h1>${esc(p.name)}<i>${I('check')}</i></h1>
            <small class="pl-role">นักกายภาพบำบัด</small>
            ${plVer(p)}
            ${p.cases > 0 ? `<span class="pl-meta"><span>${I('heart-handshake')}ดูแลแล้ว ${p.cases} ครอบครัว</span></span>` : ''}
            ${p.tags.length ? `<div class="pl-tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
            ${p.id === 'me' && SC.v.role === 'pt' ? '' : folBtn(s, p, 'pl-idfol')}
          </section>
          <section class="pl-why"><h2>${I('lightbulb')}ทำไมถึงเหมาะกับคุณ?</h2><ul>${whyFits(s, p).map(([ic, t]) => `<li>${I(ic)}<span>${esc(t)}</span></li>`).join('')}</ul></section>
          <nav class="pl-tabs" role="tablist" aria-label="ข้อมูลนักกายภาพ">${PT_TABS.map(([k, t]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-pick="patient.ptTab" data-value="${k}">${t}</button>`).join('')}</nav>
          <div class="pl-tab" role="tabpanel">${ptTab(s, p, tab)}</div>
          <p class="note mint">${I('shield-check')} ทุกนัดผ่านทีม SynaClair: ประเมินอาการก่อน แล้วทีมส่งงานให้นักกายภาพคนนี้ก่อน ถ้าเวลาและพื้นที่ตรงกัน</p>
        </div>
        <div class="foot">${p.id === 'me' && s.visits.length ? `<button class="btn" data-go="p.appts">${I('calendar-days')}ดูนัดกับนักกายภาพคนนี้</button>` : `<button class="btn" data-act="choosePt" data-id="${p.id}">${I('clipboard-check')}ขอคนนี้</button>`}</div>
      </div>`;
    }
  });
  SC.action('openMatchedPt', (s, c) => { s.patient.viewPt = 'me'; s.patient.ptTab = 'about'; return 'p.pt'; });
  SC.action('openWork', (s, c) => {
    const p = findPt(s, c.data.id); const w = p && p.posts[+c.data.i]; if (!w) return;
    ppSheet(c, `<div class="row between"><b class="h3">ผลงานของ ${esc(p.name)}</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      ${w.image ? `<img class="pp-bigimg" src="${esc(w.image)}" alt="">` : ''}
      <p class="p" style="font-size:16px;color:var(--ink)">${esc(w.text)}</p>
      ${w.video ? `<div class="card flat"><span class="small">ลิงก์คลิป</span><b style="word-break:break-all">${esc(w.video)}</b><button class="btn" data-act="openVideo" data-url="${esc(w.video)}">${I('play')}เปิดคลิป</button></div>` : ''}
      <button class="btn ghost" data-close>ปิด</button>`);
  });
  SC.action('openVideo', (s, c) => { c.close(); c.toast('ห้องซ้อม: ระบบจริงจะเปิดคลิปในแอป YouTube'); });
  /* ================================================================ p.intake */
  /* No cancel here (Boss 29 Oct): the patient chose this PT on purpose; to change their mind they go back. */
  function chosenNote(s) {
    const chosen = s.patient.chosenPt && ptName(s, s.patient.chosenPt); if (!chosen) return '';
    return `<div class="pp-chosen" role="note"><span class="tile">${I('user-round')}</span><span class="grow">คุณขอ <b>${esc(chosen)}</b><small>ครั้งแรกจ่ายราคา ClairConnect Trial ฿1,599 · ทีมส่งงานให้คนนี้ก่อน ถ้าเวลาและพื้นที่ตรงกัน</small></span></div>`;
  }
  function intakeBody(s) {
    const p = s.patient, st = p.intakeStep || 0;
    if (st === 0) return `<div class="pp-i0"><div class="pp-ih" aria-hidden="true">
        <div class="pp-tk"><div class="top"><img class="tk-logo" src="a/synaclair-logo.svg" alt=""><img class="tk-mark" src="a/synaclair-icon.svg" alt=""><h2>แบบประเมินอาการ</h2><p>ช่วยทีมหานักกายภาพที่ใช่</p></div>
          <div class="bot"><div class="perf" style="top:0"></div><span class="tk-parts">${[['target', 'เป้าหมาย'], ['heart-pulse', 'สุขภาพ'], ['footprints', 'กิจวัตร']].map(([ic, t], i) => `<span style="--i:${i}"><i>${I(ic)}</i>${t}</span>`).join('')}</span></div>
          <span class="pp-stamp"><svg viewBox="0 0 72 72"><defs><linearGradient id="ppStampG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e6c68f"/><stop offset="1" stop-color="#c9954a"/></linearGradient></defs><circle class="bg" cx="36" cy="36" r="34"/><circle class="fg" cx="36" cy="36" r="34" pathLength="220"/></svg><b>ไม่ถึง<strong>3</strong>นาที</b></span></div>
      </div>
      <div class="pp-ihead"><h1 class="h1">มาค่อย ๆ วางแผน<br>ดูแลไปด้วยกัน</h1>
      <p class="p">ตอบสั้น ๆ เรื่องเป้าหมาย สุขภาพ และกิจวัตร ทีมจะใช้ข้อมูลนี้หานักกายภาพที่เหมาะกับคุณ</p></div>
      <ul class="pp-ifacts">${[['users', 'ญาติ<br>ทำแทนได้'], ['save', 'บันทึกร่าง<br>อัตโนมัติ'], ['info', 'ไม่ใช่<br>การวินิจฉัย']].map(([ic, x]) => `<li><span class="tile">${I(ic)}</span>${x}</li>`).join('')}</ul>
      ${chosenNote(s)}</div>`;
    if (st === 1) return `<div class="pp-qh"><span class="tile">${I('heart-handshake')}</span><h1 class="h1">รู้จักผู้รับบริการกันก่อน</h1></div>
      <div class="grid2">${[['SELF', 'ตัวเอง', 'user-round'], ['SOMEONE_ELSE', 'คนที่ฉันดูแล', 'users']].map(([v, l, ic]) => `<button class="pp-choice" aria-pressed="${p.bookingFor === v}" data-pick="patient.bookingFor" data-value="${v}">${I(ic)}<span>${l}</span></button>`).join('')}</div>
      <label class="field"><span>${p.bookingFor === 'SOMEONE_ELSE' ? 'ชื่อ-นามสกุลจริง ของคนที่คุณดูแล' : 'ชื่อ-นามสกุลจริง ของคุณ'}</span><input class="in" data-bind="patient.legalName" value="${esc(p.legalName || '')}" placeholder="เช่น สมใจ รักดี" autocomplete="name"><small class="hint">สำหรับออกใบรับรองทางกายภาพบำบัด</small></label>
      <label class="field"><span>ชื่อที่อยากให้ทีมเรียก</span><input class="in" data-bind="patient.name" value="${esc(p.name)}" placeholder="เช่น คุณแม่สมใจ" autocomplete="nickname"></label>
      <label class="field"><span>เบอร์โทร</span><input class="in" data-bind="patient.phone" value="${esc(p.phone)}" placeholder="08x xxx xxxx" inputmode="tel" maxlength="10" autocomplete="tel"><small class="hint">ทีมโทรยืนยันนัดเบอร์นี้</small></label>`;
    if (st === 2) return `<div class="pp-qh"><span class="tile">${I('sparkles')}</span><h1 class="h1">เป้าหมายในการรักษาคืออะไร?</h1><p class="p">เลือกได้หลายข้อ ตามสิ่งที่อยากกลับมาทำได้</p></div>
      <div class="stack">${GOALS.map(([k, t, ic]) => `<button class="pp-choice" aria-pressed="${p.goals.includes(k)}" data-toggle="patient.goals" data-value="${k}">${I(ic)}<span>${t}</span><span class="ck">${I('check')}</span></button>`).join('')}</div>
      ${p.goals.includes('OTHER') ? `<label class="field"><span>อยากทำอะไรเพิ่มเติม</span><textarea class="in" data-bind="patient.goalOther" placeholder="เช่น อยากกลับไปดูแลสวน">${esc(p.goalOther)}</textarea></label>` : ''}`;
    if (st === 3) {
      const h = p.health || {};
      return `<div class="pp-qh"><span class="tile">${I('shield-check')}</span><h1 class="h1">ข้อมูลสุขภาพ 6 ข้อ</h1><p class="p">ตอบ มี หรือ ไม่มี ตามที่รู้ ทีมใช้ข้อมูลนี้ดูแลให้ปลอดภัย</p></div>
      ${HEALTH.map((q, i) => `<div class="card pp-q"><span class="n">ข้อ ${i + 1} / 6</span><b class="h3">${q.t}</b>${q.sub ? `<p class="p" style="font-size:14.5px">${q.sub}</p>` : ''}
        ${q.bp ? bpField(p) : `<div class="pp-yn" role="group" aria-label="${esc(q.t)}">${[['NO', q.no], ['YES', q.yes]].map(([v, l]) => `<button class="${q.urgent && v === 'YES' ? 'red' : ''}" aria-pressed="${h[q.k] === v}" data-pick="patient.health.${q.k}" data-value="${v}">${l}</button>`).join('')}</div>`}
        ${q.urgent && h.q1 === 'YES' ? `<div class="note warn" role="alert"><b class="h3" style="color:var(--red)">ขอความช่วยเหลือฉุกเฉินก่อนนะคะ</b><p style="margin:4px 0 10px">โทร 1669 หรือไปโรงพยาบาลใกล้บ้านทันที หน้านี้ไม่รับจองบริการฉุกเฉินและจะไม่พาไปชำระเงิน</p><button class="btn danger" data-act="call1669">${I('phone')}โทร 1669</button></div>` : ''}
        ${q.k === 'q3' && h.q3 === 'YES' ? `<span class="label">มีอะไรบ้าง (แตะได้หลายข้อ)</span><div class="chips">${DEVICES.map(c => { const on = (p.devices || []).includes(c); return `<button class="chip ${on ? 'on' : ''}" aria-pressed="${on}" data-toggle="patient.devices" data-value="${c}">${on ? I('check') : ''}${c}</button>`; }).join('')}</div>${(p.devices || []).includes('อื่น ๆ') ? `<label class="field"><span>อุปกรณ์อื่น ๆ คือ</span><input class="in" data-bind="patient.deviceOther" value="${esc(p.deviceOther || '')}" placeholder="พิมพ์ชื่ออุปกรณ์" aria-label="อุปกรณ์อื่น ๆ"></label>` : ''}` : ''}
        ${q.k === 'q4' && h.q4 === 'YES' ? `<label class="field"><span>เล่าให้เราฟังหน่อย</span><textarea class="in" rows="3" data-bind="patient.medNote" aria-label="ออกจากโรงพยาบาลหรือข้อห้ามจากแพทย์" placeholder="ออกจากโรงพยาบาลเมื่อไหร่ เพราะอะไร หรือหมอห้ามทำอะไรบ้าง">${esc(p.medNote || '')}</textarea></label>` : ''}
        ${q.k === 'q5' && h.q5 === 'YES' ? `<label class="field"><span>ผ่าตัดหรือใส่อุปกรณ์ตรงไหน</span><textarea class="in" rows="2" data-bind="patient.surgeryNote" aria-label="ผ่าตัดหรือใส่อุปกรณ์ตรงไหน" placeholder="ตรงไหน ทำเมื่อไหร่ เช่น เปลี่ยนข้อเข่าซ้าย ปี 2566">${esc(p.surgeryNote || '')}</textarea></label>` : ''}
        ${q.k === 'q6' && h.q6 === 'YES' ? `<span class="label">เป็นโรคอะไรบ้าง (แตะได้หลายข้อ)</span><div class="chips">${CONDITIONS.map(c => `<button class="chip ${(p.conditions || []).includes(c) ? 'on' : ''}" data-toggle="patient.conditions" data-value="${c}">${c}</button>`).join('')}</div>${(p.conditions || []).includes('อื่น ๆ') ? `<label class="field"><span>โรคอื่น ๆ คือ</span><input class="in" data-bind="patient.conditionOther" value="${esc(p.conditionOther || '')}" placeholder="พิมพ์ชื่อโรค" aria-label="โรคอื่น ๆ"></label>` : ''}` : ''}
      </div>`).join('')}
      <div class="card pp-q"><span class="n">ไม่บังคับ</span><b class="h3">มีเรื่องสุขภาพที่อยากเล่าให้เราฟังไหม</b><p class="p" style="font-size:14.5px">โรคประจำตัว ยาที่ทานอยู่ การผ่าตัด หรือสิ่งที่หมอเคยบอก พิมพ์มาได้เลย</p>
        <label class="field"><textarea class="in" rows="3" aria-label="เรื่องสุขภาพที่อยากเล่า" data-bind="patient.healthStory" placeholder="เช่น ผ่าตัดเข่าซ้ายเมื่อปีที่แล้ว ทานยาความดันทุกเช้า">${esc(p.healthStory || '')}</textarea></label></div>
      <p class="note mint" style="margin:0">SynaClair ให้บริการกายภาพบำบัดตามนัด ไม่ใช่บริการฉุกเฉิน</p>`;
    }
    if (st === 4) {
      const b = p.barthel || {}, done = BARTHEL.filter(q => b[q.k] !== undefined).length, cur = BARTHEL.findIndex(q => b[q.k] === undefined);
      const answered = BARTHEL.filter(q => b[q.k] !== undefined).map(q => q.k);
      if (adlSeen) { const nk = answered.find(k => !adlSeen.has(k)); if (nk) adlPop = { k: nk, t: performance.now() }; }
      adlSeen = new Set(answered);
      return `<div class="pp-qh"><span class="tile">${I('house')}</span><h1 class="h1">กิจวัตรประจำวัน</h1><p class="p">ตอบจากสิ่งที่ทำได้จริง ไม่มีถูกหรือผิด ไม่ต้องลองกิจกรรมที่เสี่ยง</p></div>
      <div class="row between"><span class="label">ตอบแล้ว ${done} / 10</span><span class="small">Barthel ADL</span></div><div class="progress"><i style="width:${done * 10}%"></i></div>
      ${BARTHEL.map((q, i) => `<div class="card pp-bq"><div class="row">${adlIcon(q, b, i === cur)}<div class="grow"><span class="small">ข้อ ${i + 1}</span><b class="h3" style="display:block">${q.t}</b></div></div>${q.c ? `<p class="p" style="font-size:14px">${q.c}</p>` : ''}
        ${q.o.map(([v, l, hint]) => `<button class="pp-choice" aria-pressed="${b[q.k] === v}" data-pick="patient.barthel.${q.k}" data-value="${v}"><span>${l}${hint ? `<small>${hint}</small>` : ''}</span><span class="ck">${I('check')}</span></button>`).join('')}
</div>`).join('')}`;
    }
    if (st === 5) {
      const a = p.address;
      if (!a.district && p.district) a.district = p.district;
      const subs = subsOf(a.district);
      if (a.district && !subs.includes(a.subdistrict)) a.subdistrict = subs.length === 1 ? subs[0] : '';
      a.postal = a.district ? (POSTAL_SUB[a.district + '|' + a.subdistrict] || POSTAL[a.district] || '') : '';
      return `<div class="pp-qh"><span class="tile">${I('map-pin')}</span><h1 class="h1">ให้เราไปดูแลที่ไหน?</h1><p class="p">กรอกให้ละเอียด นักกายภาพจะได้ไปถูกบ้านตั้งแต่ครั้งแรก</p></div>
      <label class="field"><span>จังหวัด</span><select class="in" disabled><option>กรุงเทพมหานคร</option></select><small class="hint">ตอนนี้ให้บริการในกรุงเทพฯ</small></label>
      <label class="field"><span>เขต</span><select class="in" data-bind="patient.address.district"><option value="">เลือกเขต</option>${SC.ZONES.map(z => `<optgroup label="${esc(z.name)}">${z.districts.map(d => `<option ${d === a.district ? 'selected' : ''}>${esc(d)}</option>`).join('')}</optgroup>`).join('')}</select></label>
      <div class="grid2"><label class="field"><span>แขวง</span><select class="in" data-bind="patient.address.subdistrict" ${a.district ? '' : 'disabled'}><option value="">เลือกแขวง</option>${subs.map(x => `<option ${x === a.subdistrict ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
        <label class="field"><span>รหัสไปรษณีย์</span><input class="in" value="${esc(a.postal)}" readonly placeholder="เติมให้เอง" aria-readonly="true"></label></div>
      <label class="field"><span>บ้านเลขที่ ซอย ถนน <em class="req">จำเป็น</em></span><input class="in" data-bind="patient.address.line" value="${esc(a.line)}" placeholder="เช่น 99/1 ซ.บางนา-ตราด 25 ถ.บางนา-ตราด" autocomplete="street-address"></label>
      <label class="field"><span>จุดสังเกตและวิธีเข้าบ้าน <em class="req">จำเป็น</em></span><textarea class="in" data-bind="patient.address.landmark" style="min-height:84px" placeholder="เช่น ตึกสีครีม ประตูรั้วสีเขียว ตรงข้ามร้านสะดวกซื้อ จอดรถหน้าบ้านได้">${esc(a.landmark || '')}</textarea></label>
      <span class="label">หมุดบ้าน</span>
      <div class="pp-map ${a.pin ? 'ok' : ''}" role="img" aria-label="แผนที่ตัวอย่าง"><span class="pin">${I('map-pin')}</span><span class="lbl">${a.pin ? 'ยืนยันหมุดแล้ว' : 'ลากแผนที่ให้หมุดตรงบ้าน'}</span></div>
      ${a.pin ? `<button class="btn ghost" data-pick="patient.address.pin" data-value="false">${I('map-pin')}ย้ายหมุดใหม่</button>` : `<button class="btn soft" data-pick="patient.address.pin" data-value="true">${I('check')}ยืนยันหมุด</button>`}`;
    }
    if (st === 6) {
      // Chosen times pin to the top of the step (Boss 23 Oct): older users see their picks without scrolling back up.
      const day = p.pickDay || DAYS[0], w = p.windows || [], fresh = w.find(x => !winSeen.includes(x)); winSeen = w.slice();
      const tray = `<div class="pp-tray" role="status" aria-live="polite"><b>เวลาที่เลือก ${w.length}/3</b><div class="pp-trayrow">${[0, 1, 2].map(i => { const x = w[i]; return x
        ? `<span class="pp-pick k${i}${x === fresh ? ' pop' : ''}" ${x === fresh ? 'data-keep-anim' : ''}><small>${i ? 'สำรอง ' + i : 'หลัก'}</small><b>${esc(x)} น.</b><button class="ib" data-act="dropWindow" data-i="${i}" aria-label="ลบ ${esc(x)}">${I('x')}</button></span>`
        : `<span class="pp-pick empty"><small>${i ? 'สำรอง ' + i : 'หลัก'}</small><b>ยังไม่เลือก</b></span>`; }).join('')}</div></div>`;
      return `<div class="pp-qh"><span class="tile">${I('calendar-days')}</span><h1 class="h1">เลือกเวลาที่สะดวก</h1><p class="p">ครั้งแรกใช้เวลาไม่เกิน 1 ชั่วโมงครึ่ง · เลือกเวลาหลัก 1 เวลา และสำรองได้อีก 2 เวลา ยังไม่ใช่นัดยืนยัน</p></div>
      ${tray}
      <div class="chips scroll" role="group" aria-label="วันที่">${DAYS.map(d => `<button class="chip ${d === day ? 'on' : ''}" data-pick="patient.pickDay" data-value="${d}">${d}${w.some(x => x.startsWith(d + ' ')) ? ' •' : ''}</button>`).join('')}</div>
      <div class="pp-slots" role="group" aria-label="เวลาเริ่ม ${esc(day)}">${TIMES.map(t => { const v = day + ' ' + t, i = w.indexOf(v); return `<button aria-pressed="${i >= 0}" class="${i >= 0 ? 'k' + i : ''}" data-act="pickWindow" data-v="${v}">${t}${i >= 0 ? `<em>${i ? 'สำรอง ' + i : 'หลัก'}</em>` : ''}</button>`; }).join('')}</div>`;
    }
    if (st === 7) return `<div class="pp-qh"><span class="tile">${I('shield-check')}</span><h1 class="h1">อ่านก่อนส่งข้อมูล</h1><p class="p">ข้อมูลใช้เพื่อวางแผนและประสานการดูแล ไม่ใช่ผลตรวจวินิจฉัยหรือการยืนยันนัด</p></div>
      <div class="card flat"><ul class="pp-ul">${['ทีมและนักกายภาพที่รับงานเท่านั้นที่เห็นข้อมูลสุขภาพ', 'ใช้ที่อยู่และหมุดเพื่อส่งนักกายภาพไปถึงบ้าน', 'ส่งข่าวการนัดและสรุปการดูแลทาง LINE', 'ขอดู แก้ หรือขอลบข้อมูลได้ที่เมนู "ฉัน"'].map(t => `<li>${I('check')}${t}</li>`).join('')}</ul>
        <button class="link" data-act="privacyFull" style="justify-self:start">อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม</button></div>
      <label class="check card" style="padding:14px 16px"><input type="checkbox" data-bind="patient.consent" ${p.consent ? 'checked' : ''}><span style="font-size:16px">ยอมรับการใช้ข้อมูลเพื่อจัดบริการ</span></label>`;
    /* 8 · summary */
    const b = p.barthel || {}, answered = BARTHEL.filter(q => b[q.k] !== undefined).length, unsure = BARTHEL.filter(q => b[q.k] === null).length, flags = healthFlags(s), a = p.address;
    const sec = (title, step, html) => `<div class="card pp-sum"><div class="row between"><b class="h3">${title}</b><button class="link" data-act="intakeGoto" data-step="${step}">แก้</button></div>${html}</div>`;
    return `<div class="pp-qh"><span class="tile">${I('heart-handshake')}</span><h1 class="h1">เป้าหมายของคุณ พร้อมให้ทีมดูแล</h1><p class="p">ตรวจอีกครั้ง แล้วกดส่ง</p></div>
      ${sec('ผู้รับบริการ', 1, `<p>${esc(p.legalName || '—')}${p.name ? ` (เรียกว่า ${esc(p.name)})` : ''} · ${esc(p.phone || '—')}</p><p class="small">${p.bookingFor === 'SOMEONE_ELSE' ? 'จองให้คนที่ฉันดูแล' : 'จองให้ตัวเอง'}</p>`)}
      ${sec('เป้าหมาย', 2, p.goals.length ? `<div class="chips">${p.goals.map(g => `<span class="pill">${esc(g === 'OTHER' && p.goalOther ? p.goalOther : GOAL_TEXT[g])}</span>`).join('')}</div>` : '<p class="small">ยังไม่ได้เลือก</p>')}
      ${sec('ข้อมูลสุขภาพ', 3, HEALTH.every(q => q.bp ? bpOk(p) : (p.health || {})[q.k]) ? `<p>${flags ? `มี ${flags} ข้อที่ทีมขอดูเพิ่ม ทีมอาจโทรถามก่อนนัด` : 'ไม่มีข้อที่ต้องให้ทีมดูก่อน'}</p>${bpLine(p) ? `<p class="small" style="margin:6px 0 0">ความดันล่าสุด ${bpLine(p)}</p>` : ''}${(p.health || {}).q3 === 'YES' && (p.devices || []).length ? `<p class="small" style="margin:6px 0 0">อุปกรณ์: ${p.devices.map(d => esc(d === 'อื่น ๆ' && p.deviceOther ? p.deviceOther : d)).join(' · ')}</p>` : ''}${(p.health || {}).q4 === 'YES' && p.medNote ? `<p class="small" style="margin:6px 0 0">ออกจากโรงพยาบาล / ข้อห้ามแพทย์: ${esc(p.medNote)}</p>` : ''}${(p.health || {}).q6 === 'YES' && (p.conditions || []).length ? `<p class="small" style="margin:6px 0 0">โรคประจำตัว: ${p.conditions.map(c => esc(c === 'อื่น ๆ' && p.conditionOther ? p.conditionOther : c)).join(' · ')}</p>` : ''}${(p.health || {}).q5 === 'YES' && p.surgeryNote ? `<p class="small" style="margin:6px 0 0">ผ่าตัด / อุปกรณ์ในร่างกาย: ${esc(p.surgeryNote)}</p>` : ''}` : '<p class="small">ยังตอบไม่ครบ 6 ข้อ</p>') + (p.healthStory ? `<p class="small">เล่าเพิ่ม: ${esc(p.healthStory)}</p>` : '')}
      ${sec('กิจวัตรประจำวัน', 4, `<p>${answered === 10 ? (unsure ? `ตอบครบ 10 ข้อ · ไม่แน่ใจ ${unsure} ข้อ ทีมจะช่วยดู` : 'ตอบครบ 10 ข้อแล้ว') : `ตอบแล้ว ${answered} / 10 ข้อ`}</p>`)}
      ${sec('ที่อยู่', 5, `<p>${esc(a.line || '—')}</p>${a.landmark ? `<p class="small">จุดสังเกต: ${esc(a.landmark)}</p>` : ''}<p class="small">${esc([a.subdistrict, a.district, a.province, a.postal].filter(Boolean).join(' '))} · ${a.pin ? 'ยืนยันหมุดแล้ว' : 'ยังไม่ยืนยันหมุด'}</p>`)}
      ${sec('เวลาที่สะดวก', 6, (p.windows || []).length ? p.windows.map((x, i) => `<p>${i ? 'สำรอง' : 'หลัก'} · ${esc(x)} น.</p>`).join('') : '<p class="small">ยังไม่ได้เลือก</p>')}
      <p class="pp-hint">ส่งแล้วจะเห็นผลประเมินเบื้องต้น และขั้นตอนชำระ ClairConnect Trial</p>`;
  }
  function intakeNeed(s) {
    const p = s.patient, st = p.intakeStep || 0;
    if (st === 1) return { need: 'patient.legalName,patient.name,patient.phone' };
    if (st === 2) return { need: 'patient.goals' + (p.goals.includes('OTHER') ? ',patient.goalOther' : '') };
    if (st === 3) return { need: HEALTH.filter(q => !q.bp).map(q => 'patient.health.' + q.k).join(',') + ((p.health || {}).q3 === 'YES' ? ',patient.devices' : '') + ((p.health || {}).q4 === 'YES' ? ',patient.medNote' : '') + ((p.health || {}).q5 === 'YES' ? ',patient.surgeryNote' : '') + ((p.health || {}).q3 === 'YES' && (p.devices || []).includes('อื่น ๆ') ? ',patient.deviceOther' : '') + ((p.health || {}).q6 === 'YES' && (p.conditions || []).includes('อื่น ๆ') ? ',patient.conditionOther' : ''), off: !bpOk(p), hint: bpOk(p) ? '' : 'ใส่ค่าความดัน หรือติ๊ก "ไม่แน่ใจ"' };
    if (st === 4) { const left = BARTHEL.filter(q => (p.barthel || {})[q.k] === undefined).length; return { off: left > 0, hint: left ? `เหลืออีก ${left} ข้อ` : '' }; }
    if (st === 5) return { need: 'patient.address.district,patient.address.subdistrict,patient.address.postal,patient.address.line,patient.address.landmark,patient.address.pin' };
    if (st === 6) return { need: 'patient.windows' };
    if (st === 7) return { need: 'patient.consent' };
    return {};
  }
  SC.screen('p.intake', {
    role: 'patient',
    render(s) {
      const p = s.patient, st = p.intakeStep || 0, nd = intakeNeed(s), emergency = st === 3 && (p.health || {}).q1 === 'YES';
      const chosen = p.chosenPt && ptName(s, p.chosenPt);
      const next = st === 0 ? `<button class="btn" data-act="intakeNext">เริ่มประเมินเบื้องต้น ${I('arrow-right')}</button>`
        : `<div class="foot row2" style="padding:0;box-shadow:none"><button class="btn ghost" data-act="intakeBack">${I('arrow-left')}ย้อนกลับ</button>${st === 8
          ? `<button class="btn" data-act="submitRequest" ${p.health && p.health.q1 === 'YES' ? 'disabled' : ''}>ส่งข้อมูล ${I('arrow-right')}</button>`
          : emergency ? '' : `<button class="btn ${nd.off ? 'off' : ''}" data-act="intakeNext" ${nd.need ? `data-need="${nd.need}"` : ''} ${nd.off ? 'disabled' : ''}>ถัดไป ${I('arrow-right')}</button>`}</div>`;
      return `<div class="scr pp white">
        ${ui.bar('ประเมินอาการ', { right: '<span class="small" style="padding-right:10px">บันทึกร่างอัตโนมัติ</span>' })}
        <div class="pp-prog"><div class="row"><span>${STEP_LABELS[st]}</span><span>${st + 1} / 9</span></div><div class="progress" role="progressbar" aria-label="ความคืบหน้าการกรอก" aria-valuenow="${st + 1}" aria-valuemin="1" aria-valuemax="9"><i style="width:${(st + 1) / 9 * 100}%"></i></div></div>
        <div class="body">
          ${s.request && st > 0 ? `<p class="note" style="margin:0">ส่งคำขอ ${esc(s.request.ref)} แล้ว แก้ข้อมูลได้ แล้วกดส่งอีกครั้งเพื่ออัปเดต</p>` : ''}
          ${st > 0 ? chosenNote(s) : ''}
          ${intakeBody(s)}
        </div>
        <div class="foot">${nd.hint ? `<p class="pp-hint">${esc(nd.hint)}</p>` : ''}${next}</div>
      </div>`;
    }
  });
  SC.action('intakeNext', (s, c) => {
    const p = s.patient, st = p.intakeStep || 0;
    if (st === 1) { p.phone = String(p.phone || '').replace(/\D/g, ''); if (!/^0\d{8,9}$/.test(p.phone)) { c.toast('ใส่เบอร์โทร 9–10 หลัก ขึ้นต้นด้วย 0 นะคะ'); return; } }
    if (st === 3 && p.health.q1 === 'YES') return;
    if (st === 4 && BARTHEL.some(q => (p.barthel || {})[q.k] === undefined)) { c.toast('ตอบให้ครบ 10 ข้อก่อนนะคะ เลือก "ไม่แน่ใจ" ได้'); return; }
    p.intakeStep = Math.min(8, st + 1); top();
  });
  SC.action('intakeBack', (s) => { s.patient.intakeStep = Math.max(0, (s.patient.intakeStep || 0) - 1); top(); });
  SC.action('intakeGoto', (s, c) => { s.patient.intakeStep = +c.data.step; top(); if (SC.v.at.patient !== 'p.intake') { c.close(); return 'p.intake'; } });
  SC.action('call1669', (s, c) => { c.toast('ห้องซ้อม: เครื่องจริงจะโทรออก 1669 ทันที'); });
  let winSeen = [];
  SC.action('pickWindow', (s, c) => {
    const w = (s.patient.windows || []).slice(), v = c.data.v, i = w.indexOf(v);
    if (i >= 0) w.splice(i, 1); else if (w.length >= 3) { c.toast('เลือกได้ 3 เวลา (หลัก + สำรอง 2) ลบเวลาเดิมก่อนนะคะ'); return; } else w.push(v);
    s.patient.windows = w;
  });
  SC.action('dropWindow', (s, c) => { const w = (s.patient.windows || []).slice(); w.splice(+c.data.i, 1); s.patient.windows = w; });
  SC.action('privacyFull', (s, c) => ppSheet(c, `<b class="h2">นโยบายความเป็นส่วนตัว (ย่อ)</b>
    <p class="p">SynaClair เก็บชื่อ เบอร์โทร ที่อยู่ และข้อมูลสุขภาพที่คุณกรอก เพื่อจัดนักกายภาพ ยืนยันนัด และเก็บประวัติการดูแลตามมาตรฐานวิชาชีพ</p>
    <p class="p">ข้อมูลสุขภาพเห็นได้เฉพาะทีมคลินิกและนักกายภาพที่รับงานของคุณ เราไม่ขายข้อมูลและไม่ใช้โฆษณา</p>
    <p class="p">คุณขอดู แก้ไข หรือขอลบข้อมูลได้ทุกเมื่อที่เมนู "ฉัน" หรือแท็บ "คุยกับทีม"</p>
    <button class="btn" data-close>อ่านแล้ว</button>`));
  SC.action('submitRequest', (s, c) => {
    if ((s.patient.health || {}).q1 === 'YES') { c.toast('มีอาการฉุกเฉิน: โทร 1669 ก่อนนะคะ'); return; }
    if (s.request) { c.toast('อัปเดตข้อมูลประเมินแล้ว'); return 'p.result'; }
    s.request = { ref: 'SC-2610001', status: 'PAYMENT_PENDING', preferredPt: s.patient.chosenPt, offerTo: [], slip: null };
    c.line('patient', { key: 'received' }); c.line('patient', { key: 'intakePay' });
    return 'p.result';
  });
  /* ================================================================ p.result */
  SC.screen('p.result', {
    role: 'patient',
    render(s) {
      if (!s.request) return `<div class="scr pp">${ui.bar('ผลประเมินเบื้องต้น')}<div class="body">${ui.empty('clipboard-check', 'ยังไม่มีผลประเมิน', 'ตอบคำถามสั้น ๆ ไม่ถึง 3 นาที แล้วจะเห็นผลที่นี่', '<button class="btn auto" data-go="p.intake">ประเมินอาการ</button>')}</div></div>`;
      const r = profileOf(s), chosen = s.request.preferredPt && ptName(s, s.request.preferredPt), pending = s.request.status === 'PAYMENT_PENDING';
      return `<div class="scr pp glow">
        ${ui.bar('ผลประเมินเบื้องต้น')}
        <div class="body enter">
          <div class="stack center" style="justify-items:center">
            <span class="kick">ผลประเมินเบื้องต้นของคุณ</span>
            <span class="pp-reveal"><span class="halo"></span><span class="ring"><svg viewBox="0 0 236 236"><circle cx="118" cy="118" r="114"/></svg></span><span class="pp-portrait"><img src="a/${r.img}.jpg" alt=""></span><span class="spk s1"><svg viewBox="0 0 20 20"><path d="M10 0c.9 5.2 4.8 9.1 10 10-5.2.9-9.1 4.8-10 10-.9-5.2-4.8-9.1-10-10 5.2-.9 9.1-4.8 10-10z" fill="currentColor"/></svg></span><span class="spk s2"><svg viewBox="0 0 20 20"><path d="M10 0c.9 5.2 4.8 9.1 10 10-5.2.9-9.1 4.8-10 10-.9-5.2-4.8-9.1-10-10 5.2-.9 9.1-4.8 10-10z" fill="currentColor"/></svg></span><span class="spk s3"><svg viewBox="0 0 20 20"><path d="M10 0c.9 5.2 4.8 9.1 10 10-5.2.9-9.1 4.8-10 10-.9-5.2-4.8-9.1-10-10 5.2-.9 9.1-4.8 10-10z" fill="currentColor"/></svg></span></span>
            <h1 class="h1" style="font-size:28px">${r.title}</h1>
            <p class="p" style="font-size:16px">${r.tagline}</p>
          </div>
          ${r.level ? `<div class="stack" style="gap:4px"><div class="pp-level" role="img" aria-label="ระดับ ${r.level} จาก 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= r.level ? 'on' : ''}"></i>`).join('')}</div><div class="pp-ends"><span>ดูแลใกล้ชิด</span><span>ลุยเองได้</span></div></div>` : ''}
          <div class="card"><b class="h3">${I('sparkles')} ตัวตนของคุณตอนนี้</b><p class="p" style="font-size:16px">${r.reading}</p></div>
          ${r.strengths.length ? `<div class="card"><b class="sec-h">${I('sparkles')}จุดแข็งของคุณ</b><ul class="pp-ul">${r.strengths.map(t => `<li>${I('check')}${t}</li>`).join('')}</ul></div>` : ''}
          ${r.plan.length ? `<div class="card"><b class="sec-h">${I('heart-handshake')}เรื่องที่เราจะช่วยกัน</b><ul class="pp-ul">${r.plan.map(t => `<li>${I('heart-handshake')}${t}</li>`).join('')}</ul></div>` : ''}
          ${r.goals.length ? `<div class="card"><b class="sec-h">${I('target')}เป้าหมายที่คุณเลือก</b><ul class="pp-ul">${r.goals.map(t => `<li>${I('heart')}${esc(t)}</li>`).join('')}</ul></div>` : ''}
          <div class="card cream"><b class="sec-h">${I('lightbulb')}เคล็ดลับระหว่างรอ</b><ul class="pp-ul gold">${r.tips.map(t => `<li>${I('lightbulb')}${t}</li>`).join('')}</ul></div>
          <p class="pp-hint">เป็นการประเมินเบื้องต้นจากคำตอบ ไม่ใช่การวินิจฉัย นักกายภาพจะประเมินจริงที่บ้าน</p>
          <div class="card"><b class="sec-h">${I('route')}ขั้นต่อไป</b><div class="steps">
            <div class="step ${pending ? 'now' : 'done'}"><span class="dot">${pending ? 1 : I('check')}</span><div><div class="t">ชำระ ClairConnect Trial ฿1,599</div><div class="s">ประเมินและรักษาครั้งแรก ไม่เกิน 1 ชั่วโมงครึ่ง</div></div></div>
            <div class="step"><span class="dot">2</span><div><div class="t">${chosen ? `ทีมส่งงานให้ ${esc(chosen)} ก่อน` : 'ทีมจับคู่นักกายภาพใกล้บ้าน'}</div><div class="s">${chosen ? 'ถ้าเวลาและพื้นที่ไม่ตรง ทีมจะหาคนที่ใกล้เคียงให้' : 'มีใบประกอบวิชาชีพ ตรวจสอบแล้วทุกคน'}</div></div></div>
            <div class="step"><span class="dot">3</span><div><div class="t">ยืนยันนัดใน LINE</div><div class="s">เห็นชื่อ รูป และเวลาของนักกายภาพก่อนวันนัด</div></div></div>
          </div></div>
        </div>
        <div class="foot">${pending ? `<button class="btn" data-go="p.pay">${I('qr-code')}ClairConnect Trial ฿1,599</button>` : `<button class="btn" data-go="p.paywait">${I('hourglass')}ดูสถานะคำขอ</button>`}<button class="btn ghost" data-go="p.chat">${I('message-circle')}ถามทีมก่อน</button></div>
      </div>`;
    }
  });
  /* ================================================================ p.pay */
  SC.screen('p.pay', {
    role: 'patient',
    render(s) {
      const r = s.request;
      if (!r) return `<div class="scr pp">${ui.bar('ชำระเงิน')}<div class="body">${ui.empty('wallet', 'ยังไม่มีรายการที่ต้องชำระ', 'ประเมินอาการก่อน แล้วจะเห็นใบแจ้งชำระที่นี่', '<button class="btn auto" data-go="p.intake">ประเมินอาการ</button>')}</div></div>`;
      if (r.status !== 'PAYMENT_PENDING') return `<div class="scr pp">${ui.bar('ชำระเงิน')}<div class="body">${ui.empty('circle-check', 'ส่งสลิปแล้ว', 'ทีมกำลังดูแลขั้นต่อไป ดูความคืบหน้าได้เลย', '<button class="btn auto" data-go="p.paywait">ดูสถานะ</button>')}</div></div>`;
      const slip = r.slipDraft;
      return `<div class="scr pp">
        ${ui.bar('ชำระ ClairConnect Trial')}
        <div class="body">
          <div class="card"><div class="row between"><span class="small">ใบแจ้งชำระ ${esc(r.ref)}</span><span class="pill wait">รอชำระ</span></div>
            <dl class="kv"><dt>ClairConnect Trial</dt><dd>${money(SC.TRIAL)}</dd><dt>รายละเอียด</dt><dd>ประเมินและรักษาครั้งแรก</dd><dt>ผู้รับบริการ</dt><dd>${esc(s.patient.name || '—')}</dd></dl>
            <div class="sep"></div><div class="row between"><b class="sec-h">${I('receipt')}ยอดชำระ</b><span class="price">${money(SC.TRIAL)}</span></div></div>
          <div class="card center" style="justify-items:center">
            <b class="sec-h">${I('qr-code')}สแกนจ่ายด้วยแอปธนาคาร</b><span class="small">พร้อมเพย์ · ${money(SC.TRIAL)}.00</span>
            <div class="pp-qr">${qrSvg(r.ref)}</div>
            <div class="row" style="justify-content:center">${I('clock')}<span class="small">QR ใช้ได้อีก</span><span class="pp-count" id="ppCount">15:00</span></div>
            <button class="btn ghost" data-act="saveQr">${I('download')}บันทึกรูป QR</button>
          </div>
          <p class="note" style="margin:0">ห้องซ้อม: ไม่ต้องโอนเงินจริง ใช้สลิปตัวอย่างได้ · ระบบอ่านสลิปและเช็กยอดให้ทันที แล้วเริ่มหานักกายภาพเลย ไม่ต้องรอทีม</p>
          <div class="card"><b class="sec-h">${I('paperclip')}แนบสลิป</b>
            ${slip ? (slip === 'sample' || slip === 'odd' ? `<div class="pp-slip"><span class="ok">${I('circle-check')} โอนเงินสำเร็จ</span><b>${slip === 'odd' ? '฿1,500' : money(SC.TRIAL)}.00</b><span>ถึง SynaClair</span><span class="small">สลิปตัวอย่าง · 22 ต.ค. 2569</span></div>` : `<img class="pp-slipimg" src="${esc(slip)}" alt="สลิปที่แนบ">`) : '<p class="p">ถ่ายหรือเลือกภาพสลิปจากเครื่อง</p>'}
            <div class="stack"><label class="btn ghost pp-file">${I('upload')}${slip ? 'เปลี่ยนสลิป' : 'เลือกภาพสลิป'}<input type="file" accept="image/*" data-file="request.slipDraft"></label><button class="btn soft" data-act="sampleSlip">${I('image')}ใช้สลิปตัวอย่าง</button><button class="link" data-act="oddSlip" style="justify-self:center">ห้องซ้อม: ลองสลิปยอดไม่ตรง</button></div>
          </div>
        </div>
        <div class="foot"><button class="btn" data-act="sendSlip" data-need="request.slipDraft">${I('send')}ส่งสลิป</button></div>
      </div>`;
    },
    mount(root, s) {
      if (!s.request || s.request.status !== 'PAYMENT_PENDING') return;
      if (!s.patient.payBy || s.patient.payBy < Date.now() - 60000 * 60) s.patient.payBy = Date.now() + 15 * 60000;
      const el = root.querySelector('#ppCount'); if (!el) return;
      const tick = () => { const left = Math.max(0, Math.round((SC.s.patient.payBy - Date.now()) / 1000)); el.textContent = left ? `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}` : 'หมดเวลา'; return left; };
      tick();
      clearInterval(window.__ppPayT);
      window.__ppPayT = setInterval(() => { if (!document.body.contains(el)) { clearInterval(window.__ppPayT); return; } if (!tick()) { clearInterval(window.__ppPayT); SC.s.patient.payBy = Date.now() + 15 * 60000; } }, 1000);
    }
  });
  SC.action('saveQr', (s, c) => c.toast('บันทึกรูป QR ลงเครื่องแล้ว เปิดแอปธนาคารแล้วเลือกรูปนี้ได้เลย'));
  SC.action('sampleSlip', (s, c) => { s.request.slipDraft = 'sample'; c.toast('แนบสลิปตัวอย่างแล้ว กด "ส่งสลิป" ได้เลย'); });
  SC.action('oddSlip', (s, c) => { s.request.slipDraft = 'odd'; c.toast('ห้องซ้อม: แนบสลิปยอด ฿1,500 (ขาด ฿99) ลองดูว่าแอดมินเห็นอะไร'); });
  SC.action('sendSlip', (s, c) => {
    if (!s.request) return;
    s.request.slip = s.request.slipDraft || 'sample';
    SC.autoPay(s, c.line);
    return 'p.paywait';
  });
  /* ================================================================ p.paywait */
  SC.screen('p.paywait', {
    role: 'patient',
    render(s) {
      const r = s.request;
      if (!r) return `<div class="scr pp">${ui.bar('สถานะคำขอ')}<div class="body">${ui.empty('hourglass', 'ยังไม่มีคำขอ', 'ประเมินอาการก่อน แล้วติดตามสถานะได้ที่นี่', '<button class="btn auto" data-go="p.intake">ประเมินอาการ</button>')}</div></div>`;
      const order = ['PAYMENT_PENDING', 'SLIP_SENT', 'PAID', 'OFFERED', 'BOOKED'], k = order.indexOf(r.status);
      const now = k <= 0 ? 0 : k === 1 ? 1 : k <= 3 ? 2 : 4;
      const chosen = r.preferredPt && ptName(s, r.preferredPt), m = SC.me();
      const steps = [
        ['ส่งสลิปแล้ว', k >= 1 ? 'ได้รับสลิปของคุณแล้ว' : 'แนบสลิปเพื่อเริ่มดำเนินการ'],
        ['ระบบตรวจสลิป', k >= 2 ? (r.check && !r.check.ok && r.check.state !== 'ok' ? 'ได้รับสลิปแล้ว ทีมขอเช็กยอดอีกนิด' : 'รับเงินแล้ว ใบเสร็จส่งเข้า LINE') : 'ตรวจอัตโนมัติทันทีที่ส่งสลิป'],
        ['จับคู่นักกายภาพ', k === 3 ? `ส่งงานให้ ${esc(r.offerTo.includes('me') ? m.name : chosen || 'นักกายภาพ')} แล้ว รอตอบรับ` : k >= 4 ? `${esc(m.name)} รับงานแล้ว` : chosen ? `ส่งให้ ${esc(chosen)} ก่อน` : 'หาคนที่ใกล้บ้านและเวลาตรง'],
        ['ยืนยันนัด', k >= 4 ? 'นัดยืนยันแล้ว แจ้งใน LINE แล้ว' : 'ยืนยันใน LINE พร้อมชื่อและรูปนักกายภาพ']
      ];
      const head = [['ส่งสลิปก่อนนะคะ', 'ทีมจะเริ่มหานักกายภาพเมื่อได้รับสลิป'], ['ทีมกำลังตรวจเงิน', 'ไม่ต้องทำอะไรเพิ่ม เราจะแจ้งใน LINE เมื่อเสร็จ'], ['กำลังหานักกายภาพให้', 'ไม่ต้องทำอะไรเพิ่ม เราจะแจ้งใน LINE เมื่อมีคนรับงาน'], null, ['ยืนยันนัดแล้ว', 'เตรียมตัวตามคำแนะนำในหน้านัดได้เลย']][now];
      const v1 = s.visits[0];
      return `<div class="scr pp">
        ${ui.bar('สถานะคำขอ')}
        <div class="body">
          <div class="card hero"><span class="small" style="color:#d6e8de">คำขอ ${esc(r.ref)}</span><b class="h2">${head[0]}</b><p class="p">${head[1]}</p></div>
          <div class="card"><div class="steps">${steps.map((x, i) => { const done = i < now || now === 4, cur = i === now && now !== 4; return `<div class="step ${done ? 'done' : cur ? 'now' : ''}"><span class="dot">${done ? I('check') : i + 1}</span><div><div class="t">${x[0]}</div><div class="s">${x[1]}</div></div></div>`; }).join('')}</div></div>
          ${r.status === 'BOOKED' && v1 ? `<button class="pp-appt" data-go="p.appts"><span class="pp-date"><b>${dayNum(v1.date)}</b><small>${dayMon(v1.date)}</small></span><span class="grow"><span class="t" style="display:block">ทำเคสครั้งที่ 1</span><span class="s">${esc(weekday(v1.date))} · ${esc(v1.time)} น.<br>${esc(m.name)}</span></span>${I('chevron-right')}</button>` : ''}
          <p class="pp-hint">LINE จะเด้งแจ้งทุกครั้งที่สถานะเปลี่ยน</p>
        </div>
        <div class="foot">${r.status === 'PAYMENT_PENDING' ? `<button class="btn" data-go="p.pay">${I('qr-code')}ไปหน้าชำระเงิน</button>` : r.status === 'BOOKED' ? `<button class="btn" data-go="p.appts">${I('calendar-days')}ดูนัดของฉัน</button>` : ''}<button class="btn ghost" data-go="p.chat">${I('message-circle')}ถามทีม</button></div>
      </div>`;
    }
  });
  /* ================================================================ p.appts */
  function apptRow(s, v) {
    const m = SC.me(), pill = VISIT_PILL[v.step];
    return `<button class="pp-appt" data-go="p.appt" data-p-n="${v.n}"><span class="pp-date"><b>${dayNum(v.date)}</b><small>${dayMon(v.date)}</small></span>
      <span class="grow"><span class="row between"><span class="t">ครั้งที่ ${v.n}</span><span class="pill ${pill[1]}">${pill[0]}</span></span><span class="s" style="display:block">${esc(weekday(v.date))} · ${esc(v.time)} น.</span><span class="s" style="display:block">${esc(m.name)}</span></span></button>`;
  }
  SC.screen('p.appts', {
    role: 'patient',
    render(s) {
      const up = s.visits.filter(v => v.step < 4), past = s.visits.filter(v => v.step >= 4);
      const pendingCourse = s.course && s.course.next && !s.visits.some(v => v.n === 2);
      let content;
      if (!s.visits.length) {
        content = s.request ? `<button class="pp-status" data-go="p.paywait"><span class="tile">${I('hourglass')}</span><span class="grow"><b>คำขอ ${esc(s.request.ref)} กำลังดำเนินการ</b><small>นัดจะขึ้นที่นี่เมื่อนักกายภาพรับงาน</small></span>${I('chevron-right')}</button>${ui.empty('calendar-days', 'ยังไม่มีนัดที่ยืนยัน', 'ทีมกำลังหานักกายภาพให้ เราจะแจ้งใน LINE')}`
          : ui.empty('calendar-days', 'ยังไม่มีนัด', 'ประเมินอาการก่อน ทีมจะหานักกายภาพใกล้บ้านให้', '<button class="btn auto" data-go="p.intake">ประเมินอาการ</button>');
      } else {
        content = `${up.length || pendingCourse ? `<h2 class="sec-h">${I('calendar-clock')}นัดที่จะถึง</h2>${up.map(v => apptRow(s, v)).join('')}` : ''}
          ${pendingCourse ? `<button class="pp-appt" data-go="p.course"><span class="pp-date"><b>${esc((/\d+/.exec(s.course.next) || [''])[0])}</b><small>ต.ค.</small></span><span class="grow"><span class="row between"><span class="t">ครั้งที่ 2</span><span class="pill wait">รอทีมยืนยัน</span></span><span class="s" style="display:block">${esc(s.course.next)} น.</span><span class="s" style="display:block">ทีมกำลังตรวจเงินคอร์ส</span></span></button>` : ''}
          ${past.length ? `<h2 class="sec-h">${I('history')}ที่ผ่านมา</h2>${past.map(v => apptRow(s, v)).join('')}` : ''}
          ${s.course ? `<button class="pp-status" data-go="p.course"><span class="tile gold">${I('ticket')}</span><span class="grow"><b>คอร์สของฉัน</b><small>เหลือ ${Math.max(0, s.course.sessions + (s.course.bonus || 0) - (s.course.used || 0))} ครั้ง</small></span>${I('chevron-right')}</button>` : ''}`;
      }
      return `<div class="scr pp">${ui.bar('นัดของฉัน')}<div class="body">${content}</div>${ui.tabs('patient', 'p.me')}</div>`;
    }
  });
  /* ================================================================ p.appt */
  function rsSheet(s, n) {
    const r = s.patient.rsDraft || {}, day = r.day || DAYS[1];
    return `<div class="row between"><b class="h2">ขอเลื่อนนัดครั้งที่ ${n}</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <span class="label">วันใหม่</span><div class="chips scroll">${DAYS.map(d => `<button class="chip ${d === day ? 'on' : ''}" data-act="rsPick" data-f="day" data-v="${d}" data-n="${n}">${d}</button>`).join('')}</div>
      <span class="label">เวลาเริ่ม</span><div class="pp-slots">${TIMES.filter((t, i) => i % 2 === 0).map(t => `<button aria-pressed="${r.time === t}" data-act="rsPick" data-f="time" data-v="${t}" data-n="${n}">${t}</button>`).join('')}</div>
      <span class="label">เหตุผล</span><div class="chips">${['ติดธุระ', 'ไม่สบาย', 'ญาติไม่อยู่', 'อื่น ๆ'].map(x => `<button class="chip ${r.reason === x ? 'on' : ''}" data-act="rsPick" data-f="reason" data-v="${x}" data-n="${n}">${x}</button>`).join('')}</div>
      <button class="btn ${r.time && r.reason ? '' : 'off'}" ${r.time && r.reason ? '' : 'disabled'} data-act="rsSend" data-n="${n}">${I('send')}ส่งคำขอเลื่อนนัด</button>
      <p class="pp-hint">นัดเดิมยังอยู่จนกว่าทีมจะยืนยันเวลาใหม่</p>`;
  }
  function cancelDlg(s, n) {
    const reason = s.patient.cancelDraft;
    return `<b class="h2">ขอยกเลิกนัดครั้งที่ ${n}?</b>
      <p class="p">แจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมง ทีมจะเลื่อนนัดหรือคืนเงินให้ตามเงื่อนไข ทีมจะโทรยืนยันก่อนยกเลิกจริงทุกครั้ง</p>
      <div class="chips">${['ไม่สะดวกแล้ว', 'อาการดีขึ้น', 'ไปโรงพยาบาล', 'อื่น ๆ'].map(x => `<button class="chip ${reason === x ? 'on' : ''}" data-act="cancelPick" data-v="${x}" data-n="${n}">${x}</button>`).join('')}</div>
      <div class="grid2"><button class="btn ghost" data-close>ไม่ยกเลิก</button><button class="btn danger ${reason ? '' : 'off'}" ${reason ? '' : 'disabled'} data-act="cancelSend" data-n="${n}">ส่งคำขอยกเลิก</button></div>`;
  }
  SC.screen('p.appt', {
    role: 'patient',
    render(s, { param }) {
      const n = +(param.n || 0);
      const v = s.visits.find(x => x.n === n) || nextVisit(s) || s.visits[s.visits.length - 1];
      if (!v) return `<div class="scr pp">${ui.bar('รายละเอียดนัด')}<div class="body">${ui.empty('calendar-days', 'ยังไม่มีนัดนี้', 'นัดจะขึ้นเมื่อนักกายภาพรับงานแล้ว', '<button class="btn auto" data-go="p.appts">ดูนัดของฉัน</button>')}</div></div>`;
      const m = SC.me(), a = s.patient.address, rs = (s.patient.reschedule || []).filter(x => x.n === v.n).pop(), cx = (s.patient.cancelAsked || []).filter(x => x.n === v.n).pop();
      const done = v.step >= 4;
      return `<div class="scr pp">
        ${ui.bar('นัดครั้งที่ ' + v.n)}
        <div class="body">
          <div class="card"><div class="row">${ui.avatar(m.name, s.pt.photo, 60, ptHue)}<div class="grow"><b class="h3">${esc(m.name)}</b>${ver(true)}</div></div></div>
          <div class="card"><dl class="kv"><dt>วัน</dt><dd>${esc(v.date)}</dd><dt>เวลา</dt><dd>${esc(v.time)} น.</dd><dt>ที่</dt><dd>${esc([a.line, a.subdistrict, a.district].filter(Boolean).join(' ') || 'ตามที่อยู่ในคำขอ')}</dd></dl></div>
          ${rs ? `<p class="note" style="margin:0">${I('calendar-clock')} ขอเลื่อนเป็น ${esc(rs.to)} น. (${esc(rs.reason)}) · รอทีมยืนยัน</p>` : ''}
          ${cx ? `<p class="note warn" style="margin:0">ส่งคำขอยกเลิกแล้ว (${esc(cx.reason)}) · ทีมจะโทรยืนยันก่อน นัดยังไม่ถูกยกเลิก</p>` : ''}
          <div class="card"><b class="sec-h">${I('map-pinned')}สถานะวันนัด</b><div class="steps">${VISIT_STEPS.map((t, i) => { const d = i < v.step || done, c = i === v.step && !done; return `<div class="step ${d ? 'done' : c ? 'now' : ''}"><span class="dot">${d ? I('check') : i + 1}</span><div><div class="t">${t}</div>${c && i === 1 ? '<div class="s">ใกล้ถึงแล้ว เตรียมเปิดประตูได้เลย</div>' : ''}</div></div>`; }).join('')}</div></div>
          ${!done ? `<div class="card mint"><b class="sec-h">${I('list-checks')}เตรียมตัวก่อนวันนัด</b><ul class="pp-ul">${['ใส่เสื้อผ้าที่ขยับสะดวก', 'เตรียมพื้นที่ว่างประมาณ 2 × 2 เมตร', 'ยาที่กินประจำ และเอกสารจากโรงพยาบาล ถ้ามี', 'ญาติอยู่ด้วยได้ จะได้ฝึกท่าไปด้วยกัน'].map(t => `<li>${I('check')}${t}</li>`).join('')}</ul></div>` : ''}
          ${v.published ? `<button class="pp-status" data-go="p.report"><span class="tile">${I('file-text')}</span><span class="grow"><b>สรุปจากนักกายภาพ</b><small>เป้าหมาย ท่าฝึก และข้อความถึงครอบครัว</small></span>${I('chevron-right')}</button>` : ''}
          ${!done ? `<div class="grid2"><button class="btn ghost" data-act="rsOpen" data-n="${v.n}">${I('calendar-clock')}ขอเลื่อนนัด</button><button class="btn danger" data-act="cancelOpen" data-n="${v.n}">${I('x')}ยกเลิกนัด</button></div>` : ''}
        </div>
        <div class="foot"><button class="btn ${v.published ? 'ghost' : ''}" data-go="p.chat">${I('message-circle')}ติดต่อทีม</button></div>
      </div>`;
    }
  });
  SC.action('rsOpen', (s, c) => { s.patient.rsDraft = {}; ppSheet(c, rsSheet(s, +c.data.n)); });
  SC.action('rsPick', (s, c) => { s.patient.rsDraft = Object.assign({}, s.patient.rsDraft, { [c.data.f]: c.data.v }); ppSheet(c, rsSheet(s, +c.data.n)); });
  SC.action('rsSend', (s, c) => {
    const r = s.patient.rsDraft || {}, n = +c.data.n, to = `${r.day || DAYS[1]} ${r.time}`;
    s.patient.reschedule = [...(s.patient.reschedule || []), { n, to, reason: r.reason, at: SC.TODAY }];
    s.line.patient.push({ me: true, text: `ขอเลื่อนนัดครั้งที่ ${n} เป็น ${to} น. (${r.reason})` });
    SC.line('patient', { text: 'รับคำขอเลื่อนนัดแล้วค่ะ ทีมจะเช็กเวลากับนักกายภาพ แล้วยืนยันใน LINE นะคะ' });
    s.patient.rsDraft = {}; c.close(); c.toast('ส่งคำขอเลื่อนนัดแล้ว ทีมจะยืนยันใน LINE');
  });
  SC.action('cancelOpen', (s, c) => { s.patient.cancelDraft = ''; ppDialog(c, cancelDlg(s, +c.data.n)); });
  SC.action('cancelPick', (s, c) => { s.patient.cancelDraft = c.data.v; ppDialog(c, cancelDlg(s, +c.data.n)); });
  SC.action('cancelSend', (s, c) => {
    const n = +c.data.n;
    s.patient.cancelAsked = [...(s.patient.cancelAsked || []), { n, reason: s.patient.cancelDraft, at: SC.TODAY }];
    s.line.patient.push({ me: true, text: `ขอยกเลิกนัดครั้งที่ ${n} (${s.patient.cancelDraft})` });
    SC.line('patient', { text: 'รับเรื่องแล้วค่ะ ทีมจะโทรหาเพื่อยืนยันก่อนยกเลิกนัดนะคะ' });
    c.close(); c.toast('ส่งคำขอยกเลิกแล้ว ทีมจะโทรยืนยันก่อน');
  });
  /* ================================================================ p.report */
  SC.screen('p.report', {
    role: 'patient',
    render(s) {
      const v = latestReport(s);
      if (!v) return `<div class="scr pp">${ui.bar('สรุปการดูแล')}<div class="body">${ui.empty('file-text', 'ยังไม่มีสรุปจากนักกายภาพ', 'หลังทำเคสแต่ละครั้ง นักกายภาพจะส่งสรุปและท่าฝึกมาที่นี่ และแจ้งใน LINE', '<button class="btn auto" data-go="p.appts">ดูนัดของฉัน</button>')}</div></div>`;
      const so = v.soap || {}, m = SC.me(), nv = nextVisit(s), rv = s.review, cert = s.cert;
      const nextTxt = nv ? `ครั้งที่ ${nv.n} · ${nv.date} · ${nv.time} น.` : s.course && s.course.next ? `${s.course.next} น. · รอทีมยืนยัน` : '';
      return `<div class="scr pp">
        ${ui.bar('สรุปการดูแล')}
        <div class="body enter">
          <div class="stack" style="gap:4px"><span class="kick">สรุปจากนักกายภาพ · ครั้งที่ ${v.n}</span><h1 class="h1">${esc(thDate(v.date))}</h1></div>
          <div class="row">${ui.avatar(m.name, s.pt.photo, 48, ptHue)}<div class="grow"><b class="h3">${esc(m.name)}</b><span class="small" style="display:block">นักกายภาพบำบัด · ใบประกอบวิชาชีพ ตรวจสอบได้</span></div></div>
          ${so.goal ? `<div class="card"><b class="h3">${I('target')} เป้าหมาย</b><p class="p" style="font-size:16px;color:var(--ink)">${esc(so.goal)}</p></div>` : ''}
          ${(so.t || []).length || so.s || so.o ? `<div class="card"><b class="sec-h">${I('clipboard-list')}วันนี้ทำอะไรไปบ้าง</b>${so.s ? `<p class="p"><b>อาการที่เล่า:</b> ${esc(so.s)}</p>` : ''}${so.o ? `<p class="p"><b>สิ่งที่นักกายภาพพบ:</b> ${esc(so.o)}</p>` : ''}${(so.t || []).length ? `<p class="p"><b>การรักษาวันนี้:</b></p><ul class="pp-ul">${so.t.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>` : ''}
          ${so.family ? `<div class="stack" style="gap:6px"><b class="sec-h">${I('message-square-heart')}ข้อความถึงคุณและครอบครัว</b><div class="pp-bub"><p class="bubble" style="margin:0">${esc(so.family)}</p><small>${esc(m.name)}</small></div></div>` : ''}
          ${so.p ? `<div class="card cream"><b class="h3">${I('dumbbell')} ท่าฝึกที่บ้าน</b><p class="p" style="font-size:16px;color:var(--ink)">${esc(so.p)}</p><span class="small">ทำเท่าที่ไหว ถ้าปวดมากขึ้นให้หยุดและบอกทีม</span></div>` : ''}
          <div class="card flat"><b class="h3">${I('calendar-days')} นัดถัดไป</b><p class="p">${nextTxt ? esc(nextTxt) : 'ยังไม่มีนัดถัดไป นักกายภาพจะคุยแผนการดูแลกับคุณ'}</p>${nv ? `<button class="link" data-go="p.appt" data-p-n="${nv.n}" style="justify-self:start">ดูรายละเอียดนัด</button>` : ''}</div>
          <div class="card ${cert.requested ? 'mint' : 'cream'}">
            ${cert.issued ? `<div class="row">${I('file-check-2')}<div class="grow"><b class="sec-h">${I('award')}ใบรับรองพร้อมแล้ว</b><span class="small">ออกโดย ${esc(m.name)}</span></div></div><button class="btn soft" data-go="p.cert">เปิดใบรับรอง</button>`
              : cert.requested ? `<div class="row">${I('hourglass')}<div class="grow"><b class="sec-h">ขอใบรับรองแล้ว</b><span class="small">${cert.lang === 'EN' ? 'English' : 'ภาษาไทย'} · นักกายภาพทำให้ แล้วส่งเข้า LINE</span></div></div>`
              : `<div class="row">${I('file-badge')}<div class="grow"><b class="sec-h">ใบรับรองกายภาพบำบัด</b><span class="small">ขอได้ตั้งแต่ครั้งแรก ใช้ยื่นประกัน ที่ทำงาน หรือแพทย์</span></div></div><button class="btn soft" data-go="p.certreq">ขอใบรับรอง</button>`}
          </div>
          ${rv ? `<div class="card flat center"><span class="small">คุณให้คะแนนแล้ว</span><span class="stars" style="font-size:26px">${ui.stars(rv.stars)}</span><span class="small">ขอบคุณที่ช่วยบอกเราค่ะ</span></div>` : ''}
        </div>
        ${rv ? '' : `<div class="foot"><button class="btn" data-go="p.review">${I('star')}ให้คะแนน</button></div>`}
      </div>`;
    }
  });
  /* ================================================================ p.review */
  SC.screen('p.review', {
    role: 'patient',
    render(s) {
      const rv = s.review, m = SC.me();
      if (rv) return `<div class="scr pp glow">${ui.bar('ให้คะแนน')}<div class="body enter" style="justify-content:center">
          <div class="stack center" style="justify-items:center"><span class="tile lg gold">${I('heart')}</span><h1 class="h1">ขอบคุณมากค่ะ</h1><p class="p">ความเห็นของคุณช่วยให้ ${esc(m.name)} และทีมดูแลคนอื่นได้ดีขึ้น</p><span class="small">รีวิวได้ 1 ครั้งต่อนักกายภาพ 1 คน · ถ้าได้ดูแลกับนักกายภาพคนอื่นด้วย ให้คะแนนคนนั้นได้อีก</span></div>
          <div class="card center"><span class="stars" style="font-size:30px">${ui.stars(rv.stars)}</span>${(rv.liked || []).length ? `<div style="justify-self:center">${ui.rateTags(rv.liked)}</div>` : ''}${(rv.improve || []).length ? `<p class="small" style="margin:0">อยากให้ดีขึ้น</p><div style="justify-self:center">${ui.rateTags(rv.improve)}</div>` : ''}${rv.text ? `<p class="bubble" style="margin:0;text-align:left">“${esc(rv.text)}”</p>` : ''}
            <span class="pill ${rv.hidden ? 'gray' : rv.approved && rv.consent ? '' : 'wait'}" style="justify-self:center">${!rv.consent ? 'ไม่แสดงบนหน้าเว็บ' : rv.hidden ? 'ทีมไม่แสดงความเห็นนี้' : rv.approved ? 'แสดงบนหน้าเว็บแล้ว (ไม่แสดงชื่อ)' : 'รอทีมตรวจก่อนขึ้นหน้าเว็บ'}</span>
            ${rv.needsContact ? '<span class="small">ทีมจะติดต่อกลับทาง LINE ภายในวันนี้</span>' : ''}</div>
        </div><div class="foot"><button class="btn" data-go="p.feed">กลับหน้าแรก</button></div></div>`;
      const st = s.patient.rvStars || 0;
      const words = ['', 'ต้องปรับปรุง', 'พอใช้', 'ดี', 'ดีมาก', 'ประทับใจมาก'];
      return `<div class="scr pp white">
        ${ui.bar('ให้คะแนน')}
        <div class="body">
          <div class="stack center" style="justify-items:center">${ui.avatar(m.name, s.pt.photo, 72, ptHue)}<h1 class="h2">การดูแลจาก ${esc(m.name)} เป็นอย่างไรบ้าง</h1><span class="small">ให้คะแนนนักกายภาพแต่ละคนได้คนละ 1 ครั้ง</span></div>
          <div class="pp-starin" role="group" aria-label="ให้ดาว">${[1, 2, 3, 4, 5].map(i => `<button class="${i <= st ? 'on' : ''}" data-pick="patient.rvStars" data-value="${i}" aria-label="${i} ดาว" aria-pressed="${i === st}">★</button>`).join('')}</div>
          <p class="center h3" style="margin:0;min-height:22px">${words[st] || 'แตะดาวเพื่อให้คะแนน'}</p>
          ${st ? rateGrid(s, st) : ''}
          <label class="field"><span>เล่าสั้น ๆ (ไม่บังคับ)</span><textarea class="in" data-bind="patient.rvText" placeholder="เช่น คุณแม่ลุกจากเก้าอี้เองได้แล้ว">${esc(s.patient.rvText || '')}</textarea></label>
          <label class="check"><input type="checkbox" data-bind="patient.rvContact" ${s.patient.rvContact ? 'checked' : ''}><span>ต้องการให้ทีมติดต่อกลับ</span></label>
          <label class="check"><input type="checkbox" data-bind="patient.rvConsent" ${s.patient.rvConsent ? 'checked' : ''}><span>ยินยอมให้แสดงความเห็นนี้บนหน้าเว็บ (ไม่แสดงชื่อ)</span></label>
        </div>
        <div class="foot"><button class="btn" data-act="submitReview" data-need="patient.rvStars">${I('send')}ส่งคะแนน</button></div>
      </div>`;
    }
  });
  // Grab-style: stars first, then the 7 criteria as "liked most" (4–5 stars) or "should improve" (1–3). Stars stay the final score.
  const rvGroup = st => st >= 4 ? 'rvGood' : 'rvFix';
  const rtPrev = {}; let rtShown = '';
  // Thai phrase breaks so tile labels wrap between words, not inside them.
  const RT_BREAK = { pro: ['ความเป็น', 'มืออาชีพ'], explain: ['อธิบาย', 'เข้าใจง่าย'], care: ['บริการด้วย', 'ความใส่ใจ'], home: ['ประยุกต์ใช้', 'กับที่บ้านได้ดี'], result: ['เห็นผล', 'การรักษา', 'ชัดเจน'], advice: ['แนะนำ', 'การดูแล', 'อย่างรอบด้าน'] };
  function rateGrid(s, st) {
    // Motion only on what just changed: tiles stagger in when the group first shows, a tapped tile pops (jelly, ring, sparks), an untapped one settles back.
    const g = rvGroup(st), on = s.patient[g] || [], prev = rtPrev[g] || [], fresh = on.filter(k => !prev.includes(k)), gone = prev.filter(k => !on.includes(k)), enter = rtShown !== g;
    rtPrev[g] = on.slice(); rtShown = g;
    return `<section class="pp-rate ${g === 'rvFix' ? 'fix' : ''}" aria-label="หัวข้อรีวิว"><h2 class="h3">${g === 'rvGood' ? 'ประทับใจเรื่องไหนบ้าง' : 'เรื่องไหนที่อยากให้ดีขึ้น'}</h2><p class="small">เลือกได้หลายข้อ ไม่บังคับ</p>
      <div class="pp-rgrid">${SC.RATE.map(([k, name, n], i) => { const sel = on.includes(k), pop = fresh.includes(k), drop = gone.includes(k), anim = enter || pop || drop;
        return `<button class="pp-rt ${sel ? 'on' : ''} ${pop ? 'pop' : ''} ${drop ? 'drop' : ''} ${enter ? 'in' : ''}" style="--i:${i}" ${anim ? 'data-keep-anim' : ''} aria-pressed="${sel}" data-toggle="patient.${g}" data-value="${k}"><span class="ic"><img src="a/rate-${n}.png" alt="">${pop ? `<span class="sp" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(j => `<em style="--a:${j * 60 + 30}deg"></em>`).join('')}</span>` : ''}${sel ? `<i>${I(g === 'rvGood' ? 'check' : 'wrench')}</i>` : ''}</span><span>${(RT_BREAK[k] || [name]).map(w => `<b>${w}</b>`).join('')}</span></button>`; }).join('')}</div></section>`;
  }
  SC.action('submitReview', (s, c) => {
    const p = s.patient; if (!p.rvStars) return;
    const g = rvGroup(p.rvStars);
    s.review = { stars: p.rvStars, liked: g === 'rvGood' ? (p.rvGood || []).slice() : [], improve: g === 'rvFix' ? (p.rvFix || []).slice() : [], text: (p.rvText || '').trim(), consent: !!p.rvConsent, needsContact: !!p.rvContact, approved: false, hidden: false };
    if (p.rvContact) SC.line('patient', { text: 'ได้รับคะแนนและคำขอให้ติดต่อกลับแล้วค่ะ ทีมจะทักไปเร็ว ๆ นี้นะคะ' });
    c.toast('ส่งคะแนนแล้ว ขอบคุณค่ะ'); top();
  });
  /* ================================================================ p.course */
  SC.screen('p.course', {
    role: 'patient',
    render(s) {
      const co = s.course;
      if (!co) return `<div class="scr pp">${ui.bar('คอร์สของฉัน')}<div class="body">${ui.empty('ticket', 'ยังไม่มีคอร์ส', 'นักกายภาพจะคุยแผนการดูแลกับคุณหลังทำเคสครั้งแรก', '<button class="btn auto ghost" data-go="p.chat">ถามทีมเรื่องคอร์ส</button>')}</div></div>`;
      const total = co.sessions + (co.bonus || 0), used = co.used || 0, left = Math.max(0, total - used), st = courseState(s), nv = s.visits.find(v => v.n >= 2 && v.step < 4);
      return `<div class="scr pp">
        ${ui.bar('คอร์สของฉัน')}
        <div class="body enter">
          <div class="card hero"><span class="small" style="color:#d6e8de">คอร์สกายภาพบำบัดที่บ้าน</span><div class="row" style="align-items:baseline"><b style="font-size:44px;line-height:1">${left}</b><span style="font-size:17px">ครั้งที่เหลือ</span></div>
            <p class="p">ใช้ไป ${used} จาก ${total} ครั้ง${co.bonus ? ` (รวมโบนัส ${co.bonus} ครั้ง)` : ''}</p></div>
          <div class="progress" aria-hidden="true"><i style="width:${total ? used / total * 100 : 0}%"></i></div>
          <div class="card"><div class="row between"><b class="sec-h">${I('wallet')}สถานะการชำระ</b><span class="pill ${PAY_PILL[st][1]}">${PAY_PILL[st][0]}</span></div>
            <p class="p">${st === 'paid' ? 'ทีมรับเงินแล้ว เปิดสิทธิ์ครบทุกครั้ง' : st === 'checking' ? 'ได้รับสลิปแล้ว ทีมกำลังตรวจยอด ปกติไม่เกิน 30 นาที' : 'สแกนจ่ายกับนักกายภาพหน้างานได้'}</p></div>
          <div class="card"><b class="h3">${I('calendar-days')} นัดถัดไป</b>${nv ? `<p class="p">ครั้งที่ ${nv.n} · ${esc(nv.date)} · ${esc(nv.time)} น.</p><button class="link" data-go="p.appt" data-p-n="${nv.n}" style="justify-self:start">ดูรายละเอียดนัด</button>` : co.next ? `<p class="p">${esc(co.next)} น.${(co.backups || []).length ? ` · สำรอง ${co.backups.map(esc).join(', ')}` : ''}</p><span class="small">รอทีมยืนยันหลังตรวจเงิน</span>` : '<p class="p">ยังไม่ได้จอง นักกายภาพจะจองให้หน้างาน</p>'}</div>
          <div class="card"><b class="h3">${I('receipt')} ใบเสร็จ</b><dl class="kv"><dt>คอร์สกายภาพบำบัด</dt><dd>${co.sessions} ครั้ง</dd>${co.bonus ? `<dt>โบนัส</dt><dd>+${co.bonus} ครั้ง</dd>` : ''}${co.code ? `<dt>โค้ด</dt><dd>${esc(co.code)}</dd>` : ''}</dl>
            <div class="sep"></div><div class="row between"><b>ยอดรวม</b><span class="price" style="font-size:22px">${money(co.total)}</span></div>
            ${st === 'paid' ? `<button class="btn ghost" data-act="showReceipt" data-k="course">${I('receipt')}ดูใบเสร็จ</button>` : '<span class="small">ใบเสร็จออกหลังทีมตรวจเงินแล้ว</span>'}</div>
        </div>
      </div>`;
    }
  });
  function receiptHtml(s, k) {
    const co = s.course, trial = k === 'trial';
    const amt = trial ? SC.TRIAL : co.total, item = trial ? 'ClairConnect Trial · ประเมินและรักษาครั้งแรก' : `คอร์สกายภาพบำบัด ${co.sessions} ครั้ง${co.bonus ? ` + โบนัส ${co.bonus} ครั้ง` : ''}`;
    return `<div class="row between"><b class="h2">ใบเสร็จรับเงิน</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <div class="card flat"><dl class="kv"><dt>เลขที่</dt><dd>${esc((s.request && s.request.ref) || 'HPT')}-${trial ? 1 : 2}</dd><dt>ผู้รับบริการ</dt><dd>${esc(s.patient.name || '—')}</dd><dt>รายการ</dt><dd>${esc(item)}</dd><dt>ชำระโดย</dt><dd>โอนผ่านพร้อมเพย์</dd></dl>
      <div class="sep"></div><div class="row between"><b>รวม</b><span class="price" style="font-size:22px">${money(amt)}</span></div></div>
      <button class="btn" data-act="saveReceipt">${I('download')}บันทึก PDF</button>`;
  }
  SC.action('showReceipt', (s, c) => ppSheet(c, receiptHtml(s, c.data.k)));
  SC.action('saveReceipt', (s, c) => { c.close(); c.toast('ห้องซ้อม: บันทึกใบเสร็จเป็น PDF แล้ว ระบบจริงส่งเข้า LINE ด้วย'); });
  /* ================================================================ p.chat */
  function reply(text) {
    if (/ใบรับรอง/.test(text)) return 'ได้ค่ะ ใบรับรองออกได้หลังจบนัด ทีมจะแจ้งนักกายภาพให้ และส่งไฟล์เข้า LINE นี้ค่ะ';
    if (/ปัญหา/.test(text)) return 'ขอโทษค่ะ เล่าให้ทีมฟังได้เลยว่าเกิดอะไรขึ้น ทีมจะโทรกลับภายใน 15 นาทีในเวลาทำการค่ะ';
    if (/เลื่อน|เวลา|นัด/.test(text)) return 'ได้เลยค่ะ เปิดแท็บ "นัดของฉัน" แล้วกด "ขอเลื่อนนัด" หรือพิมพ์วันเวลาที่สะดวกไว้ที่นี่ ทีมจะเช็กกับนักกายภาพแล้วยืนยันใน LINE ค่ะ';
    if (/ค่า|ราคา|บริการ|จ่าย/.test(text)) return 'ครั้งแรกเป็น ClairConnect Trial ฿1,599 รวมประเมินและรักษาไม่เกิน 1 ชั่วโมงครึ่งค่ะ หลังจากนั้นนักกายภาพจะเสนอคอร์สตามแผนการดูแล ตัดสินใจหน้างานได้เลย';
    if (/ใบเสร็จ/.test(text)) return 'ใบเสร็จอยู่ที่เมนู "ฉัน" > การชำระเงินและใบเสร็จ ค่ะ ทีมส่งเข้า LINE ให้ทุกครั้งหลังตรวจเงิน';
    return 'รับทราบค่ะ ทีมจะตอบเรื่องนี้ภายใน 15 นาทีในเวลาทำการ 08:00–20:00 นะคะ';
  }
  /* p.chat is the "ช่วยเหลือ" tab (Boss 21 Oct): no second chat inside the app, since patients already talk to the team in LINE.
     It opens that LINE chat, sends common requests into it with one tap, and links the self-service pages. */
  const HELP_ASK = [['calendar-clock', 'ขอเลื่อนนัด', 'อยากขอเลื่อนนัดค่ะ'], ['circle-dollar-sign', 'ถามค่าบริการ', 'สอบถามค่าบริการค่ะ'], ['message-circle-warning', 'แจ้งปัญหาเรื่องนัด', 'มีปัญหาเรื่องนัดค่ะ'], ['file-text', 'ขอใบรับรอง', 'อยากขอใบรับรองกายภาพค่ะ']];
  SC.screen('p.chat', {
    role: 'patient',
    render() {
      return `<div class="scr pp">${ui.bar('ช่วยเหลือ', { back: false })}
        <div class="body enter">
          <section class="pp-linecard"><span class="lg">${I('message-circle')}</span><span class="grow"><b>คุยกับทีมใน LINE</b><small>แชตเดียวกับที่ได้การ์ดนัดและสรุปการดูแล · ทีมตอบ 08:00–20:00</small></span>
            <button class="btn pp-linebtn" data-open-line>เปิดแชต LINE</button></section>
          <h2 class="sec-h">${I('send')}ส่งเรื่องเข้า LINE ในแตะเดียว</h2>
          <div class="pp-help">${HELP_ASK.map(([ic, t], i) => `<button data-act="helpAsk" data-i="${i}"><span class="tile">${I(ic)}</span>${t}</button>`).join('')}</div>
          <h2 class="sec-h">${I('book-open')}ดูเองได้เลย</h2>
          <div class="list">
            <button class="li" data-go="p.appts"><span class="tile">${I('calendar-days')}</span><span class="grow t">นัดของฉัน · เลื่อนหรือยกเลิก</span>${I('chevron-right', 'chev')}</button>
            <button class="li" data-act="mePayments"><span class="tile">${I('receipt')}</span><span class="grow t">การชำระเงินและใบเสร็จ</span>${I('chevron-right', 'chev')}</button>
            <button class="li" data-go="p.certreq"><span class="tile">${I('file-badge')}</span><span class="grow t">ใบรับรองกายภาพบำบัด</span>${I('chevron-right', 'chev')}</button>
            <button class="li" data-act="meHelp"><span class="tile">${I('circle-help')}</span><span class="grow t">คำถามที่พบบ่อย</span>${I('chevron-right', 'chev')}</button>
          </div>
          <p class="note warn row" style="margin:0">${I('phone')}<span>อาการฉุกเฉิน เช่น หายใจลำบาก เจ็บหน้าอก ล้ม หมดสติ โทร <b>1669</b> ทันที</span></p>
        </div>
        ${ui.tabs('patient', 'p.chat')}
      </div>`;
    }
  });
  SC.action('helpAsk', (s, c) => {
    const ask = HELP_ASK[+c.data.i]; if (!ask) return;
    s.line.patient.push({ me: true, text: ask[2] });
    document.body.classList.add('line-open'); s.unread.patient = 0;
    setTimeout(() => { SC.line('patient', { text: reply(ask[2]) }); SC.render(true); }, 1200);
    c.toast('ส่งเข้าแชต LINE แล้ว');
  });
  /* ================================================================ p.me */
  function notifSheet(s) {
    const n = s.patient.notify || {};
    const rows = [['appt', 'นัดหมายและนักกายภาพกำลังเดินทาง'], ['report', 'สรุปการดูแลและใบรับรอง'], ['pay', 'การชำระเงินและใบเสร็จ'], ['tips', 'ความรู้ดูแลที่บ้านรายสัปดาห์']];
    return `<div class="row between"><b class="h2">การแจ้งเตือนใน LINE</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <div class="list">${rows.map(([k, l]) => `<div class="li"><span class="grow t" style="font-weight:500">${l}</span><button class="pp-sw" role="switch" aria-checked="${n[k] !== false}" aria-label="${l}" data-act="notifToggle" data-k="${k}"></button></div>`).join('')}</div>
      <p class="pp-hint">ข้อความเรื่องนัดสำคัญจะส่งเสมอเพื่อความปลอดภัย</p>`;
  }
  function privacySheet(s) {
    const rv = s.review;
    return `<div class="row between"><b class="h2">ความเป็นส่วนตัวและความยินยอม</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <div class="list"><div class="li"><span class="tile">${I('shield-check')}</span><span class="grow"><span class="t" style="display:block">ใช้ข้อมูลเพื่อจัดบริการ</span><span class="s">${s.patient.consent ? 'ยินยอมแล้วตอนประเมินอาการ' : 'ยังไม่ได้ให้ความยินยอม'}</span></span></div>
        ${rv ? `<div class="li"><span class="tile">${I('message-circle')}</span><span class="grow"><span class="t" style="display:block">แสดงความเห็นบนหน้าเว็บ</span><span class="s">ไม่แสดงชื่อ · ${rv.consent ? 'ยินยอม' : 'ไม่ยินยอม'}</span></span><button class="pp-sw" role="switch" aria-checked="${!!rv.consent}" aria-label="แสดงความเห็นบนหน้าเว็บ" data-act="toggleReviewConsent"></button></div>` : ''}</div>
      <button class="btn ghost" data-act="privacyFull">อ่านนโยบายฉบับเต็ม</button>
      <button class="btn danger" data-act="askDelete">ขอลบข้อมูลของฉัน</button>`;
  }
  function paySheet(s) {
    const t = trialState(s), c = courseState(s);
    const row = (title, sub, st, k, go) => `<div class="li"><span class="grow"><span class="t" style="display:block">${title}</span><span class="s">${sub}</span></span><span class="pill ${PAY_PILL[st][1]}">${PAY_PILL[st][0]}</span>${st === 'paid' ? `<button class="btn sm ghost" data-act="showReceipt" data-k="${k}">ใบเสร็จ</button>` : st === 'due' && go ? `<button class="btn sm" data-go="${go}">ชำระ</button>` : ''}</div>`;
    return `<div class="row between"><b class="h2">การชำระเงินและใบเสร็จ</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      ${t || c ? `<div class="list">${t ? row('ClairConnect Trial', money(SC.TRIAL) + ' · ' + esc(s.request.ref), t, 'trial', 'p.pay') : ''}${c ? row(`คอร์ส ${s.course.sessions} ครั้ง`, money(s.course.total), c, 'course', null) : ''}</div>` : ui.empty('receipt', 'ยังไม่มีรายการ', 'รายการจ่ายและใบเสร็จจะขึ้นที่นี่')}`;
  }
  function peopleSheet(s) {
    const p = s.patient, list = [...(p.bookingFor === 'SOMEONE_ELSE' && p.name ? [p.name] : []), ...(p.people || [])];
    return `<div class="row between"><b class="h2">คนที่ฉันดูแล</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      ${list.length ? `<div class="list">${list.map(n => `<div class="li">${ui.avatar(n, null, 44, 32)}<span class="grow t">${esc(n)}</span></div>`).join('')}</div>` : `<p class="p">${p.bookingFor === 'SELF' && p.name ? 'ตอนนี้คุณจองให้ตัวเอง' : 'ยังไม่มีรายชื่อ'}</p>`}
      <label class="field"><span>เพิ่มชื่อคนที่ดูแล</span><input class="in" data-bind="patient.newPerson" placeholder="เช่น คุณพ่อสมชาย"></label>
      <button class="btn soft" data-act="addPerson">${I('user-plus')}เพิ่ม</button>`;
  }
  SC.screen('p.me', {
    role: 'patient',
    render(s) {
      const p = s.patient, a = p.address;
      const row = (ic, t, sub, attrs) => `<button class="li" ${attrs}><span class="tile">${I(ic)}</span><span class="grow"><span class="t" style="display:block">${t}</span><span class="s">${sub}</span></span>${I('chevron-right', 'chev')}</button>`;
      const certSub = s.cert.issued ? 'พร้อมแล้ว แตะเพื่อเปิด' : s.cert.requested ? 'ขอแล้ว รอนักกายภาพทำให้' : 'ขอได้ตั้งแต่ครั้งแรก';
      return `<div class="scr pp">
        ${ui.bar('ฉัน', { back: false })}
        <div class="body">
          <div class="card"><div class="row"><span class="tile lg">${I('user-round')}</span><div class="grow"><b class="h3">${esc(p.name || 'ยังไม่ได้ใส่ชื่อ')}</b><span class="small" style="display:block">${esc(p.phone || 'ยังไม่ได้ใส่เบอร์')}</span></div><button class="btn sm ghost" data-act="editProfile">${I('pencil')}แก้</button></div></div>
          <div class="list">
            ${row('calendar-days', 'นัดของฉัน', (n => n ? `นัดที่จะถึง ${n} นัด` : s.visits.length ? 'ดูนัดที่ผ่านมา' : 'ยังไม่มีนัด')(s.visits.filter(v => v.step < 4).length), 'data-go="p.appts"')}
          </div>
          <div class="list">
            ${row('users', 'คนที่ฉันดูแล', p.bookingFor === 'SOMEONE_ELSE' && p.name ? esc(p.name) : 'เพิ่มคนในครอบครัวได้', 'data-act="mePeople"')}
            ${row('map-pin', 'ที่อยู่', a.district ? esc([a.subdistrict, a.district].filter(Boolean).join(' ')) : 'ยังไม่มีที่อยู่', 'data-act="meAddress"')}
          </div>
          <div class="list">
            ${row('receipt', 'การชำระเงินและใบเสร็จ', s.request ? 'ClairConnect Trial' + (s.course ? ' · คอร์ส' : '') : 'ยังไม่มีรายการ', 'data-act="mePayments"')}
            ${row('ticket', 'คอร์สของฉัน', s.course ? `เหลือ ${Math.max(0, s.course.sessions + (s.course.bonus || 0) - (s.course.used || 0))} ครั้ง` : 'ยังไม่มีคอร์ส', 'data-go="p.course"')}
            ${row('file-check-2', 'ใบรับรองกายภาพบำบัด', certSub, s.cert.issued ? 'data-go="p.cert"' : 'data-go="p.certreq"')}
            ${row('star', 'รีวิวของฉัน', s.review ? `ให้คะแนน ${esc(SC.me().name)} แล้ว ${'★'.repeat(s.review.stars)}` : s.visits.some(v => v.step >= 4) ? `ยังไม่ได้ให้คะแนน ${esc(SC.me().name)}` : 'ให้คะแนนได้หลังทำเคส', 'data-go="p.review"')}
          </div>
          <div class="list">
            ${row('bell', 'การแจ้งเตือน', 'เลือกเรื่องที่อยากให้แจ้งใน LINE', 'data-act="meNotify"')}
            ${row('shield-check', 'ความเป็นส่วนตัวและความยินยอม', 'ดูและเปลี่ยนความยินยอม', 'data-act="mePrivacy"')}
            ${row('circle-help', 'ช่วยเหลือ', 'คำถามที่พบบ่อย และติดต่อทีม', 'data-act="meHelp"')}
          </div>
          <button class="btn ghost" data-act="meLogout">${I('log-out')}ออกจากระบบ</button>
        </div>
        ${ui.tabs('patient', 'p.me')}
      </div>`;
    }
  });
  SC.action('editProfile', (s, c) => ppSheet(c, `<div class="row between"><b class="h2">ข้อมูลของฉัน</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
    <label class="field"><span>ชื่อ</span><input class="in" data-bind="patient.name" value="${esc(s.patient.name)}" placeholder="ชื่อที่อยากให้ทีมเรียก"></label>
    <label class="field"><span>เบอร์โทร</span><input class="in" data-bind="patient.phone" value="${esc(s.patient.phone)}" inputmode="tel" maxlength="10" placeholder="08x xxx xxxx"></label>
    <button class="btn" data-act="saveProfile">บันทึก</button>`));
  SC.action('saveProfile', (s, c) => { c.close(); c.toast('บันทึกข้อมูลแล้ว'); });
  SC.action('mePeople', (s, c) => ppSheet(c, peopleSheet(s)));
  SC.action('addPerson', (s, c) => {
    const n = String(s.patient.newPerson || '').trim(); if (!n) { c.toast('พิมพ์ชื่อก่อนนะคะ'); return; }
    s.patient.people = [...(s.patient.people || []), n]; s.patient.newPerson = ''; ppSheet(c, peopleSheet(s)); c.toast(`เพิ่ม ${n} แล้ว`);
  });
  SC.action('meAddress', (s, c) => { const a = s.patient.address; ppSheet(c, `<div class="row between"><b class="h2">ที่อยู่</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
    ${a.district ? `<div class="card flat"><b class="h3">${esc(a.line || '—')}</b><p class="p">${esc([a.subdistrict, a.district, a.province, a.postal].filter(Boolean).join(' '))}</p><span class="pill ${a.pin ? '' : 'wait'}" style="justify-self:start">${a.pin ? 'ยืนยันหมุดแล้ว' : 'ยังไม่ยืนยันหมุด'}</span></div>` : '<p class="p">ยังไม่มีที่อยู่ กรอกได้ตอนประเมินอาการ</p>'}
    <button class="btn" data-act="intakeGoto" data-step="5">${I('pencil')}แก้ที่อยู่</button>`); });
  SC.action('mePayments', (s, c) => ppSheet(c, paySheet(s)));
  SC.action('meCert', (s, c) => ppSheet(c, `<div class="row between"><b class="h2">ใบรับรองกายภาพบำบัด</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
    <p class="p">${s.cert.requested ? `คุณขอใบรับรอง${s.cert.lang === 'EN' ? 'ภาษาอังกฤษ' : 'ภาษาไทย'}แล้ว นักกายภาพจะออกให้ แล้วส่งเข้า LINE` : 'ขอใบรับรองได้ในหน้าสรุปการดูแล หลังทำเคสครั้งแรก ใช้ยื่นประกัน ที่ทำงาน หรือแพทย์'}</p>
    <button class="btn" data-go="p.report">ไปหน้าสรุปการดูแล</button>`));
  SC.action('meNotify', (s, c) => { if (!s.patient.notify) s.patient.notify = { appt: true, report: true, pay: true, tips: false }; ppSheet(c, notifSheet(s)); });
  SC.action('notifToggle', (s, c) => { const n = s.patient.notify = Object.assign({ appt: true, report: true, pay: true, tips: false }, s.patient.notify); n[c.data.k] = n[c.data.k] === false; ppSheet(c, notifSheet(s)); });
  SC.action('mePrivacy', (s, c) => ppSheet(c, privacySheet(s)));
  SC.action('toggleReviewConsent', (s, c) => { s.review.consent = !s.review.consent; ppSheet(c, privacySheet(s)); c.toast(s.review.consent ? 'ยินยอมให้แสดงความเห็นแล้ว' : 'ถอนความยินยอมแล้ว ความเห็นจะไม่แสดงบนหน้าเว็บ'); });
  SC.action('askDelete', (s, c) => { s.line.patient.push({ me: true, text: 'ขอลบข้อมูลของฉัน' }); SC.line('patient', { text: 'รับคำขอลบข้อมูลแล้วค่ะ ทีมจะโทรยืนยันตัวตนก่อนดำเนินการนะคะ' }); c.close(); c.toast('ส่งคำขอลบข้อมูลแล้ว ทีมจะติดต่อกลับใน LINE'); });
  SC.action('meHelp', (s, c) => ppSheet(c, `<div class="row between"><b class="h2">ช่วยเหลือ</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
    ${[['เลือกนักกายภาพเองได้ไหม', 'ได้ค่ะ กด "ขอคนนี้" แล้วทำแบบประเมินตามปกติ ครั้งแรกจ่ายราคา ฿1,599 ทีมส่งงานให้คนนั้นก่อน ถ้าเวลาและพื้นที่ตรงกัน'], ['ครั้งแรกจ่ายเท่าไหร่', 'ClairConnect Trial ฿1,599 รวมประเมินและรักษาครั้งแรก'], ['ทักนักกายภาพตรงได้ไหม', 'ทุกเรื่องผ่านทีม เพื่อดูแลความปลอดภัยและนัดให้ตรงเวลา กดแท็บ "คุยกับทีม" ได้เลย']].map(([q, a]) => `<div class="card flat"><b class="h3">${q}</b><p class="p">${a}</p></div>`).join('')}
    <button class="btn" data-open-line>${I('message-circle')}คุยกับทีมใน LINE</button>`));
  SC.action('meLogout', (s, c) => ppDialog(c, `<b class="h2">ออกจากระบบ?</b><p class="p">ข้อมูลและนัดของคุณยังอยู่ เปิดจาก LINE เมื่อไหร่ก็กลับมาได้</p>
    <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn danger" data-act="logout">ออกจากระบบ</button></div>`));
  SC.action('logout', (s, c) => { c.close(); c.toast('ออกจากระบบแล้ว (ห้องซ้อม: ข้อมูลยังอยู่)'); return 'p.loading'; });
  /* ================================================================ p.certreq */
  /* Certificate request (Boss 29 Oct): from visit 1 on, from My Care in LINE or the ฉัน page. The PT gets a separate task. */
  const PURPOSES = ['ยื่นที่ทำงาน', 'ยื่นประกัน', 'ยื่นแพทย์', 'เก็บไว้เอง'];
  SC.screen('p.certreq', {
    role: 'patient',
    render(s) {
      const c = s.cert, m = SC.me();
      if (c.issued) return `<div class="scr pp">${ui.bar('ใบรับรองกายภาพบำบัด')}<div class="body">${ui.empty('file-check-2', 'ใบรับรองพร้อมแล้ว', `ออกโดย ${m.name}`, '<button class="btn auto" data-go="p.cert">เปิดใบรับรอง</button>')}</div></div>`;
      if (!s.visits.length) return `<div class="scr pp">${ui.bar('ใบรับรองกายภาพบำบัด')}<div class="body">${ui.empty('file-badge', 'ขอได้หลังมีนัดกับนักกายภาพ', 'ใบรับรองออกจากการตรวจและรักษาจริง ขอได้ตั้งแต่ครั้งแรก')}</div></div>`;
      if (c.requested) return `<div class="scr pp">${ui.bar('ใบรับรองกายภาพบำบัด')}<div class="body">${ui.empty('hourglass', 'ขอแล้ว', `${m.name} จะทำใบรับรอง${c.lang === 'EN' ? 'ภาษาอังกฤษ' : 'ภาษาไทย'}ให้ แล้วส่งเข้า LINE`, '<button class="btn auto ghost" data-go="p.me">กลับ</button>')}</div></div>`;
      return `<div class="scr pp">${ui.bar('ขอใบรับรองกายภาพบำบัด')}<div class="body">
        <p class="p">ใบรับรองจาก ${esc(m.name)} บอกผลตรวจ การวินิจฉัย และการรักษาที่ได้รับ ขอได้ตั้งแต่ครั้งแรก</p>
        <div class="field"><span>ภาษา</span><div class="seg" role="group" aria-label="ภาษาใบรับรอง">${[['TH', 'ภาษาไทย'], ['EN', 'English']].map(([k, l]) => `<button class="${c.lang === k ? 'on' : ''}" data-pick="cert.lang" data-value="${k}">${l}</button>`).join('')}</div></div>
        <div class="field"><span>ใช้ทำอะไร (ไม่บังคับ)</span><div class="chips">${PURPOSES.map(t => `<button class="chip ${c.purpose === t ? 'on' : ''}" data-pick="cert.purpose" data-value="${c.purpose === t ? '' : t}">${t}</button>`).join('')}</div></div>
        <p class="note mint row">${I('info')}<span>ครอบคลุมการรักษาตั้งแต่ครั้งแรกถึงครั้งล่าสุดที่ทำเสร็จ · ไม่มีค่าใช้จ่าย</span></p>
      </div><div class="foot"><button class="btn" data-act="certRequest">${I('send')}ขอใบรับรอง</button></div></div>`;
    }
  });
  SC.action('certRequest', (s, c) => { if (!s.visits.length || s.cert.requested) return; s.cert.requested = true; c.line('pt', { key: 'certRequest' }); c.toast('ส่งคำขอให้นักกายภาพแล้ว ใบรับรองจะส่งเข้า LINE'); });
  /* ================================================================ p.renew */
  const PROG_T = { met: ['ถึงเป้าหมายแล้ว', ''], part: ['ดีขึ้น แต่ยังไม่ถึงเป้าหมาย', 'wait'], none: ['ยังไม่ดีขึ้นเท่าที่ควร', 'warn'] };
  SC.renewDecide = (s, line) => {
    const r = s.renewal, c = s.course; if (!r) return;
    r.decided = r.choice;
    if (r.choice === 'renew') {
      const x = SC.renewPack(s, r.pack) || { total: 0, netPer: 0 };
      s.pastCourses.push(Object.assign({}, c));
      // Paid by QR; the system reads the slip like the Trial, opens the new course and books the first visit the PT proposed.
      s.course = { sessions: +r.pack, bonus: 0, total: x.total, perSession: Math.round(x.total / +r.pack), code: '', paid: true, slip: 'sample', approved: true, used: 0, next: r.next, backups: [], notified: true, renewal: true };
      const n = Math.max(...s.visits.map(v => v.n)) + 1;
      s.visits.push({ n, date: 'อังคาร 8 ธ.ค. 2569', time: '09:00–10:00', step: 0, soap: {}, published: false });
      line('patient', { key: 'courseReceipt' }); line('pt', { key: 'teamReply', text: `${s.patient.name || 'ผู้รับบริการ'} ต่อคอร์ส ${r.pack} ครั้งแล้ว · ระบบตรวจสลิปผ่าน · นัดครั้งแรก ${r.next}` });
    } else {
      line('patient', { key: 'teamReply', text: r.choice === 'pervisit' ? 'รับทราบค่ะ อยากนัดเมื่อไหร่ กด "นัดครั้งต่อไป" ในเมนู หรือพิมพ์บอกทีมได้เลย ทีมจะทักถามอาการใน 30 วันนะคะ' : 'ยินดีด้วยค่ะ ทำท่าฝึกที่บ้านต่อเนื่องนะคะ ทีมจะทักถามอาการใน 30 วัน ถ้ามีอาการกลับมา ทักทีมได้ตลอด' });
      line('pt', { key: 'teamReply', text: `${s.patient.name || 'ผู้รับบริการ'} ${r.choice === 'pervisit' ? 'ขอนัดเป็นครั้งเมื่อจำเป็น' : 'จบการรักษา'} · ขอบคุณที่ดูแลค่ะ` });
    }
  };
  SC.screen('p.renew', {
    role: 'patient',
    render(s) {
      const r = s.renewal, m = SC.me(), c = s.course;
      if (!r || !r.sent) return `<div class="scr pp">${ui.bar('สรุปจบคอร์ส')}<div class="body">${ui.empty('flag', 'ยังไม่มีสรุปจบคอร์ส', 'เมื่อใช้คอร์สครบ นักกายภาพจะส่งสรุปผลเทียบเป้าหมายมาให้ที่นี่')}</div></div>`;
      if (r.decided) return `<div class="scr pp">${ui.bar('สรุปจบคอร์ส')}<div class="body">${r.decided === 'renew'
        ? ui.empty('repeat', 'ต่อคอร์สแล้ว', `คอร์สใหม่ ${c.sessions} ครั้ง เปิดใช้แล้ว ใบเสร็จส่งเข้า LINE · นัดครั้งแรก ${r.next}`, '<button class="btn auto" data-go="p.course">ดูคอร์สของฉัน</button>')
        : ui.empty('flag', r.decided === 'pervisit' ? 'นัดเป็นครั้งเมื่อจำเป็น' : 'จบการรักษา', 'ทีมจะทักถามอาการใน 30 วัน · ขอใบรับรองหรือให้คะแนนนักกายภาพได้ที่หน้า ฉัน', '<button class="btn auto ghost" data-go="p.me">ไปหน้า ฉัน</button>')}</div></div>`;
      const goal = (s.coursePlan && s.coursePlan.goal) || '—', pg = PROG_T[r.progress] || ['—', 'gray'], total = (c.sessions + (c.bonus || 0));
      const choice = r.choice || r.rec, x = SC.renewPack(s, r.pack);
      const opt = (k, t, d) => `<button class="pp-ropt ${choice === k ? 'on' : ''}" data-pick="renewal.choice" data-value="${k}" aria-pressed="${choice === k}"><span class="grow"><b>${t}${r.rec === k ? ' <span class="pill">นักกายภาพแนะนำ</span>' : ''}</b><small>${d}</small></span><i>${choice === k ? I('check') : ''}</i></button>`;
      return `<div class="scr pp">${ui.bar('สรุปจบคอร์ส')}<div class="body enter">
        <div class="card hero"><span class="small" style="color:#d6e8de">ครบคอร์ส ${total} ครั้งแล้ว</span><b class="h2">${esc(m.name)} สรุปผลให้คุณ</b></div>
        <div class="card"><b class="sec-h">${I('target')}เป้าหมาย</b><p class="p" style="color:var(--ink)">${esc(goal)}</p>
          <span class="pill ${pg[1]}" style="justify-self:start">${pg[0]}</span>${r.note ? `<p class="bubble" style="margin:0">“${esc(r.note)}”</p>` : ''}</div>
        <b class="h3">เลือกต่อจากนี้</b>
        <div class="stack">${opt('renew', `ต่อคอร์ส ${r.pack} ครั้ง`, x ? `${money(x.total)} · นัดครั้งแรก ${r.next || 'นักกายภาพเสนอวันให้'}` : '')}${opt('pervisit', 'นัดเป็นครั้งเมื่อจำเป็น', 'จ่ายรายครั้งตามราคาเต็มของนักกายภาพ')}${opt('stop', 'ยังไม่ต่อตอนนี้', 'ทำท่าฝึกที่บ้านต่อ ทีมทักถามอาการใน 30 วัน')}</div>
        ${choice === 'renew' ? `<div class="card center" style="justify-items:center"><b class="sec-h">${I('qr-code')}สแกนจ่าย ${x ? money(x.total) : ''}</b><div class="pp-qr">${qrSvg('RN-' + (s.request ? s.request.ref : ''))}</div><span class="small">ส่งสลิปแล้วระบบตรวจให้ทันที เปิดคอร์สใหม่และยืนยันนัดเลย</span></div>` : ''}
      </div><div class="foot">${choice === 'renew' ? `<button class="btn" data-act="renewPay">${I('send')}ส่งสลิป (ตัวอย่าง) และต่อคอร์ส</button>` : `<button class="btn" data-act="renewStop" data-need="renewal.choice">${I('check')}ยืนยัน</button>`}</div></div>`;
    }
  });
  SC.action('renewPay', (s, c) => { const r = s.renewal; if (!r) return; r.choice = 'renew'; SC.renewDecide(s, c.line); c.toast('ระบบตรวจสลิปผ่าน เปิดคอร์สใหม่แล้ว ใบเสร็จส่งเข้า LINE'); });
  SC.action('renewStop', (s, c) => { const r = s.renewal; if (!r || !r.choice || r.choice === 'renew') return; SC.renewDecide(s, c.line); c.toast('บันทึกแล้ว ทีมจะทักถามอาการใน 30 วัน'); });
  /* ================================================================ p.cert */
  SC.screen('p.cert', {
    role: 'patient',
    render(s) {
      const cert = s.cert;
      if (!cert.issued) return `<div class="scr pp">${ui.bar('ใบรับรองกายภาพบำบัด')}<div class="body">${ui.empty('file-check-2', 'ใบรับรองยังไม่ออก', cert.requested ? 'คุณขอแล้ว นักกายภาพจะออกให้ แล้วส่งเข้า LINE' : 'ขอใบรับรองได้ในหน้าสรุปการดูแล', '<button class="btn auto" data-go="p.report">ไปหน้าสรุปการดูแล</button>')}</div></div>`;
      const en = cert.lang === 'EN', vs = s.visits.filter(v => v.published).sort((a, b) => a.n - b.n), first = vs[0] || {}, last = vs[vs.length - 1] || {}, so = first.soap || {};
      const ptn = (s.pt.legalName || '').trim() || s.pt.displayName || SC.me().name, lic = s.pt.license || '—', pat = (s.patient.legalName || '').trim() || s.patient.name || '—';
      const d = x => en ? enDate(x) : thDate(x);
      const findings = cert.exam != null ? cert.exam : (so.o || ''), dxText = cert.dx != null ? cert.dx : so.dx, txList = (cert.tx || []).map((k, i) => SC.certTxText(k, en, (cert.txo || {})[i])).filter(Boolean);
      const L = en ? { t: 'Physiotherapy Certificate', iss: 'Issue date', by: `I, <u>${esc(ptn)}</u>, Physiotherapist, professional license No. <u>${esc(lic)}</u>, did a physical therapy assessment for <u>${esc(pat)}</u> on <u>${esc(d(first.date))}</u>.`, f: 'Clinical Examination', dx: 'Physical Diagnosis', tx: 'Treatment', sig: 'Signature', es: 'Signed electronically', doc: 'Document No.', vf: 'Scan to verify', pn: 'Progression Note', date: 'Date', prog: 'Progression', v: 'Visit' }
        : { t: 'ใบรับรองทางกายภาพบำบัด', iss: 'หนังสือรับรองฉบับนี้ จัดทำขึ้นเมื่อวันที่', by: `โดย ข้าพเจ้า <u>${esc(ptn)}</u> นักกายภาพบำบัด ใบประกอบวิชาชีพเลขที่ <u>${esc(lic)}</u> ได้ทำการตรวจประเมินทางกายภาพบำบัดของ <u>${esc(pat)}</u> เมื่อวันที่ <u>${esc(d(first.date))}</u>`, f: 'พบว่า', dx: 'ผลการวินิจฉัยทางกายภาพบำบัด', tx: 'ได้ทำการรักษาโดย', sig: 'ลงชื่อ', es: 'ลงนามอิเล็กทรอนิกส์', doc: 'เลขที่เอกสาร', vf: 'ตรวจสอบเอกสารด้วย QR', pn: 'Progression Note', date: 'วันที่', prog: 'Progression', v: 'ครั้งที่' };
      return `<div class="scr pp">
        ${ui.bar('ใบรับรองกายภาพบำบัด')}
        <div class="body">
          <div class="seg" role="group" aria-label="ภาษา">${[['TH', 'ภาษาไทย'], ['EN', 'English']].map(([k, l]) => `<button class="${cert.lang === k ? 'on' : ''}" data-pick="cert.lang" data-value="${k}">${l}</button>`).join('')}</div>
          <article class="pp-doc" aria-label="${L.t}">
            <h2>${L.t}</h2>
            <p class="r">${L.iss} <u>${esc(d(last.date))}</u></p>
            <p>${L.by}</p>
            ${findings ? `<div class="f"><b>${L.f}</b><p>${esc(findings)}</p></div>` : ''}
            ${dxText ? `<div class="f"><b>${L.dx}</b><p>${esc(dxText)}</p></div>` : ''}
            <div class="f"><b>${L.tx}</b>${txList.length ? `<ul>${txList.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>—</p>'}</div>
            <div class="pp-sign"><div><span class="pp-sig">${esc(ptn.replace(/^(กภ\.|PT)\s*/, ''))}</span><span>${L.sig} ........................</span><span>( ${esc(ptn)} )</span><span style="font-size:10px;color:#777">${L.es} ${esc(d(last.date))}</span></div>
              <div class="pp-vfy"><span class="pp-qr3"></span><span>${L.doc} 2569-000123<br>${L.vf}</span></div></div>
          </article>
          ${vs.length ? `<article class="pp-doc" aria-label="Progression note"><h2>${L.pn}</h2>
            <p style="font-size:12.5px">${en ? 'Patient' : 'ผู้รับบริการ'} <b>${esc(pat)}</b> · ${en ? 'Physiotherapist' : 'นักกายภาพบำบัด'} <b>${esc(ptn)} · ${esc(lic)}</b></p>
            <table class="pp-pn"><thead><tr><th>${L.date}</th><th>${L.prog}</th></tr></thead><tbody>${vs.map(v => { const x = v.soap || {}, lines = [['S', x.s], ['O', x.o], ['T', (x.t || []).join(' · ')], ['Home program', x.p]].filter(l => l[1]);
              return `<tr><td>${esc(d(v.date))}<small>${L.v} ${v.n}${v.n === 1 ? ' · OPD' : ''}</small></td><td>${lines.length ? lines.map(l => `<b>${l[0]}</b> ${esc(l[1])}`).join('<br>') : `<span style="color:#777">${en ? 'Session completed' : 'ทำเคสครบตามแผน'}</span>`}</td></tr>`; }).join('')}</tbody></table></article>` : ''}
          <p class="pp-hint">${en ? 'ไม่มีโลโก้บริษัทบนเอกสาร · ใช้ยื่นประกันหรือที่ทำงานได้' : 'เอกสารไม่มีโลโก้บริษัท · ใช้ยื่นประกัน ที่ทำงาน หรือแพทย์ได้'}</p>
        </div>
        <div class="foot"><button class="btn" data-act="certPdf">${I('download')}บันทึก PDF</button></div>
      </div>`;
    }
  });
  SC.action('certPdf', (s, c) => c.toast('ห้องซ้อม: บันทึกใบรับรองเป็น PDF แล้ว ระบบจริงส่งเข้า LINE ด้วย'));
})();