
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: 'work' | 'about';
}

const Navigation = ({ activeTab }: NavigationProps) => {
  return (
    <div className="w-full flex justify-center">
      <nav className="flex items-center justify-between w-full max-w-[1200px] px-6 md:px-12 py-6" role="navigation" aria-label="Main navigation">
        <Link 
          to="/" 
          className="flex items-center hover:bg-muted rounded-md transition-colors min-w-0 flex-shrink-0"
          aria-label="Clayton Cunningham Design - Go to homepage"
        >
          <div className="w-[75px] h-[75px] rounded-full flex items-center justify-center mr-4" aria-hidden="true">
            <img 
              src="/img/logo.png" 
              alt="Clayton Cunningham Design Logo" 
              className="w-[60px] h-[60px]"
            />
          </div>
          <span className="text-lg font-medium hidden md:block whitespace-nowrap">Clayton Cunningham Design</span>
        </Link>
        
        <div className="flex items-center gap-1" role="menubar">
          <Link 
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'work' 
                ? 'text-foreground' 
                : 'text-foreground hover:bg-gray-100'
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
                : 'text-foreground hover:bg-gray-100'
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
