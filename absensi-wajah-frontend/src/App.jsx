import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from './pages/login';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

const Attendance = lazy(() => import('./pages/Attendance'));
const FaceRegister = lazy(() => import('./pages/FaceRegister'));
const AttendanceHistory = lazy(() => import('./pages/AttendanceHistory'));
const LeaveRequest = lazy(() => import('./pages/LeaveRequest'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ShiftManagement = lazy(() => import('./pages/admin/ShiftManagement'));
const LeaveApproval = lazy(() => import('./pages/admin/LeaveApproval'));
const AttendanceReport = lazy(() => import('./pages/admin/AttendanceReport'));
const LocationManagement = lazy(() => import('./pages/admin/LocationManagement'));

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
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/face-register" element={<PrivateRoute><FaceRegister /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><AttendanceHistory /></PrivateRoute>} />
          <Route path="/leave" element={<PrivateRoute><LeaveRequest /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><Dashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />
          <Route path="/admin/shifts" element={<PrivateRoute adminOnly><ShiftManagement /></PrivateRoute>} />
          <Route path="/admin/leave" element={<PrivateRoute adminOnly><LeaveApproval /></PrivateRoute>} />
          <Route path="/admin/locations" element={<PrivateRoute adminOnly><LocationManagement /></PrivateRoute>} />
          <Route path="/admin/report" element={<PrivateRoute adminOnly><AttendanceReport /></PrivateRoute>} />
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
