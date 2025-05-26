
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractDominantColor, getLightenedColor } from "../utils/colorExtraction";
import LottieAnimation from "../components/LottieAnimation";
import animationData from "../assets/sample-animation.json";

const Grayscale = () => {
  const [heroImageColor, setHeroImageColor] = useState("#f5f5f5");
  const [secondSectionColor, setSecondSectionColor] = useState("#FAFBFB");
  const [resultsSectionColor, setResultsSectionColor] = useState("#f5f5f5");

  // Use reliable placeholder images
  const heroImageSrc = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center";
  const mobileImageSrc = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop&crop=center";
  const desktopImageSrc = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&crop=center";
  const typographyImageSrc = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&crop=center";
  const colorImageSrc = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop&crop=center";
  const resultsImageSrc = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center";
  const project1ImageSrc = "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center";
  const project2ImageSrc = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&crop=center";
  const project3ImageSrc = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center";

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Grayscale page loaded successfully");
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="py-12">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h1 className="project-title">Grayscale</h1>
              <p className="project-description">
                Grayscale needed a partner to design and build a premium platform worthy of their forward-thinking industry leadership in cryptocurrency trading.
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <LottieAnimation 
                animationData={animationData} 
                className="w-32 h-32 lg:w-48 lg:h-48" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section with Animation */}
      <section className="pb-16">
        <div className="portfolio-container">
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <img 
                  src={heroImageSrc}
                  alt="Grayscale hero image" 
                  className="w-full h-auto object-cover rounded-lg" 
                />
              </div>
              <div>
                <LottieAnimation 
                  animationData={animationData}
                  className="w-full max-w-xs mx-auto" 
                />
                <p className="text-center text-muted-foreground mt-4">Interactive trading experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={mobileImageSrc}
                  alt="Grayscale mobile interface" 
                  className="w-full h-auto object-cover rounded-lg" 
                />
                <p className="text-sm text-muted-foreground mt-4">The Grayscale mobile experience delivers a streamlined trading interface</p>
              </div>
              <div>
                <img 
                  src={desktopImageSrc}
                  alt="Grayscale desktop dashboard" 
                  className="w-full h-auto object-cover rounded-lg" 
                />
                <p className="text-sm text-muted-foreground mt-4">Desktop dashboard provides comprehensive market data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text Callout Section */}
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
                src={typographyImageSrc}
                alt="Grayscale typography system" 
                className="w-full h-auto object-cover rounded-lg" 
              />
              <p className="text-base mt-4">Typography system designed for readability across devices</p>
            </div>
            <div>
              <img 
                src={colorImageSrc}
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
            src={resultsImageSrc}
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
                  src={project1ImageSrc}
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
                  src={project2ImageSrc}
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
                  src={project3ImageSrc}
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
