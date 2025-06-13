
import { useState, useRef, useEffect } from "react";

interface ProjectHeroProps {
  imageUrl: string;
  alt: string;
}

const ProjectHero = ({ imageUrl, alt }: ProjectHeroProps) => {
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

  return (
    <div 
      ref={observeElement}
      className="aspect-video bg-accent rounded relative overflow-hidden mb-12"
      role="img"
      aria-label={alt}
    >
      {imageLoaded ? (
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full h-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-accent animate-pulse" aria-hidden="true"></div>
      )}
    </div>
  );
};

export default ProjectHero;
