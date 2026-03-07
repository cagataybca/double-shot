import React, { useState } from 'react';
import { Settings, Wrench, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Droplets, Zap, ShieldAlert, CalendarClock } from 'lucide-react';

export const EquipmentGuide = () => {
    const [activeTab, setActiveTab] = useState('troubleshoot'); // 'troubleshoot' veya 'maintenance'

    // Açık olan akordeon menünün ID'sini tutar
    const [expandedFaultId, setExpandedFaultId] = useState(null);

    // Kategori/Makine Seçimi
    const [selectedCategory, setSelectedCategory] = useState('espresso');

    const categories = [
        { id: 'espresso', label: 'Espresso', icon: <Droplets size={16} /> },
        { id: 'grinder', label: 'Değirmen', icon: <Zap size={16} /> },
        { id: 'water', label: 'Su & Filtre', icon: <Settings size={16} /> },
    ];

    // Örnek Arıza Sözlüğü (Troubleshoot Verileri)
    const faults = {
        espresso: [
            {
                id: 'esp-1',
                title: 'Grup başlığından su akışı yok / damlıyor',
                severity: 'medium', // low, medium, high
                symptoms: 'Düğmeye basıldığında pompa sesi geliyor ama kahve akmıyor veya çok yavaş damlıyor.',
                solutions: [
                    'Espresso öğütüm inceliğini kontrol et: Çok ince öğütülmüş olabilir.',
                    'Dozu kontrol et: Sepete fazla kahve konmuş olabilir.',
                    'Grup duş telini sök ve temizle, kör tıkanıklık olabilir.',
                    'Makine bekleme/ısınma modunda mı? Ekrandan basıncı kontrol et.'
                ]
            },
            {
                id: 'esp-2',
                title: 'Buhar çubuğunda düşük basınç sorunu',
                severity: 'low',
                symptoms: 'Sütü kremalaştırırken yeterli girdap/basınç oluşmuyor.',
                solutions: [
                    'Buhar çubuğunun ucundaki (nozul) delikler süt tabakasıyla tıkanmış olabilir. İğne veya kürdan ile temizle.',
                    'Vanayı tam olarak açtığından emin ol.',
                    'Kazan basınç (boiler) göstergesi 1.0 - 1.5 bar arasında olmalıdır, kontrol et.'
                ]
            },
            {
                id: 'esp-3',
                title: 'Makinenin altından su kaçırıyor',
                severity: 'high',
                symptoms: 'Tezgaha sürekli temiz veya kirli su sızıntısı var.',
                solutions: [
                    'Drenaj (tahliye) borusu tıkanmış olabilir veya tepsiden taşmış olabilir. Tepsinin altını kontrol et.',
                    'Şebeke giriş valfini kapatarak güvenliği sağla.',
                    'Durum devam ediyorsa KESİNLİKLE müdahale etme ve teknik servisi ara.'
                ]
            }
        ],
        grinder: [
            {
                id: 'grind-1',
                title: 'Değirmen çalışıyor ama kahve vermiyor (Tıkanma)',
                severity: 'medium',
                symptoms: 'Motor sesi var fakat chute (oluk) kısmından kahve dökülmüyor.',
                solutions: [
                    'Aşırı ince veya nemli kahve çekirdeği diskleri tıkamış olabilir. Öğütümü 2-3 tık kalınlaştırıp boşta çalıştır.',
                    'Oluk (chute) kısmını fırça ile nazikçe temizle.',
                    'Değirmen fişten çekili ve tamamen boşalmışken hopperı çıkarıp disk aralarını vakumla temizle.'
                ]
            }
        ],
        water: [
            {
                id: 'water-1',
                title: 'Kahvenin tadı asidik (Ekşi) veya klorlu gelmeye başladı',
                severity: 'medium',
                symptoms: 'Reçete doğru olmasına rağmen tat profili negatif yönde değişti.',
                solutions: [
                    'Su arıtma filtresinin ömrü dolmuş olabilir, son değişim tarihini kontrol et.',
                    'By-pass ayarlarında valf kaçırmış veya değişmiş olabilir.',
                    'Arıtma şirketini filtre değişimi için çağır.'
                ]
            }
        ]
    };

    // Örnek Bakım/Periyot Takvimi Verileri
    const maintenanceTasks = [
        { id: 1, title: 'Espresso - Kör Filtre (Backflush)', period: 'Günlük (Kapanış)', status: 'todo' },
        { id: 2, title: 'Buhar Çubuğu Kimyasalı ile Süt Borusu Temizliği', period: 'Günlük (Kapanış)', status: 'done' },
        { id: 3, title: 'Değirmen Hoppar Yıkama & Kurulama', period: 'Haftalık', status: 'todo' },
        { id: 4, title: 'Su Arıtma Sistemi Tuz Check-up / Filtrasyon', period: 'Aylık', status: 'todo' },
        { id: 5, title: 'Espresso - Duş Telleri PulyCaff ile Bekletme', period: 'Haftalık', status: 'todo' },
    ];

    const currentFaults = faults[selectedCategory] || [];

    const getSeverityIcon = (severity) => {
        if (severity === 'high') return <ShieldAlert size={16} color="#ef4444" />;
        if (severity === 'medium') return <AlertTriangle size={16} color="#f59e0b" />;
        return <CheckCircle size={16} color="var(--color-accent)" />;
    };

    const getSeverityText = (severity) => {
        if (severity === 'high') return 'Teknik Servis Gerekebilir (Acil)';
        if (severity === 'medium') return 'Barista Müdahalesi (Orta)';
        return 'Baistara Kontrolü (Hafif)';
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '32px' }}>

            {/* Üst Başlık */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Makine & <span className="text-accent">Ekipman</span></h2>
                <p className="text-secondary" style={{ fontSize: '13px' }}>Sorun tespit, arıza onarım ve periyodik bakımlar.</p>
            </div>

            {/* Büyük Uyarı Kartı */}
            <div className="glass-panel" style={{
                padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px',
                borderLeft: '4px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)'
            }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
                    <AlertTriangle size={24} color="#ef4444" />
                </div>
                <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '4px' }}>Güvenlik Uyarısı</h3>
                    <p className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        Elektrik veya yüksek basınçlı parçalara müdahale ederken her zaman cihazın kapalı/fişten çekili olduğundan emin olun. Ciddi arızalar için teknik servisi veya ekip liderini derhal bilgilendirin.
                    </p>
                </div>
            </div>

            {/* Sekmeler (Troubleshoot vs Maintenance) */}
            <div style={{
                display: 'flex', gap: '8px', marginBottom: '24px',
                backgroundColor: 'var(--color-surface)', padding: '6px', borderRadius: 'var(--radius-lg)'
            }}>
                <button
                    onClick={() => setActiveTab('troubleshoot')}
                    style={{
                        flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                        backgroundColor: activeTab === 'troubleshoot' ? 'var(--color-accent)' : 'transparent',
                        color: activeTab === 'troubleshoot' ? '#000' : 'var(--color-text-secondary)',
                        fontWeight: activeTab === 'troubleshoot' ? '600' : '500',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <Wrench size={16} /> Arıza Çözümü
                </button>
                <button
                    onClick={() => setActiveTab('maintenance')}
                    style={{
                        flex: 1, padding: '10px 0', fontSize: '13px', borderRadius: 'var(--radius-md)',
                        backgroundColor: activeTab === 'maintenance' ? 'var(--color-accent)' : 'transparent',
                        color: activeTab === 'maintenance' ? '#000' : 'var(--color-text-secondary)',
                        fontWeight: activeTab === 'maintenance' ? '600' : '500',
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                >
                    <CalendarClock size={16} /> Bakım Takvimi
                </button>
            </div>

            {/* İçerik: ARIZA SÖZLÜĞÜ */}
            {activeTab === 'troubleshoot' && (
                <div className="animate-fade-in">

                    {/* Alt Kategoriler (Yatay Kaydırmalı Butonlar) */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '8px 16px', borderRadius: '20px', fontSize: '13px', whiteSpace: 'nowrap',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    backgroundColor: selectedCategory === cat.id ? 'var(--color-surface-light)' : 'transparent',
                                    color: selectedCategory === cat.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                    border: selectedCategory === cat.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    fontWeight: selectedCategory === cat.id ? 'bold' : 'normal', transition: 'all 0.2s'
                                }}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Sık Karşılaşılan Sorunlar</span>
                        <span className="text-secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>{currentFaults.length} kayıt var</span>
                    </h3>

                    {/* Akordeon Gövdesi */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentFaults.map(fault => {
                            const isExpanded = expandedFaultId === fault.id;

                            return (
                                <div key={fault.id} className="glass-panel" style={{
                                    overflow: 'hidden', transition: 'all 0.3s ease',
                                    border: isExpanded ? '1px solid var(--color-accent)' : '1px solid var(--color-border)'
                                }}>

                                    {/* Akordeon Başlık */}
                                    <div
                                        onClick={() => setExpandedFaultId(isExpanded ? null : fault.id)}
                                        style={{
                                            padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                                            backgroundColor: isExpanded ? 'rgba(212, 175, 55, 0.05)' : 'transparent'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1, paddingRight: '12px' }}>
                                            <div style={{ marginTop: '2px' }}>
                                                {getSeverityIcon(fault.severity)}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '4px', color: isExpanded ? 'var(--color-accent)' : '#fff' }}>
                                                    {fault.title}
                                                </h4>
                                                {!isExpanded && (
                                                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>
                                                        {getSeverityText(fault.severity)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ color: 'var(--color-text-secondary)' }}>
                                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        </div>
                                    </div>

                                    {/* Akordeon İçerik (Semptom & Çözümler) */}
                                    {isExpanded && (
                                        <div className="animate-fade-in" style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--color-border)' }}>

                                            <div style={{ marginTop: '16px', marginBottom: '16px', padding: '12px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-sm)' }}>
                                                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>SEMPTOMLAR</span>
                                                <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>"{fault.symptoms}"</p>
                                            </div>

                                            <span style={{ fontSize: '11px', color: 'var(--color-accent)', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>BARİSTA ÇÖZÜM ADIMLARI (TROUBLESHOOTING)</span>
                                            <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text-primary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {fault.solutions.map((sol, index) => (
                                                    <li key={index} style={{ paddingLeft: '4px' }}>
                                                        <span style={{ opacity: 0.9 }}>{sol}</span>
                                                    </li>
                                                ))}
                                            </ol>

                                            {fault.severity === 'high' && (
                                                <button style={{ width: '100%', marginTop: '16px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 'var(--radius-sm)', color: '#ef4444', fontSize: '13px', fontWeight: 'bold' }}>
                                                    Servis Yetkilisine Bildir
                                                </button>
                                            )}

                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* İçerik: BAKIM TAKVİMİ */}
            {activeTab === 'maintenance' && (
                <div className="animate-fade-in">
                    <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '16px' }}>
                        Dükkanınızdaki standart bakım görevleri. Bu görevleri ekip lideriniz vardiya sonunda inceler.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {maintenanceTasks.map(task => (
                            <div key={task.id} className="glass-panel" style={{
                                padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                borderLeft: task.status === 'done' ? '3px solid var(--color-accent)' : '3px solid var(--color-border)',
                                opacity: task.status === 'done' ? 0.7 : 1
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '14px', marginBottom: '4px', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                                        {task.title}
                                    </h4>
                                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                                        {task.period}
                                    </span>
                                </div>
                                <div>
                                    {task.status === 'done' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontSize: '12px' }}>
                                            <CheckCircle size={16} /> Yapıldı
                                        </div>
                                    ) : (
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px dashed var(--color-text-secondary)' }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};
