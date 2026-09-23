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
  const cursor = document.querySelector('.cursor');
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
    cursor.style.left = e.clientX+'px';
    cursor.style.top = e.clientY+'px';

    const r = digital.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width)*100;
    const y = ((e.clientY-r.top)/r.height)*100;
    digital.style.setProperty('--mx', x+'%');
    digital.style.setProperty('--my', y+'%');
  });

  document.querySelectorAll('.hoverable').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      cursor.classList.add('active');
      cursor.textContent='VIEW';
    });
    el.addEventListener('mouseleave',()=>{
      cursor.classList.remove('active');
      cursor.textContent='';
    });
  });


  // Selected Work — 3D / Depth carousel
  const depthCards = [...document.querySelectorAll('.depth-card')];
  const depthDots = [...document.querySelectorAll('.depth-dot')];
  const depthCurrent = document.getElementById('depthCurrent');
  const depthCarousel = document.getElementById('depthCarousel');
  let depthIndex = 0;
  let dragStartX = null;

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
  depthCards.forEach((card,i)=>{
    card.addEventListener('click',(e)=>{
      if(e.target.closest('a')) return;
      if(i !== depthIndex) goDepth(i);
    });
    card.addEventListener('keydown',e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); goDepth(i); }
    });
  });

  depthCarousel?.addEventListener('pointerdown',e=>{
    dragStartX = e.clientX;
    depthCarousel.setPointerCapture?.(e.pointerId);
  });
  depthCarousel?.addEventListener('pointerup',e=>{
    if(dragStartX === null) return;
    const dx = e.clientX - dragStartX;
    if(Math.abs(dx) > 55) goDepth(depthIndex + (dx < 0 ? 1 : -1));
    dragStartX = null;
  });
  depthCarousel?.addEventListener('pointercancel',()=>dragStartX=null);
  renderDepth();


  // Floating / draggable Tetris shapes in hero
  const hero = document.querySelector('.hero');
  const tetrisShapes = [...document.querySelectorAll('.tetri')];
  let activeShape = null;
  let shapeBounds = null;
  let shapeOffsetX = 0;
  let shapeOffsetY = 0;

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  hero?.addEventListener('mousemove', (e)=>{
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tetrisShapes.forEach((shape, i)=>{
      if(shape === activeShape) return;
      const drift = Number(shape.dataset.drift || 12);
      const tx = x * drift;
      const ty = y * drift * 0.75;
      shape.style.translate = `${tx}px ${ty}px`;
    });
  });

  hero?.addEventListener('mouseleave', ()=>{
    tetrisShapes.forEach(shape=>{
      if(shape === activeShape) return;
      shape.style.translate = `0px 0px`;
    });
  });

  tetrisShapes.forEach(shape=>{
    shape.addEventListener('pointerdown', (e)=>{
      activeShape = shape;
      shape.classList.add('dragging');
      shape.setPointerCapture?.(e.pointerId);
      const rect = shape.getBoundingClientRect();
      shapeBounds = hero.getBoundingClientRect();
      shapeOffsetX = e.clientX - rect.left;
      shapeOffsetY = e.clientY - rect.top;
      shape.style.transition = 'none';
      e.preventDefault();
    });
    shape.addEventListener('pointermove', (e)=>{
      if(activeShape !== shape || !shapeBounds) return;
      const localX = clamp(e.clientX - shapeBounds.left - shapeOffsetX, 0, shapeBounds.width - shape.offsetWidth);
      const localY = clamp(e.clientY - shapeBounds.top - shapeOffsetY, 0, shapeBounds.height - shape.offsetHeight);
      shape.style.left = `${localX}px`;
      shape.style.top = `${localY}px`;
      shape.style.translate = '0 0';
    });
    const endDrag = ()=>{
      if(activeShape !== shape) return;
      shape.classList.remove('dragging');
      shape.style.transition = '';
      activeShape = null;
      shapeBounds = null;
    };
    shape.addEventListener('pointerup', endDrag);
    shape.addEventListener('pointercancel', endDrag);
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

