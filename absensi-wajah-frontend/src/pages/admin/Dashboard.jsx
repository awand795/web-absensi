import { useEffect, useState } from "react";
import { FiUsers, FiCheckCircle, FiCalendar, FiBarChart2, FiLoader, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import api from '../../api/axios';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, chartsRes] = await Promise.all([
                    api.get('/report/dashboard'),
                    api.get('/report/charts'),
                ]);
                setData(dashRes.data.data || dashRes.data || {});
                setCharts(chartsRes.data || {});
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

    const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

    const monthlyData = (charts?.monthly_attendance || []).map(d => ({
        name: monthNames[d.month - 1] || `Bln ${d.month}`,
        'Tepat Waktu': parseInt(d.tepat_waktu) || 0,
        'Terlambat': parseInt(d.terlambat) || 0,
    }));

    const pieData = (charts?.today_status || []).map(d => ({
        name: d.status || 'Unknown',
        value: parseInt(d.total) || 0,
    }));

    const PIE_COLORS = ['#7d9b76', '#d4a853', '#c94a4a', '#7091a8'];

    const topEmployees = charts?.top_employees || [];

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
                <div className="icon-wrap"><FiBarChart2 size={20} /></div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Admin Dashboard</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ringkasan & analitik absensi</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

            {/* Bento Grid Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Attendance Bar Chart */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiTrendingUp size={18} style={{ color: '#d45a4a' }} />
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Kehadiran Bulanan</h2>
                    </div>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthlyData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                                <XAxis dataKey="name" fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
                                <YAxis fontSize={11} tick={{ fill: 'var(--text-muted)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
                                <Bar dataKey="Tepat Waktu" fill="#7d9b76" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Terlambat" fill="#d4a853" radius={[4, 4, 0, 0]} />
                                <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[280px] text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada data</div>
                    )}
                </div>

                {/* Today's Status Pie Chart */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiPieChart size={18} style={{ color: '#d45a4a' }} />
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Status Hari Ini</h2>
                    </div>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[280px] text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada absensi hari ini</div>
                    )}
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Employees */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiUsers size={18} style={{ color: '#7d9b76' }} />
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Karyawan Teraktif Bulan Ini</h2>
                    </div>
                    {topEmployees.length > 0 ? (
                        <div className="space-y-3">
                            {topEmployees.map((emp, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ background: i === 0 ? 'var(--gradient-primary)' : 'var(--bg-hover)', color: i === 0 ? 'white' : 'var(--text-secondary)' }}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold" style={{ color: '#7d9b76' }}>{emp.total} hari</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada data</div>
                    )}
                </div>

                {/* Shift Distribution */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiCalendar size={18} style={{ color: '#d4a853' }} />
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Distribusi Shift</h2>
                    </div>
                    {(charts?.shift_distribution || []).length > 0 ? (
                        <div className="space-y-3">
                            {(charts?.shift_distribution || []).map((shift, i) => {
                                const total = (charts?.shift_distribution || []).reduce((sum, s) => sum + (s.total || 0), 0);
                                const pct = total > 0 ? ((shift.total || 0) / total * 100).toFixed(0) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span style={{ color: 'var(--text-primary)' }}>{shift.name}</span>
                                            <span className="font-medium" style={{ color: '#d4a853' }}>{shift.total}</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-hover)' }}>
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'var(--gradient-accent)' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada data</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
