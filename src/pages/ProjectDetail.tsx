import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const ProjectDetail = () => {
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

            <aside className="bg-secondary text-foreground p-8 rounded" role="complementary">
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

            {/* More Work Section */}
            <section aria-label="More projects">
              <h2 className="text-2xl font-bold mb-8">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {moreProjects.map((project) => (
                  <Link 
                    key={project.id} 
                    to={`/project/${project.id}`} 
                    className="group cursor-pointer"
                    aria-label={`View project: ${project.title}`}
                  >
                    <div className="aspect-square bg-foreground rounded relative overflow-hidden mb-4" role="img" aria-label={`${project.title} preview image`}>
                    </div>
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                  </Link>
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
