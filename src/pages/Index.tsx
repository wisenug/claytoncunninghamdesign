
import { Link } from "react-router-dom";

// Mock data for portfolio projects
const projects = [
  {
    id: 1,
    title: "Brand Refresh",
    client: "Juice & Co",
    category: "Branding",
    image: "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png",
    slug: "juice-and-co-brand-refresh"
  },
  {
    id: 2,
    title: "Mobile App Design",
    client: "Coffee Shop",
    category: "UI/UX Design",
    image: "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png",
    slug: "coffee-shop-mobile-app"
  },
  {
    id: 3,
    title: "Store Design",
    client: "Joe & The Juice",
    category: "Interior Design",
    image: "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png",
    slug: "joe-juice-store-design"
  },
  {
    id: 4,
    title: "Website Redesign",
    client: "Joe & The Sandwich",
    category: "Web Design",
    image: "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png",
    slug: "sandwich-website-redesign"
  }
];

const Index = () => {
  return (
    <div className="animate-fade-in">
      <section className="py-20">
        <div className="portfolio-container">
          <div className="max-w-2xl">
            <h1 className="mb-6">Design studio crafting digital experiences & brand identities</h1>
            <p className="text-xl text-muted-foreground">
              We create thoughtful design solutions for forward-thinking brands and businesses.
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
                <div className="overflow-hidden bg-portfolio-light rounded-lg">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.client} — {project.category}</p>
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
