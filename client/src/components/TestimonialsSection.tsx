import AdminEditableContent from "./AdminEditableContent";

export default function TestimonialsSection() {
  return (
    <AdminEditableContent section="testimonials">
      {(content, isEditing, startEdit, editableText, editableImage) => (
        <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-dark">
                {editableText('mainTitle', 'What Our Students Say', 'text-4xl lg:text-5xl font-bold text-dark')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {editableText('subtitle', 'Hear from thousands of satisfied learners who have transformed their careers with EduSphere.', 'text-xl text-gray-600')}
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="space-y-6">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <blockquote className="text-gray-600 italic">
                    "{editableText('testimonial1Quote', 'EduSphere transformed my career completely. The web development course was comprehensive and the instructors were incredibly supportive throughout my learning journey.', 'text-gray-600 italic')}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    {editableImage('testimonial1Image', 'https://images.unsplash.com/photo-1494790108755-2616b612b814?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60', 'w-12 h-12 rounded-full object-cover', 'Student photo')}
                    <div>
                      <div className="font-semibold text-dark">
                        {editableText('testimonial1Name', 'Sarah Johnson', 'font-semibold text-dark')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editableText('testimonial1Role', 'Software Developer', 'text-sm text-gray-500')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="space-y-6">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <blockquote className="text-gray-600 italic">
                    "{editableText('testimonial2Quote', 'The data science program exceeded my expectations. The hands-on projects and real-world applications helped me land my dream job in analytics.', 'text-gray-600 italic')}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    {editableImage('testimonial2Image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60', 'w-12 h-12 rounded-full object-cover', 'Student photo')}
                    <div>
                      <div className="font-semibold text-dark">
                        {editableText('testimonial2Name', 'Michael Chen', 'font-semibold text-dark')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editableText('testimonial2Role', 'Data Analyst', 'text-sm text-gray-500')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="space-y-6">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <blockquote className="text-gray-600 italic">
                    "{editableText('testimonial3Quote', 'As a busy professional, the flexible schedule and high-quality content made it possible for me to upskill while working full-time. Highly recommended!', 'text-gray-600 italic')}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    {editableImage('testimonial3Image', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60', 'w-12 h-12 rounded-full object-cover', 'Student photo')}
                    <div>
                      <div className="font-semibold text-dark">
                        {editableText('testimonial3Name', 'Emily Rodriguez', 'font-semibold text-dark')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {editableText('testimonial3Role', 'Marketing Manager', 'text-sm text-gray-500')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
}