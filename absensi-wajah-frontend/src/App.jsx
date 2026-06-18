import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from './pages/login';
import Landing from './pages/Landing';
import Tentang from './pages/Tentang';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Notifications from './pages/Notifications';
import AttendanceCalendar from './pages/AttendanceCalendar';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

const Attendance = lazy(() => import('./pages/Attendance'));
const FaceRegister = lazy(() => import('./pages/FaceRegister'));
const AttendanceHistory = lazy(() => import('./pages/AttendanceHistory'));
const LeaveRequest = lazy(() => import('./pages/LeaveRequest'));
const ShiftSwap = lazy(() => import('./pages/ShiftSwap'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ShiftManagement = lazy(() => import('./pages/admin/ShiftManagement'));
const LeaveApproval = lazy(() => import('./pages/admin/LeaveApproval'));
const AttendanceReport = lazy(() => import('./pages/admin/AttendanceReport'));
const LocationManagement = lazy(() => import('./pages/admin/LocationManagement'));
const OvertimeApproval = lazy(() => import('./pages/admin/OvertimeApproval'));
const EmailSettings = lazy(() => import('./pages/admin/EmailSettings'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <div className="loading-spinner w-10 h-10" />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat halaman...</p>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/tentang' || location.pathname === '/forgot-password';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><AttendanceCalendar /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/face-register" element={<PrivateRoute><FaceRegister /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><AttendanceHistory /></PrivateRoute>} />
          <Route path="/leave" element={<PrivateRoute><LeaveRequest /></PrivateRoute>} />
          <Route path="/shift-swaps" element={<PrivateRoute><ShiftSwap /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><Dashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />
          <Route path="/admin/shifts" element={<PrivateRoute adminOnly><ShiftManagement /></PrivateRoute>} />
          <Route path="/admin/leave" element={<PrivateRoute adminOnly><LeaveApproval /></PrivateRoute>} />
          <Route path="/admin/locations" element={<PrivateRoute adminOnly><LocationManagement /></PrivateRoute>} />
          <Route path="/admin/report" element={<PrivateRoute adminOnly><AttendanceReport /></PrivateRoute>} />
          <Route path="/admin/overtime" element={<PrivateRoute adminOnly><OvertimeApproval /></PrivateRoute>} />
          <Route path="/admin/email" element={<PrivateRoute adminOnly><EmailSettings /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
