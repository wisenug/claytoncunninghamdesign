
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  subtitle: string;
}

interface MoreWorkProps {
  projects: Project[];
}

const MoreWork = ({ projects }: MoreWorkProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

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
      { threshold: 0.1, rootMargin: '50px' }
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
    <div className="w-full bg-gray-100 mt-24">
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px] px-6 md:px-12 py-16">
          <section aria-label="More projects">
            <h2 className="text-2xl font-bold mb-8">More Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  to={`/project/${project.id}`} 
                  className="group cursor-pointer"
                  aria-label={`View project: ${project.title}`}
                >
                  <div 
                    ref={(el) => observeElement(el, project.id)}
                    className="aspect-square bg-foreground rounded relative overflow-hidden mb-4"
                    role="img"
                    aria-label={`${project.title} preview image`}
                  >
                    {loadedImages.has(project.id) ? (
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
                      <div className="absolute inset-0 bg-foreground animate-pulse" aria-hidden="true"></div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MoreWork;
