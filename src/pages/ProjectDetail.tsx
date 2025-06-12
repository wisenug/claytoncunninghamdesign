
import Navigation from "../components/Navigation";

const ProjectDetail = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="work" />
      
      <main className="px-6 md:px-12 pb-12 flex justify-center">
        <div className="w-full max-w-[1200px]">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Title</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12">
            Subheading. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed ultrices id.
          </p>

          {/* Hero Image */}
          <div className="aspect-video bg-accent rounded-2xl mb-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
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
                <div className="aspect-square bg-accent rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
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
                <div className="aspect-square bg-accent rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
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
                <div className="aspect-square bg-accent rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
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

            <div className="bg-primary text-primary-foreground p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Text highlight area.</h3>
              <p className="text-lg">
                Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissimo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square bg-accent rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
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
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 text-sm text-muted-foreground">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
