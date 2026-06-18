import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiMail, FiLoader, FiArrowLeft, FiShield, FiCheck, FiAlertCircle } from 'react-icons/fi';
import api from '../api/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/forgot-password/get-question', { email });
            if (!res.data.has_question) {
                setError('Akun ini belum mengatur pertanyaan keamanan. Hubungi admin untuk reset password.');
                return;
            }
            setSecurityQuestion(res.data.question);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Email tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== newPasswordConfirmation) {
            setError('Konfirmasi password tidak sesuai');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/forgot-password/reset', {
                email,
                security_answer: securityAnswer,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            });
            setSuccess('Password berhasil direset! Silakan login dengan password baru.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #d45a4a 0%, transparent 70%)' }} />
                <div className="absolute bottom-1/4 -right-32 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7091a8 0%, transparent 70%)' }} />
            </div>

            <div className="relative w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                        style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 14px rgba(212, 90, 74, 0.25)' }}>
                        <FiShield className="text-white" size={30} />
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Lupa Password</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {step === 1 ? 'Masukkan email untuk reset password' : 'Jawab pertanyaan & buat password baru'}
                    </p>
                </div>

                <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(125,155,118,0.1)', color: '#7d9b76' }}>
                                <FiCheck size={28} />
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#7d9b76' }}>{success}</p>
                        </div>
                    ) : (
                        <form onSubmit={step === 1 ? handleCheckEmail : handleResetPassword} className="space-y-5">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="input-label">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <FiMail size={16} style={{ color: 'var(--text-muted)' }} />
                                            </div>
                                            <input type="email" value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                placeholder="Masukkan email" required className="input-field pl-10" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                                        {loading ? <><FiLoader className="animate-spin" size={18} /> Memeriksa...</> : 'Lanjutkan'}
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="p-4 rounded-xl text-sm" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                                        <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Pertanyaan Keamanan:</p>
                                        <p style={{ color: 'var(--text-secondary)' }}>{securityQuestion}</p>
                                    </div>
                                    <div>
                                        <label className="input-label">Jawaban Anda</label>
                                        <input type="text" value={securityAnswer}
                                            onChange={(e) => { setSecurityAnswer(e.target.value); setError(''); }}
                                            placeholder="Masukkan jawaban" required className="input-field" />
                                    </div>

                                    <hr style={{ borderColor: 'var(--border-subtle)' }} />

                                    <div>
                                        <label className="input-label">Password Baru</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <FiLock size={16} style={{ color: 'var(--text-muted)' }} />
                                            </div>
                                            <input type="password" value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Minimal 6 karakter" required minLength={6}
                                                className="input-field pl-10" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label">Konfirmasi Password Baru</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <FiLock size={16} style={{ color: 'var(--text-muted)' }} />
                                            </div>
                                            <input type="password" value={newPasswordConfirmation}
                                                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                                placeholder="Ulangi password" required minLength={6}
                                                className="input-field pl-10" />
                                        </div>
                                    </div>

                                    <button type="button" onClick={() => setStep(1)}
                                        className="text-sm w-full text-center py-2 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}                                    className="text-sm w-full text-center py-2 hover-text"
                                    style={{ color: 'var(--text-muted)' }}>
                                        Ganti email
                                    </button>

                                    <button type="submit" disabled={loading || !securityAnswer || !newPassword} className="btn-primary w-full py-3">
                                        {loading ? <><FiLoader className="animate-spin" size={18} /> Menyimpan...</> : <><FiShield size={18} /> Reset Password</>}
                                    </button>
                                </>
                            )}

                            {error && (
                                <div className="p-3 rounded-xl text-sm flex items-start gap-2"
                                    style={{ background: 'rgba(201, 74, 74, 0.08)', border: '1px solid rgba(201, 74, 74, 0.2)', color: '#c94a4a' }}>
                                    <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link to="/login"
                            className="inline-flex items-center gap-1.5 text-sm transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        className="inline-flex items-center gap-1.5 text-sm hover-text"
                        style={{ color: 'var(--text-muted)' }}>
                        <FiArrowLeft size={14} />
                        Kembali ke Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
