import { useEffect, useState } from "react";
import { FiCalendar, FiSearch, FiLoader, FiBarChart2, FiClock, FiDownload, FiFileText } from 'react-icons/fi';
import api from '../../api/axios';
import downloadFile from '../../api/download';

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

    const monthFromDate = new Date(startDate).getMonth() + 1;
    const yearFromDate = new Date(startDate).getFullYear();

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap">
                    <FiBarChart2 size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Laporan</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Laporan absensi global</p>
                </div>
            </div>

            {/* Filter */}
            <div className="glass-card p-4 mb-6">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label className="input-label">Tanggal Mulai</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
                    </div>
                    <div className="text-sm pb-2" style={{ color: 'var(--text-muted)' }}>s/d</div>
                    <div>
                        <label className="input-label">Tanggal Selesai</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
                    </div>
                    <button className="btn-primary" onClick={() => fetchReport()}>
                        <FiSearch size={16} />
                        Cari
                    </button>
                    <div className="flex gap-2 ml-auto">
                        <button onClick={() => downloadFile(`/export/csv?month=${monthFromDate}&year=${yearFromDate}`, `laporan-${monthFromDate}-${yearFromDate}.csv`)}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{ color: '#7d9b76', background: 'rgba(125,155,118,0.08)' }}
                            onMouseOver={e => e.target.style.background = 'rgba(125,155,118,0.15)'}
                            onMouseOut={e => e.target.style.background = 'rgba(125,155,118,0.08)'}>
                            <FiFileText size={14} />
                            Export CSV
                        </button>
                        <button onClick={() => downloadFile(`/export/excel?month=${monthFromDate}&year=${yearFromDate}`, `laporan-${monthFromDate}-${yearFromDate}.xlsx`)}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                            style={{ color: '#d45a4a', background: 'rgba(212,90,74,0.08)' }}
                            onMouseOver={e => e.target.style.background = 'rgba(212,90,74,0.15)'}
                            onMouseOut={e => e.target.style.background = 'rgba(212,90,74,0.08)'}>
                            <FiDownload size={14} />
                            Export Excel
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
                                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiCalendar size={24} style={{ color: 'var(--text-muted)' }} />
                                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Tidak ada data absensi</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.map((r, i) => (
                                <tr key={i}>
                                    <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.name || r.user?.name || '-'}</td>
                                    <td>{r.date || r.tanggal}</td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5">
                                            <FiClock size={14} style={{ color: 'var(--text-muted)' }} />
                                            {r.clock_in || r.jam_masuk || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5">
                                            <FiClock size={14} style={{ color: 'var(--text-muted)' }} />
                                            {r.clock_out || r.jam_keluar || '-'}
                                        </span>
                                    </td>
                                    <td><span className="badge">{r.status || '-'}</span></td>
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
