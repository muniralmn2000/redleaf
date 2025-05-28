export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "EduSphere transformed my career completely. The web development course was comprehensive and the instructors were incredibly supportive throughout my learning journey.",
      name: "Sarah Johnson",
      role: "Software Developer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c69c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
      gradient: "from-blue-50 to-purple-50"
    },
    {
      id: 2,
      quote: "The data science program exceeded my expectations. The hands-on projects and real-world applications helped me land my dream job in analytics.",
      name: "Michael Chen",
      role: "Data Analyst", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
      gradient: "from-purple-50 to-pink-50"
    },
    {
      id: 3,
      quote: "As a busy professional, the flexible schedule and high-quality content made it possible for me to upskill while working full-time. Highly recommended!",
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
      gradient: "from-pink-50 to-orange-50"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-[hsl(var(--edusphere-dark))]">What Our </span>
            <span className="text-gradient">Students Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from our learning community about their transformative educational experiences.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className={`bg-gradient-to-br ${testimonial.gradient} rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="text-6xl text-[hsl(var(--edusphere-primary))]/20 font-serif mb-4">"</div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar}
                  alt={`${testimonial.name} profile`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-[hsl(var(--edusphere-dark))]">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
