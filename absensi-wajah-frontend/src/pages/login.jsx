import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiMail, FiLoader, FiLogIn, FiArrowLeft, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../lib/ThemeContext';
import api from '../api/axios';
import { loadModels } from '../lib/faceModels';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', {
                email,
                password,
                device_name: 'web_browser'
            });
            localStorage.setItem('auth_token', res.data.token);

            const [userRes] = await Promise.all([
                api.get('/users/me'),
                loadModels(),
            ]);
            localStorage.setItem('user', JSON.stringify(userRes.data.data));
            navigate('/attendance');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
            {/* Subtle background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #d45a4a 0%, transparent 70%)' }} />
                <div className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7091a8 0%, transparent 70%)' }} />
            </div>

            {/* Theme Toggle */}
            <div className="fixed top-4 right-4 z-50">
                <button onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover-border hover-text"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
            </div>

            <div className="relative w-full max-w-md mx-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                        style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 14px rgba(212, 90, 74, 0.25)' }}>
                        <FiLock className="text-white" size={30} />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Bikin-Absensi</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Masuk dengan akun Anda</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="input-label">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FiMail size={16} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <input
                                    type="email" value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="Masukkan email" required
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FiLock size={16} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <input
                                    type="password" value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Masukkan password" required
                                    className="input-field"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(201, 74, 74, 0.08)', border: '1px solid rgba(201, 74, 74, 0.2)', color: '#c94a4a' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                            {loading ? (
                                <><FiLoader className="animate-spin" size={18} /> Memproses...</>
                            ) : (
                                <><FiLogIn size={18} /> Masuk</>
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/forgot-password"
                                className="inline-flex items-center gap-1.5 text-sm hover-text"
                                style={{ color: 'var(--text-muted)' }}>
                                Lupa Password?
                            </Link>
                        </div>

                        <div className="text-center">
                            <Link to="/"
                                className="inline-flex items-center gap-1.5 text-sm hover-text"
                                style={{ color: 'var(--text-muted)' }}>
                                <FiArrowLeft size={14} />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
