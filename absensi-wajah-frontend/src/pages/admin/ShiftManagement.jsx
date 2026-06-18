import { useEffect, useState } from "react";
import { FiSettings, FiPlus, FiEdit2, FiTrash2, FiClock, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [form, setForm] = useState({ name: '', start_time: '', end_time: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchShifts = async () => {
        try {
            const res = await api.get('/shifts');
            setShifts(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchShifts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/admin/shifts/${editing}`, form);
            } else {
                await api.post('/admin/shifts', form);
            }
            setForm({ name: '', start_time: '', end_time: '' });
            setEditing(null);
            fetchShifts();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleEdit = (s) => {
        setEditing(s.id);
        setForm({ name: s.name, start_time: s.start_time, end_time: s.end_time });
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus shift ini?')) return;
        try {
            await api.delete(`/admin/shifts/${id}`);
            fetchShifts();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiSettings className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Manajemen Shift</h1>
                    <p className="text-sm text-slate-400">Atur jadwal shift kerja</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div>
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-5">
                            {editing ? 'Edit Shift' : 'Tambah Shift'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Nama Shift</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="Contoh: Shift Pagi"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="input-label">Jam Mulai</label>
                                    <input
                                        type="time"
                                        value={form.start_time}
                                        onChange={e => setForm({ ...form, start_time: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Jam Selesai</label>
                                    <input
                                        type="time"
                                        value={form.end_time}
                                        onChange={e => setForm({ ...form, end_time: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary">
                                    <FiPlus size={16} />
                                    {editing ? 'Update Shift' : 'Tambah Shift'}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => { setEditing(null); setForm({ name: '', start_time: '', end_time: '' }); }}
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <div>
                    <div className="glass-card overflow-hidden">
                        <div className="p-5 border-b border-slate-700/30">
                            <h2 className="text-lg font-semibold text-white">Daftar Shift</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-modern">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Jam Mulai</th>
                                        <th>Jam Selesai</th>
                                        <th>Aksi</th>
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
                                    ) : shifts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FiClock className="text-slate-500" size={24} />
                                                    <span className="text-sm text-slate-500">Belum ada shift</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : shifts.map(s => (
                                        <tr key={s.id}>
                                            <td className="font-medium text-slate-200">{s.name}</td>
                                            <td>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FiClock size={14} className="text-slate-500" />
                                                    {s.start_time}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FiClock size={14} className="text-slate-500" />
                                                    {s.end_time}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn-primary !py-1.5 !px-3 text-xs"
                                                        onClick={() => handleEdit(s)}
                                                    >
                                                        <FiEdit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-danger !py-1.5 !px-3 text-xs"
                                                        onClick={() => handleDelete(s.id)}
                                                    >
                                                        <FiTrash2 size={14} />
                                                        Hapus
                                                    </button>
                                                </div>
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

export default ShiftManagement;
