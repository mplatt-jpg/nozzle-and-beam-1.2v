
function buildRoute(){
 const th=+$('rin').value/100,ids=crowns.filter(c=>c.p>=th).slice(0,400);
 if(!ids.length){route=[];rp=[];$('rsum').textContent='No crowns at this threshold.';draw();panel();return}
 const s=start||{x:W*.03,y:H*.97},d=(a,b)=>Math.hypot(a.cx-b.cx,a.cy-b.cy);
 let cur={cx:s.x,cy:s.y};const left=new Set(ids),P=[cur];
 while(left.size){let b=null,bd=1e18;left.forEach(c=>{const q=d(cur,c);if(q<bd){bd=q;b=c}});P.push(b);left.delete(b);cur=b}
 let imp=true,it=0;
 while(imp&&it++<25){imp=false;for(let i=1;i<P.length-1;i++)for(let j=i+1;j<P.length;j++){
  const a=P[i-1],b=P[i],c=P[j],e=P[j+1],bf=d(a,b)+(e?d(c,e):0),af=d(a,c)+(e?d(b,e):0);
  if(af<bf-1e-6){P.splice(i,j-i+1,...P.slice(i,j+1).reverse());imp=true}}}
 route=P.slice(1).map(c=>crowns.indexOf(c));rp=[{x:s.x,y:s.y},...P.slice(1).map(c=>({x:c.cx,y:c.cy}))];
 let L=0;for(let i=1;i<rp.length;i++)L+=Math.hypot(rp[i].x-rp[i-1].x,rp[i].y-rp[i-1].y);
 const wm=+$('wm').value,rem=ids.filter(c=>c.p>=.7).length,m=wm>0?L*wm/W:0;
 $('rsum').textContent=`${route.length} stops (${rem} remove, ${route.length-rem} inspect) · `+(m?`${Math.round(m)} m, about ${Math.max(1,Math.ceil(m/50))} min walking`:`${Math.round(L)} px. Enter the image width in meters for real distance`);
 draw();panel();updateGuide()}
function drawRoute(){if(!rp.length)return;const X=p=>p.x*view.s+view.x,Y=p=>p.y*view.s+view.y;
 ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();rp.forEach((p,i)=>i?ctx.lineTo(X(p),Y(p)):ctx.moveTo(X(p),Y(p)));
 ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='#00e5ff';ctx.lineWidth=3;ctx.stroke();
 for(let i=1;i<rp.length;i++){const ax=X(rp[i-1]),ay=Y(rp[i-1]),bx=X(rp[i]),by=Y(rp[i]);if(Math.hypot(bx-ax,by-ay)<50)continue;
  ctx.save();ctx.translate((ax+bx)/2,(ay+by)/2);ctx.rotate(Math.atan2(by-ay,bx-ax));ctx.fillStyle='#00e5ff';ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-6);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
 const lab=route.length<=80||view.s/view.min>1.5;ctx.textAlign='center';
 route.forEach((ci,n)=>{const c=crowns[ci],x=c.cx*view.s+view.x,y=c.cy*view.s+view.y;if(x<-20||y<-20||x>box.w+20||y>box.h+20)return;
  ctx.fillStyle=act(c).c;ctx.strokeStyle=ci==sel?'#00e5ff':(c.insp?'#22c55e':'#fff');ctx.lineWidth=2;const r=lab?11:5;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();
  if(lab){ctx.fillStyle='#fff';ctx.font='700 11px system-ui';ctx.fillText(n+1,x,y+4)}});
 const sx=X(rp[0]),sy=Y(rp[0]);ctx.fillStyle='#22c55e';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy,12,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='700 12px system-ui';ctx.fillText('S',sx,sy+4);ctx.textAlign='left'}
$('rbuild').onclick=buildRoute;$('rin').onchange=buildRoute;$('wm').oninput=()=>{if(route.length)buildRoute()};
$('rset').onclick=()=>{setting=!setting;$('rset').classList.toggle('on',setting);status(setting?'Click the photo to place the start point':'')};
$('rnext').onclick=()=>{if(route.length)select(route[(route.indexOf(sel)+1)%route.length],true)};
$('rclr').onclick=()=>{route=[];rp=[];start=null;$('rsum').textContent='';draw();panel()};
let gmsg='',gps=null,calib=[],tf=null,me=null,tgt=-1,trackOn=false,watchId=null,placing=false,arrivedFor=-1,lastT=-2;
const avg=a=>[a.reduce((s,p)=>s+p[0],0)/a.length,a.reduce((s,p)=>s+p[1],0)/a.length];
const CARD=['north','northeast','east','southeast','south','southwest','west','northwest'];
function say(t){if(!$('gvoice').checked)return;try{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}catch(e){}}
function showSheet(h,nx){$('sbody').innerHTML=h+(nx?'<button class="on" id="snx" style="width:100%;margin-top:8px">Next tree ▶</button>':'');$('sheet').style.display='block';const b=$('snx');if(b)b.onclick=()=>{closeSheet();goTarget()}}
function closeSheet(){$('sheet').style.display='none'}
$('sx').onclick=closeSheet;
function setCal(){$('gcal').textContent=calib.length==0?'Not calibrated':calib.length==1?(tf?'1 pin, assuming north is up':'1 pin: enter image width (m) above'):(tf?calib.length+' pins, fitted':'Pins too close together')}
function fitTf(){
 if(!calib.length){tf=null;return}
 const o=calib[0],W0=p=>[(p.lon-o.lon)*111320*Math.cos(o.lat*Math.PI/180),(p.lat-o.lat)*110540];
 const U=calib.map(p=>[p.x,-p.y]),Wm=calib.map(W0);
 if(calib.length==1){const wm=+$('wm').value;if(!(wm>0)){tf=null;return}const k=wm/W;tf={a:[k,0],b:[Wm[0][0]-k*U[0][0],Wm[0][1]-k*U[0][1]],W0};return}
 const mu=avg(U),mw=avg(Wm);let nr=0,ni=0,dn=0;
 U.forEach((u,i)=>{const du=[u[0]-mu[0],u[1]-mu[1]],dw=[Wm[i][0]-mw[0],Wm[i][1]-mw[1]];nr+=du[0]*dw[0]+du[1]*dw[1];ni+=du[0]*dw[1]-du[1]*dw[0];dn+=du[0]*du[0]+du[1]*du[1]});
 if(dn<1e-6){tf=null;return}
 const a=[nr/dn,ni/dn];tf={a,b:[mw[0]-(a[0]*mu[0]-a[1]*mu[1]),mw[1]-(a[0]*mu[1]+a[1]*mu[0])],W0}}
function toImg(p){const w=tf.W0(p),d0=w[0]-tf.b[0],d1=w[1]-tf.b[1],a0=tf.a[0],a1=tf.a[1],q=a0*a0+a1*a1;return{x:(d0*a0+d1*a1)/q,y:-((d1*a0-d0*a1)/q)}}
function nextStop(from){const n=route.length;for(let k=1;k<=n;k++){const ci=route[(from+k+n)%n];if(!crowns[ci].insp)return ci}return -1}
function goNext(){if(!route.length){status('Trace a route first');return}
 const from=tgt>=0?route.indexOf(tgt):route.indexOf(sel);tgt=nextStop(from);
 if(tgt<0){updateGuide(true);status('All route trees inspected');return}
 select(tgt,true);updateGuide(true)}
function goTarget(){if(tgt>=0&&crowns[tgt]){select(tgt,true);updateGuide(true)}else goNext()}
function afterInspect(c){if(!route.length)return;tgt=nextStop(route.indexOf(crowns.indexOf(c)));updateGuide(true)}
function updateGuide(announce){const g=$('guide');
 if(trackOn&&!me&&gmsg){g.style.display='flex';$('gtxt').textContent='GPS';$('gsub').textContent=gmsg;$('garr').style.visibility='hidden';return}
 if(!route.length||!(trackOn||me)){g.style.display='none';return}
 if(tgt<0||route.indexOf(tgt)<0||crowns[tgt].insp)tgt=nextStop(route.indexOf(tgt));
 g.style.display='flex';
 if(tgt<0){$('gtxt').textContent='All route trees done';$('gsub').textContent='Save the field log';$('garr').style.visibility='hidden';return}
 $('garr').style.visibility='visible';
 const c=crowns[tgt],n=route.indexOf(tgt)+1,lab=`tree ${n} of ${route.length}`;
 if(!me){$('gtxt').textContent='Go to '+lab;$('gsub').textContent=gps?'Stand at a marked tree, select it, then tap “I’m at this tree”':'Waiting for GPS, or tap Place me';return}
 const mpp=tf?Math.hypot(tf.a[0],tf.a[1]):(+$('wm').value>0?+$('wm').value/W:0),dx=c.cx-me.x,dy=c.cy-me.y;
 let ee,nn;if(tf){ee=tf.a[0]*dx+tf.a[1]*dy;nn=-tf.a[0]*dy+tf.a[1]*dx}else{ee=dx*(mpp||1);nn=-dy*(mpp||1)}
 const dist=Math.hypot(ee,nn),br=(Math.atan2(ee,nn)*180/Math.PI+360)%360,ci=Math.round(br/45)%8,hd=gps&&gps.hd!=null&&!isNaN(gps.hd)?gps.hd:0;
 $('garr').style.transform=`rotate(${br-hd}deg)`;
 if(mpp&&dist<=7){$('gtxt').textContent='You are at '+lab;$('gsub').textContent='Tap the camera button to inspect it';
  if(arrivedFor!==tgt){arrivedFor=tgt;if(sel!==tgt)select(tgt,false);say('You have arrived at '+lab+'. Take a photo.');try{navigator.vibrate&&navigator.vibrate(250)}catch(e){}}return}
 $('gtxt').textContent='Go to '+lab;$('gsub').textContent=`${Math.round(dist)} ${mpp?'m':'px'} · ${CARD[ci]}`;
 if(announce||lastT!==tgt){lastT=tgt;say(`Go to ${lab}. ${Math.round(dist)} ${mpp?'meters':''} ${CARD[ci]}.`)}}
function drawMe(){if(!me)return;const x=me.x*view.s+view.x,y=me.y*view.s+view.y;
 if(tgt>=0&&crowns[tgt]){const c=crowns[tgt];ctx.setLineDash([6,5]);ctx.strokeStyle='#4da3ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(c.cx*view.s+view.x,c.cy*view.s+view.y);ctx.stroke();ctx.setLineDash([])}
 if(gps&&tf&&gps.acc){const r=gps.acc/Math.hypot(tf.a[0],tf.a[1])*view.s;if(r>8){ctx.fillStyle='rgba(77,163,255,.18)';ctx.beginPath();ctx.arc(x,y,Math.min(r,300),0,7);ctx.fill()}}
 ctx.fillStyle='#2f7bff';ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();ctx.stroke()}
function stopTrack(){if(watchId!=null&&navigator.geolocation)navigator.geolocation.clearWatch(watchId);watchId=null;trackOn=false;$('gtrk').classList.remove('on');$('gtrk').textContent='Track me';updateGuide()}
$('gtrk').onclick=()=>{if(trackOn){stopTrack();return}
 if(!navigator.geolocation){geoDiag().then(r=>showSheet('<div class="adv">Location is not available in this view. '+r.join(' / ')+'. Use Place me instead.</div>'));return}gmsg='Waiting for GPS...';setTimeout(()=>{if(trackOn&&!gps){gmsg='No GPS yet. If this stays blank, location is probably blocked in this view. Try Place me.';updateGuide()}},12000);
 trackOn=true;$('gtrk').classList.add('on');$('gtrk').textContent='Stop tracking';status('Waiting for GPS…');
 watchId=navigator.geolocation.watchPosition(p=>{gps={lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy,hd:p.coords.heading};status('GPS ±'+Math.round(gps.acc)+' m');gotFix()},
  e=>gpsErr(e),{enableHighAccuracy:true,maximumAge:2000,timeout:30000});
 updateGuide(true)};
$('gpin').onclick=()=>{if(!gps){status('Tap Track me first and wait for a GPS fix');return}if(sel<0){status('Select the tree you are standing at');return}
 const c=crowns[sel];calib.push({x:c.cx,y:c.cy,lat:gps.lat,lon:gps.lon});fitTf();if(tf)me=toImg(gps);setCal();updateGuide(true);draw()};
$('gclr').onclick=()=>{calib=[];tf=null;me=null;setCal();updateGuide();draw()};
$('gman').onclick=()=>{placing=!placing;$('gman').classList.toggle('on',placing);status(placing?'Tap the photo where you are standing':'')};
$('wm').addEventListener('input',()=>{if(calib.length==1){fitTf();if(gps&&tf)me=toImg(gps);setCal()}updateGuide();draw()});
async function geoDiag(){const r=[];r.push('Location API: '+(navigator.geolocation?'present':'missing'));
 try{const pp=document.permissionsPolicy||document.featurePolicy;if(pp&&pp.allowsFeature)r.push('Page allowed to use location: '+pp.allowsFeature('geolocation'))}catch(e){}
 try{const q=await navigator.permissions.query({name:'geolocation'});r.push('Browser permission: '+q.state)}catch(e){}
 return r}
function gotFix(){status('GPS \u00b1'+Math.round(gps.acc)+' m');
 if(tf){me=toImg(gps);gmsg=''}else gmsg='GPS is working: '+gps.lat.toFixed(5)+', '+gps.lon.toFixed(5)+' (\u00b1'+Math.round(gps.acc)+' m). Now select the tree you are standing at and tap I\u2019m at this tree.';
 updateGuide();draw()}
function gpsErr(e){
 if(e.code==1){stopTrack();geoDiag().then(r=>showSheet('<div class="ban" style="background:#7a5bb0">Location is blocked<small>This page is not being allowed to read your GPS</small></div><div class="mu">Checks: '+r.join(' / ')+'</div><ul class="mu"><li>If your phone asked and you tapped Don\u2019t allow, turn Location on for your browser in phone settings, then reload.</li><li>Workaround: tap <b>Place me</b>, then tap the map where you are standing.</li></ul>'));return}
 gmsg=e.code==3?'No GPS fix yet. Move to open sky and wait.':'GPS unavailable right now.';status(gmsg);updateGuide()}
$('gvoice').onchange=()=>{if($('gvoice').checked)say('Voice guidance on')};
$('gskip').onclick=goNext;$('rnext').onclick=goNext;
$('zm').onclick=()=>{if(!me){status('Track me or Place me first');return}const s=Math.min(MAXS,Math.max(view.s,view.min*4));view.s=s;view.x=box.w/2-me.x*s;view.y=box.h/2-me.y*s;clampView();draw()};
$('fab').onclick=()=>{if(sel<0){if(tgt>=0)select(tgt,false);else if(route.length)select(route[0],false);else{status('Tap a tree on the map first');return}}$('fabf').click()};
$('fabf').onchange=e=>{const f=e.target,c=crowns[sel];if(c&&f.files.length)inspect(c,[...f.files].slice(0,3));f.value=''};
setCal();
S.forEach((s,i)=>{const b=document.createElement('button');b.textContent=s[0];b.onclick=()=>{vid=null;cur=-1;thumbs();$('scanv').disabled=true;document.querySelectorAll('#samples button').forEach(x=>x.classList.remove('on'));b.classList.add('on');sample(i)};$('samples').appendChild(b)});
resize();$('samples').firstChild.click();
