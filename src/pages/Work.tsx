import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Work = () => {
  const projects = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: "Project Title",
    description: "Subheading. Lorem ipsum dolor sit amet consectetur. Eleifend mattis sed et egestas saerra dignissim sed ultrices id."
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="work" />
      
      <div className="flex justify-center">
        <main className="w-full max-w-[1200px] px-6 md:px-12 pb-12">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Design studio specializing in digital experiences, logos & illustrations
            </h1>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {projects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`} className="group cursor-pointer">
                <div className="aspect-square bg-accent rounded-2xl mb-4 relative overflow-hidden">
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
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Work;
