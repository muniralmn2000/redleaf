export default function FeaturesSection() {
  const features = [
    {
      icon: "fas fa-chalkboard-teacher",
      title: "Interactive Learning",
      description: "Engage with dynamic content, real-time quizzes, and interactive assignments that make learning enjoyable and effective.",
      gradient: "from-[hsl(var(--edusphere-primary))] to-[hsl(var(--edusphere-secondary))]"
    },
    {
      icon: "fas fa-user-graduate", 
      title: "Expert Instructors",
      description: "Learn from industry professionals and academic experts who bring real-world experience to every lesson.",
      gradient: "from-[hsl(var(--edusphere-secondary))] to-[hsl(var(--edusphere-accent))]"
    },
    {
      icon: "fas fa-clock",
      title: "Flexible Schedule", 
      description: "Study at your own pace with 24/7 access to course materials and the ability to fit learning into your lifestyle.",
      gradient: "from-[hsl(var(--edusphere-accent))] to-[hsl(var(--edusphere-primary))]"
    },
    {
      icon: "fas fa-certificate",
      title: "Industry Certification",
      description: "Earn recognized certificates that enhance your professional profile and open new career opportunities.",
      gradient: "from-[hsl(var(--edusphere-primary))] to-[hsl(var(--edusphere-secondary))]"
    },
    {
      icon: "fas fa-users",
      title: "Community Support",
      description: "Join a vibrant community of learners, participate in discussions, and collaborate on projects with peers worldwide.",
      gradient: "from-[hsl(var(--edusphere-secondary))] to-[hsl(var(--edusphere-accent))]"
    },
    {
      icon: "fas fa-briefcase",
      title: "Career Services",
      description: "Access career guidance, job placement assistance, and networking opportunities to advance your professional journey.",
      gradient: "from-[hsl(var(--edusphere-accent))] to-[hsl(var(--edusphere-primary))]"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-gradient">Why Choose</span>
            <span className="text-[hsl(var(--edusphere-dark))]"> EduSphere?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with proven educational methodologies to deliver exceptional learning experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[hsl(var(--edusphere-primary))]/20 card-hover"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-[hsl(var(--edusphere-dark))] mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
