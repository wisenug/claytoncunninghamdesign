
// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Initialize dark mode from localStorage or system preference
  const savedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedMode === "true" || (!savedMode && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
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
      ticking = false;
      lastScrollY = window.scrollY;
    });
    
    ticking = true;
  }
});

// Toggle dark mode function (for use outside React)
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

// Add focus styling for keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

