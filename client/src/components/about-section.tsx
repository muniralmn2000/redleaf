export default function AboutSection() {
  const values = [
    {
      title: "Excellence in Education",
      description: "We maintain the highest standards in course content and delivery.",
      color: "primary"
    },
    {
      title: "Inclusive Learning", 
      description: "Education should be accessible to everyone, everywhere.",
      color: "secondary"
    },
    {
      title: "Innovation First",
      description: "We embrace new technologies to enhance learning experiences.", 
      color: "accent"
    }
  ];

  const stats = [
    { value: "4.8/5", label: "Average Rating" },
    { value: "95%", label: "Completion Rate" },
    { value: "180+", label: "Countries" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <section id="about" className="py-20 section-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                <span className="text-[hsl(var(--edusphere-dark))]">About </span>
                <span className="text-gradient">EduSphere</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to democratize education by making high-quality learning accessible to everyone, regardless of location or background. We believe that education is the key to unlocking human potential and creating a better future for all.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className={`text-3xl font-bold ${
                    index % 4 === 0 ? "text-[hsl(var(--edusphere-primary))]" :
                    index % 4 === 1 ? "text-[hsl(var(--edusphere-secondary))]" :
                    index % 4 === 2 ? "text-[hsl(var(--edusphere-accent))]" :
                    "text-[hsl(var(--edusphere-primary))]"
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[hsl(var(--edusphere-dark))]">Our Values</h3>
              <div className="space-y-3">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      value.color === 'primary' ? "bg-[hsl(var(--edusphere-primary))]" :
                      value.color === 'secondary' ? "bg-[hsl(var(--edusphere-secondary))]" :
                      "bg-[hsl(var(--edusphere-accent))]"
                    }`}>
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[hsl(var(--edusphere-dark))]">{value.title}</h4>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern educational institution with students"
              className="rounded-3xl shadow-2xl w-full h-auto"
            />
            
            {/* Floating Achievement Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--edusphere-primary))] to-[hsl(var(--edusphere-secondary))] rounded-full flex items-center justify-center">
                  <i className="fas fa-award text-white"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[hsl(var(--edusphere-dark))]">Award Winner</div>
                  <div className="text-xs text-gray-600">Best EdTech 2023</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--edusphere-accent))] to-[hsl(var(--edusphere-primary))] rounded-full flex items-center justify-center">
                  <i className="fas fa-globe text-white"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[hsl(var(--edusphere-dark))]">Global Reach</div>
                  <div className="text-xs text-gray-600">180+ Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
