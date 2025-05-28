import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [isTransferStudent, setIsTransferStudent] = useState(false);
  
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: `STU${Date.now().toString().slice(-6)}`,
    previousInstitution: "",
    idDocument: null as File | null,
    transferLetter: null as File | null
  });

  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    experience: "",
    qualifications: "",
    resume: null as File | null
  });

  const studentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await fetch("/api/register/student", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async (response) => {
      if (response.ok) {
        toast({
          title: "Registration successful!",
          description: "Check your email for confirmation.",
        });
        onClose();
        resetForms();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const teacherMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await fetch("/api/register/teacher", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async (response) => {
      if (response.ok) {
        toast({
          title: "Application submitted!",
          description: "We will review your application and contact you soon.",
        });
        onClose();
        resetForms();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForms = () => {
    setStudentForm({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      studentId: `STU${Date.now().toString().slice(-6)}`,
      previousInstitution: "",
      idDocument: null,
      transferLetter: null
    });
    setTeacherForm({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      experience: "",
      qualifications: "",
      resume: null
    });
    setIsTransferStudent(false);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentForm.password !== studentForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!studentForm.idDocument) {
      toast({
        title: "ID document required",
        description: "Please upload your ID document.",
        variant: "destructive",
      });
      return;
    }

    if (isTransferStudent && !studentForm.transferLetter) {
      toast({
        title: "Transfer letter required",
        description: "Please upload your transfer letter.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(studentForm).forEach(([key, value]) => {
      if (key === 'idDocument' || key === 'transferLetter') {
        if (value) formData.append(key === 'idDocument' ? 'id_document' : 'transfer_letter', value);
      } else {
        formData.append(key, value as string);
      }
    });
    
    formData.append('is_transfer', isTransferStudent ? 'yes' : 'no');
    
    studentMutation.mutate(formData);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teacherForm.password !== teacherForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!teacherForm.resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    Object.entries(teacherForm).forEach(([key, value]) => {
      if (key === 'resume') {
        if (value) formData.append('resume', value);
      } else {
        formData.append(key, value as string);
      }
    });
    
    teacherMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-dark">Join EduSphere</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Registration Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button 
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'student' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('student')}
            >
              <i className="fas fa-user-graduate mr-2"></i>
              Student Registration
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'teacher' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('teacher')}
            >
              <i className="fas fa-chalkboard-teacher mr-2"></i>
              Teacher Registration
            </button>
          </div>

          {/* Student Registration Form */}
          {activeTab === 'student' && (
            <form className="space-y-6" onSubmit={handleStudentSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={studentForm.fullName}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={studentForm.email}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={studentForm.password}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Confirm Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">Student ID</label>
                <input 
                  type="text" 
                  value={studentForm.studentId}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                  placeholder="Auto-generated or custom ID"
                />
                <p className="text-sm text-gray-500 mt-1">Leave as generated or enter custom ID</p>
              </div>

              {/* Transfer Student Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input 
                    type="checkbox" 
                    id="transferStudent" 
                    checked={isTransferStudent}
                    onChange={(e) => setIsTransferStudent(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="transferStudent" className="font-medium text-dark">I am a transfer student</label>
                </div>
                
                {isTransferStudent && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Previous Institution</label>
                      <input 
                        type="text" 
                        value={studentForm.previousInstitution}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, previousInstitution: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                        placeholder="Name of your previous school"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-2">Transfer Letter *</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-300">
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx" 
                          className="hidden" 
                          id="transferLetter"
                          onChange={(e) => setStudentForm(prev => ({ ...prev, transferLetter: e.target.files?.[0] || null }))}
                        />
                        <label htmlFor="transferLetter" className="cursor-pointer">
                          <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                          <p className="text-gray-600">
                            {studentForm.transferLetter ? studentForm.transferLetter.name : "Click to upload transfer letter"}
                          </p>
                          <p className="text-sm text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ID Document Upload */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">ID Document *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-300">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    required 
                    className="hidden" 
                    id="idDocument"
                    onChange={(e) => setStudentForm(prev => ({ ...prev, idDocument: e.target.files?.[0] || null }))}
                  />
                  <label htmlFor="idDocument" className="cursor-pointer">
                    <i className="fas fa-id-card text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600">
                      {studentForm.idDocument ? studentForm.idDocument.name : "Click to upload ID document"}
                    </p>
                    <p className="text-sm text-gray-400">PDF, JPG, PNG up to 5MB</p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={studentMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {studentMutation.isPending ? "Registering..." : "Register as Student"}
              </button>
            </form>
          )}

          {/* Teacher Registration Form */}
          {activeTab === 'teacher' && (
            <form className="space-y-6" onSubmit={handleTeacherSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={teacherForm.fullName}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Confirm Password *</label>
                  <input 
                    type="password" 
                    required 
                    value={teacherForm.confirmPassword}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" 
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Subject Specialization *</label>
                  <select 
                    required 
                    value={teacherForm.specialization}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, specialization: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                  >
                    <option value="">Select your specialization</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="arts">Arts & Humanities</option>
                    <option value="languages">Languages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Years of Experience *</label>
                  <select 
                    required 
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">Qualifications *</label>
                <textarea 
                  required 
                  rows={3} 
                  value={teacherForm.qualifications}
                  onChange={(e) => setTeacherForm(prev => ({ ...prev, qualifications: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none" 
                  placeholder="List your educational qualifications and certifications"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Resume/CV *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-300">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    className="hidden" 
                    id="resume"
                    onChange={(e) => setTeacherForm(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <i className="fas fa-file-alt text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600">
                      {teacherForm.resume ? teacherForm.resume.name : "Click to upload your resume"}
                    </p>
                    <p className="text-sm text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={teacherMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {teacherMutation.isPending ? "Applying..." : "Apply as Teacher"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
