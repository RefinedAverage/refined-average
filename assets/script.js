(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement,body=document.body;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
let lenis=null;
$$('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
const toggle=$('.menu-toggle'),nav=$('.main-nav');
const setMenu=o=>{nav.classList.toggle('open',o);body.classList.toggle('menu-open',o);toggle.setAttribute('aria-expanded',o);toggle.setAttribute('aria-label',o?'Close menu':'Open menu');lenis&&(o?lenis.stop():lenis.start())};
toggle?.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>e.key==='Escape'&&setMenu(false));
window.__ra=1;
if(!window.gsap||!window.ScrollTrigger||!window.Lenis||reduce){root.classList.remove('js');return}
gsap.registerPlugin(ScrollTrigger);
lenis=new Lenis({lerp:.085,wheelMultiplier:.95});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h.length>1&&$(h)){e.preventDefault();lenis.scrollTo(h,{duration:1.5,easing:t=>1-Math.pow(1-t,4)})}}));
gsap.to('.scroll-progress span',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:0}});
const words=el=>(function walk(n){[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}const s=document.createElement('span');s.className='w';s.textContent=t;f.append(s)});c.replaceWith(f)}else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})})(el);
const lines=el=>{el.innerHTML=el.innerHTML.split(/<br\s*\/?>/i).map(l=>'<span class="ln"><i>'+l+'</i></span>').join('');return $$('.ln i',el)};
if(fine){
  const cur=$('.cur'),label=$('span',cur),qx=gsap.quickTo(cur,'x',{duration:.35,ease:'power3'}),qy=gsap.quickTo(cur,'y',{duration:.35,ease:'power3'});
  addEventListener('pointermove',e=>{qx(e.clientX);qy(e.clientY)},{passive:true});
  $$('a,button').forEach(el=>{const play=el.classList.contains('film-object');
    el.addEventListener('pointerenter',()=>{cur.classList.add(play?'big':'link');if(play)label.textContent='PLAY'});
    el.addEventListener('pointerleave',()=>{cur.classList.remove('big','link');label.textContent=''})});
  $$('.brand,.header-link,.menu-toggle,.button-link,.text-link').forEach(el=>{
    const x=gsap.quickTo(el,'x',{duration:.5,ease:'power3'}),y=gsap.quickTo(el,'y',{duration:.5,ease:'power3'});
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.28);y((e.clientY-r.top-r.height/2)*.28)});
    el.addEventListener('pointerleave',()=>{gsap.to(el,{x:0,y:0,duration:1,ease:'elastic.out(1,.4)'})})});
}
const heroLines=lines($('.hero h1'));
const heroBits=$$('.hero .eyebrow,.hero-description,.hero .text-link,.figure-caption,.hero-index,.scroll-cue');
gsap.set(heroLines,{yPercent:110});gsap.set(heroBits,{opacity:0,y:24});
const manifesto=$('.manifesto h2');words(manifesto);
const mWords=$$('.w',manifesto);gsap.set(mWords,{opacity:.16});
gsap.to(mWords,{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:manifesto,start:'top 80%',end:'bottom 45%',scrub:true}});
$$('.method-intro h2,.interlude h2,.films-layout h2,.closing h2').forEach(h=>{
  const l=lines(h);gsap.set(l,{yPercent:110});
  ScrollTrigger.create({trigger:h,start:'top 88%',once:true,onEnter:()=>gsap.to(l,{yPercent:0,duration:1.2,stagger:.1,ease:'power4.out'})})});
const fades=$$('.section-kicker,.manifesto-aside,.manifesto-bottom span,.method-intro>p,.method-list,.interlude>p,.interlude>span,.films-description,.films-layout .button-link,.film-object,.closing .eyebrow,.closing .button-link');
gsap.set(fades,{opacity:0,y:48});
ScrollTrigger.batch(fades,{start:'top 90%',once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:1.1,stagger:.08,ease:'power3.out'})});
const track=$('.mq-track'),set=['Discipline','Psychology','Growth'];
track.innerHTML=Array(8).fill(set.map(w=>'<span>'+w+'</span>').join('')).join('');
const mq=gsap.to(track,{xPercent:-50,duration:34,ease:'none',repeat:-1});
let boost=0;lenis.on('scroll',e=>{boost=e.velocity});
gsap.ticker.add(()=>{boost*=.92;mq.timeScale(1+Math.min(Math.abs(boost)*.25,6))});
const items=$$('.method-item'),bar=$('.method-progress u'),count=$('.method-progress b');
const setStep=n=>{items.forEach((el,i)=>el.classList.toggle('active',i===n));bar.style.width=(n+1)*25+'%';count.textContent='0'+(n+1)+' — 04'};
setStep(0);
const mm=gsap.matchMedia();
mm.add('(min-width:901px)',()=>{ScrollTrigger.create({trigger:'.method-stage',start:'top top',end:'+=300%',pin:true,onUpdate:s=>setStep(Math.min(3,Math.floor(s.progress*4)))})});
mm.add('(max-width:900px)',()=>{items.forEach((el,i)=>ScrollTrigger.create({trigger:el,start:'top 62%',end:'bottom 62%',onToggle:s=>s.isActive&&setStep(i)}))});
gsap.to('.hero-copy',{yPercent:-14,opacity:.15,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
const film=$('.film-object');
if(film&&fine){const rx=gsap.quickTo(film,'rotationX',{duration:.6,ease:'power3'}),ry=gsap.quickTo(film,'rotationY',{duration:.6,ease:'power3'});gsap.set(film,{transformPerspective:1000});
  film.addEventListener('pointermove',e=>{const r=film.getBoundingClientRect();ry(((e.clientX-r.left)/r.width-.5)*10);rx(-((e.clientY-r.top)/r.height-.5)*10)});
  film.addEventListener('pointerleave',()=>{rx(0);ry(0)})}
gsap.to('.orbit-one',{rotation:360,duration:40,ease:'none',repeat:-1});gsap.to('.orbit-two',{rotation:-360,duration:26,ease:'none',repeat:-1});
gsap.fromTo('.closing-mark',{yPercent:18},{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom top',scrub:true}});
lenis.stop();
const n=$('#count'),o={v:0};
const fontsReady=Promise.race([document.fonts?document.fonts.ready:0,new Promise(r=>setTimeout(r,2500))]);
fontsReady.then(()=>gsap.timeline({onComplete:()=>{lenis.start();ScrollTrigger.refresh()}})
 .to(o,{v:100,duration:1.5,ease:'power2.inOut',onUpdate:()=>n.textContent=Math.round(o.v)})
 .to('.loader',{yPercent:-100,duration:1,ease:'power4.inOut'},'+=.15')
 .to(heroLines,{yPercent:0,duration:1.3,stagger:.12,ease:'power4.out'},'-=.35')
 .to(heroBits,{opacity:1,y:0,duration:1,stagger:.08,ease:'power3.out'},'-=.9')
 .set('.loader',{display:'none'}));
addEventListener('load',()=>ScrollTrigger.refresh());
})();