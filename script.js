// ========================================
// NAVBAR SCROLL EFFECT + WAVE PARALLAX
// ========================================
const navbar = document.getElementById('navbar');
const heroWaves = document.querySelector('.hero-waves');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Parallax for hero waves
  if (heroWaves) {
    const scrolled = window.scrollY;
    const heroHeight = document.getElementById('hero').offsetHeight;
    if (scrolled < heroHeight) {
      const ratio = scrolled / heroHeight;
      heroWaves.style.transform = `translateY(${ratio * 30}px)`;
      heroWaves.style.opacity = 1 - ratio * 0.5;
    }
  }
});

// ========================================
// OCEAN FOAM PARTICLES (visible sea spray)
// ========================================
(function createFoamParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const particleContainer = document.createElement('div');
  particleContainer.className = 'foam-particles';
  hero.appendChild(particleContainer);

  const isMobile = window.innerWidth <= 640;
  const particleCount = isMobile ? 5 : 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'foam-dot';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = Math.random() * 40 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (5 + Math.random() * 7) + 's';
    const size = (2 + Math.random() * 5);
    particle.style.width = particle.style.height = size + 'px';
    particle.style.opacity = 0.15 + Math.random() * 0.4;
    particleContainer.appendChild(particle);
  }
})();

// ========================================
// VIDEO SLIDESHOW (Kaliningrad showcase)
// Lazy-loads videos to avoid freezing
// DISABLED on mobile (≤ 640px) to prevent
// heavy downloads and GPU-intensive playback
// ========================================
(function initVideoSlideshow() {
  // Skip on mobile — CSS hides videos and shows gradient fallback
  if (window.innerWidth <= 640) return;

  const slides = document.querySelectorAll('.video-slide');
  const dots = document.querySelectorAll('.vid-dot');
  if (!slides.length) return;

  let current = 0;
  const INTERVAL = 8000; // 8 seconds per video
  let timer = null;

  // Lazy-load: set src from data-src if not yet loaded
  function ensureLoaded(video) {
    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
  }

  function goTo(index) {
    // Pause & hide old
    slides[current].classList.remove('active');
    slides[current].pause();
    dots[current].classList.remove('active');

    current = index;

    // Lazy-load the new video
    ensureLoaded(slides[current]);

    // Play new
    slides[current].currentTime = 0;
    slides[current].play().catch(() => { });
    slides[current].classList.add('active');
    dots[current].classList.remove('active');
    // Force reflow for animation restart
    void dots[current].offsetWidth;
    dots[current].classList.add('active');

    // Pre-load the NEXT video so transition is smooth
    const nextIndex = (current + 1) % slides.length;
    ensureLoaded(slides[nextIndex]);

    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  // Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      if (idx !== current) goTo(idx);
    });
  });

  // Start first video — load its src first since we use data-src for all
  ensureLoaded(slides[0]);
  slides[0].play().catch(() => { });
  // Pre-load the second video
  ensureLoaded(slides[1]);
  timer = setInterval(next, INTERVAL);
})();

// ========================================
// MOBILE MENU
// ========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ========================================
// SCROLL ANIMATIONS (AOS-like)
// ========================================
const animateElements = document.querySelectorAll('[data-aos], .card, .adv-card, .review-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation
      const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animateElements.forEach(el => observer.observe(el));

// ========================================
// COUNTER ANIMATION
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-count'));
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(element, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(eased * target);
    element.textContent = current + (target >= 100 ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


// ========================================
// SCROLL TO TOP
// ========================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ========================================
// SMOOTH ANCHOR SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========================================
// FAQ ACCORDION
// ========================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      openItem.classList.remove('active');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ========================================
// CAR GALLERY SLIDESHOW
// ========================================
(function initCarGallery() {
  const gallery = document.getElementById('carGallery');
  if (!gallery) return;

  const images = gallery.querySelectorAll('.car-gallery__img');
  const prevBtn = gallery.querySelector('.car-gallery__prev');
  const nextBtn = gallery.querySelector('.car-gallery__next');
  const dotsContainer = document.getElementById('carGalleryDots');
  let current = 0;
  let autoTimer = null;
  const AUTO_INTERVAL = 5000;

  // Create dots
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'car-gallery__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Фото ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.car-gallery__dot');

  function goTo(index) {
    images[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + images.length) % images.length;
    images[current].classList.add('active');
    dots[current].classList.add('active');
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });

  // Start auto-rotation
  resetAuto();
})();
