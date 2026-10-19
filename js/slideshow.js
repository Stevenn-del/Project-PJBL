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
});
