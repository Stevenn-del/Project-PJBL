/**
 * KARSA POTRET — Global Navigation Bar Controller
 * Handles mobile drawer toggle and responsive interactions across all pages.
 */
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-nav-toggle') || document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.getElementById('nav-center-menu') || document.querySelector('.nav-center-wrapper');
  
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
});
