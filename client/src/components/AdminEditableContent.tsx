import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  section: 'home' | 'about' | 'contact' | 'features' | 'testimonials' | 'courses';
  children: (content: any, isEditing: boolean, startEdit: () => void, editableText: any, editableImage: any) => React.ReactNode;
}

export default function AdminEditableContent({ section, children }: AdminEditableContentProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [content, setContent] = useState<any>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin status on mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  // Listen for admin login events
  useEffect(() => {
    const handleAdminLogin = () => {
      setIsAdmin(true);
    };

    const handleAdminLogout = () => {
      setIsAdmin(false);
      setEditingField(null);
    };

    window.addEventListener('adminLogin', handleAdminLogin);
    window.addEventListener('adminLogout', handleAdminLogout);

    return () => {
      window.removeEventListener('adminLogin', handleAdminLogin);
      window.removeEventListener('adminLogout', handleAdminLogout);
    };
  }, []);

  // Fetch content
  const { data: pageContent, refetch } = useQuery({
    queryKey: ['/api/admin/page-content'],
    enabled: isAdmin,
  });

  useEffect(() => {
    if (pageContent && pageContent[section]) {
      setContent(pageContent[section]);
    }
  }, [pageContent, section]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("PUT", "/api/admin/page-content", formData);
    },
    onSuccess: () => {
      toast({
        title: "Content updated successfully!",
        description: "Changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/page-content'] });
      setEditingField(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (file: File, field: string = 'image') => {
    const formData = new FormData();
    formData.append('section', section);
    formData.append('field', field);
    formData.append('image', file);
    updateMutation.mutate(formData);
  };

  const saveContent = (field: string, value: string) => {
    const formData = new FormData();
    formData.append('section', section);
    formData.append('field', field);
    formData.append('value', value);
    updateMutation.mutate(formData);
  };

  const handleFieldEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleSaveField = () => {
    if (editingField) {
      saveContent(editingField, editValue);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Create editable text function for direct click editing
  const createEditableText = (field: string, defaultValue: string, className: string = '') => {
    const value = content?.[field] || defaultValue;
    
    if (!isAdmin) {
      return value;
    }

    return (
      <span 
        className={`${className} cursor-pointer hover:bg-yellow-200 hover:shadow-xl transition-all duration-300 relative group border-2 border-dashed border-transparent hover:border-blue-400 rounded-lg px-2 py-1 bg-opacity-20 hover:bg-blue-50`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFieldEdit(field, value);
        }}
        title="🖊️ Admin: Click to edit this text"
      >
        {value}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          🖊️ EDIT
        </div>
        <div className="absolute inset-0 border-2 border-blue-300 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
      </span>
    );
  };

  // Create editable image function for direct click editing
  const createEditableImage = (field: string, defaultSrc: string, className: string = '', alt: string = '') => {
    const src = content?.[field] || defaultSrc;
    
    if (!isAdmin) {
      return <img src={src} alt={alt} className={className} />;
    }

    return (
      <div className="relative group cursor-pointer">
        <img 
          src={src} 
          alt={alt} 
          className={`${className} transition-all duration-300 hover:scale-105 hover:shadow-2xl border-4 border-dashed border-transparent hover:border-blue-400 rounded-lg hover:brightness-75`} 
        />
        <div 
          className="absolute inset-0 bg-blue-600 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) {
                handleImageUpload(file, field);
              }
            };
            input.click();
          }}
          title="🖼️ Admin: Click to upload new image"
        >
          <div className="text-center text-white animate-pulse">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-lg font-bold bg-blue-700 px-4 py-2 rounded-full">CHANGE IMAGE</div>
          </div>
        </div>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          🖼️ UPLOAD NEW IMAGE
        </div>
      </div>
    );
  };

  return (
    <>
      {children(content || {}, isAdmin, () => {}, createEditableText, createEditableImage)}
      
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-lg w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">✏️ Edit Content</h3>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              rows={6}
              autoFocus
              placeholder="Enter your content here..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveField}
                disabled={updateMutation.isPending}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
              >
                {updateMutation.isPending ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}