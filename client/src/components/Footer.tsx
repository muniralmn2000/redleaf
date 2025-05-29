import AdminEditableContent from "./AdminEditableContent";

export default function Footer() {
  const quickLinks = ["Home", "Features", "Courses", "About", "Contact"];
  const supportLinks = ["Help Center", "Student Portal", "Teacher Resources", "Technical Support", "Community Forum"];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AdminEditableContent section="footer">
      {(content, isEditing, startEdit, editableText) => (
        <footer className="bg-dark text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-white text-lg"></i>
                  </div>
                  <div>
                    <span className="text-xl font-semibold">{editableText('brand', 'EduSphere', 'text-xl font-semibold')}</span>
                    <span className="text-sm font-bold text-secondary ml-2">{editableText('brandSub', 'EDUCATION', 'text-sm font-bold text-secondary ml-2')}</span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {editableText('companyDesc', 'Empowering learners worldwide with innovative online education and cutting-edge learning technologies.', 'text-gray-300 leading-relaxed')}
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{editableText('quickLinksTitle', 'Quick Links', 'text-lg font-semibold')}</h3>
                <div className="space-y-3">
                  {quickLinks.map((link, i) => (
                    <span key={link} className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
                      {editableText(`quickLink${String(i+1)}`, link, 'text-gray-300')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{editableText('supportTitle', 'Support', 'text-lg font-semibold')}</h3>
                <div className="space-y-3">
                  {supportLinks.map((link, i) => (
                    <span key={link} className="block text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer">
                      {editableText(`supportLink${String(i+1)}`, link, 'text-gray-300')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{editableText('contactTitle', 'Contact Info', 'text-lg font-semibold')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                    <div className="text-gray-300">
                      <p>{editableText('addressLine1', '123 Education Street', 'text-gray-300')}</p>
                      <p>{editableText('addressLine2', 'Learning City, LC 12345', 'text-gray-300')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-phone text-primary"></i>
                    <p className="text-gray-300">{editableText('phone', '+1 (555) 123-4567', 'text-gray-300')}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-primary"></i>
                    <p className="text-gray-300">{editableText('email', 'support@edusphere.com', 'text-gray-300')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-700 pt-8 mt-12">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm">
                  {editableText('copyright', '© 2024 EduSphere Education Platform. All rights reserved.', 'text-gray-400 text-sm')}
                </p>
                <div className="flex space-x-6">
                  <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">{editableText('privacy', 'Privacy Policy', 'text-gray-400 text-sm')}</span>
                  <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">{editableText('terms', 'Terms of Service', 'text-gray-400 text-sm')}</span>
                  <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">{editableText('cookie', 'Cookie Policy', 'text-gray-400 text-sm')}</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </AdminEditableContent>
  );
}
