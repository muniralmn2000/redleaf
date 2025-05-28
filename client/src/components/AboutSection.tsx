import AdminEditableContent from "./AdminEditableContent";

export default function AboutSection() {
  const stats = [
    { value: "4.8/5", label: "Average Rating", color: "text-primary" },
    { value: "95%", label: "Completion Rate", color: "text-secondary" },
    { value: "180+", label: "Countries", color: "text-accent" },
    { value: "24/7", label: "Support", color: "text-primary" }
  ];

  const values = [
    {
      title: "Excellence in Education",
      description: "We maintain the highest standards in course content and delivery.",
      color: "bg-primary"
    },
    {
      title: "Inclusive Learning",
      description: "Education should be accessible to everyone, everywhere.",
      color: "bg-secondary"
    },
    {
      title: "Innovation First",
      description: "We embrace new technologies to enhance learning experiences.",
      color: "bg-accent"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <AdminEditableContent section="about">
              {(content, isEditing, startEdit) => (
                <div className="space-y-6">
                  {isEditing ? (
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <p className="text-blue-800 font-medium">✏️ Currently editing About section</p>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-colors"
                      onClick={startEdit}
                      title="Click to edit this section"
                    >
                      <h2 className="text-4xl lg:text-5xl font-bold">
                        <span className="text-dark">About </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EduSphere</span>
                      </h2>
                      <p className="text-xl text-gray-600 leading-relaxed mt-6">
                        {content?.title || "About EduSphere"}
                      </p>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        {content?.description || "Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </AdminEditableContent>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-dark">Our Values</h3>
              <div className="space-y-3">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 ${value.color} rounded-full flex items-center justify-center mt-1`}>
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">{value.title}</h4>
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
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <i className="fas fa-award text-white"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark">Award Winner</div>
                  <div className="text-xs text-gray-600">Best EdTech 2023</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                  <i className="fas fa-globe text-white"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-dark">Global Reach</div>
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
