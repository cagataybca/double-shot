import React, { useState } from 'react';
import { Award, BookOpen, Clock, Settings, User, X } from 'lucide-react';

export const Profile = () => {
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Kullanıcı bilgileri (Tarayıcı hafızasından oku, yoksa varsayılanı kullan)
    const [name, setName] = useState(() => localStorage.getItem('profileName') || 'Misafir Barista');
    const [email, setEmail] = useState(() => localStorage.getItem('profileEmail') || 'barista@doubleshot.app');

    // Geçici değişiklik stateleri
    const [tempName, setTempName] = useState(name);
    const [tempEmail, setTempEmail] = useState(email);

    // Dinamik Puan ve Seviye Hesaplama (Onboarding veya Eğitim testlerinden gelir)
    const points = parseInt(localStorage.getItem('doubleshot_points')) || 0;

    const getLevelInfo = (pt) => {
        if (pt >= 1000) return { level: 'Eğitmen Barista', grade: 'C2' };
        if (pt >= 700) return { level: 'Usta Barista', grade: 'C1' };
        if (pt >= 450) return { level: 'İleri Seviye (Upper)', grade: 'B2' };
        if (pt >= 250) return { level: 'Orta Seviye', grade: 'B1' };
        if (pt >= 100) return { level: 'Junior Barista', grade: 'A2' };
        return { level: 'Çaylak (Beginner)', grade: 'A1' };
    };

    const currentLevel = getLevelInfo(points);

    // Tamamlanan Eğitim Sayısı
    const savedCourses = JSON.parse(localStorage.getItem('doubleshot_courses') || '[]');
    const completedCoursesCount = savedCourses.filter(c => c.isCompleted).length;

    // Modalı açarken form değerlerini sıfırla/güncelle
    const handleOpenSettings = () => {
        setTempName(name);
        setTempEmail(email);
        setShowSettingsModal(true);
    };

    // Kaydet işlemi
    const handleSaveSettings = () => {
        setName(tempName);
        setEmail(tempEmail);
        localStorage.setItem('profileName', tempName);
        localStorage.setItem('profileEmail', tempEmail);
        alert('Ayarlar başarıyla kaydedildi!');
        setShowSettingsModal(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>

            {/* Profil Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', marginTop: '16px' }}>
                <div style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%', backgroundColor: 'var(--color-surface)',
                    border: '2px solid var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <User size={40} className="text-secondary" />
                </div>
                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>{name}</h2>
                <span className="text-accent" style={{ fontSize: '14px', fontWeight: '500' }}>{currentLevel.level} ({currentLevel.grade})</span>
            </div>

            {/* İstatistikler */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px', textAlign: 'center' }}>
                    <Award size={20} className="text-accent" />
                    <strong style={{ fontSize: '18px' }}>{points}</strong>
                    <span style={{ fontSize: '10px' }} className="text-secondary">Puan</span>
                </div>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px', textAlign: 'center' }}>
                    <BookOpen size={20} className="text-accent" />
                    <strong style={{ fontSize: '18px' }}>{completedCoursesCount}</strong>
                    <span style={{ fontSize: '10px' }} className="text-secondary">Eğitim</span>
                </div>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px', textAlign: 'center' }}>
                    <Clock size={20} className="text-accent" />
                    <strong style={{ fontSize: '18px' }}>14s</strong>
                    <span style={{ fontSize: '10px' }} className="text-secondary">Pratik</span>
                </div>
            </div>

            {/* Menü Seçenekleri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                    onClick={handleOpenSettings}
                    className="glass-panel"
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                >
                    <Settings size={20} className="text-secondary" />
                    <span style={{ fontSize: '15px' }}>Hesap Ayarları</span>
                </div>
                <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <Award size={20} className="text-secondary" />
                    <span style={{ fontSize: '15px' }}>Kazanılan Rozetler</span>
                </div>
                <div
                    onClick={() => {
                        // Çıkış yapmadan önce puanları kullanıcı listesine son bir kez kaydet
                        const currentPoints = localStorage.getItem('doubleshot_points');
                        const currentEmail = localStorage.getItem('profileEmail');
                        if (currentPoints && currentEmail) {
                            const users = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
                            const currentCourses = JSON.parse(localStorage.getItem('doubleshot_courses') || 'null');
                            const onboardingCompleted = localStorage.getItem('doubleshot_onboarding_completed') === 'true';

                            const updatedUsers = users.map(u => {
                                if (u.email === currentEmail) {
                                    return {
                                        ...u,
                                        points: parseInt(currentPoints),
                                        courses: currentCourses || u.courses,
                                        onboardingCompleted: onboardingCompleted || u.onboardingCompleted
                                    };
                                }
                                return u;
                            });
                            localStorage.setItem('doubleshot_users', JSON.stringify(updatedUsers));
                        }

                        // Tüm kullanıcı ve yetki verilerini temizle
                        localStorage.removeItem('doubleshot_auth');
                        localStorage.removeItem('profileName');
                        localStorage.removeItem('profileEmail');
                        localStorage.removeItem('doubleshot_is_leader');
                        localStorage.removeItem('doubleshot_super_admin');
                        localStorage.removeItem('doubleshot_team_status');
                        localStorage.removeItem('doubleshot_points');
                        localStorage.removeItem('doubleshot_team_code');
                        localStorage.removeItem('doubleshot_courses');
                        localStorage.removeItem('doubleshot_onboarding_completed');

                        window.location.reload();
                    }}
                    className="glass-panel"
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderColor: 'rgba(255, 50, 50, 0.3)' }}
                >
                    <span style={{ fontSize: '15px', color: '#ff6b6b' }}>Çıkış Yap</span>
                </div>
            </div>

            {/* Hesap Ayarları Modal */}
            {showSettingsModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px', position: 'relative' }}>

                        <button
                            onClick={() => setShowSettingsModal(false)}
                            style={{ position: 'absolute', top: 16, right: 16, color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <Settings size={24} className="text-accent" />
                            <h3 style={{ fontSize: '20px', margin: 0 }}>Hesap Ayarları</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Ad Soyad</label>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>E-posta Adresi</label>
                                <input
                                    type="email"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Yeni Şifre (Opsiyonel)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleSaveSettings}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                        >
                            Değişiklikleri Kaydet
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};
