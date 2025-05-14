
/**
 * Components.js - Utility functions to generate common HTML components
 * This helps maintain consistency across pages and reduces duplication
 */

// Generate header HTML with current page highlighted and accessibility features
function generateHeader(currentPage) {
  return `
  <header>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="portfolio-container">
      <div class="navbar">
        <a href="./index.html" class="logo" aria-label="Clayton Cunningham Design - Home">
          <img src="./img/logo.png" alt="Clayton Cunningham Design Logo" width="64" height="64">
          <span>Clayton Cunningham Design</span>
        </a>
        <nav aria-label="Main Navigation">
          <a href="./index.html" class="nav-link${currentPage === 'work' ? '-active' : ''}" tabindex="0" ${currentPage === 'work' ? 'aria-current="page"' : ''}>Work</a>
          <a href="./about.html" class="nav-link${currentPage === 'about' ? '-active' : ''}" tabindex="0" ${currentPage === 'about' ? 'aria-current="page"' : ''}>About</a>
        </nav>
        <div class="mobile-menu-button">
          <button 
            onclick="toggleMobileMenu()" 
            aria-label="Toggle menu" 
            aria-expanded="false" 
            aria-controls="mobile-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
      <button onclick="toggleMobileMenu()" class="close-button" aria-label="Close menu">
        <span aria-hidden="true">CLOSE</span>
      </button>
      <nav id="mobile-navigation" aria-label="Mobile Navigation">
        <a href="./index.html" onclick="toggleMobileMenu()" class="${currentPage === 'work' ? 'active' : ''}" tabindex="-1" ${currentPage === 'work' ? 'aria-current="page"' : ''}>WORK</a>
        <a href="./about.html" onclick="toggleMobileMenu()" class="${currentPage === 'about' ? 'active' : ''}" tabindex="-1" ${currentPage === 'about' ? 'aria-current="page"' : ''}>ABOUT</a>
      </nav>
    </div>
  </header>
  `;
}

// Generate footer HTML
function generateFooter() {
  return `
  <footer>
    <div class="portfolio-container">
      <div class="footer-content">
        <p>© <span id="current-year"></span> Clayton Cunningham Design. All rights reserved.</p>
      </div>
    </div>
  </footer>
  `;
}

// Generate project card for homepage
function generateProjectCard(project) {
  return `
  <a href="${project.url}" class="group">
    <div class="project-card">
      <img 
        src="./img/${project.image}" 
        alt="${project.title}" 
        loading="lazy" 
        width="600" 
        height="480">
    </div>
  </a>
  `;
}

// Generate related project card for project pages
function generateRelatedProject(project) {
  return `
  <a href="${project.url}" class="group">
    <div class="overflow-hidden bg-portfolio-light">
      <img 
        src="./img/${project.image}" 
        alt="${project.title}" 
        class="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
        width="400"
        height="200">
    </div>
    <div class="mt-2">
      <h4 class="text-sm font-medium text-white">${project.title}</h4>
      ${project.category ? `<p class="text-xs text-gray-400">${project.category}</p>` : ''}
    </div>
  </a>
  `;
}
