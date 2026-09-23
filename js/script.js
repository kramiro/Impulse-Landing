// Production config
const SITE_CONFIG = {
  whatsappNumber: "", // TODO: agrega número en formato internacional, ej. 50499999999
  whatsappMessage: "Hola, vi Impulse Landing y quiero conversar sobre mi proyecto."
};

function setupWhatsApp(){
  const link = document.getElementById("whatsappLink");
  if(!link) return;

  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  if(!number){
    link.setAttribute("aria-disabled","true");
    link.addEventListener("click", (e) => e.preventDefault());
    return;
  }

  link.href = `https://wa.me/${number}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
  link.removeAttribute("aria-disabled");
  link.removeAttribute("title");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}
setupWhatsApp();




  const progress = document.querySelector('.progress');
  const process = document.querySelector('.process');
  const processFill = document.querySelector('.process-fill');
  const digital = document.querySelector('.digital');

  window.addEventListener('scroll',()=>{
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? (scrollY/h)*100 : 0;
    progress.style.width = p + '%';

    const r = process.getBoundingClientRect();
    const vh = innerHeight;
    let t = (vh - r.top) / (r.height + vh*.25);
    t = Math.max(0, Math.min(1, t));
    if (innerWidth > 700) processFill.style.width = (t*100)+'%';
    else processFill.style.height = (t*100)+'%';
  });

  document.addEventListener('mousemove',e=>{
    const r = digital.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width)*100;
    const y = ((e.clientY-r.top)/r.height)*100;
    digital.style.setProperty('--mx', x+'%');
    digital.style.setProperty('--my', y+'%');
  });

  // Selected Work — 3D / Depth carousel
  const depthCards = [...document.querySelectorAll('.depth-card')];
  const depthDots = [...document.querySelectorAll('.depth-dot')];
  const depthCurrent = document.getElementById('depthCurrent');
  const depthCarousel = document.getElementById('depthCarousel');
  const depthStage = document.querySelector('.depth-stage');
  let depthIndex = 0;
  let dragStartX = null;
  let dragPointerId = null;
  let isDragging = false;
  let suppressCardClick = false;

  function circularDelta(i, active, total){
    let d = i - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  }

  function renderDepth(){
    const total = depthCards.length;
    depthCards.forEach((card, i)=>{
      const d = circularDelta(i, depthIndex, total);
      const abs = Math.abs(d);
      const sign = d === 0 ? 0 : (d > 0 ? 1 : -1);
      card.style.setProperty('--offset', d);
      card.style.setProperty('--abs', abs);
      card.style.setProperty('--sign', sign);
      card.dataset.distance = Math.min(abs, 2);
      card.setAttribute('aria-current', d === 0 ? 'true' : 'false');
    });
    depthDots.forEach((dot,i)=>dot.classList.toggle('active', i === depthIndex));
    if(depthCurrent) depthCurrent.textContent = String(depthIndex + 1).padStart(2,'0');
  }

  function goDepth(next){
    depthIndex = (next + depthCards.length) % depthCards.length;
    renderDepth();
  }

  document.getElementById('depthPrev')?.addEventListener('click',()=>goDepth(depthIndex - 1));
  document.getElementById('depthNext')?.addEventListener('click',()=>goDepth(depthIndex + 1));
  depthDots.forEach(dot=>dot.addEventListener('click',()=>goDepth(Number(dot.dataset.go))));

  depthCards.forEach(card=>{
    card.addEventListener('dragstart',e=>e.preventDefault());
    card.addEventListener('click',e=>{
      if(!suppressCardClick) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      suppressCardClick = false;
    },true);
  });

  function finishDepthDrag(e, cancelled = false){
    if(dragStartX === null || (dragPointerId !== null && e.pointerId !== dragPointerId)) return;
    const dx = e.clientX - dragStartX;
    const shouldMove = !cancelled && isDragging && Math.abs(dx) > 42;

    if(shouldMove){
      suppressCardClick = true;
      goDepth(depthIndex + (dx < 0 ? 1 : -1));
      setTimeout(()=>{ suppressCardClick = false; },80);
    }

    depthCarousel?.classList.remove('is-dragging');
    if(depthStage) depthStage.style.transform = '';
    dragStartX = null;
    dragPointerId = null;
    isDragging = false;
  }

  depthCarousel?.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')) return;
    dragStartX = e.clientX;
    dragPointerId = e.pointerId;
    isDragging = false;
  });

  depthCarousel?.addEventListener('pointermove',e=>{
    if(dragStartX === null || e.pointerId !== dragPointerId) return;
    const dx = e.clientX - dragStartX;
    if(Math.abs(dx) > 7){
      if(!isDragging) depthCarousel.setPointerCapture?.(e.pointerId);
      isDragging = true;
      depthCarousel.classList.add('is-dragging');
      if(depthStage) depthStage.style.transform = `translateX(${dx * .2}px)`;
      e.preventDefault();
    }
  });

  depthCarousel?.addEventListener('pointerup',e=>finishDepthDrag(e));
  depthCarousel?.addEventListener('pointercancel',e=>finishDepthDrag(e,true));
  renderDepth();


  // Hero impulse core — release energy through the trajectory on activation.
  const hero = document.querySelector('.hero');
  const impulseCore = document.getElementById('impulseCore');
  let impulseTimer = null;

  impulseCore?.addEventListener('click', ()=>{
    hero?.classList.remove('is-impulsing');
    void hero?.offsetWidth;
    hero?.classList.add('is-impulsing');
    impulseCore.setAttribute('aria-pressed','true');
    impulseCore.setAttribute('aria-label','Núcleo activado. Volver a impulsar');

    clearTimeout(impulseTimer);
    impulseTimer = setTimeout(()=>{
      hero?.classList.remove('is-impulsing');
      impulseCore.setAttribute('aria-pressed','false');
      impulseCore.setAttribute('aria-label','Activar núcleo de impulso');
    },1500);
  });


  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('in');
    })
  },{threshold:.14});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Keyboard support for Selected Work
depthCarousel?.setAttribute("tabindex","0");
depthCarousel?.setAttribute("aria-label","Proyectos seleccionados");
depthCarousel?.addEventListener("keydown",(e)=>{
  if(e.key === "ArrowLeft"){
    e.preventDefault();
    goDepth(depthIndex - 1);
  }
  if(e.key === "ArrowRight"){
    e.preventDefault();
    goDepth(depthIndex + 1);
  }
});
