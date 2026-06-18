import { useEffect, useState } from "react";
import { FiUsers, FiCheckCircle, FiCalendar, FiBarChart2, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/report/dashboard');
                setData(res.data.data || res.data || {});
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const stats = [
        { label: 'Total Karyawan', value: data.total_karyawan ?? '-', icon: <FiUsers size={24} />, color: '#d45a4a' },
        { label: 'Hadir Hari Ini', value: data.hadir_hari_ini ?? '-', icon: <FiCheckCircle size={24} />, color: '#7d9b76' },
        { label: 'Izin Hari Ini', value: data.izin_hari_ini ?? '-', icon: <FiCalendar size={24} />, color: '#d4a853' },
    ];

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="loading-spinner w-8 h-8" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap">
                    <FiBarChart2 size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Admin Dashboard</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ringkasan data absensi</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <div className="w-full h-full rounded-bl-full" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}88)` }} />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}cc)`, boxShadow: `0 4px 12px ${stat.color}33` }}>
                                <span className="text-white">{stat.icon}</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>{stat.value}</h3>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
