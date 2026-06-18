import { useEffect, useState } from "react";
import { FiUserCheck, FiCheck, FiX, FiLoader, FiCalendar } from 'react-icons/fi';
import api from '../../api/axios';

const LeaveApproval = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
        try {
            const res = await api.get('/izin');
            setList(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchList(); }, []);

    const handleAction = async (id, action) => {
        try {
            await api.put(`/admin/izin/${id}/${action}`);
            fetchList();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const getStatusBadge = (s) => {
        if (s === 'Disetujui') return 'badge badge-approved';
        if (s === 'Ditolak') return 'badge badge-rejected';
        return 'badge badge-pending';
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiUserCheck className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Approval Izin</h1>
                    <p className="text-sm text-slate-400">Kelola pengajuan izin karyawan</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>ID Karyawan</th>
                                <th>Jenis</th>
                                <th>Mulai</th>
                                <th>Selesai</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="loading-spinner w-6 h-6" />
                                            <span className="text-sm text-slate-500">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : list.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiCalendar className="text-slate-500" size={24} />
                                            <span className="text-sm text-slate-500">Tidak ada data izin</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : list.map((item, i) => (
                                <tr key={i}>
                                    <td className="font-medium text-slate-200">{item.id_karyawan}</td>
                                    <td>{item.jenis_izin}</td>
                                    <td>{item.tanggal_mulai}</td>
                                    <td>{item.tanggal_selesai}</td>
                                    <td>
                                        <span className={getStatusBadge(item.persetujuan)}>
                                            {item.persetujuan}
                                        </span>
                                    </td>
                                    <td>
                                        {item.persetujuan === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    className="btn-success !py-1.5 !px-3 text-xs"
                                                    onClick={() => handleAction(item.id, 'approve')}
                                                >
                                                    <FiCheck size={14} />
                                                    Setujui
                                                </button>
                                                <button
                                                    className="btn-danger !py-1.5 !px-3 text-xs"
                                                    onClick={() => handleAction(item.id, 'reject')}
                                                >
                                                    <FiX size={14} />
                                                    Tolak
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-500">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveApproval;
