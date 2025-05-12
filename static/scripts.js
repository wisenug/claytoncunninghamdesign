
// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    const isVisible = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isVisible ? 'none' : 'flex';
    document.body.style.overflow = isVisible ? 'auto' : 'hidden';
  }
}

// Handle scroll effects for header - use requestAnimationFrame for better performance
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
          header.style.backgroundColor = 'rgba(250, 250, 250, 0.8)';
          header.style.backdropFilter = 'blur(8px)';
        } else {
          header.classList.remove('scrolled');
          header.style.backgroundColor = 'var(--background)';
          header.style.backdropFilter = 'none';
        }
      }
      ticking = false;
      lastScrollY = window.scrollY;
    });
    
    ticking = true;
  }
});
