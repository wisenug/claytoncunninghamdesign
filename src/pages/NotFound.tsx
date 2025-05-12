
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="portfolio-container min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-medium mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <a href="/" className="border-b border-black pb-1 hover:text-muted-foreground transition-colors">
        Return to Homepage
      </a>
    </div>
  );
};

export default NotFound;
