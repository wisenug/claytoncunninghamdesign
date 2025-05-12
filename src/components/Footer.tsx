
const Footer = () => {
  return (
    <footer className="w-full py-8 bg-transparent">
      <div className="portfolio-container">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3">Clayton Cunningham Design</h3>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-3">Design & development</h3>
          </div>
          <div>
            <h3 className="text-xl font-medium mb-3">Contact</h3>
            <a href="mailto:hello@claytoncunningham.com" className="text-muted-foreground hover:text-[#768c4c] text-lg">
              hello@claytoncunningham.com
            </a>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-lg text-muted-foreground">© {new Date().getFullYear()} Clayton Cunningham Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
