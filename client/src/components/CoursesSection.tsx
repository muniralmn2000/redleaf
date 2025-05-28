import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import AdminEditableContent from "./AdminEditableContent";

export default function CoursesSection() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  if (isLoading) {
    return (
      <section id="courses" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AdminEditableContent section="courses">
      {(content, isEditing, startEdit) => (
        <section id="courses" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 
                className={`text-4xl lg:text-5xl font-bold ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-2 rounded' : ''}`}
                onClick={isEditing ? startEdit : undefined}
              >
                <span className="text-dark">Popular </span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {content?.title || 'Courses'}
                </span>
              </h2>
              <p 
                className={`text-xl text-gray-600 max-w-3xl mx-auto ${isEditing ? 'cursor-pointer hover:bg-yellow-100 p-2 rounded' : ''}`}
                onClick={isEditing ? startEdit : undefined}
              >
                {content?.description || 'Discover our most enrolled courses across various disciplines, designed to help you achieve your learning goals.'}
              </p>
            </div>

        {/* Course Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="bg-primary text-white px-6 py-2 rounded-full font-medium">All Courses</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-full font-medium transition-colors duration-300">Technology</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-full font-medium transition-colors duration-300">Business</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-full font-medium transition-colors duration-300">Arts</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-full font-medium transition-colors duration-300">Science</button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <i className="fas fa-star"></i>
                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-dark mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <i className="fas fa-clock mr-1"></i>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <i className="fas fa-users mr-1"></i>
                    <span>{course.studentCount} students</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">${course.price}</div>
                  <button className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
            {/* View All Courses Button */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                View All Courses
              </button>
            </div>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
}
