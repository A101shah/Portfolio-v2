// Check the actual shipped geometry and graceful fallback without a GPU dependency.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/assets/sculpture.js','utf8');
function node(dataset={}){return {dataset,style:{},classList:{add(){},remove(){}},handlers:{},setAttribute(){},addEventListener(k,f){this.handlers[k]=f;},getBoundingClientRect(){return {width:600,height:470};}};}
function setup(available=true){
 const arrays=[];const gl={ARRAY_BUFFER:1,ELEMENT_ARRAY_BUFFER:2,COMPILE_STATUS:3,LINK_STATUS:4,VERTEX_SHADER:5,FRAGMENT_SHADER:6,STATIC_DRAW:7,DEPTH_TEST:8,FLOAT:9,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,TRIANGLES:10,UNSIGNED_SHORT:11};
 for(const method of ['createShader','createProgram','createBuffer','getUniformLocation'])gl[method]=()=>({});
 for(const method of ['shaderSource','compileShader','attachShader','linkProgram','useProgram','enable','bindBuffer','enableVertexAttribArray','vertexAttribPointer','viewport','uniformMatrix4fv','uniform1f','clearColor','clear','drawElements'])gl[method]=()=>{};
 gl.getShaderParameter=gl.getProgramParameter=()=>true;gl.getAttribLocation=()=>0;gl.bufferData=(_,data)=>arrays.push(data);
 const canvas=node(),stage=node(),status=node(),pause=node(),reset=node(),controls=node();canvas.getContext=()=>available?gl:null;
 const shapes=['knot','sphere','torus'].map(shape=>Object.assign(node({shape}),{textContent:shape}));
 const document={hidden:false,getElementById:id=>({'hero-canvas':canvas,'render-stage':stage,'render-status':status,'motion-toggle':pause,'reset-view':reset}[id]),querySelectorAll:()=>shapes,querySelector:()=>controls,addEventListener(){}};
 const context={document,matchMedia:()=>({matches:true,addEventListener(){}}),devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},IntersectionObserver:class{observe(){}},ResizeObserver:class{observe(){}},Float32Array,Uint16Array,Math};
 vm.runInNewContext(source,context);return {arrays,canvas,stage,status,shapes,controls};
}
const test=setup();
function validate(){const [positions,normals,indices]=test.arrays.slice(-3);assert.equal(positions.length,normals.length);assert(positions.every(Number.isFinite));assert(normals.every(Number.isFinite));assert(indices.every(i=>i<positions.length/3));assert.equal(indices.length,180*28*6);}
validate();for(const shape of test.shapes){shape.handlers.click();validate();}
assert.equal(test.canvas.dataset.renderer,'webgl');
test.canvas.handlers.keydown({key:'ArrowRight',preventDefault(){}});
const fallback=setup(false);assert.equal(fallback.canvas.hidden,true);assert.equal(fallback.controls.hidden,true);assert.match(fallback.status.textContent,/unavailable/);
console.log('PASS: three finite indexed meshes, valid indices, keyboard rotation, no-WebGL fallback.');
