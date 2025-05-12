
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path ? "nav-link-active" : "";
  };

  return (
    <header className="w-full border-b border-gray-100">
      <div className="portfolio-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/5bb31fdc-7d95-4c14-9a6d-987bb14016f6.png" 
            alt="Clayton Cunningham Design Logo" 
            className="h-8 w-auto"
          />
          <span className="font-medium text-xl tracking-tight">Clayton Cunningham Design</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`nav-link ${isActiveRoute("/")}`}>Projects</Link>
          <Link to="/about" className={`nav-link ${isActiveRoute("/about")}`}>About</Link>
          <Link to="/contact" className={`nav-link ${isActiveRoute("/contact")}`}>Contact</Link>
        </nav>
        <div className="md:hidden flex items-center">
          {/* Mobile menu button */}
          <button className="p-2" aria-label="Toggle menu">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
