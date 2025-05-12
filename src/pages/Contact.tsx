
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thanks for your message. We'll get back to you soon.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <section className="py-20">
        <div className="portfolio-container">
          <div className="max-w-2xl mb-16">
            <h1 className="mb-6">Let's work together</h1>
            <p className="text-xl text-muted-foreground">
              Have a project in mind? Send us a message to get started. We'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/50 transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/50 transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/50 transition-colors"
                  >
                    <option value="">Select subject</option>
                    <option value="Brand Design">Brand Design</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Mobile App Design">Mobile App Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/50 transition-colors"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-portfolio-dark text-white p-3 rounded-md hover:bg-black transition-colors ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-portfolio-accent p-8 rounded-2xl">
                <h3 className="text-xl font-medium mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <a href="mailto:hello@studioname.com" className="text-muted-foreground hover:text-foreground">
                      hello@studioname.com
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Phone</p>
                    <a href="tel:+1234567890" className="text-muted-foreground hover:text-foreground">
                      +1 (234) 567-890
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Address</p>
                    <address className="text-muted-foreground not-italic">
                      123 Design Street<br />
                      New York, NY 10001<br />
                      United States
                    </address>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-3">Follow Us</p>
                    <div className="flex space-x-4">
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        Instagram
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        Dribbble
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-foreground">
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
