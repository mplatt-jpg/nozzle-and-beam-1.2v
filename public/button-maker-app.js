(function(){
  var PW="J-Ocomingtowin", KEY="button_maker_unlocked_v1";
  function unlock(){
    document.getElementById("gate").classList.add("h");
    document.getElementById("app").classList.remove("h");
    try{sessionStorage.setItem(KEY,"1")}catch(e){}
  }
  function tryUnlock(){
    var v=(document.getElementById("pw").value||"").trim();
    if(v===PW){unlock();return}
    document.getElementById("err").textContent="Wrong password. Try again.";
  }
  document.getElementById("unlock").addEventListener("click",tryUnlock);
  document.getElementById("pw").addEventListener("keydown",function(e){if(e.key==="Enter")tryUnlock()});
  try{if(sessionStorage.getItem(KEY)==="1")unlock()}catch(e){}
})();

const $=id=>document.getElementById(id);
const FONT="'Arial Black',Impact,'Helvetica Neue',Arial,sans-serif";
const base={name:'Photo button',text:'',text2:'',tc:'#ffffff',bg:'#ffffff',bg2:'#ffffff',rc:'#0a7d5a',rw:.12,zm:1,tpos:0,glow:0,dots:0,logo:0,teamOn:0,team:'',curve:0,faceOn:0,face:null,fs:.45,fxo:0,fyo:-.05,fz:1,fcx:.5,fcy:.45,bs:'ring',qty:1,ox:0,oy:0,photo:null,border:null};
const P=[
 {name:'Good Luck',text:'GOOD\nLUCK!',text2:'Bio Glow 2026',tc:'#8dffd0',bg:'#06303a',bg2:'#010b10',rc:'#2bb3c0',glow:1,dots:1,logo:1,teamOn:1},
 {name:'Glow Getters',text:'GLOW\nGETTERS',text2:'Shine bright out there',tc:'#d6b8ff',bg:'#2a1058',bg2:'#07021a',rc:'#38d7ff',glow:1,dots:1},
 {name:'You Got This',text:'YOU\nGOT THIS',text2:'Bio Glow crew',tc:'#a8ff5a',bg:'#0a3a66',bg2:'#020e22',rc:'#8ff0ff',glow:1,dots:1}];
let D=P.map((p,i)=>({...base,...p,qty:[2,1,1,2][i]||1})),cur=0,tm=0;
const cd=()=>D[cur];
const LOGO=new Image();LOGO.onload=()=>draw();LOGO.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="%232fc68f"/><stop offset="1" stop-color="%230a7d5a"/></linearGradient></defs><circle cx="60" cy="60" r="54" fill="%23061014" stroke="url(%23g)" stroke-width="6"/><path d="M40 72c8-28 32-40 48-36-12 8-22 24-22 40 0 14 8 22 18 26-20 2-36-8-44-30z" fill="url(%23g)"/><circle cx="78" cy="38" r="6" fill="%238dffd0"/></svg>';
function chips(){$('chips').innerHTML='';D.forEach((d,i)=>{const b=document.createElement('button');b.className='s'+(i===cur?' on':'');b.textContent=`${d.name} ×${d.qty}`;b.onclick=()=>{cur=i;fields();draw()};$('chips').appendChild(b)})}
P.forEach(p=>{const b=document.createElement('button');b.className='s';b.textContent='+ '+p.name;b.onclick=()=>{D.push({...base,...p});cur=D.length-1;fields();draw()};$('pre').appendChild(b)});
function fields(){document.querySelectorAll('[data-k]').forEach(e=>{const v=cd()[e.dataset.k];e.type==='checkbox'?e.checked=!!v:e.value=v});chips()}
document.querySelectorAll('[data-k]').forEach(e=>e.oninput=()=>{const k=e.dataset.k;let v=e.type==='checkbox'?(e.checked?1:0):e.value;if(e.type==='range'||e.type==='number'||k==='tpos')v=+v;cd()[k]=v;if(k==='name'||k==='qty')chips();draw()});
$('addb').onclick=()=>{D.push({...base});cur=D.length-1;fields();draw()};
$('dup').onclick=()=>{D.push({...cd()});cur=D.length-1;fields();draw()};
$('del').onclick=()=>{if(D.length<2)return;D.splice(cur,1);cur=0;fields();draw()};
$('fill').onclick=()=>{const n=slots(),k=D.length;D.forEach((d,i)=>d.qty=Math.floor(n/k)+(i<n%k?1:0));fields();draw()};
function load(f,cb){const go=b=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>cb(i);i.onerror=()=>alert('Could not read that picture. Try a JPG or PNG.');i.src=r.result};r.readAsDataURL(b)};
 if(/\.hei[cf]$/i.test(f.name)||/hei[cf]/i.test(f.type)){if(window.heic2any)heic2any({blob:f,toType:'image/jpeg',quality:.92}).then(b=>go(Array.isArray(b)?b[0]:b)).catch(()=>alert('Could not open that HEIC picture. Try a JPG or PNG.'));else alert('HEIC pictures are not supported in this browser. Try a JPG or PNG.')}else go(f)}
$('pf').onchange=e=>e.target.files[0]&&load(e.target.files[0],i=>{cd().photo=i;cd().ox=cd().oy=0;draw()});
$('bf').onchange=e=>e.target.files[0]&&load(e.target.files[0],i=>{cd().border=i;draw()});
$('nb').onclick=()=>{const d=cd();d.photo=d.border=d.face=null;d.faceOn=0;$('pf').value=$('bf').value=$('ff').value='';fields();draw()};
['sz','wr','gp','mg','gd','pm','pn','ps','rl'].forEach(k=>$(k).oninput=draw);
function R(d,px){
 const fin=+$('sz').value,cut=fin+(+$('wr').value),W=px,F=fin/cut*W;
 const c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 x.save();x.beginPath();x.arc(W/2,W/2,W/2,0,7);x.clip();
 const g=x.createRadialGradient(W/2,W/2,0,W/2,W/2,W/2);g.addColorStop(0,d.bg);g.addColorStop(1,d.bg2);x.fillStyle=g;x.fillRect(0,0,W,W);
 if(d.dots){let s=7;const r=()=>(s=s*16807%2147483647)/2147483647;
  for(let i=0;i<46;i++){const a=r()*6.28,rr=Math.sqrt(r())*.47*W,px_=W/2+Math.cos(a)*rr,py=W/2+Math.sin(a)*rr,z=(.006+r()*.016)*W;
   const h=x.createRadialGradient(px_,py,0,px_,py,z*3);h.addColorStop(0,d.tc);h.addColorStop(1,d.tc+'00');x.globalAlpha=.25+r()*.5;x.fillStyle=h;x.beginPath();x.arc(px_,py,z*3,0,7);x.fill()}x.globalAlpha=1}
 if(d.photo){const s=Math.max(W/d.photo.width,W/d.photo.height)*d.zm,w=d.photo.width*s,h=d.photo.height*s;x.drawImage(d.photo,(W-w)/2+d.ox*W,(W-h)/2+d.oy*W,w,h)}
 if(d.border)x.drawImage(d.border,0,0,W,W);
 else{if(!d.photo){x.fillStyle=d.bg2;x.beginPath();x.arc(W/2,W/2,W/2,0,7);x.arc(W/2,W/2,F/2,0,7,true);x.fill('evenodd')}x.fillStyle=d.rc;x.beginPath();x.arc(W/2,W/2,F/2,0,7);x.arc(W/2,W/2,Math.max(F/2-d.rw/cut*W,0),0,7,true);x.fill('evenodd')}
 x.restore();
 if(d.faceOn&&d.face){const im=d.face,iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,side=Math.min(iw,ih)/d.fz,sx=Math.min(Math.max(d.fcx*iw-side/2,0),iw-side),sy=Math.min(Math.max(d.fcy*ih-side/2,0),ih-side),fd=F*d.fs,fx=W/2+d.fxo*F,fy=W/2+d.fyo*F;
 x.save();if(d.glow){x.shadowColor=d.tc;x.shadowBlur=F*.04}x.beginPath();x.arc(fx,fy,fd/2,0,7);x.fillStyle='#fff';x.fill();x.restore();
 x.save();x.beginPath();x.arc(fx,fy,fd/2,0,7);x.clip();x.drawImage(im,sx,sy,side,side,fx-fd/2,fy-fd/2,fd,fd);x.restore();
 x.lineWidth=F*.014;x.strokeStyle=d.tc;x.beginPath();x.arc(fx,fy,fd/2,0,7);x.stroke()}
 const lines=d.text?d.text.split('\n'):[],sub=d.text2,maxW=F*.74,blocks=[];
 const fit=(t,s,wt)=>{x.font=`${wt} ${s}px ${FONT}`;const w=x.measureText(t).width;return w>maxW?s*maxW/w:s};
 const C=d.curve;
 if(!C)lines.forEach(t=>{if(t.trim())blocks.push([t,fit(t,d.logo?(d.teamOn?F*.13:F*.16):F*.24,900)])});
 if(blocks.length>1){const m=Math.min(...blocks.map(b=>b[1]));blocks.forEach(b=>b[1]=m)}
 if(sub)blocks.push([sub,Math.min(fit(sub,F*.08,700),F*.08),700]);
 if(C){const rc=F*.33;let s=F*.12;const str=d.text.replace(/\n/g,' ');x.font=`900 ${s}px ${FONT}`;let tw=x.measureText(str).width;const mx=rc*2.3;if(tw>mx){s*=mx/tw;x.font=`900 ${s}px ${FONT}`;tw=mx}
 x.textAlign='center';x.textBaseline='middle';let phi=-tw/rc/2;
 for(const ch of str){const cw=x.measureText(ch).width,a=phi+cw/rc/2;x.save();x.translate(W/2+Math.sin(a)*rc,W/2+Math.cos(a)*rc);x.rotate(-a);
  if(d.photo){x.lineWidth=s*.14;x.lineJoin='round';x.strokeStyle='#000a';x.strokeText(ch,0,0)}
  x.fillStyle=d.tc;if(d.glow){x.shadowColor=d.tc;x.shadowBlur=F*.05;x.fillText(ch,0,0)}x.fillText(ch,0,0);x.restore();phi+=cw/rc}}
 if(blocks.length===0)return c;
 const hs=blocks.map(b=>b[1]*1.1),tot=hs.reduce((a,b)=>a+b,0);
 let y=W/2+d.tpos*F*.2-tot/2+(C?(d.logo?F*.06:0):(d.logo?(d.teamOn?F*.1:F*.27):0));x.textAlign='center';x.textBaseline='middle';
 blocks.forEach((b,i)=>{y+=hs[i]/2;x.font=`${b[2]||900} ${b[1]}px ${FONT}`;
  if(d.photo){x.lineWidth=b[1]*.14;x.lineJoin='round';x.strokeStyle='#000a';x.strokeText(b[0],W/2,y)}
  x.fillStyle=d.tc;if(d.glow){x.shadowColor=d.tc;x.shadowBlur=F*.05;x.fillText(b[0],W/2,y);x.fillText(b[0],W/2,y);x.shadowBlur=0}
  x.fillText(b[0],W/2,y);y+=hs[i]/2});
 return c}
function grid(){const fin=+$('sz').value,cut=fin+(+$('wr').value),g=+$('gp').value,m=+$('mg').value;
 return{cut,g,m,cols:Math.floor((11-2*m+g)/(cut+g)),rows:Math.floor((8.5-2*m+g)/(cut+g))}}
const slots=()=>{const q=grid();return Math.max(q.cols*q.rows,0)};
function draw(){const p=$('pv').getContext('2d');p.clearRect(0,0,480,480);p.drawImage(R(cd(),480),0,0);chips();clearTimeout(tm);tm=setTimeout(sheet,150)}
function sheet(){
 const q=grid(),sh=$('sheet');sh.innerHTML='';sh.className=$('gd').value==='1'?'g':'';
 if(q.cols<1||q.rows<1){$('info').textContent='Button is too big for the page.';return}
 const one=$('pm').value==='one',urls=D.map((d,i)=>(one?i===cur:d.qty>0)?R(d,Math.round(q.cut*300)).toDataURL('image/png'):null),list=[];
 D.forEach((d,i)=>{const n=one?(i===cur?Math.max(+$('pn').value||1,1):0):d.qty;for(let k=0;k<n;k++)list.push(urls[i])});
 const n=q.cols*q.rows,gw=q.cols*q.cut+(q.cols-1)*q.g,gh=q.rows*q.cut+(q.rows-1)*q.g,sx=(11-gw)/2,sy=(8.5-gh)/2;
 list.slice(0,n).forEach((u,i)=>{const r=Math.floor(i/q.cols),c=i%q.cols,im=new Image();im.src=u;
  const f=(+$('ps').value||100)/100,L=(sx+c*(q.cut+q.g)+q.cut/2)/11*100,T=(sy+r*(q.cut+q.g)+q.cut/2)/8.5*100,w=q.cut/11*100*f,h=q.cut/8.5*100*f;im.style.cssText=`left:${50+(L-50)*f-w/2}%;top:${50+(T-50)*f-h/2}%;width:${w}%;height:${h}%`;sh.appendChild(im)});if($('rl').value==='1'){const rd=document.createElement('div');rd.style.cssText=`position:absolute;left:${4.5/11*100}%;top:${8.2/8.5*100}%;width:${2/11*100}%;border-top:3px solid #000;font:10px sans-serif;color:#000;text-align:center;padding-top:2px`;rd.textContent='this line = 2 in';sh.appendChild(rd)}
 const t=list.length;$('info').textContent=`${Math.min(t,n)} of ${n} spots used (${q.cols} × ${q.rows}).`+(t>n?` ${t-n} extra copies won’t fit; lower the copies.`:t<n?' Use “Fill page evenly” to fill the rest.':'')}
let dr=null;const pv=$('pv');
pv.onpointerdown=e=>{dr=[e.clientX,e.clientY,cd().ox,cd().oy];pv.setPointerCapture(e.pointerId)};
pv.onpointermove=e=>{if(!dr)return;const w=pv.clientWidth;cd().ox=dr[2]+(e.clientX-dr[0])/w;cd().oy=dr[3]+(e.clientY-dr[1])/w;draw()};
pv.onpointerup=()=>dr=null;
$('pr').onclick=()=>{sheet();setTimeout(()=>{try{window.print()}catch(e){alert('Printing is blocked inside this page. Open the page in its own browser tab and try again, or press the Make a picture of the sheet button.')}},200)};
function crc32(b){let c,t=crc32.t;if(!t){t=crc32.t=[];for(let n=0;n<256;n++){c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}let r=-1;for(const v of b)r=t[(r^v)&255]^(r>>>8);return(r^-1)>>>0}
function withDpi(url){const bin=atob(url.split(',')[1]),a=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);const d=new Uint8Array(13),dv=new DataView(d.buffer);d.set([112,72,89,115],0);dv.setUint32(4,11811);dv.setUint32(8,11811);d[12]=1;const ch=new Uint8Array(21),cv=new DataView(ch.buffer);cv.setUint32(0,9);ch.set(d,4);cv.setUint32(17,crc32(d));const out=new Uint8Array(a.length+21);out.set(a.subarray(0,33));out.set(ch,33);out.set(a.subarray(33),54);let s='';for(let i=0;i<out.length;i+=8192)s+=String.fromCharCode.apply(null,out.subarray(i,i+8192));return 'data:image/png;base64,'+btoa(s)}
$('mk').onclick=async()=>{sheet();await new Promise(r=>setTimeout(r,300));const c=document.createElement('canvas');c.width=3300;c.height=2550;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,3300,2550);const g=$('gd').value==='1';
 for(const im of $('sheet').querySelectorAll('img')){try{await im.decode()}catch(e){}const L=parseFloat(im.style.left)/100*3300,T=parseFloat(im.style.top)/100*2550,Wd=parseFloat(im.style.width)/100*3300,Hd=parseFloat(im.style.height)/100*2550;x.drawImage(im,L,T,Wd,Hd);if(g){x.strokeStyle='#999';x.lineWidth=2;x.beginPath();x.arc(L+Wd/2,T+Hd/2,Wd/2-1,0,7);x.stroke()}}
 if($('rl').value==='1'){x.fillStyle='#000';x.fillRect(1350,2460,600,5);x.font='26px sans-serif';x.textAlign='center';x.fillText('this line = 2 in',1650,2450)}const o=$('out');o.src=withDpi(c.toDataURL('image/png'));o.style.display='block';$('outh').style.display='block';o.scrollIntoView()};
$('ff').onchange=e=>e.target.files[0]&&load(e.target.files[0],setFace);
function setFace(i){const d=cd();d.face=i;d.faceOn=1;d.fcx=.5;d.fcy=.45;d.fz=1;
 if(window.FaceDetector){try{new FaceDetector().detect(i).then(r=>{if(r[0]){const b=r[0].boundingBox;d.fcx=(b.x+b.width/2)/i.naturalWidth;d.fcy=(b.y+b.height/2)/i.naturalHeight;d.fz=Math.min(4,Math.max(1,Math.min(i.naturalWidth,i.naturalHeight)/(b.width*1.9)));fields();draw()}}).catch(()=>{})}catch(e){}}
 fields();draw()}
let stream=null;
$('cam').onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});$('vid').srcObject=stream;$('vid').style.display='block';$('snap').style.display='inline-block'}catch(e){alert('Webcam is blocked or not available here. Use the file box above instead; on a phone it opens the camera.')}};
$('snap').onclick=()=>{const v=$('vid'),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);stream.getTracks().forEach(t=>t.stop());v.style.display=$('snap').style.display='none';const i=new Image();i.onload=()=>setFace(i);i.src=c.toDataURL('image/jpeg',.92)};
fields();draw();
