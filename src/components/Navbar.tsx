
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { X, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true" || 
      (!savedMode && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  
  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);
  
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
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return <>
      <header className={`w-full fixed top-0 z-50 transition-all duration-300 pt-[50px] ${scrolled ? "bg-background/45 backdrop-blur-sm" : "bg-transparent"}`}>
        <div className="portfolio-container flex items-center justify-between h-16 pb-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/lovable-uploads/5bb31fdc-7d95-4c14-9a6d-987bb14016f6.png" alt="Clayton Cunningham Design Logo" className="h-16 w-auto scale-80" />
            <span className="font-medium text-xl tracking-tight">Clayton Cunningham Design</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActiveRoute("/")}`}>
              <span className="font-medium text-lg">
                Work
              </span>
            </Link>
            <Link to="/about" className={`nav-link ${isActiveRoute("/about")}`}>
              <span className="font-medium text-lg">
                About
              </span>
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="p-2" aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full screen mobile menu with dark background */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-center p-10 md:hidden">
          <button onClick={toggleMobileMenu} className="absolute top-[72px] right-6 text-white p-2" aria-label="Close menu">
            <X size={24} />
          </button>
          <nav className="flex flex-col items-start space-y-8 w-full mt-[200px]">
            <Link to="/" onClick={toggleMobileMenu} className={`text-6xl font-bold text-white hover:text-[#a1c565]`}>
              WORK
            </Link>
            <Link to="/about" onClick={toggleMobileMenu} className={`text-6xl font-bold text-white hover:text-[#a1c565]`}>
              ABOUT
            </Link>
            
            {/* Dark mode toggle */}
            <div className="dark-mode-toggle">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <Switch 
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-5 w-5" />
              </div>
              <span>Dark Mode</span>
            </div>
          </nav>
        </div>}
    </>;
};

export default Navbar;
