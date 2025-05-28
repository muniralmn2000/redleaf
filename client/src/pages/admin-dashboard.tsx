import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings, 
  Upload, 
  Save, 
  Eye, 
  Home, 
  Users, 
  Phone, 
  LogOut,
  ImageIcon,
  Edit3,
  Globe,
  BarChart3,
  GraduationCap,
  MessageSquare
} from "lucide-react";

interface PageContent {
  home: {
    title: string;
    description: string;
    image: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  contact: {
    title: string;
    description: string;
    image: string;
  };
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [editingContent, setEditingContent] = useState<{[key: string]: any}>({});
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication on mount
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAdminAuthenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Admin login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: () => {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      toast({
        title: "Welcome!",
        description: "Successfully logged in to admin dashboard",
      });
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  });

  // Fetch page content
  const { data: pageContent, isLoading: loadingContent } = useQuery({
    queryKey: ['/api/admin/page-content'],
    enabled: isAuthenticated,
  });

  // Fetch admin stats
  const { data: adminStats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated,
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ page, title, description, image }: { page: string; title?: string; description?: string; image?: string }) => {
      const response = await fetch('/api/admin/page-content', {
        method: 'PUT',
        body: JSON.stringify({ page, title, description, image }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      toast({
        title: "Content Updated",
        description: "Page content has been successfully saved",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update page content",
        variant: "destructive",
      });
    }
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data: any, variables: FormData) => {
      const page = variables.get('page') as string;
      setEditingContent(prev => ({
        ...prev,
        [page]: { ...prev[page], image: data.imageUrl }
      }));
      setUploadingImages(prev => ({ ...prev, [page]: false }));
      toast({
        title: "Image Uploaded",
        description: "Image has been successfully uploaded",
      });
    },
    onError: (error, variables) => {
      const page = (variables as any).get('page');
      setUploadingImages(prev => ({ ...prev, [page]: false }));
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
    toast({
      title: "Logged Out",
      description: "Successfully logged out from admin dashboard",
    });
  };

  const handleImageUpload = (page: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('page', page);
    setUploadingImages(prev => ({ ...prev, [page]: true }));
    uploadImageMutation.mutate(formData);
  };

  const handleContentSave = (page: string) => {
    const content = editingContent[page];
    if (content) {
      updateContentMutation.mutate({
        page,
        title: content.title,
        description: content.description,
        image: content.image
      });
    }
  };

  const initializeEditingContent = (content: PageContent) => {
    if (Object.keys(editingContent).length === 0) {
      setEditingContent(content);
    }
  };

  // Initialize editing content when page content is loaded
  if (pageContent && Object.keys(editingContent).length === 0) {
    initializeEditingContent(pageContent);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Sign in to manage your education platform content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">EduSphere Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Home Page</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>About Page</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Contact Page</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Students</p>
                        <p className="text-3xl font-bold">{adminStats?.totalStudents || 0}</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Teachers</p>
                        <p className="text-3xl font-bold">{adminStats?.totalTeachers || 0}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Active Courses</p>
                        <p className="text-3xl font-bold">{adminStats?.activeCourses || 0}</p>
                      </div>
                      <Globe className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Messages</p>
                        <p className="text-3xl font-bold">{adminStats?.totalMessages || 0}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Recent Registrations</span>
                </CardTitle>
                <CardDescription>Latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {adminStats?.recentRegistrations?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.role === 'student' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{user.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Content Tabs */}
          {(['home', 'about', 'contact'] as const).map((page) => (
            <TabsContent key={page} value={page} className="space-y-6">
              {loadingContent ? (
                <Card className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 capitalize">
                      {page === 'home' && <Home className="w-5 h-5" />}
                      {page === 'about' && <Users className="w-5 h-5" />}
                      {page === 'contact' && <Phone className="w-5 h-5" />}
                      <span>{page} Page Content</span>
                    </CardTitle>
                    <CardDescription>
                      Edit the content and images for the {page} page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Content Editor */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${page}-title`}>Page Title</Label>
                          <Input
                            id={`${page}-title`}
                            value={editingContent[page]?.title || ''}
                            onChange={(e) => setEditingContent(prev => ({
                              ...prev,
                              [page]: { ...prev[page], title: e.target.value }
                            }))}
                            placeholder="Enter page title"
                            className="bg-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${page}-description`}>Page Description</Label>
                          <Textarea
                            id={`${page}-description`}
                            value={editingContent[page]?.description || ''}
                            onChange={(e) => setEditingContent(prev => ({
                              ...prev,
                              [page]: { ...prev[page], description: e.target.value }
                            }))}
                            placeholder="Enter page description"
                            rows={4}
                            className="bg-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Page Image</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(page, file);
                              }}
                              className="bg-white"
                              disabled={uploadingImages[page]}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploadingImages[page]}
                            >
                              {uploadingImages[page] ? (
                                "Uploading..."
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <Button
                          onClick={() => handleContentSave(page)}
                          disabled={updateContentMutation.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {updateContentMutation.isPending ? (
                            "Saving..."
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Live Preview */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>Live Preview</span>
                        </div>
                        
                        <Card className="bg-white border-2 border-dashed border-gray-200">
                          <CardContent className="p-6 space-y-4">
                            {editingContent[page]?.image && (
                              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={editingContent[page].image}
                                  alt={`${page} preview`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {editingContent[page]?.title || `${page} Title`}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {editingContent[page]?.description || `${page} description will appear here...`}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}