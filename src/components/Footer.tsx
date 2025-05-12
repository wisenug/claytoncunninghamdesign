
const Footer = () => {
  return (
    <footer className="w-full py-8 border-t border-gray-100">
      <div className="portfolio-container">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="font-medium text-lg">Studio Name</h3>
            <p className="text-sm mt-1 text-muted-foreground">Design & Development</p>
          </div>
          <div className="space-y-4 md:space-y-0 md:space-x-6 flex flex-col md:flex-row">
            <div>
              <h4 className="font-medium text-sm mb-2">Contact</h4>
              <a href="mailto:hello@studioname.com" className="text-sm text-muted-foreground hover:text-foreground">
                hello@studioname.com
              </a>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Follow</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Instagram</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Studio Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
