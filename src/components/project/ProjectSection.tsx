
import { useState, useRef, useEffect } from "react";

interface ProjectSectionProps {
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
  children: React.ReactNode;
}

const ProjectSection = ({ title, imageUrl, imageAlt, reverse = false, children }: ProjectSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageLoaded(true);
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

  const observeElement = (element: HTMLDivElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  if (!imageUrl) {
    return (
      <section>
        <div className="space-y-4">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-start ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
        <div className="space-y-4">
          {children}
        </div>
        <div 
          ref={observeElement}
          className={`aspect-square rounded relative overflow-hidden ${reverse ? 'md:col-start-1' : ''}`}
          role="img"
          aria-label={imageAlt}
        >
          {imageLoaded ? (
            <img 
              src={imageUrl} 
              alt={imageAlt} 
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden="true"></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
