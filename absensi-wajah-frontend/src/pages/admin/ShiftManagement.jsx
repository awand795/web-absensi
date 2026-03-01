import { useEffect, useState } from "react";
import api from '../../api/axios';

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [form, setForm] = useState({ name: '', start_time: '', end_time: '' });
    const [editing, setEditing] = useState(null);

    const fetchShifts = async () => {
        try {
            const res = await api.get('/shifts');
            setShifts(res.data || []);
        } catch (err) { console.error(err); }
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
            <h1>Manajemen Shift</h1>
            <div className="card mb-2">
                <h2>{editing ? 'Edit Shift' : 'Tambah Shift'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Shift</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="flex gap-1">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Jam Mulai</label>
                            <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Jam Selesai</label>
                            <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button type="submit" className="btn-primary">{editing ? 'Update' : 'Tambah'}</button>
                        {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm({ name: '', start_time: '', end_time: '' }); }}>Batal</button>}
                    </div>
                </form>
            </div>

            <table>
                <thead>
                    <tr><th>Nama</th><th>Jam Mulai</th><th>Jam Selesai</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    {shifts.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.start_time}</td>
                            <td>{s.end_time}</td>
                            <td>
                                <div className="flex gap-1">
                                    <button className="btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                                    <button className="btn-danger" onClick={() => handleDelete(s.id)}>Hapus</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShiftManagement;
