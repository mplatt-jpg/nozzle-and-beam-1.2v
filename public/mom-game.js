const FREE_CODE="MAYHEM-FREE",KEY="mom_unlocked_v3";
const $=id=>document.getElementById(id),cv=$('c'),ctx=cv.getContext('2d');
const R=Math.random,pick=a=>a[R()*a.length|0],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function isUnlocked(){try{return sessionStorage.getItem(KEY)==='1'}catch(e){return false}}
function unlock(){try{sessionStorage.setItem(KEY,'1')}catch(e){}$('pay').classList.add('h');$('ov').classList.remove('h');roll()}
$('unlock').onclick=()=>{const v=($('code').value||'').trim().toUpperCase().replace(/\s+/g,'');if(v===FREE_CODE){unlock();return}$('err').textContent='Wrong code. Try again.';};
$('code').addEventListener('keydown',e=>{if(e.key==='Enter')$('unlock').click()});
$('paybtn').onclick=()=>{$('err').textContent='Checkout is not live yet. Use the free code for now.';};

const AN=[
{e:'🦝',n:'Trash Raccoon',spd:340,s:78,pow:1,sh:'CHITTER!',q:'Fast, sneaky, loves a dumpster.',
 world:{name:'Alley Dump',layout:'maze',ground:'#1c1814',road:'#2a241c',line:'#c4a574',curb:'rgba(196,165,116,.25)',park:'#2d4a28',
  BC:[['#8d6e63','#5d4037'],['#a1887f','#6d4c41'],['#ffb74d','#f57c00'],['#78909c','#455a64']],
  props:['🗑️','🛒','📦','🛢️','🚧','🐀'],parkP:0.08,roadW:0.55}},
{e:'🐐',n:'Menace Goat',spd:370,s:80,pow:1.2,sh:'MEHHH!',q:'Headbutts first, asks never.',
 world:{name:'Cliff Switchbacks',layout:'switchback',ground:'#1a1e24',road:'#3d4450',line:'#e8d5a3',curb:'rgba(232,213,163,.2)',park:'#3d5a3a',
  BC:[['#90a4ae','#546e7a'],['#bcaaa4','#8d6e63'],['#a5d6a7','#66bb6a'],['#ffe082','#ffb300']],
  props:['🪨','🌳','🪴','🚧','🐏'],parkP:0.22,roadW:0.7}},
{e:'🦛',n:'Hungry Hippo',spd:250,s:130,pow:1.9,sh:'HOOONK!',q:'Slow, huge, unstoppable.',
 world:{name:'Canal District',layout:'canals',ground:'#0f1a22',road:'#1e3344',line:'#4fc3f7',curb:'rgba(79,195,247,.3)',park:'#1b5e4a',
  BC:[['#4dd0e1','#0097a7'],['#80cbc4','#00897b'],['#81d4fa','#0288d1'],['#b2dfdb','#4db6ac']],
  props:['🌳','🪴','🚤','🛟','🍕'],parkP:0.28,roadW:0.85}},
{e:'🐘',n:'Big Elephant',spd:245,s:140,pow:2,sh:'TRUMPET!',q:'Walls are just suggestions.',
 world:{name:'Monument Avenue',layout:'boulevard',ground:'#141820',road:'#2a3140',line:'#ffd54f',curb:'rgba(255,213,79,.25)',park:'#2e5a3c',
  BC:[['#ce93d8','#8e24aa'],['#ef9a9a','#e53935'],['#fff59d','#fbc02d'],['#90caf9','#1e88e5']],
  props:['🌳','🏛️','🚦','🪑','🎈'],parkP:0.18,roadW:1.15}},
{e:'🦆',n:'Angry Duck',spd:330,s:70,pow:1,sh:'QUACK!!',q:'Small, furious, zero chill.',
 world:{name:'Pond Plaza',layout:'open',ground:'#121c18',road:'#243830',line:'#aed581',curb:'rgba(174,213,129,.25)',park:'#1b5e20',
  BC:[['#a5d6a7','#43a047'],['#c5e1a5','#7cb342'],['#80deea','#00acc1'],['#ffe082','#ffb300']],
  props:['🌳','🪴','🦆','🍕','🎈'],parkP:0.35,roadW:0.9}},
{e:'🐊',n:'Sewer Croc',spd:290,s:110,pow:1.5,sh:'SNAP!',q:'Climbed out of the drain, in a mood.',
 world:{name:'Undercity Drains',layout:'dense',ground:'#0c1014',road:'#1a222c',line:'#26a69a',curb:'rgba(38,166,154,.35)',park:'#1a3a32',
  BC:[['#455a64','#263238'],['#546e7a','#37474f'],['#00897b','#004d40'],['#5c6bc0','#283593']],
  props:['🛢️','🚧','🗑️','📦','🐀'],parkP:0.06,roadW:0.5}},
{e:'🦍',n:'Gorilla',spd:285,s:120,pow:1.8,sh:'OOH AAH!',q:'Chest-thump shockwaves.',
 world:{name:'Canopy Blocks',layout:'organic',ground:'#0e1610',road:'#1e2e1c',line:'#81c784',curb:'rgba(129,199,132,.28)',park:'#1b5e20',
  BC:[['#66bb6a','#2e7d32'],['#9ccc65','#558b2f'],['#a1887f','#5d4037'],['#ff8a65','#e64a19']],
  props:['🌳','🌳','🪴','🍌','🎈'],parkP:0.32,roadW:0.75}},
{e:'🐓',n:'Rage Rooster',spd:350,s:74,pow:1.1,sh:'COCK-A-DOO!',q:'Wakes up the whole city.',
 world:{name:'Farm Edge',layout:'strips',ground:'#1a1610',road:'#3e3428',line:'#ffcc80',curb:'rgba(255,204,128,.25)',park:'#558b2f',
  BC:[['#ffcc80','#fb8c00'],['#ef9a9a','#e53935'],['#a5d6a7','#43a047'],['#bcaaa4','#6d4c41']],
  props:['🌳','🪴','🚜','📦','🌽'],parkP:0.25,roadW:0.95}},
{e:'🦘',n:'Boxing Kangaroo',spd:360,s:100,pow:1.4,sh:'HAH!',q:'Fights everything. Wins most.',
 world:{name:'Arena Ring',layout:'ring',ground:'#141018',road:'#2a2030',line:'#f48fb1',curb:'rgba(244,143,177,.3)',park:'#2e1a28',
  BC:[['#f48fb1','#c2185b'],['#ce93d8','#8e24aa'],['#90caf9','#1e88e5'],['#ffe082','#f9a825']],
  props:['🚦','🪑','🎈','📦','🥊'],parkP:0.2,roadW:0.8}},
{e:'🐧',n:'Slide Penguin',spd:320,s:76,pow:1,sh:'NOOT NOOT!',fr:3,q:'No brakes. Maximum slide.',
 world:{name:'Ice Harbor',layout:'harbor',ground:'#0a1520',road:'#1a3048',line:'#b3e5fc',curb:'rgba(179,229,252,.35)',park:'#1565c0',
  BC:[['#81d4fa','#0288d1'],['#b3e5fc','#4fc3f7'],['#e1f5fe','#81d4fa'],['#90caf9','#1976d2']],
  props:['🧊','🚤','🛟','🐟','🍕'],parkP:0.2,roadW:1.0}},
{e:'🚗',n:'Getaway Car',spd:440,s:108,pow:1.7,sh:'VROOOM!',fr:7,q:'Floor it. Smash through. No license needed.',
 world:{name:'Highway Sprawl',layout:'highway',ground:'#101218',road:'#2c3340',line:'#ffeb3b',curb:'rgba(255,235,59,.3)',park:'#1b4332',
  BC:[['#64b5f6','#1976d2'],['#e57373','#c62828'],['#ffd54f','#f9a825'],['#4db6ac','#00897b']],
  props:['🚦','🛢️','🚧','🛵','🍕'],parkP:0.1,roadW:1.25}}
];

const CV=['🧑‍💼','👩‍🍳','🧑‍🎤','👨‍🦳','👩‍🦰','🧑‍🔧','🧑‍🚀'],CR=['🚗','🚕','🚙','🚌','🚚'];
const EF='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const CELL=640,N=6,WS=CELL*N;
let RD=200,dpr=1,VW,VH,Z=1,B,E,PT,TX,WV,pl,animal,cur,state='menu',score,heat,combo,comboT,time,shake=0,pop=0,copT=0,best=0,K={},joy={x:0,y:0},cam={x:WS/2,y:WS/2},ac,W;
try{best=+localStorage.getItem('mom_best_v3')||0}catch(e){}
function rs(){dpr=Math.min(devicePixelRatio||1,3);VW=innerWidth;VH=innerHeight;cv.width=VW*dpr;cv.height=VH*dpr;Z=Math.max(.42,Math.min(VW,VH*1.5)/980)}
addEventListener('resize',rs);rs();
function snd(f,d=.1,t='square',v=.05){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.4,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(n+d)}catch(e){}}

function layoutCell(i,j,layout){
  const o={park:false,ox:0,oy:0,sw:1,sh:1};
  if(layout==='maze'){o.sw=0.55+R()*0.35;o.sh=0.55+R()*0.35;o.ox=(R()-.5)*80;o.oy=(R()-.5)*80;o.park=R()<0.08}
  else if(layout==='switchback'){o.sw=0.65+R()*0.25;o.sh=0.5+R()*0.35;o.ox=(i%2?1:-1)*40;o.oy=(j%2?1:-1)*30;o.park=R()<0.22}
  else if(layout==='canals'){o.sw=0.7+R()*0.2;o.sh=0.55+R()*0.25;o.park=(i+j)%3===0||R()<0.2}
  else if(layout==='boulevard'){o.sw=0.85+R()*0.15;o.sh=0.75+R()*0.2;o.ox=0;o.oy=0;o.park=R()<0.18}
  else if(layout==='open'){o.sw=0.5+R()*0.35;o.sh=0.5+R()*0.35;o.park=R()<0.38}
  else if(layout==='dense'){o.sw=0.9+R()*0.1;o.sh=0.9+R()*0.1;o.ox=(R()-.5)*20;o.oy=(R()-.5)*20;o.park=R()<0.05}
  else if(layout==='organic'){o.sw=0.5+R()*0.45;o.sh=0.5+R()*0.45;o.ox=(R()-.5)*100;o.oy=(R()-.5)*100;o.park=R()<0.32}
  else if(layout==='strips'){o.sw=0.95;o.sh=0.45+R()*0.35;o.oy=(j%2?30:-20);o.park=R()<0.25}
  else if(layout==='ring'){const cx=2.5,cy=2.5,d=Math.hypot(i-cx,j-cy);o.sw=0.55+Math.min(0.4,d*0.12);o.sh=o.sw;o.park=d<1.2||R()<0.15}
  else if(layout==='harbor'){o.sw=0.7+R()*0.25;o.sh=0.6+R()*0.3;o.park=j>=4||R()<0.15;o.ox=(R()-.5)*40}
  else if(layout==='highway'){o.sw=0.4+R()*0.2;o.sh=0.9;o.ox=(i%2?60:-40);o.park=R()<0.1}
  else {o.park=R()<0.15}
  return o;
}
