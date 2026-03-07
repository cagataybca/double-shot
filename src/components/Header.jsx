import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, X, Info, AlertTriangle } from 'lucide-react';

const Header = () => {
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Bildirimleri yükle
    useEffect(() => {
        const loadNotifs = () => {
            const myEmail = localStorage.getItem('profileEmail');
            const saved = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
            // Hedef kitle (target) kontrolü ve kendi gönderdiğini gizleme
            const filtered = saved.filter(n => {
                const isLeader = localStorage.getItem('doubleshot_is_leader') === 'true';
                const isApproved = localStorage.getItem('doubleshot_team_status') === 'approved';

                // Lidersek ve hedef 'leader' ise kesinlikle görelim (Kendi attığımız istek değilse)
                if (n.target === 'leader') {
                    return isLeader && n.sender !== myEmail;
                }

                // Hedef 'team' ise, gönderen kendimizsek görmeyelim
                if (n.target === 'team') {
                    if (n.sender === myEmail) return false;
                    return isLeader || isApproved;
                }

                // Eğer target bir email ise (Örn: spesifik bir kullanıcıya gönderilen bildirim)
                if (n.target && n.target.includes('@')) {
                    return n.target === myEmail;
                }

                // Diğer durumlar (varsa)
                return n.sender !== myEmail;
            });
            setNotifications(filtered);
        };

        loadNotifs();
        // Polling (Basitlik adına her 5 saniyede bir kontrol edelim)
        const interval = setInterval(loadNotifs, 5000);
        return () => clearInterval(interval);
    }, []);

    const hasUnread = notifications.some(n => !n.isRead);

    const markAsRead = () => {
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updated);

        // Ana depoyu da güncelle (sadece bizim gördüklerimizi değil, hepsini tutuyoruz)
        const allSaved = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
        const fullyUpdated = allSaved.map(n => ({ ...n, isRead: true }));
        localStorage.setItem('doubleshot_notifications', JSON.stringify(fullyUpdated));

        setShowNotif(!showNotif);
    };

    const clearNotifications = () => {
        if (window.confirm('Tüm bildirimleri silmek istediğinize emin misiniz?')) {
            // Şimdilik bana ait (o an ekranda görünen) bildirimleri localden süzüp atıyoruz.
            const allSaved = JSON.parse(localStorage.getItem('doubleshot_notifications') || '[]');
            const myCurrentIds = notifications.map(n => n.id);
            const remaining = allSaved.filter(n => !myCurrentIds.includes(n.id));

            localStorage.setItem('doubleshot_notifications', JSON.stringify(remaining));
            setNotifications([]);
            setShowNotif(false);
        }
    };

    return (
        <header style={{
            padding: 'var(--sp-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '18px'
                }}>
                    D
                </div>
                <h1 style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>
                    Double<span style={{ color: 'var(--color-accent)' }}>Shot</span>
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <button
                    onClick={markAsRead}
                    style={{
                        color: 'var(--color-text-primary)',
                        position: 'relative',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                    }}
                >
                    <Bell size={22} />
                    {hasUnread && (
                        <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#ff4b4b',
                            borderRadius: '50%',
                            border: '2px solid #0a0a0a'
                        }} />
                    )}
                </button>

                {/* Bildirim Dropdown */}
                {showNotif && (
                    <div className="glass-panel animate-fade-in" style={{
                        position: 'absolute',
                        top: '48px',
                        right: '-8px',
                        width: '280px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '16px',
                        zIndex: 100,
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '15px', margin: 0 }}>Bildirimler</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {notifications.length > 0 && (
                                    <button onClick={clearNotifications} style={{ background: 'transparent', border: 'none', color: '#ff4b4b', fontSize: '12px', cursor: 'pointer', padding: '0 8px' }}>
                                        Temizle
                                    </button>
                                )}
                                <button onClick={() => setShowNotif(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {notifications.length === 0 ? (
                            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)', padding: '20px 0' }}>Henüz bildirim yok.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {notifications.map(n => (
                                    <div key={n.id} style={{
                                        paddingBottom: '12px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundColor: n.type === 'urgent' ? 'rgba(255,75,75,0.1)' : 'rgba(212,175,55,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: n.type === 'urgent' ? '#ff4b4b' : 'var(--color-accent)',
                                            flexShrink: 0
                                        }}>
                                            {n.type === 'urgent' ? <AlertTriangle size={16} /> : <Info size={16} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600' }}>{n.title}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{n.timestamp}</span>
                                            </div>
                                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.4' }}>{n.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-surface-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer'
                    }}
                >
                    <User size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
