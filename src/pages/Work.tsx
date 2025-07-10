import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Navigation from "../components/Navigation";

const Work = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const projects = [
    {
      id: 1,
      title: "Autotrader Illustration Style",
      subtitle: "Illustration System",
      link: "/autotrader-illustrations"
    },
    ...Array.from({ length: 5 }, (_, i) => ({
      id: i + 2,
      title: "Project Title",
      subtitle: "Project Type",
      link: `/project/${i + 2}`
    }))
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = parseInt(entry.target.getAttribute('data-project-id') || '0');
            setLoadedImages(prev => new Set([...prev, projectId]));
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const observeElement = (element: HTMLDivElement | null, projectId: number) => {
    if (element && observerRef.current) {
      element.setAttribute('data-project-id', projectId.toString());
      observerRef.current.observe(element);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="work" />
      
      <div className="flex justify-center">
        <main className="w-full max-w-[1200px] px-6 md:px-12 pb-12" role="main">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Design studio specializing in digital experiences, logos & illustrations
            </h1>
          </div>

          {/* Projects Grid */}
          <section aria-label="Portfolio projects">
            <h2 className="sr-only">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  to={project.link} 
                  className="group cursor-pointer"
                  aria-label={`View project ${project.title}`}
                >
                  <div 
                    ref={(el) => observeElement(el, project.id)}
                    className="aspect-square rounded relative overflow-hidden transition-transform duration-300 group-hover:scale-105" 
                    role="img" 
                    aria-label={`Project ${project.id} preview image`}
                  >
                    {loadedImages.has(project.id) ? (
                      project.id === 1 ? (
                        <img 
                          src="/public/lovable-uploads/3e4e3d79-2341-4051-b4a0-32ddbae388f6.png" 
                          alt="Autotrader Vehicle Illustrations" 
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
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
                      )
                    ) : (
                      <div className="absolute inset-0 bg-accent animate-pulse" aria-hidden="true"></div>
                    )}
                  </div>
                  {project.subtitle && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground" role="contentinfo">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Work;
