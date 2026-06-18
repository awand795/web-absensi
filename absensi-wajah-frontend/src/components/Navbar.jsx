import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiClock, FiCamera, FiFileText, FiCalendar,
  FiUsers, FiSettings, FiLogOut, FiMapPin, FiBarChart2,
  FiMenu, FiX, FiChevronDown, FiUserCheck, FiSun, FiMoon,
  FiInfo, FiUser, FiBell, FiGrid, FiRefreshCw, FiMail
} from 'react-icons/fi';
import { useTheme } from '../lib/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { to: '/attendance', icon: <FiClock size={18} />, label: 'Absen' },
        { to: '/face-register', icon: <FiCamera size={18} />, label: 'Daftar Wajah' },
        { to: '/history', icon: <FiCalendar size={18} />, label: 'Riwayat' },
        { to: '/leave', icon: <FiFileText size={18} />, label: 'Izin' },
        { to: '/shift-swaps', icon: <FiRefreshCw size={18} />, label: 'Swap Shift' },
        { to: '/calendar', icon: <FiGrid size={18} />, label: 'Kalender' },
        { to: '/notifications', icon: <FiBell size={18} />, label: 'Notifikasi' },
        { to: '/profile', icon: <FiUser size={18} />, label: 'Profil' },
        { to: '/tentang', icon: <FiInfo size={18} />, label: 'Tentang' },
    ];

    const adminItems = [
        { to: '/admin/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
        { to: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
        { to: '/admin/shifts', icon: <FiSettings size={18} />, label: 'Shift' },
        { to: '/admin/leave', icon: <FiUserCheck size={18} />, label: 'Approval Izin' },
        { to: '/admin/locations', icon: <FiMapPin size={18} />, label: 'Lokasi' },
        { to: '/admin/report', icon: <FiBarChart2 size={18} />, label: 'Laporan' },
        { to: '/admin/overtime', icon: <FiClock size={18} />, label: 'Lembur' },
        { to: '/admin/email', icon: <FiMail size={18} />, label: 'Email' },
    ];

    const NavLink = ({ to, icon, label, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`nav-link ${isActive(to) ? 'active' : ''}`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50" style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/attendance" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                            <FiClock className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--text-heading)' }}>
                            Bikin-Absensi
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map(item => (
                            <NavLink key={item.to} {...item} />
                        ))}
                        {isAdmin && (
                            <div className="relative group ml-1">
                                <div className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer hover-bg"
                                    style={{ color: 'var(--text-secondary)' }}>
                                    <FiSettings size={16} />
                                    <span>Admin</span>
                                    <FiChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                                </div>
                                <div className="absolute top-full right-0 mt-1 w-56 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 shadow-lg rounded-xl"
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                                    {adminItems.map(item => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden lg:flex items-center gap-2">
                        <button onClick={toggleTheme}
                            className="flex items-center justify-center w-9 h-9 rounded-xl hover-icon"
                            style={{ color: 'var(--text-muted)' }}>
                            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                        </button>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ border: '1px solid var(--border-subtle)' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm max-w-[120px] truncate" style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium hover-danger"
                            style={{ color: 'var(--text-muted)' }}>
                            <FiLogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover-bg"
                        style={{ color: 'var(--text-secondary)' }}>
                        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="lg:hidden" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
                    <div className="px-4 py-3 space-y-1">
                        <button onClick={toggleTheme}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium hover-bg"
                            style={{ color: 'var(--text-secondary)' }}>
                            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                            <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
                        </button>
                        <hr style={{ borderColor: 'var(--border-subtle)' }} />
                        {[...navItems, ...(isAdmin ? adminItems : [])].map(item => (
                            <NavLink key={item.to} {...item} onClick={() => setMobileOpen(false)} />
                        ))}
                        <hr style={{ borderColor: 'var(--border-subtle)' }} />
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium hover-danger"
                            style={{ color: 'var(--text-muted)' }}>
                            <FiLogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
