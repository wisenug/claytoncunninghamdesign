
import { Link } from "react-router-dom";

// Updated project data with images from claytoncunninghamdesign.com
const projects = [
  {
    id: 0,
    slug: "grayscale",
    image: "/lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png"
  },
  {
    id: 1,
    slug: "autotrader-illustration-style",
    image: "/lovable-uploads/66eb31cd-f714-4138-a7aa-ce71d8c09815.png"
  },
  {
    id: 2,
    slug: "autotrader-icons",
    image: "/lovable-uploads/33e76d34-6424-4972-843a-38e12a1a3fc4.png" 
  },
  {
    id: 3,
    slug: "juice-and-co-brand-refresh",
    image: "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png" 
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
