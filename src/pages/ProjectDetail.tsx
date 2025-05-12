
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
      {
        url: "/lovable-uploads/8af2a9c3-36c0-4dc6-afa2-095c6980ff1c.png",
        caption: "Juice & Co brand exploration showing color palette and typography guidelines.",
        description: "The brand refresh focused on organic shapes and vibrant colors to convey freshness and natural ingredients."
      }
    ],
    designProcess: [
      {
        title: "Research & Discovery",
        description: "We conducted extensive market research to understand the competitive landscape and identify opportunities for Juice & Co to stand out in the premium beverage market. Customer interviews revealed a desire for transparency in ingredients and sustainable packaging."
      },
      {
        title: "Design Decisions",
        description: "The circular logomark represents the cyclical nature of sustainable practices, while the vibrant color palette was selected to reflect the natural colors of fruits and vegetables used in their products. Typography choices focused on readability and a modern, clean aesthetic."
      },
      {
        title: "Implementation",
        description: "The new brand identity was implemented across all touchpoints, from packaging and in-store displays to digital platforms and marketing materials. We provided a comprehensive brand guideline document to ensure consistency."
      }
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
      {
        url: "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png",
        caption: "Coffee Shop mobile app showcasing the main ordering interface and product catalog.",
        description: "The design focuses on visual hierarchy and ease of navigation to streamline the ordering process."
      }
    ],
    designProcess: [
      {
        title: "User Research",
        description: "We conducted user interviews and created personas to understand customer pain points when ordering coffee on the go. The research revealed opportunities to simplify the ordering process and enhance the loyalty program experience."
      },
      {
        title: "Information Architecture",
        description: "The app structure was designed to prioritize the most common tasks: quick ordering, viewing loyalty rewards, and finding nearby locations. We implemented a tab-based navigation to keep these key functions easily accessible."
      },
      {
        title: "Visual Design",
        description: "The color palette draws from coffee tones with high contrast for readability. Typography choices prioritized legibility on small screens while maintaining brand consistency with their existing materials."
      }
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
      {
        url: "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png",
        caption: "Joe & The Juice flagship store interior featuring natural materials and brand-focused elements.",
        description: "The layout encourages flow between ordering, waiting, and seating areas to create a cohesive customer journey."
      }
    ],
    designProcess: [
      {
        title: "Concept Development",
        description: "The store design concept was developed to reflect the brand's values of freshness, transparency, and community. We utilized a combination of natural materials and brand elements to create a space that feels authentic and inviting."
      },
      {
        title: "Space Planning",
        description: "The layout was carefully considered to optimize flow between different functional areas while creating distinct zones for quick service and longer stays. The open preparation area showcases the fresh ingredients and juice-making process."
      },
      {
        title: "Material Selection",
        description: "We selected sustainable materials including reclaimed wood, recycled plastics, and low-VOC finishes to align with the brand's environmental values. The color palette draws from the vibrant hues of fresh fruits and vegetables."
      }
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
      {
        url: "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png",
        caption: "Joe & The Sandwich website homepage design highlighting product photography and streamlined navigation.",
        description: "The responsive design adapts seamlessly across devices while maintaining visual hierarchy and brand consistency."
      }
    ],
    designProcess: [
      {
        title: "Site Architecture",
        description: "We reorganized the site structure to prioritize the most important content: menu items, location information, and online ordering. The navigation was simplified to improve user flow and reduce clicks to conversion."
      },
      {
        title: "Visual Design",
        description: "The new visual design emphasizes high-quality food photography to showcase the product quality. We implemented a clean, minimalist layout that directs attention to key conversion points while maintaining brand consistency."
      },
      {
        title: "Performance Optimization",
        description: "Page load speed was a priority in the development process. We implemented modern web technologies and optimization techniques to ensure fast loading times, especially on mobile devices where most customers accessed the site."
      }
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
            Back to work
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
      
      <section className="pb-10">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* First image - full width */}
            <div className="md:col-span-12 mb-6">
              <img 
                src={project.image} 
                alt={`${project.title} - Main Image`}
                className="w-full rounded-lg"
              />
            </div>
            
            {/* Grid layout for additional images */}
            {project.images.map((image, index) => {
              // Determine if this image should be wide (every 3rd image)
              const isWide = index % 3 === 0;
              return (
                <div key={index} className={`${isWide ? 'md:col-span-12' : 'md:col-span-6'} mb-6`}>
                  <img 
                    src={image.url} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2">{image.caption}</h4>
                    <p className="text-muted-foreground">{image.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Black background section for highlighting project aspects */}
      <section className="bg-black text-white py-20">
        <div className="portfolio-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium mb-8">Project Illustrations</h2>
            <p className="text-lg mb-8 text-gray-300">
              For this project, we created a series of custom illustrations to bring the brand to life.
              The illustrations were designed to be bold, playful, and memorable, reflecting the brand's personality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img 
                  src={project.image} 
                  alt="Project illustration" 
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-gray-300">Custom illustrations showcase the product's unique features</p>
              </div>
              <div>
                <img 
                  src={project.image} 
                  alt="Project illustration" 
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-gray-300">Brand patterns developed for marketing materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-10">Design Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {project.designProcess.map((process, index) => (
              <div key={index} className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-medium mb-3">{process.title}</h3>
                <p className="text-muted-foreground">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="pb-20 border-t border-gray-200">
        <div className="portfolio-container pt-16">
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
      </section>
    </div>
  );
};

export default ProjectDetail;
