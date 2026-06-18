import { Link } from 'react-router-dom';
import {
  FiCamera, FiMapPin, FiClock, FiFileText, FiBarChart2,
  FiUsers, FiChevronRight, FiArrowRight, FiSun, FiMoon,
  FiCheck, FiStar
} from 'react-icons/fi';
import { useTheme } from '../lib/ThemeContext';

const Landing = () => {
    const { theme, toggleTheme } = useTheme();

    const features = [
        {
            icon: <FiCamera size={24} />,
            title: 'Face Recognition',
            desc: 'Absensi dengan pengenalan wajah — cukup hadap ke kamera. Akurat, cepat, dan bebas kontak fisik.',
            color: '#d45a4a'
        },
        {
            icon: <FiMapPin size={24} />,
            title: 'Geo-Verification',
            desc: 'Verifikasi lokasi GPS real-time. Pastikan absensi hanya bisa dilakukan di tempat yang sudah ditentukan.',
            color: '#c19066'
        },
        {
            icon: <FiClock size={24} />,
            title: 'Shift Management',
            desc: 'Atur jadwal shift dengan fleksibel. Karyawan bisa memilih shift yang tersedia saat clock-in.',
            color: '#7091a8'
        },
        {
            icon: <FiFileText size={24} />,
            title: 'Leave Management',
            desc: 'Ajukan cuti, sakit, atau izin dalam hitungan detik. Approval flow yang transparan dan cepat.',
            color: '#7d9b76'
        },
        {
            icon: <FiBarChart2 size={24} />,
            title: 'Reports & Analytics',
            desc: 'Dashboard lengkap dengan filter bulan, tahun, dan ekspor data untuk payroll dan evaluasi.',
            color: '#d4a853'
        },
        {
            icon: <FiUsers size={24} />,
            title: 'Team Management',
            desc: 'Kelola data karyawan, atur role & akses, dan pantau kehadiran secara real-time dari satu panel.',
            color: '#d45a4a'
        }
    ];

    const steps = [
        {
            num: '01',
            title: 'Daftarkan Wajah',
            desc: 'Cukup sekali registrasi via kamera. Data wajah Anda tersimpan aman sebagai referensi absensi.',
            icon: <FiCamera size={22} />
        },
        {
            num: '02',
            title: 'Absen Tiap Hari',
            desc: 'Clock-in & clock-out cukup dengan menghadap kamera. Sistem mencocokkan wajah secara otomatis.',
            icon: <FiClock size={22} />
        },
        {
            num: '03',
            title: 'Pantau & Evaluasi',
            desc: 'Lihat riwayat, ajukan izin, dan dapatkan notifikasi status kehadiran secara real-time.',
            icon: <FiBarChart2 size={22} />
        }
    ];

    const stats = [
        { value: '99.7%', label: 'Akurasi Pengenalan' },
        { value: '< 1 dtk', label: 'Kecepatan Verifikasi' },
        { value: '24/7', label: 'Ketersediaan Sistem' }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
            {/* ===== NAVBAR ===== */}
            <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                <FiClock className="text-white" size={17} />
                            </div>
                            <span className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>Absensi</span>
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            <a href="#features" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200" style={{ color: 'var(--text-secondary)' }}
                                onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}>
                                Fitur
                            </a>
                            <a href="#how-it-works" className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200" style={{ color: 'var(--text-secondary)' }}
                                onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}>
                                Cara Kerja
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={toggleTheme}
                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}>
                                {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
                            </button>
                            <Link to="/login"
                                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseOver={e => { e.target.style.color = 'var(--text-primary)'; }}
                                onMouseOut={e => { e.target.style.color = 'var(--text-secondary)'; }}>
                                Masuk
                            </Link>
                            <Link to="/login" className="btn-primary text-sm px-5 py-2">
                                Mulai <FiArrowRight size={15} className="ml-0.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--gradient-hero)' }} />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #d45a4a 0%, transparent 70%)', transform: 'translateY(-50%)' }} />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #7091a8 0%, transparent 70%)' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
                            style={{ background: 'rgba(212, 90, 74, 0.08)', border: '1px solid rgba(212, 90, 74, 0.15)', color: '#d45a4a' }}>
                            <FiStar size={14} />
                            <span>Solusi Absensi Terintegrasi</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
                            style={{ color: 'var(--text-heading)' }}>
                            Absensi Wajah{' '}
                            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Modern & Cerdas
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Sistem absensi berbasis pengenalan wajah dengan verifikasi lokasi GPS.
                            Solusi tepat untuk manajemen kehadiran yang akurat, efisien, dan transparan.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="btn-primary text-base px-8 py-3.5 shadow-lg">
                                Mulai Sekarang <FiArrowRight size={18} />
                            </Link>
                            <a href="#features"
                                className="btn-secondary text-base px-8 py-3.5">
                                Pelajari Fitur
                            </a>
                        </div>

                        <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-xl mx-auto">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{s.value}</div>
                                    <div className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section id="features" className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-heading)' }}>
                            Semua yang Anda Butuhkan
                        </h2>
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            Platform lengkap untuk manajemen kehadiran — dari registrasi wajah hingga laporan payroll.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={i}
                                className="group rounded-2xl p-6 cursor-default transition-all duration-300"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                                onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseOut={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `${f.color}12`, color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="py-24 md:py-32" style={{ background: 'var(--gradient-hero)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-heading)' }}>
                            Cara Kerja
                        </h2>
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            Tiga langkah sederhana untuk transformasi absensi perusahaan Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px" style={{ background: 'linear-gradient(to right, #d45a4a40, #c1906640, #7091a840)' }} />

                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 14px rgba(212, 90, 74, 0.25)' }}>
                                    <span className="text-white">{step.icon}</span>
                                </div>
                                <div className="text-5xl font-black mb-1 select-none"
                                    style={{ color: 'var(--text-muted)', opacity: 0.15 }}>{step.num}</div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="py-24 md:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.06] rounded-bl-full pointer-events-none"
                            style={{ background: 'var(--gradient-primary)' }} />
                        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-[0.04] rounded-tr-full pointer-events-none"
                            style={{ background: 'linear-gradient(135deg, #7091a8, #c19066)' }} />

                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text-heading)' }}>
                                Siap Mencoba?
                            </h2>
                            <p className="text-lg max-w-lg mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                                Bergabunglah dengan perusahaan lain yang telah mempercayakan absensi pada sistem kami.
                                Gratis untuk dicoba.
                            </p>
                            <Link to="/login" className="btn-primary text-base px-8 py-3.5 shadow-lg">
                                Mulai Sekarang <FiChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                <FiClock className="text-white" size={14} />
                            </div>
                            <span className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>Absensi</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                            <a href="#features" style={{ color: 'inherit' }}>Fitur</a>
                            <a href="#how-it-works" style={{ color: 'inherit' }}>Cara Kerja</a>
                            <span>© 2026 Absensi</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
