
import { Link } from "react-router-dom";

interface NavigationProps {
  activeTab: 'work' | 'about';
}

const Navigation = ({ activeTab }: NavigationProps) => {
  return (
    <div className="w-full flex justify-center px-6 md:px-12">
      <nav className="flex items-center justify-between w-full max-w-[1200px] py-6">
        <Link to="/" className="flex items-center hover:bg-secondary rounded-md p-2 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
            <div className="w-8 h-8 border-2 border-background rounded-full relative">
              <div className="absolute inset-0 border-l-2 border-background"></div>
            </div>
          </div>
          <span className="text-lg font-medium hidden md:block">Clayton Cunningham Design</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Link 
            to="/work"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'work' 
                ? 'text-foreground' 
                : 'text-foreground hover:bg-secondary'
            }`}
            style={activeTab === 'work' ? { backgroundColor: '#A1C565' } : {}}
          >
            Work
          </Link>
          <Link 
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'about' 
                ? 'text-foreground' 
                : 'text-foreground hover:bg-secondary'
            }`}
            style={activeTab === 'about' ? { backgroundColor: '#A1C565' } : {}}
          >
            About
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
