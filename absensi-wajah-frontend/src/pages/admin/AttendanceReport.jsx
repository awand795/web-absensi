import { useEffect, useState } from "react";
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

    const fetchReport = async (sd, ed) => {
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
    };

    useEffect(() => { fetchReport(defaults.start, defaults.end); }, []);

    return (
        <div className="page-container">
            <h1>Laporan Absensi Global</h1>
            <div className="flex gap-1 mb-2 items-center">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: 'auto' }} />
                <span>s/d</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: 'auto' }} />
                <button className="btn-primary" onClick={fetchReport}>Cari</button>
            </div>
            <table>
                <thead>
                    <tr><th>Nama</th><th>Tanggal</th><th>Clock In</th><th>Clock Out</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>Tidak ada data</td></tr>
                    ) : records.map((r, i) => (
                        <tr key={i}>
                            <td>{r.name || r.user?.name || '-'}</td>
                            <td>{r.date || r.tanggal}</td>
                            <td>{r.clock_in || r.jam_masuk || '-'}</td>
                            <td>{r.clock_out || r.jam_keluar || '-'}</td>
                            <td>{r.status || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceReport;
