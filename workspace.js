/* Desktop workspace: existing iframes remain mounted; only CSS grid order changes. */
(() => {
"use strict";
const APPS=[
{id:"douleia",name:"Δρομολόγια",icon:"🚚"},
{id:"voltes",name:"Ποδηλασία",icon:"🚴"},
{id:"reminder",name:"Υπενθυμίσεις",icon:"🔔"},
{id:"parking",name:"Parking",icon:"🚗"},
{id:"kairos",name:"Καιρός",icon:"🌤️"},
{id:"games",name:"Παιχνίδια",icon:"🎮"}
];
const IDS=APPS.map(a=>a.id),SIZE={two:2,four:4,six:6};
const KEY="apps-desktop-workspace-v1",STYLE_ID="apps-desktop-compact-2026";
const COMPACT_CSS=[
"html[data-theme] .shell > header{display:none!important}",
".routes-hero-head{display:none!important}",
".premium-glass .reminder-hero-art{height:54px!important;max-height:54px!important;min-height:0!important}",
".app > .hero:has(.parking-hero-art){display:none!important}",
".suite-banner,.suite-game-banner{display:none!important}",
"body:has(.sudoku-hero-art) .hero,body:has(.reversi-hero-art) .hero{display:none!important}"
].join("\n");
const dashboard=document.querySelector(".dashboard");
if(!dashboard)return;
const panes=new Map();
for(const app of APPS){const p=document.getElementById("pane-"+app.id);if(!p)return;p.dataset.app=app.id;panes.set(app.id,p);}
function savedState(){
  try{
    const s=JSON.parse(localStorage.getItem(KEY)||"null");
    if(!s||typeof s!=="object")return null;
    const valid=Array.isArray(s.order)&&s.order.length===IDS.length&&new Set(s.order).size===IDS.length&&IDS.every(id=>s.order.includes(id));
    return {layout:Object.hasOwn(SIZE,s.layout)?s.layout:"two",order:valid?[...s.order]:[...IDS],compact:s.compact===true};
  }catch(_){return null;}
}
const state=savedState()||{layout:"two",order:[...IDS],compact:false};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}}
const toolbar=document.createElement("header");
toolbar.className="desk-toolbar";
toolbar.setAttribute("aria-label","Διαχείριση προβολής εφαρμογών");
const appButtons=APPS.map(app=>'<button type="button" data-focus-app="'+app.id+'" title="Εμφάνιση '+app.name+'" aria-label="Εμφάνιση '+app.name+'" aria-pressed="false"><span class="nav-emoji" aria-hidden="true">'+app.icon+'</span><span class="nav-text">'+app.name+'</span></button>').join("");
toolbar.innerHTML=[
'<div class="desk-brand"><span class="desk-brand-mark" aria-hidden="true">',
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">',
'<rect x="2" y="2" width="9" height="9" rx="1.5"/><rect x="13" y="2" width="9" height="9" rx="1.5"/>',
'<rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/>',
'</svg></span><span class="desk-brand-name"><strong>MY APPS</strong><small>Desktop workspace</small></span></div>',
'<nav class="desk-shortcuts" aria-label="Γρήγορη επιλογή εφαρμογής">',appButtons,'</nav>',
'<div class="desk-controls"><span class="desk-mode-label">Προβολή</span>',
'<div class="view-switch" role="group" aria-label="Πόσα παράθυρα εμφανίζονται">',
'<button type="button" data-workspace-layout="two" title="2 μεγάλα παράθυρα" aria-pressed="false">2</button>',
'<button type="button" data-workspace-layout="four" title="4 παράθυρα" aria-pressed="false">4</button>',
'<button type="button" data-workspace-layout="six" title="6 παράθυρα" aria-pressed="false">6</button>',
'</div><button class="desk-compact" type="button" id="workspaceCompact" title="Μικρότερα μπάνερ για περισσότερο χώρο" aria-pressed="false">Συμπαγές</button></div>'
].join("");
dashboard.before(toolbar);
for(const app of APPS){
  const pane=panes.get(app.id),title=pane.querySelector(".pane-name");
  if(!title)continue;
  const select=document.createElement("select");
  select.className="pane-select";select.title="Επίλεξε εφαρμογή για αυτή τη θέση";
  select.setAttribute("aria-label","Επιλογή εφαρμογής για αυτό το παράθυρο");
  for(const item of APPS){
    const option=document.createElement("option");option.value=item.id;option.textContent=item.name;
    option.selected=item.id===app.id;select.append(option);
  }
  title.prepend(select);
  select.addEventListener("change",()=>{
    const wanted=select.value,from=state.order.indexOf(app.id),to=state.order.indexOf(wanted);
    if(from!==-1&&to!==-1&&from!==to){
      [state.order[from],state.order[to]]=[state.order[to],state.order[from]];
      update();spotlight(wanted);
    }else select.value=app.id;
  });
  const bar=pane.querySelector(".pane-bar");
  if(bar){
    bar.title="Διπλό κλικ στην κεφαλίδα για μεγέθυνση ή επαναφορά";
    bar.addEventListener("dblclick",event=>{
      if(event.target.closest("button,a,select,input,label"))return;
      pane.querySelector("[data-zoom]")?.click();
    });
  }
}
function spotlight(id){
  const pane=panes.get(id);if(!pane||pane.hidden)return;
  pane.setAttribute("data-flash","true");
  pane.querySelector(".pane-select")?.focus({preventScroll:true});
  if(pane._flashTimeout)clearTimeout(pane._flashTimeout);
  pane._flashTimeout=setTimeout(()=>pane.removeAttribute("data-flash"),650);
}
function applyCompact(frame){
  if(!(frame instanceof HTMLIFrameElement))return;
  const pane=frame.closest(".pane");
  const active=!!pane&&!pane.hidden&&!pane.classList.contains("is-maximized")&&state.compact;
  try{
    const doc=frame.contentDocument;if(!doc?.head)return;
    let style=doc.getElementById(STYLE_ID);
    if(active&&!style){
      style=doc.createElement("style");style.id=STYLE_ID;style.textContent=COMPACT_CSS;doc.head.append(style);
    }else if(!active&&style)style.remove();
  }catch(_){} // Ignore cross-origin iframes; never interrupt app functionality.
}
function refreshCompact(){for(const frame of dashboard.querySelectorAll("iframe"))applyCompact(frame);}
for(const frame of dashboard.querySelectorAll("iframe"))frame.addEventListener("load",()=>applyCompact(frame));
const gamesHost=document.getElementById("gamesFrame");
if(gamesHost){
  const observer=new MutationObserver(()=>{
    for(const frame of gamesHost.querySelectorAll("iframe")){
      if(frame.dataset.workspaceWatching)continue;
      frame.dataset.workspaceWatching="true";
      frame.addEventListener("load",()=>applyCompact(frame));
      applyCompact(frame);
    }
  });
  observer.observe(gamesHost,{childList:true});
}
function update(){
  document.body.dataset.layout=state.layout;
  document.body.dataset.compact=state.compact?"true":"false";
  const activeCount=SIZE[state.layout];
  for(const [id,pane] of panes){
    const index=state.order.indexOf(id);
    pane.style.order=String(index);
    pane.hidden=index>=activeCount;
    const select=pane.querySelector(".pane-select");
    if(select){select.value=id;select.title="Αλλαγή εφαρμογής στη θέση "+(index+1);}
  }
  for(const button of toolbar.querySelectorAll("[data-workspace-layout]")){
    button.setAttribute("aria-pressed",button.dataset.workspaceLayout===state.layout?"true":"false");
  }
  toolbar.querySelector("#workspaceCompact").setAttribute("aria-pressed",state.compact?"true":"false");
  for(const button of toolbar.querySelectorAll("[data-focus-app]")){
    const visible=state.order.indexOf(button.dataset.focusApp)<activeCount;
    button.setAttribute("aria-pressed",visible?"true":"false");
    button.title=visible?"Μετάβαση στην εφαρμογή":"Εμφάνιση στην πρώτη θέση";
  }
  refreshCompact();save();
}
toolbar.addEventListener("click",event=>{
  const layoutButton=event.target.closest("[data-workspace-layout]");
  if(layoutButton){
    const layout=layoutButton.dataset.workspaceLayout;
    if(!Object.hasOwn(SIZE,layout))return;
    const maximized=dashboard.querySelector(".pane.is-maximized [data-zoom]");
    if(maximized)maximized.click();
    state.layout=layout;update();return;
  }
  if(event.target.closest("#workspaceCompact")){
    state.compact=!state.compact;update();return;
  }
  const focusButton=event.target.closest("[data-focus-app]");
  if(!focusButton)return;
  const id=focusButton.dataset.focusApp,index=state.order.indexOf(id);
  if(index<0)return;
  if(index>=SIZE[state.layout]){
    [state.order[0],state.order[index]]=[state.order[index],state.order[0]];
    update();
  }
  spotlight(id);
});
document.addEventListener("click",event=>{
  if(event.target.closest("[data-zoom]"))refreshCompact();
});
document.addEventListener("keydown",event=>{
  if(event.key==="Escape")refreshCompact();
});
update();
})();