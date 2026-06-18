import { useEffect, useState, useRef } from "react";
import { FiUser, FiCamera, FiLock, FiSave, FiShield, FiCheck, FiAlertCircle, FiInfo, FiLoader, FiUpload } from 'react-icons/fi';
import api from '../api/axios';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', security_question: '', security_answer: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                const data = res.data.data || res.data;
                setProfile(data);
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    security_question: data.security_question || '',
                    security_answer: '',
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        setMsg('');
        try {
            const payload = { name: form.name, email: form.email };
            if (form.security_question) payload.security_question = form.security_question;
            if (form.security_answer) payload.security_answer = form.security_answer;

            const res = await api.put('/profile', payload);
            setProfile(res.data.data || res.data);
            setMsg('Profil berhasil diperbarui');
            setMsgType('success');
            setEditing(false);
            localStorage.setItem('user', JSON.stringify(res.data.data || res.data));
        } catch (err) {
            setMsg('Gagal: ' + (err.response?.data?.message || err.message));
            setMsgType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            await api.put('/profile/password', passwordForm);
            setMsg('Password berhasil diubah');
            setMsgType('success');
            setShowPasswordForm(false);
            setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (err) {
            setMsg('Gagal: ' + (err.response?.data?.message || err.message));
            setMsgType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setMsg('');
        try {
            const formData = new FormData();
            formData.append('photo', file);
            await api.post('/profile/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMsg('Foto berhasil diupload');
            setMsgType('success');
            // Refresh profile
            const res = await api.get('/profile');
            setProfile(res.data.data || res.data);
        } catch (err) {
            setMsg('Gagal upload: ' + (err.response?.data?.message || err.message));
            setMsgType('error');
        } finally {
            setUploading(false);
        }
    };

    const Alert = ({ type, children }) => {
        const icons = { success: <FiCheck size={16} />, error: <FiAlertCircle size={16} />, info: <FiInfo size={16} /> };
        return msg && (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border`}
                style={{ background: type === 'error' ? 'rgba(201,74,74,0.08)' : type === 'success' ? 'rgba(125,155,118,0.08)' : 'rgba(112,145,168,0.08)', borderColor: type === 'error' ? 'rgba(201,74,74,0.2)' : type === 'success' ? 'rgba(125,155,118,0.2)' : 'rgba(112,145,168,0.2)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: type === 'error' ? '#c94a4a' : type === 'success' ? '#7d9b76' : '#7091a8' }}>{icons[type]}</span>
                <p className="text-sm font-medium" style={{ color: type === 'error' ? '#c94a4a' : type === 'success' ? '#7d9b76' : '#7091a8' }}>{children}</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="loading-spinner w-8 h-8" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat profil...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                    <FiUser className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Profil Saya</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kelola informasi akun Anda</p>
                </div>
            </div>

            <Alert type={msgType}>{msg}</Alert>

            {/* Photo Card */}
            <div className="glass-card p-6 mb-4 text-center">
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3" style={{ background: 'var(--bg-hover)', border: '3px solid var(--border-subtle)' }}>
                        {profile.photo ? (
                            <img src={`${api.defaults.baseURL.replace('/api', '')}/storage/${profile.photo}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                                <span className="text-3xl font-bold text-white">{profile.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        style={{ background: 'var(--gradient-primary)' }}
                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.target.style.transform = 'scale(1)'}>
                        {uploading ? <FiLoader className="animate-spin text-white" size={14} /> : <FiCamera className="text-white" size={14} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>{profile.name}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-2"
                    style={{ background: profile.role === 'admin' ? 'rgba(212,90,74,0.08)' : 'rgba(125,155,118,0.08)', color: profile.role === 'admin' ? '#d45a4a' : '#7d9b76' }}>
                    {profile.role === 'admin' ? 'Administrator' : 'Karyawan'}
                </div>
            </div>

            {/* Edit Profile Card */}
            <div className="glass-card p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>Informasi Akun</h3>
                    <button onClick={() => setEditing(!editing)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                        style={{ color: '#d45a4a', background: editing ? 'rgba(212,90,74,0.08)' : 'transparent' }}>
                        {editing ? 'Batal' : 'Edit'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="input-label">Nama Lengkap</label>
                        <input type="text" value={editing ? form.name : profile.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            disabled={!editing} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Email</label>
                        <input type="email" value={editing ? form.email : profile.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            disabled={!editing} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">ID Karyawan</label>
                        <input type="text" value={profile.id_karyawan || '-'} disabled className="input-field opacity-60" />
                    </div>

                    {editing && (
                        <>
                            <hr style={{ borderColor: 'var(--border-subtle)' }} />
                            <div>
                                <label className="input-label">Pertanyaan Keamanan <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(untuk reset password)</span></label>
                                <select value={form.security_question} onChange={e => setForm({ ...form, security_question: e.target.value })}
                                    className="input-field">
                                    <option value="">-- Pilih Pertanyaan --</option>
                                    <option value="Apa nama hewan peliharaan pertama Anda?">Apa nama hewan peliharaan pertama Anda?</option>
                                    <option value="Apa nama sekolah dasar Anda?">Apa nama sekolah dasar Anda?</option>
                                    <option value="Apa makanan favorit Anda?">Apa makanan favorit Anda?</option>
                                    <option value="Siapa nama pahlawan favorit Anda?">Siapa nama pahlawan favorit Anda?</option>
                                    <option value="Apa merek mobil pertama Anda?">Apa merek mobil pertama Anda?</option>
                                </select>
                            </div>
                            {form.security_question && (
                                <div>
                                    <label className="input-label">Jawaban</label>
                                    <input type="text" value={form.security_answer}
                                        onChange={e => setForm({ ...form, security_answer: e.target.value })}
                                        placeholder="Masukkan jawaban" className="input-field" />
                                </div>
                            )}
                            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary w-full py-3">
                                {saving ? <><FiLoader className="animate-spin" size={16} /> Menyimpan...</> : <><FiSave size={16} /> Simpan Perubahan</>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="glass-card p-6 mb-4">
                <button onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,90,74,0.08)', color: '#d45a4a' }}>
                            <FiLock size={16} />
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--text-heading)' }}>Ubah Password</span>
                    </div>
                    <FiLock size={16} style={{ color: 'var(--text-muted)' }} />
                </button>

                {showPasswordForm && (
                    <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                        <div>
                            <label className="input-label">Password Saat Ini</label>
                            <input type="password" value={passwordForm.current_password}
                                onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                required className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Password Baru</label>
                            <input type="password" value={passwordForm.new_password}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                required minLength={6} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Konfirmasi Password Baru</label>
                            <input type="password" value={passwordForm.new_password_confirmation}
                                onChange={e => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                                required minLength={6} className="input-field" />
                        </div>
                        <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                            {saving ? <><FiLoader className="animate-spin" size={16} /> Menyimpan...</> : <><FiShield size={16} /> Ubah Password</>}
                        </button>
                    </form>
                )}
            </div>

            {/* Account Info */}
            <div className="glass-card p-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>Info Akun</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--text-muted)' }}>Status</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{profile.status || 'Aktif'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--text-muted)' }}>Bergabung</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
