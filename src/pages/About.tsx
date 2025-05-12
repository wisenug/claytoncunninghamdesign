
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
              <p className="text-2xl text-muted-foreground mb-8" style={{fontSize: '2.25rem'}}>
                I'm Clayton Cunningham — Designer and Illustrator in Atlanta, GA 🍑. Currently working as a Senior UX Designer for Cox Automotive - Autotrader and Kelley Blue Book.
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
              <h2 className="text-2xl mb-6">Services & Skills</h2>
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
          <div className="bg-[#a1c565] rounded-[16px] p-10 md:p-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl mb-6 text-foreground">Ready to start your project?</h2>
              <p className="text-lg mb-8 text-foreground">
                We'd love to hear about your project. Contact us to schedule a consultation.
              </p>
              <a 
                href="mailto:info@claytoncunninghamdesign.com" 
                className="inline-block bg-black text-white px-6 py-0 rounded-[4px] hover:bg-black/90 transition-colors h-[48px] flex items-center"
                style={{ paddingLeft: '24px', paddingRight: '24px', height: '48px', borderRadius: '4px', backgroundColor: '#000' }}
              >
                <strong>Get in touch</strong>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
