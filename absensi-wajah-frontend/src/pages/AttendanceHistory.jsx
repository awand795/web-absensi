import { useEffect, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiDownload, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AttendanceHistory = () => {
    const [records, setRecords] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [userId] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id;
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/report/user/${userId}`, { params: { month, year } });
                const data = res.data.reports || res.data.data || [];
                setRecords(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchData();
    }, [month, year, userId]);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'hadir' || s === 'present') return 'badge badge-approved';
        if (s === 'sakit' || s === 'sick') return 'badge badge-pending';
        if (s === 'izin' || s === 'leave') return 'badge badge-pending';
        if (s === 'alfa' || s === 'absent') return 'badge badge-rejected';
        return 'badge';
    };

    const handleDownload = async (url, filename) => {
        try {
            const res = await api.get(url, { responseType: 'blob' });
            const blob = new Blob([res.data]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const presentCount = records.filter(r => {
        const s = (r.status || '').toLowerCase();
        return s === 'hadir' || s === 'present' || (r.clock_in && r.clock_in !== '-');
    }).length;

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiCalendar className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Riwayat</h1>
                    <p className="text-sm text-slate-400">Riwayat kehadiran Anda</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="stat-card">
                    <h3>{records.length}</h3>
                    <p>Total Hari</p>
                </div>
                <div className="stat-card">
                    <h3>{presentCount}</h3>
                    <p>Hadir</p>
                </div>
                <div className="stat-card">
                    <h3>{records.length - presentCount}</h3>
                    <p>Tidak Hadir</p>
                </div>
            </div>

            {/* Month/Year Picker */}
            <div className="glass-card p-4 mb-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevMonth}
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}>
                        <FiChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>{monthNames[month - 1]}</span>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="input-field w-auto"
                        >
                            {[2024, 2025, 2026, 2027, 2028].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/calendar"
                            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}>
                            <FiGrid size={18} />
                        </Link>
                        <button onClick={() => handleDownload(`/export/csv?month=${month}&year=${year}`, `laporan-${month}-${year}.csv`)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{ color: '#7d9b76', background: 'rgba(125,155,118,0.08)' }}
                            onMouseOver={e => e.target.style.background = 'rgba(125,155,118,0.15)'}
                            onMouseOut={e => e.target.style.background = 'rgba(125,155,118,0.08)'}>
                            <FiDownload size={14} />
                            Export CSV
                        </button>
                        <button
                            onClick={nextMonth}
                            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseOver={e => { e.target.style.background = 'var(--bg-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; }}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="loading-spinner w-6 h-6" />
                                            <span className="text-sm text-slate-500">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiCalendar className="text-slate-500" size={24} />
                                            <span className="text-sm text-slate-500">Tidak ada data absensi</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.map((r, i) => (
                                <tr key={i}>
                                    <td className="font-medium text-slate-200">{r.date || r.tanggal}</td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5">
                                            <FiClock size={14} className="text-slate-500" />
                                            {r.clock_in || r.jam_masuk || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5">
                                            <FiClock size={14} className="text-slate-500" />
                                            {r.clock_out || r.jam_keluar || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={getStatusBadge(r.status)}>
                                            {r.status || '-'}
                                        </span>
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

export default AttendanceHistory;
