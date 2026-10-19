/**
 * KARSAKALA — Global Navigation Bar Controller & ScrollSpy
 * Handles mobile drawer toggle, smooth anchor navigation, and scrollspy active states.
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-nav-toggle') || document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('nav-center-menu') || document.querySelector('.nav-center-wrapper');
  const navLinks = document.querySelectorAll('.nav-item-link');
  
  if (mobileToggle && navDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
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

  // Smooth scroll and active state management for in-page anchors
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

  // ScrollSpy for single-page experience
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
});
