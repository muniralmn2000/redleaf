import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegistration: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegistration }: LoginModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Check if admin credentials
      if ((data.email === 'munir@gmail.com' && data.password === '12341234') ||
          (data.email === 'admin@gmail.com' && data.password === 'adminpass123')) {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Admin login failed');
        const result = await response.json();
        return { ...result, isAdmin: true };
      } else {
        return await apiRequest("POST", "/api/login", data);
      }
    },
    onSuccess: async (response) => {
      if (response.isAdmin) {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', formData.email);
        toast({
          title: "Admin Access Granted!",
          description: "You can now edit content directly on the website.",
        });
        onClose();
        setFormData({ email: "", password: "", rememberMe: false });
        // Trigger page refresh to show admin controls
        window.location.reload();
      } else {
        const result = await response.json();
        toast({
          title: "Login successful!",
          description: `Welcome back, ${result.user.fullName}!`,
        });
        onClose();
        setFormData({ email: "", password: "", rememberMe: false });
      }
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-dark">Welcome Back</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember me</label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center">
              <p className="text-gray-600">Don't have an account? 
                <button 
                  type="button" 
                  onClick={onSwitchToRegistration}
                  className="text-primary hover:underline font-medium ml-1"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
