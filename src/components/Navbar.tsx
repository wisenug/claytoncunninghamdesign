
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path ? "nav-link-active" : "";
  };

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/60 backdrop-blur-sm" : "bg-transparent"
    }`}>
      <div className="portfolio-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/5bb31fdc-7d95-4c14-9a6d-987bb14016f6.png" 
            alt="Clayton Cunningham Design Logo" 
            className="h-20 w-auto transform scale-250" // Increased size by 250%
          />
          <span className="font-medium text-xl tracking-tight">Clayton Cunningham Design</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`nav-link ${isActiveRoute("/")}`}>Work</Link>
          <Link to="/about" className={`nav-link ${isActiveRoute("/about")}`}>About</Link>
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
