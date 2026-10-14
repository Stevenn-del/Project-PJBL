/**
 * Karsa Potret - Desktop Automatic Hero Slideshow
 * Cycles 3 Central Java cultural heritage slides with cinematic crossfade.
 */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides || slides.length === 0) return;

  const SLIDE_INTERVAL = 6000; // 6 seconds per slide
  let timerId = null;

  // Support ?slide=0, 1, 2 for testing or direct navigation
  const urlParams = new URLSearchParams(window.location.search);
  const paramSlide = parseInt(urlParams.get('slide'), 10);
  const initialIndex = (!isNaN(paramSlide) && paramSlide >= 0 && paramSlide < slides.length) ? paramSlide : 0;
  let currentIndex = initialIndex;

  function showSlide(index, instant = false) {
    slides.forEach((slide, idx) => {
      if (instant) {
        slide.style.transition = 'none';
      } else {
        slide.style.transition = '';
      }

      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    if (instant) {
      // Force layout reflow then restore transition
      void slides[0].offsetHeight;
      setTimeout(() => {
        slides.forEach(s => s.style.transition = '');
      }, 50);
    }

    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex, false);
  }

  function startSlideshow() {
    stopSlideshow();
    timerId = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function stopSlideshow() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Pause slideshow when browser tab is inactive to preserve CPU/GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  // Initialize active slide instantly on first load
  showSlide(initialIndex, true);
  startSlideshow();

  // Mobile Navigation Drawer Controller
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navDrawer = document.getElementById('nav-center-menu');
  if (mobileToggle && navDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navDrawer.classList.toggle('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isExpanded ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navDrawer.classList.contains('show') && 
          !navDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        navDrawer.classList.remove('show');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      }
    });
  }
});
