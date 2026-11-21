/* Desktop-only iframe sizing. The mobile Applications project is untouched. */
(() => {
"use strict";
const gameBanner = [
  ".suite-game-banner,body>.suite-game-banner{",
    "box-sizing:border-box!important;",
    "display:none!important;",
    "width:min(calc(100% - 22px),660px)!important;",
    "max-width:660px!important;",
    "height:190px!important;max-height:190px!important;",
    "margin:8px auto 12px!important;overflow:hidden!important;",
    "border-radius:13px!important;}",
  ".suite-game-banner img{display:block!important;width:100%!important;",
    "height:100%!important;object-fit:contain!important;",
    "object-position:center!important;}"
].join("");
const desktopFit={
  voltes:[
    ".shell{max-width:1260px!important;width:100%!important;}",
    ".shell>header{display:none!important;}",
    ".shell>header{max-width:1050px;margin-left:auto;margin-right:auto;}"
  ].join(""),
  douleia:[
    ".wrap{max-width:1380px!important;width:100%!important;",
      "padding-left:20px!important;padding-right:20px!important;}",
    ".routes-hero-head{display:none!important;}",
    ".route-grid{max-width:1100px;margin-left:auto;margin-right:auto;}"
  ].join(""),
  reminder:[
    ".premium-glass .content-area{",
      "width:min(100%,1400px)!important;max-width:1400px!important;",
      "height:100dvh!important;padding:17px 20px 20px!important;margin:0 auto!important;}",
    ".premium-glass .screen-split{display:grid!important;",
      "grid-template-columns:minmax(0,2fr) minmax(0,3fr)!important;",
      "grid-template-rows:minmax(0,1fr)!important;",
      "height:100%!important;gap:15px!important;align-items:stretch!important;}",
    ".premium-glass .wizard-half,.premium-glass .list-half{",
      "min-width:0!important;min-height:0!important;}",
    ".premium-glass .reminder-hero-art{display:none!important;height:145px!important;",
      "max-height:145px!important;object-fit:contain!important;}"
  ].join(""),
  parking:[
    ".app{width:min(calc(100% - 30px),760px)!important;",
      "max-width:760px!important;margin:0 auto!important;}",
    ".app>.hero{display:none!important;}",
    ".parking-hero-art{width:100%!important;height:174px!important;object-fit:contain!important;}"
  ].join(""),
  kairos:[
    ".app-wrap{width:min(100%,1050px)!important;max-width:1050px!important;",
    ".suite-banner{display:none!important;}",
      "padding-left:22px!important;padding-right:22px!important;}",
    ".suite-banner{width:min(100%,740px)!important;",
      "height:190px!important;max-height:190px!important;}",
    ".suite-banner img{width:100%!important;height:100%!important;object-fit:contain!important;}"
  ].join(""),
  sudokufunny:[
    ".app-shell>.hero{display:none!important;width:min(100%,660px)!important;" ,
      "max-width:660px!important;height:185px!important;",
      "margin:0 auto 10px!important;flex:0 0 auto!important;}",
    ".app-shell>.hero .sudoku-hero-art{width:100%!important;",
      "height:100%!important;object-fit:contain!important;}"
  ].join(""),
  reversifunny:[
    ".app-shell>.hero{display:none!important;width:min(100%,660px)!important;" ,
      "max-width:660px!important;height:185px!important;",
      "margin:0 auto 10px!important;flex:0 0 auto!important;}",
    ".app-shell>.hero .reversi-hero-art{width:100%!important;",
      "height:100%!important;object-fit:contain!important;}"
  ].join(""),
  minesweeperfunny:gameBanner+".shell{max-width:830px!important;}",
  solitairefunny:gameBanner,
  chessfunny:gameBanner,
  tavlifunny:gameBanner,
  tichufunny:gameBanner,
  tichufunnyonline:gameBanner,
  monopolyfunny:gameBanner,
  quizfunny:gameBanner
};
const STYLE_ID="apps-desktop-iframe-fit-v1";
const dashboard=document.querySelector(".dashboard");
const gamesHost=document.getElementById("gamesFrame");
if(!dashboard)return;
const watched=new WeakSet();
function gameId(frame){
  try{
    const parts=new URL(frame.src,location.href).pathname.split("/").filter(Boolean);
    const last=parts.at(-1);
    return Object.prototype.hasOwnProperty.call(desktopFit,last)?last:null;
  }catch(_){return null;}
}
function getKey(frame){
  if(frame.closest("#pane-games"))return gameId(frame);
  return frame.closest(".pane")?.id?.replace(/^pane-/,"")||null;
}
function apply(frame){
  if(!(frame instanceof HTMLIFrameElement))return;
  const rules=desktopFit[getKey(frame)];
  if(!rules)return;
  try{
    const doc=frame.contentDocument;
    if(!doc?.head)return;
    let style=doc.getElementById(STYLE_ID);
    if(!style){
      style=doc.createElement("style");style.id=STYLE_ID;const compact=doc.getElementById("desktop-premium-banner-size");if(compact)doc.head.insertBefore(style,compact);else doc.head.appendChild(style);
    }
    style.textContent=window.innerWidth>=900?rules:"";
  }catch(_){
    // Never interfere with an iframe if the browser disallows document access.
  }
}
function watch(frame){
  if(!(frame instanceof HTMLIFrameElement)||watched.has(frame))return;
  watched.add(frame);
  frame.addEventListener("load",()=>apply(frame));
  apply(frame);
}
dashboard.querySelectorAll("iframe").forEach(watch);
window.addEventListener("resize",()=>dashboard.querySelectorAll("iframe").forEach(apply),{passive:true});
if(gamesHost){
  const observer=new MutationObserver(()=>{
    gamesHost.querySelectorAll("iframe").forEach(watch);
  });
  observer.observe(gamesHost,{childList:true,subtree:true});
}
})();