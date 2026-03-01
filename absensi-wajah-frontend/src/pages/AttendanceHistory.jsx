import { useEffect, useState } from "react";
import api from '../api/axios';

const AttendanceHistory = () => {
    const [records, setRecords] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [userId] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/report/user/${userId}`, { params: { month, year } });
                const data = res.data.reports || res.data.data || [];
                setRecords(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };
        if (userId) fetchData();
    }, [month, year, userId]);

    return (
        <div className="page-container">
            <h1>Riwayat Absensi</h1>
            <div className="flex gap-1 mb-2 items-center">
                <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: 'auto' }}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('id', { month: 'long' })}</option>
                    ))}
                </select>
                <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 'auto' }}>
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            <table>
                <thead>
                    <tr><th>Tanggal</th><th>Clock In</th><th>Clock Out</th><th>Status</th></tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af' }}>Tidak ada data</td></tr>
                    ) : records.map((r, i) => (
                        <tr key={i}>
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

export default AttendanceHistory;
