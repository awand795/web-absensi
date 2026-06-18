import { useEffect, useState } from "react";
import { FiMail, FiSave, FiLoader, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axios';

const EmailSettings = () => {
    const [form, setForm] = useState({
        email_notifications_enabled: false,
        smtp_host: '',
        smtp_port: '587',
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        from_email: '',
        from_name: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/email-settings');
                if (res.data && res.data.id) {
                    setForm(res.data);
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        try {
            await api.put('/admin/email-settings', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="loading-spinner w-8 h-8" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap"><FiMail size={20} /></div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Pengaturan Email</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Konfigurasi SMTP untuk notifikasi email</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-overlay)' }}>
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Aktifkan Email Notifikasi</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Kirim notifikasi via email untuk izin, approval, dll.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={form.email_notifications_enabled} onChange={e => setForm({ ...form, email_notifications_enabled: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                                style={{ background: form.email_notifications_enabled ? '#7d9b76' : 'var(--border-default)' }} />
                        </label>
                    </div>

                    {form.email_notifications_enabled && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">SMTP Host</label>
                                    <input value={form.smtp_host} onChange={e => setForm({ ...form, smtp_host: e.target.value })} className="input-field" placeholder="smtp.gmail.com" />
                                </div>
                                <div>
                                    <label className="input-label">SMTP Port</label>
                                    <input value={form.smtp_port} onChange={e => setForm({ ...form, smtp_port: e.target.value })} className="input-field" placeholder="587" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">SMTP Username</label>
                                    <input value={form.smtp_username} onChange={e => setForm({ ...form, smtp_username: e.target.value })} className="input-field" placeholder="user@gmail.com" />
                                </div>
                                <div>
                                    <label className="input-label">SMTP Password</label>
                                    <input type="password" value={form.smtp_password} onChange={e => setForm({ ...form, smtp_password: e.target.value })} className="input-field" placeholder="App password" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Enkripsi</label>
                                    <select value={form.smtp_encryption} onChange={e => setForm({ ...form, smtp_encryption: e.target.value })} className="input-field">
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="null">Tanpa enkripsi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">From Email</label>
                                    <input type="email" value={form.from_email} onChange={e => setForm({ ...form, from_email: e.target.value })} className="input-field" placeholder="noreply@bikin-absensi.com" />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">From Name</label>
                                <input value={form.from_name} onChange={e => setForm({ ...form, from_name: e.target.value })} className="input-field" placeholder="Bikin-Absensi" />
                            </div>
                        </>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={saving} className="btn-primary">
                            {saving ? <><FiLoader className="animate-spin" size={16} /> Menyimpan...</> : <><FiSave size={16} /> Simpan Pengaturan</>}
                        </button>
                        {saved && (
                            <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: '#7d9b76' }}>
                                <FiCheckCircle size={16} /> Tersimpan
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailSettings;
