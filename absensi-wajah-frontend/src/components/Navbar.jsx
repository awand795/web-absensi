import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiClock, FiCamera, FiFileText, FiCalendar, FiUsers, FiSettings, FiLogOut, FiMapPin } from 'react-icons/fi';
import api from '../api/axios';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (e) { /* ignore */ }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navLink = (to, icon, label) => (
        <Link to={to} style={{
            display: 'flex', alignItems: 'center', gap: '0.4em', padding: '0.5em 0.8em',
            borderRadius: '6px', color: location.pathname === to ? '#4f46e5' : '#374151',
            background: location.pathname === to ? '#eef2ff' : 'transparent',
            fontWeight: location.pathname === to ? 600 : 400, fontSize: '0.9em'
        }}>
            {icon} {label}
        </Link>
    );

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.6em 1.5em', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky', top: 0, zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                <strong style={{ marginRight: '1em', fontSize: '1.1em' }}>Absensi</strong>
                {navLink('/attendance', <FiClock />, 'Absen')}
                {navLink('/face-register', <FiCamera />, 'Daftar Wajah')}
                {navLink('/history', <FiCalendar />, 'Riwayat')}
                {navLink('/leave', <FiFileText />, 'Izin')}
                {isAdmin && navLink('/admin/dashboard', <FiHome />, 'Dashboard')}
                {isAdmin && navLink('/admin/users', <FiUsers />, 'Users')}
                {isAdmin && navLink('/admin/shifts', <FiSettings />, 'Shift')}
                {isAdmin && navLink('/admin/leave', <FiFileText />, 'Approval Izin')}
                {isAdmin && navLink('/admin/locations', <FiMapPin />, 'Lokasi')}
                {isAdmin && navLink('/admin/report', <FiCalendar />, 'Laporan')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8em' }}>
                <span style={{ fontSize: '0.85em', color: '#6b7280' }}>{user.name}</span>
                <button onClick={handleLogout} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.3em', padding: '0.4em 0.8em' }}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
