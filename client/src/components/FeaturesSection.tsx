import AdminEditableContent from "./AdminEditableContent";

export default function FeaturesSection() {
  return (
    <AdminEditableContent section="features">
      {(content, isEditing, startEdit, editableText, editableImage) => (
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-dark">
                {editableText('mainTitle', 'Why Choose EduSphere?', 'text-4xl lg:text-5xl font-bold text-dark')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {editableText('subtitle', 'Discover the features that make our platform the perfect choice for your educational journey.', 'text-xl text-gray-600')}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl">
                    📚
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature1Title', 'Interactive Learning', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature1Description', 'Engage with dynamic content, real-time quizzes, and interactive assignments that make learning enjoyable and effective.', 'text-gray-600')}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl">
                    👨‍🏫
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature2Title', 'Expert Instructors', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature2Description', 'Learn from industry professionals and academic experts who bring real-world experience to every lesson.', 'text-gray-600')}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center text-white text-2xl">
                    ⏰
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature3Title', 'Flexible Schedule', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature3Description', 'Study at your own pace with 24/7 access to course materials and the ability to fit learning into your lifestyle.', 'text-gray-600')}
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                    🏆
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature4Title', 'Certification', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature4Description', 'Earn industry-recognized certificates that boost your credentials and career prospects.', 'text-gray-600')}
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group bg-gradient-to-br from-yellow-50 to-red-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl">
                    🤝
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature5Title', 'Community Support', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature5Description', 'Join a vibrant community of learners and get support from peers and mentors throughout your journey.', 'text-gray-600')}
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                    📱
                  </div>
                  <h3 className="text-xl font-bold text-dark">
                    {editableText('feature6Title', 'Mobile Learning', 'text-xl font-bold text-dark')}
                  </h3>
                  <p className="text-gray-600">
                    {editableText('feature6Description', 'Access your courses anytime, anywhere with our mobile-optimized platform and offline capabilities.', 'text-gray-600')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
}