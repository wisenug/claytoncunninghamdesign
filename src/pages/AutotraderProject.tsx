
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectHero from "../components/project/ProjectHero";
import ProjectSection from "../components/project/ProjectSection";
import ProjectGallery from "../components/project/ProjectGallery";
import ProjectHighlight from "../components/project/ProjectHighlight";
import MoreWork from "../components/project/MoreWork";

const AutotraderProject = () => {
  const moreProjects = [
    { id: 2, title: "Autotrader Icons", subtitle: "Icon System" },
    { id: 3, title: "Juice & Co Brand Refresh", subtitle: "Brand Refresh" },
    { id: 4, title: "CoTra Shop Mobile App", subtitle: "Mobile App Design" }
  ];

  const galleryImages = [
    "/public/lovable-uploads/1d5fae94-9f2f-4ae5-a77f-363a3df2d864.png",
    "/public/lovable-uploads/27fa0b27-6b16-4ebd-b1b7-4cb789df4c88.png",
    "/public/lovable-uploads/2907fa35-51b0-42fd-961a-9889e29ddaba.png"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab="work" />
      
      <div className="flex justify-center">
        <main className="w-full max-w-[1200px] px-6 md:px-12 pb-12" role="main">
          <ProjectHeader 
            title="Autotrader Illustration Style"
            subtitle="Illustration style for Autotrader. Created to work throughout the entire product experience, from UI placements of the website and mobile app, to marketing and social applications."
          />

          <ProjectHero 
            imageUrl="/public/lovable-uploads/33f92432-b94e-40b1-af7f-d165035d3244.png"
            alt="White SUV in front of city skyline illustration"
          />

          <div className="space-y-16">
            <ProjectSection>
              <p className="text-muted-foreground">
                These illustrations help to break up the images and text that make up a majority of the content on the site, and bring some fun, personality, and color to the brand.
              </p>
              <p className="text-muted-foreground">
                The style consists of three main elements: vehicles, people, and environments, as well as spot illustrations for placement within the UI where space is limited.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Vehicles"
              imageUrl="/public/lovable-uploads/3e4e3d79-2341-4051-b4a0-32ddbae388f6.png"
              imageAlt="Collection of illustrated vehicles"
            >
              <p className="text-muted-foreground">
                The vehicles needed a unique look and feel to everything else in the market. Utilizing a semi-realistic style that could help compliment the tone of the Autotrader brand and voice.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Vehicle Library Development"
              imageUrl="/public/lovable-uploads/402674a5-1f07-4341-835a-e0da28c35d32.png"
              imageAlt="Comprehensive vehicle library showing various car types"
              reverse
            >
              <p className="text-muted-foreground">
                A comprehensive vehicle library was developed featuring various car types, from sedans to SUVs to trucks. Each vehicle was carefully crafted to maintain consistency while showcasing the diversity of Autotrader's inventory.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="People"
              imageUrl="/public/lovable-uploads/4b3a3af0-aa2d-44b8-9d16-beb6449c22c7.png"
              imageAlt="Various illustrated people characters"
              reverse
            >
              <p className="text-muted-foreground">
                Establishing a character design style that was not overly trendy or cartoonish was tough to get right, but the inclusion of people helped to establish some humanity and relatability to the scenes.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Character Development"
              imageUrl="/public/lovable-uploads/53d9700b-9ab7-44e4-a1ac-4301417b3a63.png"
              imageAlt="Character development sketches"
            >
              <p className="text-muted-foreground">
                Early character sketches and development process showing the evolution from initial concepts to final illustrated characters. The goal was to create relatable, diverse characters that would resonate with Autotrader's broad customer base.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Backgrounds"
              imageUrl="/public/lovable-uploads/5b806732-6263-471d-990e-e72478b4a94e.png"
              imageAlt="Orange truck in beach landscape"
            >
              <p className="text-muted-foreground">
                Background environments were created to help establish a setting for these vehicles and people to live in. Placing a vehicle in front of a dealership, city, or landscape helped to ground them further in reality.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Environmental Elements"
              imageUrl="/public/lovable-uploads/71178437-1132-412b-8d77-4a81126d2908.png"
              imageAlt="Various environmental elements including trees, clouds, and landscape features"
              reverse
            >
              <p className="text-muted-foreground">
                A comprehensive library of environmental elements was developed to create rich, detailed backgrounds. These modular components could be mixed and matched to create diverse settings while maintaining visual consistency.
              </p>
            </ProjectSection>

            <ProjectGallery images={galleryImages} />

            <ProjectSection 
              title="Spot Illustrations"
              imageUrl="/lovable-uploads/5a584df9-40c5-4c02-b3ce-57b26da6b8bd.png"
              imageAlt="Collection of spot illustrations including badges, warning signs, and icons"
            >
              <p className="text-muted-foreground">
                Spot illustrations are simplified, and a more literal interpretation of a single concept. These images are smaller, and usually used for entry points or to represent one subsection within a larger group. They don't include people, or background imagery and there's less detail within objects.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Automotive Icon Set"
              imageUrl="/lovable-uploads/5f205967-7e0c-4e5e-814e-5529b46c488f.png"
              imageAlt="Automotive icons including steering wheel, car rotation, and service indicators"
              reverse
            >
              <p className="text-muted-foreground">
                A comprehensive set of automotive-specific icons was developed to represent various car-related concepts, services, and features throughout the Autotrader platform.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Service & Feature Icons"
              imageUrl="/lovable-uploads/21dc8291-0561-497b-906d-04fc9874986c.png"
              imageAlt="Icons representing car services, reviews, and value propositions"
            >
              <p className="text-muted-foreground">
                Additional spot illustrations were created to represent key value propositions, customer reviews, pricing information, and premium services offered by Autotrader.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Maintenance & Care Icons"
              imageUrl="/lovable-uploads/94b9ff22-2576-4ed0-b7aa-156acd5e4282.png"
              imageAlt="Icons for car maintenance including paint brush, tire, and umbrella"
              reverse
            >
              <p className="text-muted-foreground">
                A specialized set of maintenance and care icons helps users understand different service options and vehicle protection plans available through the platform.
              </p>
            </ProjectSection>

            <ProjectSection 
              title="Style Guide & Illustration Library"
              imageUrl="/lovable-uploads/d707e26c-b323-4455-8a6c-de0e8b050023.png"
              imageAlt="Comprehensive vehicle library showing various car types and styles"
            >
              <p className="text-muted-foreground">
                A style guide and illustration library for all of the various components within the library was also created. This would provide information on best practices of how and when to use certain elements, instructions on creating new pieces, and establish rules of what to do and not to do.
              </p>
            </ProjectSection>

            <ProjectSection>
              <div className="space-y-8">
                {/* Full-width hero-style image */}
                <div className="aspect-video rounded relative overflow-hidden">
                  <img 
                    src="/public/lovable-uploads/78835765-5c6e-4bb2-b960-e79d1e4a38c9.png"
                    alt="Comprehensive Autotrader illustration showcase"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Grid of three images */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="aspect-square rounded relative overflow-hidden">
                    <img 
                      src="/public/lovable-uploads/80fa7262-750d-4794-a5b0-f68446ef5c16.png"
                      alt="Autotrader illustration detail 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded relative overflow-hidden">
                    <img 
                      src="/public/lovable-uploads/94f44f71-1f6e-4474-b906-e66ddc706fbd.png"
                      alt="Autotrader illustration detail 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded relative overflow-hidden">
                    <img 
                      src="/public/lovable-uploads/a3404da1-ff93-4a59-8229-647129525ff5.png"
                      alt="Autotrader illustration detail 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </ProjectSection>

            <ProjectSection 
              title="In Application"
              imageUrl="/public/lovable-uploads/7224b87b-a260-4f05-bdf2-98219a4ff63b.png"
              imageAlt="Autotrader website with illustration integration"
            >
              <p className="text-muted-foreground">
                The illustrations seamlessly integrate into the Autotrader platform, enhancing the user experience while maintaining brand consistency across all touchpoints.
              </p>
            </ProjectSection>

          </div>

          <MoreWork projects={moreProjects} />

          <footer className="text-center py-16 text-sm text-muted-foreground" role="contentinfo">
            © 2025 Clayton Cunningham Design. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AutotraderProject;
