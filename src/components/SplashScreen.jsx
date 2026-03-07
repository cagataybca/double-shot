import React, { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // 3 saniye ekranda kal, sonra fade-out başlat
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Fade-out animasyonu bittikten sonra callback'i çağır
            setTimeout(onComplete, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'var(--color-bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '40px 20px',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease',
            WebkitFontSmoothing: 'antialiased'
        }}>

            {/* Üst Kısım / Boşluk */}
            <div style={{ flex: 1 }}></div>

            {/* Merkez Logo */}
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)'
                }}>
                    <Coffee size={44} strokeWidth={2.5} />
                </div>
                <h1 style={{ fontSize: '36px', letterSpacing: '-1px', fontWeight: 'bold' }}>
                    Double<span style={{ color: 'var(--color-accent)' }}>Shot</span>
                </h1>
                <p className="text-secondary" style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    KAHVEYE DAİR HER ŞEY
                </p>
            </div>

            {/* Alt Kısım - Produced By */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: '20px' }}>
                <p style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '1px',
                    opacity: 0.7
                }}>
                    produced by baes.
                </p>
            </div>

        </div>
    );
};

export default SplashScreen;
