import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, Content, Course } from "@shared/schema";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  totalMessages: number;
  recentRegistrations: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    date: string;
  }>;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'settings'>('overview');
  const [authForm, setAuthForm] = useState({
    email: "admin@gmail.com",
    password: "adminpass123"
  });

  // Content management states
  const [heroContent, setHeroContent] = useState({
    title: "",
    subtitle: ""
  });

  // Admin authentication
  const authMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await apiRequest("POST", "/api/admin/login", data);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      toast({
        title: "Authentication successful!",
        description: "Welcome to the admin dashboard.",
      });
    },
    onError: () => {
      toast({
        title: "Authentication failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    },
  });

  // Fetch admin statistics
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
  });

  // Fetch content
  const { data: content = [] } = useQuery<Content[]>({
    queryKey: ["/api/content"],
    enabled: isAuthenticated,
  });

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: Partial<Content> }) => {
      return await apiRequest("PUT", `/api/content/${section}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      return await apiRequest("DELETE", `/api/courses/${courseId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Course deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    authMutation.mutate(authForm);
  };

  const handleHeroUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateContentMutation.mutate({
      section: "hero",
      data: heroContent
    });
  };

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse.mutate(courseId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-dark">Admin Dashboard</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Admin Login Check */}
        {!isAuthenticated ? (
          <div className="p-6">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-dark mb-4">Admin Authentication</h3>
              <form className="space-y-4" onSubmit={handleAuth}>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Admin Email</label>
                  <input 
                    type="email" 
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Admin Password</label>
                  <input 
                    type="password" 
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={authMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                >
                  {authMutation.isPending ? "Authenticating..." : "Access Dashboard"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Tabs */}
            <div className="border-b border-gray-100">
              <div className="flex space-x-8 px-6">
                {[
                  { id: 'overview', icon: 'fas fa-chart-bar', label: 'Overview' },
                  { id: 'users', icon: 'fas fa-users', label: 'Users' },
                  { id: 'content', icon: 'fas fa-edit', label: 'Content' },
                  { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium transition-colors duration-300 ${
                      activeTab === tab.id 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-gray-600 hover:text-primary'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>{tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Total Students</p>
                        <p className="text-3xl font-bold">{stats?.totalStudents || 0}</p>
                      </div>
                      <i className="fas fa-user-graduate text-4xl text-white/50"></i>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-secondary to-accent rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Active Courses</p>
                        <p className="text-3xl font-bold">{stats?.activeCourses || 0}</p>
                      </div>
                      <i className="fas fa-book text-4xl text-white/50"></i>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-accent to-primary rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Total Teachers</p>
                        <p className="text-3xl font-bold">{stats?.totalTeachers || 0}</p>
                      </div>
                      <i className="fas fa-chalkboard-teacher text-4xl text-white/50"></i>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Messages</p>
                        <p className="text-3xl font-bold">{stats?.totalMessages || 0}</p>
                      </div>
                      <i className="fas fa-envelope text-4xl text-white/50"></i>
                    </div>
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-dark mb-4">Recent Registrations</h3>
                  <div className="space-y-4">
                    {stats?.recentRegistrations?.length ? (
                      stats.recentRegistrations.map((registration) => (
                        <div key={registration.id} className="flex items-center justify-between bg-white rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                              {registration.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-dark">{registration.name}</p>
                              <p className="text-sm text-gray-600">{registration.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {registration.role}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(registration.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No recent registrations</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Content Management Tab */}
            {activeTab === 'content' && (
              <div className="p-6">
                <div className="space-y-8">
                  {/* Hero Section Management */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-dark mb-4">Hero Section</h3>
                    <form className="space-y-4" onSubmit={handleHeroUpdate}>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Hero Title</label>
                        <input 
                          type="text" 
                          value={heroContent.title}
                          onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                          placeholder="Transform Your Learning Journey"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Hero Subtitle</label>
                        <textarea 
                          value={heroContent.subtitle}
                          onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                          rows={3} 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none"
                          placeholder="Join thousands of students and educators..."
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={updateContentMutation.isPending}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50"
                      >
                        {updateContentMutation.isPending ? "Updating..." : "Update Hero Section"}
                      </button>
                    </form>
                  </div>

                  {/* Course Management */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-dark">Course Management</h3>
                      <button className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                        <i className="fas fa-plus mr-2"></i>Add Course
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses.length ? (
                        courses.map((course) => (
                          <div key={course.id} className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                              <i className="fas fa-book text-gray-400 text-2xl"></i>
                            </div>
                            <h4 className="font-semibold text-dark mb-2">{course.title}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{course.studentCount} students</span>
                              <div className="flex space-x-2">
                                <button className="text-primary hover:text-primary/80 transition-colors duration-300">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="text-red-500 hover:text-red-600 transition-colors duration-300"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-500">No courses available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Management Tab */}
            {activeTab === 'users' && (
              <div className="p-6">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-dark">User Management</h3>
                    <div className="flex space-x-4">
                      <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none">
                        <option>All Users</option>
                        <option>Students</option>
                        <option>Teachers</option>
                      </select>
                      <input 
                        type="search" 
                        placeholder="Search users..." 
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.length ? (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                    {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-primary hover:text-primary/80 transition-colors duration-300">View</button>
                                  <button className="text-gray-600 hover:text-gray-800 transition-colors duration-300">Edit</button>
                                  <button className="text-red-600 hover:text-red-800 transition-colors duration-300">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <div className="space-y-8">
                  {/* Email Settings */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-dark mb-4">Email Configuration</h3>
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-dark mb-2">SMTP Host</label>
                          <input 
                            type="text" 
                            defaultValue="smtp.gmail.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-2">SMTP Port</label>
                          <input 
                            type="number" 
                            defaultValue="587"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-2">Email Username</label>
                        <input 
                          type="email" 
                          defaultValue="admin@edusphere.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300"
                      >
                        Update Email Settings
                      </button>
                    </form>
                  </div>

                  {/* System Settings */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-dark mb-4">System Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-dark">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Send email notifications for new registrations</p>
                        </div>
                        <button className="bg-primary relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <span className="sr-only">Enable notifications</span>
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-dark">Auto Student ID Generation</h4>
                          <p className="text-sm text-gray-600">Automatically generate student IDs for new registrations</p>
                        </div>
                        <button className="bg-primary relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <span className="sr-only">Enable auto generation</span>
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
