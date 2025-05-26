
import { Link } from "react-router-dom";

// Updated project data to use /img folder
const projects = [
  {
    id: 0,
    slug: "grayscale",
    image: "/img/grayscale-hero.jpg"
  },
  {
    id: 1,
    slug: "autotrader-illustration-style",
    image: "/img/autotrader-illustration.jpg"
  },
  {
    id: 2,
    slug: "autotrader-icons",
    image: "/img/autotrader-icons.jpg" 
  },
  {
    id: 3,
    slug: "juice-and-co-brand-refresh",
    image: "/img/juice-co-brand.jpg" 
  }
];

const Index = () => {
  return (
    <div className="animate-fade-in">
      <section className="py-20">
        <div className="portfolio-container">
          <div className="max-w-2xl">
            <h1 className="mb-6">Design studio specializing in digital experiences, logos & illustrations</h1>
          </div>
        </div>
      </section>
      
      <section className="pb-20">
        <div className="portfolio-container">
          <div className="project-grid">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.slug}`}
                className="group"
              >
                <div className="overflow-hidden bg-portfolio-light">
                  <img 
                    src={project.image} 
                    alt={`Project ${project.id}`}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    width="600"
                    height="480"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
