import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    // Kullanıcı adını al
    const name = localStorage.getItem('profileName') || 'Barista';

    // Onboarding test durumu (Puanı 0'dan büyük olan, veya testi tamamlamış olanlar)
    const points = parseInt(localStorage.getItem('doubleshot_points')) || 0;
    const hasCompletedTest = localStorage.getItem('doubleshot_onboarding_completed') === 'true' || points > 0;

    const getLevelInfo = (pt) => {
        if (pt >= 1000) return { level: 'Eğitmen Barista', grade: 'C2' };
        if (pt >= 700) return { level: 'Usta Barista', grade: 'C1' };
        if (pt >= 450) return { level: 'İleri Seviye (Upper)', grade: 'B2' };
        if (pt >= 250) return { level: 'Orta Seviye', grade: 'B1' };
        if (pt >= 100) return { level: 'Junior Barista', grade: 'A2' };
        return { level: 'Çaylak (Beginner)', grade: 'A1' };
    };

    const currentLevel = getLevelInfo(points);

    return (
        <div className="animate-fade-in">
            <h2 style={{ marginBottom: '16px', color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: '500' }}>
                Hoş Geldin, <span className="text-accent">{name}</span>
            </h2>

            {/* Onboarding / Seviye Testi VEYA Güncel Seviye Kartı */}
            {hasCompletedTest ? (
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <p className="text-secondary" style={{ marginBottom: '8px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Güncel Seviyeniz
                    </p>
                    <h3 style={{ fontSize: '24px', color: 'var(--color-accent)' }}>
                        {currentLevel.level} ({currentLevel.grade})
                    </h3>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>DoubleShot'a Hazır Mısın?</h3>
                    <p className="text-secondary" style={{ marginBottom: '16px', fontSize: '14px' }}>
                        Kahve bilgini test et ve global topluluktaki yerini al.
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/onboarding')}
                    >
                        Bilgini Test Et
                    </button>
                </div>
            )}

            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Hızlı Erişim</h3>

            {/* Modüllere Yönlendirme Kisayollari */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>

                <div
                    onClick={() => navigate('/recipes')}
                    className="glass-panel"
                    style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '15px' }}>Tarifler</h4>
                        <ChevronRight size={16} className="text-accent" />
                    </div>
                    <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px' }}>Global tarif rehberi</p>
                </div>

                <div
                    onClick={() => navigate('/training')}
                    className="glass-panel"
                    style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '15px' }}>Eğitim</h4>
                        <ChevronRight size={16} className="text-accent" />
                    </div>
                    <p className="text-secondary" style={{ fontSize: '12px', marginTop: '4px' }}>Akademi modülü</p>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
                <div
                    onClick={() => navigate('/equipment')}
                    className="glass-panel"
                    style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '3px solid var(--color-accent)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '15px' }}>Makine & Ekipman Rehberi</h4>
                        <ChevronRight size={16} className="text-secondary" />
                    </div>
                    <p className="text-secondary" style={{ fontSize: '12px', marginTop: '6px' }}>Arıza tespiti ve işletme bakımları</p>
                </div>
            </div>
            <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>Bugünün İpucu</h3>
            <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--color-accent)' }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Mükemmel bir espresso shot için extraction (demleme) süresi ortalama <strong>25 - 30 saniye</strong> arasında olmalıdır. Aksi halde acı (over-extracted) veya ekşi (under-extracted) olabilir.
                </p>
            </div>
        </div>
    );
};

export default Home;
