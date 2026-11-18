/* Animal pick UI - loads after mom-game2 */
(function(){
  let selectedIdx=-1;
  window.buildPickGrid=function(){
    const g=document.getElementById('grid');if(!g)return;g.innerHTML='';
    AN.forEach((a,i)=>{
      const b=document.createElement('button');
      b.type='button';b.innerHTML=a.e+'<span class="nm">'+a.n.split(' ').pop()+'</span>';
      b.onclick=()=>{selectedIdx=i;[...g.querySelectorAll('button')].forEach(x=>x.classList.remove('sel'));b.classList.add('sel');document.getElementById('pickGo').disabled=false};
      g.appendChild(b);
    });
    selectedIdx=-1;document.getElementById('pickGo').disabled=true;
  };
  const pg=document.getElementById('pickGo');
  if(pg) pg.onclick=()=>{
    if(selectedIdx<0)return;
    cur=AN[selectedIdx];animal=cur;W=animal.world;
    document.getElementById('pick').classList.add('h');
    setup();state='play';
    document.getElementById('an2').textContent=animal.e+' '+animal.n+' · '+animal.world.name+' · '+activeLayout;
    snd(400,.2,'triangle',.06);
  };
  const pr=document.getElementById('pickRoll');
  if(pr) pr.onclick=()=>{document.getElementById('pick').classList.add('h');document.getElementById('ov').classList.remove('h');roll();updatePickBtn()};
  const pt=document.getElementById('pickToggle');
  if(pt) pt.onclick=()=>{if(typeof canChoose==='function'&&canChoose())showPick()};
  if(typeof updatePickBtn==='function')updatePickBtn();
})();
