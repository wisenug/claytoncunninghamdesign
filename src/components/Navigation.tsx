
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: 'work' | 'about';
}

const Navigation = ({ activeTab }: NavigationProps) => {
  return (
    <nav className="flex items-center justify-between w-full py-6 px-6 md:px-12">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
          <div className="w-8 h-8 border-2 border-background rounded-full relative">
            <div className="absolute inset-0 border-l-2 border-background"></div>
          </div>
        </div>
        <span className="text-lg font-medium hidden md:block">Clayton Cunningham Design</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Link 
          to="/work"
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'work' 
              ? 'bg-accent text-accent-foreground' 
              : 'text-foreground hover:bg-secondary'
          }`}
        >
          Work
        </Link>
        <Link 
          to="/"
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'about' 
              ? 'bg-accent text-accent-foreground' 
              : 'text-foreground hover:bg-secondary'
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
