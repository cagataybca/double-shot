import React, { useState } from 'react';
import { Coffee, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('barista'); // YENİ: Rol seçimi state'i
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // Giriş İşlemi
            const users = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Giriş Başarılı, genel profile senkronize et (önceki yapıyı bozmamak için)
                localStorage.setItem('profileName', user.name);
                localStorage.setItem('profileEmail', user.email);
                if (user.role) {
                    localStorage.setItem('profileRole', user.role);
                }

                // Kullanıcının varsa puanını yükle
                const userPoints = user.points !== undefined ? user.points : (user.email === 'bca@test.com' ? 1000 : 0);
                localStorage.setItem('doubleshot_points', userPoints.toString());

                // Kullanıcının varsa kurs ilerlemesini ve onboarding durumunu yükle
                if (user.courses) {
                    localStorage.setItem('doubleshot_courses', JSON.stringify(user.courses));
                } else {
                    localStorage.removeItem('doubleshot_courses');
                }

                if (user.onboardingCompleted) {
                    localStorage.setItem('doubleshot_onboarding_completed', 'true');
                } else {
                    localStorage.removeItem('doubleshot_onboarding_completed');
                }

                // Admin (Super Admin) Yetkilendirme Kontrolü
                if (user.email === 'bca@test.com') {
                    localStorage.setItem('doubleshot_is_leader', 'true');
                    localStorage.setItem('doubleshot_super_admin', 'true');
                    localStorage.setItem('doubleshot_team_status', 'approved');
                } else {
                    localStorage.setItem('doubleshot_is_leader', 'false');
                    localStorage.setItem('doubleshot_super_admin', 'false');
                }

                onLogin();
            } else {
                setError('E-posta veya şifre hatalı!');
            }
        } else {
            // Kayıt İşlemi
            if (!name || !email || !password) {
                setError('Lütfen tüm alanları doldurun.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('doubleshot_users') || '[]');
            if (users.some(u => u.email === email)) {
                setError('Bu e-posta adresi zaten kullanılıyor.');
                return;
            }

            const defaultPoints = email === 'bca@test.com' ? 1000 : 0;
            const newUser = { name, email, password, role, points: defaultPoints, courses: null, onboardingCompleted: false };
            users.push(newUser);
            localStorage.setItem('doubleshot_users', JSON.stringify(users));

            // Kayıttan sonra direkt giriş yaptır
            localStorage.setItem('profileName', newUser.name);
            localStorage.setItem('profileEmail', newUser.email);
            localStorage.setItem('profileRole', newUser.role);
            localStorage.setItem('doubleshot_points', defaultPoints.toString());

            // Yeni kullanıcı için global eğitim ve onboarding statülerini temizle
            localStorage.removeItem('doubleshot_courses');
            localStorage.removeItem('doubleshot_onboarding_completed');

            // Admin (Super Admin) Yetkilendirme Kontrolü
            if (newUser.email === 'bca@test.com') {
                localStorage.setItem('doubleshot_is_leader', 'true');
                localStorage.setItem('doubleshot_super_admin', 'true');
                localStorage.setItem('doubleshot_team_status', 'approved');
            } else {
                localStorage.setItem('doubleshot_is_leader', 'false');
                localStorage.setItem('doubleshot_super_admin', 'false');
                localStorage.removeItem('doubleshot_team_status');
            }

            onLogin();
        }
    };

    return (
        <div className="animate-fade-in" style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
            background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.15), transparent 400px), var(--color-background)'
        }}>
            {/* Logo Alanı */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px', height: '80px', margin: '0 auto 16px',
                    backgroundColor: 'var(--color-surface)', borderRadius: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}>
                    <Coffee size={40} color="var(--color-accent)" />
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Double<span className="text-accent">Shot</span>
                </h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                    {isLogin ? 'Tekrar hoş geldin, Barista.' : 'Aramıza katıl, uzmanlığa adım at.'}
                </p>
            </div>

            {/* Form Alanı */}
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                {error && (
                    <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #EF4444', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', color: '#FCA5A5' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Ad Soyad</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Adınızı girin"
                                    style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Uygulamayı Kullanım Amacınız</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--color-border)',
                                        color: '#fff',
                                        fontSize: '14px',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        appearance: 'none', // Tarayıcı varsayılan okunu gizle
                                        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 14px top 50%',
                                        backgroundSize: '12px auto'
                                    }}
                                >
                                    <option value="barista" style={{ backgroundColor: '#1a1a1a' }}>Barista</option>
                                    <option value="owner" style={{ backgroundColor: '#1a1a1a' }}>Kafe Sahibi / İşletmeci</option>
                                    <option value="enthusiast" style={{ backgroundColor: '#1a1a1a' }}>Kahve Meraklısı</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>E-posta Adresi</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="barista@doubleshot.app"
                                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Şifre</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: '#fff', fontSize: '14px', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}
                >
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    <ArrowRight size={18} />
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    {isLogin ? 'Henüz hesabın yok mu?' : 'Zaten bir hesabın var mı?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 'bold', marginLeft: '6px', cursor: 'pointer', padding: 0 }}
                    >
                        {isLogin ? 'Hesap Oluştur' : 'Giriş Yap'}
                    </button>
                </p>
            </div>
        </div>
    );
}
