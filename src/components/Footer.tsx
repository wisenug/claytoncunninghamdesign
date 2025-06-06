
const Footer = () => {
  return (
    <footer className="w-full py-8 bg-transparent">
      <div className="portfolio-container">
        <div className="mt-8 text-center">
          <p className="text-lg text-muted-foreground">© {new Date().getFullYear()} Clayton Cunningham Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
