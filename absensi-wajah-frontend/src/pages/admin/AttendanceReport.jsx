import { useEffect, useState } from "react";
import { FiCalendar, FiSearch, FiLoader, FiBarChart2, FiClock } from 'react-icons/fi';
import api from '../../api/axios';

const getDefaultDates = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return { start: `${y}-${m}-01`, end: now.toISOString().split('T')[0] };
};

const AttendanceReport = () => {
    const defaults = getDefaultDates();
    const [records, setRecords] = useState([]);
    const [startDate, setStartDate] = useState(defaults.start);
    const [endDate, setEndDate] = useState(defaults.end);
    const [loading, setLoading] = useState(true);

    const fetchReport = async (sd, ed) => {
        setLoading(true);
        const s = sd || startDate;
        const e = ed || endDate;
        if (!s || !e) return;
        try {
            const res = await api.get('/report/global', { params: { start_date: s, end_date: e } });
            const users = res.data.reports || [];
            const flat = [];
            for (const user of users) {
                for (const log of (user.log_absensi || [])) {
                    flat.push({ name: user.name, ...log });
                }
            }
            setRecords(flat);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchReport(defaults.start, defaults.end); }, []);

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiBarChart2 className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Laporan</h1>
                    <p className="text-sm text-slate-400">Laporan absensi global</p>
                </div>
            </div>

            {/* Filter */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="input-label">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="text-sm text-slate-400 pb-2">s/d</div>
                    <div>
                        <label className="input-label">Tanggal Selesai</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => fetchReport()}
                    >
                        <FiSearch size={16} />
                        Cari
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Tanggal</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="loading-spinner w-6 h-6" />
                                            <span className="text-sm text-slate-500">Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiCalendar className="text-slate-500" size={24} />
                                            <span className="text-sm text-slate-500">Tidak ada data absensi</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.map((r, i) => (
                                <tr key={i}>
                                    <td className="font-medium text-slate-200">{r.name || r.user?.name || '-'}</td>
                                    <td>{r.date || r.tanggal}</td>
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
                                        <span className="badge">{r.status || '-'}</span>
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

export default AttendanceReport;
