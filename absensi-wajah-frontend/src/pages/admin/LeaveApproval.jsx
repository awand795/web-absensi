import { useEffect, useState } from "react";
import api from '../../api/axios';

const LeaveApproval = () => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const res = await api.get('/izin');
            setList(res.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchList(); }, []);

    const handleAction = async (id, action) => {
        try {
            await api.put(`/admin/izin/${id}/${action}`);
            fetchList();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const badgeClass = (s) => {
        if (s === 'Disetujui') return 'badge badge-approved';
        if (s === 'Ditolak') return 'badge badge-rejected';
        return 'badge badge-pending';
    };

    return (
        <div className="page-container">
            <h1>Approval Izin</h1>
            <table>
                <thead>
                    <tr><th>ID Karyawan</th><th>Jenis</th><th>Mulai</th><th>Selesai</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af' }}>Tidak ada data</td></tr>
                    ) : list.map((item, i) => (
                        <tr key={i}>
                            <td>{item.id_karyawan}</td>
                            <td>{item.jenis_izin}</td>
                            <td>{item.tanggal_mulai}</td>
                            <td>{item.tanggal_selesai}</td>
                            <td><span className={badgeClass(item.persetujuan)}>{item.persetujuan}</span></td>
                            <td>
                                {item.persetujuan === 'Pending' && (
                                    <div className="flex gap-1">
                                        <button className="btn-success" onClick={() => handleAction(item.id, 'approve')}>Setujui</button>
                                        <button className="btn-danger" onClick={() => handleAction(item.id, 'reject')}>Tolak</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveApproval;
