import { useEffect, useState } from "react";
import { FiRefreshCw, FiUsers, FiCalendar, FiCheck, FiX, FiLoader, FiSend, FiClock, FiTrash2 } from 'react-icons/fi';
import api from '../api/axios';

const ShiftSwap = () => {
    const [swaps, setSwaps] = useState([]);
    const [users, setUsers] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [form, setForm] = useState({ target_id: '', shift_id: '', swap_date: '', reason: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const fetchData = async () => {
        try {
            const [swapsRes, usersRes, shiftsRes] = await Promise.all([
                api.get('/shift-swaps'),
                api.get('/admin/users').catch(() => ({ data: [] })),
                api.get('/shifts'),
            ]);
            setSwaps(swapsRes.data || []);
            setUsers(usersRes.data || []);
            setShifts(shiftsRes.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/shift-swaps', form);
            setForm({ target_id: '', shift_id: '', swap_date: '', reason: '' });
            fetchData();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
        finally { setSubmitting(false); }
    };

    const handleApprove = async (id) => {
        try { await api.put(`/shift-swaps/${id}/approve`); fetchData(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleReject = async (id) => {
        const reason = prompt('Alasan penolakan (opsional):');
        try { await api.post(`/shift-swaps/${id}/reject`, { reason }); fetchData(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus permintaan ini?')) return;
        try { await api.delete(`/shift-swaps/${id}`); fetchData(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const getStatusBadge = (status) => {
        if (status === 'approved') return 'badge badge-approved';
        if (status === 'rejected') return 'badge badge-rejected';
        return 'badge badge-pending';
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const pendingSwaps = swaps.filter(s => s.status === 'pending');
    const otherSwaps = swaps.filter(s => s.status !== 'pending');

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap"><FiRefreshCw size={20} /></div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Swap Shift</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tukar jadwal shift dengan karyawan lain</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-heading)' }}>Ajukan Swap Shift</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Karyawan Tujuan</label>
                                <select value={form.target_id} onChange={e => setForm({ ...form, target_id: e.target.value })} required className="input-field">
                                    <option value="">Pilih karyawan...</option>
                                    {users.filter(u => u.id !== user.id).map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Shift</label>
                                <select value={form.shift_id} onChange={e => setForm({ ...form, shift_id: e.target.value })} required className="input-field">
                                    <option value="">Pilih shift...</option>
                                    {shifts.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.end_time})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Tanggal Swap</label>
                                <input type="date" value={form.swap_date} onChange={e => setForm({ ...form, swap_date: e.target.value })} min={minDate} required className="input-field" />
                            </div>
                            <div>
                                <label className="input-label">Alasan (opsional)</label>
                                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="input-field" rows={3} placeholder="Mengapa ingin swap shift?" />
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary w-full">
                                {submitting ? <><FiLoader className="animate-spin" size={16} /> Mengirim...</> : <><FiSend size={16} /> Ajukan Swap</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pending */}
                    {pendingSwaps.length > 0 && (
                        <div className="glass-card overflow-hidden">
                            <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Menunggu Persetujuan</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                                {pendingSwaps.map(swap => (
                                    <div key={swap.id} className="p-5 flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(swap.status)}`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {swap.requester?.name} → {swap.target?.name}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                <span className="inline-flex items-center gap-1"><FiCalendar size={12} /> {swap.swap_date}</span>
                                                <span className="inline-flex items-center gap-1"><FiClock size={12} /> {swap.shift?.name} ({swap.shift?.start_time} - {swap.shift?.end_time})</span>
                                            </div>
                                            {swap.reason && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Alasan: {swap.reason}</p>}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            {((swap.target_id === user.id) || isAdmin) && (
                                                <>
                                                    <button onClick={() => handleApprove(swap.id)} className="btn-success !py-1.5 !px-3 text-xs"><FiCheck size={14} /> Setuju</button>
                                                    <button onClick={() => handleReject(swap.id)} className="btn-danger !py-1.5 !px-3 text-xs"><FiX size={14} /> Tolak</button>
                                                </>
                                            )}
                                            {(swap.requester_id === user.id) && (
                                                <button onClick={() => handleDelete(swap.id)} className="btn-secondary !py-1.5 !px-3 text-xs"><FiTrash2 size={14} /></button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History */}
                    {otherSwaps.length > 0 && (
                        <div className="glass-card overflow-hidden">
                            <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Riwayat</h2>
                            </div>
                            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                                {otherSwaps.map(swap => (
                                    <div key={swap.id} className="p-5 flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(swap.status)}`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {swap.requester?.name} → {swap.target?.name}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                <span className="inline-flex items-center gap-1"><FiCalendar size={12} /> {swap.swap_date}</span>
                                                <span className="inline-flex items-center gap-1"><FiClock size={12} /> {swap.shift?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {swaps.length === 0 && !loading && (
                        <div className="glass-card p-12 text-center">
                            <FiRefreshCw size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada permintaan swap shift</p>
                        </div>
                    )}

                    {loading && (
                        <div className="glass-card p-12 text-center">
                            <div className="loading-spinner w-8 h-8 mx-auto mb-3" />
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShiftSwap;
