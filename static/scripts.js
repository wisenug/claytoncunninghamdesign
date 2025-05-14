
/**
 * Main JavaScript for Clayton Cunningham Design website
 */

// Mobile menu state
let mobileMenuVisible = false;

// Toggle mobile menu visibility
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuVisible = !mobileMenuVisible;
  mobileMenu.style.display = mobileMenuVisible ? 'flex' : 'none';
  
  // A11y attributes are handled in accessibility.js
}

// Handle window resize to reset mobile menu state if needed
window.addEventListener('resize', function() {
  if (window.innerWidth > 767 && mobileMenuVisible) {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.display = 'none';
      mobileMenuVisible = false;
      
      // Reset ARIA attributes
      const menuButton = document.querySelector('.mobile-menu-button button');
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    }
  }
});

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.removeAttribute('data-src');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    lazyImages.forEach(function(lazyImage) {
      if (lazyImage.dataset.src) {
        lazyImageObserver.observe(lazyImage);
      }
    });
  }
});

// Update active navigation based on URL
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});
