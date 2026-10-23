/**
 * KARSAKALA — Skrip Utama Frontend (main.js)
 * Mengelola navigasi global, drawer menu mobile, slideshow beranda, dan interaksi bersama.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // BAGIAN 1: NAVIGASI GLOBAL & MENU RESPONSIVE (DRAWER MOBILE)
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-nav-toggle') || document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('nav-center-menu') || document.querySelector('.nav-center-wrapper');
  const navLinks = document.querySelectorAll('.nav-item-link');
  
  if (mobileToggle && navDrawer) {
    // Tombol pembuka/penutup menu drawer mobile
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navDrawer.classList.toggle('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isExpanded ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Menutup menu drawer saat pengguna mengklik di luar area menu
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

  // Pengguliran halus (smooth scroll) untuk tautan jangkar dalam halaman
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          if (navDrawer && navDrawer.classList.contains('show')) {
            navDrawer.classList.remove('show');
            if (mobileToggle) {
              mobileToggle.setAttribute('aria-expanded', 'false');
              const icon = mobileToggle.querySelector('i');
              if (icon) icon.className = 'bi bi-list';
            }
          }
        }
      }
    });
  });

  // ScrollSpy untuk menandai menu aktif pada navigasi satu halaman
  const sections = document.querySelectorAll('section[id], div[id="hero-section"]');
  if (sections.length > 1 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                navLinks.forEach((l) => l.classList.remove('active'));
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  // ==========================================================================
  // BAGIAN 2: SLIDESHOW LATAR BELAKANG HERO BERANDA
  // ==========================================================================
  const slides = document.querySelectorAll('.hero-slide');
  if (slides && slides.length > 0) {
    const SLIDE_INTERVAL = 6000; // Berganti setiap 6 detik
    let timerId = null;

    // Mendukung parameter url ?slide=0, 1, 2 untuk pengujian langsung
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlide = parseInt(urlParams.get('slide'), 10);
    const initialIndex = (!isNaN(paramSlide) && paramSlide >= 0 && paramSlide < slides.length) ? paramSlide : 0;
    let currentIndex = initialIndex;

    function showSlide(index, instant = false) {
      slides.forEach((slide, idx) => {
        slide.style.transition = instant ? 'none' : '';
        if (idx === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      if (instant) {
        // Memicu reflow tata letak lalu mengembalikan transisi
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

    // Menghentikan sejenak slideshow ketika tab browser tidak aktif untuk menghemat baterai/GPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    });

    // Menampilkan slide awal dan memulai perputaran otomatis
    showSlide(initialIndex, true);
    startSlideshow();
  }
});
