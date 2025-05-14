import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractDominantColor, getLightenedColor } from "../utils/colorExtraction";

const AutotraderIcons = () => {
  const [calloutBgColor, setCalloutBgColor] = useState("#FAFBFB");
  const [iconDesignBgColor, setIconDesignBgColor] = useState("#FAFBFB");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Extract colors from key images when they load
    const primaryImage = document.getElementById("primary-image") as HTMLImageElement;
    const designSystemImage = document.getElementById("design-system-image") as HTMLImageElement;
    
    if (primaryImage && primaryImage.complete) {
      extractDominantColor(primaryImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.8);
          setCalloutBgColor(lightColor);
        })
        .catch(() => {});
    }
    
    if (designSystemImage && designSystemImage.complete) {
      extractDominantColor(designSystemImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.85);
          setIconDesignBgColor(lightColor);
        })
        .catch(() => {});
    }
    
    // For images that haven't loaded yet
    primaryImage?.addEventListener("load", () => {
      extractDominantColor(primaryImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.8);
          setCalloutBgColor(lightColor);
        })
        .catch(() => {});
    });
    
    designSystemImage?.addEventListener("load", () => {
      extractDominantColor(designSystemImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.85);
          setIconDesignBgColor(lightColor);
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="py-24">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h1 className="project-title mb-4">Autotrader Icons</h1>
              <p className="project-description">
                Creating a cohesive icon system for the Autotrader ecosystem
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <ul className="text-muted-foreground">
                  <li>Icon Design</li>
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
                src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png" 
                alt="Autotrader Icons grid showing various automotive and feature icons"
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
                Autotrader needed a comprehensive icon system that could be used across their digital platforms.
                The goal was to create a unified visual language that would enhance user experience and strengthen
                brand recognition.
              </p>
              <p className="text-muted-foreground">
                I designed an extensive library of icons representing various features, vehicle attributes, 
                and user actions that would be used throughout the Autotrader website, mobile app, and marketing materials.
              </p>
            </div>
            <div>
              <img 
                src="./lovable-uploads/de1df8e5-ce8e-4746-9256-ef1104067462.png"
                alt="Vehicle history icons showing single owner, accident free, clean title, and no flood damage status" 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-4">Vehicle history status icons improve the browsing experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Text Callout Section - Moved to middle of page and enlarged */}
      <section className="py-16" style={{ backgroundColor: calloutBgColor }}>
        <div className="portfolio-container">
          <div className="text-callout mx-auto text-center max-w-3xl">
            <strong className="text-2xl md:text-3xl">Designed an extensive icon library that unified Autotrader's visual language across all digital platforms.</strong>
          </div>
        </div>
      </section>

      {/* Design System Section */}
      <section className="py-16" style={{ backgroundColor: iconDesignBgColor }}>
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Icon Design System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <img 
                id="design-system-image"
                src="./lovable-uploads/abdd53ed-6974-4b16-8654-d7a69f737e97.png"
                alt="Icon design system documentation showing style guidelines" 
                className="w-full mb-8"
              />
              <img 
                src="./lovable-uploads/f33dc7e8-9d5b-4d53-b787-18a701610278.png"
                alt="Icon examples in two color variants" 
                className="w-full"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-8">
                I developed a comprehensive style guide for the icon system that defined precise design specifications.
                All icons were designed to maintain consistency with rounded corners, a 2.5px stroke width that scales
                with the icon, and a specific color palette that reinforces the Autotrader brand.
              </p>
              <p className="text-muted-foreground mb-8">
                The style guide specified that spot icons would use orange (#FF8D4D), gray (#6D7780), or white (#FFFFFF)
                for darker backgrounds. Orange would comprise approximately 25% of the icon, with gray or white making up
                the other 75%.
              </p>
              <p className="text-muted-foreground">
                The system was designed to be flexible and extensible, allowing for easy creation of new icons while 
                maintaining visual cohesion across the entire brand ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Icon System in Motion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-muted-foreground mb-8">
                The icons were designed not just for static use but also to be animated. This added an extra layer of
                engagement and feedback for users interacting with the Autotrader platform.
              </p>
              <p className="text-muted-foreground">
                Animations were kept simple and focused on enhancing user understanding, rather than being purely decorative.
                This ensured that the animations added value to the user experience without creating unnecessary distractions.
              </p>
            </div>
            <div className="rounded-md overflow-hidden bg-black">
              <video 
                className="w-full" 
                autoPlay 
                loop 
                muted 
                playsInline
                controls
              >
                <source src="/autotrader-icons-animation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-muted-foreground mt-4 p-4">Icon animations enhance user interaction and understanding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-16 bg-[#FAFBFB]">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Implementation Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <img 
                src="./lovable-uploads/c7d3503e-cc6b-4e60-b9c6-5f48f3f7bc0a.png"
                alt="Autotrader website interface showing implemented icons" 
                className="w-full mb-8"
              />
              <img 
                src="./lovable-uploads/4be92025-a4b7-4288-9a0b-91988ca4d361.png"
                alt="Autotrader dealer page showing icons in context" 
                className="w-full"
              />
            </div>
            <div>
              <p className="text-muted-foreground mb-8">
                The icons were implemented across various touchpoints in the Autotrader ecosystem, including the website, 
                mobile app, and marketing materials. Each implementation was carefully considered to ensure that the icons
                enhanced the user experience and provided clear visual cues.
              </p>
              <p className="text-muted-foreground mb-8">
                In vehicle listings, the icons help users quickly identify important vehicle features and history information.
                In dealer pages, they provide visual support for services offered and return policies.
              </p>
              <img 
                src="./lovable-uploads/73236183-13cb-470b-825b-574edc1a967f.png"
                alt="Autotrader mobile screens showing icon usage" 
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-4">Icons provide consistent visual language across platforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Icons Section */}
      <section className="py-16">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Featured Icons</h2>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <img 
                src="./lovable-uploads/5cdcfed9-4a62-4301-851a-8c6f24246595.png"
                alt="Highlighted Autotrader icons for money back guarantee and vehicle exchange" 
                className="w-full max-w-xl mx-auto"
              />
            </div>
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground text-center">
                The money back guarantee and vehicle exchange icons were designed to clearly communicate Autotrader's customer-friendly policies.
                These icons became key visual elements in building trust with customers throughout their car-buying journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Illustration Section */}
      <section className="py-16 bg-[#FAFBFB]">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-8">Vehicle Illustrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <p className="text-muted-foreground mb-8">
                Beyond the standard icon set, I also created larger vehicle illustrations that maintained the same design language.
                These illustrations were used in feature promotions and educational content across the platform.
              </p>
              <p className="text-muted-foreground">
                The vehicle illustrations maintained the same stroke weight, corner rounding, and color palette as the icon system,
                ensuring a cohesive visual experience throughout the Autotrader ecosystem.
              </p>
            </div>
            <div>
              <img 
                src="./lovable-uploads/8e612af0-4549-4c6c-8cab-2dcf8f8fe568.png"
                alt="SUV vehicle illustration with Autotrader styling" 
                className="w-full bg-[#FFF8E7] rounded-lg"
              />
              <p className="text-sm text-muted-foreground mt-4">Vehicle illustrations used consistent styling with the icon system</p>
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
                Autotrader's digital platforms lacked a consistent visual language, with icons and illustrations varying in style 
                across different sections of the website and mobile app. This inconsistency created a fragmented user experience 
                and diluted the strength of the brand.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium mb-3">Solution</h3>
              <p className="text-muted-foreground">
                I designed a comprehensive icon system with clear guidelines for style, color usage, and application. The system included 
                over 100 unique icons representing various features, actions, and vehicle attributes. The icons were created in multiple 
                formats to ensure flexibility across different platforms and use cases.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium mb-3">Result</h3>
              <p className="text-muted-foreground">
                The icon system was successfully implemented across the Autotrader ecosystem, creating a cohesive visual experience 
                for users. The consistent use of icons improved navigation, enhanced content scanability, and strengthened brand recognition. 
                The design system documentation enabled the continued creation of on-brand icons by other designers on the team.
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
              { id: 0, slug: "autotrader-illustration-style", title: "Autotrader Illustration Style", image: "./lovable-uploads/66eb31cd-f714-4138-a7aa-ce71d8c09815.png" },
              { id: 2, slug: "coffee-shop-mobile-app", title: "Coffee Shop Mobile App", image: "./lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png" },
              { id: 3, slug: "joe-juice-store-design", title: "Store Design", image: "./lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png" },
            ].map((relatedProject) => (
              <Link 
                key={relatedProject.id} 
                to={`/projects/${relatedProject.slug}`}
                className="group"
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

export default AutotraderIcons;
