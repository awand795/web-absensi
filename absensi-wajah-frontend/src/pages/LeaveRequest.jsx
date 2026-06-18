import { useEffect, useState } from "react";
import { FiFileText, FiSend, FiCalendar, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import api from '../api/axios';

const LeaveRequest = () => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ jenis_izin: 'Sakit', tanggal_mulai: '', tanggal_selesai: '' });
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
        try {
            const res = await api.get('/izin/me');
            setList(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchList(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/izin', form);
            setMsg('Izin berhasil diajukan');
            setMsgType('success');
            setForm({ jenis_izin: 'Sakit', tanggal_mulai: '', tanggal_selesai: '' });
            fetchList();
        } catch (err) {
            setMsg('Gagal: ' + (err.response?.data?.message || err.message));
            setMsgType('error');
        }
    };

    const getStatusBadge = (s) => {
        if (s === 'Disetujui') return 'badge badge-approved';
        if (s === 'Ditolak') return 'badge badge-rejected';
        return 'badge badge-pending';
    };

    const Alert = ({ type, children }) => {
        const styles = {
            error: 'bg-red-500/10 border-red-500/20 text-red-300',
            success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
            info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        };
        const icons = {
            error: <FiAlertCircle size={16} />,
            success: <FiCheckCircle size={16} />,
            info: <FiInfo size={16} />,
        };
        return (
            <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border ${styles[type] || styles.info}`}>
                <span className="mt-0.5 shrink-0">{icons[type] || icons.info}</span>
                <p className="text-sm font-medium">{children}</p>
            </div>
        );
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiFileText className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Pengajuan Izin</h1>
                    <p className="text-sm text-slate-400">Ajukan izin cuti, sakit, atau keperluan lainnya</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div>
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-5">Form Izin</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Jenis Izin</label>
                                <select
                                    value={form.jenis_izin}
                                    onChange={e => setForm({ ...form, jenis_izin: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="Sakit">Sakit</option>
                                    <option value="Cuti">Cuti</option>
                                    <option value="Izin">Izin</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="input-label">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={form.tanggal_mulai}
                                        onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={form.tanggal_selesai}
                                        onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full py-3">
                                <FiSend size={16} />
                                Ajukan Izin
                            </button>
                            {msg && <Alert type={msgType}>{msg}</Alert>}
                        </form>
                    </div>
                </div>

                {/* History */}
                <div>
                    <div className="glass-card overflow-hidden">
                        <div className="p-5 border-b border-slate-700/30">
                            <h2 className="text-lg font-semibold text-white">Riwayat Izin</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Jenis</th>
                                        <th>Mulai</th>
                                        <th>Selesai</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="loading-spinner w-6 h-6" />
                                                    <span className="text-sm text-slate-500">Memuat...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : list.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FiCalendar className="text-slate-500" size={24} />
                                                    <span className="text-sm text-slate-500">Belum ada pengajuan</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : list.map((item, i) => (
                                        <tr key={i}>
                                            <td className="font-medium text-slate-200">{item.jenis_izin}</td>
                                            <td>{item.tanggal_mulai}</td>
                                            <td>{item.tanggal_selesai}</td>
                                            <td>
                                                <span className={getStatusBadge(item.persetujuan)}>
                                                    {item.persetujuan}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;
