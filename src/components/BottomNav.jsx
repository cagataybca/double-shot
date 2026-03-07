import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Coffee, BookOpen, Users } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Ana Sayfa', path: '/' },
        { id: 'recipes', icon: Coffee, label: 'Tarifler', path: '/recipes' },
        { id: 'training', icon: BookOpen, label: 'Eğitim', path: '/training' },
        { id: 'team', icon: Users, label: 'Ekip', path: '/team' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: 'rgba(10, 10, 10, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            zIndex: 50
        }}>
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                            transition: 'color 0.2s',
                            width: '100%',
                            height: '100%'
                        })}
                    >
                        <Icon size={24} strokeWidth={2} />
                        <span style={{ fontSize: '11px', fontWeight: 500 }}>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
