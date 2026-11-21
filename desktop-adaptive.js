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
  "html,body{width:100%!important;height:100%!important;min-height:0!important;overflow:hidden!important}",
  ".shell{width:100%!important;max-width:none!important;height:100dvh!important;min-height:0!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:stretch!important;overflow:hidden!important}",
  ".shell>.hero,.shell>.suite-game-banner,.shell>.foot{display:none!important}",
  ".layout{display:block!important;flex:1 1 auto!important;min-height:0!important;height:100%!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;overflow:hidden!important}",
  "#apps-chess-side,.controls,.top-score,.status,.ranks,.files{display:none!important}",
  ".board-card{display:block!important;width:100%!important;height:100%!important;max-width:none!important;min-height:0!important;min-width:0!important;margin:0!important;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important}",
  ".board-grid{display:block!important;width:100%!important;height:100%!important;max-width:none!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important}",
  ".board{display:grid!important;grid-column:auto!important;grid-row:auto!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;min-width:0!important;min-height:0!important;aspect-ratio:auto!important;grid-template-columns:repeat(8,minmax(0,1fr))!important;grid-template-rows:repeat(8,minmax(0,1fr))!important;overflow:hidden!important}",
  ".sq{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;display:grid!important;place-items:center!important}",
  ".piece{font-size:clamp(35px,min(5vw,10dvh),125px)!important;line-height:1!important;white-space:nowrap!important}"
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