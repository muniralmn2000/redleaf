import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Reply state for messages
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLInputElement>(null);

  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
    if (!admin) navigate("/");
  }, [navigate]);

  // Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("GET", "/api/admin/stats"),
    enabled: isAdmin,
  });
  // Users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest("GET", "/api/admin/users"),
    enabled: isAdmin,
  });
  // Courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: () => apiRequest("GET", "/api/courses"),
    enabled: isAdmin,
  });
  // Contact messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/messages"],
    queryFn: () => apiRequest("GET", "/api/admin/messages"),
    enabled: isAdmin,
  });
  // Recent logins
  const { data: logins = [], isLoading: loginsLoading } = useQuery({
    queryKey: ["/api/admin/logins"],
    queryFn: () => apiRequest("GET", "/api/admin/logins"),
    enabled: isAdmin,
  });
  // Online users
  const { data: onlineUsers = [], isLoading: onlineLoading } = useQuery({
    queryKey: ["/api/admin/online-users"],
    queryFn: () => apiRequest("GET", "/api/admin/online-users"),
    enabled: isAdmin,
  });
  // Active users
  const { data: activeUsers = [], isLoading: activeLoading } = useQuery({
    queryKey: ["/api/admin/active-users"],
    queryFn: () => apiRequest("GET", "/api/admin/active-users"),
    enabled: isAdmin,
  });

  const safeMessages = Array.isArray(messages) ? messages : [];
  const safeLogins = Array.isArray(logins) ? logins : [];
  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];
  const safeActiveUsers = Array.isArray(activeUsers) ? activeUsers : [];

  // Pending users for admin approval
  const pendingUsers = Array.isArray(users) ? users.filter((u: any) => u.status === "pending") : [];

  // Quick action: Export users as CSV
  const exportUsers = () => {
    const csv = [
      ["ID", "Name", "Email", "Role", "Student ID", "Created At"],
      ...users.map((u: any) => [u.id, u.fullName, u.email, u.role, u.studentId || "", u.createdAt]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick action: Add course
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

  // Quick action: Delete user (soft, just for demo)
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      // Not implemented in backend, just filter in UI for now
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] }),
  });

  // Quick action: Delete course
  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/courses"] }),
  });

  // Reply mutation for messages
  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number; reply: string }) => {
      return await apiRequest("POST", `/api/admin/messages/${id}/reply`, { reply });
    },
    onSuccess: () => {
      setReplyingId(null);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  // Fetch students, teachers, courses, messages for modals
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["/api/admin/students"],
    queryFn: () => apiRequest("GET", "/api/admin/students"),
    enabled: showStudentsModal && isAdmin,
  });
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["/api/admin/teachers"],
    queryFn: () => apiRequest("GET", "/api/admin/teachers"),
    enabled: showTeachersModal && isAdmin,
  });
  const { data: allCourses = [], isLoading: allCoursesLoading } = useQuery({
    queryKey: ["/api/admin/all-courses"],
    queryFn: () => apiRequest("GET", "/api/admin/all-courses"),
    enabled: showCoursesModal && isAdmin,
  });
  const { data: allMessages = [], isLoading: allMessagesLoading } = useQuery({
    queryKey: ["/api/admin/all-messages"],
    queryFn: () => apiRequest("GET", "/api/admin/all-messages"),
    enabled: showMessagesModal && isAdmin,
  });

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white shadow cursor-pointer" onClick={() => setShowStudentsModal(true)}>
            <div className="text-lg font-semibold">Students</div>
            <div className="text-3xl font-bold">{statsLoading ? "-" : stats?.totalStudents ?? 0}</div>
            </div>
          <div className="bg-gradient-to-r from-secondary to-accent rounded-xl p-6 text-white shadow cursor-pointer" onClick={() => setShowTeachersModal(true)}>
            <div className="text-lg font-semibold">Teachers</div>
            <div className="text-3xl font-bold">{statsLoading ? "-" : stats?.totalTeachers ?? 0}</div>
              </div>
          <div className="bg-gradient-to-r from-accent to-primary rounded-xl p-6 text-white shadow cursor-pointer" onClick={() => setShowCoursesModal(true)}>
            <div className="text-lg font-semibold">Courses</div>
            <div className="text-3xl font-bold">{statsLoading ? "-" : stats?.activeCourses ?? 0}</div>
              </div>
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white shadow cursor-pointer" onClick={() => setShowMessagesModal(true)}>
            <div className="text-lg font-semibold">Messages</div>
            <div className="text-3xl font-bold">{statsLoading ? "-" : stats?.totalMessages ?? 0}</div>
      </div>
              </div>
        {/* Students Modal */}
        {showStudentsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowStudentsModal(false)}>
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowStudentsModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">All Students</h2>
              {studentsLoading ? <div>Loading...</div> : (
                <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
                  {students.length ? students.map((student: any) => (
                    <li key={student.id} className="py-2">
                      <div className="font-semibold">{student.fullName} ({student.email})</div>
                      <div className="text-xs text-gray-500">Student ID: {student.studentId}</div>
                    </li>
                  )) : <li className="py-2 text-gray-500">No students found</li>}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Teachers Modal */}
        {showTeachersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowTeachersModal(false)}>
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowTeachersModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">All Teachers</h2>
              {teachersLoading ? <div>Loading...</div> : (
                <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
                  {teachers.length ? teachers.map((teacher: any) => (
                    <li key={teacher.id} className="py-2">
                      <div className="font-semibold">{teacher.fullName} ({teacher.email})</div>
                      {teacher.specialization && <div className="text-xs text-gray-500">Specialization: {teacher.specialization}</div>}
                    </li>
                  )) : <li className="py-2 text-gray-500">No teachers found</li>}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Courses Modal */}
        {showCoursesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowCoursesModal(false)}>
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowCoursesModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">All Courses</h2>
              {allCoursesLoading ? <div>Loading...</div> : (
                <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
                  {allCourses.length ? allCourses.map((course: any) => (
                    <li key={course.id} className="py-2">
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-xs text-gray-500">Category: {course.category} | Students: {course.studentCount}</div>
                    </li>
                  )) : <li className="py-2 text-gray-500">No courses found</li>}
                </ul>
              )}
        </div>
      </div>
        )}
        {/* Messages Modal (overrides old one) */}
        {showMessagesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowMessagesModal(false)}>
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowMessagesModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">All Messages</h2>
              {allMessagesLoading ? <div>Loading...</div> : (
                <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
                  {allMessages.length ? allMessages.map((msg: any) => (
                    <li key={msg.id} className="py-2">
                      <div className="font-semibold">{msg.firstName} {msg.lastName} ({msg.email})</div>
                      <div className="text-xs text-gray-500">Subject: {msg.subject} | {new Date(msg.createdAt).toLocaleString()}</div>
                      <div className="text-gray-700 mt-1">{msg.message}</div>
                      {msg.reply && <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900">Reply: {msg.reply}</div>}
                    </li>
                  )) : <li className="py-2 text-gray-500">No messages found</li>}
                </ul>
              )}
              </div>
                      </div>
        )}
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700" onClick={() => addCourseMutation.mutate()}>+ Add Course</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700" onClick={exportUsers}>Export Users (CSV)</button>
                    </div>
        {/* Recent Registrations & Logins */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Recent Registrations</h2>
            {statsLoading ? <div>Loading...</div> : (
              <ul className="divide-y divide-gray-200">
                {stats?.recentRegistrations?.length ? stats.recentRegistrations.map((reg: any) => (
                  <li key={reg.id} className="py-2 flex justify-between items-center">
                    <span>{reg.name} ({reg.email})</span>
                    <span className="text-xs text-gray-500">{reg.role} | {new Date(reg.date).toLocaleDateString()}</span>
                  </li>
                )) : <li className="py-2 text-gray-500">No recent registrations</li>}
              </ul>
            )}
                      </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Recent Logins</h2>
            {loginsLoading ? <div>Loading...</div> : (
              <ul className="divide-y divide-gray-200">
                {safeLogins.length ? safeLogins.map((login: any, i: number) => (
                  <li key={i} className="py-2 flex justify-between items-center">
                    <span>{login.email}</span>
                    <span className="text-xs text-gray-500">{new Date(login.timestamp).toLocaleString()}</span>
                  </li>
                )) : <li className="py-2 text-gray-500">No recent logins</li>}
              </ul>
            )}
                    </div>
                      </div>
        {/* Online/Active Users & Contact Messages */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Online Users</h2>
            {onlineLoading ? <div>Loading...</div> : (
              <ul className="divide-y divide-gray-200">
                {safeOnlineUsers.length ? safeOnlineUsers.map((user: any) => (
                  <li key={user.id} className="py-2 flex justify-between items-center">
                    <span>{user.fullName} ({user.email})</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </li>
                )) : <li className="py-2 text-gray-500">No users online</li>}
              </ul>
            )}
                    </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Active Users (1 min)</h2>
            {activeLoading ? <div>Loading...</div> : (
              <ul className="divide-y divide-gray-200">
                {safeActiveUsers.length ? safeActiveUsers.map((user: any) => (
                  <li key={user.id} className="py-2 flex justify-between items-center">
                    <span>{user.fullName} ({user.email})</span>
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </li>
                )) : <li className="py-2 text-gray-500">No active users</li>}
              </ul>
            )}
                        </div>
                      </div>
        {/* User Management Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">User Management</h2>
          {usersLoading ? <div>Loading...</div> : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Joined</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? users.map((user: any) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.studentId || "-"}</td>
                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button className="text-red-500 hover:underline" onClick={() => deleteUserMutation.mutate(user.id)}>Delete</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={7} className="text-center py-4 text-gray-500">No users found</td></tr>}
              </tbody>
            </table>
          )}
                  </div>
        {/* Course Management Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Course Management</h2>
          {coursesLoading ? <div>Loading...</div> : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Students</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length ? courses.map((course: any) => (
                  <tr key={course.id} className="border-b">
                    <td className="px-4 py-2">{course.id}</td>
                    <td className="px-4 py-2">{course.title}</td>
                    <td className="px-4 py-2">{course.category}</td>
                    <td className="px-4 py-2">${course.price}</td>
                    <td className="px-4 py-2">{course.duration}</td>
                    <td className="px-4 py-2">{course.studentCount}</td>
                    <td className="px-4 py-2">
                      <button className="text-red-500 hover:underline" onClick={() => deleteCourseMutation.mutate(course.id)}>Delete</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan={7} className="text-center py-4 text-gray-500">No courses found</td></tr>}
              </tbody>
            </table>
          )}
                        </div>
        {/* Pending Registrations for Approval */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Pending Registrations</h2>
          {pendingUsers.length ? (
            <ul className="divide-y divide-gray-200">
              {pendingUsers.map((user: any) => (
                <li key={user.id} className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="font-semibold">{user.fullName} ({user.email})</div>
                    <div className="text-xs text-gray-500">Role: {user.role}</div>
                    {user.role === 'student' && (
                      <>
                        <div className="text-xs text-gray-500">Student ID: {user.studentId}</div>
                        <div className="text-xs text-gray-500">Transfer: {user.isTransferStudent ? 'Yes' : 'No'}</div>
                        {user.previousInstitution && <div className="text-xs text-gray-500">Previous Institution: {user.previousInstitution}</div>}
                        {/* ID Document */}
                        {user.idDocumentPath && (
                          <div className="text-xs mt-1">
                            <span className="font-semibold">ID Document: </span>
                            {user.idDocumentPath.match(/\.(jpg|jpeg|png)$/i) ? (
                              <img src={user.idDocumentPath.replace(/\\/g, '/').replace(/^.*uploads\//, '/uploads/')} alt="ID Document" className="inline-block h-16 border rounded" />
                            ) : (
                              <a href={user.idDocumentPath.replace(/\\/g, '/').replace(/^.*uploads\//, '/uploads/')} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                            )}
                          </div>
                        )}
                        {/* Transfer Letter */}
                        {user.transferLetterPath && (
                          <div className="text-xs mt-1">
                            <span className="font-semibold">Transfer Letter: </span>
                            <a href={user.transferLetterPath.replace(/\\/g, '/').replace(/^.*uploads\//, '/uploads/')} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                        </div>
                        )}
                            </>
                          )}
                    {user.role === 'teacher' && (
                      <>
                        {user.specialization && <div className="text-xs text-gray-500">Specialization: {user.specialization}</div>}
                        {user.experience && <div className="text-xs text-gray-500">Experience: {user.experience}</div>}
                        {user.qualifications && <div className="text-xs text-gray-500">Qualifications: {user.qualifications}</div>}
                        {/* Resume */}
                        {user.resumePath && (
                          <div className="text-xs mt-1">
                            <span className="font-semibold">Resume: </span>
                            <a href={user.resumePath.replace(/\\/g, '/').replace(/^.*uploads\//, '/uploads/')} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                              </div>
                            )}
                      </>
                    )}
                    <div className="text-xs text-gray-400">Registered: {new Date(user.createdAt).toLocaleString()}</div>
                            </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={async () => {
                      await apiRequest("POST", `/api/admin/users/${user.id}/accept`);
                      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                    }}>Accept</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={async () => {
                      await apiRequest("POST", `/api/admin/users/${user.id}/reject`);
                      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                    }}>Reject</button>
                      </div>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-500">No pending registrations.</div>}
                    </div>
        <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Back to Site</button>
      </div>
    </div>
  );
}