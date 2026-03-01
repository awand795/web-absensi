import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from './pages/login';
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

function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/';

  return (
    <>
      {!isLogin && <Navbar />}
      <Suspense fallback={<div className="page-container"><p>Memuat halaman...</p></div>}>
        <Routes>
          <Route path="/" element={<Login />} />
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
