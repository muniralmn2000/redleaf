interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export default function HeroSection({ onOpenRegistration }: HeroSectionProps) {
  const scrollToCourses = () => {
    const element = document.getElementById('courses');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen hero-background flex items-center pt-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-[hsl(var(--edusphere-primary))]/10 to-[hsl(var(--edusphere-secondary))]/10 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-[hsl(var(--edusphere-accent))]/10 to-[hsl(var(--edusphere-primary))]/10 rounded-full translate-y-40 -translate-x-40"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 fade-in-up">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient">
                  Transform Your
                </span>
                <br />
                <span className="text-[hsl(var(--edusphere-dark))]">Learning Journey</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join thousands of students and educators in our modern learning platform. Access quality education, connect with expert instructors, and unlock your potential.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onOpenRegistration}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <span>Get Started Today</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              <button 
                onClick={scrollToCourses}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <span>Explore Courses</span>
                <i className="fas fa-play"></i>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--edusphere-primary))]">15,000+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--edusphere-secondary))]">500+</div>
                <div className="text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[hsl(var(--edusphere-accent))]">200+</div>
                <div className="text-gray-600">Expert Instructors</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Students collaborating in modern learning environment" 
              className="rounded-3xl shadow-2xl w-full h-auto float-animation"
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
                <i className="fas fa-certificate text-[hsl(var(--edusphere-primary))]"></i>
                <span className="text-sm font-medium">Certified Courses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
