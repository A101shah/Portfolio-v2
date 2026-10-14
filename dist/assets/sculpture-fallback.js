/* Software 3D renderer for devices where WebGL is unavailable. Same controls, lower mesh resolution. */
window.startSoftwareSculpture = function(original) {
  'use strict';
  const canvas=original.cloneNode(true);original.replaceWith(canvas);canvas.hidden=false;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return false;
  const stage=document.getElementById('render-stage'),status=document.getElementById('render-status'),pause=document.getElementById('motion-toggle');
  const buttons=[...document.querySelectorAll('[data-shape]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const tau=Math.PI*2,U=88,W=16;let points=[],faces=[],yaw=.35,pitch=.4,paused=reduced.matches,dragging=false,x=0,y=0,frame=0,last=0,visible=true;
  const normalize=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const curve=t=>{const r=1.1+.38*Math.cos(3*t);return [r*Math.cos(2*t),r*Math.sin(2*t),.48*Math.sin(3*t)];};
  function geometry(shape){points=[];faces=[];
    for(let i=0;i<=U;i++)for(let j=0;j<=W;j++){
      const u=i/U*tau,v=j/W*tau;let p,n;
      if(shape==='sphere'){const phi=j/W*Math.PI;n=[Math.sin(phi)*Math.cos(u),Math.cos(phi),Math.sin(phi)*Math.sin(u)];const r=1.3+.06*Math.sin(u*10)*Math.sin(phi*8)*Math.sin(phi);p=n.map(x=>x*r);}
      else if(shape==='torus'){n=[Math.cos(u)*Math.cos(v),Math.sin(v),Math.sin(u)*Math.cos(v)];p=[(1+.38*Math.cos(v))*Math.cos(u),.38*Math.sin(v),(1+.38*Math.cos(v))*Math.sin(u)];}
      else{const c=curve(u),d=curve(u+.002);const t=normalize(d.map((x,k)=>x-c[k])),s=normalize(cross(t,[0,0,1])),up=normalize(cross(s,t));n=s.map((x,k)=>x*Math.cos(v)+up[k]*Math.sin(v));p=c.map((x,k)=>x+.25*n[k]);}
      points.push({p,n});if(i<U&&j<W){const a=i*(W+1)+j,b=(i+1)*(W+1)+j;faces.push([a,b,a+1],[b,b+1,a+1]);}
    }
  }
  const light=normalize([-2,3,4]);
  function draw(){
    const bounds=stage.getBoundingClientRect(),w=bounds.width,h=bounds.height,dpr=Math.min(devicePixelRatio||1,1.5);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const rotate=([x,y,z])=>[cy*x+sy*z,sx*sy*x+cx*y-sx*cy*z,-cx*sy*x+sx*y+cx*cy*z];
    const focal=h*1.48,distance=w/h<.95?6.7:5.9;
    const transformed=points.map(({p,n})=>{const q=rotate(p);return {q,n:rotate(n),x:w/2+q[0]*focal/(distance-q[2]),y:h/2-q[1]*focal/(distance-q[2])};});
    const polygons=faces.map(ids=>{const ps=ids.map(i=>transformed[i]);return {ps,z:ps.reduce((s,p)=>s+p.q[2],0)/3};}).sort((a,b)=>a.z-b.z);
    for(const {ps} of polygons){
      const n=normalize([0,1,2].map(k=>ps.reduce((s,p)=>s+p.n[k],0)/3));
      const diffuse=Math.max(0,n.reduce((s,v,k)=>s+v*light[k],0));
      const rim=Math.pow(1-Math.abs(n[2]),2.5);const spec=Math.pow(Math.max(0,n[0]*-.25+n[1]*.35+n[2]*.90),28);
      const blend=(Math.sin(ps[0].q[1]*2+ps[0].q[0])+1)/2;
      const factor=.45+diffuse*.85;
      const red=Math.min(255,(35+blend*42)*factor+rim*56+spec*125);
      const green=Math.min(255,(72-blend*32)*factor+rim*145+spec*145);
      const blue=Math.min(255,(110+blend*22)*factor+rim*130+spec*155);
      ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);ctx.lineTo(ps[1].x,ps[1].y);ctx.lineTo(ps[2].x,ps[2].y);ctx.closePath();
      ctx.fillStyle=`rgb(${red|0},${green|0},${blue|0})`;ctx.fill();ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.4;ctx.stroke();
    }
  }
  function tick(t){frame=0;if(paused||!visible||document.hidden)return;if(t-last>=33){const dt=Math.min((t-last)/1000,.06);last=t;if(!dragging)yaw+=dt*.18;draw();}frame=requestAnimationFrame(tick);}
  function start(){if(!frame&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function sync(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Resume 3D animation':'Pause 3D animation');pause.setAttribute('aria-pressed',String(paused));}
  pause.addEventListener('click',()=>{paused=!paused;sync();paused?stop():start();});
  buttons.forEach(button=>button.addEventListener('click',()=>{geometry(button.dataset.shape);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));status.textContent=`${button.textContent} · Drag to rotate or use arrow keys`;draw();}));
  document.getElementById('reset-view').addEventListener('click',()=>{yaw=.35;pitch=.4;draw();status.textContent='View reset · Drag to rotate or use arrow keys';});
  canvas.addEventListener('pointerdown',e=>{dragging=true;x=e.clientX;y=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-x)*.008;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-y)*.008));x=e.clientX;y=e.clientY;draw();});
  const release=()=>{dragging=false;canvas.classList.remove('dragging');};for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,release);
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();yaw+=(e.key==='ArrowRight'?.12:e.key==='ArrowLeft'?-.12:0);pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.key==='ArrowDown'?.12:e.key==='ArrowUp'?-.12:0)));draw();});
  new ResizeObserver(draw).observe(stage);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();}).observe(stage);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());reduced.addEventListener('change',e=>{paused=e.matches;sync();paused?stop():start();});
  geometry('knot');sync();draw();canvas.dataset.renderer='software-3d';stage.classList.add('render-ready');status.textContent='Drag to rotate · Arrow keys to explore · Abstract generative sculpture';start();return true;
};
