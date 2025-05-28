import { useState } from "react";

export default function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState("All Courses");
  
  const categories = ["All Courses", "Technology", "Business", "Arts", "Science"];
  
  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Master modern web technologies including React, Node.js, and MongoDB to build complete web applications.",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      rating: 4.9,
      duration: "12 weeks",
      students: "2,456 students",
      price: "$199",
      gradient: "from-[hsl(var(--edusphere-primary))] to-[hsl(var(--edusphere-secondary))]"
    },
    {
      id: 2,
      title: "Data Science & Analytics", 
      description: "Learn Python, machine learning, and statistical analysis to extract insights from complex datasets.",
      category: "Science",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      rating: 4.8,
      duration: "16 weeks", 
      students: "1,892 students",
      price: "$249",
      gradient: "from-[hsl(var(--edusphere-secondary))] to-[hsl(var(--edusphere-accent))]"
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      description: "Master SEO, social media marketing, content strategy, and analytics to grow your digital presence.",
      category: "Business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
      rating: 4.7,
      duration: "10 weeks",
      students: "3,241 students", 
      price: "$149",
      gradient: "from-[hsl(var(--edusphere-accent))] to-[hsl(var(--edusphere-primary))]"
    }
  ];

  const filteredCourses = activeCategory === "All Courses" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <section id="courses" className="py-20 section-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-[hsl(var(--edusphere-dark))]">Popular </span>
            <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most enrolled courses across various disciplines, designed to help you achieve your learning goals.
          </p>
        </div>

        {/* Course Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
                activeCategory === category
                  ? "bg-[hsl(var(--edusphere-primary))] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={course.image}
                alt={`${course.title} course preview`}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`bg-gradient-to-r ${course.gradient} bg-opacity-10 text-[hsl(var(--edusphere-primary))] px-3 py-1 rounded-full text-sm font-medium`}>
                    {course.category}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <i className="fas fa-star"></i>
                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-[hsl(var(--edusphere-dark))] mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <i className="fas fa-users mr-1"></i>
                    <span>{course.students}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[hsl(var(--edusphere-primary))]">{course.price}</div>
                  <button className={`bg-gradient-to-r ${course.gradient} text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300`}>
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Courses Button */}
        <div className="text-center mt-12">
          <button className="btn-primary">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}
