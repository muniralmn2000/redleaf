import AdminEditableContent from "@/components/AdminEditableContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AboutPageProps {
  onOpenLogin: () => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

export default function AboutPage({ onOpenLogin, onOpenRegistration, onOpenAdmin }: AboutPageProps) {
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
    <div className="min-h-screen bg-white">
      <Navbar onOpenLogin={onOpenLogin} onOpenRegistration={onOpenRegistration} onOpenAdmin={onOpenAdmin} />
      
      {/* Hero Section for About Page */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AdminEditableContent section="about">
            {(content, isEditing, startEdit) => (
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  {isEditing ? (
                    <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <p className="text-blue-800 font-medium text-lg">✏️ Currently editing About page content</p>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-blue-50 p-6 rounded-lg transition-colors"
                      onClick={startEdit}
                      title="Click to edit this page content"
                    >
                      <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                        <span className="text-dark">About </span>
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">EduSphere</span>
                      </h1>
                      <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-6">
                        {content?.title || "About EduSphere"}
                      </p>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {content?.description || "Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies."}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-8">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                          {stat.value}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="lg:order-first">
                  {content?.image ? (
                    <img 
                      src={content.image} 
                      alt="About EduSphere" 
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <img 
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                      alt="About EduSphere" 
                      className="w-full rounded-2xl shadow-2xl"
                    />
                  )}
                </div>
              </div>
            )}
          </AdminEditableContent>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-dark">Our </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and drive our mission forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold text-dark mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}