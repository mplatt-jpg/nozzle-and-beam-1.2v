const SEASON_MAX=530;
const TOKEN_POINTS=[0,10,15,25,35,50,50];
const KEY='glow-sheet-v3-exact';
const RUNS_KEY='glow-sheet-runs-v3-exact';
const ROUTINE_KEY='glow-sheet-routine-v3';
const NOTES_KEY='glow-sheet-notes-v3';

const MISSIONS=[
{id:'m01',num:'01',name:'Drone Survey',zone:'field',max:30,summary:'Launch the drone so it is no longer touching the mat. Bonus if the LiDAR map is completely flipped and the scan marker is at least partly in the survey area.',lines:['Drone off the mat — 20','LiDAR map bonus — 10']},
{id:'m02',num:'02',name:'Exploding Seeds',zone:'field',max:30,summary:'Release the seeds from the pod. Each seed no longer touching the stalk scores.',lines:['Each seed off the stalk — 10','Three seeds on the model']},
{id:'m03',num:'03',name:'Flip the Rock',zone:'field',max:30,summary:'Knock the research flag down. Bonus when the rock is back in its original starting position.',lines:['Research flag down — 20','Rock returned — 10']},
{id:'m04',num:'04',name:'Lucky Leaves',zone:'field',max:30,summary:'Remove leaves from the nest without disturbing the katydid. If the katydid is completely outside the leaf habitat at the end, the mission scores zero.',lines:['One leaf off the nest — 10','Second leaf off, katydid still at the start — 20 added','Katydid outside the habitat at the end — mission is 0']},
{id:'m05',num:'05',name:'Reaching Roots',zone:'field',max:20,summary:'Extend the plant root across the forest boundary. Partial and full cannot both score.',lines:['Partially extended — 10','Completely extended — 20']},
{id:'m06',num:'06',name:'Leafcutter Frenzy',zone:'field',max:40,summary:'The ant must be touching the nest, and the leaf fragments must be contained in it. Each fragment scores only when the ant is home.',lines:['Each fragment in the nest, ant touching it — 10','Four fragments — 40']},
{id:'m07',num:'07',name:'Humongous Fungus',zone:'field',max:40,summary:"Extend your mycelium. Each connection to an opposing team's fully extended plant root is a bonus. No opposing team (or a remote match) means no connection bonus.",lines:['Mycelium completely extended — 20','Each connection — 10','Up to two connections']},
{id:'m08',num:'08',name:'Tangled',zone:'field',max:30,summary:'Untangle the vine so it is touching the mat.',lines:['Vine touching the mat — 30']},
{id:'m09',num:'09',name:'Research Platform',zone:'field',max:30,summary:'Raise the platform, deploy the camera trap, and get the seed off the tree. That seed can be planted in mission 14.',lines:['Platform raised — 10','Camera trap deployed — 10','Seed off the tree — 10']},
{id:'m10',num:'10',name:'Fragile Microhabitats',zone:'field',max:20,summary:'Leave the spider and snail habitats in their original starting positions. They begin the match scoring.',lines:['Spider habitat untouched — 10','Snail habitat untouched — 10']},
{id:'m11',num:'11',name:'Window to the Past',zone:'field',max:20,summary:'Open the root window so the cover is down and touching the mat.',lines:['Root cover down, touching the mat — 20']},
{id:'m12',num:'12',name:'Forest Elder',zone:'field',max:30,summary:'Raise the cane so it touches the tree, and put the support tie around the post.',lines:['Cane raised, touching the tree — 20','Support tie around the post — 10']},
{id:'m13',num:'13',name:'Keystone Species',zone:'dock',max:30,summary:'Your built keystone species is on the restoration platform and the young trees are raised. The species counts as equipment at inspection.',lines:['Species on the platform and young trees raised — 30']},
{id:'m14',num:'14',name:'Seeds of Renewal',zone:'dock',max:40,summary:'Plant seeds in the replantation station. There are four field seeds (three from the pod, one from the research tree). Bonus if a planted seed is also touching the mat.',lines:['Each seed contained in the station — 5','Each of those also touching the mat — 5']},
{id:'m15',num:'15',name:'Biocentric Architecture',zone:'dock',max:40,summary:"Raise the nesting canopy, slide the garden skylight completely in, and open the compost hatch onto the mat. One environmental bonus, for the dock's greatest need.",lines:['Nesting canopy raised — 10','Garden skylight completely in — 10','Compost hatch open, touching the mat — 10','Dock bonus — 10 (mine: canopy, city: skylight, farm: hatch)']},
];

function emptyDraft(){return{drone:false,lidar:false,seedsOff:0,flag:false,rock:false,leafOne:false,leafTwo:false,katydidOut:false,root:0,ant:false,fragments:0,mycelium:false,links:0,vine:false,platform:false,camera:false,treeSeed:false,spider:true,snail:true,cover:false,cane:false,tie:false,keystone:false,planted:0,onMat:0,canopy:false,skylight:false,hatch:false,dock:'mine',tokens:6,oneLaunch:false}}
function clamp(n,min,max){if(!Number.isFinite(n))return min;return Math.min(max,Math.max(min,Math.round(n)))}
function normalize(raw){const planted=clamp(raw.planted,0,4);const root=raw.root===2?2:raw.root===1?1:0;const dock=raw.dock==='city'||raw.dock==='farm'?raw.dock:'mine';return{...raw,seedsOff:clamp(raw.seedsOff,0,3),fragments:clamp(raw.fragments,0,4),links:clamp(raw.links,0,2),planted,onMat:clamp(raw.onMat,0,planted),tokens:clamp(raw.tokens,0,6),root,dock}}
function patchDraft(current,partial){const next={...current,...partial};if(partial.lidar)next.drone=true;if(partial.drone===false)next.lidar=false;if(partial.rock)next.flag=true;if(partial.flag===false)next.rock=false;if(partial.leafTwo)next.leafOne=true;if(partial.leafOne===false)next.leafTwo=false;if(partial.links!==undefined&&partial.links>0)next.mycelium=true;if(partial.mycelium===false)next.links=0;if(partial.fragments!==undefined&&partial.fragments>0)next.ant=true;if(partial.onMat!==undefined&&next.onMat>next.planted)next.planted=next.onMat;if(partial.planted!==undefined&&next.onMat>next.planted)next.onMat=next.planted;return normalize(next)}
function missionPoints(raw){const d=normalize(raw);const points={m01:(d.drone?20:0)+(d.drone&&d.lidar?10:0),m02:d.seedsOff*10,m03:(d.flag?20:0)+(d.flag&&d.rock?10:0),m04:d.katydidOut?0:d.leafTwo?30:d.leafOne?10:0,m05:d.root===2?20:d.root===1?10:0,m06:d.ant?d.fragments*10:0,m07:d.mycelium?20+d.links*10:0,m08:d.vine?30:0,m09:(d.platform?10:0)+(d.camera?10:0)+(d.treeSeed?10:0),m10:(d.spider?10:0)+(d.snail?10:0),m11:d.cover?20:0,m12:(d.cane?20:0)+(d.tie?10:0),m13:d.keystone?30:0,m14:d.planted*5+d.onMat*5,m15:(d.canopy?10:0)+(d.skylight?10:0)+(d.hatch?10:0)+((d.dock==='mine'&&d.canopy)||(d.dock==='city'&&d.skylight)||(d.dock==='farm'&&d.hatch)?10:0)};return MISSIONS.map(m=>({id:m.id,num:m.num,name:m.name,points:points[m.id],max:m.max}))}
function tokenPoints(raw){return TOKEN_POINTS[normalize(raw).tokens]}
function inspectionPoints(raw){return normalize(raw).oneLaunch?20:0}
function totalPoints(raw){return missionPoints(raw).reduce((s,m)=>s+m.points,0)+tokenPoints(raw)+inspectionPoints(raw)}

let draft=emptyDraft(),teamName='',filter='all',remain=150,running=false,timerId=0;
let routine={};let notes={};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.draft){draft=normalize(s.draft);teamName=s.teamName||''}}catch(e){}
try{routine=JSON.parse(localStorage.getItem(ROUTINE_KEY)||'{}')}catch(e){}
try{notes=JSON.parse(localStorage.getItem(NOTES_KEY)||'{}')}catch(e){}

function persist(){try{localStorage.setItem(KEY,JSON.stringify({draft,teamName,t:Date.now()}));document.getElementById('saveStatus').textContent='saved';document.getElementById('saveStatus').className='save-pill ok'}catch(e){document.getElementById('saveStatus').textContent='error';document.getElementById('saveStatus').className='save-pill err'}}
function fmt(s){const m=Math.floor(s/60),ss=s%60;return m+':'+String(ss).padStart(2,'0')}
function setDraft(p){draft=patchDraft(draft,p);persist();renderAll()}

function toggleEl(el,on){el.classList.toggle('on',!!on);el.setAttribute('aria-pressed',on?'true':'false')}

function mkToggle(label,pts,on,fn,disabled){
  const row=document.createElement('div');row.className='toggle-row';
  const left=document.createElement('div');
  left.innerHTML='<label>'+label+'</label>'+(pts!==null&&pts!==undefined?'<div class="pts">'+pts+' pts</div>':'');
  const sw=document.createElement('button');sw.type='button';sw.className='switch'+(on?' on':'');sw.innerHTML='<i></i>';
  if(disabled)sw.disabled=true;
  sw.onclick=fn;
  row.append(left,sw);return row;
}
function mkStep(label,value,max,each,fn){
  const row=document.createElement('div');row.className='toggle-row';
  const left=document.createElement('div');
  left.innerHTML='<label>'+label+'</label><div class="pts">'+(each?each+' each · ':'')+value*each+' pts</div>';
  const st=document.createElement('div');st.className='stepper';
  const minus=document.createElement('button');minus.type='button';minus.textContent='−';
  const span=document.createElement('span');span.textContent=value;
  const plus=document.createElement('button');plus.type='button';plus.textContent='+';
  minus.onclick=()=>fn(Math.max(0,value-1));
  plus.onclick=()=>fn(Math.min(max,value+1));
  st.append(minus,span,plus);row.append(left,st);return row;
}
function mkChoice(label,value,options,fn){
  const wrap=document.createElement('div');wrap.style.padding='8px 4px';
  wrap.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:8px">'+label+'</div>';
  const row=document.createElement('div');row.className='choice';
  options.forEach(o=>{
    const b=document.createElement('button');b.type='button';b.className=value===o.value?'on':'';
    b.textContent=o.title+(o.detail?' · '+o.detail:'');
    b.onclick=()=>fn(o.value);row.appendChild(b);
  });
  wrap.appendChild(row);return wrap;
}

function controls(id){
  const d=draft;const box=document.createElement('div');
  if(id==='m01'){box.append(mkToggle('Drone is off the mat',20,d.drone,()=>setDraft({drone:!d.drone})),mkToggle('LiDAR map flipped, marker in the survey area',10,d.lidar,()=>setDraft({lidar:!d.lidar})))}
  else if(id==='m02'){box.append(mkStep('Seeds off the stalk',d.seedsOff,3,10,v=>setDraft({seedsOff:v})))}
  else if(id==='m03'){box.append(mkToggle('Research flag is down',20,d.flag,()=>setDraft({flag:!d.flag})),mkToggle('Rock is back where it started',10,d.rock,()=>setDraft({rock:!d.rock})))}
  else if(id==='m04'){box.append(mkToggle('One leaf completely off the nest',10,d.leafOne,()=>setDraft({leafOne:!d.leafOne}),d.katydidOut),mkToggle('Second leaf off, katydid still at the start',20,d.leafTwo,()=>setDraft({leafTwo:!d.leafTwo}),d.katydidOut),mkToggle('Katydid left the leaf habitat — scores 0',0,d.katydidOut,()=>setDraft({katydidOut:!d.katydidOut})))}
  else if(id==='m05'){box.append(mkChoice('Plant root',d.root,[{value:0,title:'Not out'},{value:1,title:'Partial',detail:'10'},{value:2,title:'Full',detail:'20'}],v=>setDraft({root:v})))}
  else if(id==='m06'){box.append(mkToggle('Ant is touching the nest',null,d.ant,()=>setDraft({ant:!d.ant})),mkStep('Leaf fragments contained',d.fragments,4,d.ant?10:0,v=>setDraft({fragments:v}));if(!d.ant&&d.fragments>0){const h=document.createElement('p');h.className='hint';h.textContent='Fragments only count with the ant in the nest.';box.appendChild(h)}}
  else if(id==='m07'){box.append(mkToggle('Mycelium completely extended',20,d.mycelium,()=>setDraft({mycelium:!d.mycelium})),mkStep('Connections to opposing roots',d.links,2,10,v=>setDraft({links:v})))}
  else if(id==='m08'){box.append(mkToggle('Vine is touching the mat',30,d.vine,()=>setDraft({vine:!d.vine})))}
  else if(id==='m09'){box.append(mkToggle('Platform is raised',10,d.platform,()=>setDraft({platform:!d.platform})),mkToggle('Camera trap is deployed',10,d.camera,()=>setDraft({camera:!d.camera})),mkToggle('Seed is off the tree',10,d.treeSeed,()=>setDraft({treeSeed:!d.treeSeed})))}
  else if(id==='m10'){box.append(mkToggle('Spider habitat still in place',10,d.spider,()=>setDraft({spider:!d.spider})),mkToggle('Snail habitat still in place',10,d.snail,()=>setDraft({snail:!d.snail})))}
  else if(id==='m11'){box.append(mkToggle('Root cover is down, touching the mat',20,d.cover,()=>setDraft({cover:!d.cover})))}
  else if(id==='m12'){box.append(mkToggle('Cane raised, touching the tree',20,d.cane,()=>setDraft({cane:!d.cane})),mkToggle('Support tie around the post',10,d.tie,()=>setDraft({tie:!d.tie})))}
  else if(id==='m13'){box.append(mkToggle('Keystone species on the platform, young trees raised',30,d.keystone,()=>setDraft({keystone:!d.keystone})))}
  else if(id==='m14'){box.append(mkStep('Seeds contained in the station',d.planted,4,5,v=>setDraft({planted:v})),mkStep('Those seeds also touching the mat',d.onMat,4,5,v=>setDraft({onMat:v})))}
  else if(id==='m15'){box.append(mkToggle('Nesting canopy raised',10,d.canopy,()=>setDraft({canopy:!d.canopy})),mkToggle('Garden skylight completely in',10,d.skylight,()=>setDraft({skylight:!d.skylight})),mkToggle('Compost hatch open, touching the mat',10,d.hatch,()=>setDraft({hatch:!d.hatch})))}
  return box;
}

function renderMissions(){
  const scores=missionPoints(draft);
  const host=document.getElementById('missionHost');host.innerHTML='';
  [['Field','field'],['Docks','dock']].forEach(([title,zone])=>{
    const list=MISSIONS.filter(m=>{
      if(m.zone!==zone)return false;
      const s=scores.find(x=>x.id===m.id);
      if(filter==='open'&&s.points>0)return false;
      if(filter==='scored'&&s.points===0)return false;
      return true;
    });
    if(!list.length)return;
    const sec=document.createElement('section');sec.className='section';sec.style.marginTop='14px';
    sec.innerHTML='<h2 class="section-title">'+title+'</h2>';
    const grid=document.createElement('div');grid.className='mission-grid';
    list.forEach(m=>{
      const s=scores.find(x=>x.id===m.id);
      const art=document.createElement('article');art.className='mission';
      art.innerHTML='<header><h3 class="name"><span class="num">'+m.num+'</span>'+m.name+'</h3><p class="score"><span class="amber">'+s.points+'</span><span class="muted">/'+s.max+'</span>'+(s.points===s.max?'<span class="max-tag">MAX</span>':'')+'</p></header>';
      art.appendChild(controls(m.id));
      grid.appendChild(art);
    });
    sec.appendChild(grid);host.appendChild(sec);
  });
}

function renderTokens(){
  const g=document.getElementById('tokenGrid');g.innerHTML='';
  TOKEN_POINTS.forEach((p,count)=>{
    const b=document.createElement('button');b.type='button';b.className=draft.tokens===count?'on':'';
    b.innerHTML='<span class="n">'+count+'</span><span class="p">'+p+'</span>';
    b.onclick=()=>setDraft({tokens:count});g.appendChild(b);
  });
}
function renderDock(){
  const row=document.getElementById('dockRow');row.innerHTML='';
  [['mine','Mine'],['city','City'],['farm','Farm']].forEach(([id,label])=>{
    const b=document.createElement('button');b.type='button';
    b.style.cssText='min-height:40px;padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:'+(draft.dock===id?'var(--mint)':'var(--raised)')+';color:'+(draft.dock===id?'var(--mint-ink)':'var(--fg)')+';font-weight:600';
    b.textContent=label;b.onclick=()=>setDraft({dock:id});row.appendChild(b);
  });
}
function renderTotals(){
  const t=totalPoints(draft);const ms=missionPoints(draft).reduce((s,m)=>s+m.points,0);
  const pct=Math.round((t/SEASON_MAX)*100);
  document.getElementById('totalPts').textContent=t;
  document.getElementById('pct').textContent=pct;
  document.getElementById('pctBar').style.width=Math.min(100,pct)+'%';
  document.getElementById('breakout').textContent=ms+' · '+tokenPoints(draft)+' · '+inspectionPoints(draft);
  document.getElementById('clock').textContent=fmt(remain);
}
function loadRuns(){try{return JSON.parse(localStorage.getItem(RUNS_KEY)||'[]')}catch(e){return[]}}
function saveRuns(list){try{localStorage.setItem(RUNS_KEY,JSON.stringify(list.slice(0,40)))}catch(e){}}
function when(at){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(at)}
function renderRuns(){
  const list=loadRuns();const host=document.getElementById('runsList');const empty=document.getElementById('runsEmpty');
  host.innerHTML='';empty.hidden=list.length>0;
  list.forEach((r,i)=>{
    const el=document.createElement('div');el.className='run';
    el.innerHTML='<div><div class="pts">'+r.total+'</div><div class="meta">'+(r.team||'Team')+' · '+when(r.t)+'</div></div>';
    const actions=document.createElement('div');actions.className='run-actions';
    const load=document.createElement('button');load.type='button';load.className='btn';load.textContent='Load';
    load.onclick=()=>{draft=normalize(r.draft);teamName=r.team||'';document.getElementById('teamName').value=teamName;persist();renderAll();document.querySelector('[data-tab=score]').click()};
    const del=document.createElement('button');del.type='button';del.className='btn';del.textContent='Delete';
    del.onclick=()=>{const n=loadRuns();n.splice(i,1);saveRuns(n);renderRuns()};
    actions.append(load,del);el.appendChild(actions);host.appendChild(el);
  });
}
function renderGuide(){
  const host=document.getElementById('missionGuide');host.innerHTML='';
  const runs=loadRuns();
  MISSIONS.forEach(m=>{
    const art=document.createElement('article');
    let best=0,count=0;
    runs.forEach(r=>{const s=missionPoints(r.draft).find(x=>x.id===m.id);if(s&&s.points>0){count++;best=Math.max(best,s.points)}});
    const on=!!routine[m.id];
    art.innerHTML='<div class="title"><span style="color:var(--mint)">'+m.num+'</span> '+m.name+'</div><p style="margin:2px 0;font-size:12px;color:var(--amber)">max '+m.max+'</p><p class="summary">'+m.summary+'</p><ul>'+m.lines.map(l=>'<li>'+l+'</li>').join('')+'</ul><p style="margin:8px 0 0;font-size:12px;color:var(--muted)">'+(count?('Best '+best+' · scored in '+count+' run'+(count===1?'':'s')+'.'):'Not scored in a saved run yet.')+'</p>';
    const cb=document.createElement('button');cb.type='button';cb.className='check-btn'+(on?' on':'');
    cb.innerHTML='<span class="check-box">'+(on?'✓':'')+'</span>'+(on?'Checked off — we can do this':'Check off this mission');
    cb.onclick=()=>{routine[m.id]=!routine[m.id];try{localStorage.setItem(ROUTINE_KEY,JSON.stringify(routine))}catch(e){}renderGuide()};
    art.appendChild(cb);
    const lab=document.createElement('label');lab.className='note';
    lab.innerHTML='<span style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.06em">TEAM NOTE</span>';
    const inp=document.createElement('input');inp.value=notes[m.id]||'';inp.placeholder='Attachment, launch area, what still fails';inp.maxLength=140;
    inp.oninput=()=>{notes[m.id]=inp.value;try{localStorage.setItem(NOTES_KEY,JSON.stringify(notes))}catch(e){}};
    lab.appendChild(inp);art.appendChild(lab);host.appendChild(art);
  });
}
function renderAll(){
  document.getElementById('teamName').value=teamName;
  toggleEl(document.getElementById('oneLaunch'),draft.oneLaunch);
  renderTokens();renderDock();renderMissions();renderTotals();
}

document.getElementById('teamName').addEventListener('input',e=>{teamName=e.target.value.slice(0,40);persist()});
document.getElementById('oneLaunch').onclick=()=>setDraft({oneLaunch:!draft.oneLaunch});
document.getElementById('filters').onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;filter=b.dataset.f;[...document.getElementById('filters').children].forEach(c=>c.classList.toggle('on',c.dataset.f===filter));renderMissions()};
document.querySelectorAll('[data-tab]').forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b===btn));
    document.getElementById('tab-score').hidden=btn.dataset.tab!=='score';
    document.getElementById('tab-runs').hidden=btn.dataset.tab!=='runs';
    document.getElementById('tab-missions').hidden=btn.dataset.tab!=='missions';
    if(btn.dataset.tab==='runs')renderRuns();
    if(btn.dataset.tab==='missions')renderGuide();
  };
});
document.getElementById('saveRun').onclick=()=>{const list=loadRuns();list.unshift({t:Date.now(),team:teamName,total:totalPoints(draft),draft:{...draft}});saveRuns(list);document.getElementById('saveStatus').textContent='run saved';document.getElementById('saveStatus').className='save-pill ok'};
document.getElementById('resetDraft').onclick=()=>{if(confirm('Reset all mission toggles?')){draft=emptyDraft();persist();renderAll()}};
document.getElementById('btnPlay').onclick=()=>{
  running=!running;document.getElementById('btnPlay').textContent=running?'⏸':'▶';
  if(running){if(remain===0)remain=150;timerId=setInterval(()=>{if(remain<=1){remain=0;running=false;document.getElementById('btnPlay').textContent='▶';clearInterval(timerId)}else remain--;document.getElementById('clock').textContent=fmt(remain)},1000)}
  else clearInterval(timerId);
};
document.getElementById('btnReset').onclick=()=>{running=false;clearInterval(timerId);remain=150;document.getElementById('btnPlay').textContent='▶';document.getElementById('clock').textContent=fmt(remain)};
renderAll();
