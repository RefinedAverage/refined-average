import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
(()=>{
 const host=document.querySelector('#ra-figure');if(!host)return;
 const coarse=matchMedia('(pointer:coarse)').matches,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!coarse,powerPreference:'high-performance'});}catch(e){return}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.25:1.7));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,host.clientWidth/host.clientHeight,.1,100);camera.position.set(0,.05,5.3);
 scene.add(new THREE.HemisphereLight(0xdce4ed,0x17191d,2.1));
 const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(-3,5,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0xe5222c,3.2);rim.position.set(4,2,-3);scene.add(rim);
 const fill=new THREE.PointLight(0x8d9baa,2.1,10);fill.position.set(-4,0,3);scene.add(fill);
 const root=new THREE.Group();scene.add(root);root.position.set(.15,-.12,0);
 const silver=new THREE.MeshStandardMaterial({color:0xc2c8ce,metalness:.94,roughness:.23});
 const fallback=new THREE.Group();root.add(fallback);
 const make=(g,p,s)=>{const m=new THREE.Mesh(g,silver);m.position.set(...p);fallback.add(m);return m};
 // A restrained sculptural fallback remains visible if the external head model cannot load.
 make(new THREE.SphereGeometry(.72,64,48),[0,.25,0]).scale.set(.73,1,.68);
 make(new THREE.CapsuleGeometry(.34,.72,12,24),[0,-.82,-.04]).scale.set(1.15,1,.8);
 make(new THREE.TorusGeometry(.74,.035,12,96),[0,.25,-.06]).rotation.x=Math.PI/2;
 const loader=new GLTFLoader();
 loader.load('https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',gltf=>{
   const model=gltf.scene;model.scale.setScalar(1.38);model.position.set(0,-.25,0);model.rotation.y=-.22;
   model.traverse(o=>{if(o.isMesh){o.material=silver;o.castShadow=true;o.receiveShadow=true}});
   fallback.visible=false;root.add(model);root.userData.model=model;host.classList.add('ready');
 },undefined,()=>{host.classList.add('ready')});
 const dust=new THREE.Group();scene.add(dust);for(let i=0;i<34;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.009+(i%3)*.004,8,8),new THREE.MeshBasicMaterial({color:i%5===0?0xe5222c:0xaeb7c1,transparent:true,opacity:.38}));m.position.set((Math.random()-.5)*5,(Math.random()-.5)*4,(Math.random()-.5)*1.5);dust.add(m)}
 let target=0,current=0,mx=0,my=0,raf=0,last=0,visible=true;const hero=document.querySelector('.hero');
 const read=()=>{const r=hero.getBoundingClientRect(),span=Math.max(1,r.height-innerHeight);target=Math.max(0,Math.min(1,-r.top/span))};addEventListener('scroll',read,{passive:true});read();
 if(!coarse)addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 const resize=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);
 function render(t){raf=0;if(!visible)return;const dt=Math.min(.04,(t-last)/1000||.016);last=t;current+=(target-current)*(1-Math.exp(-dt*3.5));const p=current,model=root.userData.model;root.position.x=.1+mx*.07;root.rotation.y=-.22+p*.52+mx*.08;root.rotation.x=.04+p*.22+my*.05;root.position.y=-.12+p*.2;camera.position.x=mx*.07;camera.position.y=.05+p*.18+my*.05;camera.lookAt(.05,.02+p*.12,0);if(model){model.rotation.y=-.22+p*.56+mx*.08;model.rotation.x=.04+p*.18+my*.05}dust.rotation.y=t*.000025;renderer.render(scene,camera);if(!host.classList.contains('ready'))host.classList.add('ready');if(!reduce||p>.001)raf=requestAnimationFrame(render)}
 function wake(){if(!raf&&visible)raf=requestAnimationFrame(render)}document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible){last=0;wake()}else if(raf){cancelAnimationFrame(raf);raf=0}});addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);renderer.dispose()},{once:true});wake();
})();