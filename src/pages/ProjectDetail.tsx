
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

// Mock data for project details
const projectsData = [
  {
    id: 1,
    title: "Illustration Style",
    image: "/lovable-uploads/66eb31cd-f714-4138-a7aa-ce71d8c09815.png",
    slug: "autotrader-illustration-style",
    description: "Created illustration style guide and vehicle & customer spot illustrations for all marketing and UI needs.",
    services: ["Illustration", "Art Direction", "Animation", "Style Guide"],
    images: [
      {
        url: "/lovable-uploads/cd7cf32d-cb54-45cc-b92c-3212681de721.png",
        caption: "Illustration used in website hero section",
        description: "White SUV with illustrated city skyline in the background"
      },
      {
        url: "/lovable-uploads/f36cd8f2-2a65-4eff-b8d6-425de6926b07.png",
        caption: "Clickable vehicle illustration",
        description: "Orange truck with computer cursor icon overlay"
      }
    ],
    designProcess: [
      {
        title: "Problem",
        description: "Autotrader needed a cohesive illustration style for all of their marketing materials, product UI, and communications that could be used across their platforms and was friendly and approachable."
      },
      {
        title: "Solution",
        description: "I created a comprehensive illustration style guide, with templates for all vehicle types and customer personas. I then illustrated hundreds of vehicles of all types, and dozens of illustrated scenes depicting vehicles and customers in different scenarios."
      },
      {
        title: "Result",
        description: "The illustrations have been implemented across all of Autotrader's digital platforms, email, and marketing. The project was so successful that we have expanded beyond my initial implementation to many more scenarios. The style guide is now used by multiple teams and product designers."
      }
    ]
  },
  {
    id: 2,
    title: "Mobile App Design",
    image: "/lovable-uploads/6888cf15-ca19-4db7-8112-982404ab95d5.png",
    slug: "coffee-shop-mobile-app",
    description: "A user-centered mobile app design for a specialty coffee chain. We created an intuitive interface that enhances the customer experience with easy ordering and a loyalty program.",
    services: ["UX Research", "UI Design", "Prototyping", "User Testing"],
    images: [],
    designProcess: []
  },
  {
    id: 3,
    title: "Store Design",
    image: "/lovable-uploads/a851a2a0-bb99-454a-8933-dd8e6aab0a60.png",
    slug: "joe-juice-store-design",
    description: "A modern interior design concept for Joe & The Juice's flagship store. We created a warm, inviting space that reflects the brand's commitment to quality and sustainability.",
    services: ["Interior Architecture", "Furniture Selection", "Lighting Design", "Environmental Branding"],
    images: [],
    designProcess: []
  },
  {
    id: 4,
    title: "Website Redesign",
    image: "/lovable-uploads/a814f0d8-6014-46c4-8b4e-f1809f52166d.png",
    slug: "sandwich-website-redesign",
    description: "A complete website redesign for Joe & The Sandwich. We developed a modern, responsive website that showcases their products and allows for easy online ordering.",
    services: ["Web Design", "Development", "Content Strategy", "SEO Optimization"],
    images: [],
    designProcess: []
  }
];

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find(p => p.slug === slug) || projectsData[0];
  
  const isAutotraderProject = project.slug === "autotrader-illustration-style";

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
      <section className="py-24">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl mb-4">{project.title}</h1>
              <p className="text-lg md:text-xl mb-8" style={{ color: "#333" }}>
                {project.description}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Services</h3>
                <ul className="text-muted-foreground">
                  {project.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main image section */}
      <section className="pb-10">
        <div className="portfolio-container">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="mb-6">
              <img 
                src={project.image} 
                alt={`${project.title} - Main Image`}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Autotrader-specific content */}
      {isAutotraderProject && (
        <>
          {/* Vehicle Spots Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Vehicle Spots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-muted-foreground mb-8">
                    I created a system of illustrated vehicles that could be used across Autotrader's digital platforms. Each vehicle was carefully designed to be recognizable as its type, while maintaining a consistent style.
                  </p>
                  <p className="text-muted-foreground">
                    These illustrations are used throughout the Autotrader website and mobile app, as well as in marketing campaigns and communications.
                  </p>
                </div>
                <div>
                  <img 
                    src="/lovable-uploads/5ce83873-8a81-43aa-8274-0513fd6a2701.png"
                    alt="Vehicle illustration grid" 
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">Sample caption</p>
                </div>
              </div>
            </div>
          </section>

          {/* Spot Illustrations Section with custom background */}
          <section className="py-16 bg-[#FAFBFB]">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Spot Illustrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <img 
                    src="/lovable-uploads/b2b315b8-2e13-41f9-bb6a-265cfe53cea1.png"
                    alt="Beach scene with orange vehicle" 
                    className="w-full mb-8"
                  />
                  <p className="text-sm text-muted-foreground mt-2 mb-8">Sample caption</p>
                  <img 
                    src="/lovable-uploads/9cb7594a-feb9-4e65-a5f5-a811316dab85.png"
                    alt="Road with orange convertible" 
                    className="w-full"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground mb-8">
                    In addition to the vehicle illustrations, I created a variety of spot illustrations to be used across Autotrader's platforms. These include landscapes, cityscapes, and lifestyle scenes.
                  </p>
                  <img 
                    src="/lovable-uploads/cd9a376e-71b3-40a6-a49b-268f2942d778.png"
                    alt="White minivan with building illustrations" 
                    className="w-full mb-8"
                  />
                  <img 
                    src="/lovable-uploads/e4edf515-a63e-463d-ab12-3b3c169c141f.png"
                    alt="SUV with house illustration" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Two Column Image Layout Example */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Two Column Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src="/lovable-uploads/cd7cf32d-cb54-45cc-b92c-3212681de721.png"
                    alt="White SUV with illustrated city skyline" 
                    className="w-full"
                  />
                </div>
                <div>
                  <img 
                    src="/lovable-uploads/f36cd8f2-2a65-4eff-b8d6-425de6926b07.png"
                    alt="Orange truck with computer cursor icon overlay" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* People Illustrations Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">People Illustrations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-muted-foreground mb-8">
                    To complement the vehicle illustrations, I created a system of people illustrations that could be used in various scenarios. These illustrations help to humanize the Autotrader brand and create a connection with users.
                  </p>
                  <p className="text-muted-foreground">
                    The people illustrations are used in marketing materials, the mobile app, and on the website to show different customer journey scenarios.
                  </p>
                </div>
                <div>
                  <img 
                    src="/lovable-uploads/5723dee0-18dc-4233-93a6-afd7dae487b4.png"
                    alt="Grid of illustrated people and vehicles" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sketch Process Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Sketch Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <img 
                    src="/lovable-uploads/c26d138e-b5b5-449e-bf07-5f176f194352.png"
                    alt="Sketches of people" 
                    className="w-full mb-8"
                  />
                  <img 
                    src="/lovable-uploads/c9484f65-073e-46c2-9f64-abbf50e0a83b.png"
                    alt="More sketches of people" 
                    className="w-full"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground mb-8">
                    The illustration process began with sketching various people types to establish the style for the Autotrader brand. I explored different face shapes, expressions, and body types to ensure diversity and inclusivity.
                  </p>
                  <p className="text-muted-foreground">
                    After establishing the basic style, I refined the sketches into clean, simple illustrations that could be easily reproduced by other designers on the team.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* UI Implementation Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">UI Implementation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-muted-foreground mb-8">
                    The illustration system was implemented across various UI elements in the Autotrader mobile app and website. The images here show examples of how the illustrations appear in different contexts.
                  </p>
                  <p className="text-muted-foreground">
                    From onboarding screens to empty states and feature highlights, the illustrations help guide users through the Autotrader experience in a friendly, approachable way.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <img 
                    src="/lovable-uploads/ebf1758e-ca6f-4ede-8a49-f67623a94307.png"
                    alt="Mobile app onboarding screens" 
                    className="w-full"
                  />
                  <img 
                    src="/lovable-uploads/0ee51e23-ffd1-40fa-bb53-3395629a167e.png"
                    alt="Mobile app screens" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Photo UI Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Photo UI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="grid grid-cols-1 gap-8">
                  <img 
                    src="/lovable-uploads/79880fd4-bbe5-4e17-b409-d3360fc19d06.png"
                    alt="Photo UI interface" 
                    className="w-full"
                  />
                  <img 
                    src="/lovable-uploads/9689d2ef-e183-46f4-9f4e-f8c1b8f6b3b5.png"
                    alt="Mobile alerts and notifications" 
                    className="w-full"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground mb-8">
                    I designed specialized UI elements for vehicle photo uploads, making it easy for sellers to take comprehensive photos of their vehicles for listings.
                  </p>
                  <p className="text-muted-foreground">
                    The interface includes clear illustrations showing the different angles needed, as well as guidance for capturing interior details, resulting in more complete and attractive vehicle listings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Web UI Section */}
          <section className="py-16">
            <div className="portfolio-container">
              <h2 className="text-2xl font-medium mb-8">Web UI</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-muted-foreground mb-8">
                    The illustration system was also implemented across Autotrader's web platform, bringing consistency between the mobile and desktop experiences.
                  </p>
                  <p className="text-muted-foreground">
                    From search results to vehicle details pages and informational content, the illustrations enhance the user experience while maintaining the brand identity.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <img 
                    src="/lovable-uploads/6d525b6c-48c6-4ff7-b6b6-4d64cb90a48f.png"
                    alt="Desktop web UI" 
                    className="w-full"
                  />
                  <img 
                    src="/lovable-uploads/9e8f3a38-ef96-4a57-8f79-e9ffead73c7c.png"
                    alt="Website interface" 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-20">
        <div className="portfolio-container">
          <h2 className="text-2xl font-medium mb-10">Process & Approach</h2>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projectsData.filter(p => p.id !== project.id).slice(0, 3).map((relatedProject) => (
              <Link 
                key={relatedProject.id} 
                to={`/projects/${relatedProject.slug}`}
                className="group"
              >
                <div className="overflow-hidden bg-portfolio-light">
                  <img 
                    src={relatedProject.image} 
                    alt={relatedProject.title} 
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">{relatedProject.title}</h4>
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
