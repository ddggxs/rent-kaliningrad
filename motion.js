// ========================================
// MOTION ANIMATIONS (vanilla Framer Motion)
// With fallback if CDN fails to load
// ========================================

// Fallback: show all hidden elements if Motion doesn't load in 3s
const fallbackTimer = setTimeout(showAll, 3000);

function showAll() {
  document.querySelectorAll(
    '.hero-badge,.hero-title,.hero-subtitle,.hero-actions,.hero-stats,' +
    '.adv-card,.review-card,.finder-card'
  ).forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// Try loading Motion from CDN
try {
  const { animate, inView, scroll } = await import("https://cdn.jsdelivr.net/npm/motion@11/+esm");

  // Motion loaded! Cancel fallback
  clearTimeout(fallbackTimer);

  const isMobile = window.innerWidth <= 640;
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = [0.22, 1, 0.36, 1];

  if (noMotion) {
    showAll();
  } else {

    // ===== 1. HERO STAGGER =====
    const heroItems = [
      ['.hero-badge',    0],
      ['.hero-title',    0.12],
      ['.hero-subtitle', 0.24],
      ['.hero-actions',  0.36],
    ];

    heroItems.forEach(([sel, delay]) => {
      const el = document.querySelector(sel);
      if (el) {
        animate(el,
          { opacity: [0, 1], y: [40, 0] },
          { duration: 0.8, delay, easing: ease }
        );
      }
    });

    // Stats stagger
    document.querySelectorAll('.hero-stats .stat').forEach((el, i) => {
      animate(el,
        { opacity: [0, 1], y: [25, 0] },
        { duration: 0.6, delay: 0.5 + i * 0.15, easing: ease }
      );
    });

    // Show hero-stats container (children are animated individually)
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroStats.style.opacity = '1';

    // ===== 2. SCROLL ANIMATIONS =====
    inView('.adv-card', ({ target }) => {
      const i = Array.from(target.parentElement.children).indexOf(target);
      animate(target,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.6, delay: i * 0.1, easing: ease }
      );
    }, { amount: 0.15 });

    inView('.review-card', ({ target }) => {
      const i = Array.from(target.parentElement.children).indexOf(target);
      animate(target,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.6, delay: i * 0.1, easing: ease }
      );
    }, { amount: 0.15 });

    inView('.finder-card', ({ target }) => {
      animate(target,
        { opacity: [0, 1], scale: [0.96, 1] },
        { duration: 0.7, easing: ease }
      );
    }, { amount: 0.2 });

    // ===== 3. PARALLAX (desktop only) =====
    if (!isMobile) {
      const hero = document.querySelector('.hero');
      const heroContent = document.querySelector('.hero-content');

      if (hero && heroContent) {
        scroll(
          animate(heroContent, { y: [0, -60], opacity: [1, 0.2] }),
          { target: hero, offset: ["start start", "end start"] }
        );
      }
    }
  }
} catch (e) {
  // CDN failed — fallback shows everything
  console.warn('Motion library failed to load, using fallback:', e);
  clearTimeout(fallbackTimer);
  showAll();
}
