// ======================================================
// IMPULSE LANDING — PRODUCTION SCRIPT
// ======================================================

const SITE_CONFIG = {
  whatsappNumber: "50431494347",
  whatsappMessage:
    "Hola, vi Impulse Landing y quiero conversar sobre mi proyecto."
};


// ======================================================
// WHATSAPP
// ======================================================

function setupWhatsApp() {
  const link = document.getElementById("whatsappLink");

  if (!link) return;

  const number = String(SITE_CONFIG.whatsappNumber || "").replace(/\D/g, "");

  if (!number) {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    return;
  }

  const message = encodeURIComponent(SITE_CONFIG.whatsappMessage);

  link.href = `https://wa.me/${number}?text=${message}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.removeAttribute("aria-disabled");
  link.removeAttribute("title");
}


// ======================================================
// INICIALIZACIÓN GENERAL
// ======================================================

function initializeSite() {
  setupWhatsApp();

  const progress = document.querySelector(".progress");
  const process = document.querySelector(".process");
  const processFill = document.querySelector(".process-fill");
  const digital = document.querySelector(".digital");


  // ====================================================
  // PROGRESO DE LA PÁGINA Y SECCIÓN DE PROCESO
  // ====================================================

  function updateScrollEffects() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const scrollProgress =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    if (progress) {
      progress.style.width = `${scrollProgress}%`;
    }

    if (process && processFill) {
      const rect = process.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let amount =
        (viewportHeight - rect.top) /
        (rect.height + viewportHeight * 0.25);

      amount = Math.max(0, Math.min(1, amount));

      if (window.innerWidth > 700) {
        processFill.style.width = `${amount * 100}%`;
        processFill.style.height = "";
      } else {
        processFill.style.height = `${amount * 100}%`;
        processFill.style.width = "";
      }
    }
  }

  window.addEventListener("scroll", updateScrollEffects, {
    passive: true
  });

  window.addEventListener("resize", updateScrollEffects);

  updateScrollEffects();


  // ====================================================
  // ILUMINACIÓN INTERACTIVA
  // ====================================================

  document.addEventListener("mousemove", (event) => {
    if (!digital) return;

    const rect = digital.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    digital.style.setProperty("--mx", `${x}%`);
    digital.style.setProperty("--my", `${y}%`);
  });


  // ====================================================
  // SELECTED WORK — CARRUSEL
  // ====================================================

  const depthCards = [
    ...document.querySelectorAll(".depth-card")
  ];

  const depthDots = [
    ...document.querySelectorAll(".depth-dot")
  ];

  const depthCurrent = document.getElementById("depthCurrent");
  const depthCarousel = document.getElementById("depthCarousel");
  const depthStage = document.querySelector(".depth-stage");

  let depthIndex = 0;
  let dragStartX = null;
  let dragPointerId = null;
  let isDragging = false;
  let suppressCardClick = false;


  function circularDelta(index, activeIndex, total) {
    let difference = index - activeIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  }


  function renderDepth() {
    const total = depthCards.length;

    if (!total) return;

    depthCards.forEach((card, index) => {
      const difference = circularDelta(
        index,
        depthIndex,
        total
      );

      const absoluteDifference = Math.abs(difference);

      const direction =
        difference === 0
          ? 0
          : difference > 0
            ? 1
            : -1;

      card.style.setProperty("--offset", difference);
      card.style.setProperty("--abs", absoluteDifference);
      card.style.setProperty("--sign", direction);

      card.dataset.distance = String(
        Math.min(absoluteDifference, 2)
      );

      card.setAttribute(
        "aria-current",
        difference === 0 ? "true" : "false"
      );
    });

    depthDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === depthIndex);
    });

    if (depthCurrent) {
      depthCurrent.textContent = String(depthIndex + 1).padStart(
        2,
        "0"
      );
    }
  }


  function goDepth(nextIndex) {
    if (!depthCards.length) return;

    depthIndex =
      (nextIndex + depthCards.length) % depthCards.length;

    renderDepth();
  }


  const previousButton = document.getElementById("depthPrev");
  const nextButton = document.getElementById("depthNext");

  previousButton?.addEventListener("click", () => {
    goDepth(depthIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goDepth(depthIndex + 1);
  });


  depthDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const destination = Number(dot.dataset.go);

      if (Number.isFinite(destination)) {
        goDepth(destination);
      }
    });
  });


  // Permite abrir las tarjetas normalmente, pero evita
  // abrir el enlace accidentalmente después de arrastrar.

  depthCards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });

    card.addEventListener(
      "click",
      (event) => {
        if (!suppressCardClick) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        suppressCardClick = false;
      },
      true
    );
  });


  function finishDepthDrag(event, cancelled = false) {
    if (dragStartX === null) return;

    if (
      dragPointerId !== null &&
      event.pointerId !== dragPointerId
    ) {
      return;
    }

    const movementX = event.clientX - dragStartX;

    const shouldChangeCard =
      !cancelled &&
      isDragging &&
      Math.abs(movementX) > 42;

    if (shouldChangeCard) {
      suppressCardClick = true;

      goDepth(
        depthIndex + (movementX < 0 ? 1 : -1)
      );

      window.setTimeout(() => {
        suppressCardClick = false;
      }, 100);
    }

    depthCarousel?.classList.remove("is-dragging");

    if (depthStage) {
      depthStage.style.transform = "";
    }

    dragStartX = null;
    dragPointerId = null;
    isDragging = false;
  }


  depthCarousel?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;

    dragStartX = event.clientX;
    dragPointerId = event.pointerId;
    isDragging = false;
  });


  depthCarousel?.addEventListener("pointermove", (event) => {
    if (
      dragStartX === null ||
      event.pointerId !== dragPointerId
    ) {
      return;
    }

    const movementX = event.clientX - dragStartX;

    if (Math.abs(movementX) > 7) {
      if (!isDragging) {
        depthCarousel.setPointerCapture?.(
          event.pointerId
        );
      }

      isDragging = true;

      depthCarousel.classList.add("is-dragging");

      if (depthStage) {
        depthStage.style.transform =
          `translateX(${movementX * 0.2}px)`;
      }

      event.preventDefault();
    }
  });


  depthCarousel?.addEventListener("pointerup", (event) => {
    finishDepthDrag(event);
  });

  depthCarousel?.addEventListener("pointercancel", (event) => {
    finishDepthDrag(event, true);
  });


  // Navegación con teclado

  if (depthCarousel) {
    depthCarousel.setAttribute("tabindex", "0");
    depthCarousel.setAttribute(
      "aria-label",
      "Proyectos seleccionados"
    );

    depthCarousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goDepth(depthIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goDepth(depthIndex + 1);
      }
    });
  }

  renderDepth();


  // ====================================================
  // ANIMACIONES AL ENTRAR EN PANTALLA
  // ====================================================

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("in");
    });
  }
}


// ======================================================
// EJECUTAR CUANDO EL HTML ESTÉ DISPONIBLE
// ======================================================

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeSite
  );
} else {
  initializeSite();
}
