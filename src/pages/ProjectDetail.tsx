
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
import Navigation from "../components/Navigation";

// Lazy load the Lottie component
const Lottie = lazy(() => import("lottie-react"));

// Sample Lottie animation data
const sampleLottieData = {
  "v": "5.5.7",
  "fr": 60,
  "ip": 0,
  "op": 180,
  "w": 200,
  "h": 200,
  "nm": "Comp 1",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Shape Layer 1",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 1, "k": [{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":179,"s":[360]}]},
        "p": {"a": 0, "k": [100, 100, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "el",
          "p": {"a": 0, "k": [0, 0]},
          "s": {"a": 0, "k": [50, 50]}
        },
        {
          "ty": "fl",
          "c": {"a": 0, "k": [0.2, 0.6, 1, 1]},
          "o": {"a": 0, "k": 100}
        }
      ],
      "ip": 0,
      "op": 180,
      "st": 0
    }
  ]
};

const ProjectDetail = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [videoLoaded, setVideoLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const moreProjects = [
    { id: 2, title: "Autotrader Icons", subtitle: "Icon System" },
    { id: 3, title: "Juice & Co Brand Refresh", subtitle: "Brand Refresh" },
    { id: 4, title: "CoTra Shop Mobile App", subtitle: "Mobile App Design" }
  ];

  const projectResults = [
    { percentage: "42%", description: "Increase in user engagement after launch" },
    { percentage: "63%", description: "Improvement in average session duration" },
    { percentage: "28%", description: "Growth in new account registrations" }
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = entry.target.getAttribute('data-image-id');
            if (imageId) {
              setLoadedImages(prev => new Set([...prev, imageId]));
              observerRef.current?.unobserve(entry.target);
            }
            
            // Handle video loading
            if (entry.target.getAttribute('data-video')) {
              setVideoLoaded(true);
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const observeElement = (element: HTMLDivElement | null, imageId: string) => {
    if (element && observerRef.current) {
      element.setAttribute('data-image-id', imageId);
      observerRef.current.observe(element);
    }
  };

  const observeVideo = (element: HTMLDivElement | null) => {
    if (element && observerRef.current) {
      element.setAttribute('data-video', 'true');
      observerRef.current.observe(element);
    }
  };

  const LazyImage = ({ imageId, className, role, ariaLabel }: { 
    imageId: string; 
    className: string; 
    role: string; 
    ariaLabel: string; 
  }) => (
    <div 
      ref={(el) => observeElement(el, imageId)}
      className={className}
      role={role} 
      aria-label={ariaLabel}
    >
      {loadedImages.has(imageId) ? (
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="grid grid-cols-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div 
                key={i} 
                className={`${
                  Math.random() > 0.5 ? 'bg-white' : 'bg-accent'
                }`}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-accent animate-pulse" aria-hidden="true"></div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="work" />
      
      <div className="flex justify-center">
        <main className="w-full max-w-[1200px] px-6 md:px-12 pb-12" role="main">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Title</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Subheading. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed ultrices id.
            </p>
          </header>

          {/* Hero Image */}
          <LazyImage 
            imageId="hero"
            className="aspect-video bg-accent rounded relative overflow-hidden mb-12"
            role="img"
            ariaLabel="Project hero image"
          />

          {/* Content Sections */}
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold mb-6">Subheading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    I created a system of illustrated vehicles that could be used across Autotrader's digital platforms. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style.
                  </p>
                  <p className="text-muted-foreground">
                    These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                  </p>
                  <p className="text-muted-foreground">
                    3rd paragraph example. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style. These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                  </p>
                </div>
                <LazyImage 
                  imageId="section1"
                  className="aspect-square bg-accent rounded relative overflow-hidden"
                  role="img"
                  ariaLabel="Project detail image"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Subheading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <LazyImage 
                  imageId="section2"
                  className="aspect-square bg-accent rounded relative overflow-hidden"
                  role="img"
                  ariaLabel="Project detail image"
                />
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    I created a system of illustrated vehicles that could be used across Autotrader's digital platforms. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style.
                  </p>
                  <p className="text-muted-foreground">
                    2nd paragraph example. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style. These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                  </p>
                  <p className="text-muted-foreground">
                    3rd paragraph example. These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Subheading</h2>
              <div className="space-y-6">
                <LazyImage 
                  imageId="section3"
                  className="aspect-square bg-accent rounded relative overflow-hidden"
                  role="img"
                  ariaLabel="Project detail image"
                />
                <p className="text-muted-foreground">
                  I created a system of illustrated vehicles that could be used across Autotrader's digital platforms. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style. These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-center">Project Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {projectResults.map((result, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-6xl font-bold mb-4">{result.percentage}</div>
                    <p className="text-muted-foreground">{result.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground max-w-3xl mx-auto">
                The redesigned platform demonstrates how thoughtful design can make complex financial information accessible without sacrificing sophistication.
              </p>
            </section>

            <aside className="text-black p-8 rounded" role="complementary">
              <h3 className="text-xl font-bold mb-4">Text highlight area.</h3>
              <p className="text-lg">
                Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissimo.
              </p>
            </aside>

            <section aria-label="Project gallery">
              <h2 className="sr-only">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <LazyImage 
                    key={i}
                    imageId={`gallery-${i}`}
                    className="aspect-square bg-accent rounded relative overflow-hidden"
                    role="img"
                    ariaLabel={`Gallery image ${i + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* Video Section */}
            <section aria-label="Project video">
              <h2 className="text-2xl font-bold mb-6">Project Demo</h2>
              <div 
                ref={observeVideo}
                className="aspect-video bg-foreground rounded overflow-hidden"
              >
                {videoLoaded ? (
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    poster="/placeholder.svg"
                  >
                    <source src="/path-to-your-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full bg-foreground animate-pulse flex items-center justify-center">
                    <div className="text-background">Loading video...</div>
                  </div>
                )}
              </div>
            </section>

            {/* Lottie Animation Section */}
            <section aria-label="Project animation" className="text-center">
              <h2 className="text-2xl font-bold mb-6">Interactive Elements</h2>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Suspense fallback={<div className="w-full h-full bg-accent animate-pulse rounded"></div>}>
                    <Lottie 
                      animationData={sampleLottieData}
                      loop={true}
                      autoplay={true}
                    />
                  </Suspense>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                This animation showcases the interactive elements and micro-interactions used throughout the project.
              </p>
            </section>
          </div>

          {/* More Work Section with full-width gray background */}
          <div className="w-full bg-gray-100 mt-24">
            <div className="flex justify-center">
              <div className="w-full max-w-[1200px] px-6 md:px-12 py-16">
                <section aria-label="More projects">
                  <h2 className="text-2xl font-bold mb-8">More Work</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {moreProjects.map((project) => (
                      <Link 
                        key={project.id} 
                        to={`/project/${project.id}`} 
                        className="group cursor-pointer"
                        aria-label={`View project: ${project.title}`}
                      >
                        <LazyImage 
                          imageId={`more-project-${project.id}`}
                          className="aspect-square bg-foreground rounded relative overflow-hidden mb-4"
                          role="img"
                          ariaLabel={`${project.title} preview image`}
                        />
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center">
            <div className="w-full max-w-[1200px] px-6 md:px-12">
              <footer className="text-center py-16 text-sm text-muted-foreground" role="contentinfo">
                © 2025 Clayton Cunningham Design. All rights reserved.
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
