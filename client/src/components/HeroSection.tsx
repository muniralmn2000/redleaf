import AdminEditableContent from "./AdminEditableContent";

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export default function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  const scrollToCourses = () => {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AdminEditableContent section="home">
      {(content, isEditing, startEdit, editableText, editableImage) => (
        <section id="home" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center pt-20 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-secondary/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full translate-y-40 -translate-x-40"></div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {editableText('title', 'EduSphere', 'inline-block')}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    {editableText('description', 'Unlock your potential with our comprehensive online learning platform. Join thousands of students mastering new skills through expert-led courses, interactive projects, and personalized learning paths.', 'block')}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={onOpenRegistration}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Today</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                  <button 
                    onClick={scrollToCourses}
                    className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary/5 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Explore Courses</span>
                    <i className="fas fa-play"></i>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">15,000+</div>
                    <div className="text-gray-600">Active Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">500+</div>
                    <div className="text-gray-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">200+</div>
                    <div className="text-gray-600">Expert Instructors</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <img 
                  src={content.image} 
                  alt="Students collaborating in modern learning environment" 
                  className="rounded-3xl shadow-2xl w-full h-auto"
                />
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Live Classes</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-certificate text-primary"></i>
                    <span className="text-sm font-medium">Certified Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
}
