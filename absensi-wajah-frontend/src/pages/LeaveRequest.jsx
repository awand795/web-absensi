import { useEffect, useState } from "react";
import api from '../api/axios';

const LeaveRequest = () => {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ jenis_izin: 'Sakit', tanggal_mulai: '', tanggal_selesai: '' });
    const [msg, setMsg] = useState('');

    const fetchList = async () => {
        try {
            const res = await api.get('/izin/me');
            setList(res.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchList(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/izin', form);
            setMsg('Izin berhasil diajukan');
            setForm({ jenis_izin: 'Sakit', tanggal_mulai: '', tanggal_selesai: '' });
            fetchList();
        } catch (err) {
            setMsg('Gagal: ' + (err.response?.data?.message || err.message));
        }
    };

    const badgeClass = (s) => {
        if (s === 'Disetujui') return 'badge badge-approved';
        if (s === 'Ditolak') return 'badge badge-rejected';
        return 'badge badge-pending';
    };

    return (
        <div className="page-container">
            <h1>Pengajuan Izin</h1>
            <div className="card mb-2">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Jenis Izin</label>
                        <select value={form.jenis_izin} onChange={e => setForm({ ...form, jenis_izin: e.target.value })}>
                            <option>Sakit</option>
                            <option>Cuti</option>
                            <option>Izin</option>
                        </select>
                    </div>
                    <div className="flex gap-1">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Tanggal Mulai</label>
                            <input type="date" value={form.tanggal_mulai} onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Tanggal Selesai</label>
                            <input type="date" value={form.tanggal_selesai} onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Ajukan Izin</button>
                    {msg && <p className="mt-1">{msg}</p>}
                </form>
            </div>

            <h2>Riwayat Izin</h2>
            <table>
                <thead>
                    <tr><th>Jenis</th><th>Mulai</th><th>Selesai</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af' }}>Belum ada pengajuan</td></tr>
                    ) : list.map((item, i) => (
                        <tr key={i}>
                            <td>{item.jenis_izin}</td>
                            <td>{item.tanggal_mulai}</td>
                            <td>{item.tanggal_selesai}</td>
                            <td><span className={badgeClass(item.persetujuan)}>{item.persetujuan}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveRequest;
