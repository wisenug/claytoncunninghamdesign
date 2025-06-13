
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: 'work' | 'about';
}

const Navigation = ({ activeTab }: NavigationProps) => {
  return (
    <div className="w-full flex justify-center px-6 md:px-12">
      <nav className="flex items-center justify-between w-full max-w-[1200px] py-6" role="navigation" aria-label="Main navigation">
        <Link 
          to="/" 
          className="flex items-center hover:bg-secondary rounded-md p-2 transition-colors"
          aria-label="Clayton Cunningham Design - Go to homepage"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" aria-hidden="true">
            <img 
              src="/lovable-uploads/e8a6176c-a3df-4f64-b98b-09de4d25da43.png" 
              alt="Clayton Cunningham Design Logo" 
              className="w-8 h-8"
            />
          </div>
          <span className="text-lg font-medium hidden md:block">Clayton Cunningham Design</span>
        </Link>
        
        <div className="flex items-center gap-1" role="menubar">
          <Link 
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'work' 
                ? 'text-foreground' 
                : 'text-foreground hover:bg-secondary'
            }`}
            style={activeTab === 'work' ? { backgroundColor: '#A1C565' } : {}}
            role="menuitem"
            aria-current={activeTab === 'work' ? 'page' : undefined}
          >
            Work
          </Link>
          <Link 
            to="/about"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'about' 
                ? 'text-foreground' 
                : 'text-foreground hover:bg-secondary'
            }`}
            style={activeTab === 'about' ? { backgroundColor: '#A1C565' } : {}}
            role="menuitem"
            aria-current={activeTab === 'about' ? 'page' : undefined}
          >
            About
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
