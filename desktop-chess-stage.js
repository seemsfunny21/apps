/* Extra desktop-only ChessFunny panel. Does not touch the original mobile app. */
(() => {
"use strict";
const root=document.querySelector("body.desktop-premium");
const gamesPane=document.getElementById("pane-games");
const gameHost=document.getElementById("gamesFrame");
if(!root||!gamesPane||!gameHost)return;
const watched=new WeakSet(),observers=new WeakMap();
function isChess(frame){
  if(!(frame instanceof HTMLIFrameElement))return false;
  try{return new URL(frame.src,location.href).pathname.split("/").filter(Boolean).at(-1)==="chessfunny";}catch(_){return false;}
}
function shouldDisplay(){
  return window.innerWidth>=1351&&root.dataset.screen==="single"&&
    gamesPane.classList.contains("is-selected")&&!gamesPane.hidden;
}
function syncContent(doc){
  const ids=[["apps-chess-state","status","Έτοιμο για κίνηση"],["apps-chess-score","wins","Νίκες 0–0"],["apps-chess-turn","turn","Παίζεις με τα λευκά"]];
  for(const [target,source,defaultText] of ids){
    const output=doc.getElementById(target),input=doc.getElementById(source);
    if(output)output.textContent=input?.textContent||defaultText;
  }
}
function install(frame){
  if(!isChess(frame))return;
  try{
    const doc=frame.contentDocument;
    if(!doc?.body)return;
    const layout=doc.querySelector("main.shell > .layout");
    if(!layout)return;
    let aside=doc.getElementById("apps-chess-side");
    if(!aside){
      aside=doc.createElement("aside");
      aside.id="apps-chess-side";
      aside.hidden=true;
      aside.setAttribute("aria-label","Πληροφορίες παρτίδας στο Apps");
      aside.innerHTML=[
        '<div class="chess-side-eyebrow">Η ΠΑΡΤΙΔΑ ΜΟΥ</div>',
        '<div class="chess-side-card">',
        '<div class="chess-side-eyebrow">ΚΑΤΑΣΤΑΣΗ</div>',
        '<div id="apps-chess-state" class="chess-side-state"></div>',
        '<div id="apps-chess-turn" class="chess-side-sub"></div>',
        '<div class="chess-side-divider"></div>',
        '<div id="apps-chess-score" class="chess-side-sub"></div></div>',
        '<div class="chess-side-card"><div class="chess-side-eyebrow">ΠΩΣ ΠΑΙΖΕΙΣ</div>',
        '<div class="chess-side-help">',
        '<span><b class="chess-help-number">1</b>Επίλεξε ένα λευκό κομμάτι.</span>',
        '<span><b class="chess-help-number">2</b>Διάλεξε μία από τις φωτισμένες νόμιμες θέσεις.</span>',
        '<span><b class="chess-help-number">3</b>Χρησιμοποίησε την υπόδειξη ή την αναίρεση από τα δεξιά.</span>',
        '</div></div>'
      ].join("");
      layout.prepend(aside);
    }
    aside.hidden=!shouldDisplay();
    if(!observers.has(doc)){
      const targets=["status","turn","wins"].map(id=>doc.getElementById(id)).filter(Boolean);
      const observer=new MutationObserver(()=>syncContent(doc));
      for(const target of targets)observer.observe(target,{childList:true,characterData:true,subtree:true});
      observers.set(doc,observer);
    }
    syncContent(doc);
  }catch(_){
    // If browser isolation prevents iframe access, retain native game rendering.
  }
}
function watch(frame){
  if(!isChess(frame)||watched.has(frame))return;
  watched.add(frame);
  frame.addEventListener("load",()=>install(frame));
  install(frame);
}
function refresh(){
  for(const frame of gameHost.querySelectorAll("iframe"))install(frame);
}
function scan(){
  for(const frame of gameHost.querySelectorAll("iframe"))watch(frame);
}
new MutationObserver(scan).observe(gameHost,{childList:true,subtree:false});
new MutationObserver(refresh).observe(root,{attributes:true,attributeFilter:["data-screen"]});
new MutationObserver(refresh).observe(gamesPane,{attributes:true,attributeFilter:["class","hidden"]});
window.addEventListener("resize",refresh,{passive:true});
scan();
})();