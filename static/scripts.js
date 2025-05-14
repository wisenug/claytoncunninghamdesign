
// Global state
let mobileMenuVisible = false;

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  updateFooterYear();
  
  // Initialize dark mode from localStorage or system preference
  initializeDarkMode();
  
  // Set up keyboard event listeners for accessibility
  setupKeyboardNavigation();
  
  // Initialize header scroll effects
  setupScrollEffects();
});

// Update footer year
function updateFooterYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Initialize dark mode
function initializeDarkMode() {
  const savedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedMode === "true" || (!savedMode && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Mobile menu toggle with accessibility improvements
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleButton = document.querySelector('.mobile-menu-button button');
  
  if (!mobileMenu || !toggleButton) return;
  
  mobileMenuVisible = !mobileMenuVisible;
  
  // Update ARIA attributes
  mobileMenu.setAttribute('aria-hidden', mobileMenuVisible ? 'false' : 'true');
  toggleButton.setAttribute('aria-expanded', mobileMenuVisible ? 'true' : 'false');
  
  // Show/hide menu
  mobileMenu.style.display = mobileMenuVisible ? 'flex' : 'none';
  
  // Prevent scrolling when mobile menu is open
  document.body.style.overflow = mobileMenuVisible ? 'hidden' : 'auto';
  
  // Set focus on first menu item when opened
  if (mobileMenuVisible) {
    const firstMenuItem = mobileMenu.querySelector('a');
    if (firstMenuItem) {
      setTimeout(() => {
        firstMenuItem.focus();
      }, 100);
    }
  }
  
  // Make menu items focusable or not
  const menuItems = mobileMenu.querySelectorAll('a');
  menuItems.forEach(item => {
    item.setAttribute('tabindex', mobileMenuVisible ? '0' : '-1');
  });
}

// Handle scroll effects for header using requestAnimationFrame
function setupScrollEffects() {
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleHeaderScroll(lastScrollY);
        ticking = false;
        lastScrollY = window.scrollY;
      });
      
      ticking = true;
    }
  });
}

// Handle header scroll effects
function handleHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
    
    // Change header background based on dark mode
    const isDark = document.documentElement.classList.contains('dark');
    header.style.backgroundColor = isDark ? 'rgba(34, 34, 34, 0.8)' : 'rgba(250, 250, 250, 0.8)';
    header.style.backdropFilter = 'blur(8px)';
  } else {
    header.classList.remove('scrolled');
    header.style.backgroundColor = 'var(--background)';
    header.style.backdropFilter = 'none';
  }
}

// Toggle dark mode function
function toggleDarkMode() {
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }
}

// Improve keyboard navigation
function setupKeyboardNavigation() {
  // Add focus styling for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && mobileMenuVisible) {
      toggleMobileMenu();
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Helper function to load HTML components
function loadComponents() {
  // This would use the components.js functions to insert shared elements
  // Example implementation would be added when needed
}
