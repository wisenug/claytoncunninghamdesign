import { Button } from "@/components/ui/button";

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
                className="w-full h-auto aspect-square rounded-full"
              />
            </div>
            <div>
              <h1 className="mb-6">
                I'm Clayton Cunningham — Designer and illustrator in Atlanta, GA 🍑. Currently working as a Senior UX Designer for Cox Automotive - Autotrader and Kelley Blue Book.
              </h1>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pb-10">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl mb-6">Approach</h2>
              <p className="text-muted-foreground mb-4">
                I believe in thoughtful, user-centered design that solves real problems. My process begins with deep research and understanding of your business, audience, and objectives.
              </p>
              <p className="text-muted-foreground">
                Whether you have a great new idea for a company and need a logo, or your current brand needs an entire visual refresh, let's work together to bring your ideas to life.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl mb-6">Services & Skills</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
                  <h3 className="text-lg font-medium mb-3">Content Design</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Art Direction</li>
                    <li>Product Illustrations</li>
                    <li>Editorial Illustrations</li>
                    <li>Custom Icon Sets</li>
                    <li>Animations & Microinteractions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Digital Design</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Website Design</li>
                    <li>UI/UX Design</li>
                    <li>Mobile App Design</li>
                    <li>Prototyping</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Print & Merchandise</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Apparel</li>
                    <li>Posters</li>
                    <li>Prints</li>
                    <li>Stickers</li>
                    <li>Greeting or Business Cards</li>
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
              <h2 className="text-2xl md:text-3xl mb-6 text-foreground">Ready to make some cool stuff?</h2>
              <p className="text-lg mb-8 text-foreground">
                I'd love to hear about your project. Contact me to schedule a consultation.
              </p>
              <Button 
                variant="custom" 
                asChild
                className="font-bold"
              >
                <a href="mailto:info@claytoncunninghamdesign.com">
                  Let's Get Started!
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
