
import Navigation from "../components/Navigation";

const About = () => {
  const services = {
    "Brand Design": [
      "Brand Strategy",
      "Visual Identity", 
      "Logo Design",
      "Brand Guidelines",
      "Packaging Design"
    ],
    "Content Design": [
      "Art Direction",
      "Product Illustrations",
      "Editorial Illustrations", 
      "Custom Icon Sets",
      "Animations & Microinteractions"
    ],
    "Digital Design": [
      "Website Design",
      "UI/UX Design", 
      "Mobile App Design",
      "Prototyping"
    ],
    "Print & Merchandise": [
      "Apparel",
      "Posters",
      "Prints", 
      "Stickers",
      "Greeting & Business Cards"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="about" />
      
      <div className="flex justify-center">
        <main className="w-full max-w-[1200px] px-6 md:px-12 pb-12">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex flex-col items-center text-center mb-12">
              <img 
                src="/img/claytoncunningham.png"
                alt="Clayton Cunningham"
                className="w-96 h-96 rounded-full object-cover mb-8"
              />
              <h1 className="text-2xl font-bold mb-4 leading-tight">
                I'm Clayton Cunningham — Designer and illustrator in Atlanta, GA 🍑.
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Currently working as a Senior UX Designer at Cox Automotive- Autotrader and Kelley Blue Book.
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-start gap-16 mb-16">
              <img 
                src="/img/claytoncunningham.png"
                alt="Clayton Cunningham"
                className="w-72 h-72 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-8 leading-tight">
                  I'm Clayton Cunningham — Designer and illustrator in Atlanta, GA 🍑. Currently working as a Senior UX Designer at Cox Automotive- Autotrader and Kelley Blue Book.
                </h1>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Services & Skills</h2>
            
            {/* Mobile Services Layout */}
            <div className="block md:hidden space-y-8">
              {Object.entries(services).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="space-y-1">
                    {skills.map((skill, index) => (
                      <p key={index} className="text-muted-foreground">{skill}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Services Layout */}
            <div className="hidden md:grid grid-cols-4 gap-12">
              {Object.entries(services).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <div className="space-y-2">
                    {skills.map((skill, index) => (
                      <p key={index} className="text-muted-foreground">{skill}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-3xl p-8 md:p-12 text-center" style={{ backgroundColor: '#A1C565' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent-foreground">
              Ready to make something cool?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-accent-foreground/80">
              I'd love to hear about your project. Contact me to schedule a consultation.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-black transition-colors">
              Drop me a line
            </button>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 text-sm text-muted-foreground">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default About;
