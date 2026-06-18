import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiInstagram, FiGlobe, FiMail, FiHeart, FiCode } from 'react-icons/fi';
import { useTheme } from '../lib/ThemeContext';

const Tentang = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
            {/* Simple Navbar */}
            <nav className="sticky top-0 z-50" style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
                            <FiArrowLeft size={16} />
                            Kembali
                        </Link>
                        <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>Tentang</span>
                        <div className="w-20" />
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
                {/* Powered by Bikinsite */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'var(--gradient-primary)' }}>
                        <FiHeart className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-heading)' }}>
                        Dibuat dengan <span style={{ color: '#d45a4a' }}>❤</span> oleh
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <FiCode size={20} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#d45a4a] to-[#c19066] bg-clip-text text-transparent">
                            Bikinsite
                        </span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="rounded-2xl p-8 md:p-12 mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                    <div className="prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
                        <p className="text-lg leading-relaxed mb-6">
                            <strong style={{ color: 'var(--text-heading)' }}>Bikin-Absensi</strong> adalah sistem absensi wajah 
                            modern yang dikembangkan oleh <strong style={{ color: 'var(--text-heading)' }}>Bikinsite</strong> — 
                            sebuah platform jasa pembuatan website dan aplikasi web profesional.
                        </p>
                        <p className="text-lg leading-relaxed mb-6">
                            Kami percaya bahwa teknologi harus memberikan dampak nyata. 
                            Bikin-Absensi hadir untuk membantu perusahaan, institusi, dan organisasi 
                            dalam mengelola kehadiran secara akurat, efisien, dan bebas kecurangan 
                            — cukup dengan pengenalan wajah dan verifikasi GPS.
                        </p>
                    </div>

                    {/* Creator Info */}
                    <div className="mt-8 p-6 rounded-xl" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Pengembang</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: 'var(--gradient-primary)' }}>
                                A
                            </div>
                            <div>
                                <div className="font-semibold" style={{ color: 'var(--text-heading)' }}>Adnawa</div>
                                <a href="https://instagram.com/adnawaa" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm mt-1 transition-colors"
                                    style={{ color: 'var(--text-muted)' }}>
                                    <FiInstagram size={14} />
                                    @adnawaa
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <a href="https://bikinsite.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 group"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                        className="rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 group hover-card"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(212, 90, 74, 0.1)', color: '#d45a4a' }}>
                            <FiGlobe size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold" style={{ color: 'var(--text-heading)' }}>Website Bikinsite</div>
                            <div className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>bikinsite.vercel.app</div>
                        </div>
                        <FiExternalLink size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                    </a>

                    <a href="https://instagram.com/bikinsite.id" target="_blank" rel="noopener noreferrer"
                        className="rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 group"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                        className="rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 group hover-card"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(228, 64, 95, 0.1), rgba(193, 53, 132, 0.1))', color: '#e4405f' }}>
                            <FiInstagram size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold" style={{ color: 'var(--text-heading)' }}>Instagram Bikinsite</div>
                            <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>@bikinsite.id</div>
                        </div>
                        <FiExternalLink size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'var(--text-muted)' }} />
                    </a>
                </div>

                {/* Contact CTA */}
                <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-heading)' }}>
                    Ingin buat website seperti ini?
                    </h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Hubungi Bikinsite untuk jasa pembuatan website dan aplikasi web profesional.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="https://instagram.com/bikinsite.id" target="_blank" rel="noopener noreferrer"
                            className="btn-primary">
                            <FiInstagram size={18} />
                            DM Instagram
                        </a>
                        <a href="https://bikinsite.vercel.app" target="_blank" rel="noopener noreferrer"
                            className="btn-secondary">
                            <FiGlobe size={18} />
                            Kunjungi Website
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <p>Powered by <a href="https://bikinsite.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover-text" style={{ color: 'var(--text-heading)' }}>Bikinsite</a></p>
                    <p className="mt-1">© 2026 Bikin-Absensi. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Tentang;
