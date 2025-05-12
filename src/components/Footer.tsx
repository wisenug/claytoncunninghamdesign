
const Footer = () => {
  return (
    <footer className="w-full py-8 bg-transparent">
      <div className="portfolio-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Clayton Cunningham Design</h3>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Design & development</h3>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Contact</h3>
            <a href="mailto:hello@claytoncunningham.com" className="text-muted-foreground hover:text-[#768c4c] text-base">
              hello@claytoncunningham.com
            </a>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Follow</h3>
            <div className="flex flex-col space-y-2 text-base">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#768c4c]">
                Instagram
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#768c4c]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-base text-muted-foreground">© {new Date().getFullYear()} Clayton Cunningham Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
