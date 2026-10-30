/* screens-pt.js · นักกายภาพ (PT): ทางเข้า LINE, สมัคร 3 ขั้น, หน้าของฉัน + เควสต์, ตาราง, งาน, ทำเคส, OPD/SOAP, คอร์สหน้างาน, ใบรับรอง, รายได้, บัญชี */
(function () {
  'use strict';
  const { ui, esc, money } = SC;
  const I = ui.icon;

  document.head.insertAdjacentHTML('beforeend', `<style>
.tt-c{text-align:center}
.row.tt-top{align-items:flex-start}
.tt-s .card > .pill,.tt-s .card > .ver{justify-self:start}
.row.tt-top > svg{margin-top:3px}
.tt-band{display:flex;align-items:center;gap:10px;padding:14px 16px;background: var(--g-goldglow), var(--g-forest);color:#fff}
.tt-band img{height:24px;filter:brightness(0) invert(1)}
.tt-band small{margin-left:auto;font:600 12.5px var(--display);color:#d7eee2}
.tt-plain{border:0;background:none;padding:0;font:inherit;color:inherit;text-align:left}
.tt-cardbtn{border:0;text-align:left;width:100%;font:inherit;color:inherit}
.tt-ben{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.tt-ben li{display:flex;gap:12px;align-items:center;font-size:15px;color:var(--ink)}
.tt-lineTop{display:flex;align-items:center;gap:8px;min-height:56px;padding:6px 10px;background:var(--linegreen);color:#fff}
.tt-lineTop b{font:700 20px var(--display);letter-spacing:.02em;flex:1}
.tt-lineTop .ib{color:#fff}
.tt-perm{display:grid;gap:2px;border-radius:16px;background:#f6f8f7;padding:6px 12px}
.tt-perm div{display:flex;gap:10px;align-items:flex-start;padding:8px 0;font-size:14.5px}
.tt-perm div+div{border-top:1px solid var(--line)}
.tt-avwrap{position:relative;display:inline-grid;justify-items:center;gap:8px;width:var(--av)}
.tt-avedit{position:absolute;top:calc(var(--av) - 30px);right:-2px;width:32px;height:32px;min-height:0;aspect-ratio:1;border:0;border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--em);box-shadow:0 0 0 2px var(--mint2),0 4px 10px #07302322;cursor:pointer;z-index:2}.tt-avedit svg{width:16px;height:16px}
.tt-crop{position:relative;width:var(--v);height:var(--v);justify-self:center;border-radius:18px;overflow:hidden;background:#1d2a26;touch-action:none;cursor:grab;user-select:none}.tt-crop.drag{cursor:grabbing}
.tt-crop img{position:absolute;left:50%;top:50%;max-width:none;transform-origin:center;pointer-events:none}
.tt-crop .mask{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 999px #0b1f1899;outline:2px solid #ffffffcc;outline-offset:-2px;pointer-events:none}
.tt-zoom{display:flex;align-items:center;gap:10px;color:var(--sub)}.tt-zoom input{flex:1;accent-color:var(--em)}.tt-zoom svg{width:18px;height:18px;flex:none}
.tt-avs{display:flex;border-radius:50%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scrollbar-width:none;box-shadow:0 0 0 4px #fff,0 0 0 6px var(--gold2);background:var(--mint);cursor:pointer}
.tt-avs::-webkit-scrollbar{display:none}.tt-avs img{flex:none;width:100%;height:100%;object-fit:cover;scroll-snap-align:center}
.tt-avdots{display:flex;gap:5px}.tt-avdots i{width:6px;height:6px;border-radius:50%;background:#d5e3dc;transition:width .25s,background .25s}.tt-avdots i.on{width:16px;border-radius:99px;background:var(--gold)}
.tt-note{position:absolute;z-index:2;left:calc(var(--av) * .5);bottom:calc(100% - 16px);max-width:190px;width:max-content;padding:8px 13px;border:0;border-radius:18px;background:#fff;color:var(--forest);font:600 13.5px/1.35 var(--display);text-align:left;box-shadow:0 8px 22px #0730232b;animation:ttNote .5s cubic-bezier(.2,.8,.2,1.25) both;min-height:0}
.tt-note::after{content:'';position:absolute;left:14px;bottom:-7px;width:13px;height:13px;border-radius:50%;background:#fff;box-shadow:3px 4px 8px #07302314}
.tt-note.empty{width:34px;height:34px;padding:0;display:grid;place-items:center;border-radius:50%;color:var(--mute);background:#ffffffd9}.tt-note.empty svg{width:16px;height:16px}
@keyframes ttNote{from{opacity:0;transform:translateY(8px) scale(.85)}to{opacity:1;transform:none}}
.tt-pvhead{display:flex;align-items:center;gap:16px;padding-top:26px}
.tt-nedit{display:grid;justify-items:center;gap:10px;padding:34px 0 6px}
.tt-nbub{position:relative;display:block;background:#fff;border-radius:22px;box-shadow:0 10px 26px #07302326;padding:12px 16px;width:min(260px,100%)}
.tt-nbub::after{content:'';position:absolute;left:50%;bottom:-8px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#fff;box-shadow:3px 4px 8px #07302314}
.tt-nbub:focus-within{box-shadow:0 10px 26px #07302326,0 0 0 2.5px var(--em)}.tt-nin:focus,.tt-nin:focus-visible{outline:0;box-shadow:none}.tt-nin{width:100%;border:0;outline:0;background:none;font:600 16px var(--display);color:var(--forest);text-align:center}
.tt-nface{width:120px;height:120px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 4px #fff,0 0 0 6px var(--gold2)}.tt-nface img{width:100%;height:100%;object-fit:cover}
.tt-nhint{margin:0;display:flex;align-items:center;gap:6px;font-size:13px;color:var(--gink);opacity:0;transform:translateY(4px);transition:opacity .4s,transform .4s}.tt-nhint svg{width:15px;height:15px}
.tt-nedit:has(.tt-nin:not(:placeholder-shown)) .tt-nhint{opacity:1;transform:none}
.tt-more{display:grid;gap:10px;padding-top:6px;border-top:1px solid var(--line)}.tt-more .h3{margin:0}.tt-more p{margin:0}
.tt-gal{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.tt-gal .g{position:relative;aspect-ratio:1;border-radius:14px;overflow:hidden;background:var(--mint)}.tt-gal .g img{width:100%;height:100%;object-fit:cover;display:block}
.tt-gal .x{position:absolute;top:4px;right:4px;width:24px;height:24px;min-height:0;aspect-ratio:1;padding:0;border:0;border-radius:50%;background:#0b2a20aa;color:#fff;display:grid;place-items:center}.tt-gal .x svg{width:14px;height:14px}
.tt-gal .add{display:grid;place-items:center;align-content:center;gap:2px;color:var(--em);border:1.5px dashed var(--mint2);background:#fff;cursor:pointer}
@media (prefers-reduced-motion: reduce){.tt-note{animation:none}}
.tt-zgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.tt-zgrid .chip{justify-content:center;padding:0 8px;gap:6px}.tt-zgrid .chip i{font-style:normal;min-width:20px;height:20px;padding:0 6px;border-radius:99px;display:inline-grid;place-items:center;background:var(--mint);color:var(--em);font:600 12px var(--display)}.tt-zgrid .chip.on i{background:#fff3;color:#fff}
.tt-zq{position:relative;display:block}.tt-zq svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--mute);pointer-events:none}.tt-zq .in{padding-left:42px}
.tt-perm svg{color:var(--linegreen);margin-top:3px}
.tt-cover{height:132px;position:relative;background:linear-gradient(135deg,#e3f5ec,#f4e7cf);background-size:cover;background-position:center}
.tt-cover .tt-ctop{position:absolute;top:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center}
.pd-xpbtn{min-height:0;padding:0;border:0;background:none;margin-top:6px;cursor:pointer}.pd-next{margin:0;font-size:13.5px;color:#e4f0ea;position:relative;z-index:1}.pd-next b{color:#fff}
.tt-cover .tt-cadd{position:absolute;right:14px;bottom:14px}
.tt-prof{margin-top:-46px;padding:0 16px;display:grid;gap:10px;position:relative}
.tt-who{display:grid;justify-items:start;gap:12px;min-width:0}.tt-who>.avatar,.tt-who>.tt-avwrap{margin-left:6px}
.tt-who .avatar{box-shadow:0 0 0 4px #fff,0 0 0 6px var(--gold2)}
.tt-who h1{margin:0;font:600 20px/1.3 var(--display);color:var(--forest);display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.tt-who h1 svg{color:var(--em)}
.tt-stat{display:inline-flex;align-items:center;gap:8px;justify-self:start;margin:0;padding:6px 12px;border-radius:99px;font:600 13.5px var(--display)}.tt-stat svg{width:16px;height:16px;flex:none}
.tt-stat.wait{background:var(--cream);color:var(--gink)}
.tt-stat.ok{background:#e8f1ec;color:var(--forest)}
.tt-tip{position:relative;display:grid;gap:4px;padding:14px 16px;border-radius:18px;background:#fff;box-shadow:0 0 0 1.5px var(--gold2),0 14px 30px #c8a0662e;animation:ttTip .45s cubic-bezier(.2,.8,.2,1.2) both}
.tt-tip::before{content:'';position:absolute;top:-8px;left:var(--tx,40px);width:14px;height:14px;background:#fff;transform:rotate(45deg);box-shadow:-1.5px -1.5px 0 var(--gold2)}
.tt-prof>.tt-tip{--tx:44px}
.tt-tip b{font:600 16px var(--display);color:var(--forest)}.tt-tip .s{font-size:14px;color:var(--sub)}.tt-tip .row{margin-top:8px;gap:8px}
.tt-tiphead{display:flex;justify-content:space-between;align-items:center}
.tt-tipdots{display:flex;gap:5px}.tt-tipdots i{width:7px;height:7px;border-radius:50%;background:#e3ebe7}.tt-tipdots i.done{background:var(--gold2)}.tt-tipdots i.on{width:18px;border-radius:99px;background:var(--gold)}
.tt-tip.dock{position:sticky;bottom:78px;z-index:5;margin:0 16px 10px;--tx:calc((100% + 32px) * .375 - 23px)}
.tt-tip.dock::before{top:auto;bottom:-8px;box-shadow:1.5px 1.5px 0 var(--gold2)}
.tt-spot{position:relative;border-radius:99px;animation:ttSpot 2.2s ease-in-out infinite}
.tt-who .tt-spot{display:inline-block}
@keyframes ttSpot{0%,100%{box-shadow:0 0 0 0 #e9cda100}50%{box-shadow:0 0 0 8px #e9cda166}}
.tt-compose.tt-spot,.tt-biohole.tt-spot{border-radius:16px}
@keyframes ttTip{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}
.tt-feed{padding-top:14px}
.tt-cvadd{display:grid;gap:10px;background:var(--mint)}
.tt-mode{position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:0;height:34px;padding:0;border:0;border-radius:99px;background:#eef3f0;font:600 12.5px var(--display);color:var(--mute);cursor:pointer;overflow:hidden}
.tt-mode span{position:relative;z-index:1;padding:0 10px;transition:color .25s}.tt-mode span:first-child{color:#fff}.tt-mode.pt span:first-child{color:var(--mute)}.tt-mode.pt span:nth-child(2){color:#fff}
.tt-mode i{position:absolute;top:3px;bottom:3px;left:3px;width:calc(50% - 3px);border-radius:99px;background:var(--g-em);transition:transform .3s var(--ease)}.tt-mode.pt i{transform:translateX(100%);background:linear-gradient(135deg,#d9ab62,#9a6a2a)}
.tt-ptd{display:grid;gap:8px;padding:16px;border-radius:20px;background:var(--g-sheen),var(--g-forest);color:#fff}.tt-ptd .small{color:#cfe3d8}.tt-ptd .price{color:#fff}.tt-ptd b{color:#fff}
.tt-btab{width:100%;border-collapse:collapse;font-size:14px}.tt-btab th{text-align:left;font-weight:500;color:var(--mute);font-size:12.5px;padding:4px 6px}.tt-btab td{padding:7px 6px;border-top:1px solid var(--line)}.tt-btab tr.on td{background:#faf3e7}
.tt-docs{display:grid;gap:10px}.tt-docs .h3{display:flex;align-items:center;gap:6px}.tt-docs .h3 svg{width:18px;height:18px;color:var(--em)}
.tt-hint{font-weight:500;font-size:12.5px;color:var(--gink);margin-left:6px}.tt-zdist{display:grid;gap:6px;margin-top:8px;padding:10px 12px;border-radius:14px;background:var(--mint)}.tt-zdist small{color:var(--em);font-weight:600}.tt-zdist .chip{pointer-events:none;background:#fff}.tt-zdist .chip svg{width:13px;height:13px;color:var(--em)}
.tt-casetime{display:flex;gap:8px;align-items:flex-start;margin:0;padding:10px 12px;border-radius:12px;background:#fff;font-size:14px;line-height:1.5;color:var(--ink)}.tt-casetime svg{flex:none;width:18px;height:18px;margin-top:2px;color:var(--em)}.tt-casetime b{color:var(--forest)}
.tt-sendbar{display:grid;gap:10px}.tt-sendrow{display:grid;grid-template-columns:auto 1fr;gap:10px}.tt-sendrow .btn{width:100%}
.tt-req{font-style:normal;font-size:12px;font-weight:600;color:var(--gink);background:#faf3e7;border-radius:99px;padding:1px 8px;margin-left:4px}
.tt-licf{display:grid;gap:10px;padding:12px;border-radius:16px;background:var(--mint);}.tt-licf img{width:100%;max-height:200px;object-fit:contain;border-radius:10px;background:#fff}
.tt-licdoc{display:grid;justify-items:center;gap:4px;padding:18px;border-radius:12px;background:#fff;text-align:center;color:var(--forest)}.tt-licdoc svg{width:34px;height:34px;color:var(--em)}.tt-licdoc small{color:var(--mute)}
.tt-fpost{display:grid;gap:10px;width:100%;text-align:left;padding:14px;border:0;border-radius:18px;background:#fff;box-shadow:0 0 0 1px var(--line),0 6px 16px #0730230a;color:var(--ink);min-height:0}
.tt-fpost .row{gap:10px}.tt-fpost b{display:block;font:600 14.5px var(--display);color:var(--forest)}.tt-fpost small{font-size:12px;color:var(--mute)}
.tt-fpost .tx{font-size:15px;line-height:1.6;white-space:pre-wrap}
.tt-plan{display:grid;gap:6px;padding:12px;border-radius:16px;background:var(--mint)}.tt-planH{display:flex;align-items:center;gap:6px;font:600 15px var(--display);color:var(--forest)}.tt-plan .field>span{font-size:13.5px;color:var(--sub)}.tt-planLink{justify-self:center;color:var(--em);line-height:0}.tt-planLink svg{width:18px;height:18px}
.tt-fpost .im{position:relative;display:block;border-radius:14px;overflow:hidden;aspect-ratio:4/3}.tt-fpost .im img{width:100%;height:100%;object-fit:cover;display:block}
@media (prefers-reduced-motion: reduce){.tt-spot{animation:none;box-shadow:0 0 0 4px #e9cda188}.tt-tip{animation:none}}
.tt-prof>p{margin:0}.tt-bio{min-height:0;border:0;background:none;padding:0;text-align:left;font-size:15px;color:var(--ink);line-height:1.6}
.tt-biohole{display:flex;gap:10px;align-items:center;width:100%;min-height:56px;padding:12px 14px;border:1.5px dashed var(--gold2);border-radius:14px;background:#fffdf8;color:var(--gink);font:500 14.5px var(--text);text-align:left}
.tt-stats{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;border-block:1px solid var(--line);padding:10px 0}
.tt-stats b{display:block;font-size:19px;color:var(--forest)}
.tt-stats span{font-size:12.5px;color:var(--sub)}
.tt-ringw{position:relative;display:grid;place-items:center;flex:none}
.tt-ringw > b{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:3px;font:700 20px var(--display);color:var(--forest);line-height:1}
.tt-ringw > b small{display:block;font:600 10px var(--display);color:var(--gink)}
.tt-q{display:flex;align-items:center;gap:6px;border-radius:14px;min-width:0}
.tt-q + .tt-q{box-shadow:inset 0 1px 0 var(--line)}
.tt-qm{flex:1;min-width:0;display:flex;align-items:center;gap:12px;min-height:60px;border:0;background:none;text-align:left;padding:8px 4px;color:inherit;font:inherit}
.tt-qopt{display:grid;gap:0;padding-bottom:10px}
.tt-qbtns{padding-left:46px}
.tt-qm .t{font:600 15px var(--display);color:var(--forest)}
.tt-qm .s{font-size:13px;color:var(--sub)}
.tt-qd{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;flex:none;background:#eef1ef;color:var(--mute);font:600 13px var(--display)}
.tt-q[data-done] .tt-qd,.tt-qd.done{background:linear-gradient(135deg,var(--gold2),var(--gold));color:#fff}
.tt-xp{font:600 12.5px var(--display);color:var(--gink);white-space:nowrap}
.tt-compose{display:flex;align-items:center;gap:10px;width:100%;min-height:56px;padding:8px 14px 8px 8px;border:0;border-radius:99px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--mute);font:500 15px var(--text);text-align:left}
.tt-compose span.grow{color:var(--mute)}
.tt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:0 -16px}
.tt-grid button{aspect-ratio:1;border:0;padding:8px;background:linear-gradient(135deg,var(--mint),var(--cream));font:600 12px/1.35 var(--display);color:var(--forest);overflow:hidden;position:relative;display:grid;place-items:center;text-align:center;min-width:0}
.tt-grid img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tt-grid .tt-play,.tt-fpost .tt-play{position:absolute;right:6px;top:6px;width:24px;height:24px;border-radius:50%;background:#043928cc;color:#fff;display:grid;place-items:center}
.tt-grid .tt-play svg,.tt-fpost .tt-play svg{width:13px;height:13px}
.tt-thumbs{display:flex;gap:8px;flex-wrap:wrap}
.tt-thumbs button{width:64px;height:64px;border-radius:12px;border:0;padding:0;overflow:hidden;box-shadow:inset 0 0 0 1.5px var(--line)}
.tt-thumbs button.on{box-shadow:0 0 0 3px var(--em)}
.tt-thumbs img{width:100%;height:100%;object-fit:cover;display:block}
.tt-file{position:relative;overflow:hidden}
.tt-file input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.tt-postimg{position:relative;border-radius:14px;overflow:hidden;max-height:220px}
.tt-postimg img{width:100%;display:block;max-height:220px;object-fit:cover}
.tt-postimg button{position:absolute;top:8px;right:8px}
.tt-err{font-size:13px;color:var(--red)}
.tt-photo{width:184px;height:184px;border-radius:50%;align-self:center;justify-self:center;position:relative;display:grid;place-items:center;background:var(--mint);box-shadow:0 0 0 6px #fff,0 0 0 9px var(--gold2);overflow:hidden;color:var(--em);cursor:pointer}
.tt-photo img{width:100%;height:100%;object-fit:cover}
.tt-photo input{position:absolute;inset:0;opacity:0;cursor:pointer}
.tt-photo .tt-cam{position:absolute;right:16px;bottom:16px;width:40px;height:40px;border-radius:50%;background: var(--g-sheen), var(--g-em);color:#fff;display:grid;place-items:center}
.tt-dos{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;font-size:12px;color:var(--sub)}
.tt-dos span{display:grid;justify-items:center;gap:4px}
.tt-dos i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-style:normal}
.tt-dos .y i{background:#e8f1ec;color:var(--em)}
.tt-dos .n i{background:var(--redbg);color:var(--red)}
.tt-calbar{display:flex;align-items:center;gap:4px}
.tt-calbar b{flex:1;min-width:0;text-align:center;font:600 15.5px var(--display);color:var(--forest)}
.tt-cal{background:#fff;border-radius:16px;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.tt-calh,.tt-calb{display:grid;grid-template-columns:34px repeat(var(--n),minmax(0,1fr))}
.tt-calh{border-bottom:1px solid var(--line)}
.tt-calh button{border:0;background:none;padding:6px 0;display:grid;justify-items:center;gap:2px;font:500 12px var(--text);color:var(--sub);min-height:52px;min-width:0}
.tt-calh button b{font:600 14.5px var(--display);color:var(--forest);width:28px;height:28px;display:grid;place-items:center;border-radius:50%}
.tt-calh button.today b{background: var(--g-sheen), var(--g-em);color:#fff}
.tt-axis span{display:block;height:46px;font-size:10.5px;color:var(--mute);text-align:right;padding-right:5px;line-height:1;padding-top:2px}
.tt-col{position:relative;border-left:1px solid var(--line);min-width:0}
.tt-cell{display:block;width:100%;height:46px;border:0;border-top:1px solid #eef3f0;background:none;padding:0}
.tt-cell:hover{background:#eef5f1}
.tt-col{touch-action:pan-y;user-select:none;-webkit-user-select:none}
.tt-today{min-height:36px;padding:0 12px;gap:6px}.tt-today svg{width:16px;height:16px}
.tt-ghost{position:absolute;left:2px;right:2px;z-index:3;border-radius:8px;padding:4px 6px;background:#00583ee0;color:#fff;font:600 11px/1.3 var(--display);box-shadow:0 8px 18px #00583e40;pointer-events:none;overflow:hidden}
.tt-rules{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.tt-rules li{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--ink)}
.tt-rules li>i{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1.5px var(--gold2);background:#fff;margin-top:1px}
.tt-rules li.ok>i{background:linear-gradient(135deg,var(--gold2),var(--gold));box-shadow:none;color:#fff}.tt-rules li>i svg{width:13px;height:13px}
.tt-rules b{display:block;font:600 14px var(--display);color:var(--forest)}.tt-rules small{display:block;font-size:12.5px;color:var(--sub)}
.tt-ev{position:absolute;left:2px;right:2px;border:0;border-radius:8px;padding:3px 4px;font:600 11px/1.25 var(--display);text-align:left;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;z-index:2}
.tt-ev small{display:block;font:500 10px/1.3 var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tt-ev.open{background: var(--g-sheen), var(--g-em);color:#fff}
.tt-ev.draft{background:repeating-linear-gradient(135deg,#fff 0 5px,#e5f0ea 5px 10px);color:var(--em);box-shadow:inset 0 0 0 1.5px var(--em)}
.tt-ev.openbg{background:#e6f3ec;color:#5f8f78;font-weight:500;pointer-events:none;z-index:1;box-shadow:inset 3px 0 0 #9fd3b8}
.tt-ev.pick{box-shadow:inset 3px 0 0 var(--em),0 6px 14px #04392826;background:#fff;z-index:4}
.tt-picked{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#f3faf6;box-shadow:inset 0 0 0 1.5px #cfe5d8}.tt-picked .grow{display:grid;gap:2px;min-width:0}.tt-picked b{font:600 15px var(--display);color:var(--forest)}.tt-picked small{font-size:13px;color:var(--sub)}
.tt-days button em{position:absolute;bottom:4px;left:50%;width:14px;height:3px;margin-left:-7px;border-radius:2px;background:var(--em)}.tt-days button.on em{background:#fff}
.tt-ev.visit{background:var(--cream);color:var(--forest);box-shadow:inset 3px 0 0 var(--gold),inset 0 0 0 1px #ecdcbd;z-index:3}
.tt-now{position:absolute;left:0;right:0;height:2px;background:#d64545;z-index:4;pointer-events:none}
.tt-now::before{content:'';position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:#d64545}
.tt-month{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:8px}
.tt-month .h{font-size:12px;color:var(--mute);text-align:center;padding:2px 0}
.tt-month button{min-height:54px;border:0;border-radius:10px;background:#f7faf8;display:grid;align-content:start;justify-items:center;gap:4px;padding:6px 0;font:600 14px var(--display);color:var(--forest);min-width:0}
.tt-month button.today{background:#fff;box-shadow:inset 0 0 0 2px var(--forest);color:var(--forest);font-weight:700}
.tt-month button.op{background:var(--g-sheen),var(--g-em);color:#fff}
.tt-month button.dr{background:repeating-linear-gradient(135deg,#fff 0 4px,#e3f3ea 4px 8px);box-shadow:inset 0 0 0 2px var(--em)}
.tt-month button.vi{background:linear-gradient(150deg,#fbf3e4,#f3e3c3);box-shadow:inset 0 0 0 2px #c9954a;color:var(--gink)}
.tt-month button.today.op,.tt-month button.today.dr,.tt-month button.today.vi{box-shadow:inset 0 0 0 2px #fff,0 0 0 2px var(--forest)}
.tt-month span.out{min-height:54px}
.tt-dots{display:flex;gap:3px}
.tt-dots i{width:6px;height:6px;border-radius:50%;background: var(--g-sheen), var(--g-em)}
.tt-dots i.d{background:#fff;box-shadow:inset 0 0 0 1.5px var(--em)}
.tt-dots i.v{background:var(--gold)}
.tt-legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:var(--sub)}
.tt-legend span{display:inline-flex;align-items:center;gap:6px}
.tt-legend i{width:14px;height:14px;border-radius:4px;display:inline-block}
.tt-stepper{display:grid;grid-template-columns:repeat(4,1fr);gap:2px}
.tt-skip{display:grid;gap:12px;background:linear-gradient(150deg,#fff 0%,#faf3e7 100%)}.tt-skip .tt-stepper{grid-template-columns:repeat(3,1fr)}
.tt-stepper div{display:grid;justify-items:center;gap:4px;text-align:center;font:600 12px/1.3 var(--display);color:var(--mute);position:relative}
.tt-stepper div::before{content:'';position:absolute;top:14px;right:50%;width:100%;height:2px;background:var(--line);z-index:0}
.tt-stepper div:first-child::before{display:none}
.tt-stepper div.d::before,.tt-stepper div.n::before{background:var(--gold2)}
.tt-stepper i{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#eef1ef;color:var(--mute);font-style:normal;position:relative;z-index:1}
.tt-stepper .d i{background:linear-gradient(135deg,var(--gold2),var(--gold));color:#fff}
.tt-stepper .n i{background: var(--g-sheen), var(--g-em);color:#fff;box-shadow:0 0 0 5px #0b6e4f26}
.tt-stepper .d,.tt-stepper .n{color:var(--forest)}
.tt-big{display:flex;align-items:center;gap:12px;width:100%;min-height:68px;padding:10px 12px 10px 18px;border:0;border-radius:18px;background:var(--g-sheen), var(--g-em);color:#fff;text-align:left;box-shadow:0 10px 22px #00583e30}
.tt-big b{display:block;font:600 17px var(--display)}
.tt-big small{display:block;font-size:13px;color:#e7f1ec}
.tt-big .arw{width:44px;height:44px;border-radius:50%;background:#ffffff26;display:grid;place-items:center;flex:none}
.tt-big[disabled],.tt-big.off{opacity:.45;pointer-events:none}
.tt-timer{font:700 26px var(--display);color:var(--forest);letter-spacing:.02em}
.tt-map{height:148px;border-radius:16px;position:relative;overflow:hidden;background-color:#e8f1ec;background-image:linear-gradient(35deg,transparent 45%,#f7e9cb 45%,#f7e9cb 52%,transparent 52%),linear-gradient(#fff 3px,transparent 3px),linear-gradient(90deg,#fff 3px,transparent 3px);background-size:100% 100%,38px 38px,38px 38px}
.tt-map .pin{position:absolute;left:50%;top:46%;transform:translate(-50%,-100%);color:var(--red)}
.tt-map .pin svg{width:34px;height:34px;fill:#fdecea}
.tt-map .me{position:absolute;left:22%;top:72%;width:14px;height:14px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 5px #2a5d9f33}
.tt-map .btn{position:absolute;right:10px;bottom:10px}
.tt-ta{min-height:74px !important;overflow:hidden}
.tt-quick{gap:6px}
.tt-quick .chip{min-height:34px;font-size:13px;padding:0 10px;border-style:dashed;color:var(--sub)}
.tt-soapL{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:7px;background: var(--g-goldglow), var(--g-forest);color:#fff;font:700 13px var(--display);margin-right:6px}
.tt-pk{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:14px;border-radius:16px;border:1.5px solid var(--line);background:#fff;text-align:left;width:100%;position:relative;color:inherit;font:inherit}
.tt-pk.on{border-color:var(--em2);background:#eaf3ee}
.tt-pk .nm{font:600 17px var(--display);color:var(--forest)}
.tt-pk .pr{text-align:right;font:700 19px var(--display);color:var(--forest)}
.tt-pk .pr s{font:500 13px var(--text);color:var(--mute);margin-right:6px}
.tt-pk .per{grid-column:1/-1;font-size:13px;color:var(--sub)}
.tt-pk > .pill{position:absolute;top:-11px;left:12px}
.tt-br{display:flex;justify-content:space-between;gap:10px;font-size:14.5px;padding:3px 0}
.tt-br b{font-family:var(--display);color:var(--forest);white-space:nowrap}
.tt-br.mute{color:var(--mute)} .tt-br.mute b{color:var(--mute);font-weight:500}
.tt-br.gold b{color:var(--gink)}
.tt-br.total{border-top:1px solid var(--line);margin-top:4px;padding-top:10px;font:600 16px var(--display);color:var(--forest)}
.tt-br.total b{font-size:22px}
.tt-mini{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;font:600 13px var(--display);color:var(--sub)}
.tt-mini span{padding:6px 0;border-radius:9px}
.tt-mini .h{font:500 11.5px var(--text);color:var(--mute)}
.tt-mini .p{background: var(--g-sheen), var(--g-em);color:#fff}
.tt-mini .t{background:linear-gradient(135deg,var(--gold2),var(--gold));color:#3d2a10}
.tt-mini .o{color:#c3cec8}
.tt-pin{display:flex;align-items:center;gap:6px;margin:8px 0 4px}.tt-pin span{font:600 22px var(--display);color:var(--forest)}.tt-pin .in{flex:1;font:600 22px var(--display);text-align:right}.tt-pin em{font-style:normal;color:var(--sub)}
.tt-range{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--sub)}.tt-range b{color:var(--forest)}
.tt-mini button{border:0;background:none;font:inherit;color:inherit;padding:6px 0;border-radius:9px;min-height:0;cursor:pointer;transition:background .15s,color .15s}
.tt-mini button:hover{background:var(--mint)}.tt-mini button.p{background: var(--g-sheen), var(--g-em);color:#fff;animation:ttday .3s cubic-bezier(.2,.8,.2,1.4)}
@keyframes ttday{from{transform:scale(.7)}}
.tt-qr{align-self:center;justify-self:center;padding:12px;background:#fff;border-radius:18px;box-shadow:inset 0 0 0 1px var(--line)}
.tt-qr svg{display:block;width:196px;height:196px}
.tt-stepnum{display:flex;align-items:center;gap:10px}
.tt-stepnum .progress{flex:1}
.tt-a4{background:#fff;border-radius:6px;box-shadow:0 10px 30px #07302318,inset 0 0 0 1px var(--line);padding:20px 16px;font-size:13.5px;line-height:1.75;color:#222;display:grid;gap:8px}
.tt-a4 h3{text-align:center;font:600 17px var(--display);margin:0 0 4px;color:#111}
.tt-a4 .u{font-weight:600;color:#111;border-bottom:1px dotted #9aa}
.tt-a4 .lbl{font:600 13px var(--display);color:#111;margin-top:4px}
.tt-a4 ul{margin:0;padding-left:18px}
.tt-sig{display:grid;justify-items:center;gap:2px;margin-top:8px;text-align:center;font-size:12.5px;color:#444}
.tt-sig .sign{font:italic 600 22px/1.2 Georgia,serif;color:#1d3a8f;min-height:28px}
.tt-prog{display:grid;gap:8px}
.tt-prog > div{border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);padding:8px 10px;font-size:12.5px;line-height:1.55}
.tt-prog b{font:600 12.5px var(--display);color:#111}
.tt-pad{display:grid;place-items:center;min-height:84px;border-radius:14px;border:1.5px dashed var(--mint2);background:#fcfefd;width:100%;color:var(--mute);font:500 14px var(--text)}
.tt-pad.on{border-style:solid;border-color:var(--em2);background:#eef5f1}
.tt-pad .sign{font:italic 600 26px/1.2 Georgia,serif;color:#1d3a8f}
.tt-sw{appearance:none;-webkit-appearance:none;width:48px;height:28px;border-radius:99px;background:#d9e3de;position:relative;flex:none;cursor:pointer;transition:background .2s;margin:0}
.tt-sw::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0003;transition:transform .2s var(--ease)}
.tt-sw:checked{background: var(--g-sheen), var(--g-em)}
.tt-sw:checked::after{transform:translateX(20px)}
.tt-earn{display:grid;gap:4px;padding:18px;border-radius:var(--r);background:linear-gradient(135deg,var(--cream),#fff);box-shadow:inset 0 0 0 1px #ecdcbd}
.tt-earn .n{font:700 32px var(--display);color:var(--forest)}
.tt-wrap{white-space:normal;text-align:left}
.tt-lock{display:grid;justify-items:center;gap:10px;padding:26px 18px;text-align:center}
.tt-lock .tile{width:64px;height:64px;border-radius:22px}
@media (prefers-reduced-motion: reduce){.tt-big,.tt-sw::after{transition:none}}
.tt-en{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;background:#eef5f1;color:var(--em);font:600 11px/1.6 var(--text);vertical-align:1px}
.tt-earn{display:grid;gap:8px}.tt-earn table{width:100%;border-collapse:collapse;font-size:14px}.tt-earn th{font:500 12.5px var(--text);color:var(--sub);text-align:right;padding:0 0 4px}.tt-earn th:first-child,.tt-earn td:first-child{text-align:left}
.tt-earn td{padding:8px 0;border-top:1px solid var(--line);text-align:right;color:var(--ink)}.tt-earn td b{font:600 15px var(--display);color:var(--forest)}.tt-earn tr.on td{background:#f3faf6}.tt-earn tr.on td:first-child{box-shadow:inset 3px 0 0 var(--em);padding-left:8px}
.tt-days{display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px;scroll-snap-type:x mandatory}.tt-days button{flex:none;scroll-snap-align:start;position:relative;display:grid;justify-items:center;gap:0;width:54px;min-height:0;padding:7px 0 8px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--ink)}
.tt-days button small{font-size:11.5px;color:var(--sub)}.tt-days button b{font:600 18px/1.2 var(--display)}.tt-days button i{position:absolute;top:5px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--gold)}
.tt-days button.on{background:var(--g-sheen),var(--g-em);box-shadow:none;color:#fff}.tt-days button.on small{color:#ffffffcc}
.tt-times{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.tt-times button{display:grid;justify-items:center;min-height:48px;padding:6px 4px;border:0;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);font:600 15px var(--display);color:var(--ink)}
.tt-times button small{font:500 11px var(--text)}.tt-times button.k0{background:linear-gradient(135deg,#0b6e4f,#00583e 55%,#043928);color:#fff;box-shadow:none}.tt-times button.k1{background:linear-gradient(135deg,#e6f5ec,#cdeadb);color:var(--forest);box-shadow:inset 0 0 0 1.5px #9fd3b8}.tt-times button.k2{background:linear-gradient(135deg,#fdf6ea,#f3e2c2);color:#7a5424;box-shadow:inset 0 0 0 1.5px #e9cda1}
.tt-cv{display:grid;gap:4px;width:100%;padding:0;border:0;background:none;text-align:left;min-height:0;font:400 14.5px var(--text);color:var(--ink);cursor:pointer}.tt-cv>span{display:flex;gap:8px;align-items:flex-start;line-height:1.5}.tt-cv svg{flex:none;width:17px;height:17px;margin-top:3px;color:var(--em)}.tt-cv small{color:var(--mute);font-size:13px}
.tt-cvadd-link{display:inline-flex;align-items:center;gap:6px;min-height:0;padding:0;border:0;background:none;color:var(--em);font:600 14px var(--text);cursor:pointer}.tt-cvadd-link svg{width:17px;height:17px}
.tt-skip{display:flex;gap:10px;align-items:center;width:100%;min-height:60px;padding:12px 14px;border:0;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);text-align:left;color:var(--forest)}.tt-skip b{display:block;font:600 15px var(--display)}.tt-skip small{display:block;font-size:13px;color:var(--sub)}.tt-skip>svg{flex:none;width:20px;height:20px;color:var(--em)}
.tt-tlist{gap:8px}.tt-tblock{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 8px;border-radius:14px;background:#fff;box-shadow:0 0 0 1.5px var(--line);animation:ttT .35s cubic-bezier(.2,.8,.2,1) both}.tt-tblock .no{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--mint);color:var(--em);font:600 13px var(--display)}.tt-tblock .in{border:0;box-shadow:none;min-height:40px;padding:0 4px;background:none}.tt-tblock .ib{flex:none}.tt-tadd{justify-self:start}
@keyframes ttT{from{opacity:0;transform:translateY(6px)}}
.tt-ih{display:inline-flex;align-items:center;gap:8px;margin:0}.tt-ih .ic{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:var(--mint);color:var(--em)}.tt-ih .ic svg{width:17px;height:17px}
.tt-find{display:flex;align-items:center;gap:8px;min-height:50px;padding:0 6px 0 14px;border-radius:16px;background:#fff;box-shadow:0 0 0 1.5px var(--line)}.tt-find>svg{width:19px;height:19px;color:var(--em);flex:none}.tt-find .in{border:0;box-shadow:none;padding:0;min-height:46px;background:none}.tt-find .ib{flex:none}
.tt-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.tt-tiles button{display:grid;justify-items:center;gap:2px;padding:10px 4px;border-radius:16px;border:0;background:#fff;box-shadow:0 0 0 1px var(--line)}.tt-tiles span{display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:var(--mint);color:var(--em)}.tt-tiles span svg{width:17px;height:17px}.tt-tiles b{font:700 20px/1.1 var(--display);color:var(--forest)}.tt-tiles small{font:600 11.5px/1.25 var(--text);color:var(--sub);text-align:center}
.tt-tiles button.has span{background:var(--g-sheen),var(--g-em);color:#fff}.tt-tiles button.on{box-shadow:0 0 0 2px var(--em);background:#f3faf6}
.tt-bsec{display:grid;gap:8px}.tt-bh{display:flex;align-items:center;gap:6px;margin:6px 0 0;font:600 16px var(--display);color:var(--forest)}.tt-bh svg{width:18px;height:18px;color:var(--em)}.tt-bh span{min-width:22px;height:22px;padding:0 6px;border-radius:99px;background:var(--mint);color:var(--em);font:600 12px/22px var(--text);text-align:center}.tt-bh .link{margin-left:auto;font-size:13.5px}
.tt-bnone{margin:0;padding:12px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line);color:var(--mute);font-size:14px;text-align:center}
.tt-emr{display:grid;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px var(--line)}.tt-emrrow{display:flex;align-items:center;gap:10px;padding:12px;border:0;border-bottom:1px solid var(--line);background:#fff;text-align:left;min-width:0}.tt-emrrow:last-child{border-bottom:0}.tt-emrrow>svg{width:18px;height:18px;color:var(--mute);flex:none}
.tt-emrrow .av,.tt-chhead .av{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--mint);color:var(--em);font:600 17px var(--display)}.tt-chhead .av{width:52px;height:52px;border-radius:16px;font-size:22px}
.tt-emrrow .grow{display:grid;gap:3px;min-width:0}.tt-emrrow .r1{display:flex;align-items:center;gap:6px}.tt-emrrow .r1 b{font:600 15px var(--display);color:var(--forest)}.tt-emrrow .dot{width:8px;height:8px;border-radius:50%;background:#e8833a}
.tt-emrrow .r2{font-size:12.5px;color:var(--sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tt-emrrow code,.tt-chhead code{font:600 12.5px ui-monospace,Menlo,monospace;color:var(--forest);background:#f2f5f3;padding:1px 6px;border-radius:6px}
.tt-emrrow .r3{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font-size:12.5px;color:var(--mute)}.tt-emrrow .r3>span:not(.pill){display:inline-flex;align-items:center;gap:3px}.tt-emrrow .r3 svg{width:13px;height:13px}
.tt-chhead{display:grid;gap:10px}.tt-chacts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.tt-txrow{display:flex;gap:8px;align-items:flex-start}.tt-txrow .dot{font:700 20px/44px var(--display);color:var(--em)}.tt-txrow .grow{display:grid;gap:6px;min-width:0}.tt-txrow select.in{width:100%}.tt-txrow .ib{margin-top:4px;flex:none}
.tt-opt{display:grid;gap:2px;text-align:left;min-height:48px;padding:10px 14px;border-radius:14px;border:1.5px solid var(--line);background:#fff;font:600 15px var(--text);color:var(--ink)}.tt-opt small{font:500 13px var(--text);color:var(--mute)}.tt-opt.on{border-color:var(--em);background:#f3faf6;box-shadow:inset 0 0 0 1px var(--em)}
.tt-packs3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.tt-packs3 .tt-opt{padding:10px}
.tt-certf{display:grid;gap:12px}.tt-certf .field>span small{font-weight:500}
.tt-skipc{border:1.5px dashed var(--mint2,#cfe5d8);background:#fbfdfc}
.tt-cvrow{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:#f7faf8}.tt-cvrow .grow small{display:block;color:var(--sub);font-size:13px}.tt-cvrow .ib{min-height:0;width:32px;height:32px;aspect-ratio:1}

/* ---------- Palm's PT Dashboard (board 23 Oct) ---------- */
.pd{display:grid;gap:12px;padding:4px 16px 0}
.pd-hero{position:relative;overflow:hidden;display:grid;gap:12px;padding:16px;border-radius:22px;color:#fff;background:var(--g-sheen),var(--g-forest);box-shadow:0 14px 30px #04392833}
.pd-hero::after{content:'';position:absolute;right:-40px;top:-50px;width:180px;height:180px;border-radius:50%;background:radial-gradient(closest-side,#ffffff1f,#fff0)}
.pd-hi{display:flex;align-items:center;gap:12px;position:relative;z-index:1}
.pd-hi small{display:block;font-size:13px;color:#cfe3d8}.pd-hi .grow>b{display:block;font-size:18px;line-height:1.3;color:#fff}
.pd-hi .xp-pill{font-size:14px;padding:6px 14px}.pd-hi .xp-pill b{display:inline;font:inherit;color:#fff}
.pd-ring{position:relative;width:64px;height:64px;flex:none;display:grid;place-items:center}.pd-ring svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
.pd-ring circle{fill:none;stroke-width:6}.pd-ring .bg{stroke:#ffffff26}.pd-ring .fg{stroke:#fff;stroke-linecap:round;transition:stroke-dashoffset .8s var(--ease)}
.pd-ring b{font:700 22px var(--display);color:#fff}
/* Boss (28 Oct): the deep-green card stays; only the XP bar (and pill) is gold. */
.pd-bar{height:8px;border-radius:9px;background:#ffffff26;overflow:hidden;position:relative;z-index:1}.pd-bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#e6c68f,#d9ab62);transition:width .8s var(--ease)}
.pd-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;position:relative;z-index:1}
.pd-nums div{padding:10px 6px;border-radius:14px;background:#ffffff14;text-align:center}.pd-nums b{display:block;font-size:20px;color:#fff}.pd-nums span{font-size:12.5px;color:#cfe3d8}
.pd-card{display:grid;gap:10px;padding:14px 16px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px var(--line),0 8px 20px #0439280c}
.pd-card h2{display:flex;align-items:center;gap:8px;margin:0;font-size:16.5px;color:var(--forest)}
.pd-card h2 svg{width:30px;height:30px;padding:6px;border-radius:10px;background:var(--mint);color:var(--em)}
.pd-prog{display:flex;align-items:center;gap:10px}.pd-prog .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#f3f8f5;color:var(--em);flex:none}
.pd-prog .grow{display:grid;gap:5px;min-width:0}.pd-prog b{font-size:14.5px;color:var(--ink)}.pd-prog small{font-size:13px;color:var(--em);font-weight:600}
.pd-track{height:7px;border-radius:9px;background:#e8efeb;overflow:hidden}.pd-track i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,var(--em),#2f8f6a)}
.pd-mis{display:flex;align-items:center;gap:10px;width:100%;min-height:48px;padding:6px 10px;border:0;border-radius:14px;background:#f7faf8;text-align:left;font:500 15px var(--text);color:var(--ink)}
.pd-mis .ck{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;flex:none;box-shadow:inset 0 0 0 2px var(--mint2);color:transparent}.pd-mis .ck svg{width:15px;height:15px;stroke-width:3}
.pd-mis.done .ck{background:var(--em);box-shadow:none;color:#fff}.pd-mis.done .grow{color:var(--mute);text-decoration:line-through}.pd-mis > svg{color:var(--mute)}
.pd-badges{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;text-align:center}
.pd-badge{display:grid;justify-items:center;gap:6px}.pd-badge small{font-size:12px;line-height:1.3;color:var(--mute)}
.pd-badge span{width:54px;height:54px;display:grid;place-items:center;clip-path:polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0 50%);background:#edf1ef;color:#a3b1ab}
.pd-badge.on span{background:var(--g-em);color:#fff}.pd-badge.on small{color:var(--forest);font-weight:600}.pd-badge span svg{width:22px;height:22px}
</style>`);

  /* ---------- Small engine helpers (sheets that follow state, focus after a live re-render, digits-only inputs) ---------- */
  const tt = { sheetTop: 0, focus: null, timers: [] };
  document.addEventListener('scroll', e => { const t = e.target; if (t && t.classList && t.classList.contains('sheet')) tt.sheetTop = t.scrollTop; }, true);
  document.addEventListener('input', e => {
    const t = e.target; if (!t || !t.closest || !t.closest('#dev')) return;
    if (t.hasAttribute('data-digits')) { const c = t.value.replace(/\D/g, '').slice(0, 8); if (c !== t.value) t.value = c; }
    if (t.dataset.bind && t.hasAttribute('data-live') && t.type !== 'checkbox') { let pos = null; try { pos = t.selectionStart; } catch (er) { pos = null; } tt.focus = { bind: t.dataset.bind, pos }; }
    if (t.dataset.count) { const c = document.getElementById(t.dataset.count); if (c) c.textContent = t.value.length; }
  }, true);
  /* Range sliders: re-render when released, so dragging is never cut off by a re-render. */
  document.addEventListener('change', e => { const t = e.target; if (t && t.type === 'range' && t.dataset.bind && t.closest && t.closest('#dev')) SC.render(true); });
  function autosize(t) { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }
  function mountCommon(root) {
    tt.timers.forEach(clearInterval); tt.timers = [];
    const sh = root.querySelector('.sheet'); if (sh && tt.sheetTop) sh.scrollTop = tt.sheetTop;
    root.querySelectorAll('textarea[data-auto]').forEach(t => { autosize(t); t.addEventListener('input', () => autosize(t)); });
    if (tt.focus) {
      const el = root.querySelector(`[data-bind="${tt.focus.bind}"]`);
      if (el) { el.focus({ preventScroll: true }); if (tt.focus.pos != null) try { el.setSelectionRange(tt.focus.pos, tt.focus.pos); } catch (er) { /* number/range inputs */ } }
      tt.focus = null;
    }
    const tip = root.querySelector('[data-tt-tip]'), tipKey = tip ? tip.dataset.ttTip : null;
    if (tip && tipKey === tt.lastTip) tip.style.animation = 'none';
    tt.lastTip = tipKey;
    const note = root.querySelector('.tt-note'), noteKey = note ? note.textContent : null;
    if (note && noteKey === tt.lastNote) note.style.animation = 'none';
    tt.lastNote = noteKey;
    root.querySelectorAll('[data-tt-avs]').forEach(el => {
      const n = el.children.length, dots = el.parentNode.querySelectorAll('.tt-avdots i');
      if (n < 2) { if (el.parentNode.querySelector('.tt-avedit')) el.addEventListener('click', () => SC.go('t.photo')); return; }
      const at = () => Math.round(el.scrollLeft / el.clientWidth);
      el.addEventListener('scroll', () => dots.forEach((d, i) => d.classList.toggle('on', i === at())), { passive: true });
      el.addEventListener('click', () => el.scrollTo({ left: ((at() + 1) % n) * el.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
    });
  }
  /* Sheets are functions of state (engine re-renders them on every render, so chips, selects and checkboxes inside update in place). */
  function openSheet(fn, kind) { tt.sheetTop = 0; (kind === 'dlg' ? SC.dialog : SC.sheet)(fn); }
  function scr(id, def) {
    SC.screen(id, { role: 'pt', render: (s, c) => { ensure(s); return def.render(s, c).replace('class="scr', 'class="tt-s scr'); }, mount(root, s) { mountCommon(root, s); if (def.mount) def.mount(root, s); } });
  }
  const act = SC.action;

  function ensure(s) {
    const p = s.pt;
    if (p.photoDraft === undefined) p.photoDraft = null;
    if (!p.gallery) p.gallery = [];
    if (p.noteDraft === undefined) p.noteDraft = '';
    if (p.photoConsent === undefined) p.photoConsent = false;
    if (p.agreeTick === undefined) p.agreeTick = false;
    if (p.bioDraft === undefined) p.bioDraft = '';
    if (!p.postDraft) p.postDraft = { text: '', image: null, video: '' };
    if (p.signStep === undefined) p.signStep = 0;
    if (!p.zoneTab) p.zoneTab = 'Z03';
    if (!p.cal) p.cal = { view: 'week', week: 0, day: 2, month: 0 };
    if (!p.notif) p.notif = { offer: true, remind: true, news: false };
    if (!p.clock) p.clock = {};
    if (!p.schedule) p.schedule = { sent: false, blocks: [] };
    if (!p.posts) p.posts = [];
    if (p.certProg === undefined) p.certProg = true;
    if (p.certQr === undefined) p.certQr = true;
  }

  /* ---------- Facts ---------- */
  const FLOORS = [0, 120, 300, 600, 1000];
  // Boss (28 Oct): one table for every XP the app gives. Tips, missions, the history sheet and the awards all read it.
  // Each is given once, except the short note (once a day). Offers, visits and reviews give no XP.
  const XP = { signup: 60, photo: 40, bio: 30, post: 30, schedule: 40, verified: 50, note: 5 };
  SC.XP = XP;
  const lvl = xp => { let i = 0; FLOORS.forEach((f, k) => { if (xp >= f) i = k; }); return { level: i + 1, floor: FLOORS[i], next: FLOORS[i + 1] ?? null }; };
  const NET_TRIAL = 1199;
  const GOALS = { WALK: 'ฝึกลุกนั่งและเดิน', PAIN: 'ลดปวด', BALANCE: 'ทรงตัว กันล้ม', FALL: 'กันล้ม', STROKE: 'ฟื้นฟูหลังหลอดเลือดสมอง', NEURO: 'ฟื้นฟูระบบประสาท', SURGERY: 'ฟื้นฟูหลังผ่าตัด', POST_SURGERY: 'ฟื้นฟูหลังผ่าตัด', POST_HOSPITAL: 'ฟื้นตัวหลังออกจากโรงพยาบาล', NECK: 'ปวดคอ บ่า ไหล่', OFFICE: 'ปวดคอ บ่า ไหล่', BACK: 'ปวดหลัง', BREATH: 'ฝึกหายใจ', CAREGIVER: 'สอนญาติดูแล', ELDERLY: 'ดูแลผู้สูงอายุ' };
  const BIO_IDEAS = [['ดูแลมากี่ปี', 'เช่น ดูแลผู้สูงอายุที่บ้านมา 8 ปี'], ['ถนัดเคสแบบไหน', 'เช่น ถนัดฟื้นฟูหลังหลอดเลือดสมอง หรือปวดหลังเรื้อรัง'], ['สไตล์การดูแล', 'เช่น ชอบสอนผู้ดูแลให้ฝึกต่อได้ทุกวัน']];
  const POST_IDEAS = [['ท่าออกกำลังกายง่าย ๆ ที่แนะนำบ่อย', 'ท่าอะไร เหมาะกับใคร ทำวันละกี่ครั้ง และข้อควรระวัง 1 ข้อ'], ['สิ่งที่เพิ่งอ่านแล้วอยากแชร์', 'อ่านเรื่องอะไรมา สรุปให้คนไข้เข้าใจใน 2–3 บรรทัด และบอกแหล่งที่มา'], ['ทำไมถึงชอบดูแลคนไข้ที่บ้าน', 'เล่าเหตุผลหรือเรื่องที่ประทับใจของคุณเอง โดยไม่ระบุตัวคนไข้']];
  const VIDEO_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'tiktok.com', 'www.tiktok.com', 'vt.tiktok.com'];
  const videoOk = u => { if (!u || !u.trim()) return true; try { const x = new URL(u.trim()); return /^https?:$/.test(x.protocol) && VIDEO_HOSTS.includes(x.hostname); } catch (er) { return false; } };
  const SAMPLE_IMGS = ['a/elderly.jpg', 'a/neck.jpg', 'a/post-surgery.jpg'];

  const pname = s => { const n = (s.patient.name || '').trim() || 'ผู้รับบริการ'; return /^คุณ/.test(n) ? n : 'คุณ' + n; };
  const districtOf = s => s.patient.address.district || s.patient.district || 'บางนา';
  const goalText = s => { const g = [...new Set((s.patient.goals || []).map(k => GOALS[k]).filter(Boolean))]; if (s.patient.goalOther) g.push(s.patient.goalOther); return g.length ? g.join(' · ') : 'กายภาพบำบัดที่บ้าน'; };
  const offerForMe = s => !!(s.request && s.request.status === 'OFFERED' && (s.request.offerTo || []).includes('me'));
  const visitOf = (s, n) => s.visits.find(x => x.n == n);
  const zoneNamesFor = list => SC.ZONES.filter(z => z.districts.some(d => list.includes(d))).map(z => z.name);
  const photoSrc = p => p === 'sample' ? 'a/team-player.jpg' : p;
  /* IG-style profile photos and note (spec 2026-10-17 §3.2–3.3): main photo (team-checked) + up to 4 extras the PT adds for fun,
     tap or swipe to flip; a note bubble floats above and disappears by itself after 24 hours. */
  const DAY = 24 * 3600 * 1000, GALLERY_MAX = 4;
  const GALLERY_SAMPLES = ['a/self-starter.jpg', 'a/light-helper.jpg', 'a/companion.jpg', 'a/close-care.jpg'];
  const liveNote = p => (p.note && Date.now() - p.note.at < DAY ? p.note : null);
  const profPhotos = (p, mainShown = true) => [mainShown ? p.photo : null, ...(p.gallery || [])].filter(Boolean).map(photoSrc);
  function avStack(p, size, { mainShown = true, editNote = false } = {}) {
    const photos = profPhotos(p, mainShown), note = liveNote(p);
    const face = photos.length
      ? `<span class="tt-avs" data-tt-avs role="group" aria-label="รูปโปรไฟล์ ${photos.length} รูป${photos.length > 1 ? ' แตะหรือปัดดูรูปถัดไป' : ''}" style="width:${size}px;height:${size}px">${photos.map((x, i) => `<img src="${esc(x)}" alt="รูป ${esc(p.displayName)} ${i + 1}">`).join('')}</span>`
      : ui.avatar(p.displayName, null, size);
    const bubble = editNote
      ? `<button class="tt-note${note ? '' : ' empty'}" data-keep-anim data-act="noteOpen" aria-label="${note ? 'แก้โน้ต' : 'เพิ่มโน้ต'}">${note ? esc(note.text) : I('plus')}</button>`
      : note ? `<span class="tt-note" data-keep-anim>${esc(note.text)}</span>` : '';
    const dots = photos.length > 1 ? `<span class="tt-avdots" aria-hidden="true">${photos.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</span>` : '';
    const edit = editNote ? `<button class="tt-avedit" data-go="t.photo" aria-label="เปลี่ยนรูปโปรไฟล์">${I('camera')}</button>` : '';
    return `<span class="tt-avwrap" style="--av:${size}px">${bubble}${face}${edit}${dots}</span>`;
  }
  const verified = s => s.pt.status === 'VERIFIED';

  /* ---------- Calendar model: index 0 = Monday 19 ต.ค. 2569 (week of SC.TODAY = พฤหัสบดี 22 ต.ค.) ---------- */
  const MON = ['ต.ค.', 'พ.ย.', 'ธ.ค.'], MFULL = ['ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'], MEN = ['October', 'November', 'December'], MLEN = [31, 30, 31];
  const WD = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'], WDF = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const TODAY_IDX = 3, H0 = 7, H1 = 20, HP = 46;
  const wday = idx => ((idx % 7) + 7) % 7;
  const weekOf = idx => Math.floor(idx / 7);
  function dateOf(idx) { let d = 19 + idx, m = 0; while (m < 2 && d > MLEN[m]) { d -= MLEN[m]; m++; } return { d, m }; }
  function idxOfDM(d, m) { let idx = d - 19; for (let i = 0; i < m; i++) idx += MLEN[i]; return idx; }
  function idxOf(str) { const r = /(\d+)\s*(ต\.ค\.|พ\.ย\.|ธ\.ค\.)/.exec(str || ''); return r ? idxOfDM(+r[1], MON.indexOf(r[2])) : null; }
  const dShort = idx => { const x = dateOf(idx); return `${WD[wday(idx)]}. ${x.d} ${MON[x.m]}`; };
  const dLong = idx => { const x = dateOf(idx); return `${WDF[wday(idx)]} ${x.d} ${MON[x.m]}`; };
  const thLong = str => { const i = idxOf(str); if (i == null) return str; const x = dateOf(i); return `${x.d} ${MFULL[x.m]} 2569`; };
  const enLong = str => { const i = idxOf(str); if (i == null) return str; const x = dateOf(i); return `${x.d} ${MEN[x.m]} 2026`; };
  const shortDate = str => { const i = idxOf(str); if (i == null) return str; const x = dateOf(i); return `${x.d} ${MON[x.m]} 69`; };
  const toMin = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + (m || 0); };
  const hhmm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const visitSpan = v => { const [a, b] = String(v.time).split(/[–-]/); return { start: a.trim(), end: (b || a).trim() }; };

  function blocksOn(s, idx) {
    const w = weekOf(idx), d = wday(idx);
    return s.pt.schedule.blocks.map((b, i) => ({ ...b, i })).filter(b => b.day === d && (b.repeat ? w >= (b.week ?? 0) : w === (b.week ?? 0)));
  }
  const visitsOn = (s, idx) => s.visits.filter(v => idxOf(v.date) === idx);

  /* ---------- Shared bits ---------- */
  function ring(xp, size = 76) {
    const L = lvl(xp); const pct = L.next ? (xp - L.floor) / (L.next - L.floor) : 1;
    const r = size / 2 - 6, c = 2 * Math.PI * r;
    return `<span class="tt-ringw" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><defs><linearGradient id="ttg" x1="0" x2="1"><stop offset="0" stop-color="#e9cda1"/><stop offset="1" stop-color="#c8a066"/></linearGradient></defs><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#f1e8d6" stroke-width="7"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="url(#ttg)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(c * pct).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><b>${L.level}<small>ระดับ</small></b></span>`;
  }
  function qrSvg(seed) {
    const n = 25; let h = 0; for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
    const inBox = (x, y, bx, by) => x >= bx && x < bx + 7 && y >= by && y < by + 7;
    const finder = (x, y) => inBox(x, y, 0, 0) || inBox(x, y, n - 7, 0) || inBox(x, y, 0, n - 7);
    let r = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let on;
      if (finder(x, y)) { const bx = x < 7 ? 0 : n - 7, by = y < 7 ? 0 : n - 7; const dx = x - bx, dy = y - by; on = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4); }
      else on = rnd() > .52;
      if (on) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" role="img" aria-label="QR สำหรับสแกนจ่าย" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><g fill="#043928">${r}</g></svg>`;
  }
  const lockNote = text => `<p class="small row tt-top">${I('lock')}<span>${text}</span></p>`;

  /* ======================================================================
     t.join · ทางเข้านักกายภาพ (แยกจากหน้าผู้รับบริการ)
     ====================================================================== */
  /* PT entrance (Boss 21 Oct 2026, map version). Ties to the Facebook page "SynaClair เชื่อมนักกายภาพบำบัดถึงบ้านคุณ".
     First screen: headline, the real Bangkok map (50 districts in Palm's 6 zones) with PTs dropping in as pins, one LINE button.
     Below: an election-style network map (zones → districts → who works there → their profile), then "your profile" with
     empty slots (no price: this page is public). Map data: OpenGISData-Thailand (CC BY 4.0). */
  document.head.insertAdjacentHTML('beforeend', `<style>
  .scr.jn { position: relative; isolation: isolate; display: block; background: #fff; color: var(--ink); overflow-x: clip; }
  .jn-sec { max-width: 1180px; margin: 0 auto; padding: 0 20px; box-sizing: border-box; }
  .jn-nav { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; padding-bottom: 4px; }
  .jn-nav img { height: 30px; width: auto; }
  .jn-nav small { font: 600 13px var(--display); color: #8a5a1f; background: #faf3e7; padding: 5px 12px; border-radius: 99px; box-shadow: inset 0 0 0 1px #efdcb8; }
  .jn-hero { position: relative; display: grid; grid-template-areas: "txt" "stage" "act"; gap: 10px; padding-top: 12px; padding-bottom: 30px; }
  .jn-stage { grid-area: stage; position: relative; padding-bottom: 150px; }
  .jn-stage .jn-prof { position: absolute; z-index: 2; right: 2%; bottom: 0; width: min(270px, 74%); }
  .jn-act { grid-area: act; display: grid; justify-items: start; margin-top: 8px; }

  .jn-aur { position: absolute; z-index: -1; inset: 18% -20% -10%; filter: blur(56px); pointer-events: none; }
  .jn-aur i { position: absolute; border-radius: 50%; opacity: .8; }
  .jn-aur i:nth-child(1) { width: 60%; height: 50%; left: 6%; top: 12%; background: #d4f0e1; animation: jnD1 14s var(--float) infinite alternate; }
  .jn-aur i:nth-child(2) { width: 50%; height: 46%; right: 4%; top: 34%; background: #f6e5c4; animation: jnD2 17s var(--float) infinite alternate; }
  .jn-aur i:nth-child(3) { width: 40%; height: 40%; left: 40%; top: 0; background: #e2f4ea; animation: jnD3 19s var(--float) infinite alternate; }
  @keyframes jnD1 { to { transform: translate(16%, 10%) scale(1.15); } } @keyframes jnD2 { to { transform: translate(-14%, -10%) scale(1.18); } } @keyframes jnD3 { to { transform: translate(10%, 14%) scale(.9); } }
  .jn-txt { grid-area: txt; }
  .jn-txt h1 { margin: 0; font: 700 clamp(27px, 7.6cqi, 34px)/1.2 var(--display); letter-spacing: -.015em; color: var(--forest); }
  .jn-txt h1 span { color: var(--em); }
  .jn-txt .nb, .jn-sub .nb { white-space: nowrap; }
  .jn-txt p { margin: 10px 0 0; font-size: 16px; line-height: 1.6; color: #46605a; max-width: 36ch; }
  
  .jn-cta { position: relative; overflow: hidden; display: flex; align-items: center; gap: 14px; width: min(100%, 470px); padding: 14px 14px 14px 16px; border: 0; border-radius: 24px; background: linear-gradient(135deg, #06c755, #04b14b); color: #fff; text-align: left; box-shadow: 0 18px 40px #06c75547; transition: transform .3s var(--ease); }
  .jn-cta:hover { transform: translateY(-3px); }
  .jn-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, #ffffff40 50%, transparent 70%); transform: translateX(-100%); animation: jnShine 3.6s 1s infinite; pointer-events: none; }
  .jn-cta .ic { flex: none; width: 54px; height: 54px; border-radius: 17px; background: #fff; color: #06c755; display: grid; place-items: center; box-shadow: 0 6px 14px #0003; } .jn-cta .ic svg { width: 28px; height: 28px; }
  .jn-cta strong { display: block; font: 700 22px/1.25 var(--display); color: #fff; } .jn-cta small { display: block; font-size: 14.5px; opacity: .95; }
  .jn-cta .ar { flex: none; margin-left: auto; width: 44px; height: 44px; border-radius: 50%; background: #ffffff2e; display: grid; place-items: center; animation: jnNudge 1.8s infinite; }
  .jn-alt { margin-top: 8px; display: inline-flex; gap: 6px; align-items: center; padding: 6px 0; border: 0; background: none; color: var(--em); font: 600 14.5px var(--display); }
  /* Map */
  .jn-map { position: relative; }
  .jn-map svg { display: block; width: 100%; height: auto; overflow: visible; }
  .jn-d { stroke: #fff; stroke-width: 2.2; stroke-linejoin: round; transition: fill .4s, opacity .4s; }
  .jn-map.hero .jn-d { fill: var(--zf); transition: fill .5s var(--ease); }
  .jn-map.hero .jn-d.hot { fill: #0b6e4f; }
  .jn-pop { position: absolute; z-index: 3; left: 0; top: 0; display: flex; gap: 8px; align-items: center; padding: 8px 12px 8px 8px; border-radius: 16px; background: #fff; box-shadow: 0 14px 30px #0730232e; white-space: nowrap; opacity: 0; pointer-events: none; --ax: 50%; }
  .jn-pop::after { content: ''; position: absolute; left: var(--ax); bottom: -6px; width: 12px; height: 12px; background: #fff; transform: translateX(-50%) rotate(45deg); border-radius: 2px; }
  .jn-pop.down::after { bottom: auto; top: -6px; }
  .jn-pop .ap { width: 30px; height: 30px; border-radius: 9px; background: #06c755; color: #fff; display: grid; place-items: center; flex: none; } .jn-pop .ap svg { width: 17px; height: 17px; }
  .jn-pop b { display: block; font: 600 12.5px var(--display); color: var(--forest); } .jn-pop small { display: block; font-size: 12px; color: var(--sub); }
  .jn-pop.show { animation: jnPop 2.6s var(--ease) both; }
  .jn-pop.show.down { animation-name: jnPopDown; }
  .jn-dot { position: absolute; z-index: 3; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px #0b6e4f, 0 4px 10px #0730233a; opacity: 0; pointer-events: none; }
  .jn-dot.show { animation: jnDot 2.6s var(--ease) both; }
  @keyframes jnDot { 0% { opacity: 0; transform: scale(.4); } 10%, 82% { opacity: 1; transform: none; } 100% { opacity: 0; } }
  @keyframes jnPopDown { 0% { opacity: 0; transform: translateY(-8px) scale(.85); } 12% { opacity: 1; transform: translateY(2px); } 18%, 80% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(6px); } }
  @keyframes jnPop { 0% { opacity: 0; transform: translateY(10px) scale(.85); } 12% { opacity: 1; transform: translateY(-2px); } 18%, 80% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-6px); } }
  .jn-pin .jn-drop { animation: jnDrop .8s var(--ease) both; animation-delay: calc(var(--i) * 140ms + 300ms); }
  .jn-pin .pulse { fill: #0b6e4f; opacity: 0; animation: jnPulse 2.6s ease-out infinite; animation-delay: calc(var(--i) * 140ms + 1.1s); transform-box: fill-box; transform-origin: center; }
  .jn-pin .head { fill: #00583e; stroke: #fff; stroke-width: 3; }
  .jn-pin.me .head { fill: #c8a066; }
  .jn-pin text { font: 700 17px var(--display); fill: #fff; text-anchor: middle; dominant-baseline: central; }
  .jn-toast { position: absolute; z-index: 3; transform: translate(-50%, calc(-100% - 34px)); display: flex; gap: 8px; align-items: center; padding: 7px 11px 7px 7px; border-radius: 14px; background: #fff; box-shadow: 0 12px 28px #07302326; font: 600 12px var(--display); color: var(--forest); white-space: nowrap; opacity: 0; animation: jnToast 9s var(--ease) infinite; }
  .jn-toast span { width: 24px; height: 24px; border-radius: 8px; background: #06c755; color: #fff; display: grid; place-items: center; } .jn-toast span svg { width: 14px; height: 14px; }
  .jn-stat { position: absolute; right: 0; bottom: 2%; display: grid; gap: 1px; padding: 9px 13px; border-radius: 16px; background: #ffffffe8; box-shadow: 0 12px 28px #0730231c; }
  .jn-stat b { font: 700 18px var(--display); color: var(--forest); } .jn-stat small { font-size: 12px; color: var(--sub); }
  @keyframes jnDrop { 0% { opacity: 0; transform: translateY(-60px); } 70% { opacity: 1; transform: translateY(4px); } 100% { transform: none; } }
  @keyframes jnPulse { 0% { opacity: .45; transform: scale(.4); } 100% { opacity: 0; transform: scale(2.4); } }
  @keyframes jnToast { 0%, 4% { opacity: 0; transform: translate(-50%, calc(-100% - 24px)) scale(.9); } 8%, 28% { opacity: 1; transform: translate(-50%, calc(-100% - 34px)); } 33%, 100% { opacity: 0; transform: translate(-50%, calc(-100% - 40px)); } }
  @keyframes jnShine { 40%, 100% { transform: translateX(100%); } } @keyframes jnNudge { 50% { transform: translateX(5px); } }
  /* Network explorer */
  .jn-net { padding-top: 34px; padding-bottom: 34px; background: linear-gradient(180deg, #f7fbf9, #fff); }
  .jn-h2 { margin: 0; font: 700 clamp(24px, 4cqi, 34px)/1.25 var(--display); color: var(--forest); letter-spacing: -.015em; }
  .jn-sub { margin: 6px 0 0; color: var(--sub); font-size: 15.5px; }
  .jn-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
  .jn-stats div { padding: 12px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 1px var(--line); }
  .jn-stats b { display: block; font: 700 26px/1.1 var(--display); color: var(--forest); } .jn-stats span { font-size: 12.5px; color: var(--sub); }
  .jn-zones { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; margin: 16px -20px 0; padding: 2px 20px 4px; }
  .jn-zones button { flex: none; display: flex; gap: 6px; align-items: center; min-height: 40px; padding: 0 14px; border: 1.5px solid var(--mint2); border-radius: 99px; background: #fff; font: 600 13.5px var(--display); color: var(--ink); }
  .jn-zones button i { font-style: normal; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 99px; background: var(--mint); color: var(--em); font-size: 11.5px; display: grid; place-items: center; }
  .jn-zones button.on { background: var(--g-sheen), var(--g-em); border-color: var(--em); color: #fff; } .jn-zones button.on i { background: #ffffff2e; color: #fff; }
  .jn-grid { display: grid; gap: 14px; margin-top: 14px; }
  .jn-map.ex .jn-d { fill: var(--cf); cursor: pointer; }
  .jn-map.ex .jn-d.dim { opacity: .28; }
  .jn-map.ex .jn-d.sel { stroke: var(--forest); stroke-width: 4; }
  .jn-map.ex .jn-d:hover { filter: brightness(.96); }
  .jn-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; font-size: 12.5px; color: var(--sub); }
  .jn-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 4px; margin-right: 5px; vertical-align: -1px; }
  .jn-list { display: grid; gap: 8px; align-content: start; }
  .jn-list h3 { margin: 0; font: 600 17px var(--display); color: var(--forest); } .jn-list .cnt { font-size: 13px; color: var(--sub); }
  .jn-pt { display: flex; gap: 12px; align-items: center; width: 100%; padding: 10px 12px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 6px 16px #07302312; text-align: left; }
  .jn-pt .grow b { display: block; font-size: 15px; color: var(--forest); } .jn-pt .grow small { font-size: 12.5px; color: var(--sub); }
  .jn-empty { padding: 16px; border-radius: 16px; background: #fff; box-shadow: inset 0 0 0 1.5px dashed; box-shadow: inset 0 0 0 1.5px var(--mint2); color: var(--sub); font-size: 14.5px; }
  .jn-empty button { margin-top: 6px; border: 0; background: none; padding: 4px 0; color: var(--em); font: 600 14.5px var(--display); text-decoration: underline; text-underline-offset: 3px; }
  .jn-note { margin-top: 10px; font-size: 12.5px; color: var(--mute); }
  /* Your profile */
  .jn-you { display: grid; gap: 22px; padding-top: 38px; padding-bottom: 40px; }
  .jn-you ul { margin: 12px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
  .jn-you li { display: flex; gap: 10px; align-items: center; font-size: 15.5px; color: var(--ink); } .jn-you li span { width: 32px; height: 32px; border-radius: 10px; background: var(--mint); color: var(--em); display: grid; place-items: center; flex: none; }
  .jn-prof { position: relative; justify-self: center; width: min(340px, calc(100% - 16px)); margin-top: 26px; }
  .jn-card { position: relative; border-radius: 22px; background: #fff; box-shadow: 0 30px 60px #07302326, 0 4px 12px #0730230f; overflow: hidden; transform: rotate(-3deg); animation: jnFloat 6s var(--float) infinite; }
  .jn-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 38%, #ffffffa0 50%, transparent 62%); transform: translateX(-130%); animation: jnSheen 6.5s 1.6s var(--float) infinite; pointer-events: none; }
  @keyframes jnFloat { 0%, 100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(-1.6deg) translateY(-10px); } }
  @keyframes jnSheen { 0%, 65% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }
  .jn-cover { height: 64px; padding: 10px 14px; box-sizing: border-box; background: linear-gradient(120deg, #00583e, #4f9a7a 55%, #f2e3c6); } .jn-cover span { font: 600 12px var(--display); color: #fff; letter-spacing: .02em; }
  .jn-who { display: flex; gap: 12px; align-items: flex-end; padding: 0 14px; margin-top: -30px; }
  .jn-av { position: relative; width: 74px; height: 74px; gap: 1px; border-radius: 50%; flex: none; display: grid; place-items: center; align-content: center; background: #f7faf8; color: var(--em); box-shadow: 0 0 0 4px #fff, 0 8px 18px #07302322; }
  .jn-av svg { width: 18px; height: 18px; } .jn-av small { font-size: 9.5px !important; line-height: 1.2; }
  .jn-av .ring { position: absolute; inset: 3px; border-radius: 50%; border: 2px dashed #9fd1b8; animation: jnSpin 14s linear infinite; }
  @keyframes jnSpin { to { transform: rotate(360deg); } } .jn-av small { font: 600 10px var(--display); color: var(--sub); }
  .jn-name { padding-bottom: 10px; display: grid; gap: 2px; min-width: 0; } .jn-name small { font-size: 12px; color: var(--sub); } .jn-vtxt { color: var(--em); font-weight: 600; white-space: nowrap; } .jn-vtxt svg { width: 12px; height: 12px; vertical-align: -1px; }
  .jn-slot.sm { font-size: 12.5px; border-radius: 99px; }
  .jn-slot { position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 10px; border: 1.5px dashed #c5dccf; color: var(--forest); font: 600 13.5px var(--display); background: #fbfdfc; }
  .jn-slot::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, #e8f1ec 50%, transparent 70%); transform: translateX(-120%); animation: jnSlot 4.8s var(--float) infinite; }
  .jn-slot [data-jn-type] { white-space: nowrap; min-height: 1.4em; }
  .jn-slot .caret { width: 2px; height: 1em; margin-left: 2px; background: var(--g-sheen), var(--g-em); animation: jnCaret 1.1s steps(1) infinite; }
  @keyframes jnSlot { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
  @keyframes jnCaret { 50% { opacity: 0; } } .jn-slot svg { width: 14px; height: 14px; color: var(--em); }
  .jn-body { padding: 10px 14px 4px; display: grid; gap: 10px; }
  .jn-ver { justify-self: start; display: inline-flex; gap: 4px; align-items: center; padding: 3px 10px; border-radius: 99px; background: #e8f1ec; color: var(--em); font: 600 12.5px var(--display); }
  .jn-works { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .jn-works span { animation: jnBob 3.6s var(--float) infinite; aspect-ratio: 1.3; border-radius: 12px; border: 1.5px dashed #c5dccf; background: #fbfdfc; display: grid; place-items: center; align-content: center; gap: 2px; color: var(--em); } .jn-works small { color: var(--sub); font: 600 11px var(--display); }
  .jn-works span:nth-child(2) { animation-delay: .5s; } .jn-works span:nth-child(3) { animation-delay: 1s; }
  @keyframes jnBob { 50% { transform: translateY(-3px); } }
  .jn-you .jn-ydrop { animation: jnDrop .9s var(--ease) both; animation-delay: 2.2s; }
  .jn-you .pulse { fill: #c8a066; opacity: 0; animation: jnPulse 2.4s ease-out infinite 3s; transform-box: fill-box; transform-origin: center; }
  .jn-you .head { fill: #c8a066; stroke: #fff; stroke-width: 3; }
  .jn-you text { font: 700 12px var(--display); fill: #fff; text-anchor: middle; dominant-baseline: central; }
  .jn-noti { position: absolute; z-index: 3; left: -26px; top: -40px; width: 212px; display: flex; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 18px; background: #ffffffee; box-shadow: 0 18px 40px #07302326; animation: jnNoti 6s var(--ease) infinite; }
  .jn-noti .ap { width: 34px; height: 34px; border-radius: 10px; background: #06c755; color: #fff; display: grid; place-items: center; flex: none; }
  .jn-noti b { display: block; font-size: 13px; color: #111; } .jn-noti small { display: block; font-size: 12.5px; color: #333; }
  @keyframes jnNoti { 0% { opacity: 0; transform: translateY(-14px); } 8%, 80% { opacity: 1; transform: none; } 90%, 100% { opacity: 0; transform: translateY(-8px); } }
  .jn-foot { padding-top: 18px; padding-bottom: 96px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--mute); display: grid; gap: 6px; }
  .jn-foot button { justify-self: start; border: 0; background: none; padding: 4px 0; color: var(--em); font: 600 13px var(--display); text-decoration: underline; text-underline-offset: 3px; }
  /* Sticky LINE bar after the hero button scrolls away (only one LINE button is ever on screen) */
  .jn-sticky { position: sticky; bottom: 0; z-index: 20; padding: 10px 16px 14px; background: linear-gradient(180deg, #ffffff00, #fff 30%); transform: translateY(110%); transition: transform .35s var(--ease); pointer-events: none; }
  .jn-sticky.show { transform: none; pointer-events: auto; }
  .jn-cardcta { padding: 10px 12px 12px; }
  .jn-cardcta .jn-cta { width: 100%; padding: 10px 12px; border-radius: 18px; box-shadow: 0 12px 26px #06c75540; } .jn-cardcta .jn-cta .ic { width: 44px; height: 44px; border-radius: 13px; } .jn-cardcta .jn-cta strong { font-size: 19px; } .jn-cardcta .jn-cta .ar { width: 38px; height: 38px; }
  .jn-sticky .jn-cta { width: min(100%, 440px); margin: 0 auto; padding: 10px 12px 10px 12px; box-shadow: 0 12px 28px #06c75540; } .jn-sticky .jn-cta .ic { width: 42px; height: 42px; border-radius: 13px; } .jn-sticky .jn-cta strong { font-size: 18px; } .jn-sticky .jn-cta .ar { width: 36px; height: 36px; }
  /* Profile sheet (local, so the map keeps its state) */
  .jn-modal { position: absolute; inset: 0; z-index: 40; background: #07302355; display: none; align-items: flex-end; justify-content: center; }
  .jn-modal.open { display: flex; animation: fade .2s; }
  .jn-sheet { width: min(560px, 100%); max-height: 86%; overflow-y: auto; background: #fff; border-radius: 24px 24px 0 0; animation: rise .3s var(--ease); }
  .jn-sheet .cv { height: 90px; background: linear-gradient(120deg, #00583e, #4f9a7a 55%, #f2e3c6); position: relative; }
  .jn-sheet .x { position: absolute; right: 12px; top: 12px; width: 40px; height: 40px; border: 0; border-radius: 50%; background: #fff; color: var(--forest); display: grid; place-items: center; }
  .jn-sheet .bd { padding: 0 18px 22px; display: grid; gap: 10px; }
  .jn-sheet .av { position: relative; margin-top: -38px; width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; font: 700 30px var(--display); box-shadow: 0 0 0 4px #fff; }
  .jn-sheet h3 { margin: 0; font: 700 21px var(--display); color: var(--forest); }
  .jn-sheet .zs { display: flex; flex-wrap: wrap; gap: 6px; } .jn-sheet .zs span { padding: 4px 10px; border-radius: 99px; background: var(--mint); font: 600 12.5px var(--display); color: var(--forest); }
  .jn-sheet .post { border-radius: 16px; overflow: hidden; background: var(--mint); } .jn-sheet .post img { display: block; width: 100%; aspect-ratio: 16/9; object-fit: cover; } .jn-sheet .post p { margin: 0; padding: 12px 14px; font: 600 15px var(--display); color: var(--forest); }
  @container (min-width: 720px) {
    .jn-sec { padding-left: 32px; padding-right: 32px; } .jn-nav { padding-top: 22px; }
    .jn-hero { grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); grid-template-areas: "txt stage" "act stage"; align-items: center; column-gap: 24px; row-gap: 22px; padding-top: 22px; padding-bottom: 48px; }
    .jn-txt { align-self: end; } .jn-act { align-self: start; margin-top: 0; }
    .jn-stage { padding-bottom: 60px; }
    .jn-stage .jn-prof { right: -2%; bottom: 0; width: 280px; }
    .jn-txt h1 { font-size: 30px; } .jn-txt p { font-size: 17px; }
    .jn-aur { inset: -10% -14% -10% 42%; }
  }
  @container (min-width: 960px) {
    .jn-sec { padding-left: 44px; padding-right: 44px; } .jn-nav { padding-top: 26px; }
    .jn-txt h1 { font-size: clamp(36px, 3.9cqi, 50px); } .jn-txt p { font-size: 18px; }
    .jn-stage .jn-prof { width: 300px; }
    .jn-grid { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); align-items: start; }
    .jn-zones { margin: 18px 0 0; padding: 2px 0 4px; flex-wrap: wrap; }
    .jn-you { grid-template-columns: 1fr 1fr; align-items: center; }
    .jn-modal { align-items: center; } .jn-sheet { border-radius: 24px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .jn-aur i, .jn-cta::after, .jn-cta .ar, .jn-pin .pulse { animation: none; }
    .jn-pin .jn-drop { animation: fade .4s both; }
    .jn-toast, .jn-noti { animation: none; opacity: 1; }
    .jn-card, .jn-card::after, .jn-av .ring, .jn-slot::after, .jn-slot .caret, .jn-works span, .jn-you .pulse { animation: none; }
    .jn-you .jn-ydrop { animation: fade .4s both; }
    .jn-toast:not(:first-of-type) { display: none; }
  }
  </style>`);
  const ZFILL = { Z01: '#cdeadb', Z02: '#dff2e7', Z03: '#c3e5d3', Z04: '#e9f6ef', Z05: '#f3e5c8', Z06: '#eedbb5' };
  const jnSel = { zone: 'ALL', dist: null };
  const jnPeople = s => { const list = SC.SAMPLE_PTS.map(p => ({ ...p, sample: true }));
    if (s.pt.status === 'VERIFIED') list.unshift({ id: 'me', name: s.pt.displayName || 'คุณ', initials: (s.pt.displayName || 'ค').replace(/^(กภ\.|PT)\s*/, '').slice(0, 1), hue: 40, zones: s.pt.zones, bio: s.pt.bio, me: true, post: s.pt.posts[0] ? { text: s.pt.posts[0].text, image: s.pt.posts[0].image } : null });
    return list; };
  const distOf = n => (window.BKK ? BKK.d.find(d => d.n === n) : null);
  const zoneName = code => (SC.ZONES.find(z => z.code === code) || {}).name || '';
  const zoneOfDist = n => (SC.ZONES.find(z => z.districts.includes(n)) || {}).code;
  const covers = (pt, n) => pt.zones.includes(n) || pt.zones.includes(zoneName(zoneOfDist(n)));
  function jnMapSvg(mode, people) {
    if (!window.BKK) return '';
    const sel = jnSel; const count = n => people.filter(p => covers(p, n)).length;
    const paths = BKK.d.map(d => {
      if (mode === 'hero') return `<path class="jn-d" d="${d.p}" style="--zf:${ZFILL[d.z]}" data-hn="${esc(d.n)}"/>`;
      const c = count(d.n); const fill = c >= 2 ? '#2f8a66' : c === 1 ? '#a9cbb9' : '#eef3f0';
      const dim = sel.zone !== 'ALL' && d.z !== sel.zone; const on = sel.dist === d.n;
      return `<path class="jn-d${dim ? ' dim' : ''}${on ? ' sel' : ''}" d="${d.p}" style="--cf:${fill}" data-jd="${esc(d.n)}"><title>${esc(d.n)} · นักกายภาพ ${c} คน</title></path>`;
    }).join('');
    const pins = mode === 'hero' ? '' : people.map((p, i) => { const d = distOf(p.zones[0]); if (!d) return ''; if (mode === 'ex' && sel.zone !== 'ALL' && d.z !== sel.zone) return '';
      return `<g class="jn-pin${p.me ? ' me' : ''}" style="--i:${i}" transform="translate(${d.x} ${d.y}) scale(${mode === 'hero' ? 1.55 : 1.25})"><g class="jn-drop"><circle class="pulse" r="22"/><path class="head" d="M0 0 C -6 -12 -20 -18 -20 -32 A 20 20 0 1 1 20 -32 C 20 -18 6 -12 0 0 Z"/><text y="-32">${esc(p.initials)}</text></g></g>`; }).join('');
    const you = false && distOf('สะพานสูง') ? (() => { const d = distOf('สะพานสูง'); return `<g class="jn-you" transform="translate(${d.x} ${d.y}) scale(1.7)"><g class="jn-ydrop"><circle class="pulse" r="22"/><path class="head" d="M0 0 C -6 -12 -20 -18 -20 -32 A 20 20 0 1 1 20 -32 C 20 -18 6 -12 0 0 Z"/><text y="-32">คุณ</text></g></g>`; })() : '';
    return `<svg viewBox="0 0 ${BKK.w} ${BKK.h}" role="img" aria-label="แผนที่กรุงเทพ 6 โซน 50 เขต พร้อมตำแหน่งนักกายภาพในเครือข่าย">${paths}${pins}${you}</svg>`;
  }
  function jnExplorer(s) {
    const people = jnPeople(s);
    const inZone = z => people.filter(p => p.zones.some(n => zoneOfDist(n) === z || n === zoneName(z)));
    const shown = jnSel.dist ? people.filter(p => covers(p, jnSel.dist)) : jnSel.zone === 'ALL' ? people : inZone(jnSel.zone);
    const title = jnSel.dist ? `เขต${jnSel.dist}` : jnSel.zone === 'ALL' ? 'ทุกโซน' : zoneName(jnSel.zone);
    const covered = (window.BKK ? BKK.d : []).filter(d => people.some(p => covers(p, d.n))).length;
    const zonesOn = SC.ZONES.filter(z => inZone(z.code).length).length;
    return `<div class="jn-stats"><div><b>${people.length}</b><span>นักกายภาพในเครือข่าย</span></div><div><b>${zonesOn}/6</b><span>โซนที่มีคนรับงาน</span></div><div><b>${covered}/50</b><span>เขตที่ครอบคลุม</span></div></div>
      <div class="jn-zones" role="tablist" aria-label="เลือกโซน"><button class="${jnSel.zone === 'ALL' && !jnSel.dist ? 'on' : ''}" data-jz="ALL">ทั้งหมด <i>${people.length}</i></button>${SC.ZONES.map(z => `<button class="${jnSel.zone === z.code && !jnSel.dist ? 'on' : ''}" data-jz="${z.code}">${z.name} <i>${inZone(z.code).length}</i></button>`).join('')}</div>
      <div class="jn-grid">
        <div><div class="jn-map ex">${jnMapSvg('ex', people)}</div>
          <div class="jn-legend"><span><i style="background:#2f8a66"></i>2 คนขึ้นไป</span><span><i style="background:#a9cbb9"></i>1 คน</span><span><i style="background:#eef3f0;box-shadow:inset 0 0 0 1px #dfe7e3"></i>ยังไม่มี</span><span>แตะเขตเพื่อดูว่าใครรับงาน</span></div></div>
        <div class="jn-list"><div><h3>${esc(title)}</h3><span class="cnt">${shown.length ? `นักกายภาพ ${shown.length} คน` : ''}</span></div>
          ${shown.length ? shown.map(p => `<button class="jn-pt" data-jp="${p.id}">${ui.avatar(p.name, p.me ? s.pt.photo : null, 48, p.hue)}<span class="grow"><b>${esc(p.name)}</b><small>${esc(p.zones.slice(0, 3).join(' · '))}</small></span>${p.me ? '<span class="pill gold">คุณ</span>' : ui.sample()}</button>`).join('')
            : `<div class="jn-empty">ยังไม่มีนักกายภาพรับงานใน${esc(title)}<br><button data-jtop>สมัครเป็นคนแรกของเขตนี้ ↑</button></div>`}
        </div>
      </div>
      <p class="jn-note">ห้องซ้อมใช้ข้อมูลตัวอย่าง · ระบบจริงแสดงเฉพาะนักกายภาพที่ตรวจใบประกอบวิชาชีพแล้ว</p>`;
  }
  function jnProfile(s, id) {
    const p = jnPeople(s).find(x => x.id === id); if (!p) return '';
    return `<div class="jn-sheet" role="dialog" aria-modal="true" aria-label="โปรไฟล์ ${esc(p.name)}"><div class="cv"><button class="x" data-jclose aria-label="ปิด">${I('x')}</button></div>
      <div class="bd"><span class="av" style="background:hsl(${p.hue} 45% 88%);color:hsl(${p.hue} 45% 28%)">${esc(p.initials)}</span>
        <div class="row" style="gap:8px;flex-wrap:wrap"><h3>${esc(p.name)}</h3>${p.me ? '<span class="pill gold">คุณ</span>' : ui.sample()}</div>
        <span class="ver">${I('badge-check')}ตรวจสอบโดย SynaClair</span>
        ${p.bio ? `<p class="p" style="margin:0">${esc(p.bio)}</p>` : ''}
        <div class="zs">${p.zones.map(z => `<span>${esc(z)}</span>`).join('')}</div>
        ${p.post ? `<div class="post">${p.post.image ? `<img src="${esc(p.post.image.startsWith('a/') || p.post.image.startsWith('data:') ? p.post.image : 'a/' + p.post.image)}" alt="">` : ''}<p>${esc(p.post.text)}</p></div>` : ''}
        <p class="small" style="margin:0">คนไข้เห็นหน้านี้ แล้วกด "ขอคนนี้" ผ่านการประเมินอาการ ไม่มีแชตตรง</p>
      </div></div>`;
  }
  scr('t.join', {
    render(s) {
      const known = s.pt.status !== 'NONE'; const people = jnPeople(s);
      return `<div class="scr wide jn">
        <header class="jn-sec jn-nav"><img src="a/synaclair-logo.svg" alt="SynaClair"><small>สำหรับนักกายภาพบำบัด</small></header>
        <section class="jn-sec jn-hero" aria-labelledby="jn-title">
          <div class="jn-aur" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="jn-txt"><h1 id="jn-title">เชื่อมนักกายภาพบำบัด<br><span>ถึงบ้านคนไข้</span></h1>
            <p><span class="nb">สร้างตัวตนของคุณให้คนไข้เห็น</span> <span class="nb">รับเคสโฮมในเขตที่เลือกเอง</span> <span class="nb">งานใหม่แจ้งผ่าน LINE</span></p></div>
          <div class="jn-stage">
            <div class="jn-map hero">${jnMapSvg('hero', people)}<span class="jn-dot" data-jn-dot aria-hidden="true"></span><div class="jn-pop" data-jn-pop aria-hidden="true"><span class="ap">${I('message-circle')}</span><span><b>งานใหม่ในเขตที่คุณรับ</b><small data-jn-pop-d>เขตจตุจักร</small></span></div></div>
            <div class="jn-prof" aria-hidden="true">
              <article class="jn-card">
                <div class="jn-cover"><span>โปรไฟล์ของคุณ</span></div>
                <div class="jn-who"><span class="jn-av"><i class="ring"></i>${I('camera')}<small>รูปของคุณ</small></span>
                  <div class="jn-name"><span class="jn-slot"><span data-jn-type>ชื่อของคุณ</span><i class="caret"></i></span></div></div>
                <div class="jn-body">
                  <span class="jn-ver">${I('badge-check')}ตรวจสอบโดย SynaClair</span>
                  <div class="row wrap" style="gap:6px"><span class="jn-slot sm">${I('map-pin')}เขตที่คุณรับ</span><span class="jn-slot sm">${I('plus')}เพิ่มเขต</span></div>
                  <div class="jn-works"><span>${I('image')}<small>รูป</small></span><span>${I('play')}<small>คลิป</small></span><span>${I('file-text')}<small>บทความ</small></span></div>
                </div>
              </article>
            </div>
          </div>
          <div class="jn-act">
            <button class="jn-cta" data-go="t.line" data-jn-main><span class="ic">${I('message-circle')}</span><span><strong>${known ? 'เข้าใช้งานด้วย LINE' : 'สมัครด้วย LINE'}</strong><small>${known ? 'บัญชีนี้มีโปรไฟล์แล้ว' : 'ฟรี · ไม่ต้องสัมภาษณ์'}</small></span><span class="ar">${I('arrow-right')}</span></button>
            <button class="jn-alt" data-go="p.loading">${I('house')}หานักกายภาพให้คนที่บ้าน? ไปหน้าผู้รับบริการ</button>
          </div>
        </section>
        <section class="jn-net" aria-labelledby="jn-net-title"><div class="jn-sec">
          <h2 class="jn-h2" id="jn-net-title">เครือข่ายนักกายภาพ SynaClair</h2>
          <p class="jn-sub"><span class="nb">กรุงเทพแบ่งเป็น 6 โซน 50 เขต</span> <span class="nb">แตะโซนหรือเขต</span> <span class="nb">เพื่อดูว่ามีใครรับงานแล้วบ้าง</span></p>
          <div data-jn-explorer>${jnExplorer(s)}</div>
        </div></section>
        <footer class="jn-sec jn-foot"><button data-act="ptTerms">ข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว</button><span>แผนที่เขต: OpenGISData-Thailand (CC BY 4.0)</span></footer>
        <div class="jn-sticky" data-jn-sticky><button class="jn-cta" data-go="t.line" tabindex="-1"><span class="ic">${I('message-circle')}</span><span><strong>${known ? 'เข้าใช้งานด้วย LINE' : 'สมัครด้วย LINE'}</strong><small>ฟรี · ไม่ต้องสัมภาษณ์</small></span><span class="ar">${I('arrow-right')}</span></button></div>
        <div class="jn-modal" data-jn-modal></div>
      </div>`;
    },
    mount(root, s) {
      const host = root.querySelector('.jn'); if (!host) return;
      /* New-work notifications pop up district by district on the hero map (Boss: no blinking dots). */
      const pop = host.querySelector('[data-jn-pop]'), popD = host.querySelector('[data-jn-pop-d]'), dot = host.querySelector('[data-jn-dot]');
      if (pop && window.BKK) {
        const route = ['จตุจักร', 'บางแค', 'ดุสิต', 'ลาดพร้าว', 'ตลิ่งชัน', 'หลักสี่', 'ห้วยขวาง', 'ภาษีเจริญ', 'บางเขน', 'บางซื่อ', 'บางพลัด', 'วังทองหลาง', 'พญาไท', 'ดอนเมือง', 'บางกอกน้อย', 'บางกะปิ'];
        const reduceP = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mapEl = pop.parentElement, card = host.querySelector('.jn-card');
        let k = 0;
        const place = () => {
          const box = mapEl.getBoundingClientRect(), cr = card ? card.getBoundingClientRect() : null;
          const w = pop.offsetWidth, h = pop.offsetHeight, gap = 14;
          const hits = (l, t, r, bt) => cr && r > cr.left - 8 && l < cr.right + 8 && bt > cr.top - 8 && t < cr.bottom + 8;
          let pick = null;
          for (let tries = 0; tries < route.length && !pick; tries++) {
            const n = route[k++ % route.length], d = BKK.d.find(x => x.n === n);
            const px = d.x / BKK.w * box.width, py = d.y / BKK.h * box.height;
            if (hits(box.left + px, box.top + py, box.left + px, box.top + py)) continue;   // the spot itself is under the card
            const left = Math.min(Math.max(px - w / 2, 4), box.width - w - 4);
            for (const down of [false, true]) {
              const top = down ? py + gap : py - h - gap;
              if (top < 0 || top + h > box.height + 40) continue;                         // stay on the map, never over the headline
              if (hits(box.left + left, box.top + top, box.left + left + w, box.top + top + h)) continue;
              pick = { n, px, py, left, top, down }; break;
            }
          }
          if (!pick) return false;
          host.querySelectorAll('.jn-map.hero .jn-d.hot').forEach(x => x.classList.remove('hot'));
          const path = host.querySelector(`.jn-map.hero [data-hn="${pick.n}"]`); if (path) path.classList.add('hot');
          popD.textContent = 'เขต' + pick.n;
          pop.classList.toggle('down', pick.down);
          pop.style.left = pick.left + 'px'; pop.style.top = pick.top + 'px';
          pop.style.setProperty('--ax', Math.min(Math.max(pick.px - pick.left, 16), w - 16) + 'px');
          dot.style.left = pick.px + 'px'; dot.style.top = pick.py + 'px';
          return true;
        };
        const step = () => {
          if (!pop.isConnected) return;
          if (!place()) { setTimeout(step, 2700); return; }
          if (reduceP) { pop.style.opacity = 1; dot.style.opacity = 1; return; }
          for (const el of [pop, dot]) { el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }
          setTimeout(step, 2700);
        };
        setTimeout(step, 600);
      }
      /* The name slot types short PT-identity words in a loop (Boss: short, fits the slot, says "this is you, the PT"). */
      const typeEl = host.querySelector('[data-jn-type]');
      if (typeEl) {
        const lines = ['ชื่อของคุณ', 'นักกายภาพบำบัด', 'นักกายภาพถึงบ้าน', 'นักกายภาพประจำบ้าน'];
        const split = t => (window.Intl && Intl.Segmenter) ? [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(t)].map(x => x.segment) : [...t];
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const wait = ms => new Promise(r => setTimeout(r, ms));
        (async () => {
          let i = 0;
          while (typeEl.isConnected) {
            const g = split(lines[i % lines.length]);
            if (reduce) { typeEl.textContent = g.join(''); await wait(2600); i++; continue; }
            for (let k = 1; k <= g.length && typeEl.isConnected; k++) { typeEl.textContent = g.slice(0, k).join(''); await wait(85); }
            await wait(1700);
            for (let k = g.length - 1; k >= 0 && typeEl.isConnected; k--) { typeEl.textContent = g.slice(0, k).join(''); await wait(38); }
            await wait(350); i++;
          }
        })();
      }
      const ex = host.querySelector('[data-jn-explorer]'), modal = host.querySelector('[data-jn-modal]');
      const refresh = () => { ex.innerHTML = jnExplorer(s); if (window.lucide) lucide.createIcons(); };
      host.addEventListener('click', e => {
        const z = e.target.closest('[data-jz]'), d = e.target.closest('[data-jd]'), p = e.target.closest('[data-jp]');
        if (z) { jnSel.zone = z.dataset.jz; jnSel.dist = null; refresh(); return; }
        if (d) { jnSel.dist = d.dataset.jd; jnSel.zone = zoneOfDist(jnSel.dist); refresh(); return; }
        if (p) { modal.innerHTML = jnProfile(s, p.dataset.jp); modal.classList.add('open'); if (window.lucide) lucide.createIcons(); return; }
        if (e.target.closest('[data-jclose]') || e.target === modal) { modal.classList.remove('open'); return; }
        if (e.target.closest('[data-jtop]')) { root.querySelector('.dev-scroll').scrollTo({ top: 0, behavior: 'smooth' }); }
      });
      const main = host.querySelector('[data-jn-main]'), bar = host.querySelector('[data-jn-sticky]'), scroller = root.querySelector('.dev-scroll');
      if (main && bar && 'IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { bar.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < (en.rootBounds ? en.rootBounds.top : 0)); bar.querySelector('button').tabIndex = en.isIntersecting ? -1 : 0; }, { root: scroller, threshold: 0 }).observe(main);
      }
    }
  });
  act('ptTerms', () => openSheet(() => `<b class="h2">ข้อตกลงการใช้งานโดยย่อ</b>
    <p class="p">เราใช้ชื่อที่แสดงและรูปจาก LINE เพื่อเข้าสู่ระบบ และส่งข้อความแจ้งงานเสนอกับนัดหมาย</p>
    <p class="p">ชื่อจริงเห็นเฉพาะทีมตรวจ ใช้บนใบรับรอง · เลขใบประกอบแสดงบนการ์ดให้คนไข้ตรวจสอบได้</p>
    <p class="p">ข้อตกลงการรับงาน (ค่าธรรมเนียม การรับเงิน การยกเลิก) อ่านและยอมรับครั้งเดียวก่อนรับงานแรก</p>
    <button class="btn" data-close>เข้าใจแล้ว</button>`));

  /* ---------- t.line · หน้าขอสิทธิ์ของ LINE (จำลอง) ---------- */
  scr('t.line', {
    render(s) {
      if (s.pt.lineFriend === undefined) s.pt.lineFriend = true;
      return `<div class="scr white">
        <header class="tt-lineTop"><b>LINE</b><button class="ib" data-back aria-label="ปิด">${I('x')}</button></header>
        <div class="body">
          <div class="stack tt-c" style="justify-items:center;padding-top:10px">
            <img src="a/synaclair-icon.svg" alt="" width="72" height="72" style="border-radius:20px;box-shadow:0 6px 18px #07302318">
            <b class="h2">SynaClair</b>
            <p class="p">SynaClair ขอสิทธิ์เข้าถึงโปรไฟล์และชื่อที่แสดง</p>
          </div>
          <div class="tt-perm">
            <div>${I('check')}<span><b class="sec-h">${I('id-card')}ชื่อที่แสดงและรูปโปรไฟล์</b><br><span class="small">จำเป็น · ใช้เข้าสู่ระบบแทนรหัสผ่าน</span></span></div>
            <label class="check" style="padding:8px 0"><input type="checkbox" data-bind="pt.lineFriend" ${s.pt.lineFriend ? 'checked' : ''}><span><b class="sec-h">${I('user-plus')}เพิ่ม SynaClair เป็นเพื่อน</b><br><span class="small">รับแจ้งงานเสนอและนัดหมายใน LINE</span></span></label>
          </div>
          <p class="small tt-c">ห้องซ้อม: หน้านี้จำลองหน้าของ LINE ไม่ได้เชื่อมบัญชีจริง</p>
        </div>
        <div class="foot"><button class="btn line" data-act="ptLogin">อนุญาต</button><button class="btn ghost" data-back>ยกเลิก</button></div></div>`;
    }
  });
  act('ptLogin', s => { s.pt.loggedIn = true; if (s.pt.status === 'NONE') s.pt.signStep = 0; s.pt.loadNext = s.pt.status === 'NONE' ? 't.signup' : 't.hub'; return 't.loading'; });
  // Same loading screen and patient tips as the patient app (shared from screens-patient.js).
  scr('t.loading', { render: s => SC.loading.html(s.pt.loadNext || 't.hub'), mount: (root, s) => SC.loading.mount(root, 'pt', 't.loading', s.pt.loadNext || 't.hub') });

  /* ======================================================================
     t.signup · 4 ขั้น: ใบประกอบ + สำเนา → การศึกษา → ชื่อที่แสดง (ตัวอย่างสด) → เขตที่รับงาน
     Boss (28 Oct): the licence copy and education are required before the profile is created, not left for later on the hub.
     ====================================================================== */
  scr('t.signup', {
    render(s) {
      const p = s.pt, st = Math.min(p.signStep || 0, 3);
      const left = st === 0 ? '' : `<button class="ib" data-act="signBack" aria-label="ย้อนกลับ">${I('chevron-left')}</button>`;
      const head = `${st === 0 ? ui.bar('สร้างโปรไฟล์') : ui.bar('สร้างโปรไฟล์', { back: false, left })}
        <div style="padding:10px 16px 0;background:#fff" class="tt-stepnum"><div class="progress"><i style="width:${(st + 1) / 4 * 100}%"></i></div><span class="small">${st + 1} / 4</span></div>`;
      let body, foot;
      if (st === 0) {
        body = `<div class="stack"><span class="kick">ยืนยันตัวตน</span><h1 class="h1">ใบประกอบวิชาชีพของคุณ</h1></div>
          <label class="field"><span>ชื่อ-นามสกุลจริง</span><input class="in" data-bind="pt.legalName" value="${esc(p.legalName)}" placeholder="ตามใบประกอบวิชาชีพ" autocomplete="name"><small class="hint">ตรงกับในใบประกอบ · เห็นเฉพาะทีม ใช้บนใบรับรอง</small></label>
          <label class="field"><span>เลขใบประกอบวิชาชีพ</span><input class="in" data-bind="pt.license" data-digits inputmode="numeric" value="${esc(p.license)}" placeholder="เช่น 12345" autocomplete="off"><small class="hint">ใส่เฉพาะตัวเลข ไม่ต้องพิมพ์ ก.</small></label>
          <div class="field"><span>สำเนาใบประกอบวิชาชีพ <em class="tt-req">จำเป็น</em></span>${licFile(p)}</div>
          ${extraDocs(p)}
          ${lockNote('ทีมใช้ตรวจกับระบบของสภากายภาพบำบัดเท่านั้น สำเนาไม่แสดงบนโปรไฟล์')}`;
        foot = `<button class="btn" data-act="signNext" data-need="pt.legalName,pt.license,pt.licenseFile">ต่อไป ${I('arrow-right')}</button>`;
      } else if (st === 1) {
        body = `<div class="stack"><span class="kick">ยืนยันตัวตน</span><h1 class="h1">ประวัติการศึกษา</h1><p class="small">เพิ่มอย่างน้อย 1 รายการ คนไข้เห็นในแท็บ "ประวัติ" ของโปรไฟล์ · การอบรมเพิ่มตอนนี้หรือทีหลังก็ได้</p></div>
          ${cvForm(s)}`;
        foot = `<button class="btn" data-act="signNext" data-need="pt.cv.edu">ต่อไป ${I('arrow-right')}</button>`;
      } else if (st === 2) {
        const first = (p.legalName || '').trim().split(/\s+/)[0] || '';
        const ideas = first ? [`กภ.${first}`, `PT ${first}`, `${first} กายภาพถึงบ้าน`] : [];
        body = `<div class="stack"><span class="kick">โปรไฟล์ที่คนไข้เห็น</span><h1 class="h1">คนไข้จะเห็นคุณแบบนี้</h1><p class="small">ตัวอย่างสด เปลี่ยนตามที่พิมพ์</p></div>
          <div class="card"><div class="row">${ui.avatar(p.displayName || 'ช', null, 60)}<div class="grow"><b class="h3">${esc(p.displayName || 'ชื่อที่แสดงของคุณ')}</b><div class="small">นักกายภาพบำบัด</div></div></div>
            <span class="pill wait">${I('hourglass')}รอตรวจใบประกอบ</span></div>
          <label class="field"><span>ชื่อที่แสดง <span class="tt-xp">+10 XP</span></span><input class="in" data-bind="pt.displayName" data-live maxlength="40" value="${esc(p.displayName)}" placeholder="เช่น กภ.หญิง ดูแลผู้สูงอายุ"><small class="hint">ตั้งเองได้ เช่น ชื่อเล่น + สิ่งที่ถนัด</small></label>
          ${ideas.length ? `<div class="chips">${ideas.map(x => `<button class="chip ${p.displayName === x ? 'on' : ''}" data-pick="pt.displayName" data-value="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : ''}`;
        foot = `<button class="btn" data-act="signNext" data-need="pt.displayName">ต่อไป ${I('arrow-right')}</button>`;
      } else {
        const z = SC.ZONES.find(x => x.code === p.zoneTab) || SC.ZONES[0];
        const all = z.districts.every(d => p.zones.includes(d));
        body = `<div class="stack"><span class="kick">เขตที่รับงาน <span class="tt-xp">+50 XP</span></span><h1 class="h1">รับงานเขตไหนบ้าง</h1><p class="small">เลือกได้หลายโซนและหลายเขต ตามที่สะดวกไปรับงาน งานเสนอจะส่งมาเฉพาะเขตที่เลือก แก้ได้ทุกเมื่อ</p></div>
          ${zonePicker(p, z, all)}`;
        foot = `<button class="btn" data-act="ptSignup" data-need="pt.legalName,pt.license,pt.licenseFile,pt.cv.edu,pt.displayName,pt.zones">${I('sparkles')}สร้างโปรไฟล์ · +${XP.signup} XP</button>
          ${lockNote('ชื่อจริงเห็นเฉพาะทีมตรวจ ใช้บนใบรับรอง · เลขใบประกอบแสดงให้คนไข้ตรวจสอบได้')}`;
      }
      return `<div class="scr">${head}<div class="body">${body}</div><div class="foot">${foot}</div></div>`;
    }
  });
  /* Zone picker: all 6 zones visible at once (Boss could not scroll a sideways row on desktop), plus a search box to find a district by name. */
  function zonePicker(p, z, all) {
    const q = (p.zq || '').trim();
    const chip = d => { const on = p.zones.includes(d); return `<button class="chip ${on ? 'on' : ''}" aria-pressed="${on}" data-toggle="pt.zones" data-value="${esc(d)}">${on ? I('check') : ''}${esc(d)}</button>`; };
    const hits = q ? SC.ZONES.flatMap(x => x.districts).filter(d => d.includes(q)) : [];
    const pick = q
      ? `<div class="card flat"><b class="h3">${hits.length ? `พบ ${hits.length} เขต` : `ไม่พบเขต "${esc(q)}"`}</b>${hits.length ? `<div class="chips">${hits.map(chip).join('')}</div>` : '<p class="small">ลองพิมพ์ส่วนหนึ่งของชื่อ เช่น "บาง"</p>'}</div>`
      : `<span class="label">แตะโซน แล้วเลือกเขต · เลือกได้หลายโซน</span><div class="tt-zgrid" role="tablist" aria-label="โซน">${SC.ZONES.map(x => { const n = x.districts.filter(d => p.zones.includes(d)).length; return `<button class="chip ${x.code === z.code ? 'on' : ''}" role="tab" aria-selected="${x.code === z.code}" data-pick="pt.zoneTab" data-value="${x.code}">${esc(x.name.replace('กรุงเทพ', ''))}${n ? `<i>${n}</i>` : ''}</button>`; }).join('')}</div>
      <div class="card flat"><div class="row between"><b class="h3">${esc(z.name)} · ${z.districts.length} เขต</b><button class="btn sm soft" data-act="zoneAll" data-code="${z.code}">${all ? 'เอาออกทั้งโซน' : 'เลือกทั้งโซน'}</button></div>
        <div class="chips">${z.districts.map(chip).join('')}</div></div>`;
    return `<label class="tt-zq">${I('search')}<input class="in" data-bind="pt.zq" data-live value="${esc(p.zq || '')}" placeholder="ค้นชื่อเขต เช่น บางนา" aria-label="ค้นชื่อเขต" autocomplete="off"></label>
      ${pick}
      <div class="card mint"><b class="h3">เลือกแล้ว ${p.zones.length} เขต</b>${p.zones.length ? `<div class="chips">${p.zones.map(d => `<button class="chip" data-toggle="pt.zones" data-value="${esc(d)}" aria-label="เอา ${esc(d)} ออก">${esc(d)} ${I('x')}</button>`).join('')}</div>` : '<p class="small">แตะชื่อเขตด้านบนเพื่อเลือก อย่างน้อย 1 เขต</p>'}</div>`;
  }
  // Licence copy: an image, a PDF, or the sample (rehearsal). The team checks it against the council register; patients never see it.
  function licFile(p) {
    const f = p.licenseFile;
    if (!f) return `<div class="grid2"><label class="btn ghost tt-file" style="width:100%">${I('upload')}อัปโหลดรูปหรือ PDF<input type="file" accept="image/*,application/pdf" data-file="pt.licenseFile" aria-label="อัปโหลดสำเนาใบประกอบ"></label><button class="btn ghost" style="width:100%" data-pick="pt.licenseFile" data-value="sample">ใช้ไฟล์ตัวอย่าง</button></div><small class="hint">ถ่ายให้เห็นชื่อ เลขที่ และวันหมดอายุชัด</small>`;
    const pdf = String(f).startsWith('data:application/pdf');
    return `<div class="tt-licf">${f === 'sample' ? `<span class="tt-licdoc">${I('file-badge')}<b>ใบอนุญาตประกอบวิชาชีพกายภาพบำบัด</b><small>ไฟล์ตัวอย่าง</small></span>` : pdf ? `<span class="tt-licdoc">${I('file-text')}<b>ไฟล์ PDF แนบแล้ว</b></span>` : `<img src="${esc(f)}" alt="สำเนาใบประกอบที่แนบ">`}
      <span class="row between"><span class="pill">${I('check')}แนบแล้ว</span><button class="btn sm ghost" data-pick="pt.licenseFile" data-value="">เปลี่ยนไฟล์</button></span></div>`;
  }
  // Boss (28 Oct): optional extra documents (name-change certificate, anything tied to the licence), each with a note saying what it is.
  function extraDocs(p) {
    const list = p.extraDocs || (p.extraDocs = []), d = p.docDraft || (p.docDraft = { file: null, note: '' });
    const name = f => f === 'sample' ? 'ไฟล์ตัวอย่าง' : String(f).startsWith('data:application/pdf') ? 'ไฟล์ PDF' : 'รูปภาพ';
    return `<div class="card flat tt-docs"><b class="h3">${I('folder-plus')}เอกสารอื่น ๆ <span class="small">(ถ้ามี)</span></b>
      <span class="small">เช่น ใบเปลี่ยนชื่อ-นามสกุล หรือเอกสารที่เกี่ยวกับใบประกอบ เขียนบอกได้เลยว่าเอกสารนี้คืออะไร หรือมีปัญหาอะไร</span>
      ${list.map((x, i) => `<div class="tt-cvrow"><span class="grow"><b>${I('paperclip')} ${name(x.file)}</b><small>${esc(x.note)}</small></span><button class="ib soft" data-act="docDel" data-i="${i}" aria-label="ลบเอกสาร">${I('x')}</button></div>`).join('')}
      ${d.file ? `<span class="pill">${I('check')}แนบ${name(d.file)}แล้ว</span>` : `<div class="grid2"><label class="btn sm ghost tt-file" style="width:100%">${I('upload')}แนบไฟล์<input type="file" accept="image/*,application/pdf" data-file="pt.docDraft.file" aria-label="แนบเอกสารอื่น"></label><button class="btn sm ghost" style="width:100%" data-pick="pt.docDraft.file" data-value="sample">ไฟล์ตัวอย่าง</button></div>`}
      <label class="field"><span>เอกสารนี้คืออะไร</span><textarea class="in tt-ta" rows="2" data-bind="pt.docDraft.note" data-live placeholder="เช่น เปลี่ยนนามสกุลหลังแต่งงาน ชื่อในใบประกอบยังเป็นนามสกุลเดิม">${esc(d.note)}</textarea></label>
      <button class="btn sm soft" data-act="docAdd" data-need="pt.docDraft.file,pt.docDraft.note">${I('plus')}เพิ่มเอกสาร</button></div>`;
  }
  act('docAdd', (s, ctx) => { const p = s.pt, d = p.docDraft; if (!d || !d.file || !(d.note || '').trim()) return; (p.extraDocs = p.extraDocs || []).push({ file: d.file, note: d.note.trim() }); p.docDraft = { file: null, note: '' }; ctx.toast('เพิ่มเอกสารแล้ว'); });
  act('docDel', (s, ctx) => { s.pt.extraDocs.splice(+ctx.data.i, 1); });
  act('signNext', (s, ctx) => {
    const p = s.pt;
    if ((p.signStep || 0) === 1 && !p.cv.edu.length) { ctx.toast('เพิ่มประวัติการศึกษาอย่างน้อย 1 รายการ'); return; }
    p.signStep = Math.min(3, (p.signStep || 0) + 1);
  });
  act('signBack', s => { s.pt.signStep = Math.max(0, (s.pt.signStep || 0) - 1); });
  act('zoneAll', (s, ctx) => {
    const z = SC.ZONES.find(x => x.code === ctx.data.code); if (!z) return;
    const all = z.districts.every(d => s.pt.zones.includes(d));
    s.pt.zones = all ? s.pt.zones.filter(d => !z.districts.includes(d)) : [...new Set([...s.pt.zones, ...z.districts])];
  });
  act('ptSignup', (s, ctx) => {
    const p = s.pt;
    if (!p.legalName.trim() || !/^\d{3,8}$/.test(p.license) || !p.licenseFile || !p.cv.edu.length || !p.displayName.trim() || !p.zones.length) { ctx.toast('กรอกข้อมูลให้ครบทุกขั้นก่อนนะคะ'); return; }
    p.status = 'PENDING'; p.loggedIn = true;
    ctx.xp(XP.signup, 'สร้างโปรไฟล์');
    return 't.hub';
  });

  /* ======================================================================
     t.hub · หน้าของฉัน (โปรไฟล์โซเชียล + XP + เควสต์)
     ====================================================================== */
  function questState(s) {
    const p = s.pt;
    return {
      photo: !!p.photo, bio: !!p.bio, post: p.posts.length > 0 || !!p.postSkipped, schedule: !!p.schedule.sent,
      postSkipped: !p.posts.length && !!p.postSkipped, scheduleSkipped: !p.schedule.sent && !!p.scheduleSkipped
    };
  }
  /* Tutorial coach (Boss 21 Oct): no checklist, no "what happens next" timeline. The hub is a feed; one tip at a time points at the
     real control to use next, XP pops when it is done, then the next tip appears. */
  function coachStep(s) {
    const p = s.pt, q = questState(s), ok = verified(s);
    const steps = [
      { key: 'photo', done: q.photo, title: 'ใส่รูปโปรไฟล์', sub: 'ใช้รูปที่เห็นหน้าชัด คนไข้จะมั่นใจขึ้นก่อนเปิดบ้านให้', xp: XP.photo, attr: 'data-go="t.photo"', btn: 'ใส่รูป' },
      { key: 'bio', done: q.bio, title: 'เขียนแนะนำตัว', sub: '1–2 ประโยค เช่น ถนัดดูแลใคร และดูแลแบบไหน', xp: XP.bio, attr: 'data-act="editBio"', btn: 'เขียนเลย' },
      { key: 'post', done: q.post, title: 'ลองโพสต์แรก', sub: 'แชร์ความรู้สั้น ๆ หรือรูปตอนทำงาน ข้ามไปก่อนก็ได้', xp: p.postXp ? 0 : XP.post, attr: 'data-act="compose"', btn: 'เขียนโพสต์', skip: 'skipPost' },
      { key: 'schedule', done: q.schedule, title: 'ลงเวลาว่าง', sub: 'ต้องลงก่อนถึงจะได้รับงาน แนะนำสัปดาห์ละ 1 สล็อต (สล็อตละ 3 ชั่วโมง)', xp: p.schedXp ? 0 : XP.schedule, attr: 'data-go="t.schedule"', btn: 'ไปลงเวลา', dock: true },
      ...(ok ? [{ key: 'agree', done: !!p.agreement, title: 'อ่านข้อตกลงก่อนรับงานแรก', sub: 'ค่าธรรมเนียม การรับเงิน การยกเลิก ใช้เวลาราว 2 นาที', xp: 0, attr: 'data-go="t.agreement"', btn: 'อ่านข้อตกลง' }] : [])
    ];
    const i = steps.findIndex(x => !x.done);
    return i < 0 ? null : { ...steps[i], n: i, total: steps.length };
  }
  function coachTip(c) {
    if (!c) return '';
    const dots = Array.from({ length: c.total }, (_, i) => `<i class="${i < c.n ? 'done' : i === c.n ? 'on' : ''}"></i>`).join('');
    return `<div class="tt-tip${c.dock ? ' dock' : ''}" data-tt-tip="${c.key}" data-keep-anim role="note">
      <div class="tt-tiphead"><span class="tt-tipdots" aria-label="ขั้น ${c.n + 1} จาก ${c.total}">${dots}</span>${c.xp ? `<span class="tt-xp">+${c.xp} XP</span>` : ''}</div>
      <b>${c.title}</b><span class="s">${c.sub}</span>
      <div class="row"><button class="btn sm" data-tt-go ${c.attr}>${c.btn}</button>${c.skip ? `<button class="btn sm ghost" data-act="${c.skip}">ข้ามไปก่อน</button>` : ''}</div></div>`;
  }
  /* Palm's PT Dashboard (board 23 Oct): a deep-green welcome card with the level ring and the three numbers, progress bars, today's
     missions and badges. Every number comes from the PT's own data; XP shows only where the app really gives it. No gold on dark green. */
  function dash(s, cases, rv) {
    // Boss (28 Oct): XP lives only here. A new +XP flies into the gold pill, then the bar and ring fill from where they were.
    const p = s.pt, shown = SC.v.xpShown == null ? p.xp : SC.v.xpShown, L = lvl(p.xp), ok = verified(s);
    const pctOf = x => { const l = lvl(x); return l.next ? (x - l.floor) / (l.next - l.floor) : 1; }, pct = pctOf(p.xp), from = lvl(shown).level === L.level ? pctOf(shown) : 0;
    const r = 30, C = 2 * Math.PI * r, today = new Date().toDateString();
    const profParts = [!!p.photo, !!p.bio, !!p.cover, p.zones.length > 0, !!(p.cv && (p.cv.edu || []).length), ok];
    const bars = [
      ['user-round-check', 'โปรไฟล์สมบูรณ์', profParts.filter(Boolean).length / profParts.length],
      ['images', 'ผลงานที่โพสต์', Math.min(1, p.posts.length / 3), `${Math.min(p.posts.length, 3)}/3`],
      ['calendar-range', 'ตารางเวลาว่าง', p.schedule.sent ? 1 : 0, p.schedule.sent ? 'ส่งแล้ว' : 'ยังไม่ส่ง'],
      ['star', 'รีวิวจากผู้รับบริการ', rv ? 1 : 0, rv ? '1 รีวิว' : 'ยังไม่มี']
    ];
    const offers = s.request && s.request.status === 'OFFERED' ? 1 : 0;
    const missions = [
      { t: 'แชร์โน้ตสั้น ๆ วันนี้', done: p.noteXpDay === today, xp: p.noteXpDay === today ? 0 : XP.note, attr: 'data-act="noteOpen"' },
      { t: offers ? 'ตอบงานที่เสนอเข้ามา' : 'เช็กงานที่เสนอเข้ามา', done: !offers, attr: 'data-go="t.work"' },
      { t: 'ลงเวลาว่างให้ครบ', done: !!p.schedule.sent, xp: p.schedXp ? 0 : XP.schedule, attr: 'data-go="t.schedule"' },
      { t: 'เล่าความรู้ 1 โพสต์', done: p.posts.some(x => x.at === 'เมื่อสักครู่'), xp: p.postXp ? 0 : XP.post, attr: 'data-act="compose"' }
    ];
    const badges = [['badge-check', 'ใบประกอบผ่านแล้ว', ok], ['house', 'เคสแรก', cases > 0], ['star', 'รีวิวแรก', !!rv], ['pen-line', 'โพสต์แรก', p.posts.length > 0]];
    // Boss (28 Oct): the XP total shows once (gold pill on the cover); the to-dos sit right under the level card, then the composer.
    const top = `<div class="pd-hero">
        <div class="pd-hi"><span class="pd-ring" aria-label="ระดับ ${L.level}"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="${r}" class="bg"/><circle cx="36" cy="36" r="${r}" class="fg" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - from)).toFixed(1)}" data-to="${(C * (1 - pct)).toFixed(1)}"/></svg><b>${L.level}</b></span>
          <div class="grow"><small>ระดับ ${L.level}</small><b>${esc(p.displayName)}</b><button class="pd-xpbtn" data-act="xpHistory" aria-label="ดูประวัติ XP">${ui.xpPill(L.next)}</button></div></div>
        <div class="pd-bar" aria-hidden="true"><i style="width:${Math.round(from * 100)}%" data-to="${Math.round(pct * 100)}%"></i></div>
        <p class="pd-next">${L.next ? `อีก <b>${L.next - p.xp} XP</b> ขึ้นระดับ ${L.level + 1}` : 'ระดับสูงสุดแล้ว'}</p>
        <div class="pd-nums"><div><b>${cases}</b><span>เคสที่ดูแล</span></div><div><b>${rv ? 1 : 0}</b><span>รีวิว</span></div><div><b>${rv ? rv.stars.toFixed(1) : '–'}</b><span>คะแนนเฉลี่ย</span></div></div>
      </div>
      <div class="pd-card"><h2>${I('list-checks')}ภารกิจวันนี้</h2>
        ${missions.map(m => `<button class="pd-mis${m.done ? ' done' : ''}" ${m.attr}><span class="ck">${I(m.done ? 'check' : 'circle')}</span><span class="grow">${m.t}</span>${m.xp ? `<span class="tt-xp">+${m.xp} XP</span>` : I('chevron-right')}</button>`).join('')}</div>`;
    const rest = `<div class="pd-card"><h2>${I('trending-up')}ความคืบหน้าของคุณ</h2>
        ${bars.map(([ic, t, v, note]) => `<div class="pd-prog"><span class="ic">${I(ic)}</span><span class="grow"><span class="row between"><b>${t}</b><small>${note || Math.round(v * 100) + '%'}</small></span><span class="pd-track"><i style="width:${Math.round(v * 100)}%"></i></span></span></div>`).join('')}</div>
      <div class="pd-card"><h2>${I('trophy')}เหรียญของคุณ</h2>
        <div class="pd-badges">${badges.map(([ic, t, on]) => `<div class="pd-badge${on ? ' on' : ''}"><span>${I(on ? ic : 'lock')}</span><small>${t}</small></div>`).join('')}</div></div>`;
    return { top, rest };
  }
  scr('t.hub', {
    render(s) {
      const p = s.pt;
      if (p.status === 'NONE') return `<div class="scr">${ui.bar('หน้าของฉัน', { back: false })}<div class="body">${ui.empty('user-round', 'ยังไม่มีโปรไฟล์', 'สมัครด้วย LINE แล้วกรอก 4 ช่อง ใช้เวลาไม่ถึง 2 นาที', `<button class="btn auto" data-go="t.join">ไปหน้าสมัคร</button>`)}</div>${ui.tabs('pt', 't.hub')}</div>`;
      const ok = verified(s), c = coachStep(s), at = k => (c && c.key === k ? coachTip(c) : '');
      const rv = s.review && s.review.approved && !s.review.hidden ? s.review : null;
      const cases = s.visits.some(v => v.step >= 4) ? 1 : 0, d = dash(s, cases, rv);
      const status = ok
        ? `<p class="tt-stat ok">${I('badge-check')}ใบประกอบวิชาชีพ ตรวจสอบได้</p>`
        : `<p class="tt-stat wait">${I('hourglass')}รอผลตรวจใบประกอบ · แจ้งผลใน LINE</p>`;
      const feed = p.posts.length ? p.posts.map(x => `<button class="tt-fpost" data-act="openPost" data-id="${esc(x.id)}" aria-label="เปิดโพสต์">
          <span class="row">${ui.avatar(p.displayName, p.photo, 36)}<span class="grow"><b>${esc(p.displayName)}</b><small>${esc(x.at || 'เมื่อสักครู่')}</small></span></span>
          <span class="tx">${esc(x.text.length > 160 ? x.text.slice(0, 160) + '…' : x.text)}</span>
          ${x.image ? `<span class="im"><img src="${esc(x.image)}" alt="">${x.video ? `<span class="tt-play">${I('play')}</span>` : ''}</span>` : ''}</button>`).join('')
        : `<p class="small tt-c">ยังไม่มีโพสต์ · โพสต์แรกจะขึ้นตรงนี้</p>`;
      return `<div class="scr white">
        <div class="tt-cover" style="${p.cover ? `background-image:url('${esc(p.cover)}')` : ''}">
          <div class="tt-ctop"><span></span><button class="ib soft" data-go="t.me" aria-label="ตั้งค่าบัญชี">${I('settings')}</button></div>
          <button class="btn sm ghost tt-cadd" data-act="coverSheet">${I('image')}${p.cover ? 'เปลี่ยนรูปปก' : 'ใส่รูปปก'}</button>
        </div>
        <div class="tt-prof enter">
          <div class="tt-who"><span class="${c && c.key === 'photo' ? 'tt-spot' : ''}">${avStack(p, 92, { editNote: true })}</span><div><h1>${esc(p.displayName)}${ok ? I('badge-check') : ''}</h1><div class="small">นักกายภาพบำบัด</div></div></div>
          ${at('photo')}
          ${status}
          ${p.bio ? `<button class="tt-bio" data-act="editBio" aria-label="แก้แนะนำตัว">${esc(p.bio)}</button>` : `<button class="tt-biohole${c && c.key === 'bio' ? ' tt-spot' : ''}" data-act="editBio">${I('pencil')}เขียนแนะนำตัวสั้น ๆ ให้คนไข้รู้จักคุณ</button>`}
          ${at('bio')}
          ${cvBlock(p)}
          <p class="small row" style="color:var(--em)">${I('map-pin')}<span>${esc(p.zones.join(' · '))}</span></p>
          <div class="grid2"><button class="btn sm ghost" style="width:100%" data-act="editBio">${I('pencil')}แก้แนะนำตัว</button><button class="btn sm ghost" style="width:100%" data-act="previewMe">${I('eye')}ดูหน้าที่คนไข้เห็น</button></div>
        </div>
        <section class="pd">
          ${at('agree')}
          <button class="tt-compose${c && c.key === 'post' ? ' tt-spot' : ''}" data-act="compose">${ui.avatar(p.displayName, p.photo, 38)}<span class="grow">เขียนโพสต์ใหม่…</span>${I('image')}</button>
          ${at('post')}
          ${d.top}${d.rest}</section>
        <div class="body tt-feed">
          ${feed}
        </div>
        ${at('schedule')}
        ${ui.tabs('pt', 't.hub')}</div>`;
    },
  });

  // Palm (23 Oct): PTs add education and training/certificates themselves; no workplace field (team agreement).
  // Boss (28 Oct): education and training sit in the bio like IG / Facebook ("studied at ..."), tap to edit.
  function cvBlock(p) {
    const c = p.cv || {}, edu = c.edu || [], tr = c.train || [];
    if (!edu.length && !tr.length) return `<button class="tt-cvadd-link" data-act="editCv">${I('graduation-cap')}เพิ่มประวัติการศึกษาและการอบรม</button>`;
    return `<button class="tt-cv" data-act="editCv" aria-label="แก้ประวัติการศึกษาและการอบรม">${edu.map(([d, u, f]) => `<span>${I('graduation-cap')}<span>${esc(d)} · ${[f, u].filter(Boolean).map(esc).join(' ')}</span></span>`).join('')}${tr.map(([y, x, cert]) => `<span>${I('award')}<span>อบรม ${esc(x)}${y ? ` <small>${esc(y)}</small>` : ''}${cert ? ` <small>· มี certificate</small>` : ''}</span></span>`).join('')}</button>`;
  }
  // Boss (28 Oct): no abbreviations and no graduation year. Level in plain words, then university, faculty and major in separate fields.
  // The 20 institutions with an accredited physical therapy degree (admissionpremium list of 2569 accreditations, Physical Therapy Council).
  // The faculty fills in by itself; the PT can still change it. Check the council's yearly notice before launch.
  const UNIS = [['มหาวิทยาลัยมหิดล', 'คณะกายภาพบำบัด'], ['จุฬาลงกรณ์มหาวิทยาลัย', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยขอนแก่น', 'คณะเทคนิคการแพทย์'], ['มหาวิทยาลัยเชียงใหม่', 'คณะเทคนิคการแพทย์'],
    ['มหาวิทยาลัยศรีนครินทรวิโรฒ', 'คณะกายภาพบำบัด'], ['มหาวิทยาลัยธรรมศาสตร์', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยนเรศวร', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยวลัยลักษณ์', 'สำนักวิชาสหเวชศาสตร์'],
    ['มหาวิทยาลัยสงขลานครินทร์', 'คณะแพทยศาสตร์'], ['มหาวิทยาลัยแม่ฟ้าหลวง', 'สำนักวิชาการแพทย์บูรณาการ'], ['มหาวิทยาลัยพะเยา', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยบูรพา', 'คณะสหเวชศาสตร์'],
    ['มหาวิทยาลัยศิลปากร', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยทักษิณ', 'คณะสหเวชศาสตร์'], ['มหาวิทยาลัยรังสิต', 'คณะกายภาพบำบัดและเวชศาสตร์การกีฬา'], ['มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ', 'คณะกายภาพบำบัด'],
    ['มหาวิทยาลัยธุรกิจบัณฑิตย์', 'คณะกายภาพบำบัด'], ['มหาวิทยาลัยคริสเตียน', 'คณะวิทยาศาสตร์สุขภาพ'], ['วิทยาลัยเซนต์หลุยส์', 'คณะกายภาพบำบัด'], ['วิทยาลัยนครราชสีมา', 'คณะสหเวชศาสตร์']];
  const facOf = u => (UNIS.find(x => x[0] === u) || [])[1] || '';
  const LEVELS = ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก'];
  const YEARS = Array.from({ length: 40 }, (_, k) => String(2569 - k));
  const cvdOf = s => s.pt.cvd || (s.pt.cvd = { lvl: 'ปริญญาตรี', uni: '', uniOther: '', fac: '', major: 'กายภาพบำบัด', efile: null, course: '', cyear: '', cert: false });
  function cvForm(st) {
    const c = st.pt.cv, d = cvdOf(st), other = d.uni === 'อื่น ๆ';
    const row = (k, i, title, sub) => `<div class="tt-cvrow"><span class="grow"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><button class="ib soft" data-act="cvDel" data-k="${k}" data-i="${i}" aria-label="ลบ ${esc(title)}">${I('x')}</button></div>`;
    const sel = (bind, val, opts, ph) => `<select class="in" data-bind="${bind}"><option value="">${ph}</option>${opts.map(o => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    return `<b class="sec-h">${I('graduation-cap')}การศึกษา</b>
      ${c.edu.map(([x, u, f, ef], i) => row('edu', i, x, [f, u, ef ? 'แนบเอกสารแล้ว' : 'ยังไม่แนบเอกสาร'].filter(Boolean).join(' · '))).join('')}
      <div class="card flat tt-cvadd">
        <div class="field"><span>ระดับ</span><div class="seg">${LEVELS.map(x => `<button class="${d.lvl === x ? 'on' : ''}" data-pick="pt.cvd.lvl" data-value="${x}" data-then="cvLvl">${x}</button>`).join('')}</div></div>
        <label class="field"><span>มหาวิทยาลัย</span>${sel('pt.cvd.uni', d.uni, [...UNIS.map(x => x[0]), 'อื่น ๆ'], 'เลือกมหาวิทยาลัย')}</label>
        ${other ? `<label class="field"><span>ชื่อมหาวิทยาลัย</span><input class="in" data-bind="pt.cvd.uniOther" data-live value="${esc(d.uniOther)}" placeholder="พิมพ์ชื่อมหาวิทยาลัย"></label>` : ''}
        <label class="field"><span>คณะ</span><input class="in" data-bind="pt.cvd.fac" data-live value="${esc(d.fac || facOf(d.uni))}" placeholder="เช่น คณะสหเวชศาสตร์"></label>
        <label class="field"><span>สาขาวิชา</span><input class="in" data-bind="pt.cvd.major" data-live value="${esc(d.major)}" placeholder="${d.lvl === 'ปริญญาตรี' ? 'เช่น กายภาพบำบัด' : 'พิมพ์ชื่อสาขาวิชา'}"></label>
        <div class="field"><span>เอกสารยืนยันการศึกษา <em class="tt-req">จำเป็น</em></span>
          ${d.efile ? `<span class="row between"><span class="pill">${I('check')}แนบ${d.efile === 'sample' ? 'ไฟล์ตัวอย่าง' : 'เอกสาร'}แล้ว</span><button class="btn sm ghost" data-pick="pt.cvd.efile" data-value="">เปลี่ยนไฟล์</button></span>`
            : `<div class="grid2"><label class="btn sm ghost tt-file" style="width:100%">${I('upload')}แนบรูปหรือ PDF<input type="file" accept="image/*,application/pdf" data-file="pt.cvd.efile" aria-label="แนบเอกสารยืนยันการศึกษา"></label><button class="btn sm ghost" style="width:100%" data-pick="pt.cvd.efile" data-value="sample">ไฟล์ตัวอย่าง</button></div>`}
          <small class="hint">ทรานสคริปต์ หรือใบปริญญาบัตร อย่างใดอย่างหนึ่ง · ทีมตรวจ คนไข้ไม่เห็นไฟล์นี้</small></div>
        <button class="btn sm" data-act="cvAddEdu" data-need="pt.cvd.lvl,pt.cvd.major,pt.cvd.efile${other ? ',pt.cvd.uniOther' : ',pt.cvd.uni'}">${I('plus')}เพิ่มประวัติการศึกษา</button></div>
      <b class="sec-h">${I('award')}การอบรมและใบ certificate <span class="small">ไม่บังคับ</span></b>
      ${c.train.map(([y, x, cert], i) => row('train', i, x, [y, cert ? 'แนบใบ certificate แล้ว' : ''].filter(Boolean).join(' · '))).join('')}
      <div class="card flat tt-cvadd">
        <label class="field"><span>ชื่อหลักสูตรที่อบรม</span><input class="in" data-bind="pt.cvd.course" data-live value="${esc(d.course)}" placeholder="เช่น ฟื้นฟูผู้ป่วย Stroke"></label>
        <div class="grid2"><label class="field"><span>ปี</span>${sel('pt.cvd.cyear', d.cyear, YEARS, 'เลือกปี')}</label><label class="check" style="align-self:end"><input type="checkbox" data-bind="pt.cvd.cert" ${d.cert ? 'checked' : ''}><span>แนบใบ certificate (ตัวอย่าง)</span></label></div>
        <button class="btn sm ghost" data-act="cvAddTrain" data-need="pt.cvd.course">${I('plus')}เพิ่มการอบรม</button></div>`;
  }
  act('editCv', s => { s.pt.cvd = null; cvdOf(s); openSheet(st => `<div class="row between"><b class="h2">การศึกษาและการอบรม</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <p class="small">คนไข้เห็นในแท็บ "ประวัติ" ของโปรไฟล์ · ไม่ต้องใส่ที่ทำงาน · ใบ certificate ทีมตรวจก่อนขึ้นให้คนไข้เห็น</p>
      ${cvForm(st)}<button class="btn" data-close>เสร็จ</button>`); });
  // Palm (29 Oct): master's and doctorate majors vary, so only the bachelor's level pre-fills กายภาพบำบัด; the others start empty.
  act('cvLvl', s => { const d = cvdOf(s); if (d.lvl === 'ปริญญาตรี') { if (!d.major) d.major = 'กายภาพบำบัด'; } else if (d.major === 'กายภาพบำบัด') d.major = ''; });
  act('cvAddEdu', (s, ctx) => { const d = cvdOf(s), uni = d.uni === 'อื่น ๆ' ? (d.uniOther || '').trim() : d.uni, fac = (d.fac || facOf(d.uni) || '').trim(), major = (d.major || '').trim(); if (!d.lvl || !uni || !major || !d.efile) return; s.pt.cv.edu.push([`${d.lvl} สาขาวิชา${major.replace(/^สาขาวิชา/, '')}`, uni, fac, d.efile]); Object.assign(d, { uni: '', uniOther: '', fac: '', major: 'กายภาพบำบัด', efile: null }); ctx.toast('เพิ่มประวัติการศึกษาแล้ว'); });
  act('cvAddTrain', (s, ctx) => { const d = cvdOf(s); if (!d.course.trim()) return; s.pt.cv.train.push([(d.cyear || '').trim(), d.course.trim(), !!d.cert]); Object.assign(d, { course: '', cyear: '', cert: false }); ctx.toast('เพิ่มการอบรมแล้ว'); });
  act('cvDel', (s, ctx) => { const k = ctx.data.k; if (s.pt.cv[k]) s.pt.cv[k].splice(+ctx.data.i, 1); });

  act('xpHistory', s => openSheet(st => {
    const p = st.pt, L = lvl(p.xp);
    return `<div class="row">${ring(p.xp, 64)}<div class="grow"><b class="h2">${p.xp} XP · ระดับ ${L.level}</b><div class="small">${L.next ? `อีก ${L.next - p.xp} XP ถึงระดับ ${L.level + 1}` : 'ระดับสูงสุดแล้ว'}</div></div></div>
      <p class="small">XP บอกความคืบหน้าของคุณเอง ไม่ใช่เกรด และไม่มีผลกับการเสนองาน</p>
      <div class="list">${p.xpLog.length ? p.xpLog.map(x => `<div class="li"><span class="tile gold">${I('sparkles')}</span><span class="grow t">${esc(x.reason)}</span><b class="tt-xp">+${x.points} XP</b></div>`).join('') : '<div class="li"><span class="s">ยังไม่มี XP</span></div>'}</div>
      <b class="h3">ได้ XP จากอะไรบ้าง</b>
      <div class="kv"><dt>สร้างโปรไฟล์</dt><dd>+${XP.signup}</dd><dt>รูปโปรไฟล์ครั้งแรก</dt><dd>+${XP.photo}</dd><dt>แนะนำตัวครั้งแรก</dt><dd>+${XP.bio}</dd><dt>โพสต์แรก</dt><dd>+${XP.post}</dd><dt>ส่งตารางเวลาว่างครั้งแรก</dt><dd>+${XP.schedule}</dd><dt>ใบประกอบได้รับการยืนยัน</dt><dd>+${XP.verified}</dd><dt>แชร์โน้ตสั้น (วันละครั้ง)</dt><dd>+${XP.note}</dd></div>
      <p class="small">แต่ละอย่างได้ครั้งเดียว ยกเว้นโน้ตสั้นที่ได้วันละครั้ง · รับงาน ทำเคส และรีวิว ไม่ให้ XP</p>
      <button class="btn ghost" data-close>ปิด</button>`;
  }));

  act('editBio', s => { s.pt.bioDraft = s.pt.bio || ''; s.pt.bioIdea = null; openSheet(st => {
    const idea = BIO_IDEAS.find(x => x[0] === st.pt.bioIdea);
    return `<div class="row between"><b class="h2">แนะนำตัว</b>${st.pt.bio ? '' : `<span class="tt-xp">+${XP.bio} XP</span>`}</div>
      <label class="field"><span class="small">เล่าสั้น ๆ ว่าคุณเป็นใคร ดูแลใคร และดูแลแบบไหน</span>
        <textarea class="in" data-bind="pt.bioDraft" data-count="ttBioN" maxlength="150" rows="3" placeholder="${esc(idea ? idea[1] : 'เช่น ดูแลผู้สูงอายุที่บ้านมา 6 ปี เน้นฝึกให้ลุกเดินเองได้')}">${esc(st.pt.bioDraft)}</textarea>
        <small class="hint"><span id="ttBioN">${(st.pt.bioDraft || '').length}</span>/150</small></label>
      ${idea ? `<p class="note mint">ลองเขียน: ${esc(idea[1])}</p>` : ''}
      <p class="small">ไม่รู้จะเริ่มยังไง แตะดูไอเดีย (ไม่เติมข้อความให้)</p>
      <div class="chips">${BIO_IDEAS.map(x => `<button class="chip ${st.pt.bioIdea === x[0] ? 'on' : ''}" data-pick="pt.bioIdea" data-value="${esc(x[0])}">${esc(x[0])}</button>`).join('')}</div>
      <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn" data-act="saveBio" data-need="pt.bioDraft">บันทึก</button></div>`;
  }); });
  act('saveBio', (s, ctx) => {
    const t = (s.pt.bioDraft || '').trim().slice(0, 150); if (!t) return;
    const first = !s.pt.bio; s.pt.bio = t; ctx.close();
    if (first) ctx.xp(XP.bio, 'แนะนำตัว');
    ctx.toast(first ? 'บันทึกแนะนำตัวแล้ว' : 'แก้แนะนำตัวแล้ว');
  });

  act('compose', s => { s.pt.postIdea = null; openSheet(composer); });
  function composer(st) {
    const d = st.pt.postDraft, idea = POST_IDEAS.find(x => x[0] === st.pt.postIdea), vOk = videoOk(d.video);
    const first = !st.pt.posts.length && !st.pt.postXp;
    return `<div class="row between"><button class="btn sm ghost" data-close>ยกเลิก</button><b class="h3">โพสต์ใหม่</b><button class="btn sm" data-act="savePost" data-need="pt.postDraft.text">โพสต์</button></div>
      ${first ? '<p class="small tt-c" style="margin:0">โพสต์แรก <span class="tt-xp">+' + XP.post + ' XP</span> · ไม่บังคับ</p>' : ''}
      <label class="field"><span class="small">อยากเล่าอะไรให้คนไข้ฟัง</span>
        <textarea class="in" data-bind="pt.postDraft.text" data-count="ttPostN" maxlength="2000" rows="4" placeholder="${esc(idea ? idea[1] : 'เช่น ท่าลุกจากเก้าอี้ให้ปลอดภัย 3 ขั้น')}">${esc(d.text)}</textarea>
        <small class="hint"><span id="ttPostN">${d.text.length}</span>/2000</small></label>
      ${idea ? `<p class="note mint">ลองเขียน: ${esc(idea[1])}</p>` : ''}
      ${d.image ? `<div class="tt-postimg"><img src="${esc(d.image)}" alt="รูปที่แนบ"><button class="ib soft" data-act="postNoImage" aria-label="เอารูปออก">${I('x')}</button></div>` : ''}
      <div class="row wrap"><label class="btn sm soft tt-file">${I('camera')}เพิ่มรูป<input type="file" accept="image/*" data-file="pt.postDraft.image" aria-label="เลือกรูปจากเครื่อง"></label><span class="small">หรือใช้รูปตัวอย่าง</span></div>
      <div class="tt-thumbs">${SAMPLE_IMGS.map(x => `<button class="${d.image === x ? 'on' : ''}" data-pick="pt.postDraft.image" data-value="${x}" aria-label="ใช้รูปตัวอย่าง"><img src="${x}" alt=""></button>`).join('')}</div>
      <label class="field"><span>ลิงก์วิดีโอ (ไม่บังคับ)</span><input class="in" data-bind="pt.postDraft.video" data-live inputmode="url" value="${esc(d.video)}" placeholder="https://youtu.be/… หรือ https://www.tiktok.com/…">
        ${vOk ? '<small class="hint">รองรับ YouTube และ TikTok</small>' : '<small class="tt-err">ใช้ได้เฉพาะลิงก์ YouTube หรือ TikTok</small>'}</label>
      <p class="small">ไม่รู้จะเขียนอะไร แตะดูไอเดีย</p>
      <div class="chips">${POST_IDEAS.map(x => `<button class="chip tt-wrap ${st.pt.postIdea === x[0] ? 'on' : ''}" style="white-space:normal;min-height:40px;padding:6px 14px" data-pick="pt.postIdea" data-value="${esc(x[0])}">${esc(x[0])}</button>`).join('')}</div>
      <p class="note warn row tt-top">${I('shield-check')}<span>ห้ามใส่ชื่อ รูป หรือข้อมูลที่ระบุตัวคนไข้</span></p>`;
  }
  act('postNoImage', s => { s.pt.postDraft.image = null; });
  act('savePost', (s, ctx) => {
    const d = s.pt.postDraft; const text = (d.text || '').trim().slice(0, 2000);
    if (!text) { ctx.toast('เขียนข้อความก่อนโพสต์'); return; }
    if (!videoOk(d.video)) { ctx.toast('ลิงก์วิดีโอต้องเป็น YouTube หรือ TikTok'); return; }
    const first = !s.pt.posts.length && !s.pt.postXp;
    s.pt.posts.unshift({ id: 'p' + Date.now().toString(36), text, image: d.image || null, video: (d.video || '').trim(), at: 'เมื่อสักครู่' });
    s.pt.postDraft = { text: '', image: null, video: '' }; ctx.close();
    if (first) { s.pt.postXp = true; ctx.xp(XP.post, 'โพสต์แรก'); }
    ctx.toast(verified(s) ? 'โพสต์แล้ว คนไข้เห็นบนโปรไฟล์ของคุณ' : 'โพสต์แล้ว คนไข้จะเห็นหลังทีมตรวจใบประกอบ');
  });
  act('skipPost', (s, ctx) => { s.pt.postSkipped = true; ctx.toast('ข้ามโพสต์แรกไว้ก่อน โพสต์ได้ทุกเมื่อ'); });
  act('skipSchedule', (s, ctx) => { s.pt.scheduleSkipped = true; ctx.toast('ข้ามไว้ก่อน งานเสนอยังส่งตามเขตที่คุณรับ'); });
  act('openPost', (s, ctx) => { const id = ctx.data.id; openSheet(st => {
    const x = st.pt.posts.find(p => p.id === id); if (!x) return '<p class="p">ไม่พบโพสต์นี้</p><button class="btn ghost" data-close>ปิด</button>';
    return `${x.image ? `<div class="tt-postimg"><img src="${esc(x.image)}" alt=""></div>` : ''}
      <p class="p" style="color:var(--ink);white-space:pre-wrap">${esc(x.text)}</p>
      ${x.video ? `<a class="btn sm soft" href="#">${I('play')}ดูวิดีโอ</a>` : ''}
      <p class="small">${esc(x.at || '')}</p>
      <div class="grid2"><button class="btn danger" data-act="deletePost" data-id="${esc(x.id)}">${I('trash-2')}ลบโพสต์</button><button class="btn ghost" data-close>ปิด</button></div>`;
  }); });
  act('deletePost', (s, ctx) => { s.pt.posts = s.pt.posts.filter(p => p.id !== ctx.data.id); ctx.close(); ctx.toast('ลบโพสต์แล้ว'); });
  act('coverSheet', () => openSheet(st => `<b class="h2">รูปปก</b><p class="small">รูปบรรยากาศการทำงานหรือสิ่งที่คุณถนัด ห้ามมีหน้าคนไข้</p>
      <label class="btn soft tt-file">${I('upload')}เลือกรูปจากเครื่อง<input type="file" accept="image/*" data-file="pt.cover" data-then="closeSheet" aria-label="เลือกรูปปก"></label>
      <div class="tt-thumbs">${['a/welcome.jpg', 'a/close-care.jpg', 'a/companion.jpg'].map(x => `<button class="${st.pt.cover === x ? 'on' : ''}" data-pick="pt.cover" data-value="${x}" data-then="closeSheet" aria-label="ใช้รูปปกตัวอย่าง"><img src="${x}" alt=""></button>`).join('')}</div>
      ${st.pt.cover ? '<button class="btn danger" data-act="coverRemove">เอารูปปกออก</button>' : ''}<button class="btn ghost" data-close>ปิด</button>`));
  act('closeSheet', (s, ctx) => ctx.close());
  act('coverRemove', (s, ctx) => { s.pt.cover = null; ctx.close(); });
  act('previewMe', () => openSheet(st => {
    const p = st.pt, ok = verified(st); const rv = st.review && st.review.approved && !st.review.hidden ? st.review : null;
    return `<b class="h2">หน้าที่คนไข้เห็น</b>
      ${ok ? '' : `<p class="note row tt-top">${I('eye-off')}<span>ตอนนี้คนไข้ยังไม่เห็นหน้านี้ จะเห็นหลังทีมตรวจใบประกอบ</span></p>`}
      <div class="card flat">
        <div class="tt-pvhead">${avStack(p, 84, { mainShown: p.photoApproved || !ok })}<div class="grow"><b class="h3">${esc(p.displayName)}</b><div class="small">นักกายภาพบำบัด · ${esc(p.zones.slice(0, 3).join(' · '))}</div></div></div>
        ${ok ? `<span class="ver">${I('badge-check')}ตรวจสอบโดย SynaClair</span><span class="small" style="display:block">ใบอนุญาต ก. ${esc(p.license)}</span>` : ''}
        ${p.bio ? `<p class="p">${esc(p.bio)}</p>` : '<p class="small">ยังไม่มีแนะนำตัว</p>'}
        ${rv ? `<div class="bubble">${ui.stars(rv.stars)} “${esc(rv.text)}”</div>${ui.rateTags(rv.liked)}` : ''}
        ${p.posts.length ? `<div class="tt-thumbs">${p.posts.slice(0, 3).map(x => x.image ? `<span style="width:64px;height:64px;border-radius:12px;overflow:hidden;display:block"><img src="${esc(x.image)}" alt="" style="width:100%;height:100%;object-fit:cover"></span>` : '').join('')}</div>` : ''}
        <span class="btn" style="pointer-events:none">ขอคนนี้</span>
      </div>
      <p class="small">คนไข้เห็นเลขใบประกอบ แต่ไม่เห็นชื่อจริง และทักคุณตรง ๆ ไม่ได้ ทุกคำขอผ่านทีม</p>
      <button class="btn ghost" data-close>ปิด</button>`;
  }));

  act('noteOpen', s => { const n = liveNote(s.pt); s.pt.noteDraft = n ? n.text : ''; openSheet(st => {
    const p = st.pt, n2 = liveNote(p), photos = profPhotos(p);
    return `<b class="h2">โน้ต</b>
      <div class="tt-nedit">
        <label class="tt-nbub"><input class="tt-nin" data-bind="pt.noteDraft" data-count="ttNoteN" maxlength="60" value="${esc(p.noteDraft)}" placeholder="วันนี้คิดอะไรอยู่…" aria-label="พิมพ์โน้ต" autocomplete="off"></label>
        ${photos.length ? `<span class="tt-nface"><img src="${esc(photos[0])}" alt=""></span>` : ui.avatar(p.displayName, null, 120)}
        <small class="hint"><span id="ttNoteN">${p.noteDraft.length}</span>/60</small>
        <p class="tt-nhint">${I('clock-3')}โน้ตจะหายไปเองใน 24 ชั่วโมง</p>
      </div>
      <p class="note row tt-top">${I('shield-alert')}<span>ห้ามใส่ชื่อ ที่อยู่ หรือข้อมูลที่ระบุตัวคนไข้</span></p>
      <button class="btn" data-act="noteSave">${I('send')}แชร์โน้ต${p.noteXpDay === new Date().toDateString() ? '' : ` · +${XP.note} XP`}</button>
      ${n2 ? '<button class="btn danger" data-act="noteDelete">ลบโน้ต</button>' : ''}
      <button class="btn ghost" data-close>ปิด</button>`;
  }); });
  act('noteSave', (s, ctx) => {
    const text = (s.pt.noteDraft || '').trim(); if (!text) { ctx.toast('พิมพ์โน้ตก่อนนะคะ'); return; }
    s.pt.note = { text, at: Date.now() }; ctx.close();
    const today = new Date().toDateString();
    if (s.pt.noteXpDay !== today) { s.pt.noteXpDay = today; ctx.xp(XP.note, 'โน้ตวันนี้'); } else ctx.toast('แชร์โน้ตแล้ว');
  });
  act('noteDelete', (s, ctx) => { s.pt.note = null; ctx.close(); ctx.toast('ลบโน้ตแล้ว'); });
  act('galleryAdd', s => { const x = s.pt.galleryNew; s.pt.galleryNew = null; if (x && s.pt.gallery.length < GALLERY_MAX) s.pt.gallery.push(x); });
  act('gallerySample', s => { if (s.pt.gallery.length >= GALLERY_MAX) return; s.pt.gallery.push(GALLERY_SAMPLES.find(x => !s.pt.gallery.includes(x)) || GALLERY_SAMPLES[0]); });
  act('galleryRemove', (s, ctx) => { s.pt.gallery.splice(+ctx.data.i, 1); });

  /* ---------- t.photo ---------- */
  scr('t.photo', {
    mount: (root, s) => mountCrop(root, s),
    render(s) {
      const p = s.pt, src = p.photoDraft ? photoSrc(p.photoDraft) : (p.photo ? photoSrc(p.photo) : null);
      return `<div class="scr white">${ui.bar('รูปโปรไฟล์')}
        <div class="body">
          <div class="stack"><div class="row between"><h1 class="h1">ใส่รูปโปรไฟล์</h1>${p.photo ? '' : `<span class="tt-xp">+${XP.photo} XP</span>`}</div><p class="p">คนไข้เห็นรูปนี้ก่อนรับนัด รูปที่เห็นหน้าชัดช่วยให้เขาวางใจ</p></div>
          <label class="tt-photo" aria-label="แตะเพื่อเลือกรูป">${src ? `<img src="${esc(src)}" alt="รูปที่เลือก">` : `<span style="display:grid;justify-items:center;gap:6px">${I('camera')}<span class="small">แตะเพื่อเลือกรูป</span></span>`}<span class="tt-cam">${I('camera')}</span><input type="file" accept="image/*" data-file="pt.photoDraft" data-then="photoEdit"></label>
          ${src ? `<button class="btn sm ghost" style="justify-self:center" data-act="photoEdit">${I('crop')}ครอป หมุน หรือซูมรูปนี้</button>` : ''}
          <div class="tt-dos"><span class="y"><i>${I('check')}</i>เห็นหน้าชัด</span><span class="y"><i>${I('check')}</i>แสงสว่าง</span><span class="n"><i>${I('x')}</i>แว่นดำ หมวก</span><span class="n"><i>${I('x')}</i>รูปกลุ่ม</span></div>
          <div class="grid2"><label class="btn ghost tt-file" style="width:100%">${I('image')}เลือกรูป<input type="file" accept="image/*" data-file="pt.photoDraft" data-then="photoEdit" aria-label="เลือกรูปจากเครื่อง"></label><button class="btn ghost" style="width:100%" data-pick="pt.photoDraft" data-value="sample" data-then="photoEdit">ใช้รูปตัวอย่าง</button></div>
          <label class="check"><input type="checkbox" data-bind="pt.photoConsent" ${p.photoConsent ? 'checked' : ''}><span>ยินยอมให้แสดงรูปนี้บนหน้าเว็บ<br><span class="small">ทีมตรวจรูปพร้อมใบประกอบก่อนแสดงให้คนไข้</span></span></label>
          <div class="tt-more">
            <div class="row between"><b class="sec-h">${I('images')}รูปอื่น ๆ ให้คนไข้ปัดดู</b><span class="small">${p.gallery.length}/${GALLERY_MAX} · ไม่บังคับ</span></div>
            <p class="small">รูปตอนทำงาน รูปเท่ ๆ สวย ๆ ของคุณ คนไข้แตะรูปโปรไฟล์แล้วปัดดูได้แบบ IG</p>
            <div class="tt-gal">${p.gallery.map((x, i) => `<span class="g"><img src="${esc(photoSrc(x))}" alt="รูปที่ ${i + 2}"><button class="x" data-act="galleryRemove" data-i="${i}" aria-label="เอารูปที่ ${i + 2} ออก">${I('x')}</button></span>`).join('')}
              ${p.gallery.length < GALLERY_MAX ? `<label class="g add tt-file">${I('plus')}<span class="small">เพิ่มรูป</span><input type="file" accept="image/*" data-file="pt.galleryNew" data-then="galleryAdd" aria-label="เพิ่มรูปอื่น"></label>` : ''}</div>
            ${p.gallery.length < GALLERY_MAX ? '<button class="btn sm ghost" data-act="gallerySample">เพิ่มรูปตัวอย่าง</button>' : ''}
          </div>
        </div>
        <div class="foot">${p.photo && !p.photoDraft ? `<button class="btn" data-back>${I('check')}เสร็จแล้ว</button>` : `<button class="btn" data-act="savePhoto" data-need="pt.photoDraft,pt.photoConsent">${I('check')}ใช้รูปนี้</button>`}</div></div>`;
    }
  });
  /* Photo editor (Boss 23 Oct, like Facebook): drag to move, slider to zoom, rotate 90°, round crop preview; "ใช้รูปนี้" bakes a 512 px square. */
  const CROP_V = 240, CROP_OUT = 512;
  const cropFit = e => { const sw = e.r % 180 ? e.h : e.w, sh = e.r % 180 ? e.w : e.h; const k = CROP_V / Math.min(sw, sh) * e.z; return { k, mx: Math.max(0, (sw * k - CROP_V) / 2), my: Math.max(0, (sh * k - CROP_V) / 2) }; };
  const cropCss = e => { if (!e.w) return 'opacity:0'; const f = cropFit(e); return `width:${e.w}px;height:${e.h}px;transform:translate(-50%,-50%) translate(${e.x}px,${e.y}px) rotate(${e.r}deg) scale(${f.k})`; };
  function cropSheet(st) {
    const e = st.pt.edit || {};
    return `<div class="row between"><b class="h2">ปรับรูปโปรไฟล์</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <p class="small" style="margin:0">ลากรูปเพื่อขยับ ใช้แถบด้านล่างซูม วงกลมคือส่วนที่คนไข้จะเห็น</p>
      <div class="tt-crop" style="--v:${CROP_V}px"><img src="${esc(e.src || '')}" alt="รูปที่กำลังปรับ" draggable="false" style="${cropCss(e)}"><span class="mask" aria-hidden="true"></span></div>
      <label class="tt-zoom">${I('zoom-out')}<input type="range" min="1" max="3" step="0.01" value="${e.z || 1}" aria-label="ซูม" data-crop-zoom>${I('zoom-in')}</label>
      <div class="grid2"><button class="btn ghost" style="width:100%" data-act="photoRotate">${I('rotate-cw')}หมุน 90°</button><button class="btn ghost" style="width:100%" data-act="photoReset">${I('rotate-ccw')}เริ่มใหม่</button></div>
      <button class="btn" data-act="photoApply">${I('check')}ใช้รูปนี้</button>`;
  }
  act('photoEdit', (s, ctx) => { const p = s.pt, src = photoSrc(p.photoDraft || p.photo || 'sample'); p.edit = { src, x: 0, y: 0, z: 1, r: 0, w: 0, h: 0 }; openSheet(cropSheet); });
  act('photoRotate', s => { const e = s.pt.edit; e.r = (e.r + 90) % 360; e.x = 0; e.y = 0; });
  act('photoReset', s => { Object.assign(s.pt.edit, { x: 0, y: 0, z: 1, r: 0 }); });
  act('photoApply', (s, ctx) => {
    const e = s.pt.edit, img = document.querySelector('#dev .tt-crop img'); if (!e || !img || !e.w) return;
    const c = document.createElement('canvas'); c.width = c.height = CROP_OUT; const g = c.getContext('2d'), f = cropFit(e), u = CROP_OUT / CROP_V;
    g.fillStyle = '#fff'; g.fillRect(0, 0, CROP_OUT, CROP_OUT);
    g.translate(CROP_OUT / 2 + e.x * u, CROP_OUT / 2 + e.y * u); g.rotate(e.r * Math.PI / 180); g.scale(f.k * u, f.k * u); g.drawImage(img, -e.w / 2, -e.h / 2);
    s.pt.photoDraft = c.toDataURL('image/jpeg', 0.9); s.pt.edit = null; ctx.close(); ctx.toast('ปรับรูปแล้ว กด "ใช้รูปนี้" เพื่อบันทึก');
  });
  // Live drag and zoom update the picture directly (no re-render while the finger moves); the state keeps the last position.
  function mountCrop(root, s) {
    const box = root.querySelector('.tt-crop'), e = s.pt.edit; if (!box || !e) return;
    const img = box.querySelector('img'), paint = () => { img.style.cssText = cropCss(e); };
    const clamp = () => { const f = cropFit(e); e.x = Math.max(-f.mx, Math.min(f.mx, e.x)); e.y = Math.max(-f.my, Math.min(f.my, e.y)); };
    if (!e.w) { const ready = () => { e.w = img.naturalWidth; e.h = img.naturalHeight; clamp(); paint(); }; if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true }); }
    let from = null;
    box.addEventListener('pointerdown', ev => { from = { px: ev.clientX, py: ev.clientY, x: e.x, y: e.y }; box.setPointerCapture(ev.pointerId); box.classList.add('drag'); });
    box.addEventListener('pointermove', ev => { if (!from) return; e.x = from.x + ev.clientX - from.px; e.y = from.y + ev.clientY - from.py; clamp(); paint(); });
    const end = () => { from = null; box.classList.remove('drag'); };
    box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
    const zoom = root.querySelector('[data-crop-zoom]'); if (zoom) zoom.addEventListener('input', () => { e.z = +zoom.value; clamp(); paint(); });
  }
  act('savePhoto', (s, ctx) => {
    const first = !s.pt.photo;
    s.pt.photo = s.pt.photoDraft || 'sample'; s.pt.photoConsent = true; s.pt.photoDraft = null;
    if (!first && verified(s)) s.pt.photoApproved = false;
    if (first) ctx.xp(XP.photo, 'รูปโปรไฟล์');
    ctx.toast(first ? 'ใส่รูปแล้ว' : 'เปลี่ยนรูปแล้ว ทีมจะตรวจรูปใหม่ก่อนแสดง');
    return 't.hub';
  });

  /* ======================================================================
     t.schedule · ตารางแบบ Google Calendar
     ====================================================================== */
  function nowMin() { const d = new Date(); return Math.min(Math.max(d.getHours() * 60 + d.getMinutes(), H0 * 60 + 20), H1 * 60 - 20); }
  function dayColumn(s, idx, wide) {
    const cells = Array.from({ length: H1 - H0 }, (_, k) => `<button class="tt-cell" data-act="cellTap" data-idx="${idx}" data-h="${H0 + k}" aria-label="เพิ่มเวลา ${dLong(idx)} ${String(H0 + k).padStart(2, '0')}:00"></button>`).join('');
    const pos = (a, b) => `top:${(toMin(a) - H0 * 60) / 60 * HP + 1}px;height:${Math.max(18, (toMin(b) - toMin(a)) / 60 * HP - 2)}px`;
    const blocks = blocksOn(s, idx).map(b => `<button class="tt-ev ${b.sent ? 'open' : 'draft'}" style="${pos(b.start, b.end)}" data-act="editBlock" data-i="${b.i}" data-idx="${idx}" aria-label="${b.sent ? 'เปิดรับงาน' : 'ร่าง ยังไม่ส่ง'} ${b.start}–${b.end}">${wide ? `${b.start}–${b.end}` : b.start.slice(0, 2) + '–' + b.end.slice(0, 2)}<small>${wide ? (b.sent ? 'เปิดรับงาน · ' : 'ยังไม่ส่ง · ') + esc(b.zone) + (b.repeat ? ' · ทุกสัปดาห์' : '') : (b.sent ? 'รับงาน' : 'ร่าง')}</small></button>`).join('');
    const visits = visitsOn(s, idx).map(v => { const t = visitSpan(v); return `<button class="tt-ev visit" style="${pos(t.start, t.end)}" data-act="visitBlock" data-n="${v.n}" aria-label="ทำเคส ${esc(pname(s))} ${t.start}">${wide ? `${t.start}–${t.end} · ${esc(pname(s))} · ครั้งที่ ${v.n}${s.course ? '/' + (s.course.sessions + (s.course.bonus || 0)) : ''}` : t.start}<small>${wide ? esc(districtOf(s)) : esc(pname(s).replace(/^คุณ/, '')) + ' ' + v.n + (s.course ? '/' + (s.course.sessions + (s.course.bonus || 0)) : '')}</small></button>`; }).join('');
    const now = idx === TODAY_IDX ? `<span class="tt-now" style="top:${(nowMin() - H0 * 60) / 60 * HP}px" aria-hidden="true"></span>` : '';
    return `<div class="tt-col">${cells}${blocks}${visits}${now}</div>`;
  }
  const axis = () => `<div class="tt-axis">${Array.from({ length: H1 - H0 }, (_, k) => `<span>${String(H0 + k).padStart(2, '0')}:00</span>`).join('')}</div>`;
  /* Slot rules (Boss 21 Oct, replaces tiers): one slot = 3 hours in a row, a 6-hour block counts 2 slots.
     Minimum = the old lightest tier (2 slots a month); goal = the old busiest tier (2 slots every week, about 8 a month). */
  const SLOT_MIN = 180, MONTH_MIN = 1, MONTH_GOAL = 4; // Boss 28 Oct: recommend at least 1 slot a week
  const SEND_BY = 25; // Palm 29 Oct, Boss confirmed: send next month's schedule by the 25th of each month.
  const slotsOf = b => Math.floor((toMin(b.end) - toMin(b.start)) / SLOT_MIN) * (b.repeat ? 4 : 1);
  function slotCheck(s) {
    const n = s.pt.schedule.blocks.reduce((a, b) => a + slotsOf(b), 0);
    const row = (done, t, sub) => `<li class="${done ? 'ok' : ''}"><i>${done ? I('check') : ''}</i><span><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}</span></li>`;
    return { n, html: `<ul class="tt-rules">
      ${row(true, '1 สล็อต = 3 ชั่วโมงต่อเนื่อง', '6 ชม. นับ 2 สล็อต · ลงซ้ำทุกสัปดาห์นับ 4 สล็อตต่อเดือน')}
      ${row(n >= MONTH_GOAL, `แนะนำ: เปิดอย่างน้อยสัปดาห์ละ 1 สล็อต (${MONTH_GOAL} ต่อเดือน)`, `ลงแล้ว ${Math.min(n, MONTH_GOAL)}/${MONTH_GOAL} · ลงมากได้งานเสนอก่อน`)}
      ${row(!!s.pt.schedule.sent && !s.pt.schedule.blocks.some(b => !b.sent), `ส่งตารางงานเดือนถัดไป ภายในวันที่ ${SEND_BY} ของทุกเดือน`, s.pt.schedule.sent ? 'ส่งตาราง พ.ย. แล้ว' : `ตาราง พ.ย. ส่งภายใน ${SEND_BY} ต.ค. · ระหว่างนี้จัดเป็นร่างไว้ก่อนได้`)}
    </ul>
    <p class="tt-casetime">${I('clock')}<span><b>เวลาทำเคส</b> เคสใหม่ไม่เกิน 90 นาที · เคสเก่าไม่เกิน 60 นาที</span></p>` };
  }
  scr('t.schedule', {
    mount: root => mountDrag(root),
    render(s) {
      const p = s.pt, c = p.cal, blocks = p.schedule.blocks;
      const drafts = blocks.filter(b => !b.sent).length, sent = blocks.filter(b => b.sent).length, chk = slotCheck(s), short = chk.n < MONTH_MIN;
      let label, view;
      if (c.view === 'month') {
        label = `${MFULL[c.month]} 2569`;
        const first = idxOfDM(1, c.month), lead = wday(first);
        let cells = WD.map(d => `<span class="h">${d}</span>`).join('') + '<span class="out"></span>'.repeat(lead);
        for (let d = 1; d <= MLEN[c.month]; d++) {
          const idx = idxOfDM(d, c.month), bl = blocksOn(s, idx), vs = visitsOn(s, idx);
          const dots = bl.slice(0, 2).map(b => `<i class="${b.sent ? '' : 'd'}"></i>`).join('') + vs.map(() => '<i class="v"></i>').join('');
          // Boss (28 Oct): days with slots stand out, in the legend's colours: sent = solid emerald, draft = hatched, patient visit = cream with a gold edge. Today is an outline.
          const kind = vs.length ? 'vi' : bl.some(b => b.sent) ? 'op' : bl.length ? 'dr' : '';
          cells += `<button class="${idx === TODAY_IDX ? 'today' : ''} ${kind}" data-act="calOpenDay" data-idx="${idx}" aria-label="${d} ${MFULL[c.month]}${kind === 'op' ? ' · เปิดรับงาน' : kind === 'dr' ? ' · ร่าง' : kind === 'vi' ? ' · มีนัดคนไข้' : ''}">${d}<span class="tt-dots">${dots}</span></button>`;
        }
        view = `<div class="tt-cal"><div class="tt-month">${cells}</div></div>`;
      } else if (c.view === 'day') {
        label = `${dLong(c.day)} 2569`;
        view = `<div class="tt-cal" style="--n:1"><div class="tt-calh"><span></span><button class="${c.day === TODAY_IDX ? 'today' : ''}" data-act="calView" data-v="week" aria-label="กลับมุมมองสัปดาห์">${WDF[wday(c.day)]}<b>${dateOf(c.day).d}</b></button></div><div class="tt-calb">${axis()}${dayColumn(s, c.day, true)}</div></div>`;
      } else {
        const start = c.week * 7, a = dateOf(start), b = dateOf(start + 6);
        label = a.m === b.m ? `${a.d}–${b.d} ${MON[a.m]} 2569` : `${a.d} ${MON[a.m]} – ${b.d} ${MON[b.m]}`;
        const days = Array.from({ length: 7 }, (_, k) => start + k);
        view = `<div class="tt-cal" style="--n:7"><div class="tt-calh"><span></span>${days.map(i => `<button class="${i === TODAY_IDX ? 'today' : ''}" data-act="calOpenDay" data-idx="${i}" aria-label="เปิดวัน${dLong(i)}">${WD[wday(i)]}<b>${dateOf(i).d}</b></button>`).join('')}</div><div class="tt-calb">${axis()}${days.map(i => dayColumn(s, i, false)).join('')}</div></div>`;
      }
      return `<div class="scr">${ui.bar('ตาราง', { back: false, right: `<button class="btn sm ghost tt-today" data-act="calToday" aria-label="กลับไปวันนี้">${I('calendar-check')}วันนี้</button>` })}
        <div class="body tight">
          <!-- Boss (28 Oct): what to do comes first; the calendar follows. -->
          <div class="card cream tt-sendcard">
            <div class="row between"><b class="sec-h">${I('calendar-range')}ข้อกำหนดสำหรับส่งตารางงาน</b>${p.schedule.sent && !drafts ? '<span class="pill">ส่งแล้ว</span>' : p.schedXp ? '' : `<span class="tt-xp">+${XP.schedule} XP</span>`}</div>
            ${chk.html}
          </div>
          <div class="seg" role="tablist">${[['day', 'วัน'], ['week', 'สัปดาห์'], ['month', 'เดือน']].map(([k, t]) => `<button class="${c.view === k ? 'on' : ''}" data-act="calView" data-v="${k}" role="tab" aria-selected="${c.view === k}">${t}</button>`).join('')}</div>
          <div class="tt-calbar"><button class="ib" data-act="calNav" data-d="-1" aria-label="ก่อนหน้า">${I('chevron-left')}</button><b>${label}</b><button class="ib" data-act="calNav" data-d="1" aria-label="ถัดไป">${I('chevron-right')}</button></div>
          ${view}
          <div class="tt-legend"><span><i style="background: var(--g-sheen), var(--g-em)"></i>เปิดรับงาน</span><span><i style="background:repeating-linear-gradient(135deg,#fff 0 3px,#e5f0ea 3px 6px);box-shadow:inset 0 0 0 1.5px var(--em)"></i>ยังไม่ส่ง</span><span><i style="background:var(--cream);box-shadow:inset 3px 0 0 var(--gold)"></i>นัดคนไข้</span></div>
          <p class="small row">${I('hand')}<span>${c.view === 'month' ? 'แตะวันที่เพื่อเปิดวันนั้น' : 'แตะช่องว่างเพื่อลง 1 สล็อต (3 ชม.) หรือกดค้างแล้วลากลงเพื่อลงยาวขึ้น'}</span></p>
          <div class="card cream tt-sendbar">
            <div class="row" style="font-size:14px"><span>ร่าง <b>${drafts}</b> ช่วง</span><span>· ส่งแล้ว <b>${sent}</b> ช่วง</span></div>
            <p class="small row" style="margin:0">${I('save')}<span>ช่วงที่ลงไว้เป็นร่าง บันทึกให้อัตโนมัติ ทีมยังไม่เห็นจนกว่าจะกดส่ง · ปิดแอปแล้วกลับมาแก้ต่อได้ถึงวันที่ ${SEND_BY}</span></p>
            <div class="tt-sendrow"><button class="btn ghost" data-act="clearDrafts" ${drafts ? '' : 'disabled'}>${I('eraser')}ล้างร่าง</button>
<button class="btn" data-act="sendSchedule" ${drafts && !short ? '' : 'disabled'}>${I('send')}ส่งตารางเดือนหน้า</button></div>
            ${short ? `<p class="small">ลงอย่างน้อย 1 สล็อตแล้วส่งได้</p>` : drafts ? '' : `<p class="small">${sent ? 'ส่งครบแล้ว เพิ่มหรือแก้ช่วงเวลาแล้วส่งใหม่ได้' : 'แตะช่องว่างในตารางเพื่อลงเวลาก่อน'}</p>`}
          </div>
        </div>${ui.tabs('pt', 't.schedule')}</div>`;
    }
  });
  /* Press and drag down a day column to draw a block, like Google Calendar (touch: hold 0.35 s first so normal scrolling still works).
     A plain tap still opens a 3-hour slot through the button's own cellTap. */
  // Boss (28 Oct): clear every draft slot at once, after a confirm. Slots already sent stay.
  act('clearDrafts', s => { const n = s.pt.schedule.blocks.filter(b => !b.sent).length; if (!n) return; openSheet(() => `<b class="h2">ล้างร่างทั้งหมด?</b>
      <p class="p">ช่วงเวลาที่ยังเป็นร่าง ${n} ช่วงจะถูกลบ ช่วงที่ส่งแล้วยังอยู่เหมือนเดิม</p>
      <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn danger" data-act="clearDraftsYes">${I('trash-2')}ลบร่างทั้งหมด</button></div>`); });
  act('clearDraftsYes', (s, ctx) => { const sc = s.pt.schedule, n = sc.blocks.filter(b => !b.sent).length; sc.blocks = sc.blocks.filter(b => b.sent); ctx.close(); ctx.toast(`ลบร่าง ${n} ช่วงแล้ว`); });
  function mountDrag(root) {
    root.querySelectorAll('.tt-col').forEach(col => {
      let d = null;
      const hourAt = y => Math.max(H0, Math.min(H1 - 1, H0 + Math.floor((y - col.getBoundingClientRect().top) / HP)));
      const paint = () => { const a = d.h0, b = Math.max(d.h1 + 1, a + 3); const end = Math.min(b, H1), st = Math.min(a, end - 3);
        d.ghost.style.top = ((st - H0) * HP + 1) + 'px'; d.ghost.style.height = ((end - st) * HP - 2) + 'px';
        d.ghost.textContent = `${hhmm(st * 60)}–${hhmm(end * 60)} · ${end - st} ชม.`; d.range = [st, end]; };
      const start = e => { d.on = true; d.ghost = document.createElement('div'); d.ghost.className = 'tt-ghost'; col.appendChild(d.ghost); paint(); };
      col.addEventListener('pointerdown', e => {
        const cell = e.target.closest('.tt-cell'); if (!cell || e.button > 0) return;
        d = { h0: +cell.dataset.h, h1: +cell.dataset.h, idx: cell.dataset.idx, y: e.clientY, on: false, touch: e.pointerType !== 'mouse' };
        if (d.touch) d.hold = setTimeout(() => { if (d) { start(); try { col.setPointerCapture(e.pointerId); } catch (er) { /* pointer gone */ } } }, 350);
      });
      col.addEventListener('pointermove', e => {
        if (!d) return;
        if (!d.on) { if (d.touch) { if (Math.abs(e.clientY - d.y) > 8) { clearTimeout(d.hold); d = null; } return; }
          if (Math.abs(e.clientY - d.y) < 6) return; start(); try { col.setPointerCapture(e.pointerId); } catch (er) { /* pointer gone */ } }
        d.h1 = Math.max(d.h0, hourAt(e.clientY)); paint();
      });
      const end = () => { if (!d) return; clearTimeout(d.hold); const done = d.on && d.range; const r = d.range, idx = d.idx; if (d.ghost) d.ghost.remove(); d = null;
        if (done) { tt.noClick = true; setTimeout(() => { tt.noClick = false; }, 400);
          const btn = Object.assign(document.createElement('button'), { hidden: true }); Object.assign(btn.dataset, { act: 'cellTap', idx, h: r[0], h2: r[1] });
          col.appendChild(btn); btn.click(); btn.remove(); } };
      col.addEventListener('pointerup', end); col.addEventListener('pointercancel', () => { if (d) { clearTimeout(d.hold); if (d.ghost) d.ghost.remove(); d = null; } });
      col.addEventListener('touchmove', e => { if (d && d.on) e.preventDefault(); }, { passive: false });
      col.addEventListener('click', e => { if (tt.noClick && e.isTrusted) { e.stopPropagation(); e.preventDefault(); } }, true);
    });
  }
  act('calView', (s, ctx) => { const c = s.pt.cal; const v = ctx.data.v; if (v === 'day' && c.view === 'week') c.day = c.week === 0 ? TODAY_IDX : c.week * 7; if (v === 'week' && c.view === 'day') c.week = weekOf(c.day); if (v === 'month') c.month = dateOf(c.view === 'day' ? c.day : c.week * 7 + 3).m; c.view = v; });
  act('calNav', (s, ctx) => { const c = s.pt.cal, d = +ctx.data.d; if (c.view === 'week') c.week = Math.max(-1, Math.min(9, c.week + d)); else if (c.view === 'day') c.day = Math.max(-7, Math.min(69, c.day + d)); else c.month = Math.max(0, Math.min(2, c.month + d)); });
  act('calToday', s => { Object.assign(s.pt.cal, { week: 0, day: TODAY_IDX, month: 0 }); });
  act('calOpenDay', (s, ctx) => { const c = s.pt.cal; c.day = +ctx.data.idx; c.week = weekOf(c.day); c.view = 'day'; });
  const zoneChoices = s => { const z = zoneNamesFor(s.pt.zones); return z.length ? z : SC.ZONES.map(x => x.name); };
  act('cellTap', (s, ctx) => {
    const idx = +ctx.data.idx, h = +ctx.data.h;
    const start = Math.min(h, H1 - 3), end = Math.max(start + 3, Math.min(+(ctx.data.h2 || 0), H1));
    s.pt.blockDraft = { idx, start: hhmm(start * 60), end: hhmm(end * 60), zone: zoneChoices(s)[0], repeat: false, i: -1 };
    openSheet(blockSheet);
  });
  act('editBlock', (s, ctx) => {
    const b = s.pt.schedule.blocks[+ctx.data.i]; if (!b) return;
    s.pt.blockDraft = { idx: +ctx.data.idx, start: b.start, end: b.end, zone: b.zone, repeat: !!b.repeat, i: +ctx.data.i };
    openSheet(blockSheet);
  });
  function blockSheet(st) {
    const d = st.pt.blockDraft; if (!d) return '<button class="btn ghost" data-close>ปิด</button>';
    if (toMin(d.start) > H1 * 60 - SLOT_MIN) d.start = hhmm(H1 * 60 - SLOT_MIN);
    if (toMin(d.end) - toMin(d.start) < SLOT_MIN) d.end = hhmm(toMin(d.start) + SLOT_MIN);
    const starts = [], ends = [];
    for (let m = H0 * 60; m <= H1 * 60 - SLOT_MIN; m += 30) starts.push(hhmm(m));
    for (let m = toMin(d.start) + SLOT_MIN; m <= H1 * 60; m += 30) ends.push(hhmm(m));
    const hrs = (toMin(d.end) - toMin(d.start)) / 60;
    const b = d.i >= 0 ? st.pt.schedule.blocks[d.i] : null;
    return `<div class="row between"><b class="h2">${d.i >= 0 ? 'แก้เวลารับงาน' : 'เพิ่มเวลารับงาน'}</b><button class="ib soft" data-close aria-label="ปิด">${I('x')}</button></div>
      <p class="p row">${I('calendar-days')}<span><b>${dLong(d.idx)}</b> · ${d.start}–${d.end} · ${hrs} ชม. = ${Math.floor(hrs / 3)} สล็อต</span></p>
      <p class="small">สล็อตละอย่างน้อย 3 ชั่วโมงต่อเนื่อง</p>
      <div class="grid2"><label class="field"><span>เริ่ม</span><select class="in" data-bind="pt.blockDraft.start">${starts.map(t => `<option ${t === d.start ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label class="field"><span>สิ้นสุด</span><select class="in" data-bind="pt.blockDraft.end">${ends.map(t => `<option ${t === d.end ? 'selected' : ''}>${t}</option>`).join('')}</select></label></div>
      <div class="field"><span>โซนรับงาน <small class="tt-hint">1 สล็อต เลือกได้ 1 โซนเท่านั้น</small></span><div class="chips">${zoneChoices(st).map(z => `<button class="chip ${d.zone === z ? 'on' : ''}" data-pick="pt.blockDraft.zone" data-value="${esc(z)}" aria-pressed="${d.zone === z}">${esc(z)}</button>`).join('')}</div>
        ${(() => { const zo = SC.ZONES.find(x => x.name === d.zone), mine = zo ? zo.districts.filter(n => st.pt.zones.includes(n)) : []; return zo ? `<div class="tt-zdist"><small>${mine.length ? `เขตที่คุณรับใน${esc(zo.name)} ${mine.length} เขต` : `ยังไม่ได้เลือกเขตใน${esc(zo.name)}`}</small>${mine.length ? `<div class="chips">${mine.map(n => `<span class="chip sm">${I('map-pin')}${esc(n)}</span>`).join('')}</div>` : ''}</div>` : ''; })()}</div>
      <label class="opt"><input type="checkbox" data-bind="pt.blockDraft.repeat" ${d.repeat ? 'checked' : ''}><span class="grow"><b class="h3">ลงซ้ำทุกสัปดาห์</b><br><span class="small">ทุกวัน${WDF[wday(d.idx)]} ตั้งแต่สัปดาห์นี้</span></span>${I('repeat')}</label>
      ${b && b.sent ? '<p class="small">แก้แล้วช่วงนี้จะกลับเป็นร่าง กดส่งตารางอีกครั้ง</p>' : '<p class="small">บันทึกเป็นร่างก่อน ทีมเห็นเมื่อคุณกดส่งตาราง</p>'}
      <div class="grid2">${d.i >= 0 ? `<button class="btn danger" data-act="deleteBlock">${I('trash-2')}${b && b.repeat ? 'ลบทุกสัปดาห์' : 'ลบช่วงนี้'}</button>` : '<button class="btn ghost" data-close>ยกเลิก</button>'}<button class="btn" data-act="saveBlock">บันทึก</button></div>`;
  }
  act('saveBlock', (s, ctx) => {
    const d = s.pt.blockDraft; if (!d) return;
    const a = toMin(d.start), b = toMin(d.end);
    if (b - a < SLOT_MIN) { ctx.toast('สล็อตละอย่างน้อย 3 ชั่วโมง'); return; }
    const clash = blocksOn(s, d.idx).some(x => x.i !== d.i && a < toMin(x.end) && toMin(x.start) < b);
    if (clash) { ctx.toast('ช่วงนี้ซ้อนกับเวลาที่ลงไว้แล้ว'); return; }
    const block = { day: wday(d.idx), week: weekOf(d.idx), start: d.start, end: d.end, zone: d.zone, repeat: !!d.repeat, sent: false };
    if (d.i >= 0) s.pt.schedule.blocks[d.i] = block; else s.pt.schedule.blocks.push(block);
    s.pt.blockDraft = null; ctx.close(); ctx.toast('บันทึกร่างแล้ว · กดส่งตารางเมื่อพร้อม');
  });
  act('deleteBlock', (s, ctx) => { const d = s.pt.blockDraft; if (d && d.i >= 0) s.pt.schedule.blocks.splice(d.i, 1); s.pt.blockDraft = null; ctx.close(); ctx.toast('ลบช่วงเวลาแล้ว'); });
  act('sendSchedule', (s, ctx) => {
    const sc = s.pt.schedule; if (!sc.blocks.some(b => !b.sent)) { ctx.toast('ยังไม่มีช่วงเวลาใหม่ให้ส่ง'); return; }
    if (slotCheck(s).n < MONTH_MIN) { ctx.toast('ลงอย่างน้อย 1 สล็อตก่อนส่ง'); return; }
    sc.blocks.forEach(b => { b.sent = true; }); sc.sent = true;
    if (!s.pt.schedXp) { s.pt.schedXp = true; ctx.xp(XP.schedule, 'ส่งตาราง'); }
    ctx.toast('ส่งตารางแล้ว ทีมเห็นเวลาที่คุณว่าง');
  });
  act('visitBlock', (s, ctx) => { const n = +ctx.data.n; openSheet(st => { const v = visitOf(st, n); if (!v) return '<button class="btn ghost" data-close>ปิด</button>';
    return `<span class="pill gold">${I('house')}นัดคนไข้</span><b class="h2">ทำเคส ${esc(pname(st))}</b>
      <div class="kv"><dt>ครั้งที่</dt><dd>${v.n}${v.n === 1 ? ' · ClairConnect Trial' : ' · คอร์ส'}</dd><dt>วันเวลา</dt><dd>${esc(v.date)} ${esc(v.time)}</dd><dt>เขต</dt><dd>${esc(districtOf(st))}</dd><dt>สถานะ</dt><dd>${['ยืนยันแล้ว', 'กำลังเดินทาง', 'ถึงแล้ว', 'กำลังดูแล', 'จบแล้ว'][v.step]}</dd></div>
      <div class="grid2"><button class="btn ghost" data-close>ปิด</button><button class="btn" data-act="openVisit" data-n="${v.n}">เปิดนัด</button></div>`; }); });

  /* ======================================================================
     t.work · งาน
     ====================================================================== */
  const STEP_PILL = [['ยืนยันแล้ว', ''], ['กำลังเดินทาง', 'info'], ['ถึงแล้ว', 'info'], ['กำลังดูแล', 'wait'], ['จบแล้ว', 'gray']];
  /* PT patient records (Boss 29 Oct): the work tab is a task board and a medical-record index at once.
     Search by HN or name. HN = the patient's SynaClair number, not the request number; format still to confirm (HN 690001 here).
     Only the patient this PT treats is real; the two finished cases are labelled samples so search has something to find. */
  const SAMPLE_CHARTS = [
    { id: 'x1', hn: 'HN 690412', name: 'คุณประยูร ศรีสุข', area: 'สวนหลวง', status: 'จบการรักษา', tone: 'gray', last: '12 ก.ย. 69', next: '', dx: 'Knee OA, post TKR (Rt)', visits: 6, sample: true },
    { id: 'x2', hn: 'HN 690388', name: 'คุณมาลี วงศ์ใหญ่', area: 'บางนา', status: 'นัดเป็นครั้ง', tone: 'info', last: '30 ก.ย. 69', next: '', dx: 'Stroke (Lt hemiparesis), 2 yrs', visits: 11, sample: true }
  ];
  function myPatients(s) {
    const out = [];
    if (s.request && ['OFFERED', 'BOOKED'].includes(s.request.status) && s.visits.length) {
      const c = s.course, left = c ? Math.max(0, c.sessions + (c.bonus || 0) - (c.used || 0)) : null, nv = s.visits.find(v => v.step < 4), done = s.visits.filter(v => v.step >= 4);
      const last = done[done.length - 1];
      out.push({ id: 'me', hn: 'HN 690521', name: pname(s), area: districtOf(s), status: s.renewal && s.renewal.decided === 'stop' ? 'จบการรักษา' : c ? `คอร์ส เหลือ ${left} ครั้ง` : 'ครั้งแรก', tone: '', last: last ? shortDate(last.date) : '—', next: nv ? `${shortDate(nv.date)} ${nv.time.slice(0, 5)}` : '', dx: ((visitOf(s, 1) || {}).soap || {}).dx || 'รอ OPD ครั้งแรก', visits: done.length, alert: (s.cert.requested && !s.cert.issued) || s.visits.some(v => v.step >= 4 && !v.published) });
    }
    return out.concat(SAMPLE_CHARTS);
  }
  const initial = n => n.replace(/^คุณ/, '').replace(/^[เแโใไ]/, '').slice(0, 1);
  const chartRows = (s, list) => `<div class="tt-emr">${list.map(x => `<button class="tt-emrrow" data-act="openChart" data-id="${x.id}" aria-label="เปิดเวชระเบียน ${esc(x.name)} ${esc(x.hn)}">
      <span class="av" aria-hidden="true">${esc(initial(x.name))}</span>
      <span class="grow"><span class="r1"><b>${esc(x.name)}</b>${x.sample ? ui.sample() : ''}${x.alert ? `<i class="dot" title="มีเอกสารค้าง"></i>` : ''}</span>
        <span class="r2"><code>${esc(x.hn)}</code> · ${esc(x.area)} · ${esc(x.dx)}</span>
        <span class="r3"><span class="pill ${x.tone}">${esc(x.status)}</span>${x.next ? `<span>${I('calendar-days')}นัด ${esc(x.next)}</span>` : `<span>ล่าสุด ${esc(x.last)}</span>`}</span></span>${I('chevron-right')}</button>`).join('')}</div>`;
  const chartList = (s, list) => `<section class="tt-bsec"><h2 class="tt-bh">${I('folder-heart')}คนไข้ของฉัน<span>${list.length}</span></h2><p class="tt-bnone" style="text-align:left;padding:0 2px">เรียงตามนัดที่ใกล้ที่สุด · จุดส้ม = มีเอกสารค้าง</p>${chartRows(s, list)}</section>`;
  act('workQClear', s => { s.pt.q = ''; });
  act('openChart', (s, ctx) => { s.pt.chart = ctx.data.id; s.pt.chartTab = 'sum'; ctx.go('t.chart'); });
  const CHART_TABS = [['sum', 'ภาพรวม'], ['visits', 'นัด'], ['notes', 'บันทึก'], ['docs', 'เอกสาร']];
  scr('t.chart', {
    render(s) {
      const x = myPatients(s).find(r => r.id === s.pt.chart) || myPatients(s)[0];
      if (!x) return `<div class="scr">${ui.bar('เวชระเบียน')}<div class="body">${ui.empty('folder-heart', 'ยังไม่มีคนไข้', 'รับงานแรกแล้ว เวชระเบียนจะขึ้นที่นี่')}</div></div>`;
      const tab = s.pt.chartTab || 'sum', real = x.id === 'me';
      const head = `<div class="card tt-chhead"><div class="row"><span class="av">${esc(initial(x.name))}</span><div class="grow"><b class="h2">${esc(x.name)}</b>${x.sample ? ui.sample() : ''}<div class="small"><code>${esc(x.hn)}</code> · ${esc(x.area)}</div></div><span class="pill ${x.tone}">${esc(x.status)}</span></div>
        ${real ? `<div class="tt-chacts"><button class="btn sm ghost" data-act="ptCallFamily">${I('phone')}โทร (เบอร์กลาง)</button><button class="btn sm ghost" data-act="ptMaps">${I('navigation')}นำทาง</button></div>` : ''}</div>`;
      const tabs = `<nav class="seg" role="tablist">${CHART_TABS.map(([k, t]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-pick="pt.chartTab" data-value="${k}">${t}</button>`).join('')}</nav>`;
      let body = '';
      if (!real) body = `<div class="card flat">${kvp([['การวินิจฉัย', esc(x.dx)], ['ทำเคสแล้ว', x.visits + ' ครั้ง'], ['ครั้งล่าสุด', esc(x.last)], ['สถานะ', esc(x.status)]])}<p class="small" style="margin:0">ข้อมูลตัวอย่าง ให้เห็นว่าค้นหาเวชระเบียนได้</p></div>`;
      else if (tab === 'sum') {
        const o = (visitOf(s, 1) || {}).soap || {}, bp = SC.bpCat(s.patient.bp), c = s.course, total = c ? c.sessions + (c.bonus || 0) : 0;
        body = `<div class="card flat"><b class="sec-h">${I('target')}เป้าหมาย</b><p class="p" style="color:var(--ink)">${esc((s.coursePlan && s.coursePlan.goal) || o.goal || 'ยังไม่ได้ตั้ง · คุยกับคนไข้หลังครั้งแรก')}</p></div>
          <div class="card flat">${kvp([['การวินิจฉัย', esc(o.dx || 'รอ OPD ครั้งแรก')], ['ความดันล่าสุด', bp ? `${esc(s.patient.bp.sys)}/${esc(s.patient.bp.dia)} · ${bp.label}` : 'ไม่ทราบ'], ['จองให้', s.patient.bookingFor === 'SOMEONE_ELSE' ? 'คนในครอบครัวจองให้' : 'คนไข้จองเอง'], ['คอร์ส', c ? `${c.sessions} ครั้ง · ใช้ ${c.used || 0} เหลือ ${Math.max(0, total - (c.used || 0))}` : 'ยังไม่มีคอร์ส'], ['นัดถัดไป', esc(x.next || '—')]])}</div>`;
      } else if (tab === 'visits') body = `<div class="list">${s.visits.slice().sort((a, b) => b.n - a.n).map(v => `<button class="li" data-act="openVisit" data-n="${v.n}"><span class="tile">${I(v.step >= 4 ? 'circle-check' : 'calendar-days')}</span><span class="grow"><span class="t">ครั้งที่ ${v.n}</span><br><span class="s">${esc(v.date)} ${esc(v.time)}</span></span><span class="pill ${STEP_PILL[v.step][1]}">${STEP_PILL[v.step][0]}</span></button>`).join('')}</div>`;
      else if (tab === 'notes') body = `<div class="list">${s.visits.filter(v => v.step >= 4).sort((a, b) => b.n - a.n).map(v => v.published
          ? `<button class="li" data-act="viewReport" data-n="${v.n}"><span class="tile">${I('file-check-2')}</span><span class="grow"><span class="t">${v.n === 1 ? 'OPD' : 'SOAP'} ครั้งที่ ${v.n}</span><br><span class="s">${esc(v.date)} · ลงนามแล้ว</span></span>${I('chevron-right', 'chev')}</button>`
          : `<button class="li" data-go="t.opd" data-p-n="${v.n}"><span class="tile gold">${I('file-pen-line')}</span><span class="grow"><span class="t">${v.n === 1 ? 'OPD' : 'SOAP'} ครั้งที่ ${v.n}</span><br><span class="s">ยังไม่ได้เขียน · ${opdDue(v)}</span></span><span class="pill wait">ค้าง</span></button>`).join('') || `<p class="tt-bnone">ยังไม่มีบันทึก</p>`}</div>`;
      else body = `<div class="list">
          <button class="li" data-go="t.cert"><span class="tile ${s.cert.requested && !s.cert.issued ? 'gold' : ''}">${I('file-text')}</span><span class="grow"><span class="t">ใบรับรองกายภาพบำบัด</span><br><span class="s">${s.cert.issued ? 'ส่งแล้ว' : s.cert.requested ? 'คนไข้ขอแล้ว · ค้าง' : 'คนไข้ยังไม่ได้ขอ'}</span></span>${I('chevron-right', 'chev')}</button>
          ${s.renewal && s.renewal.sent ? `<button class="li" data-go="t.renew"><span class="tile">${I('flag')}</span><span class="grow"><span class="t">สรุปจบคอร์ส</span><br><span class="s">${s.renewal.decided ? 'คนไข้ตัดสินใจแล้ว' : 'รอคนไข้ตัดสินใจ'}</span></span>${I('chevron-right', 'chev')}</button>` : ''}</div>`;
      return `<div class="scr">${ui.bar('เวชระเบียน')}<div class="body enter">${head}${real ? tabs : ''}${body}</div></div>`;
    }
  });
  const kvp = pairs => `<dl class="kv">${pairs.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;

  scr('t.work', {
    render(s) {
      const p = s.pt;
      if (p.status === 'NONE') return `<div class="scr">${ui.bar('งาน', { back: false })}<div class="body">${ui.empty('user-round', 'ยังไม่มีโปรไฟล์', 'สมัครด้วย LINE ก่อน แล้วงานเสนอจะมาตามเขตที่คุณรับ', '<button class="btn auto" data-go="t.join">ไปหน้าสมัคร</button>')}</div>${ui.tabs('pt', 't.work')}</div>`;
      if (!verified(s)) return `<div class="scr">${ui.bar('งาน', { back: false })}<div class="body"><div class="card tt-lock"><span class="tile gold">${I('lock')}</span><b class="h2">งานเปิดหลังตรวจใบประกอบ</b>
          <p class="p">ทีมกำลังตรวจเลขใบประกอบวิชาชีพของคุณ ปกติภายใน 1 วันทำการ ผลแจ้งใน LINE</p>
          <p class="small">ระหว่างนี้แต่งโปรไฟล์และลงเวลาว่างไว้เลย ต้องส่งตารางก่อน ถึงจะได้รับงาน (แนะนำสัปดาห์ละ 1 สล็อต)</p>
          <div class="grid2" style="width:100%"><button class="btn ghost" style="width:100%" data-go="t.hub">แต่งโปรไฟล์</button><button class="btn ghost" style="width:100%" data-go="t.schedule">ลงเวลาว่าง</button></div></div></div>${ui.tabs('pt', 't.work')}</div>`;
      const secs = [], B = { answer: [], upcoming: [], docs: [] }, put = (k, h) => { B[k].push(h); secs.push(h); };
      const needSched = !p.schedule.sent;
      if (needSched) put('answer', `<button class="card tap tt-cardbtn" data-go="t.schedule"><div class="row"><span class="tile gold">${I('calendar-plus')}</span><span class="grow"><b class="sec-h">${I('calendar-plus')}ลงเวลาว่างเดือน พ.ย.</b><br><span class="small">แนะนำสัปดาห์ละ 1 สล็อต (สล็อตละ 3 ชม.) · ยังไม่ส่งตาราง งานเสนอจะยังไม่มา</span></span>${I('chevron-right')}</div></button>`);
      if (!needSched && offerForMe(s)) {
        const mins = remainMin(s);
        put('answer', `<button class="card tap tt-cardbtn" data-act="openOffer">
          <div class="row"><span class="tile gold">${I('bell-ring')}</span><b class="h3 grow">งานเสนอใหม่</b><span class="pill wait">${I('clock')}${mins} นาที</span></div>
          ${s.request.preferredPt === 'me' ? `<span class="pill">${I('heart-handshake')}ผู้รับบริการขอคุณ</span>` : ''}
          <div class="small row wrap"><span class="row" style="gap:4px">${I('calendar-days')}${esc(SC.VISIT1.short)}</span><span class="row" style="gap:4px">${I('map-pin')}${esc(districtOf(s))}</span></div>
          <div class="row between"><span class="money" style="font-size:18px;color:var(--forest)">${money(NET_TRIAL)} <span class="small">รายได้สุทธิ</span></span><span class="btn sm">ดูงาน ${I('chevron-right')}</span></div></button>`);
      }
      const vr = visitOf(s, 1);
      if (vr && vr.step === 0) put('upcoming', skipCard(vr));
      const next = s.visits.filter(v => v.step < 4);
      if (next.length) put('upcoming', `${next.map(v => `<button class="card tap tt-cardbtn" data-act="openVisit" data-n="${v.n}">
          <div class="row"><span class="tile">${I('car-front')}</span><span class="grow"><b class="h3">ทำเคส ${esc(pname(s))}</b><br><span class="small">ครั้งที่ ${v.n} · ${esc(v.date)} ${esc(v.time)}</span></span><span class="pill ${STEP_PILL[v.step][1]}">${STEP_PILL[v.step][0]}</span></div>
          <div class="small row">${I('map-pin')}${esc(districtOf(s))} · ถึงก่อนเวลา 10 นาที</div></button>`).join('')}`);
      const toWrite = s.visits.filter(v => v.step >= 4 && !v.published && (v.n !== 1 || planDone(s)));
      if (toWrite.length) put('docs', `${toWrite.map(v => `<button class="card tap tt-cardbtn" data-go="t.opd" data-p-n="${v.n}">
          <div class="row"><span class="tile gold">${I('file-pen-line')}</span><span class="grow"><b class="h3">${v.n === 1 ? 'เขียน OPD' : 'เขียน SOAP ครั้งที่ ' + v.n} · ${esc(pname(s))}</b><br><span class="small">${opdDue(v)}</span></span>${I('chevron-right')}</div></button>`).join('')}`);
      const v1 = visitOf(s, 1);
      if (v1 && v1.step >= 4 && !planDone(s)) put('docs', `<button class="card tap tt-cardbtn" data-go="t.plan">
          <div class="row"><span class="tile">${I('clipboard-check')}</span><span class="grow"><b class="h3">คุยแผนการดูแล · ${esc(pname(s))}</b><br><span class="small">${s.coursePlan && s.coursePlan.step ? 'ทำต่อจากขั้นที่ค้างไว้' : 'วางแผน เสนอคอร์ส ให้คนไข้สแกนจ่าย และนัดครั้งที่ 2 หน้างาน'}</span></span>${I('chevron-right')}</div></button>`);
      if (s.course) secs.push(`<div class="card flat"><div class="row"><span class="tile gold">${I('package')}</span><span class="grow"><b class="h3">คอร์ส ${s.course.sessions} ครั้ง${s.course.bonus ? ` แถม ${s.course.bonus}` : ''} · ${money(s.course.total)}</b><br><span class="small">${s.course.next ? 'นัดครั้งที่ 2: ' + esc(s.course.next) : 'ยังไม่ได้นัดครั้งที่ 2'}</span></span><span class="pill ${s.course.approved ? '' : 'wait'}">${s.course.approved ? 'เปิดสิทธิ์แล้ว' : 'รอแอดมินตรวจสลิป'}</span></div>
          ${s.course.slip && s.coursePlan && s.coursePlan.step < 6 ? `<button class="btn sm soft" data-go="t.plan">ทำขั้นที่เหลือต่อ</button>` : ''}</div>`);
      const v2 = visitOf(s, 2);
      // Certificate is its own task (Boss 29 Oct): it shows as soon as the patient asks, from visit 1 on; it is not part of writing the OPD.
      if (s.cert.requested && !s.cert.issued && v1) put('docs', `<button class="card tap tt-cardbtn" data-go="t.cert">
          <div class="row"><span class="tile gold">${I('file-text')}</span><span class="grow"><b class="h3">ทำใบรับรอง · ${esc(pname(s))}</b><br><span class="small">คนไข้ขอ (${s.cert.lang === 'EN' ? 'English' : 'ภาษาไทย'})${s.cert.purpose ? ' · ใช้' + esc(s.cert.purpose) : ''} · ${v1.published ? 'ดึงบางส่วนจาก OPD ให้แล้ว' : 'ทำได้หลังส่ง OPD ครั้งแรก'}</span></span>${I('chevron-right')}</div></button>`);
      const c = s.course, cTotal = c ? c.sessions + (c.bonus || 0) : 0, cLeft = c ? Math.max(0, cTotal - (c.used || 0)) : 0, lastV = c && visitOf(s, cTotal);
      if (c && c.approved && cLeft > 0 && v2 && v2.step >= 4 && !lastV) put('upcoming', `<button class="card tap tt-cardbtn tt-skipc" data-act="courseSkipLast"><div class="row"><span class="tile">${I('fast-forward')}</span><span class="grow"><b class="h3">ซ้อมข้ามเวลา: ไปครั้งสุดท้ายของคอร์ส</b><br><span class="small">ครั้งที่ 3–${cTotal - 1} ทำครบแล้ว (ระบบตัดคอร์สทุกครั้งที่กดจบการดูแล) · เหลือครั้งที่ ${cTotal}</span></span>${I('chevron-right')}</div></button>`);
      if (c && c.approved && !cLeft && lastV && lastV.step >= 4 && !(s.renewal && s.renewal.sent)) put('docs', `<button class="card tap tt-cardbtn" data-go="t.renew"><div class="row"><span class="tile gold">${I('flag')}</span><span class="grow"><b class="h3">สรุปจบคอร์ส · ${esc(pname(s))}</b><br><span class="small">เทียบผลกับเป้าหมาย แล้วเสนอ: ต่อคอร์ส / นัดเป็นครั้ง / จบการรักษา</span></span>${I('chevron-right')}</div></button>`);
      if (s.renewal && s.renewal.sent) secs.push(`<div class="card flat"><div class="row"><span class="tile">${I(s.renewal.decided === 'renew' ? 'repeat' : s.renewal.decided ? 'flag' : 'hourglass')}</span><span class="grow"><b class="h3">${s.renewal.decided === 'renew' ? 'คนไข้ต่อคอร์สแล้ว' : s.renewal.decided === 'pervisit' ? 'คนไข้ขอนัดเป็นครั้ง' : s.renewal.decided === 'stop' ? 'จบการรักษา' : 'ส่งสรุปจบคอร์สแล้ว รอคนไข้ตัดสินใจ'}</b><br><span class="small">${s.renewal.decided === 'renew' ? `คอร์สใหม่ ${s.course.sessions} ครั้ง เปิดสิทธิ์แล้ว · นัดถัดไป ${esc(s.renewal.next || '')}` : s.renewal.decided ? 'ทีมทักถามอาการคนไข้ใน 30 วัน' : 'ระบบเตือนคนไข้ใน 3 วัน ถ้ายังไม่ตอบ ทีมโทรถาม'}</span></span></div></div>`);
      const tab = p.workTab || 'all', q = (p.q || '').trim().toLowerCase(), pts = myPatients(s);
      const tiles = [['answer', 'bell-ring', 'ต้องตอบ', B.answer.length], ['upcoming', 'calendar-clock', 'กำลังจะมาถึง', next.length], ['docs', 'file-pen-line', 'เอกสารค้าง', B.docs.length], ['patients', 'folder-heart', 'คนไข้ของฉัน', pts.length]];
      const sec = (k, ic, t, items, none) => `<section class="tt-bsec"><h2 class="tt-bh">${I(ic)}${t}<span>${items.length}</span></h2>${items.length ? items.join('') : `<p class="tt-bnone">${none}</p>`}</section>`;
      const board = tab === 'patients' ? chartList(s, pts)
        : `${tab === 'all' || tab === 'answer' ? sec('answer', 'bell-ring', 'ต้องตอบ', B.answer, 'ไม่มีงานที่ต้องตอบ งานเสนอใหม่แจ้งใน LINE ทันที') : ''}
          ${tab === 'all' || tab === 'upcoming' ? sec('upcoming', 'calendar-clock', 'งานที่กำลังจะมาถึง', B.upcoming, 'ยังไม่มีนัดที่จะถึง') : ''}
          ${tab === 'all' || tab === 'docs' ? sec('docs', 'file-pen-line', 'งานเอกสารที่ค้างอยู่', B.docs, 'ส่งเอกสารครบแล้ว') : ''}
          ${tab === 'all' ? `<section class="tt-bsec"><h2 class="tt-bh">${I('folder-heart')}คนไข้ของฉัน<span>${pts.length}</span><button class="link" data-pick="pt.workTab" data-value="patients">ดูทั้งหมด</button></h2>${chartRows(s, pts.slice(0, 3))}</section>` : ''}`;
      const found = q ? pts.filter(x => [x.hn, x.hn.replace(/\s/g, ''), x.name].join(' ').toLowerCase().includes(q.replace(/^hn\s*/, ''))) : null;
      return `<div class="scr">${ui.bar('งาน', { back: false })}<div class="body enter tt-work">
        <label class="tt-find">${I('search')}<input class="in" data-bind="pt.q" data-live value="${esc(p.q || '')}" placeholder="ค้นหาคนไข้ ด้วยเลข HN หรือชื่อ" aria-label="ค้นหาคนไข้ด้วยเลข HN หรือชื่อ" autocomplete="off">${q ? `<button class="ib soft" data-act="workQClear" aria-label="ล้างคำค้น">${I('x')}</button>` : ''}</label>
        ${found ? `<section class="tt-bsec"><h2 class="tt-bh">${I('search')}ผลการค้นหา<span>${found.length}</span></h2>${found.length ? chartRows(s, found) : `<p class="tt-bnone">ไม่พบคนไข้ "${esc(p.q)}" ลองพิมพ์เลข HN 6 หลัก หรือบางส่วนของชื่อ</p>`}</section>`
          : `<div class="tt-tiles" role="tablist" aria-label="หมวดงาน">${tiles.map(([k, ic, t, n]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''} ${n && k !== 'patients' ? 'has' : ''}" data-pick="pt.workTab" data-value="${tab === k ? 'all' : k}"><span>${I(ic)}</span><b>${n}</b><small>${t}</small></button>`).join('')}</div>
          ${!p.agreement ? `<div class="card cream"><b class="sec-h">${I('list-checks')}ก่อนรับงานแรก</b><p class="p">อ่านข้อตกลงการรับงาน 1 ครั้ง ประมาณ 2 นาที</p><button class="btn sm" data-go="t.agreement">${I('file-text')}อ่านข้อตกลง</button></div>` : ''}
          ${board}`}
        </div>${ui.tabs('pt', 't.work')}</div>`;
    }
  });
  // OPD/SOAP is due 2 hours after the visit ends (user-requirements 15 Oct); the old card said a fixed 20:00.
  function opdDue(v) { const m = /–(\d{2}):(\d{2})/.exec(v.time || ''); if (!m) return 'ส่งภายใน 2 ชม. หลังจบเคส'; const t = +m[1] * 60 + +m[2] + 120; return `ส่งภายใน ${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${m[2]} (2 ชม. หลังจบเคส)`; }
  function remainMin(s) { const t0 = s.pt.offerSeenAt || Date.now(); return Math.max(1, 30 - Math.floor((Date.now() - t0) / 60000)); }
  act('openOffer', s => { if (!s.pt.offerSeenAt) s.pt.offerSeenAt = Date.now(); return 't.offer'; });
  // Rehearsal time skip before visit 1: day-before confirmation in LINE for both sides, then the 1-hour card whose button opens t.visit.
  const SKIP = [
    ['ระบบส่งการ์ดยืนยันนัดเข้า LINE ทั้งคนไข้และคุณ 1 วันก่อนนัด', 'skipDayBefore', 'ข้ามไป 1 วันก่อนนัด', 'fast-forward'],
    ['คนไข้กดยืนยันนัดใน LINE แล้ว เหลือคุณ กดที่นี่หรือในการ์ด LINE ก็ได้', 'ptConfirmTomorrow', 'ยืนยันนัด', 'calendar-check'],
    ['ทั้งสองฝ่ายยืนยันแล้ว 1 ชม. ก่อนนัด ระบบจะส่งการ์ดให้คุณเริ่มเดินทาง', 'skipHourBefore', 'ข้ามไป 1 ชม. ก่อนนัด', 'fast-forward'],
    ['การ์ด "ใกล้ถึงเวลานัดของคุณ" อยู่ใน LINE แล้ว กดเริ่มเดินทางจากการ์ด หรือจากที่นี่', 'openVisit', 'เริ่มเดินทาง', 'navigation']
  ];
  function skipCard(v) {
    const k = Math.min(v.remind || 0, 3), [msg, a, label, ic] = SKIP[k];
    const marks = ['วันรับงาน', '1 วันก่อนนัด', '1 ชม. ก่อนนัด'].map((t, i) => { const at = k === 0 ? 0 : k < 3 ? 1 : 2; return `<div class="${i < at ? 'd' : i === at ? 'n' : ''}"><i>${i < at ? I('check') : i + 1}</i>${t}</div>`; }).join('');
    return `<span class="kick">ซ้อมข้ามเวลา</span><div class="card tt-skip"><div class="tt-stepper">${marks}</div><p class="small" style="margin:0">${msg}</p>
      <button class="btn" data-act="${a}" data-n="1" data-tt-skip>${I(ic)}${label}</button></div>`;
  }
  act('skipDayBefore', (s, ctx) => { const v = visitOf(s, 1); v.remind = 1; ctx.line('patient', { key: 'tomorrowPatient' }); ctx.line('patient', { me: true, text: 'ยืนยันนัด' }); ctx.line('pt', { key: 'ptTomorrow' }); ctx.toast('1 วันก่อนนัด: การ์ดยืนยันนัดเข้า LINE ทั้งสองฝ่ายแล้ว'); });
  act('ptConfirmTomorrow', (s, ctx) => { const v = visitOf(s, 1); if (!v || (v.remind || 0) >= 2) return 't.work'; v.remind = 2; ctx.line('pt', { me: true, text: 'ยืนยันนัด' }); ctx.toast('ยืนยันนัดแล้ว ทั้งสองฝ่ายพร้อม'); return 't.work'; });
  act('skipHourBefore', (s, ctx) => { const v = visitOf(s, 1); v.remind = 3; ctx.line('pt', { key: 'ptUpcoming' }); document.body.classList.add('line-open'); ctx.toast('1 ชม. ก่อนนัด: กด "เริ่มเดินทาง" บนการ์ดใน LINE'); });
  act('openVisit', (s, ctx) => { const n = +(ctx.data.n || 1); ctx.close(); ctx.go('t.visit', { n: String(n) }); });
  act('viewReport', (s, ctx) => { const n = +ctx.data.n; openSheet(st => { const v = visitOf(st, n); const o = (v && v.soap) || {};
    return `<b class="h2">${n === 1 ? 'OPD ครั้งแรก' : 'SOAP ครั้งที่ ' + n} · ${esc(pname(st))}</b><p class="small">${esc(v ? v.date : '')} · ลงนามแล้ว แก้ไม่ได้ ถ้าต้องแก้ ทีมสร้างฉบับแก้ไขใหม่ให้</p>
      ${o.goal ? `<div class="note mint"><b>เป้าหมาย</b><br>${esc(o.goal)}</div>` : ''}
      <div class="stack">${['s', 'o', 't', 'p'].map(k => { const val = k === 't' ? (o.t || []).join(' · ') : o[k]; return val ? `<p class="p" style="color:var(--ink)"><span class="tt-soapL">${k === 'p' ? 'H' : k.toUpperCase()}</span>${esc(val)}</p>` : ''; }).join('')}</div>
      ${o.family ? `<div class="bubble">${esc(o.family)}</div>` : ''}<button class="btn ghost" data-close>ปิด</button>`; }); });

  /* ---------- t.offer ---------- */
  scr('t.offer', {
    render(s) {
      if (!offerForMe(s)) {
        const booked = s.request && s.request.status === 'BOOKED';
        return `<div class="scr">${ui.bar('งานเสนอ')}<div class="body">${booked ? ui.empty('badge-check', 'คุณรับงานนี้แล้ว', 'ที่อยู่เต็มและรายละเอียดอยู่ในนัดถัดไป', '<button class="btn auto" data-go="t.work">ไปหน้างาน</button>') : ui.empty('inbox', 'ยังไม่มีงานเสนอ', 'งานเสนอจะส่งมาตามเขตที่คุณรับ และแจ้งใน LINE', '<button class="btn auto" data-go="t.work">กลับหน้างาน</button>')}</div></div>`;
      }
      const yes = Object.values(s.patient.health || {}).filter(x => x === 'YES').length;
      return `<div class="scr">${ui.bar('งานเสนอใหม่')}<div class="body enter">
        <div class="row wrap">${s.request.preferredPt === 'me' ? `<span class="pill">${I('heart-handshake')}ผู้รับบริการขอคุณ</span>` : ''}<span class="pill wait">${I('clock')}ตอบภายใน <span id="ttCount">${remainMin(s)}</span> นาที</span></div>
        <div class="card"><span class="kick">ClairConnect Trial · ครั้งแรก</span><b class="h2">ทำเคสที่บ้าน · ${esc(goalText(s))}</b>
          <div class="list" style="box-shadow:none;border-radius:0">
            <div class="li"><span class="tile">${I('calendar-days')}</span><span class="grow"><span class="t">${esc(SC.VISIT1.date)}</span><br><span class="s">${esc(SC.VISIT1.time)}</span></span></div>
            <div class="li"><span class="tile">${I('map-pin')}</span><span class="grow"><span class="t">เขต${esc(districtOf(s))}</span><br><span class="s">ที่อยู่เต็มแสดงหลังคุณรับงาน</span></span></div>
            <div class="li"><span class="tile">${I('clipboard-check')}</span><span class="grow"><span class="t">ความช่วยเหลือที่ขอ</span><br><span class="s">${esc(goalText(s))}${s.patient.bookingFor === 'SOMEONE_ELSE' ? ' · ญาติจองให้' : ''}</span></span></div>
            ${yes ? `<div class="li"><span class="tile gold">${I('shield-check')}</span><span class="grow"><span class="t">ข้อควรระวังจากการคัดกรอง ${yes} ข้อ</span><br><span class="s">ดูรายละเอียดได้หลังรับงาน</span></span></div>` : ''}
          </div></div>
        <div class="card cream"><span class="small" style="color:var(--gink)">รายได้สุทธิของคุณ</span><span class="price">${money(NET_TRIAL)}</span><span class="small" style="color:var(--gink)">โอนรอบถัดไปหลังส่งสรุปการดูแล · ไม่มีค่าใช้จ่ายอื่นที่ต้องจ่ายเพิ่ม</span></div>
        ${s.pt.agreement ? '' : `<p class="note row tt-top">${I('file-text')}<span>งานแรกของคุณ: กดรับแล้วจะพาไปอ่านข้อตกลงการรับงาน 1 ครั้งก่อน</span></p>`}
      </div><div class="foot row2"><button class="btn ghost" data-act="declineOffer">ปฏิเสธ</button><button class="btn" data-act="acceptOffer">${I('check')}รับงานนี้</button></div></div>`;
    },
    mount(root, s) { const el = root.querySelector('#ttCount'); if (el) tt.timers.push(setInterval(() => { el.textContent = remainMin(s); }, 15000)); }
  });
  act('acceptOffer', (s, ctx) => {
    if (!offerForMe(s)) { ctx.toast('งานนี้ไม่อยู่ในรายการแล้ว'); return 't.work'; }
    if (!s.pt.agreement) { s.pt.agreeTick = false; return 't.agreement'; }
    s.request.status = 'BOOKED';
    s.visits = [{ n: 1, date: SC.VISIT1.date, time: SC.VISIT1.time, step: 0, soap: {}, published: false }];
    ctx.line('patient', { key: 'ptIntro' }); ctx.line('patient', { key: 'confirmed' });
    ctx.toast('รับงานแล้ว นัดอยู่ในแท็บงานและตาราง');
    return 't.work';
  });
  const DECLINE = ['ติดนัดอื่นช่วงนั้น', 'ไกลเกินไป', 'ไม่ถนัดเคสแบบนี้', 'ไม่สบาย หรือติดธุระ', 'อื่น ๆ'];
  act('declineOffer', s => { s.pt.declineReason = ''; openSheet(st => `<b class="h2">ปฏิเสธงานนี้?</b><p class="small">บอกเหตุผลสั้น ๆ ให้ทีมเสนองานที่เหมาะกว่าในครั้งหน้า ไม่มีผลกับโปรไฟล์ของคุณ</p>
      <div class="stack">${DECLINE.map(r => `<button class="opt" style="width:100%;text-align:left;${st.pt.declineReason === r ? 'border-color:var(--em2);background:#eaf3ee' : ''}" data-pick="pt.declineReason" data-value="${esc(r)}">${st.pt.declineReason === r ? I('circle-check') : I('circle')}<span>${esc(r)}</span></button>`).join('')}</div>
      <div class="grid2"><button class="btn ghost" data-close>กลับไปดูงาน</button><button class="btn danger" data-act="confirmDecline" data-need="pt.declineReason">ยืนยันปฏิเสธ</button></div>`); });
  act('confirmDecline', (s, ctx) => {
    (s.pt.declineLog = s.pt.declineLog || []).push(s.pt.declineReason); ctx.close();
    ctx.toast('ส่งเหตุผลให้ทีมแล้ว · ห้องซ้อม: งานนี้ยังค้างไว้ให้ลองกดรับได้');
  });

  /* ---------- t.agreement ---------- */
  const AGREE = [
    ['wallet', 'ค่าธรรมเนียมและรายได้', 'รายได้สุทธิหลังหักค่าธรรมเนียมแสดงก่อนกดรับทุกงาน และก่อนเสนอคอร์สให้คนไข้'],
    ['receipt', 'การรับเงิน', 'คนไข้จ่ายผ่าน SynaClair เท่านั้น ทีมโอนรายได้เข้าบัญชีของคุณรอบถัดไปหลังส่งสรุปการดูแล'],
    ['calendar-x', 'การยกเลิกและเลื่อนนัด', 'ถ้าต้องยกเลิกหรือเลื่อน แจ้งทีมล่วงหน้าอย่างน้อย 24 ชม. ผ่านปุ่มติดต่อทีม ทีมจะคุยกับคนไข้ให้'],
    ['shield-check', 'การดูแลคนไข้ในระบบ', 'ประเมินความเหมาะสมและอาการเสี่ยงก่อนเริ่มรักษาทุกครั้ง ไม่นัดหรือรับเงินนอกระบบกับคนไข้ที่มาจาก SynaClair'],
    ['eye-off', 'ข้อมูลส่วนตัวของคนไข้', 'ใช้ที่อยู่และเบอร์โทรเพื่องานนั้นเท่านั้น ห้ามถ่ายรูปหรือโพสต์สิ่งที่ระบุตัวคนไข้'],
    ['file-pen-line', 'บันทึกการดูแล', 'ส่ง OPD หรือ SOAP ภายในวันที่ทำเคส ลงนามแล้วแก้ไม่ได้ ถ้าต้องแก้ ระบบสร้างฉบับแก้ไขใหม่']
  ];
  scr('t.agreement', {
    render(s) {
      const done = s.pt.agreement;
      return `<div class="scr">${ui.bar('ข้อตกลงการรับงาน')}<div class="body">
        <div class="stack"><span class="kick">ฉบับซ้อม · อ่านประมาณ 2 นาที</span><h1 class="h1">อ่านครั้งเดียว ก่อนรับงานแรก</h1>
          <p class="note row tt-top">${I('info')}<span>ฉบับนี้ใช้ในห้องซ้อมเท่านั้น ข้อตกลงจริงมาจากทีมกฎหมายของ SynaClair</span></p></div>
        ${AGREE.map(([ic, t, d], k) => `<div class="card flat"><div class="row tt-top"><span class="tile">${I(ic)}</span><div class="grow"><b class="h3">${k + 1}. ${t}</b><p class="p" style="margin-top:4px">${d}</p></div></div></div>`).join('')}
      </div><div class="foot">${done ? `<p class="note mint row">${I('badge-check')}<span>คุณยอมรับข้อตกลงนี้แล้ว</span></p><button class="btn ghost" data-back>กลับ</button>`
        : `<label class="check"><input type="checkbox" data-bind="pt.agreeTick" ${s.pt.agreeTick ? 'checked' : ''}><span>ฉันอ่านและยอมรับข้อตกลงการรับงาน</span></label><button class="btn" data-act="acceptAgreement" data-need="pt.agreeTick">ยอมรับและไปต่อ</button>`}</div></div>`;
    }
  });
  act('acceptAgreement', (s, ctx) => {
    if (!s.pt.agreeTick) return;
    s.pt.agreement = true; ctx.toast('ยอมรับข้อตกลงแล้ว รับงานได้เลย');
    const hist = SC.v.hist.pt; if (hist.length) { SC.back(); return; }
    return offerForMe(s) ? 't.offer' : 't.work';
  });

  /* ======================================================================
     t.visit · ทำเคส
     ====================================================================== */
  const STEPS = [['เริ่มเดินทาง', 'ระบบแจ้งคนไข้ใน LINE ว่าคุณกำลังไป', 'navigation'], ['ถึงแล้ว', 'กดเมื่อถึงหน้าบ้าน', 'map-pin'], ['เริ่มให้บริการ', 'ประเมินความเหมาะสมก่อนเริ่มรักษา', 'stethoscope'], ['จบการดูแล', 'กดเมื่อดูแลเสร็จ แล้วไปเขียนบันทึก', 'circle-check']];
  const fmtClock = ms => { const t = Math.max(0, Math.floor(ms / 1000)); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
  scr('t.visit', {
    render(s, { param }) {
      const n = +(param.n || 1), v = visitOf(s, n);
      if (!v) return `<div class="scr">${ui.bar('ทำเคส')}<div class="body">${ui.empty('calendar-days', 'ไม่พบนัดนี้', 'นัดจะขึ้นหลังคุณรับงาน หรือหลังแอดมินเปิดสิทธิ์คอร์ส', '<button class="btn auto" data-go="t.work">ไปหน้างาน</button>')}</div></div>`;
      const a = s.patient.address || {};
      const addr = [a.line, a.subdistrict && 'แขวง' + a.subdistrict, a.district && 'เขต' + a.district, a.province, a.postal].filter(Boolean).join(' ') || `เขต${districtOf(s)} กรุงเทพมหานคร`;
      const yes = Object.entries(s.patient.health || {}).filter(([, x]) => x === 'YES').length;
      const stepper = `<div class="tt-stepper">${['เริ่มเดินทาง', 'ถึงแล้ว', 'เริ่มดูแล', 'จบ'].map((t, k) => `<div class="${k < v.step ? 'd' : k === v.step ? 'n' : ''}"><i>${k < v.step ? I('check') : k + 1}</i>${t}</div>`).join('')}</div>`;
      let main;
      if (v.step < 4) {
        const [t, sub, ic] = STEPS[v.step];
        main = `${v.step === 3 ? `<div class="card mint tt-c"><span class="small">ดูแลไปแล้ว</span><span class="tt-timer" id="ttTimer">${fmtClock(Date.now() - (s.pt.clock[n] || Date.now()))}</span></div>` : ''}
          <button class="tt-big" data-act="visitNext" data-n="${n}"><span class="grow"><b>${t}</b><small>${sub}</small></span><span class="arw">${I(ic)}</span></button>`;
      } else if (n === 1 && !planDone(s)) {
        // First visit order (Boss 21 Oct): finish care → plan treatment with the patient → book → OPD within 2 h.
        main = `<div class="note mint row">${I('badge-check')}<span>จบการดูแลแล้ว · คุยแผนการรักษากับคนไข้ต่อเลย</span></div>
          <button class="tt-big" data-go="t.plan"><span class="grow"><b>วางแผนการรักษากับคนไข้</b><small>เป้าหมาย ความถี่ วันนัด และคอร์ส</small></span><span class="arw">${I('clipboard-list')}</span></button>`;
      } else if (!v.published) {
        main = `<div class="note mint row">${I('badge-check')}<span>${n === 1 ? 'วางแผนกับคนไข้แล้ว · เขียน OPD' : 'จบการดูแลแล้ว · เขียน SOAP'} แล้วลงนามส่งให้คนไข้</span></div>
          <button class="tt-big" data-go="t.opd" data-p-n="${n}"><span class="grow"><b>${n === 1 ? 'เขียนบันทึก OPD' : 'เขียน SOAP ครั้งที่ ' + n}</b><small>ส่งภายใน 2 ชม. หลังจบเคส</small></span><span class="arw">${I('file-pen-line')}</span></button>`;
      } else {
        main = `<div class="note mint row">${I('badge-check')}<span>ส่งสรุปเข้า LINE คนไข้แล้ว</span></div><button class="btn ghost" data-act="viewReport" data-n="${n}">ดูสรุปที่ส่ง</button>`;
      }
      return `<div class="scr">${ui.bar('ทำเคส ' + pname(s))}<div class="body">
        <div class="card"><div class="row between"><b class="h3">ครั้งที่ ${n}${n === 1 ? ' · ClairConnect Trial' : ' · คอร์ส'}</b><span class="small">${esc(v.date)}</span></div><p class="small" style="margin:0">${esc(v.time)} · เขต${esc(districtOf(s))}</p>${stepper}</div>
        ${main}
        <div class="tt-map" role="img" aria-label="แผนที่บ้านคนไข้"><span class="me"></span><span class="pin">${I('map-pin')}</span><button class="btn sm ghost" data-act="ptMaps">${I('navigation')}นำทาง</button></div>
        <div class="list">
          <div class="li"><span class="tile">${I('house')}</span><span class="grow"><span class="t">ที่อยู่</span><br><span class="s">${esc(addr)}</span></span></div>
          ${a.landmark ? `<div class="li"><span class="tile">${I('signpost')}</span><span class="grow"><span class="t">จุดสังเกตและวิธีเข้าบ้าน</span><br><span class="s">${esc(a.landmark)}</span></span></div>` : ''}
          <button class="li" data-act="ptCallFamily"><span class="tile">${I('phone')}</span><span class="grow"><span class="t">โทรหาผู้ติดต่อ</span><br><span class="s">${s.patient.bookingFor === 'SOMEONE_ELSE' ? 'ญาติที่จองให้' : esc(pname(s))} · โทรผ่านเบอร์กลาง</span></span>${I('chevron-right', 'chev')}</button>
          <div class="li"><span class="tile">${I('clipboard-check')}</span><span class="grow"><span class="t">สิ่งที่คนไข้ขอ</span><br><span class="s">${esc(goalText(s))}</span></span></div>
          ${s.patient.health && s.patient.health.q4 === 'YES' && s.patient.medNote ? `<div class="li"><span class="tile gold">${I('hospital')}</span><span class="grow"><span class="t">ออกจาก รพ. / ข้อห้ามแพทย์</span><br><span class="s">${esc(s.patient.medNote)}</span></span></div>` : ''}
          ${s.patient.health && s.patient.health.q5 === 'YES' && s.patient.surgeryNote ? `<div class="li"><span class="tile gold">${I('bone')}</span><span class="grow"><span class="t">ผ่าตัด / อุปกรณ์ในร่างกาย</span><br><span class="s">${esc(s.patient.surgeryNote)}</span></span></div>` : ''}
          ${s.patient.health && s.patient.health.q3 === 'YES' && (s.patient.devices || []).length ? `<div class="li"><span class="tile gold">${I('cable')}</span><span class="grow"><span class="t">อุปกรณ์ที่คนไข้ใช้</span><br><span class="s">${esc(s.patient.devices.join(' · '))}</span></span></div>` : ''}
          ${(() => { const b = s.patient.bp, c = SC.bpCat(b); return c ? `<div class="li"><span class="tile ${c.tone === 'ok' ? '' : 'gold'}">${I('heart-pulse')}</span><span class="grow"><span class="t">ความดันล่าสุด ${esc(b.sys)}/${esc(b.dia)}</span><br><span class="s">${c.label} · วัดซ้ำก่อนเริ่มรักษา</span></span></div>` : ''; })()}
          ${s.patient.healthStory ? `<div class="li"><span class="tile">${I('notebook-pen')}</span><span class="grow"><span class="t">เรื่องสุขภาพที่คนไข้เล่า</span><br><span class="s">${esc(s.patient.healthStory)}</span></span></div>` : ''}
          ${yes ? `<div class="li"><span class="tile gold">${I('shield-check')}</span><span class="grow"><span class="t">จากการคัดกรอง: ตอบ "ใช่" ${yes} ข้อ</span><br><span class="s">ถามซ้ำและประเมินก่อนเริ่มรักษา</span></span></div>` : ''}
          <button class="li" data-act="ptCallTeam"><span class="tile">${I('message-circle')}</span><span class="grow"><span class="t">ติดต่อทีม SynaClair</span><br><span class="s">หลงทาง เข้าบ้านไม่ได้ หรือเจอเรื่องไม่ปลอดภัย</span></span>${I('chevron-right', 'chev')}</button>
        </div>
        <p class="note row tt-top">${I('shield-check')}<span>ประเมินความเหมาะสมและอาการเสี่ยงก่อนเริ่มรักษาทุกครั้ง</span></p>
      </div></div>`;
    },
    mount(root, s) {
      const el = root.querySelector('#ttTimer'); const n = +((SC.param('t.visit') || {}).n || 1);
      if (el) tt.timers.push(setInterval(() => { el.textContent = fmtClock(Date.now() - (s.pt.clock[n] || Date.now())); }, 1000));
    }
  });
  act('visitNext', (s, ctx) => {
    const n = +(ctx.data.n || ctx.param.n || 1), v = visitOf(s, n); if (!v || v.step >= 4) return;
    v.step += 1;
    if (v.step === 1) { ctx.line('patient', { key: 'enRoute' }); ctx.toast('แจ้งคนไข้ใน LINE แล้ว: กำลังเดินทาง'); }
    else if (v.step === 2) ctx.toast('บันทึกเวลาถึงแล้ว');
    else if (v.step === 3) { s.pt.clock[n] = Date.now(); ctx.toast('เริ่มให้บริการ จับเวลาให้แล้ว'); }
    else {
      ctx.line('patient', { key: 'visitDone' }); if (n === 1) ctx.line('patient', { key: 'feedback' });
      // Course deduction (Boss 29 Oct): the visit is cut from the course the moment the PT taps "จบการดูแล"; the patient's LINE slip carries the review button.
      const c = s.course;
      if (n >= 2 && c && c.approved) { c.used = Math.max(c.used || 0, n); ctx.line('patient', { key: 'courseUsed', n }); const left = Math.max(0, c.sessions + (c.bonus || 0) - c.used);
        ctx.toast(left ? `จบการดูแลแล้ว ตัดคอร์สครั้งที่ ${n} · เหลือ ${left} ครั้ง` : 'ครบคอร์สแล้ว เขียน SOAP แล้วสรุปจบคอร์สกับคนไข้'); }
      else ctx.toast(n === 1 ? 'จบการดูแลแล้ว ต่อไปวางแผนการรักษากับคนไข้' : 'จบการดูแลแล้ว เขียนบันทึกต่อได้เลย');
    }
  });
  act('ptMaps', (s, ctx) => ctx.toast('ห้องซ้อม: ในระบบจริงเปิดแอปแผนที่นำทางไปบ้านคนไข้'));
  act('ptCallFamily', (s, ctx) => ctx.toast('ห้องซ้อม: โทรผ่านเบอร์กลางของ SynaClair เบอร์จริงไม่แสดง'));
  act('ptCallTeam', () => openSheet(() => `<b class="h2">ติดต่อทีม SynaClair</b><p class="small">ทีมตอบทุกวัน 08:00–22:00 · เรื่องด่วนระหว่างทำเคสโทรได้ทันที</p>
      <button class="btn" data-act="ptTeamCall">${I('phone')}โทรหาทีม</button><button class="btn line" data-act="ptTeamLine">${I('message-circle')}ทักทีมใน LINE</button><button class="btn ghost" data-close>ปิด</button>`));
  act('ptTeamCall', (s, ctx) => { ctx.close(); ctx.toast('ห้องซ้อม: กำลังโทรหาทีม SynaClair'); });
  act('ptTeamLine', (s, ctx) => { ctx.close(); ctx.toast('เปิดแชตทีมใน LINE แล้ว ทีมตอบใน 08:00–22:00'); });

  /* ======================================================================
     t.opd · OPD ครั้งแรก / SOAP ครั้งถัดไป
     ====================================================================== */
  // Free text only: the PT writes in their own words, no prompts or example phrases (owner, 21 Oct).
  // P holds both what was done today (interventions) and the plan that follows from it, written together.
  // Boss (29 Oct): no plan section; the last block is the home program the patient and family read, so Thai is fine.
  function planP(base) { return area(base + '.p', '<span class="tt-soapL">H</span>การบ้าน (Home program) <small class="small">ภาษาไทยได้ · คนไข้และญาติเห็น</small>', 3); }
  /* T replaces A (Boss 29 Oct): what was done this visit, one block per treatment. Tap "เพิ่มการรักษา" and type each one. */
  function treatT(base, n) {
    const list = SC.get(base + '.t') || [];
    return `<div class="field tt-tlist"><span><span class="tt-soapL">T</span>การรักษาวันนี้<span class="tt-en">EN</span><small class="small"> ทีละอย่าง</small></span>
      ${list.map((x, k) => `<div class="tt-tblock"><span class="no">${k + 1}</span><input class="in" lang="en" data-bind="${base}.t.${k}" data-live value="${esc(x)}" placeholder="e.g. Sit-to-stand training, 3 sets" aria-label="การรักษาข้อที่ ${k + 1}"><button class="ib soft" data-act="soapTDel" data-n="${n}" data-k="${k}" aria-label="ลบข้อที่ ${k + 1}">${I('x')}</button></div>`).join('')}
      <button class="btn sm soft tt-tadd" data-act="soapTAdd" data-n="${n}">${I('plus')}เพิ่มการรักษา</button></div>`;
  }
  function area(path, label, rows = 2, en = false) {
    return `<div class="field"><span>${label}${en ? '<span class="tt-en">EN</span>' : ''}</span><textarea class="in tt-ta" data-auto rows="${rows}" data-bind="${path}"${en ? ' lang="en" placeholder="English only"' : ''}>${esc(SC.get(path) || '')}</textarea></div>`;
  }
  // These fields fill the certificate and progression note, so they are written in English only (Palm, 23 Oct). S may be Thai (Boss, 29 Oct).
  const enNote = `<p class="note row tt-top">${I('languages')}<span>ช่องที่มีป้าย <b>EN</b> เขียน<b>ภาษาอังกฤษเท่านั้น</b> เพราะระบบใช้ทำใบรับรองและ Progression note</span></p>`;
  scr('t.opd', {
    render(s, { param }) {
      const n = +(param.n || 1), i = s.visits.findIndex(x => x.n === n), v = s.visits[i];
      if (!v) return `<div class="scr">${ui.bar('บันทึกการดูแล')}<div class="body">${ui.empty('file-text', 'ยังไม่มีนัดนี้', 'บันทึกเขียนได้หลังจบการดูแล', '<button class="btn auto" data-go="t.work">ไปหน้างาน</button>')}</div></div>`;
      if (!v.soap) v.soap = {};
      if (n === 1 && !v.soap.goal && s.coursePlan && s.coursePlan.goal) v.soap.goal = s.coursePlan.goal; // goal agreed with the patient during planning
      const base = `visits.${i}.soap`;
      const title = n === 1 ? 'OPD ครั้งแรก · ' + pname(s) : `SOAP ครั้งที่ ${n} · ${pname(s)}`;
      if (v.published) return `<div class="scr">${ui.bar(title)}<div class="body">${ui.empty('badge-check', 'ลงนามและส่งสรุปแล้ว', 'แก้ไม่ได้หลังลงนาม ถ้าต้องแก้ ทีมสร้างฉบับแก้ไขใหม่ให้', `<button class="btn auto" data-act="viewReport" data-n="${n}">ดูสรุปที่ส่ง</button>`)}</div></div>`;
      if (v.step < 4) return `<div class="scr">${ui.bar(title)}<div class="body">${ui.empty('clock', 'ยังไม่จบการดูแล', 'กด "จบการดูแล" ในหน้าทำเคสก่อน แล้วค่อยลงนามบันทึก', `<button class="btn auto" data-act="openVisit" data-n="${n}">ไปหน้าทำเคส</button>`)}</div></div>`;
      const flag = s.cert.requested ? `<p class="note row tt-top">${I('file-text')}<span>คนไข้ขอใบรับรอง (TH/EN) · ระบบเติมใบรับรองจากบันทึกนี้</span></p>` : '';
      let fields, need;
      if (n === 1) {
        fields = `${area(base + '.goal', 'เป้าหมาย (ญาติเห็น)')}
          <div class="row between"><b class="h3">OPD · ${esc(shortDate(v.date))}</b><span class="pill gray">ทีมดูแลเห็นเท่านั้น</span></div>
          ${area(base + '.s', '<span class="tt-soapL">S</span>อาการและสิ่งที่คนไข้เล่า <small class="small">ภาษาไทยได้</small>', 2)}
          ${area(base + '.o', '<span class="tt-soapL">O</span>ผลตรวจร่างกาย (พบว่า)', 2, true)}
          ${treatT(base, n)}
          ${area(base + '.dx', 'การวินิจฉัยทางกายภาพบำบัด', 2, true)}
          ${planP(base)}
          ${area(base + '.family', 'ข้อความถึงคนไข้และญาติ')}`;
        need = ['goal', 's', 'o', 't', 'dx', 'p'].map(k => `${base}.${k}`).join(',');
      } else {
        const g = (visitOf(s, 1) || {}).soap || {};
        fields = `${g.goal ? `<div class="note mint"><b>เป้าหมาย</b> (จาก OPD ครั้งแรก)<br>${esc(g.goal)}</div>` : ''}
          <div class="row between"><b class="sec-h">${I('clipboard-list')}SOAP Note</b><span class="pill">${esc(shortDate(v.date))}</span></div>
          ${area(base + '.s', '<span class="tt-soapL">S</span>อาการและสิ่งที่คนไข้เล่า <small class="small">ภาษาไทยได้</small>', 2)}
          ${area(base + '.o', '<span class="tt-soapL">O</span>ผลตรวจ', 2, true)}
          ${treatT(base, n)}
          ${planP(base)}
          ${area(base + '.family', 'ข้อความถึงคนไข้และญาติ (ไม่บังคับ)')}`;
        need = ['s', 'o', 't', 'p'].map(k => `${base}.${k}`).join(',');
      }
      return `<div class="scr">${ui.bar(title)}<div class="body">
        ${flag}${enNote}${fields}
        <p class="small row">${I('save')}<span>บันทึกร่างอัตโนมัติ · ญาติเห็นแค่เป้าหมายกับข้อความ</span></p>
      </div><div class="foot"><p class="small" style="margin:0">ลงนามแล้วแก้ไม่ได้ ถ้าต้องแก้ ระบบสร้างฉบับแก้ไขใหม่</p><button class="btn" data-act="publishReport" data-n="${n}" data-need="${need}">${I('pen-line')}ลงนามและส่งสรุป</button></div></div>`;
    }
  });
  act('soapTAdd', (s, ctx) => { const v = visitOf(s, +ctx.data.n); if (!v) return; v.soap = v.soap || {}; (v.soap.t = v.soap.t || []).push(''); });
  act('soapTDel', (s, ctx) => { const v = visitOf(s, +ctx.data.n); if (v && v.soap && v.soap.t) v.soap.t.splice(+ctx.data.k, 1); });
  act('publishReport', (s, ctx) => {
    const n = +(ctx.data.n || ctx.param.n || 1), v = visitOf(s, n); if (!v || v.step < 4) return;
    v.soap.t = (v.soap.t || []).map(x => String(x).trim()).filter(Boolean);
    if (!v.soap.t.length) { ctx.toast('เพิ่มการรักษาวันนี้อย่างน้อย 1 อย่าง'); return; }
    v.published = true;
    ctx.line('patient', { key: n === 1 ? 'report' : 'report2' });
    ctx.toast('ลงนามแล้ว ส่งสรุปเข้า LINE คนไข้แล้ว');
    return n === 1 ? 't.work' : 't.cert';
  });

  /* ======================================================================
     t.plan · เสนอคอร์สหน้างาน
     ====================================================================== */
  // Palm's "Final price" sheet (28 Oct): full price per visit ≥ ฿1,850; each course has a discount and a platform fee;
  // what the PT nets per visit (free visits included) never drops below ฿1,300.
  const FLOOR = 1850, PT_NET_MIN = 1300, VISIT_FEE_BPS = 1200, STEP = 50; // receipt code dropped (Boss 28 Oct)
  const PACKS = [{ v: 5, bps: 900, fee: 1600 }, { v: 10, bps: 1400, fee: 1400 }, { v: 15, bps: 2100, fee: 1000 }];
  const afterFee = (x, fee) => x * (10000 - fee) / 10000;
  const minTotalFor = (p, visits) => Math.ceil(PT_NET_MIN * visits * 10000 / (10000 - p.fee));
  const PLAN_DAYS = { 1: [1], 2: [1, 4], 3: [0, 2, 4] };
  const packFor = n => n <= 7 ? 5 : n <= 12 ? 10 : 15;
  function cpOf(s) {
    if (!s.coursePlan) s.coursePlan = { step: 0, freq: 2, weeks: 5, full: 1850, pack: null, code: false, price: null, bonus: 0, slip: null, next: '', backups: [] };
    return s.coursePlan;
  }
  const curPack = cp => cp.pack || packFor(cp.freq * cp.weeks);
  const tierTotal = (p, full) => Math.round(full * p.v * (10000 - p.bps) / 10000);
  function priceOf(cp, p) {
    const full = Number(cp.full) || 0, sel = p.v === curPack(cp);
    const base = tierTotal(p, full);
    const afterCode = base;
    // Sheet rule: most visits this price can carry = ⌊price × (1 − fee) ÷ 1,300⌋; the rest above the paid visits can be given free.
    const perBase = afterCode / p.v;
    const maxFree = Math.max(0, Math.floor(afterFee(afterCode, p.fee) / PT_NET_MIN) - p.v);
    const free = sel ? Math.min(Number(cp.bonus) || 0, maxFree) : 0;
    // Each free visit raises the lowest price the PT may cut to, so the net per visit stays ≥ 1,300.
    const minPer = Math.ceil(minTotalFor(p, p.v + free) / p.v);
    const raw = sel && cp.price !== null && cp.price !== undefined && cp.price !== '' ? Number(cp.price) : null;
    const per = raw === null || isNaN(raw) ? perBase : Math.min(perBase, Math.max(minPer, raw));
    const total = Math.round(per * p.v), fee = Math.round(total * p.fee / 10000), net = total - fee;
    return { p, full, base, afterCode, codeOff: base - afterCode, perBase, per, minPer, maxFree, raw, down: afterCode - total, total, free, sessions: p.v + free, fee, net, netPer: net / (p.v + free) };
  }
  // Palm (28 Oct): before the patient sees anything, the PT sees what they net per visit. Boss (29 Oct): show only what the PT gets, never the deduction.
  function earnTable(cp, rec) {
    const full = Number(cp.full) || 0;
    const rows = [['จ่ายรายครั้ง', 1, full, VISIT_FEE_BPS, 0], ...PACKS.map(p => { const tot = tierTotal(p, full); return [`คอร์ส ${p.v} ครั้ง`, p.v, tot, p.fee, Math.max(0, Math.floor(afterFee(tot, p.fee) / PT_NET_MIN) - p.v)]; })];
    return `<div class="card flat tt-earn"><b class="sec-h">${I('wallet')}ราคานี้ คุณได้สุทธิต่อครั้งเท่าไหร่</b>
      <table><thead><tr><th>แบบ</th><th>คนไข้จ่าย</th><th>คุณได้สุทธิ/ครั้ง</th></tr></thead><tbody>${rows.map(([t, v, tot, fee, free]) => `<tr class="${v === rec ? 'on' : ''}"><td>${t}${v === rec ? ' <span class="pill">ตามแผน</span>' : ''}${free ? `<br><small>แถมได้สูงสุด ${free} ครั้ง</small>` : ''}</td><td>${money(tot)}</td><td><b>${money(afterFee(tot, fee) / v)}</b></td></tr>`).join('')}</tbody></table>
      <small class="hint">ยอดที่คุณได้จริงต่อครั้ง · ก่อนแถมหรือลดราคาเพิ่ม · ไม่ต่ำกว่า ${money(PT_NET_MIN)} ต่อครั้งเสมอ</small></div>`;
  }
  const planDates = cp => { const out = []; for (let w = 1; w <= cp.weeks; w++) for (const d of PLAN_DAYS[cp.freq]) out.push(w * 7 + d); return out; };
  // The suggested dates start the plan; the PT can tap days off and on with the patient (cp.dates once edited).
  const chosenDates = cp => (cp.dates || planDates(cp)).slice().sort((a, b) => a - b);
  const slotOf = idx => `${dShort(idx)} 09:00`;
  const SLOT_TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const PLAN_STEPS = ['วางแผน', 'นำเสนอแผน', 'ค่าบริการ', 'สรุปราคา', 'สแกนจ่าย', 'นัดครั้งที่ 2', 'เสร็จ'];
  scr('t.plan', {
    render(s) {
      const v1 = visitOf(s, 1);
      if (!v1 || v1.step < 4) return `<div class="scr">${ui.bar('แผนการดูแล')}<div class="body">${ui.empty('clipboard-check', 'จบเคสแรกก่อน', 'คุยแผนการดูแลได้หลังจบเคสแรกและส่ง OPD แล้ว', '<button class="btn auto" data-go="t.work">ไปหน้างาน</button>')}</div></div>`;
      if (s.course && !s.coursePlan) return `<div class="scr">${ui.bar('แผนการดูแล')}<div class="body">${courseSummary(s)}<button class="btn" data-go="t.work">กลับหน้างาน</button></div></div>`;
      const cp = cpOf(s), st = cp.step, goal = cp.goal || 'ฟื้นฟูให้กลับมาทำกิจวัตรได้เอง';
      const n = cp.dates ? cp.dates.length : cp.freq * cp.weeks, pk = PACKS.find(x => x.v === curPack(cp)), r = priceOf(cp, pk);
      const left = st === 0 || st >= 6 ? `<button class="ib" data-back aria-label="ย้อนกลับ">${I('chevron-left')}</button>` : `<button class="ib" data-act="planBack" aria-label="ขั้นก่อนหน้า">${I('chevron-left')}</button>`;
      // Price tools stay a quiet settings icon (top right) on the price step: the patient is looking at this screen.
      // Boss (28 Oct): a patient / PT switch on the price steps. PT mode shows what the PT earns, how many visits can still be
      // added and how far the price can go down (Palm's Final price sheet); the patient view never shows these numbers.
      const priceStep = st === 2 || st === 3, ptv = priceStep && !!cp.ptView;
      const tools = priceStep ? `<button class="tt-mode${ptv ? ' pt' : ''}" data-act="planMode" role="switch" aria-checked="${ptv}" aria-label="สลับโหมดนักกายภาพ"><span>คนไข้</span><span>นักกายภาพ</span><i></i></button>` : '';
      const head = `${ui.bar('แผนการดูแล · ' + pname(s), { back: false, left, right: tools })}<div class="tt-stepnum" style="padding:10px 16px 0"><div class="progress"><i style="width:${Math.min(st + 1, PLAN_STEPS.length) / PLAN_STEPS.length * 100}%"></i></div><span class="small">${Math.min(st + 1, PLAN_STEPS.length)}/${PLAN_STEPS.length} · ${PLAN_STEPS[Math.min(st, PLAN_STEPS.length - 1)]}</span></div>`;
      let body = '', foot = '';
      if (ptv) {
        body = ptDash(cp, pk, r);
        foot = `<button class="btn" data-act="planMode">${I('eye')}กลับโหมดคนไข้ · ใช้ราคานี้</button>`;
      } else if (st === 0) {
        const low = (Number(cp.full) || 0) < FLOOR;
        body = `<label class="field"><span>เป้าหมายการรักษา</span><textarea class="in tt-ta" data-auto rows="2" data-bind="coursePlan.goal">${esc(cp.goal || '')}</textarea></label>
          <div class="field"><span>ความถี่</span><div class="seg">${[1, 2, 3].map(x => `<button class="${cp.freq === x ? 'on' : ''}" data-pick="coursePlan.freq" data-value="${x}" data-then="planReset">${x} ครั้ง/สัปดาห์</button>`).join('')}</div></div>
          <div class="field"><span>ระยะเวลา</span><div class="seg">${[4, 5, 8].map(x => `<button class="${cp.weeks === x ? 'on' : ''}" data-pick="coursePlan.weeks" data-value="${x}" data-then="planReset">${x} สัปดาห์</button>`).join('')}</div></div>
          <div class="card cream"><div class="row between"><span>รวม ${n} ครั้ง · แนะนำคอร์ส</span><b class="h2">${packFor(n)} ครั้ง</b></div></div>
          <label class="field"><span>ราคาเต็มต่อครั้ง (บาท)</span><input class="in" type="number" inputmode="numeric" min="${FLOOR}" step="50" data-bind="coursePlan.full" data-live value="${esc(cp.full)}">
            ${low ? `<small class="tt-err">ราคาเต็มต้องไม่ต่ำกว่า ${money(FLOOR)}</small>` : '<small class="hint">ระบบคิดราคาคอร์สให้ทันที รวมค่าเดินทางแล้ว</small>'}</label>
          ${low ? '' : earnTable(cp, packFor(n))}`;
        foot = `<button class="btn" data-act="planNext" data-need="coursePlan.goal" ${low ? 'disabled' : ''}>${I('presentation')}นำเสนอแผน</button>`;
      } else if (st === 1) {
        const plan = new Set(chosenDates(cp)), rows = Math.min(cp.weeks, 5) + 1, today = idxOf(v1.date);
        let cells = WD.map(d => `<span class="h">${d}</span>`).join('');
        for (let i = 0; i < rows * 7; i++) cells += i === today ? `<span class="t">${dateOf(i).d}</span>` : i < today ? `<span class="o">${dateOf(i).d}</span>`
          : `<button class="${plan.has(i) ? 'p' : ''}" data-act="planDay" data-i="${i}" aria-pressed="${plan.has(i)}" aria-label="วันที่ ${dateOf(i).d}">${dateOf(i).d}</button>`;
        body = `<p class="note mint row">${I('smartphone')}<span>หันจอให้คนไข้และญาติดูได้เลย</span></p>
          <div class="stack tt-c"><span class="kick">แผนการดูแล</span><b class="h1">${n} ครั้ง ใน ${cp.weeks} สัปดาห์</b><span class="p">${cp.dates ? 'เลือกวันเองแล้ว' : `สัปดาห์ละ ${cp.freq} ครั้ง`}</span></div>
          <div class="card mint"><span class="small">เป้าหมาย</span><b class="h3">${esc(goal)}</b></div>
          <div class="card"><div class="row between" style="margin-bottom:8px"><span class="small">แตะวันเพื่อเพิ่มหรือเอาออก</span>${cp.dates ? `<button class="btn sm ghost" data-act="planDayReset">${I('rotate-ccw')}วันที่แนะนำ</button>` : ''}</div><div class="tt-mini">${cells}</div><div class="tt-legend"><span><i style="background:linear-gradient(135deg,var(--gold2),var(--gold))"></i>วันนี้</span><span><i style="background: var(--g-sheen), var(--g-em)"></i>วันที่วางแผนไว้</span>${cp.weeks > 5 ? `<span>+ อีก ${cp.weeks - 5} สัปดาห์</span>` : ''}</div></div>`;
        foot = `<button class="btn" data-act="planNext">ดูค่าบริการ ${I('arrow-right')}</button>`;
      } else if (st === 2) {
        body = `<div class="stack"><span class="kick">ค่าบริการ · รวมค่าเดินทาง</span><h1 class="h1">เลือกจำนวนครั้ง</h1></div>
          <div class="stack lg" style="padding-top:6px">${PACKS.map(p => { const x = priceOf(cp, p), on = p.v === pk.v; return `<button class="tt-pk ${on ? 'on' : ''}" data-pick="coursePlan.pack" data-value="${p.v}" data-then="planPack" aria-pressed="${on}">${p.v === packFor(n) ? '<span class="pill">ตามแผน</span>' : ''}<span class="nm">${p.v} ครั้ง${x.free ? ` <span class="pill gold">+ แถม ${x.free}</span>` : ''}</span><span class="pr">${x.total < x.full * p.v ? `<s>${money(x.full * p.v)}</s>` : ''}${money(x.total)}</span><span class="per">เฉลี่ยครั้งละ ${money(x.total / x.sessions)}</span></button>`; }).join('')}</div>`;
        foot = `<button class="btn" data-act="planNext">ไปสรุปราคา ${I('arrow-right')}</button>`;
      } else if (st === 3) {
        const line = (a, b, c = '') => `<div class="tt-br ${c}"><span>${a}</span><b>${b}</b></div>`;
        body = `<div class="stack"><span class="kick">สรุปคอร์ส</span><h1 class="h1">${pk.v} ครั้ง${r.free ? ` แถม ${r.free}` : ''}</h1></div>
          <div class="card">${line(`ราคาเต็ม ${pk.v} × ${money(r.full)}`, money(r.full * pk.v), 'mute')}${line('ราคาคอร์ส', money(r.base))}${r.down ? line('ราคาพิเศษจากนักกายภาพ', '−' + money(r.down), 'gold') : ''}${r.free ? line('ของแถม', `+${r.free} ครั้ง`, 'gold') : ''}
            <div class="tt-br total"><span>ชำระ</span><b>${money(r.total)}</b></div>
            <p class="small tt-c" style="margin:0">ได้ ${r.sessions} ครั้ง · ใช้ได้ 365 วัน · รวมค่าเดินทาง</p></div>
          <p class="small">ราคานี้บอกที่มาทุกบรรทัดเป็นบาท ไม่มีเปอร์เซ็นต์ คนไข้ถามได้ทุกข้อ</p>`;
        foot = `<button class="btn" data-act="planNext">${I('qr-code')}ให้คนไข้สแกนจ่าย</button>`;
      } else if (st === 4) {
        body = `<p class="note mint row">${I('smartphone')}<span>หันจอนี้ให้คนไข้สแกนจ่ายด้วยแอปธนาคาร</span></p>
          <div class="stack tt-c"><span class="kick">คอร์ส ${pk.v} ครั้ง${r.free ? ` แถม ${r.free}` : ''}</span><span class="price">${money(r.total)}</span><span class="small">บัญชี SynaClair · พร้อมเพย์</span></div>
          <div class="tt-qr">${qrSvg('course-' + r.total)}</div>
          <p class="note row">${I('message-circle')}<span>คนไข้โอนแล้ว ดูยอดบนสลิปในมือถือคนไข้ แล้วชวนคนไข้ส่งรูปสลิปในแชต LINE SynaClair</span></p>`;
        foot = `<button class="btn" data-act="coursePaid">${I('send')}คนไข้โอนแล้ว · แจ้งแอดมินตรวจสลิป</button>`;
      } else if (st === 5) {
        // Boss (29 Oct): the PT books the time agreed with the patient straight into their own calendar. One tap = a 1-hour event
        // named "patient · ครั้งที่ n/total"; that name is what the calendar, the work list and the report show. No backup times.
        const today = idxOf(v1.date), plan = new Set(chosenDates(cp));
        if (cp.day == null) cp.day = chosenDates(cp).find(i => i > today) ?? today + 1;
        const days = Array.from({ length: 21 }, (_, k) => today + 1 + k), title = nextTitle(s, cp);
        body = `<div class="stack"><span class="kick">นัดครั้งถัดไป${cp.noCourse ? ` · จ่ายรายครั้ง ${money(cp.full)}` : ''}</span><h1 class="h1">ลงนัดในปฏิทินของคุณ</h1><p class="small">ตกลงเวลากับคนไข้ แล้วแตะช่องเวลานั้น ระบบลง 1 ชม. ชื่อ “${esc(title)}” · สีเขียวคือเวลาที่คุณเปิดรับงาน · จุดทองคือวันตามแผน</p></div>
          <div class="tt-days" role="group" aria-label="เลือกวัน">${days.map(i => { const x = dateOf(i); return `<button class="${cp.day === i ? 'on' : ''}" data-pick="coursePlan.day" data-value="${i}" aria-pressed="${cp.day === i}" aria-label="${esc(dShort(i))}${plan.has(i) ? ' · วันตามแผน' : ''}"><small>${WD[wday(i)]}</small><b>${x.d}</b><small>${MON[x.m]}</small>${plan.has(i) ? '<i></i>' : ''}${cp.next && cp.next.startsWith(dShort(i) + ' ') ? '<em></em>' : ''}</button>`; }).join('')}</div>
          ${cp.next ? `<div class="tt-picked"><span class="tile">${I('calendar-check')}</span><span class="grow"><b>${esc(title)}</b><small>${esc(cp.next)}–${esc(String(+cp.next.slice(-5, -3) + 1).padStart(2, '0') + cp.next.slice(-3))} น. · 1 ชม.</small></span><button class="ib soft" data-act="planCellClear" aria-label="ลบนัดนี้">${I('x')}</button></div>` : ''}
          <div class="tt-cal" style="--n:1"><div class="tt-calh"><span></span><button class="${cp.day === TODAY_IDX ? 'today' : ''}" tabindex="-1">${WDF[wday(cp.day)]}<b>${dateOf(cp.day).d}</b></button></div><div class="tt-calb">${axis()}${planColumn(s, cp.day, cp, title)}</div></div>`;
        foot = `<button class="btn" data-act="bookNext" data-need="coursePlan.next">${I('calendar-check')}ยืนยันนัด · แจ้งคนไข้ใน LINE</button>`;
      } else {
        body = cp.noCourse
          ? `<div class="stack tt-c" style="justify-items:center;padding-top:12px"><span class="tile lg">${I('calendar-check')}</span><h1 class="h1">นัดครั้งที่ 2 แล้ว</h1><p class="p">คนไข้ยังไม่ซื้อคอร์ส จ่ายรายครั้ง ครั้งละ ${money(cp.full)} ทีมแจ้งนัดและค่าบริการใน LINE</p></div>
            <div class="card flat"><div class="kv"><dt>นัดครั้งที่ 2</dt><dd>${esc(cp.next)} น.</dd>${cp.backups.length ? `<dt>เวลาสำรอง</dt><dd>${esc(cp.backups.join(' · '))}</dd>` : ''}<dt>ค่าบริการ</dt><dd>${money(cp.full)} ต่อครั้ง</dd></div></div>`
          : `<div class="stack tt-c" style="justify-items:center;padding-top:12px"><span class="tile lg">${I('badge-check')}</span><h1 class="h1">ส่งให้แอดมินแล้ว</h1><p class="p">เปิดสิทธิ์คอร์สเมื่อยอดตรง ผลแจ้งใน LINE ทั้งคุณและคนไข้</p></div>
          ${courseSummary(s)}`;
        foot = `<button class="btn" data-act="planDone">${I('file-pen-line')}เขียน OPD (ภายใน 2 ชม.)</button>`;
      }
      return `<div class="scr">${head}<div class="body">${body}</div><div class="foot">${foot}</div></div>`;
    }
  });
  function courseSummary(s) {
    const c = s.course; if (!c) return '';
    return `<div class="card flat"><div class="row"><span class="tile gold">${I('package')}</span><span class="grow"><b class="h3">คอร์ส ${c.sessions} ครั้ง${c.bonus ? ` แถม ${c.bonus}` : ''} · ${money(c.total)}</b></span><span class="pill ${c.approved ? '' : 'wait'}">${c.approved ? 'เปิดสิทธิ์แล้ว' : 'รอแอดมินตรวจ'}</span></div>
      <div class="kv"><dt>สลิป</dt><dd>${c.slip ? (c.slip === 'sample' ? 'สลิปตัวอย่าง' : 'แนบแล้ว') : 'ยังไม่แนบ'}</dd><dt>นัดครั้งที่ 2</dt><dd>${esc(c.next || 'ยังไม่นัด')}</dd>${c.backups && c.backups.length ? `<dt>วันสำรอง</dt><dd>${esc(c.backups.join(' · '))}</dd>` : ''}</div></div>`;
  }
  act('planReset', s => { const cp = cpOf(s); cp.pack = null; cp.price = null; cp.bonus = 0; cp.dates = null; });
  act('planDay', (s, ctx) => { const cp = cpOf(s), i = +ctx.data.i, d = chosenDates(cp); cp.dates = d.includes(i) ? d.filter(x => x !== i) : [...d, i]; cp.pack = null; });
  act('planDayReset', s => { const cp = cpOf(s); cp.dates = null; cp.pack = null; });
  act('planPack', s => { const cp = cpOf(s); cp.price = null; cp.bonus = 0; });
  act('planNext', (s, ctx) => {
    const cp = cpOf(s);
    if (cp.step === 0 && (Number(cp.full) || 0) < FLOOR) { ctx.toast('ราคาเต็มต้องไม่ต่ำกว่า ' + money(FLOOR)); return; }
    cp.step = Math.min(cp.step + 1, 4);
  });
  act('planBack', s => { const cp = cpOf(s); cp.step = Math.max(0, cp.step - 1); });
  function ptDash(cp, pk, r) {
    const n = pk.v, rows = Array.from({ length: r.maxFree + 1 }, (_, k) => { const ok = r.total >= minTotalFor(pk, n + k); return { k, ok, per: afterFee(r.total, pk.fee) / (n + k) }; });
    const minTotal = r.minPer * n, minNet = afterFee(minTotal, pk.fee);
    return `<p class="note row tt-top">${I('eye-off')}<span>โหมดนักกายภาพ · ตัวเลขในหน้านี้คนไข้ไม่เห็น หันจอกลับก่อนสลับ</span></p>
      <div class="seg">${PACKS.map(x => `<button class="${x.v === n ? 'on' : ''}" data-pick="coursePlan.pack" data-value="${x.v}" data-then="planPack">${x.v} ครั้ง</button>`).join('')}</div>
      <div class="tt-ptd"><span class="small">รายได้สุทธิของคุณ · คอร์ส ${n} ครั้ง${r.free ? ` แถม ${r.free}` : ''}</span><b class="price">${money(r.net)}</b>
        <div class="grid2 tt-c"><div><span class="small">คนไข้จ่าย</span><br><b>${money(r.total)}</b></div><div><span class="small">คุณได้ครั้งละ</span><br><b>${money(r.netPer)}</b></div></div></div>
      <div class="card flat"><div class="row between"><b class="h3 tt-ih"><span class="ic">${I('gift')}</span>ของแถม</b><span class="pill ${r.maxFree - r.free ? 'gold' : ''}">เหลือแถมได้ ${r.maxFree - r.free} จาก ${r.maxFree} ครั้ง</span></div>
        ${r.maxFree ? `<div class="row between"><button class="ib soft" data-act="planBonus" data-d="-1" aria-label="ลดของแถม" ${r.free ? '' : 'disabled'}>${I('minus')}</button><b class="h3">แถม ${r.free} ครั้ง</b><button class="ib soft" data-act="planBonus" data-d="1" aria-label="เพิ่มของแถม" ${r.free < r.maxFree ? '' : 'disabled'}>${I('plus')}</button></div>
        <table class="tt-btab"><thead><tr><th>แถม</th><th>รวม</th><th>คุณได้ต่อครั้ง</th></tr></thead><tbody>${rows.map(x => `<tr class="${x.k === r.free ? 'on' : ''}"><td>${x.k ? '+' + x.k : 'ไม่แถม'}</td><td>${n + x.k} ครั้ง</td><td>${x.ok ? `<b>${money(x.per)}</b>` : '<small>ต้องขึ้นราคาก่อน</small>'}</td></tr>`).join('')}</tbody></table>`
        : `<p class="small">ราคานี้ยังแถมไม่ได้ ถ้าตั้งราคาเต็มสูงขึ้น จะแถมได้มากขึ้น</p>`}</div>
      <div class="card flat"><b class="h3 tt-ih"><span class="ic">${I('ticket-percent')}</span>ลดราคา</b>
        <label class="tt-pin"><span>฿</span><input class="in" type="text" inputmode="numeric" data-bind="coursePlan.price" data-live value="${esc(cp.price === null || cp.price === undefined ? Math.round(r.perBase) : cp.price)}" aria-label="ราคาต่อครั้ง"><em>/ครั้ง</em></label>
        ${r.raw !== null && r.raw < r.minPer ? `<small class="tt-err">ต่ำสุด ${money(r.minPer)} ต่อครั้ง ระบบใช้ราคานี้ให้</small>` : r.raw !== null && r.raw > r.perBase ? `<small class="tt-err">สูงกว่าราคาคอร์ส ระบบใช้ ${money(Math.round(r.perBase))}</small>` : ''}
        <div class="tt-range"><span>ลดได้ต่ำสุด <b>${money(r.minPer)}</b>/ครั้ง</span><span>ราคาคอร์ส <b>${money(Math.round(r.perBase))}</b></span></div>
        <p class="small">ถ้าลดถึงต่ำสุด คนไข้จ่าย ${money(minTotal)} คุณได้สุทธิ ${money(minNet)} (ครั้งละ ${money(minNet / (n + r.free))}) · สุทธิต้องไม่ต่ำกว่า ${money(PT_NET_MIN)} ต่อครั้งเสมอ ยิ่งแถมมาก ยิ่งลดได้น้อย</p></div>
      <button class="tt-skip" data-act="planNoCourse"><span class="grow"><b>คนไข้ยังไม่ซื้อคอร์ส</b><small>จ่ายรายครั้ง ครั้งละ ${money(cp.full)} (สุทธิ ${money(afterFee(Number(cp.full) || 0, VISIT_FEE_BPS))}) · ไปนัดครั้งถัดไปเลย</small></span>${I('arrow-right')}</button>`;
  }
  act('planMode', s => { const cp = cpOf(s); cp.ptView = !cp.ptView; });
  act('planBonus', (s, ctx) => { const cp = cpOf(s), pk = PACKS.find(x => x.v === curPack(cp)); cp.bonus = Math.max(0, Math.min(priceOf(cp, pk).maxFree, (Number(cp.bonus) || 0) + +ctx.data.d)); });
  act('coursePaid', (s, ctx) => {
    const cp = cpOf(s), pk = PACKS.find(x => x.v === curPack(cp)), r = priceOf(cp, pk);
    const keep = s.course || {};
    s.course = { sessions: pk.v, bonus: r.free, perSession: Math.round(r.netPer), fee: r.fee, net: r.net, total: r.total, code: '', paid: false, slip: 'sample', approved: false, used: 1, next: keep.next || '', backups: keep.backups || [], notified: true };
    // No slip upload on the PT's phone (Boss 21 Oct): the PT glances at the patient's slip, admin is told now, and the patient sends the slip in LINE.
    ctx.line('admin', { key: 'paymentReviewCourse' });
    ctx.line('patient', { text: `ได้รับแจ้งการโอนค่าคอร์ส ${money(r.total)} แล้วค่ะ ส่งรูปสลิปในแชตนี้ได้เลย ทีมจะตรวจยอดและเปิดสิทธิ์คอร์สให้` });
    ctx.line('patient', { me: true, text: `[รูปสลิปโอนเงิน ${money(r.total)}]` });
    cp.step = 5; if (!cp.next) cp.next = slotOf(chosenDates(cp)[0]);
    ctx.toast('แจ้งแอดมินตรวจสลิปแล้ว ต่อไปนัดครั้งที่ 2');
  });
  // Tap order sets the role: first = main, then backup 1 and 2. Tapping a chosen time (or ✕) removes it; the next one moves up.
  act('planSlot', (s, ctx) => {
    const cp = cpOf(s), o = ctx.data.v, picks = [cp.next, ...cp.backups].filter(Boolean);
    const out = picks.includes(o) ? picks.filter(x => x !== o) : picks.length < 3 ? [...picks, o] : null;
    if (!out) { ctx.toast('เลือกครบ 3 เวลาแล้ว · กด ✕ เพื่อเปลี่ยน'); return; }
    cp.next = out[0] || ''; cp.backups = out.slice(1);
  });
  const nextTitle = (s, cp) => { const n = Math.max(1, ...s.visits.map(v => v.n)) + 1, pk = PACKS.find(x => x.v === curPack(cp));
    const total = cp.noCourse || !pk ? 0 : pk.v + (Number(cp.bonus) || 0); return `${pname(s)} · ครั้งที่ ${n}${total ? '/' + total : ''}`; };
  function planColumn(s, idx, cp, title) {
    const cells = Array.from({ length: H1 - H0 }, (_, k) => `<button class="tt-cell" data-act="planCell" data-idx="${idx}" data-h="${H0 + k}" aria-label="ลงนัด ${dLong(idx)} ${String(H0 + k).padStart(2, '0')}:00"></button>`).join('');
    const pos = (a, b) => `top:${(toMin(a) - H0 * 60) / 60 * HP + 1}px;height:${Math.max(18, (toMin(b) - toMin(a)) / 60 * HP - 2)}px`;
    const open = blocksOn(s, idx).filter(b => b.sent).map(b => `<span class="tt-ev openbg" style="${pos(b.start, b.end)}" aria-hidden="true">เปิดรับงาน ${b.start}–${b.end}</span>`).join('');
    const vis = visitsOn(s, idx).map(v => { const t = visitSpan(v); return `<span class="tt-ev visit" style="${pos(t.start, t.end)}">${t.start} · ${esc(pname(s))}<small>ครั้งที่ ${v.n}</small></span>`; }).join('');
    const m = cp.next && cp.next.startsWith(dShort(idx) + ' ') ? cp.next.slice(-5) : null, e = m && `${String(+m.slice(0, 2) + 1).padStart(2, '0')}${m.slice(2)}`;
    const pick = m ? `<button class="tt-ev visit pick" style="${pos(m, e)}" data-act="planCellClear" aria-label="ลบนัด ${m}">${m}–${e} · ${esc(title)}<small>นัดใหม่ · แตะเพื่อเอาออก</small></button>` : '';
    return `<div class="tt-col">${cells}${open}${vis}${pick}</div>`;
  }
  act('planCell', (s, ctx) => { const cp = cpOf(s), idx = +ctx.data.idx, h = +ctx.data.h; cp.day = idx; cp.next = `${dShort(idx)} ${String(h).padStart(2, '0')}:00`; cp.backups = []; });
  act('planCellClear', s => { const cp = cpOf(s); cp.next = ''; cp.backups = []; });
  act('planDrop', (s, ctx) => { const cp = cpOf(s), picks = [cp.next, ...cp.backups].filter(Boolean); picks.splice(+ctx.data.i, 1); cp.next = picks[0] || ''; cp.backups = picks.slice(1); });
  act('planNoCourse', s => { const cp = cpOf(s); cp.noCourse = true; cp.ptView = false; cp.step = 5; if (!cp.next) cp.next = slotOf(chosenDates(cp)[0]); });
  // 'อ. 27 ต.ค. 09:00' -> visit record (1 hour), same parsing the admin uses when a course is confirmed.
  function visitFromSlot(slot) {
    const WDAY = { 'จ.': 'จันทร์', 'อ.': 'อังคาร', 'พ.': 'พุธ', 'พฤ.': 'พฤหัสบดี', 'ศ.': 'ศุกร์', 'ส.': 'เสาร์', 'อา.': 'อาทิตย์' };
    const m = /^(\S+)\s+(\d+\s+\S+)\s+(\d{2}):(\d{2})/.exec(slot || '');
    return { n: 2, date: m && WDAY[m[1]] ? `${WDAY[m[1]]} ${m[2]} 2569` : SC.VISIT2.date, time: m ? `${m[3]}:${m[4]}–${String(+m[3] + 1).padStart(2, '0')}:${m[4]}` : SC.VISIT2.time, step: 0, soap: {}, published: false };
  }
  act('bookNext', (s, ctx) => {
    const cp = cpOf(s); if (!cp.next) return;
    if (cp.noCourse) {
      s.perVisit = { price: Number(cp.full) || FLOOR, net: Math.round(afterFee(Number(cp.full) || FLOOR, VISIT_FEE_BPS)), next: cp.next, backups: cp.backups.slice() }; cp.step = 6;
      if (!s.visits.find(x => x.n === 2)) s.visits.push(visitFromSlot(cp.next));
      ctx.line('patient', { text: `นัดครั้งที่ 2 ของคุณ: ${cp.next} น. ค่าบริการครั้งนี้ ${money(s.perVisit.price)} (จ่ายรายครั้ง) ทีมจะแจ้งช่องทางชำระก่อนวันนัดค่ะ` });
      ctx.toast('นัดครั้งที่ 2 แล้ว: ' + cp.next); return;
    }
    if (!s.course) { ctx.toast('บันทึกการจ่ายก่อนนัด'); cp.step = 4; return; }
    s.course.next = cp.next; s.course.backups = cp.backups.slice(); cp.step = 6;
    ctx.toast('นัดครั้งที่ 2 แล้ว: ' + cp.next);
  });
  act('planDone', (s, ctx) => { ctx.go('t.opd', { n: '1' }); });
  const planDone = s => !!((s.course && s.course.notified && s.course.next) || (s.perVisit && s.perVisit.next));

  /* ======================================================================
     t.cert · ใบรับรองกายภาพบำบัด TH/EN
     ====================================================================== */
  // Pull the exam and diagnosis from the first OPD once; after that the PT's own edits win. Treatments start empty: the PT picks headings.
  function certSeed(s) {
    const o = (visitOf(s, 1) || {}).soap || {}, c = s.cert;
    if (c.exam == null) c.exam = o.o || ''; // S may be Thai (Boss 29 Oct), so the certificate's findings start from O only
    if (c.dx == null) c.dx = o.dx || '';
    if (!c.tx.length) c.tx = [''];
    return c;
  }
  const certTx = s => (s.cert.tx || []).map((k, i) => SC.certTxText(k, s.cert.lang === 'EN', (s.cert.txo || {})[i])).filter(Boolean);
  scr('t.cert', {
    render(s) {
      const v1 = visitOf(s, 1);
      if (!v1 || !v1.published) return `<div class="scr">${ui.bar('ใบรับรอง')}<div class="body">${ui.empty('file-text', 'ส่ง OPD ครั้งแรกก่อน', s.cert.requested ? 'คนไข้ขอใบรับรองแล้ว ใบรับรองใช้ข้อมูลตรวจและวินิจฉัยจาก OPD ครั้งแรก ส่ง OPD แล้วกลับมาทำต่อได้เลย' : 'ใบรับรองใช้ข้อมูลจาก OPD ครั้งแรกที่ลงนามแล้ว', '<button class="btn auto" data-go="t.work">ไปหน้างาน</button>')}</div></div>`;
      const p = s.pt, c = certSeed(s), EN = c.lang === 'EN', pubs = s.visits.filter(v => v.published);
      // Palm (23 Oct): certificates carry the PT's real first and last name from sign-up, never the display name.
      const legal = (p.legalName || '').trim() || p.displayName, who = EN ? `PT ${legal}` : `กภ.${legal}`;
      // Palm 29 Oct: the patient's real name comes from intake (ชื่อ-นามสกุลจริง); the nickname stays for everyday use.
      const patName = (s.patient.legalName || '').trim() || s.patient.name;
      const last = pubs[pubs.length - 1] || v1, tx = certTx(s);
      const U = t => `<span class="u">${esc(t)}</span>`;
      const docNo = '2569-000123';
      const range = pubs.length > 1 ? (EN ? `${enLong(v1.date)} – ${enLong(last.date)} (${pubs.length} sessions)` : `${thLong(v1.date)} ถึง ${thLong(last.date)} (${pubs.length} ครั้ง)`) : (EN ? enLong(v1.date) : thLong(v1.date));
      const doc = EN
        ? `<h3>Physiotherapy Certificate</h3>
          <p style="margin:0">Issue date: ${U(enLong(last.date))}</p>
          <p style="margin:0">I, ${U(who)}, Physiotherapist, Professional license No. ${U(p.license)}, did a physical therapy assessment and treatment for ${U(patName || 'the patient')} on ${U(range)}.</p>
          <div class="lbl">Clinical Examination</div><p style="margin:0">${esc(c.exam || '—')}</p>
          <div class="lbl">Physical Diagnosis</div><p style="margin:0">${esc(c.dx || '—')}</p>
          <div class="lbl">Treatment</div>${tx.length ? `<ul>${tx.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p style="margin:0">—</p>'}`
        : `<h3>ใบรับรองทางกายภาพบำบัด</h3>
          <p style="margin:0">หนังสือรับรองฉบับนี้ ถูกจัดทำขึ้นเมื่อวันที่ ${U(thLong(last.date))}</p>
          <p style="margin:0">โดย ข้าพเจ้า ${U(who)} นักกายภาพบำบัด ตามใบประกอบวิชาชีพ เลขที่ ${U('ก. ' + p.license)} ได้ทำการตรวจประเมินและรักษาทางกายภาพบำบัด ของ ${U(patName || 'ผู้รับบริการ')} เมื่อวันที่ ${U(range)}</p>
          <div class="lbl">พบว่า</div><p style="margin:0">${esc(c.exam || '—')}</p>
          <div class="lbl">ผลการวินิจฉัยทางกายภาพบำบัด</div><p style="margin:0">${esc(c.dx || '—')}</p>
          <div class="lbl">ได้ทำการรักษาโดย</div>${tx.length ? `<ul>${tx.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p style="margin:0">—</p>'}`;
      const sig = `<div class="tt-sig"><span class="sign">${p.certSigned ? esc(legal) : ''}</span><span>${EN ? 'Signature' : 'ลงชื่อ'} ........................ ${EN ? '' : 'ผู้ตรวจ'}</span><span>( ${esc(who)} )</span>${p.certSigned ? `<span>${EN ? 'Signed electronically' : 'ลงนามอิเล็กทรอนิกส์'} · ${esc(EN ? enLong(last.date) : thLong(last.date))}</span>` : ''}${p.certQr ? `<span>${EN ? 'Document No.' : 'เลขที่เอกสาร'} ${docNo} · ${EN ? 'Scan to verify' : 'ตรวจสอบเอกสารด้วย QR'}</span>` : ''}</div>`;
      const prog = p.certProg && pubs.length ? `<div class="tt-a4"><h3>Progression Note</h3><p class="small" style="margin:0">${EN ? 'Patient' : 'ผู้รับบริการ'} ${esc(patName || '')} · ${esc(who)} · ก. ${esc(p.license)}</p>
          <div class="tt-prog">${pubs.map(v => { const x = v.soap || {}; return `<div><b>${esc(shortDate(v.date))} · ${EN ? 'Visit' : 'ครั้งที่'} ${v.n}${v.n === 1 ? ' · OPD' : ''}</b><br>${['s', 'o', 't', 'p'].map(k => { const val = k === 't' ? (x.t || []).join(' · ') : x[k]; return val ? `<b>${k === 'p' ? 'Home program' : k.toUpperCase()}</b> ${esc(val)}` : ''; }).filter(Boolean).join('<br>')}</div>`; }).join('')}</div></div>` : '';
      if (c.issued) return `<div class="scr">${ui.bar('ใบรับรอง')}<div class="body">${ui.empty('badge-check', 'ส่งใบรับรองแล้ว', `ส่งเข้า LINE ${pname(s)} แล้ว (${EN ? 'English' : 'ภาษาไทย'})`, '<button class="btn auto" data-go="t.work">กลับหน้างาน</button>')}<div class="tt-a4">${doc}${sig}</div>${prog}</div></div>`;
      const opts = (cur) => `<option value="">เลือกการรักษา</option>${SC.CERT_TX.map(([k, th, en]) => `<option value="${k}" ${cur === k ? 'selected' : ''}>${esc(th)} · ${esc(en)}</option>`).join('')}<option value="other" ${cur === 'other' ? 'selected' : ''}>อื่น ๆ (พิมพ์เอง)</option>`;
      const txRows = c.tx.map((k, i) => `<div class="tt-txrow"><span class="dot" aria-hidden="true">•</span><div class="grow"><select class="in" data-bind="cert.tx.${i}" aria-label="การรักษาข้อที่ ${i + 1}">${opts(k)}</select>${k === 'other' ? `<input class="in" data-bind="cert.txo.${i}" data-live value="${esc((c.txo || {})[i] || '')}" placeholder="${EN ? 'Treatment heading in English' : 'หัวข้อการรักษา สั้น ๆ'}">` : ''}</div>${c.tx.length > 1 ? `<button class="ib soft" data-act="certTxDel" data-i="${i}" aria-label="ลบข้อที่ ${i + 1}">${I('x')}</button>` : ''}</div>`).join('');
      return `<div class="scr">${ui.bar('ทำใบรับรอง')}<div class="body">
        ${c.requested ? `<p class="note mint row">${I('file-text')}<span>${esc(pname(s))} ขอใบรับรอง${c.purpose ? ` · ใช้${esc(c.purpose)}` : ''} · งานนี้แยกจาก OPD</span></p>` : `<p class="note row tt-top">${I('info')}<span>คนไข้ยังไม่ได้ขอใบรับรอง ออกให้ได้ถ้าคนไข้ต้องการ</span></p>`}
        <div class="seg">${[['TH', 'ภาษาไทย'], ['EN', 'English']].map(([k, t]) => `<button class="${c.lang === k ? 'on' : ''}" data-pick="cert.lang" data-value="${k}">${t}</button>`).join('')}</div>
        <section class="card flat tt-certf">
          <label class="field"><span>${EN ? 'Clinical Examination' : 'พบว่า'} <small class="small">ดึงจาก OPD ครั้งแรก แก้ได้</small></span><textarea class="in tt-ta" rows="3" data-bind="cert.exam" data-live>${esc(c.exam)}</textarea></label>
          <label class="field"><span>${EN ? 'Physical Diagnosis' : 'ผลการวินิจฉัยทางกายภาพบำบัด'} <small class="small">ดึงจาก OPD แก้ได้</small></span><textarea class="in tt-ta" rows="2" data-bind="cert.dx" data-live>${esc(c.dx)}</textarea></label>
          <div class="field"><span>${EN ? 'Treatment' : 'ได้ทำการรักษาโดย'} <small class="small">เลือกเป็นหัวข้อใหญ่ ข้อละ 1 อย่าง รายละเอียดอยู่ใน SOAP แล้ว</small></span>${txRows}
            <button class="btn sm soft" data-act="certTxAdd" style="justify-self:start">${I('plus')}เพิ่มการรักษา</button></div>
        </section>
        <p class="small row" style="margin:0">${I('eye')}<span>ตัวอย่างเอกสารที่คนไข้จะได้</span></p>
        <div class="tt-a4">${doc}${sig}</div>
        ${prog}
        <p class="small row">${I('id-card')}<span>ใช้ชื่อจริง-นามสกุลจากตอนสมัคร (${esc(legal)}) ไม่ใช่ชื่อที่แสดง</span></p>
        <label class="check"><input type="checkbox" data-bind="pt.certProg" ${p.certProg ? 'checked' : ''}><span>แนบ Progression note (${pubs.length} ครั้ง)</span></label>
        <label class="check"><input type="checkbox" data-bind="pt.certQr" ${p.certQr ? 'checked' : ''}><span>แสดงเลขเอกสารและ QR ตรวจสอบ</span></label>
        <div class="field"><span>ลายเซ็น</span><button class="tt-pad ${p.certSigned ? 'on' : ''}" data-act="certSign">${p.certSigned ? `<span class="sign">${esc(legal)}</span>` : `${I('pen-line')} แตะเพื่อลงนาม`}</button></div>
      </div><div class="foot"><button class="btn" data-act="issueCert" data-need="pt.certSigned">${I('send')}ลงนามและส่งให้คนไข้</button></div></div>`;
    }
  });
  act('certTxAdd', s => { s.cert.tx.push(''); });
  act('certTxDel', (s, ctx) => { const i = +ctx.data.i; s.cert.tx.splice(i, 1); const o = {}; Object.keys(s.cert.txo || {}).forEach(k => { const n = +k; if (n < i) o[n] = s.cert.txo[k]; else if (n > i) o[n - 1] = s.cert.txo[k]; }); s.cert.txo = o; });
  act('certSign', s => { s.pt.certSigned = !s.pt.certSigned; });
  act('issueCert', (s, ctx) => {
    if (!s.pt.certSigned) { ctx.toast('แตะกรอบลายเซ็นก่อน'); return; }
    if (!certTx(s).length) { ctx.toast('เลือกการรักษาอย่างน้อย 1 ข้อ'); return; }
    s.cert.issued = true;
    ctx.line('patient', { key: 'certReady' });
    ctx.toast('ส่งใบรับรองเข้า LINE คนไข้แล้ว');
  });

  /* ======================================================================
     Course end and renewal (Boss 29 Oct)
     1. Every "จบการดูแล" cuts one visit from the course; the patient's LINE slip shows what is left (+ the review button while they have not reviewed).
     2. With 2 visits left the slip says the PT will review progress and talk about what comes next.
     3. After the last visit the PT compares the result with the goal set at visit 1 and recommends one of: renew (5/10/15, same price rules),
        book single visits when needed, or finish. The patient decides in LINE; renewing pays by QR and the system reads the slip (like the Trial).
     4. No answer in 3 days → LINE reminder; still nothing → the team calls. Finished patients get a team check-in after 30 days.
     ====================================================================== */
  act('courseSkipLast', (s, ctx) => {
    const c = s.course; if (!c) return; const total = c.sessions + (c.bonus || 0);
    for (let n = 3; n < total; n++) if (!visitOf(s, n)) s.visits.push({ n, date: 'ผ่านมาแล้ว', time: '', step: 4, soap: { s: 'Session ' + n }, published: true, skipped: true });
    c.used = total - 1;
    s.visits.push({ n: total, date: 'อังคาร 1 ธ.ค. 2569', time: '09:00–10:00', step: 0, soap: {}, published: false });
    ctx.toast(`ข้ามไปแล้ว · เหลือครั้งที่ ${total} ครั้งสุดท้ายของคอร์ส`);
  });
  const PROG = [['met', 'ถึงเป้าหมายแล้ว'], ['part', 'ดีขึ้น แต่ยังไม่ถึงเป้าหมาย'], ['none', 'ยังไม่ดีขึ้นเท่าที่ควร']];
  const REC = [['renew', 'ต่อคอร์ส', 'ฝึกต่อให้ถึงเป้าหมาย'], ['pervisit', 'นัดเป็นครั้งเมื่อจำเป็น', 'ดูแลตัวเองได้แล้ว นัดเมื่อมีอาการ จ่ายรายครั้ง'], ['stop', 'จบการรักษา', 'ถึงเป้าหมายแล้ว ทำโปรแกรมที่บ้านต่อ']];
  SC.renewPack = (s, v) => { const cp = Object.assign({}, s.coursePlan || {}, { pack: v, bonus: 0, price: null }); const p = PACKS.find(x => x.v === +v); return p ? priceOf(cp, p) : null; };
  scr('t.renew', {
    render(s) {
      const c = s.course, r = s.renewal || (s.renewal = { progress: '', note: '', rec: '', pack: 5, next: '' });
      if (!c) return `<div class="scr">${ui.bar('สรุปจบคอร์ส')}<div class="body">${ui.empty('flag', 'ยังไม่มีคอร์ส', '')}</div></div>`;
      const total = c.sessions + (c.bonus || 0), goal = (s.coursePlan && s.coursePlan.goal) || ((visitOf(s, 1) || {}).soap || {}).goal || '—';
      if (r.sent) return `<div class="scr">${ui.bar('สรุปจบคอร์ส')}<div class="body">${ui.empty('send', 'ส่งสรุปให้คนไข้แล้ว', r.decided ? 'คนไข้ตัดสินใจแล้ว ดูที่หน้างาน' : 'รอคนไข้เลือกใน LINE · ไม่ตอบใน 3 วัน ระบบเตือน แล้วทีมโทรถาม', '<button class="btn auto" data-go="t.work">กลับหน้างาน</button>')}</div></div>`;
      const full = Number((s.coursePlan || {}).full) || 1850;
      return `<div class="scr">${ui.bar('สรุปจบคอร์ส')}<div class="body">
        <div class="card cream"><span class="small">คอร์ส ${total} ครั้ง · ใช้ครบแล้ว</span><b class="h3" style="display:block;margin-top:4px">เป้าหมายที่ตั้งไว้ครั้งแรก</b><p class="p" style="color:var(--ink)">${esc(goal)}</p></div>
        <div class="field"><span>ผลเทียบเป้าหมาย</span><div class="stack">${PROG.map(([k, t]) => `<button class="tt-opt ${r.progress === k ? 'on' : ''}" data-pick="renewal.progress" data-value="${k}" aria-pressed="${r.progress === k}">${t}</button>`).join('')}</div></div>
        <label class="field"><span>บอกคนไข้สั้น ๆ (ภาษาคน ญาติอ่านเข้าใจ)</span><textarea class="in tt-ta" rows="3" data-bind="renewal.note" data-live placeholder="เช่น ลุกจากเก้าอี้เองได้แล้ว ยังต้องฝึกเดินนอกบ้านต่อ">${esc(r.note)}</textarea></label>
        <div class="field"><span>คำแนะนำต่อไป</span><div class="stack">${REC.map(([k, t, d]) => `<button class="tt-opt ${r.rec === k ? 'on' : ''}" data-pick="renewal.rec" data-value="${k}" aria-pressed="${r.rec === k}"><b>${t}</b><small>${d}</small></button>`).join('')}</div></div>
        ${r.rec === 'renew' ? `<div class="field"><span>คอร์สที่แนะนำ (ราคาตามชีท Final price ราคาเต็ม ฿${full.toLocaleString()} ต่อครั้ง)</span><div class="tt-packs3">${PACKS.map(p => { const x = SC.renewPack(s, p.v); return `<button class="tt-opt ${+r.pack === p.v ? 'on' : ''}" data-pick="renewal.pack" data-value="${p.v}" aria-pressed="${+r.pack === p.v}"><b>${p.v} ครั้ง</b><small>${money(x.total)} · คุณได้ ${money(x.netPer)}/ครั้ง</small></button>`; }).join('')}</div></div>
          <label class="field"><span>นัดครั้งแรกของคอร์สใหม่</span><input class="in" data-bind="renewal.next" data-live value="${esc(r.next || '')}" placeholder="เช่น อ. 8 ธ.ค. 09:00"></label>` : ''}
        <p class="small row">${I('shield-check')}<span>คนไข้เป็นคนตัดสินใจใน LINE · ไม่ต้องเก็บเงินหน้างาน ระบบอ่านสลิปเอง</span></p>
      </div><div class="foot"><button class="btn" data-act="renewSend" data-need="renewal.progress,renewal.rec">${I('send')}ส่งสรุปให้คนไข้</button></div></div>`;
    }
  });
  act('renewSend', (s, ctx) => { const r = s.renewal; if (!r || !r.progress || !r.rec) return; if (r.rec === 'renew' && !r.next) r.next = 'อ. 8 ธ.ค. 09:00'; r.sent = true; ctx.line('patient', { key: 'renewOffer' }); ctx.toast('ส่งสรุปจบคอร์สเข้า LINE คนไข้แล้ว'); });

  /* ======================================================================
     t.earn · รายได้
     ====================================================================== */
  scr('t.earn', {
    render(s) {
      const done = s.visits.filter(v => v.step >= 4);
      const rows = done.map(v => ({ v, amt: v.n === 1 ? NET_TRIAL : (s.course ? s.course.perSession : s.perVisit ? s.perVisit.net : 0) }));
      const total = rows.reduce((a, r) => a + r.amt, 0);
      const c = s.course;
      const courseLeft = c && c.approved ? (c.net || c.total) - (done.filter(v => v.n > 1).length * c.perSession) : 0;
      const body = rows.length || c ? `
          <div class="tt-earn"><span class="small" style="color:var(--gink)">ยอดเดือนนี้ (ต.ค. 2569) · รอโอน</span><span class="n">${money(total)}</span><span class="small" style="color:var(--gink)">${rows.length} เคส · โอนรอบถัดไป 10 พ.ย. 2569</span></div>
          ${rows.length ? `<span class="kick">รายการ</span><div class="list">${rows.map(r => `<div class="li"><span class="tile">${I('house')}</span><span class="grow"><span class="t">ทำเคส ${esc(pname(s))} · ครั้งที่ ${r.v.n}</span><br><span class="s">${esc(shortDate(r.v.date))} · ${r.v.n === 1 ? 'ClairConnect Trial' : 'คอร์ส'} · ${esc(districtOf(s))}</span></span><span style="text-align:right"><b class="money">${money(r.amt)}</b><br><span class="pill wait">รอโอน</span></span></div>`).join('')}</div>` : ''}
          ${c ? `<span class="kick">คอร์ส</span><div class="card flat"><div class="row"><span class="tile gold">${I('package')}</span><span class="grow"><b class="h3">คอร์ส ${c.sessions} ครั้ง${c.bonus ? ` แถม ${c.bonus}` : ''} · สุทธิ ${money(c.net || c.total)}</b><br><span class="small">${c.approved ? `รายได้สุทธิทยอยเข้าครั้งละ ${money(c.perSession)} ตามครั้งที่ทำ · เหลือ ${money(Math.max(0, courseLeft))}` : 'รอแอดมินตรวจสลิป รายได้เริ่มนับเมื่อเปิดสิทธิ์'}</span></span></div></div>` : ''}`
        : ui.empty('wallet', 'ยังไม่มีรายได้', 'รายได้ขึ้นที่นี่หลังจบเคสและส่งสรุป ClairConnect Trial ได้สุทธิเคสละ ' + money(NET_TRIAL));
      return `<div class="scr">${ui.bar('รายได้', { back: false })}<div class="body enter">${body}
        <p class="note mint row tt-top">${I('info')}<span>ยอดที่แสดงหักค่าธรรมเนียมแล้ว · โอนเข้าบัญชีที่ลงทะเบียนกับทีม</span></p>
        <button class="btn ghost" data-act="ptBank">${I('landmark')}บัญชีรับเงิน</button>
      </div>${ui.tabs('pt', 't.earn')}</div>`;
    }
  });
  act('ptBank', () => openSheet(st => `<b class="h2">บัญชีรับเงิน</b><p class="p">ทีมขอข้อมูลบัญชีรับเงินผ่าน LINE ก่อนรอบโอนแรก ห้องซ้อมไม่เก็บเลขบัญชีจริง</p>
      <div class="kv"><dt>สถานะ</dt><dd>${st.pt.bankAsked ? 'ส่งคำขอแล้ว' : 'ยังไม่ตั้ง'}</dd><dt>รอบโอน</dt><dd>10 พ.ย. 2569</dd></div>
      ${st.pt.bankAsked ? '<p class="note mint">ทีมจะทักใน LINE เพื่อนัดเวลา</p>' : '<button class="btn" data-act="ptBankAsk">ขอให้ทีมติดต่อตั้งบัญชี</button>'}<button class="btn ghost" data-close>ปิด</button>`));
  act('ptBankAsk', (s, ctx) => { s.pt.bankAsked = true; ctx.toast('ส่งคำขอแล้ว ทีมจะทักใน LINE'); });

  /* ======================================================================
     t.me · บัญชี
     ====================================================================== */
  scr('t.me', {
    render(s) {
      const p = s.pt, ok = verified(s), n = p.notif;
      const sw = (k, t, sub) => `<label class="li" style="cursor:pointer"><span class="grow"><span class="t">${t}</span><br><span class="s">${sub}</span></span><input type="checkbox" class="tt-sw" data-bind="pt.notif.${k}" ${n[k] ? 'checked' : ''} aria-label="${t}"></label>`;
      return `<div class="scr">${ui.bar('บัญชีของฉัน')}<div class="body">
        <div class="row">${ui.avatar(p.displayName, p.photo, 60)}<div class="grow"><b class="h2">${esc(p.displayName || 'ยังไม่ตั้งชื่อ')}</b><br>${ok ? `<span class="ver">${I('badge-check')}ใบประกอบวิชาชีพ ตรวจสอบได้</span>` : p.status === 'PENDING' ? '<span class="pill wait">รอตรวจใบประกอบ</span>' : '<span class="pill gray">ยังไม่สมัคร</span>'}</div></div>
        <span class="kick">ข้อมูลที่ทีมเห็นเท่านั้น</span>
        <div class="list">
          <div class="li"><span class="tile">${I('lock')}</span><span class="grow"><span class="s">ชื่อจริง · ใช้บนใบรับรอง</span><br><span class="t">${esc(p.legalName || '—')}</span></span></div>
          <div class="li"><span class="tile">${I('id-card')}</span><span class="grow"><span class="s">เลขใบประกอบวิชาชีพ</span><br><span class="t">${p.license ? 'ก. ' + esc(p.license) : '—'}</span></span><span class="pill ${ok ? '' : 'wait'}">${ok ? 'ตรวจแล้ว' : 'รอตรวจ'}</span></div>
          <button class="li" data-act="ptAskEdit"><span class="tile">${I('pencil')}</span><span class="grow"><span class="t">ขอแก้ชื่อจริงหรือเลขใบประกอบ</span><br><span class="s">ทีมตรวจใหม่ก่อนเปลี่ยน</span></span>${I('chevron-right', 'chev')}</button>
        </div>
        <span class="kick">การทำงาน</span>
        <div class="list">
          <button class="li" data-act="editZones"><span class="tile">${I('map-pin')}</span><span class="grow"><span class="t">เขตที่รับงาน</span><br><span class="s">${esc(p.zones.length ? p.zones.join(' · ') : 'ยังไม่เลือก')}</span></span>${I('chevron-right', 'chev')}</button>
          <button class="li" data-go="t.agreement"><span class="tile">${I('file-text')}</span><span class="grow"><span class="t">ข้อตกลงการรับงาน</span><br><span class="s">${p.agreement ? 'ยอมรับแล้ว · แตะเพื่ออ่าน' : 'ยังไม่ได้อ่าน · อ่านครั้งเดียวก่อนงานแรก'}</span></span>${I('chevron-right', 'chev')}</button>
          <button class="li" data-act="xpHistory"><span class="tile gold">${I('sparkles')}</span><span class="grow"><span class="t">XP และประวัติ</span><br><span class="s">${p.xp} XP · ระดับ ${lvl(p.xp).level}</span></span>${I('chevron-right', 'chev')}</button>
        </div>
        <span class="kick">LINE และการแจ้งเตือน</span>
        <div class="list">
          <div class="li"><span class="tile" style="background:#e6f9ee;color:var(--linegreen)">${I('message-circle')}</span><span class="grow"><span class="t">เชื่อมกับ LINE แล้ว</span><br><span class="s">เข้าสู่ระบบและรับแจ้งงานผ่าน LINE</span></span>${I('check')}</div>
          ${sw('offer', 'งานเสนอใหม่', 'แจ้งทันทีเมื่อมีงานในเขตของคุณ')}
          ${sw('remind', 'เตือนก่อนนัด', 'เย็นวันก่อน และ 1 ชม. ก่อนถึงเวลา')}
          ${sw('news', 'ข่าวและเคล็ดลับ', 'ไม่เกินเดือนละ 2 ครั้ง')}
        </div>
        <span class="kick">ช่วยเหลือ</span>
        <div class="list">
          <button class="li" data-act="ptHelp"><span class="tile">${I('life-buoy')}</span><span class="grow"><span class="t">คุยกับทีม SynaClair</span><br><span class="s">ตอบทุกวัน 08:00–22:00</span></span>${I('chevron-right', 'chev')}</button>
          <button class="li" data-act="ptLogoutAsk"><span class="tile" style="background:var(--redbg);color:var(--red)">${I('log-out')}</span><span class="grow"><span class="t" style="color:var(--red)">ออกจากระบบ</span></span></button>
        </div>
      </div></div>`;
    }
  });
  act('ptAskEdit', (s, ctx) => ctx.toast('ส่งคำขอแก้ข้อมูลแล้ว ทีมจะทักใน LINE'));
  act('editZones', () => openSheet(st => {
    const p = st.pt, z = SC.ZONES.find(x => x.code === p.zoneTab) || SC.ZONES[0];
    return `<b class="h2">เขตที่รับงาน</b>${zonePicker(p, z, z.districts.every(d => p.zones.includes(d)))}
      <button class="btn" data-act="zonesSaved" ${p.zones.length ? '' : 'disabled'}>บันทึก</button>`;
  }));
  act('zonesSaved', (s, ctx) => { ctx.close(); ctx.toast('บันทึกเขตแล้ว งานเสนอส่งตามเขตใหม่'); });
  act('ptHelp', s => { s.pt.helpMsg = ''; openSheet(() => `<b class="h2">คุยกับทีม SynaClair</b><p class="small">ทีมตอบใน LINE ภายในเวลา 08:00–22:00</p>
      <label class="field"><span>เรื่องที่อยากถาม</span><textarea class="in" data-bind="pt.helpMsg" rows="3" placeholder="เช่น อยากเปลี่ยนเขตที่รับงาน"></textarea></label>
      <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn" data-act="ptHelpSend" data-need="pt.helpMsg">${I('send')}ส่ง</button></div>`); });
  act('ptHelpSend', (s, ctx) => { s.pt.helpMsg = ''; ctx.close(); ctx.toast('ส่งถึงทีมแล้ว ทีมตอบใน LINE'); });
  act('ptLogoutAsk', () => openSheet(() => `<b class="h2">ออกจากระบบ?</b><p class="p">ข้อมูลและโปรไฟล์ยังอยู่ครบ เข้าใหม่ด้วย LINE ได้ทุกเมื่อ</p>
      <div class="grid2"><button class="btn ghost" data-close>ยกเลิก</button><button class="btn danger" data-act="ptLogout">ออกจากระบบ</button></div>`, 'dlg'));
  act('ptLogout', (s, ctx) => { s.pt.loggedIn = false; ctx.close(); return 't.join'; });
})();
