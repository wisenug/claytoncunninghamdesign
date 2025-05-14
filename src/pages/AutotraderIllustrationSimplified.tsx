import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractDominantColor, getLightenedColor } from "../utils/colorExtraction";

const AutotraderIllustrationSimplified = () => {
  const [spotsSubsectionBgColor, setSpotsSubsectionBgColor] = useState("#FFFFFF");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Extract colors from key images when they load
    const spotIllustrationsImage = document.getElementById("spot-illustrations-image") as HTMLImageElement;
    
    if (spotIllustrationsImage && spotIllustrationsImage.complete) {
      extractDominantColor(spotIllustrationsImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.95);
          setSpotsSubsectionBgColor(lightColor);
        })
        .catch(() => {});
    }
    
    // For images that haven't loaded yet
    spotIllustrationsImage?.addEventListener("load", () => {
      extractDominantColor(spotIllustrationsImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.95);
          setSpotsSubsectionBgColor(lightColor);
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: "#FFFFFF" }}>
      <section className="py-24">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h1 className="project-title mb-4">Autotrader Illustration Style</h1>
              <p className="project-description">
                Creating a cohesive illustration system for the Autotrader ecosystem
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <ul className="text-muted-foreground">
                  <li>Illustration Design</li>
                  <li>Design System</li>
                  <li>Brand Identity</li>
                  <li>Style Guide</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hero image section */}
      <section className="pb-10">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="mb-6">
              <img 
                id="primary-image"
                src="./lovable-uploads/66eb31cd-f714-4138-a7aa-ce71d8c09815.png" 
                alt="Autotrader Illustration Style showing various automotive and customer illustrations"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-muted-foreground mb-8">
                Autotrader needed a comprehensive illustration system that could be used across their digital platforms.
                The goal was to create a unified visual language that would enhance user experience and strengthen
                brand recognition.
              </p>
              <p className="text-muted-foreground">
                I designed an extensive library of illustrations representing various vehicles, customer scenarios, 
                and user actions that would be used throughout the Autotrader website, mobile app, and marketing materials.
              </p>
            </div>
            <div>
              <img 
                src="./lovable-uploads/5ce83873-8a81-43aa-8274-0513fd6a2701.png"
                alt="Vehicle illustration grid showing different types and styles" 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-4">Consistent illustration style across vehicle types</p>
            </div>
          </div>
        </div>
      </section>

      {/* Text Callout Section */}
      <section className="py-16 bg-white/70">
        <div className="portfolio-container">
          <div className="text-callout mx-auto text-center max-w-3xl">
            <strong className="text-2xl md:text-3xl">Designed an extensive illustration library that unified Autotrader's visual language across all digital platforms.</strong>
          </div>
        </div>
      </section>

      {/* Spot Illustrations Subsection with white background */}
      <section className="py-16" style={{ backgroundColor: spotsSubsectionBgColor }}>
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Simplified Spot Illustrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-muted-foreground mb-8">
                A key component of the illustration system was a collection of simplified spot illustrations. 
                These illustrations were designed to be versatile, easily recognizable, and quick to implement 
                across various digital touchpoints.
              </p>
              <p className="text-muted-foreground">
                The simplified approach ensures these illustrations load quickly and render clearly at smaller sizes, 
                making them perfect for UI elements, icons, and supporting visual elements throughout the platform.
              </p>
            </div>
            <div>
              <img 
                id="spot-illustrations-image"
                src="./lovable-uploads/b2b315b8-2e13-41f9-bb6a-265cfe53cea1.png"
                alt="Beach scene with simplified orange vehicle illustration" 
                className="w-full mb-8"
              />
              <img 
                src="./lovable-uploads/9cb7594a-feb9-4e65-a5f5-a811316dab85.png"
                alt="Road with simplified orange convertible" 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-4">Simplified spot illustrations maintain brand consistency while being easier to implement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Illustration Section */}
      <section className="py-16">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Vehicle Illustrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <img 
                src="./lovable-uploads/8e612af0-4549-4c6c-8cab-2dcf8f8fe568.png"
                alt="SUV vehicle illustration with Autotrader styling" 
                className="w-full rounded-lg"
              />
              <p className="text-sm text-muted-foreground mt-4">Vehicle illustrations used consistent styling with the illustration system</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-8">
                Beyond the standard illustration set, I also created larger vehicle illustrations that maintained the same design language.
                These illustrations were used in feature promotions and educational content across the platform.
              </p>
              <p className="text-muted-foreground">
                The vehicle illustrations maintained the same stroke weight, corner rounding, and color palette as the illustration system,
                ensuring a cohesive visual experience throughout the Autotrader ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-10">Process & Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium mb-3">Problem</h3>
              <p className="text-muted-foreground">
                Autotrader's digital platforms lacked a consistent visual language, with illustrations varying in style 
                across different sections of the website and mobile app. This inconsistency created a fragmented user experience 
                and diluted the strength of the brand.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium mb-3">Solution</h3>
              <p className="text-muted-foreground">
                I designed a comprehensive illustration system with clear guidelines for style, color usage, and application. The system included 
                both detailed illustrations and simplified spot illustrations for various contexts. The illustrations were created in multiple 
                formats to ensure flexibility across different platforms and use cases.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium mb-3">Result</h3>
              <p className="text-muted-foreground">
                The illustration system was successfully implemented across the Autotrader ecosystem, creating a cohesive visual experience 
                for users. The consistent use of illustrations improved navigation, enhanced content scanability, and strengthened brand recognition. 
                The design system documentation enabled the continued creation of on-brand illustrations by other designers on the team.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* More Projects section with black background */}
      <section className="more-projects-section">
        <div className="portfolio-container pt-16">
          <h3 className="more-projects-title">More Projects</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { id: 0, slug: "autotrader-icons", title: "Autotrader Icons", image: "./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png" },
              { id: 2, slug: "coffee-shop-mobile-app", title: "Coffee Shop Mobile App", image: "./lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png" },
              { id: 3, slug: "joe-juice-store-design", title: "Store Design", image: "./lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png" },
            ].map((relatedProject) => (
              <Link 
                key={relatedProject.id} 
                to={`/projects/${relatedProject.slug}`}
                className="group"
                tabIndex={0}
              >
                <div className="overflow-hidden bg-portfolio-light">
                  <img 
                    src={relatedProject.image} 
                    alt={relatedProject.title} 
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-white">{relatedProject.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AutotraderIllustrationSimplified;
