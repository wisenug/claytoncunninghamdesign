
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Work = () => {
  const projects = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: "Project Title"
  }));

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
                  to={`/project/${project.id}`} 
                  className="group cursor-pointer"
                  aria-label={`View project: ${project.title}`}
                >
                  <div className="aspect-square bg-accent rounded relative overflow-hidden" role="img" aria-label={`${project.title} preview image`}>
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
