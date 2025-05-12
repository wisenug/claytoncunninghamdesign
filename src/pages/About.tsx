
const About = () => {
  return (
    <div className="animate-fade-in">
      <section className="py-20">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="mb-8 md:mb-0">
              <img 
                src="/lovable-uploads/82db9077-ea87-46ab-88f4-13c363b213ca.png" 
                alt="Clayton Cunningham" 
                className="w-full h-auto rounded-full aspect-square"
              />
            </div>
            <div>
              <h1 className="mb-6">About Studio</h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're a design studio specializing in branding, UI/UX, and digital product design. 
                Founded in 2018, we work with forward-thinking companies to create memorable brand experiences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pb-10">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl mb-6">Our Approach</h2>
              <p className="text-muted-foreground mb-4">
                We believe in thoughtful, user-centered design that solves real problems. Our process begins with deep research and understanding of your business, audience, and objectives.
              </p>
              <p className="text-muted-foreground mb-4">
                From there, we collaborate closely with you to develop design solutions that are not only beautiful, but strategic and effective. Our goal is to create work that resonates with your audience and helps your business grow.
              </p>
              <p className="text-muted-foreground">
                Whether you're launching a new brand, redesigning a website, or developing a digital product, we bring the same level of care and attention to every project.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl mb-6">Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Brand Design</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Brand Strategy</li>
                    <li>Visual Identity</li>
                    <li>Logo Design</li>
                    <li>Brand Guidelines</li>
                    <li>Packaging Design</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Digital Design</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Website Design</li>
                    <li>UI/UX Design</li>
                    <li>Mobile App Design</li>
                    <li>Prototyping</li>
                    <li>User Research</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-10">
        <div className="portfolio-container">
          <div className="bg-portfolio-accent rounded-2xl p-10 md:p-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl mb-6">Ready to start your project?</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                We'd love to hear about your project. Contact us to schedule a consultation.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-portfolio-dark text-white px-6 py-3 rounded-full hover:bg-black transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
