
/**
 * Main JavaScript file for Clayton Cunningham Design portfolio
 */

// Wait for DOM content to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear().toString();
  
  // Initialize AOS animation library if it exists
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
});

// Toggle mobile menu visibility
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggleButton = document.querySelector('.mobile-menu-button button');
  
  if (!menu || !toggleButton) return;
  
  // Check if menu is currently hidden
  const isHidden = menu.style.display !== 'flex';
  
  // Toggle menu visibility
  menu.style.display = isHidden ? 'flex' : 'none';
  
  // Update ARIA attributes
  toggleButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  menu.setAttribute('aria-hidden', !isHidden);
  
  // Handle focus management
  if (isHidden) {
    // When opening menu, make links focusable and focus on first item
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(link => link.setAttribute('tabindex', '0'));
    
    // Focus on first menu item after a short delay to allow animation
    setTimeout(() => {
      if (menuLinks.length > 0) menuLinks[0].focus();
    }, 100);
    
    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event for other scripts
    document.dispatchEvent(new Event('mobileMenuOpened'));
  } else {
    // When closing menu, make links not focusable
    menu.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
    
    // Restore scrolling
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    toggleButton.focus();
    
    // Dispatch custom event for other scripts
    document.dispatchEvent(new Event('mobileMenuClosed'));
  }
}

// Handle window resize events
window.addEventListener('resize', function() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  
  // If screen size changes to desktop while mobile menu is open, close it
  if (window.innerWidth > 768 && menu.style.display === 'flex') {
    menu.style.display = 'none';
    document.body.style.overflow = '';
    
    // Reset ARIA attributes
    const toggleButton = document.querySelector('.mobile-menu-button button');
    if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
});
