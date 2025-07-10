
import { useState, useRef, useEffect } from "react";

interface ProjectGalleryProps {
  images: string[];
}

const ProjectGallery = ({ images }: ProjectGalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageIndex = parseInt(entry.target.getAttribute('data-image-index') || '0');
            setLoadedImages(prev => new Set([...prev, imageIndex]));
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

  const observeElement = (element: HTMLDivElement | null, index: number) => {
    if (element && observerRef.current) {
      element.setAttribute('data-image-index', index.toString());
      observerRef.current.observe(element);
    }
  };

  return (
    <section aria-label="Project gallery">
      <h2 className="sr-only">Project Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            ref={(el) => observeElement(el, index)}
            className="aspect-square rounded relative overflow-hidden"
            role="img"
            aria-label={`Gallery image ${index + 1}`}
          >
            {loadedImages.has(index) ? (
              <img 
                src={imageUrl} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden="true"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallery;
