import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminEditableContent from "@/components/AdminEditableContent";

interface ContactPageProps {
  onOpenLogin: () => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

export default function ContactPage({ onOpenLogin, onOpenRegistration, onOpenAdmin }: ContactPageProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    // Auto-fill for logged-in users
    const userFullName = localStorage.getItem("userFullName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";
    let firstName = "";
    let lastName = "";
    if (userFullName) {
      const parts = userFullName.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || "";
    }
    setFormData(prev => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: lastName || prev.lastName,
      email: userEmail || prev.email,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="hero min-h-screen flex items-center pt-32 pb-12 bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] relative overflow-hidden">
        <div className="hero-content grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto px-4 z-10">
          <AdminEditableContent section="contact">
            {(content, isEditing, startEdit, editableText) => (
              <div className="hero-text text-white flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {editableText('heroTitle', "Let's Connect", "text-4xl md:text-5xl lg:text-6xl font-bold mb-6")}
                    </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  {editableText('heroSubtitle', "Have questions or feedback? We're here to help and would love to hear from you. Our team is dedicated to providing you with the best support possible.", "text-lg md:text-xl mb-8 opacity-90")}
                </p>
              </div>
            )}
          </AdminEditableContent>
          <div className="hero-image flex justify-center items-center">
            <div className="image-card bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative z-10">
              <AdminEditableContent section="contact">
                {(content, isEditing, startEdit, editableText) => (
                  <>
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#2D3748]">
                      {editableText('formTitle', 'Send us a message', 'text-2xl font-bold mb-6 text-center text-[#2D3748]')}
                    </h2>
                    <form className="contact-form space-y-6" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="firstName" className="block mb-2 font-medium text-[#2D3748]">First Name</label>
                        <input type="text" id="firstName" name="firstName" className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent" placeholder="Your first name" required value={formData.firstName} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName" className="block mb-2 font-medium text-[#2D3748]">Last Name</label>
                        <input type="text" id="lastName" name="lastName" className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent" placeholder="Your last name" required value={formData.lastName} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email" className="block mb-2 font-medium text-[#2D3748]">Email Address</label>
                        <input type="email" id="email" name="email" className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent" placeholder="your@email.com" required value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject" className="block mb-2 font-medium text-[#2D3748]">Subject</label>
                        <input type="text" id="subject" name="subject" className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent" placeholder="How can we help?" value={formData.subject} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message" className="block mb-2 font-medium text-[#2D3748]">Your Message</label>
                        <textarea id="message" name="message" className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent min-h-[120px] resize-vertical" placeholder="Type your message here..." required value={formData.message} onChange={handleChange}></textarea>
                      </div>
                      <button type="submit" className="submit-btn w-full bg-[#6C63FF] hover:bg-[#4A90E2] text-white font-semibold py-3 rounded-full transition-all duration-300 disabled:opacity-60" disabled={contactMutation.isPending}>
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </>
                )}
              </AdminEditableContent>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://assets.codepen.io/3364143/glass.png')] bg-center bg-cover opacity-10 z-0"></div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info bg-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <AdminEditableContent section="contact">
            {(content, isEditing, startEdit, editableText) => (
              <>
                <h2 className="text-3xl font-bold text-center mb-12 text-[#2D3748]">
                  {editableText('infoTitle', 'Other Ways to Reach Us', 'text-3xl font-bold text-center mb-12 text-[#2D3748]')}
                </h2>
                <div className="info-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="info-card bg-[#f8f9fa] rounded-xl p-8 text-center shadow hover:shadow-lg transition-all">
                    <i className="fas fa-envelope text-4xl text-[#6C63FF] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2 text-[#2D3748]">
                      {editableText('emailTitle', 'Email Us', 'text-xl font-semibold mb-2 text-[#2D3748]')}
                    </h3>
                    <p className="text-[#718096]">
                      <a href={`mailto:${content?.email || 'info@edusphere.com'}`} className="hover:text-[#6C63FF] transition-colors">
                        {editableText('email', 'info@edusphere.com', 'text-[#718096]')}
                      </a>
                    </p>
                  </div>
                  <div className="info-card bg-[#f8f9fa] rounded-xl p-8 text-center shadow hover:shadow-lg transition-all">
                    <i className="fas fa-phone text-4xl text-[#4A90E2] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2 text-[#2D3748]">
                      {editableText('phoneTitle', 'Call Us', 'text-xl font-semibold mb-2 text-[#2D3748]')}
                    </h3>
                    <p className="text-[#718096]">
                      <a href={`tel:${content?.phone || '+1234567890'}`} className="hover:text-[#4A90E2] transition-colors">
                        {editableText('phone', '+1 (234) 567-890', 'text-[#718096]')}
                      </a>
                    </p>
                  </div>
                  <div className="info-card bg-[#f8f9fa] rounded-xl p-8 text-center shadow hover:shadow-lg transition-all">
                    <i className="fas fa-map-marker-alt text-4xl text-[#FF6B6B] mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2 text-[#2D3748]">
                      {editableText('addressTitle', 'Visit Us', 'text-xl font-semibold mb-2 text-[#2D3748]')}
                    </h3>
                    <p className="text-[#718096]">
                      {editableText('address', '123 Education Street\nLearning City, 10101', 'text-[#718096]')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </AdminEditableContent>
        </div>
      </section>

      {/* Map Section */}
      <div className="map-container w-full h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209060729!2d-73.9881176845938!3d40.74844047932787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0x4a01c8dc9c8a3f0b!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Our Location on Google Maps"
          aria-label="Interactive map showing our location"
        ></iframe>
      </div>
    </div>
  );
}