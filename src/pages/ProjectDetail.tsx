
import Navigation from "../components/Navigation";

const ProjectDetail = () => {
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
          <div className="aspect-video bg-accent rounded relative overflow-hidden mb-12" role="img" aria-label="Project hero image">
            <div className="absolute inset-0 opacity-30" aria-hidden="true">
              <div className="grid grid-cols-16 h-full">
                {Array.from({ length: 256 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${
                      Math.random() > 0.5 ? 'bg-white' : 'bg-accent'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

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
                <div className="aspect-square bg-accent rounded relative overflow-hidden" role="img" aria-label="Project detail image">
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
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Subheading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="aspect-square bg-accent rounded relative overflow-hidden" role="img" aria-label="Project detail image">
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
                </div>
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
                <div className="aspect-square bg-accent rounded relative overflow-hidden" role="img" aria-label="Project detail image">
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
                </div>
                <p className="text-muted-foreground">
                  I created a system of illustrated vehicles that could be used across Autotrader's digital platforms. Each vehicle was carefully designed to be recognizable at all sizes, while maintaining a consistent style. These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                </p>
              </div>
            </section>

            <aside className="bg-primary text-primary-foreground p-8 rounded" role="complementary">
              <h3 className="text-xl font-bold mb-4">Text highlight area.</h3>
              <p className="text-lg">
                Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissimo.
              </p>
            </aside>

            <section aria-label="Project gallery">
              <h2 className="sr-only">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-accent rounded relative overflow-hidden" role="img" aria-label={`Gallery image ${i + 1}`}>
                    <div className="absolute inset-0 opacity-30" aria-hidden="true">
                      <div className="grid grid-cols-8 h-full">
                        {Array.from({ length: 64 }).map((_, j) => (
                          <div 
                            key={j} 
                            className={`${
                              Math.random() > 0.5 ? 'bg-white' : 'bg-accent'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 text-sm text-muted-foreground" role="contentinfo">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
