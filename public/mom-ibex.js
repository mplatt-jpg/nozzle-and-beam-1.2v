/* Alpine Ibex abilities */
(function(){
  if(typeof MN==='undefined') window.MN=[];
  const _setup=window.setup||setup;
  const _hitB=window.hitB||hitB;
  const _render=window.render||render;

  window.setup=function(){
    try{ MN=[]; }catch(e){}
    _setup();
    if(pl) pl.mcd=0;
  };

  window.hitB=function(b,n){
    if(animal&&animal.oneHit) n=99;
    return _hitB(b,n);
  };

  window.wave=function(){
    if(state!='play'||pl.scd>0)return;
    pl.scd=(animal&&animal.smashCd)||1.4;
    const Rr=55+240*Math.sqrt(animal.pow);
    WV.push({x:pl.x,y:pl.y,R:Rr,t:0});shake=18;snd(90,.35,'sawtooth',.1);txt(pl.x,pl.y-90,animal.sh,'#fff',38);
    for(const e of E){if(e.dead)continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d<Rr){hit(e,2*animal.pow);if(!e.dead){e.kx+=dx/(d||1)*900;e.ky+=dy/(d||1)*900}}}
    for(const b of B){if(b.park||b.hp<=0)continue;if(Math.hypot(pl.x-clamp(pl.x,b.x,b.x+b.w),pl.y-clamp(pl.y,b.y,b.y+b.h))<Rr)hitB(b,2*animal.pow)}
  };

  window.placeMine=function(){
    if(state!='play'||!animal||!animal.mines||(pl.mcd||0)>0)return;
    pl.mcd=1.8;
    MN.push({x:pl.x,y:pl.y,t:2.2,r:100,boom:0});
    snd(180,.12,'triangle',.06);txt(pl.x,pl.y-40,'MINE','#ffe14a',20);
  };

  addEventListener('keydown',function(e){
    const k=e.key.toLowerCase();
    if(k==='e'||k==='f'){e.preventDefault();placeMine();}
  });

  let lastHook=0;
  function ibexHook(t){
    requestAnimationFrame(ibexHook);
    if(state!=='play'||!pl||!animal) return;
    const dt=Math.min(.033,(t-lastHook)/1000||0.016);lastHook=t;
    pl.mcd=(pl.mcd||0)-dt;

    if(animal.fly){
      const pr=animal.s*.28;
      for(const b of B){
        if(b.park||b.hp<=0)continue;
        const cx=clamp(pl.x,b.x,b.x+b.w),cy=clamp(pl.y,b.y,b.y+b.h);
        const dx=pl.x-cx,dy=pl.y-cy,d=Math.hypot(dx,dy);
        if(d<pr&&d>0){pl.x+=dx/d*(pr-d)*0.25;pl.y+=dy/d*(pr-d)*0.25}
        if(pl.dash>0&&d<pr+10&&b.hitT<=0){hitB(b,animal.pow*2);pl.dash=0}
      }
    }

    for(const m of MN){
      if(m.boom){m.boom-=dt;continue}
      m.t-=dt;
      if(m.t<=0){
        m.boom=.4;burst(m.x,m.y,30,['#ff3d6a','#ffe14a','#fff','#5ce1ff'],650);snd(70,.35,'sawtooth',.1);shake=Math.max(shake,18);
        for(const e of E){if(e.dead)continue;if(Math.hypot(e.x-m.x,e.y-m.y)<m.r)hit(e,4)}
        for(const b of B){if(b.park||b.hp<=0)continue;if(Math.hypot(clamp(m.x,b.x,b.x+b.w)-m.x,clamp(m.y,b.y,b.y+b.h)-m.y)<m.r)hitB(b,animal.oneHit?99:3)}
      }
    }
    MN=MN.filter(m=>m.t>0||(m.boom&&m.boom>0));
  }
  requestAnimationFrame(ibexHook);

  window.render=function(){
    _render();
    if(!MN||!MN.length)return;
    try{
      const vw=VW/Z,vh=VH/Z;
      ctx.setTransform(dpr*Z,0,0,dpr*Z,(-(cam.x-vw/2))*dpr*Z,(-(cam.y-vh/2))*dpr*Z);
      for(const m of MN){
        if(m.boom&&m.boom>0){
          ctx.globalAlpha=Math.min(1,m.boom*3);ctx.strokeStyle='#ff3d6a';ctx.lineWidth=8;
          ctx.beginPath();ctx.arc(m.x,m.y,m.r*(1-m.boom),0,7);ctx.stroke();ctx.globalAlpha=1;continue;
        }
        ctx.fillStyle=m.t<0.6?(Math.floor(time*8)%2?'#ff3d6a':'#ffe14a'):'#2a3148';
        ctx.beginPath();ctx.arc(m.x,m.y,12,0,7);ctx.fill();
        ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;ctx.stroke();
      }
    }catch(e){}
  };
})();
