/* ==========================================================
   MK STUDIO — script.js
   ========================================================== */

/* ----------------------------------------------------------
   CONFIG — edit these to rebrand the site
   ---------------------------------------------------------- */
const CONFIG = {
  phone: "+919876543210",        // used for tel: and WhatsApp (digits + country code, no spaces)
  whatsappMessage: "Hi! I'd like to enquire about booking MK Studio for my event.",
  email: "hello@mkstudio.in",
  instagram: "https://instagram.com/mkstudio",
};

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initMobileMenu();
  initSmoothAnchors();
  initReveal();
  initCounters();
  initPortfolioFilters();
  initVideoModal();
  initContactActions();
  initForm();
});

/* ----------------------------------------------------------
   Nav background on scroll
   ---------------------------------------------------------- */
function initNavScroll(){
  const nav = document.getElementById("nav");
  if(!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
}

/* ----------------------------------------------------------
   Mobile hamburger menu
   ---------------------------------------------------------- */
function initMobileMenu(){
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  if(!btn || !menu) return;

  const close = () => {
    btn.classList.remove("open");
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", close);
  });
}

/* ----------------------------------------------------------
   Smooth scrolling for in-page anchors (nav links scroll to sections)
   ---------------------------------------------------------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const navHeight = document.getElementById("nav")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - (navHeight + 12);
      window.scrollTo({ top, behavior:"smooth" });
    });
  });
}

/* ----------------------------------------------------------
   Scroll reveal animations
   ---------------------------------------------------------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if(!items.length) return;

  if(!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:"0px 0px -60px 0px" });

  items.forEach(el => io.observe(el));
}

/* ----------------------------------------------------------
   Animated stat counters (50+, 30+, 5+)
   ---------------------------------------------------------- */
function initCounters(){
  const stats = document.querySelectorAll(".stat-num");
  if(!stats.length || !("IntersectionObserver" in window)) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.5 });

  stats.forEach(el => io.observe(el));
}

/* ----------------------------------------------------------
   Portfolio category filters
   ---------------------------------------------------------- */
function initPortfolioFilters(){
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".work-card");
  if(!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !match);
      });
    });
  });
}

/* ----------------------------------------------------------
   Video modal — powers portfolio project videos
   and every portfolio card's play button
   ---------------------------------------------------------- */
function initVideoModal(){
  const modal = document.getElementById("videoModal");
  const backdrop = document.getElementById("modalBackdrop");
  const closeBtn = document.getElementById("modalClose");
  const video = document.getElementById("modalVideo");
  const titleEl = document.getElementById("modalTitle");
  const descEl = document.getElementById("modalDesc");
  if(!modal || !video) return;

  const open = ({ src, title, desc }) => {
    video.src = src;
    titleEl.textContent = title || "";
    descEl.textContent = desc || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    video.play().catch(() => { /* autoplay may be blocked — user can press play */ });
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  // Portfolio card triggers
  document.querySelectorAll(".work-card").forEach(card => {
    card.addEventListener("click", () => {
      open({
        src: card.dataset.video,
        title: card.dataset.title,
        desc: card.dataset.desc
      });
    });
  });

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* ----------------------------------------------------------
   Contact actions — call / WhatsApp / email / instagram
   ---------------------------------------------------------- */
function initContactActions(){
  const digits = CONFIG.phone.replace(/[^\d+]/g, "");
  const waNumber = digits.replace("+", "");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  document.querySelectorAll('[data-action]').forEach(el => {
    const action = el.dataset.action;
    el.addEventListener("click", (e) => {
      switch(action){
        case "call":
          window.location.href = `tel:${digits}`;
          break;
        case "whatsapp":
          e.preventDefault();
          window.open(waLink, "_blank", "noopener");
          break;
        case "email":
          window.location.href = `mailto:${CONFIG.email}`;
          break;
        case "instagram":
          window.open(CONFIG.instagram, "_blank", "noopener");
          break;
      }
    });
  });
}

/* ----------------------------------------------------------
   Enquiry form — validation + success message
   ---------------------------------------------------------- */
function initForm(){
  const form = document.getElementById("enquiryForm");
  const success = document.getElementById("formSuccess");
  if(!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[\d\s+()-]{7,}$/;

  const validators = {
    name: (v) => v.trim().length > 1,
    phone: (v) => phoneRe.test(v.trim()),
    email: (v) => emailRe.test(v.trim()),
    eventDate: (v) => v.trim().length > 0,
    service: (v) => v.trim().length > 0,
    message: (v) => v.trim().length > 4
  };

  const validateField = (input) => {
    const field = input.closest(".field");
    const isValid = validators[input.name] ? validators[input.name](input.value) : true;
    field?.classList.toggle("invalid", !isValid);
    return isValid;
  };

  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if(input.closest(".field")?.classList.contains("invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.classList.remove("show");

    let allValid = true;
    form.querySelectorAll("input, select, textarea").forEach(input => {
      if(!validateField(input)) allValid = false;
    });

    if(!allValid){
      form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea")
        ?.focus();
      return;
    }

    // No backend is wired up in this template — replace this block with
    // a fetch() call to your form endpoint / email service when ready.
    success.classList.add("show");
    form.reset();
    form.querySelectorAll(".field").forEach(f => f.classList.remove("invalid"));
    success.scrollIntoView({ behavior:"smooth", block:"center" });
  });
}
