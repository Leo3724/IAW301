import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./admin/components/AdminNavbar";
import FacultyNavbar from "./faculty/components/FacultyNavbar";
import StudentNavbar from "./student/components/StudentNavbar";

// Public Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import VerifyCertificate from "./pages/VerifyCertificate";

// Student Portal
import StudentDashboard from "./student/Dashboard";
import CourseBrowse from "./student/Course";
import CourseDetail from "./student/CourseDetail";
import LearnCourse from "./student/LearnCourse";

// Faculty Portal
import FacultyDashboard from "./faculty/Dashboard";
import FacultyCourses from "./faculty/Courses";
import ManageCourse from "./faculty/ManageCourse";

// Admin Portal
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import AdminCourses from "./admin/AdminCourses";
import ManageStudents from "./admin/ManageStudents";

// Faculty extra pages
import FacultyAssignments from "./faculty/Assignments";
import FacultyProfile from "./faculty/Profile";
import FacultyAnnouncements from "./faculty/Announcements";

// Student extra pages
import StudentProfile from "./student/Profile";
import StudentGrades from "./student/Grades";
import StudentBadges from "./student/Badges";
import StudentAssignments from "./student/Assignments";
import StudentNotifications from "./student/Notifications";
import Certificate from "./student/Certificate";

// Role-based Route Protection
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd]"></div>
    </div>
  );
  
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If authenticated but wrong role, push them to their actual home
    switch (user?.role) {
      case "ADMIN": return <Navigate to="/admin/dashboard" replace />;
      case "INSTRUCTOR": return <Navigate to="/faculty/dashboard" replace />;
      case "STUDENT": return <Navigate to="/student/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

// GuestRoute: redirects mapped to user role if already authenticated
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  
  if (isAuthenticated) {
    if (user?.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "INSTRUCTOR") return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  
  return children;
};

// Intercepts legacy /dashboard clicks from the global Navbar and pushes properly
const DashboardRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (user?.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "INSTRUCTOR") return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  const isPortalView = path.includes("/dashboard") || path.includes("/learn") || path.includes("/admin") || path.includes("/faculty") || path.startsWith("/student");
  const isAdminRoute = path.startsWith("/admin");
  const isFacultyRoute = path.startsWith("/faculty");
  const isStudentRoute = path.startsWith("/student") || path.startsWith("/learn");
  
  // Render correct navbar context
  const renderNavbar = () => {
    if (isAdminRoute) return <AdminNavbar />;
    if (isFacultyRoute) return <FacultyNavbar />;
    if (isStudentRoute) return <StudentNavbar />;
    return <Navbar />;
  };

  return (
    <>
      <div className={path === "/" ? "home-page" : ""}>
        {renderNavbar()}
        
        <div className="pt-16 min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/About" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify/:code" element={<VerifyCertificate />} />
            
            {/* ---------------- STUDENT PORTAL ---------------- */}
            <Route path="/courses" element={<CourseBrowse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            <Route path="/student/dashboard" element={
              <RoleRoute allowedRoles={["STUDENT"]}><StudentDashboard /></RoleRoute>
            }/>
            <Route path="/learn/:courseId" element={
              <RoleRoute allowedRoles={["STUDENT"]}><LearnCourse /></RoleRoute>
            }/>
            
            {/* ---------------- FACULTY PORTAL ---------------- */}
            <Route path="/faculty/dashboard" element={
              <RoleRoute allowedRoles={["INSTRUCTOR"]}><FacultyDashboard /></RoleRoute>
            }/>
            <Route path="/faculty/courses" element={
              <RoleRoute allowedRoles={["INSTRUCTOR"]}><FacultyCourses /></RoleRoute>
            }/>
            <Route path="/faculty/manage-course" element={
              <RoleRoute allowedRoles={["INSTRUCTOR"]}><ManageCourse /></RoleRoute>
            }/>
            
            {/* ---------------- ADMIN PORTAL ---------------- */}
            <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["ADMIN"]}><AdminDashboard /></RoleRoute>}/>
            <Route path="/admin/users" element={<RoleRoute allowedRoles={["ADMIN"]}><ManageUsers /></RoleRoute>}/>
            <Route path="/admin/courses" element={<RoleRoute allowedRoles={["ADMIN"]}><AdminCourses /></RoleRoute>}/>
            <Route path="/admin/students" element={<RoleRoute allowedRoles={["ADMIN"]}><ManageStudents /></RoleRoute>}/>

            {/* ---------------- FACULTY EXTRA ROUTES ---------------- */}
            <Route path="/faculty/assignments" element={<RoleRoute allowedRoles={["INSTRUCTOR"]}><FacultyAssignments /></RoleRoute>}/>
            <Route path="/faculty/announcements" element={<RoleRoute allowedRoles={["INSTRUCTOR"]}><FacultyAnnouncements /></RoleRoute>}/>
            <Route path="/faculty/profile" element={<RoleRoute allowedRoles={["INSTRUCTOR"]}><FacultyProfile /></RoleRoute>}/>

            {/* ---------------- STUDENT EXTRA ROUTES ---------------- */}
            <Route path="/student/profile" element={<RoleRoute allowedRoles={["STUDENT"]}><StudentProfile /></RoleRoute>}/>
            <Route path="/student/grades" element={<RoleRoute allowedRoles={["STUDENT"]}><StudentGrades /></RoleRoute>}/>
            <Route path="/student/badges" element={<RoleRoute allowedRoles={["STUDENT"]}><StudentBadges /></RoleRoute>}/>
            <Route path="/student/assignments" element={<RoleRoute allowedRoles={["STUDENT"]}><StudentAssignments /></RoleRoute>}/>
            <Route path="/student/notifications" element={<RoleRoute allowedRoles={["STUDENT"]}><StudentNotifications /></RoleRoute>}/>
            <Route path="/student/certificate/:courseId" element={<RoleRoute allowedRoles={["STUDENT"]}><Certificate /></RoleRoute>}/>

            {/* Legacy Fallback Redirect for old Dashboard link */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {!isPortalView && <Footer />}
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
