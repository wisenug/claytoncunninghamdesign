
/**
 * Accessibility enhancements for Clayton Cunningham Design
 * Improves keyboard navigation, focus management, and ARIA support
 */

// Handle keyboard navigation for better accessibility
function setupKeyboardNavigation() {
  // Add focus styling for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && isMobileMenuOpen()) {
      toggleMobileMenu();
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Improve focus management for mobile menu
function setupMobileMenuAccessibility() {
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleButton = document.querySelector('.mobile-menu-button button');
  
  if (!mobileMenu || !toggleButton) return;
  
  // Ensure ARIA attributes are properly set initially
  mobileMenu.setAttribute('aria-hidden', 'true');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.setAttribute('aria-controls', 'mobile-menu');
  
  // Set focus on first menu item when opened
  document.addEventListener('mobileMenuOpened', function() {
    const firstMenuItem = mobileMenu.querySelector('a');
    if (firstMenuItem) {
      setTimeout(() => {
        firstMenuItem.focus();
      }, 100);
    }
  });
  
  // Return focus to toggle button when closed
  document.addEventListener('mobileMenuClosed', function() {
    toggleButton.focus();
  });
}

// Check if mobile menu is open
function isMobileMenuOpen() {
  const mobileMenu = document.getElementById('mobile-menu');
  return mobileMenu && mobileMenu.style.display === 'flex';
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
  setupKeyboardNavigation();
  setupMobileMenuAccessibility();
  
  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
});
