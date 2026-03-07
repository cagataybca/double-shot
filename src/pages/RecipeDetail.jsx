import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Droplets, Thermometer, Info } from 'lucide-react';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Şimdilik hepsi için aynı sahte veriyi gösteriyoruz, gerçek projede veri tabanından gelir.
    const recipe = {
        name: id === 'espresso' ? 'Espresso' : id === 'americano' ? 'Americano' : id === 'v60' ? 'V60 Pour Over' : id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
        desc: 'Espresso (İtalyan İfadesi: espresso, preslenmiş demektir), ince öğütülmüş kahve çekirdeklerinden makine yardımı ile yüksek basınçlı sıcak su geçirilerek elde edilen yoğun kahve.',
        stats: {
            time: '25-30 sn',
            water: '36 g',
            temp: '93°C',
            ratio: '1:2'
        },
        ingredients: ['18g İnce Öğütülmüş Kahve', 'Kireçsiz İçme Suyu'],
        steps: [
            'Portafiltreyi temizle ve kurula.',
            '18g kahveyi öğüt ve portafiltreye al.',
            'Distributor (WDT) ile kahveyi eşit dağıt.',
            'Tamper ile portafiltrenin yüzeyine düzgün ve eşit baskı uygula.',
            'Portafiltreyi gruba tak ve hemen demlemeyi başlat.',
            '25-30 saniye boyunca 36 gram çıktı(yield) alarak işlemi sonlandır.'
        ]
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>

            {/* Üst Kısım Gezinme */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/recipes')}
                    style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%', backgroundColor: 'var(--color-surface)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '20px', margin: 0 }}>{recipe.name}</h2>
            </div>

            {/* Hero Bilgi */}
            <p className="text-secondary" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                {recipe.desc}
            </p>

            {/* İstatistikler */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px'
            }}>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <Clock size={20} className="text-accent" />
                    <span style={{ fontSize: '12px' }} className="text-secondary">Süre</span>
                    <strong style={{ fontSize: '14px' }}>{recipe.stats.time}</strong>
                </div>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <Droplets size={20} className="text-accent" />
                    <span style={{ fontSize: '12px' }} className="text-secondary">Çıktı (Yield)</span>
                    <strong style={{ fontSize: '14px' }}>{recipe.stats.water}</strong>
                </div>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <Thermometer size={20} className="text-accent" />
                    <span style={{ fontSize: '12px' }} className="text-secondary">Sıcaklık</span>
                    <strong style={{ fontSize: '14px' }}>{recipe.stats.temp}</strong>
                </div>
                <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '16px', gap: '8px' }}>
                    <Info size={20} className="text-accent" />
                    <span style={{ fontSize: '12px' }} className="text-secondary">Demleme Oranı</span>
                    <strong style={{ fontSize: '14px' }}>{recipe.stats.ratio}</strong>
                </div>
            </div>

            {/* Adımlar */}
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Hazırlama Adımları</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recipe.steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                        <div style={{
                            minWidth: '28px', height: '28px',
                            borderRadius: '50%', backgroundColor: 'var(--color-accent)',
                            color: '#000', fontWeight: 'bold', fontSize: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginTop: '4px'
                        }}>
                            {idx + 1}
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-primary)', margin: 0 }}>
                            {step}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default RecipeDetail;
