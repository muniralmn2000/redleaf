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
        <section id="home" className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 md:py-24 relative pt-[100px] md:pt-[140px] overflow-x-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-secondary/10 rounded-full -translate-y-24 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full translate-y-20 -translate-x-12"></div>

          <div className="max-w-screen-lg mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-6 w-full overflow-visible bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 md:p-10 mx-auto max-w-2xl min-h-[260px] md:min-h-[320px] flex flex-col items-center my-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight break-words whitespace-pre-line w-full overflow-visible text-center">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent w-full overflow-visible">
                      welcome
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed break-words whitespace-pre-line w-full text-center">
                    {editableText('description', 'This is a very long description to test the hero box. It should wrap, expand, and always be fully visible. No text should ever be hidden, clipped, or overflow out of the box. The design should remain beautiful and readable for any amount of content. Try adding even more text to see how it behaves!', 'block')}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={onOpenRegistration}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Today</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                  <button 
                    onClick={scrollToCourses}
                    className="border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary/5 transition-all duration-300 flex items-center justify-center space-x-2"
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
                {editableImage('image', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600', 'rounded-3xl shadow-2xl w-full h-auto', 'Students collaborating in modern learning environment')}
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
