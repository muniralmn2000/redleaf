import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminEditableContent from "./AdminEditableContent";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
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
        subject: "General Inquiry",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AdminEditableContent section="contact">
      {(content, isEditing, startEdit, editableText, editableImage) => (
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-dark">
                  {editableText('mainTitle', 'Let\'s Connect', 'text-4xl lg:text-5xl font-bold')}
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {editableText('description', 'Ready to start your learning journey or have questions about our courses? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.', 'text-xl text-gray-600')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 
                    className={`text-2xl font-semibold text-dark ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-2 rounded' : ''}`}
                    onClick={isEditing ? startEdit : undefined}
                  >
                    {content?.subTitle || 'Let\'s Start a Conversation'}
                  </h3>
                  <p 
                    className={`text-gray-600 leading-relaxed ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-2 rounded' : ''}`}
                    onClick={isEditing ? startEdit : undefined}
                  >
                    {content?.subDescription || 'Whether you\'re a prospective student, current learner, or educational partner, we\'d love to hear from you. Our support team is available 24/7 to assist with any inquiries.'}
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <i className="fas fa-envelope text-white"></i>
                    </div>
                    <div>
                      <h4 
                        className={`font-semibold text-dark mb-1 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.emailTitle || 'Email Us'}
                      </h4>
                      <p 
                        className={`text-gray-600 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.email || 'hello@edusphere.com'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center">
                      <i className="fas fa-phone text-white"></i>
                    </div>
                    <div>
                      <h4 
                        className={`font-semibold text-dark mb-1 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.phoneTitle || 'Call Us'}
                      </h4>
                      <p 
                        className={`text-gray-600 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.phone || '+1 (555) 123-4567'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center">
                      <i className="fas fa-clock text-white"></i>
                    </div>
                    <div>
                      <h4 
                        className={`font-semibold text-dark mb-1 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.hoursTitle || 'Support Hours'}
                      </h4>
                      <p 
                        className={`text-gray-600 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.hours || '24/7 Online Support'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 
                  className={`text-2xl font-semibold text-dark mb-6 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-2 rounded' : ''}`}
                  onClick={isEditing ? startEdit : undefined}
                >
                  {content?.formTitle || 'Send us a Message'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label 
                        className={`block text-sm font-medium text-dark mb-2 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.firstNameLabel || 'First Name'}
                      </label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                        placeholder={content?.firstNamePlaceholder || "Your first name"}
                      />
                    </div>
                    <div>
                      <label 
                        className={`block text-sm font-medium text-dark mb-2 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                        onClick={isEditing ? startEdit : undefined}
                      >
                        {content?.lastNameLabel || 'Last Name'}
                      </label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                        placeholder={content?.lastNamePlaceholder || "Your last name"}
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      className={`block text-sm font-medium text-dark mb-2 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                      onClick={isEditing ? startEdit : undefined}
                    >
                      {content?.emailLabel || 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                      placeholder={content?.emailPlaceholder || "your.email@example.com"}
                    />
                  </div>

                  <div>
                    <label 
                      className={`block text-sm font-medium text-dark mb-2 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                      onClick={isEditing ? startEdit : undefined}
                    >
                      {content?.subjectLabel || 'Subject'}
                    </label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                    >
                      <option value="General Inquiry">{content?.option1 || 'General Inquiry'}</option>
                      <option value="Course Information">{content?.option2 || 'Course Information'}</option>
                      <option value="Technical Support">{content?.option3 || 'Technical Support'}</option>
                      <option value="Partnership">{content?.option4 || 'Partnership'}</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      className={`block text-sm font-medium text-dark mb-2 ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-1 rounded' : ''}`}
                      onClick={isEditing ? startEdit : undefined}
                    >
                      {content?.messageLabel || 'Message'}
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none" 
                      placeholder={content?.messagePlaceholder || "Tell us how we can help you..."}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span 
                      className={`${isEditing ? 'cursor-pointer hover:bg-yellow-100/20 p-1 rounded' : ''}`}
                      onClick={isEditing ? startEdit : undefined}
                    >
                      {contactMutation.isPending ? (content?.sendingText || "Sending...") : (content?.buttonText || "Send Message")}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
}