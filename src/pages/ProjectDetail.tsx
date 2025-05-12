
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

// Mock data for project details
const projectsData = [
  {
    id: 1,
    title: "Brand Refresh",
    client: "Juice & Co",
    category: "Branding",
    image: "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png",
    slug: "juice-and-co-brand-refresh",
    description: "A complete brand refresh for Juice & Co, a premium juice company focused on healthy, sustainable products. We developed a new visual identity that emphasizes freshness and quality.",
    services: ["Brand Strategy", "Visual Identity", "Packaging Design", "Digital Design"],
    year: "2024",
    images: [
      "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png"
    ]
  },
  {
    id: 2,
    title: "Mobile App Design",
    client: "Coffee Shop",
    category: "UI/UX Design",
    image: "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png",
    slug: "coffee-shop-mobile-app",
    description: "A user-centered mobile app design for a specialty coffee chain. We created an intuitive interface that enhances the customer experience with easy ordering and a loyalty program.",
    services: ["UX Research", "UI Design", "Prototyping", "User Testing"],
    year: "2023",
    images: [
      "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png"
    ]
  },
  {
    id: 3,
    title: "Store Design",
    client: "Joe & The Juice",
    category: "Interior Design",
    image: "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png",
    slug: "joe-juice-store-design",
    description: "A modern interior design concept for Joe & The Juice's flagship store. We created a warm, inviting space that reflects the brand's commitment to quality and sustainability.",
    services: ["Interior Architecture", "Furniture Selection", "Lighting Design", "Environmental Branding"],
    year: "2023",
    images: [
      "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png"
    ]
  },
  {
    id: 4,
    title: "Website Redesign",
    client: "Joe & The Sandwich",
    category: "Web Design",
    image: "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png",
    slug: "sandwich-website-redesign",
    description: "A complete website redesign for Joe & The Sandwich. We developed a modern, responsive website that showcases their products and allows for easy online ordering.",
    services: ["Web Design", "Development", "Content Strategy", "SEO Optimization"],
    year: "2022",
    images: [
      "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png"
    ]
  }
];

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="portfolio-container py-20">
        <h1>Project not found</h1>
        <Link to="/" className="mt-6 inline-block border-b border-black">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="py-12">
        <div className="portfolio-container">
          <Link to="/" className="inline-flex items-center text-sm mb-8 hover:text-muted-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-arrow-left mr-2"
            >
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to projects
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl mb-4">{project.title}</h1>
              <p className="text-lg mb-8 text-muted-foreground">
                {project.description}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Client</h3>
                <p className="text-muted-foreground">{project.client}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <ul className="text-muted-foreground">
                  {project.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Year</h3>
                <p className="text-muted-foreground">{project.year}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pb-20">
        <div className="portfolio-container">
          {project.images.map((image, index) => (
            <div key={index} className="mb-12">
              <img 
                src={image} 
                alt={`${project.title} - Image ${index + 1}`} 
                className="w-full rounded-lg"
              />
            </div>
          ))}
        </div>
        
        <div className="portfolio-container mt-12">
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl mb-8">More Projects</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {projectsData.filter(p => p.id !== project.id).slice(0, 4).map((relatedProject) => (
                <Link 
                  key={relatedProject.id} 
                  to={`/projects/${relatedProject.slug}`}
                  className="group"
                >
                  <div className="overflow-hidden bg-portfolio-light rounded-lg">
                    <img 
                      src={relatedProject.image} 
                      alt={relatedProject.title} 
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">{relatedProject.title}</h4>
                    <p className="text-xs text-muted-foreground">{relatedProject.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
