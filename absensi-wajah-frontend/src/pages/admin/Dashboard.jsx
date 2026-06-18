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
        { label: 'Total Karyawan', value: data.total_karyawan ?? '-', icon: <FiUsers size={24} />, gradient: 'from-indigo-500 to-violet-600' },
        { label: 'Hadir Hari Ini', value: data.hadir_hari_ini ?? '-', icon: <FiCheckCircle size={24} />, gradient: 'from-emerald-500 to-teal-600' },
        { label: 'Izin Hari Ini', value: data.izin_hari_ini ?? '-', icon: <FiCalendar size={24} />, gradient: 'from-amber-500 to-orange-600' },
    ];

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <FiLoader className="animate-spin text-indigo-400" size={32} />
                        <p className="text-slate-400 text-sm">Memuat dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <FiBarChart2 className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-sm text-slate-400">Ringkasan data absensi</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <div className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-bl-full`} />
                        </div>
                        <div className="relative z-10">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
