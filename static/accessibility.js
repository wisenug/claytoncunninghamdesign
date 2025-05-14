
/**
 * Accessibility enhancements for Clayton Cunningham Design
 */

// Detect if user is using keyboard navigation
function detectKeyboardNavigation() {
  let isUsingKeyboard = false;
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
      isUsingKeyboard = true;
    }
  });
  
  document.addEventListener('mousedown', function() {
    if (isUsingKeyboard) {
      document.body.classList.remove('keyboard-navigation');
      isUsingKeyboard = false;
    }
  });
}

// Improve mobile menu accessibility
function enhanceMobileMenuAccessibility() {
  const menuButton = document.querySelector('.mobile-menu-button button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('#mobile-navigation a');
  const closeButton = document.querySelector('.mobile-menu .close-button');
  
  if (!menuButton || !mobileMenu) return;
  
  // Set initial ARIA attributes
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  
  // Handle opening/closing menu and updating ARIA attributes
  window.toggleMobileMenu = function() {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    menuButton.setAttribute('aria-expanded', newState.toString());
    mobileMenu.setAttribute('aria-hidden', (!newState).toString());
    mobileMenu.style.display = newState ? 'flex' : 'none';
    
    // Set focus trap when menu is open
    if (newState) {
      setTimeout(() => closeButton.focus(), 100);
      
      // Make only menu elements focusable
      mobileMenuLinks.forEach(link => link.setAttribute('tabindex', '0'));
      
      // Allow focus on close button
      closeButton.setAttribute('tabindex', '0');
    } else {
      // Return focus to menu button when closed
      setTimeout(() => menuButton.focus(), 100);
      
      // Reset tabindex
      mobileMenuLinks.forEach(link => link.setAttribute('tabindex', '-1'));
    }
  };
  
  // Close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu();
    }
  });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
  detectKeyboardNavigation();
  enhanceMobileMenuAccessibility();
  
  // Set current year in footer copyright
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
});
