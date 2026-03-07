import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null);
    const [score, setScore] = useState(0);

    const roles = [
        { id: 'barista', label: 'Baristayım', desc: 'Profesyonel olarak kahve hazırlıyorum' },
        { id: 'manager', label: 'Kafe Yöneticisiyim', desc: 'Bir kafenin operasyonunu yürütüyorum' },
        { id: 'owner', label: 'Dükkan Sahibiyim', desc: 'Kahve dükkanım veya markam var' },
        { id: 'learner', label: 'Öğrenmek İstiyorum', desc: 'Kahveye ilgim var, kendimi geliştirmek istiyorum' }
    ];

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const questionPool = [
            { q: 'Espresso demleme (extraction) süresi ortalama kaç saniyedir?', options: ['10-15 saniye', '25-30 saniye', '45-60 saniye', '1-2 dakika'], answer: 1 },
            { q: 'Latte Art için sütü kremalaştırırken ideal sıcaklık ortalama nedir?', options: ['40-45°C', '60-65°C', '80-85°C', '95-100°C'], answer: 1 },
            { q: 'V60, Chemex ve Aeropress gibi yöntemlere genel olarak ne ad verilir?', options: ['Cold Brew', 'Türk Kahvesi', 'Manuel Demleme', 'Kapsül Kahve'], answer: 2 },
            { q: 'Espresso yapımında kahve çekirdekleri nasıl öğütülmelidir?', options: ['Çok İnce (Pudra gibi)', 'İnce (İnce Tuz gibi)', 'Orta (Kum gibi)', 'Kalın (Kaya tuzu gibi)'], answer: 1 },
            { q: 'Latte ve Cappuccino arasındaki en belirgin köpük farkı nedir?', options: ['Latte daha yoğun köpüklüdür', 'Cappuccino daha az süt içerir ve köpüğü yoğundur', 'İkisi de tamamen aynıdır', 'Cappuccino kremasızdır'], answer: 1 },
            { q: 'Flat White hangi ülkenin kahve kültüründen dünyaya yayılmıştır?', options: ['İtalya', 'Avustralya / Yeni Zelanda', 'Amerika', 'Türkiye'], answer: 1 },
            { q: 'Arabica çekirdeğinin Robusta\'ya göre belirgin özelliği nedir?', options: ['Çok yüksek kafein içerir', 'Daha tatlı, asidik ve aromatiktir', 'Kalitesiz ve odunsudur', 'Sadece espresso için kullanılır'], answer: 1 },
            { q: 'Cold Brew (Soğuk Demleme) genellikle ne kadar süre demlenir?', options: ['3-5 dakika', '15-20 dakika', '1-2 saat', '12-24 saat'], answer: 3 },
            { q: 'Americano kahvesi nasıl hazırlanır?', options: ['Filtre kahve üzerine süt eklenerek', 'Espressonun üzerine sıcak su eklenerek', 'Sıcak suya kahve tozu atılarak', 'Süt köpüğü üzerine espresso dökülerek'], answer: 1 },
            { q: 'Single (Tek) shot espresso ortalama kaç mililitredir (ml)?', options: ['10-15 ml', '25-30 ml', '50-60 ml', '100-120 ml'], answer: 1 },
            { q: 'Mocha tarifinde espressonun içine belirgin olarak ne eklenir?', options: ['Karamel Şurubu', 'Çikolata (Toz veya Sos)', 'Fındık Şurubu', 'Vanilya Özütü'], answer: 1 },
            { q: 'Kahve çekirdeklerinin tazeliğini korumak için en iyi saklama yöntemi hangisidir?', options: ['Buzdolabında açık kapta', 'Güneş gören bir cam kavanozda', 'Işık ve hava almayan serin bir kapta', 'Derin dondurucuda su içinde'], answer: 2 }
        ];
        // Havuzdan rastgele 5 soru seçimi
        const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
    }, []);

    const handleRoleSelect = (r) => {
        setRole(r);
        setTimeout(() => setStep(2), 400); // Küçük bir gecikme ile geçiş animasyonu
    };

    const handleAnswer = (idx) => {
        const isCorrect = idx === questions[step - 2].answer;
        if (isCorrect) setScore(score + 1);

        if (step - 1 < questions.length) {
            setStep(step + 1);
        } else {
            setStep('result');
        }
    };

    const getLevel = () => {
        // Toplam 5 soru
        if (score === 5) return { title: 'Master Barista', grade: 'C2' };
        if (score === 4) return { title: 'Advanced (Usta)', grade: 'C1' };
        if (score === 3) return { title: 'Upper Intermediate (İleri)', grade: 'B2' };
        if (score === 2) return { title: 'Intermediate (Orta)', grade: 'B1' };
        if (score === 1) return { title: 'Beginner (Başlangıç)', grade: 'A2' };
        return { title: 'Tadımlık (Çaylak)', grade: 'A1' };
    };

    return (
        <div style={{ padding: 'var(--sp-md)', display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>

            {/* 
        Header / Logo Alanı Sadece Onboarding'de Farklı Gözüksün Diye 
        Kendi İçinde Küçük Bir Başlık
      */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', letterSpacing: '-1px' }}>
                    Double<span style={{ color: 'var(--color-accent)' }}>Shot</span>
                </h1>
                <p className="text-secondary" style={{ marginTop: '8px' }}>Global Kahve Topluluğu</p>
            </div>

            {step === 1 && (
                <div className="animate-fade-in">
                    <h2 style={{ fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>Bize kendinden bahset</h2>
                    <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>Kahve sektöründeki rolün nedir?</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {roles.map(r => (
                            <div
                                key={r.id}
                                onClick={() => handleRoleSelect(r.id)}
                                className="glass-panel"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    border: role === r.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)'
                                }}
                            >
                                <div>
                                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{r.label}</h4>
                                    <p className="text-secondary" style={{ fontSize: '12px' }}>{r.desc}</p>
                                </div>
                                <div style={{
                                    width: '24px', height: '24px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: role === r.id ? 'var(--color-accent)' : 'transparent',
                                    color: '#000'
                                }}>
                                    {role === r.id && <Check size={16} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {typeof step === 'number' && step > 1 && step <= questions.length + 1 && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <span className="text-secondary" style={{ fontSize: '14px' }}>Soru {step - 1} / {questions.length}</span>
                        <span className="text-accent" style={{ fontSize: '14px' }}>Seviye Tespiti</span>
                    </div>

                    <h2 style={{ fontSize: '20px', marginBottom: '32px', lineHeight: '1.4' }}>
                        {questions[step - 2].q}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {questions[step - 2].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="btn-secondary"
                                style={{ textAlign: 'left', padding: '16px', fontSize: '15px' }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'result' && (
                <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        border: '2px solid var(--color-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: 'var(--color-accent)'
                    }}>
                        <Check size={40} />
                    </div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Test Tamamlandı!</h2>
                    <p className="text-secondary" style={{ marginBottom: '16px' }}>Belirlenen Kahve Seviyen:</p>

                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h3 className="text-accent" style={{ fontSize: '36px', fontWeight: 'bold' }}>{getLevel().grade}</h3>
                        <span style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>{getLevel().title}</span>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => {
                            // Onboarding'i tamamlandı olarak işaretle
                            localStorage.setItem('doubleshot_onboarding_completed', 'true');

                            // Skora göre başlangıç puanını (PT) belirle
                            let startingPts = 0;
                            if (score === 5) startingPts = 1000; // C2
                            else if (score === 4) startingPts = 700; // C1
                            else if (score === 3) startingPts = 450; // B2
                            else if (score === 2) startingPts = 250; // B1
                            else if (score === 1) startingPts = 100; // A2
                            else startingPts = 0; // A1

                            // Başlangıç puanını kaydet
                            localStorage.setItem('doubleshot_points', startingPts.toString());

                            // Ana sayfaya yönlendir
                            navigate('/');
                        }}
                    >
                        Ana Sayfaya Git <ChevronRight size={20} />
                    </button>
                </div>
            )}

        </div>
    );
};

export default Onboarding;
