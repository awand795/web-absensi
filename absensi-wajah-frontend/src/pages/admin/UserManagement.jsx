import { useEffect, useState } from "react";
import { FiUsers, FiEdit2, FiTrash2, FiSave, FiX, FiLoader, FiUserPlus, FiCheck } from 'react-icons/fi';
import api from '../../api/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'karyawan' });
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try { const res = await api.get('/admin/users'); setUsers(res.data || []); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleEdit = (user) => { setEditing(user.id); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); };
    const handleSave = async (id) => {
        try { await api.put(`/admin/users/${id}`, form); setEditing(null); fetchUsers(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };
    const handleDelete = async (id) => {
        if (!confirm('Yakin hapus user ini?')) return;
        try { await api.delete(`/admin/users/${id}`); fetchUsers(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };
    const handleAdd = async (e) => {
        e.preventDefault();
        try { await api.post('/admin/users', addForm); setAddForm({ name: '', email: '', password: '', role: 'karyawan' }); setShowAdd(false); fetchUsers(); }
        catch (err) { alert('Gagal: ' + (err.response?.data?.message || err.message)); }
    };
    const getStatusBadge = (s) => s === 'active' ? 'badge badge-active' : 'badge badge-inactive';

    return (
        <div className="page-container">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="icon-wrap"><FiUsers size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Manajemen User</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Kelola pengguna sistem</p>
                    </div>
                </div>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-primary"><FiUserPlus size={16} />{showAdd ? 'Tutup' : 'Tambah User'}</button>
            </div>

            {showAdd && (
                <div className="glass-card p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-heading)' }}>Tambah User Baru</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="input-label">Nama</label><input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} required className="input-field" placeholder="Nama lengkap" /></div>
                            <div><label className="input-label">Email</label><input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} required className="input-field" placeholder="user@example.com" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="input-label">Password</label><input type="password" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} minLength={6} required className="input-field" placeholder="Minimal 6 karakter" /></div>
                            <div><label className="input-label">Role</label><select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} className="input-field"><option value="karyawan">Karyawan</option><option value="admin">Admin</option></select></div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn-success"><FiCheck size={16} />Simpan</button>
                            <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary"><FiX size={16} />Batal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {loading ? (<tr><td colSpan={5} className="text-center py-12"><div className="flex flex-col items-center gap-2"><div className="loading-spinner w-6 h-6" /><span className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat data...</span></div></td></tr>)
                            : users.map(u => (
                                <tr key={u.id}>
                                    {editing === u.id ? (
                                        <>
                                            <td><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field text-sm" /></td>
                                            <td><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" /></td>
                                            <td><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field text-sm"><option value="karyawan">Karyawan</option><option value="admin">Admin</option></select></td>
                                            <td><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field text-sm"><option value="active">Active</option><option value="inactive">Inactive</option></select></td>
                                            <td><div className="flex gap-2">
                                                <button className="btn-success !py-1.5 !px-3 text-xs" onClick={() => handleSave(u.id)}><FiSave size={14} />Simpan</button>
                                                <button className="btn-secondary !py-1.5 !px-3 text-xs" onClick={() => setEditing(null)}><FiX size={14} />Batal</button>
                                            </div></td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                            <td><span className={`badge ${u.role === 'admin' ? 'badge-approved' : 'badge-pending'}`}>{u.role}</span></td>
                                            <td><span className={getStatusBadge(u.status)}>{u.status}</span></td>
                                            <td><div className="flex gap-2">
                                                <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => handleEdit(u)}><FiEdit2 size={14} />Edit</button>
                                                <button className="btn-danger !py-1.5 !px-3 text-xs" onClick={() => handleDelete(u.id)}><FiTrash2 size={14} />Hapus</button>
                                            </div></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
