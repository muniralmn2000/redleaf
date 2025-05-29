import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Course } from "@shared/schema";
import AdminEditableContent from "./AdminEditableContent";
import { apiRequest } from "@/lib/queryClient";

const defaultCategories = [
  "All",
  "Technology",
  "Business",
  "Science",
  "Arts"
];

const defaultFeatures = [
  {
    icon: "fa-certificate",
    title: "Certified Programs",
    description: "All courses are accredited and recognized globally"
  },
  {
    icon: "fa-chalkboard-teacher",
    title: "Expert Instructors",
    description: "Learn from industry professionals and experienced educators"
  },
  {
    icon: "fa-laptop",
    title: "Flexible Learning",
    description: "Study at your own pace with online and offline options"
  },
  {
    icon: "fa-users",
    title: "Community Support",
    description: "Join a community of learners and get peer support"
  }
];

export default function CoursesSection() {
  const queryClient = useQueryClient();
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    refetchInterval: 2000,
  });

  // Admin-editable categories and features (from content.json)
  // For now, fallback to defaults if not present
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Admin add/delete course
  const addCourseMutation = useMutation({
    mutationFn: async () => {
      const newCourse = {
        title: "New Course",
        description: "Course description...",
        category: "Technology",
        price: 0,
        duration: "4 weeks",
        studentCount: 0,
        rating: "4.8",
        imageUrl: "",
        isActive: true,
      };
      return await apiRequest("POST", "/api/courses", newCourse);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/courses"] }),
  });
  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/courses"] }),
  });

  // For features add mutation
  const latestContentRef = useRef<any>(null);
  const addFeatureMutation = useMutation({
    mutationFn: async () => {
      const content = latestContentRef.current;
      const newFeature = {
        icon: "fa-star",
        title: "New Feature",
        description: "Feature description..."
      };
      return await apiRequest("PUT", "/api/admin/page-content", {
        page: "courses",
        features: [...(content?.features || defaultFeatures), newFeature]
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content"] }),
  });

  const [editingFeatureIdx, setEditingFeatureIdx] = useState<number | null>(null);
  const [featureDraft, setFeatureDraft] = useState<any>(null);

  const deleteFeatureMutation = useMutation({
    mutationFn: async (idx: number) => {
      const content = latestContentRef.current;
      const newFeatures = [...(content?.features || defaultFeatures)];
      newFeatures.splice(idx, 1);
      return await apiRequest("PUT", "/api/admin/page-content", {
        page: "courses",
        features: newFeatures
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content"] }),
  });

  const saveFeatureEdit = async (idx: number) => {
    const content = latestContentRef.current;
    const newFeatures = [...(content?.features || defaultFeatures)];
    newFeatures[idx] = featureDraft;
    await apiRequest("PUT", "/api/admin/page-content", {
      page: "courses",
      features: newFeatures
    });
    setEditingFeatureIdx(null);
    setFeatureDraft(null);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/page-content"] });
  };

  return (
    <AdminEditableContent section="courses">
      {(content, isEditing, startEdit, editableText, editableImage) => {
        latestContentRef.current = content;

        // Filtering, searching, sorting
        let filteredCourses = courses.filter((course) =>
          (activeCategory === "All" || course.category === activeCategory) &&
          (course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.description.toLowerCase().includes(search.toLowerCase()))
        );
        if (sort === "newest") filteredCourses = [...filteredCourses].reverse();
        if (sort === "price-low") filteredCourses = [...filteredCourses].sort((a, b) => a.price - b.price);
        if (sort === "price-high") filteredCourses = [...filteredCourses].sort((a, b) => b.price - a.price);
        // (Add more sort logic as needed)

        // Pagination
        const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
        const paginatedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

        // Admin check
        const isAdmin = localStorage.getItem("isAdmin") === "true";

        return (
          <>
            {/* Hero Section */}
            <section className="relative page-hero text-center text-white" style={{
              background: `linear-gradient(135deg, rgba(108,99,255,0.9), rgba(74,144,226,0.9)), url('${content?.image || "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1920&q=80"}') center/cover no-repeat`,
              marginTop: 0,
              padding: "120px 0 80px 0"
            }}>
              <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {editableText('heroTitle', 'Our Courses', 'text-4xl md:text-5xl lg:text-6xl font-bold mb-6')}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-95">
                  {editableText('heroSubtitle', 'Explore our comprehensive range of educational programs designed to help you achieve your academic and career goals', 'text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-95')}
                </p>
                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                  <a href="#featured-courses" className="cta-btn bg-white text-[#6C63FF] font-semibold px-6 py-3 rounded-full shadow hover:-translate-y-1 transition-all">View Courses</a>
                  <a href="#contact" className="cta-btn-outline border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#6C63FF] transition-all">Contact Advisor</a>
                </div>
                <div className="absolute left-0 right-0 bottom-0">
                  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fff" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4">
                  {isAdmin && (
                    <button onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (event) => {
                        const file = (event.target as HTMLInputElement).files?.[0];
                        if (file) editableImage('heroImage', file);
                      };
                      input.click();
                    }} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Change Hero Image</button>
                  )}
                </div>
              </div>
            </section>

            {/* Category Filters */}
            <div className="category-filters flex flex-wrap justify-center gap-3 my-8">
              {(content?.categories || defaultCategories).map((cat: string) => (
                <button
                  key={cat}
                  className={`filter-btn px-6 py-2 rounded-full font-medium border-2 transition-all duration-300 ${activeCategory === cat ? 'bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white border-transparent' : 'bg-white text-[#6C63FF] border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white'}`}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                >
                  {cat}
                </button>
              ))}
              {isAdmin && (
                <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full" onClick={() => {/* TODO: Add category logic */}}>+ Add Category</button>
              )}
            </div>

            {/* Search and Sort */}
            <div className="search-sort flex flex-col md:flex-row justify-between items-center gap-4 mb-8 max-w-5xl mx-auto">
              <div className="search-box relative w-full md:w-1/2">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent"
                  placeholder="Search courses..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className="sort-options flex items-center gap-2">
                <label htmlFor="sortBy" className="text-gray-700 font-medium">Sort by:</label>
                <select
                  id="sortBy"
                  className="px-4 py-2 border border-gray-200 rounded"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course) => (
                <AdminEditableContent key={course.id} section={`course-${course.id}` as any}>
                  {(c, isEditing, startEdit, editableText, editableImage) => (
                    <div className="course-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                      <div className="course-image relative h-52 overflow-hidden">
                        {/* Inline editable image for admin */}
                        {isAdmin
                          ? <label className="block cursor-pointer">
                              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  await apiRequest("PUT", `/api/courses/${course.id}`, formData);
                                  queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                                }
                              }} />
                              <img
                                src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                                alt={course.title}
                                className="w-full h-full object-cover hover:opacity-80 transition"
                                title="Click to change image"
                              />
                            </label>
                          : <img
                              src={course.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                        }
                        <span className="course-level absolute top-4 right-4 bg-white/90 text-[#6C63FF] px-4 py-1 rounded-full font-semibold text-xs shadow">
                          {isAdmin
                            ? <input type="text" defaultValue={(course as any).level || 'Beginner'} className="bg-transparent border-b border-[#6C63FF] w-20 text-xs text-[#6C63FF] font-semibold" onBlur={async (e) => {
                                await apiRequest("PUT", `/api/courses/${course.id}`, { level: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                              }} />
                            : (course as any).level || 'Beginner'}
                        </span>
                      </div>
                      <div className="course-content p-6">
                        <h3 className="text-xl font-bold mb-2 text-[#2D3748]">
                          {isAdmin
                            ? <input type="text" defaultValue={course.title} className="bg-transparent border-b border-[#6C63FF] w-full font-bold" onBlur={async (e) => {
                                await apiRequest("PUT", `/api/courses/${course.id}`, { title: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                              }} />
                            : course.title}
                        </h3>
                        <div className="course-meta flex items-center gap-6 mb-3 text-gray-500 text-sm">
                          <span><i className="fas fa-clock mr-1"></i> {isAdmin
                            ? <input type="text" defaultValue={course.duration} className="bg-transparent border-b border-[#6C63FF] w-20" onBlur={async (e) => {
                                await apiRequest("PUT", `/api/courses/${course.id}`, { duration: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                              }} />
                            : course.duration}
                          </span>
                          <span><i className="fas fa-users mr-1"></i> {isAdmin
                            ? <input type="number" defaultValue={course.studentCount || 0} className="bg-transparent border-b border-[#6C63FF] w-16" onBlur={async (e) => {
                                await apiRequest("PUT", `/api/courses/${course.id}`, { studentCount: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                              }} />
                            : course.studentCount} Students
                          </span>
                        </div>
                        <p className="course-desc text-gray-600 mb-4">
                          {isAdmin
                            ? <textarea defaultValue={course.description} className="bg-transparent border-b border-[#6C63FF] w-full" onBlur={async (e) => {
                                await apiRequest("PUT", `/api/courses/${course.id}`, { description: e.target.value });
                                queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                              }} />
                            : course.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-[#6C63FF]">
                            {isAdmin
                              ? <input type="number" defaultValue={course.price} className="bg-transparent border-b border-[#6C63FF] w-20 font-bold" onBlur={async (e) => {
                                  await apiRequest("PUT", `/api/courses/${course.id}`, { price: e.target.value });
                                  queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
                                }} />
                              : <>${course.price}</>}
                          </div>
                          <button className="course-btn bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] text-white px-6 py-2 rounded-full font-semibold hover:-translate-y-1 transition-all">Enroll Now</button>
                        </div>
                        {isAdmin && (
                          <button className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs" onClick={() => deleteCourseMutation.mutate(course.id)}>Delete</button>
                        )}
                      </div>
                    </div>
                  )}
                </AdminEditableContent>
              ))}
              {isAdmin && (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl border-2 border-dashed border-[#6C63FF] cursor-pointer hover:bg-gray-200 transition-all" onClick={() => addCourseMutation.mutate()}>
                  <span className="text-[#6C63FF] text-3xl font-bold">+ Add Course</span>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination flex justify-center items-center gap-3 mt-12">
              <button className="page-btn px-4 py-2 rounded border" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><i className="fas fa-chevron-left"></i> Previous</button>
              <div className="page-numbers flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <span key={i} className={`w-9 h-9 flex items-center justify-center rounded ${currentPage === i + 1 ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#6C63FF] cursor-pointer'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</span>
                ))}
              </div>
              <button className="page-btn px-4 py-2 rounded border" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next <i className="fas fa-chevron-right"></i></button>
            </div>

            {/* Features Section */}
            <section className="why-choose-us py-20 bg-[#f8fafc] mt-20">
              <div className="container mx-auto px-4">
                <div className="section-header text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2D3748]">{editableText('featuresTitle', 'Why Choose Our Courses?', 'text-3xl md:text-4xl font-bold mb-4 text-[#2D3748]')}</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">{editableText('featuresSubtitle', 'We provide the best learning experience with our expert instructors and comprehensive curriculum', 'text-lg text-gray-600 max-w-2xl mx-auto')}</p>
                </div>
                <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {(content?.features || defaultFeatures).map((feature: any, idx: number) => (
                    <div key={idx} className="feature-card bg-white p-8 rounded-xl shadow hover:shadow-lg transition-all text-center">
                      <div className="feature-icon w-16 h-16 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                        <i className={`fas ${feature.icon}`}></i>
                      </div>
                      {isAdmin && editingFeatureIdx === idx ? (
                        <>
                          <input
                            className="text-xl font-semibold mb-2 text-[#2D3748] w-full border-b"
                            value={featureDraft.title}
                            onChange={e => setFeatureDraft({ ...featureDraft, title: e.target.value })}
                          />
                          <textarea
                            className="text-gray-600 w-full border-b mt-2"
                            value={featureDraft.description}
                            onChange={e => setFeatureDraft({ ...featureDraft, description: e.target.value })}
                          />
                          <input
                            className="w-full border-b mt-2"
                            value={featureDraft.icon}
                            onChange={e => setFeatureDraft({ ...featureDraft, icon: e.target.value })}
                            placeholder="fa-star"
                          />
                          <div className="flex gap-2 justify-center mt-2">
                            <button className="text-green-600 underline" onClick={() => saveFeatureEdit(idx)}>Save</button>
                            <button className="text-gray-500 underline" onClick={() => { setEditingFeatureIdx(null); setFeatureDraft(null); }}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-semibold mb-2 text-[#2D3748]">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                          {isAdmin && (
                            <div className="flex gap-2 justify-center mt-2">
                              <button className="text-blue-500 underline" onClick={() => { setEditingFeatureIdx(idx); setFeatureDraft(feature); }}>Edit</button>
                              <button className="text-red-500 underline" onClick={() => deleteFeatureMutation.mutate(idx)}>Delete</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-xl border-2 border-dashed border-[#6C63FF] cursor-pointer hover:bg-gray-200 transition-all" onClick={() => addFeatureMutation.mutate()}>
                      <span className="text-[#6C63FF] text-xl font-bold">+ Add Feature</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        );
      }}
    </AdminEditableContent>
  );
}
