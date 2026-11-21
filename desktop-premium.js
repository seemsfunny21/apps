/* Apps Desktop Premium — keeps every existing iframe mounted, switches visibility only. */
(() => {
"use strict";
const APPLICATIONS=[
  {id:"douleia",name:"Δρομολόγια",detail:"Οδηγοί, δρομολόγια και στατιστικά"},
  {id:"voltes",name:"Ποδηλασία",detail:"Διαδρομές, μέλη και σέρβις"},
  {id:"reminder",name:"Υπενθυμίσεις",detail:"Όλες οι υπενθυμίσεις σου"},
  {id:"parking",name:"Parking",detail:"Αποθηκευμένες θέσεις"},
  {id:"kairos",name:"Καιρός",detail:"Πρόγνωση και συνθήκες"},
  {id:"games",name:"Παιχνίδια",detail:"Επιλογή παιχνιδιών"}
];
const ids=APPLICATIONS.map(a=>a.id);
const storeKey="apps-desktop-premium-v1";
const oldStoreKey="apps-desktop-workspace-v1";
const compactStyleId="desktop-premium-banner-size";
const compactRules={
  voltes:".hero-scene{max-height:70px!important;height:70px!important;object-fit:cover!important;}",
  douleia:".routes-hero-art{max-height:65px!important;height:65px!important;object-fit:cover!important;}",
  reminder:".reminder-hero-art{max-height:65px!important;height:65px!important;object-fit:cover!important;}",
  parking:".parking-hero-art{max-height:65px!important;height:65px!important;object-fit:cover!important;}",
  kairos:".suite-banner{max-height:65px!important;height:65px!important;}",
  games:".suite-game-banner{max-height:65px!important;height:65px!important;}"
};
const $=id=>document.getElementById(id);
const dashboard=document.querySelector("body > .dashboard");
if(!dashboard)return;
const paneById=Object.fromEntries(APPLICATIONS.map(app=>[app.id,$("pane-"+app.id)]));
if(APPLICATIONS.some(app=>!paneById[app.id]))return;
const iconMarkup=id=>{
  const icon=paneById[id].querySelector(".pane-symbol svg");
  return icon?icon.outerHTML:"";
};
function loadState(){
  let saved=null;
  try{saved=JSON.parse(localStorage.getItem(storeKey)||"null");}catch(_){}
  if(saved&&typeof saved==="object"){
    const order=Array.isArray(saved.order)&&saved.order.length===6&&new Set(saved.order).size===6&&ids.every(id=>saved.order.includes(id))?saved.order.slice():ids.slice();
    return {
      active:ids.includes(saved.active)?saved.active:"douleia",
      overviewCount:[2,4,6].includes(saved.overviewCount)?saved.overviewCount:6,
      sidebar:saved.sidebar==="collapsed"?"collapsed":"expanded",
      compact:saved.compact===true,
      order
    };
  }
  let previous=null;
  try{previous=JSON.parse(localStorage.getItem(oldStoreKey)||"null");}catch(_){}
  const order=Array.isArray(previous?.order)&&previous.order.length===6&&new Set(previous.order).size===6&&ids.every(id=>previous.order.includes(id))?previous.order.slice():ids.slice();
  return {active:order[0],overviewCount:6,sidebar:"expanded",compact:false,order};
}
const state=loadState();
// Old compact-banner and zoom controls are superseded by TV/PC responsive profiles.
state.compact=false;
let screen="single",focus=false;
function persist(){
  try{localStorage.setItem(storeKey,JSON.stringify(state));}catch(_){}
}
const side=document.createElement("aside");
side.className="desktop-sidebar";
side.setAttribute("aria-label","Πλοήγηση εφαρμογών");
side.innerHTML=[
  '<div class="desktop-brand"><div class="desktop-logo" aria-hidden="true">',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
  '<rect x="2.5" y="2.5" width="8" height="8" rx="1.5"/><rect x="13.5" y="2.5" width="8" height="8" rx="1.5"/>',
  '<rect x="2.5" y="13.5" width="8" height="8" rx="1.5"/><rect x="13.5" y="13.5" width="8" height="8" rx="1.5"/>',
  '</svg></div><div class="desktop-brand-copy"><strong>MY APPS</strong><small>DESKTOP PREMIUM</small></div></div>',
  '<div class="desktop-nav-label">Οι εφαρμογές μου</div>',
  '<nav class="desktop-nav" aria-label="Επιλογή εφαρμογής">',
  APPLICATIONS.map(a=>'<button type="button" class="desktop-navbutton" data-select-app="'+a.id+'" title="'+a.name+'">'+
     iconMarkup(a.id)+'<span class="desktop-nav-text">'+a.name+'</span></button>').join(""),
  '</nav>',
  '<div class="desktop-side-bottom"><div class="desktop-side-divider"></div>',
  '<div class="desktop-sidefoot-label">Εργαλεία</div>',
  '<button class="desktop-overview" id="desktopOverview" type="button" title="Επισκόπηση όλων των εφαρμογών">',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="3" width="8.5" height="8" rx="1.4"/><rect x="13" y="3" width="8.5" height="8" rx="1.4"/><rect x="2.5" y="13" width="8.5" height="8" rx="1.4"/><rect x="13" y="13" width="8.5" height="8" rx="1.4"/></svg>',
  '<span class="desktop-nav-text">Επισκόπηση</span></button>',
  '<button type="button" class="desktop-collapse" id="desktopCollapse" title="Σύμπτυξη μενού">',
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6M20 4v16"/></svg>',
  '<span class="desktop-nav-text">Σύμπτυξη μενού</span></button>',
  '<div class="desktop-side-note">Μία εφαρμογή, όλος ο χώρος.<br>Οι υπόλοιπες παραμένουν διαθέσιμες.</div>',
  '</div>'
].join("");
const bar=document.createElement("header");
bar.className="desktop-topbar";
bar.setAttribute("aria-label","Γραμμή εργαλείων");
bar.innerHTML=[
  '<div class="desktop-top-appicon" id="desktopActiveIcon" aria-hidden="true"></div>',
  '<div class="desktop-heading" id="desktopHeading" title="Διπλό κλικ για εστίαση">',
  '<small id="desktopEyebrow">ΕΝΕΡΓΗ ΕΦΑΡΜΟΓΗ</small><strong id="desktopActiveTitle">Δρομολόγια</strong></div>',
  '<div class="desktop-spacer"></div>',
  '<div class="desktop-top-actions">',
  '<button class="desktop-action desktop-action-back" id="desktopGameBack" type="button" title="Πίσω στην επιλογή παιχνιδιών" hidden>',
  '<svg viewBox="0 0 24 24"><path d="m14 5-7 7 7 7M7 12h14"/></svg><span>Παιχνίδια</span></button>',
  '<div class="desktop-overview-controls" id="desktopOverviewControls" role="group" aria-label="Παράθυρα επισκόπησης" hidden>',
  '<button type="button" data-count="2" title="Δύο παράθυρα">2</button>',
  '<button type="button" data-count="4" title="Τέσσερα παράθυρα">4</button>',
  '<button type="button" data-count="6" title="Έξι παράθυρα">6</button></div>',
  '<button class="desktop-action" id="desktopCompact" type="button" aria-pressed="false" title="Εναλλαγή μικρών μπάνερ">',
  '<svg viewBox="0 0 24 24"><path d="M4 7h16M7 12h10M10 17h4"/></svg><span>Συμπαγές</span></button>',
  '<a class="desktop-action" id="desktopOpen" href="https://seemsfunny21.github.io/douleia/" target="_blank" rel="noopener noreferrer" title="Άνοιγμα σε νέα καρτέλα">',
  '<svg viewBox="0 0 24 24"><path d="M13 5h6v6M19 5l-9 9M19 13v6H5V5h6"/></svg><span>Άνοιγμα</span></a>',
  '<button class="desktop-action" id="desktopFocus" type="button" aria-pressed="false" title="Απόκρυψη μενού και μεγέθυνση">',
  '<svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/></svg><span>Εστίαση</span></button>',
  '</div>'
].join("");
dashboard.before(side,bar);
document.body.classList.add("desktop-premium");
const backButton=$("gamesBack");
const gameTitle=$("gamesTitle");
const activeTitle=$("desktopActiveTitle");
const eyebrow=$("desktopEyebrow");
const topIcon=$("desktopActiveIcon");
const compactButton=$("desktopCompact");
const gameBackTop=$("desktopGameBack");
const topOpen=$("desktopOpen");
const focusButton=$("desktopFocus");
const overviewControl=$("desktopOverviewControls");
const layoutButtons=[...bar.querySelectorAll("[data-count]")];
const paneFrames=[...dashboard.querySelectorAll("iframe")];
function resetOldZoom(){
  const zoom=dashboard.querySelector(".pane.is-maximized [data-zoom]");
  if(zoom)zoom.click();
}
function syncGameHeader(){
  const activeGame=state.active==="games"&&screen==="single";
  const gameIsOpen=!!backButton&&!backButton.hidden;
  gameBackTop.hidden=!(activeGame&&gameIsOpen);
  if(activeGame){
    activeTitle.textContent=gameIsOpen?(gameTitle?.textContent||"Παιχνίδια"):"Παιχνίδια";
    topOpen.href=gameIsOpen?($("gamesOpen")?.href||"https://seemsfunny21.github.io/applications/"):"https://seemsfunny21.github.io/applications/?app=games";
  }
}
function refreshHeader(){
  if(screen==="overview"){
    activeTitle.textContent="Επισκόπηση εφαρμογών";
    eyebrow.textContent="ΠΟΛΛΑΠΛΑ ΠΑΡΑΘΥΡΑ";
    topIcon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="9" height="9" rx="1.5"/><rect x="13" y="2" width="9" height="9" rx="1.5"/><rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/></svg>';
    topOpen.href="https://seemsfunny21.github.io/applications/";
  }else{
    const app=APPLICATIONS.find(a=>a.id===state.active);
    eyebrow.textContent="ΕΝΕΡΓΗ ΕΦΑΡΜΟΓΗ";
    activeTitle.textContent=app.name;
    topIcon.innerHTML=iconMarkup(app.id);
    topOpen.href=app.id==="games"?($("gamesOpen")?.href||"https://seemsfunny21.github.io/applications/"):
      paneById[app.id].querySelector(".tool-open")?.href||"#";
  }
  syncGameHeader();
}
function applyCompactTo(frame){
  if(!(frame instanceof HTMLIFrameElement))return;
  const pane=frame.closest(".pane");
  if(!pane)return;
  const id=pane.dataset.app;
  const shouldUse=state.compact && !pane.hidden && !!compactRules[id];
  try{
    const documentInFrame=frame.contentDocument;
    if(!documentInFrame?.head)return;
    let existing=documentInFrame.getElementById(compactStyleId);
    if(!shouldUse){existing?.remove();return;}
    if(!existing){
      existing=documentInFrame.createElement("style");
      existing.id=compactStyleId;documentInFrame.head.append(existing);
    }
    existing.textContent=compactRules[id];
  }catch(_){
    // Browser isolation may restrict access; the embedded application still works.
  }
}
function applyCompact(){
  for(const iframe of dashboard.querySelectorAll("iframe"))applyCompactTo(iframe);
}
for(const frame of paneFrames){
  frame.addEventListener("load",()=>applyCompactTo(frame));
}
const gameFrameHost=$("gamesFrame");
if(gameFrameHost){
  const observer=new MutationObserver(()=>{
    for(const frame of gameFrameHost.querySelectorAll("iframe")){
      if(frame.dataset.desktopPremiumWatch)return;
      frame.dataset.desktopPremiumWatch="1";
      frame.addEventListener("load",()=>applyCompactTo(frame));
      applyCompactTo(frame);
    }
  });
  observer.observe(gameFrameHost,{childList:true});
}
function save(){
  try{localStorage.setItem(storeKey,JSON.stringify(state));}catch(_){}
}
function render(){
  document.body.dataset.screen=screen;
  document.body.dataset.count=String(state.overviewCount);
  document.body.dataset.sidebar=state.sidebar;
  document.body.dataset.focus=focus?"true":"false";
  document.body.dataset.compact=state.compact?"true":"false";
  // No iframe or pane node is ever reparented: only grid order and visibility change.
  for(const [id,pane] of Object.entries(paneById)){
    const index=state.order.indexOf(id);
    pane.style.order=String(index);
    const visible=screen==="single"?id===state.active:index<state.overviewCount;
    pane.hidden=!visible;
    pane.classList.toggle("is-selected",screen==="single"&&id===state.active);
  }
  for(const button of side.querySelectorAll("[data-select-app]")){
    if(screen==="single"&&button.dataset.selectApp===state.active)button.setAttribute("aria-current","page");
    else button.removeAttribute("aria-current");
  }
  if(screen==="overview")$("desktopOverview").setAttribute("aria-current","page");
  else $("desktopOverview").removeAttribute("aria-current");
  overviewControl.hidden=screen!=="overview";
  for(const button of layoutButtons)button.setAttribute("aria-pressed",Number(button.dataset.count)===state.overviewCount?"true":"false");
  compactButton.setAttribute("aria-pressed",state.compact?"true":"false");
  focusButton.setAttribute("aria-pressed",focus?"true":"false");
  const collapse=$("desktopCollapse");
  collapse.title=state.sidebar==="collapsed"?"Άνοιγμα μενού":"Σύμπτυξη μενού";
  collapse.setAttribute("aria-label",collapse.title);
  refreshHeader();applyCompact();save();
}
function activate(id){
  if(!paneById[id])return;
  resetOldZoom();
  // Selecting Games from the sidebar always returns to the complete game list.
  if(id==="games"){
    const gameBack=$("gamesBack");
    if(gameBack&&!gameBack.hidden)gameBack.click();
  }
  state.active=id;screen="single";render();
}
for(const button of side.querySelectorAll("[data-select-app]")){
  button.addEventListener("click",()=>activate(button.dataset.selectApp));
}
$("desktopOverview").addEventListener("click",()=>{
  resetOldZoom();
  screen=screen==="overview"?"single":"overview";
  render();
});
$("desktopCollapse").addEventListener("click",()=>{
  state.sidebar=state.sidebar==="collapsed"?"expanded":"collapsed";
  render();
});
for(const button of layoutButtons)button.addEventListener("click",()=>{
  state.overviewCount=Number(button.dataset.count);
  render();
});
compactButton.addEventListener("click",()=>{
  state.compact=!state.compact;
  render();
});
focusButton.addEventListener("click",()=>{
  focus=!focus;render();
});
$("desktopHeading").addEventListener("dblclick",()=>{
  if(screen!=="single")return;
  focus=!focus;render();
});
gameBackTop.addEventListener("click",()=>{
  backButton?.click();
  syncGameHeader();
});
if(backButton&&gameTitle){
  const observer=new MutationObserver(()=>{if(screen==="single"&&state.active==="games")syncGameHeader();});
  observer.observe(backButton,{attributes:true,attributeFilter:["hidden"]});
  observer.observe(gameTitle,{childList:true,characterData:true,subtree:true});
}
for(const [id,pane] of Object.entries(paneById)){
  pane.querySelector(".pane-bar")?.addEventListener("dblclick",event=>{
    if(screen!=="overview"||event.target.closest("button,a,select"))return;
    activate(id);
  });
}
document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    if(focus){focus=false;render();}
    else if(screen==="overview"){screen="single";render();}
  }
  if((event.ctrlKey||event.metaKey)&&event.key>="1"&&event.key<="6"&&!event.altKey){
    // Use Ctrl+Alt+digit only to avoid overriding browser tab shortcuts.
  }
});
render();
})();