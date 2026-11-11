(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer:coarse)').matches;
  const targets=[...document.querySelectorAll('.hero-art,.page-hero-art,.interlude-art,.pillar-visual,.topic-detail-visual,.about-visual-object,.film-feature-art')];
  const atmosphere=document.getElementById('atmosphere');
  if(atmosphere){
    const ctx=atmosphere.getContext('2d',{alpha:true});
    if(ctx){
      let w=0,h=0,dpr=1,scroll=0,frame=0,mouse={x:.5,y:.5},particles=[];
      const resize=()=>{dpr=Math.min(devicePixelRatio||1,coarse?1:1.5);w=innerWidth;h=innerHeight;atmosphere.width=Math.round(w*dpr);atmosphere.height=Math.round(h*dpr);atmosphere.style.width=w+'px';atmosphere.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(110,Math.floor(w/12))},()=>({x:Math.random()*w,y:Math.random()*h,z:.25+Math.random()*.75,r:.35+Math.random(),phase:Math.random()*6.28}));};
      resize();addEventListener('resize',resize,{passive:true});
      addEventListener('scroll',()=>scroll=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight),{passive:true});
      if(!coarse)addEventListener('pointermove',e=>{mouse.x=e.clientX/w;mouse.y=e.clientY/h},{passive:true});
      const paint=()=>{frame++;ctx.clearRect(0,0,w,h);const glow=ctx.createRadialGradient(w*(.7+mouse.x*.04),h*(.22+mouse.y*.03),0,w*.7,h*.4,Math.max(w,h)*.75);glow.addColorStop(0,'rgba(120,20,28,.15)');glow.addColorStop(.5,'rgba(65,65,65,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(0,(scroll*90)%58);ctx.strokeStyle='rgba(255,255,255,.017)';for(let x=0;x<w;x+=58){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=-58;y<h+58;y+=58){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.restore();particles.forEach(p=>{if(!reduce){p.y-=.075*p.z;p.x+=Math.sin(frame*.004+p.phase)*.08;if(p.y<0)p.y=h;if(p.x<0)p.x=w;if(p.x>w)p.x=0}ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.z,0,Math.PI*2);ctx.fillStyle=p.z>.8?'rgba(230,225,218,.38)':'rgba(210,75,78,.24)';ctx.fill()});if(!reduce)requestAnimationFrame(paint)};
      paint();
    }
  }
  if(!targets.length)return;
  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(THREE=>{
    const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=512;
    const tctx=textureCanvas.getContext('2d');
    const image=tctx.createImageData(512,512);
    for(let i=0;i<image.data.length;i+=4){const n=Math.random()*34;const wave=(Math.sin(i/97)+Math.cos(i/311))*5;const v=83+n+wave;image.data[i]=v+7;image.data[i+1]=v+5;image.data[i+2]=v+3;image.data[i+3]=255}
    tctx.putImageData(image,0,0);
    for(let i=0;i<2100;i++){const x=Math.random()*512,y=Math.random()*512,r=Math.random()*2.4;tctx.fillStyle='rgba('+(Math.random()>.5?'225,220,210':'8,9,10')+','+(.025+Math.random()*.13)+')';tctx.beginPath();tctx.arc(x,y,r,0,Math.PI*2);tctx.fill()}
    for(let i=0;i<32;i++){const x=Math.random()*512,y=Math.random()*512;tctx.strokeStyle='rgba(5,6,7,'+(.08+Math.random()*.16)+')';tctx.lineWidth=.5+Math.random()*1.4;tctx.beginPath();tctx.moveTo(x,y);tctx.bezierCurveTo(x+25,y+15,x-20,y+40,x+Math.random()*55-25,y+65);tctx.stroke()}
    const stoneTexture=new THREE.CanvasTexture(textureCanvas);stoneTexture.wrapS=stoneTexture.wrapT=THREE.RepeatWrapping;stoneTexture.repeat.set(2,2);stoneTexture.colorSpace=THREE.SRGBColorSpace;
    const bumpTexture=new THREE.CanvasTexture(textureCanvas);bumpTexture.wrapS=bumpTexture.wrapT=THREE.RepeatWrapping;bumpTexture.repeat.set(2,2);
    const metal=new THREE.MeshStandardMaterial({color:0x777674,map:stoneTexture,bumpMap:bumpTexture,bumpScale:.085,roughness:.42,metalness:.72});
    const darkMetal=new THREE.MeshStandardMaterial({color:0x242526,roughness:.3,metalness:.88});
    const redMetal=new THREE.MeshStandardMaterial({color:0x8d171d,roughness:.28,metalness:.78,emissive:0x260306,emissiveIntensity:.35});
    const paleMetal=new THREE.MeshStandardMaterial({color:0xc1bfba,roughness:.26,metalness:.82});
    const worlds=[];
    const geoFor=(kind)=>{
      if(kind%7===0)return new THREE.TorusKnotGeometry(.9,.24,220,28,2,3);
      if(kind%7===1)return new THREE.IcosahedronGeometry(1.18,4);
      if(kind%7===2)return new THREE.TorusGeometry(.82,.28,32,140);
      if(kind%7===3)return new THREE.OctahedronGeometry(1.22,2);
      if(kind%7===4)return new THREE.DodecahedronGeometry(1.18,2);
      if(kind%7===5)return new THREE.SphereGeometry(1.12,96,72);
      return new THREE.TorusKnotGeometry(.82,.19,180,24,3,5);
    };
    targets.forEach((el,index)=>{
      const canvas=document.createElement('canvas');canvas.className='ra-3d-canvas';canvas.setAttribute('aria-hidden','true');el.appendChild(canvas);
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!coarse,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1:1.6));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
      const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,5.6);
      scene.add(new THREE.HemisphereLight(0xbfc7d1,0x15100f,1.35));
      const key=new THREE.DirectionalLight(0xffeee0,3.1);key.position.set(-3,4,5);scene.add(key);
      const rim=new THREE.PointLight(0xc22b31,24,9,2);rim.position.set(2,-1,2.6);scene.add(rim);
      const fill=new THREE.PointLight(0x8b9bab,12,8,2);fill.position.set(-3,-2,-2);scene.add(fill);
      const rig=new THREE.Group();scene.add(rig);
      const mesh=new THREE.Mesh(geoFor(index),index%3===0?metal:index%3===1?paleMetal:darkMetal);rig.add(mesh);
      mesh.rotation.set(.2,.3,.1);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.012,8,180),index%2?redMetal:paleMetal);ring.rotation.set(1.12,.38,.22);rig.add(ring);
      const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.82,.006,6,160),darkMetal);ring2.rotation.set(.35,1.05,-.2);rig.add(ring2);
      const shard=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),redMetal);shard.position.set(1.48,.68,.2);rig.add(shard);
      const small=el.classList.contains('pillar-visual')||el.classList.contains('topic-detail-visual');
      const baseScale=small?.72:1;
      rig.scale.setScalar(baseScale);
      const resize=()=>{const r=el.getBoundingClientRect();const width=Math.max(1,r.width),height=Math.max(1,r.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix()};
      const observer=new ResizeObserver(resize);observer.observe(el);resize();
      worlds.push({el,renderer,scene,camera,rig,mesh,ring,ring2,shard,index,observer,baseScale});
    });
    let raf=0,visible=true;
    const render=()=>{
      raf=0;if(!visible)return;
      const vh=innerHeight;
      worlds.forEach(w=>{
        const r=w.el.getBoundingClientRect();if(r.bottom<-vh*.25||r.top>vh*1.25)return;
        const center=(r.top+r.height*.5)/vh;
        const progress=(vh*.72-r.top)/(vh+r.height);
        const p=Math.max(-1,Math.min(1,.5-center));
        const direction=w.index%2?-1:1;
        w.rig.rotation.y=direction*(progress*2.4)+(reduce?0:performance.now()*.000075);
        w.rig.rotation.x=(w.index%3-.9)*.28+progress*.9;
        w.rig.rotation.z=Math.sin(progress*3.2+w.index)*.16;
        w.rig.position.y=p*.42;
        const s=1+Math.max(0,1-Math.abs(p))*Math.min(.16,Math.abs(progress)*.11);
        w.rig.scale.setScalar(w.baseScale*s);
        w.mesh.rotation.x=progress*.34;w.mesh.rotation.z=progress*.18;
        w.ring.rotation.z=progress*1.1;w.ring.rotation.x=1.12+progress*.25;
        w.ring2.rotation.y=progress*.8;w.shard.rotation.y=progress*2.1;
        w.renderer.render(w.scene,w.camera);
      });
      if(!reduce)raf=requestAnimationFrame(render);
    };
    const queue=()=>{if(!raf)raf=requestAnimationFrame(render)};
    addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
    document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)queue();else if(raf){cancelAnimationFrame(raf);raf=0}});
    if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)queue()})},{rootMargin:'200px'});targets.forEach(t=>io.observe(t))}
    queue();
  }).catch(()=>{document.documentElement.classList.add('ra-3d-fallback')});
})();