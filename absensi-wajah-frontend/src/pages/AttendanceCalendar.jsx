import { useEffect, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiLoader, FiClock, FiMapPin, FiInfo } from 'react-icons/fi';
import api from '../api/axios';

const AttendanceCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [userId] = useState(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.id;
    });

    const year = date.getFullYear();
    const month = date.getMonth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/report/user/${userId}`, { params: { month: month + 1, year } });
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

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

    const getAttendanceForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return records.find(r => r.date === dateStr);
    };

    const getDayStatus = (day) => {
        const att = getAttendanceForDay(day);
        if (!att) return 'empty';
        const s = (att.status || '').toLowerCase();
        if (s === 'hadir' || s === 'present' || s === 'tepat waktu') return 'hadir';
        if (s === 'terlambat') return 'terlambat';
        if (s === 'sakit') return 'sakit';
        if (s === 'izin') return 'izin';
        if (s === 'alfa' || s === 'absent') return 'alfa';
        if (att.clock_in) return 'hadir';
        return 'empty';
    };

    const statusColors = {
        hadir: { bg: 'rgba(125,155,118,0.12)', text: '#7d9b76', dot: '#7d9b76', label: 'Hadir' },
        terlambat: { bg: 'rgba(212,168,83,0.12)', text: '#d4a853', dot: '#d4a853', label: 'Terlambat' },
        sakit: { bg: 'rgba(112,145,168,0.12)', text: '#7091a8', dot: '#7091a8', label: 'Sakit' },
        izin: { bg: 'rgba(112,145,168,0.12)', text: '#7091a8', dot: '#7091a8', label: 'Izin' },
        alfa: { bg: 'rgba(201,74,74,0.12)', text: '#c94a4a', dot: '#c94a4a', label: 'Alfa' },
        empty: { bg: 'transparent', text: 'var(--text-muted)', dot: 'transparent', label: '' },
    };

    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));

    const selectedData = selectedDay ? getAttendanceForDay(selectedDay) : null;

    // Stats
    const totalHadir = records.filter(r => {
        const s = (r.status || '').toLowerCase();
        return s === 'hadir' || s === 'present' || s === 'tepat waktu' || (r.clock_in && !['alfa','absent'].includes(s));
    }).length;
    const totalTerlambat = records.filter(r => (r.status || '').toLowerCase() === 'terlambat').length;
    const totalAlpha = daysInMonth - records.length;

    return (
        <div className="page-container max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="icon-wrap">
                    <FiCalendar size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Kalender Absensi</h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Lihat kehadiran dalam tampilan kalender</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold" style={{ color: '#7d9b76' }}>{totalHadir}</div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Hadir</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold" style={{ color: '#d4a853' }}>{totalTerlambat}</div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Terlambat</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold" style={{ color: '#c94a4a' }}>{totalAlpha}</div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Tidak Hadir</p>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="glass-card p-5 mb-6">
                {/* Month Header */}
                <div className="flex items-center justify-between mb-5">
                    <button onClick={prevMonth}
                        className="flex items-center justify-center w-9 h-9 rounded-xl hover-icon"
                        style={{ color: 'var(--text-muted)' }}>
                        <FiChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                        {monthNames[month]} {year}
                    </h2>
                    <button onClick={nextMonth}
                        className="flex items-center justify-center w-9 h-9 rounded-xl hover-icon"
                        style={{ color: 'var(--text-muted)' }}>
                        <FiChevronRight size={20} />
                    </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                        <div key={d} className="text-center text-xs font-medium py-2" style={{ color: 'var(--text-muted)' }}>{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells before first day */}
                    {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const status = getDayStatus(day);
                        const colors = statusColors[status] || statusColors.empty;
                        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                        const isSelected = selectedDay === day;
                        const isHovered = hoveredDay === day;

                        return (
                            <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                className="relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all duration-200"
                                style={{
                                    background: isSelected || isHovered ? 'var(--bg-hover)' : colors.bg,
                                    color: colors.text,
                                    border: isToday ? `2px solid #d45a4a` : '2px solid transparent',
                                }}>
                                <span>{day}</span>
                                {status !== 'empty' && (
                                    <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: colors.dot }} />
                                )}
                                {isToday && (
                                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ background: '#d45a4a' }}>
                                        <span className="text-[6px] text-white font-bold">•</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    {Object.entries(statusColors).filter(([k]) => k !== 'empty').map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1.5 text-xs" style={{ color: v.text }}>
                            <div className="w-2 h-2 rounded-full" style={{ background: v.dot }} />
                            {v.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay && (
                <div className="glass-card p-5 transition-all duration-200">
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
                        Detail - {selectedDay} {monthNames[month]} {year}
                    </h3>
                    {selectedData ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <FiClock size={14} style={{ color: 'var(--text-muted)' }} />
                                <span style={{ color: 'var(--text-muted)' }}>Clock In:</span>
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {selectedData.clock_in ? new Date(selectedData.clock_in).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <FiClock size={14} style={{ color: 'var(--text-muted)' }} />
                                <span style={{ color: 'var(--text-muted)' }}>Clock Out:</span>
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {selectedData.clock_out ? new Date(selectedData.clock_out).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <FiInfo size={14} style={{ color: 'var(--text-muted)' }} />
                                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium`}
                                    style={{ background: (statusColors[getDayStatus(selectedDay)] || statusColors.empty).bg, color: (statusColors[getDayStatus(selectedDay)] || statusColors.empty).text }}>
                                    {selectedData.status || 'Hadir'}
                                </span>
                            </div>
                            {selectedData.overtime_minutes > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <FiClock size={14} style={{ color: 'var(--text-muted)' }} />
                                    <span style={{ color: 'var(--text-muted)' }}>Lembur:</span>
                                    <span className="font-medium" style={{ color: '#d4a853' }}>
                                        {Math.floor(selectedData.overtime_minutes / 60)}j {selectedData.overtime_minutes % 60}m
                                    </span>
                                </div>
                            )}
                            {selectedData.latitude && selectedData.longitude && (
                                <div className="flex items-center gap-2 text-sm">
                                    <FiMapPin size={14} style={{ color: 'var(--text-muted)' }} />
                                    <span style={{ color: 'var(--text-muted)' }}>Lokasi:</span>
                                    <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                                        {parseFloat(selectedData.latitude).toFixed(4)}, {parseFloat(selectedData.longitude).toFixed(4)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm py-3" style={{ color: 'var(--text-muted)' }}>
                            <span className="inline-flex items-center gap-2">
                                <FiCalendar size={14} />
                                Tidak ada data absensi untuk hari ini
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceCalendar;
