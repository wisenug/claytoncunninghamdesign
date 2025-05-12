
import { Link } from "react-router-dom";

// Updated project data with images from claytoncunninghamdesign.com
const projects = [
  {
    id: 0,
    slug: "autotrader-illustration-style",
    image: "/lovable-uploads/66eb31cd-f714-4138-a7aa-ce71d8c09815.png"
  },
  {
    id: 1,
    slug: "juice-and-co-brand-refresh",
    image: "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png" 
  },
  {
    id: 2,
    slug: "coffee-shop-mobile-app",
    image: "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png"
  },
  {
    id: 3,
    slug: "joe-juice-store-design",
    image: "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png"
  },
  {
    id: 4,
    slug: "sandwich-website-redesign",
    image: "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png"
  }
];

const Index = () => {
  return (
    <div className="animate-fade-in">
      <section className="py-20">
        <div className="portfolio-container">
          <div className="max-w-2xl">
            <h1 className="mb-6">Design studio crafting digital experiences</h1>
            <p className="text-xl text-muted-foreground">
              Creating thoughtful design solutions
            </p>
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
