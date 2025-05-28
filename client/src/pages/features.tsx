import AdminEditableContent from "@/components/AdminEditableContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

interface FeaturesPageProps {
  onOpenLogin: () => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

export default function FeaturesPage({ onOpenLogin, onOpenRegistration, onOpenAdmin }: FeaturesPageProps) {
  const features = [
    {
      icon: "fas fa-chalkboard-teacher",
      title: "Interactive Learning",
      description: "Engage with dynamic content, real-time quizzes, and interactive assignments that make learning enjoyable and effective.",
      gradient: "from-primary to-secondary"
    },
    {
      icon: "fas fa-user-graduate",
      title: "Expert Instructors",
      description: "Learn from industry professionals and academic experts who bring real-world experience to every lesson.",
      gradient: "from-secondary to-accent"
    },
    {
      icon: "fas fa-clock",
      title: "Flexible Schedule",
      description: "Study at your own pace with 24/7 access to course materials and the ability to fit learning into your lifestyle.",
      gradient: "from-accent to-primary"
    },
    {
      icon: "fas fa-certificate",
      title: "Industry Certification",
      description: "Earn recognized certificates that enhance your professional profile and open new career opportunities.",
      gradient: "from-primary to-secondary"
    },
    {
      icon: "fas fa-users",
      title: "Community Support",
      description: "Join a vibrant community of learners, participate in discussions, and collaborate on projects with peers worldwide.",
      gradient: "from-secondary to-accent"
    },
    {
      icon: "fas fa-briefcase",
      title: "Career Services",
      description: "Access career guidance, job placement assistance, and networking opportunities to advance your professional journey.",
      gradient: "from-accent to-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenLogin={onOpenLogin} onOpenRegistration={onOpenRegistration} onOpenAdmin={onOpenAdmin} />
      
      {/* Hero Section for Features Page */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AdminEditableContent section="features">
            {(content, isEditing, startEdit) => (
              <div className="text-center space-y-8">
                {isEditing ? (
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <p className="text-blue-800 font-medium text-lg">✏️ Currently editing Features page content</p>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-blue-50 p-6 rounded-lg transition-colors"
                    onClick={startEdit}
                    title="Click to edit this page content"
                  >
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {content?.title || "Why Choose EduSphere?"}
                      </span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                      {content?.description || "Discover the features that make our platform the preferred choice for modern learners worldwide."}
                    </p>
                    {content?.image && (
                      <div className="mt-12">
                        <img 
                          src={content.image} 
                          alt="Features" 
                          className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </AdminEditableContent>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-dark mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
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