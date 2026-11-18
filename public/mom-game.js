const FREE_CODE="MAYHEM-FREE",COMPLEX_CODES=["IBEX-9F4K-M4YH3M-Q2R8-7XPL4T1NUM-2026","ALPINE-IBEX-FLY-M1N3-SM4SH-X7K9"],KEY="mom_unlocked_v4",CHOOSE_KEY="mom_choose_v1";
const $=id=>document.getElementById(id),cv=$('c'),ctx=cv.getContext('2d');
const R=Math.random,pick=a=>a[R()*a.length|0],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function isUnlocked(){try{return sessionStorage.getItem(KEY)==='1'}catch(e){return false}}
function canChoose(){try{return sessionStorage.getItem(CHOOSE_KEY)==='1'}catch(e){return false}}
function setChoose(){try{sessionStorage.setItem(CHOOSE_KEY,'1');sessionStorage.setItem(KEY,'1')}catch(e){}}
function unlock(){try{sessionStorage.setItem(KEY,'1')}catch(e){}$('pay').classList.add('h');if(canChoose()){showPick()}else{$('ov').classList.remove('h');roll();updatePickBtn()}}
function showPick(){$('ov').classList.add('h');$('pay').classList.add('h');$('secret').classList.add('h');buildPickGrid();$('pick').classList.remove('h')}
function updatePickBtn(){const b=$('pickToggle');if(b)b.style.display=canChoose()?'inline-block':'none'}
$('unlock').onclick=()=>{const v=($('code').value||'').trim().toUpperCase().replace(/\s+/g,'');if(v===FREE_CODE){unlock();return}$('err').textContent='Wrong code. Try again.';};
$('code').addEventListener('keydown',e=>{if(e.key==='Enter')$('unlock').click()});
$('paybtn').onclick=()=>{$('err').textContent='Checkout is not live yet. Use the free code to play, or the operator key to choose animals.';};
$('ghost').onclick=()=>{$('secret').classList.remove('h');$('secCode').value='';$('secErr').textContent='';setTimeout(()=>$('secCode').focus(),50)};
$('secClose').onclick=()=>$('secret').classList.add('h');
$('secUnlock').onclick=()=>{const v=($('secCode').value||'').trim().toUpperCase().replace(/\s+/g,'');if(COMPLEX_CODES.includes(v)){setChoose();$('secret').classList.add('h');showPick();return}$('secErr').textContent='Key rejected.';};
$('secCode').addEventListener('keydown',e=>{if(e.key==='Enter')$('secUnlock').click()});
const AN=[
{e:'🦝',n:'Trash Raccoon',spd:340,s:78,pow:1,sh:'CHITTER!',q:'Fast, sneaky, loves a dumpster.',
 world:{name:'Alley Dump',layouts:['maze','dense','organic'],ground:'#1c1814',road:'#2a241c',line:'#c4a574',curb:'rgba(196,165,116,.25)',park:'#2d4a28',
  BC:[['#8d6e63','#5d4037'],['#a1887f','#6d4c41'],['#ffb74d','#f57c00'],['#78909c','#455a64']],
  props:['🗑️','🛒','📦','🛢️','🚧','🐀'],parkP:0.08,roadW:0.55,cars:0.4}},
{e:'🐐',n:'Menace Goat',spd:370,s:80,pow:1.2,sh:'MEHHH!',q:'Headbutts first, asks never.',
 world:{name:'Cliff Switchbacks',layouts:['switchback','organic','strips'],ground:'#1a1e24',road:'#3d4450',line:'#e8d5a3',curb:'rgba(232,213,163,.2)',park:'#3d5a3a',
  BC:[['#90a4ae','#546e7a'],['#bcaaa4','#8d6e63'],['#a5d6a7','#66bb6a'],['#ffe082','#ffb300']],
  props:['🪨','🌳','🪴','🚧','🐏'],parkP:0.22,roadW:0.7,cars:0.6}},
{e:'🦛',n:'Hungry Hippo',spd:250,s:130,pow:1.9,sh:'HOOONK!',q:'Slow, huge, unstoppable.',
 world:{name:'Canal District',layouts:['canals','harbor','open'],ground:'#0f1a22',road:'#1e3344',line:'#4fc3f7',curb:'rgba(79,195,247,.3)',park:'#1b5e4a',
  BC:[['#4dd0e1','#0097a7'],['#80cbc4','#00897b'],['#81d4fa','#0288d1'],['#b2dfdb','#4db6ac']],
  props:['🌳','🪴','🚤','🛟','🍕'],parkP:0.28,roadW:0.85,cars:0.5,vehicles:['🚤','🛶','🛥️']}},
{e:'🐘',n:'Big Elephant',spd:245,s:140,pow:2,sh:'TRUMPET!',q:'Walls are just suggestions.',
 world:{name:'Monument Avenue',layouts:['boulevard','ring','highway'],ground:'#141820',road:'#2a3140',line:'#ffd54f',curb:'rgba(255,213,79,.25)',park:'#2e5a3c',
  BC:[['#ce93d8','#8e24aa'],['#ef9a9a','#e53935'],['#fff59d','#fbc02d'],['#90caf9','#1e88e5']],
  props:['🌳','🏛️','🚦','🪑','🎈'],parkP:0.18,roadW:1.15,cars:1}},
{e:'🦆',n:'Angry Duck',spd:330,s:70,pow:1,sh:'QUACK!!',q:'Small, furious, zero chill.',
 world:{name:'Pond Plaza',layouts:['open','canals','organic'],ground:'#121c18',road:'#243830',line:'#aed581',curb:'rgba(174,213,129,.25)',park:'#1b5e20',
  BC:[['#a5d6a7','#43a047'],['#c5e1a5','#7cb342'],['#80deea','#00acc1'],['#ffe082','#ffb300']],
  props:['🌳','🪴','🦆','🍕','🎈'],parkP:0.35,roadW:0.9,cars:0.3}},
{e:'🐊',n:'Sewer Croc',spd:290,s:110,pow:1.5,sh:'SNAP!',q:'Climbed out of the drain, in a mood.',
 world:{name:'Undercity Drains',layouts:['maze','dense','tunnel'],ground:'#0c1014',road:'#1a222c',line:'#26a69a',curb:'rgba(38,166,154,.35)',park:'#1a3a32',
  BC:[['#455a64','#263238'],['#546e7a','#37474f'],['#00897b','#004d40'],['#5c6bc0','#283593']],
  props:['🛢️','🚧','🗑️','📦','🐀','💧'],parkP:0.04,roadW:0.45,cars:0,noCars:true}},
{e:'🦍',n:'Gorilla',spd:285,s:120,pow:1.8,sh:'OOH AAH!',q:'Chest-thump shockwaves.',
 world:{name:'Canopy Blocks',layouts:['organic','open','maze'],ground:'#0e1610',road:'#1e2e1c',line:'#81c784',curb:'rgba(129,199,132,.28)',park:'#1b5e20',
  BC:[['#66bb6a','#2e7d32'],['#9ccc65','#558b2f'],['#a1887f','#5d4037'],['#ff8a65','#e64a19']],
  props:['🌳','🌳','🪴','🍌','🎈'],parkP:0.32,roadW:0.75,cars:0.35}},
{e:'🐓',n:'Rage Rooster',spd:350,s:74,pow:1.1,sh:'COCK-A-DOO!',q:'Wakes up the whole city.',
 world:{name:'Farm Edge',layouts:['strips','open','switchback'],ground:'#1a1610',road:'#3e3428',line:'#ffcc80',curb:'rgba(255,204,128,.25)',park:'#558b2f',
  BC:[['#ffcc80','#fb8c00'],['#ef9a9a','#e53935'],['#a5d6a7','#43a047'],['#bcaaa4','#6d4c41']],
  props:['🌳','🪴','🚜','📦','🌽'],parkP:0.25,roadW:0.95,cars:0.5,vehicles:['🚜','🛻','🚚']}},
{e:'🦘',n:'Boxing Kangaroo',spd:360,s:100,pow:1.4,sh:'HAH!',q:'Fights everything. Wins most.',
 world:{name:'Arena Ring',layouts:['ring','boulevard','dense'],ground:'#141018',road:'#2a2030',line:'#f48fb1',curb:'rgba(244,143,177,.3)',park:'#2e1a28',
  BC:[['#f48fb1','#c2185b'],['#ce93d8','#8e24aa'],['#90caf9','#1e88e5'],['#ffe082','#f9a825']],
  props:['🚦','🪑','🎈','📦','🥊'],parkP:0.2,roadW:0.8,cars:0.7}},
{e:'🐧',n:'Slide Penguin',spd:320,s:76,pow:1,sh:'NOOT NOOT!',fr:3,q:'No brakes. Maximum slide.',
 world:{name:'Ice Harbor',layouts:['harbor','strips','open'],ground:'#0a1520',road:'#1a3048',line:'#b3e5fc',curb:'rgba(179,229,252,.35)',park:'#1565c0',
  BC:[['#81d4fa','#0288d1'],['#b3e5fc','#4fc3f7'],['#e1f5fe','#81d4fa'],['#90caf9','#1976d2']],
  props:['🧊','🚤','🛟','🐟','🍕'],parkP:0.2,roadW:1.0,cars:0.4,vehicles:['🚤','🛷','🛥️']}},
{e:'🚗',n:'Getaway Car',spd:440,s:108,pow:1.7,sh:'VROOOM!',fr:7,q:'Floor it. Smash through. No license needed.',
 world:{name:'Highway Sprawl',layouts:['highway','boulevard','strips'],ground:'#101218',road:'#2c3340',line:'#ffeb3b',curb:'rgba(255,235,59,.3)',park:'#1b4332',
  BC:[['#64b5f6','#1976d2'],['#e57373','#c62828'],['#ffd54f','#f9a825'],['#4db6ac','#00897b']],
  props:['🚦','🛢️','🚧','🛵','🍕'],parkP:0.1,roadW:1.25,cars:1.2}},
{e:'🐻',n:'Grizzly Bear',spd:270,s:125,pow:1.85,sh:'ROAR!',q:'Big, mad, and not interested in your picnic.',
 world:{name:'Forest Road',layouts:['organic','switchback','open'],ground:'#121810',road:'#2a3220',line:'#c8e6c9',curb:'rgba(200,230,201,.25)',park:'#1b4332',
  BC:[['#8d6e63','#5d4037'],['#a5d6a7','#388e3c'],['#bcaaa4','#6d4c41'],['#ffcc80','#ef6c00']],
  props:['🌳','🪵','🪨','🍯','🏕️'],parkP:0.4,roadW:0.65,cars:0.25}},
{e:'🦊',n:'Sly Fox',spd:380,s:72,pow:1.05,sh:'YIP!',q:'Quick, clever, and always three steps ahead.',
 world:{name:'Suburban Sprawl',layouts:['boulevard','strips','maze'],ground:'#18141c',road:'#2e2838',line:'#ffab91',curb:'rgba(255,171,145,.25)',park:'#2e5a3c',
  BC:[['#ffab91','#e64a19'],['#ce93d8','#7b1fa2'],['#80cbc4','#00897b'],['#fff59d','#fbc02d']],
  props:['🌳','📦','🛒','🪴','🏠'],parkP:0.2,roadW:0.85,cars:0.8}},
{e:'🦉',n:'Night Owl',spd:310,s:78,pow:1.15,sh:'HOOT!',q:'Sees everything. Judges everything.',
 world:{name:'Midnight Rooftops',layouts:['dense','maze','ring'],ground:'#0a0c14',road:'#1a1e2c',line:'#b39ddb',curb:'rgba(179,157,219,.3)',park:'#1a2438',
  BC:[['#5c6bc0','#283593'],['#7e57c2','#4527a0'],['#78909c','#37474f'],['#ff8a65','#d84315']],
  props:['🌙','📦','🪑','🦉','🔭'],parkP:0.12,roadW:0.6,cars:0.5}},
{e:'🐗',n:'Wild Boar',spd:300,s:95,pow:1.55,sh:'OINK!!',q:'Tusks first. Questions never.',
 world:{name:'Mud Trails',layouts:['organic','switchback','maze'],ground:'#1a140e',road:'#3a2e22',line:'#a1887f',curb:'rgba(161,136,127,.3)',park:'#3e2723',
  BC:[['#8d6e63','#4e342e'],['#a1887f','#5d4037'],['#bcaaa4','#6d4c41'],['#ffcc80','#ef6c00']],
  props:['🌳','🪨','🪵','🍄','🐗'],parkP:0.3,roadW:0.55,cars:0.15,trail:true}},
{e:'🦩',n:'Furious Flamingo',spd:355,s:80,pow:1.1,sh:'SQUAWK!',q:'Looks elegant. Absolutely is not.',
 world:{name:'Resort Strip',layouts:['harbor','strips','boulevard'],ground:'#1a1018',road:'#2a2030',line:'#f8bbd0',curb:'rgba(248,187,208,.3)',park:'#00695c',
  BC:[['#f48fb1','#c2185b'],['#80deea','#00acc1'],['#ffe082','#f9a825'],['#ce93d8','#8e24aa']],
  props:['🌴','🍹','🏖️','🦩','🍕'],parkP:0.25,roadW:0.9,cars:0.6}},
{e:'🦄',n:'Chaos Unicorn',spd:360,s:100,pow:1.6,sh:'NEIGH!',q:'Magic, mayhem, and zero chill.',
 world:{name:'Rainbow Grid',layouts:['ring','boulevard','organic'],ground:'#12081a',road:'#2a1838',line:'#ea80fc',curb:'rgba(234,128,252,.35)',park:'#4a148c',
  BC:[['#ea80fc','#aa00ff'],['#82b1ff','#2962ff'],['#b9f6ca','#00c853'],['#ffe57f','#ffd600']],
  props:['✨','🌈','🎈','⭐','🍭'],parkP:0.22,roadW:0.85,cars:0.7}},
{e:'🐺',n:'Lone Wolf',spd:365,s:90,pow:1.45,sh:'HOWL!',q:'Runs the pack. You are the pack now.',
 world:{name:'Snow Pass',layouts:['switchback','highway','open'],ground:'#0e141c',road:'#2a3444',line:'#e3f2fd',curb:'rgba(227,242,253,.3)',park:'#37474f',
  BC:[['#90a4ae','#546e7a'],['#b0bec5','#607d8b'],['#e0e0e0','#9e9e9e'],['#81d4fa','#0288d1']],
  props:['🌲','❄️','🪨','🏕️','🐺'],parkP:0.28,roadW:0.7,cars:0.3}},
{e:'🐢',n:'Tank Turtle',spd:200,s:110,pow:2.1,sh:'…',q:'Slow. Unstoppable. Shell like armor.',
 world:{name:'Shell Harbor',layouts:['harbor','canals','open'],ground:'#0e1814',road:'#1e3028',line:'#a5d6a7',curb:'rgba(165,214,167,.28)',park:'#1b5e20',
  BC:[['#81c784','#388e3c'],['#4db6ac','#00897b'],['#a5d6a7','#43a047'],['#80cbc4','#00695c']],
  props:['🌳','🪴','🐢','🛟','🍕'],parkP:0.3,roadW:0.8,cars:0.4}},
{e:'🦇',n:'Vault Bat',spd:390,s:68,pow:1.0,sh:'SKREE!',q:'Zips through the dark. Hates light.',
 world:{name:'Cave Network',layouts:['maze','tunnel','dense'],ground:'#0a080c',road:'#1a161e',line:'#9575cd',curb:'rgba(149,117,205,.3)',park:'#1a1220',
  BC:[['#5e35b1','#311b92'],['#7e57c2','#4527a0'],['#455a64','#263238'],['#6d4c41','#3e2723']],
  props:['🦇','🪨','💎','🕯️','🕷️'],parkP:0.05,roadW:0.4,cars:0,noCars:true}},
{e:'🦌',n:'Alpine Ibex',spd:520,s:100,pow:3.5,sh:'IBEX!!',fr:14,q:'Fly. One-hit buildings. Mines. Smash reloads slow.',
 world:{name:'Summit Peaks',layouts:['switchback','organic','open'],ground:'#0e1218',road:'#2a3440',line:'#5ce1ff',curb:'rgba(92,225,255,.35)',park:'#1b4332',
  BC:[['#90a4ae','#546e7a'],['#80deea','#00acc1'],['#ce93d8','#7b1fa2'],['#ffe082','#f9a825']],
  props:['🪨','🌲','❄️','🏔️','💎'],parkP:0.3,roadW:0.7,cars:0.2},
 fly:1,oneHit:1,smashCd:4.5,mines:1}
];

const CV=['🧑‍💼','👩‍🍳','🧑‍🎤','👨‍🦳','👩‍🦰','🧑‍🔧','🧑‍🚀'],CR=['🚗','🚕','🚙','🚌','🚚'];
const EF='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const CELL=640,N=6,WS=CELL*N;
let RD=200,dpr=1,VW,VH,Z=1,B,E,PT,TX,WV,MN,pl,animal,cur,state='menu',score,heat,combo,comboT,time,shake=0,pop=0,copT=0,best=0,K={},joy={x:0,y:0},cam={x:WS/2,y:WS/2},ac,W,activeLayout,mapSeed=0;
try{best=+localStorage.getItem('mom_best_v4')||0}catch(e){}
function rs(){dpr=Math.min(devicePixelRatio||1,3);VW=innerWidth;VH=innerHeight;cv.width=VW*dpr;cv.height=VH*dpr;Z=Math.max(.42,Math.min(VW,VH*1.5)/980)}
addEventListener('resize',rs);rs();
function snd(f,d=.1,t='square',v=.05){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(f*.4,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(n+d)}catch(e){}}
function srand(){mapSeed=(mapSeed*1664525+1013904223)>>>0;return mapSeed/4294967296}
function pickLayout(world){const opts=world.layouts||['boulevard'];return opts[Math.floor(srand()*opts.length)]}
function layoutCell(i,j,layout){
  const o={park:false,ox:0,oy:0,sw:1,sh:1};const r=()=>srand();const jx=(r()-.5)*30,jy=(r()-.5)*30;
  if(layout==='maze'){o.sw=0.5+r()*0.4;o.sh=0.5+r()*0.4;o.ox=(r()-.5)*100+jx;o.oy=(r()-.5)*100+jy;o.park=r()<0.08}
  else if(layout==='switchback'){o.sw=0.6+r()*0.3;o.sh=0.45+r()*0.4;o.ox=(i%2?1:-1)*(30+r()*40)+jx;o.oy=(j%2?1:-1)*(20+r()*30)+jy;o.park=r()<0.22}
  else if(layout==='canals'){o.sw=0.65+r()*0.25;o.sh=0.5+r()*0.3;o.park=(i+j)%3===0||r()<0.2;o.ox=jx;o.oy=jy}
  else if(layout==='boulevard'){o.sw=0.8+r()*0.2;o.sh=0.7+r()*0.25;o.ox=jx*.5;o.oy=jy*.5;o.park=r()<0.18}
  else if(layout==='open'){o.sw=0.4+r()*0.4;o.sh=0.4+r()*0.4;o.ox=(r()-.5)*60;o.oy=(r()-.5)*60;o.park=r()<0.38}
  else if(layout==='dense'){o.sw=0.85+r()*0.15;o.sh=0.85+r()*0.15;o.ox=(r()-.5)*25;o.oy=(r()-.5)*25;o.park=r()<0.05}
  else if(layout==='organic'){o.sw=0.45+r()*0.5;o.sh=0.45+r()*0.5;o.ox=(r()-.5)*120;o.oy=(r()-.5)*120;o.park=r()<0.32}
  else if(layout==='strips'){o.sw=0.9+r()*0.1;o.sh=0.4+r()*0.4;o.oy=(j%2?20:-20)+(r()-.5)*40;o.ox=jx;o.park=r()<0.25}
  else if(layout==='ring'){const cx=2.5,cy=2.5,d=Math.hypot(i-cx,j-cy);o.sw=0.5+Math.min(0.45,d*0.12)+r()*0.1;o.sh=o.sw;o.ox=jx;o.oy=jy;o.park=d<1.2||r()<0.15}
  else if(layout==='harbor'){o.sw=0.65+r()*0.3;o.sh=0.55+r()*0.35;o.park=j>=4||r()<0.15;o.ox=(r()-.5)*50;o.oy=jy}
  else if(layout==='highway'){o.sw=0.35+r()*0.25;o.sh=0.85+r()*0.15;o.ox=(i%2?50:-50)+(r()-.5)*40;o.oy=jy;o.park=r()<0.1}
  else if(layout==='tunnel'){o.sw=0.7+r()*0.25;o.sh=0.55+r()*0.3;o.ox=(r()-.5)*40;o.oy=(r()-.5)*40;o.park=r()<0.03}
  else {o.park=r()<0.15;o.ox=jx;o.oy=jy}
  return o;
}
