import { useEffect, useState } from "react";
import api from '../../api/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'karyawan' });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleEdit = (user) => {
        setEditing(user.id);
        setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    };

    const handleSave = async (id) => {
        try {
            await api.put(`/admin/users/${id}`, form);
            setEditing(null);
            fetchUsers();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus user ini?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', addForm);
            setAddForm({ name: '', email: '', password: '', role: 'karyawan' });
            setShowAdd(false);
            fetchUsers();
        } catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };

    return (
        <div className="page-container">
            <h1>Manajemen User</h1>

            <div style={{ marginBottom: '1em' }}>
                <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
                    {showAdd ? 'Tutup Form' : '+ Tambah User'}
                </button>
            </div>

            {showAdd && (
                <div className="card mb-2">
                    <h2>Tambah User Baru</h2>
                    <form onSubmit={handleAdd}>
                        <div className="flex gap-1">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Nama</label>
                                <input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Email</label>
                                <input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} required />
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Password</label>
                                <input type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} minLength={6} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Role</label>
                                <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
                                    <option value="karyawan">Karyawan</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-success">Simpan</button>
                    </form>
                </div>
            )}

            <table>
                <thead>
                    <tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            {editing === u.id ? (
                                <>
                                    <td><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></td>
                                    <td><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></td>
                                    <td>
                                        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                            <option value="karyawan">Karyawan</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn-success" onClick={() => handleSave(u.id)}>Simpan</button>
                                            <button className="btn-secondary" onClick={() => setEditing(null)}>Batal</button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.status}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button className="btn-primary" onClick={() => handleEdit(u)}>Edit</button>
                                            <button className="btn-danger" onClick={() => handleDelete(u.id)}>Hapus</button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
