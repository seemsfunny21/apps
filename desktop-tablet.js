/* Auto-fit desktop/tablet viewport. Iframe DOM nodes and application state remain mounted. */
(() => {
"use strict";
const dashboard=document.querySelector("body.desktop-premium > .dashboard");
const actions=document.querySelector(".desktop-top-actions");
if(!dashboard||!actions)return;

const key="apps-tablet-scale-v1";
const isDesktop=()=>window.innerWidth>=900;
let saved={};
try {saved=JSON.parse(localStorage.getItem(key)||"{}")||{};} catch (_) {}
const state={
  mode:saved.mode==="manual"?"manual":"auto",
  value:Number.isFinite(Number(saved.value))?Math.min(2.6,Math.max(1,Number(saved.value))):1.45
};
const clamp=(v,low,high)=>Math.min(high,Math.max(low,v));
function persist(){
  try{localStorage.setItem(key,JSON.stringify(state));}catch(_){}
}
const control=document.createElement("div");
control.className="tablet-zoom-control";
control.setAttribute("role","group");
control.setAttribute("aria-label","Μέγεθος εφαρμογής στην οθόνη");
control.innerHTML=[
  '<button type="button" data-tablet-zoom="down" title="Μικρότερη εφαρμογή" aria-label="Σμίκρυνση εφαρμογής">−</button>',
  '<output class="tablet-zoom-value" id="tabletZoomOutput" aria-live="polite">100%</output>',
  '<button type="button" data-tablet-zoom="up" title="Μεγαλύτερη εφαρμογή" aria-label="Μεγέθυνση εφαρμογής">+</button>',
  '<button type="button" data-tablet-zoom="auto" title="Αυτόματη προσαρμογή ανάλυσης" aria-label="Αυτόματη κλίμακα" aria-pressed="true">Auto</button>'
].join("");
const focus=document.getElementById("desktopFocus");
if(focus)actions.insertBefore(control,focus);
else actions.appendChild(control);
const output=document.getElementById("tabletZoomOutput");
const autoButton=control.querySelector('[data-tablet-zoom="auto"]');
const watched=new WeakSet();
let scheduled=0;
let currentScale=1;

function getFrameContainer(){
  return dashboard.querySelector(".pane.is-selected .pane-frame");
}
function autoScale(){
  const panel=getFrameContainer();
  if(!panel)return 1;
  const outerWidth=window.innerWidth;
  const drawableWidth=panel.clientWidth||Math.max(900,outerWidth-110);
  // CSS pixels, not claimed physical TV inches.
  const viewportBased=1.15+(Math.max(0,outerWidth-1100)*.00052);
  const responsiveLimit=drawableWidth/900;
  return clamp(Math.min(viewportBased,Math.max(1,responsiveLimit)),1,2.4);
}
function fittedScale(){
  if(!isDesktop())return 1;
  return state.mode==="auto"?autoScale():clamp(state.value,1,2.6);
}
function updateAll(){
  scheduled=0;
  currentScale=fittedScale();
  const single=document.body.dataset.screen==="single";
  const selected=dashboard.querySelector(".pane.is-selected");
  const allFrames=dashboard.querySelectorAll(".pane-frame iframe");
  for(const frame of allFrames){
    const pane=frame.closest(".pane");
    const scale=single && selected===pane && isDesktop() ?currentScale:1;
    const pct=(100/scale).toFixed(5)+"%";
    frame.style.width=pct;
    frame.style.height=pct;
    frame.style.transform=scale===1?"none":"scale("+scale.toFixed(4)+")";
    frame.style.transformOrigin="top left";
  }
  output.textContent=Math.round(currentScale*100)+"%";
  output.title=state.mode==="auto"?"Αυτόματο "+output.textContent:"Χειροκίνητο "+output.textContent;
  autoButton.setAttribute("aria-pressed",state.mode==="auto"?"true":"false");
  control.title=state.mode==="auto"?"Αυτόματη κλίμακα σύμφωνα με την ανάλυση":"Χειροκίνητη κλίμακα οθόνης";
}
function schedule(){
  if(scheduled)return;
  scheduled=requestAnimationFrame(updateAll);
}
control.addEventListener("click",event=>{
  const button=event.target.closest("[data-tablet-zoom]");
  if(!button)return;
  const action=button.dataset.tabletZoom;
  if(action==="auto"){
    state.mode="auto";
  }else{
    const current=state.mode==="auto"?autoScale():state.value;
    state.mode="manual";
    state.value=Math.round(clamp(current+(action==="up"?.10:-.10),1,2.6)*100)/100;
  }
  persist();schedule();
});
function watchFrame(frame){
  if(watched.has(frame))return;
  watched.add(frame);
  frame.addEventListener("load",schedule);
  schedule();
}
dashboard.querySelectorAll("iframe").forEach(watchFrame);
const gameHost=document.getElementById("gamesFrame");
if(gameHost){
  new MutationObserver(()=>gameHost.querySelectorAll("iframe").forEach(watchFrame))
    .observe(gameHost,{childList:true,subtree:true});
}
const geometryObserver=new ResizeObserver(schedule);
dashboard.querySelectorAll(".pane-frame").forEach(x=>geometryObserver.observe(x));
new MutationObserver(schedule).observe(document.body,{
  attributes:true,
  attributeFilter:["data-screen","data-focus","data-count","data-sidebar"]
});
dashboard.addEventListener("click",schedule);
document.querySelector(".desktop-sidebar")?.addEventListener("click",schedule);
window.addEventListener("resize",schedule,{passive:true});
window.visualViewport?.addEventListener("resize",schedule,{passive:true});
schedule();
})();