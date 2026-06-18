import { useEffect, useState } from "react";
import { FiBell, FiBellOff, FiCalendar, FiInfo, FiAlertCircle, FiCheckCircle, FiCheck, FiVolume2, FiLoader, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('notifications');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifRes, annRes] = await Promise.all([
                    api.get('/notifications'),
                    api.get('/announcements'),
                ]);
                setNotifications(notifRes.data.data || []);
                setUnreadCount(notifRes.data.unread_count || 0);
                setAnnouncements(annRes.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    };

    const getNotifIcon = (type) => {
        const icons = {
            info: <FiInfo size={16} />,
            success: <FiCheckCircle size={16} />,
            warning: <FiAlertCircle size={16} />,
            error: <FiAlertCircle size={16} />,
        };
        const colors = {
            info: '#7091a8', success: '#7d9b76', warning: '#d4a853', error: '#c94a4a',
        };
        const bgColors = {
            info: 'rgba(112,145,168,0.08)', success: 'rgba(125,155,118,0.08)', warning: 'rgba(212,168,83,0.08)', error: 'rgba(201,74,74,0.08)',
        };
        return { icon: icons[type] || icons.info, color: colors[type], bg: bgColors[type] };
    };

    const getPriorityBadge = (priority) => {
        const styles = {
            low: { bg: 'rgba(112,145,168,0.08)', color: '#7091a8', label: 'Biasa' },
            normal: { bg: 'rgba(125,155,118,0.08)', color: '#7d9b76', label: 'Normal' },
            high: { bg: 'rgba(212,168,83,0.08)', color: '#d4a853', label: 'Penting' },
            urgent: { bg: 'rgba(201,74,74,0.08)', color: '#c94a4a', label: 'Urgent' },
        };
        const s = styles[priority] || styles.normal;
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ background: s.bg, color: s.color }}>
                {s.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="loading-spinner w-8 h-8" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Memuat notifikasi...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                        <FiBell className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Notifikasi</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{ color: '#d45a4a', background: 'rgba(212,90,74,0.08)' }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover-primary-soft"
                        style={{ color: '#d45a4a', background: 'rgba(212,90,74,0.08)' }}>
                        <FiCheck size={14} />
                        Semua Dibaca
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-subtle)' }}>
                <button onClick={() => setTab('notifications')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200`}
                    style={tab === 'notifications' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' } : { color: 'var(--text-muted)' }}>
                    <FiBell size={16} />
                    Notifikasi
                    {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                            style={{ background: '#d45a4a' }}>{unreadCount}</span>
                    )}
                </button>
                <button onClick={() => setTab('announcements')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200`}
                    style={tab === 'announcements' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' } : { color: 'var(--text-muted)' }}>
                    <FiVolume2 size={16} />
                    Pengumuman
                    {announcements.length > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                            style={{ background: '#7091a8' }}>{announcements.length}</span>
                    )}
                </button>
            </div>

            {/* Content */}
            {tab === 'notifications' ? (
                notifications.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FiBellOff size={32} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada notifikasi</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((n) => {
                            const iconData = getNotifIcon(n.type);
                            return (
                                <div key={n.id}
                                    onClick={() => !n.is_read && markRead(n.id)}
                                    className="glass-card p-4 cursor-pointer transition-all duration-200"
                                    style={{ opacity: n.is_read ? 0.7 : 1, borderLeft: n.is_read ? 'none' : `3px solid #d45a4a` }}
                                    className="glass-card p-4 cursor-pointer transition-all duration-200 hover-lift"
                                    style={{ opacity: n.is_read ? 0.7 : 1, borderLeft: n.is_read ? 'none' : `3px solid #d45a4a` }}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: iconData.bg, color: iconData.color }}>
                                            {iconData.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                                            {n.message && (
                                                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{n.message}</p>
                                            )}
                                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                                {n.created_at ? new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                        {n.link && (
                                            <Link to={n.link}
                                                className="shrink-0 p-1.5 rounded-lg transition-all duration-200"
                                                style={{ color: 'var(--text-muted)' }}
                                                className="shrink-0 p-1.5 rounded-lg transition-all duration-200 hover-primary-soft"
                                                style={{ color: 'var(--text-muted)' }}>
                                                <FiArrowRight size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                announcements.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FiVolume2 size={32} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada pengumuman</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((a) => (
                            <div key={a.id} className="glass-card p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    {getPriorityBadge(a.priority)}
                                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                        {a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                                    </span>
                                </div>
                                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>{a.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a.content}</p>
                                {a.admin && (
                                    <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                                        Oleh: {a.admin.name || 'Admin'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Notifications;
