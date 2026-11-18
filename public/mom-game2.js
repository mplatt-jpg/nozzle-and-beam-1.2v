
function setup(){
 mapSeed=(Math.random()*1e9)|0;
 W=animal.world;
 activeLayout=pickLayout(W);
 RD=Math.round(140+80*(W.roadW||0.8)*(0.85+srand()*0.3));
 B=[];E=[];PT=[];TX=[];WV=[];score=0;heat=0;combo=0;comboT=0;time=0;pop=0;copT=0;
 pl={x:3*CELL+RD/2,y:3*CELL+RD/2,vx:0,vy:0,hp:100,fl:0,dash:0,dcd:0,scd:0,inv:0};
 const lot=440;
 for(let i=0;i<N;i++)for(let j=0;j<N;j++){
  const bx=i*CELL+RD,by=j*CELL+RD,L=layoutCell(i,j,activeLayout);
  if(L.park||srand()<W.parkP){
   B.push({x:bx+L.ox,y:by+L.oy,w:lot,h:lot,park:1});
   for(let k=0;k<8+srand()*6|0;k++){const t=mk('prop',bx+40+srand()*360,by+40+srand()*360);t.e=pick(W.props);t.s=(t.e==='🌳'||t.e==='🌲')?90:58;E.push(t)}
  }else{
   const w=Math.round((280+srand()*120)*L.sw),h=Math.round((280+srand()*120)*L.sh);
   const c=pick(W.BC);
   B.push({x:bx+(lot-w)/2+L.ox,y:by+(lot-h)/2+L.oy,w,h,c,hp:10,max:10,hitT:0,neon:srand()<.5,rub:Array.from({length:12},()=>[srand(),srand(),10+srand()*18])});
  }
 }
 for(let i=0;i<90;i++)spawn('civ');
 const carTarget=W.noCars?0:Math.round(28*(W.cars==null?1:W.cars));
 for(let i=0;i<carTarget;i++)spawn('car');
 for(let i=0;i<90;i++)spawn('prop');
 for(const e of E)if(e.k!='car'&&bl(e.x,e.y,e.s*.3)){e.x=e.y=-999;e.dead=1;e.dt=0}
}
function mk(k,x,y){const o={k,x,y,vx:0,vy:0,kx:0,ky:0,hp:1,hitT:0,rot:0,fl:0,dir:R()*6.28,wt:0,ph:R()*9};
 if(k=='civ'){o.e=pick(CV);o.s=52;o.pts=25}
 else if(k=='car'){
  if(W&&W.vehicles)o.e=pick(W.vehicles);
  else o.e=pick(CR);
  o.s=94;o.hp=o.e=='🚌'?5:3;o.pts=120}
 else if(k=='prop'){o.e=pick((W&&W.props)||['🌳','🗑️']);o.s=(o.e==='🌳'||o.e==='🌲')?90:58;o.pts=15;o.food=['🍕','🍔','🍌','🌽','🍯','🍭'].includes(o.e)}
 else{o.e='🚓';o.s=96;o.hp=4;o.pts=250}
 return o}
function spawn(k,far){for(let t=0;t<9;t++){const h=R()<.5,j=R()*N|0,a=R()*WS,b=j*CELL+RD*(.1+.8*R());let x=h?a:b,y=h?b:a;
 if(far&&pl&&Math.hypot(x-pl.x,y-pl.y)<750)continue;
 const o=mk(k,x,y);
 if(k=='car'){const lane=R()<.5,sp=(140+R()*100)*(lane?1:-1),base=j*CELL;
  if(h){o.y=base+RD*(lane?.72:.28);o.vx=sp;o.fl=sp>0}else{o.x=base+RD*(lane?.72:.28);o.vy=sp;o.rot=sp>0?-1.5708:1.5708}}
 E.push(o);return}}
function bl(x,y,r){for(const b of B){if(b.park||b.hp<=0)continue;const cx=clamp(x,b.x,b.x+b.w),cy=clamp(y,b.y,b.y+b.h);if(Math.hypot(x-cx,y-cy)<r)return 1}return 0}
function mv(e,dx,dy){const r=e.s*.28;if(!bl(e.x+dx,e.y,r))e.x+=dx;else e.dir=R()*6.28;if(!bl(e.x,e.y+dy,r))e.y+=dy;else e.dir=R()*6.28}
function txt(x,y,s,c,z){TX.push({x,y,s,c,z,l:1})}
function burst(x,y,n,cols,sp=400){for(let i=0;i<n&&PT.length<800;i++){const a=R()*6.28,v=sp*(.2+R()*.8);PT.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,l:.5+R()*.6,c:pick(cols),s:6+R()*10})}}
function award(p,x,y){combo++;comboT=2;const m=1+Math.floor(combo/6)*.5,v=Math.round(p*m);score+=v;heat=Math.min(100,heat+p*.05);txt(x,y-30,'+'+v,'#ffe14a',24+Math.min(16,p/30))}
function kill(e){e.dead=1;e.dt=.6;e.spin=R()<.5?-1:1;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;e.kx+=dx/d*650;e.ky+=dy/d*650-100;
 award(e.pts,e.x,e.y);burst(e.x,e.y,e.k=='car'?18:10,['#fff','#ffe14a','#ff3d6a','#5ce1ff']);snd(e.k=='car'?150:300+R()*200,.15);
 if(e.food){pl.hp=Math.min(100,pl.hp+14);txt(e.x,e.y-60,'+HP','#2ef0a0',26)}
 if(e.k=='cop')heat=Math.max(0,heat-10)}
function hit(e,n){if(e.dead)return;e.hp-=n;if(e.hp<=0)kill(e);else{burst(e.x,e.y,5,['#fff','#ccc'],280);snd(200,.07)}}
function hitB(b,n){if(b.hp<=0)return;b.hp-=n;b.hitT=.3;shake=Math.max(shake,10);burst(b.x+b.w*R(),b.y+b.h*R(),10,['#e6e6ea','#b8bac4',b.c[0],b.c[1]],340);snd(110,.12,'sawtooth',.07);
 if(b.hp<=0){award(650,b.x+b.w/2,b.y+b.h/2);shake=28;burst(b.x+b.w/2,b.y+b.h/2,50,['#e6e6ea','#8d8f96',b.c[0],b.c[1],'#5ce1ff'],750);txt(b.x+b.w/2,b.y,'COLLAPSE!','#fff',42);snd(60,.6,'sawtooth',.12)}}
function wave(){if(state!='play'||pl.scd>0)return;pl.scd=1.4;const Rr=55+240*Math.sqrt(animal.pow);WV.push({x:pl.x,y:pl.y,R:Rr,t:0});shake=18;snd(90,.35,'sawtooth',.1);txt(pl.x,pl.y-90,animal.sh,'#fff',38);
 for(const e of E){if(e.dead)continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d<Rr){hit(e,2*animal.pow);if(!e.dead){e.kx+=dx/(d||1)*900;e.ky+=dy/(d||1)*900}}}
 for(const b of B){if(b.park||b.hp<=0)continue;if(Math.hypot(pl.x-clamp(pl.x,b.x,b.x+b.w),pl.y-clamp(pl.y,b.y,b.y+b.h))<Rr)hitB(b,2*animal.pow)}}
function dash(){if(state!='play'||pl.dcd>0)return;pl.dash=.3;pl.dcd=1.1;const m=Math.hypot(pl.vx,pl.vy),s=animal.spd*2.4;if(m>40){pl.vx=pl.vx/m*s;pl.vy=pl.vy/m*s}else{pl.vx=(pl.fl?1:-1)*s;pl.vy=0}snd(500,.2,'triangle',.06)}
function upd(dt){
 time+=dt;const play=state=='play';
 let ax=0,ay=0;
 if(play){ax=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+joy.x;ay=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0)+joy.y;const m=Math.hypot(ax,ay);if(m>1){ax/=m;ay/=m}
  pl.dash-=dt;pl.dcd-=dt;pl.scd-=dt;pl.inv-=dt;
  const sp=animal.spd*(pl.dash>0?2.4:1),f=1-Math.exp(-(animal.fr||12)*dt);
  pl.vx+=(ax*sp-pl.vx)*f;pl.vy+=(ay*sp-pl.vy)*f;pl.x=clamp(pl.x+pl.vx*dt,30,WS-30);pl.y=clamp(pl.y+pl.vy*dt,30,WS-30);
  if(Math.abs(ax)>.15)pl.fl=ax>0;
  if(pl.dash>0&&PT.length<800)PT.push({x:pl.x,y:pl.y+10,vx:0,vy:0,l:.25,c:'rgba(92,225,255,.7)',s:animal.s*.42});
  comboT-=dt;if(comboT<=0)combo=0;heat=Math.max(0,heat-1.2*dt);
  if(pl.hp<=0)return over();
  const pr=animal.s*.38;
  for(const b of B){if(b.park||b.hp<=0)continue;b.hitT-=dt;const cx=clamp(pl.x,b.x,b.x+b.w),cy=clamp(pl.y,b.y,b.y+b.h),dx=pl.x-cx,dy=pl.y-cy,d=Math.hypot(dx,dy);
   if(d<pr){if(d>0){pl.x+=dx/d*(pr-d);pl.y+=dy/d*(pr-d)}else pl.y-=pr;if(pl.dash>0&&b.hitT<=0){hitB(b,animal.pow*1.5);pl.dash=0}else if(b.hitT<=0&&Math.hypot(pl.vx,pl.vy)>animal.spd*.8&&animal.pow>1.7){hitB(b,.5)}}}
 }
 for(const e of E){
  e.hitT-=dt;const kd=Math.exp(-5*dt);e.kx*=kd;e.ky*=kd;
  if(e.dead){e.dt-=dt;e.x+=e.kx*dt;e.y+=e.ky*dt;continue}
  const dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy)||1;
  if(e.k=='civ'){let sx,sy;if(play&&d<300){sx=-dx/d*200;sy=-dy/d*200}else{e.wt-=dt;if(e.wt<=0){e.dir=R()*6.28;e.wt=1+R()*2}sx=Math.cos(e.dir)*50;sy=Math.sin(e.dir)*50}
   e.fl=sx>0;mv(e,(sx+e.kx)*dt,(sy+e.ky)*dt)}
  else if(e.k=='cop'){const s=Math.min(340,220+heat);e.fl=dx>0;mv(e,(dx/d*s+e.kx)*dt,(dy/d*s+e.ky)*dt)}
  else if(e.k=='car'){e.x+=(e.vx+e.kx)*dt;e.y+=(e.vy+e.ky)*dt;if(e.x>WS+120)e.x=-120;if(e.x<-120)e.x=WS+120;if(e.y>WS+120)e.y=-120;if(e.y<-120)e.y=WS+120}
  if(play&&d<(e.s+animal.s)*.36&&e.hitT<=0){
   if(e.k=='cop'&&pl.dash<=0){if(pl.inv<=0){pl.hp-=14;pl.inv=.9;shake=14;pl.vx=-dx/d*-600;pl.vy=-dy/d*-600;e.kx=dx/d*300;e.ky=dy/d*300;snd(80,.2,'sawtooth',.08);txt(pl.x,pl.y-70,'OUCH','#ff3d6a',30)}}
   else{hit(e,(pl.dash>0?2:1)*animal.pow);e.hitT=.25;e.kx-=dx/d*420*animal.pow;e.ky-=dy/d*420*animal.pow}}
 }
 E=E.filter(e=>!e.dead||e.dt>0);
 if(play){copT-=dt;const want=Math.min(8,Math.floor(heat/14)),cops=E.reduce((a,e)=>a+(e.k=='cop'&&!e.dead),0);if(cops<want&&copT<=0){spawn('cop',1);copT=1.2}}
 pop-=dt;if(pop<=0){pop=.4;let c=0,a=0,p=0;for(const e of E){if(e.dead)continue;if(e.k=='civ')c++;else if(e.k=='car')a++;else if(e.k=='prop')p++}
  if(c<90)spawn('civ',1);
  const carCap=W.noCars?0:Math.round(28*(W.cars==null?1:W.cars));
  if(a<carCap)spawn('car',1);
  if(p<90)spawn('prop',1)}
 for(const p of PT){p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt}PT=PT.filter(p=>p.l>0);
 for(const t of TX){t.l-=dt*.9;t.y-=50*dt}TX=TX.filter(t=>t.l>0);
 for(const w of WV)w.t+=dt*2.4;WV=WV.filter(w=>w.t<1);
 shake=Math.max(0,shake-dt*40);
}
function drE(e,bob){ctx.save();ctx.translate(e.x,e.y);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,e.s*.36,e.s*.42,e.s*.14,0,0,7);ctx.fill();
 let sc=1,al=1,r=e.rot||0;if(e.dead){const t=1-e.dt/.6;sc=1+t*.7;al=Math.max(0,1-t);r+=t*9*e.spin}
 ctx.translate(0,bob||0);ctx.globalAlpha=al;ctx.rotate(r);ctx.scale((e.fl?-1:1)*sc,sc);
 if(e.k==='pl'){ctx.shadowColor='#5ce1ff';ctx.shadowBlur=18}
 ctx.font=e.s+'px '+EF;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(e.e,0,0);ctx.restore()}
function drB(b){
 if(b.hp<=0){ctx.fillStyle='#4a4e5c';ctx.fillRect(b.x,b.y+b.h*.5,b.w,b.h*.5);ctx.fillStyle='#7a7e8e';for(const r of b.rub)ctx.fillRect(b.x+r[0]*(b.w-24),b.y+b.h*.5+r[1]*(b.h*.5-24),r[2],r[2]);return}
 ctx.save();if(b.hitT>0)ctx.translate((R()-.5)*10,0);
 const H=52,wy=b.y+b.h-H;
 ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(b.x+16,b.y+b.h,b.w,18);
 ctx.fillStyle=b.c[1];ctx.fillRect(b.x,wy,b.w,H);
 ctx.fillStyle='#fff3b0';for(let x=b.x+18,i=0;x<b.x+b.w-34;x+=36,i++){ctx.globalAlpha=i%3?1:.4;ctx.fillRect(x,wy+12,24,26)}ctx.globalAlpha=1;
 ctx.fillStyle=b.c[0];ctx.fillRect(b.x,b.y-H,b.w,b.h);
 if(b.neon){ctx.strokeStyle=b.c[0];ctx.lineWidth=4;ctx.globalAlpha=.55;ctx.strokeRect(b.x-2,b.y-H-2,b.w+4,b.h+H+4);ctx.globalAlpha=1}
 ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(b.x+24,b.y-H+24,74,52);ctx.fillRect(b.x+b.w-108,b.y-H+b.h-86,68,48);
 ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=6;ctx.strokeRect(b.x+3,b.y-H+3,b.w-6,b.h-6);
 const dm=1-b.hp/b.max;if(dm>0){ctx.fillStyle='rgba(10,12,24,'+dm*.45+')';ctx.fillRect(b.x,b.y-H,b.w,b.h+H);
  ctx.strokeStyle='#0a0c14';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<Math.ceil(dm*7);i++){const x=b.x+30+i*(b.w-60)/7;ctx.moveTo(x,b.y-H);ctx.lineTo(x+26,b.y-H+b.h*.5);ctx.lineTo(x-12,b.y+b.h)}ctx.stroke()}
 ctx.restore()}
function render(){
 const w=W||AN[0].world;
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=w.ground;ctx.fillRect(0,0,cv.width,cv.height);
 const vw=VW/Z,vh=VH/Z,tx=state=='play'?pl.x:WS/2+Math.cos(time*.2)*500,ty=state=='play'?pl.y:WS/2+Math.sin(time*.2)*400;
 cam.x+=(tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;
 const sx=(R()-.5)*shake,sy=(R()-.5)*shake;
 ctx.setTransform(dpr*Z,0,0,dpr*Z,(-(cam.x-vw/2)+sx)*dpr*Z,(-(cam.y-vh/2)+sy)*dpr*Z);
 ctx.fillStyle=w.road;ctx.fillRect(0,0,WS,WS);
 const lay=activeLayout||(w.layouts&&w.layouts[0])||'boulevard';
 ctx.strokeStyle=w.line;ctx.lineWidth=6;ctx.setLineDash([50,36]);ctx.beginPath();
 if(lay==='highway'){for(let i=0;i<N;i++){const o=i*CELL+RD/2;ctx.moveTo(0,o);ctx.lineTo(WS,o)}}
 else if(lay==='strips'){for(let i=0;i<N;i++){const o=i*CELL+RD/2;ctx.moveTo(0,o);ctx.lineTo(WS,o);if(i%2===0){ctx.moveTo(o,0);ctx.lineTo(o,WS)}}}
 else if(lay==='tunnel'){for(let i=0;i<N;i++){const o=i*CELL+RD/2;if(i%2){ctx.moveTo(0,o);ctx.lineTo(WS,o)}else{ctx.moveTo(o,0);ctx.lineTo(o,WS)}}}
 else{for(let i=0;i<N;i++){const o=i*CELL+RD/2;ctx.moveTo(0,o);ctx.lineTo(WS,o);ctx.moveTo(o,0);ctx.lineTo(o,WS)}}
 ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle=w.curb;ctx.lineWidth=14;ctx.beginPath();
 for(let i=0;i<N;i++){const o=i*CELL+RD/2;ctx.moveTo(0,o);ctx.lineTo(WS,o);ctx.moveTo(o,0);ctx.lineTo(o,WS)}ctx.stroke();
 for(const b of B){
  if(b.park){ctx.fillStyle=w.park;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(b.x,b.y,b.w,b.h);continue}
  ctx.fillStyle='#2a3348';ctx.fillRect(Math.round((b.x-RD)/CELL)*CELL+RD,Math.round((b.y-RD)/CELL)*CELL+RD,440,440);
 }
 for(const b of B)if(!b.park&&b.hp<=0)drB(b);
 const L=E.slice();if(state!='menu')L.push({k:'pl',x:pl.x,y:pl.y,e:animal.e,s:animal.s,fl:pl.fl,rot:clamp(pl.vx/1800,-.3,.3)});
 L.sort((a,b)=>a.y-b.y);
 for(const e of L){
  if(e.x<cam.x-vw/2-160||e.x>cam.x+vw/2+160||e.y<cam.y-vh/2-160||e.y>cam.y+vh/2+160)continue;
  if(e.k=='pl'&&pl.inv>0&&Math.floor(time*20)%2)continue;
  drE(e,e.k=='civ'?Math.abs(Math.sin(time*9+e.ph))*-5:e.k=='pl'?Math.abs(Math.sin(time*12))*-6*(Math.hypot(pl.vx,pl.vy)>40):0)}
 for(const b of B)if(!b.park&&b.hp>0)drB(b);
 for(const wv of WV){const t=1-(1-wv.t)*(1-wv.t);ctx.strokeStyle='rgba(92,225,255,'+(1-wv.t)+')';ctx.lineWidth=20*(1-wv.t)+4;ctx.beginPath();ctx.arc(wv.x,wv.y,wv.R*t,0,7);ctx.stroke()}
 for(const p of PT){ctx.globalAlpha=clamp(p.l*2,0,1);ctx.fillStyle=p.c;ctx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)}ctx.globalAlpha=1;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
 for(const t of TX){ctx.globalAlpha=clamp(t.l*1.5,0,1);ctx.font=t.z+'px "Bowlby One",Impact,sans-serif';ctx.lineWidth=8;ctx.strokeStyle='#0a0c14';ctx.strokeText(t.s,t.x,t.y);ctx.fillStyle=t.c;ctx.fillText(t.s,t.x,t.y)}ctx.globalAlpha=1;
 if(state=='play'){$('sc').textContent=score.toLocaleString();$('cb').textContent=combo>2?'COMBO x'+combo+(combo>=6?'  ·  ×'+(1+Math.floor(combo/6)*.5).toFixed(1):''):'';
  $('hf').style.width=clamp(pl.hp,0,100)+'%';$('hf').style.background=pl.hp<30?'#ff3d6a':'linear-gradient(90deg,#2ef0a0,#5ce1ff)';
  const s=Math.min(5,Math.ceil(heat/14));$('st').textContent='★'.repeat(s)+'☆'.repeat(5-s)}}
let last=0;function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;upd(dt);render();requestAnimationFrame(loop)}
function over(){state='over';snd(70,.8,'sawtooth',.1);
 const nb=score>best;if(nb){best=score;try{localStorage.setItem('mom_best_v4',best)}catch(e){}}
 const r=score>12000?'Legendary menace':score>6000?'Public enemy':score>2500?'Certified nuisance':'Rookie troublemaker';
 $('res').innerHTML='<span class="d" style="font-size:26px;color:var(--hot)">'+score.toLocaleString()+'</span><br>'+r+' · '+Math.floor(time)+'s · '+animal.world.name+(nb?' · New best!':' · Best '+best.toLocaleString());
 $('go').textContent='Roll a new animal';showOv()}
function showOv(){$('ov').classList.remove('h');roll()}
function roll(){const g=$('go');g.disabled=true;$('an').textContent='Rolling…';$('aq').textContent='';$('worldLine').textContent='';let n=0;
 const iv=setInterval(()=>{$('rl').textContent=pick(AN).e;if(++n>14){clearInterval(iv);cur=pick(AN);$('rl').textContent=cur.e;$('an').textContent=cur.n;$('aq').textContent=cur.q;$('worldLine').textContent='World: '+cur.world.name+' · streets change every run';g.disabled=false;g.focus()}},80)}
$('go').onclick=()=>{animal=cur;W=animal.world;setup();state='play';$('ov').classList.add('h');$('an2').textContent=animal.e+' '+animal.n+' · '+animal.world.name+' · '+activeLayout;snd(400,.2,'triangle',.06)};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();
 if(k==' ')wave();else if(k=='shift')dash();else K[k]=1});
addEventListener('keyup',e=>{K[e.key.toLowerCase()]=0});
const jz=$('jz'),kn=$('knob');let jo=null;
jz.addEventListener('pointerdown',e=>{jo={x:e.clientX,y:e.clientY,id:e.pointerId};jz.setPointerCapture(e.pointerId);kn.style.display='block';kn.style.left=e.clientX-45+'px';kn.style.top=e.clientY-45+'px'});
jz.addEventListener('pointermove',e=>{if(!jo||e.pointerId!=jo.id)return;let dx=(e.clientX-jo.x)/50,dy=(e.clientY-jo.y)/50;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}joy.x=dx;joy.y=dy;kn.firstChild.style.transform='translate('+dx*30+'px,'+dy*30+'px)'});
const je=e=>{jo=null;joy.x=joy.y=0;kn.style.display='none';kn.firstChild.style.transform=''};jz.addEventListener('pointerup',je);jz.addEventListener('pointercancel',je);
$('bs').addEventListener('pointerdown',e=>{e.preventDefault();wave()});$('bd').addEventListener('pointerdown',e=>{e.preventDefault();dash()});
animal=AN[0];W=animal.world;setup();
if(isUnlocked()){unlock()}else{$('pay').classList.remove('h');$('ov').classList.add('h')}
requestAnimationFrame(loop);
