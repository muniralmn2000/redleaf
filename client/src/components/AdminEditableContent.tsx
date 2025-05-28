import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Save, Upload, X, Image as ImageIcon } from "lucide-react";

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

interface AdminEditableContentProps {
  section: 'home' | 'about' | 'contact' | 'features' | 'testimonials';
  children: (content: any, isEditing: boolean, startEdit: () => void) => React.ReactNode;
}

export default function AdminEditableContent({ section, children }: AdminEditableContentProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState({ title: '', description: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin status
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    setIsAdmin(adminAuth === 'true');
  }, []);

  // Fetch page content
  const { data: pageContent } = useQuery({
    queryKey: ['/api/admin/page-content'],
    enabled: isAdmin,
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
      setIsEditing(false);
      toast({
        title: "Content Updated!",
        description: "Changes have been saved and are now live on your website.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to save changes. Please try again.",
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
    onSuccess: (data: any) => {
      setEditContent(prev => ({ ...prev, image: data.imageUrl }));
      setUploading(false);
      toast({
        title: "Image Uploaded!",
        description: "New image has been uploaded successfully.",
      });
    },
    onError: () => {
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  });

  const startEdit = () => {
    if (pageContent && pageContent[section]) {
      setEditContent(pageContent[section]);
      setIsEditing(true);
    }
  };

  const saveChanges = () => {
    updateContentMutation.mutate({
      page: section,
      title: editContent.title,
      description: editContent.description,
      image: editContent.image
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent({ title: '', description: '', image: '' });
  };

  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('page', section);
    setUploading(true);
    uploadImageMutation.mutate(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    toast({
      title: "Admin Logout",
      description: "You've been logged out of admin mode.",
    });
    window.location.reload();
  };

  // Get current content or default
  const getDefaultContent = (section: string) => {
    switch(section) {
      case 'home':
        return {
          title: 'Transform Your Learning Journey',
          description: 'Join thousands of students and educators in our modern learning platform.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
      case 'about':
        return {
          title: 'About EduSphere',
          description: 'Founded in 2020, EduSphere has been at the forefront of digital education.',
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
      case 'contact':
        return {
          title: 'Get In Touch',
          description: 'Have questions about our courses or need assistance?',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
      case 'features':
        return {
          title: 'Why Choose EduSphere?',
          description: 'Discover the features that make our platform the preferred choice for modern learners.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
      case 'testimonials':
        return {
          title: 'What Our Students Say',
          description: 'Hear from thousands of students who have transformed their careers through our platform.',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
      default:
        return {
          title: 'Editable Content',
          description: 'This content can be edited by admin.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600'
        };
    }
  };

  const currentContent = pageContent && pageContent[section] ? pageContent[section] : getDefaultContent(section);

  if (!isAdmin) {
    return <>{children(currentContent, false, () => {})}</>;
  }

  return (
    <div className="relative">
      {/* Admin Controls Bar */}
      {isAdmin && !isEditing && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <Button
            onClick={startEdit}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
          <Button
            onClick={handleLogout}
            size="sm"
            variant="outline"
            className="shadow-lg"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Admin
          </Button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit {section.charAt(0).toUpperCase() + section.slice(1)} Content</h2>
                <Button
                  onClick={cancelEdit}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={editContent.title}
                    onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title"
                    className="text-lg"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={editContent.description}
                    onChange={(e) => setEditContent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    rows={4}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  {editContent.image && (
                    <div className="mb-4">
                      <img 
                        src={editContent.image} 
                        alt="Current" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                    >
                      {uploading ? (
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

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    {editContent.image && (
                      <img 
                        src={editContent.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{editContent.title || 'Title will appear here'}</h3>
                    <p className="text-gray-600">{editContent.description || 'Description will appear here'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveChanges}
                    disabled={updateContentMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Display */}
      {children(isEditing ? editContent : currentContent, isEditing, startEdit)}
    </div>
  );
}