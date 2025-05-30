import AdminEditableContent from "@/components/AdminEditableContent";

interface AboutPageProps {
  onOpenLogin: () => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

const galleryDefaults = [
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Students in class", title: "Interactive Learning", desc: "Engaging classroom discussions and hands-on activities" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Group project", title: "Team Projects", desc: "Collaborating to solve real-world challenges" },
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Science experiment", title: "Science Lab", desc: "Exploring scientific concepts through experimentation" },
  { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Sports day", title: "Sports & Fitness", desc: "Promoting health and teamwork through sports" },
  { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Art class", title: "Creative Arts", desc: "Nurturing creativity and self-expression" },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", alt: "Graduation", title: "Graduation", desc: "Celebrating achievements and new beginnings" },
];
const timelineDefaults = [
  { year: "1990", title: "School Founded", desc: "Established with a vision to provide quality education that inspires and transforms lives." },
  { year: "2000", title: "Expansion", desc: "Expanded our campus and introduced new academic programs to meet growing demand." },
  { year: "2010", title: "Technology Integration", desc: "Implemented cutting-edge technology to enhance learning experiences and digital literacy." },
  { year: "2020", title: "Global Recognition", desc: "Ranked among the top educational institutions nationally for academic excellence." },
  { year: "2024", title: "Present Day", desc: "Continuing to innovate and set new benchmarks in education with a focus on holistic development." },
];
const teamDefaults = [
  { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", name: "Dr. Sarah Johnson", role: "Principal", specialty: "Educational Leadership", bio: "With over 20 years in education, Sarah leads our institution with vision and dedication to academic excellence." },
  { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", name: "Prof. Michael Chen", role: "Vice Principal", specialty: "Student Development", bio: "Michael brings innovative approaches to student engagement and holistic development." },
  { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", name: "Emily Rodriguez", role: "Head of Academics", specialty: "Curriculum Design", bio: "Emily leads our academic programs with a focus on innovative teaching methodologies." },
];

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
      {/* Hero Section */}
      <AdminEditableContent section="about">
        {(content, isEditing, startEdit, editableText, editableImage) => (
          <section
            className="relative flex flex-col justify-center items-center text-center min-h-[400px] py-24"
            style={{
              background:
                "linear-gradient(135deg, rgba(108, 99, 255, 0.9), rgba(74, 144, 226, 0.9)), url('https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat",
              color: "#fff",
            }}
          >
            <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                {editableText('heroTitle', 'About EduSphere', 'text-5xl md:text-6xl font-bold mb-6')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95">
                {editableText('heroSubtitle', 'Empowering the next generation of learners through innovation, excellence, and community', 'text-xl md:text-2xl mb-8')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <a href="#mission" className="bg-white text-primary font-semibold px-8 py-3 rounded-full shadow hover:-translate-y-1 transition-all duration-300">
                  Our Mission
                </a>
                <a href="#contact" className="border-2 border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white hover:text-primary transition-all duration-300">
                  Contact Us
                </a>
              </div>
            </div>
            {/* SVG Shape */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fff" />
              </svg>
            </div>
          </section>
        )}
      </AdminEditableContent>

      {/* Mission Section */}
          <AdminEditableContent section="about">
        {(content, isEditing, startEdit, editableText, editableImage) => (
          <section id="mission" className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  {editableText('missionTitle', 'Our Mission & Values', 'text-4xl font-bold mb-4')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {editableText('missionSubtitle', "Guided by our core principles, we're committed to shaping the future of education", 'text-lg text-gray-600 max-w-2xl mx-auto')}
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-12 mt-12">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">
                    {editableText('missionHeader', 'Empowering Minds, Shaping Futures', 'text-2xl font-bold mb-4')}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {editableText('missionText', 'At EduSphere, we are dedicated to providing a transformative educational experience that goes beyond traditional learning. Our mission is to empower students to become confident, creative, and compassionate individuals who can thrive in an ever-changing world.', 'text-gray-600 mb-8')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
                      <i className="fas fa-star text-3xl text-primary mb-4"></i>
                      <h3 className="font-semibold text-lg mb-2">{editableText('value1Title', 'Excellence', 'font-semibold text-lg mb-2')}</h3>
                      <p className="text-gray-600">{editableText('value1Desc', 'Striving for the highest standards in education and personal development', 'text-gray-600')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
                      <i className="fas fa-heart text-3xl text-primary mb-4"></i>
                      <h3 className="font-semibold text-lg mb-2">{editableText('value2Title', 'Integrity', 'font-semibold text-lg mb-2')}</h3>
                      <p className="text-gray-600">{editableText('value2Desc', 'Upholding honesty, ethics, and transparency in all our actions', 'text-gray-600')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
                      <i className="fas fa-handshake text-3xl text-primary mb-4"></i>
                      <h3 className="font-semibold text-lg mb-2">{editableText('value3Title', 'Community', 'font-semibold text-lg mb-2')}</h3>
                      <p className="text-gray-600">{editableText('value3Desc', 'Fostering a supportive and inclusive environment for all', 'text-gray-600')}</p>
                        </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center border border-gray-100">
                      <i className="fas fa-lightbulb text-3xl text-primary mb-4"></i>
                      <h3 className="font-semibold text-lg mb-2">{editableText('value4Title', 'Innovation', 'font-semibold text-lg mb-2')}</h3>
                      <p className="text-gray-600">{editableText('value4Desc', 'Embracing creativity and new approaches to learning', 'text-gray-600')}</p>
                      </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    {editableImage('missionImage', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'w-full h-full object-cover', 'Students collaborating')}
                  </div>
                </div>
              </div>
            </div>
          </section>
            )}
          </AdminEditableContent>

      {/* Gallery Section */}
      <AdminEditableContent section="about">
        {(content, isEditing, startEdit, editableText, editableImage) => (
          <section id="gallery" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  {editableText('galleryTitle', 'Life at EduSphere', 'text-4xl font-bold mb-4')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {editableText('gallerySubtitle', 'Experience our vibrant community through these glimpses of campus life and activities', 'text-lg text-gray-600 max-w-2xl mx-auto')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
                    {editableImage(`galleryImage${i}`, content[`galleryImage${i}`] || galleryDefaults[i-1].src, 'w-full h-72 object-cover', galleryDefaults[i-1].alt)}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-semibold text-lg mb-1">{editableText(`galleryCaption${i}Title`, galleryDefaults[i-1].title, 'font-semibold text-lg mb-1')}</h3>
                      <p className="text-sm opacity-90">{editableText(`galleryCaption${i}Desc`, galleryDefaults[i-1].desc, 'text-sm opacity-90')}</p>
                    </div>
                  </div>
                ))}
              </div>
        </div>
      </section>
        )}
      </AdminEditableContent>

      {/* History/Timeline Section */}
      <AdminEditableContent section="about">
        {(content, isEditing, startEdit, editableText) => (
          <section id="history" className="py-24 bg-white">
            <div className="container mx-auto px-4">
          <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  {editableText('timelineTitle', 'Our Journey', 'text-4xl font-bold mb-4')}
            </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {editableText('timelineSubtitle', 'Milestones that shaped EduSphere into what it is today', 'text-lg text-gray-600 max-w-2xl mx-auto')}
            </p>
          </div>
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full -translate-x-1/2"></div>
                {[0,1,2,3,4].map(i => (
                  <div key={i} className={`relative mb-16 flex ${i%2===0 ? 'justify-start' : 'justify-end'}`} style={{zIndex: 1}}>
                    <div className="w-1/2"></div>
                    <div className={`w-1/2 px-6 py-8 bg-white rounded-2xl shadow-lg border border-gray-100 ${i%2===0 ? 'ml-auto' : 'mr-auto'}`}> 
                      <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-semibold mb-3">
                        {editableText(`timelineYear${i+1}`, timelineDefaults[i].year, 'font-semibold')}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{editableText(`timelineTitle${i+1}`, timelineDefaults[i].title, 'text-xl font-bold mb-2')}</h3>
                      <p className="text-gray-600">{editableText(`timelineDesc${i+1}`, timelineDefaults[i].desc, 'text-gray-600')}</p>
                    </div>
                  </div>
                ))}
              </div>
                </div>
          </section>
        )}
      </AdminEditableContent>

      {/* Team Section */}
      <AdminEditableContent section="about">
        {(content, isEditing, startEdit, editableText, editableImage) => (
          <section id="team" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">
                  {editableText('teamTitle', 'Meet Our Leadership', 'text-4xl font-bold mb-4')}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {editableText('teamSubtitle', 'Passionate educators and administrators dedicated to your success', 'text-lg text-gray-600 max-w-2xl mx-auto')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/10">
                      {editableImage(`teamImage${i}`, teamDefaults[i-1].img, 'w-full h-full object-cover', teamDefaults[i-1].name)}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{editableText(`teamName${i}`, teamDefaults[i-1].name, 'text-2xl font-bold mb-1')}</h3>
                    <p className="text-primary font-semibold mb-2">{editableText(`teamRole${i}`, teamDefaults[i-1].role, 'text-primary font-semibold mb-2')}</p>
                    <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm mb-3 font-medium">{editableText(`teamSpecialty${i}`, teamDefaults[i-1].specialty, 'text-sm font-medium')}</div>
                    <p className="text-gray-600 mb-4">{editableText(`teamBio${i}`, teamDefaults[i-1].bio, 'text-gray-600 mb-4')}</p>
                    <div className="flex justify-center gap-4">
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white transition-all"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white transition-all"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white transition-all"><i className="fas fa-envelope"></i></a>
                    </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        )}
      </AdminEditableContent>
    </div>
  );
}