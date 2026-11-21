/* MY APPS: true responsive TV/PC layouts; never scale/transform an iframe. */
(() => {
"use strict";
const root=document.querySelector("body.desktop-premium");
const dashboard=root?.querySelector(":scope > .dashboard");
const actions=root?.querySelector(".desktop-top-actions");
if(!root||!dashboard||!actions)return;
const KEY="apps-desktop-display-v1",STYLE="apps-responsive-profile-nov26";
let stored=null;
try{stored=localStorage.getItem(KEY);}catch(_){}
let profile=(stored==="tv"||stored==="pc")?stored:
  (window.innerWidth>=1500&&window.innerHeight>=730?"tv":"pc");
const profiles={
 tv:"--apps-control:clamp(17px,1.12vw,22px);--apps-footer:clamp(13px,.9vw,17px);--apps-heading:clamp(21px,1.42vw,28px);",
 pc:"--apps-control:clamp(14px,.94vw,18px);--apps-footer:clamp(11px,.72vw,14px);--apps-heading:clamp(18px,1.2vw,24px);"
};
const CSS={
 voltes:[
 ".shell{max-width:1380px!important;width:100%!important;margin-inline:auto!important;padding-inline:clamp(12px,1.45vw,28px)!important}",
 ".shell>header{display:none!important}",
 ".bottom-nav{width:min(100%,850px)!important;max-width:850px!important}",
 ".bottom-nav button{min-height:clamp(56px,6dvh,75px)!important;font-size:var(--apps-footer)!important}",
 ".bottom-nav button span{font-size:clamp(23px,1.8vw,35px)!important}",
 ".ride-title{font-size:var(--apps-heading)!important}",
 ".btn,.quick-option{font-size:var(--apps-control)!important}"
 ].join(""),
 douleia:[
 ".routes-hero-head{display:none!important}",
 ".wrap{width:100%!important;max-width:1450px!important;margin-inline:auto!important;padding:clamp(9px,1.5dvh,20px) clamp(12px,1.4vw,26px) 26px!important}",
 ".page-headbar{margin-bottom:clamp(8px,1.4dvh,16px)!important}",
 ".route-grid{gap:clamp(10px,1vw,18px)!important}",
 ".route-card{padding:clamp(12px,1vw,18px)!important;min-height:0!important}",
 ".route-top h3{font-size:var(--apps-heading)!important}",
 ".driver-choice{font-size:var(--apps-control)!important;min-height:clamp(51px,6dvh,66px)!important;padding:10px!important}",
 ".driver-grid{gap:clamp(7px,.8vw,12px)!important}",
 ".bottom-nav{max-width:1020px!important;width:min(100%,1020px)!important}",
 ".bottom-nav button{font-size:var(--apps-footer)!important;min-height:56px!important}",
 ".btn,.route-controls select{font-size:var(--apps-control)!important}",
 "@media(min-width:1120px){.route-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}"
 ].join(""),
 reminder:[
 ".premium-glass .reminder-hero-art{display:none!important}",
 ".premium-glass .content-area{width:min(100%,1420px)!important;max-width:1420px!important;height:100dvh!important;min-height:0!important;margin:0 auto!important;padding:12px clamp(12px,1.4vw,25px) 14px!important;overflow:hidden!important}",
 ".premium-glass .wizard-half,.premium-glass .list-half{min-width:0!important;min-height:0!important}",
 ".premium-glass #quickReminderTitle{font-size:var(--apps-control)!important;min-height:49px!important}",
 ".premium-glass .list-header-name h2{font-size:var(--apps-heading)!important}",
 ".premium-glass .quick-label{font-size:var(--apps-footer)!important}",
 ".premium-glass .quick-form button{font-size:var(--apps-control)!important}",
 "@media(min-width:1050px){.premium-glass .screen-split{display:grid!important;grid-template-columns:minmax(0,2fr) minmax(0,3fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:clamp(10px,1vw,18px)!important;height:100%!important}}"
 ].join(""),
 parking:[
 ".app{width:min(calc(100% - 32px),760px)!important;max-width:760px!important;margin-inline:auto!important;padding-bottom:20px!important}",
 ".app>.hero{display:none!important}",
 ".place-name{font-size:clamp(27px,2.1vw,38px)!important}",
 ".actions{gap:clamp(12px,1vw,19px)!important}",
 ".actions .action-tile{min-height:clamp(98px,12dvh,145px)!important;font-size:var(--apps-control)!important}",
 ".panel{padding:clamp(17px,1.3vw,26px)!important}",
 ".meta{font-size:var(--apps-footer)!important}"
 ].join(""),
 kairos:[
 ".app-wrap{width:min(100%,1050px)!important;max-width:1050px!important;padding-inline:clamp(12px,1.5vw,26px)!important}",
 ".suite-banner{display:none!important}",
 ".topbar{height:clamp(57px,6dvh,76px)!important}",
 ".hero{min-height:260px!important}",
 ".brand-name strong{font-size:var(--apps-heading)!important}",
 ".conditions{font-size:var(--apps-footer)!important}",
 ".temperature-line{font-size:clamp(68px,5vw,95px)!important}"
 ].join("")
};
const gameBase=".suite-game-banner,body>.suite-game-banner{display:none!important}.app-shell>.hero:has(.sudoku-hero-art),.app-shell>.hero:has(.reversi-hero-art){display:none!important}";
const games={
 sudokufunny:".app-shell{max-width:1450px!important}",
 reversifunny:".app-shell{max-width:1450px!important}",
 minesweeperfunny:".shell{max-width:930px!important}",
 solitairefunny:".shell{max-width:1320px!important}",
 chessfunny:[
  ".shell{--chess-play:min(calc(100dvh - 100px),960px);width:calc(100% - 16px)!important;max-width:none!important;min-height:0!important;margin:0 auto!important;padding:6px 8px 12px!important}",
  ".shell>.hero{display:none!important}",
  ".layout{display:grid!important;grid-template-columns:minmax(215px,1fr) minmax(0,var(--chess-play)) minmax(255px,1fr)!important;gap:clamp(12px,1vw,24px)!important;align-items:start!important;justify-content:stretch!important;width:100%!important}",
  "#apps-chess-side{grid-column:1!important;display:flex;flex-direction:column;gap:clamp(11px,1.5dvh,21px);min-width:0;min-height:calc(var(--chess-play) + 48px);padding:clamp(17px,1.2vw,25px);border:1px solid #5ca4d180;border-radius:17px;background:linear-gradient(150deg,#153e67,#09233e);box-shadow:0 8px 25px #0004,inset 0 1px #b7e6ff1c;overflow:hidden}",
  "#apps-chess-side[hidden]{display:none!important}",
  "#apps-chess-side .chess-side-eyebrow{font-size:11px;font-weight:850;letter-spacing:.15em;color:#93c7e9}",
  "#apps-chess-side .chess-side-state{font-size:clamp(19px,1.4vw,26px);font-weight:800;color:#f0faff;line-height:1.35;overflow-wrap:anywhere}",
  "#apps-chess-side .chess-side-sub{font-size:clamp(13px,.83vw,16px);color:#c0e1f6;line-height:1.45;overflow-wrap:anywhere}",
  "#apps-chess-side .chess-side-card{padding:clamp(12px,1vw,19px);border:1px solid #82bef744;background:#0a2b4b;border-radius:13px;display:grid;gap:11px}",
  "#apps-chess-side .chess-side-divider{height:1px;background:linear-gradient(90deg,transparent,#6da4d65e,transparent)}",
  "#apps-chess-side .chess-side-help{display:grid;gap:11px;color:#c6dff2;font-size:clamp(13px,.79vw,16px);line-height:1.4}",
  "#apps-chess-side .chess-side-help span{display:flex;align-items:flex-start;gap:9px}",
  "#apps-chess-side .chess-help-number{display:grid;place-items:center;flex:0 0 25px;width:25px;height:25px;border-radius:8px;background:#235a8a;border:1px solid #78b6ea55;color:#e4f9ff;font-weight:850;font-size:12px}",
  ".board-card{grid-column:2!important;min-width:0!important;width:100%!important;max-width:none!important;padding:7px!important}",
  ".board-grid{width:100%!important;min-width:0!important}",
  ".controls{grid-column:3!important;display:flex!important;flex-direction:column!important;align-self:stretch!important;min-width:0!important;width:100%!important;min-height:calc(var(--chess-play) + 48px)!important;position:static!important;top:auto!important;margin:0!important;padding:clamp(12px,1vw,20px)!important;gap:clamp(13px,1.3dvh,22px)!important}",
  ".stats{display:grid!important;grid-template-columns:1fr!important;gap:10px!important}",
  ".stats .pill{min-height:clamp(51px,6.3dvh,70px)!important;font-size:var(--apps-control)!important}",
  ".buttons{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(8px,.7vw,12px)!important}",
  ".buttons button{min-height:clamp(55px,7dvh,78px)!important;font-size:clamp(21px,1.5vw,32px)!important}",
  ".buttons .primary{grid-column:1/-1!important;font-size:var(--apps-control)!important}",
  ".piece{font-size:clamp(36px,4.3vw,93px)!important}",
  ".top-score{font-size:clamp(12px,.76vw,16px)!important}",
  ".status{font-size:clamp(12px,.8vw,17px)!important}",
  ".foot{font-size:12px!important;margin:8px 0 0!important}",
  "@media(max-width:1350px){.shell{--chess-play:min(calc(100dvh - 94px),calc(100vw - 390px),900px)}.layout{grid-template-columns:minmax(0,var(--chess-play)) minmax(235px,1fr)!important;gap:12px!important}#apps-chess-side{display:none!important}.board-card{grid-column:1!important}.controls{grid-column:2!important}}",
  "@media(max-width:1030px){.shell{--chess-play:min(calc(100dvh - 90px),calc(100vw - 335px),800px)}.layout{grid-template-columns:minmax(0,var(--chess-play)) minmax(205px,1fr)!important;gap:9px!important}.controls{padding:8px!important}}",
  "@media(max-height:720px){.shell{--chess-play:min(calc(100dvh - 85px),900px)}.top-score{padding-bottom:3px!important}.status{padding-top:3px!important}}"
 ].join(""),
 tavlifunny:".app,.shell{max-width:1400px!important}",
 tichufunny:".app,.shell{max-width:1450px!important}",
 tichufunnyonline:".app,.shell{max-width:1450px!important}",
 monopolyfunny:".layout{max-width:1350px!important}",
 quizfunny:".shell{max-width:1310px!important}"
};
const known=new Set([...Object.keys(CSS),...Object.keys(games)]);
function styleFor(id){
 const rules=CSS[id]||(gameBase+(games[id]||""));
 return "@media(min-width:900px){:root{"+profiles[profile]+"}"+rules+"}";
}
const controls=document.createElement("div");
controls.className="desktop-display-toggle";
controls.setAttribute("role","group");
controls.setAttribute("aria-label","Προφίλ εμφάνισης");
controls.innerHTML=[
 '<button type="button" data-display-choice="tv" aria-pressed="false" title="Μεγαλύτερα στοιχεία για τηλεόραση">',
 '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 22h8M12 19v3"/></svg>TV</button>',
 '<button type="button" data-display-choice="pc" aria-pressed="false" title="Συμπαγής προβολή υπολογιστή">',
 '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/></svg>PC</button>'
].join("");
const open=document.getElementById("desktopOpen");
if(open)actions.insertBefore(controls,open);else actions.prepend(controls);
function getApp(frame){
 const pane=frame.closest(".pane");if(!pane)return null;
 const id=pane.dataset.app||pane.id.replace(/^pane-/,"");
 if(id!=="games")return known.has(id)?id:null;
 try{
   const path=new URL(frame.src,location.href).pathname;
   const game=path.split("/").filter(Boolean).pop();
   return known.has(game)?game:null;
 }catch(_){return null;}
}
const observed=new WeakSet();
function apply(frame){
 if(!(frame instanceof HTMLIFrameElement))return;
 // Clear any inline zoom from older versions if present.
 if(frame.style.transform)frame.style.transform="";
 if(frame.style.width&&frame.style.width!=="100%")frame.style.width="";
 if(frame.style.height&&frame.style.height!=="100%")frame.style.height="";
 const pane=frame.closest(".pane"),id=getApp(frame);
 if(!pane||!id)return;
 const visible=window.innerWidth>=900&&root.dataset.screen==="single"
   &&pane.classList.contains("is-selected")&&!pane.hidden;
 try{
   const doc=frame.contentDocument;
   if(!doc?.head)return; // Browser restrictions: never break a standalone game.
   let el=doc.getElementById(STYLE);
   if(!el){el=doc.createElement("style");el.id=STYLE;doc.head.append(el);}
   const next=visible?styleFor(id):"";
   if(el.textContent!==next)el.textContent=next;
 }catch(_){}
}
function watch(frame){
 if(!(frame instanceof HTMLIFrameElement)||observed.has(frame))return;
 observed.add(frame);frame.addEventListener("load",()=>apply(frame));apply(frame);
}
function sync(){
 dashboard.querySelectorAll("iframe").forEach(frame=>{watch(frame);apply(frame);});
}
function update(){
 root.dataset.displayProfile=profile;
 for(const b of controls.querySelectorAll("[data-display-choice]")){
   b.setAttribute("aria-pressed",String(b.dataset.displayChoice===profile));
 }
 sync();
}
controls.addEventListener("click",event=>{
 const b=event.target.closest("[data-display-choice]");if(!b)return;
 const value=b.dataset.displayChoice;if(value!=="tv"&&value!=="pc")return;
 profile=value;try{localStorage.setItem(KEY,profile);}catch(_){}
 update();
});
const observer=new MutationObserver(sync);
observer.observe(root,{attributes:true,attributeFilter:["data-screen"]});
for(const p of dashboard.querySelectorAll(".pane")){
 observer.observe(p,{attributes:true,attributeFilter:["class","hidden"]});
}
const gamesFrame=document.getElementById("gamesFrame");
if(gamesFrame)observer.observe(gamesFrame,{childList:true});
window.addEventListener("resize",sync,{passive:true});
if(typeof ResizeObserver!=="undefined"){
 const ro=new ResizeObserver(sync);
 for(const el of dashboard.querySelectorAll(".pane-frame"))ro.observe(el);
}
update();
})();