import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Recipes = () => {
    const navigate = useNavigate();

    const coffeeTypes = [
        { id: 'espresso', name: 'Espresso', desc: 'Konsantre, yoğun ve kremalı', type: 'Sıcak' },
        { id: 'americano', name: 'Americano', desc: 'Espresso + Sıcak Su', type: 'Sıcak' },
        { id: 'cappuccino', name: 'Cappuccino', desc: 'Bol süt köpüklü espresso', type: 'Sütlü / Sıcak' },
        { id: 'flat-white', name: 'Flat White', desc: 'Pürüzsüz süt dokusu', type: 'Sütlü / Sıcak' },
        { id: 'v60', name: 'V60 Pour Over', desc: 'Berrak filtre kahve', type: 'Demleme / Sıcak' },
        { id: 'cold-brew', name: 'Cold Brew', desc: 'Soğuk suyla uzun demleme', type: 'Soğuk' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>Global <span className="text-accent">Tarifler</span></h2>
            <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '14px' }}>Dünyanın dört bir yanından standartlara uygun kahve tarifleri.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {coffeeTypes.map((coffee) => (
                    <div
                        key={coffee.id}
                        onClick={() => navigate(`/recipes/${coffee.id}`)}
                        className="glass-panel"
                        style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            ':hover': { transform: 'translateY(-2px)' }
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '50%',
                                border: '1px solid var(--color-accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-accent)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {coffee.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '16px', marginBottom: '2px' }}>{coffee.name}</h4>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span className="text-secondary" style={{ fontSize: '12px' }}>{coffee.desc}</span>
                                    <span style={{
                                        fontSize: '10px',
                                        padding: '2px 8px',
                                        backgroundColor: 'var(--color-surface)',
                                        borderRadius: '4px',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {coffee.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-secondary" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recipes;
