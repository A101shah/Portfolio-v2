/* Dependency-free WebGL sculpture: indexed geometry, lit surfaces, pointer and keyboard orbit. */
(() => {
  'use strict';
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const stage = document.getElementById('render-stage');
  const status = document.getElementById('render-status');
  const pause = document.getElementById('motion-toggle');
  const shapeButtons = [...document.querySelectorAll('[data-shape]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let gl;
  try { gl = canvas.getContext('webgl', {alpha:true, antialias:true, powerPreference:'low-power'}); } catch (_) {}
  const fallback = () => {
    if (window.startSoftwareSculpture?.(canvas)) return;
    stage.classList.remove('render-ready');
    canvas.hidden = true;
    status.textContent = 'Static sculpture · Interactive 3D is unavailable in this browser.';
    document.querySelector('.render-controls').hidden = true;
  };
  if (!gl) { fallback(); return; }
  const vertexSource = `attribute vec3 position; attribute vec3 normal;
    uniform mat4 projection; uniform mat4 model; varying vec3 N; varying vec3 V; varying vec3 P;
    void main(){ vec4 p=model*vec4(position,1.0); P=position; V=p.xyz; N=mat3(model)*normal;
    gl_Position=projection*p; }`;
  const fragmentSource = `precision mediump float; varying vec3 N; varying vec3 V; varying vec3 P;
    uniform float time; uniform float lightTheme;
    void main(){vec3 n=normalize(N); vec3 v=normalize(-V);
    vec3 l=normalize(vec3(-2.0,3.0,4.0)); vec3 r=normalize(vec3(3.0,-1.0,1.0));
    float diffuse=max(dot(n,l),0.0); float edge=pow(1.0-max(dot(n,v),0.0),2.8);
    float spec=pow(max(dot(reflect(-l,n),v),0.0),55.0);
    float bands=0.5+0.5*sin(P.y*4.0+P.x*2.0+time*0.12);
    vec3 base=mix(vec3(0.07,0.19,0.32),vec3(0.24,0.05,0.38),bands);
    vec3 color=base*(0.45+diffuse*1.6)+vec3(0.47,0.99,0.88)*edge*0.95;
    color+=vec3(0.83,0.96,1.0)*spec*1.05+vec3(0.39,0.13,0.70)*pow(max(dot(n,r),0.0),4.0)*0.75;
    float stripe=pow(0.5+0.5*sin(P.y*44.0+P.x*9.0),16.0);
    color+=vec3(0.12,0.6,0.5)*stripe*0.12;
    gl_FragColor=vec4(color,1.0); }`;
  function shader(type,source) { const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw Error('Shader compilation failed'); return s; }
  let program;
  try {
    program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('WebGL link failed');
  } catch(_){fallback();return;}
  gl.useProgram(program);gl.enable(gl.DEPTH_TEST);
  const positionBuffer=gl.createBuffer(),normalBuffer=gl.createBuffer(),indexBuffer=gl.createBuffer();
  const uniforms={};for(const key of ['model','projection','time','lightTheme'])uniforms[key]=gl.getUniformLocation(program,key);
  const positionLocation=gl.getAttribLocation(program,'position'),normalLocation=gl.getAttribLocation(program,'normal');
  const tau=Math.PI*2;
  const normalize=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const curve=t=>{const radius=1.1+.38*Math.cos(3*t);return [radius*Math.cos(2*t),radius*Math.sin(2*t),.48*Math.sin(3*t)];};
  let count=0;
  function geometry(shape){
    const vertices=[],normals=[],indices=[]; const U=180,W=28;
    for(let i=0;i<=U;i++)for(let j=0;j<=W;j++){
      const u=i/U*tau,v=j/W*tau;let p,n;
      if(shape==='sphere'){
        const phi=j/W*Math.PI; n=[Math.sin(phi)*Math.cos(u),Math.cos(phi),Math.sin(phi)*Math.sin(u)];
        const rad=1.3+.075*Math.sin(u*10)*Math.sin(phi*8)*Math.sin(phi);
        p=n.map(x=>x*rad);
      }else if(shape==='torus'){
        n=[Math.cos(u)*Math.cos(v),Math.sin(v),Math.sin(u)*Math.cos(v)];
        p=[(1+.38*Math.cos(v))*Math.cos(u),.38*Math.sin(v), (1+.38*Math.cos(v))*Math.sin(u)];
      }else{
        const c=curve(u),c2=curve(u+.002);const tangent=normalize(c2.map((x,k)=>x-c[k]));
        const side=normalize(cross(tangent,[0,0,1]));const up=normalize(cross(side,tangent));
        n=side.map((x,k)=>x*Math.cos(v)+up[k]*Math.sin(v));p=c.map((x,k)=>x+.25*n[k]);
      }
      vertices.push(...p);normals.push(...n);
      if(i<U&&j<W){const a=i*(W+1)+j,b=(i+1)*(W+1)+j;indices.push(a,b,a+1,b,b+1,a+1);}
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normals),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalLocation);gl.vertexAttribPointer(normalLocation,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);count=indices.length;
  }
  let yaw=.35,pitch=.4,paused=reduced.matches,dragging=false,lastX=0,lastY=0,visible=true,frame=0,lastTime=0,elapsed=0,lost=false;
  function size(){const r=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.75);const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
  function render(){
    if(lost)return;size();const aspect=canvas.width/canvas.height,near=.1,far=50,f=1/Math.tan(.65/2);
    gl.uniformMatrix4fv(uniforms.projection,false,new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]));
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
    const distance=aspect<.95?6.7:5.9;
    gl.uniformMatrix4fv(uniforms.model,false,new Float32Array([cy,sx*sy,-cx*sy,0,0,cx,sx,0,sy,-sx*cy,cx*cy,0,0,0,-distance,1]));
    gl.uniform1f(uniforms.time,elapsed);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,count,gl.UNSIGNED_SHORT,0);
  }
  function tick(t){frame=0;if(paused||!visible||document.hidden||lost)return;const dt=Math.min((t-lastTime)/1000,.05);lastTime=t;elapsed+=dt;if(!dragging)yaw+=dt*.18;render();frame=requestAnimationFrame(tick);}
  function start(){if(!frame&&!paused&&visible&&!document.hidden&&!lost){lastTime=performance.now();frame=requestAnimationFrame(tick);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function syncPause(){pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Resume 3D animation':'Pause 3D animation');pause.setAttribute('aria-pressed',String(paused));stage.dataset.paused=String(paused);}
  pause.addEventListener('click',()=>{paused=!paused;syncPause();paused?stop():start();});
  shapeButtons.forEach(button=>button.addEventListener('click',()=>{geometry(button.dataset.shape);shapeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));status.textContent=`${button.textContent} · Drag to rotate or use arrow keys`;render();}));
  document.getElementById('reset-view').addEventListener('click',()=>{yaw=.35;pitch=.4;render();status.textContent='View reset · Drag to rotate or use arrow keys';});
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.008;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-lastY)*.008));lastX=e.clientX;lastY=e.clientY;render();});
  const release=()=>{dragging=false;canvas.classList.remove('dragging');};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();yaw+=(e.key==='ArrowRight'?.12:e.key==='ArrowLeft'?-.12:0);pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.key==='ArrowDown'?.12:e.key==='ArrowUp'?-.12:0)));render();});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();},{threshold:0}).observe(stage);
  new ResizeObserver(()=>render()).observe(stage);
  reduced.addEventListener('change',e=>{paused=e.matches;syncPause();paused?stop():start();render();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;stop();fallback();});
  geometry('knot');syncPause();render();stage.classList.add('render-ready');canvas.dataset.renderer='webgl';start();
})();
