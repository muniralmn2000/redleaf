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
      if (
        (data.email === 'munir@gmail.com' && data.password === '12341234') ||
        (data.email === 'jusinadmin@gmail.com' && data.password === '12341234')
      ) {
        // Admin login - set local storage and dispatch event
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', data.email);
        localStorage.removeItem('userEmail');
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new CustomEvent('login'));
        window.dispatchEvent(new CustomEvent('adminLogin'));
        return { success: true, isAdmin: true };
      } else {
        // Regular user login
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', data.email);
        window.dispatchEvent(new CustomEvent('login'));
        window.dispatchEvent(new CustomEvent('adminLogout'));
        return await apiRequest("POST", "/api/login", {
          email: data.email,
          password: data.password
        });
      }
    },
    onSuccess: async (result) => {
      if (result.isAdmin) {
        toast({
          title: "Admin Access Granted!",
          description: "You can now edit content directly on the website.",
        });
      } else {
        // Fetch user full name after login
        try {
          const res = await apiRequest("GET", `/api/user?email=${encodeURIComponent(formData.email)}`);
          if (res && res.fullName) {
            localStorage.setItem('userFullName', res.fullName);
          }
        } catch (e) {}
        toast({
          title: "Login successful!",
          description: `Welcome back!`,
        });
      }
      onClose();
      setFormData({ email: "", password: "", rememberMe: false });
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegistration}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}