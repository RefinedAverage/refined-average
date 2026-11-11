(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer:coarse)').matches;
  const targets=[...document.querySelectorAll('.hero-art,.page-hero-art,.interlude-art,.pillar-visual,.topic-detail-visual,.about-visual-object,.film-feature-art')];
  const atmosphere=document.getElementById('atmosphere');
  let scrollTarget=0,scrollCurrent=0;
  const getScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);scrollTarget=scrollY/max};
  addEventListener('scroll',getScroll,{passive:true});addEventListener('resize',getScroll,{passive:true});getScroll();
  if(atmosphere){
    const ctx=atmosphere.getContext('2d',{alpha:true});
    if(ctx){
      let w=0,h=0,dpr=1,frame=0,mouse={x:.5,y:.5},particles=[];
      const resize=()=>{dpr=Math.min(devicePixelRatio||1,coarse?1:1.35);w=innerWidth;h=innerHeight;atmosphere.width=Math.round(w*dpr);atmosphere.height=Math.round(h*dpr);atmosphere.style.width=w+'px';atmosphere.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(90,Math.floor(w/14))},()=>({x:Math.random()*w,y:Math.random()*h,z:.25+Math.random()*.75,r:.35+Math.random(),phase:Math.random()*6.28}))};
      resize();addEventListener('resize',resize,{passive:true});
      if(!coarse)addEventListener('pointermove',e=>{mouse.x=e.clientX/w;mouse.y=e.clientY/h},{passive:true});
      const paint=()=>{frame++;scrollCurrent+=(scrollTarget-scrollCurrent)*.075;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w*(.7+mouse.x*.04),h*(.22+mouse.y*.03),0,w*.7,h*.4,Math.max(w,h)*.75);glow.addColorStop(0,'rgba(120,20,28,.14)');glow.addColorStop(.52,'rgba(65,65,65,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(0,(scrollCurrent*90)%58);ctx.strokeStyle='rgba(255,255,255,.016)';for(let x=0;x<w;x+=58){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=-58;y<h+58;y+=58){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore();particles.forEach(p=>{if(!reduce){p.y-=.055*p.z;p.x+=Math.sin(frame*.003+p.phase)*.045;if(p.y<0)p.y=h;if(p.x<0)p.x=w;if(p.x>w)p.x=0}ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.z,0,Math.PI*2);ctx.fillStyle=p.z>.8?'rgba(230,225,218,.32)':'rgba(210,75,78,.2)';ctx.fill()});if(!reduce)requestAnimationFrame(paint)};
      paint();
    }
  }
  if(!targets.length||reduce)return;
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(THREE=>{
    const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=512;
    const tctx=textureCanvas.getContext('2d');const image=tctx.createImageData(512,512);
    for(let i=0;i<image.data.length;i+=4){const n=Math.random()*30,wave=(Math.sin(i/97)+Math.cos(i/311))*4,v=82+n+wave;image.data[i]=v+7;image.data[i+1]=v+5;image.data[i+2]=v+3;image.data[i+3]=255}tctx.putImageData(image,0,0);
    for(let i=0;i<1900;i++){const x=Math.random()*512,y=Math.random()*512,r=Math.random()*2.1;tctx.fillStyle='rgba('+(Math.random()>.5?'225,220,210':'8,9,10')+','+(.025+Math.random()*.12)+')';tctx.beginPath();tctx.arc(x,y,r,0,Math.PI*2);tctx.fill()}
    for(let i=0;i<28;i++){const x=Math.random()*512,y=Math.random()*512;tctx.strokeStyle='rgba(5,6,7,'+(.08+Math.random()*.15)+')';tctx.lineWidth=.5+Math.random()*1.3;tctx.beginPath();tctx.moveTo(x,y);tctx.bezierCurveTo(x+25,y+15,x-20,y+40,x+Math.random()*55-25,y+65);tctx.stroke()}
    const stoneTexture=new THREE.CanvasTexture(textureCanvas);stoneTexture.wrapS=stoneTexture.wrapT=THREE.RepeatWrapping;stoneTexture.repeat.set(2,2);stoneTexture.colorSpace=THREE.SRGBColorSpace;
    const bumpTexture=new THREE.CanvasTexture(textureCanvas);bumpTexture.wrapS=bumpTexture.wrapT=THREE.RepeatWrapping;bumpTexture.repeat.set(2,2);
    const metal=new THREE.MeshStandardMaterial({color:0x777674,map:stoneTexture,bumpMap:bumpTexture,bumpScale:.075,roughness:.43,metalness:.68});
    const darkMetal=new THREE.MeshStandardMaterial({color:0x242526,roughness:.31,metalness:.86});
    const redMetal=new THREE.MeshStandardMaterial({color:0x8d171d,roughness:.29,metalness:.74,emissive:0x260306,emissiveIntensity:.3});
    const paleMetal=new THREE.MeshStandardMaterial({color:0xc1bfba,roughness:.28,metalness:.78});
    const geometryFor=i=>i%7===0?new THREE.TorusKnotGeometry(.9,.24,180,24,2,3):i%7===1?new THREE.IcosahedronGeometry(1.18,3):i%7===2?new THREE.TorusGeometry(.82,.27,28,120):i%7===3?new THREE.OctahedronGeometry(1.2,2):i%7===4?new THREE.DodecahedronGeometry(1.15,2):i%7===5?new THREE.SphereGeometry(1.1,72,56):new THREE.TorusKnotGeometry(.82,.19,160,20,3,5);
    const worlds=[];
    targets.forEach((el,index)=>{
      const canvas=document.createElement('canvas');canvas.className='ra-3d-canvas';canvas.setAttribute('aria-hidden','true');el.appendChild(canvas);
      let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!coarse,powerPreference:'low-power'});}catch(e){canvas.remove();return}
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1:1.35));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,5.6);
      scene.add(new THREE.HemisphereLight(0xbfc7d1,0x15100f,1.25));const key=new THREE.DirectionalLight(0xffeee0,2.8);key.position.set(-3,4,5);scene.add(key);const rim=new THREE.PointLight(0xc22b31,20,9,2);rim.position.set(2,-1,2.6);scene.add(rim);const fill=new THREE.PointLight(0x8b9bab,10,8,2);fill.position.set(-3,-2,-2);scene.add(fill);
      const rig=new THREE.Group();scene.add(rig);const mesh=new THREE.Mesh(geometryFor(index),index%3===0?metal:index%3===1?paleMetal:darkMetal);rig.add(mesh);mesh.rotation.set(.2,.3,.1);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.012,8,150),index%2?redMetal:paleMetal);ring.rotation.set(1.12,.38,.22);rig.add(ring);const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.82,.006,6,130),darkMetal);ring2.rotation.set(.35,1.05,-.2);rig.add(ring2);const shard=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),redMetal);shard.position.set(1.48,.68,.2);rig.add(shard);
      const small=el.classList.contains('pillar-visual')||el.classList.contains('topic-detail-visual');const baseScale=small?.72:1;
      rig.scale.setScalar(baseScale);
      const resize=()=>{const r=el.getBoundingClientRect();const width=Math.max(1,r.width),height=Math.max(1,r.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(el);resize();
      worlds.push({el,renderer,scene,camera,rig,mesh,ring,ring2,shard,index,observer,baseScale,progress:0,rotation:0});
    });
    let raf=0,visible=!document.hidden,last=0;
    const render=now=>{raf=0;if(!visible)return;const delta=Math.min(40,now-last||16);last=now;const vh=innerHeight;let active=false;
      worlds.forEach(w=>{const r=w.el.getBoundingClientRect();if(r.bottom<-vh*.2||r.top>vh*1.2)return;active=true;const center=(r.top+r.height*.5)/vh;const raw=(vh*.72-r.top)/(vh+r.height);const progress=Math.max(-1.5,Math.min(1.5,raw));w.progress+=(progress-w.progress)*.085;const p=Math.max(-1,Math.min(1,.5-center));const dir=w.index%2?-1:1;w.rotation+=(dir*w.progress*2.35-w.rotation)*.07;w.rig.rotation.y=w.rotation+now*.000035;w.rig.rotation.x=(w.index%3-.9)*.26+w.progress*.72;w.rig.rotation.z=Math.sin(w.progress*2.8+w.index)*.13;w.rig.position.y=p*.36;const scale=1+Math.max(0,1-Math.abs(p))*Math.min(.13,Math.abs(w.progress)*.09);w.rig.scale.setScalar(w.baseScale*scale);w.mesh.rotation.x=.2+w.progress*.28;w.mesh.rotation.z=.1+w.progress*.16;w.ring.rotation.z=.22+w.progress*.92;w.ring.rotation.x=1.12+w.progress*.22;w.ring2.rotation.y=.35+w.progress*.68;w.shard.rotation.y=now*.00016+w.progress*1.7;w.renderer.render(w.scene,w.camera)});
      if(active||worlds.length)raf=requestAnimationFrame(render);
    };
    const wake=()=>{if(!raf&&visible)raf=requestAnimationFrame(render)};document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible){last=0;wake()}else if(raf){cancelAnimationFrame(raf);raf=0}});addEventListener('scroll',wake,{passive:true});addEventListener('resize',wake,{passive:true});wake();
    addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);worlds.forEach(w=>{w.observer.disconnect();w.renderer.dispose();w.mesh.geometry.dispose()})},{once:true});
  }).catch(()=>document.documentElement.classList.add('ra-3d-fallback'));
})();
