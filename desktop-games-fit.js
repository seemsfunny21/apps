
(()=>{"use strict";
const root=document.querySelector("body.desktop-premium");
const dashboard=root?.querySelector(":scope > .dashboard");
const host=document.getElementById("gamesFrame");
if(!root||!dashboard||!host)return;
const STYLE="desktop-games-fit-nov26";
const RULES={"sudokufunny":".app-shell{width:100%!important;max-width:1570px!important;height:100dvh!important;min-height:0!important;padding:7px clamp(10px,1vw,20px) 10px!important;overflow-y:auto!important}.app-shell>.hero{display:none!important}.game-panel{width:100%!important;max-width:1510px!important;margin:0 auto!important;grid-template-columns:minmax(0,1fr) minmax(280px,360px)!important;column-gap:clamp(12px,1.2vw,22px)!important}.board-wrap{width:min(100%,calc(100dvh - 32px),1080px)!important}","reversifunny":".app-shell{width:100%!important;max-width:1570px!important;height:100dvh!important;min-height:0!important;padding:7px clamp(10px,1vw,20px) 10px!important;overflow-y:auto!important}.app-shell>.hero{display:none!important}.game-panel{width:100%!important;max-width:1510px!important;margin:0 auto!important;grid-template-columns:minmax(0,1fr) minmax(280px,360px)!important;column-gap:clamp(12px,1.2vw,22px)!important}.board-wrap{width:min(100%,calc(100dvh - 32px),1080px)!important}","minesweeperfunny":".shell{width:100%!important;max-width:100%!important;min-height:100dvh!important;padding:5px 12px 12px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}.shell>.hero{display:none!important}.panel{width:max-content!important;max-width:100%!important;margin:0 auto!important;padding:8px!important}#board{--sz:min(calc((100dvh - 205px)/var(--apps-ms-rows,16)),calc((100vw - 145px)/var(--columns,16)),105px)!important}#scroll{max-width:100%!important;overflow-x:auto!important}.cell{font-size:calc(var(--sz)*.5)!important}","solitairefunny":".shell{width:100%!important;max-width:min(100%,calc((100dvh - 155px)*1.20),1200px)!important;min-height:100dvh!important;padding:5px 8px 10px!important}.shell>.hero{display:none!important}.panel{padding:8px!important}.game{min-height:clamp(480px,calc(100dvh - 180px),970px)!important;padding:8px 6px 8px!important}.column{min-height:clamp(390px,calc(100dvh - 280px),870px)!important}.top,.columns{gap:clamp(5px,.65vw,10px)!important}","tavlifunny":".shell{width:100%!important;max-width:min(100%,calc((100dvh - 70px)*1.83),1600px)!important;height:100dvh!important;min-height:0!important;padding:4px 8px 8px!important;overflow:hidden!important}.shell>.suite-game-banner{display:none!important}.panel{min-height:0!important;width:100%!important}.board-wrap{max-height:calc(100dvh - 115px)!important}","tichufunny":".app{width:100%!important;max-width:min(calc(100% - 16px),calc(100dvh*1.55),1550px)!important;height:100dvh!important;min-height:0!important;margin:0 auto!important;padding:5px 8px 8px!important;overflow-y:auto!important}.app>.suite-game-banner{display:none!important}.table#cardTable{min-height:clamp(290px,44dvh,580px)!important}.hand{min-height:clamp(105px,12dvh,170px)!important}.hand .card{width:clamp(42px,3.8vw,72px)!important;height:clamp(62px,5.8vw,98px)!important}","tichufunnyonline":".app{width:100%!important;max-width:min(calc(100% - 16px),calc(100dvh*1.55),1550px)!important;height:100dvh!important;min-height:0!important;margin:0 auto!important;padding:5px 8px 8px!important;overflow-y:auto!important}.app>.suite-game-banner{display:none!important}.table#cardTable{min-height:clamp(290px,44dvh,580px)!important}.hand{min-height:clamp(105px,12dvh,170px)!important}.hand .card{width:clamp(42px,3.8vw,72px)!important;height:clamp(62px,5.8vw,98px)!important}","monopolyfunny":".layout{max-width:1650px!important;margin:auto!important}.board{max-height:calc(100dvh - 64px)!important;width:min(calc(100dvh - 64px),calc(100vw - 240px))!important;height:min(calc(100dvh - 64px),calc(100vw - 240px))!important;aspect-ratio:1!important}","quizfunny":".top{min-height:46px!important;padding:6px 14px!important}.shell{width:100%!important;max-width:1650px!important;min-height:0!important;height:calc(100dvh - 54px)!important;margin:0 auto!important}.stage{height:100%!important;min-height:0!important}.question{font-size:clamp(18px,2.1vw,32px)!important}.answer{min-height:clamp(48px,7.2dvh,85px)!important}"};
const BASE=".suite-game-banner,body>.suite-game-banner{display:none!important}html,body{max-width:100%!important;overflow-x:hidden!important}";
const tracked=new WeakSet(),observers=new WeakMap();
function nameOf(frame){
  try{return new URL(frame.src,location.href).pathname.split("/").filter(Boolean).pop();}catch(_){return null;}
}
function active(){
  return window.innerWidth>=900 && root.dataset.screen==="single" &&
    document.getElementById("pane-games")?.classList.contains("is-selected");
}
function mineRows(doc){
  const board=doc.getElementById("board");if(!board)return;
  const cols=Number(board.style.getPropertyValue("--columns"))||9;
  const rows=cols>0?Math.ceil(board.children.length/cols):16;
  if(rows>0&&rows<=40&&board.style.getPropertyValue("--apps-ms-rows")!==String(rows))
    board.style.setProperty("--apps-ms-rows",String(rows));
}
function fit(frame){
  if(!(frame instanceof HTMLIFrameElement))return;
  const key=nameOf(frame);
  if(!key||key==="chessfunny"||!Object.prototype.hasOwnProperty.call(RULES,key))return;
  try{
    const doc=frame.contentDocument;
    if(!doc?.head)return;
    let style=doc.getElementById(STYLE);
    if(!style){style=doc.createElement("style");style.id=STYLE;doc.head.append(style);}
    const next=active()?"@media(min-width:680px){"+BASE+RULES[key]+"}":"";
    if(style.textContent!==next)style.textContent=next;
    if(key==="minesweeperfunny"&&active()){
      const board=doc.getElementById("board");
      if(board&&!observers.has(board)){
        const observer=new MutationObserver(()=>mineRows(doc));
        observer.observe(board,{childList:true});
        observers.set(board,observer);
      }
      mineRows(doc);
    }
  }catch(_){}
}
function watch(frame){
  if(!(frame instanceof HTMLIFrameElement)||tracked.has(frame))return;
  tracked.add(frame);frame.addEventListener("load",()=>fit(frame));fit(frame);
}
function refresh(){for(const frame of host.querySelectorAll("iframe")){watch(frame);fit(frame);}}
new MutationObserver(refresh).observe(host,{childList:true});
new MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:["data-screen"]});
const pane=document.getElementById("pane-games");
if(pane)new MutationObserver(refresh).observe(pane,{attributes:true,attributeFilter:["class","hidden"]});
window.addEventListener("resize",refresh,{passive:true});
refresh();
})();
