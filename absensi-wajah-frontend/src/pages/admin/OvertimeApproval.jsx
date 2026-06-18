import { useEffect, useState } from "react";
import { FiClock, FiCheck, FiX, FiLoader, FiUser, FiCalendar } from 'react-icons/fi';
import api from '../../api/axios';

const OvertimeApproval = () => {
    const [overtimes, setOvertimes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/overtime/pending');
            setOvertimes(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id) => {
        try { await api.put(`/admin/overtime/${id}/approve`); fetchData(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleReject = async (id) => {
        if (!confirm('Yakin tolak lembur ini?')) return;
        try { await api.put(`/admin/overtime/${id}/reject`); fetchData(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '-';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m}m`;
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap"><FiClock size={20} /></div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Persetujuan Lembur</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Setujui atau tolak lembur karyawan</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Lembur Menunggu Persetujuan</h2>
                </div>
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="loading-spinner w-8 h-8 mx-auto mb-3" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat...</p>
                    </div>
                ) : overtimes.length === 0 ? (
                    <div className="p-12 text-center">
                        <FiClock size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tidak ada lembur yang menunggu persetujuan</p>
                    </div>
                ) : (
                    <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                        {overtimes.map(ot => (
                            <div key={ot.id} className="p-5 flex items-start justify-between gap-4 hover-bg transition-all">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-pending">Pending</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        <FiUser size={14} style={{ color: 'var(--text-muted)' }} />
                                        {ot.user?.name || 'Unknown'}
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                        <span className="inline-flex items-center gap-1"><FiCalendar size={12} /> {ot.date}</span>
                                        <span className="inline-flex items-center gap-1"><FiClock size={12} /> Shift: {ot.shift?.name} ({ot.shift?.start_time} - {ot.shift?.end_time})</span>
                                        <span className="inline-flex items-center gap-1 font-medium" style={{ color: '#d4a853' }}>Lembur: {formatDuration(ot.overtime_minutes)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleApprove(ot.id)} className="btn-success !py-1.5 !px-3 text-xs">
                                        <FiCheck size={14} /> Setuju
                                    </button>
                                    <button onClick={() => handleReject(ot.id)} className="btn-danger !py-1.5 !px-3 text-xs">
                                        <FiX size={14} /> Tolak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OvertimeApproval;
