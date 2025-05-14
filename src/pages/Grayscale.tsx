
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractDominantColor, getLightenedColor } from "../utils/colorExtraction";

const Grayscale = () => {
  const [heroImageColor, setHeroImageColor] = useState("#f5f5f5");
  const [secondSectionColor, setSecondSectionColor] = useState("#FAFBFB");
  const [resultsSectionColor, setResultsSectionColor] = useState("#f5f5f5");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Extract colors from images when they load
    const heroImage = document.getElementById("hero-image") as HTMLImageElement;
    const secondImage = document.getElementById("second-image") as HTMLImageElement;
    const resultsImage = document.getElementById("results-image") as HTMLImageElement;
    
    if (heroImage && heroImage.complete) {
      extractDominantColor(heroImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.8);
          setHeroImageColor(lightColor);
        })
        .catch(() => {});
    }
    
    if (secondImage && secondImage.complete) {
      extractDominantColor(secondImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.85);
          setSecondSectionColor(lightColor);
        })
        .catch(() => {});
    }
    
    if (resultsImage && resultsImage.complete) {
      extractDominantColor(resultsImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.7);
          setResultsSectionColor(lightColor);
        })
        .catch(() => {});
    }
    
    // For images that haven't loaded yet
    heroImage?.addEventListener("load", () => {
      extractDominantColor(heroImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.8);
          setHeroImageColor(lightColor);
        })
        .catch(() => {});
    });
    
    secondImage?.addEventListener("load", () => {
      extractDominantColor(secondImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.85);
          setSecondSectionColor(lightColor);
        })
        .catch(() => {});
    });
    
    resultsImage?.addEventListener("load", () => {
      extractDominantColor(resultsImage)
        .then(color => {
          const lightColor = getLightenedColor(color, 0.7);
          setResultsSectionColor(lightColor);
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="py-12">
        <div className="portfolio-container">
          <Link to="/" className="inline-flex items-center text-sm font-medium mb-8 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to work
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h1 className="project-title">Grayscale</h1>
              <p className="project-description">
                Grayscale needed a partner to design and build a premium platform worthy of their forward-thinking industry leadership in cryptocurrency trading.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg">Client</h3>
                <p>Grayscale</p>
              </div>

              <div>
                <h3 className="font-medium text-lg">Services</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Digital Design</li>
                  <li>Web Development</li>
                  <li>Brand Strategy</li>
                  <li>User Experience</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-lg">Year</h3>
                <p>2022</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="portfolio-container">
          <div className="space-y-12">
            <img
              id="hero-image"
              src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
              alt="Grayscale hero image"
              className="w-full h-auto object-cover rounded-lg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  id="second-image"
                  src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
                  alt="Grayscale mobile interface"
                  className="w-full h-auto object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4">The Grayscale mobile experience delivers a streamlined trading interface</p>
              </div>
              <div>
                <img
                  src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
                  alt="Grayscale desktop dashboard"
                  className="w-full h-auto object-cover rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-4">Desktop dashboard provides comprehensive market data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text Callout Section - In the middle of page */}
      <section className="py-16" style={{ backgroundColor: heroImageColor }}>
        <div className="portfolio-container">
          <div className="text-callout mx-auto text-center max-w-3xl">
            <strong className="text-2xl md:text-3xl">Creating a premium digital trading platform that delivers institutional-grade quality with consumer-level simplicity.</strong>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-medium mb-6">The Challenge</h2>
              <p className="text-lg">
                Grayscale's existing web presence didn't match their position as industry leaders in cryptocurrency investment. We needed to create a platform that would instill confidence in both institutional and individual investors while making complex information accessible.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-medium mb-6">Our Approach</h2>
              <p className="text-lg">
                We conducted extensive research into both traditional finance and cryptocurrency trading platforms to identify the most successful UX patterns. Then we designed an interface that balanced sophisticated data presentation with intuitive navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black text-white">
        <div className="portfolio-container">
          <h2 className="text-3xl font-medium mb-12 text-center">Design System Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <img
                src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
                alt="Grayscale typography system"
                className="w-full h-auto object-cover rounded-lg"
              />
              <p className="text-base mt-4">Typography system designed for readability across devices</p>
            </div>
            <div>
              <img
                src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
                alt="Grayscale color palette"
                className="w-full h-auto object-cover rounded-lg"
              />
              <p className="text-base mt-4">Color system balances professionalism with accessibility</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: secondSectionColor }}>
        <div className="portfolio-container">
          <h2 className="text-3xl font-medium mb-12 text-center">Project Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#f5f5f5] p-8 rounded-lg text-center">
              <h3 className="text-8xl font-bold mb-4">42%</h3>
              <p>Increase in user engagement after launch</p>
            </div>
            <div className="bg-[#f5f5f5] p-8 rounded-lg text-center">
              <h3 className="text-8xl font-bold mb-4">63%</h3>
              <p>Improvement in average session duration</p>
            </div>
            <div className="bg-[#f5f5f5] p-8 rounded-lg text-center">
              <h3 className="text-8xl font-bold mb-4">28%</h3>
              <p>Growth in new account registrations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="portfolio-container">
          <img
            id="results-image"
            src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
            alt="Grayscale platform overview"
            className="w-full h-auto object-cover rounded-lg"
          />
          <p className="text-center text-lg mt-8 max-w-3xl mx-auto">
            The redesigned platform demonstrates how thoughtful design can make complex financial information accessible without sacrificing sophistication.
          </p>
        </div>
      </section>

      {/* More Projects Section */}
      <section className="more-projects-section" style={{ backgroundColor: resultsSectionColor, color: "#fff" }}>
        <div className="portfolio-container">
          <h3 className="more-projects-title">More Projects</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/projects/autotrader-icons" className="group">
              <div className="overflow-hidden bg-gray-900 rounded-lg">
                <img 
                  src="./lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png" 
                  alt="Autotrader Icons"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-white font-medium text-lg">Autotrader Icons</h4>
                <p className="text-gray-400">Icon System</p>
              </div>
            </Link>
            
            <Link to="/projects/juice-and-co-brand-refresh" className="group">
              <div className="overflow-hidden bg-gray-900 rounded-lg">
                <img 
                  src="./lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png" 
                  alt="Juice & Co Brand Refresh"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-white font-medium text-lg">Juice & Co</h4>
                <p className="text-gray-400">Brand Refresh</p>
              </div>
            </Link>
            
            <Link to="/projects/coffee-shop-mobile-app" className="group">
              <div className="overflow-hidden bg-gray-900 rounded-lg">
                <img 
                  src="./lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png" 
                  alt="Coffee Shop Mobile App"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-white font-medium text-lg">Coffee Shop</h4>
                <p className="text-gray-400">Mobile App Design</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Grayscale;
